#!/bin/sh
set -e

# Railway injects PORT — Nginx listens on it. Backend always runs on 3001 (internal only).
NGINX_PORT="${PORT:-80}"

echo "[algoarena] generating nginx config for port ${NGINX_PORT}..."
PORT="$NGINX_PORT" envsubst '${PORT}' < /app/nginx.railway.conf > /etc/nginx/http.d/default.conf

echo "[algoarena] running prisma migrations..."
cd /app
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "[algoarena] starting express backend on :3001..."
PORT=3001 node packages/backend/dist/server.js &

echo "[algoarena] waiting for backend to initialize..."
sleep 3

echo "[algoarena] starting nginx on :${NGINX_PORT}..."
exec nginx -g 'daemon off;'
