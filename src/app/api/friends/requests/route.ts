/**
 * GET /api/friends/requests — Get all pending friend requests for the authenticated user.
 *
 * Returns both sent and received pending requests.
 *
 * Response:
 *   {
 *     sent: Array<{
 *       id: string,
 *       receiver_id: number,
 *       receiver_username: string,
 *       created_at: string
 *     }>,
 *     received: Array<{
 *       id: string,
 *       sender_id: number,
 *       sender_username: string,
 *       created_at: string
 *     }>
 *   }
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
    const [sent, received] = await Promise.all([
      // Requests sent by this user
      prisma.friendRequest.findMany({
        where: {
          sender_id: userId,
          status: "pending",
        },
        select: {
          id: true,
          receiver_id: true,
          receiver: {
            select: {
              username: true,
            },
          },
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      }),
      // Requests received by this user
      prisma.friendRequest.findMany({
        where: {
          receiver_id: userId,
          status: "pending",
        },
        select: {
          id: true,
          sender_id: true,
          sender: {
            select: {
              username: true,
            },
          },
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      }),
    ]);

    return NextResponse.json({
      sent: sent.map((req) => ({
        id: req.id,
        receiver_id: req.receiver_id,
        receiver_username: req.receiver.username,
        created_at: req.created_at.toISOString(),
      })),
      received: received.map((req) => ({
        id: req.id,
        sender_id: req.sender_id,
        sender_username: req.sender.username,
        created_at: req.created_at.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[GET /api/friends/requests] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
