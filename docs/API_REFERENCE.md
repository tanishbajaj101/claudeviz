# API Reference

> Complete list of REST API endpoints. All routes are prefixed with `/api`.

## Authentication

All authenticated endpoints require a valid JWT in the `auth-token` httpOnly cookie.
- `authenticate` middleware: returns 401 if missing/invalid.
- `optionalAuth` middleware: attaches user if present, proceeds regardless.

---

## Auth Routes (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/auth/google` | — | Initiates Google OAuth flow |
| GET | `/auth/google/callback` | — | OAuth callback → sets JWT cookie → redirects to frontend |
| GET | `/auth/session` | ✅ | Returns current user session `{ user }` |
| POST | `/auth/logout` | — | Clears auth cookie `{ success }` |

**OAuth flow:**
1. Frontend redirects to `GET /api/auth/google`
2. Google redirects back to `/api/auth/google/callback`
3. Backend creates/finds user, signs JWT, sets `auth-token` cookie
4. If user has no username → redirect to `/onboarding?token=...`
5. Otherwise → redirect to frontend root `/`

---

## User Routes (`/api/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users` | — | Create user (onboarding) `{ name, username, avatarSvg }` |
| GET | `/users` | ✅ | Get current authenticated user `{ user }` |
| GET | `/users/check-username?username=X` | — | Check username availability `{ available }` |
| GET | `/users/search?q=X` | ✅ | Search users by username (min 2 chars) `{ users[] }` |
| GET | `/users/avatar?username=X` | — | Get user avatar SVG `{ avatar_svg }` |
| POST | `/users/last-problem` | ✅ | Set `last_opened_problem_id` `{ problem_id }` |
| POST | `/users/activity/problem` | ✅ | Track problem page visit `{ problem_id }` |
| GET | `/users/:id` | optional | Get public profile + stats + heatmap `{ user, activity_heatmap }` |

**Profile response shape:**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "avatar_svg": "<svg>...</svg>",
    "friendship_status": "none|pending_sent|pending_received|friends",
    "problems_solved": 15,
    "problems_solved_7d": 3,
    "problems_solved_30d": 8,
    "total_submissions": 42,
    "accuracy": 0.6429
  },
  "activity_heatmap": [{ "date": "2025-12-01", "count": 3 }, ...]
}
```

---

## Friends Routes (`/api/friends`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/friends` | ✅ | Get friends list with activity data `{ friends[] }` |
| POST | `/friends` | ✅ | Send friend request `{ receiver_id }` → `{ success, friend_request_id }` |
| GET | `/friends/requests` | ✅ | Get pending requests `{ sent[], received[] }` |
| POST | `/friends/:id/accept` | ✅ | Accept friend request → creates notification + emits socket event |
| POST | `/friends/:id/reject` | ✅ | Reject friend request |
| DELETE | `/friends/:id` | ✅ | Unfriend (`:id` = user ID, not request ID) |

**Friends list item shape:**
```json
{
  "id": 2,
  "username": "janedoe",
  "avatar_svg": "<svg>...</svg>",
  "is_online": true,
  "last_active": "2025-12-01T10:00:00.000Z",
  "last_problem_activity": {
    "problem_id": "two-sum",
    "problem_name": "Two Sum",
    "status": "solved"
  },
  "has_unread": false
}
```

---

## Conversations Routes (`/api/conversations`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/conversations` | ✅ | List all conversations (sorted by `updated_at` DESC) |
| GET | `/conversations/direct?user_id=X` | ✅ | Get or create direct conversation |
| POST | `/conversations/direct` | ✅ | Same as GET (legacy) |
| GET | `/conversations/unread-count` | ✅ | Count of conversations with unread messages `{ unread_count }` |
| GET | `/conversations/:id/messages` | ✅ | Cursor-based messages `{ messages[], has_more, cursor }` |
| POST | `/conversations/:id/messages` | ✅ | Send message `{ type, content, metadata? }` |

**Pagination:** Cursor-based using message UUIDs.
- `?before=<messageId>` — older messages
- `?after=<messageId>` — newer messages
- `?limit=50` — max 100

**Message types:** `text`, `problem_recommendation`, `code_snippet`, `contest_invite`

---

## Notifications Routes (`/api/notifications`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/notifications` | ✅ | List with cursor pagination `{ notifications[], has_more, cursor }` |
| GET | `/notifications/unread-count` | ✅ | `{ unread_count }` |
| POST | `/notifications/read-all` | ✅ | Mark all as read `{ success, count }` |
| POST | `/notifications/:id/read` | ✅ | Mark single as read `{ success }` |

**Notification types:** `friend_request`, `friend_request_accepted`, `friend_online`, `contest_invite`, `contest_starting`

---

## Contest Routes (`/api/contests`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/contests` | optional | List all public contests |
| GET | `/contests/public` | — | Legacy alias for above |
| GET | `/contests/me` | ✅ | My participated contests |
| GET | `/contests/mine` | ✅ | Legacy alias for `/me` |
| POST | `/contests` | ✅ | Create contest `{ title, is_public, starts_at, duration_minutes, problems[], invited_user_ids? }` |
| GET | `/contests/:id` | optional | Contest detail with problems, participants, leaderboard |
| POST | `/contests/:id/join` | ✅ | Join a contest |
| POST | `/contests/:id/submit` | ✅ | Submit solution `{ problem_id, source_code, language_id }` |

**Contest creation — `problems` array (2–5 items):**
```json
{
  "problems": [
    { "difficulty": "easy", "topics": ["arrays"] },
    { "difficulty": "medium", "topics": [] },
    { "difficulty": "hard", "topics": ["graphs", "dp"] }
  ]
}
```
Problems are **randomly selected** by the backend from the problem pool, filtered by difficulty and topics.

**Scoring:** easy=100, medium=200, hard=300 — best score per problem counts.

---

## Judge Routes (`/api/judge`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/judge/submit` | ✅ | Proxy → Judge0 CE (source_code, language_id, stdin, expected_output) |
| GET | `/judge/result/:token` | ✅ | Poll for submission result |

**⚡ Security:** API key never reaches client. All requests proxied through backend.

---

## Problems Routes (`/api/problems`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/problems/status` | ✅ | Get solve status for all problems `{ statuses }` |
| GET | `/problems/:id/submissions` | ✅ | Get submission history for a problem |

---

## Chat Routes (`/api/chat`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chat` | ✅ | Send message to AI coach → streaming response |

The AI coach uses LangChain with the problem's editorial as internal context. It **guides and nudges** — never gives full solutions.
