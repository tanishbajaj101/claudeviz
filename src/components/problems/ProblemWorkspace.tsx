"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Problem, ProblemContext, SubmissionResult } from "@/types";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { RecommendModal } from "@/components/problems/RecommendModal";
import { useJudge } from "@/hooks/useJudge";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Share2 } from "lucide-react";

const STATUS_LABELS: Record<number, { label: string; color: string }> = {
  3: { label: "Accepted", color: "text-emerald-400" },
  4: { label: "Wrong Answer", color: "text-red-400" },
  5: { label: "Time Limit Exceeded", color: "text-amber-400" },
  6: { label: "Compilation Error", color: "text-red-400" },
  7: { label: "Runtime Error (SIGSEGV)", color: "text-red-400" },
  9: { label: "Runtime Error (SIGFPE)", color: "text-red-400" },
  11: { label: "Runtime Error (NZEC)", color: "text-red-400" },
};

export function ProblemWorkspace({ problem }: { problem: Problem }) {
  const { data: session } = useSession();
  const [code, setCode] = useState(problem.starterCode);
  const [activeTab, setActiveTab] = useState<"description" | "chat">("description");
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [solvedStatus, setSolvedStatus] = useState<{ solved: boolean; solved_at: string | null } | null>(null);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const judge = useJudge();
  const { solvedProblems, recordSubmission } = useSubmissions();

  const isAuthenticated = !!session?.user;

  // Fetch solved status on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSolvedStatus = async () => {
      try {
        const res = await fetch(`/api/problems/${problem.id}/status`);
        if (res.ok) {
          const data = await res.json();
          setSolvedStatus(data);
        }
      } catch (err) {
        console.error("Failed to fetch solved status:", err);
      }
    };

    fetchSolvedStatus();
  }, [problem.id, isAuthenticated]);

  // Track problem view activity for friends list
  useEffect(() => {
    if (!isAuthenticated) return;

    const trackActivity = async () => {
      try {
        await fetch("/api/users/activity/problem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem_id: problem.id }),
        });
      } catch (err) {
        console.error("Failed to track problem activity:", err);
      }
    };

    trackActivity();
  }, [problem.id, isAuthenticated]);

  const lastFailedResult = useMemo<SubmissionResult | null>(() => {
    if (judge.results.length === 0) return null;
    return judge.results.find((r) => !r.passed) ?? judge.results[0];
  }, [judge.results]);

  const problemContext = useMemo<ProblemContext>(
    () => ({
      problemDescription: problem.description,
      editorial: problem.editorial,
      testCases: problem.testCases,
      codeContext: code,
      lastSubmissionResult: lastFailedResult,
      previouslySolved: solvedProblems,
    }),
    [problem, code, lastFailedResult, solvedProblems]
  );

  const handleRun = useCallback(() => {
    setIsSubmitting(false);
    const exampleCases = problem.testCases.slice(0, problem.examples.length);
    judge.submit(code, exampleCases, problem.judge0Limits);
  }, [code, problem, judge]);

  const handleSubmit = useCallback(() => {
    if (!isAuthenticated) return;
    setIsSubmitting(true);
    judge.submit(code, problem.testCases, problem.judge0Limits);
  }, [code, problem, judge, isAuthenticated]);

  // Record submission when judge finishes (only for Submit, not Run)
  useEffect(() => {
    if (!isSubmitting || judge.loading || judge.results.length === 0) return;

    const bestResult = judge.results[0]; // use first result for time/memory
    recordSubmission(problem.id, {
      problemId: problem.id,
      timestamp: new Date().toISOString(),
      status: judge.allPassed ? "Accepted" : bestResult.status.description,
      time: bestResult.time,
      memory: bestResult.memory,
    });

    setIsSubmitting(false);
  }, [judge.loading, judge.results, judge.allPassed, isSubmitting, problem.id, recordSubmission]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* LEFT PANEL */}
      <div className="flex w-[45%] min-w-[300px] flex-col border-r border-zinc-800">
        {/* Tab bar */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2.5 font-mono text-xs font-medium transition-colors ${activeTab === "description"
                ? "border-b-2 border-emerald-500 text-emerald-400"
                : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2.5 font-mono text-xs font-medium transition-colors ${activeTab === "chat"
                ? "border-b-2 border-emerald-500 text-emerald-400"
                : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            AI Coach
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "description" ? (
          <div className="flex-1 overflow-y-auto p-5">
            <ProblemDescription
              problem={problem}
              solvedStatus={solvedStatus}
              onRecommend={() => setShowRecommendModal(true)}
              isAuthenticated={isAuthenticated}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              problemContext={problemContext}
              isAuthenticated={isAuthenticated}
            />
          </div>
        )}
      </div>

      {/* Recommend Modal */}
      {showRecommendModal && session?.user?.dbUserId && (
        <RecommendModal
          problem={problem}
          currentUserId={session.user.dbUserId as number}
          onClose={() => setShowRecommendModal(false)}
        />
      )}

      {/* RIGHT PANEL */}
      <div className="flex flex-1 flex-col">
        {/* Code editor */}
        <div className="flex-1 overflow-hidden p-2">
          <CodeEditor code={code} onChange={setCode} />
        </div>

        {/* Bottom panel: test results */}
        <div className="border-t border-zinc-800">
          {/* Action buttons */}
          <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
            <button
              onClick={handleRun}
              disabled={judge.loading}
              className="rounded-md border border-zinc-600 px-4 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {judge.loading ? "Running..." : "Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={judge.loading || !isAuthenticated}
              className="rounded-md bg-emerald-600 px-4 py-1.5 font-mono text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              title={!isAuthenticated ? "Sign in to submit" : undefined}
            >
              {judge.loading ? "Judging..." : "Submit"}
            </button>
            {judge.allPassed === true && (
              <span className="ml-2 font-mono text-xs text-emerald-400">
                All test cases passed!
              </span>
            )}
            {judge.allPassed === false && (
              <span className="ml-2 font-mono text-xs text-red-400">
                Some test cases failed.
              </span>
            )}
            {judge.error && (
              <span className="ml-2 font-mono text-xs text-red-400">
                {judge.error}
              </span>
            )}
          </div>

          {/* Test case tabs + output */}
          <div className="h-48 overflow-y-auto">
            {judge.results.length > 0 ? (
              <div>
                {/* Test case tabs */}
                <div className="flex gap-1 border-b border-zinc-800 px-3 py-1">
                  {judge.results.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTestCase(i)}
                      className={`rounded px-2 py-1 font-mono text-xs transition-colors ${selectedTestCase === i
                          ? "bg-zinc-700 text-zinc-200"
                          : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                      <span
                        className={`mr-1 inline-block h-2 w-2 rounded-full ${r.passed ? "bg-emerald-400" : "bg-red-400"
                          }`}
                      />
                      Case {i + 1}
                    </button>
                  ))}
                </div>

                {/* Selected result */}
                {judge.results[selectedTestCase] && (
                  <TestCaseResult result={judge.results[selectedTestCase]} />
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="font-mono text-xs text-zinc-600">
                  Run or submit to see results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemDescription({
  problem,
  solvedStatus,
  onRecommend,
  isAuthenticated,
}: {
  problem: Problem;
  solvedStatus: { solved: boolean; solved_at: string | null } | null;
  onRecommend: () => void;
  isAuthenticated: boolean;
}) {
  const difficultyColor =
    problem.difficulty === "Easy"
      ? "text-emerald-400"
      : problem.difficulty === "Medium"
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-xl font-bold text-zinc-100">
              {problem.title}
            </h1>
            {solvedStatus?.solved && (
              <div
                className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1"
                title={`You solved this problem on ${new Date(solvedStatus.solved_at!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
              >
                <span className="font-mono text-xs font-medium text-emerald-400">
                  Solved ✓
                </span>
              </div>
            )}
          </div>
          {isAuthenticated && (
            <button
              onClick={onRecommend}
              className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
              title="Recommend to a friend"
            >
              <Share2 size={14} />
              <span>Recommend</span>
            </button>
          )}
        </div>
        <span className={`font-mono text-sm font-medium ${difficultyColor}`}>
          {problem.difficulty}
        </span>
        <div className="mt-1 flex flex-wrap gap-1">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="font-mono text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
        {problem.description}
      </div>

      <div>
        <h3 className="mb-2 font-mono text-sm font-medium text-zinc-200">
          Constraints
        </h3>
        <ul className="space-y-1">
          {problem.constraints.map((c, i) => (
            <li key={i} className="font-mono text-xs text-zinc-400">
              &bull; {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="font-mono text-sm font-medium text-zinc-200">
          Examples
        </h3>
        {problem.examples.map((ex, i) => (
          <div
            key={i}
            className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3"
          >
            <div className="mb-1 font-mono text-xs text-zinc-500">
              Example {i + 1}
            </div>
            <div className="space-y-1">
              <p className="font-mono text-xs text-zinc-300">
                <span className="text-zinc-500">Input: </span>
                {ex.input}
              </p>
              <p className="font-mono text-xs text-zinc-300">
                <span className="text-zinc-500">Output: </span>
                {ex.output}
              </p>
              {ex.explanation && (
                <p className="font-mono text-xs text-zinc-400">
                  {ex.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestCaseResult({ result }: { result: SubmissionResult }) {
  const statusInfo = STATUS_LABELS[result.status.id] ?? {
    label: result.status.description,
    color: "text-zinc-400",
  };

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-3">
        <span className={`font-mono text-sm font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
        {result.time && (
          <span className="font-mono text-xs text-zinc-500">
            {result.time}s
          </span>
        )}
        {result.memory && (
          <span className="font-mono text-xs text-zinc-500">
            {(result.memory / 1024).toFixed(1)} MB
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="mb-1 font-mono text-xs text-zinc-500">Input</p>
          <pre className="rounded border border-zinc-800 bg-zinc-900 p-2 font-mono text-xs text-zinc-400">
            {result.input}
          </pre>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs text-zinc-500">Expected</p>
          <pre className="rounded border border-zinc-800 bg-zinc-900 p-2 font-mono text-xs text-zinc-400">
            {result.expectedOutput}
          </pre>
        </div>
      </div>

      {result.stdout && (
        <div>
          <p className="mb-1 font-mono text-xs text-zinc-500">Your Output</p>
          <pre className="rounded border border-zinc-800 bg-zinc-900 p-2 font-mono text-xs text-zinc-400">
            {result.stdout.trim()}
          </pre>
        </div>
      )}

      {result.compile_output && (
        <div>
          <p className="mb-1 font-mono text-xs text-zinc-500">
            Compiler Output
          </p>
          <pre className="rounded border border-zinc-800 bg-zinc-900 p-2 font-mono text-xs text-red-400">
            {result.compile_output}
          </pre>
        </div>
      )}

      {result.stderr && (
        <div>
          <p className="mb-1 font-mono text-xs text-zinc-500">Stderr</p>
          <pre className="rounded border border-zinc-800 bg-zinc-900 p-2 font-mono text-xs text-red-400">
            {result.stderr}
          </pre>
        </div>
      )}
    </div>
  );
}
