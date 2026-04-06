import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { getSpecialProblems } from '../data/problems';

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
};

const DIFFICULTY_BG: Record<string, string> = {
  Easy: 'bg-emerald-500/10 border-emerald-500/20',
  Medium: 'bg-amber-500/10 border-amber-500/20',
  Hard: 'bg-red-500/10 border-red-500/20',
};

export function SpecialProblemsPage() {
  const navigate = useNavigate();
  const problems = getSpecialProblems();
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setSolvedProblems(data.solvedProblems ?? []);
        }
      } catch {
        // not authenticated or network error — treat all as unsolved
      } finally {
        setLoading(false);
      }
    };
    fetchSolved();
  }, []);


  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 text-center">
          <h1 className="fire-title text-4xl font-bold text-foreground" style={{ fontFamily: "'Cinzel', serif" }}>DHURANDHAR</h1>
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          A curated set of challenges with progressive unlocks. Complete each tier to advance.
        </p>
      </div>


      {/* Problem list */}
      <div className="rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center font-mono text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground w-12">#</th>
                <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground w-28">Difficulty</th>
                <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground w-40">Category</th>
                <th className="px-4 py-3 text-right font-mono text-xs text-muted-foreground w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, idx) => {
                const solved = solvedProblems.includes(problem.id);

                return (
                  <tr
                    key={problem.id}
                    onClick={() => navigate(`/problems/${problem.id}`)}
                    className="border-b border-border last:border-0 transition-colors cursor-pointer hover:bg-card/50"
                  >
                    {/* Number */}
                    <td className="px-4 py-4 font-mono text-sm text-muted-foreground">
                      {idx + 1}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-sm font-medium text-foreground ${solved ? 'line-through text-muted-foreground' : ''}`}>
                          {problem.title}
                        </span>
                        <ChevronRight size={14} className="text-muted-foreground/50" />
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty]} ${DIFFICULTY_BG[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                      {problem.category}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-right">
                      {solved ? (
                        <CheckCircle2 size={18} className="inline text-emerald-400" />
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground/40">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
