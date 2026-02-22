import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface DbUser {
  id: number;
  google_id: string;
  email: string;
  name: string;
  username: string;
  avatar_svg: string;
  created_at: string;
}

export interface DbSubmission {
  id: number;
  user_id: number;
  problem_id: string;
  status: string;
  time: string | null;
  memory: number | null;
  created_at: string;
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const dbDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, "algoarena.db");
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE COLLATE NOCASE,
        avatar_svg TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        problem_id TEXT NOT NULL,
        status TEXT NOT NULL,
        time TEXT,
        memory REAL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
    `);
  }
  return db;
}

export function getUserByGoogleId(googleId: string): DbUser | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE google_id = ?");
  return stmt.get(googleId) as DbUser | undefined;
}

export function getUserByUsername(username: string): DbUser | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE username = ? COLLATE NOCASE");
  return stmt.get(username) as DbUser | undefined;
}

export function createUser(data: {
  googleId: string;
  email: string;
  name: string;
  username: string;
  avatarSvg: string;
}): DbUser {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO users (google_id, email, name, username, avatar_svg)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.googleId,
    data.email,
    data.name,
    data.username,
    data.avatarSvg
  );
  return getUserByGoogleId(data.googleId)!;
}

export function isUsernameAvailable(username: string): boolean {
  const db = getDb();
  const stmt = db.prepare("SELECT COUNT(*) as count FROM users WHERE username = ? COLLATE NOCASE");
  const result = stmt.get(username) as { count: number };
  return result.count === 0;
}

export function getSubmissionsByUserId(userId: number): DbSubmission[] {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM submissions WHERE user_id = ? ORDER BY created_at DESC");
  return stmt.all(userId) as DbSubmission[];
}

export function getSolvedProblemsByUserId(userId: number): string[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT DISTINCT problem_id
    FROM submissions
    WHERE user_id = ? AND status = 'Accepted'
    ORDER BY problem_id
  `);
  const results = stmt.all(userId) as { problem_id: string }[];
  return results.map((r) => r.problem_id);
}

export function createSubmission(data: {
  userId: number;
  problemId: string;
  status: string;
  time?: string;
  memory?: number;
}): DbSubmission {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO submissions (user_id, problem_id, status, time, memory)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.userId,
    data.problemId,
    data.status,
    data.time ?? null,
    data.memory ?? null
  );
  const selectStmt = db.prepare("SELECT * FROM submissions WHERE id = ?");
  return selectStmt.get(result.lastInsertRowid) as DbSubmission;
}
