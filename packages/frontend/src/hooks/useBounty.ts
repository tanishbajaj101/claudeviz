import { useEffect, useState } from "react";
import { useNotificationSocket, useSocketEvent } from "./useSocket";
import type { BountyInfo } from "@shared/types/socket";

interface UseBountyReturn {
  bounty: BountyInfo | null;
  loading: boolean;
  timeRemaining: number; // seconds until expiry, 0 if expired
}

export function useBounty(): UseBountyReturn {
  const [bounty, setBounty] = useState<BountyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { socket } = useNotificationSocket();

  // Fetch initial bounty on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/bounty/current")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.active) {
          const { active: _active, ...info } = data as { active: true } & BountyInfo;
          setBounty(info);
        } else {
          setBounty(null);
        }
      })
      .catch(() => setBounty(null))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Listen for new bounty activations via socket
  useSocketEvent(socket, "bounty:new", (payload: unknown) => {
    setBounty(payload as BountyInfo);
  });

  // Update countdown every second while bounty is active
  useEffect(() => {
    if (!bounty) {
      setTimeRemaining(0);
      return;
    }

    const update = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(bounty.expiresAt).getTime() - Date.now()) / 1000)
      );
      setTimeRemaining(remaining);
      if (remaining === 0) setBounty(null);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [bounty]);

  return { bounty, loading, timeRemaining };
}

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
