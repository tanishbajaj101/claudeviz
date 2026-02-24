/**
 * GET /api/contests/mine — Legacy alias for /api/contests/me
 * Redirects to the Prisma-based implementation for backward compatibility.
 */

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getContestStatus } from "@/lib/contest-status";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

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

    return NextResponse.json({ contests });
  } catch (error) {
    console.error("[GET /api/contests/mine] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
