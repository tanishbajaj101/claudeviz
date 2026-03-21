

import { useEffect, useState } from "react";
import { X, UserPlus, CircleDot, Trophy, Flame } from "lucide-react";
import { useNotificationSocket, useSocketEvent } from "../../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import type { BountyInfo } from "@shared/types/socket";

interface Toast {
  id: string;
  type: "friend_online" | "friend_request" | "contest_invite" | "friend_request_accepted" | "bounty";
  data: Record<string, unknown>;
  created_at: string;
}

export function ToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { socket } = useNotificationSocket();
  const navigate = useNavigate();

  // Listen for new notifications via Socket.IO
  // The event payload is { notification: { id, type, data, is_read, created_at } }
  useSocketEvent(socket, "notification:new", (payload: unknown) => {
    const wrapped = payload as { notification?: { id: string; type: string; data: Record<string, unknown>; created_at: string } };
    const notification = wrapped.notification ?? (payload as { id: string; type: string; data: Record<string, unknown>; created_at: string });

    // Only show toasts for specific notification types
    if (
      notification.type === "friend_request" ||
      notification.type === "contest_invite" ||
      notification.type === "friend_request_accepted"
    ) {
      const toast: Toast = {
        id: notification.id,
        type: notification.type as Toast["type"],
        data: notification.data,
        created_at: notification.created_at,
      };

      setToasts((prev) => {
        // Deduplicate
        if (prev.some((t) => t.id === toast.id)) return prev;
        return [...prev, toast];
      });
    }
  });

  // Listen for bounty:new events
  useSocketEvent(socket, "bounty:new", (payload: unknown) => {
    const bounty = payload as BountyInfo;
    const toastId = `bounty-${bounty.problemId}-${Date.now()}`;
    const toast: Toast = {
      id: toastId,
      type: "bounty",
      data: {
        problemId: bounty.problemId,
        problemTitle: bounty.problemTitle,
        bonusXp: bounty.bonusXp,
      },
      created_at: new Date().toISOString(),
    };
    setToasts((prev) => {
      if (prev.some((t) => t.type === "bounty")) return prev; // deduplicate
      return [...prev, toast];
    });
  });

  // Listen for ephemeral friend:online events (separate from notification:new)
  useSocketEvent(socket, "friend:online", (payload: unknown) => {
    const data = payload as { user_id: number; username: string };
    const toastId = `friend-online-${data.user_id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const toast: Toast = {
      id: toastId,
      type: "friend_online",
      data: { username: data.username, user_id: data.user_id },
      created_at: new Date().toISOString(),
    };
    setToasts((prev) => [...prev, toast]);
    // Auto-dismiss friend_online toasts after 7 seconds
    setTimeout(() => {
      removeToast(toastId);
    }, 7000);
  });

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToastClick = (toast: Toast) => {
    removeToast(toast.id);

    // Navigate based on type
    if (toast.type === "bounty") {
      const problemId = toast.data.problemId as string;
      if (problemId) navigate(`/problems/${problemId}`);
      return;
    }
    if (toast.type === "friend_request") {
      const username = toast.data.sender_username as string;
      if (username) {
        navigate(`/profile/${username}`);
      }
    } else if (toast.type === "friend_request_accepted") {
      const username = toast.data.username as string;
      if (username) {
        navigate(`/profile/${username}`);
      }
    } else if (toast.type === "contest_invite") {
      const contestId = toast.data.contest_id as string;
      if (contestId) {
        navigate(`/contests/${contestId}`);
      }
    } else if (toast.type === "friend_online") {
      const username = toast.data.username as string;
      if (username) {
        navigate(`/profile/${username}`);
      }
    }
  };

  // Only show the most recent 5 toasts
  const visibleToasts = toasts.slice(-5);

  if (visibleToasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[100] flex flex-col gap-2">
      {visibleToasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
          onClick={() => handleToastClick(toast)}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
  onClick: () => void;
}

function ToastItem({ toast, onDismiss, onClick }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(onClick, 300);
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case "friend_online":
        return "border-emerald-500/30 bg-primary/10";
      case "friend_request":
        return "border-blue-500/30 bg-blue-500/10";
      case "friend_request_accepted":
        return "border-emerald-500/30 bg-primary/10";
      case "contest_invite":
        return "border-purple-500/30 bg-purple-500/10";
      case "bounty":
        return "border-amber-500/50 bg-amber-500/10";
      default:
        return "border-border bg-card";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "friend_online":
        return <CircleDot size={18} className="fill-emerald-500 text-primary" />;
      case "friend_request":
        return <UserPlus size={18} className="text-blue-400" />;
      case "friend_request_accepted":
        return <UserPlus size={18} className="text-emerald-400" />;
      case "contest_invite":
        return <Trophy size={18} className="text-purple-400" />;
      case "bounty":
        return <Flame size={18} className="text-amber-400" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    const username = toast.data.username as string;
    const senderUsername = toast.data.sender_username as string;
    const contestName = toast.data.contest_name as string;
    const inviterName = toast.data.inviter_name as string;

    switch (toast.type) {
      case "friend_online":
        return (
          <>
            <span className="font-semibold text-foreground">{username}</span> just came
            online!
          </>
        );
      case "friend_request":
        return (
          <>
            <span className="font-semibold text-foreground">{senderUsername}</span> sent you a
            friend request!
          </>
        );
      case "friend_request_accepted":
        return (
          <>
            <span className="font-semibold text-foreground">{username}</span> accepted
            your friend request!
          </>
        );
      case "contest_invite":
        return (
          <>
            You've been invited to{" "}
            <span className="font-semibold text-foreground">{contestName}</span> by{" "}
            <span className="font-semibold text-foreground">{inviterName}</span>!
          </>
        );
      case "bounty": {
        const title = toast.data.problemTitle as string;
        const bonusXp = toast.data.bonusXp as number;
        return (
          <>
            <span className="font-semibold text-amber-400">Bounty Active!</span> Solve{" "}
            <span className="font-semibold text-foreground">{title}</span> for{" "}
            <span className="font-semibold text-amber-400">+{bonusXp} XP</span>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      className={`pointer-events-auto w-80 cursor-pointer rounded-lg border p-4 shadow-2xl transition-all duration-300 ${getToastStyle()} ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      onClick={handleClick}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <p className="font-mono text-sm text-foreground">{getMessage()}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
