/**
 * Socket.IO authentication middleware for AlgoArena.
 *
 * Validates the NextAuth session token carried in the socket handshake,
 * then attaches the authenticated user's id and username to socket.data
 * so downstream handlers never need to re-query the database.
 *
 * The client must pass the NextAuth session token as:
 *   - auth.token  (recommended — explicit handshake auth object)
 *   - OR the "next-auth.session-token" cookie forwarded automatically
 *     by the browser when the socket connection is same-origin.
 *
 * Import path: @/lib/socket/auth
 */

import { getToken } from "next-auth/jwt";
import type { IncomingMessage } from "http";
import type { Socket } from "socket.io";
import type { SocketData } from "./events";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Reconstruct a minimal IncomingMessage-like object that next-auth/jwt
 * getToken() can read cookies and authorization header from.
 *
 * Socket.IO exposes the raw HTTP upgrade request via socket.request.
 */
function buildRequestForToken(
  socket: Socket
): IncomingMessage & { cookies: Record<string, string> } {
  const req = socket.request as IncomingMessage & {
    cookies?: Record<string, string>;
  };

  // Parse cookie header into a plain object if not already parsed
  const cookieHeader = req.headers?.cookie ?? "";
  const parsedCookies: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();
    parsedCookies[key] = decodeURIComponent(value);
  }

  // If the client passed the token explicitly via handshake auth, inject it
  // as a bearer token in the Authorization header so getToken() can find it.
  const handshakeToken =
    (socket.handshake.auth as Record<string, unknown> | undefined)?.token;
  if (typeof handshakeToken === "string" && handshakeToken.length > 0) {
    req.headers = {
      ...req.headers,
      authorization: `Bearer ${handshakeToken}`,
    };
  }

  return Object.assign(req, { cookies: parsedCookies });
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

/**
 * Authentication middleware.
 *
 * Attach to a namespace with:
 *   namespace.use(socketAuthMiddleware);
 *
 * On success  → calls next() with socket.data.userId and socket.data.username set.
 * On failure  → calls next(new Error("Unauthorized")) which Socket.IO
 *               translates into a connection_error on the client side.
 */
export async function socketAuthMiddleware(
  socket: Socket<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    SocketData
  >,
  next: (err?: Error) => void
): Promise<void> {
  try {
    const req = buildRequestForToken(socket);

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });

    if (!token) {
      console.warn(
        `[socket:auth] rejected unauthenticated connection from ${socket.handshake.address}`
      );
      next(new Error("Unauthorized"));
      return;
    }

    // dbUserId is set in the NextAuth jwt callback (src/lib/auth.ts)
    const dbUserId = token.dbUserId as number | undefined;
    const username = token.username as string | undefined;

    if (!dbUserId || !username) {
      console.warn(
        `[socket:auth] rejected connection — session token missing dbUserId or username`
      );
      next(new Error("Unauthorized"));
      return;
    }

    // Attach to socket so all handlers can access without re-querying DB
    socket.data.userId = dbUserId;
    socket.data.username = username;

    console.log(
      `[socket:auth] authenticated socket ${socket.id} for user ${username} (id=${dbUserId})`
    );
    next();
  } catch (err) {
    console.error("[socket:auth] error validating session:", err);
    next(new Error("Unauthorized"));
  }
}
