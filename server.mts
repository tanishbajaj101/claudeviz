/**
 * Custom Next.js server for AlgoArena.
 *
 * Attaches the Socket.IO server to the same HTTP server that Next.js uses,
 * enabling WebSocket upgrades on the same port as the Next.js dev/prod server.
 *
 * Usage:
 *   Development : npx tsx server.mts
 *   Production  : npx tsx server.mts   (after `npm run build`)
 *
 * Add to package.json scripts:
 *   "dev": "tsx server.mts"
 *   "start": "NODE_ENV=production tsx server.mts"
 *
 * Why a custom server?
 * Next.js App Router route handlers do not support raw WebSocket upgrades.
 * Socket.IO must intercept the HTTP upgrade event on the underlying Node.js
 * http.Server before Next.js's handler runs.
 *
 * References:
 *   https://socket.io/docs/v4/server-initialization/#with-nextjs
 *   https://nextjs.org/docs/pages/building-your-application/configuring/custom-server
 */



import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

// Import server dynamically AFTER Next.js loads .env.local via app.prepare()
const serverModule = await import("./src/lib/socket/server");
const getSocketServer = (serverModule as any).getSocketServer || (serverModule as any).default?.getSocketServer;

const httpServer = createServer((req, res) => {
  const parsedUrl = parse(req.url ?? "/", true);
  handle(req, res, parsedUrl).catch((err: unknown) => {
    console.error("Next.js request handler error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  });
});

// Attach Socket.IO BEFORE httpServer.listen so the upgrade event is wired up
getSocketServer(httpServer);

httpServer.listen(port, hostname, () => {
  console.log(`> AlgoArena ready on http://${hostname}:${port}`);
  console.log(`> Socket.IO listening on ws://${hostname}:${port}`);
  console.log(`> Namespaces: /chat, /contests, /notifications`);
  console.log(`> Environment: ${dev ? "development" : "production"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[server] SIGTERM received — shutting down gracefully");
  httpServer.close(() => {
    console.log("[server] HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("[server] SIGINT received — shutting down gracefully");
  httpServer.close(() => {
    console.log("[server] HTTP server closed");
    process.exit(0);
  });
});
