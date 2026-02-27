/**
 * Contest status derivation helpers.
 *
 * CRITICAL RULE: Contest status is NEVER stored in the database.
 * It is always computed from `starts_at` and `duration_minutes`.
 *
 * Status logic:
 *   upcoming  — starts_at > now()
 *   active    — starts_at <= now() AND starts_at + duration_minutes > now()
 *   completed — starts_at + duration_minutes <= now()
 */

export type ContestStatus = "upcoming" | "active" | "completed";

/**
 * Derive the contest status from its start time and duration.
 *
 * @param startsAt        - The contest start time (Date object or ISO string)
 * @param durationMinutes - The contest duration in minutes
 * @param now             - Reference point for "now" (defaults to current time; injectable for testing)
 * @returns               - One of 'upcoming' | 'active' | 'completed'
 */
export function getContestStatus(
  startsAt: Date | string,
  durationMinutes: number,
  now: Date = new Date()
): ContestStatus {
  const start = typeof startsAt === "string" ? new Date(startsAt) : startsAt;
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  if (now < start) {
    return "upcoming";
  }

  if (now < end) {
    return "active";
  }

  return "completed";
}

/**
 * Returns the contest end time (start + duration).
 *
 * @param startsAt        - The contest start time
 * @param durationMinutes - The contest duration in minutes
 */
export function getContestEndTime(
  startsAt: Date | string,
  durationMinutes: number
): Date {
  const start = typeof startsAt === "string" ? new Date(startsAt) : startsAt;
  return new Date(start.getTime() + durationMinutes * 60_000);
}

/**
 * Returns the remaining time in milliseconds for an active contest.
 * Returns 0 if the contest is not active.
 *
 * @param startsAt        - The contest start time
 * @param durationMinutes - The contest duration in minutes
 * @param now             - Reference point for "now" (defaults to current time)
 */
export function getContestRemainingMs(
  startsAt: Date | string,
  durationMinutes: number,
  now: Date = new Date()
): number {
  const status = getContestStatus(startsAt, durationMinutes, now);
  if (status !== "active") return 0;

  const end = getContestEndTime(startsAt, durationMinutes);
  return Math.max(0, end.getTime() - now.getTime());
}

/**
 * Score lookup for contest problems by difficulty.
 * Only awarded when is_correct = true.
 */
export const CONTEST_SCORES = {
  easy: 100,
  medium: 200,
  hard: 300,
} as const satisfies Record<"easy" | "medium" | "hard", number>;

/**
 * Calculate the score for a contest submission.
 *
 * @param difficulty  - Problem difficulty ('easy' | 'medium' | 'hard')
 * @param isCorrect   - Whether the submission is correct
 */
export function calculateContestScore(
  difficulty: "easy" | "medium" | "hard",
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;
  return CONTEST_SCORES[difficulty];
}
