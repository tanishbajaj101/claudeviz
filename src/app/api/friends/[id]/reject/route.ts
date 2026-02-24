/**
 * POST /api/friends/[id]/reject — Reject a pending friend request.
 *
 * [id] is the FriendRequest.id (UUID).
 *
 * Validates:
 *   - The authenticated user is the receiver of the request
 *   - The request is currently in 'pending' status
 *
 * Actions:
 *   - Update FriendRequest.status = 'rejected'
 *
 * No notification is created for rejections.
 *
 * Response:
 *   { success: true }
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      select: { id: true, receiver_id: true, status: true },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    // Only the receiver may reject
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

    // Reject and delete original notification in one transaction
    await prisma.$transaction(async (tx) => {
      await tx.friendRequest.update({
        where: { id: friendRequestId },
        data: { status: "rejected" },
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
    });

    console.log(
      `[POST /api/friends/${friendRequestId}/reject] user ${userId} rejected the request`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      `[POST /api/friends/${friendRequestId}/reject] Error:`,
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
