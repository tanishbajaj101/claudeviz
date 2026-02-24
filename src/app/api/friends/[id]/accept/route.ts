/**
 * POST /api/friends/[id]/accept — Accept a pending friend request.
 *
 * [id] is the FriendRequest.id (UUID).
 *
 * Validates:
 *   - The authenticated user is the receiver of the request
 *   - The request is currently in 'pending' status
 *
 * Actions (single transaction):
 *   1. Update FriendRequest.status = 'accepted'
 *   2. Create Notification for the original sender (type='friend_request_accepted')
 *
 * After the transaction, emits the notification to the sender's Socket.IO room.
 *
 * Response:
 *   { success: true }
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitNotification } from "@/lib/socket/notification-helpers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;
  const { id: friendRequestId } = await params;

  if (!friendRequestId) {
    return NextResponse.json(
      { error: "Invalid friend request ID" },
      { status: 400 }
    );
  }

  try {
    // Load the friend request
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: friendRequestId },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    // Only the receiver may accept
    if (friendRequest.receiver_id !== userId) {
      return NextResponse.json(
        { error: "You are not the recipient of this friend request" },
        { status: 403 }
      );
    }

    if (friendRequest.status !== "pending") {
      return NextResponse.json(
        {
          error: `Friend request is already ${friendRequest.status}`,
        },
        { status: 409 }
      );
    }

    // Accept + notify the original sender + delete original request notification in one transaction
    const { notification } = await prisma.$transaction(async (tx) => {
      await tx.friendRequest.update({
        where: { id: friendRequestId },
        data: { status: "accepted" },
      });

      // Delete the original friend_request notification
      await tx.notification.deleteMany({
        where: {
          type: "friend_request",
          data: {
            contains: friendRequestId,
          },
        },
      });

      const notifData = {
        user_id: userId,
        username: friendRequest.receiver.username,
        friend_request_id: friendRequestId,
      };

      const notif = await tx.notification.create({
        data: {
          user_id: friendRequest.sender_id,
          type: "friend_request_accepted",
          data: JSON.stringify(notifData),
          is_read: false,
        },
      });

      return { notification: notif };
    });

    // Emit notification to the original sender's personal room (best-effort)
    emitNotification(friendRequest.sender_id, {
      id: notification.id,
      type: "friend_request_accepted",
      data: JSON.parse(notification.data) as Record<string, unknown>,
      is_read: false,
      created_at: notification.created_at.toISOString(),
    });

    console.log(
      `[POST /api/friends/${friendRequestId}/accept] user ${userId} accepted request from user ${friendRequest.sender_id}`
    );

    return NextResponse.json({
      success: true,
      sender_id: friendRequest.sender_id,
      receiver_id: userId
    });
  } catch (error) {
    console.error(
      `[POST /api/friends/${friendRequestId}/accept] Error:`,
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
