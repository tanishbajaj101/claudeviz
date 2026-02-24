"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { ConversationList } from "@/components/friends/ConversationList";
import { FullScreenChat } from "@/components/friends/FullScreenChat";
import { useSession } from "next-auth/react";
import { useNotificationSocket, useSocketEvent } from "@/hooks/useSocket";

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

function MessagesPageInner() {
    const searchParams = useSearchParams();
    const initialConvId = searchParams.get("conv");
    const { data: session } = useSession();
    const { socket } = useNotificationSocket();

    const [activeConv, setActiveConv] = useState<ConversationItem | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);

    // Pre-select from query param
    useEffect(() => {
        if (!initialConvId) return;
        fetch("/api/conversations")
            .then((r) => r.json())
            .then((data: { conversations: ConversationItem[] }) => {
                const conv = data.conversations?.find((c) => c.id === initialConvId);
                if (conv) setActiveConv(conv);
            })
            .catch(() => { });
    }, [initialConvId]);

    const handleMarkRead = () => {
        setRefreshToken((t) => t + 1);
    };

    // Refresh conversation list on unread updates
    useSocketEvent(socket, "unread_update", () => {
        setRefreshToken((t) => t + 1);
    });

    if (!session?.user) {
        return (
            <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-zinc-500">
                <p>Please sign in to view messages.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-3.5rem)] bg-zinc-950">
            {/* Left panel — conversation list */}
            <div className="w-80 shrink-0 border-r border-zinc-800 flex flex-col">
                <div className="border-b border-zinc-800 px-4 py-3">
                    <h1 className="font-mono font-semibold text-zinc-100">Messages</h1>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ConversationList
                        key={refreshToken}
                        activeConvId={activeConv?.id ?? null}
                        onSelect={(conv) => setActiveConv(conv)}
                    />
                </div>
            </div>

            {/* Right panel — active thread */}
            <div className="flex-1 overflow-hidden">
                {activeConv ? (
                    <FullScreenChat
                        key={activeConv.id}
                        conversationId={activeConv.id}
                        otherUsername={activeConv.other_participant?.username ?? "Unknown"}
                        onMarkRead={handleMarkRead}
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500">
                        <MessageSquare className="h-12 w-12 opacity-20" />
                        <p className="text-sm">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                </div>
            }
        >
            <MessagesPageInner />
        </Suspense>
    );
}
