/**
 * Room join/leave helpers for AlgoArena Socket.IO.
 *
 * All helpers validate DB-level permission before joining a room,
 * handle errors gracefully, and log all room lifecycle events.
 *
 * Room naming conventions:
 *  - Conversation rooms : "conversation:<conversationId>"
 *  - Contest rooms      : "contest:<contestId>"
 *  - Notification rooms : "notifications:<userId>"
 */

import type { Socket, Namespace } from 'socket.io';
import { prisma } from '../lib/prisma.js';

// ---------------------------------------------------------------------------
// Room name factories (single source of truth)
// ---------------------------------------------------------------------------

export const roomNames = {
  conversation: (conversationId: string) => `conversation:${conversationId}`,
  contest: (contestId: string) => `contest:${contestId}`,
  notifications: (userId: number) => `notifications:${userId}`,
} as const;

// ---------------------------------------------------------------------------
// Chat namespace helpers
// ---------------------------------------------------------------------------

/**
 * Join a conversation room after verifying the user is a participant.
 *
 * Returns true on success, false if the user is not a participant or an
 * error occurs (error is logged but not re-thrown).
 */
export async function joinConversation(
  socket: Socket,
  conversationId: string,
  userId: number
): Promise<boolean> {
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
      console.warn(
        `[rooms] user ${userId} is not a participant in conversation ${conversationId} — rejecting join`
      );
      return false;
    }

    const room = roomNames.conversation(conversationId);
    await socket.join(room);
    console.log(
      `[rooms] user ${userId} (socket ${socket.id}) joined conversation room "${room}"`
    );
    return true;
  } catch (err) {
    console.error(
      `[rooms] error joining conversation ${conversationId} for user ${userId}:`,
      err
    );
    return false;
  }
}

/**
 * Leave a conversation room.
 *
 * No permission check needed for leaving — always succeeds unless the
 * underlying socket.leave throws (which it never does).
 */
export async function leaveConversation(
  socket: Socket,
  conversationId: string
): Promise<boolean> {
  try {
    const room = roomNames.conversation(conversationId);
    await socket.leave(room);
    console.log(
      `[rooms] socket ${socket.id} left conversation room "${room}"`
    );
    return true;
  } catch (err) {
    console.error(
      `[rooms] error leaving conversation ${conversationId}:`,
      err
    );
    return false;
  }
}

// ---------------------------------------------------------------------------
// Contests namespace helpers
// ---------------------------------------------------------------------------

/**
 * Join a contest room after verifying the user is a registered participant.
 *
 * Returns true on success, false if not enrolled or an error occurs.
 */
export async function joinContest(
  socket: Socket,
  contestId: string,
  userId: number
): Promise<boolean> {
  try {
    // Verify the contest exists
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });
    if (!contest) {
      console.warn(
        `[rooms] contest ${contestId} not found — rejecting join for user ${userId}`
      );
      return false;
    }

    // Verify the user is a participant
    const participant = await prisma.contestParticipant.findUnique({
      where: {
        contest_id_user_id: {
          contest_id: contestId,
          user_id: userId,
        },
      },
    });

    if (!participant) {
      console.warn(
        `[rooms] user ${userId} is not enrolled in contest ${contestId} — rejecting join`
      );
      return false;
    }

    const room = roomNames.contest(contestId);
    await socket.join(room);
    console.log(
      `[rooms] user ${userId} (socket ${socket.id}) joined contest room "${room}"`
    );
    return true;
  } catch (err) {
    console.error(
      `[rooms] error joining contest ${contestId} for user ${userId}:`,
      err
    );
    return false;
  }
}

/**
 * Leave a contest room.
 */
export async function leaveContest(
  socket: Socket,
  contestId: string
): Promise<boolean> {
  try {
    const room = roomNames.contest(contestId);
    await socket.leave(room);
    console.log(
      `[rooms] socket ${socket.id} left contest room "${room}"`
    );
    return true;
  } catch (err) {
    console.error(
      `[rooms] error leaving contest ${contestId}:`,
      err
    );
    return false;
  }
}

// ---------------------------------------------------------------------------
// Notifications namespace helpers
// ---------------------------------------------------------------------------

/**
 * Join a user's personal notification room.
 *
 * Only the user themselves should join their own notification room; the
 * auth middleware guarantees socket.data.userId === userId at the call site.
 */
export async function joinNotificationRoom(
  socket: Socket,
  userId: number
): Promise<boolean> {
  try {
    const room = roomNames.notifications(userId);
    await socket.join(room);
    console.log(
      `[rooms] user ${userId} (socket ${socket.id}) joined notification room "${room}"`
    );
    return true;
  } catch (err) {
    console.error(
      `[rooms] error joining notification room for user ${userId}:`,
      err
    );
    return false;
  }
}

// ---------------------------------------------------------------------------
// Utility: enumerate room membership
// ---------------------------------------------------------------------------

/**
 * Return an array of socket IDs currently in a room.
 *
 * @param namespace  The Socket.IO Namespace instance
 * @param roomId     The full room name (e.g. "conversation:abc-123")
 */
export async function getUsersInRoom(
  namespace: Namespace,
  roomId: string
): Promise<string[]> {
  try {
    const sockets = await namespace.in(roomId).fetchSockets();
    return sockets.map((s) => s.id);
  } catch (err) {
    console.error(
      `[rooms] error fetching sockets in room "${roomId}":`,
      err
    );
    return [];
  }
}

// ---------------------------------------------------------------------------
// Utility: broadcast to a room, optionally excluding one socket
// ---------------------------------------------------------------------------

/**
 * Broadcast an event to every socket in a room, optionally excluding
 * the sender's own socket.
 *
 * @param namespace       The Socket.IO Namespace instance
 * @param roomId          Full room name
 * @param event           Event name
 * @param data            Event payload
 * @param excludeSocketId If provided, that socket will NOT receive the event
 */
export function broadcastToRoom(
  namespace: Namespace,
  roomId: string,
  event: string,
  data: unknown,
  excludeSocketId?: string
): void {
  if (excludeSocketId) {
    namespace.to(roomId).except(excludeSocketId).emit(event, data);
  } else {
    namespace.to(roomId).emit(event, data);
  }
  console.log(
    `[rooms] broadcast "${event}" to room "${roomId}"${excludeSocketId ? ` (excluding ${excludeSocketId})` : ""}`
  );
}
