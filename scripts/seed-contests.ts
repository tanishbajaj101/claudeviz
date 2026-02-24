/**
 * Seed script: creates 4 public contests with problems from the data pool.
 *
 * Usage: npx tsx scripts/seed-contests.ts
 *
 * Target: 3 problems per contest (1 easy, 1 medium, 1 hard).
 * Fallback: when the pool lacks a difficulty level, picks any unused problem.
 * The script never adds the same problem twice to a single contest (unique constraint).
 *
 * Note: The current problem pool only has Easy problems, so you will see
 * warnings about missing medium/hard problems. The seed will use all distinct
 * available problems as slots (up to 3) and skip slots it cannot fill uniquely.
 */

import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Resolve project root relative to this script
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DB_PATH = path.join(PROJECT_ROOT, "data", "algoarena.db");

type Difficulty = "easy" | "medium" | "hard";

interface ProblemRecord {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
}

interface SelectedProblem {
  problemId: string;
  order: number;
  difficulty: Difficulty;
}

// Crypto-random integer in [min, max)
function cryptoRandomInt(min: number, max: number): number {
  const range = max - min;
  if (range <= 0) return min;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeCrypto = require("crypto") as typeof import("crypto");
  return min + nodeCrypto.randomInt(0, range);
}

/**
 * Pick up to 3 distinct problems from the pool for a single contest.
 * Tries to honor difficulty order (easy → medium → hard).
 * Falls back to any unused problem when the target difficulty is unavailable.
 * Skips a slot entirely when no unused problems remain.
 */
function pickProblems(allProblems: ProblemRecord[]): SelectedProblem[] {
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];
  const usedIds = new Set<string>();
  const picked: SelectedProblem[] = [];

  for (let i = 0; i < difficulties.length; i++) {
    const targetDifficulty = difficulties[i];
    const order = i + 1;

    // Primary: match difficulty and not yet used
    let candidates = allProblems.filter(
      (p) => p.difficulty.toLowerCase() === targetDifficulty && !usedIds.has(p.id)
    );

    if (candidates.length === 0) {
      // Fallback: any unused problem regardless of difficulty
      console.warn(
        `[seed] Warning: No ${targetDifficulty} problems available for slot ${order}. ` +
          `Using any available unused problem.`
      );
      candidates = allProblems.filter((p) => !usedIds.has(p.id));
    }

    if (candidates.length === 0) {
      // All distinct problems are used — skip this slot to avoid duplicate constraint
      console.warn(
        `[seed] Warning: All ${allProblems.length} problems already assigned. Skipping slot ${order}.`
      );
      continue;
    }

    const chosen = candidates[cryptoRandomInt(0, candidates.length)];
    usedIds.add(chosen.id);
    picked.push({
      problemId: chosen.id,
      order,
      difficulty: targetDifficulty,
    });

    console.log(
      `[seed]   Slot ${order} (${targetDifficulty}): "${chosen.id}" — "${chosen.title}" (actual difficulty: ${chosen.difficulty})`
    );
  }

  return picked;
}

async function main() {
  // Set up Prisma with the better-sqlite3 adapter (required for Prisma 7).
  // PrismaBetterSqlite3 accepts { url } with the file: prefix.
  const adapter = new PrismaBetterSqlite3({ url: `file:${DB_PATH}` });
  const prisma = new PrismaClient({ adapter, log: ["warn", "error"] });

  // Import problem data via file:// URL (required on Windows for ESM dynamic import)
  const problemsFilePath = path.join(PROJECT_ROOT, "src", "data", "problems.ts");
  const problemsFileUrl = new URL(
    `file:///${problemsFilePath.replace(/\\/g, "/")}`
  ).href;
  const problemsModule = await import(problemsFileUrl);
  const allProblems: ProblemRecord[] = problemsModule.problems;

  console.log(`[seed] Loaded ${allProblems.length} problems from data pool:`);
  allProblems.forEach((p) =>
    console.log(
      `[seed]   - ${p.id} (${p.difficulty}) tags=[${p.tags.join(", ")}]`
    )
  );

  try {
    // --- Find or create a seed user ---
    let seedUser = await prisma.user.findFirst({ orderBy: { id: "asc" } });

    if (!seedUser) {
      console.log("[seed] No users found. Creating a seed user...");
      seedUser = await prisma.user.create({
        data: {
          google_id: "seed-google-id-0001",
          email: "seed@algoarena.dev",
          name: "Seed User",
          username: "seeduser",
          avatar_svg: "<svg></svg>",
          created_at: new Date().toISOString(),
        },
      });
      console.log(`[seed] Created seed user: id=${seedUser.id}`);
    } else {
      console.log(
        `[seed] Using existing user: id=${seedUser.id}, username=${seedUser.username}`
      );
    }

    // --- Generate 4 public contests staggered over next 4 days ---
    const now = new Date();
    const contestsConfig = [
      { title: "Weekly Challenge #1", daysOffset: 1 },
      { title: "Weekly Challenge #2", daysOffset: 2 },
      { title: "Weekly Challenge #3", daysOffset: 3 },
      { title: "Weekly Challenge #4", daysOffset: 4 },
    ];

    let createdCount = 0;

    for (const cfg of contestsConfig) {
      console.log(`\n[seed] Creating contest: "${cfg.title}"...`);

      const startsAt = new Date(now);
      startsAt.setDate(startsAt.getDate() + cfg.daysOffset);
      startsAt.setMinutes(0, 0, 0); // Round to nearest hour

      const selectedProblems = pickProblems(allProblems);

      if (selectedProblems.length === 0) {
        console.warn(
          `[seed] Warning: Could not select any problems for "${cfg.title}". Skipping contest.`
        );
        continue;
      }

      const contest = await prisma.$transaction(async (tx) => {
        // 1. Create contest
        const newContest = await tx.contest.create({
          data: {
            title: cfg.title,
            creator_id: seedUser!.id,
            is_public: true,
            starts_at: startsAt,
            duration_minutes: 60,
          },
        });

        // 2. Create problem assignments
        await tx.contestProblem.createMany({
          data: selectedProblems.map((sp) => ({
            contest_id: newContest.id,
            problem_id: sp.problemId,
            order: sp.order,
            difficulty: sp.difficulty,
          })),
        });

        // 3. Add creator as participant
        await tx.contestParticipant.create({
          data: {
            contest_id: newContest.id,
            user_id: seedUser!.id,
            total_score: 0,
          },
        });

        // 4. Create contest conversation with creator as first member
        await tx.conversation.create({
          data: {
            type: "contest",
            contest_id: newContest.id,
            participants: {
              create: { user_id: seedUser!.id },
            },
          },
        });

        return newContest;
      });

      createdCount++;
      console.log(
        `[seed] Created contest "${contest.title}" (id=${contest.id}, starts_at=${startsAt.toISOString()}, problems=${selectedProblems.length})`
      );
    }

    console.log(
      `\n[seed] Done. ${createdCount} public contest(s) created successfully.`
    );
    if (createdCount < contestsConfig.length) {
      console.log(
        `[seed] Note: ${contestsConfig.length - createdCount} contest(s) were skipped due to insufficient problems.`
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[seed] Fatal error:", err);
  process.exit(1);
});
