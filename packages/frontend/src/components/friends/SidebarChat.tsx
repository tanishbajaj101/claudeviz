

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Maximize2, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFriends } from "./FriendsContext";
import { MessageRenderer } from "./MessageRenderer";
import { useChatSocket, useSocketEvent } from "../../hooks/useSocket";
import type { MessagePayload, MessageNewPayload } from "../../lib/socket/events";

import { api } from "../../lib/api-client";

interface ApiMessage {
    id: string;
    conversation_id: string;
    sender_id: number;
    sender_username: string;
    type: "text" | "problem_recommendation" | "code_snippet" | "contest_invite";
    content: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

interface MessagesResponse {
    messages: ApiMessage[];
    has_more: boolean;
    cursor: { before?: string };
}

function apiToPayload(m: ApiMessage): MessagePayload {
    return {
        id: m.id,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        senderUsername: m.sender_username,
        type: m.type,
        content: m.content,
        metadata: m.metadata,
        createdAt: m.created_at,
    };
}

export function SidebarChat() {
    const navigate = useNavigate();
    const {
        activeFriend,
        activeConversationId,
        setView,
        setActiveFriend,
        setActiveConversationId,
        setUnreadChatCount,
        refreshFriends,
        closeSidebar,
    } = useFriends();

    const { socket } = useChatSocket();
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [oldestCursor, setOldestCursor] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const mountedRef = useRef(true);

    const convId = activeConversationId;

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        if (!convId) return;
        try {
            const data = await api.get<MessagesResponse>(`/api/conversations/${convId}/messages?limit=40`);
            const msgs = data.messages.map(apiToPayload);
            if (mountedRef.current) {
                setMessages(msgs);
                setHasMore(data.has_more);
                setOldestCursor(data.cursor?.before ?? null);
            }
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [convId]);

    // Mark as read
    const markRead = useCallback(async () => {
        if (!convId) return;
        try {
            await api.post(`/api/conversations/${convId}/read`);
            // unread_update event from server will refresh the count
            refreshFriends();
        } catch { /* best effort */ }
    }, [convId, refreshFriends]);

    // Join chat room so we receive real-time message:new broadcasts
    useEffect(() => {
        if (!socket || !convId) return;
        socket.emit("conversation:join", { conversationId: convId }, (result) => {
            if (!result.ok) {
                console.warn("[SidebarChat] Failed to join conversation room:", result.error);
            }
        });
        return () => {
            socket.emit("conversation:leave", { conversationId: convId }, () => { });
        };
    }, [socket, convId]);

    // Load messages + mark read on mount
    useEffect(() => {
        mountedRef.current = true;
        setLoading(true);
        setMessages([]);
        void fetchMessages().then(() => void markRead());
        return () => { mountedRef.current = false; };
    }, [fetchMessages, markRead]);

    // Scroll to bottom on initial load
    useEffect(() => {
        if (!loading) {
            bottomRef.current?.scrollIntoView({ behavior: "instant" });
        }
    }, [loading]);

    // Real-time: new messages
    useSocketEvent(socket, "message:new", (payload) => {
        // The server emits ApiMessage (snake_case), so we need to map it
        const rawMsg = (payload as unknown as { message: ApiMessage }).message;
        const p = apiToPayload(rawMsg);
        if (p.conversationId !== convId) return;
        setMessages((prev) => {
            if (prev.some((m) => m.id === p.id)) return prev;
            return [...prev, p];
        });
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        // Mark as read immediately since sidebar is open
        void markRead();
    });

    // Load older messages
    const loadMore = async () => {
        if (!convId || !oldestCursor || loadingMore) return;
        setLoadingMore(true);
        const prevScrollHeight = scrollRef.current?.scrollHeight ?? 0;
        try {
            const data = await api.get<MessagesResponse>(`/api/conversations/${convId}/messages?before=${oldestCursor}&limit=30`);
            const msgs = data.messages.map(apiToPayload);
            setMessages((prev) => [...msgs, ...prev]);
            setHasMore(data.has_more);
            setOldestCursor(data.cursor?.before ?? null);
            // Restore scroll position
            requestAnimationFrame(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight;
                }
            });
        } finally {
            setLoadingMore(false);
        }
    };

    // Send a message
    const sendMessage = async () => {
        if (!text.trim() || !convId || sending) return;
        const content = text.trim();
        setText("");
        setSending(true);
        try {
            const data = await api.post<{ message: ApiMessage }>(`/api/conversations/${convId}/messages`, {
                type: "text",
                content,
            });
            const msg = apiToPayload(data.message);
            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        } finally {
            setSending(false);
        }
    };

    const handleBack = () => {
        setView("list");
        setActiveFriend(null);
        setActiveConversationId(null);
    };

    const handleExpand = () => {
        navigate(`/messages${convId ? `?conv=${convId}` : ""}`);
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-2 py-2.5 border-b border-border">
                <button
                    onClick={handleBack}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Back to friends"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>

                {activeFriend?.avatar_svg ? (
                    <div
                        className="h-7 w-7 rounded-full bg-zinc-700 overflow-hidden shrink-0"
                        dangerouslySetInnerHTML={{ __html: activeFriend.avatar_svg }}
                    />
                ) : (
                    <div className="h-7 w-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {activeFriend?.username[0]?.toUpperCase()}
                    </div>
                )}

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="truncate text-sm font-semibold text-foreground">
                        {activeFriend?.username}
                    </span>
                    {activeFriend?.last_problem_activity && (
                        <p className="truncate text-xs text-muted-foreground">
                            {activeFriend.last_problem_activity.status === "solved" ? "solved" : "solving"}{" "}
                            <a
                                href={`/problems/${activeFriend.last_problem_activity.problem_id}`}
                                className="text-emerald-400/80 hover:text-emerald-400"
                            >
                                {activeFriend.last_problem_activity.problem_name}
                            </a>
                            {activeFriend.last_problem_activity.status === "solving" && "..."}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleExpand}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Open full screen chat"
                >
                    <Maximize2 className="h-4 w-4" />
                </button>
                <button
                    onClick={closeSidebar}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5"
                onScroll={(e) => {
                    if (e.currentTarget.scrollTop === 0 && hasMore && !loadingMore) {
                        void loadMore();
                    }
                }}
            >
                {loadingMore && (
                    <div className="flex justify-center py-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                )}
                {loading ? (
                    <div className="flex h-full items-center justify-center py-8">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center py-8 text-muted-foreground">
                        <p className="text-sm">Say hello to {activeFriend?.username}!</p>
                    </div>
                ) : (
                    messages.map((m) => <MessageRenderer key={m.id} message={m} />)
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-2">
                <div className="flex items-end gap-2">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void sendMessage();
                            }
                        }}
                        placeholder="Message..."
                        rows={1}
                        className="flex-1 resize-none rounded-lg bg-muted/70 border border-border px-3 py-2 text-sm text-foreground placeholder-zinc-500 outline-none focus:border-emerald-500/60 transition-colors min-h-[36px] max-h-[100px]"
                    />
                    <button
                        onClick={() => void sendMessage()}
                        disabled={!text.trim() || sending}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                        aria-label="Send message"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
