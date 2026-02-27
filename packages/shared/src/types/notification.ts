export type NotificationType =
  | "friend_request"
  | "friend_request_accepted"
  | "friend_online"
  | "contest_invite"
  | "contest_starting";

export interface Notification {
  id: string;
  user_id: number;
  type: NotificationType;
  data: string;
  is_read: boolean;
  created_at: Date | string;
}

export interface NotificationWithData extends Omit<Notification, 'data'> {
  data: Record<string, unknown>;
}
