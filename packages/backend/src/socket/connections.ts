/**
 * Connection tracking utilities for AlgoArena Socket.IO.
 *
 * Maintains an in-memory map of userId → Set<socketId> so we can:
 *  - Broadcast to all of a user's open connections (multi-tab support)
 *  - Detect when a user goes fully offline (last socket disconnected)
 *  - Enumerate currently online users
 *
 * This is a single-process store; replace with Redis adapter if you
 * need multi-server support in the future.
 */

import type { Namespace } from 'socket.io';

// ---------------------------------------------------------------------------
// In-memory registry
// ---------------------------------------------------------------------------

/** userId → Set of active socketIds */
const onlineUsers = new Map<number, Set<string>>();

// ---------------------------------------------------------------------------
// Registration helpers (called from namespace connect/disconnect handlers)
// ---------------------------------------------------------------------------

/**
 * Register a new socket connection for a user.
 * Should be called from the "connection" event handler.
 */
export function registerConnection(userId: number, socketId: string): void {
  const existing = onlineUsers.get(userId);
  if (existing) {
    existing.add(socketId);
  } else {
    onlineUsers.set(userId, new Set([socketId]));
  }
  console.log(
    `[connections] user ${userId} connected (socket ${socketId}) — total sockets: ${onlineUsers.get(userId)!.size}`
  );
}

/**
 * Unregister a socket connection when it disconnects.
 * Returns true when this was the user's LAST connection (fully offline).
 */
export function unregisterConnection(
  userId: number,
  socketId: string
): boolean {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return true;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    console.log(
      `[connections] user ${userId} is now fully offline (socket ${socketId} was last)`
    );
    return true;
  }

  console.log(
    `[connections] socket ${socketId} disconnected for user ${userId} — remaining: ${sockets.size}`
  );
  return false;
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/** Return all socketIds currently open for a user */
export function getSocketIdsForUser(userId: number): string[] {
  return Array.from(onlineUsers.get(userId) ?? []);
}

/** Return true if a user has at least one open socket */
export function isUserOnline(userId: number): boolean {
  const sockets = onlineUsers.get(userId);
  return sockets !== undefined && sockets.size > 0;
}

/** Return all userIds that are currently online */
export function getOnlineUserIds(): number[] {
  return Array.from(onlineUsers.keys());
}

/** Return the total number of open socket connections */
export function getTotalConnectionCount(): number {
  let count = 0;
  for (const sockets of onlineUsers.values()) {
    count += sockets.size;
  }
  return count;
}

// ---------------------------------------------------------------------------
// Broadcast helpers
// ---------------------------------------------------------------------------

/**
 * Emit an event to ALL open sockets of a given user across a namespace.
 *
 * Useful for pushing notifications/messages to every tab the user has open.
 */
export function broadcastToUser<TEvents extends Record<string, unknown[]>>(
  namespace: Namespace,
  userId: number,
  event: string,
  ...args: unknown[]
): void {
  const socketIds = getSocketIdsForUser(userId);
  if (socketIds.length === 0) {
    console.log(
      `[connections] broadcastToUser: user ${userId} is not online, dropping event "${event}"`
    );
    return;
  }

  for (const socketId of socketIds) {
    namespace.to(socketId).emit(event, ...args);
  }

  console.log(
    `[connections] emitted "${event}" to user ${userId} (${socketIds.length} socket(s))`
  );
}

/**
 * Emit an event to all open sockets of multiple users
 */
export function broadcastToUsers(
  namespace: Namespace,
  userIds: number[],
  event: string,
  ...args: unknown[]
): void {
  for (const userId of userIds) {
    broadcastToUser(namespace, userId, event, ...args);
  }
}
