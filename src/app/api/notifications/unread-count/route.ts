/**
 * GET /api/notifications/unread-count
 *
 * Returns the count of unread notifications for the authenticated user.
 *
 * Response:
 *   { unread_count: number }
 */

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;

  try {
    const unreadCount = await prisma.notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });

    return NextResponse.json({ unread_count: unreadCount });
  } catch (error) {
    console.error("[GET /api/notifications/unread-count] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
