/**
 * Friends routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getUserById } from '../lib/db.js';
import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';
import { getProblemById } from '../lib/problems.js';
import { isUserOnline } from '../socket/connections.js';
import { emitNotification } from '../socket/notification-helpers.js';

const router = Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function hasUnreadMessages(
  userId: number,
  friendId: number
): Promise<boolean> {
  const conversation = await prisma.conversation.findFirst({
    where: {
      type: "direct",
      AND: [
        { participants: { some: { user_id: userId } } },
        { participants: { some: { user_id: friendId } } },
      ],
    },
    select: {
      participants: {
        where: { user_id: userId },
        select: { last_seen_message_id: true },
      },
      messages: {
        orderBy: { created_at: "desc" },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!conversation || conversation.messages.length === 0) return false;

  const latestMessageId = conversation.messages[0].id;
  const userParticipant = conversation.participants[0];

  if (!userParticipant) return false;

  return userParticipant.last_seen_message_id !== latestMessageId;
}

async function getLastProblemActivity(
  friendDbUser: Awaited<ReturnType<typeof getUserById>>,
  friendId: number
): Promise<{
  problem_id: string;
  problem_name: string;
  status: "solved" | "solving";
} | null> {
  if (!friendDbUser || !friendDbUser.last_opened_problem_id) return null;

  const problemId = friendDbUser.last_opened_problem_id;
  const problem = getProblemById(problemId);
  if (!problem) return null;

  const acceptedSubmission = await prisma.submission.findFirst({
    where: {
      user_id: friendId,
      problem_id: problemId,
      status: "Accepted",
    },
    select: { id: true },
  });

  return {
    problem_id: problemId,
    problem_name: problem.title,
    status: acceptedSubmission ? "solved" : "solving",
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * GET /api/friends
 * Get friends list with activity data
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        status: "accepted",
        OR: [{ sender_id: userId }, { receiver_id: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar_svg: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar_svg: true,
          },
        },
      },
    });

    const enriched = await Promise.all(
      friendRequests.map(async (fr) => {
        const friend = fr.sender_id === userId ? fr.receiver : fr.sender;
        const friendId = friend.id;

        const friendDbUser = await getUserById(friendId);

        const [lastProblemActivity, hasUnread] = await Promise.all([
          getLastProblemActivity(friendDbUser, friendId),
          hasUnreadMessages(userId, friendId),
        ]);

        return {
          id: friendId,
          username: friend.username,
          avatar_svg: friend.avatar_svg,
          is_online: isUserOnline(friendId),
          last_active: friendDbUser?.last_active?.toISOString() ?? null,
          last_problem_activity: lastProblemActivity,
          has_unread: hasUnread,
        };
      })
    );

    // Sort by last_active DESC (nulls last)
    enriched.sort((a, b) => {
      if (!a.last_active && !b.last_active) return 0;
      if (!a.last_active) return 1;
      if (!b.last_active) return -1;
      return (
        new Date(b.last_active).getTime() - new Date(a.last_active).getTime()
      );
    });

    res.json({ friends: enriched });
  } catch (error) {
    console.error("[GET /api/friends] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/friends
 * Send a friend request
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  const senderId = req.user!.id;
  const { receiver_id } = req.body;

  if (typeof receiver_id !== "number" || !Number.isInteger(receiver_id)) {
    res.status(400).json({ error: "receiver_id must be an integer" });
    return;
  }

  if (receiver_id === senderId) {
    res.status(400).json({ error: "Cannot send a friend request to yourself" });
    return;
  }

  try {
    const receiver = await prisma.user.findUnique({
      where: { id: receiver_id },
      select: { id: true, username: true },
    });

    if (!receiver) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check for existing request
    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { sender_id: senderId, receiver_id: receiver_id },
          { sender_id: receiver_id, receiver_id: senderId },
        ],
      },
      select: { id: true, status: true },
    });

    if (existing) {
      if (existing.status === "accepted") {
        res.status(409).json({ error: "You are already friends with this user" });
        return;
      }
      if (existing.status === "pending") {
        res.status(409).json({ error: "A friend request already exists between these users" });
        return;
      }
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { username: true },
    });

    if (!sender) {
      res.status(500).json({ error: "Sender not found" });
      return;
    }

    // Create friend request and notification in transaction
    const { friendRequest, notification } = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const fr = await tx.friendRequest.create({
          data: {
            sender_id: senderId,
            receiver_id: receiver_id,
            status: "pending",
          },
        });

        const notifData = {
          sender_id: senderId,
          sender_username: sender.username,
          friend_request_id: fr.id,
        };

        const notif = await tx.notification.create({
          data: {
            user_id: receiver_id,
            type: "friend_request",
            data: JSON.stringify(notifData),
            is_read: false,
          },
        });

        return { friendRequest: fr, notification: notif };
      }
    );

    // Emit notification (will work after Socket.IO migration)
    emitNotification(receiver_id, {
      id: notification.id,
      type: "friend_request",
      data: JSON.parse(notification.data) as Record<string, unknown>,
      is_read: false,
      created_at: notification.created_at.toISOString(),
    });

    console.log(
      `[POST /api/friends] friend request ${friendRequest.id} sent from user ${senderId} to user ${receiver_id}`
    );

    res.status(201).json({ success: true, friend_request_id: friendRequest.id });
  } catch (error) {
    console.error("[POST /api/friends] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/friends/requests
 * Get all pending friend requests (sent and received)
 */
router.get('/requests', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const [sent, received] = await Promise.all([
      prisma.friendRequest.findMany({
        where: {
          sender_id: userId,
          status: "pending",
        },
        select: {
          id: true,
          receiver_id: true,
          receiver: {
            select: {
              username: true,
            },
          },
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.friendRequest.findMany({
        where: {
          receiver_id: userId,
          status: "pending",
        },
        select: {
          id: true,
          sender_id: true,
          sender: {
            select: {
              username: true,
            },
          },
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      }),
    ]);

    res.json({
      sent: sent.map((req) => ({
        id: req.id,
        receiver_id: req.receiver_id,
        receiver_username: req.receiver.username,
        created_at: req.created_at.toISOString(),
      })),
      received: received.map((req) => ({
        id: req.id,
        sender_id: req.sender_id,
        sender_username: req.sender.username,
        created_at: req.created_at.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[GET /api/friends/requests] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/friends/:id/accept
 * Accept a pending friend request
 */
router.post('/:id/accept', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const friendRequestId = req.params.id;

  if (!friendRequestId) {
    res.status(400).json({ error: "Invalid friend request ID" });
    return;
  }

  try {
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: friendRequestId },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
    });

    if (!friendRequest) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    if (friendRequest.receiver_id !== userId) {
      res.status(403).json({ error: "You are not the recipient of this friend request" });
      return;
    }

    if (friendRequest.status !== "pending") {
      res.status(409).json({ error: `Friend request is already ${friendRequest.status}` });
      return;
    }

    // Accept + notify sender + delete original notification
    const { notification } = await prisma.$transaction(async (tx) => {
      await tx.friendRequest.update({
        where: { id: friendRequestId },
        data: { status: "accepted" },
      });

      await tx.notification.deleteMany({
        where: {
          type: "friend_request",
          data: {
            contains: friendRequestId,
          },
        },
      });

      const notifData = {
        user_id: userId,
        username: friendRequest.receiver.username,
        friend_request_id: friendRequestId,
      };

      const notif = await tx.notification.create({
        data: {
          user_id: friendRequest.sender_id,
          type: "friend_request_accepted",
          data: JSON.stringify(notifData),
          is_read: false,
        },
      });

      return { notification: notif };
    });

    // Emit notification (will work after Socket.IO migration)
    emitNotification(friendRequest.sender_id, {
      id: notification.id,
      type: "friend_request_accepted",
      data: JSON.parse(notification.data) as Record<string, unknown>,
      is_read: false,
      created_at: notification.created_at.toISOString(),
    });

    console.log(
      `[POST /api/friends/${friendRequestId}/accept] user ${userId} accepted request from user ${friendRequest.sender_id}`
    );

    res.json({
      success: true,
      sender_id: friendRequest.sender_id,
      receiver_id: userId
    });
  } catch (error) {
    console.error(`[POST /api/friends/${friendRequestId}/accept] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/friends/:id/reject
 * Reject a pending friend request
 */
router.post('/:id/reject', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const friendRequestId = req.params.id;

  if (!friendRequestId) {
    res.status(400).json({ error: "Invalid friend request ID" });
    return;
  }

  try {
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: friendRequestId },
      select: { id: true, receiver_id: true, status: true },
    });

    if (!friendRequest) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    if (friendRequest.receiver_id !== userId) {
      res.status(403).json({ error: "You are not the recipient of this friend request" });
      return;
    }

    if (friendRequest.status !== "pending") {
      res.status(409).json({ error: `Friend request is already ${friendRequest.status}` });
      return;
    }

    // Reject and delete original notification
    await prisma.$transaction(async (tx) => {
      await tx.friendRequest.update({
        where: { id: friendRequestId },
        data: { status: "rejected" },
      });

      await tx.notification.deleteMany({
        where: {
          type: "friend_request",
          data: {
            contains: friendRequestId,
          },
        },
      });
    });

    console.log(
      `[POST /api/friends/${friendRequestId}/reject] user ${userId} rejected the request`
    );

    res.json({ success: true });
  } catch (error) {
    console.error(`[POST /api/friends/${friendRequestId}/reject] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
