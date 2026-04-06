/**
 * Authentication routes
 *
 * Handles Google OAuth login, logout, and session management.
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import type { DbUser } from '../lib/db.js';

const router = Router();

// Ensure FRONTEND_URL is absolute
let FRONTEND_URL = process.env.FRONTEND_URL!;
if (FRONTEND_URL && !FRONTEND_URL.startsWith('http')) {
  FRONTEND_URL = `https://${FRONTEND_URL}`;
}

/**
 * POST /api/auth/google
 * Initiates Google OAuth flow
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

/**
 * GET /api/auth/google/callback
 * Google OAuth callback - creates JWT and redirects to frontend
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${FRONTEND_URL}/auth/signin?error=oauth_failed` 
  }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user) {
        res.redirect(`${FRONTEND_URL}/auth/signin?error=no_user`);
        return;
      }

      if (user.isPending || !user.username || user.username.startsWith('!pending-')) {
        // Pending users don't have a database record yet
        const pendingToken = jwt.sign(
          {
            sub: user.google_id,
            isPending: true,
            email: user.email,
            name: user.name,
          },
          process.env.JWT_SECRET!,
          { expiresIn: '1h' }
        );

        res.cookie('auth-token', pendingToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
          maxAge: 60 * 60 * 1000, // 1 hour for onboarding
        });

        res.redirect(`${FRONTEND_URL}/onboarding?token=${pendingToken}`);
        return;
      }

      // Generate fully authenticated JWT token
      const token = jwt.sign(
        {
          sub: user.google_id,
          dbUserId: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Set cookie
      res.cookie('auth-token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to home page with token in URL for cross-browser compatibility
      // (Safari ITP and Firefox ETP block cross-site cookies; localStorage + Bearer header works universally)
      res.redirect(`${FRONTEND_URL}?token=${token}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${FRONTEND_URL}/auth/signin?error=server_error`);
    }
  }
);

/**
 * GET /api/auth/session
 * Get current user session — handles both full and pending (onboarding) tokens.
 */
router.get('/session', async (req: Request, res: Response) => {
  const token =
    req.cookies['auth-token'] ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.substring(7)
      : null);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as any;

    // Pending users haven't completed onboarding yet — no DB record exists
    if (decoded.isPending) {
      res.json({
        user: {
          isPending: true,
          email: decoded.email,
          name: decoded.name,
        },
      });
      return;
    }

    if (!decoded.dbUserId) {
      res.status(401).json({ error: 'Unauthorized: Invalid token format' });
      return;
    }

    const { getUserById } = await import('../lib/db.js');
    const user = await getUserById(decoded.dbUserId) as DbUser | null;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar_svg,
      },
    });
  } catch (error) {
    if ((error as any)?.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Unauthorized: Token expired' });
      return;
    }
    if ((error as any)?.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }
    console.error('Session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user by clearing cookie
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('auth-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
