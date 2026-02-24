/**
 * GET /api/conversations/unread-count
 *
 * Returns the number of conversations (not total messages) that have at least
 * one unread message for the authenticated user.
 *
 * A conversation is "unread" when the user's last_seen_message_id differs from
 * the latest message in the conversation (or is null while the conversation
 * has at least one message).
 */

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

  try {
    // Fetch all user's conversation memberships with the latest message in each
    const memberships = await prisma.conversationParticipant.findMany({
      where: { user_id: userId },
      select: {
        last_seen_message_id: true,
        conversation: {
          select: {
            messages: {
              orderBy: { created_at: "desc" },
              take: 1,
              select: { id: true },
            },
          },
        },
      },
    });

    // Count conversations where the user has unread messages
    const unreadCount = memberships.reduce((count, membership) => {
      const latestMessage = membership.conversation.messages[0] ?? null;
      if (!latestMessage) return count; // no messages → not unread

      const isUnread = membership.last_seen_message_id !== latestMessage.id;
      return isUnread ? count + 1 : count;
    }, 0);

    return NextResponse.json({ unread_count: unreadCount });
  } catch (error) {
    console.error("[GET /api/conversations/unread-count] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
