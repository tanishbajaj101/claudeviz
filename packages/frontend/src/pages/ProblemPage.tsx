import { useParams, Navigate } from 'react-router-dom';
import { getProblemById } from '../data/problems';
import { ProblemWorkspace } from '../components/problems/ProblemWorkspace';
import { useBounty, formatTimeRemaining } from '../hooks/useBounty';
import { Flame } from 'lucide-react';

/**
 * Problem workspace page - displays the code editor and runner.
 */
export function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const { bounty, timeRemaining } = useBounty();

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

  const isBounty = bounty?.problemId === id;

  return (
    <>
      {isBounty && (
        <div className="fixed left-0 right-0 top-14 z-40 flex items-center justify-center gap-3 bg-amber-500/15 px-4 py-2 backdrop-blur-sm border-b border-amber-500/30">
          <Flame size={16} className="text-amber-400 flex-shrink-0" />
          <span className="font-mono text-sm font-semibold text-amber-400">BOUNTY PROBLEM</span>
          <span className="font-mono text-sm text-amber-300/80">·</span>
          <span className="font-mono text-sm text-amber-300/80">
            Earn <span className="font-bold text-amber-400">+{bounty!.bonusXp} XP</span>
          </span>
          <span className="font-mono text-sm text-amber-300/80">·</span>
          <span className="font-mono text-sm text-amber-300/80">
            Expires in <span className="font-bold text-amber-400">{formatTimeRemaining(timeRemaining)}</span>
          </span>
        </div>
      )}
      <ProblemWorkspace problem={problem} />
    </>
  );
}
