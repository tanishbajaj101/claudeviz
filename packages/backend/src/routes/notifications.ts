/**
 * Notifications routes
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * GET /api/notifications
 * List notifications with cursor-based pagination
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const limitParam = req.query.limit as string;
  const cursorId = (req.query.cursor as string) ?? undefined;

  const limit = limitParam
    ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 100)
    : 50;

  try {
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

    const nextCursor =
      hasMore && page.length > 0 ? page[page.length - 1].id : null;

    res.json({
      notifications: formatted,
      has_more: hasMore,
      cursor: nextCursor,
    });
  } catch (error) {
    console.error("[GET /api/notifications] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications
 */
router.get('/unread-count', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const unreadCount = await prisma.notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });

    res.json({ unread_count: unreadCount });
  } catch (error) {
    console.error("[GET /api/notifications/unread-count] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read
 */
router.post('/read-all', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;

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

    res.json({ success: true, count: result.count });
  } catch (error) {
    console.error("[POST /api/notifications/read-all] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/notifications/:id/read
 * Mark a single notification as read
 */
router.post('/:id/read', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const notificationId = req.params.id;

  if (!notificationId) {
    res.status(400).json({ error: "Invalid notification ID" });
    return;
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { id: true, user_id: true, is_read: true },
    });

    if (!notification || notification.user_id !== userId) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    if (notification.is_read) {
      res.json({ success: true });
      return;
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });

    console.log(
      `[POST /api/notifications/${notificationId}/read] marked read for user ${userId}`
    );

    res.json({ success: true });
  } catch (error) {
    console.error(
      `[POST /api/notifications/${notificationId}/read] Error:`,
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
