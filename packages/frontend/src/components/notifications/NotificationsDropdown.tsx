

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { useAuth } from "../../contexts/AuthContext";
import { useNotificationSocket, useSocketEvent } from "../../hooks/useSocket";

export interface DbNotification {
  id: string;
  user_id: number;
  type: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export function NotificationsDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { socket } = useNotificationSocket();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error("Failed to fetch notifications");
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unread_count || 0);
      }
    } catch (e) {
      console.error("Failed to fetch unread count");
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    fetchUnreadCount();
  }, [user?.id]);

  // Listen for new notifications via Socket.IO
  // The event payload shape is { notification: NotificationRecord }
  useSocketEvent(socket, "notification:new", (payload: unknown) => {
    const wrapped = payload as { notification?: DbNotification } | DbNotification;
    // Handle both wrapped ({ notification: ... }) and unwrapped payloads
    const notification = "notification" in wrapped && wrapped.notification
      ? wrapped.notification
      : wrapped as DbNotification;
    if (!notification.id) return; // guard against malformed payloads
    setNotifications((prev) => {
      // Deduplicate by id
      if (prev.some((n) => n.id === notification.id)) return prev;
      return [notification, ...prev];
    });
    setUnreadCount((prev) => prev + 1);
  });

  // Listen for notification read events
  useSocketEvent(socket, "notification:read", (payload: unknown) => {
    const { notificationId } = payload as { notificationId: string };
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateNotification = (id: string, is_read: boolean) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read } : n))
    );
    if (is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification && !notification.is_read) {
        setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 flex max-h-[400px] w-80 flex-col overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-3">
            <h3 className="font-mono text-sm font-semibold text-zinc-100">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="font-mono text-xs text-emerald-500 transition-colors hover:text-emerald-400"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                <Bell size={24} className="mb-2 opacity-20" />
                <p className="text-sm">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onUpdate={handleUpdateNotification}
                    onRemove={handleRemoveNotification}
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

