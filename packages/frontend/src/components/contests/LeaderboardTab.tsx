

import { useState, useEffect } from "react";
import { Trophy, Loader2 } from "lucide-react";
import { useContestSocket, useSocketEvent } from "../../hooks/useSocket";
import type { LeaderboardEntry, LeaderboardUpdatePayload } from "../../lib/socket/events";

interface LeaderboardTabProps {
  contestId: string;
  currentUserId?: number;
}

export function LeaderboardTab({ contestId, currentUserId }: LeaderboardTabProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useContestSocket();

  // Fetch initial leaderboard
  useEffect(() => {
    fetch(`/api/contests/${contestId}/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[LeaderboardTab] Error fetching leaderboard:", err);
        setLoading(false);
      });
  }, [contestId]);

  // Join contest room when socket connects
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("contest:join", { contestId }, (result) => {
        if (!result.ok) {
          console.error("[LeaderboardTab] Failed to join room:", result.error);
        }
      });

      return () => {
        socket.emit("contest:leave", { contestId }, () => {});
      };
    }
  }, [socket, isConnected, contestId]);

  // Listen for leaderboard updates
  useSocketEvent(socket, "leaderboard:update", (payload: unknown) => {
    const data = payload as LeaderboardUpdatePayload;
    if (data.contestId === contestId) {
      setLeaderboard(data.leaderboard);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
        <Trophy className="mx-auto h-12 w-12 text-zinc-600" />
        <p className="mt-4 text-sm text-zinc-400">
          No submissions yet. Be the first to solve a problem!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-800 bg-zinc-950">
            <tr>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-zinc-400">
                Rank
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-zinc-400">
                User
              </th>
              <th className="px-4 py-3 text-right font-mono text-xs font-medium text-zinc-400">
                Score
              </th>
              <th className="px-4 py-3 text-right font-mono text-xs font-medium text-zinc-400">
                Solved
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => {
              const isCurrentUser = currentUserId && entry.user_id === currentUserId;
              const rankColor =
                index === 0
                  ? "text-yellow-400"
                  : index === 1
                    ? "text-zinc-300"
                    : index === 2
                      ? "text-amber-600"
                      : "text-zinc-500";

              return (
                <tr
                  key={entry.user_id}
                  className={`border-b border-zinc-800 transition-colors hover:bg-zinc-800 ${
                    isCurrentUser ? "bg-emerald-500/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`font-mono text-sm font-semibold ${rankColor}`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-sm ${
                          isCurrentUser ? "font-semibold text-emerald-400" : "text-zinc-300"
                        }`}
                      >
                        {entry.username}
                      </span>
                      {isCurrentUser && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-xs text-emerald-400">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm font-semibold text-emerald-400">
                      {entry.total_score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm text-zinc-400">
                      {entry.problems_solved}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
