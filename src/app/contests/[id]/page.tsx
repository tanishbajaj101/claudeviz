"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Users, ArrowRight, ArrowLeft, Trophy, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ContestLeaderboard } from "@/components/contests/ContestLeaderboard";
import { InviteFriendsDropdown } from "@/components/contests/InviteFriendsDropdown";

export default function ContestLobbyPage() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
    const [isJoined, setIsJoined] = useState(false);
    const [joining, setJoining] = useState(false);

    const contestId = parseInt(params.id as string, 10);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/contests/${contestId}`);
      if (!res.ok) throw new Error("Failed to load contest");
      const json = await res.json();
      setData(json);

      if (session?.user?.dbUserId) {
        setIsJoined(json.participants.some((p: any) => p.id === session.user.dbUserId));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, contestId, session?.user?.dbUserId]);

  // Poll for updates if in lobby or active
  useEffect(() => {
    if (!data) return;
    
    const isUpcoming = new Date(data.contest.starts_at) > new Date();
    const endTime = new Date(data.contest.starts_at).getTime() + data.contest.duration_minutes * 60000;
    const isActive = new Date() > new Date(data.contest.starts_at) && new Date().getTime() < endTime;
    
    if (isUpcoming || isActive) {
      const interval = setInterval(fetchData, 5000); // Polling every 5s for participants/leaderboard
      return () => clearInterval(interval);
    }
  }, [data?.contest.starts_at, data?.contest.duration_minutes]);

  // Timer logic
  useEffect(() => {
    if (!data) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(data.contest.starts_at).getTime();
      const endTime = startTime + data.contest.duration_minutes * 60000;

      if (now < startTime) {
        // Countdown to start
        const diff = startTime - now;
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`Starts in ${m}m ${s}s`);
      } else if (now >= startTime && now < endTime) {
        // Countdown to end
        const diff = endTime - now;
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`Ends in ${m}m ${s}s`);
      } else {
        setTimeRemaining("Contest Ended");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch(`/api/contests/${contestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join" })
      });
      if (res.ok) {
        setIsJoined(true);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  if (loading || status === "loading") {
    return <div className="flex h-screen items-center justify-center font-mono text-zinc-500">Loading arena...</div>;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <AlertTriangle size={48} className="text-red-500" />
        <h1 className="text-2xl font-bold font-mono text-white">Error</h1>
        <p className="text-zinc-400">{error || "Something went wrong"}</p>
        <Link href="/contests" className="text-emerald-500 hover:underline">Back to Contests</Link>
      </div>
    );
  }

  const { contest, problems, participants, leaderboard } = data;
  const now = new Date();
  const startTime = new Date(contest.starts_at);
  const endTime = new Date(startTime.getTime() + contest.duration_minutes * 60000);
  const isUpcoming = now < startTime;
  const isActive = now >= startTime && now < endTime;
  const isEnded = now >= endTime;

  // Derive which problems the current user has solved in this contest using leaderboard payload
  const myLeaderboardEntry = leaderboard.find((e: any) => e.user_id === session?.user?.dbUserId);
  const myScore = myLeaderboardEntry?.total_score || 0;

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-zinc-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/contests" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        {/* Header Block */}
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl relative">
          <div className={`absolute top-0 left-0 w-full h-1 ${isUpcoming ? 'bg-blue-500' : isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="hidden md:flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700">
                <Trophy className={`h-8 w-8 ${isUpcoming ? 'text-blue-400' : isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-mono text-zinc-100">{contest.title}</h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1"><Clock size={14} /> {contest.duration_minutes}m Duration</span>
                  <span className="flex items-center gap-1"><Users size={14} /> {participants.length} Joined</span>
                  <span className={`font-mono font-medium px-2 py-0.5 rounded text-xs ${isUpcoming ? 'bg-blue-500/10 text-blue-400' : isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {isUpcoming ? 'LOBBY' : isActive ? 'ACTIVE' : 'ENDED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right flex flex-col items-center md:items-end w-full md:w-auto">
              <div className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums drop-shadow-md">
                {timeRemaining || "..."}
              </div>
              <div className="mt-4 flex gap-3 flex-wrap justify-center w-full">
                {isUpcoming && isJoined && (
                  <InviteFriendsDropdown contestId={contestId} currentUserId={session?.user?.dbUserId} />
                )}
                
                {!isJoined && !isEnded ? (
                  <button 
                    onClick={handleJoin}
                    disabled={joining}
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {joining ? "Joining..." : "Join Contest"}
                  </button>
                ) : isJoined && !isEnded ? (
                  <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400">
                    <CheckCircle2 size={16} /> Joined Arena
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content: Lobby vs Active vs Ended */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Problems) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-mono text-zinc-100 mb-4 flex items-center gap-2">
              Contest Problems
            </h2>
            
            {isUpcoming ? (
               <div className="rounded-lg border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
                 <LockIcon className="mx-auto mb-4 h-12 w-12 text-zinc-700" />
                 <h3 className="font-medium text-zinc-300 mb-1">Problems locked</h3>
                 <p className="text-sm">They will be revealed instantly when the clock hits zero.</p>
               </div>
            ) : (
              <div className="space-y-3">
                {problems.map((p: any) => (
                  <Link 
                    href={`/problems/${p.problem_id}?contestId=${contestId}`}
                    key={p.id}
                    className={`group flex items-center justify-between rounded-lg border bg-zinc-900 p-4 transition-all ${!isJoined && !isEnded ? 'opacity-50 cursor-not-allowed border-zinc-800' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50'}`}
                    onClick={(e) => { if (!isJoined && !isEnded) e.preventDefault(); }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-950 font-mono font-bold text-zinc-400">
                        {String.fromCharCode(65 + p.slot_index - 1)} {/* A, B, C */}
                      </div>
                      <div>
                        {/* Title hidden if we didn't populate it in DB, we rely on problem data. Oh wait, we only stored problem_id in contest_problems */}
                        <div className="font-mono font-semibold text-zinc-200 group-hover:text-white transition-colors">
                          Problem {p.problem_id.replace(/-/g, ' ')}
                        </div>
                        <div className="flex gap-3 text-xs text-zinc-500 mt-1">
                          <span className={`font-medium ${p.difficulty === 'Easy' ? 'text-emerald-400' : p.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>
                            {p.difficulty}
                          </span>
                          <span>{p.points} points</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-zinc-600 group-hover:text-emerald-500" />
                  </Link>
                ))}
              </div>
            )}
            
            {/* If ended, maybe a nice summary */}
            {isEnded && (
              <div className="mt-8 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-6 flex flex-col items-center">
                <Trophy className="text-emerald-500 h-10 w-10 mb-3" />
                <h3 className="text-lg font-bold text-zinc-100">Contest Over</h3>
                <p className="text-sm text-zinc-400 text-center max-w-md mt-2">
                  The arena is now frozen. Your final score is {myScore}. Great effort algorithm gladiator!
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Area (Leaderboard) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-mono text-zinc-100 mb-4 flex items-center gap-2">
              Leaderboard
            </h2>
            <ContestLeaderboard 
              leaderboard={leaderboard} 
              currentUserId={session?.user?.dbUserId} 
            />
          </div>
          
        </div>
      </div>
    </main>
  );
}

function LockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
