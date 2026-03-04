import { useParams, Navigate } from 'react-router-dom';
import { getProblemById } from '../data/problems';
import { ProblemWorkspace } from '../components/problems/ProblemWorkspace';

/**
 * Problem workspace page - displays the code editor and runner.
 */
export function ProblemPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const problem = getProblemById(id);

  if (!problem) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="mt-2 text-muted-foreground">Problem not found</p>
        </div>
      </div>
    );
  }

  return <ProblemWorkspace problem={problem} />;
}
