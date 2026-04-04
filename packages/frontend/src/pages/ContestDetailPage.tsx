import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Users,
  Clock,
  ArrowLeft,
  Loader2,
  Play,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getContestStatus, type ContestStatus } from '../lib/contest-status';
import { LeaderboardTab } from '../components/contests/LeaderboardTab';
import { DiscussionTab } from '../components/contests/DiscussionTab';
import { LargeCountdown, CountdownTimer } from '../components/contests/CountdownTimer';
import { InviteFriendsDropdown } from '../components/contests/InviteFriendsDropdown';
import { api } from '../lib/api-client';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContestProblemEntry {
  order: number;
  difficulty: string;
  problem: {
    id: string;
    title: string;
    description: string;
    constraints: string[];
    testCases: Array<{ input: string; expectedOutput: string }>;
  };
}

interface ContestDetail {
  id: string;
  title: string;
  creator: { id: number; username: string };
  starts_at: string;
  duration_minutes: number;
  is_public: boolean;
  status: ContestStatus;
  participant_count: number;
  participants: string[];
  is_participant: boolean;
  conversation_id?: string;
  problems?: ContestProblemEntry[];
}

// ─── Component ───────────────────────────────────────────────────────────────

type Tab = 'problems' | 'leaderboard' | 'discussion';

export function ContestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('problems');

  // Re-derive status every second so UI auto-updates at boundaries
  const [liveStatus, setLiveStatus] = useState<ContestStatus | null>(null);

  const fetchContest = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.get<{ contest: ContestDetail }>(`/api/contests/${id}`);
      setContest(data.contest);
      setLiveStatus(getContestStatus(data.contest.starts_at, data.contest.duration_minutes));
    } catch (err: any) {
      setError(err.data?.error || 'Failed to load contest');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchContest();
  }, [fetchContest]);

  // Live status ticker
  useEffect(() => {
    if (!contest) return;
    const interval = setInterval(() => {
      const s = getContestStatus(contest.starts_at, contest.duration_minutes);
      setLiveStatus((prev) => (prev !== s ? s : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  const handleJoin = async () => {
    if (!id || joining) return;
    setJoining(true);
    try {
      await api.post(`/api/contests/${id}/join`);
      await fetchContest();
    } catch (err: any) {
      alert(err.data?.error || 'Failed to join contest');
    } finally {
      setJoining(false);
    }
  };

  // ── Loading / Error states ──────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (error || !contest || !liveStatus) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <Trophy className="mx-auto h-12 w-12 text-zinc-600" />
          <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
            {error ?? 'Contest not found'}
          </h2>
          <Link
            to="/contests"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 font-mono text-sm text-muted-foreground hover:bg-zinc-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contests
          </Link>
        </div>
      </main>
    );
  }

  const startsAtMs = new Date(contest.starts_at).getTime();
  const endsAtMs = startsAtMs + contest.duration_minutes * 60_000;

  const isCreator = user?.id === contest.creator.id;
  const isParticipant = contest.is_participant;
  const canJoin = !isParticipant && (liveStatus === 'upcoming' || liveStatus === 'active');

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Back nav */}
      <Link
        to="/contests"
        className="mb-6 inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Contests
      </Link>

      {/* Header card */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="font-mono text-2xl font-bold text-foreground">{contest.title}</h1>
              <StatusBadge status={liveStatus} />
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              by{' '}
              <Link
                to={`/profile/${contest.creator.username}`}
                className="text-muted-foreground hover:text-emerald-400 transition-colors"
              >
                {contest.creator.username}
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isCreator && liveStatus === 'upcoming' && (
              <InviteFriendsDropdown contestId={contest.id} currentUserId={user?.id} />
            )}
            {canJoin && user && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50"
              >
                {joining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Join Contest
              </button>
            )}
            {isParticipant && liveStatus === 'active' && contest.problems && contest.problems.length > 0 && (
              <button
                onClick={() =>
                  navigate(`/contests/${contest.id}/problems/${contest.problems![0].problem.id}`)
                }
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary"
              >
                <Play className="h-4 w-4" />
                Start Solving
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-border pt-5 font-mono text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{contest.participant_count} participants</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{contest.duration_minutes} min</span>
          </div>
          {contest.is_public ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Unlock className="h-4 w-4" />
              <span>Public</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Private</span>
            </div>
          )}
          {/* Timer */}
          {liveStatus === 'upcoming' && (
            <div className="ml-auto">
              <CountdownTimer
                targetTime={startsAtMs}
                label="Starts in"
                onComplete={() => void fetchContest()}
              />
            </div>
          )}
          {liveStatus === 'active' && (
            <div className="ml-auto">
              <CountdownTimer
                targetTime={endsAtMs}
                label="Ends in"
                onComplete={() => void fetchContest()}
              />
            </div>
          )}
          {liveStatus === 'completed' && (
            <div className="ml-auto flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span>Contest ended</span>
            </div>
          )}
        </div>
      </div>

      {/* ── UPCOMING: Show large countdown + participant list ─────────────────── */}
      {liveStatus === 'upcoming' && (
        <div className="space-y-6">
          <LargeCountdown
            targetTime={startsAtMs}
            label="Contest starts in"
            onComplete={() => void fetchContest()}
          />
          <ParticipantList participants={contest.participants} />
        </div>
      )}

      {/* ── ACTIVE / COMPLETED: Tabbed interface ─────────────────────────────── */}
      {(liveStatus === 'active' || liveStatus === 'completed') && (
        <div>
          {/* Tab bar */}
          <div className="mb-4 flex border-b border-border">
            {(['problems', 'leaderboard', 'discussion'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 font-mono text-sm font-medium capitalize transition-colors ${activeTab === tab
                  ? 'border-b-2 border-emerald-500 text-emerald-400'
                  : 'text-muted-foreground hover:text-muted-foreground'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Problems tab */}
          {activeTab === 'problems' && (
            <ProblemsTab
              problems={contest.problems}
              contestId={contest.id}
              isParticipant={isParticipant}
              status={liveStatus}
            />
          )}

          {/* Leaderboard tab */}
          {activeTab === 'leaderboard' && (
            <LeaderboardTab contestId={contest.id} currentUserId={user?.id as number | undefined} />
          )}

          {/* Discussion tab */}
          {activeTab === 'discussion' && contest.conversation_id && (
            <DiscussionTab
              contestId={contest.id}
              conversationId={contest.conversation_id}
              startsAt={contest.starts_at}
              durationMinutes={contest.duration_minutes}
              currentUserId={user?.id as number | undefined}
            />
          )}
          {activeTab === 'discussion' && !contest.conversation_id && (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Discussion not available for this contest.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContestStatus }) {
  const styles: Record<ContestStatus, string> = {
    upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    active: 'bg-primary/10 text-emerald-400 border-emerald-500/20 animate-pulse',
    completed: 'bg-zinc-700/10 text-muted-foreground border-border/20',
  };
  const labels: Record<ContestStatus, string> = {
    upcoming: 'Upcoming',
    active: '● Live',
    completed: 'Completed',
  };
  return (
    <span
      className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function ParticipantList({ participants }: { participants: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 font-mono text-sm font-semibold text-muted-foreground">
        Participants ({participants.length})
      </h2>
      {participants.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">No participants yet. Be the first to join!</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {participants.map((username) => (
            <Link
              key={username}
              to={`/profile/${username}`}
              className="rounded-full bg-muted px-3 py-1 font-mono text-xs text-muted-foreground hover:bg-zinc-700 transition-colors"
            >
              {username}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface ProblemsTabProps {
  problems?: ContestProblemEntry[];
  contestId: string;
  isParticipant: boolean;
  status: ContestStatus;
}

function ProblemsTab({ problems, contestId, isParticipant, status }: ProblemsTabProps) {
  if (!problems || problems.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <Lock className="mx-auto h-10 w-10 text-zinc-600" />
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          Problems are revealed when the contest starts.
        </p>
      </div>
    );
  }

  const difficultyStyles: Record<string, string> = {
    easy: 'bg-primary/10 text-emerald-400',
    medium: 'bg-yellow-500/10 text-yellow-400',
    hard: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="space-y-3">
      {problems.map((entry) => {
        const canSolve = isParticipant && status === 'active';
        const row = (
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-border hover:bg-muted/60">
            <span className="w-6 text-center font-mono text-sm font-semibold text-muted-foreground">
              {entry.order}
            </span>
            <span className="flex-1 font-mono text-sm text-foreground">{entry.problem.title}</span>
            <span
              className={`rounded-md px-2 py-1 font-mono text-xs font-medium capitalize ${difficultyStyles[entry.difficulty] ?? 'bg-muted text-muted-foreground'
                }`}
            >
              {entry.difficulty}
            </span>
            {canSolve && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        );

        return canSolve ? (
          <Link key={entry.problem.id} to={`/contests/${contestId}/problems/${entry.problem.id}`}>
            {row}
          </Link>
        ) : (
          <div key={entry.problem.id}>{row}</div>
        );
      })}
      {!isParticipant && (
        <p className="pt-2 text-center font-mono text-xs text-muted-foreground">
          Join the contest to solve problems
        </p>
      )}
    </div>
  );
}
