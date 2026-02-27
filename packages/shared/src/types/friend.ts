export type FriendRequestStatus = "pending" | "accepted" | "rejected";

export interface FriendRequest {
  id: string;
  sender_id: number;
  receiver_id: number;
  status: FriendRequestStatus;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface FriendRequestWithUser extends FriendRequest {
  sender?: {
    username: string;
    avatar: string;
  };
  receiver?: {
    username: string;
    avatar: string;
  };
}

export interface Friend {
  id: number;
  username: string;
  avatar: string;
  is_online: boolean;
}
