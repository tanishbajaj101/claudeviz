/**
 * GET /api/notifications — List notifications (cursor-based pagination)
 *
 * Query params:
 *   ?limit=50            — max notifications to return (default 50, max 100)
 *   ?cursor=<uuid>       — return notifications older than this notification id
 *
 * Returns all notifications for the authenticated user, sorted newest first.
 * Uses cursor-based pagination on notification.id (UUID, compared by created_at).
 *
 * Response:
 *   { notifications, has_more, cursor }
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.dbUserId as number;
  const { searchParams } = new URL(req.url);

  const limitParam = searchParams.get("limit");
  const cursorId = searchParams.get("cursor") ?? undefined;

  const limit = limitParam
    ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 100)
    : 50;

  try {
    // If a cursor is provided, resolve its created_at for pagination
    let cursorCreatedAt: Date | undefined;
    if (cursorId) {
      const cursorNotif = await prisma.notification.findUnique({
        where: { id: cursorId },
        select: { created_at: true },
      });
      if (cursorNotif) {
        cursorCreatedAt = cursorNotif.created_at;
      }
    }

    // Fetch limit + 1 to determine has_more
    const fetchLimit = limit + 1;

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: userId,
        ...(cursorCreatedAt
          ? { created_at: { lt: cursorCreatedAt } }
          : {}),
      },
      orderBy: { created_at: "desc" },
      take: fetchLimit,
    });

    const hasMore = notifications.length > limit;
    const page = hasMore ? notifications.slice(0, limit) : notifications;

    const formatted = page.map((n) => ({
      id: n.id,
      type: n.type as string,
      data: (() => {
        try {
          return JSON.parse(n.data) as Record<string, unknown>;
        } catch {
          return {} as Record<string, unknown>;
        }
      })(),
      is_read: n.is_read,
      created_at: n.created_at.toISOString(),
    }));

    // The cursor for the next page is the last notification's id
    const nextCursor =
      hasMore && page.length > 0 ? page[page.length - 1].id : null;

    return NextResponse.json({
      notifications: formatted,
      has_more: hasMore,
      cursor: nextCursor,
    });
  } catch (error) {
    console.error("[GET /api/notifications] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
