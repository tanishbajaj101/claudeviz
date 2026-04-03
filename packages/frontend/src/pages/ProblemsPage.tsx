import { useNavigate } from 'react-router-dom';
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
      <ProblemTable problems={problems} onRandomProblem={handleRandomProblem} />
    </main>
  );
}
