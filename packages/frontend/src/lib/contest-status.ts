/**
 * Contest status utilities - Frontend stub
 *
 * TODO (Task #12): Import from shared package or backend utilities
 */

export type ContestStatus = 'upcoming' | 'active' | 'completed';

export function getContestStatus(startsAt: string, durationMinutes: number): ContestStatus {
  const now = Date.now();
  const start = new Date(startsAt).getTime();
  const end = start + durationMinutes * 60 * 1000;

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
}

export function calculateContestScore(
  difficulty: 'easy' | 'medium' | 'hard',
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;

  const baseScores = {
    easy: 100,
    medium: 200,
    hard: 300,
  };

  return baseScores[difficulty];
}
