/**
 * Conversations routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { getContestStatus } from '../lib/contest-status.js';
import { getChatNamespace } from '../socket/index.js';
import { broadcastToRoom, roomNames } from '../socket/rooms.js';
import { emitUnreadUpdate } from '../socket/notification-helpers.js';

const router = Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function parseMetadata(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * GET /api/conversations
 * List all conversations for authenticated user
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
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

      const isUnread =
        latestMessage !== null &&
        membership.last_seen_message_id !== latestMessage.id;

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
        const other = convo.participants.find((p) => p.user_id !== userId);
        return {
          ...base,
          other_participant: other
            ? { id: other.user.id, username: other.user.username, avatar_svg: other.user.avatar_svg ?? null }
            : null,
        };
      }

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

    res.json({ conversations });
  } catch (error) {
    console.error("[GET /api/conversations] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/conversations/direct?user_id=X
 * POST /api/conversations/direct
 * Get or create a direct conversation
 */
async function handleDirectConversation(userId: number, otherUserId: number, res: Response) {
  if (userId === otherUserId) {
    res.status(400).json({ error: "Cannot create a conversation with yourself" });
    return;
  }

  // Verify friendship
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
    res.status(403).json({ error: "You must be friends with this user to start a conversation" });
    return;
  }

  // Check for existing conversation
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
    res.json({
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
    return;
  }

  // Create new conversation
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

  res.status(201).json({
    conversation: {
      id: newConversation.id,
      type: "direct",
      participants: newConversation.participants.map((p) => ({
        id: p.user.id,
        username: p.user.username,
      })),
      created_at: newConversation.created_at.toISOString(),
    },
  });
}

router.get('/direct', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userIdParam = req.query.user_id as string;

  if (!userIdParam) {
    res.status(400).json({ error: "user_id query parameter is required" });
    return;
  }

  const otherUserId = parseInt(userIdParam, 10);
  if (isNaN(otherUserId) || otherUserId <= 0) {
    res.status(400).json({ error: "user_id must be a positive integer" });
    return;
  }

  try {
    await handleDirectConversation(userId, otherUserId, res);
  } catch (error) {
    console.error("[GET /api/conversations/direct] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/direct', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { user_id } = req.body;

  if (typeof user_id !== "number" || !Number.isInteger(user_id) || user_id <= 0) {
    res.status(400).json({ error: "user_id must be a positive integer" });
    return;
  }

  try {
    await handleDirectConversation(userId, user_id, res);
  } catch (error) {
    console.error("[POST /api/conversations/direct] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/conversations/unread-count
 * Get count of conversations with unread messages
 */
router.get('/unread-count', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
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

    const unreadCount = memberships.reduce((count, membership) => {
      const latestMessage = membership.conversation.messages[0] ?? null;
      if (!latestMessage) return count;

      const isUnread = membership.last_seen_message_id !== latestMessage.id;
      return isUnread ? count + 1 : count;
    }, 0);

    res.json({ unread_count: unreadCount });
  } catch (error) {
    console.error("[GET /api/conversations/unread-count] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/conversations/:id/messages
 * Fetch messages with cursor-based pagination
 */
router.get('/:id/messages', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const conversationId = req.params.id;

  if (!conversationId) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }

  const participant = await verifyParticipant(conversationId, userId);
  if (!participant) {
    res.status(403).json({ error: "Conversation not found or access denied" });
    return;
  }

  const limitParam = req.query.limit as string;
  const beforeId = (req.query.before as string) ?? undefined;
  const afterId = (req.query.after as string) ?? undefined;

  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 100) : 50;

  try {
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

    const cursor =
      formatted.length > 0
        ? {
            before: formatted[0].id,
            after: formatted[formatted.length - 1].id,
          }
        : null;

    res.json({
      messages: formatted,
      has_more: hasMore,
      cursor,
    });
  } catch (error) {
    console.error(`[GET /api/conversations/${conversationId}/messages] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/conversations/:id/messages
 * Send a message
 */
router.post('/:id/messages', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const conversationId = req.params.id;

  if (!conversationId) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }

  const participant = await verifyParticipant(conversationId, userId);
  if (!participant) {
    res.status(403).json({ error: "Conversation not found or access denied" });
    return;
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      contest: {
        select: { starts_at: true, duration_minutes: true },
      },
    },
  });

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  // Contest chat: enforce timing
  if (conversation.type === "contest" && conversation.contest) {
    const status = getContestStatus(
      conversation.contest.starts_at,
      conversation.contest.duration_minutes
    );

    if (status === "upcoming") {
      res.status(403).json({ error: "Contest has not started yet" });
      return;
    }

    if (status === "completed") {
      res.status(403).json({ error: "Contest has ended" });
      return;
    }
  }

  const { type, content, metadata } = req.body;

  const VALID_MESSAGE_TYPES = new Set(["text", "problem_recommendation", "code_snippet", "contest_invite"]);

  if (typeof type !== "string" || !VALID_MESSAGE_TYPES.has(type)) {
    res.status(400).json({ error: `type must be one of: ${[...VALID_MESSAGE_TYPES].join(", ")}` });
    return;
  }

  if (typeof content !== "string") {
    res.status(400).json({ error: "content must be a string" });
    return;
  }

  if (type === "text" && content.trim().length === 0) {
    res.status(400).json({ error: "content cannot be empty for text messages" });
    return;
  }

  try {
    const message = await prisma.$transaction(async (tx) => {
      const newMessage = await tx.message.create({
        data: {
          conversation_id: conversationId,
          sender_id: userId,
          type: type as any,
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

    // Broadcast via Socket.IO (stub for now)
    try {
      const chatNsp = getChatNamespace();
      broadcastToRoom(
        chatNsp,
        roomNames.conversation(conversationId),
        "message:new",
        { message: messageData }
      );
    } catch (socketErr) {
      console.warn("[POST messages] Socket.IO broadcast skipped:", socketErr);
    }

    // Emit unread updates
    try {
      const allParticipants = await prisma.conversationParticipant.findMany({
        where: { conversation_id: conversationId },
        select: { user_id: true },
      });
      for (const p of allParticipants) {
        if (p.user_id === userId) continue;
        await emitUnreadUpdate(p.user_id);
      }
    } catch (unreadErr) {
      console.warn("[POST messages] unread_update skipped:", unreadErr);
    }

    res.status(201).json({ message: messageData });
  } catch (error) {
    console.error(`[POST /api/conversations/${conversationId}/messages] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/conversations/:id/read
 * Mark all messages as read
 */
router.post('/:id/read', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const conversationId = req.params.id;

  if (!conversationId) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }

  try {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
    });

    if (!participant) {
      res.status(403).json({ error: "Conversation not found or access denied" });
      return;
    }

    const latestMessage = await prisma.message.findFirst({
      where: { conversation_id: conversationId },
      orderBy: { created_at: "desc" },
      select: { id: true },
    });

    if (!latestMessage) {
      res.json({ success: true, last_seen_message_id: null });
      return;
    }

    await prisma.conversationParticipant.update({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
      data: { last_seen_message_id: latestMessage.id },
    });

    // Broadcast read receipt (stub for now)
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
      console.warn("[POST read] Socket.IO broadcast skipped:", socketErr);
    }

    try {
      await emitUnreadUpdate(userId);
    } catch (unreadErr) {
      console.warn("[POST read] unread_update skipped:", unreadErr);
    }

    res.json({
      success: true,
      last_seen_message_id: latestMessage.id,
    });
  } catch (error) {
    console.error(`[POST /api/conversations/${conversationId}/read] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
