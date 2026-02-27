# Architecture

> Quick-reference for the monorepo structure, package roles, and deployment topology.

## Monorepo Layout

```
algoarena/
├── packages/
│   ├── frontend/          @algoarena/frontend   (Vite 7 + React 19 SPA, port 5173)
│   ├── backend/           @algoarena/backend    (Express 4 + Socket.IO 4.8, port 3001)
│   └── shared/            @algoarena/shared     (TypeScript type definitions)
├── prisma/
│   └── schema.prisma      9 models, 4 enums — PostgreSQL via Supabase
├── nginx.conf             Production reverse-proxy config
└── package.json           Root workspace (npm workspaces)
```

## Package Responsibilities

| Package | Entry Point | Role |
|---------|-------------|------|
| **frontend** | `src/main.tsx` | Single-page app: routing, UI, editor, algorithm visualizations |
| **backend** | `src/server.ts` → `src/app.ts` | REST API (43 endpoints), Socket.IO server (3 namespaces), Passport auth |
| **shared** | `src/index.ts` | Shared TypeScript types for API payloads, socket events, and domain models |

## Request Flow

```
Browser (5173)
  ├── Static assets ─── Vite dev server / Nginx (production)
  ├── /api/*       ─── Vite proxy ──→ Express (3001)
  ├── /socket.io/* ─── WebSocket ──→ Socket.IO (3001)
  └── Judge0       ─── /api/judge ──→ Express ──→ RapidAPI (judge0-ce)
```

## Frontend Architecture

```
src/
├── main.tsx                    # ReactDOM root + RouterProvider
├── router.tsx                  # React Router 6 — all routes
├── layouts/
│   └── RootLayout.tsx          # Shell: Navbar + Providers + Outlet
├── contexts/
│   └── AuthContext.tsx          # JWT auth state (useAuth hook)
├── pages/                      # 10 route components
│   ├── HomePage.tsx             # Problem list (ProblemTable)
│   ├── ProblemPage.tsx          # Split-pane workspace
│   ├── ContestsPage.tsx         # Contest CRUD + listing
│   ├── ContestDetailPage.tsx    # Contest detail wrapper
│   ├── ContestProblemPage.tsx   # Contest workspace wrapper
│   ├── MessagesPage.tsx         # Full-screen chat
│   ├── ProfilePage.tsx          # Current user → redirect
│   ├── PublicProfilePage.tsx    # Any user's public profile
│   ├── SignInPage.tsx           # Google OAuth entry
│   └── OnboardingPage.tsx       # Avatar + username setup
├── components/
│   ├── auth/                    # ProtectedRoute
│   ├── layout/                  # Navbar, Providers
│   ├── problems/                # ProblemTable, ProblemWorkspace, RecommendModal
│   ├── editor/                  # CodeEditor (react-simple-code-editor + Prism)
│   ├── contests/                # CreateContestModal, CountdownTimer, LeaderboardTab, DiscussionTab, InviteFriendsDropdown, ContestProblemWorkspace
│   ├── friends/                 # FriendsContext, FriendsSidebar, FriendsListView, FriendsSearchView, SidebarChat, FullScreenChat, ConversationList, MessageRenderer
│   ├── notifications/           # NotificationsDropdown, ToastNotifications, NotificationItem, NotificationsProvider
│   ├── profile/                 # ProfileClient, ActivityHeatmap
│   ├── visualization/           # Algorithm visualization renderer
│   └── ui/                      # Shared UI primitives
├── hooks/
│   ├── useSocket.ts             # Socket.IO connection (3 namespace aliases)
│   ├── useJudge.ts              # Judge0 submission + polling
│   ├── useSubmissions.ts        # Submission history
│   └── useOnboardingRedirect.ts # Post-onboarding redirect
├── lib/
│   ├── api-client.ts            # Typed fetch wrapper (credentials: include)
│   ├── contest-status.ts        # Client-side contest status util
│   ├── cookies.ts               # Cookie helpers
│   ├── problems.ts              # Problem lookup
│   └── tracers/                 # Algorithm visualization tracer classes
│       ├── commander.ts         # Step sequencing
│       ├── tracer.ts            # Base tracer
│       ├── array-1d-tracer.ts
│       ├── array-2d-tracer.ts
│       ├── graph-tracer.ts
│       ├── chart-tracer.ts
│       ├── log-tracer.ts
│       ├── layout.ts
│       └── index.ts
├── data/
│   ├── problems.ts              # Aggregator — exports all problems
│   └── problems/                # Problem definition files
│       ├── easy.ts              # 10 easy problems
│       ├── medium1.ts           # ~10 medium problems
│       ├── medium2.ts           # ~10 medium problems
│       └── hard1.ts, hard2.ts   # ~15 hard problems
└── types/
    └── (additional local types)
```

## Backend Architecture

```
src/
├── server.ts                    # HTTP server creation + Socket.IO attach + listen
├── app.ts                       # Express app: middleware pipeline + route mounting
├── config/
│   ├── auth.ts                  # Passport Google OAuth + JWT strategy setup
│   └── cors.ts                  # CORS allowed-origins config
├── middleware/
│   └── auth.ts                  # JWT verification (authenticate / optionalAuth)
├── routes/                      # 9 route files, 43+ endpoints
│   ├── auth.ts                  # 4 endpoints: Google OAuth flow + session + logout
│   ├── users.ts                 # 7 endpoints: CRUD, search, avatar, activity tracking
│   ├── friends.ts               # 6 endpoints: list, request, accept, reject, unfriend, requests
│   ├── conversations.ts         # 5 endpoints: list, direct, unread-count, messages, send
│   ├── notifications.ts         # 4 endpoints: list, unread-count, read-all, read-one
│   ├── contests.ts              # 8+ endpoints: CRUD, join, submit, leaderboard
│   ├── problems.ts              # Problem status + submissions
│   ├── judge.ts                 # Judge0 CE proxy (security layer)
│   └── chat.ts                  # AI coach (LangChain)
├── socket/
│   ├── index.ts                 # Socket.IO server init (3 namespaces)
│   ├── auth.ts                  # Socket JWT authentication middleware
│   ├── rooms.ts                 # Room join/leave with DB participant validation
│   ├── connections.ts           # User presence: Map<userId, Set<socketId>>
│   └── notification-helpers.ts  # Push notification to connected users
├── lib/
│   ├── prisma.ts                # Prisma client singleton
│   ├── db.ts                    # Legacy better-sqlite3 (users/submissions tables)
│   ├── contest-status.ts        # getContestStatus() — runtime status derivation
│   ├── contest-helpers.ts       # selectRandomProblems(), sendContestInvites(), scoring
│   ├── judge0.ts                # Judge0 API wrapper (base64 encoding)
│   ├── chatbot.ts               # LangChain main coaching agent
│   ├── visualization-agent.ts   # LangChain visualization code generator
│   └── problems.ts              # Problem data re-export
└── data/
    └── problems/                # Problem definitions (mirrored from frontend)
```

## Production Deployment

```
                      ┌─────────────────────────────┐
                      │        Nginx (port 80/443)   │
                      │  ┌──────────────────────┐    │
  Browser ──────────► │  │ /           → static  │    │
                      │  │ /api/*      → :3001   │    │
                      │  │ /socket.io/ → :3001   │    │
                      │  │   (WebSocket upgrade) │    │
                      │  └──────────────────────┘    │
                      └─────────────────────────────┘
                                    │
                      ┌─────────────┴─────────────┐
                      │  Express + Socket.IO :3001 │
                      │  (PM2/systemd managed)     │
                      └─────────────┬─────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              PostgreSQL       Judge0 CE      OpenAI API
              (Supabase)       (RapidAPI)     (LangChain)
```

## Key Design Decisions

1. **Monorepo over microservices** — single deploy target, shared types, npm workspaces
2. **Vite over Next.js** — 10x faster HMR, no SSR needed (pure SPA)
3. **Express over Next.js API routes** — native Socket.IO, cleaner separation
4. **JWT in httpOnly cookies** — XSS-safe, no localStorage tokens
5. **Prisma + legacy SQLite** — gradual migration; new features use Prisma only
6. **Contest status computed at runtime** — `getContestStatus(starts_at, duration_minutes)` — never stored in DB
7. **C++ only language** — simplifies Judge0 integration (single `language_id: 54`)
