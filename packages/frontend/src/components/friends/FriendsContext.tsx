

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../hooks/useSocket";
import type { UnreadUpdatePayload } from "../../lib/socket/events";
import { api } from "../../lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FriendEntry {
    id: number;
    username: string;
    avatar_svg: string | null;
    is_online: boolean;
    last_active: string | null;
    last_problem_activity: {
        problem_id: string;
        problem_name: string;
        status: "solved" | "solving";
    } | null;
    has_unread: boolean;
    /** Resolved once when the friend is clicked — filled lazily */
    conversation_id?: string;
}

export type SidebarView = "list" | "search" | "chat";

interface FriendsContextValue {
    isSidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;

    view: SidebarView;
    setView: (v: SidebarView) => void;

    activeFriend: FriendEntry | null;
    setActiveFriend: (f: FriendEntry | null) => void;
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;

    unreadChatCount: number;
    setUnreadChatCount: (n: number) => void;

    /** Refresh the friend list (e.g. after marking a conversation read) */
    refreshFriends: () => void;
    friendsRefreshToken: number;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const FriendsContext = createContext<FriendsContextValue | null>(null);

export function useFriends(): FriendsContextValue {
    const ctx = useContext(FriendsContext);
    if (!ctx) throw new Error("useFriends must be used within FriendsProvider");
    return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function FriendsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { socket } = useSocket("/notifications");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [view, setView] = useState<SidebarView>("list");
    const [activeFriend, setActiveFriend] = useState<FriendEntry | null>(null);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const [friendsRefreshToken, setFriendsRefreshToken] = useState(0);

    const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
    const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
    const refreshFriends = useCallback(() => setFriendsRefreshToken((t) => t + 1), []);

// Fetch initial unread count
    useEffect(() => {
        if (!user?.id) return;
        api.get<{ unread_count: number }>("/api/conversations/unread-count")
            .then((data) => {
                if (typeof data.unread_count === "number") {
                    setUnreadChatCount(data.unread_count);
                }
            })
            .catch(() => { });
    }, [user?.id]);

    // Listen for real-time unread updates
    useEffect(() => {
        if (!socket) return;
        const handler = (payload: UnreadUpdatePayload) => {
            setUnreadChatCount(payload.unread_chat_count);
        };
        socket.on("unread_update", handler);
        return () => {
            socket.off("unread_update", handler);
        };
    }, [socket]);

    return (
        <FriendsContext.Provider
            value={{
                isSidebarOpen,
                openSidebar,
                closeSidebar,
                toggleSidebar,
                view,
                setView,
                activeFriend,
                setActiveFriend,
                activeConversationId,
                setActiveConversationId,
                unreadChatCount,
                setUnreadChatCount,
                refreshFriends,
                friendsRefreshToken,
            }}
        >
            {children}
        </FriendsContext.Provider>
    );
}
