/**
 * Socket.IO server setup for AlgoArena.
 *
 * Creates a single Server instance (singleton-safe for Next.js hot reload)
 * with three namespaces:
 *   /chat          — direct messages and contest chat rooms
 *   /contests      — live contest updates (submissions, leaderboard)
 *   /notifications — real-time notifications and presence
 *
 * Attach to an HTTP server:
 *   import { getSocketServer } from "@/lib/socket/server";
 *   getSocketServer(httpServer);
 *
 * Import path: @/lib/socket/server
 */

import { Server, Namespace } from "socket.io";
import type { Server as HttpServer } from "http";
import type { SocketData } from "./events";
import { socketAuthMiddleware } from "./auth";
import { registerConnection, unregisterConnection } from "./connections";
import {
  joinContest,
  leaveContest,
  joinNotificationRoom,
  broadcastToRoom,
  roomNames,
} from "./rooms";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Singleton guard — one Server per process
// ---------------------------------------------------------------------------

const globalForIo = globalThis as unknown as {
  io: Server | undefined;
};

// ---------------------------------------------------------------------------
// Typed middleware cast helper
// Socket.IO v4 socket types from typed namespaces are compatible with the
// plain Socket type required by our room helpers. This cast is safe.
// ---------------------------------------------------------------------------

function asSocket(s: unknown): import("socket.io").Socket {
  return s as import("socket.io").Socket;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Return the existing Socket.IO Server, or create and configure a new one
 * attached to the provided HTTP server.
 *
 * Call once from the custom server (server.mts) before httpServer.listen().
 */
export function getSocketServer(httpServer?: HttpServer): Server {
  if (globalForIo.io) {
    return globalForIo.io;
  }

  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? (process.env.NEXTAUTH_URL ?? false)
          : "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  // -------------------------------------------------------------------------
  // /chat namespace
  // -------------------------------------------------------------------------

  const chatNsp: Namespace = io.of("/chat");
  chatNsp.use(socketAuthMiddleware);

  chatNsp.on("connection", (socket) => {
    const data = socket.data as SocketData;
    const { userId, username } = data;
    registerConnection(userId, socket.id);

    console.log(
      `[chat] connected: user ${username} (id=${userId}, socket=${socket.id})`
    );

    // -- message:send --
    socket.on(
      "message:send",
      async (
        payload: {
          conversationId: string;
          type: "text" | "problem_recommendation" | "code_snippet" | "contest_invite";
          content: string;
          metadata?: Record<string, unknown>;
        },
        ack: (result: { ok: boolean; messageId?: string; error?: string }) => void
      ) => {
        try {
          const participant = await prisma.conversationParticipant.findUnique({
            where: {
              conversation_id_user_id: {
                conversation_id: payload.conversationId,
                user_id: userId,
              },
            },
          });

          if (!participant) {
            ack({ ok: false, error: "Not a participant in this conversation" });
            return;
          }

          const message = await prisma.message.create({
            data: {
              conversation_id: payload.conversationId,
              sender_id: userId,
              type: payload.type,
              content: payload.content,
              metadata: payload.metadata
                ? JSON.stringify(payload.metadata)
                : null,
            },
            include: { sender: true },
          });

          const messagePayload = {
            id: message.id,
            conversationId: message.conversation_id,
            senderId: message.sender_id,
            senderUsername: message.sender.username,
            type: message.type,
            content: message.content,
            metadata: message.metadata
              ? (JSON.parse(message.metadata) as Record<string, unknown>)
              : null,
            createdAt: message.created_at.toISOString(),
          };

          broadcastToRoom(
            chatNsp,
            roomNames.conversation(payload.conversationId),
            "message:new",
            { message: messagePayload }
          );

          ack({ ok: true, messageId: message.id });
        } catch (err) {
          console.error("[chat] error handling message:send:", err);
          ack({ ok: false, error: "Failed to send message" });
        }
      }
    );

    // -- message:markRead --
    socket.on(
      "message:markRead",
      async (
        payload: { conversationId: string; lastSeenMessageId: string },
        ack: (result: { ok: boolean; error?: string }) => void
      ) => {
        try {
          await prisma.conversationParticipant.update({
            where: {
              conversation_id_user_id: {
                conversation_id: payload.conversationId,
                user_id: userId,
              },
            },
            data: { last_seen_message_id: payload.lastSeenMessageId },
          });

          broadcastToRoom(
            chatNsp,
            roomNames.conversation(payload.conversationId),
            "message:read",
            {
              conversationId: payload.conversationId,
              userId,
              lastSeenMessageId: payload.lastSeenMessageId,
            },
            socket.id
          );

          ack({ ok: true });
        } catch (err) {
          console.error("[chat] error handling message:markRead:", err);
          ack({ ok: false, error: "Failed to mark messages as read" });
        }
      }
    );

    // -- typing:start --
    socket.on("typing:start", (payload: { conversationId: string }) => {
      broadcastToRoom(
        chatNsp,
        roomNames.conversation(payload.conversationId),
        "user:typing",
        {
          conversationId: payload.conversationId,
          userId,
          username,
          isTyping: true,
        },
        socket.id
      );
    });

    // -- typing:stop --
    socket.on("typing:stop", (payload: { conversationId: string }) => {
      broadcastToRoom(
        chatNsp,
        roomNames.conversation(payload.conversationId),
        "user:typing",
        {
          conversationId: payload.conversationId,
          userId,
          username,
          isTyping: false,
        },
        socket.id
      );
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `[chat] disconnected: user ${username} (socket=${socket.id}, reason=${reason})`
      );
      unregisterConnection(userId, socket.id);
    });

    socket.on("error", (err: Error) => {
      console.error(`[chat] socket error for user ${username}:`, err);
    });
  });

  // -------------------------------------------------------------------------
  // /contests namespace
  // -------------------------------------------------------------------------

  const contestsNsp: Namespace = io.of("/contests");
  contestsNsp.use(socketAuthMiddleware);

  contestsNsp.on("connection", (socket) => {
    const data = socket.data as SocketData;
    const { userId, username } = data;
    registerConnection(userId, socket.id);

    console.log(
      `[contests] connected: user ${username} (id=${userId}, socket=${socket.id})`
    );

    // -- contest:join --
    socket.on(
      "contest:join",
      async (
        payload: { contestId: string },
        ack: (result: { ok: boolean; error?: string }) => void
      ) => {
        const ok = await joinContest(asSocket(socket), payload.contestId, userId);
        if (!ok) {
          ack({
            ok: false,
            error: "Cannot join contest room — not enrolled or contest not found",
          });
          return;
        }
        ack({ ok: true });
      }
    );

    // -- contest:leave --
    socket.on(
      "contest:leave",
      async (
        payload: { contestId: string },
        ack: (result: { ok: boolean; error?: string }) => void
      ) => {
        const ok = await leaveContest(asSocket(socket), payload.contestId);
        ack({ ok });
      }
    );

    socket.on("disconnect", (reason) => {
      console.log(
        `[contests] disconnected: user ${username} (socket=${socket.id}, reason=${reason})`
      );
      unregisterConnection(userId, socket.id);
    });

    socket.on("error", (err: Error) => {
      console.error(`[contests] socket error for user ${username}:`, err);
    });
  });

  // -------------------------------------------------------------------------
  // /notifications namespace
  // -------------------------------------------------------------------------

  const notificationsNsp: Namespace = io.of("/notifications");
  notificationsNsp.use(socketAuthMiddleware);

  notificationsNsp.on("connection", async (socket) => {
    const data = socket.data as SocketData;
    const { userId, username } = data;
    registerConnection(userId, socket.id);

    console.log(
      `[notifications] connected: user ${username} (id=${userId}, socket=${socket.id})`
    );

    // Automatically join personal notification room on connect
    await joinNotificationRoom(asSocket(socket), userId);

    // Notify friends this user came online (lazy import avoids circular deps)
    try {
      const { broadcastFriendOnline } = await import("./notification-helpers");
      await broadcastFriendOnline(userId, username);
    } catch (err) {
      console.error(
        `[notifications] error broadcasting friend:online for user ${userId}:`,
        err
      );
    }

    socket.on("disconnect", async (reason) => {
      console.log(
        `[notifications] disconnected: user ${username} (socket=${socket.id}, reason=${reason})`
      );
      const isLastSocket = unregisterConnection(userId, socket.id);

      if (isLastSocket) {
        try {
          const { broadcastFriendOffline } = await import(
            "./notification-helpers"
          );
          await broadcastFriendOffline(userId, username);
        } catch (err) {
          console.error(
            `[notifications] error broadcasting friend:offline for user ${userId}:`,
            err
          );
        }
      }
    });

    socket.on("error", (err: Error) => {
      console.error(
        `[notifications] socket error for user ${username}:`,
        err
      );
    });
  });

  // -------------------------------------------------------------------------
  // Store singleton
  // -------------------------------------------------------------------------

  globalForIo.io = io;

  console.log(
    "[socket] Socket.IO server initialized with /chat, /contests, /notifications"
  );
  return io;
}

// ---------------------------------------------------------------------------
// Namespace accessors — for use from API route handlers
// ---------------------------------------------------------------------------

/** Get the /chat namespace from the running server. */
export function getChatNamespace(): Namespace {
  const io = globalForIo.io;
  if (!io)
    throw new Error(
      "[socket] Server not initialized — call getSocketServer() first"
    );
  return io.of("/chat");
}

/** Get the /contests namespace from the running server. */
export function getContestsNamespace(): Namespace {
  const io = globalForIo.io;
  if (!io)
    throw new Error(
      "[socket] Server not initialized — call getSocketServer() first"
    );
  return io.of("/contests");
}

/** Get the /notifications namespace from the running server. */
export function getNotificationsNamespace(): Namespace {
  const io = globalForIo.io;
  if (!io)
    throw new Error(
      "[socket] Server not initialized — call getSocketServer() first"
    );
  return io.of("/notifications");
}
