import { useNavigate, Link } from 'react-router-dom';
import { Shuffle } from 'lucide-react';
import { getProblems } from '../data/problems';
import { ProblemTable } from '../components/problems/ProblemTable';

export function ProblemsPage() {
  const navigate = useNavigate();
  const problems = getProblems();

  const handleRandomProblem = () => {
    if (problems.length === 0) return;
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    navigate(`/problems/${randomProblem.id}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/dhurandhar" className="block mb-6">
        <div className="flex items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/5 px-5 py-4 transition-colors hover:bg-amber-500/10 hover:border-amber-500/50">
          <span className="text-2xl font-semibold text-amber-400" style={{ fontFamily: "'Cinzel', serif" }}>The Dhurandhar Chronicles</span>
        </div>
      </Link>
      <ProblemTable problems={problems} onRandomProblem={handleRandomProblem} />
    </main>
  );
}
