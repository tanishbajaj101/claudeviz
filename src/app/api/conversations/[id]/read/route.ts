/**
 * POST /api/conversations/[id]/read — Mark all messages as read.
 *
 * Sets the requesting user's ConversationParticipant.last_seen_message_id
 * to the latest message in the conversation. If the conversation has no
 * messages, returns success with last_seen_message_id: null.
 *
 * After updating the DB, emits a message:read Socket.IO event to the
 * conversation room so other participants see the read receipt in real time.
 *
 * Requires: authenticated user must be a ConversationParticipant.
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getChatNamespace, broadcastToRoom, roomNames } from "@/lib/socket";
import { emitUnreadUpdate } from "@/lib/socket/notification-helpers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;
  const { id: conversationId } = await params;

  if (!conversationId) {
    return NextResponse.json(
      { error: "Invalid conversation ID" },
      { status: 400 }
    );
  }

  try {
    // Verify the user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 403 }
      );
    }

    // Get the latest message in the conversation
    const latestMessage = await prisma.message.findFirst({
      where: { conversation_id: conversationId },
      orderBy: { created_at: "desc" },
      select: { id: true },
    });

    if (!latestMessage) {
      // No messages yet — nothing to mark as read
      return NextResponse.json({
        success: true,
        last_seen_message_id: null,
      });
    }

    // Update last_seen_message_id
    await prisma.conversationParticipant.update({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
      data: { last_seen_message_id: latestMessage.id },
    });

    // Emit read receipt to conversation room via Socket.IO (best-effort)
    try {
      const chatNsp = getChatNamespace();
      broadcastToRoom(
        chatNsp,
        roomNames.conversation(conversationId),
        "message:read",
        {
          conversation_id: conversationId,
          user_id: userId,
          last_seen_message_id: latestMessage.id,
        }
      );
    } catch (socketErr) {
      console.warn(
        "[POST /api/conversations/read] Socket.IO broadcast skipped:",
        socketErr instanceof Error ? socketErr.message : socketErr
      );
    }

    // Emit updated unread count to the user who just read (best-effort)
    try {
      await emitUnreadUpdate(userId);
    } catch (unreadErr) {
      console.warn(
        "[POST /api/conversations/read] unread_update emit skipped:",
        unreadErr instanceof Error ? unreadErr.message : unreadErr
      );
    }

    return NextResponse.json({
      success: true,
      last_seen_message_id: latestMessage.id,
    });
  } catch (error) {
    console.error(`[POST /api/conversations/${conversationId}/read] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
