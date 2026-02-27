/**
 * Contests routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { getContestStatus, calculateContestScore, getContestEndTime, getContestRemainingMs } from '../lib/contest-status.js';
import { selectRandomProblems, sendContestInvites, buildContestLeaderboard, type ProblemSlotSpec } from '../lib/contest-helpers.js';
import { submitCode } from '../lib/judge0.js';
import { problems as allProblems } from '../data/problems.js';
import type { Prisma } from '@prisma/client';
import { emitContestInviteNotifications } from '../socket/notification-helpers.js';
import { getContestsNamespace } from '../socket/index.js';
import { roomNames } from '../socket/rooms.js';

const router = Router();

// ---------------------------------------------------------------------------
// Helper function for broadcasting to contest rooms
// ---------------------------------------------------------------------------

function broadcastToContestRoom(contestId: string, event: string, data: any): void {
  try {
    const nsp = getContestsNamespace();
    nsp.to(roomNames.contest(contestId)).emit(event, data);
    console.log(`[contests] broadcast "${event}" to contest ${contestId}`);
  } catch (err) {
    console.warn('[contests] broadcastToContestRoom skipped (Socket.IO not running):', err);
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * GET /api/contests
 * List all public contests (sorted newest first)
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const contests = await prisma.contest.findMany({
      where: { is_public: true },
      orderBy: { created_at: "desc" },
      include: {
        creator: { select: { id: true, username: true } },
        _count: { select: { participants: true } },
      },
    });

    const formatted = contests.map((c) => ({
      id: c.id,
      title: c.title,
      creator: { id: c.creator.id, username: c.creator.username },
      starts_at: c.starts_at.toISOString(),
      duration_minutes: c.duration_minutes,
      is_public: c.is_public,
      status: getContestStatus(c.starts_at, c.duration_minutes),
      participant_count: c._count.participants,
    }));

    res.json({ contests: formatted });
  } catch (error) {
    console.error("[GET /api/contests] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/contests/public
 * Legacy alias for GET /api/contests
 */
router.get('/public', async (_req: Request, res: Response) => {
  try {
    const contests = await prisma.contest.findMany({
      where: { is_public: true },
      orderBy: { created_at: "desc" },
      include: {
        creator: { select: { id: true, username: true } },
        _count: { select: { participants: true } },
      },
    });

    const formatted = contests.map((c) => ({
      id: c.id,
      title: c.title,
      creator: { id: c.creator.id, username: c.creator.username },
      starts_at: c.starts_at.toISOString(),
      duration_minutes: c.duration_minutes,
      is_public: c.is_public,
      status: getContestStatus(c.starts_at, c.duration_minutes),
      participant_count: c._count.participants,
    }));

    res.json({ contests: formatted });
  } catch (error) {
    console.error("[GET /api/contests/public] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/contests/me
 * List contests the authenticated user is participating in
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const participations = await prisma.contestParticipant.findMany({
      where: { user_id: userId },
      orderBy: { contest: { starts_at: "desc" } },
      include: {
        contest: {
          include: {
            creator: { select: { id: true, username: true } },
            _count: { select: { participants: true } },
          },
        },
      },
    });

    const contests = participations.map((p) => ({
      id: p.contest.id,
      title: p.contest.title,
      creator: {
        id: p.contest.creator.id,
        username: p.contest.creator.username,
      },
      starts_at: p.contest.starts_at.toISOString(),
      duration_minutes: p.contest.duration_minutes,
      is_public: p.contest.is_public,
      status: getContestStatus(p.contest.starts_at, p.contest.duration_minutes),
      participant_count: p.contest._count.participants,
      my_score: p.total_score,
    }));

    res.json({ contests });
  } catch (error) {
    console.error("[GET /api/contests/me] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/contests/mine
 * Legacy alias for /api/contests/me
 */
router.get('/mine', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const participations = await prisma.contestParticipant.findMany({
      where: { user_id: userId },
      orderBy: { contest: { starts_at: "desc" } },
      include: {
        contest: {
          include: {
            creator: { select: { id: true, username: true } },
            _count: { select: { participants: true } },
          },
        },
      },
    });

    const contests = participations.map((p) => ({
      id: p.contest.id,
      title: p.contest.title,
      creator: {
        id: p.contest.creator.id,
        username: p.contest.creator.username,
      },
      starts_at: p.contest.starts_at.toISOString(),
      duration_minutes: p.contest.duration_minutes,
      is_public: p.contest.is_public,
      status: getContestStatus(p.contest.starts_at, p.contest.duration_minutes),
      participant_count: p.contest._count.participants,
      my_score: p.total_score,
    }));

    res.json({ contests });
  } catch (error) {
    console.error("[GET /api/contests/mine] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/contests
 * Create a new contest
 */
interface ProblemSlotInput {
  difficulty: unknown;
  topics: unknown;
}

interface CreateContestBody {
  title: unknown;
  is_public: unknown;
  starts_at: unknown;
  duration_minutes: unknown;
  problems: unknown;
  invited_user_ids?: unknown;
}

const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

router.post('/', authenticate, async (req: Request, res: Response) => {
  const creatorId = req.user!.id;
  const creatorName = req.user!.username ?? req.user!.name ?? "Unknown";

  const body = req.body as CreateContestBody;
  const { title, is_public, starts_at, duration_minutes, problems: problemSlots, invited_user_ids } = body;

  // --- Validate title ---
  if (typeof title !== "string" || title.trim().length === 0) {
    res.status(400).json({ error: "title is required and must be a non-empty string" });
    return;
  }

  // --- Validate starts_at ---
  if (typeof starts_at !== "string") {
    res.status(400).json({ error: "starts_at is required and must be an ISO 8601 datetime string" });
    return;
  }
  const startsAtDate = new Date(starts_at);
  if (isNaN(startsAtDate.getTime())) {
    res.status(400).json({ error: "starts_at is not a valid ISO 8601 datetime" });
    return;
  }
  if (startsAtDate <= new Date()) {
    res.status(400).json({ error: "starts_at must be in the future" });
    return;
  }

  // --- Validate duration_minutes ---
  if (
    typeof duration_minutes !== "number" ||
    !Number.isInteger(duration_minutes) ||
    duration_minutes <= 0
  ) {
    res.status(400).json({ error: "duration_minutes must be a positive integer" });
    return;
  }

  // --- Validate problem slots ---
  if (!Array.isArray(problemSlots)) {
    res.status(400).json({ error: "problems must be an array" });
    return;
  }
  if (problemSlots.length < 2 || problemSlots.length > 5) {
    res.status(400).json({ error: "problems array must contain between 2 and 5 items" });
    return;
  }

  const validatedSlots: ProblemSlotSpec[] = [];
  for (let i = 0; i < problemSlots.length; i++) {
    const slot = problemSlots[i] as ProblemSlotInput;
    if (!slot || typeof slot !== "object") {
      res.status(400).json({ error: `problems[${i}] must be an object with difficulty and topics` });
      return;
    }

    const { difficulty, topics } = slot;

    if (typeof difficulty !== "string" || !VALID_DIFFICULTIES.has(difficulty)) {
      res.status(400).json({
        error: `problems[${i}].difficulty must be one of: easy, medium, hard`,
      });
      return;
    }

    if (!Array.isArray(topics) || topics.length === 0) {
      res.status(400).json({
        error: `problems[${i}].topics must be a non-empty array of topic strings`,
      });
      return;
    }
    if (!topics.every((t) => typeof t === "string" && t.trim().length > 0)) {
      res.status(400).json({ error: `problems[${i}].topics must only contain non-empty strings` });
      return;
    }

    validatedSlots.push({
      difficulty: difficulty as "easy" | "medium" | "hard",
      topics: topics as string[],
    });
  }

  // --- Validate invited_user_ids (optional) ---
  let invitedUserIds: number[] = [];
  if (invited_user_ids !== undefined) {
    if (!Array.isArray(invited_user_ids)) {
      res.status(400).json({ error: "invited_user_ids must be an array" });
      return;
    }
    if (!invited_user_ids.every((id) => typeof id === "number" && Number.isInteger(id))) {
      res.status(400).json({ error: "invited_user_ids must be an array of integer user IDs" });
      return;
    }
    invitedUserIds = invited_user_ids as number[];

    // Verify each invited user is a friend of the creator
    if (invitedUserIds.length > 0) {
      const friendships = await prisma.friendRequest.findMany({
        where: {
          status: "accepted",
          OR: [
            { sender_id: creatorId, receiver_id: { in: invitedUserIds } },
            { receiver_id: creatorId, sender_id: { in: invitedUserIds } },
          ],
        },
      });

      const friendIds = new Set(
        friendships.flatMap((f) => [f.sender_id, f.receiver_id]).filter((id) => id !== creatorId)
      );

      const nonFriends = invitedUserIds.filter((id) => !friendIds.has(id));
      if (nonFriends.length > 0) {
        res.status(400).json({
          error: `The following invited users are not friends with you: [${nonFriends.join(", ")}]`,
        });
        return;
      }
    }
  }

  // --- Select random problems ---
  let selectedProblems: Awaited<ReturnType<typeof selectRandomProblems>>;
  try {
    selectedProblems = selectRandomProblems(validatedSlots);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Problem selection failed";
    res.status(400).json({ error: message });
    return;
  }

  // --- Create contest in a transaction ---
  try {
    const contest = await prisma.$transaction(async (tx) => {
      // 1. Create the contest
      const newContest = await tx.contest.create({
        data: {
          title: title.trim(),
          creator_id: creatorId,
          is_public: typeof is_public === "boolean" ? is_public : false,
          starts_at: startsAtDate,
          duration_minutes,
        },
      });

      // 2. Create ContestProblem records
      await tx.contestProblem.createMany({
        data: selectedProblems.map((sp) => ({
          contest_id: newContest.id,
          problem_id: sp.problem.id,
          order: sp.order,
          difficulty: sp.difficulty,
        })),
      });

      // 3. Add creator as participant
      await tx.contestParticipant.create({
        data: {
          contest_id: newContest.id,
          user_id: creatorId,
          total_score: 0,
        },
      });

      // 4. Create contest conversation with creator as first participant
      await tx.conversation.create({
        data: {
          type: "contest",
          contest_id: newContest.id,
          participants: {
            create: { user_id: creatorId },
          },
        },
      });

      return newContest;
    });

    // 5. Send notifications to invited users (outside transaction — non-critical)
    if (invitedUserIds.length > 0) {
      try {
        const inviteNotifications = await sendContestInvites(
          contest.id,
          contest.title,
          startsAtDate,
          invitedUserIds,
          creatorName
        );
        // Emit real-time notification events to invited users
        emitContestInviteNotifications(inviteNotifications);
      } catch (inviteErr) {
        // Log but do not fail the whole request
        console.error("[POST /api/contests] Failed to send invites:", inviteErr);
      }
    }

    res.status(201).json({
      success: true,
      contest: {
        id: contest.id,
        title: contest.title,
        starts_at: contest.starts_at.toISOString(),
        duration_minutes: contest.duration_minutes,
        is_public: contest.is_public,
        status: getContestStatus(contest.starts_at, contest.duration_minutes),
        participant_count: 1,
      },
    });
  } catch (error) {
    console.error("[POST /api/contests] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/contests/:id
 * Get contest details with conditional problem visibility
 */
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  const userId = req.user?.id ?? null;
  const contestId = req.params.id;

  if (!contestId) {
    res.status(400).json({ error: "Invalid contest ID" });
    return;
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        creator: { select: { id: true, username: true } },
        participants: {
          include: { user: { select: { id: true, username: true } } },
        },
        problems: {
          orderBy: { order: "asc" },
        },
        conversations: {
          where: { type: "contest" },
          take: 1,
          select: { id: true },
        },
      },
    });

    if (!contest) {
      res.status(404).json({ error: "Contest not found" });
      return;
    }

    const status = getContestStatus(contest.starts_at, contest.duration_minutes);
    const isParticipant = userId !== null
      ? contest.participants.some((p) => p.user_id === userId)
      : false;

    // Build problems array only for active/completed contests
    let problemsData: Array<{
      order: number;
      difficulty: string;
      problem: {
        id: string;
        title: string;
        description: string;
        constraints: string[];
        testCases: Array<{ input: string; expectedOutput: string }>;
      };
    }> | undefined = undefined;

    if (status === "active" || status === "completed") {
      problemsData = contest.problems.map((cp) => {
        const problemDetail = allProblems.find((p) => p.id === cp.problem_id);
        return {
          order: cp.order,
          difficulty: cp.difficulty,
          problem: problemDetail
            ? {
                id: problemDetail.id,
                title: problemDetail.title,
                description: problemDetail.description,
                constraints: problemDetail.constraints,
                testCases: problemDetail.testCases,
              }
            : {
                id: cp.problem_id,
                title: "Unknown Problem",
                description: "",
                constraints: [],
                testCases: [],
              },
        };
      });
    }

    res.json({
      contest: {
        id: contest.id,
        title: contest.title,
        creator: {
          id: contest.creator.id,
          username: contest.creator.username,
        },
        starts_at: contest.starts_at.toISOString(),
        duration_minutes: contest.duration_minutes,
        is_public: contest.is_public,
        status,
        participant_count: contest.participants.length,
        participants: contest.participants.map((p) => p.user.username),
        is_participant: isParticipant,
        conversation_id: contest.conversations[0]?.id,
        ...(problemsData !== undefined ? { problems: problemsData } : {}),
      },
    });
  } catch (error) {
    console.error(`[GET /api/contests/${contestId}] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/contests/:id/join
 * Join a contest
 */
router.post('/:id/join', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const contestId = req.params.id;

  if (!contestId) {
    res.status(400).json({ error: "Invalid contest ID" });
    return;
  }

  try {
    // --- Fetch contest ---
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        participants: { select: { user_id: true } },
        conversations: { select: { id: true } },
      },
    });

    if (!contest) {
      res.status(404).json({ error: "Contest not found" });
      return;
    }

    // --- Status check ---
    const status = getContestStatus(contest.starts_at, contest.duration_minutes);
    if (status !== "upcoming") {
      res.status(400).json({
        error: `Cannot join a contest that has already ${status === "active" ? "started" : "ended"}`,
      });
      return;
    }

    // --- Duplicate participant check ---
    const alreadyParticipating = contest.participants.some(
      (p) => p.user_id === userId
    );
    if (alreadyParticipating) {
      res.status(400).json({ error: "You are already a participant in this contest" });
      return;
    }

    // --- Private contest: require invite notification ---
    if (!contest.is_public) {
      const invite = await prisma.notification.findFirst({
        where: {
          user_id: userId,
          type: "contest_invite",
        },
      });

      // Parse the JSON data field to check contest_id
      const hasValidInvite =
        invite !== null &&
        (() => {
          try {
            const data = JSON.parse(invite.data) as { contest_id?: string };
            return data.contest_id === contestId;
          } catch {
            return false;
          }
        })();

      if (!hasValidInvite) {
        res.status(403).json({
          error: "This is a private contest. You must be invited to join.",
        });
        return;
      }
    }

    // --- Find the contest's conversation ---
    const conversationId =
      contest.conversations.length > 0 ? contest.conversations[0].id : null;

    // --- Add user as participant + conversation member in a transaction ---
    await prisma.$transaction(async (tx) => {
      // Add to contest participants
      await tx.contestParticipant.create({
        data: {
          contest_id: contestId,
          user_id: userId,
          total_score: 0,
        },
      });

      // Add to contest conversation if it exists
      if (conversationId) {
        await tx.conversationParticipant.create({
          data: {
            conversation_id: conversationId,
            user_id: userId,
          },
        });
      }
    });

    res.json({
      success: true,
      message: "Successfully joined contest",
    });
  } catch (error) {
    console.error(`[POST /api/contests/${contestId}/join] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/contests/:id/submit
 * Submit a contest problem solution
 */
router.post('/:id/submit', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const username = req.user!.username ?? "unknown";
  const contestId = req.params.id;

  if (!contestId) {
    res.status(400).json({ error: "Invalid contest ID" });
    return;
  }

  const { problem_id, code } = req.body;

  if (typeof problem_id !== "string" || problem_id.trim().length === 0) {
    res.status(400).json({ error: "problem_id is required and must be a non-empty string" });
    return;
  }
  if (typeof code !== "string" || code.trim().length === 0) {
    res.status(400).json({ error: "code is required and must be a non-empty string" });
    return;
  }

  const problemId = problem_id.trim();

  try {
    // Fetch contest with problems and participants
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        problems: true,
        participants: { select: { user_id: true } },
      },
    });

    if (!contest) {
      res.status(404).json({ error: "Contest not found" });
      return;
    }

    // Contest must be active
    const status = getContestStatus(contest.starts_at, contest.duration_minutes);
    if (status !== "active") {
      res.status(400).json({
        error:
          status === "upcoming"
            ? "Contest has not started yet"
            : "Contest has ended",
      });
      return;
    }

    // User must be a participant
    const isParticipant = contest.participants.some((p) => p.user_id === userId);
    if (!isParticipant) {
      res.status(403).json({ error: "You are not a participant in this contest" });
      return;
    }

    // Problem must belong to this contest
    const contestProblem = contest.problems.find(
      (cp) => cp.problem_id === problemId
    );
    if (!contestProblem) {
      res.status(400).json({ error: "Problem is not part of this contest" });
      return;
    }

    // Fetch full problem data (test cases + Judge0 limits)
    const problemData = allProblems.find((p) => p.id === problemId);
    if (!problemData) {
      res.status(500).json({ error: "Problem data not found in problem pool" });
      return;
    }

    // ------------------------------------------------------------------
    // Run all test cases through Judge0
    // ------------------------------------------------------------------
    const testCases = problemData.testCases;
    let judgeStatusId = 3; // Accepted
    let judgeStatusDescription = "Accepted";
    let allPassed = true;

    for (const tc of testCases) {
      let result;
      try {
        result = await submitCode({
          sourceCode: code,
          languageId: 54, // C++ GCC 9.2.0
          stdin: tc.input,
          expectedOutput: tc.expectedOutput,
          limits: problemData.judge0Limits,
        });
      } catch (err) {
        console.error(
          `[submit] Judge0 error for contest ${contestId} problem ${problemId}:`,
          err
        );
        res.status(503).json({ error: "Code execution service unavailable" });
        return;
      }

      // Any non-Accepted status terminates evaluation early
      if (result.status.id !== 3) {
        allPassed = false;
        judgeStatusId = result.status.id;
        judgeStatusDescription = result.status.description;
        break;
      }

      // Accepted status but output mismatch → Wrong Answer
      const actualOutput = result.stdout?.trim() ?? "";
      const expectedOutput = tc.expectedOutput.trim();
      if (actualOutput !== expectedOutput) {
        allPassed = false;
        judgeStatusId = 4; // Wrong Answer
        judgeStatusDescription = "Wrong Answer";
        break;
      }
    }

    const isCorrect = allPassed && judgeStatusId === 3;
    const difficulty = contestProblem.difficulty as "easy" | "medium" | "hard";
    const score = calculateContestScore(difficulty, isCorrect);

    // ------------------------------------------------------------------
    // Record submission and recalculate total_score in a transaction
    // ------------------------------------------------------------------
    const submittedAt = new Date();

    const submission = await prisma.$transaction(async (tx) => {
      // Create submission record
      const newSubmission = await tx.contestSubmission.create({
        data: {
          contest_id: contestId,
          user_id: userId,
          problem_id: problemId,
          is_correct: isCorrect,
          score,
          submitted_at: submittedAt,
        },
      });

      // Recalculate total_score: sum of best score per problem
      const bestScores = await tx.contestSubmission.groupBy({
        by: ["problem_id"],
        where: {
          contest_id: contestId,
          user_id: userId,
        },
        _max: { score: true },
      });

      const totalScore = bestScores.reduce(
        (sum, entry) => sum + (entry._max.score ?? 0),
        0
      );

      await tx.contestParticipant.update({
        where: {
          contest_id_user_id: { contest_id: contestId, user_id: userId },
        },
        data: { total_score: totalScore },
      });

      return newSubmission;
    });

    // ------------------------------------------------------------------
    // Compute leaderboard rank for the response
    // ------------------------------------------------------------------
    const leaderboard = await buildContestLeaderboard(contestId);
    const userRank =
      leaderboard.findIndex((row) => row.user_id === userId) + 1;
    const totalScore =
      leaderboard.find((row) => row.user_id === userId)?.total_score ?? score;

    // ------------------------------------------------------------------
    // Broadcast Socket.IO events (best-effort, stub for now)
    // ------------------------------------------------------------------
    try {
      broadcastToContestRoom(contestId, "leaderboard:update", {
        contestId,
        leaderboard,
      });

      broadcastToContestRoom(contestId, "submission:new", {
        submission: {
          contestId,
          userId,
          username,
          problemId,
          isCorrect,
          score,
          submittedAt: submission.submitted_at.toISOString(),
        },
      });
    } catch (err) {
      console.warn("[submit] Socket.IO broadcast stub - will work after Task #6:", err);
    }

    res.json({
      submission: {
        id: submission.id,
        contest_id: submission.contest_id,
        problem_id: submission.problem_id,
        is_correct: submission.is_correct,
        score: submission.score,
        status: judgeStatusDescription,
        submitted_at: submission.submitted_at.toISOString(),
      },
      total_score: totalScore,
      leaderboard_rank: userRank,
    });
  } catch (error) {
    console.error(`[POST /api/contests/${contestId}/submit] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/contests/:id/leaderboard
 * Get contest leaderboard
 */
router.get('/:id/leaderboard', async (req: Request, res: Response) => {
  const contestId = req.params.id;

  if (!contestId) {
    res.status(400).json({ error: "Invalid contest ID" });
    return;
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      select: {
        id: true,
        starts_at: true,
        duration_minutes: true,
      },
    });

    if (!contest) {
      res.status(404).json({ error: "Contest not found" });
      return;
    }

    const status = getContestStatus(contest.starts_at, contest.duration_minutes);
    const leaderboard = await buildContestLeaderboard(contestId);

    res.json({
      contest_id: contestId,
      status,
      leaderboard,
    });
  } catch (error) {
    console.error(`[GET /api/contests/${contestId}/leaderboard] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/contests/:id/timing
 * Get contest timing information for synchronization
 */
router.get('/:id/timing', async (req: Request, res: Response) => {
  const contestId = req.params.id;

  if (!contestId) {
    res.status(400).json({ error: "Invalid contest ID" });
    return;
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      select: {
        id: true,
        starts_at: true,
        duration_minutes: true,
      },
    });

    if (!contest) {
      res.status(404).json({ error: "Contest not found" });
      return;
    }

    // Capture server time once so all calculations use the same reference point
    const now = new Date();
    const status = getContestStatus(contest.starts_at, contest.duration_minutes, now);
    const endsAt = getContestEndTime(contest.starts_at, contest.duration_minutes);
    const remainingMs = getContestRemainingMs(
      contest.starts_at,
      contest.duration_minutes,
      now
    );

    res.json({
      server_time: now.toISOString(),
      starts_at: contest.starts_at.toISOString(),
      ends_at: endsAt.toISOString(),
      duration_minutes: contest.duration_minutes,
      status,
      remaining_ms: remainingMs,
    });
  } catch (error) {
    console.error(`[GET /api/contests/${contestId}/timing] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
