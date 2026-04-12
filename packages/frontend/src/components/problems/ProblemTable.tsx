

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Problem } from "../../types";
import { useSubmissions } from "../../hooks/useSubmissions";
import { Check, Flame, ArrowUpDown, Search, Shuffle } from "lucide-react";
import { formatTimeRemaining } from "../../hooks/useBounty";
import type { BountyInfo } from "@shared/types/socket";

const DIFFICULTY_COLORS: Record<Problem["difficulty"], string> = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-red-400",
};

function getCategories(problems: Problem[]): string[] {
  const cats = new Set(problems.map((p) => p.category));
  return Array.from(cats).sort();
}

export function ProblemTable({
  problems,
  bounty,
  timeRemaining,
  onRandomProblem
}: {
  problems: Problem[];
  bounty: BountyInfo | null;
  timeRemaining: number;
  onRandomProblem?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [category, setCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { solvedProblems } = useSubmissions();

  const categories = useMemo(() => getCategories(problems), [problems]);

  const difficultyValue: Record<Problem["difficulty"], number> = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  const filteredAndSorted = useMemo(() => {
    let result = problems.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
        return false;
      return true;
    });

    result.sort((a, b) => {
      const aIsBounty = bounty?.problemId === a.id ? -1 : 0;
      const bIsBounty = bounty?.problemId === b.id ? -1 : 0;
      if (aIsBounty !== bIsBounty) return aIsBounty - bIsBounty;
      const valA = difficultyValue[a.difficulty];
      const valB = difficultyValue[b.difficulty];
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [problems, search, category, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Filters & Sorting */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCategory("All")}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                category === "All"
                  ? "bg-primary/10 text-primary border border-primary ring-1 ring-primary/30"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-md px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                  category === c
                    ? "bg-primary/10 text-primary border border-primary ring-1 ring-primary/30"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {onRandomProblem && (
              <button
                type="button"
                onClick={onRandomProblem}
                title="Random Problem"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={problems.length === 0}
              >
                <Shuffle size={18} />
              </button>
            )}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={`Sort: ${sortOrder === "asc" ? "Easy to Hard" : "Hard to Easy"}`}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card font-mono text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowUpDown size={18} className={sortOrder === "desc" ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            <div 
              className={`relative flex h-10 items-center transition-all duration-300 ease-in-out ${
                isSearchExpanded || search ? "w-64" : "w-10"
              }`}
            >
              <div 
                className={`absolute inset-0 flex items-center justify-center rounded-md border border-border bg-card transition-colors ${
                  isSearchExpanded || search ? "border-primary ring-1 ring-primary" : "hover:bg-secondary"
                }`}
                onClick={() => setIsSearchExpanded(true)}
              >
                <Search
                  size={18}
                  className={`transition-colors ${
                    isSearchExpanded || search ? "ml-3 text-primary" : "text-muted-foreground"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={search}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`h-full w-full bg-transparent font-mono text-sm text-foreground placeholder-zinc-500 outline-none transition-all duration-300 ${
                    isSearchExpanded || search ? "opacity-100 pl-2 pr-3" : "w-0 opacity-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-right font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Acceptance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredAndSorted.map((problem) => {
              const isSolved = solvedProblems.includes(problem.id);
              const isBounty = bounty?.problemId === problem.id;
              return (
                <tr
                  key={problem.id}
                  className={`transition-colors hover:bg-card/50 ${isBounty ? "ring-1 ring-inset ring-amber-500/30 bg-amber-500/5" : ""}`}
                >
                  <td className="px-4 py-3">
                    {isSolved ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary" title="Solved">
                        <Check size={12} className="text-white" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-border" title="Not solved" />
                    )}
                  </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/problems/${problem.id}`}
                        className="font-mono text-sm text-foreground transition-colors hover:text-emerald-400"
                      >
                        {problem.title}
                      </Link>
                      {isBounty && (
                        <span className="group relative flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400 cursor-default">
                          <Flame size={10} />
                          {formatTimeRemaining(timeRemaining)} left
                          <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 border border-amber-500/30 px-2 py-1 font-mono text-[10px] text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                            Gain 2x XP
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono text-sm font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                  {problem.category}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">
                  {problem.acceptanceRate
                    ? `${(problem.acceptanceRate * 100).toFixed(0)}%`
                    : "â€”"}
                </td>
              </tr>
            );
            })}
            {filteredAndSorted.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center font-mono text-sm text-muted-foreground"
                >
                  No problems match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


