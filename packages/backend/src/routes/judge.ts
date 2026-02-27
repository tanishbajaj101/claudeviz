/**
 * Judge0 proxy routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { submitCode } from '../lib/judge0.js';
import type { JudgeRequest, JudgeResponse, SubmissionResult } from '@algoarena/shared';

const router = Router();

/**
 * POST /api/judge
 * Run code against test cases using Judge0
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as JudgeRequest;
    const { sourceCode, languageId, testCases, judge0Limits } = body;

    if (!sourceCode || !testCases || testCases.length === 0) {
      res.status(400).json({ error: "Missing required fields: sourceCode, testCases" });
      return;
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

    res.json({ results, allPassed } as JudgeResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
