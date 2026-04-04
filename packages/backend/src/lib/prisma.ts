/**
 * Prisma client singleton for PostgreSQL.
 *
 * Reads DATABASE_URL from the environment automatically.
 */

import { PrismaClient } from "@prisma/client";

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: ["warn", "error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In production only mode, we still use the singleton pattern to be safe,
// but we don't need the NODE_ENV check.
globalForPrisma.prisma = prisma;
