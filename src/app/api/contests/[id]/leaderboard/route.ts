/**
 * GET /api/contests/[id]/leaderboard — Contest leaderboard.
 *
 * No authentication required. Returns the full ranked leaderboard for any
 * contest status (active or completed).
 *
 * Sorting: total_score DESC, then last_correct_at ASC (tiebreaker).
 *
 * Response shape:
 * {
 *   contest_id: string,
 *   status: "upcoming" | "active" | "completed",
 *   leaderboard: LeaderboardRow[]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getContestStatus } from "@/lib/contest-status";
import { buildContestLeaderboard } from "@/lib/contest-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: contestId } = await params;

  if (!contestId || typeof contestId !== "string") {
    return NextResponse.json({ error: "Invalid contest ID" }, { status: 400 });
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
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    const status = getContestStatus(contest.starts_at, contest.duration_minutes);
    const leaderboard = await buildContestLeaderboard(contestId);

    return NextResponse.json({
      contest_id: contestId,
      status,
      leaderboard,
    });
  } catch (error) {
    console.error(`[GET /api/contests/${contestId}/leaderboard] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
