/**
 * GET  /api/conversations/direct?user_id=<number>
 * POST /api/conversations/direct
 *
 * Get or create a direct (1-on-1) conversation between the authenticated user
 * and another user. Both users must be confirmed friends (bidirectional
 * FriendRequest.status='accepted').
 *
 * If a direct conversation already exists between the two users, it is returned
 * as-is. Otherwise a new Conversation and two ConversationParticipant records
 * are created inside a Prisma transaction.
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Shared logic — get or create a direct conversation
// ---------------------------------------------------------------------------

async function getOrCreateDirectConversation(
  userId: number,
  otherUserId: number
): Promise<NextResponse> {
  // Reject conversation with self
  if (userId === otherUserId) {
    return NextResponse.json(
      { error: "Cannot create a conversation with yourself" },
      { status: 400 }
    );
  }

  // Verify friendship (bidirectional)
  const friendship = await prisma.friendRequest.findFirst({
    where: {
      status: "accepted",
      OR: [
        { sender_id: userId, receiver_id: otherUserId },
        { sender_id: otherUserId, receiver_id: userId },
      ],
    },
  });

  if (!friendship) {
    return NextResponse.json(
      { error: "You must be friends with this user to start a conversation" },
      { status: 403 }
    );
  }

  // Check if a direct conversation already exists between the two users.
  // Strategy: find all direct conversations where userId is a participant,
  // then check if otherUserId is also a participant in the same conversation.
  const existingMembership = await prisma.conversationParticipant.findFirst({
    where: {
      user_id: userId,
      conversation: {
        type: "direct",
        participants: {
          some: { user_id: otherUserId },
        },
      },
    },
    include: {
      conversation: {
        include: {
          participants: {
            include: {
              user: { select: { id: true, username: true } },
            },
          },
        },
      },
    },
  });

  if (existingMembership) {
    const convo = existingMembership.conversation;
    return NextResponse.json({
      conversation: {
        id: convo.id,
        type: "direct",
        participants: convo.participants.map((p) => ({
          id: p.user.id,
          username: p.user.username,
        })),
        created_at: convo.created_at.toISOString(),
      },
    });
  }

  // Create a new direct conversation with both users as participants
  const newConversation = await prisma.$transaction(async (tx) => {
    return tx.conversation.create({
      data: {
        type: "direct",
        participants: {
          create: [{ user_id: userId }, { user_id: otherUserId }],
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true } },
          },
        },
      },
    });
  });

  return NextResponse.json(
    {
      conversation: {
        id: newConversation.id,
        type: "direct",
        participants: newConversation.participants.map((p) => ({
          id: p.user.id,
          username: p.user.username,
        })),
        created_at: newConversation.created_at.toISOString(),
      },
    },
    { status: 201 }
  );
}

// ---------------------------------------------------------------------------
// GET /api/conversations/direct?user_id=<number>
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

  const { searchParams } = new URL(req.url);
  const userIdParam = searchParams.get("user_id");

  if (!userIdParam) {
    return NextResponse.json(
      { error: "user_id query parameter is required" },
      { status: 400 }
    );
  }

  const otherUserId = parseInt(userIdParam, 10);
  if (isNaN(otherUserId) || otherUserId <= 0) {
    return NextResponse.json(
      { error: "user_id must be a positive integer" },
      { status: 400 }
    );
  }

  try {
    return await getOrCreateDirectConversation(userId, otherUserId);
  } catch (error) {
    console.error("[GET /api/conversations/direct] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/conversations/direct
// ---------------------------------------------------------------------------

interface DirectConversationBody {
  user_id: unknown;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

  let body: DirectConversationBody;
  try {
    body = (await req.json()) as DirectConversationBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { user_id } = body;

  if (typeof user_id !== "number" || !Number.isInteger(user_id) || user_id <= 0) {
    return NextResponse.json(
      { error: "user_id must be a positive integer" },
      { status: 400 }
    );
  }

  try {
    return await getOrCreateDirectConversation(userId, user_id);
  } catch (error) {
    console.error("[POST /api/conversations/direct] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
