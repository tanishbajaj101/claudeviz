/**
 * Socket.IO event type definitions for AlgoArena.
 *
 * Defines all server-to-client (S2C) and client-to-server (C2S) event
 * payload interfaces, plus typed namespace event maps consumed by
 * server.ts and useSocket.ts.
 *
 * Import path: @/lib/socket/events
 */

// ---------------------------------------------------------------------------
// Shared payload types
// ---------------------------------------------------------------------------

export interface UserInfo {
  userId: number;
  username: string;
}

// ---------------------------------------------------------------------------
// Chat namespace (/chat)
// ---------------------------------------------------------------------------

/** A fully hydrated message delivered to clients. */
export interface MessagePayload {
  id: string;
  conversationId: string;
  senderId: number;
  senderUsername: string;
  type: "text" | "problem_recommendation" | "code_snippet" | "contest_invite";
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string; // ISO-8601
}

/** Server → Client: new message arrived in conversation. */
export interface MessageNewPayload {
  message: MessagePayload;
}

/** Server → Client: another user read messages up to a message. */
export interface MessageReadPayload {
  conversationId: string;
  userId: number;
  lastSeenMessageId: string;
}

/** Server → Client: a user is typing. */
export interface UserTypingPayload {
  conversationId: string;
  userId: number;
  username: string;
}

/** Client → Server: send a new message. */
export interface MessageSendPayload {
  conversationId: string;
  type: "text" | "problem_recommendation" | "code_snippet" | "contest_invite";
  content: string;
  metadata?: Record<string, unknown>;
}

/** Client → Server: mark messages as read. */
export interface MessageMarkReadPayload {
  conversationId: string;
  lastSeenMessageId: string;
}

/** Client → Server: user started typing. */
export interface TypingStartPayload {
  conversationId: string;
}

/** Client → Server: user stopped typing. */
export interface TypingStopPayload {
  conversationId: string;
}

// Chat server-to-client event map
export interface ChatServerToClientEvents {
  "message:new": (payload: MessageNewPayload) => void;
  "message:read": (payload: MessageReadPayload) => void;
  "user:typing": (payload: UserTypingPayload) => void;
}

// Chat client-to-server event map
export interface ChatClientToServerEvents {
  "message:send": (
    payload: MessageSendPayload,
    ack: (result: { ok: boolean; messageId?: string; error?: string }) => void
  ) => void;
  "message:markRead": (
    payload: MessageMarkReadPayload,
    ack: (result: { ok: boolean; error?: string }) => void
  ) => void;
  "typing:start": (payload: TypingStartPayload) => void;
  "typing:stop": (payload: TypingStopPayload) => void;
}

// ---------------------------------------------------------------------------
// Contests namespace (/contests)
// ---------------------------------------------------------------------------

/** Per-problem statistics in leaderboard. */
export interface LeaderboardPerProblem {
  problem_id: string;
  best_score: number;
  attempts: number;
}

/** Represents a single leaderboard row. */
export interface LeaderboardEntry {
  user_id: number;
  username: string;
  avatar_url: string | null;
  total_score: number;
  problems_solved: number;
  last_correct_at: string | null;
  per_problem: LeaderboardPerProblem[];
}

/** Server → Client: contest has just started. */
export interface ContestStartedPayload {
  contestId: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
}

/** Server → Client: 5-minute warning before contest ends. */
export interface ContestEndingPayload {
  contestId: string;
  endsAt: string;
  remainingMs: number;
}

/** Server → Client: contest has ended. */
export interface ContestEndedPayload {
  contestId: string;
  finalLeaderboard: LeaderboardEntry[];
}

/** Server → Client: a new submission was made (leaderboard hint). */
export interface SubmissionNewPayload {
  contestId: string;
  submission: {
    userId: number;
    username: string;
    problemId: string;
    isCorrect: boolean;
    score: number;
    submittedAt: string;
  };
}

/** Server → Client: leaderboard changed. */
export interface LeaderboardUpdatePayload {
  contestId: string;
  leaderboard: LeaderboardEntry[];
}

/** Client → Server: join a contest room. */
export interface ContestJoinPayload {
  contestId: string;
}

/** Client → Server: leave a contest room. */
export interface ContestLeavePayload {
  contestId: string;
}

// Contests server-to-client event map
export interface ContestServerToClientEvents {
  "contest:started": (payload: ContestStartedPayload) => void;
  "contest:ending": (payload: ContestEndingPayload) => void;
  "contest:ended": (payload: ContestEndedPayload) => void;
  "submission:new": (payload: SubmissionNewPayload) => void;
  "leaderboard:update": (payload: LeaderboardUpdatePayload) => void;
}

// Contests client-to-server event map
export interface ContestClientToServerEvents {
  "contest:join": (
    payload: ContestJoinPayload,
    ack: (result: { ok: boolean; error?: string }) => void
  ) => void;
  "contest:leave": (
    payload: ContestLeavePayload,
    ack: (result: { ok: boolean; error?: string }) => void
  ) => void;
}

// ---------------------------------------------------------------------------
// Notifications namespace (/notifications)
// ---------------------------------------------------------------------------

/** A fully hydrated notification. */
export interface NotificationPayload {
  id: string;
  type:
    | "friend_request"
    | "friend_request_accepted"
    | "friend_online"
    | "contest_invite"
    | "contest_starting";
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string; // ISO-8601
}

/** Server → Client: new notification. */
export interface NotificationNewPayload {
  notification: NotificationPayload;
}

/** Server → Client: notification was marked read. */
export interface NotificationReadPayload {
  notificationId: string;
}

/** Server → Client: a friend just came online. */
export interface FriendOnlinePayload {
  userId: number;
  username: string;
}

/** Server → Client: a friend just went offline. */
export interface FriendOfflinePayload {
  userId: number;
  username: string;
}

/** Server → Client: unread conversation count changed. */
export interface UnreadUpdatePayload {
  unread_chat_count: number;
}

// Notifications server-to-client event map
export interface NotificationServerToClientEvents {
  "notification:new": (payload: NotificationNewPayload) => void;
  "notification:read": (payload: NotificationReadPayload) => void;
  "friend:online": (payload: FriendOnlinePayload) => void;
  "friend:offline": (payload: FriendOfflinePayload) => void;
  "unread_update": (payload: UnreadUpdatePayload) => void;
}

// Notifications client-to-server event map — clients only listen here
export type NotificationClientToServerEvents = Record<string, never>;

// ---------------------------------------------------------------------------
// Shared inter-server events (used for Socket.IO adapter in future clustering)
// ---------------------------------------------------------------------------
export interface InterServerEvents {
  ping: () => void;
}

// ---------------------------------------------------------------------------
// Per-socket data (attached by auth middleware)
// ---------------------------------------------------------------------------
export interface SocketData {
  userId: number;
  username: string;
}
