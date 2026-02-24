/**
 * GET /api/contests/[id] — Get contest details.
 *
 * Problem visibility rules:
 *   - upcoming:  problems are HIDDEN (not returned)
 *   - active:    problems are SHOWN (with full details from src/data/problems.ts)
 *   - completed: problems are SHOWN (with full details)
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getContestStatus } from "@/lib/contest-status";
import { problems as allProblems } from "@/data/problems";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user?.dbUserId as number | undefined) ?? null;

  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid contest ID" }, { status: 400 });
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: { id },
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
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
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

    return NextResponse.json({
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
    console.error(`[GET /api/contests/${id}] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
