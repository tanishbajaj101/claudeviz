# AlgoArena

LeetCode alternative: problem list → split-pane workspace (editor + Judge0 runner + AI coach) → algorithm visualizations.

## Stack

- Next.js 14+ (App Router), TypeScript strict, Tailwind CSS
- Prisma 7 ORM — SQLite database (`data/algoarena.db`)
- Socket.IO 4.8 — Real-time bidirectional communication (3 namespaces: chat, contests, notifications)
- `react-simple-code-editor` + Prism.js — C++ only (`language_id: 54`, GCC 9.2.0)
- Judge0 CE API — code execution with per-problem resource limits
- NextAuth.js — Google OAuth 2.0
- LangChain — two-agent chatbot (Main Agent + Visualization Agent)
- Custom tracer library — client-side algorithm animations via web worker

## Commands

- `npm run dev` — Dev server with Socket.IO (custom server), port 3000
- `npm run build` — Production build (run after every change set)
- `npm start` — Production server with Socket.IO
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript strict check
- `npx prisma migrate dev` — Create and apply migrations
- `npx prisma studio` — Visual database browser
- `npx prisma generate` — Generate Prisma Client (auto-runs after migrate)

## Architecture

```
project root/
├── server.mts                            # Custom Next.js server with Socket.IO
├── scripts/
│   └── seed-contests.ts                  # Seed script for sample contests
└── src/
    ├── app/
    │   ├── page.tsx                      # Home: problem list with filters
    │   ├── problems/[id]/page.tsx        # Problem workspace (split-pane)
    │   ├── profile/page.tsx              # User progress + submission history
    │   └── api/
    │       ├── socket/route.ts           # Socket.IO health check endpoint
    │       ├── notifications/
    │       │   ├── route.ts              # GET (list notifications, paginated)
    │       │   ├── unread-count/route.ts # GET (unread notification count)
    │       │   ├── read-all/route.ts     # POST (mark all read)
    │       │   └── [id]/
    │       │       └── read/route.ts     # POST (mark single read)
    │       ├── friends/
    │       │   ├── route.ts              # GET (enhanced list) & POST (send request)
    │       │   └── [id]/
    │       │       ├── accept/route.ts   # POST (accept friend request)
    │       │       └── reject/route.ts   # POST (reject friend request)
    │       ├── users/
    │       │   ├── search/route.ts       # GET (search users)
    │       │   ├── activity/
    │       │   │   └── problem/route.ts  # POST (track problem view)
    │       │   └── [id]/
    │       │       └── route.ts          # GET (profile with stats & heatmap)
    │       ├── conversations/
    │       │   ├── route.ts              # GET (list all conversations)
    │       │   ├── direct/route.ts       # GET/POST (get or create direct conversation)
    │       │   ├── unread-count/route.ts # GET (unread conversation count)
    │       │   └── [id]/
    │       │       ├── messages/route.ts # GET (fetch messages) & POST (send message)
    │       │       └── read/route.ts     # POST (mark as read)
    │       ├── contests/
    │       │   ├── route.ts              # GET (public list) & POST (create)
    │       │   ├── me/route.ts           # GET (my contests)
    │       │   └── [id]/
    │       │       ├── route.ts          # GET (contest details)
    │       │       ├── join/route.ts     # POST (join contest)
    │       │       ├── submit/route.ts   # POST (submit solution with Judge0)
    │       │       ├── leaderboard/route.ts # GET (leaderboard with rankings)
    │       │       └── timing/route.ts   # GET (server time & contest timing)
    │       ├── chat/route.ts             # LangChain chatbot endpoint
    │       ├── judge/route.ts            # Judge0 proxy (base64 + polling)
    │       └── auth/[...nextauth]/route.ts # NextAuth catch-all
    ├── components/
    │   ├── ui/                           # Design system primitives
    │   ├── chat/                         # Chat panel + viz renderer
    │   ├── editor/                       # Code editor wrapper
    │   ├── visualization/                # Tracer renderers, web worker bridge
    │   ├── problems/                     # Problem list, filters, cards
    │   └── layout/                       # Navbar, split-pane, sidebar
    ├── lib/
    │   ├── prisma.ts                     # Prisma client singleton (Prisma 7 adapter)
    │   ├── contest-status.ts             # Contest status derivation helpers
    │   ├── contest-helpers.ts            # Random problem selection, invites
    │   ├── socket/                       # Socket.IO infrastructure
    │   │   ├── server.ts                 # Socket.IO server with 3 namespaces
    │   │   ├── auth.ts                   # NextAuth authentication middleware
    │   │   ├── events.ts                 # TypeScript event definitions
    │   │   ├── rooms.ts                  # Room join/leave helpers (DB-validated)
    │   │   ├── connections.ts            # Online user tracking
    │   │   ├── notification-helpers.ts   # Notification emission helpers
    │   │   └── index.ts                  # Barrel exports
    │   ├── judge0.ts                     # Judge0 API client
    │   ├── chatbot.ts                    # Main Agent (detects viz needs, calls viz agent)
    │   ├── visualization-agent.ts        # Viz Agent (generates tracer code from requests)
    │   ├── tracers/                      # Client-side algorithm tracers
    │   ├── auth.ts                       # NextAuth config
    │   └── problems.ts                   # Problem data loader
    ├── hooks/
    │   └── useSocket.ts                  # React hook for Socket.IO (client)
    ├── data/
    │   └── problems.ts                   # All problem definitions (→ docs/problem-data-reference.md)
    ├── types/index.ts                    # TypeScript interfaces
    └── prisma/
        ├── schema.prisma                 # Database schema (Prisma 7)
        └── migrations/                   # Database migrations
```

## Code Style

- TypeScript strict, no `any`
- Named exports only (no default exports)
- Functional components, hooks only
- `kebab-case.ts` for utils, `PascalCase.tsx` for components
- Absolute imports via `@/*`
- API routes return typed JSON — never raw strings

## Env Vars (.env.local — NEVER commit)

```
JUDGE0_API_URL=          # Judge0 CE endpoint
JUDGE0_API_KEY=          # X-Auth-Token (if auth required)
GOOGLE_CLIENT_ID=        # console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=         # openssl rand -base64 32
OPENAI_API_KEY=
```

Google OAuth callback (register in Google Cloud Console):
`{NEXTAUTH_URL}/api/auth/callback/google`

## Critical Rules

1. **Problem data is never hardcoded in components.** Everything comes from `src/data/problems.ts`, injected dynamically per route.
2. **Judge0 key never reaches the client.** All execution goes through `/api/judge/route.ts`.
3. **Editorial is never shown to the user.** It's internal context for the AI chatbot only.
4. **All Judge0 payloads use `base64_encoded=true`.** Encode `source_code`, `stdin`, `expected_output`.
5. **The chatbot never gives users the full solution.** It guides, nudges, visualizes — never solves.

## Judge0 Quick Reference

Language: C++ (GCC 9.2.0) → `language_id: 54`

| Parameter | Controls | Unit |
|-----------|----------|------|
| `cpu_time_limit` | CPU computation time (OS scheduling excluded) | seconds |
| `cpu_extra_time` | Grace period after CPU limit for reporting | seconds (0.5) |
| `wall_time_limit` | Total wall-clock time (includes I/O, sleep) | seconds |
| `memory_limit` | Max process memory | kilobytes |
| `stack_limit` | Stack size (deep recursion) | kilobytes |

Statuses: 3=Accepted, 4=Wrong Answer, 5=TLE, 6=Compile Error, 7=SIGSEGV, 9=SIGFPE, 11=NZEC

## Specialized Docs — Use `@` References

CLAUDE.md covers project-wide rules. For **task-specific** work, reference the appropriate doc:

| When working on... | Read this |
|---------------------|-----------|
| Chatbot behavior, coaching rules, anti-gaming, Judge0 result handling | `@docs/chatbot-system-prompt.md` |
| Visualization code generation, tracer API, animation examples | `@docs/visualization-agent-prompt.md` |
| Adding/editing problems, test cases, Judge0 limits, starter code | `@docs/problem-data-reference.md` |
| Build steps, setup instructions, phased prompts | `@docs/BUILD_GUIDE.md` |

### What each doc contains:

**`docs/chatbot-system-prompt.md`** — The runtime LangChain system prompt for the Main Agent. Loaded by `src/lib/chatbot.ts`. Defines: identity, what context it receives per session (`problemDescription`, `editorial`, `codeContext`, `lastSubmissionResult`, `previouslySolved`), 7 core rules (never give solution, understand before responding, use failing test cases, react to Judge0 statuses, reference user's code, reference past problems, anti-gaming), when/how to trigger the Visualization Agent, and conversational style guidelines.

**`docs/visualization-agent-prompt.md`** — The runtime LangChain system prompt for the Visualization Agent. Loaded by `src/lib/visualization-agent.ts`. Defines: what it receives from the Main Agent, exact JSON response format (`{ type, code, description }`), full tracer API reference (`Array1DTracer`, `Array2DTracer`, `GraphTracer`, `LogTracer`, `ChartTracer` — all methods), 6 code generation rules, 3 complete working examples (binary search, two sum correct, two sum wrong approach), and common mistakes to avoid.

**`docs/problem-data-reference.md`** — Schema and examples for `src/data/problems.ts`. Includes: `Problem` TypeScript interface, Judge0 limits table by difficulty, two fully worked examples (Two Sum, Binary Search) with all fields populated (description, constraints, test cases, judge0Limits, starterCode, editorial), and the starter code pattern (why `main()` handles I/O so users only implement the `Solution` method).

## Completed Work: Database Models & Messaging System

### Phase 1 Completion Report (2026-02-24)

**Completed by:** schema-builder agent
**Task:** Database models, migrations, and helper functions for contests, messaging, and notifications
**Status:** ✅ All models implemented and validated

### Summary

Successfully implemented **9 new Prisma models** (8 new tables + 1 existing FriendRequest formalized) with full type safety, foreign key constraints, and indexes. Added Prisma 7 ORM to the stack while preserving compatibility with legacy `better-sqlite3` tables (`users`, `submissions`).

**Key achievements:**
- ✅ Contest system with derived status (NO stored status column)
- ✅ Polymorphic messaging (1-on-1 friend chat + contest chat rooms)
- ✅ Rich message types with JSONB metadata (problem recommendations, code snippets, contest invites)
- ✅ Notification system with type-specific payloads
- ✅ Contest scoring with hardcoded point values (100/200/300)
- ✅ All unique constraints, indexes, and foreign keys properly enforced
- ✅ Full TypeScript type generation via Prisma Client

### Database Models

| Model | Table | Fields | Notes |
|-------|-------|--------|-------|
| `Contest` | `contests` | `id` (UUID), `title`, `creator_id`, `is_public`, `starts_at`, `duration_minutes`, timestamps | **NO status column** — status derived via `getContestStatus()` |
| `ContestProblem` | `contest_problems` | `id` (UUID), `contest_id`, `problem_id`, `order`, `difficulty` (easy/medium/hard) | Unique: (contest_id, problem_id) |
| `ContestParticipant` | `contest_participants` | `id` (UUID), `contest_id`, `user_id`, `total_score`, `joined_at` | Unique: (contest_id, user_id) |
| `ContestSubmission` | `contest_submissions` | `id` (UUID), `contest_id`, `user_id`, `problem_id`, `is_correct`, `score`, `submitted_at` | Scoring: easy=100, medium=200, hard=300 |
| `Conversation` | `conversations` | `id` (UUID), `type` (direct/contest), `contest_id?`, timestamps | Supports 1-on-1 chat + contest chat rooms |
| `ConversationParticipant` | `conversation_participants` | `id` (UUID), `conversation_id`, `user_id`, `last_seen_message_id?`, `joined_at` | Unique: (conversation_id, user_id) |
| `Message` | `messages` | `id` (UUID), `conversation_id`, `sender_id`, `type`, `content`, `metadata?` (JSONB), `created_at` | Index: (conversation_id, created_at). Types: text, problem_recommendation, code_snippet, contest_invite |
| `Notification` | `notifications` | `id` (UUID), `user_id`, `type`, `data` (JSONB), `is_read`, `created_at` | Types: friend_request, friend_online, contest_invite, contest_starting |
| `FriendRequest` | `friend_requests` | `id` (UUID), `sender_id`, `receiver_id`, `status` (pending/accepted/rejected), timestamps | Status defaults to pending |

### Helper Functions

**`src/lib/contest-status.ts`** — Contest status derivation (import from `@/lib/contest-status`)

```typescript
// Status derivation (NEVER stored in DB)
getContestStatus(startsAt, durationMinutes, now?)  // → 'upcoming' | 'active' | 'completed'
getContestEndTime(startsAt, durationMinutes)       // → Date
getContestRemainingMs(startsAt, durationMinutes)   // → number (milliseconds)

// Scoring helpers
calculateContestScore(difficulty, isCorrect)       // → 0 | 100 | 200 | 300
CONTEST_SCORES = { easy: 100, medium: 200, hard: 300 }
```

**`src/lib/prisma.ts`** — Prisma client singleton (import from `@/lib/prisma`)

```typescript
import { prisma } from "@/lib/prisma";

// Example usage
const contest = await prisma.contest.findUnique({ where: { id } });
const status = getContestStatus(contest.starts_at, contest.duration_minutes);
```

### Files Created/Modified

**Database:**
- `prisma/schema.prisma` — Complete Prisma 7 schema (9 models + 2 legacy table mappings)
- `prisma.config.ts` — Prisma 7 config pointing to `data/algoarena.db`
- `prisma/migrations/0_baseline/migration.sql` — Baseline for existing `users`/`submissions` tables
- `prisma/migrations/20260224082134_init_all_models/migration.sql` — Creates all 8 new tables with constraints

**Utilities:**
- `src/lib/contest-status.ts` — Contest status derivation and scoring helpers (61 lines)
- `src/lib/prisma.ts` — Prisma client singleton with Next.js hot-reload safety (13 lines)

### Validation Checklist

- ✅ All migrations run successfully
- ✅ All foreign key constraints properly defined and enforced
- ✅ All unique constraints properly defined (conversation participants, contest participants, contest problems)
- ✅ Contest status derivation helper functions tested (past, present, future timestamps)
- ✅ Conversation model supports both 'direct' and 'contest' types via enum
- ✅ Message model index on (conversation_id, created_at) for efficient pagination
- ✅ JSONB metadata/data fields support rich payloads for special message types and notifications
- ✅ Prisma Client type generation successful
- ✅ No breaking changes to existing `users`/`submissions` tables

### Critical Rules (Database)

1. **Contest status is NEVER stored.** Always compute at runtime via `getContestStatus(contest.starts_at, contest.duration_minutes)`.
2. **Contest scoring is hardcoded.** Easy=100, Medium=200, Hard=300. No time bonuses. No penalties.
3. **Message metadata is JSONB.** Store type-specific payloads (problem recommendations, code snippets, contest invites).
4. **Conversation model is polymorphic.** `type='direct'` for 1-on-1 friend chat, `type='contest'` for contest chat rooms.
5. **Use Prisma for new features.** Legacy `better-sqlite3` code remains for backward compatibility only.
6. **Never manually edit migrations.** Always use `npx prisma migrate dev` to generate migrations.

### Integration Notes

**Coexistence with legacy code:**
- `users` and `submissions` tables remain under `better-sqlite3` control (via `src/lib/db.ts`)
- Prisma schema maps these tables with `@@ignore` directive to prevent migration generation
- New code should use Prisma; legacy code can continue using `better-sqlite3`
- Both systems share the same `data/algoarena.db` SQLite file

**Next steps (not yet implemented):**
- ~~API routes for contests (create, join, submit, leaderboard)~~ ✅ **Completed in Phase 3**
- ~~API routes for messaging (send, fetch history, mark read)~~ ✅ **Completed in Phase 4**
- ~~API routes for notifications (fetch, mark read)~~ ✅ **Completed in Phase 5**
- ~~API routes for friends (send request, accept/reject, list friends)~~ ✅ **Completed in Phase 5 & 6**
- ~~API routes for user profile and stats~~ ✅ **Completed in Phase 6**
- ~~Navbar with contests, friends, notifications~~ ✅ **Completed in Phase 8**
- UI components for contest pages, chat interface, notifications panel (full implementation)

---

### Phase 2 Completion Report (2026-02-24)

**Completed by:** socket-builder agent
**Task:** Socket.IO infrastructure for real-time features
**Status:** ✅ All infrastructure implemented and validated

### Summary

Successfully implemented **complete Socket.IO infrastructure** with 3 namespaces, authentication middleware, room management, connection tracking, and typed event patterns. Custom Next.js server integrates Socket.IO with the HTTP server for full-duplex real-time communication.

**Key achievements:**
- ✅ Three namespaces: `/chat`, `/contests`, `/notifications`
- ✅ NextAuth authentication middleware for socket connections
- ✅ DB-validated room join/leave helpers (checks Prisma before allowing)
- ✅ Connection tracking for online presence detection
- ✅ Fully typed client/server events with TypeScript
- ✅ React hooks for easy client-side Socket.IO usage
- ✅ Custom Next.js server (`server.mts`) with graceful shutdown

### Socket.IO Namespaces

| Namespace | Purpose | Room Pattern | Events |
|-----------|---------|--------------|--------|
| `/chat` | Direct messages + contest chat | `conversation:<id>` | `message:new`, `message:read`, `user:typing`, `message:send`, `message:markRead`, `typing:start/stop` |
| `/contests` | Live contest updates | `contest:<id>` | `contest:started/ending/ended`, `submission:new`, `leaderboard:update`, `contest:join/leave` |
| `/notifications` | Real-time notifications | `notifications:<userId>` (auto-join) | `notification:new`, `notification:read`, `friend:online/offline` |

### Core Features

**Authentication (`src/lib/socket/auth.ts`):**
- Validates NextAuth session from socket handshake
- Uses `next-auth/jwt` `getToken()` to read session from cookies
- Attaches `socket.data.userId` and `socket.data.username` to authenticated sockets
- Rejects unauthorized connections with `connect_error`

**Room Management (`src/lib/socket/rooms.ts`):**
- `joinConversation(socket, conversationId, userId)` - DB-validated (checks `ConversationParticipant`)
- `joinContest(socket, contestId, userId)` - DB-validated (checks `ContestParticipant`)
- `joinNotificationRoom(socket, userId)` - Personal room for notifications (auto-joined)
- `broadcastToRoom(namespace, roomId, event, data, excludeSocketId?)` - Targeted broadcasts
- `getUsersInRoom(namespace, roomId)` - Get all socket IDs in a room

**Connection Tracking (`src/lib/socket/connections.ts`):**
- In-memory `Map<userId, Set<socketId>>` for online presence
- `registerConnection(userId, socketId)` - Called on connect
- `unregisterConnection(userId, socketId)` - Returns `true` when user fully offline
- `isUserOnline(userId)`, `getOnlineUserIds()`, `getSocketIdsForUser(userId)`
- `broadcastToUser(namespace, userId, event, ...args)` - Emit to all user's tabs
- `broadcastToUsers(namespace, userIds[], event, ...args)` - Bulk broadcast

**Event Types (`src/lib/socket/events.ts`):**
- TypeScript interfaces for all event payloads
- Separate event maps per namespace (ChatEvents, ContestEvents, NotificationEvents)
- Full type safety on both client and server

**Client Hook (`src/hooks/useSocket.ts`):**
```typescript
const { socket, isConnected } = useChatSocket();
const { socket, isConnected } = useContestSocket();
const { socket, isConnected } = useNotificationSocket();
useSocketEvent(socket, "message:new", (payload) => { ... });
```

### Files Created

**Server Infrastructure:**
- `server.mts` (73 lines) - Custom Next.js server with Socket.IO
- `src/lib/socket/server.ts` (436 lines) - Socket.IO server with 3 namespaces
- `src/lib/socket/auth.ts` (126 lines) - NextAuth authentication middleware
- `src/lib/socket/events.ts` (250 lines) - TypeScript event definitions
- `src/lib/socket/rooms.ts` (267 lines) - DB-validated room helpers
- `src/lib/socket/connections.ts` (144 lines) - Online presence tracking
- `src/lib/socket/index.ts` (91 lines) - Barrel exports

**Client & API:**
- `src/hooks/useSocket.ts` (240 lines) - React hook with 3 namespace aliases
- `src/app/api/socket/route.ts` (74 lines) - Health check endpoint

### Usage Examples

**Client - Subscribe to notifications:**
```typescript
const { socket, isConnected } = useNotificationSocket();
useSocketEvent(socket, "notification:new", (payload) => {
  showNotification(payload.notification);
});
```

**Client - Send chat message:**
```typescript
const { socket } = useChatSocket();
socket?.emit("message:send", {
  conversationId: "abc-123",
  type: "text",
  content: "Hello!"
}, (result) => {
  if (!result.ok) console.error(result.error);
});
```

**Server - Push leaderboard update from API route:**
```typescript
import { getContestsNamespace } from "@/lib/socket";
import { roomNames, broadcastToRoom } from "@/lib/socket";

const nsp = getContestsNamespace();
broadcastToRoom(nsp, roomNames.contest(contestId), "leaderboard:update", {
  contestId,
  leaderboard: updatedLeaderboard
});
```

### Validation Checklist

- ✅ Socket.IO server attaches to custom Next.js HTTP server
- ✅ All 3 namespaces created with proper event handlers
- ✅ Authentication middleware validates NextAuth sessions
- ✅ Room join functions validate permissions against Prisma DB
- ✅ Connection tracking maintains accurate online user state
- ✅ TypeScript types enforce event payload structure
- ✅ Client hook handles reconnection and cleanup
- ✅ Graceful shutdown on SIGTERM/SIGINT
- ✅ All socket operations logged for debugging

### Critical Rules (Socket.IO)

1. **Always validate room joins.** Use `joinConversation()`/`joinContest()` helpers that check DB permissions.
2. **Never trust client data.** All socket events must validate payloads server-side.
3. **Use typed events.** Import event interfaces from `@/lib/socket/events` for type safety.
4. **Broadcast from API routes.** After DB mutations, push real-time updates via namespace accessors (`getChatNamespace()`, etc).
5. **Track connections properly.** Always call `registerConnection()` on connect and `unregisterConnection()` on disconnect.
6. **Use room names consistently.** Import `roomNames` object from `@/lib/socket/rooms` (single source of truth).
7. **Authentication is mandatory.** All socket connections require valid NextAuth session (enforced by middleware).

### Integration Notes

**Starting the server:**
- Dev: `npm run dev` (runs `tsx server.mts`)
- Production: `npm run start` (runs `NODE_ENV=production tsx server.mts`)
- Socket.IO runs on same port as Next.js (3000)

**API route integration:**
- Import namespace accessors: `getChatNamespace()`, `getContestsNamespace()`, `getNotificationsNamespace()`
- After DB mutations, emit events to relevant rooms
- Use `roomNames` helpers to ensure consistent room naming

**Client integration:**
- Use provided React hooks (`useChatSocket`, `useContestSocket`, `useNotificationSocket`)
- Hooks handle connection, reconnection, cleanup automatically
- Use `useSocketEvent` for stable event subscriptions with auto-cleanup

---

### Phase 3 Completion Report (2026-02-24)

**Completed by:** api-builder agent
**Task:** Contest API backend (creation, joining, details, listings, seed data)
**Status:** ✅ All endpoints implemented and validated

### Summary

Successfully implemented **complete Contest API backend** with random problem selection, contest creation/joining, conditional problem visibility, public/private contest support, and seed data generation. All operations use Prisma transactions for data integrity.

**Key achievements:**
- ✅ Contest creation with random problem selection (no duplicates)
- ✅ Contest joining with public/private validation and invite verification
- ✅ Contest details with conditional problem visibility (hidden until contest starts)
- ✅ Public contests listing (sorted by newest first)
- ✅ My contests listing (sorted by most recent start time)
- ✅ Seed script for generating 4 sample contests
- ✅ Friend validation for contest invites
- ✅ Prisma 7 adapter configuration fixed
- ✅ All operations use transactions for atomicity

### API Endpoints

| Method | Path | Purpose | Auth Required |
|--------|------|---------|---------------|
| `POST` | `/api/contests` | Create contest with random problem selection | ✅ |
| `POST` | `/api/contests/[id]/join` | Join contest (validates public/private + timing) | ✅ |
| `GET` | `/api/contests/[id]` | Get contest details (conditional problem visibility) | ❌ |
| `POST` | `/api/contests/[id]/submit` | Submit solution during active contest | ✅ |
| `GET` | `/api/contests` | List public contests (newest first) | ❌ |
| `GET` | `/api/contests/me` | List my contests (most recent first) | ✅ |

### Contest Creation Flow

**Request body:**
```json
{
  "title": "Weekly Challenge",
  "is_public": false,
  "starts_at": "2026-02-25T10:00:00Z",
  "duration_minutes": 60,
  "problems": [
    { "difficulty": "easy", "topics": ["arrays", "strings"] },
    { "difficulty": "medium", "topics": ["dynamic-programming"] },
    { "difficulty": "hard", "topics": ["graphs"] }
  ],
  "invited_user_ids": ["uuid1", "uuid2"]
}
```

**Validation:**
- 2-5 problem slots required
- Each slot: valid difficulty (easy/medium/hard) + at least one topic
- `starts_at` must be future timestamp
- `duration_minutes` must be positive integer
- `invited_user_ids` must be confirmed friends (bidirectional `FriendRequest` check)

**Random Problem Selection Algorithm:**
1. For each problem slot, filter problem pool by difficulty AND topics (must match difficulty + at least one topic)
2. Randomly select one problem using `crypto.randomInt()` (cryptographically secure)
3. Track selected IDs to prevent duplicates within same contest
4. Store in `ContestProblem` with order and difficulty
5. If no matching problems found, return clear error

**Post-Creation Side Effects (single transaction):**
1. Create `Contest` record
2. Create `ContestProblem` records (with order)
3. Add creator as `ContestParticipant` (total_score: 0)
4. Create contest `Conversation` (type='contest')
5. Add creator as `ConversationParticipant`
6. Send `Notification` to each invited user (type='contest_invite')

**Response:**
```json
{
  "success": true,
  "contest": {
    "id": "uuid",
    "title": "Weekly Challenge",
    "starts_at": "2026-02-25T10:00:00Z",
    "duration_minutes": 60,
    "is_public": false,
    "status": "upcoming",
    "participant_count": 1
  }
}
```
**IMPORTANT:** Response does NOT include selected problems (hidden until contest starts).

### Contest Join Flow

**Validation:**
- Contest must exist
- Contest status must be `upcoming` (uses `getContestStatus()`)
- User must not already be a participant
- **Public contests:** Any authenticated user can join
- **Private contests:** User must have `contest_invite` notification for that contest

**Actions (single transaction):**
1. Add user as `ContestParticipant` (total_score: 0)
2. Add user as `ConversationParticipant` in contest chat

### Contest Details Endpoint

**Conditional Problem Visibility (CRITICAL):**
- **Status = `upcoming`:** Problems key is OMITTED from response (not just null)
- **Status = `active` or `completed`:** Full problem details included (id, title, description, constraints, testCases from `@/data/problems.ts`)

**Response:**
```json
{
  "contest": {
    "id": "uuid",
    "title": "Weekly Challenge",
    "creator": { "id": 1, "username": "alice" },
    "starts_at": "2026-02-25T10:00:00Z",
    "duration_minutes": 60,
    "is_public": false,
    "status": "active",
    "participant_count": 5,
    "participants": ["alice", "bob", "charlie"],
    "is_participant": true,
    "problems": [
      { "order": 1, "difficulty": "easy", "problem": { "id": "two-sum", "title": "Two Sum", ... } },
      { "order": 2, "difficulty": "medium", "problem": { ... } }
    ]
  }
}
```

### Helper Functions

**`src/lib/contest-helpers.ts`** - Contest-specific business logic:

```typescript
// Random problem selection with duplicate prevention
selectRandomProblems(problemSpecs: Array<{ difficulty, topics }>)
  // Returns: Array<{ problemId, difficulty, order }>
  // Throws: Error if no matching problems found

// Create contest chat room
createContestConversation(contestId: string, creatorId: number)
  // Returns: Conversation record

// Send invite notifications
sendContestInvites(contestId, contestName, startsAt, userIds, inviterName)
  // Creates Notification records for each invited user
```

### Files Created/Modified

**API Routes:**
- `src/app/api/contests/route.ts` (305 lines) - GET (public list) + POST (create)
- `src/app/api/contests/me/route.ts` (82 lines) - GET (my contests)
- `src/app/api/contests/[id]/route.ts` (198 lines) - GET (contest details)
- `src/app/api/contests/[id]/join/route.ts` (189 lines) - POST (join contest)
- `src/app/api/contests/[id]/submit/route.ts` (rewritten, Prisma-based) - POST (submit solution)

**Helpers:**
- `src/lib/contest-helpers.ts` (211 lines) - Problem selection, conversation creation, invites

**Infrastructure:**
- `src/lib/prisma.ts` (updated) - Fixed Prisma 7 adapter configuration with `PrismaBetterSqlite3`

**Seed Script:**
- `scripts/seed-contests.ts` (149 lines) - Generates 4 public contests with 3 problems each

### Seed Data

Run with: `npx tsx scripts/seed-contests.ts`

Creates 4 public contests:
- Each has 3 problems: 1 easy, 1 medium, 1 hard
- Problems randomly selected from existing problem pool
- Start times staggered: +1, +2, +3, +4 days from now
- Duration: 60 minutes each
- Uses first user in DB as creator (or creates one if none exist)

### Validation Checklist

- ✅ Contest creation returns success without exposing selected problems
- ✅ Problem selection uses `crypto.randomInt()` for true randomness
- ✅ Duplicate problems within single contest prevented (tracked IDs)
- ✅ Joining contest after it started rejected (status check with `getContestStatus()`)
- ✅ Private contest join without invite rejected (notification verification)
- ✅ Contest detail hides problems when status is `upcoming`
- ✅ Contest detail shows problems when status is `active` or `completed`
- ✅ Public contests listing sorted by `created_at DESC`
- ✅ My contests listing sorted by `starts_at DESC` with user's score
- ✅ Seed script creates 4 public contests with 3 problems each
- ✅ All endpoints return proper HTTP status codes (400, 401, 403, 404, 500)
- ✅ Friend validation for invites uses bidirectional `FriendRequest` check

### Critical Rules (Contest API)

1. **Never expose problems before contest starts.** Use `getContestStatus()` to check status, omit `problems` key when `upcoming`.
2. **Always use transactions.** Contest creation and joining involve multiple tables - wrap in `prisma.$transaction()`.
3. **Random selection must prevent duplicates.** Track selected problem IDs within each contest creation request.
4. **Validate contest timing.** Users can only join `upcoming` contests, can only submit in `active` contests.
5. **Private contest invites.** Must check for `contest_invite` notification in DB before allowing join.
6. **Friend verification for invites.** Must verify bidirectional `FriendRequest.status='accepted'` for all invited users.
7. **Contest status is always derived.** Use `getContestStatus(starts_at, duration_minutes)` - never store status in DB.

### Integration Notes

**Problem pool:**
- Problems stored in `src/data/problems.ts` (array export)
- Each problem has: id, title, description, difficulty, topics, constraints, testCases, starterCode, editorial
- Filter by difficulty and topics for random selection

**Prisma 7 adapter:**
- Must use `PrismaBetterSqlite3({ url: "file:./data/algoarena.db" })` adapter
- Raw `Database` instance no longer supported in Prisma 7

**Next steps (Socket.IO integration):**
- After contest creation, emit `contest_invite` to invited users via `/notifications` namespace
- When contest starts, emit `contest:started` to all participants via `/contests` namespace
- When user joins, emit `leaderboard:update` to contest room
- When user submits, emit `submission:new` and `leaderboard:update` to contest room

---

### Phase 4 Completion Report (2026-02-24)

**Completed by:** api-builder agent
**Task:** Chat backend — conversation listing, direct conversation creation, message send/fetch, mark-as-read, unread count
**Status:** ✅ All endpoints implemented and validated

### Summary

Successfully implemented **complete Chat API backend** with direct conversation management, paginated message history, real-time Socket.IO integration, contest chat access control, and unread tracking.

**Key achievements:**
- ✅ Direct conversation get-or-create with bidirectional friend verification
- ✅ Cursor-based message pagination (before/after cursors)
- ✅ Contest chat timing enforcement (active-only message send)
- ✅ Metadata validation for all special message types
- ✅ Socket.IO broadcast from API routes after DB mutations
- ✅ Unread count at the conversation level (not message level)
- ✅ Conversation list sorted by updated_at with latest message preview

### API Endpoints

| Method | Path | Purpose | Auth Required |
|--------|------|---------|---------------|
| `GET` | `/api/conversations` | List all user's conversations | ✅ |
| `GET` | `/api/conversations/direct?user_id=<n>` | Get or create direct conversation | ✅ |
| `POST` | `/api/conversations/direct` | Get or create direct conversation | ✅ |
| `GET` | `/api/conversations/unread-count` | Count of unread conversations | ✅ |
| `GET` | `/api/conversations/[id]/messages` | Fetch messages (paginated) | ✅ |
| `POST` | `/api/conversations/[id]/messages` | Send a message | ✅ |
| `POST` | `/api/conversations/[id]/read` | Mark conversation as read | ✅ |

### Key Design Decisions

**Direct Conversation Deduplication:**
- Uses `ConversationParticipant.findFirst` with nested relation filter to check if a direct conversation with both users already exists
- Returns existing conversation (HTTP 200) or creates new one (HTTP 201)
- Creation uses `prisma.$transaction` to atomically create `Conversation` + 2 `ConversationParticipant` records

**Cursor-Based Pagination:**
- Cursors are message UUIDs, not offsets
- `before=<id>`: fetches messages older than the cursor (sorts DESC then reverses to chronological)
- `after=<id>`: fetches messages newer than the cursor (sorts ASC)
- Default: most recent 50 messages, ordered oldest-first
- `has_more` flag tells client if another page exists; `cursor.before/after` gives next page pointers

**Contest Chat Access Control:**
- `GET /messages` works for any status (read-only history available)
- `POST /messages` for contest conversations: rejected with 403 if status is `upcoming` or `completed`
- Status derived at request time via `getContestStatus()` — never stored

**Socket.IO Integration (best-effort):**
- After `POST /messages`: broadcasts `message:new` to `conversation:<id>` room
- After `POST /read`: broadcasts `message:read` to `conversation:<id>` room
- Both use `try/catch` around `getChatNamespace()` so routes work even when Socket.IO server is not running (build time, tests)

**Unread Detection:**
- A conversation is "unread" when `last_seen_message_id !== latestMessage.id` (or `last_seen_message_id` is null and a message exists)
- `GET /unread-count` returns the count of *conversations* with unread messages, not total unread message count

### Files Created

- `src/app/api/conversations/route.ts` (119 lines) — GET conversation list
- `src/app/api/conversations/direct/route.ts` (211 lines) — GET/POST direct conversation
- `src/app/api/conversations/unread-count/route.ts` (56 lines) — GET unread count
- `src/app/api/conversations/[id]/messages/route.ts` (291 lines) — GET/POST messages
- `src/app/api/conversations/[id]/read/route.ts` (103 lines) — POST mark as read

### Validation Checklist

- ✅ Direct conversation created only once between two friends (idempotent)
- ✅ Non-friends cannot create direct conversations (403)
- ✅ Self-conversation rejected (400)
- ✅ Messages in contest chats rejected when status is upcoming (403) or completed (403)
- ✅ Cursor pagination: `before` retrieves older pages, `after` retrieves newer pages
- ✅ Messages always returned in chronological order (oldest first)
- ✅ `has_more` correctly signals additional pages
- ✅ Socket.IO `message:new` broadcast fired after successful DB write
- ✅ Socket.IO `message:read` broadcast fired after marking conversation read
- ✅ `last_seen_message_id` updated to latest message on POST /read
- ✅ Unread count = conversations with unread, not total messages
- ✅ Conversation list includes latest message preview and is_unread flag
- ✅ Metadata validation: problem_recommendation requires problem_id/problem_name/difficulty; code_snippet requires code/language; contest_invite requires contest_id/contest_name/start_time
- ✅ All endpoints return proper HTTP status codes (400, 401, 403, 404, 500)
- ✅ TypeScript strict mode — zero type errors in new files

### Critical Rules (Chat API)

1. **Friend verification is mandatory for direct conversations.** Check bidirectional `FriendRequest.status='accepted'` before creating or accessing direct chats.
2. **Contest chat is timing-gated for sends.** Only `active` contests allow new messages. Use `getContestStatus()` every time.
3. **Pagination is cursor-based, not offset-based.** Use `message.id` as cursor via `created_at` comparison for correct ordering.
4. **Socket.IO calls are best-effort.** Wrap in `try/catch` — `getChatNamespace()` throws if server is not initialized.
5. **Unread count is per-conversation, not per-message.** One conversation with 100 unread messages counts as 1.
6. **metadata is stored as JSON string.** Always `JSON.stringify()` on write, `JSON.parse()` on read.
7. **Conversation updated_at must be touched on send.** Use a transaction to update both `Message` and `Conversation.updated_at` atomically.

---

---

### Phase 5 Completion Report (2026-02-24)

**Completed by:** socket-builder agent
**Task:** Notification system — persistent storage + real-time delivery
**Status:** ✅ All endpoints and Socket.IO integrations implemented

### Summary

Implemented the complete notification backend: 4 REST API endpoints for notification CRUD, 4 friends API endpoints for request lifecycle, a centralised `notification-helpers.ts` for Socket.IO emission, and full integration with the existing chat and contest systems.

**Key achievements:**
- ✅ GET /api/notifications — cursor-based pagination (newest first)
- ✅ GET /api/notifications/unread-count — unread notification count
- ✅ POST /api/notifications/read-all — bulk mark-read with updateMany
- ✅ POST /api/notifications/[id]/read — single mark-read with ownership check
- ✅ GET /api/friends — list accepted friends (bidirectional)
- ✅ POST /api/friends — send friend request + notification + socket emit
- ✅ POST /api/friends/[id]/accept — accept request + notification + socket emit
- ✅ POST /api/friends/[id]/reject — reject request, no notification
- ✅ `notification-helpers.ts` — centralised emission helpers used by all API routes
- ✅ friend:online / friend:offline events via `/notifications` namespace on connect/disconnect
- ✅ unread_update event emitted after message send and conversation mark-read
- ✅ contest_invite socket event emitted after contest creation with invites
- ✅ UnreadUpdatePayload added to events.ts
- ✅ friend_request_accepted added to Prisma schema NotificationType enum

### API Endpoints

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/api/notifications` | List notifications (cursor paginated) | ✅ |
| `GET` | `/api/notifications/unread-count` | Count unread notifications | ✅ |
| `POST` | `/api/notifications/read-all` | Mark all read | ✅ |
| `POST` | `/api/notifications/[id]/read` | Mark single notification read | ✅ |
| `GET` | `/api/friends` | List accepted friends | ✅ |
| `POST` | `/api/friends` | Send friend request | ✅ |
| `POST` | `/api/friends/[id]/accept` | Accept friend request | ✅ |
| `POST` | `/api/friends/[id]/reject` | Reject friend request | ✅ |

### Socket.IO Events (all on `/notifications` namespace)

| Event | Direction | Trigger |
|-------|-----------|---------|
| `notification:new` | Server → Client | Friend request sent, friend request accepted, contest invite |
| `friend:online` | Server → Client | User connects to /notifications namespace |
| `friend:offline` | Server → Client | Last socket of user disconnects |
| `unread_update` | Server → Client | New message sent to conversation, conversation marked read |

### Files Created

- `src/lib/socket/notification-helpers.ts` — Centralised notification emission helpers
- `src/app/api/notifications/route.ts` — GET (list, cursor-paginated)
- `src/app/api/notifications/unread-count/route.ts` — GET unread count
- `src/app/api/notifications/read-all/route.ts` — POST mark all read
- `src/app/api/notifications/[id]/read/route.ts` — POST mark single read
- `src/app/api/friends/route.ts` — GET friends list + POST send request
- `src/app/api/friends/[id]/accept/route.ts` — POST accept request
- `src/app/api/friends/[id]/reject/route.ts` — POST reject request

### Files Modified

- `src/lib/socket/server.ts` — Notifications namespace uses helpers for friend presence
- `src/lib/socket/events.ts` — Added UnreadUpdatePayload, friend_request_accepted to NotificationPayload
- `src/lib/socket/index.ts` — Barrel exports for notification-helpers
- `src/lib/contest-helpers.ts` — sendContestInvites now returns created notification records
- `src/app/api/contests/route.ts` — Emits contest invite notifications via socket after creation
- `src/app/api/conversations/[id]/messages/route.ts` — Emits unread_update after send
- `src/app/api/conversations/[id]/read/route.ts` — Emits unread_update after mark-read
- `prisma/schema.prisma` — Added friend_request_accepted to NotificationType enum

### Critical Rules (Notifications)

1. **All socket emissions are best-effort.** Every emit call is wrapped in try/catch so API routes work without Socket.IO.
2. **friend:online and friend:offline are ephemeral.** No persistent Notification record is created for presence events.
3. **friend:offline only emitted when last socket disconnects.** Uses `unregisterConnection()` return value.
4. **friend_request_accepted requires type cast.** Prisma generated enum does not include this value — use `as unknown as NotificationType`.
5. **sendContestInvites returns notification records.** Callers must pass these to `emitContestInviteNotifications()` for real-time delivery.
6. **Notification ownership is always verified.** Before marking read or returning, check `notification.user_id === userId`.
7. **Cursor pagination uses created_at.** Cursor ID is resolved to created_at for `lt` filter; sort is always `desc`.

---

### Phase 6 Completion Report (2026-02-24)

**Completed by:** api-builder agent
**Task:** Friends & Profile APIs — enhanced friends list, user search, profile stats, activity tracking
**Status:** ✅ All endpoints implemented and validated

### Summary

Implemented enhanced friends and profile endpoints with rich activity data, user search, 365-day activity heatmaps, and last-problem tracking. Auto-migrated legacy `users` table to add activity fields on first server start.

**Key achievements:**
- ✅ Enhanced GET /api/friends with online status, last problem activity, unread indicators
- ✅ GET /api/users/search with friend status and request state
- ✅ GET /api/users/[id] with 365-day heatmap, solve stats, friendship status
- ✅ POST /api/users/activity/problem to track currently-viewing problem
- ✅ Idempotent schema migration for `last_opened_problem_id` and `last_active` fields
- ✅ Integration with Socket.IO connection tracking for online presence
- ✅ Public profile access (no authentication required)

### API Endpoints

| Method | Path | Purpose | Auth Required |
|--------|------|---------|---------------|
| `GET` | `/api/friends` | Enhanced friends list (online, activity, unread) | ✅ |
| `GET` | `/api/users/search?q=<query>` | Search users by username | ✅ |
| `GET` | `/api/users/[id]` | Profile with stats & heatmap | ❌ (public) |
| `POST` | `/api/users/activity/problem` | Track problem view | ✅ |

### Enhanced Friends List

**Response enrichment:**
```json
{
  "friends": [
    {
      "id": 2,
      "username": "bob",
      "avatar_url": "https://...",
      "is_online": true,
      "last_active": "2026-02-24T10:30:00Z",
      "last_problem_activity": {
        "problem_id": "two-sum",
        "problem_name": "Two Sum",
        "status": "solved"
      },
      "has_unread": false
    }
  ]
}
```

**Data sources:**
- `is_online`: Socket.IO in-memory connection tracking (`isUserOnline()`)
- `last_active`: User table field (auto-migrated)
- `last_problem_activity`:
  - Problem ID from `last_opened_problem_id` field
  - Status determined by checking submissions (`"solved"` if Accepted submission exists)
- `has_unread`: Compares `last_seen_message_id` with latest message in direct conversation

**Sorting:** By `last_active DESC` (most recently active first)

### User Search

**Features:**
- Partial, case-insensitive username matching
- Returns friend status (`is_friend` boolean)
- Returns friend request status (`none`, `pending_sent`, `pending_received`)
- Limited to 20 results for performance
- Excludes requester from results

### Profile Endpoint

**Stats computed:**
- `total_problems_solved`: Distinct problems with Accepted submissions
- `problems_solved_24h/7d/30d`: Time-filtered solve counts
- `accuracy`: Ratio of accepted to total submissions (4 decimal places)

**Activity heatmap:**
- 366 days of data (`date: "YYYY-MM-DD"`, `count: N`)
- Counts accepted submissions per calendar day
- Returned in chronological order (oldest to newest)

**Friendship status:**
- `"self"`: Viewing own profile
- `"friends"`: Bidirectional accepted friend request
- `"pending_sent"`: Requester sent pending request
- `"pending_received"`: Requester received pending request
- `"none"`: No relationship

**Access:** Fully public (works without authentication)

### Database Schema Migration

**Auto-migration on server start:**
- Checks `users` table for `last_opened_problem_id` and `last_active` columns
- If missing, runs idempotent `ALTER TABLE ADD COLUMN` statements
- Uses `PRAGMA table_info` for detection (SQLite-safe)
- Migration logic in `getDb()` function in `src/lib/db.ts`

**New fields:**
- `last_opened_problem_id TEXT` - Currently viewing problem
- `last_active TEXT` - Last activity timestamp (ISO 8601)

### Files Created/Modified

**New API Routes:**
- `src/app/api/users/search/route.ts` (120 lines) - User search
- `src/app/api/users/[id]/route.ts` (215 lines) - Profile with stats
- `src/app/api/users/activity/problem/route.ts` (65 lines) - Track problem view

**Enhanced Routes:**
- `src/app/api/friends/route.ts` (enhanced GET with rich data, 180 lines)

**Infrastructure:**
- `src/lib/db.ts` (enhanced) - Added migration logic, new DB functions, deprecated stubs

### Key Implementation Decisions

**1. Schema migration without Prisma:**
- `users` table managed by legacy `better-sqlite3`
- Auto-migration on first `getDb()` call
- Uses `PRAGMA table_info` for idempotent column addition
- Avoids conflicts with Prisma `@@ignore` directives

**2. Online presence from Socket.IO:**
- Uses in-memory `isUserOnline()` function
- No `is_online` column stored in database
- Consistent with Phase 2 connection tracking

**3. Submission status as string:**
- Legacy table stores `status = "Accepted"` (text)
- Not numeric `status_id = 3`
- All queries use string comparison

**4. Heatmap counts submissions, not distinct problems:**
- Each accepted submission increments day counter
- A user solving same problem twice counts twice
- Raw submission volume per day

**5. Deprecated stubs for legacy routes:**
- Added `@deprecated` stubs for 7 Phase-5 functions
- Functions were imported but never implemented
- Stubs log warnings pointing to Prisma alternatives

### Validation Checklist

- ✅ Enhanced friends list shows online status (Socket.IO tracking)
- ✅ Enhanced friends list shows last problem activity (ID + solved/solving status)
- ✅ Enhanced friends list shows unread indicators
- ✅ Enhanced friends list sorted by last_active DESC
- ✅ User search returns accurate friend/request status
- ✅ User search limited to 20 results
- ✅ User search excludes requester
- ✅ Profile returns 365-day activity heatmap
- ✅ Profile returns solve stats (24h, 7d, 30d)
- ✅ Profile returns correct friendship status
- ✅ Profile accessible without authentication
- ✅ Problem activity tracking updates last_opened_problem_id
- ✅ Database migration runs idempotently on server start
- ✅ TypeScript strict mode with zero errors

### Critical Rules (Friends & Profile)

1. **Schema migration is automatic.** The `getDb()` function checks for and adds columns on first call. No manual migration needed.
2. **Online status uses Socket.IO tracking.** Call `isUserOnline(userId)` from `@/lib/socket/connections` - don't query database.
3. **Profile endpoint is public.** No authentication required, but friendship status only shown when authenticated.
4. **Heatmap generation is expensive.** Consider caching results (currently computed on every request).
5. **Last problem activity requires both fields.** If `last_opened_problem_id` exists, look up problem and check submission status.
6. **Friend status requires bidirectional check.** Query both `sender_id/receiver_id` directions with OR filter.
7. **Search results are limited.** Hard cap at 20 results to prevent performance degradation.

---

### Phase 7 Completion Report (2026-02-24)

**Completed by:** api-builder + socket-builder agents
**Task:** Contest submissions, scoring, and real-time leaderboard
**Status:** ✅ All endpoints and Socket.IO integration complete

### Summary

Successfully implemented **complete contest submission system** with Judge0 integration, scoring logic, real-time leaderboard updates, and Socket.IO broadcasts. Enhanced existing submit endpoint to run code through Judge0 server-side, compute scores based on difficulty, track best scores per problem, and broadcast updates to all contest participants.

**Key achievements:**
- ✅ Enhanced POST /api/contests/[id]/submit with Judge0 integration
- ✅ Server-side code execution and correctness validation
- ✅ Best-score-per-problem logic (multiple submissions allowed)
- ✅ Atomic score recalculation with Prisma transactions
- ✅ GET /api/contests/[id]/leaderboard with full rankings
- ✅ GET /api/contests/[id]/timing for countdown timers
- ✅ Real-time Socket.IO broadcasts (leaderboard:update, submission:new)
- ✅ `buildContestLeaderboard()` helper function
- ✅ Updated Socket.IO event types for enriched leaderboard

### API Endpoints

| Method | Path | Purpose | Auth Required |
|--------|------|---------|---------------|
| `POST` | `/api/contests/[id]/submit` | Submit solution (runs Judge0) | ✅ |
| `GET` | `/api/contests/[id]/leaderboard` | Get leaderboard with rankings | ❌ (public) |
| `GET` | `/api/contests/[id]/timing` | Server time & contest timing | ❌ (public) |

### Contest Submission Flow

**Request body:**
```json
{
  "problem_id": "two-sum",
  "code": "#include <iostream>\n..."
}
```

**Validation:**
- User must be a `ContestParticipant`
- Contest status must be `active` (not `upcoming` or `completed`)
- Problem must be a `ContestProblem` in this contest
- Code must be non-empty

**Execution flow:**
1. Look up problem from `@/data/problems` to get test cases
2. For each test case:
   - Submit to Judge0 with language_id: 54 (C++ GCC 9.2.0)
   - Base64 encode: source_code, stdin, expected_output
   - Use problem's `judge0Limits` for CPU/memory/stack limits
   - Poll for result (Judge0 is async)
   - Stop on first failure
3. Determine `is_correct` (all test cases pass, all outputs match)
4. Look up `ContestProblem` to get difficulty
5. Calculate score: `calculateContestScore(difficulty, isCorrect)` → 0 | 100 | 200 | 300
6. **Atomic transaction:**
   - Create `ContestSubmission` record
   - Compute best score per problem using `groupBy`
   - Update `ContestParticipant.total_score`
7. Build full leaderboard to find user's rank
8. Broadcast Socket.IO events (best-effort, try/catch)

**Response:**
```json
{
  "submission": {
    "id": "uuid",
    "contest_id": "uuid",
    "problem_id": "two-sum",
    "is_correct": true,
    "score": 100,
    "status": "Accepted",
    "submitted_at": "2026-02-24T15:30:00Z"
  },
  "total_score": 450,
  "leaderboard_rank": 2
}
```

### Scoring Logic

**Flat points by difficulty (no time bonuses):**
- Easy: 100 points
- Medium: 200 points
- Hard: 300 points
- Incorrect: 0 points

**Best score per problem:**
- Users can submit multiple times for the same problem
- Only their BEST score per problem counts toward `total_score`
- `total_score` = sum of best scores across all problems

**Recalculation (atomic):**
```typescript
const bestScores = await tx.contestSubmission.groupBy({
  by: ['problem_id'],
  where: { contest_id: contestId, user_id: userId },
  _max: { score: true }
});

const totalScore = bestScores.reduce((sum, entry) => sum + (entry._max.score || 0), 0);

await tx.contestParticipant.update({
  where: { contest_id_user_id: { contest_id: contestId, user_id: userId } },
  data: { total_score: totalScore }
});
```

### Leaderboard Endpoint

**GET /api/contests/[id]/leaderboard** - Public access (no authentication)

**Response:**
```json
{
  "contest_id": "uuid",
  "status": "active",
  "leaderboard": [
    {
      "user_id": 1,
      "username": "alice",
      "avatar_url": "https://...",
      "total_score": 450,
      "problems_solved": 2,
      "last_correct_at": "2026-02-24T15:25:00Z",
      "per_problem": [
        { "problem_id": "two-sum", "best_score": 100, "attempts": 2 },
        { "problem_id": "binary-search", "best_score": 200, "attempts": 1 }
      ]
    }
  ]
}
```

**Sorting:**
- Primary: `total_score` DESC (highest first)
- Tiebreaker: `last_correct_at` ASC (earlier correct submission wins)

**Per-problem stats:**
- `best_score`: MAX(score) from all user's submissions for that problem
- `attempts`: COUNT of all user's submissions for that problem

**`problems_solved`:** Count of problems where `best_score > 0`

**`last_correct_at`:** Timestamp of user's most recent correct submission in this contest

### Timing Endpoint

**GET /api/contests/[id]/timing** - Public access (no authentication)

**Response:**
```json
{
  "server_time": "2026-02-24T15:30:00Z",
  "starts_at": "2026-02-24T15:00:00Z",
  "ends_at": "2026-02-24T16:00:00Z",
  "duration_minutes": 60,
  "status": "active",
  "remaining_ms": 1800000
}
```

**Purpose:** Frontend uses these values to render countdown timers. All timing calculations done server-side for accuracy.

### Socket.IO Integration

**Events emitted after submission:**

**`leaderboard:update` (to all contest participants):**
```json
{
  "contestId": "uuid",
  "leaderboard": [...]  // Full leaderboard array (same structure as GET endpoint)
}
```

**`submission:new` (to all contest participants):**
```json
{
  "contestId": "uuid",
  "submission": {
    "userId": 1,
    "username": "alice",
    "problemId": "two-sum",
    "isCorrect": true,
    "score": 100,
    "submittedAt": "2026-02-24T15:30:00Z"
  }
}
```

**Room pattern:** `contest:<contestId>` (via `roomNames.contest(contestId)`)

**Best-effort broadcast:**
```typescript
try {
  const contestsNsp = getContestsNamespace();
  broadcastToRoom(contestsNsp, roomNames.contest(contestId), "leaderboard:update", {
    contestId, leaderboard
  });
} catch (err) {
  console.warn("[submit] Socket.IO broadcast failed:", err);
}
```

### Helper Functions

**`src/lib/contest-helpers.ts` - Enhanced with:**

```typescript
export async function buildContestLeaderboard(contestId: string): Promise<LeaderboardRow[]>
```

**Logic:**
1. Fetch all `ContestParticipant` with user info (one query)
2. Fetch all `ContestSubmission` for contest (one query)
3. For each participant:
   - Group submissions by `problem_id`
   - Compute `best_score` and `attempts` per problem
   - Calculate `total_score` and `problems_solved`
   - Find `last_correct_at` (most recent correct submission)
4. Sort by `total_score DESC`, `last_correct_at ASC`
5. Return formatted leaderboard array

**Exports:**
```typescript
export interface LeaderboardRow { ... }
export interface LeaderboardPerProblem { ... }
```

### Files Created/Modified

**API Routes:**
- `src/app/api/contests/[id]/submit/route.ts` (full rewrite, 250+ lines) - Judge0 integration, scoring, Socket.IO
- `src/app/api/contests/[id]/leaderboard/route.ts` (75 lines) - Leaderboard endpoint
- `src/app/api/contests/[id]/timing/route.ts` (55 lines) - Timing endpoint

**Helpers:**
- `src/lib/contest-helpers.ts` (enhanced) - Added `buildContestLeaderboard()` and types

**Socket.IO:**
- `src/lib/socket/events.ts` (updated) - Enhanced `LeaderboardEntry` and `SubmissionNewPayload` types

### Key Implementation Decisions

**1. Judge0 integration outside transaction:**
- Code execution can take seconds (polling)
- Transaction only runs after Judge0 returns
- Prevents DB lock contention

**2. Best-score logic uses `groupBy` inside transaction:**
- Atomically reads freshly created submission
- No race conditions from separate query
- Score recalculation always consistent

**3. Socket.IO imports are dynamic:**
- `await import("@/lib/socket")` inside try/catch
- Routes work at build time and in tests
- Graceful degradation when Socket.IO unavailable

**4. Tiebreaker uses earliest correct submission:**
- Standard competitive programming convention
- Rewards solving problems faster
- `last_correct_at` across ANY problem (not just last solved)

**5. Leaderboard rank in submit response:**
- `findIndex + 1` on sorted array
- Always consistent with GET /leaderboard
- No separate rank calculation

### Validation Checklist

- ✅ Submission rejected if contest not active
- ✅ Submission rejected if user not participant
- ✅ Submission rejected if problem not in contest
- ✅ Scoring: 100/200/300 by difficulty, 0 if incorrect
- ✅ Multiple submissions: only best score per problem counts
- ✅ total_score = sum of best per-problem scores
- ✅ Leaderboard sorted by score DESC, then time ASC
- ✅ GET leaderboard works for active and completed contests
- ✅ Timing endpoint returns server time and contest timing
- ✅ Socket.IO leaderboard:update fires after score change
- ✅ Socket.IO submission:new fires after each submission
- ✅ All proper HTTP status codes (400, 401, 403, 404, 500)
- ✅ TypeScript strict mode with zero errors

### Critical Rules (Contest Submissions)

1. **Server-side validation only.** Never trust client for `is_correct` - always run through Judge0.
2. **Best score per problem.** Users can submit multiple times. Only best score counts toward total.
3. **Atomic score recalculation.** Use `groupBy` inside transaction to prevent race conditions.
4. **Socket.IO is best-effort.** Wrap all broadcasts in try/catch - routes must work without Socket.IO.
5. **Contest timing is server-side.** Use `getContestStatus()` for all timing decisions.
6. **Leaderboard tiebreaker.** Sort by score DESC, then earliest correct submission ASC.
7. **Judge0 uses base64 encoding.** All payloads (source_code, stdin, expected_output) must be base64 encoded.

### Integration Notes

**Judge0 submission pattern:**
```typescript
import { submitCode } from "@/lib/judge0";

const result = await submitCode({
  languageId: 54,  // C++ GCC 9.2.0
  sourceCode: code,
  stdin: testCase.input,
  expectedOutput: testCase.output,
  ...problem.judge0Limits
});

const isCorrect = result.status.id === 3 && result.stdout === expectedOutput;
```

**Contest status check pattern:**
```typescript
import { getContestStatus } from "@/lib/contest-status";

const contest = await prisma.contest.findUnique({ where: { id } });
const status = getContestStatus(contest.starts_at, contest.duration_minutes);

if (status !== 'active') {
  return NextResponse.json(
    { error: "Contest is not active" },
    { status: 403 }
  );
}
```

---

### Phase 8 Completion Report (2026-02-24)

**Completed by:** general-purpose agent
**Task:** Navbar UI updates with contests, friends, and notifications
**Status:** ✅ Complete

### Summary

Successfully updated the main navigation bar with new UI elements for contests, friends, and notifications. Added 4 navigation tabs on the left side and 2 icon-based links with badges on the right side for quick access to social features.

**Key achievements:**
- ✅ Added 4 navigation tabs (Home, Problems, Profile, Contests)
- ✅ Added Friends icon with unread badge (red dot)
- ✅ Added Notifications bell with count badge
- ✅ Consistent styling with existing navbar
- ✅ Responsive hover states
- ✅ Proper accessibility labels
- ✅ Static placeholder badges (will be dynamic in future phase)

### UI Elements Added

**Navigation Tabs (Left Side):**
1. **Home** - Home icon, links to `/`
2. **Problems** - Code icon, links to `/problems`
3. **Profile** - User icon, links to `/profile`
4. **Contests** - Trophy icon, links to `/contests` (NEW)

**Icon Links (Right Side):**
5. **Friends** - Users icon with red dot badge, links to `/friends` (NEW)
6. **Notifications** - Bell icon with count badge, links to `/notifications` (NEW)

### Visual Layout

**When authenticated:**
```
[Logo] [Home] [Problems] [Profile] [Contests] | [Friends●] [Bell³] [Avatar ▼] [Sign Out]
```

**When not authenticated:**
```
[Logo]                                        | [Sign In]
```

### Implementation Details

**File modified:**
- `src/components/layout/Navbar.tsx` (116 lines)

**Icons added (from lucide-react):**
```typescript
import { Home, Code, User, Trophy, Users, Bell } from "lucide-react";
```

**Tab styling:**
- Gray text (`text-zinc-300`) with white hover (`hover:text-zinc-100`)
- Gray background on hover (`hover:bg-zinc-800`)
- Smooth transitions
- Icon + text layout with proper spacing

**Badge styling:**

Friends badge (red dot):
```tsx
<span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
```

Notifications badge (count):
```tsx
<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500
               text-white text-xs rounded-full flex items-center justify-center px-1">
  3
</span>
```

**Accessibility:**
- `aria-label="Friends and messages"` on Friends icon
- `aria-label="Notifications"` on Notifications bell
- Semantic HTML with proper link elements

### Features

**Conditional rendering:**
- All new navigation elements only show when user is authenticated
- When logged out, only logo and "Sign In" button visible

**Static placeholders:**
- Friends badge: Red dot (always visible)
- Notifications badge: Number "3" (static)
- Will be connected to real-time data in future phase

**Responsive design:**
- Proper spacing on all screen sizes
- Icons scale appropriately
- Touch-friendly tap targets

### Next Steps (Future Phase)

**Connect badges to real-time data:**
- Friends badge → Show when user has unread direct messages (from Socket.IO)
- Notifications badge → Show actual unread notification count (from `/api/notifications/unread-count`)
- Use React hooks to subscribe to Socket.IO events
- Update badge counts in real-time as notifications arrive

**Example future integration:**
```typescript
const { socket } = useNotificationSocket();
const [unreadCount, setUnreadCount] = useState(0);

useSocketEvent(socket, "notification:new", () => {
  setUnreadCount(prev => prev + 1);
});

useEffect(() => {
  fetch("/api/notifications/unread-count")
    .then(res => res.json())
    .then(data => setUnreadCount(data.unread_count));
}, []);
```

### Validation Checklist

- ✅ Navbar renders with all 4 tabs when authenticated
- ✅ Contests tab links to `/contests`
- ✅ Friends icon links to `/friends`
- ✅ Notifications bell links to `/notifications`
- ✅ Badges are visible (red dot and count)
- ✅ Hover states work on all elements
- ✅ Icons render correctly (Lucide React)
- ✅ Responsive design maintained
- ✅ No TypeScript errors from navbar changes
- ✅ Accessibility labels present

### Critical Rules (UI Components)

1. **Authentication-gated.** Navigation tabs and icon links only show when `session` exists.
2. **Static badges for now.** Badges are placeholder values, not connected to API yet.
3. **Consistent styling.** All new elements match existing navbar design system.
4. **Accessibility first.** All interactive elements have proper labels.
5. **Next.js Link component.** Use `<Link>` from `next/link` for client-side navigation.

---

## Testing Checklist

**Build & Type Safety:**
- [ ] `npm run build` succeeds
- [ ] `npm run typecheck` passes

**Core Features (Legacy):**
- [ ] Judge0: submit known C++ code → status 3 (Accepted)
- [ ] Auth: Google sign-in works, unauthenticated users blocked from submit/chat
- [ ] Chatbot: responds with guidance, never gives full solution
- [ ] Visualization: viz JSON from chat renders animated tracer inline
- [ ] Home page: problem list renders, filters work, rows link to `/problems/[id]`
- [ ] Problem page: editor loads `starterCode`, Run/Submit execute via Judge0, results display

**Socket.IO (Phase 2):**
- [ ] Custom server starts: `npm run dev` runs without errors
- [ ] Socket connection: Client connects to `/chat`, `/contests`, `/notifications` namespaces
- [ ] Authentication: Unauthenticated socket connections rejected with `connect_error`
- [ ] Room validation: Cannot join conversation/contest room without DB permission
- [ ] Online presence: User online status updates when connecting/disconnecting
- [ ] Chat events: `message:send` → DB save → `message:new` broadcast to room
- [ ] Contest events: Contest start time triggers `contest:started` broadcast
- [ ] Notifications: New notification triggers `notification:new` to user's personal room
- [ ] Reconnection: Client reconnects automatically after disconnect
- [ ] Graceful shutdown: SIGTERM/SIGINT properly closes all connections

**Database (Phase 1):**
- [ ] Prisma migrations apply successfully: `npx prisma migrate dev`
- [ ] Contest status derivation returns correct values for past/present/future dates
- [ ] Foreign key constraints prevent orphaned records
- [ ] Unique constraints prevent duplicate participants/problems

---

### Phase 9 Completion Report (2026-02-24)

**Completed by:** general-purpose agent
**Task:** Complete frontend for contests system
**Status:** ✅ All UI components implemented

### Summary

Successfully built the complete frontend for the contests system with navigation, main contests page, contest creation modal, contest detail page with tabs, countdown timers, leaderboard with real-time updates, discussion chat, and contest problem workspace.

**Key achievements:**
- ✅ Contests tab in main navigation (already existed from Phase 8)
- ✅ Main contests page with My Contests and Public Contests sections
- ✅ Create Contest modal with topic selection, difficulty per problem, friend invites
- ✅ Contest detail page with status-based UI (upcoming/active/completed)
- ✅ Large countdown timer for upcoming contests
- ✅ Persistent countdown timer for active contests
- ✅ Tabs for Problems, Leaderboard, and Discussion
- ✅ Real-time leaderboard updates via Socket.IO
- ✅ Discussion chat with active-only messaging
- ✅ Contest problem workspace with timer and integrated tabs
- ✅ Automatic submission to contest API endpoint
- ✅ All components use TypeScript strict mode with full type safety

### Files Created

**Pages:**
- `src/app/contests/page.tsx` (303 lines) — Main contests page with My Contests and Public Contests
- `src/app/contests/[id]/page.tsx` (351 lines) — Contest detail page with tabs (replaced existing)
- `src/app/contests/[id]/problems/[problemId]/page.tsx` (97 lines) — Contest problem route wrapper

**Components:**
- `src/components/contests/CreateContestModal.tsx` (409 lines) — Contest creation modal with topic/difficulty selection
- `src/components/contests/CountdownTimer.tsx` (124 lines) — Countdown timer components (compact and large)
- `src/components/contests/LeaderboardTab.tsx` (118 lines) — Real-time leaderboard with Socket.IO
- `src/components/contests/DiscussionTab.tsx` (210 lines) — Contest chat with timing enforcement
- `src/components/contests/ContestProblemWorkspace.tsx` (391 lines) — Problem workspace with contest integration

### Features Implemented

**7A. Navigation:**
- ✅ Contests tab with Trophy icon in main navigation bar
- ✅ Links to `/contests`

**7B. Contests Panel:**
- ✅ My Contests section (fetches from `/api/contests/me`)
- ✅ Public Contests section (fetches from `/api/contests`)
- ✅ Contest cards show: title, status badge, participant count, timing
- ✅ Join button for public contests user hasn't joined
- ✅ Cards link to contest detail page
- ✅ Score display for My Contests

**7C. Create Contest Form:**
- ✅ Title input
- ✅ Public/Private visibility toggle
- ✅ Date & time picker (datetime-local)
- ✅ Question count stepper (2-5 questions)
- ✅ Auto-suggested duration based on question count (15 min per question)
- ✅ Manual duration override
- ✅ Global topics multi-select (applies to all problems)
- ✅ Per-problem difficulty selection (Easy/Medium/Hard)
- ✅ Friend invite multi-select (for private contests)
- ✅ Problem randomization notice
- ✅ Full validation with error messages
- ✅ Calls POST /api/contests with correct payload

**7D. Contest Detail Page:**
- ✅ Before start: Large countdown timer, join button, "Problems will be revealed" message
- ✅ During contest: Persistent countdown bar at top, problems list, active tabs
- ✅ After end: "Contest Ended" banner, read-only access
- ✅ Three tabs: Problems, Leaderboard, Discussion
- ✅ Status-based UI changes (upcoming/active/completed badges)
- ✅ Participant count and contest metadata display

**7E. Contest Problem Page:**
- ✅ Wraps existing ProblemWorkspace with contest-specific features
- ✅ Contest header bar with: Back link, contest title, problem title, countdown timer
- ✅ Three tabs in left panel: Description, Leaderboard, Discussion
- ✅ Submit button calls POST /api/contests/[id]/submit (not regular submit)
- ✅ Submit disabled when contest ended
- ✅ Full-height layout matches regular problem workspace
- ✅ Auto-redirect to contest page after correct submission

**7F. Leaderboard Tab:**
- ✅ Connects to `/contests` namespace via useContestSocket()
- ✅ Joins room `contest:{contestId}`
- ✅ Listens for `leaderboard:update` events
- ✅ Initial data from GET /api/contests/[id]/leaderboard
- ✅ Table shows: Rank, Username, Score, Problems Solved
- ✅ Highlights current user's row
- ✅ Rank colors: #1 gold, #2 silver, #3 bronze
- ✅ Real-time updates when submissions occur

**7G. Discussion Tab:**
- ✅ Contest chat room using conversation_id from contest
- ✅ Connects to `/chat` namespace via useChatSocket()
- ✅ Fetches messages from GET /api/conversations/[id]/messages
- ✅ Listens for `message:new` events
- ✅ Input disabled before contest starts (message: "Chat opens when contest begins")
- ✅ Input disabled after contest ends (message: "Contest ended. Chat is read-only.")
- ✅ Active during contest for sending messages
- ✅ Auto-scrolls to latest message
- ✅ Sends via POST /api/conversations/[id]/messages

### Component Design Patterns

**Countdown Timers:**
- `CountdownTimer` — Compact inline timer with hours/minutes/seconds
- `LargeCountdown` — Large display with days/hours/minutes/seconds
- Both auto-update every second
- Visual urgency indicator (red text when < 5 minutes)
- onComplete callback for status transitions

**Real-time Integration:**
- Socket.IO hooks (`useContestSocket`, `useChatSocket`)
- Auto-join rooms on component mount
- Auto-cleanup on unmount
- Best-effort connection handling (works without socket)

**Status-based Rendering:**
- All contest UI uses `getContestStatus()` helper
- Conditional rendering based on upcoming/active/completed
- Timing enforcement at UI level (disabled buttons, hidden features)

### Validation Checklist

- ✅ Contests tab appears in navigation
- ✅ My Contests and Public Contests load and display correctly
- ✅ Create Contest form validates all inputs
- ✅ Countdown timer shows correct time and updates in real-time
- ✅ Problems are hidden before contest starts
- ✅ Leaderboard updates in real-time via WebSocket
- ✅ Discussion chat works only during active contest
- ✅ Contest problem page shows timer and new tabs
- ✅ Submit goes to contest API (not regular problem API)
- ✅ All components use TypeScript strict mode
- ✅ Responsive design with Tailwind CSS
- ✅ Proper error handling and loading states
- ✅ ISO 8601 dates converted to local time for display

### Critical Rules (Contest Frontend)

1. **Status derivation is client-side.** Always use `getContestStatus(starts_at, duration_minutes)` for UI decisions.
2. **Socket.IO is best-effort.** All socket-dependent features have fallback UI when disconnected.
3. **Countdown timers are self-updating.** No manual refresh needed — setInterval updates every second.
4. **Chat timing is enforced at UI level.** Input disabled for upcoming/completed contests.
5. **Problem visibility is conditional.** Problems key may not exist in API response for upcoming contests.
6. **Contest submissions use different API.** Call POST /api/contests/[id]/submit, not /api/judge.
7. **Real-time updates require room joins.** Leaderboard must emit `contest:join` on mount.

### Integration Notes

**Socket.IO Usage:**
```typescript
// Leaderboard
const { socket, isConnected } = useContestSocket();
useSocketEvent(socket, "leaderboard:update", (payload) => { ... });

// Discussion
const { socket, isConnected } = useChatSocket();
useSocketEvent(socket, "message:new", (payload) => { ... });
```

**API Integration:**
- Contest list: GET /api/contests, GET /api/contests/me
- Contest detail: GET /api/contests/[id]
- Join contest: POST /api/contests/[id]/join
- Submit solution: POST /api/contests/[id]/submit
- Leaderboard: GET /api/contests/[id]/leaderboard
- Messages: GET/POST /api/conversations/[id]/messages

**Navigation Flow:**
```
/contests → /contests/[id] → /contests/[id]/problems/[problemId]
```

### Next Steps (Not Implemented)

- Private contest invite verification (currently accepts any authenticated user)
- Real-time contest start/end Socket.IO events (currently polls via refresh)
- Per-problem submission history in contest context
- Contest results export/download
- Admin panel for contest management

---

### Phase 10 Completion Report (2026-02-24)

**Completed by:** general-purpose agent
**Task:** Friends Sidebar & Complete Chat Interface
**Status:** ✅ All components implemented and build passing

### Summary

Built the full friends & chat frontend end-to-end. `npm run build` passes with exit code 0
and all 38 pages generate successfully.

**New Files:**
- `src/components/friends/FriendsContext.tsx` — Global context: sidebar open/close state, active friend/conversation, unread count driven by Socket.IO `unread_update` events
- `src/components/friends/FriendsSidebar.tsx` — Fixed right-side slide-in panel (380px) with Escape/outside-click close, renders list/search/chat views
- `src/components/friends/FriendsListView.tsx` — Friends list with online dots, last-active timestamps, problem activity links, and unread highlighting
- `src/components/friends/FriendsSearchView.tsx` — Debounced user search (`GET /api/users/search`), all results dimmed, click → profile navigate
- `src/components/friends/SidebarChat.tsx` — Compact chat with paginated message history, mark-as-read on open, real-time Socket.IO, expand to `/messages`
- `src/components/friends/MessageRenderer.tsx` — Renders all 4 message types: text bubbles, problem recommendation cards, code blocks, contest invite cards
- `src/components/friends/ConversationList.tsx` — Full-screen conversation list with unread indicators, previews, timestamps, socket-refreshed
- `src/components/friends/FullScreenChat.tsx` — Full-screen chat panel (same functionality as sidebar chat)
- `src/app/messages/page.tsx` — Two-panel messages page: conversation list (left) + active thread (right), supports `?conv=<id>` deep link

**Modified Files:**
- `src/components/layout/Providers.tsx` — Wrapped with `FriendsProvider` + `NotificationsProvider`
- `src/app/layout.tsx` — Added `<FriendsSidebar />` as global overlay
- `src/components/layout/Navbar.tsx` — Friends icon is now a button toggling the sidebar, shows real unread count badge from socket events
- `src/app/api/conversations/route.ts` — Added `avatar_svg` to `other_participant` and `sender_username` to `latest_message`
- `src/components/contests/InviteFriendsDropdown.tsx` — Fixed broken `@/hooks/useFriends` import (never existed)
- `src/components/problems/RecommendModal.tsx` — Fixed same broken import + corrected send endpoint to use `/api/conversations/[id]/messages`
- `src/lib/socket/index.ts` — Removed non-existent `ContestSubmissionPayload` re-export

**Real-Time Sync Flow:**
```
Socket.IO /notifications namespace
  └─ unread_update event → FriendsContext.unreadChatCount → Navbar badge
                        → ConversationList refresh (full-screen page)

Socket.IO /chat namespace
  └─ message:new event → SidebarChat / FullScreenChat appends message
                       → POST /conversations/:id/read → clears badge
```

**Key Design Decisions:**
- Single global `FriendsContext` (no prop drilling) for sidebar state + unread count
- Sidebar is a global overlay (`position: fixed`), mounted in root layout
- Friends icon in Navbar changed from `<Link>` to `<button>` (opens sidebar instead of navigating)
- `MessageRenderer` shared between sidebar and full-screen chat to avoid duplication
- `RecommendModal` send flow: `GET /api/conversations/direct?user_id=X` → `POST /api/conversations/:id/messages`

---
