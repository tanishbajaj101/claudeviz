/**
 * AlgoArena Express + Socket.IO Server
 *
 * Main entry point that creates HTTP server, initializes Express app,
 * and attaches Socket.IO server.
 */

import { createServer } from 'http';
import { config } from 'dotenv';
import app from './app.js';
import { initializeSocketIO } from './socket/index.js';

// Load environment variables
config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocketIO(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 AlgoArena backend running in ${NODE_ENV} mode`);
  console.log(`📡 HTTP server: http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO ready on /chat, /contests, /notifications namespaces`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { httpServer, io };
