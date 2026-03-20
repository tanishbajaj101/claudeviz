import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProblems } from '../data/problems';
import { useAuth } from '../contexts/AuthContext';

const TAGLINES = [
  'Master DSA. One problem at a time.',
  'Code. Submit. Level up.',
  'Train like a champion. Compete like one.',
];

const FEATURES = [
  { icon: '>_', title: 'AI Coach',        description: 'Stuck? Get Socratic hints that guide — never spoil.', linkTo: '/problems', linkLabel: 'Try it →' },
  { icon: '~',  title: 'Visualizations', description: 'Watch algorithms animate step-by-step in the editor.', linkTo: '/problems', linkLabel: 'See it →' },
  { icon: '#',  title: 'Contests',       description: 'Compete in timed rounds. Climb the leaderboard.',     linkTo: '/contests', linkLabel: 'Join →'   },
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
      const t = setTimeout(() => {
        setIsPausing(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(t);
    }

    if (!isDeleting && charIndex < current.length) {
      const t = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 50);
      return () => clearTimeout(t);
    }

    if (!isDeleting && charIndex === current.length) {
      setIsPausing(true);
      return;
    }

    if (isDeleting && charIndex > 0) {
      const t = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
      }, 30);
      return () => clearTimeout(t);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setStringIndex(i => i + 1);
    }
  }, [strings, stringIndex, charIndex, isDeleting, isPausing]);

  return displayText;
}

function StatPill({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`font-mono text-2xl font-bold ${color}`}>{value}</span>
      <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, linkTo, linkLabel }: { icon: string; title: string; description: string; linkTo: string; linkLabel: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors">
      <div className="font-mono text-xl text-primary">{icon}</div>
      <h3 className="font-mono text-sm font-semibold text-foreground">{title}</h3>
      <p className="font-mono text-xs text-muted-foreground leading-relaxed flex-1">{description}</p>
      <Link to={linkTo} className="font-mono text-xs text-primary hover:underline">{linkLabel}</Link>
    </div>
  );
}

export function HomePage() {
  const problems = getProblems();
  const { user } = useAuth();
  const displayText = useTypewriter(TAGLINES);

  const easyCount     = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount   = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount     = problems.filter(p => p.difficulty === 'Hard').length;
  const categoryCount = new Set(problems.map(p => p.category)).size;

  return (
    <div>
      {/* Hero: terminal-window aesthetic */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-0">
        <div className="rounded-lg border border-border overflow-hidden">

          {/* Fake terminal title bar */}
          <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-500/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">algo-arena ~ zsh</span>
          </div>

          {/* Hero body */}
          <div className="bg-card/30 px-8 py-10">
            <p className="font-mono text-sm text-muted-foreground mb-2">
              <span className="text-primary">$</span> ./algoarena --start
            </p>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground min-h-[2.5rem]">
              {displayText}
              <span className="inline-block w-0.5 h-7 bg-primary ml-0.5 animate-pulse align-middle" />
            </h1>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/problems" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90">
                Start Solving →
              </Link>
              <Link to="/contests" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 font-mono text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                View Contests
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-8 border-t border-border pt-6 flex flex-wrap items-center gap-8">
              <StatPill label="Problems"   value={problems.length} color="text-foreground" />
              <div className="w-px h-8 bg-border" />
              <StatPill label="Categories" value={categoryCount}   color="text-foreground" />
              <div className="w-px h-8 bg-border" />
              <StatPill label="Easy"   value={easyCount}   color="text-emerald-400" />
              <StatPill label="Medium" value={mediumCount} color="text-amber-400" />
              <StatPill label="Hard"   value={hardCount}   color="text-red-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Welcome banner (auth only) */}
      {user && (
        <div className="mx-auto max-w-7xl px-4 py-3">
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">//</span> Welcome back,{' '}
            <Link to={`/profile/${user.username}`} className="text-foreground hover:text-primary transition-colors">
              {user.username ?? user.name}
            </Link>
            . Keep the streak going.
          </p>
        </div>
      )}

      {/* Feature highlights */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
          // platform features
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>
    </div>
  );
}
