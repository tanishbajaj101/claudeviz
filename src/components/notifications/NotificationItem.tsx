import { useState } from "react";
import { UserPlus, Trophy, CircleDot, CheckCircle2 } from "lucide-react";
import { DbNotification } from "./NotificationsDropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NotificationItem({
  notification,
  onUpdate,
  onRemove,
}: {
  notification: DbNotification;
  onUpdate: (id: string, is_read: boolean) => void;
  onRemove: (id: string) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionResult, setActionResult] = useState<string | null>(null);

  const { type, data, is_read } = notification;

  const markRead = async () => {
    if (is_read) return;
    try {
      await fetch(`/api/notifications/${notification.id}/read`, {
        method: "POST",
      });
      onUpdate(notification.id, true);
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
  };

  const handleFriendRespond = async (status: "accepted" | "rejected") => {
    setLoading(true);
    try {
      const friendRequestId = data.friend_request_id as string;
      if (!friendRequestId) {
        console.error("No friend request ID in notification data");
        return;
      }

      const endpoint =
        status === "accepted"
          ? `/api/friends/${friendRequestId}/accept`
          : `/api/friends/${friendRequestId}/reject`;

      const res = await fetch(endpoint, {
        method: "POST",
      });

      if (res.ok) {
        // Remove the notification from UI immediately
        onRemove(notification.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContestJoin = async () => {
    setLoading(true);
    try {
      const contestId = data.contest_id as string;
      const res = await fetch(`/api/contests/${contestId}/join`, {
        method: "POST",
      });
      if (res.ok) {
        setActionResult("Joined Contest!");
        markRead();
        router.push(`/contests/${contestId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!is_read) {
      if (type === "friend_online") {
        markRead();
      } else if (type === "friend_request_accepted") {
        markRead();
        const username = data.username as string;
        if (username) {
          router.push(`/profile/${username}`);
        }
      }
    }
  };

  return (
    <div
      className={`flex cursor-pointer flex-col gap-2 rounded-md p-3 transition-colors ${
        is_read
          ? "bg-transparent opacity-60 hover:bg-zinc-900/50"
          : "border-l-2 border-emerald-500 bg-zinc-900 hover:bg-zinc-800"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5 flex-shrink-0">
          {type === "friend_request" && (
            <UserPlus size={16} className="text-blue-400" />
          )}
          {type === "friend_online" && (
            <CircleDot size={16} className="fill-emerald-500 text-emerald-500" />
          )}
          {type === "friend_request_accepted" && (
            <CheckCircle2 size={16} className="text-emerald-400" />
          )}
          {type === "contest_invite" && (
            <Trophy size={16} className="text-yellow-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm text-zinc-200">
            {type === "friend_request" && (
              <span>
                <span className="font-semibold text-zinc-100">
                  {data.username as string}
                </span>{" "}
                sent you a friend request
              </span>
            )}
            {type === "friend_online" && (
              <Link
                href={`/profile/${data.username as string}`}
                className="hover:underline"
              >
                <span className="font-semibold text-zinc-100">
                  {data.username as string}
                </span>{" "}
                is now online
              </Link>
            )}
            {type === "friend_request_accepted" && (
              <span>
                <span className="font-semibold text-zinc-100">
                  {data.username as string}
                </span>{" "}
                accepted your friend request
              </span>
            )}
            {type === "contest_invite" && (
              <span>
                <span className="font-semibold text-zinc-100">
                  {data.inviter_username as string}
                </span>{" "}
                invited you to{" "}
                <span className="font-semibold text-zinc-100">
                  {data.contest_name as string}
                </span>
              </span>
            )}
          </p>

          <span className="mt-1 block text-xs text-zinc-500">
            {new Date(notification.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      {!is_read && !actionResult && (
        <div className="ml-7 mt-1 flex items-center gap-2">
          {type === "friend_request" && (
            <>
              <button
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFriendRespond("accepted");
                }}
                className="rounded bg-emerald-600/20 px-3 py-1 text-xs font-semibold text-emerald-500 transition-colors hover:bg-emerald-600/30 disabled:opacity-50"
              >
                Accept
              </button>
              <button
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFriendRespond("rejected");
                }}
                className="rounded px-3 py-1 text-xs font-semibold text-red-400 transition-colors hover:bg-red-400/10 disabled:opacity-50"
              >
                Decline
              </button>
            </>
          )}

          {type === "contest_invite" && (
            <>
              <button
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleContestJoin();
                }}
                className="rounded bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/30 disabled:opacity-50"
              >
                Join
              </button>
              <button
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  markRead();
                }}
                className="rounded px-3 py-1 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-800 disabled:opacity-50"
              >
                Dismiss
              </button>
            </>
          )}
        </div>
      )}

      {actionResult && (
        <div className="ml-7 font-mono text-xs font-semibold text-zinc-400">
          {actionResult}
        </div>
      )}
    </div>
  );
}

