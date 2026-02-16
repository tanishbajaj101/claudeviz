import { NextRequest, NextResponse } from "next/server";
import { submitCode } from "@/lib/judge0";
import { JudgeRequest, JudgeResponse, SubmissionResult } from "@/types";

export async function POST(request: NextRequest): Promise<NextResponse<JudgeResponse | { error: string }>> {
  try {
    const body = (await request.json()) as JudgeRequest;
    const { sourceCode, languageId, testCases, judge0Limits } = body;

    if (!sourceCode || !testCases || testCases.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: sourceCode, testCases" },
        { status: 400 }
      );
    }

    const results: SubmissionResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const judge0Result = await submitCode({
        sourceCode,
        languageId,
        stdin: tc.input,
        expectedOutput: tc.expectedOutput,
        limits: judge0Limits,
      });

      const passed =
        judge0Result.status.id === 3 &&
        (judge0Result.stdout?.trim() ?? "") === tc.expectedOutput.trim();

      results.push({
        testCaseIndex: i,
        status: judge0Result.status,
        stdout: judge0Result.stdout,
        stderr: judge0Result.stderr,
        compile_output: judge0Result.compile_output,
        time: judge0Result.time,
        memory: judge0Result.memory,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        passed,
      });

      // Stop on compilation error — same error for all cases
      if (judge0Result.status.id === 6) {
        break;
      }
    }

    const allPassed = results.every((r) => r.passed);

    return NextResponse.json({ results, allPassed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
