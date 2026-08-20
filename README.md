# CodeTracer (AlgoArena)

A LeetCode alternative: browse a problem list, solve in a split-pane workspace (editor + Judge0 runner + AI coach), and review algorithm visualizations. Includes contests, friends, real-time chat, and notifications.

## Stack

**Monorepo (npm workspaces):**
- **Frontend:** Vite 7 + React 19 + React Router 6, TypeScript strict, Tailwind CSS (port 5173)
- **Backend:** Express 4 + Socket.IO 4.8 + Passport.js (Google OAuth + JWT auth) (port 3001)
- **Shared:** TypeScript type definitions package
- **Database:** Prisma 7 ORM — PostgreSQL via Supabase + legacy `better-sqlite3` for `users`/`submissions`
- **Real-time:** Socket.IO — `/chat`, `/contests`, `/notifications` namespaces
- **Editor:** `react-simple-code-editor` + Prism.js — C++ only (Judge0 `language_id: 54`, GCC 9.2.0)
- **External APIs:** Judge0 CE API, OpenAI (LangChain agents)

## Getting Started

Install dependencies from the repo root:

```bash
npm install
```

Set up environment variables (see below), then start both frontend and backend together:

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)

Run them individually if needed:

```bash
npm run dev:backend
npm run dev:frontend
```

### Database

```bash
npm run prisma:generate -w @algoarena/backend
npm run prisma:migrate -w @algoarena/backend
npm run prisma:studio -w @algoarena/backend
```

### Build & Production

```bash
npm run build          # builds shared -> backend -> frontend
npm run start           # starts the Express server (Nginx serves the frontend build)
```

## Environment Variables

**Backend (`packages/backend/.env`):**

```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=<random-secret>
SESSION_SECRET=<random-secret>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=...
OPENAI_API_KEY=sk-proj-...
FRONTEND_URL=http://localhost:5173
```

**Frontend (`packages/frontend/.env.local`):**

```bash
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

See `docs/` for full API, database, socket, and deployment references.

## Project Structure

```
packages/
├── frontend/   # Vite + React SPA
├── backend/    # Express + Socket.IO API
└── shared/     # Shared TypeScript types
prisma/         # Prisma schema
docs/           # Architecture, API, database, auth, and other reference docs
```

See `CLAUDE.md` for the full architecture breakdown, code conventions, and deployment details.

## Deployment

Split deployment: **Vercel** (frontend, SPA) + **Railway** (backend, Express + Socket.IO) + **Supabase** (PostgreSQL).

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Railway |
| Database | Supabase |

Pushing to `main` triggers builds on both Vercel and Railway. See `docs/ARCHITECTURE.md` for the full deployment configuration.
