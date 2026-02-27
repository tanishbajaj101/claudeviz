/**
 * Socket.IO event payload types shared across frontend components.
 */

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface MessagePayload {
    id: string;
    conversationId: string;
    senderId: number;
    senderUsername: string;
    type: 'text' | 'problem_recommendation' | 'code_snippet' | 'contest_invite';
    content: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
}

export interface MessageNewPayload {
    message: MessagePayload;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface UnreadUpdatePayload {
    unread_chat_count: number;
}

// ─── Contests ─────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
    user_id: number;
    username: string;
    total_score: number;
    problems_solved: number;
}

export interface LeaderboardUpdatePayload {
    contestId: string;
    leaderboard: LeaderboardEntry[];
}
