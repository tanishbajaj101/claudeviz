/**
 * CORS configuration for AlgoArena backend
 */

import type { CorsOptions } from 'cors';

export function configureCORS(): CorsOptions {
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

  return {
    origin: [frontendURL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
  };
}
