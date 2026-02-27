/**
 * Database access layer — backed by Prisma + PostgreSQL.
 *
 * All functions are async. The underlying better-sqlite3 layer has been
 * removed; everything goes through the shared Prisma singleton.
 */

import { prisma } from "./prisma.js";

export interface DbUser {
  id: number;
  google_id: string;
  email: string;
  name: string;
  username: string;
  avatar_svg: string;
  created_at: Date;
  last_opened_problem_id: string | null;
  last_active: Date | null;
}

export interface DbSubmission {
  id: number;
  user_id: number;
  problem_id: string;
  status: string;
  time: string | null;
  memory: number | null;
  created_at: Date;
}

export async function getUserByGoogleId(
  googleId: string
): Promise<DbUser | null> {
  return prisma.user.findUnique({ where: { google_id: googleId } });
}

export async function getUserByUsername(
  username: string
): Promise<DbUser | null> {
  return prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
}

export async function getUserById(id: number): Promise<DbUser | null> {
  return prisma.user.findUnique({ where: { id } });
}

/**
 * Search users by username (case-insensitive partial match).
 * Returns at most `limit` results (default 20).
 */
export async function searchUsersByUsername(
  query: string,
  limit = 20
): Promise<DbUser[]> {
  return prisma.user.findMany({
    where: { username: { contains: query, mode: "insensitive" } },
    take: limit,
  });
}

export async function createUser(data: {
  googleId: string;
  email: string;
  name: string;
  username: string;
  avatarSvg: string;
}): Promise<DbUser> {
  return prisma.user.create({
    data: {
      google_id: data.googleId,
      email: data.email,
      name: data.name,
      username: data.username,
      avatar_svg: data.avatarSvg,
    },
  });
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: { username: { equals: username, mode: "insensitive" } },
  });
  return count === 0;
}

/**
 * Update `last_opened_problem_id` and `last_active` for the given user.
 */
export async function updateLastProblem(
  userId: number,
  problemId: string,
  // `solved` is accepted for API-compatibility but we don't store solved state
  // in the users table — that lives in submissions.
  _solved: boolean
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      last_opened_problem_id: problemId,
      last_active: new Date(),
    },
  });
}

/**
 * Touch `last_active` for a user without changing last_opened_problem_id.
 */
export async function touchLastActive(userId: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { last_active: new Date() },
  });
}

export async function getSubmissionsByUserId(
  userId: number
): Promise<DbSubmission[]> {
  return prisma.submission.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
}

export async function getSolvedProblemsByUserId(
  userId: number
): Promise<string[]> {
  const results = await prisma.submission.findMany({
    where: { user_id: userId, status: "Accepted" },
    distinct: ["problem_id"],
    select: { problem_id: true },
    orderBy: { problem_id: "asc" },
  });
  return results.map((r) => r.problem_id);
}

export async function createSubmission(data: {
  userId: number;
  problemId: string;
  status: string;
  time?: string;
  memory?: number;
}): Promise<DbSubmission> {
  return prisma.submission.create({
    data: {
      user_id: data.userId,
      problem_id: data.problemId,
      status: data.status,
      time: data.time ?? null,
      memory: data.memory ?? null,
    },
  });
}

// ---------------------------------------------------------------------------
// Legacy stubs for friend requests, notifications, and messages.
// New code should use Prisma directly.
// ---------------------------------------------------------------------------

export interface DbFriendRequest {
  id: string;
  sender_id: number;
  receiver_id: number;
  status: string;
  created_at: string;
  updated_at: string;
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
