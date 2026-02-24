"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { useSession } from "next-auth/react";

export interface DbNotification {
    id: number;
    user_id: number;
    type: string;
    payload: any;
    read: boolean;
    created_at: string;
}

export function NotificationsDropdown() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<DbNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
            }
        } catch (e) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        if (!session?.user?.dbUserId) return;

        fetchNotifications();

        const handleNewNotification = () => {
            fetchNotifications();
        };

        window.addEventListener("notification:new", handleNewNotification);
        return () => window.removeEventListener("notification:new", handleNewNotification);
    }, [session?.user?.dbUserId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            const res = await fetch("/api/notifications/read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ all: true })
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateNotification = (id: number, read: boolean) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read } : n));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-md border border-zinc-800 bg-zinc-950 shadow-xl z-50 overflow-hidden flex flex-col max-h-[400px]">
                    <div className="flex items-center justify-between border-b border-zinc-800 p-3 bg-zinc-900/50">
                        <h3 className="font-semibold text-zinc-100 font-mono text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-mono"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1 p-2">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                                <Bell size={24} className="mb-2 opacity-20" />
                                <p className="text-sm">You&apos;re all caught up!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onUpdate={handleUpdateNotification}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
