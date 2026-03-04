

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Panel, Group } from "react-resizable-panels";
import { Problem, ProblemContext, SubmissionResult } from "../../types";
import { CodeEditor } from "../../components/editor/CodeEditor";
import { ChatPanel } from "../../components/chat/ChatPanel";
import { CountdownTimer } from "../../components/contests/CountdownTimer";
import { LeaderboardTab } from "../../components/contests/LeaderboardTab";
import { DiscussionTab } from "../../components/contests/DiscussionTab";
import { ResizeHandle } from "../../components/ui/ResizeHandle";
import { getContestStatus, type ContestStatus } from "../../lib/contest-status";
import { useJudge } from "../../hooks/useJudge";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const judge = useJudge();
  const [code, setCode] = useState(problem.starterCode);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const isAuthenticated = !!user;
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
      previouslySolved: [],
    }),
    [problem, code, lastFailedResult]
  );

  const handleRun = useCallback(() => {
    setIsSubmitting(false);
    const exampleCases = problem.testCases.slice(0, problem.examples.length);
    judge.submit(code, exampleCases, problem.judge0Limits);
  }, [code, problem, judge]);

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated || status !== "active") return;

    setIsSubmitting(true);
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
            navigate(`/contests/${contestId}`);
          }, 2000);
        }
      } else {
        setSubmissionStatus("Submission failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("[ContestProblemWorkspace] Error:", err);
      setSubmissionStatus("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [code, problem, contestId, isAuthenticated, status, navigate]);

  const handleContestEnd = () => {
    navigate(`/contests/${contestId}`);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Contest Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            to={`/contests/${contestId}`}
            className="flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contest
          </Link>
          <span className="text-zinc-600">|</span>
          <span className="font-mono text-sm text-muted-foreground">{contestTitle}</span>
          <span className="text-zinc-600">|</span>
          <span className="font-mono text-sm text-muted-foreground">{problem.title}</span>
        </div>

        <CountdownTimer
          targetTime={endsAt.getTime()}
          label="Time Remaining"
          onComplete={handleContestEnd}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal">
          {/* LEFT PANEL */}
          <Panel defaultSize="45%" minSize="20%" maxSize="70%">
            <div className="flex h-full flex-col border-r border-border">
              {/* Tab bar */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2.5 font-mono text-xs font-medium transition-colors ${activeTab === "description"
                    ? "border-b-2 border-emerald-500 text-emerald-400"
                    : "text-muted-foreground hover:text-muted-foreground"
                    }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className={`px-4 py-2.5 font-mono text-xs font-medium transition-colors ${activeTab === "leaderboard"
                    ? "border-b-2 border-emerald-500 text-emerald-400"
                    : "text-muted-foreground hover:text-muted-foreground"
                    }`}
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => setActiveTab("discussion")}
                  className={`px-4 py-2.5 font-mono text-xs font-medium transition-colors ${activeTab === "discussion"
                    ? "border-b-2 border-emerald-500 text-emerald-400"
                    : "text-muted-foreground hover:text-muted-foreground"
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
                      currentUserId={user?.id as number}
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
                      currentUserId={user?.id as number}
                    />
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <ResizeHandle direction="horizontal" />

          {/* RIGHT PANEL */}
          <Panel defaultSize="55%" minSize="30%">
            <Group orientation="vertical">
              {/* Code editor */}
              <Panel defaultSize="65%" minSize="30%">
                <div className="h-full overflow-hidden p-2">
                  <CodeEditor code={code} onChange={setCode} onSubmit={handleSubmit} />
                </div>
              </Panel>

              <ResizeHandle direction="vertical" />

              {/* Bottom panel: Run/Submit + Test Cases */}
              <Panel defaultSize="35%" minSize="10%" maxSize="50%">
                <div className="flex h-full flex-col border-t border-border">
                  {/* Action buttons */}
                  <div className="flex items-center gap-4 border-b border-border p-3">
                    <button
                      onClick={handleRun}
                      disabled={judge.loading || isSubmitting || status !== "active" || !isAuthenticated}
                      className="flex items-center gap-2 rounded-md bg-zinc-700 px-6 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-zinc-600 disabled:opacity-50"
                      title={
                        status !== "active"
                          ? "Contest is not active"
                          : !isAuthenticated
                            ? "Sign in to run"
                            : undefined
                      }
                    >
                      {judge.loading && !isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        "Run"
                      )}
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={judge.loading || isSubmitting || status !== "active" || !isAuthenticated}
                      className="flex items-center gap-2 rounded-md bg-primary px-6 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50"
                      title={
                        status !== "active"
                          ? "Contest is not active"
                          : !isAuthenticated
                            ? "Sign in to submit"
                            : undefined
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>

                    {judge.allPassed && !isSubmitting && (
                      <span className="font-mono text-sm text-emerald-400">
                        All test cases passed!
                      </span>
                    )}

                    {judge.error && !isSubmitting && (
                      <span className="font-mono text-sm text-red-400">
                        {judge.error}
                      </span>
                    )}

                    {submissionStatus && (
                      <span
                        className={`font-mono text-sm ${submissionStatus === "Accepted"
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

                  {/* Test case tabs + output */}
                  <div className="flex-1 overflow-y-auto">
                    {judge.results.length > 0 ? (
                      <div>
                        {/* Test case tabs */}
                        <div className="flex gap-1 border-b border-border px-3 py-1">
                          {judge.results.map((r, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedTestCase(i)}
                              className={`rounded px-2 py-1 font-mono text-xs transition-colors ${selectedTestCase === i
                                ? "bg-zinc-700 text-foreground"
                                : "text-muted-foreground hover:text-muted-foreground"
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
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  );
}

function ProblemDescription({ problem }: { problem: Problem }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 font-mono text-2xl font-bold text-foreground">
          {problem.title}
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-1 font-mono text-xs font-medium ${problem.difficulty === "Easy"
              ? "bg-primary/10 text-emerald-400"
              : problem.difficulty === "Medium"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-red-500/10 text-red-400"
              }`}
          >
            {problem.difficulty}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{problem.category}</span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-sm text-muted-foreground">
          {problem.description}
        </div>
      </div>

      {problem.examples.length > 0 && (
        <div>
          <h3 className="mb-3 font-mono text-sm font-semibold text-foreground">
            Examples
          </h3>
          <div className="space-y-4">
            {problem.examples.map((example, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="mb-2">
                  <span className="font-mono text-xs font-medium text-muted-foreground">
                    Input:
                  </span>
                  <pre className="mt-1 font-mono text-sm text-muted-foreground">
                    {example.input}
                  </pre>
                </div>
                <div className="mb-2">
                  <span className="font-mono text-xs font-medium text-muted-foreground">
                    Output:
                  </span>
                  <pre className="mt-1 font-mono text-sm text-muted-foreground">
                    {example.output}
                  </pre>
                </div>
                {example.explanation && (
                  <div>
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      Explanation:
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
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
          <h3 className="mb-3 font-mono text-sm font-semibold text-foreground">
            Constraints
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            {problem.constraints.map((constraint, i) => (
              <li key={i} className="font-mono text-sm text-muted-foreground">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TestCaseResult({ result }: { result: SubmissionResult }) {
  const statusInfo = STATUS_LABELS[result.status.id] ?? {
    label: result.status.description,
    color: "text-muted-foreground",
  };

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-3">
        <span className={`font-mono text-sm font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
        {result.time && (
          <span className="font-mono text-xs text-muted-foreground">
            {result.time}s
          </span>
        )}
        {result.memory && (
          <span className="font-mono text-xs text-muted-foreground">
            {(result.memory / 1024).toFixed(1)} MB
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="mb-1 font-mono text-xs text-muted-foreground">Input</p>
          <pre className="rounded border border-border bg-card p-2 font-mono text-xs text-muted-foreground">
            {result.input}
          </pre>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs text-muted-foreground">Expected</p>
          <pre className="rounded border border-border bg-card p-2 font-mono text-xs text-muted-foreground">
            {result.expectedOutput}
          </pre>
        </div>
      </div>

      {result.stdout && (
        <div>
          <p className="mb-1 font-mono text-xs text-muted-foreground">Your Output</p>
          <pre className="rounded border border-border bg-card p-2 font-mono text-xs text-muted-foreground">
            {result.stdout.trim()}
          </pre>
        </div>
      )}

      {result.compile_output && (
        <div>
          <p className="mb-1 font-mono text-xs text-muted-foreground">
            Compiler Output
          </p>
          <pre className="rounded border border-border bg-card p-2 font-mono text-xs text-red-400">
            {result.compile_output}
          </pre>
        </div>
      )}

      {result.stderr && (
        <div>
          <p className="mb-1 font-mono text-xs text-muted-foreground">Stderr</p>
          <pre className="rounded border border-border bg-card p-2 font-mono text-xs text-red-400">
            {result.stderr}
          </pre>
        </div>
      )}
    </div>
  );
}
