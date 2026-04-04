/**
 * Express app configuration for AlgoArena backend
 *
 * Sets up middleware, routes, and error handling.
 */

import { config } from 'dotenv';
config();

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { configurePassport } from './config/auth.js';
import { configureCORS } from './config/cors.js';

// Route imports
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import friendsRouter from './routes/friends.js';
import conversationsRouter from './routes/conversations.js';
import notificationsRouter from './routes/notifications.js';
import contestsRouter from './routes/contests.js';
import judgeRouter from './routes/judge.js';
import chatRouter from './routes/chat.js';
import problemsRouter from './routes/problems.js';
import avatarRouter from './routes/avatar.js';
import bountyRouter from './routes/bounty.js';

const app = express();

// Trust proxy for production deployments
app.set('trust proxy', 1);

// CORS configuration
app.use(cors(configureCORS()));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'none',
    },
  })
);

// Initialize Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/contests', contestsRouter);
app.use('/api/judge', judgeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/problems', problemsRouter);
app.use('/api/avatar', avatarRouter);
app.use('/api/bounty', bountyRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  const statusCode = (err as any).statusCode || 500;
  const message = 'Internal server error';

  res.status(statusCode).json({
    error: message
  });
});

export default app;
