

import { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useFriends, type FriendEntry } from "./FriendsContext";

function formatLastActive(lastActive: string | null): string {
    if (!lastActive) return "long ago";
    // SQLite returns "YYYY-MM-DD HH:MM:SS" in UTC.
    // If we parse it directly, JS might assume local time.
    // Replace space with "T" and append "Z" to force UTC parsing.
    const safeDateStr = lastActive.replace(" ", "T") + (lastActive.includes("Z") ? "" : "Z");
    const diff = Date.now() - new Date(safeDateStr).getTime();

    // Prevent negative diffs due to slight clock skews
    const safeDiff = Math.max(0, diff);

    const minutes = Math.floor(safeDiff / (1000 * 60));
    const hours = Math.floor(safeDiff / (1000 * 60 * 60));
    const days = Math.floor(safeDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${weeks}w`;
}

interface FriendItemProps {
    friend: FriendEntry;
    onClick: () => void;
}

function FriendItem({ friend, onClick }: FriendItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-zinc-800/60 ${friend.has_unread ? "bg-zinc-800/40" : ""
                }`}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                {friend.avatar_svg ? (
                    <div
                        className="h-9 w-9 rounded-full bg-zinc-700 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: friend.avatar_svg }}
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-300">
                        {friend.username[0]?.toUpperCase()}
                    </div>
                )}
                {friend.is_online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 bg-emerald-500" />
                )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <span className={`truncate text-sm ${friend.has_unread ? "font-bold text-zinc-100" : "font-medium text-zinc-200"}`}>
                        {friend.username}
                    </span>
                    {friend.has_unread && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                </div>
                {!friend.is_online && friend.last_active && (
                    <p className="text-xs text-zinc-500">Active {formatLastActive(friend.last_active)} ago</p>
                )}
                {friend.last_problem_activity && (
                    <p className="truncate text-xs text-zinc-500">
                        {friend.last_problem_activity.status === "solved" ? "solved" : "solving"}{" "}
                        <Link
                            to={`/problems/${friend.last_problem_activity.problem_id}`}
                            className="text-emerald-400/80 hover:text-emerald-400"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {friend.last_problem_activity.problem_name}
                        </Link>
                        {friend.last_problem_activity.status === "solving" && "..."}
                    </p>
                )}
            </div>
        </button>
    );
}

export function FriendsListView() {
    const { setView, setActiveFriend, setActiveConversationId, friendsRefreshToken } = useFriends();
    const [friends, setFriends] = useState<FriendEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const mountedRef = useRef(true);

    const fetchFriends = useCallback(async () => {
        try {
            const res = await fetch("/api/friends");
            if (!res.ok) return;
            const data = await res.json() as { friends: FriendEntry[] };
            if (mountedRef.current) setFriends(data.friends ?? []);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        setLoading(true);
        void fetchFriends();
        return () => { mountedRef.current = false; };
    }, [fetchFriends, friendsRefreshToken]);

    const handleFriendClick = async (friend: FriendEntry) => {
        setActiveFriend(friend);
        // Get or create a direct conversation
        try {
            const res = await fetch(`/api/conversations/direct?user_id=${friend.id}`);
            if (res.ok) {
                const data = await res.json() as { conversation: { id: string } };
                setActiveConversationId(data.conversation.id);
            }
        } catch {
            // fallback — conversation ID will be null, chat will show error state
        }
        setView("chat");
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <h2 className="font-semibold text-zinc-100 font-mono">Friends</h2>
                <button
                    onClick={() => setView("search")}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                    aria-label="Search users"
                >
                    <Search className="h-4 w-4" />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                ) : friends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-2">
                        <p className="text-sm">No friends yet</p>
                        <p className="text-xs text-center">Search for users to add friends</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-0.5">
                        {friends.map((f) => (
                            <FriendItem key={f.id} friend={f} onClick={() => void handleFriendClick(f)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
