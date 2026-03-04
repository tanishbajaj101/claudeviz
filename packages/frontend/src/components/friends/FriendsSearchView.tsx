

import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFriends } from "./FriendsContext";

interface SearchUser {
    id: number;
    username: string;
    avatar_svg: string | null;
    is_friend: boolean;
    friend_request_status: "none" | "pending_sent" | "pending_received";
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export function FriendsSearchView() {
    const { setView } = useFriends();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        fetch(`/api/users/search?q=${encodeURIComponent(debouncedQuery)}`)
            .then((r) => r.json())
            .then((data: { users: SearchUser[] }) => setResults(data.users ?? []))
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-1 pl-0.5 pr-3 py-3 border-b border-border">
                <button
                    onClick={() => setView("list")}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Back to friends list"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users..."
                    className="flex-1 bg-muted/60 border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-zinc-500 outline-none focus:border-emerald-500/60 transition-colors"
                />
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                ) : !debouncedQuery.trim() ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <p className="text-sm">Type to search</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <p className="text-sm">No users found</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-0.5">
                        {results.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => navigate(`/profile/${user.username}`)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left opacity-60 hover:opacity-80 transition-opacity hover:bg-muted/40"
                            >
                                {/* Avatar */}
                                {user.avatar_svg ? (
                                    <div
                                        className="h-9 w-9 rounded-full bg-zinc-700 overflow-hidden shrink-0"
                                        dangerouslySetInnerHTML={{ __html: user.avatar_svg }}
                                    />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                                        {user.username[0]?.toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-foreground">{user.username}</p>
                                    {user.is_friend && (
                                        <p className="text-xs text-muted-foreground">Already friends</p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
