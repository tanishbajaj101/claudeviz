"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { MessageRenderer } from "./MessageRenderer";
import { useChatSocket, useSocketEvent } from "@/hooks/useSocket";
import type { MessagePayload, MessageNewPayload } from "@/lib/socket/events";

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

interface FullScreenChatProps {
    conversationId: string;
    otherUsername: string;
    onMarkRead?: () => void;
}

export function FullScreenChat({ conversationId, otherUsername, onMarkRead }: FullScreenChatProps) {
    const { socket } = useChatSocket();
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [oldestCursor, setOldestCursor] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const mountedRef = useRef(true);

    const markRead = useCallback(async () => {
        try {
            await fetch(`/api/conversations/${conversationId}/read`, { method: "POST" });
            onMarkRead?.();
        } catch { /* best effort */ }
    }, [conversationId, onMarkRead]);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages?limit=50`);
            if (!res.ok) return;
            const data = await res.json() as {
                messages: ApiMessage[];
                has_more: boolean;
                cursor: { before?: string };
            };
            const msgs = data.messages.map(apiToPayload);
            if (mountedRef.current) {
                setMessages(msgs);
                setHasMore(data.has_more);
                setOldestCursor(data.cursor?.before ?? null);
            }
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [conversationId]);

    // Join conversation room so we receive real-time broadcasts
    useEffect(() => {
        if (!socket || !conversationId) return;
        socket.emit("conversation:join", { conversationId }, (result) => {
            if (!result.ok) {
                console.warn("[FullScreenChat] Failed to join conversation room:", result.error);
            }
        });
        return () => {
            socket.emit("conversation:leave", { conversationId }, () => { });
        };
    }, [socket, conversationId]);


    useEffect(() => {
        mountedRef.current = true;
        setLoading(true);
        setMessages([]);
        setHasMore(false);
        setOldestCursor(null);
        void fetchMessages().then(() => void markRead());
        return () => { mountedRef.current = false; };
    }, [fetchMessages, markRead]);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "instant" }), 50);
        }
    }, [loading]);

    // Real-time new messages
    useSocketEvent(socket, "message:new", (payload) => {
        // The server emits ApiMessage (snake_case), so we need to map it
        const rawMsg = (payload as unknown as { message: ApiMessage }).message;
        const p = apiToPayload(rawMsg);
        if (p.conversationId !== conversationId) return;
        setMessages((prev) => {
            if (prev.some((m) => m.id === p.id)) return prev;
            return [...prev, p];
        });
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        void markRead();
    });

    const loadMore = async () => {
        if (!oldestCursor || loadingMore) return;
        setLoadingMore(true);
        const prevHeight = scrollRef.current?.scrollHeight ?? 0;
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages?before=${oldestCursor}&limit=30`);
            if (!res.ok) return;
            const data = await res.json() as {
                messages: ApiMessage[];
                has_more: boolean;
                cursor: { before?: string };
            };
            setMessages((prev) => [...data.messages.map(apiToPayload), ...prev]);
            setHasMore(data.has_more);
            setOldestCursor(data.cursor?.before ?? null);
            requestAnimationFrame(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevHeight;
                }
            });
        } finally {
            setLoadingMore(false);
        }
    };

    const sendMessage = async () => {
        if (!text.trim() || sending) return;
        const content = text.trim();
        setText("");
        setSending(true);
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "text", content }),
            });
            if (res.ok) {
                const data = await res.json() as { message: ApiMessage };
                const msg = apiToPayload(data.message);
                setMessages((prev) => {
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-zinc-800 px-6 py-3">
                <h2 className="font-semibold text-zinc-100">{otherUsername}</h2>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 py-4"
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
                    <div className="flex h-full items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                        <p className="text-sm">Say hello to {otherUsername}!</p>
                    </div>
                ) : (
                    messages.map((m) => <MessageRenderer key={m.id} message={m} />)
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 px-6 py-4">
                <div className="flex items-end gap-3">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void sendMessage();
                            }
                        }}
                        placeholder={`Message ${otherUsername}...`}
                        rows={1}
                        className="flex-1 resize-none rounded-xl bg-zinc-800/70 border border-zinc-700 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500/60 transition-colors min-h-[44px] max-h-[120px]"
                    />
                    <button
                        onClick={() => void sendMessage()}
                        disabled={!text.trim() || sending}
                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                        aria-label="Send message"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
