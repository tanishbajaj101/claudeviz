import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { VisualizationData, VisualizationInput } from "@algoarena/shared";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load system prompt from docs (relative to backend root)
const PROMPT_PATH = path.join(__dirname, "../../docs", "visualization-agent-prompt.md");
const SYSTEM_PROMPT = fs.readFileSync(PROMPT_PATH, "utf-8");

export interface VisualizationRequest {
  algorithm: string;
  correctAlgorithm?: string;
  testCase: {
    input: string;
    expectedOutput: string;
  };
  highlight: string;
}

/**
 * Generate visualization code using the Visualization Agent
 * Returns tracer code that can be executed in the web worker
 */
export async function generateVisualization(
  request: VisualizationRequest
): Promise<VisualizationData> {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.3,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Build request message
  const requestMessage = JSON.stringify(request, null, 2);

  const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(requestMessage),
  ]);

  const content = typeof response.content === "string" ? response.content : "";

  console.log('=== VISUALIZATION AGENT RESPONSE ===');
  console.log('Response length:', content.length);
  console.log('Preview:', content.substring(0, 800));
  console.log('Ending:', content.substring(Math.max(0, content.length - 300)));

  // Parse response: expect "**Description:** ..." followed by ```javascript code block
  try {
    // Extract description
    const descMatch = content.match(/\*\*Description:\*\*\s*(.+?)(?:\n|$)/);
    if (!descMatch) {
      console.error("No description found in response:", content.substring(0, 200));
      throw new Error("No description found in response");
    }
    const description = descMatch[1].trim();

    // Extract JavaScript code
    const codeMatch = content.match(/```javascript\s*([\s\S]*?)\s*```/);
    if (!codeMatch) {
      console.error("No JavaScript code block found:", content);
      throw new Error("No JavaScript code block found in response");
    }
    const code = codeMatch[1].trim();

    if (!code) {
      throw new Error("JavaScript code block is empty");
    }

    const hasLogTracer = code.includes('new LogTracer(');
    const loggerCallCount = (code.match(/logger\.(println|print|printf)\(/g) || []).length;
    console.log('✓ Code length:', code.length);
    console.log('✓ LogTracer instantiation found:', hasLogTracer);
    console.log('✓ Logger method calls found:', loggerCallCount);

    if (!hasLogTracer) {
      console.warn('⚠️  WARNING: Generated code does NOT contain LogTracer!');
    }
    if (loggerCallCount === 0 && hasLogTracer) {
      console.warn('⚠️  WARNING: LogTracer exists but no logger calls!');
    }

    // Extract inputs (optional)
    let inputs: VisualizationInput[] | undefined;
    const inputsMatch = content.match(/\*\*Inputs:\*\*\s*```json\s*([\s\S]*?)\s*```/);
    if (inputsMatch) {
      try {
        inputs = JSON.parse(inputsMatch[1].trim());
        console.log("✓ Inputs parsed:", inputs);
      } catch (parseError) {
        console.warn("Failed to parse inputs JSON, continuing without inputs:", parseError);
        inputs = undefined;
      }
    }

    // Validate JavaScript syntax by attempting to create a function
    try {
      new Function("INPUTS", code);
      console.log("✓ Visualization code validated successfully");
      console.log(`✓ Description: ${description}`);
    } catch (jsError) {
      console.error("Invalid JavaScript code:", code);
      throw new Error(
        `Generated code has syntax errors: ${
          jsError instanceof Error ? jsError.message : "unknown"
        }`
      );
    }

    // Validate LogTracer presence
    if (!code.includes('new LogTracer')) {
      console.error('❌ Generated code missing LogTracer instantiation');
      throw new Error(
        'Visualization code must include LogTracer for step-by-step explanations. ' +
        'Generated code is incomplete.'
      );
    }

    if (loggerCallCount < 2) {
      console.warn(`⚠️  Only ${loggerCallCount} logger calls found (recommend at least 3 for good explanations)`);
    }

    console.log('✓ LogTracer validation passed');

    return {
      type: "visualization",
      code,
      description,
      inputs,
    };
  } catch (error) {
    console.error("Failed to parse visualization response:", content.substring(0, 500));
    console.error("Error details:", error);
    throw new Error(
      `Visualization agent parsing failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
  }
}
