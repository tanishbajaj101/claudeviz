/**
 * GET /api/contests/[id]/timing — Contest timing information.
 *
 * No authentication required. Returns the server's current time alongside
 * contest start/end times, derived status, and remaining milliseconds.
 *
 * Clients should use this endpoint to synchronize their local countdown
 * timers with the authoritative server clock.
 *
 * Response shape:
 * {
 *   server_time: string,       // ISO 8601 — server's current UTC time
 *   starts_at: string,         // ISO 8601 — contest start time
 *   ends_at: string,           // ISO 8601 — contest end time (starts_at + duration)
 *   duration_minutes: number,
 *   status: "upcoming" | "active" | "completed",
 *   remaining_ms: number       // milliseconds until end; 0 if not active
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getContestStatus,
  getContestEndTime,
  getContestRemainingMs,
} from "@/lib/contest-status";

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

    // Capture server time once so all calculations use the same reference point
    const now = new Date();
    const status = getContestStatus(contest.starts_at, contest.duration_minutes, now);
    const endsAt = getContestEndTime(contest.starts_at, contest.duration_minutes);
    const remainingMs = getContestRemainingMs(
      contest.starts_at,
      contest.duration_minutes,
      now
    );

    return NextResponse.json({
      server_time: now.toISOString(),
      starts_at: contest.starts_at.toISOString(),
      ends_at: endsAt.toISOString(),
      duration_minutes: contest.duration_minutes,
      status,
      remaining_ms: remainingMs,
    });
  } catch (error) {
    console.error(`[GET /api/contests/${contestId}/timing] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
