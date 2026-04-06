import { Link } from 'react-router-dom';
import { getProblems } from '../../data/problems';
import { useAuth } from '../../contexts/AuthContext';

export function CtaSection() {
  const problems = getProblems();
  const { user } = useAuth();
  const categoryCount = new Set(problems.map(p => p.category)).size;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="rounded-lg border border-border bg-card/50 px-6 py-12 md:py-16 text-center">
        <p className="font-mono text-sm text-muted-foreground mb-3">
          <span className="text-primary">$</span> ./codetracer --join
        </p>
        <h2 className="font-mono text-2xl md:text-3xl font-bold text-foreground">
          Ready to level up your algorithms?
        </h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {user ? 'Continue Solving' : 'Start Solving'} →
          </Link>
          <Link
            to={user ? '/problems' : '/auth/signin'}
            className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-mono text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            {user ? 'View Problems' : 'Create Account'}
          </Link>
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {problems.length} problems across {categoryCount} categories — free and open
        </p>
      </div>
    </section>
  );
}
