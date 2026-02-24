/**
 * GET /api/friends  — Enhanced friends list with rich activity data.
 * POST /api/friends — Send a friend request to another user.
 *
 * GET Response:
 *   {
 *     friends: [
 *       {
 *         id: number,
 *         username: string,
 *         avatar_svg: string,
 *         is_online: boolean,
 *         last_active: string | null,
 *         last_problem_activity: {
 *           problem_id: string,
 *           problem_name: string,
 *           status: "solved" | "solving"
 *         } | null,
 *         has_unread: boolean
 *       }
 *     ]
 *   }
 *
 * POST Request body:
 *   { receiver_id: number }
 *
 * POST Response:
 *   { success: true, friend_request_id: string }
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isUserOnline } from "@/lib/socket/connections";
import { emitNotification } from "@/lib/socket/notification-helpers";
import { problems } from "@/data/problems";
import { getUserById } from "@/lib/db";

// ---------------------------------------------------------------------------
// Helper: check for unread messages between requester and a friend
// ---------------------------------------------------------------------------

async function hasUnreadMessages(
  userId: number,
  friendId: number
): Promise<boolean> {
  // Find a direct conversation that contains BOTH users
  const conversation = await prisma.conversation.findFirst({
    where: {
      type: "direct",
      AND: [
        { participants: { some: { user_id: userId } } },
        { participants: { some: { user_id: friendId } } },
      ],
    },
    select: {
      participants: {
        where: { user_id: userId },
        select: { last_seen_message_id: true },
      },
      messages: {
        orderBy: { created_at: "desc" },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!conversation || conversation.messages.length === 0) return false;

  const latestMessageId = conversation.messages[0].id;
  const userParticipant = conversation.participants[0];

  if (!userParticipant) return false;

  return userParticipant.last_seen_message_id !== latestMessageId;
}

// ---------------------------------------------------------------------------
// Helper: derive last problem activity for a friend
// ---------------------------------------------------------------------------

async function getLastProblemActivity(
  friendDbUser: ReturnType<typeof getUserById>,
  friendId: number
): Promise<{
  problem_id: string;
  problem_name: string;
  status: "solved" | "solving";
} | null> {
  // last_opened_problem_id comes from the legacy better-sqlite3 users table
  // via getUserById. The field may be null if the user has never opened a problem.
  if (!friendDbUser || !friendDbUser.last_opened_problem_id) return null;

  const problemId = friendDbUser.last_opened_problem_id;
  const problem = problems.find((p) => p.id === problemId);
  if (!problem) return null;

  // Check whether the friend has an accepted submission for this problem.
  // The Submission model uses a text status field — "Accepted" maps to status_id 3.
  const acceptedSubmission = await prisma.submission.findFirst({
    where: {
      user_id: friendId,
      problem_id: problemId,
      status: "Accepted",
    },
    select: { id: true },
  });

  return {
    problem_id: problemId,
    problem_name: problem.title,
    status: acceptedSubmission ? "solved" : "solving",
  };
}

// ---------------------------------------------------------------------------
// GET /api/friends
// ---------------------------------------------------------------------------

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

  try {
    // Bidirectional accepted friendship lookup
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        status: "accepted",
        OR: [{ sender_id: userId }, { receiver_id: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar_svg: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar_svg: true,
          },
        },
      },
    });

    // Enrich each friend with activity data in parallel
    const enriched = await Promise.all(
      friendRequests.map(async (fr) => {
        const friend = fr.sender_id === userId ? fr.receiver : fr.sender;
        const friendId = friend.id;

        // Fetch legacy DB row for activity fields (last_opened_problem_id, last_active)
        const friendDbUser = getUserById(friendId);

        const [lastProblemActivity, hasUnread] = await Promise.all([
          getLastProblemActivity(friendDbUser, friendId),
          hasUnreadMessages(userId, friendId),
        ]);

        return {
          id: friendId,
          username: friend.username,
          avatar_svg: friend.avatar_svg,
          is_online: isUserOnline(friendId),
          last_active: friendDbUser?.last_active ?? null,
          last_problem_activity: lastProblemActivity,
          has_unread: hasUnread,
        };
      })
    );

    // Sort by last_active DESC (nulls last)
    enriched.sort((a, b) => {
      if (!a.last_active && !b.last_active) return 0;
      if (!a.last_active) return 1;
      if (!b.last_active) return -1;
      return (
        new Date(b.last_active).getTime() - new Date(a.last_active).getTime()
      );
    });

    return NextResponse.json({ friends: enriched });
  } catch (error) {
    console.error("[GET /api/friends] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/friends — Send a friend request
// ---------------------------------------------------------------------------

interface SendFriendRequestBody {
  receiver_id: unknown;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const senderId = session.user.dbUserId as number;

  let body: SendFriendRequestBody;
  try {
    body = (await req.json()) as SendFriendRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { receiver_id } = body;

  if (typeof receiver_id !== "number" || !Number.isInteger(receiver_id)) {
    return NextResponse.json(
      { error: "receiver_id must be an integer" },
      { status: 400 }
    );
  }

  if (receiver_id === senderId) {
    return NextResponse.json(
      { error: "Cannot send a friend request to yourself" },
      { status: 400 }
    );
  }

  try {
    // Verify the receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiver_id },
      select: { id: true, username: true },
    });

    if (!receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for an existing request in either direction
    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { sender_id: senderId, receiver_id: receiver_id },
          { sender_id: receiver_id, receiver_id: senderId },
        ],
      },
      select: { id: true, status: true },
    });

    if (existing) {
      if (existing.status === "accepted") {
        return NextResponse.json(
          { error: "You are already friends with this user" },
          { status: 409 }
        );
      }
      if (existing.status === "pending") {
        return NextResponse.json(
          { error: "A friend request already exists between these users" },
          { status: 409 }
        );
      }
      // status === 'rejected' — allow re-sending
    }

    // Look up sender's username for the notification
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { username: true },
    });

    if (!sender) {
      return NextResponse.json(
        { error: "Sender not found" },
        { status: 500 }
      );
    }

    // Create the friend request and the notification in a transaction
    const { friendRequest, notification } = await prisma.$transaction(
      async (tx) => {
        const fr = await tx.friendRequest.create({
          data: {
            sender_id: senderId,
            receiver_id: receiver_id,
            status: "pending",
          },
        });

        const notifData = {
          sender_id: senderId,
          sender_username: sender.username,
          friend_request_id: fr.id,
        };

        const notif = await tx.notification.create({
          data: {
            user_id: receiver_id,
            type: "friend_request",
            data: JSON.stringify(notifData),
            is_read: false,
          },
        });

        return { friendRequest: fr, notification: notif };
      }
    );

    // Emit the notification to receiver's Socket.IO room (best-effort)
    emitNotification(receiver_id, {
      id: notification.id,
      type: "friend_request",
      data: JSON.parse(notification.data) as Record<string, unknown>,
      is_read: false,
      created_at: notification.created_at.toISOString(),
    });

    console.log(
      `[POST /api/friends] friend request ${friendRequest.id} sent from user ${senderId} to user ${receiver_id}`
    );

    return NextResponse.json(
      { success: true, friend_request_id: friendRequest.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/friends] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
