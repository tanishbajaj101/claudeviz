import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shuffle } from 'lucide-react';
import { getProblems, getProblemById } from '../data/problems';
import { ProblemTable } from '../components/problems/ProblemTable';
import { useBounty } from '../hooks/useBounty';

export function ProblemsPage() {
  const navigate = useNavigate();
  const baseProblems = getProblems();
  const { bounty, loading: bountyLoading, timeRemaining } = useBounty();

  const problems = useMemo(() => {
    if (!bounty) return baseProblems;
    const alreadyPresent = baseProblems.some((p) => p.id === bounty.problemId);
    if (alreadyPresent) return baseProblems;
    const bountyProblem = getProblemById(bounty.problemId);
    if (!bountyProblem) return baseProblems;
    return [bountyProblem, ...baseProblems];
  }, [baseProblems, bounty]);

  const handleRandomProblem = () => {
    if (problems.length === 0) return;
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    navigate(`/problems/${randomProblem.id}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/dhurandhar" className="block mb-6">
        <div className="flex items-center justify-between rounded-lg border border-primary bg-muted px-5 py-4 transition-colors hover:bg-accent">
          <span className="text-2xl font-semibold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>The Dhurandhar Chronicles</span>
          <span className="text-lg font-medium text-primary">Solve Now &rarr;</span>
        </div>
      </Link>
      {bountyLoading ? (
        <div className="flex items-center justify-center py-24 font-mono text-sm text-muted-foreground">
          Loading...
        </div>
      ) : (
        <ProblemTable problems={problems} bounty={bounty} timeRemaining={timeRemaining} onRandomProblem={handleRandomProblem} />
      )}
    </main>
  );
}
