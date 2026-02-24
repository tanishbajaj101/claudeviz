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
  // Activity fields — added via ALTER TABLE migration in getDb().
  // May be null for users created before this migration.
  last_opened_problem_id: string | null;
  last_active: string | null;
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

export function getDb(): Database.Database {
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

    // Idempotent migrations — add activity-tracking columns if they don't
    // exist yet. SQLite does not support IF NOT EXISTS on ALTER TABLE, so we
    // catch the error and continue.
    const existingCols = (
      db.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>
    ).map((c) => c.name);

    if (!existingCols.includes("last_opened_problem_id")) {
      db.exec(
        "ALTER TABLE users ADD COLUMN last_opened_problem_id TEXT DEFAULT NULL"
      );
      console.log("[db] Added column users.last_opened_problem_id");
    }

    if (!existingCols.includes("last_active")) {
      db.exec("ALTER TABLE users ADD COLUMN last_active TEXT DEFAULT NULL");
      console.log("[db] Added column users.last_active");
    }
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
  const stmt = db.prepare(
    "SELECT * FROM users WHERE username = ? COLLATE NOCASE"
  );
  return stmt.get(username) as DbUser | undefined;
}

export function getUserById(id: number): DbUser | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  return stmt.get(id) as DbUser | undefined;
}

/**
 * Search users by username (case-insensitive partial match).
 * Returns at most `limit` results (default 20).
 */
export function searchUsersByUsername(
  query: string,
  limit = 20
): DbUser[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM users WHERE username LIKE ? COLLATE NOCASE LIMIT ?"
  );
  return stmt.all(`%${query}%`, limit) as DbUser[];
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
  stmt.run(
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
  const stmt = db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE username = ? COLLATE NOCASE"
  );
  const result = stmt.get(username) as { count: number };
  return result.count === 0;
}

/**
 * Update `last_opened_problem_id` and `last_active` for the given user.
 * Both columns must exist (ensured by getDb() migration).
 */
export function updateLastProblem(
  userId: number,
  problemId: string,
  // `solved` is accepted for API-compatibility but we don't store solved state
  // in the users table — that lives in submissions.
  _solved: boolean
): void {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE users
    SET last_opened_problem_id = ?,
        last_active            = datetime('now')
    WHERE id = ?
  `);
  stmt.run(problemId, userId);
}

/**
 * Touch `last_active` for a user without changing last_opened_problem_id.
 */
export function touchLastActive(userId: number): void {
  const db = getDb();
  const stmt = db.prepare(
    "UPDATE users SET last_active = datetime('now') WHERE id = ?"
  );
  stmt.run(userId);
}

export function getSubmissionsByUserId(userId: number): DbSubmission[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM submissions WHERE user_id = ? ORDER BY created_at DESC"
  );
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

// ---------------------------------------------------------------------------
// Legacy Phase-5 stubs — these functions were referenced by pre-existing
// route files but were never implemented. The data they operate on now lives
// in Prisma-managed tables (friend_requests, notifications, messages).
// New code should use Prisma directly; these stubs exist only to keep the
// TypeScript compiler satisfied while those old routes are migrated.
// ---------------------------------------------------------------------------

/** @deprecated Use Prisma `friendRequest.create` directly. */
export function sendFriendRequest(
  requesterId: number,
  addresseeId: number
): void {
  console.warn(
    "[db] sendFriendRequest is a stub — use Prisma friendRequest.create instead.",
    { requesterId, addresseeId }
  );
}

/** @deprecated Use Prisma `notification.create` directly. */
export function createNotification(
  userId: number,
  type: string,
  data: Record<string, unknown>
): void {
  console.warn(
    "[db] createNotification is a stub — use Prisma notification.create instead.",
    { userId, type, data }
  );
}

export interface DbFriendRequest {
  id: string;
  sender_id: number;
  receiver_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use Prisma `friendRequest.findMany` with status='pending' instead. */
export function getPendingFriendRequests(_userId: number): DbFriendRequest[] {
  console.warn(
    "[db] getPendingFriendRequests is a stub — use Prisma friendRequest.findMany instead."
  );
  return [];
}

/** @deprecated Use Prisma `friendRequest.update` directly. */
export function respondFriendRequest(
  _friendshipId: string,
  _status: "accepted" | "rejected"
): void {
  console.warn(
    "[db] respondFriendRequest is a stub — use Prisma friendRequest.update instead."
  );
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: number;
  type: string;
  content: string;
  metadata: string | null;
  created_at: string;
}

/** @deprecated Use Prisma `message.findMany` with conversation filter instead. */
export function getMessagesWithFriend(
  _userId: number,
  _friendId: number
): DbMessage[] {
  console.warn(
    "[db] getMessagesWithFriend is a stub — use Prisma message.findMany instead."
  );
  return [];
}

/** @deprecated Use Prisma `message.create` directly. */
export function createMessage(_data: {
  senderId: number;
  recipientId?: number;
  contestId?: string;
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
}): DbMessage | null {
  console.warn(
    "[db] createMessage is a stub — use Prisma message.create instead."
  );
  return null;
}

/** @deprecated Use Prisma `notification.updateMany` directly. */
export function markNotificationsRead(
  _userId: number,
  _ids?: string[]
): void {
  console.warn(
    "[db] markNotificationsRead is a stub — use Prisma notification.updateMany instead."
  );
}
