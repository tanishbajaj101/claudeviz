"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trophy, Users, Clock, Loader2, ChevronRight } from "lucide-react";
import { getContestStatus, type ContestStatus } from "@/lib/contest-status";
import { LargeCountdown, CountdownTimer } from "@/components/contests/CountdownTimer";
import { LeaderboardTab } from "@/components/contests/LeaderboardTab";
import { DiscussionTab } from "@/components/contests/DiscussionTab";

interface ContestProblem {
  order: number;
  difficulty: "easy" | "medium" | "hard";
  problem: {
    id: string;
    title: string;
    description: string;
    constraints: string[];
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
  problems?: ContestProblem[];
  conversation_id?: string;
}

type TabType = "problems" | "leaderboard" | "discussion";

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const contestId = params?.id as string;

  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("problems");

  useEffect(() => {
    if (!contestId) return;

    fetch(`/api/contests/${contestId}`)
      .then((res) => res.json())
      .then((data) => {
        setContest(data.contest);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[ContestDetailPage] Error:", err);
        setLoading(false);
      });
  }, [contestId]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch(`/api/contests/${contestId}/join`, {
        method: "POST",
      });

      if (res.ok) {
        // Refresh contest data
        const data = await fetch(`/api/contests/${contestId}`).then((r) => r.json());
        setContest(data.contest);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to join contest");
      }
    } catch (err) {
      console.error("[ContestDetailPage] Error joining:", err);
      alert("Failed to join contest");
    } finally {
      setJoining(false);
    }
  };

  const handleContestComplete = () => {
    // Refresh contest data
    fetch(`/api/contests/${contestId}`)
      .then((res) => res.json())
      .then((data) => setContest(data.contest))
      .catch(console.error);
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      </main>
    );
  }

  if (!contest) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">Contest not found</p>
        </div>
      </main>
    );
  }

  const status = getContestStatus(contest.starts_at, contest.duration_minutes);
  const startsAt = new Date(contest.starts_at);
  const endsAt = new Date(startsAt.getTime() + contest.duration_minutes * 60000);

  const canJoin =
    session?.user &&
    !contest.is_participant &&
    status === "upcoming" &&
    (contest.is_public || true); // TODO: check for invite notification

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
            {contest.title}
          </h1>
          <StatusBadge status={status} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{contest.participant_count} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{contest.duration_minutes} minutes</span>
          </div>
          <span>Created by {contest.creator.username}</span>
        </div>
      </div>

      {/* Countdown Timer */}
      {status === "upcoming" && (
        <div className="mb-8">
          <LargeCountdown
            targetTime={startsAt.getTime()}
            label="Contest starts in"
            onComplete={handleContestComplete}
          />
        </div>
      )}

      {status === "active" && (
        <div className="mb-8 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <CountdownTimer
            targetTime={endsAt.getTime()}
            label="Time Remaining"
            onComplete={handleContestComplete}
          />
        </div>
      )}

      {status === "completed" && (
        <div className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
          <p className="font-mono text-sm text-zinc-400">Contest has ended</p>
        </div>
      )}

      {/* Join Button */}
      {canJoin && (
        <div className="mb-8">
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full rounded-md bg-emerald-600 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {joining ? "Joining..." : "Join Contest"}
          </button>
        </div>
      )}

      {/* Tabs */}
      {contest.is_participant && (
        <div className="mb-6 border-b border-zinc-800">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("problems")}
              className={`border-b-2 px-4 py-2 font-mono text-sm transition-colors ${
                activeTab === "problems"
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`border-b-2 px-4 py-2 font-mono text-sm transition-colors ${
                activeTab === "leaderboard"
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("discussion")}
              className={`border-b-2 px-4 py-2 font-mono text-sm transition-colors ${
                activeTab === "discussion"
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Discussion
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {contest.is_participant && (
        <div>
          {activeTab === "problems" && (
            <div>
              {status === "upcoming" && !contest.problems && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-zinc-600" />
                  <p className="mt-4 text-sm text-zinc-400">
                    Problems will be revealed when the contest starts
                  </p>
                </div>
              )}

              {contest.problems && contest.problems.length > 0 && (
                <div className="space-y-4">
                  {contest.problems.map((cp) => (
                    <Link
                      key={cp.problem.id}
                      href={`/contests/${contestId}/problems/${cp.problem.id}`}
                      className="block rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <span className="font-mono text-sm text-zinc-500">
                              #{cp.order}
                            </span>
                            <h3 className="font-mono text-lg font-semibold text-zinc-100">
                              {cp.problem.title}
                            </h3>
                            <DifficultyBadge difficulty={cp.difficulty} />
                          </div>
                          <p className="line-clamp-2 text-sm text-zinc-400">
                            {cp.problem.description.split("\n")[0]}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-zinc-600" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "leaderboard" && (
            <LeaderboardTab
              contestId={contestId}
              currentUserId={session?.user?.dbUserId as number}
            />
          )}

          {activeTab === "discussion" && contest.conversation_id && (
            <DiscussionTab
              contestId={contestId}
              conversationId={contest.conversation_id}
              startsAt={contest.starts_at}
              durationMinutes={contest.duration_minutes}
              currentUserId={session?.user?.dbUserId as number}
            />
          )}
        </div>
      )}

      {/* Not a participant */}
      {!contest.is_participant && !canJoin && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">
            {session?.user
              ? "You are not a participant in this contest"
              : "Sign in to view contest details"}
          </p>
        </div>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: ContestStatus }) {
  const styles = {
    upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    completed: "bg-zinc-700/10 text-zinc-400 border-zinc-700/20",
  };

  const labels = {
    upcoming: "Upcoming",
    active: "Live",
    completed: "Completed",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 font-mono text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: "easy" | "medium" | "hard" }) {
  const styles = {
    easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    hard: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const labels = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-xs font-medium ${styles[difficulty]}`}
    >
      {labels[difficulty]}
    </span>
  );
}
