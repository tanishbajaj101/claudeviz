/**
 * Prisma client singleton with better-sqlite3 adapter (required for Prisma 7).
 *
 * Instantiate once in development (avoiding hot-reload exhaustion)
 * and once per cold start in production.
 *
 * Import path: @/lib/prisma
 */

import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function createPrismaClient(): PrismaClient {
  const dbPath = path.join(process.cwd(), "data", "algoarena.db");
  // PrismaBetterSqlite3 accepts { url: "file:<path>" } — creates the DB connection internally
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["warn", "error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
