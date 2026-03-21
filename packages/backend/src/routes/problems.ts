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
import { importedProblems } from '../data/problems/all_problems.js';
import { calculateXP, awardXP } from '../lib/xp.js';
import { isProblemBounty } from '../lib/bounty.js';

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

  console.log(`[POST /api/submissions] User ${userId} submitted problem ${problemId} with status: ${status}`);

  const [submission, solvedProblems] = await Promise.all([
    createSubmission({ userId, problemId, status, time, memory }),
    getSolvedProblemsByUserId(userId),
  ]);

  // Award XP on first accepted solve
  let xp_awarded: number | null = null;
  if (status === 'Accepted') {
    const priorAccepted = await prisma.submission.findFirst({
      where: { user_id: userId, problem_id: problemId, status: 'Accepted' },
      orderBy: { created_at: 'asc' },
      select: { id: true, created_at: true },
    });
    // priorAccepted will be the submission we just created, so check count > 1
    const acceptedCount = await prisma.submission.count({
      where: { user_id: userId, problem_id: problemId, status: 'Accepted' },
    });
    const isFirstSolve = acceptedCount === 1;

    if (isFirstSolve) {
      const problem = importedProblems.find((p) => p.id === problemId);
      if (problem) {
        const difficulty = problem.difficulty as 'Easy' | 'Medium' | 'Hard';
        const isBounty = isProblemBounty(problemId);
        const xp = calculateXP(difficulty, isBounty);
        try {
          await awardXP(userId, xp);
          xp_awarded = xp;
          console.log(`[POST /api/submissions] Awarded ${xp} XP to user ${userId} for ${problemId}${isBounty ? ' (bounty)' : ''}`);
        } catch (err) {
          console.error(`[POST /api/submissions] Failed to award XP:`, err);
        }
      }
    }
  }

  console.log(`[POST /api/submissions] Created submission ${submission.id}. User now has ${solvedProblems.length} solved problems`);

  res.json({
    submission,
    solvedProblems,
    xp_awarded,
  });
});

export default router;
