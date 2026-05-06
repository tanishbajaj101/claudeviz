#!/bin/sh
set -e

export PORT="${PORT:-80}"

echo "[algoarena] generating nginx config for port ${PORT}..."
# Only substitute ${PORT} — leaves nginx $variables ($host, $uri, etc.) untouched
envsubst '${PORT}' < /app/nginx.railway.conf > /etc/nginx/http.d/default.conf

echo "[algoarena] running prisma migrations..."
cd /app
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "[algoarena] starting express backend on :3001..."
node packages/backend/dist/server.js &

echo "[algoarena] waiting for backend to initialize..."
sleep 3

echo "[algoarena] starting nginx on :${PORT}..."
exec nginx -g 'daemon off;'
