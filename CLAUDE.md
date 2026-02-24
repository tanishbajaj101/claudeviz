# AlgoArena

LeetCode alternative: problem list → split-pane workspace (editor + Judge0 runner + AI coach) → algorithm visualizations.

## Stack

- Next.js 14+ (App Router), TypeScript strict, Tailwind CSS
- Prisma 7 ORM — SQLite (`data/algoarena.db`) + legacy `better-sqlite3` for `users`/`submissions`
- Socket.IO 4.8 — 3 namespaces: `/chat`, `/contests`, `/notifications`
- `react-simple-code-editor` + Prism.js — C++ only (`language_id: 54`, GCC 9.2.0)
- Judge0 CE API, NextAuth.js (Google OAuth), LangChain (Main + Viz agents)

## Commands

- `npm run dev` / `npm start` — Dev/prod server with Socket.IO, port 3000
- `npm run build` — Production build (run after every change set)
- `npm run lint` / `npm run typecheck` — ESLint / TypeScript strict
- `npx prisma migrate dev` / `npx prisma generate` / `npx prisma studio`

## Architecture

```
server.mts                    # Custom Next.js + Socket.IO server
src/
├── app/
│   ├── page.tsx              # Home: problem list
│   ├── problems/[id]/        # Problem workspace
│   ├── profile/[username]/   # Public profile (username-based routes)
│   ├── contests/             # Contest list + detail + problem workspace
│   ├── messages/             # Two-panel conversation page
│   └── api/
│       ├── auth/[...nextauth]/ chat/ judge/  # Core APIs
│       ├── contests/         # CRUD, join, submit, leaderboard, timing
│       ├── conversations/    # List, direct, messages, read, unread-count
│       ├── notifications/    # List, unread-count, read-all, [id]/read
│       ├── friends/          # List, send, accept, reject, requests
│       ├── users/            # Search, profile, activity tracking
│       └── problems/[id]/status/  # Solved status
├── components/
│   ├── ui/ chat/ editor/ visualization/ problems/ layout/
│   ├── contests/             # CreateContestModal, CountdownTimer, LeaderboardTab, DiscussionTab, ContestProblemWorkspace
│   ├── friends/              # FriendsContext, FriendsSidebar, SidebarChat, FullScreenChat, ConversationList, MessageRenderer
│   ├── notifications/        # NotificationsDropdown, NotificationItem, ToastNotifications, NotificationsProvider
│   └── profile/              # ActivityHeatmap, ProfileClient
├── lib/
│   ├── prisma.ts             # Prisma singleton
│   ├── db.ts                 # Legacy better-sqlite3 (users/submissions)
│   ├── contest-status.ts     # getContestStatus(), calculateContestScore()
│   ├── contest-helpers.ts    # selectRandomProblems(), buildContestLeaderboard()
│   ├── socket/               # server.ts, auth.ts, events.ts, rooms.ts, connections.ts, notification-helpers.ts
│   ├── judge0.ts chatbot.ts visualization-agent.ts auth.ts problems.ts
│   └── tracers/              # Client-side algorithm tracers
├── hooks/useSocket.ts        # useChatSocket(), useContestSocket(), useNotificationSocket()
├── data/problems.ts          # All problem definitions
├── types/index.ts
└── prisma/schema.prisma      # 9 models + 2 legacy mappings
```

## Code Style

- TypeScript strict, no `any` — named exports only — functional components + hooks
- `kebab-case.ts` for utils, `PascalCase.tsx` for components — absolute imports `@/*`
- API routes return typed JSON, never raw strings

## Env Vars (.env.local — NEVER commit)

```
JUDGE0_API_URL, JUDGE0_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
NEXTAUTH_URL=http://localhost:3000, NEXTAUTH_SECRET, OPENAI_API_KEY
```

## Critical Rules

1. Problem data from `src/data/problems.ts` only — never hardcoded in components
2. Judge0 key never reaches client — all via `/api/judge/route.ts`
3. Editorial is internal AI context only — never shown to users
4. All Judge0 payloads use `base64_encoded=true`
5. Chatbot guides/nudges — never gives full solution
6. Contest status is NEVER stored — always `getContestStatus(starts_at, duration_minutes)`
7. Contest scoring: easy=100, medium=200, hard=300 — no time bonuses
8. Socket.IO calls are best-effort — wrap in try/catch
9. Use Prisma for new features; legacy `better-sqlite3` for `users`/`submissions` only

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

Auth: NextAuth session validated on connect. Rooms: DB-validated via `joinConversation()`/`joinContest()`.
Presence: In-memory `Map<userId, Set<socketId>>` — `isUserOnline()`, `broadcastToUser()`.
Client: `useChatSocket()`, `useContestSocket()`, `useNotificationSocket()`, `useSocketEvent()`.

## Key Patterns

- **Contest submit flow:** Validate participant + active status → run all test cases via Judge0 → score by difficulty → atomic `groupBy` best-score recalc → broadcast leaderboard
- **Chat:** Cursor-based pagination (message UUID cursors) → contest chat send-gated to active status → Socket.IO broadcast after DB write
- **Notifications:** DB-persisted + real-time Socket.IO push → toast for friend_online(7s auto-dismiss), friend_request/contest_invite(persistent)
- **Friends sidebar:** Global `FriendsContext` → fixed right-side overlay → unread count from Socket.IO `unread_update`
- **Profile:** Username-based routes `/profile/[username]` → public access → friendship actions → 365-day heatmap → cycling solve stats

## Specialized Docs

| Topic | Doc |
|-------|-----|
| Chatbot rules, coaching, anti-gaming | `docs/chatbot-system-prompt.md` |
| Visualization code gen, tracer API | `docs/visualization-agent-prompt.md` |
| Problem data schema, test cases, limits | `docs/problem-data-reference.md` |
| Build steps, setup, phased prompts | `docs/BUILD_GUIDE.md` |
