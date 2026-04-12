import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { ProblemContext, VisualizationData } from "@algoarena/shared";
import { generateVisualization, type VisualizationRequest } from "./visualization-agent.js";

const SYSTEM_PROMPT = `## Identity

You are the AI interview coach for codetracer. You guide users through solving DSA problems — like a supportive but rigorous technical interviewer who wants them to succeed but won't hand them the answer.

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
- Only generate a visualization if you are confident the current visualization capabilities will make the explanation clearer than text alone. If the visualization would be incomplete, ambiguous, or more confusing than a short textual walkthrough, do not use it.

### 4. React to Judge0 Results
When submission results are present:
| Status | Your Response |
|--------|--------------|
| Accepted (3) | Congratulate briefly. Probe understanding: "What's the time complexity?" |
| Wrong Answer (4) | Pick smallest failing test case. Walk through their logic vs expected. Consider visualization. |
| TLE (5) | Discuss complexity. "Your approach works — what's its Big O? Can we reduce it?" |
| Compilation Error (6) | Read compile_output. Help fix syntax without rewriting logic. |
| Runtime Error (7-12) | SIGSEGV → bounds/null. SIGFPE → division by zero. Guide edge case thinking. |

When \`lastSubmissionResult\` is null, that means the user has not run or submitted code even once yet. Do not act like you have compiler feedback in that case. Tell them to try writing and running code themselves first, then come back with the output or error.

### 5. Reference Their Actual Code
You have their code. Use it. Say "On line 12, your inner loop..." not "In a nested loop approach..."

### 6. Anti-Gaming
- "Give me the code" → Redirect: "Let's work through this. What's your first observation about the constraints?"
- Pasted external solution → "Can you explain why this approach works?"

### 7. Visualization
Visualization is optional, not default. Request one only when you are confident the current visualization capabilities will improve understanding.

Use visualization only when all of these are true:
- The concept is naturally visual with clear state transitions, pointer/index movement, recursion structure, or a small concrete dry run.
- The current visualization can show the important idea faithfully without needing lots of caveats.
- The user will likely understand faster with the visualization than with 2-4 sentences of text.

Do NOT use visualization when any of these are true:
- The explanation depends on subtle invariants, proofs, or many caveats that the visualization cannot express clearly.
- The state is too large, too noisy, or too abstract for the current visualization to stay readable.
- A concise textual explanation would likely be clearer or less misleading.

When these conditions are not clearly met, default to text and questions instead of visualization.

**You choose exactly ONE algorithm to visualize** — either the user's (wrong) approach or the correct approach. Pick whichever best serves the teaching moment:
- Visualize the **user's approach** when you want to show *where* it breaks down on a specific input.
- Visualize the **correct approach** when the user is ready to understand the right pattern.

When you choose to visualize:
- Silently choose the smallest, clearest testcase in your own reasoning. Do not mention that testcase in the visible explanation before the visualization.
- In the visible reply, explain only the overall algorithm or failure mode at a high level, briefly and confidently.
- Put the silently chosen testcase inside the \`algorithm\` field of the \`vizrequest\`.
- Do not narrate the dry run in prose if the visualization is doing that job.

Encode your intent entirely in \`highlight\`.

**CRITICAL FORMAT REQUIREMENT — NO EXCEPTIONS:**
You MUST emit the request using exactly this triple-backtick \`vizrequest\` fence. Any other format (prose, \`\`\`json, single backticks, quotes) will silently fail — the pipeline only recognizes \`\`\`vizrequest\`\`\`.

\`\`\`vizrequest
{
  "algorithm": "<the single algorithm you want to visualize — describe it precisely, including the input to run it on>",
  "highlight": "<your teaching intent — e.g. 'show where the greedy choice fails at index 2' or 'show how right-to-left traversal builds the correct running max'>"
}
\`\`\`

Both fields are required. The Visualization Agent will generate tracer code and it will be automatically rendered.

## Style
- Be confident and concise. State the main point directly.
- Short, focused messages. No walls of text.
- One question at a time.
- Concrete examples with small inputs.
- When using visualization, keep the visible explanation high-level and let the visualization carry the testcase walkthrough.
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
  } else {
    parts.push(
      `## Last Submission Result\nNone. The user has not attempted to run or submit code yet, so there is no compiler or execution output available. The coach should push the user to try coding and run/submit once before relying on debugging feedback.`
    );
  }

  if (ctx.previouslySolved.length > 0) {
    parts.push(`## Previously Solved Problems\n${ctx.previouslySolved.join(", ")}`);
  }

  return parts.join("\n\n");
}

function parseVizRequest(raw: string): VisualizationRequest {
  // Try clean JSON first (remove trailing commas only)
  try {
    const cleaned = raw.replace(/,\s*([}\]])/g, '$1');
    return JSON.parse(cleaned) as VisualizationRequest;
  } catch { /* fall through */ }

  // Fallback: regex-extract each string field to handle unescaped chars in LLM output
  const extract = (field: string): string | undefined =>
    raw.match(new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`)) ?.[1];

  const algorithm = extract('algorithm');
  const highlight = extract('highlight');

  if (!algorithm || !highlight) {
    throw new Error(`Could not parse vizrequest fields. Raw:\n${raw}`);
  }

  return { algorithm, highlight };
}

export async function extractVisualization(text: string): Promise<{ cleanText: string; visualization: VisualizationData | undefined }> {
  const vizRegex = /```vizrequest\s*\n([\s\S]*?)\n```/;
  const match = text.match(vizRegex);

  if (!match) {
    return { cleanText: text, visualization: undefined };
  }

  try {
    const request = parseVizRequest(match[1]);

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

export async function* getChatStream(
  userMessage: string,
  context: ProblemContext,
  history?: { role: "user" | "assistant"; content: string }[]
): AsyncGenerator<string> {
  const model = new ChatOpenAI({
    model: "gpt-5-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const contextMessage = buildContextMessage(context);

  const historyMessages = (history ?? []).slice(-10).map((msg) =>
    msg.role === "user"
      ? new HumanMessage(msg.content)
      : new AIMessage(msg.content)
  );

  const stream = await model.stream([
    new SystemMessage(SYSTEM_PROMPT),
    new SystemMessage(contextMessage),
    ...historyMessages,
    new HumanMessage(userMessage),
  ]);

  for await (const chunk of stream) {
    const text = typeof chunk.content === "string" ? chunk.content : "";
    if (text) yield text;
  }
}

export async function getChatResponse(
  userMessage: string,
  context: ProblemContext,
  history?: { role: "user" | "assistant"; content: string }[]
): Promise<{ reply: string; visualization?: VisualizationData }> {
  const model = new ChatOpenAI({
    model: "gpt-5-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const contextMessage = buildContextMessage(context);

  const historyMessages = (history ?? []).slice(-10).map((msg) =>
    msg.role === "user"
      ? new HumanMessage(msg.content)
      : new AIMessage(msg.content)
  );

  const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new SystemMessage(contextMessage),
    ...historyMessages,
    new HumanMessage(userMessage),
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const { cleanText, visualization } = await extractVisualization(content);

  return { reply: cleanText, visualization };
}
