"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Problem, ProblemContext, SubmissionResult } from "@/types";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { CountdownTimer } from "@/components/contests/CountdownTimer";
import { LeaderboardTab } from "@/components/contests/LeaderboardTab";
import { DiscussionTab } from "@/components/contests/DiscussionTab";
import { getContestStatus, type ContestStatus } from "@/lib/contest-status";

const STATUS_LABELS: Record<number, { label: string; color: string }> = {
  3: { label: "Accepted", color: "text-emerald-400" },
  4: { label: "Wrong Answer", color: "text-red-400" },
  5: { label: "Time Limit Exceeded", color: "text-amber-400" },
  6: { label: "Compilation Error", color: "text-red-400" },
  7: { label: "Runtime Error (SIGSEGV)", color: "text-red-400" },
  9: { label: "Runtime Error (SIGFPE)", color: "text-red-400" },
  11: { label: "Runtime Error (NZEC)", color: "text-red-400" },
};

type TabType = "description" | "leaderboard" | "discussion";

interface ContestProblemWorkspaceProps {
  problem: Problem;
  contestId: string;
  contestTitle: string;
  contestStartsAt: string;
  contestDuration: number;
  conversationId?: string;
}

export function ContestProblemWorkspace({
  problem,
  contestId,
  contestTitle,
  contestStartsAt,
  contestDuration,
  conversationId,
}: ContestProblemWorkspaceProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [code, setCode] = useState(problem.starterCode);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<SubmissionResult[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const isAuthenticated = !!session?.user;
  const endsAt = new Date(new Date(contestStartsAt).getTime() + contestDuration * 60000);

  // Recompute contest status periodically so submit button disables at end
  const [status, setStatus] = useState(() => getContestStatus(contestStartsAt, contestDuration));

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = getContestStatus(contestStartsAt, contestDuration);
      setStatus((prev) => {
        if (prev !== newStatus) return newStatus;
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [contestStartsAt, contestDuration]);

  const lastFailedResult = useMemo<SubmissionResult | null>(() => {
    if (results.length === 0) return null;
    return results.find((r) => !r.passed) ?? results[0];
  }, [results]);

  const problemContext = useMemo<ProblemContext>(
    () => ({
      problemDescription: problem.description,
      editorial: problem.editorial,
      testCases: problem.testCases,
      codeContext: code,
      lastSubmissionResult: lastFailedResult,
      previouslySolved: [],
    }),
    [problem, code, lastFailedResult]
  );

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated || status !== "active") return;

    setSubmitting(true);
    setSubmissionStatus("Submitting...");

    try {
      const res = await fetch(`/api/contests/${contestId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: problem.id,
          code,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmissionStatus(data.submission.is_correct ? "Accepted" : data.submission.status);
        if (data.submission.is_correct) {
          setTimeout(() => {
            router.push(`/contests/${contestId}`);
          }, 2000);
        }
      } else {
        setSubmissionStatus("Submission failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("[ContestProblemWorkspace] Error:", err);
      setSubmissionStatus("Submission failed");
    } finally {
      setSubmitting(false);
    }
  }, [code, problem, contestId, isAuthenticated, status, router]);

  const handleContestEnd = () => {
    router.push(`/contests/${contestId}`);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Contest Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href={`/contests/${contestId}`}
            className="flex items-center gap-2 font-mono text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contest
          </Link>
          <span className="text-zinc-600">|</span>
          <span className="font-mono text-sm text-zinc-300">{contestTitle}</span>
          <span className="text-zinc-600">|</span>
          <span className="font-mono text-sm text-zinc-300">{problem.title}</span>
        </div>

        <CountdownTimer
          targetTime={endsAt.getTime()}
          label="Time Remaining"
          onComplete={handleContestEnd}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="flex w-[45%] min-w-[300px] flex-col border-r border-zinc-800">
          {/* Tab bar */}
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 py-2.5 font-mono text-xs font-medium transition-colors ${
                activeTab === "description"
                  ? "border-b-2 border-emerald-500 text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2.5 font-mono text-xs font-medium transition-colors ${
                activeTab === "leaderboard"
                  ? "border-b-2 border-emerald-500 text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("discussion")}
              className={`px-4 py-2.5 font-mono text-xs font-medium transition-colors ${
                activeTab === "discussion"
                  ? "border-b-2 border-emerald-500 text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Discussion
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "description" && (
              <div className="h-full overflow-y-auto p-5">
                <ProblemDescription problem={problem} />
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div className="h-full overflow-y-auto p-4">
                <LeaderboardTab
                  contestId={contestId}
                  currentUserId={session?.user?.dbUserId as number}
                />
              </div>
            )}

            {activeTab === "discussion" && conversationId && (
              <div className="h-full p-4">
                <DiscussionTab
                  contestId={contestId}
                  conversationId={conversationId}
                  startsAt={contestStartsAt}
                  durationMinutes={contestDuration}
                  currentUserId={session?.user?.dbUserId as number}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-1 flex-col">
          {/* Code editor */}
          <div className="flex-1 overflow-hidden p-2">
            <CodeEditor code={code} onChange={setCode} />
          </div>

          {/* Bottom panel: actions */}
          <div className="border-t border-zinc-800 p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={submitting || status !== "active" || !isAuthenticated}
                className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                title={
                  status !== "active"
                    ? "Contest is not active"
                    : !isAuthenticated
                      ? "Sign in to submit"
                      : undefined
                }
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>

              {submissionStatus && (
                <span
                  className={`font-mono text-sm ${
                    submissionStatus === "Accepted"
                      ? "text-emerald-400"
                      : submissionStatus.startsWith("Submission failed")
                        ? "text-red-400"
                        : "text-amber-400"
                  }`}
                >
                  {submissionStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemDescription({ problem }: { problem: Problem }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 font-mono text-2xl font-bold text-zinc-100">
          {problem.title}
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-1 font-mono text-xs font-medium ${
              problem.difficulty === "Easy"
                ? "bg-emerald-500/10 text-emerald-400"
                : problem.difficulty === "Medium"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-red-500/10 text-red-400"
            }`}
          >
            {problem.difficulty}
          </span>
          <span className="font-mono text-xs text-zinc-500">{problem.category}</span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-sm text-zinc-300">
          {problem.description}
        </div>
      </div>

      {problem.examples.length > 0 && (
        <div>
          <h3 className="mb-3 font-mono text-sm font-semibold text-zinc-100">
            Examples
          </h3>
          <div className="space-y-4">
            {problem.examples.map((example, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="mb-2">
                  <span className="font-mono text-xs font-medium text-zinc-500">
                    Input:
                  </span>
                  <pre className="mt-1 font-mono text-sm text-zinc-300">
                    {example.input}
                  </pre>
                </div>
                <div className="mb-2">
                  <span className="font-mono text-xs font-medium text-zinc-500">
                    Output:
                  </span>
                  <pre className="mt-1 font-mono text-sm text-zinc-300">
                    {example.output}
                  </pre>
                </div>
                {example.explanation && (
                  <div>
                    <span className="font-mono text-xs font-medium text-zinc-500">
                      Explanation:
                    </span>
                    <p className="mt-1 text-sm text-zinc-400">
                      {example.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {problem.constraints.length > 0 && (
        <div>
          <h3 className="mb-3 font-mono text-sm font-semibold text-zinc-100">
            Constraints
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            {problem.constraints.map((constraint, i) => (
              <li key={i} className="font-mono text-sm text-zinc-400">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
