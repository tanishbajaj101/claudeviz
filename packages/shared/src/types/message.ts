export type ConversationType = "direct" | "contest";
export type MessageType = "text" | "problem_recommendation" | "code_snippet" | "contest_invite";

export interface Conversation {
  id: string;
  type: ConversationType;
  contest_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ConversationWithParticipants extends Conversation {
  participants: {
    id: string;
    user_id: number;
    username: string;
    avatar: string;
    last_seen_message_id: string | null;
  }[];
  last_message?: {
    id: string;
    content: string;
    sender_id: number;
    sender_username: string;
    created_at: string;
  } | null;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: number;
  type: MessageType;
  content: string;
  metadata: string | null;
  created_at: Date | string;
}

export interface MessageWithSender extends Message {
  sender: {
    username: string;
    avatar: string;
  };
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: number;
  last_seen_message_id: string | null;
  joined_at: Date | string;
}
