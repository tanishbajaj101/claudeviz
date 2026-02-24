-- Baseline migration: captures the existing tables created by better-sqlite3
-- These tables (users, submissions) are managed externally and already exist.
-- This migration is marked as applied via `prisma migrate resolve --applied`.

CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "google_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar_svg" TEXT NOT NULL,
    "created_at" TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_google_id_key" ON "users"("google_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username" COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS "idx_users_google_id" ON "users"("google_id");

CREATE TABLE IF NOT EXISTS "submissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
    "problem_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "time" TEXT,
    "memory" REAL,
    "created_at" TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS "idx_submissions_user_id" ON "submissions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_submissions_problem_id" ON "submissions"("problem_id");
