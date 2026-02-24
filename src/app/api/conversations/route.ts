/**
 * GET /api/conversations — List all conversations for the authenticated user.
 *
 * Returns conversations sorted by updated_at DESC (most recently active first).
 * For each conversation:
 *   - type='direct': includes the other participant's info
 *   - type='contest': includes contest id, title, and derived status
 * Includes latest message preview and unread status.
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
    // Fetch all conversations the user is a participant of
    const memberships = await prisma.conversationParticipant.findMany({
      where: { user_id: userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: { select: { id: true, username: true, avatar_svg: true } },
              },
            },
            contest: {
              select: {
                id: true,
                title: true,
                starts_at: true,
                duration_minutes: true,
              },
            },
            messages: {
              orderBy: { created_at: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { conversation: { updated_at: "desc" } },
    });

    const conversations = memberships.map((membership) => {
      const convo = membership.conversation;
      const latestMessage = convo.messages[0] ?? null;

      // Unread: user's last_seen_message_id differs from latest message id
      const isUnread =
        latestMessage !== null &&
        membership.last_seen_message_id !== latestMessage.id;

      // Build base response shape
      const base = {
        id: convo.id,
        type: convo.type as "direct" | "contest",
        latest_message: latestMessage
          ? {
            id: latestMessage.id,
            sender_id: latestMessage.sender_id,
            sender_username:
              convo.participants.find((p) => p.user_id === latestMessage.sender_id)?.user.username ?? "",
            type: latestMessage.type as string,
            content: latestMessage.content,
            created_at: latestMessage.created_at.toISOString(),
          }
          : null,
        is_unread: isUnread,
        updated_at: convo.updated_at.toISOString(),
      };

      if (convo.type === "direct") {
        // Find the other participant
        const other = convo.participants.find((p) => p.user_id !== userId);
        return {
          ...base,
          other_participant: other
            ? { id: other.user.id, username: other.user.username, avatar_svg: other.user.avatar_svg ?? null }
            : null,
        };
      }

      // contest type
      if (convo.contest) {
        const status = getContestStatus(
          convo.contest.starts_at,
          convo.contest.duration_minutes
        );
        return {
          ...base,
          contest: {
            id: convo.contest.id,
            title: convo.contest.title,
            status,
          },
        };
      }

      return base;
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("[GET /api/conversations] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
