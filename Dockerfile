FROM node:20-alpine

# Build tools for native modules (better-sqlite3) + nginx + envsubst
RUN apk add --no-cache python3 make g++ nginx gettext

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# Install all deps (dev included — needed to build TS)
RUN npm ci

# Copy full source
COPY . .

# Generate Prisma client for Alpine Linux (musl)
RUN npx prisma generate --schema=prisma/schema.prisma

# Build in dependency order: shared → backend → frontend
# VITE_API_URL intentionally unset so frontend uses relative paths — Nginx proxies them
RUN npm run build -w @algoarena/shared && \
    npm run build -w @algoarena/backend && \
    npm run build -w @algoarena/frontend

# Drop dev deps to shrink the image
RUN npm prune --omit=dev

# Remove default nginx site config
RUN rm -f /etc/nginx/http.d/default.conf

RUN chmod +x start.sh

EXPOSE 80

CMD ["sh", "start.sh"]
