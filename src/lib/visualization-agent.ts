import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { VisualizationData, VisualizationInput } from "@/types";
import fs from "fs";
import path from "path";

// Load system prompt from docs
const PROMPT_PATH = path.join(process.cwd(), "docs", "visualization-agent-prompt.md");
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
    // Code now references INPUTS, so pass it as a parameter
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
