/**
 * POST /api/notifications/read-all — Mark all notifications as read.
 *
 * Sets is_read = true for ALL unread notifications belonging to
 * the authenticated user. Uses Prisma updateMany for efficiency.
 *
 * Response:
 *   { success: true, count: number }
 */

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

  try {
    const result = await prisma.notification.updateMany({
      where: {
        user_id: userId,
        is_read: false,
      },
      data: { is_read: true },
    });

    console.log(
      `[POST /api/notifications/read-all] marked ${result.count} notification(s) read for user ${userId}`
    );

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("[POST /api/notifications/read-all] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
