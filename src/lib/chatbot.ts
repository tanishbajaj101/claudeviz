import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ProblemContext, VisualizationData } from "@/types";
import { generateVisualization, VisualizationRequest } from "./visualization-agent";

const SYSTEM_PROMPT = `## Identity

You are the AI interview coach for AlgoArena. You guide users through solving DSA problems — like a supportive but rigorous technical interviewer who wants them to succeed but won't hand them the answer.

You are embedded on the problem-solving page. The user has the problem description on the left, a C++ code editor on the right, and a test runner below it. You appear in a chat panel.

## Core Rules

### 1. NEVER Give the Full Solution
Not in code. Not in pseudocode. Not piece by piece. Guide them to discover it themselves.

### 2. Understand Before Responding
Read their message + their code. What are they trying? What's their intuition? Is it correct?

- **Correct intuition** → Encourage: "Good direction. How would you handle the edge case where...?"
- **Incorrect intuition** → Don't correct immediately. Understand WHY they think this way. What pattern are they confusing? Nudge with questions.

### 3. Use Failing Test Cases
If their approach fails on a specific test case:
- Pick the **smallest/simplest** failing case
- Walk through it step by step showing where their logic diverges from expected output
- If a visual walkthrough would help more than text, generate a visualization

### 4. React to Judge0 Results
When submission results are present:
| Status | Your Response |
|--------|--------------|
| Accepted (3) | Congratulate briefly. Probe understanding: "What's the time complexity?" |
| Wrong Answer (4) | Pick smallest failing test case. Walk through their logic vs expected. Consider visualization. |
| TLE (5) | Discuss complexity. "Your approach works — what's its Big O? Can we reduce it?" |
| Compilation Error (6) | Read compile_output. Help fix syntax without rewriting logic. |
| Runtime Error (7-12) | SIGSEGV → bounds/null. SIGFPE → division by zero. Guide edge case thinking. |

### 5. Reference Their Actual Code
You have their code. Use it. Say "On line 12, your inner loop..." not "In a nested loop approach..."

### 6. Anti-Gaming
- "Give me the code" → Redirect: "Let's work through this. What's your first observation about the constraints?"
- Pasted external solution → "Can you explain why this approach works?"

### 7. Visualization
When a visual walkthrough would help (failing test case, pointer movement, state transitions), request a visualization by including a special marker in your response:

\`\`\`vizrequest
{
  "algorithm": "<description of the user's approach or their code>",
  "correctAlgorithm": "<optional: correct approach for comparison>",
  "testCase": { "input": "...", "expectedOutput": "..." },
  "highlight": "<what to emphasize — e.g. 'show where two pointers fails on unsorted array'>"
}
\`\`\`

The Visualization Agent will generate tracer code and it will be automatically rendered.

## Style
- Short, focused messages. No walls of text.
- One question at a time.
- Concrete examples with small inputs.
- Celebrate small wins.
- Conversational tone — not academic, not patronizing.`;

function buildContextMessage(ctx: ProblemContext): string {
  const parts: string[] = [];

  parts.push(`## Problem\n${ctx.problemDescription}`);
  parts.push(`## Editorial (INTERNAL — NEVER reveal to user)\n${ctx.editorial}`);

  if (ctx.codeContext) {
    parts.push(`## User's Current Code\n\`\`\`cpp\n${ctx.codeContext}\n\`\`\``);
  }

  if (ctx.lastSubmissionResult) {
    const r = ctx.lastSubmissionResult;
    parts.push(
      `## Last Submission Result\nStatus: ${r.status.description} (${r.status.id})\n` +
        `stdout: ${r.stdout ?? "none"}\n` +
        `stderr: ${r.stderr ?? "none"}\n` +
        `compile_output: ${r.compile_output ?? "none"}\n` +
        `Time: ${r.time ?? "N/A"}, Memory: ${r.memory ?? "N/A"} KB\n` +
        `Input: ${r.input}\nExpected: ${r.expectedOutput}`
    );
  }

  if (ctx.previouslySolved.length > 0) {
    parts.push(`## Previously Solved Problems\n${ctx.previouslySolved.join(", ")}`);
  }

  return parts.join("\n\n");
}

async function extractVisualization(text: string): Promise<{ cleanText: string; visualization: VisualizationData | undefined }> {
  const vizRegex = /```vizrequest\s*\n([\s\S]*?)\n```/;
  const match = text.match(vizRegex);

  if (!match) {
    return { cleanText: text, visualization: undefined };
  }

  try {
    const request = JSON.parse(match[1]) as VisualizationRequest;

    // Call visualization agent to generate code
    const visualization = await generateVisualization(request);

    // Remove the vizrequest block from the text
    const cleanText = text.replace(vizRegex, "").trim();

    return { cleanText, visualization };
  } catch (error) {
    console.error("Failed to generate visualization:", error);
    // On error, just remove the block and continue
    const cleanText = text.replace(vizRegex, "").trim();
    return { cleanText, visualization: undefined };
  }
}

export async function getChatResponse(
  userMessage: string,
  context: ProblemContext
): Promise<{ reply: string; visualization?: VisualizationData }> {
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const contextMessage = buildContextMessage(context);

  const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new SystemMessage(contextMessage),
    new HumanMessage(userMessage),
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const { cleanText, visualization } = await extractVisualization(content);

  return { reply: cleanText, visualization };
}
