import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: `file:${path.join(process.cwd(), "data", "algoarena.db")}`,
  },
  experimental: {
    // Required to mark legacy tables (users, submissions) as externally managed
    externalTables: true,
  },
  // Tell Prisma these tables are managed externally by better-sqlite3
  // Prisma will not generate migrations for them, but still tracks relations
  tables: {
    external: ["users", "submissions"],
  },
});
