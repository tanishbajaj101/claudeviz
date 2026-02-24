/**
 * GET /api/contests/public — Legacy alias for GET /api/contests
 * Returns all public contests sorted by created_at DESC.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getContestStatus } from "@/lib/contest-status";

export async function GET() {
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

    return NextResponse.json({ contests: formatted });
  } catch (error) {
    console.error("[GET /api/contests/public] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
