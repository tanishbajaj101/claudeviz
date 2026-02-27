/**
 * Socket.IO authentication middleware for Express backend.
 *
 * Validates JWT tokens carried in the socket handshake and attaches
 * authenticated user data to socket.data for downstream handlers.
 *
 * The client must pass the JWT as:
 *   - auth.token (recommended — explicit handshake auth object)
 *   - OR the "auth-token" cookie forwarded by the browser
 */

import jwt from 'jsonwebtoken';
import type { Socket } from 'socket.io';
import type { SocketData } from '@algoarena/shared';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TokenPayload {
  sub: string;          // Google ID
  dbUserId: number;     // Database user ID
  username: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Parse cookies from a cookie header string into a plain object
 */
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};

  const parsed: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();
    parsed[key] = decodeURIComponent(value);
  }
  return parsed;
}

/**
 * Extract JWT token from socket handshake (auth object or cookies)
 */
function extractToken(socket: Socket): string | null {
  // Try explicit handshake auth first
  const handshakeToken = socket.handshake.auth?.token;
  if (typeof handshakeToken === 'string' && handshakeToken.length > 0) {
    return handshakeToken;
  }

  // Try auth header
  const authHeader = socket.handshake.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Try cookies
  const cookies = parseCookies(socket.request.headers.cookie);
  return cookies['auth-token'] || null;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

/**
 * Authentication middleware for Socket.IO namespaces.
 *
 * Attach to a namespace with:
 *   namespace.use(socketAuthMiddleware);
 *
 * On success  → calls next() with socket.data.userId and socket.data.username set
 * On failure  → calls next(new Error("Unauthorized"))
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
    const token = extractToken(socket);

    if (!token) {
      console.warn(
        `[socket:auth] rejected unauthenticated connection from ${socket.handshake.address}`
      );
      next(new Error('Unauthorized'));
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[socket:auth] JWT_SECRET not configured');
      next(new Error('Server configuration error'));
      return;
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (!decoded.dbUserId || !decoded.username) {
      console.warn(
        '[socket:auth] rejected connection — token missing dbUserId or username'
      );
      next(new Error('Unauthorized'));
      return;
    }

    // Attach to socket data for downstream handlers
    socket.data.userId = decoded.dbUserId;
    socket.data.username = decoded.username;

    console.log(
      `[socket:auth] authenticated socket ${socket.id} for user ${decoded.username} (id=${decoded.dbUserId})`
    );
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.warn(`[socket:auth] invalid token: ${err.message}`);
    } else {
      console.error('[socket:auth] error validating token:', err);
    }
    next(new Error('Unauthorized'));
  }
}
