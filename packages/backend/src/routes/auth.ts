/**
 * Authentication routes
 *
 * Handles Google OAuth login, logout, and session management.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';
import type { DbUser } from '../lib/db.js';

const router = Router();

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
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/signin?error=oauth_failed` }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user) {
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/signin?error=no_user`);
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
          process.env.JWT_SECRET || 'dev-secret-change-in-production',
          { expiresIn: '1h' }
        );

        res.cookie('auth-token', pendingToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          maxAge: 60 * 60 * 1000, // 1 hour for onboarding
        });

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/onboarding?token=${pendingToken}`);
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
        process.env.JWT_SECRET || 'dev-secret-change-in-production',
        { expiresIn: '7d' }
      );

      // Set cookie
      res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to home page
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/signin?error=server_error`);
    }
  }
);

/**
 * GET /api/auth/session
 * Get current user session
 */
router.get('/session', authenticate, (req: Request, res: Response) => {
  const user = req.user as DbUser;

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar_svg,
    },
  });
});

/**
 * POST /api/auth/logout
 * Logout user by clearing cookie
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('auth-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
