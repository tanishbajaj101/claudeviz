

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useFriends } from "./FriendsContext";
import { FriendsListView } from "./FriendsListView";
import { FriendsSearchView } from "./FriendsSearchView";
import { SidebarChat } from "./SidebarChat";

export function FriendsSidebar() {
    const { isSidebarOpen, closeSidebar, view } = useFriends();
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSidebar();
        };
        if (isSidebarOpen) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isSidebarOpen, closeSidebar]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                closeSidebar();
            }
        };
        if (isSidebarOpen) {
            // Delay so the opening click doesn't immediately close it
            const t = setTimeout(() => document.addEventListener("mousedown", handler), 50);
            return () => {
                clearTimeout(t);
                document.removeEventListener("mousedown", handler);
            };
        }
    }, [isSidebarOpen, closeSidebar]);

    return (
        <>
            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20"
                    aria-hidden="true"
                />
            )}

            {/* Panel */}
            <div
                ref={panelRef}
                className={`fixed right-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-[22rem] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-200 ease-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                aria-label="Friends sidebar"
            >
                {/* Close button */}
                <button
                    onClick={closeSidebar}
                    className="absolute right-3 top-2.5 z-10 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* View switcher */}
                <div className="flex h-full flex-col">
                    {view === "list" && <FriendsListView />}
                    {view === "search" && <FriendsSearchView />}
                    {view === "chat" && <SidebarChat />}
                </div>
            </div>
        </>
    );
}
