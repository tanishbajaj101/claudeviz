"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Problem } from "@/types";

const DIFFICULTY_COLORS: Record<Problem["difficulty"], string> = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-red-400",
};

function getCategories(problems: Problem[]): string[] {
  const cats = new Set(problems.map((p) => p.category));
  return Array.from(cats).sort();
}

export function ProblemTable({ problems }: { problems: Problem[] }) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => getCategories(problems), [problems]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (difficulty !== "All" && p.difficulty !== difficulty) return false;
      if (category !== "All" && p.category !== category) return false;
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
        return false;
      return true;
    });
  }, [problems, search, difficulty, category]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-200 outline-none focus:border-emerald-500"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-200 outline-none focus:border-emerald-500"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-zinc-500">
                Title
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-zinc-500">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-zinc-500">
                Category
              </th>
              <th className="px-4 py-3 text-right font-mono text-xs font-medium uppercase tracking-wider text-zinc-500">
                Acceptance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filtered.map((problem) => (
              <tr
                key={problem.id}
                className="transition-colors hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3">
                  <div className="h-4 w-4 rounded-full border border-zinc-700" />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/problems/${problem.id}`}
                    className="font-mono text-sm text-zinc-200 transition-colors hover:text-emerald-400"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono text-sm font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-zinc-400">
                  {problem.category}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-zinc-400">
                  {problem.acceptanceRate
                    ? `${(problem.acceptanceRate * 100).toFixed(0)}%`
                    : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center font-mono text-sm text-zinc-500"
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
