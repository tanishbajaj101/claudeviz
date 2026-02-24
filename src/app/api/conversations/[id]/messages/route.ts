/**
 * GET  /api/conversations/[id]/messages — Fetch messages (cursor-based pagination)
 * POST /api/conversations/[id]/messages — Send a message
 *
 * Query params for GET:
 *   ?limit=50          — max messages to return (default 50)
 *   ?before=<uuid>     — return messages older than this message id
 *   ?after=<uuid>      — return messages newer than this message id
 *
 * Both endpoints require the authenticated user to be a ConversationParticipant.
 * POST additionally validates:
 *   - For contest conversations: contest must be active
 *   - metadata required fields by message type
 * After a successful POST the message is broadcast via Socket.IO to the room.
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getContestStatus } from "@/lib/contest-status";
import { getChatNamespace, broadcastToRoom, roomNames } from "@/lib/socket";
import { emitUnreadUpdate } from "@/lib/socket/notification-helpers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Verify the user is a participant in the conversation, returns the record or null. */
async function verifyParticipant(conversationId: string, userId: number) {
  return prisma.conversationParticipant.findUnique({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
  });
}

/** Parse metadata from a DB string field safely. */
function parseMetadata(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// GET /api/conversations/[id]/messages
// ---------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
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

  // Verify participant
  const participant = await verifyParticipant(conversationId, userId);
  if (!participant) {
    return NextResponse.json(
      { error: "Conversation not found or access denied" },
      { status: 403 }
    );
  }

  // Parse query params
  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get("limit");
  const beforeId = searchParams.get("before") ?? undefined;
  const afterId = searchParams.get("after") ?? undefined;

  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 100) : 50;

  try {
    // Build cursor filter
    // SQLite UUIDs are stored as TEXT; Prisma uses string id.
    // Cursor: fetch messages where created_at is before/after the cursor message.
    // We query one extra record to determine has_more.
    const fetchLimit = limit + 1;

    let whereClause: {
      conversation_id: string;
      created_at?: { lt: Date } | { gt: Date };
    } = { conversation_id: conversationId };

    if (beforeId) {
      const cursorMessage = await prisma.message.findUnique({
        where: { id: beforeId },
        select: { created_at: true },
      });
      if (cursorMessage) {
        whereClause = {
          ...whereClause,
          created_at: { lt: cursorMessage.created_at },
        };
      }
    } else if (afterId) {
      const cursorMessage = await prisma.message.findUnique({
        where: { id: afterId },
        select: { created_at: true },
      });
      if (cursorMessage) {
        whereClause = {
          ...whereClause,
          created_at: { gt: cursorMessage.created_at },
        };
      }
    }

    // Determine sort order based on direction:
    // - "before" cursor: get older messages → sort DESC, then reverse result
    // - default or "after": sort ASC
    const sortOrder = beforeId ? ("desc" as const) : ("asc" as const);

    const rawMessages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { created_at: sortOrder },
      take: fetchLimit,
      include: {
        sender: { select: { id: true, username: true } },
      },
    });

    const hasMore = rawMessages.length > limit;
    const messages = hasMore ? rawMessages.slice(0, limit) : rawMessages;

    // Restore chronological order when paginating backwards
    if (beforeId) {
      messages.reverse();
    }

    const formatted = messages.map((msg) => ({
      id: msg.id,
      sender_id: msg.sender_id,
      sender_username: msg.sender.username,
      type: msg.type as string,
      content: msg.content,
      metadata: parseMetadata(msg.metadata),
      created_at: msg.created_at.toISOString(),
    }));

    // Build cursor pointers for the client
    const cursor =
      formatted.length > 0
        ? {
            before: formatted[0].id,
            after: formatted[formatted.length - 1].id,
          }
        : null;

    return NextResponse.json({
      messages: formatted,
      has_more: hasMore,
      cursor,
    });
  } catch (error) {
    console.error(`[GET /api/conversations/${conversationId}/messages] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/conversations/[id]/messages
// ---------------------------------------------------------------------------

type MessageTypeValue = "text" | "problem_recommendation" | "code_snippet" | "contest_invite";

const VALID_MESSAGE_TYPES = new Set<MessageTypeValue>([
  "text",
  "problem_recommendation",
  "code_snippet",
  "contest_invite",
]);

interface SendMessageBody {
  type: unknown;
  content: unknown;
  metadata?: unknown;
}

/** Validate that metadata contains required fields for special message types. */
function validateMetadata(
  type: MessageTypeValue,
  metadata: unknown
): string | null {
  if (type === "text") return null; // no metadata required

  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return `metadata is required for message type '${type}'`;
  }

  const meta = metadata as Record<string, unknown>;

  if (type === "problem_recommendation") {
    if (!meta.problem_id || !meta.problem_name || !meta.difficulty) {
      return "metadata for problem_recommendation must include: problem_id, problem_name, difficulty";
    }
  } else if (type === "code_snippet") {
    if (!meta.code || !meta.language) {
      return "metadata for code_snippet must include: code, language";
    }
  } else if (type === "contest_invite") {
    if (!meta.contest_id || !meta.contest_name || !meta.start_time) {
      return "metadata for contest_invite must include: contest_id, contest_name, start_time";
    }
  }

  return null;
}

export async function POST(
  req: NextRequest,
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

  // Verify participant
  const participant = await verifyParticipant(conversationId, userId);
  if (!participant) {
    return NextResponse.json(
      { error: "Conversation not found or access denied" },
      { status: 403 }
    );
  }

  // Fetch conversation to check type and contest status
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      contest: {
        select: { starts_at: true, duration_minutes: true },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  // Contest chat: enforce timing restrictions
  if (conversation.type === "contest" && conversation.contest) {
    const status = getContestStatus(
      conversation.contest.starts_at,
      conversation.contest.duration_minutes
    );

    if (status === "upcoming") {
      return NextResponse.json(
        { error: "Contest has not started yet" },
        { status: 403 }
      );
    }

    if (status === "completed") {
      return NextResponse.json(
        { error: "Contest has ended" },
        { status: 403 }
      );
    }
  }

  // Parse body
  let body: SendMessageBody;
  try {
    body = (await req.json()) as SendMessageBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { type, content, metadata } = body;

  // Validate type
  if (typeof type !== "string" || !VALID_MESSAGE_TYPES.has(type as MessageTypeValue)) {
    return NextResponse.json(
      {
        error: `type must be one of: ${[...VALID_MESSAGE_TYPES].join(", ")}`,
      },
      { status: 400 }
    );
  }

  const messageType = type as MessageTypeValue;

  // Validate content (required for all types, but can be empty string for non-text)
  if (typeof content !== "string") {
    return NextResponse.json(
      { error: "content must be a string" },
      { status: 400 }
    );
  }

  if (messageType === "text" && content.trim().length === 0) {
    return NextResponse.json(
      { error: "content cannot be empty for text messages" },
      { status: 400 }
    );
  }

  // Validate metadata for special types
  const metadataError = validateMetadata(messageType, metadata);
  if (metadataError) {
    return NextResponse.json({ error: metadataError }, { status: 400 });
  }

  try {
    // Save message + update conversation.updated_at in a transaction
    const message = await prisma.$transaction(async (tx) => {
      const newMessage = await tx.message.create({
        data: {
          conversation_id: conversationId,
          sender_id: userId,
          type: messageType,
          content,
          metadata:
            metadata && typeof metadata === "object"
              ? JSON.stringify(metadata)
              : null,
        },
        include: {
          sender: { select: { id: true, username: true } },
        },
      });

      // Touch updated_at on the conversation to keep listing order accurate
      await tx.conversation.update({
        where: { id: conversationId },
        data: { updated_at: new Date() },
      });

      return newMessage;
    });

    const messageData = {
      id: message.id,
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
      sender_username: message.sender.username,
      type: message.type as string,
      content: message.content,
      metadata: parseMetadata(message.metadata),
      created_at: message.created_at.toISOString(),
    };

    // Broadcast to conversation room via Socket.IO (best-effort)
    try {
      const chatNsp = getChatNamespace();
      broadcastToRoom(
        chatNsp,
        roomNames.conversation(conversationId),
        "message:new",
        { message: messageData }
      );
    } catch (socketErr) {
      // Socket.IO server may not be running in test/build environments
      console.warn(
        "[POST /api/conversations/messages] Socket.IO broadcast skipped:",
        socketErr instanceof Error ? socketErr.message : socketErr
      );
    }

    // Notify all other participants that their unread count changed (best-effort)
    try {
      const allParticipants = await prisma.conversationParticipant.findMany({
        where: { conversation_id: conversationId },
        select: { user_id: true },
      });
      for (const p of allParticipants) {
        if (p.user_id === userId) continue; // skip the sender
        await emitUnreadUpdate(p.user_id);
      }
    } catch (unreadErr) {
      console.warn(
        "[POST /api/conversations/messages] unread_update emit skipped:",
        unreadErr instanceof Error ? unreadErr.message : unreadErr
      );
    }

    return NextResponse.json({ message: messageData }, { status: 201 });
  } catch (error) {
    console.error(`[POST /api/conversations/${conversationId}/messages] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
