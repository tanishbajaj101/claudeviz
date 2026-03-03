import { useState, useEffect, useCallback } from "react";
import { useNotificationSocket, useSocketEvent } from "../../hooks/useSocket";
import { api } from "../../lib/api-client";

interface ConversationItem {
    id: string;
    type: "direct" | "contest";
    other_participant: {
        id: number;
        username: string;
        avatar_svg: string | null;
    } | null;
    latest_message: {
        content: string;
        type: string;
        sender_username: string;
        created_at: string;
    } | null;
    is_unread: boolean;
    updated_at: string;
}

interface ConversationListProps {
    activeConvId: string | null;
    onSelect: (conv: ConversationItem) => void;
}

function formatTime(iso: string) {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 24) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function truncatePreview(conv: ConversationItem): string {
    const msg = conv.latest_message;
    if (!msg) return "No messages yet";
    if (msg.type === "text") return `${msg.sender_username}: ${msg.content}`.slice(0, 50);
    if (msg.type === "problem_recommendation") return `${msg.sender_username}: sent a problem`;
    if (msg.type === "code_snippet") return `${msg.sender_username}: sent code`;
    if (msg.type === "contest_invite") return `${msg.sender_username}: contest invite`;
    return msg.content.slice(0, 50);
}

export function ConversationList({ activeConvId, onSelect }: ConversationListProps) {
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useNotificationSocket();

    const fetchConversations = useCallback(async () => {
        try {
            const data = await api.get<{ conversations: ConversationItem[] }>("/api/conversations");
            setConversations(data.conversations ?? []);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchConversations();
    }, [fetchConversations]);

    // Refresh on unread_update
    useSocketEvent(socket, "unread_update", () => {
        void fetchConversations();
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2 p-4">
                <p className="text-sm text-center">No conversations yet. Open a friend chat from the sidebar.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-0.5 p-2 overflow-y-auto h-full">
            {conversations.map((conv) => {
                const other = conv.other_participant;
                const isActive = conv.id === activeConvId;
                return (
                    <button
                        key={conv.id}
                        onClick={() => onSelect(conv)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${isActive ? "bg-zinc-700/60" : "hover:bg-zinc-800/50"
                            }`}
                    >
                        {/* Avatar */}
                        {other?.avatar_svg ? (
                            <div
                                className="h-10 w-10 rounded-full bg-zinc-700 overflow-hidden shrink-0"
                                dangerouslySetInnerHTML={{ __html: other.avatar_svg }}
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-300 shrink-0">
                                {(other?.username ?? "?")[0]?.toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <span className={`truncate text-sm ${conv.is_unread ? "font-bold text-zinc-100" : "font-medium text-zinc-200"}`}>
                                    {other?.username ?? "Unknown"}
                                </span>
                                <span className="ml-1 shrink-0 text-[10px] text-zinc-500">
                                    {conv.latest_message ? formatTime(conv.latest_message.created_at) : ""}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className={`truncate text-xs ${conv.is_unread ? "text-zinc-300" : "text-zinc-500"}`}>
                                    {truncatePreview(conv)}
                                </p>
                                {conv.is_unread && (
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
