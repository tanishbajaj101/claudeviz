/**
 * User routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import {
  createUser,
  getUserByGoogleId,
  getUserById,
  getUserByUsername,
  isUsernameAvailable,
  searchUsersByUsername,
  updateLastProblem,
} from '../lib/db.js';
import { prisma } from '../lib/prisma.js';
import { problems } from '../lib/problems.js';

const router = Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FriendshipStatus =
  | "self"
  | "friends"
  | "pending_sent"
  | "pending_received"
  | "none";

async function getFriendshipStatus(
  requesterId: number,
  targetId: number
): Promise<FriendshipStatus> {
  if (requesterId === targetId) return "self";

  const requests = await prisma.friendRequest.findMany({
    where: {
      OR: [
        { sender_id: requesterId, receiver_id: targetId },
        { sender_id: targetId, receiver_id: requesterId },
      ],
    },
    select: { sender_id: true, status: true },
  });

  for (const req of requests) {
    if (req.status === "accepted") return "friends";
    if (req.status === "pending") {
      return req.sender_id === requesterId ? "pending_sent" : "pending_received";
    }
  }

  return "none";
}

interface HeatmapEntry {
  date: string;
  count: number;
}

function generateActivityHeatmap(
  acceptedSubmissions: Array<{ created_at: Date | string }>
): HeatmapEntry[] {
  const now = new Date();

  // Count accepted submissions per calendar day
  const counts = new Map<string, number>();
  for (const sub of acceptedSubmissions) {
    const createdAt = sub.created_at instanceof Date ? sub.created_at : new Date(sub.created_at);
    const dateStr = createdAt.toISOString().split("T")[0];
    counts.set(dateStr, (counts.get(dateStr) ?? 0) + 1);
  }

  // Build a dense 366-entry array (inclusive of today)
  const heatmap: HeatmapEntry[] = [];
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    heatmap.push({ date: dateStr, count: counts.get(dateStr) ?? 0 });
  }

  return heatmap;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * POST /api/users
 * Create new user (during onboarding)
 */
router.post('/', async (req: Request, res: Response) => {
  const { name, username, avatarSvg } = req.body;

  // Manually verify token to support pending users during onboarding
  const token = req.cookies['auth-token'] || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.substring(7) : null);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-in-production');
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }

  // The payload should have `sub` (Google ID) and `email`
  const googleId = decoded.sub;
  const email = decoded.email;

  if (!googleId || !email) {
    res.status(400).json({ error: "Invalid onboarding token" });
    return;
  }

  if (!name || !username || !avatarSvg) {
    res.status(400).json({ error: "Name, username, and avatarSvg are required" });
    return;
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    res.status(400).json({
      error: "Username must be 3-20 characters, alphanumeric and underscore only"
    });
    return;
  }

  // Check availability
  if (!(await isUsernameAvailable(username))) {
    res.status(409).json({ error: "Username is already taken" });
    return;
  }

  try {
    let user = await getUserByGoogleId(googleId);

    if (!user) {
      // Create user if they don't exist
      user = await createUser({
        googleId,
        email,
        name: name.trim(),
        username,
        avatarSvg,
      });
    } else {
      // Update existing user (e.g. they somehow existed but lacked a username)
      user = await prisma.user.update({
        where: { google_id: googleId },
        data: {
          name: name.trim(),
          username,
          avatar_svg: avatarSvg,
        },
      });
    }

    // Generate fully authenticated JWT token
    const newToken = jwt.sign(
      {
        sub: user.google_id,
        dbUserId: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET || 'dev-secret-change-in-production',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * GET /api/users
 * Get current authenticated user
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  const user = await getUserByGoogleId(req.user!.google_id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user });
});

/**
 * GET /api/users/check-username?username=X
 * Check if username is available (public)
 */
router.get('/check-username', async (req: Request, res: Response) => {
  const username = req.query.username as string;

  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    res.status(400).json({
      error: "Username must be 3-20 characters, alphanumeric and underscore only"
    });
    return;
  }

  const available = await isUsernameAvailable(username);
  res.json({ available });
});

/**
 * GET /api/users/search?q=X
 * Search users by username (authenticated)
 */
router.get('/search', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const q = (req.query.q as string) ?? "";

  if (q.trim().length < 2) {
    res.status(400).json({ error: "Search query must be at least 2 characters" });
    return;
  }

  try {
    const matchedUsers = await searchUsersByUsername(q.trim(), 20);

    // Enrich each result with friendship status
    const enriched = await Promise.all(
      matchedUsers
        .filter((u) => u.id !== userId)
        .map(async (u) => {
          const { is_friend, friend_request_status } = await (async () => {
            const status = await getFriendshipStatus(userId, u.id);
            return {
              is_friend: status === "friends",
              friend_request_status: status === "friends" || status === "self"
                ? "none"
                : (status as "pending_sent" | "pending_received" | "none"),
            };
          })();

          return {
            id: u.id,
            username: u.username,
            avatar_svg: u.avatar_svg,
            is_friend,
            friend_request_status,
          };
        })
    );

    res.json({ users: enriched });
  } catch (error) {
    console.error("[GET /api/users/search] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/users/avatar?username=X
 * Get user avatar SVG (public)
 */
router.get('/avatar', async (req: Request, res: Response) => {
  const username = req.query.username as string;

  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  const user = await getUserByUsername(username);
  if (!user || !user.avatar_svg) {
    res.status(404).json({ error: "Avatar not found" });
    return;
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(user.avatar_svg);
});

/**
 * PATCH /api/users/me/last_problem
 * Update last opened problem for authenticated user
 */
router.patch('/me/last_problem', authenticate, async (req: Request, res: Response) => {
  try {
    const { problem_id, solved } = req.body;

    if (!problem_id || typeof solved !== "boolean") {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    await updateLastProblem(req.user!.id, problem_id, solved);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update last problem:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/users/activity/problem
 * Track that user opened a problem page
 */
router.post('/activity/problem', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { problem_id } = req.body;

  if (typeof problem_id !== "string" || problem_id.trim().length === 0) {
    res.status(400).json({ error: "problem_id must be a non-empty string" });
    return;
  }

  // Validate problem exists
  const knownProblem = problems.find((p) => p.id === problem_id.trim());
  if (!knownProblem) {
    res.status(404).json({ error: "Unknown problem_id" });
    return;
  }

  try {
    await updateLastProblem(userId, problem_id.trim(), false);
    console.log(`[POST /api/users/activity/problem] User ${userId} opened problem ${problem_id} (${knownProblem.title})`);
    res.json({ success: true });
  } catch (error) {
    console.error("[POST /api/users/activity/problem] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/users/by-username/:username
 * Get user ID by username (public endpoint)
 */
router.get('/by-username/:username', async (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  const user = await getUserByUsername(username);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ id: user.id, username: user.username });
});

/**
 * GET /api/users/:id
 * Get public user profile with stats and activity heatmap
 * Authentication optional (affects friendship_status field)
 */
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  const targetId = parseInt(req.params.id, 10);

  if (isNaN(targetId) || targetId <= 0) {
    res.status(400).json({ error: "Invalid user id — must be a positive integer" });
    return;
  }

  const dbUser = await getUserById(targetId);
  if (!dbUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    // Fetch xp from Prisma user record
    const prismaUser = await prisma.user.findUnique({
      where: { id: targetId },
      select: { xp: true },
    });

    // Fetch all submissions
    const allSubmissions = await prisma.submission.findMany({
      where: { user_id: targetId },
      select: { problem_id: true, status: true, created_at: true },
    });

    const totalSubmissions = allSubmissions.length;
    const accepted = allSubmissions.filter((s) => s.status === "Accepted");
    const acceptedCount = accepted.length;

    // Count distinct problems solved
    const solvedProblemIds = new Set(accepted.map((s) => s.problem_id));
    const totalProblemsSolved = solvedProblemIds.size;

    // Difficulty breakdown
    const difficultyMap = new Map(problems.map((p) => [p.id, p.difficulty]));
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;
    for (const pid of solvedProblemIds) {
      const diff = difficultyMap.get(pid);
      if (diff === 'Easy') easySolved++;
      else if (diff === 'Medium') mediumSolved++;
      else if (diff === 'Hard') hardSolved++;
    }

    // Time-windowed counts
    const now = new Date();
    const ms24h = 24 * 60 * 60 * 1000;
    const ms7d = 7 * ms24h;
    const ms30d = 30 * ms24h;

    const solved24hIds = new Set<string>();
    const solved7dIds = new Set<string>();
    const solved30dIds = new Set<string>();

    for (const sub of accepted) {
      const subDate = new Date(sub.created_at);
      const age = now.getTime() - subDate.getTime();
      if (age <= ms24h) solved24hIds.add(sub.problem_id);
      if (age <= ms7d) solved7dIds.add(sub.problem_id);
      if (age <= ms30d) solved30dIds.add(sub.problem_id);
    }

    const accuracy = totalSubmissions > 0 ? acceptedCount / totalSubmissions : 0;
    const activityHeatmap = generateActivityHeatmap(accepted);

    // Friendship status (only when requester is authenticated)
    let friendshipStatus: FriendshipStatus = "none";
    if (req.user) {
      friendshipStatus = await getFriendshipStatus(req.user.id, targetId);
    }

    res.json({
      user: {
        id: dbUser.id,
        username: dbUser.username,
        avatar_svg: dbUser.avatar_svg,
        created_at: dbUser.created_at instanceof Date ? dbUser.created_at.toISOString() : dbUser.created_at,
        friendship_status: friendshipStatus,
      },
      stats: {
        total_problems_solved: totalProblemsSolved,
        problems_solved_7d: solved7dIds.size,
        problems_solved_30d: solved30dIds.size,
        total_submissions: totalSubmissions,
        accuracy: Math.round(accuracy * 10000) / 10000,
        xp: prismaUser?.xp ?? 0,
        easy_solved: easySolved,
        medium_solved: mediumSolved,
        hard_solved: hardSolved,
      },
      activity_heatmap: activityHeatmap,
    });
  } catch (error) {
    console.error(`[GET /api/users/${targetId}] Error:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
