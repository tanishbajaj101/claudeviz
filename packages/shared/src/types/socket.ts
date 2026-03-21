// Socket.IO event payload types for AlgoArena

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

export interface MessageNewPayload {
  message: MessagePayload;
}

export interface MessageReadPayload {
  conversationId: string;
  userId: number;
  lastSeenMessageId: string;
}

export interface UserTypingPayload {
  conversationId: string;
  userId: number;
  username: string;
}

export interface MessageSendPayload {
  conversationId: string;
  type: "text" | "problem_recommendation" | "code_snippet" | "contest_invite";
  content: string;
  metadata?: Record<string, unknown>;
}

export interface MessageMarkReadPayload {
  conversationId: string;
  lastSeenMessageId: string;
}

export interface TypingStartPayload {
  conversationId: string;
}

export interface TypingStopPayload {
  conversationId: string;
}

export interface ConversationJoinPayload {
  conversationId: string;
}

export interface ConversationLeavePayload {
  conversationId: string;
}

export interface ChatServerToClientEvents {
  "message:new": (payload: MessageNewPayload) => void;
  "message:read": (payload: MessageReadPayload) => void;
  "user:typing": (payload: UserTypingPayload) => void;
}

export interface ChatClientToServerEvents {
  "message:send": (
    payload: MessageSendPayload,
    ack: (result: { ok: boolean; messageId?: string; error?: string }) => void
  ) => void;
  "message:markRead": (
    payload: MessageMarkReadPayload,
    ack: (result: { ok: boolean; error?: string }) => void
  ) => void;
  "conversation:join": (
    payload: ConversationJoinPayload,
    ack: (result: { ok: boolean; error?: string }) => void
  ) => void;
  "conversation:leave": (
    payload: ConversationLeavePayload,
    ack: (result: { ok: boolean; error?: string }) => void
  ) => void;
  "typing:start": (payload: TypingStartPayload) => void;
  "typing:stop": (payload: TypingStopPayload) => void;
}

// ---------------------------------------------------------------------------
// Contests namespace (/contests)
// ---------------------------------------------------------------------------

export interface LeaderboardPerProblem {
  problem_id: string;
  best_score: number;
  attempts: number;
}

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  avatar_url: string | null;
  total_score: number;
  problems_solved: number;
  last_correct_at: string | null;
  per_problem: LeaderboardPerProblem[];
}

export interface ContestStartedPayload {
  contestId: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
}

export interface ContestEndingPayload {
  contestId: string;
  endsAt: string;
  remainingMs: number;
}

export interface ContestEndedPayload {
  contestId: string;
  finalLeaderboard: LeaderboardEntry[];
}

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

export interface LeaderboardUpdatePayload {
  contestId: string;
  leaderboard: LeaderboardEntry[];
}

export interface ContestJoinPayload {
  contestId: string;
}

export interface ContestLeavePayload {
  contestId: string;
}

export interface ContestServerToClientEvents {
  "contest:started": (payload: ContestStartedPayload) => void;
  "contest:ending": (payload: ContestEndingPayload) => void;
  "contest:ended": (payload: ContestEndedPayload) => void;
  "submission:new": (payload: SubmissionNewPayload) => void;
  "leaderboard:update": (payload: LeaderboardUpdatePayload) => void;
}

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

export interface NotificationNewPayload {
  notification: NotificationPayload;
}

export interface NotificationReadPayload {
  notificationId: string;
}

export interface FriendOnlinePayload {
  userId: number;
  username: string;
}

export interface FriendOfflinePayload {
  userId: number;
  username: string;
}

export interface UnreadUpdatePayload {
  unread_chat_count: number;
}

export interface BountyInfo {
  problemId: string;
  problemTitle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  startsAt: string;   // ISO-8601
  expiresAt: string;  // ISO-8601
  bonusXp: number;
}

export interface NotificationServerToClientEvents {
  "notification:new": (payload: NotificationNewPayload) => void;
  "notification:read": (payload: NotificationReadPayload) => void;
  "friend:online": (payload: FriendOnlinePayload) => void;
  "friend:offline": (payload: FriendOfflinePayload) => void;
  "unread_update": (payload: UnreadUpdatePayload) => void;
  "bounty:new": (payload: BountyInfo) => void;
}

export type NotificationClientToServerEvents = Record<string, never>;

// ---------------------------------------------------------------------------
// Shared inter-server events
// ---------------------------------------------------------------------------
export interface InterServerEvents {
  ping: () => void;
}

// ---------------------------------------------------------------------------
// Per-socket data
// ---------------------------------------------------------------------------
export interface SocketData {
  userId: number;
  username: string;
}
