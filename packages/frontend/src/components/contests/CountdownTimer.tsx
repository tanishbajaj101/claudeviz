

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetTime: number; // timestamp in milliseconds
  label?: string;
  onComplete?: () => void;
}

export function CountdownTimer({ targetTime, label, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = targetTime - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete]);

  if (timeLeft <= 0) {
    return (
      <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{label || "Time's up!"}</span>
      </div>
    );
  }

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isUrgent = timeLeft < 300000; // Less than 5 minutes

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-4 w-4 ${isUrgent ? "text-red-400" : "text-emerald-400"}`} />
      <span
        className={`font-mono text-sm font-semibold ${
          isUrgent ? "text-red-400" : "text-emerald-400"
        }`}
      >
        {label && <span className="text-muted-foreground">{label}: </span>}
        {hours > 0 && `${hours}h `}
        {minutes}m {seconds}s
      </span>
    </div>
  );
}

interface LargeCountdownProps {
  targetTime: number;
  label: string;
  onComplete?: () => void;
}

export function LargeCountdown({ targetTime, label, onComplete }: LargeCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = targetTime - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete]);

  if (timeLeft <= 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <Clock className="mx-auto h-12 w-12 text-zinc-600" />
        <p className="mt-4 font-mono text-lg text-muted-foreground">Contest has started!</p>
      </div>
    );
  }

  const days = Math.floor(timeLeft / 86400000);
  const hours = Math.floor((timeLeft % 86400000) / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="mb-6 font-mono text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center justify-center gap-4">
        {days > 0 && (
          <div className="flex flex-col items-center">
            <span className="font-mono text-4xl font-bold text-emerald-400">
              {days}
            </span>
            <span className="mt-1 font-mono text-xs text-muted-foreground">DAYS</span>
          </div>
        )}
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl font-bold text-emerald-400">
            {String(hours).padStart(2, "0")}
          </span>
          <span className="mt-1 font-mono text-xs text-muted-foreground">HOURS</span>
        </div>
        <span className="font-mono text-4xl font-bold text-zinc-600">:</span>
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl font-bold text-emerald-400">
            {String(minutes).padStart(2, "0")}
          </span>
          <span className="mt-1 font-mono text-xs text-muted-foreground">MINUTES</span>
        </div>
        <span className="font-mono text-4xl font-bold text-zinc-600">:</span>
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl font-bold text-emerald-400">
            {String(seconds).padStart(2, "0")}
          </span>
          <span className="mt-1 font-mono text-xs text-muted-foreground">SECONDS</span>
        </div>
      </div>
    </div>
  );
}
