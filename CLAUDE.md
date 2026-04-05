# AlgoArena

LeetCode alternative: problem list → split-pane workspace (editor + Judge0 runner + AI coach) → algorithm visualizations.

### Token-Saving: Gemini CLI for Large Analysis

When a task requires analyzing many files or entire directories (100KB+), use `gemini -p` with `@path` syntax instead of reading files one by one. This saves Claude tokens and leverages Gemini's massive context window. See `docs/GEMINI_CLI_GUIDE.md` for syntax and AlgoArena-specific examples. Use for: architecture reviews, cross-codebase pattern checks, implementation verification, security audits, and coverage analysis.


## Stack

**Monorepo Architecture (npm workspaces):**
- **Frontend:** Vite 7 + React 19 + React Router 6, TypeScript strict, Tailwind CSS (port 5173)
- **Backend:** Express 4 + Socket.IO 4.8 + Passport.js (Google OAuth + JWT auth) (port 3001)
- **Shared:** TypeScript type definitions package
- **Database:** Prisma 7 ORM — PostgreSQL via Supabase + legacy `better-sqlite3` for `users`/`submissions`
- **Real-time:** Socket.IO 4.8 — 3 namespaces: `/chat`, `/contests`, `/notifications`
- **Editor:** `react-simple-code-editor` + Prism.js — C++ only (`language_id: 54`, GCC 9.2.0)
- **External APIs:** Judge0 CE API, OpenAI (LangChain agents)

**Why Monorepo?**
Migrated from Next.js to Vite + Express for:
- **10x faster HMR:** 50-200ms (Vite) vs 1-3s (Next.js)
- **5-6x faster builds:** 5-10s (Vite) vs 30-60s (Next.js)
- **Cleaner architecture:** Separation of frontend SPA and backend API
- **Better Socket.IO integration:** Express native support vs custom Next.js server
- **No unused SSR:** App was 100% client-side despite using Next.js

## Commands

**Development:**
- `npm run dev` — Start both backend (3001) and frontend (5173) concurrently
- `npm run dev -w @algoarena/backend` — Backend only
- `npm run dev -w @algoarena/frontend` — Frontend only (with Vite proxy to backend)

**Production:**
- `npm run build` — Build all packages (shared → backend → frontend)
- `npm run start -w @algoarena/backend` — Start Express server (Nginx serves frontend)

**Database:**
- `npm run prisma:generate -w @algoarena/backend` — Generate Prisma client
- `npm run prisma:migrate -w @algoarena/backend` — Run migrations
- `npm run prisma:studio -w @algoarena/backend` — Open Prisma Studio

## Architecture

```
packages/
├── frontend/                 # Vite + React SPA (port 5173)
│   ├── src/
│   │   ├── pages/           # Route components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProblemPage.tsx
│   │   │   ├── ContestsPage.tsx
│   │   │   ├── ContestDetailPage.tsx
│   │   │   ├── ContestProblemPage.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   ├── UserProfilePage.tsx
│   │   │   ├── SignInPage.tsx
│   │   │   └── OnboardingPage.tsx
│   │   ├── components/
│   │   │   ├── ui/ chat/ editor/ visualization/ problems/ layout/
│   │   │   ├── contests/   # CreateContestModal, CountdownTimer, LeaderboardTab, etc.
│   │   │   ├── friends/    # FriendsContext, FriendsSidebar, SidebarChat, etc.
│   │   │   ├── notifications/ # NotificationsDropdown, ToastNotifications, etc.
│   │   │   └── profile/    # ActivityHeatmap, ProfileClient
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Custom JWT auth (replaces NextAuth)
│   │   ├── hooks/
│   │   │   ├── useSocket.ts     # Socket.IO hooks
│   │   │   ├── useJudge.ts
│   │   │   ├── useSubmissions.ts
│   │   │   └── useOnboardingRedirect.ts
│   │   ├── lib/
│   │   │   └── tracers/    # Client-side algorithm tracers
│   │   ├── data/
│   │   │   └── problems/   # Problem definitions (shared with backend)
│   │   ├── router.tsx      # React Router configuration
│   │   └── main.tsx        # Entry point
│   └── vite.config.ts      # Vite + proxy config
│
├── backend/                  # Express + Socket.IO (port 3001)
│   ├── src/
│   │   ├── server.ts        # HTTP server + Socket.IO attach
│   │   ├── app.ts           # Express app configuration
│   │   ├── config/
│   │   │   ├── auth.ts      # Passport Google OAuth + JWT strategies
│   │   │   └── cors.ts      # CORS configuration
│   │   ├── middleware/
│   │   │   └── auth.ts      # JWT verification middleware
│   │   ├── routes/          # 43 API endpoints (Express routers)
│   │   │   ├── auth.ts      # Google OAuth + JWT token generation
│   │   │   ├── users.ts     # 7 user endpoints
│   │   │   ├── friends.ts   # 6 friend endpoints
│   │   │   ├── conversations.ts # 5 messaging endpoints
│   │   │   ├── notifications.ts # 4 notification endpoints
│   │   │   ├── contests.ts  # 8 contest endpoints
│   │   │   ├── judge.ts     # Judge0 proxy
│   │   │   ├── chat.ts      # AI coach
│   │   │   └── problems.ts  # Problem status + submissions
│   │   ├── socket/
│   │   │   ├── index.ts     # Socket.IO server setup
│   │   │   ├── auth.ts      # Socket JWT authentication
│   │   │   ├── rooms.ts     # Room management
│   │   │   ├── connections.ts # User presence tracking
│   │   │   └── notification-helpers.ts
│   │   ├── lib/
│   │   │   ├── prisma.ts    # Prisma client singleton
│   │   │   ├── db.ts        # Legacy better-sqlite3
│   │   │   ├── contest-status.ts
│   │   │   ├── contest-helpers.ts
│   │   │   ├── judge0.ts
│   │   │   ├── chatbot.ts   # LangChain main agent
│   │   │   └── visualization-agent.ts # LangChain viz agent
│   │   └── data/
│   │       └── problems/    # Problem definitions
│   └── package.json
│
├── shared/                   # Shared TypeScript types
│   ├── src/
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── problem.ts
│   │   │   ├── contest.ts
│   │   │   ├── message.ts
│   │   │   ├── socket.ts
│   │   │   └── api.ts
│   │   └── index.ts
│   └── package.json
│
├── prisma/
│   └── schema.prisma        # 9 models + 2 legacy mappings
├── nginx.conf               # Production reverse proxy
└── package.json             # Root workspace config
```

## Code Style

- TypeScript strict, no `any` — named exports only — functional components + hooks
- `kebab-case.ts` for utils, `PascalCase.tsx` for components
- Absolute imports: `@/*` (frontend/backend), `@algoarena/shared` (types package)
- React Router patterns:
  - Use `Link` from `react-router-dom` (not `next/link`)
  - Use `useNavigate()` for programmatic navigation (not `useRouter().push()`)
  - Use `useLocation()` for pathname (not `usePathname()`)
  - Use `useParams()` for route params (same as Next.js)
- Express API routes return typed JSON, never raw strings
- No "use client" directives (Vite doesn't need them)

## Env Vars (NEVER commit)

**Backend (`packages/backend/.env`):**
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://...  # PostgreSQL connection string
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

**Production env vars (Railway backend):**
```bash
NODE_ENV=production
FRONTEND_URL=https://codetracer.vercel.app
GOOGLE_CALLBACK_URL=https://claudeviz-production.up.railway.app/api/auth/google/callback
```

**Production env vars (Vercel frontend):**
```bash
VITE_API_URL=https://claudeviz-production.up.railway.app
VITE_SOCKET_URL=https://claudeviz-production.up.railway.app
```

## Critical Rules

1. **Problem data:** From `packages/frontend/src/data/problems/` or `packages/backend/src/data/problems/` only — never hardcoded in components
2. **Judge0 security:** API key never reaches client — all proxied via backend `/api/judge`
3. **Editorial secrecy:** Editorial is internal AI context only — never shown to users
4. **Judge0 encoding:** All Judge0 payloads use `base64_encoded=true`
5. **Chatbot coaching:** Guides/nudges only — never gives full solution
6. **Contest status:** NEVER stored in DB — always computed via `getContestStatus(starts_at, duration_minutes)`
7. **Contest scoring:** easy=100, medium=200, hard=300 — no time bonuses
8. **Socket.IO reliability:** Calls are best-effort — wrap in try/catch
9. **Database access:** Use Prisma for new features; legacy `better-sqlite3` for `users`/`submissions` only
10. **Authentication:** JWT tokens in httpOnly cookies — frontend reads from `useAuth()` hook only
11. **Routing:** React Router (not Next.js) — use `Link` from `react-router-dom`, `useNavigate()`, `useLocation()`
12. **No "use client":** Vite doesn't need this directive — remove from all files

## Judge0

Language: C++ GCC 9.2.0 → `language_id: 54`
Limits: `cpu_time_limit`(s), `wall_time_limit`(s), `memory_limit`(KB), `stack_limit`(KB)
Statuses: 3=Accepted, 4=WrongAnswer, 5=TLE, 6=CompileError, 7=SIGSEGV, 9=SIGFPE, 11=NZEC

## Database Models

| Model | Key Fields | Notes |
|-------|-----------|-------|
| Contest | id(UUID), title, creator_id, is_public, starts_at, duration_minutes | Status derived at runtime |
| ContestProblem | contest_id, problem_id, order, difficulty | Unique: (contest_id, problem_id) |
| ContestParticipant | contest_id, user_id, total_score | Unique: (contest_id, user_id) |
| ContestSubmission | contest_id, user_id, problem_id, is_correct, score | Best score per problem counts |
| Conversation | type (direct/contest), contest_id? | Polymorphic messaging |
| ConversationParticipant | conversation_id, user_id, last_seen_message_id? | Unique: (conversation_id, user_id) |
| Message | conversation_id, sender_id, type, content, metadata(JSON) | Types: text, problem_recommendation, code_snippet, contest_invite |
| Notification | user_id, type, data(JSON), is_read | Types: friend_request, friend_request_accepted, friend_online, contest_invite |
| FriendRequest | sender_id, receiver_id, status(pending/accepted/rejected) | Bidirectional check required |

## Socket.IO

| Namespace | Rooms | Key Events |
|-----------|-------|------------|
| `/chat` | `conversation:<id>` | `message:new`, `message:read`, `user:typing`, `message:send` |
| `/contests` | `contest:<id>` | `contest:started/ending/ended`, `submission:new`, `leaderboard:update` |
| `/notifications` | `notifications:<userId>` (auto) | `notification:new`, `notification:read`, `friend:online/offline`, `unread_update` |

**Auth:** JWT token validated on connect (from cookie or handshake.auth.token). Middleware in `packages/backend/src/socket/auth.ts`.
**Rooms:** DB-validated via `joinConversation()`/`joinContest()` with participant checks.
**Presence:** In-memory `Map<userId, Set<socketId>>` — `isUserOnline()`, `broadcastToUser()`.
**Client hooks:** `useChatSocket()`, `useContestSocket()`, `useNotificationSocket()` in `packages/frontend/src/hooks/useSocket.ts`.

## Key Patterns

- **Contest submit flow:** Validate participant + active status → run all test cases via Judge0 → score by difficulty → atomic `groupBy` best-score recalc → broadcast leaderboard
- **Chat:** Cursor-based pagination (message UUID cursors) → contest chat send-gated to active status → Socket.IO broadcast after DB write
- **Notifications:** DB-persisted + real-time Socket.IO push → toast for friend_online(7s auto-dismiss), friend_request/contest_invite(persistent)
- **Friends sidebar:** Global `FriendsContext` → fixed right-side overlay → unread count from Socket.IO `unread_update`
- **Profile:** Username-based routes `/profile/[username]` → public access → friendship actions → 365-day heatmap → cycling solve stats

## Production Deployment

**Architecture:** Split deployment — Vercel (frontend) + Railway (backend)

| Service | Platform | URL |
|---------|----------|-----|
| Frontend (Vite SPA) | Vercel | https://codetracer.vercel.app |
| Backend (Express + Socket.IO) | Railway | https://claudeviz-production.up.railway.app |
| Database | Supabase | PostgreSQL |

**Config files:**
- `vercel.json` (root) — SPA rewrite: `/*` → `/index.html`
- `packages/backend/railway.toml` — build, migrate, start commands + health check at `/health`

**Cross-domain setup (required for split deployment):**
- CORS: `FRONTEND_URL=https://codetracer.vercel.app` on Railway → `cors.ts` whitelists it with `credentials: true`
- Cookies: `sameSite: 'none'`, `secure: true` — required for cross-origin cookie transmission
- Frontend API calls: `credentials: 'include'` in all fetch requests (`api-client.ts`)
- Socket.IO auth: JWT from cookie + `withCredentials: true` on handshake

**Build & deploy:**
- Frontend: push to main → Vercel auto-builds with `vite build`
- Backend: push to main → Railway runs `npm run build -w @algoarena/shared && npm run build -w @algoarena/backend`, then `npx prisma migrate deploy`, then starts server

## Specialized Docs

### Context Management (load only what you need)

| Topic | Doc | When to Load |
|-------|-----|--------------|
| **Monorepo structure, deployment, data flow** | `docs/ARCHITECTURE.md` | Starting any new feature, understanding layout |
| **All 43+ REST endpoints, payloads, auth** | `docs/API_REFERENCE.md` | Adding/modifying API endpoints |
| **Prisma models, enums, relations** | `docs/DATABASE.md` | Schema changes, queries, migrations |
| **Socket.IO namespaces, events, hooks** | `docs/SOCKETIO.md` | Real-time features, chat, notifications |
| **Component hierarchy and file map** | `docs/FRONTEND.md` | UI changes, adding components |
| **Contest lifecycle, scoring, submission** | `docs/CONTESTS.md` | Contest-related features |
| **OAuth flow, JWT, middleware, hooks** | `docs/AUTH.md` | Auth-related changes |
| **Code style, imports, anti-patterns** | `docs/CONVENTIONS.md` | Writing any new code |

### Feature-Specific Docs

| Topic | Doc |
|-------|-----|
| Chatbot rules, coaching, anti-gaming | `docs/chatbot-system-prompt.md` |
| Visualization code gen, tracer API | `docs/visualization-agent-prompt.md` |
| Problem data schema, test cases, limits | `docs/problem-data-reference.md` |
| Color system + theming | `docs/COLOR_SYSTEM_GUIDE.md` |
| Logging conventions | `docs/LOGGING_SYSTEM_GUIDE.md` |
| Gemini CLI for large codebase analysis | `docs/GEMINI_CLI_GUIDE.md` |
