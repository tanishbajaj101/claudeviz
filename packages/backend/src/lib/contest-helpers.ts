/**
 * Contest helper functions for problem selection, conversation setup, and invites.
 */

import { prisma } from "./prisma.js";
import { problems } from "../data/problems.js";
import type { Problem } from "@algoarena/shared";

// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------

/** Per-problem stats for a single participant. */
export interface LeaderboardPerProblem {
  problem_id: string;
  best_score: number;
  attempts: number;
}

/** A single row in the contest leaderboard. */
export interface LeaderboardRow {
  user_id: number;
  username: string;
  avatar_url: string | null;
  total_score: number;
  problems_solved: number;
  last_correct_at: string | null; // ISO 8601
  per_problem: LeaderboardPerProblem[];
}

/**
 * Builds the full contest leaderboard from the database.
 *
 * Sorting: total_score DESC, last_correct_at ASC (earlier correct submission wins tiebreak).
 *
 * @param contestId - The UUID of the contest.
 * @returns         - Ranked leaderboard array.
 */
export async function buildContestLeaderboard(
  contestId: string
): Promise<LeaderboardRow[]> {
  // Fetch all participants with user info
  const participants = await prisma.contestParticipant.findMany({
    where: { contest_id: contestId },
    include: {
      user: {
        select: { id: true, username: true, avatar_svg: true },
      },
    },
  });

  if (participants.length === 0) return [];

  // Fetch all submissions for this contest at once
  const allSubmissions = await prisma.contestSubmission.findMany({
    where: { contest_id: contestId },
    orderBy: { submitted_at: "asc" },
  });

  // Build rows for each participant
  const rows: LeaderboardRow[] = participants.map((participant) => {
    const userId = participant.user_id;

    // All submissions for this user in this contest
    const userSubmissions = allSubmissions.filter((s) => s.user_id === userId);

    // Group by problem_id → compute best score and attempts
    const problemMap = new Map<
      string,
      { best_score: number; attempts: number; last_correct_at: Date | null }
    >();

    for (const sub of userSubmissions) {
      const existing = problemMap.get(sub.problem_id);
      if (!existing) {
        problemMap.set(sub.problem_id, {
          best_score: sub.score,
          attempts: 1,
          last_correct_at: sub.is_correct ? sub.submitted_at : null,
        });
      } else {
        existing.attempts += 1;
        if (sub.score > existing.best_score) {
          existing.best_score = sub.score;
        }
        if (sub.is_correct && existing.last_correct_at === null) {
          existing.last_correct_at = sub.submitted_at;
        }
      }
    }

    // Compute totals
    let totalScore = 0;
    let problemsSolved = 0;
    let lastCorrectAt: Date | null = null;
    const perProblem: LeaderboardPerProblem[] = [];

    for (const [problemId, stats] of problemMap.entries()) {
      totalScore += stats.best_score;
      if (stats.best_score > 0) {
        problemsSolved += 1;
      }
      // Track earliest correct submission across all problems (tiebreaker)
      if (stats.last_correct_at !== null) {
        if (
          lastCorrectAt === null ||
          stats.last_correct_at < lastCorrectAt
        ) {
          lastCorrectAt = stats.last_correct_at;
        }
      }
      perProblem.push({
        problem_id: problemId,
        best_score: stats.best_score,
        attempts: stats.attempts,
      });
    }

    return {
      user_id: userId,
      username: participant.user.username,
      avatar_url: participant.user.avatar_svg ?? null,
      total_score: totalScore,
      problems_solved: problemsSolved,
      last_correct_at: lastCorrectAt ? lastCorrectAt.toISOString() : null,
      per_problem: perProblem,
    };
  });

  // Sort: total_score DESC, then last_correct_at ASC (null last)
  rows.sort((a, b) => {
    if (b.total_score !== a.total_score) {
      return b.total_score - a.total_score;
    }
    // Tiebreaker: earlier last_correct_at wins
    if (a.last_correct_at === null && b.last_correct_at === null) return 0;
    if (a.last_correct_at === null) return 1;
    if (b.last_correct_at === null) return -1;
    return (
      new Date(a.last_correct_at).getTime() -
      new Date(b.last_correct_at).getTime()
    );
  });

  return rows;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProblemSlotSpec {
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
}

export interface SelectedContestProblem {
  problem: Problem;
  order: number;
  difficulty: "easy" | "medium" | "hard";
}

// ---------------------------------------------------------------------------
// Random Problem Selection
// ---------------------------------------------------------------------------

/**
 * Selects random problems from the data pool matching the given specs.
 * Uses crypto.randomInt for secure randomness.
 * Guarantees no duplicate problems within the contest.
 * Throws if no matching problem exists for any slot.
 */
export function selectRandomProblems(
  problemSpecs: ProblemSlotSpec[]
): SelectedContestProblem[] {
  const usedProblemIds = new Set<string>();
  const selected: SelectedContestProblem[] = [];

  for (let i = 0; i < problemSpecs.length; i++) {
    const spec = problemSpecs[i];

    // Filter problems matching difficulty and at least one topic
    const candidates = problems.filter((p) => {
      // Normalize difficulty comparison (DB stores lowercase, Problem type stores capitalized)
      const problemDifficulty = p.difficulty.toLowerCase() as
        | "easy"
        | "medium"
        | "hard";

      if (problemDifficulty !== spec.difficulty) return false;

      // At least one topic must match (using tags field)
      const problemTopics = p.tags.map((t) => t.toLowerCase());
      const hasMatchingTopic = spec.topics.some((topic) =>
        problemTopics.includes(topic.toLowerCase())
      );
      if (!hasMatchingTopic) return false;

      // Must not already be selected in this contest
      if (usedProblemIds.has(p.id)) return false;

      return true;
    });

    if (candidates.length === 0) {
      throw new Error(
        `No available problem found for slot ${i + 1}: difficulty="${spec.difficulty}", topics=[${spec.topics.join(", ")}]. ` +
          `Check that matching problems exist in the problem pool and are not already selected.`
      );
    }

    // Cryptographically random selection
    const randomIndex = cryptoRandomInt(0, candidates.length);
    const chosen = candidates[randomIndex];

    usedProblemIds.add(chosen.id);
    selected.push({
      problem: chosen,
      order: i + 1,
      difficulty: spec.difficulty,
    });

    console.log(
      `[contest-helpers] Slot ${i + 1}: selected problem "${chosen.id}" (${chosen.difficulty}) from ${candidates.length} candidate(s)`
    );
  }

  return selected;
}

/**
 * Returns a cryptographically random integer in [min, max).
 */
import { randomInt } from "crypto";

function cryptoRandomInt(min: number, max: number): number {
  const range = max - min;
  if (range <= 0) return min;

  return min + randomInt(0, range);
}

// ---------------------------------------------------------------------------
// Contest Conversation Setup
// ---------------------------------------------------------------------------

/**
 * Creates a contest chat Conversation and adds the creator as the first participant.
 * Returns the created conversation ID.
 */
export async function createContestConversation(
  contestId: string,
  creatorId: number
): Promise<string> {
  const conversation = await prisma.conversation.create({
    data: {
      type: "contest",
      contest_id: contestId,
      participants: {
        create: {
          user_id: creatorId,
        },
      },
    },
  });

  return conversation.id;
}

// ---------------------------------------------------------------------------
// Contest Invite Notifications
// ---------------------------------------------------------------------------

/** Notification record shape returned by sendContestInvites. */
export interface ContestInviteNotification {
  notificationId: string;
  userId: number;
  data: {
    contest_id: string;
    contest_name: string;
    inviter_name: string;
    starts_at: string;
  };
  createdAt: string;
}

/**
 * Creates contest_invite Notifications for each invited user.
 * Returns the created notification records so the caller can emit
 * real-time Socket.IO events.
 * Skips users who are not found in the database (silently).
 */
export async function sendContestInvites(
  contestId: string,
  contestName: string,
  startsAt: Date,
  invitedUserIds: number[],
  inviterName: string
): Promise<ContestInviteNotification[]> {
  if (invitedUserIds.length === 0) return [];

  const notificationData = {
    contest_id: contestId,
    contest_name: contestName,
    inviter_name: inviterName,
    starts_at: startsAt.toISOString(),
  };

  const dataJson = JSON.stringify(notificationData);

  // createMany doesn't return IDs in SQLite, so we create individually
  const created: ContestInviteNotification[] = [];
  for (const userId of invitedUserIds) {
    try {
      const notif = await prisma.notification.create({
        data: {
          user_id: userId,
          type: "contest_invite",
          data: dataJson,
          is_read: false,
        },
      });
      created.push({
        notificationId: notif.id,
        userId,
        data: notificationData,
        createdAt: notif.created_at.toISOString(),
      });
    } catch (err) {
      // Log but continue for remaining users
      console.error(
        `[contest-helpers] Failed to create invite notification for user ${userId}:`,
        err
      );
    }
  }

  return created;
}
