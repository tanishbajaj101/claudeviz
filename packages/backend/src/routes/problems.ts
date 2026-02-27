/**
 * Problems and submissions routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import {
  getSubmissionsByUserId,
  getSolvedProblemsByUserId,
  createSubmission,
} from '../lib/db.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * GET /api/problems/:id/status
 * Check if authenticated user has solved the problem
 */
router.get('/:id/status', optionalAuth, async (req: Request, res: Response) => {
  const problemId = req.params.id;

  if (!problemId) {
    res.status(400).json({ error: "Problem ID required" });
    return;
  }

  // If not authenticated, return not solved
  if (!req.user) {
    res.json({ solved: false, solved_at: null });
    return;
  }

  const userId = req.user.id;

  try {
    // Find the first accepted submission for this problem
    const submission = await prisma.submission.findFirst({
      where: {
        user_id: userId,
        problem_id: problemId,
        status: "Accepted",
      },
      orderBy: { created_at: "asc" },
      select: { created_at: true },
    });

    if (submission) {
      res.json({
        solved: true,
        solved_at: submission.created_at.toISOString(),
      });
      return;
    }

    res.json({ solved: false, solved_at: null });
  } catch (error) {
    console.error(`[GET /api/problems/${problemId}/status] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/submissions
 * Get all submissions for authenticated user
 */
router.get('/submissions', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const [submissions, solvedProblems] = await Promise.all([
    getSubmissionsByUserId(userId),
    getSolvedProblemsByUserId(userId),
  ]);

  // Convert to UserSubmission format
  const formattedSubmissions = submissions.map((s) => ({
    problemId: s.problem_id,
    timestamp: s.created_at,
    status: s.status,
    time: s.time,
    memory: s.memory,
  }));

  res.json({
    submissions: formattedSubmissions,
    solvedProblems,
  });
});

/**
 * POST /api/submissions
 * Create a new submission
 */
router.post('/submissions', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { problemId, status, time, memory } = req.body;

  if (!problemId || !status) {
    res.status(400).json({ error: "problemId and status are required" });
    return;
  }

  const [submission, solvedProblems] = await Promise.all([
    createSubmission({
      userId,
      problemId,
      status,
      time,
      memory,
    }),
    getSolvedProblemsByUserId(userId),
  ]);

  res.json({
    submission,
    solvedProblems,
  });
});

export default router;
