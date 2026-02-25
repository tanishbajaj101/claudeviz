/**
 * GET /api/users/[id] — Public user profile with stats and activity heatmap.
 *
 * Authentication optional. Friendship status is only returned when the
 * requester is authenticated.
 *
 * Response:
 *   {
 *     user: {
 *       id: number,
 *       username: string,
 *       avatar_svg: string,
 *       created_at: string,
 *       friendship_status: "self" | "friends" | "pending_sent" | "pending_received" | "none"
 *     },
 *     stats: {
 *       total_problems_solved: number,
 *       problems_solved_24h: number,
 *       problems_solved_7d: number,
 *       problems_solved_30d: number,
 *       total_submissions: number,
 *       accuracy: number   // 0–1 ratio
 *     },
 *     activity_heatmap: Array<{ date: string, count: number }>
 *   }
 *
 * Notes:
 *   - Submissions use a text `status` column. "Accepted" (capital A) is the
 *     accepted string — equivalent to Judge0 status_id 3.
 *   - `created_at` in the submissions table is a TEXT field in SQLite datetime
 *     format ("YYYY-MM-DD HH:MM:SS"), so we parse it as a Date via new Date().
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/db";

// ---------------------------------------------------------------------------
// Helper: friendship status between two users
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

// ---------------------------------------------------------------------------
// Helper: activity heatmap for the past 365 days
// ---------------------------------------------------------------------------

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
    // created_at is a Date from PostgreSQL (or a string from legacy SQLite data)
    const createdAt = sub.created_at instanceof Date ? sub.created_at : new Date(sub.created_at);
    const dateStr = createdAt.toISOString().split("T")[0]; // "YYYY-MM-DD"
    counts.set(dateStr, (counts.get(dateStr) ?? 0) + 1);
  }

  // Build a dense 366-entry array (inclusive of today)
  const heatmap: HeatmapEntry[] = [];
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
    heatmap.push({ date: dateStr, count: counts.get(dateStr) ?? 0 });
  }

  return heatmap;
}

// ---------------------------------------------------------------------------
// GET /api/users/[id]
// ---------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  const { id: rawId } = await params;
  const targetId = parseInt(rawId, 10);

  if (isNaN(targetId) || targetId <= 0) {
    return NextResponse.json(
      { error: "Invalid user id — must be a positive integer" },
      { status: 400 }
    );
  }

  // Use the legacy better-sqlite3 helper to fetch the user (includes
  // last_opened_problem_id and last_active after the db.ts migration).
  const dbUser = await getUserById(targetId);
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    // Fetch all submissions for the target user
    const allSubmissions = await prisma.submission.findMany({
      where: { user_id: targetId },
      select: { problem_id: true, status: true, created_at: true },
    });

    const submissionsTyped = allSubmissions;

    const totalSubmissions = submissionsTyped.length;

    // Separate accepted submissions
    const accepted = submissionsTyped.filter((s) => s.status === "Accepted");
    const acceptedCount = accepted.length;

    // Count DISTINCT problem_ids solved (all time)
    const solvedProblemIds = new Set(accepted.map((s) => s.problem_id));
    const totalProblemsSolved = solvedProblemIds.size;

    // Time-windowed distinct solved problem counts
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

    const accuracy =
      totalSubmissions > 0 ? acceptedCount / totalSubmissions : 0;

    // Activity heatmap — count of accepted submissions per day for past 365 days
    const activityHeatmap = generateActivityHeatmap(accepted);

    // Friendship status (only when requester is authenticated)
    let friendshipStatus: FriendshipStatus = "none";
    if (session?.user?.dbUserId) {
      friendshipStatus = await getFriendshipStatus(
        session.user.dbUserId as number,
        targetId
      );
    }

    return NextResponse.json({
      user: {
        id: dbUser.id,
        username: dbUser.username,
        avatar_svg: dbUser.avatar_svg,
        created_at: dbUser.created_at instanceof Date ? dbUser.created_at.toISOString() : dbUser.created_at,
        friendship_status: friendshipStatus,
      },
      stats: {
        total_problems_solved: totalProblemsSolved,
        problems_solved_24h: solved24hIds.size,
        problems_solved_7d: solved7dIds.size,
        problems_solved_30d: solved30dIds.size,
        total_submissions: totalSubmissions,
        accuracy: Math.round(accuracy * 10000) / 10000, // 4 decimal places
      },
      activity_heatmap: activityHeatmap,
    });
  } catch (error) {
    console.error(`[GET /api/users/${targetId}] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
