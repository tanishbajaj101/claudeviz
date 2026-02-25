/**
 * GET /api/users/search?q=<term>
 *
 * Case-insensitive partial match on username. Returns at most 20 results.
 * Requires authentication.
 *
 * Response:
 *   {
 *     users: [
 *       {
 *         id: number,
 *         username: string,
 *         avatar_svg: string,
 *         is_friend: boolean,
 *         friend_request_status: "none" | "pending_sent" | "pending_received"
 *       }
 *     ]
 *   }
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchUsersByUsername } from "@/lib/db";

// ---------------------------------------------------------------------------
// Helper: derive friendship / request status for a pair of users
// ---------------------------------------------------------------------------

async function getFriendshipStatus(
  userId: number,
  targetUserId: number
): Promise<{
  is_friend: boolean;
  friend_request_status: "none" | "pending_sent" | "pending_received";
}> {
  // Fetch all relevant friend requests between the two users in one query
  const requests = await prisma.friendRequest.findMany({
    where: {
      OR: [
        { sender_id: userId, receiver_id: targetUserId },
        { sender_id: targetUserId, receiver_id: userId },
      ],
    },
    select: { sender_id: true, status: true },
  });

  for (const req of requests) {
    if (req.status === "accepted") {
      return { is_friend: true, friend_request_status: "none" };
    }
    if (req.status === "pending") {
      const sentByMe = req.sender_id === userId;
      return {
        is_friend: false,
        friend_request_status: sentByMe ? "pending_sent" : "pending_received",
      };
    }
  }

  return { is_friend: false, friend_request_status: "none" };
}

// ---------------------------------------------------------------------------
// GET /api/users/search
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  if (q.trim().length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    // Use Prisma user search via db helper (max 20 results enforced inside searchUsersByUsername)
    const matchedUsers = await searchUsersByUsername(q.trim(), 20);

    // Enrich each result with friendship status
    const enriched = await Promise.all(
      matchedUsers
        .filter((u) => u.id !== userId) // exclude self
        .map(async (u) => {
          const { is_friend, friend_request_status } =
            await getFriendshipStatus(userId, u.id);
          return {
            id: u.id,
            username: u.username,
            avatar_svg: u.avatar_svg,
            is_friend,
            friend_request_status,
          };
        })
    );

    return NextResponse.json({ users: enriched });
  } catch (error) {
    console.error("[GET /api/users/search] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
