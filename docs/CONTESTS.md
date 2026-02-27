# Contests System

> End-to-end reference for contest creation, lifecycle, submission flow, and scoring.

## Overview

Contests are timed coding competitions where participants solve 2–5 problems within a time limit. Problems are randomly selected by difficulty/topic. Scoring is deterministic (no time bonuses).

---

## Contest Lifecycle

```
[Creation] ──→ [Upcoming] ──→ [Active] ──→ [Ended]
                  │               │
            join allowed    submit allowed
            invite friends  leaderboard updates
```

**⚠️ Status is ALWAYS computed at runtime:**
```ts
// packages/backend/src/lib/contest-status.ts
function getContestStatus(starts_at: Date, duration_minutes: number): "upcoming" | "active" | "ended"
```
Never stored in DB. Never cached.

---

## Creation Flow

**Endpoint:** `POST /api/contests`

**Request body:**
```json
{
  "title": "Weekly Challenge #1",
  "is_public": true,
  "starts_at": "2025-12-01T14:00:00Z",
  "duration_minutes": 60,
  "problems": [
    { "difficulty": "easy", "topics": ["arrays"] },
    { "difficulty": "medium", "topics": [] },
    { "difficulty": "hard", "topics": ["graphs"] }
  ],
  "invited_user_ids": [2, 5, 8]
}
```

**Backend processing:**
1. Validate: title length, timing (future), duration (10–180 min)
2. Validate problem slots: 2–5 items, valid difficulties, valid topics
3. **Random problem selection** (`selectRandomProblems()` in `lib/contest-helpers.ts`):
   - Filter problem pool by difficulty
   - If topics specified, prefer problems matching topics
   - Randomly select one problem per slot
   - Fail if not enough problems match
4. Create in transaction:
   - `Contest` record
   - `ContestProblem` records (with order)
   - `ContestParticipant` record (creator auto-joins)
5. Send `contest_invite` notifications to invited users (non-critical, outside transaction)

**Frontend:** `CreateContestModal` component — multi-step form

---

## Joining

**Endpoint:** `POST /api/contests/:id/join`

- Creates `ContestParticipant` record
- Validates contest exists and user isn't already a participant
- Can join during `upcoming` or `active` status

---

## Submission Flow

**Endpoint:** `POST /api/contests/:id/submit`

```json
{
  "problem_id": "two-sum",
  "source_code": "#include <bits/stdc++.h>...",
  "language_id": 54
}
```

**Backend processing (contest-helpers.ts):**
1. **Validate:** participant exists + contest is active
2. **Find problem:** verify `problem_id` is in this contest's problem set
3. **Run ALL test cases** via Judge0:
   - Batch submit all test cases
   - Poll for results
   - All must pass for "Accepted"
4. **Score by difficulty:**
   - easy = 100 points
   - medium = 200 points
   - hard = 300 points
   - Wrong answer / error = 0 points
5. **Create `ContestSubmission`** record
6. **Recalculate `total_score`** (atomic):
   - Group all user's submissions by `problem_id`
   - Take MAX score per problem
   - Sum = new `total_score`
   - Update `ContestParticipant`
7. **Broadcast via Socket.IO** (`/contests` namespace):
   - `submission:new` — to contest room
   - `leaderboard:update` — full recalculated leaderboard

---

## Scoring Rules

| Difficulty | Points |
|-----------|--------|
| Easy | 100 |
| Medium | 200 |
| Hard | 300 |

- **No time bonuses** — pure correctness scoring
- **Best score per problem counts** — can resubmit to improve
- Total score = sum of best scores across all problems
- Maximum possible score = sum of all problem difficulties

---

## Leaderboard

Updated after every submission via atomic recalculation:

```ts
// For each participant:
// 1. Get all their ContestSubmissions
// 2. Group by problem_id
// 3. Take max(score) per problem
// 4. Sum all max scores → total_score
```

Broadcast via `leaderboard:update` Socket.IO event.

---

## Contest Chat

Each contest has an associated `Conversation` (type = `contest`):
- Auto-created with the contest
- All participants can join
- **Send-gated:** messages only allowed during `active` status
- Uses the same `/chat` Socket.IO namespace
- Rendered via `DiscussionTab` component

---

## Real-time Events

| Event | Namespace | When |
|-------|-----------|------|
| `contest:started` | `/contests` | Contest transitions to active (server polls) |
| `contest:ending` | `/contests` | 5 minutes before end |
| `contest:ended` | `/contests` | Contest transitions to ended |
| `submission:new` | `/contests` | After any submission |
| `leaderboard:update` | `/contests` | After scoring recalculation |

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/routes/contests.ts` | All contest REST endpoints (955 lines) |
| `backend/src/lib/contest-helpers.ts` | Problem selection, scoring, contest submission logic |
| `backend/src/lib/contest-status.ts` | `getContestStatus()` pure function |
| `frontend/src/pages/ContestsPage.tsx` | Contest listing + creation UI |
| `frontend/src/pages/ContestDetailPage.tsx` | Contest detail wrapper |
| `frontend/src/pages/ContestProblemPage.tsx` | Contest workspace wrapper |
| `frontend/src/components/contests/CreateContestModal.tsx` | Create contest form |
| `frontend/src/components/contests/ContestProblemWorkspace.tsx` | Contest-specific workspace |
| `frontend/src/components/contests/LeaderboardTab.tsx` | Live leaderboard |
| `frontend/src/components/contests/CountdownTimer.tsx` | Timer display |
| `frontend/src/components/contests/DiscussionTab.tsx` | Contest chat |
| `frontend/src/lib/contest-status.ts` | Client-side status util |
