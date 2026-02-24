/**
 * POST /api/contests/[id]/submit — Submit a contest problem answer.
 *
 * Flow:
 *   1. Validate auth, participation, contest status, and problem membership.
 *   2. Look up the problem from src/data/problems.ts to obtain test cases and limits.
 *   3. Submit all test cases to Judge0 via submitCode(); accept when ALL pass.
 *   4. Record ContestSubmission.
 *   5. Recalculate ContestParticipant.total_score using best-score-per-problem logic.
 *   6. Broadcast leaderboard update via Socket.IO (best-effort).
 *
 * Scoring: Easy=100, Medium=200, Hard=300 (only when is_correct=true, i.e. all tests pass).
 * Best-score-per-problem: multiple submissions on the same problem → only highest score counts.
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getContestStatus, calculateContestScore } from "@/lib/contest-status";
import { submitCode } from "@/lib/judge0";
import { problems as allProblems } from "@/data/problems";
import { buildContestLeaderboard } from "@/lib/contest-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;
  const username = (session.user.username as string | undefined) ?? "unknown";
  const { id: contestId } = await params;

  if (!contestId || typeof contestId !== "string") {
    return NextResponse.json({ error: "Invalid contest ID" }, { status: 400 });
  }

  // Parse and validate body
  let body: { problem_id?: unknown; code?: unknown };
  try {
    body = (await req.json()) as { problem_id?: unknown; code?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { problem_id, code } = body;

  if (typeof problem_id !== "string" || problem_id.trim().length === 0) {
    return NextResponse.json(
      { error: "problem_id is required and must be a non-empty string" },
      { status: 400 }
    );
  }
  if (typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.json(
      { error: "code is required and must be a non-empty string" },
      { status: 400 }
    );
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
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    // Contest must be active
    const status = getContestStatus(contest.starts_at, contest.duration_minutes);
    if (status !== "active") {
      return NextResponse.json(
        {
          error:
            status === "upcoming"
              ? "Contest has not started yet"
              : "Contest has ended",
        },
        { status: 400 }
      );
    }

    // User must be a participant
    const isParticipant = contest.participants.some((p) => p.user_id === userId);
    if (!isParticipant) {
      return NextResponse.json(
        { error: "You are not a participant in this contest" },
        { status: 403 }
      );
    }

    // Problem must belong to this contest
    const contestProblem = contest.problems.find(
      (cp) => cp.problem_id === problemId
    );
    if (!contestProblem) {
      return NextResponse.json(
        { error: "Problem is not part of this contest" },
        { status: 400 }
      );
    }

    // Fetch full problem data (test cases + Judge0 limits)
    const problemData = allProblems.find((p) => p.id === problemId);
    if (!problemData) {
      return NextResponse.json(
        { error: "Problem data not found in problem pool" },
        { status: 500 }
      );
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
        return NextResponse.json(
          { error: "Code execution service unavailable" },
          { status: 503 }
        );
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
    // Broadcast Socket.IO events (best-effort)
    // ------------------------------------------------------------------
    try {
      const { getContestsNamespace, broadcastToRoom, roomNames } = await import(
        "@/lib/socket"
      );
      const contestsNsp = getContestsNamespace();
      const room = roomNames.contest(contestId);

      broadcastToRoom(contestsNsp, room, "leaderboard:update", {
        contestId,
        leaderboard,
      });

      broadcastToRoom(contestsNsp, room, "submission:new", {
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
      console.warn("[submit] Socket.IO broadcast failed:", err);
    }

    return NextResponse.json({
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
