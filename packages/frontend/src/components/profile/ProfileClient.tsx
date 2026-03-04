

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { UserPlus, Check, Clock, Loader2, MessageSquare } from "lucide-react";
import { api } from "../../lib/api-client";

interface UserProfile {
  user: {
    id: number;
    username: string;
    avatar_svg: string;
    created_at: string;
    friendship_status: "self" | "friends" | "pending_sent" | "pending_received" | "none";
  };
  stats: {
    total_problems_solved: number;
    problems_solved_24h: number;
    problems_solved_7d: number;
    problems_solved_30d: number;
    total_submissions: number;
    accuracy: number;
  };
  activity_heatmap: Array<{ date: string; count: number }>;
}

type StatPeriod = "24h" | "7d" | "30d";

interface ProfileClientProps {
  userId?: number;
}

export function ProfileClient({ userId }: ProfileClientProps) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statPeriod, setStatPeriod] = useState<StatPeriod>("7d");
  const [friendActionLoading, setFriendActionLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  // Determine which user ID to fetch
  const targetUserId = userId ?? user?.id;

  useEffect(() => {
    // If no userId prop and not authenticated, redirect to sign in
    if (!userId && !user && !authLoading) {
      navigate("/auth/signin");
      return;
    }

    if (authLoading) return;

    // If no target user ID, wait
    if (!targetUserId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${targetUserId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId, userId, authLoading, navigate]);

  const cycleStat = () => {
    setStatPeriod((prev) => {
      if (prev === "7d") return "30d";
      if (prev === "30d") return "24h";
      return "7d";
    });
  };

  const handleAddFriend = async () => {
    if (!profile) return;
    setFriendActionLoading(true);
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: targetUserId }),
      });
      if (res.ok) {
        // Refresh profile to update friendship status
        const refreshRes = await fetch(`/api/users/${targetUserId}`);
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setProfile(data);
        }
      }
    } catch (err) {
      console.error("Failed to send friend request:", err);
    } finally {
      setFriendActionLoading(false);
    }
  };

  const handleAcceptFriend = async () => {
    if (!profile) return;
    setFriendActionLoading(true);
    try {
      // Fetch pending requests to get the friend request ID
      const requestsRes = await fetch("/api/friends/requests");
      if (!requestsRes.ok) {
        throw new Error("Failed to fetch friend requests");
      }
      const requestsData = await requestsRes.json();

      // Find the request from this user
      const request = requestsData.received.find(
        (req: { sender_id: number }) => req.sender_id === targetUserId
      );

      if (!request) {
        throw new Error("Friend request not found");
      }

      // Accept the request
      const acceptRes = await fetch(`/api/friends/${request.id}/accept`, {
        method: "POST",
      });

      if (acceptRes.ok) {
        // Refresh profile to update friendship status
        const refreshRes = await fetch(`/api/users/${targetUserId}`);
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setProfile(data);
        }
      }
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    } finally {
      setFriendActionLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!targetUserId) return;
    setMessageLoading(true);
    try {
      const data = await api.get<{ conversation: { id: string } }>(
        `/api/conversations/direct?user_id=${targetUserId}`
      );
      navigate(`/messages?conv=${data.conversation.id}`);
    } catch (err) {
      console.error("Failed to open conversation:", err);
    } finally {
      setMessageLoading(false);
    }
  };

  if (authLoading === "loading" || loading) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="font-mono text-sm text-red-400">{error || "Profile not found"}</p>
      </main>
    );
  }

  const { user: profileUser, stats, activity_heatmap } = profile;
  const isOwnProfile = profileUser.friendship_status === "self";

  const currentSolvedCount =
    statPeriod === "24h"
      ? stats.problems_solved_24h
      : statPeriod === "7d"
        ? stats.problems_solved_7d
        : stats.problems_solved_30d;

  const periodLabel =
    statPeriod === "24h" ? "24 hours" : statPeriod === "7d" ? "7 days" : "30 days";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Profile header */}
      <div className="mb-8 flex items-start justify-between rounded-lg border border-border bg-card/50 p-6">
        <div className="flex items-center gap-4">
          <img
            src={`/api/users/avatar?username=${profileUser.username}`}
            alt={`${profileUser.username}'s avatar`}
            className="h-20 w-20 rounded-full"
          />
          <div>
            <h1 className="font-mono text-2xl font-bold text-foreground">
              @{profileUser.username}
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              Member since {new Date(profileUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Friend action button */}
        {!isOwnProfile && (
          <div>
            {profileUser.friendship_status === "friends" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-primary/10 px-4 py-2 text-emerald-400">
                  <Check size={16} />
                  <span className="font-mono text-sm font-medium">Friends</span>
                </div>
                <button
                  onClick={handleMessage}
                  disabled={messageLoading}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {messageLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <MessageSquare size={16} />
                  )}
                  Message
                </button>
              </div>
            )}
            {profileUser.friendship_status === "pending_sent" && (
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-4 py-2 text-muted-foreground">
                <Clock size={16} />
                <span className="font-mono text-sm">Request Sent</span>
              </div>
            )}
            {profileUser.friendship_status === "pending_received" && (
              <button
                onClick={handleAcceptFriend}
                disabled={friendActionLoading}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50"
              >
                {friendActionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <UserPlus size={16} />
                )}
                Accept Request
              </button>
            )}
            {profileUser.friendship_status === "none" && (
              <button
                onClick={handleAddFriend}
                disabled={friendActionLoading}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50"
              >
                {friendActionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <UserPlus size={16} />
                )}
                Add Friend
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <p className="font-mono text-xs text-muted-foreground">Total Solved</p>
          <p className="font-mono text-3xl font-bold text-emerald-400">
            {stats.total_problems_solved}
          </p>
        </div>

        <button
          onClick={cycleStat}
          className="cursor-pointer rounded-lg border border-border bg-card/50 p-4 text-left transition-all hover:border-emerald-500/30 hover:bg-muted/50"
          title="Click to cycle through time periods"
        >
          <p className="font-mono text-xs text-muted-foreground">
            Solved ({periodLabel})
          </p>
          <p className="font-mono text-3xl font-bold text-muted-foreground">
            {currentSolvedCount}
          </p>
          <p className="mt-1 font-mono text-xs text-zinc-600">
            Click to change period ↻
          </p>
        </button>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <p className="font-mono text-xs text-muted-foreground">Submissions</p>
          <p className="font-mono text-3xl font-bold text-muted-foreground">
            {stats.total_submissions}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <p className="font-mono text-xs text-muted-foreground">Accuracy</p>
          <p className="font-mono text-3xl font-bold text-muted-foreground">
            {(stats.accuracy * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Activity heatmap */}
      <div className="mb-8">
        <ActivityHeatmap heatmap={activity_heatmap} />
      </div>
    </main>
  );
}
