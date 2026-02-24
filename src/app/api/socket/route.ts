/**
 * Socket.IO initialization route for Next.js App Router.
 *
 * GET /api/socket
 *
 * In Next.js App Router, WebSocket upgrade is NOT natively supported via
 * route handlers. The canonical pattern is to use a custom Next.js server
 * (server.mts) that attaches Socket.IO to the raw HTTP server before
 * Next.js handles requests.
 *
 * This route serves two purposes:
 *  1. Acts as a health-check endpoint so clients can confirm the socket
 *     server is reachable before connecting.
 *  2. Returns metadata about available namespaces and connection instructions.
 *
 * For local development with `npm run dev`, use the custom server at the
 * project root (server.mts) which calls getSocketServer(httpServer).
 *
 * See: https://socket.io/docs/v4/server-initialization/#with-nextjs
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    status: "ok",
    namespaces: ["/chat", "/contests", "/notifications"],
    instructions: {
      chat: {
        namespace: "/chat",
        description: "Direct messages and contest chat rooms",
        clientEvents: [
          "message:send",
          "message:markRead",
          "typing:start",
          "typing:stop",
        ],
        serverEvents: ["message:new", "message:read", "user:typing"],
      },
      contests: {
        namespace: "/contests",
        description: "Live contest updates — submissions and leaderboard",
        clientEvents: ["contest:join", "contest:leave"],
        serverEvents: [
          "contest:started",
          "contest:ending",
          "contest:ended",
          "submission:new",
          "leaderboard:update",
        ],
      },
      notifications: {
        namespace: "/notifications",
        description:
          "Real-time notifications and friend presence. Personal room joined automatically on connect.",
        clientEvents: [],
        serverEvents: [
          "notification:new",
          "notification:read",
          "friend:online",
          "friend:offline",
        ],
      },
    },
  });
}
