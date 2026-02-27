/**
 * Passport authentication configuration
 *
 * Configures Google OAuth 2.0 strategy and JWT strategy for API authentication.
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import type { StrategyOptions as JwtStrategyOptions } from 'passport-jwt';
import { getUserByGoogleId, getUserById, createUser } from '../lib/db.js';

interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
}

interface JwtPayload {
  sub: string; // Google ID
  dbUserId: number; // Database user ID
  username: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export function configurePassport() {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile: GoogleProfile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          // Check if user exists
          let user = await getUserByGoogleId(profile.id);

          if (!user) {
            // Treat them as a guest/pending user. They will choose their username and avatar during onboarding.
            // We do not create a database record yet.
            const pendingUser = {
              isPending: true,
              google_id: profile.id,
              email,
              name: profile.displayName,
            };
            return done(null, pendingUser as any);
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );

  // JWT Strategy for API authentication
  const jwtOptions: JwtStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      // Try cookie first
      (req) => {
        return req?.cookies?.['auth-token'] || null;
      },
      // Then try Authorization header
      ExtractJwt.fromAuthHeaderAsBearerToken(),
    ]),
    secretOrKey: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload: JwtPayload, done) => {
      try {
        const user = await getUserById(payload.dbUserId);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

  // Serialize user for session (optional, mainly for OAuth flow)
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
