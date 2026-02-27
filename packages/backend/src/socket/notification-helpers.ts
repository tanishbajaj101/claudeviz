/**
 * Notification helper functions for Socket.IO emission.
 *
 * Centralizes all real-time notification delivery so API routes and
 * server-side code emit to the correct personal notification rooms
 * without duplicating the namespace-accessor + roomNames pattern.
 *
 * All functions are best-effort: they wrap Socket.IO calls in try/catch
 * so callers never crash when the Socket.IO server is not running
 * (build time, tests, CLI scripts).
 */

import { prisma } from '../lib/prisma.js';
import { getNotificationsNamespace } from './index.js';
import { roomNames } from './rooms.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape of a notification record as delivered to clients */
export interface NotificationRecord {
  id: string;
  type: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string; // ISO-8601
}

// ---------------------------------------------------------------------------
// Core notification emission
// ---------------------------------------------------------------------------

/**
 * Emit a `notification:new` event to a user's personal notification room.
 *
 * The notification payload is fully formed before calling this — the DB write
 * must happen at the call site (API route) before emitting.
 */
export function emitNotification(
  userId: number,
  notification: NotificationRecord
): void {
  try {
    const nsp = getNotificationsNamespace();
    nsp
      .to(roomNames.notifications(userId))
      .emit('notification:new', { notification });
    console.log(
      `[notification-helpers] emitted notification:new (type=${notification.type}) to user ${userId}`
    );
  } catch (err) {
    console.warn(
      '[notification-helpers] emitNotification skipped (Socket.IO not running):',
      err instanceof Error ? err.message : err
    );
  }
}

// ---------------------------------------------------------------------------
// Friend presence broadcast
// ---------------------------------------------------------------------------

/**
 * Look up all accepted friends of userId and emit `friend:online` to each
 * friend's personal notification room.
 *
 * Does NOT create a persistent Notification record — presence events are
 * ephemeral (socket-only).
 */
export async function broadcastFriendOnline(
  userId: number,
  username: string
): Promise<void> {
  try {
    const friendIds = await getAcceptedFriendIds(userId);
    if (friendIds.length === 0) return;

    const nsp = getNotificationsNamespace();
    const payload = { user_id: userId, username };

    for (const friendId of friendIds) {
      nsp.to(roomNames.notifications(friendId)).emit('friend:online', payload);
    }

    console.log(
      `[notification-helpers] friend:online emitted for ${username} to ${friendIds.length} friend(s)`
    );
  } catch (err) {
    console.warn(
      '[notification-helpers] broadcastFriendOnline skipped:',
      err instanceof Error ? err.message : err
    );
  }
}

/**
 * Look up all accepted friends of userId and emit `friend:offline` to each
 * friend's personal notification room.
 *
 * Does NOT create a persistent Notification record.
 */
export async function broadcastFriendOffline(
  userId: number,
  username: string
): Promise<void> {
  try {
    const friendIds = await getAcceptedFriendIds(userId);
    if (friendIds.length === 0) return;

    const nsp = getNotificationsNamespace();
    const payload = { user_id: userId, username };

    for (const friendId of friendIds) {
      nsp.to(roomNames.notifications(friendId)).emit('friend:offline', payload);
    }

    console.log(
      `[notification-helpers] friend:offline emitted for ${username} to ${friendIds.length} friend(s)`
    );
  } catch (err) {
    console.warn(
      '[notification-helpers] broadcastFriendOffline skipped:',
      err instanceof Error ? err.message : err
    );
  }
}

// ---------------------------------------------------------------------------
// Unread message count
// ---------------------------------------------------------------------------

/**
 * Calculate how many conversations have unread messages for a user.
 *
 * A conversation is "unread" when the user's last_seen_message_id differs
 * from the latest message in the conversation (or is null with messages present).
 */
export async function getUnreadConversationCount(
  userId: number
): Promise<number> {
  const memberships = await prisma.conversationParticipant.findMany({
    where: { user_id: userId },
    select: {
      last_seen_message_id: true,
      conversation: {
        select: {
          messages: {
            orderBy: { created_at: 'desc' },
            take: 1,
            select: { id: true },
          },
        },
      },
    },
  });

  return memberships.reduce((count, membership) => {
    const latestMessage = membership.conversation.messages[0] ?? null;
    if (!latestMessage) return count;
    const isUnread = membership.last_seen_message_id !== latestMessage.id;
    return isUnread ? count + 1 : count;
  }, 0);
}

/**
 * Emit `unread_update` to a user's personal notification room with the
 * current number of conversations containing unread messages.
 */
export async function emitUnreadUpdate(userId: number): Promise<void> {
  try {
    const unreadChatCount = await getUnreadConversationCount(userId);
    const nsp = getNotificationsNamespace();
    nsp
      .to(roomNames.notifications(userId))
      .emit('unread_update', { unread_chat_count: unreadChatCount });
    console.log(
      `[notification-helpers] unread_update emitted to user ${userId} (count=${unreadChatCount})`
    );
  } catch (err) {
    console.warn(
      '[notification-helpers] emitUnreadUpdate skipped:',
      err instanceof Error ? err.message : err
    );
  }
}

// ---------------------------------------------------------------------------
// Contest invite Socket.IO emission
// ---------------------------------------------------------------------------

/**
 * Emit `notification:new` for a contest_invite to all invited users.
 *
 * The DB Notification records must already exist before calling this
 * (created by sendContestInvites in contest-helpers.ts).
 *
 * @param notifications - Array of { notificationId, userId, data } tuples
 *   describing each invite notification that was just persisted.
 */
export function emitContestInviteNotifications(
  notifications: Array<{
    notificationId: string;
    userId: number;
    data: {
      contest_id: string;
      contest_name: string;
      inviter_name: string;
      starts_at: string;
    };
    createdAt: string;
  }>
): void {
  try {
    const nsp = getNotificationsNamespace();
    for (const item of notifications) {
      const notification: NotificationRecord = {
        id: item.notificationId,
        type: 'contest_invite',
        data: item.data,
        is_read: false,
        created_at: item.createdAt,
      };
      nsp
        .to(roomNames.notifications(item.userId))
        .emit('notification:new', { notification });
    }
    console.log(
      `[notification-helpers] contest invite notifications emitted to ${notifications.length} user(s)`
    );
  } catch (err) {
    console.warn(
      '[notification-helpers] emitContestInviteNotifications skipped:',
      err instanceof Error ? err.message : err
    );
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Return the user IDs of all accepted friends of the given user (bidirectional) */
async function getAcceptedFriendIds(userId: number): Promise<number[]> {
  const friendRequests = await prisma.friendRequest.findMany({
    where: {
      status: 'accepted',
      OR: [{ sender_id: userId }, { receiver_id: userId }],
    },
    select: { sender_id: true, receiver_id: true },
  });

  return friendRequests.map((fr) =>
    fr.sender_id === userId ? fr.receiver_id : fr.sender_id
  );
}
