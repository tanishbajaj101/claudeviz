/**
 * Authentication middleware for protected routes
 *
 * Verifies JWT token from cookie or Authorization header and attaches user to request.
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '../lib/db.js';
import type { DbUser } from '../lib/db.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface User extends DbUser {}
    interface Request {
      user?: User;
    }
  }
}

interface TokenPayload {
  sub: string; // Google ID
  dbUserId: number; // Database user ID
  username: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to authenticate user via JWT token.
 * Token can be in cookie ('auth-token') or Authorization header ('Bearer <token>').
 *
 * Attaches `req.user` if valid, otherwise returns 401 Unauthorized.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Try to extract token from cookie or Authorization header
    const token =
      req.cookies['auth-token'] ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.substring(7)
        : null);

    if (!token) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Guard against old tokens that lack dbUserId
    if (!decoded.dbUserId) {
      res.status(401).json({ error: 'Unauthorized: Invalid token format' });
      return;
    }

    // Fetch user from database
    const user = await getUserById(decoded.dbUserId);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Unauthorized: Token expired' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Optional auth middleware - attaches user if token is present, but doesn't require it.
 * Useful for endpoints that behave differently when user is logged in vs not.
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token =
      req.cookies['auth-token'] ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.substring(7)
        : null);

    if (!token) {
      next();
      return;
    }

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as TokenPayload;
    if (decoded.dbUserId) {
      const user = await getUserById(decoded.dbUserId);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}
