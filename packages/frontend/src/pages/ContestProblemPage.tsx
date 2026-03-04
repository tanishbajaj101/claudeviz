import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { getContestStatus } from '../lib/contest-status';
import { ContestProblemWorkspace } from '../components/contests/ContestProblemWorkspace';
import type { Problem } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContestProblemEntry {
  order: number;
  difficulty: string;
  problem: {
    id: string;
    title: string;
    difficulty: string;
    category: string;
    tags: string[];
    description: string;
    constraints: string[];
    examples: Array<{ input: string; output: string; explanation?: string }>;
    testCases: Array<{ input: string; expectedOutput: string }>;
    judge0Limits: {
      cpu_time_limit: number;
      wall_time_limit: number;
      memory_limit: number;
      stack_limit: number;
    };
    languageId: number;
    starterCode: string;
    editorial: string;
  };
}

interface ContestData {
  id: string;
  title: string;
  starts_at: string;
  duration_minutes: number;
  is_participant: boolean;
  conversation_id?: string;
  problems?: ContestProblemEntry[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ContestProblemPage() {
  const { contestId, problemId } = useParams<{ contestId: string; problemId: string }>();
  const navigate = useNavigate();

  const [contest, setContest] = useState<ContestData | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!contestId || !problemId) return;

    try {
      const res = await fetch(`/api/contests/${contestId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data as { error?: string }).error ?? 'Contest not found');
        setLoading(false);
        return;
      }

      const data = await res.json() as { contest: ContestData };
      const c = data.contest;
      setContest(c);

      const status = getContestStatus(c.starts_at, c.duration_minutes);

      // Must be active to solve
      if (status !== 'active') {
        // Redirect to contest detail after brief delay
        setTimeout(() => navigate(`/contests/${contestId}`), 0);
        return;
      }

      // Must be a participant
      if (!c.is_participant) {
        setErrorMsg('You must join the contest to solve problems.');
        setLoading(false);
        return;
      }

      // Find the problem in the contest problem list
      const entry = c.problems?.find((p) => p.problem.id === problemId);
      if (!entry) {
        setErrorMsg('Problem not found in this contest.');
        setLoading(false);
        return;
      }

      // Build a Problem shape compatible with ContestProblemWorkspace
      const builtProblem: Problem = {
        ...entry.problem,
        languageId: entry.problem.languageId as Problem['languageId'],
        difficulty: capitalize(entry.difficulty) as Problem['difficulty'],
      };

      setProblem(builtProblem);
    } catch {
      setErrorMsg('Failed to load contest data');
    } finally {
      setLoading(false);
    }
  }, [contestId, problemId, navigate]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────

  if (errorMsg || !contest || !problem) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Lock className="h-12 w-12 text-zinc-600" />
        <p className="font-mono text-lg text-muted-foreground">{errorMsg ?? 'Problem not available'}</p>
        <Link
          to={`/contests/${contestId}`}
          className="flex items-center gap-2 rounded-md bg-muted px-4 py-2 font-mono text-sm text-muted-foreground hover:bg-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contest
        </Link>
      </div>
    );
  }

  // ── Main workspace ─────────────────────────────────────────────────────────

  return (
    <ContestProblemWorkspace
      problem={problem}
      contestId={contest.id}
      contestTitle={contest.title}
      contestStartsAt={contest.starts_at}
      contestDuration={contest.duration_minutes}
      conversationId={contest.conversation_id}
    />
  );
}

// ─── Util ─────────────────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
