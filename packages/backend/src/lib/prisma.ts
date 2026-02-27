/**
 * Prisma client singleton for PostgreSQL.
 *
 * Reads DATABASE_URL from the environment automatically.
 * Instantiated once in development (avoids hot-reload exhaustion)
 * and once per cold start in production.
 */

import { PrismaClient } from "@prisma/client";

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
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
