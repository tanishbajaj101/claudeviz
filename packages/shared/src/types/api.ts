// API request/response types

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiSuccess<T = void> {
  success: true;
  data?: T;
  message?: string;
}

export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;

// Auth API
export interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    avatar: string;
  };
  token: string;
}

export interface SessionResponse {
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    avatar: string;
  } | null;
}

// User API
export interface UserSearchParams {
  query: string;
}

export interface UserActivityResponse {
  last_active: string | null;
  last_opened_problem_id: string | null;
}

// Friends API
export interface SendFriendRequestBody {
  username: string;
}

export interface RespondToFriendRequestBody {
  requestId: string;
  accept: boolean;
}

// Contest API
export interface CreateContestBody {
  title: string;
  is_public: boolean;
  starts_at: string;
  duration_minutes: number;
  problem_count?: number;
  difficulties?: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface JoinContestBody {
  contestId: string;
}

export interface SubmitContestProblemBody {
  contestId: string;
  problemId: string;
  sourceCode: string;
}

// Conversation API
export interface CreateDirectConversationBody {
  user_id: number;
}

export interface SendMessageBody {
  conversationId: string;
  type: "text" | "problem_recommendation" | "code_snippet" | "contest_invite";
  content: string;
  metadata?: Record<string, unknown>;
}

export interface MarkMessagesReadBody {
  conversationId: string;
  messageId: string;
}

export interface GetMessagesParams {
  conversationId: string;
  cursor?: string;
  limit?: number;
}

// Notification API
export interface NotificationListResponse {
  notifications: Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
    is_read: boolean;
    created_at: string;
  }>;
}

export interface UnreadCountResponse {
  unread_count: number;
}
