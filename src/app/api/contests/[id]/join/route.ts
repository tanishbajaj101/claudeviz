/**
 * POST /api/contests/[id]/join — Join a contest.
 *
 * Rules:
 *  - Requires authentication
 *  - Contest must exist
 *  - Contest status must be 'upcoming'
 *  - User must not already be a participant
 *  - Public contests: any authenticated user may join
 *  - Private contests: user must have a contest_invite notification for this contest
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getContestStatus } from "@/lib/contest-status";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // --- Auth ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid contest ID" }, { status: 400 });
  }

  try {
    // --- Fetch contest ---
    const contest = await prisma.contest.findUnique({
      where: { id },
      include: {
        participants: { select: { user_id: true } },
        conversations: { select: { id: true } },
      },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    // --- Status check ---
    const status = getContestStatus(contest.starts_at, contest.duration_minutes);
    if (status !== "upcoming") {
      return NextResponse.json(
        {
          error: `Cannot join a contest that has already ${status === "active" ? "started" : "ended"}`,
        },
        { status: 400 }
      );
    }

    // --- Duplicate participant check ---
    const alreadyParticipating = contest.participants.some(
      (p) => p.user_id === userId
    );
    if (alreadyParticipating) {
      return NextResponse.json(
        { error: "You are already a participant in this contest" },
        { status: 400 }
      );
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
            return data.contest_id === id;
          } catch {
            return false;
          }
        })();

      if (!hasValidInvite) {
        return NextResponse.json(
          {
            error:
              "This is a private contest. You must be invited to join.",
          },
          { status: 403 }
        );
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
          contest_id: id,
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

    return NextResponse.json({
      success: true,
      message: "Successfully joined contest",
    });
  } catch (error) {
    console.error(`[POST /api/contests/${id}/join] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
