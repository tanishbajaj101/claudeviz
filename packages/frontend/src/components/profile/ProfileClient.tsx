

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { UserPlus, Check, Clock, Loader2, MessageSquare, Trophy, Pencil } from "lucide-react";
import { api, API_BASE_URL } from "../../lib/api-client";

interface UserProfile {
  user: {
    id: number;
    username: string;
    avatar_svg: string;
    created_at: string;
    friendship_status: "self" | "friends" | "pending_sent" | "pending_received" | "none";
    bio: string | null;
  };
  stats: {
    total_problems_solved: number;
    problems_solved_7d: number;
    problems_solved_30d: number;
    total_submissions: number;
    accuracy: number;
    xp: number;
    easy_solved: number;
    medium_solved: number;
    hard_solved: number;
  };
  activity_heatmap: Array<{ date: string; count: number }>;
  mutual_friends: Array<{ id: number; username: string; avatar_svg: string }>;
}

type StatPeriod = "7d" | "30d" | "all";
type ProfileTab = "overview" | "contests";

interface ContestHistoryItem {
  id: string;
  title: string;
  starts_at: string;
  score: number;
  rank: number;
  total_participants: number;
  status: "upcoming" | "active" | "completed";
}

interface ProfileClientProps {
  userId?: number;
}

function DifficultyRing({
  easy,
  medium,
  hard,
  total,
  currentCount,
  period,
  onPeriodChange,
}: {
  easy: number;
  medium: number;
  hard: number;
  total: number;
  currentCount: number;
  period: StatPeriod;
  onPeriodChange: (p: StatPeriod) => void;
}) {
  const r = 38;
  const circumference = 2 * Math.PI * r;

  const easyFrac = total > 0 ? easy / total : 0;
  const mediumFrac = total > 0 ? medium / total : 0;
  const hardFrac = total > 0 ? hard / total : 0;

  const easyLen = easyFrac * circumference;
  const mediumLen = mediumFrac * circumference;
  const hardLen = hardFrac * circumference;

  const easyOffset = 0;
  const mediumOffset = easyLen;
  const hardOffset = easyLen + mediumLen;

  const gap = total > 0 ? 1 : 0;

  const cyclePeriod = () => {
    if (period === "7d") onPeriodChange("30d");
    else if (period === "30d") onPeriodChange("all");
    else onPeriodChange("7d");
  };

  const periodLabel = period === "7d" ? "7 days" : period === "30d" ? "30 days" : "all time";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex-shrink-0 cursor-pointer" onClick={cyclePeriod} title="Click to cycle through time periods">
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-border"
          />
          {total > 0 && (
            <>
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray={`${Math.max(0, easyLen - gap)} ${circumference - Math.max(0, easyLen - gap)}`}
                strokeDashoffset={-easyOffset}
                strokeLinecap="butt"
              />
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="#eab308"
                strokeWidth="8"
                strokeDasharray={`${Math.max(0, mediumLen - gap)} ${circumference - Math.max(0, mediumLen - gap)}`}
                strokeDashoffset={-mediumOffset}
                strokeLinecap="butt"
              />
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeDasharray={`${Math.max(0, hardLen - gap)} ${circumference - Math.max(0, hardLen - gap)}`}
                strokeDashoffset={-hardOffset}
                strokeLinecap="butt"
              />
            </>
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xl font-bold text-foreground">{currentCount}</span>
        </div>
      </div>
      <span className="mt-1 font-mono text-[10px] text-emerald-400">{periodLabel} ↻</span>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-zinc-700/10 text-muted-foreground border-border/20",
};

const STATUS_LABELS: Record<string, string> = {
  upcoming: "Upcoming",
  active: "Live",
  completed: "Completed",
};

function ContestHistoryRow({ contest }: { contest: ContestHistoryItem }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3 hover:bg-card transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            to={`/contests/${contest.id}`}
            className="font-mono text-sm font-medium text-foreground hover:text-emerald-400 transition-colors truncate"
          >
            {contest.title}
          </Link>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${STATUS_STYLES[contest.status] ?? STATUS_STYLES.completed}`}>
            {STATUS_LABELS[contest.status] ?? contest.status}
          </span>
        </div>
        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
          {new Date(contest.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
      <div className="ml-6 flex shrink-0 items-center gap-6">
        <div className="text-right">
          <p className="font-mono text-[10px] text-muted-foreground">Score</p>
          <p className="font-mono text-sm font-semibold text-emerald-400">{contest.score}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-muted-foreground">Rank</p>
          <p className="font-mono text-sm font-semibold text-foreground">
            #{contest.rank}{" "}
            <span className="font-normal text-muted-foreground">/ {contest.total_participants}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

interface FriendRequestsResponse {
  received: Array<{ id: string; sender_id: number }>;
  sent: Array<{ id: string; receiver_id: number }>;
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
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [contestHistory, setContestHistory] = useState<ContestHistoryItem[] | null>(null);
  const [contestsLoading, setContestsLoading] = useState(false);
  const [contestsError, setContestsError] = useState<string | null>(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState('');
  const [bioSaving, setBioSaving] = useState(false);

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
        const data = await api.get<UserProfile>(`/api/users/${targetUserId}`);
        setProfile(data);
        setBioValue(data.user.bio ?? '');
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId, userId, authLoading, navigate]);

  useEffect(() => {
    if (activeTab !== "contests" || contestHistory !== null || !targetUserId) return;
    const fetchContests = async () => {
      setContestsLoading(true);
      setContestsError(null);
      try {
        const data = await api.get<{ contests: ContestHistoryItem[] }>(
          `/api/contests/history/${targetUserId}`
        );
        setContestHistory(data.contests);
      } catch (err: any) {
        setContestsError(err.message || "Failed to load contest history");
      } finally {
        setContestsLoading(false);
      }
    };
    void fetchContests();
  }, [activeTab, contestHistory, targetUserId]);

  const handleAddFriend = async () => {
    if (!profile) return;
    setFriendActionLoading(true);
    try {
      await api.post("/api/friends", { receiver_id: targetUserId });
      // Refresh profile to update friendship status
      const data = await api.get<UserProfile>(`/api/users/${targetUserId}`);
      setProfile(data);
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
      const requestsData = await api.get<FriendRequestsResponse>("/api/friends/requests");

      // Find the request from this user
      const request = requestsData.received.find(
        (req) => req.sender_id === targetUserId
      );

      if (!request) {
        throw new Error("Friend request not found");
      }

      // Accept the request
      await api.post(`/api/friends/${request.id}/accept`);

      // Refresh profile to update friendship status
      const data = await api.get<UserProfile>(`/api/users/${targetUserId}`);
      setProfile(data);
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

  const handleSaveBio = async () => {
    setBioSaving(true);
    try {
      await api.patch('/api/users/me', { bio: bioValue });
      setProfile(prev => prev ? { ...prev, user: { ...prev.user, bio: bioValue } } : prev);
      setEditingBio(false);
    } catch (err) {
      console.error('Failed to save bio:', err);
    } finally {
      setBioSaving(false);
    }
  };

  if (authLoading || loading) {
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
    statPeriod === "all"
      ? stats.total_problems_solved
      : statPeriod === "7d"
        ? stats.problems_solved_7d
        : stats.problems_solved_30d;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Profile header */}
      <div className="mb-8 flex items-start justify-between rounded-lg border border-border bg-card/50 p-6">
        <div className="flex items-center gap-4">
          <img
            src={`${API_BASE_URL}/api/users/avatar?username=${profileUser.username}`}
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

            {/* Bio */}
            <div className="mt-2 flex items-start gap-2">
              {editingBio ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={bioValue}
                    onChange={e => setBioValue(e.target.value.slice(0, 75))}
                    rows={2}
                    className="w-72 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    placeholder="Write something about yourself..."
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveBio}
                      disabled={bioSaving}
                      className="rounded-md bg-emerald-600 px-3 py-1 font-mono text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {bioSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditingBio(false); setBioValue(profileUser.bio ?? ''); }}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">{bioValue.length}/75</span>
                  </div>
                </div>
              ) : (
                <>
                  {(profileUser.bio || isOwnProfile) && (
                    <p className="font-mono text-sm text-muted-foreground">
                      {profileUser.bio || <span className="italic text-zinc-600">Add a bio...</span>}
                    </p>
                  )}
                  {isOwnProfile && (
                    <button onClick={() => setEditingBio(true)} className="mt-0.5 shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors">
                      <Pencil size={12} />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Mutual friends */}
            {!isOwnProfile && profile.mutual_friends.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-muted-foreground mr-1">Mutual</span>
                {profile.mutual_friends.slice(0, 8).map(friend => (
                  <div key={friend.id} className="group relative">
                    <img
                      src={`${API_BASE_URL}/api/users/avatar?username=${friend.username}`}
                      alt={friend.username}
                      className="h-6 w-6 rounded-full border border-border"
                    />
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-0.5 font-mono text-[10px] text-popover-foreground opacity-0 shadow group-hover:opacity-100 transition-opacity">
                      @{friend.username}
                    </div>
                  </div>
                ))}
                {profile.mutual_friends.length > 8 && (
                  <span className="font-mono text-[10px] text-muted-foreground">+{profile.mutual_friends.length - 8}</span>
                )}
              </div>
            )}
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

      {/* Tab bar */}
      <div className="flex border-b border-border mb-6">
        {(["overview", "contests"] as ProfileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-mono text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-emerald-500 text-emerald-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          {/* Stats grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Difficulty ring + period toggle merged */}
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <DifficultyRing
                easy={stats.easy_solved}
                medium={stats.medium_solved}
                hard={stats.hard_solved}
                total={stats.total_problems_solved}
                currentCount={currentSolvedCount}
                period={statPeriod}
                onPeriodChange={setStatPeriod}
              />
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="font-mono text-xs text-amber-400/70">Total XP</p>
              <p className="font-mono text-3xl font-bold text-amber-400">
                {stats.xp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Activity heatmap */}
          <div className="mb-8">
            <ActivityHeatmap heatmap={activity_heatmap} />
          </div>
        </>
      )}

      {activeTab === "contests" && (
        <div>
          {contestsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {contestsError && !contestsLoading && (
            <p className="py-8 text-center font-mono text-sm text-red-400">{contestsError}</p>
          )}
          {!contestsLoading && !contestsError && contestHistory?.length === 0 && (
            <div className="rounded-lg border border-border bg-card/50 p-8 text-center">
              <Trophy className="mx-auto h-10 w-10 text-zinc-600" />
              <p className="mt-4 font-mono text-sm text-muted-foreground">
                No public contests participated in yet.
              </p>
            </div>
          )}
          {!contestsLoading && !contestsError && contestHistory && contestHistory.length > 0 && (
            <div className="space-y-3">
              {contestHistory.map((c) => (
                <ContestHistoryRow key={c.id} contest={c} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
