import { importedProblems } from '../data/problems/all_problems.js';
import { XP_VALUES, calculateXP } from './xp.js';

export interface BountyInfo {
  problemId: string;
  problemTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  startsAt: string;   // ISO-8601
  expiresAt: string;  // ISO-8601
  bonusXp: number;    // total XP awarded when solving as bounty
}

// Sort problems by id for deterministic, stable ordering
const sortedProblems = [...importedProblems].sort((a, b) => a.id.localeCompare(b.id));

function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function intHash(n: number): number {
  let x = (n >>> 0);
  x = (Math.imul(x ^ (x >>> 16), 0x45d9f3b)) >>> 0;
  x = (Math.imul(x ^ (x >>> 16), 0x45d9f3b)) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  return x;
}

function getSeedForDate(date: Date): number {
  const year = date.getUTCFullYear();
  const doy = getDayOfYear(date);
  return intHash(year * 1000 + doy);
}

function getBountyParamsForDate(date: Date): { problemIndex: number; startHour: number } {
  const seed = getSeedForDate(date);
  return {
    problemIndex: seed % sortedProblems.length,
    startHour: (seed >>> 8) % 18,
  };
}

function makeBountyInfo(
  problemIndex: number,
  startHour: number,
  baseDate: Date
): BountyInfo {
  const problem = sortedProblems[problemIndex];
  const difficulty = problem.difficulty as 'Easy' | 'Medium' | 'Hard';
  const startsAt = new Date(Date.UTC(
    baseDate.getUTCFullYear(),
    baseDate.getUTCMonth(),
    baseDate.getUTCDate(),
    startHour, 0, 0, 0
  ));
  const expiresAt = new Date(startsAt.getTime() + 6 * 60 * 60 * 1000);
  return {
    problemId: problem.id,
    problemTitle: problem.title,
    difficulty,
    startsAt: startsAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    bonusXp: calculateXP(difficulty, true),
  };
}

/** Returns the active bounty if within the 6-hour window, otherwise null. */
export function getCurrentBounty(): BountyInfo | null {
  const now = new Date();
  const { problemIndex, startHour } = getBountyParamsForDate(now);
  const currentHour = now.getUTCHours();
  if (currentHour < startHour || currentHour >= startHour + 6) {
    return null;
  }
  return makeBountyInfo(problemIndex, startHour, now);
}

/** Returns a string key that changes only when a new bounty window begins. */
export function getBountyKey(): string {
  const now = new Date();
  const { startHour } = getBountyParamsForDate(now);
  const dateStr = now.toISOString().split('T')[0];
  return `${dateStr}-h${startHour}`;
}

/** Returns the next upcoming bounty start (today's if not yet started, else tomorrow's). */
export function getNextBountyStart(): { bounty: BountyInfo; startsAt: Date } | null {
  const now = new Date();

  // Check if today's bounty hasn't started yet
  const { problemIndex: todayIdx, startHour: todayHour } = getBountyParamsForDate(now);
  const todayStartTime = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    todayHour, 0, 0, 0
  ));

  if (now < todayStartTime) {
    return {
      bounty: makeBountyInfo(todayIdx, todayHour, now),
      startsAt: todayStartTime,
    };
  }

  // Compute tomorrow's bounty
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1
  ));
  const { problemIndex: tmrIdx, startHour: tmrHour } = getBountyParamsForDate(tomorrow);
  const tomorrowStartTime = new Date(Date.UTC(
    tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate(),
    tmrHour, 0, 0, 0
  ));

  return {
    bounty: makeBountyInfo(tmrIdx, tmrHour, tomorrow),
    startsAt: tomorrowStartTime,
  };
}

/** Check if a given problem is the current active bounty. */
export function isProblemBounty(problemId: string): boolean {
  const bounty = getCurrentBounty();
  return bounty?.problemId === problemId;
}
