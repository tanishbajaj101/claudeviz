import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Clock, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getContestStatus, type ContestStatus } from '../lib/contest-status';
import { CreateContestModal } from '../components/contests/CreateContestModal';

interface ContestListItem {
  id: string;
  title: string;
  creator: { id: number; username: string };
  starts_at: string;
  duration_minutes: number;
  is_public: boolean;
  status: ContestStatus;
  participant_count: number;
}

interface MyContestItem extends ContestListItem {
  my_score: number;
}

/**
 * Contests list page - Display all contests user can join or is participating in.
 */
export function ContestsPage() {
  const { user, loading: authLoading } = useAuth();
  const [myContests, setMyContests] = useState<MyContestItem[]>([]);
  const [publicContests, setPublicContests] = useState<ContestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function fetchData() {
      try {
        // Fetch my contests if authenticated
        if (user) {
          const myRes = await fetch('/api/contests/me');
          if (myRes.ok) {
            const data = await myRes.json();
            setMyContests(data.contests || []);
          }
        }

        // Fetch public contests
        const publicRes = await fetch('/api/contests');
        if (publicRes.ok) {
          const data = await publicRes.json();
          setPublicContests(data.contests || []);
        }
      } catch (error) {
        console.error('[ContestsPage] Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, authLoading]);

  const handleJoinContest = async (contestId: string) => {
    try {
      const res = await fetch(`/api/contests/${contestId}/join`, {
        method: 'POST',
      });

      if (res.ok) {
        // Refresh contest lists
        const myRes = await fetch('/api/contests/me');
        if (myRes.ok) {
          const data = await myRes.json();
          setMyContests(data.contests || []);
        }

        const publicRes = await fetch('/api/contests');
        if (publicRes.ok) {
          const data = await publicRes.json();
          setPublicContests(data.contests || []);
        }
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to join contest');
      }
    } catch (error) {
      console.error('[ContestsPage] Error joining contest:', error);
      alert('Failed to join contest');
    }
  };

  const handleContestCreated = () => {
    setShowCreateModal(false);
    // Refresh contest lists
    if (user) {
      fetch('/api/contests/me')
        .then((res) => res.json())
        .then((data) => setMyContests(data.contests || []))
        .catch(console.error);
    }

    fetch('/api/contests')
      .then((res) => res.json())
      .then((data) => setPublicContests(data.contests || []))
      .catch(console.error);
  };

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <Trophy className="mx-auto h-12 w-12 text-zinc-600" />
          <h2 className="mt-4 font-mono text-xl font-bold text-foreground">
            Sign in to participate in contests
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Compete with others and track your progress</p>
        </div>
      </main>
    );
  }

  const isParticipant = (contestId: string) => {
    return myContests.some((c) => c.id === contestId);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">Contests</h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            Compete against others in timed coding challenges
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary"
        >
          <Plus className="h-4 w-4" />
          Create Contest
        </button>
      </div>

      {/* My Contests */}
      {myContests.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">My Contests</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myContests.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                showScore={true}
                score={contest.my_score}
              />
            ))}
          </div>
        </section>
      )}

      {/* Public Contests */}
      <section>
        <h2 className="mb-4 font-mono text-xl font-bold text-foreground">Public Contests</h2>
        {publicContests.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No public contests available</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicContests.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                showJoinButton={!isParticipant(contest.id)}
                onJoin={() => handleJoinContest(contest.id)}
              />
            ))}
          </div>
        )}
      </section>

      {showCreateModal && (
        <CreateContestModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleContestCreated}
        />
      )}
    </main>
  );
}

interface ContestCardProps {
  contest: ContestListItem;
  showScore?: boolean;
  score?: number;
  showJoinButton?: boolean;
  onJoin?: () => void;
}

function ContestCard({
  contest,
  showScore = false,
  score = 0,
  showJoinButton = false,
  onJoin,
}: ContestCardProps) {
  const status = getContestStatus(contest.starts_at, contest.duration_minutes);
  const startsAt = new Date(contest.starts_at);

  return (
    <Link
      to={`/contests/${contest.id}`}
      className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-border hover:bg-muted"
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-mono text-lg font-semibold text-foreground">{contest.title}</h3>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{contest.participant_count} participants</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            {status === 'upcoming'
              ? `Starts ${formatDate(startsAt)}`
              : status === 'active'
                ? `Ends in ${formatRemainingTime(
                    startsAt.getTime() + contest.duration_minutes * 60000
                  )}`
                : `Ended ${formatDate(startsAt)}`}
          </span>
        </div>

        {showScore && (
          <div className="flex items-center gap-2 font-mono font-semibold text-emerald-400">
            <Trophy className="h-4 w-4" />
            <span>{score} points</span>
          </div>
        )}
      </div>

      {showJoinButton && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onJoin?.();
          }}
          className="mt-4 w-full rounded-md bg-primary py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary"
        >
          Join Contest
        </button>
      )}
    </Link>
  );
}

function StatusBadge({ status }: { status: ContestStatus }) {
  const styles = {
    upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    active: 'bg-primary/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-zinc-700/10 text-muted-foreground border-border/20',
  };

  const labels = {
    upcoming: 'Upcoming',
    active: 'Live',
    completed: 'Completed',
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 font-mono text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.abs(Math.floor(diff / 3600000));
  const days = Math.floor(hours / 24);

  if (days > 1) {
    return `in ${days} days`;
  } else if (hours > 1) {
    return `in ${hours} hours`;
  } else {
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

function formatRemainingTime(endTime: number): string {
  const now = new Date().getTime();
  const diff = endTime - now;

  if (diff <= 0) return '0m';

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
