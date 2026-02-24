/**
 * POST /api/notifications/[id]/read — Mark a single notification as read.
 *
 * Sets is_read = true for the specified notification.
 * Verifies the notification belongs to the authenticated user before updating.
 *
 * Response:
 *   { success: true }
 *
 * Error responses:
 *   401 — not authenticated
 *   404 — notification not found or does not belong to user
 *   500 — internal server error
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
  const { id: notificationId } = await params;

  if (!notificationId) {
    return NextResponse.json(
      { error: "Invalid notification ID" },
      { status: 400 }
    );
  }

  try {
    // Verify the notification exists and belongs to this user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { id: true, user_id: true, is_read: true },
    });

    if (!notification || notification.user_id !== userId) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    // Already read — idempotent success
    if (notification.is_read) {
      return NextResponse.json({ success: true });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });

    console.log(
      `[POST /api/notifications/${notificationId}/read] marked read for user ${userId}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      `[POST /api/notifications/${notificationId}/read] Error:`,
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
