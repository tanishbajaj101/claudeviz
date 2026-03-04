import { getProblems } from '../data/problems';
import { ProblemTable } from '../components/problems/ProblemTable';

/**
 * Home page - displays problem list.
 */
export function HomePage() {
  const problems = getProblems();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
          Problems
        </h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          {problems.length} problems available. Pick one and start coding.
        </p>
      </div>
      <ProblemTable problems={problems} />
    </main>
  );
}
