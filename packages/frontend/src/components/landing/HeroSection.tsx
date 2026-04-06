import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProblems } from '../../data/problems';
import { useAuth } from '../../contexts/AuthContext';

const TAGLINES = [
  'Master DSA. One problem at a time.',
  'Code. Submit. Level up.',
  'Train like a champion. Compete like one.',
] as const;

function useTypewriter(strings: readonly string[]) {
  const [displayText, setDisplayText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    const current = strings[stringIndex % strings.length];

    if (isPausing) {
      const t = setTimeout(() => { setIsPausing(false); setIsDeleting(true); }, 2000);
      return () => clearTimeout(t);
    }
    if (!isDeleting && charIndex < current.length) {
      const t = setTimeout(() => { setDisplayText(current.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }, 50);
      return () => clearTimeout(t);
    }
    if (!isDeleting && charIndex === current.length) { setIsPausing(true); return; }
    if (isDeleting && charIndex > 0) {
      const t = setTimeout(() => { setDisplayText(current.slice(0, charIndex - 1)); setCharIndex(c => c - 1); }, 30);
      return () => clearTimeout(t);
    }
    if (isDeleting && charIndex === 0) { setIsDeleting(false); setStringIndex(i => i + 1); }
  }, [strings, stringIndex, charIndex, isDeleting, isPausing]);

  return displayText;
}

export function HeroSection() {
  const problems = getProblems();
  const { user } = useAuth();
  const displayText = useTypewriter(TAGLINES);

  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;
  const categoryCount = new Set(problems.map(p => p.category)).size;

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-4">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative rounded-lg border border-border overflow-hidden animate-glow-pulse">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">code-tracer ~ zsh</span>
        </div>

        {/* Hero body */}
        <div className="bg-card/30 px-6 py-16 md:px-10">
          <p className="font-mono text-sm text-muted-foreground mb-3">
            <span className="text-primary">$</span> ./codetracer --start
          </p>
          <h1 className="font-mono text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground min-h-[3rem] md:min-h-[3.5rem]">
            {displayText}
            <span className="inline-block w-0.5 h-6 md:h-8 lg:h-10 bg-primary ml-0.5 animate-pulse align-middle" />
          </h1>

          {/* Welcome banner for logged-in users */}
          {user && (
            <p className="font-mono text-sm text-muted-foreground mt-4">
              <span className="text-primary">//</span> Welcome back,{' '}
              <Link to={`/profile/${user.username}`} className="text-foreground hover:text-primary transition-colors">
                {user.username ?? user.name}
              </Link>
              . Keep the streak going.
            </p>
          )}

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/problems"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {user ? 'Continue Solving' : 'Start Solving'} →
            </Link>
            <Link
              to="/contests"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-mono text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              View Contests
            </Link>
            {!user && (
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors ml-1"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="mt-10 border-t border-border pt-6 flex flex-wrap items-center gap-6 md:gap-8">
            <StatPill label="Problems" value={problems.length} color="text-foreground" />
            <div className="w-px h-8 bg-border hidden sm:block" />
            <StatPill label="Categories" value={categoryCount} color="text-foreground" />
            <div className="w-px h-8 bg-border hidden sm:block" />
            <StatPill label="Easy" value={easyCount} color="text-emerald-400" />
            <StatPill label="Medium" value={mediumCount} color="text-amber-400" />
            <StatPill label="Hard" value={hardCount} color="text-red-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPill({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`font-mono text-2xl font-bold ${color}`}>{value}</span>
      <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}
