/**
 * Socket.IO infrastructure re-exports for AlgoArena.
 *
 * Import path: @/lib/socket
 *
 * Server-side usage:
 *   import { getSocketServer, getChatNamespace, getNotificationsNamespace } from "@/lib/socket";
 *
 * Event types:
 *   import type { MessageNewPayload, NotificationPayload } from "@/lib/socket";
 *
 * Room helpers:
 *   import { joinConversation, joinContest, broadcastToRoom, roomNames } from "@/lib/socket";
 *
 * Connection tracking:
 *   import { isUserOnline, broadcastToUser, getOnlineUserIds } from "@/lib/socket";
 */

// Server setup
export {
  getSocketServer,
  getChatNamespace,
  getContestsNamespace,
  getNotificationsNamespace,
} from "./server";

// Authentication middleware
export { socketAuthMiddleware } from "./auth";

// Room management
export {
  roomNames,
  joinConversation,
  leaveConversation,
  joinContest,
  leaveContest,
  joinNotificationRoom,
  getUsersInRoom,
  broadcastToRoom,
} from "./rooms";

// Connection tracking
export {
  registerConnection,
  unregisterConnection,
  getSocketIdsForUser,
  isUserOnline,
  getOnlineUserIds,
  getTotalConnectionCount,
  broadcastToUser,
  broadcastToUsers,
} from "./connections";

// Notification helpers (server-side emission utilities)
export {
  emitNotification,
  broadcastFriendOnline,
  broadcastFriendOffline,
  emitUnreadUpdate,
  emitContestInviteNotifications,
  getUnreadConversationCount,
} from "./notification-helpers";
export type { NotificationRecord } from "./notification-helpers";

// All event type definitions
export type {
  // Shared
  UserInfo,
  SocketData,
  InterServerEvents,
  // Chat
  MessagePayload,
  MessageNewPayload,
  MessageReadPayload,
  UserTypingPayload,
  MessageSendPayload,
  MessageMarkReadPayload,
  TypingStartPayload,
  TypingStopPayload,
  ChatServerToClientEvents,
  ChatClientToServerEvents,
  // Contests
  LeaderboardEntry,
  ContestStartedPayload,
  ContestEndingPayload,
  ContestEndedPayload,
  SubmissionNewPayload,
  LeaderboardUpdatePayload,
  ContestJoinPayload,
  ContestLeavePayload,
  ContestServerToClientEvents,
  ContestClientToServerEvents,
  // Notifications
  NotificationPayload,
  NotificationNewPayload,
  NotificationReadPayload,
  FriendOnlinePayload,
  FriendOfflinePayload,
  UnreadUpdatePayload,
  NotificationServerToClientEvents,
  NotificationClientToServerEvents,
} from "./events";
