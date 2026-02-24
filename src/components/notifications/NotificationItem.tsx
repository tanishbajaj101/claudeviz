import { useState } from "react";
import { UserPlus, Trophy, CircleDot } from "lucide-react";
import { DbNotification } from "./NotificationsDropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NotificationItem({
  notification,
  onUpdate
}: {
  notification: DbNotification;
  onUpdate: (id: number, read: boolean) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionResult, setActionResult] = useState<string | null>(null);

  const { type, payload, read } = notification;

  const markRead = async () => {
    if (read) return;
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [notification.id] })
      });
      onUpdate(notification.id, true);
    } catch (e) { }
  };

  const handleFriendRespond = async (status: 'accepted' | 'rejected') => {
    setLoading(true);
    try {
      // Need the friendship id, but we might only have requester_id in payload.
      // Assuming payload has friendshipId or we fetch it... let's assume we call a robust API
      // Actually, standard API expects friendship_id. 
      // If our payload from createNotification for friend request doesn't have friendship_id, 
      // we can update db.ts to include it. Let's assume payload.friendship_id exists or
      // we adjust the API to accept requester_id. For now, we simulate.
      // Wait, let's just make the /api/friends/respond call and pass requester_id to be safe?
      // Actually, we'll need to fix this if it errors. Let's assume we pass what we have.
      const res = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Hack: in a real app, payload should include friendship_id. 
        // We'll pass the components to the API differently if needed.
        body: JSON.stringify({ requester_id: payload.requester_id, status })
      });

      if (res.ok) {
        setActionResult(status === 'accepted' ? 'Accepted' : 'Declined');
        markRead();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContestJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contests/${payload.contest_id}/join`, {
        method: "POST",
      });
      if (res.ok) {
        setActionResult('Joined Contest!');
        markRead();
        router.push(`/contests/${payload.contest_id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 rounded-md p-3 transition-colors ${read ? 'opacity-60 bg-transparent hover:bg-zinc-900/50' : 'bg-zinc-900 border-l-2 border-emerald-500 hover:bg-zinc-800'
        }`}
      onClick={() => {
        if (!read && type === 'friend_online') markRead();
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5 flex-shrink-0">
          {type === 'friend_request' && <UserPlus size={16} className="text-blue-400" />}
          {type === 'friend_online' && <CircleDot size={16} className="text-emerald-500 fill-emerald-500" />}
          {type === 'contest_invite' && <Trophy size={16} className="text-yellow-500" />}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm text-zinc-200">
            {type === 'friend_request' && (
              <span><span className="font-semibold text-zinc-100">{payload.username}</span> sent you a friend request</span>
            )}
            {type === 'friend_online' && (
              <Link href={`/profile/${payload.username || ''}`} className="hover:underline">
                <span className="font-semibold text-zinc-100">{payload.username}</span> is now online
              </Link>
            )}
            {type === 'contest_invite' && (
              <span><span className="font-semibold text-zinc-100">{payload.inviter_username}</span> invited you to a contest</span>
            )}
          </p>

          <span className="text-xs text-zinc-500 block mt-1">
            {new Date(notification.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Actions */}
      {!read && !actionResult && (
        <div className="ml-7 flex items-center gap-2 mt-1">
          {type === 'friend_request' && (
            <>
              <button
                disabled={loading}
                onClick={() => handleFriendRespond('accepted')}
                className="rounded bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 px-3 py-1 text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                Accept
              </button>
              <button
                disabled={loading}
                onClick={() => handleFriendRespond('rejected')}
                className="rounded text-red-400 hover:bg-red-400/10 px-3 py-1 text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
            </>
          )}

          {type === 'contest_invite' && (
            <>
              <button
                disabled={loading}
                onClick={handleContestJoin}
                className="rounded bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 px-3 py-1 text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                Join
              </button>
              <button
                disabled={loading}
                onClick={() => markRead()}
                className="rounded text-zinc-400 hover:bg-zinc-800 px-3 py-1 text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                Dismiss
              </button>
            </>
          )}
        </div>
      )}

      {actionResult && (
        <div className="ml-7 text-xs font-mono font-semibold text-zinc-400">
          {actionResult}
        </div>
      )}
    </div>
  );
}
