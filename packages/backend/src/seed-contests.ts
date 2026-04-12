/**
 * Seed script: creates 3 public contests as the first user in the DB.
 * Run from the repo root:
 *   npx tsx packages/backend/src/seed-contests.ts
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { selectRandomProblems, type ProblemSlotSpec } from './lib/contest-helpers.js';

const prisma = new PrismaClient();

// 5pm IST = 11:30am UTC
function istDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 11, 30, 0, 0));
}

const CONTESTS: Array<{
  title: string;
  starts_at: Date;
  slots: ProblemSlotSpec[];
}> = [
  {
    title: 'Foundations Challenge',
    starts_at: istDate(2026, 4, 12),
    slots: [
      { difficulty: 'easy',   topics: ['array', 'hash-table'] },
      { difficulty: 'easy',   topics: ['array', 'binary-search'] },
      { difficulty: 'medium', topics: ['array', 'two-pointers'] },
    ],
  },
  {
    title: 'String & DP Sprint',
    starts_at: istDate(2026, 4, 16),
    slots: [
      { difficulty: 'easy',   topics: ['string', 'stack'] },
      { difficulty: 'medium', topics: ['string', 'dynamic-programming'] },
      { difficulty: 'medium', topics: ['hash-table', 'string', 'sliding-window'] },
      { difficulty: 'hard',   topics: ['string', 'dynamic-programming'] },
    ],
  },
  {
    title: 'Advanced Algorithms',
    starts_at: istDate(2026, 4, 20),
    slots: [
      { difficulty: 'medium', topics: ['array', 'backtracking'] },
      { difficulty: 'medium', topics: ['array', 'dynamic-programming'] },
      { difficulty: 'hard',   topics: ['array', 'two-pointers', 'dynamic-programming'] },
      { difficulty: 'hard',   topics: ['array', 'binary-search', 'divide-and-conquer'] },
    ],
  },
];

async function main() {
  const creator = await prisma.user.findFirst({ orderBy: { id: 'asc' } });
  if (!creator) {
    console.error('No users found. Sign in at least once before seeding.');
    process.exit(1);
  }
  console.log(`Seeding as: ${creator.username} (id=${creator.id})\n`);

  for (const def of CONTESTS) {
    // Randomly select problems using the same logic as POST /api/contests
    const selected = selectRandomProblems(def.slots);

    const contest = await prisma.$transaction(async (tx) => {
      const newContest = await tx.contest.create({
        data: {
          title: def.title,
          creator_id: creator.id,
          is_public: true,
          starts_at: def.starts_at,
          duration_minutes: 60,
        },
      });

      await tx.contestProblem.createMany({
        data: selected.map((sp) => ({
          contest_id: newContest.id,
          problem_id: sp.problem.id,
          order: sp.order,
          difficulty: sp.difficulty,
        })),
      });

      await tx.contestParticipant.create({
        data: { contest_id: newContest.id, user_id: creator.id, total_score: 0 },
      });

      await tx.conversation.create({
        data: {
          type: 'contest',
          contest_id: newContest.id,
          participants: { create: { user_id: creator.id } },
        },
      });

      return newContest;
    });

    console.log(`✓ "${contest.title}"`);
    console.log(`  id:         ${contest.id}`);
    console.log(`  starts_at:  ${contest.starts_at.toISOString()} (5pm IST)`);
    console.log(`  problems:`);
    for (const sp of selected) {
      console.log(`    [${sp.order}] ${sp.problem.id} (${sp.difficulty})`);
    }
    console.log();
  }

  console.log('Done! Seeded 3 public contests.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
