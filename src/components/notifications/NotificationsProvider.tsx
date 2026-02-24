"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";

export interface ToastMessage {
  id: string;
  message: string;
  type?: "default" | "success" | "info";
  duration?: number;
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { socket } = useSocket("/notifications");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: "default" | "success" | "info" = "default", duration = 7000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (!socket || !session?.user?.dbUserId) return;

    const handleFriendOnline = (data: { userId: number; username: string }) => {
      addToast(`${data.username} just came online!`, "success", 7000);
    };

    const handleNotificationNew = () => {
      // Dispatch a custom event that the Bell icon component can listen to
      window.dispatchEvent(new Event("notification:new"));
      addToast("You have a new notification", "info", 5000);
    };

    socket.on("friend:online", handleFriendOnline);
    socket.on("notification:new", handleNotificationNew);

    return () => {
      socket.off("friend:online", handleFriendOnline);
      socket.off("notification:new", handleNotificationNew);
    };
  }, [socket, session?.user?.dbUserId]);

  return (
    <>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 7000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div className="relative overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-zinc-200 shadow-lg animate-in slide-in-from-right-full w-80">
      <div className="flex items-center gap-3">
        {toast.type === "success" && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
        {toast.type === "info" && <div className="h-2 w-2 rounded-full bg-blue-500" />}
        {toast.type === "default" && <div className="h-2 w-2 rounded-full bg-zinc-500" />}
        <span>{toast.message}</span>
      </div>
      {/* Visual progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-emerald-500/50"
        style={{
          width: "100%",
          animation: `shrink ${toast.duration}ms linear forwards`
        }}
      />
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
