# XP System + Bounty Hunt

## Overview

Two interlinked features:
1. **XP System** — users earn XP on first correct solve per problem. Shown on profile.
2. **Bounty Hunt** — one problem per day is active for a 6-hour window at a bonus XP rate. Broadcasted to all connected clients via Socket.IO.

---

## XP Values

| Difficulty | Normal XP | Bounty XP (1.5×) |
|------------|-----------|------------------|
| Easy       | 100       | 150              |
| Medium     | 250       | 375              |
| Hard       | 600       | 900              |

- XP is awarded **once per problem** (first accepted solve only). Re-submissions of already-solved problems yield `xp_awarded: null`.
- Bounty bonus applies only if the problem is currently in its 6-hour bounty window at the time of submission.

---

## Bounty Algorithm

The bounty is **stateless** — computed deterministically from the UTC date. No DB record is needed.

```
seed        = intHash(year * 1000 + dayOfYear)   // stable for entire UTC day
problemIdx  = seed % numProblems                  // which problem is bounty
startHour   = (seed >>> 8) % 18                  // UTC hour 0–17 (ensures 6h window fits in day)
window      = [startHour:00, startHour+6:00) UTC
```

`intHash` uses `Math.imul` for safe 32-bit integer multiplication. Problems are sorted by `id` (lexicographic) before indexing so the selection is stable across deployments.

The same inputs always produce the same bounty, so any server instance agrees without coordination.

---

## Files

### Backend

| File | Purpose |
|------|---------|
| `packages/backend/src/lib/xp.ts` | `XP_VALUES`, `calculateXP()`, `awardXP()` |
| `packages/backend/src/lib/bounty.ts` | Bounty algorithm — `getCurrentBounty()`, `getNextBountyStart()`, `isProblemBounty()` |
| `packages/backend/src/routes/bounty.ts` | `GET /api/bounty/current` |
| `packages/backend/src/routes/problems.ts` | Awards XP in `POST /api/submissions` on first accepted solve |
| `packages/backend/src/routes/users.ts` | Includes `xp` in `GET /api/users/:id` stats response |
| `packages/backend/src/socket/index.ts` | `scheduleBountyNotification()` — fires `bounty:new` at exact start time, chains to next day |

### Shared Types

| File | Addition |
|------|---------|
| `packages/shared/src/types/socket.ts` | `BountyInfo` interface; `"bounty:new"` event in `NotificationServerToClientEvents` |
| `packages/shared/src/types/user.ts` | `xp?: number` on `UserProfile` |

### Frontend

| File | Purpose |
|------|---------|
| `packages/frontend/src/hooks/useBounty.ts` | Fetches `/api/bounty/current`, listens for `bounty:new`, runs 1s countdown |
| `packages/frontend/src/components/problems/ProblemTable.tsx` | Flame badge + countdown on bounty row; amber row highlight |
| `packages/frontend/src/pages/ProblemPage.tsx` | Fixed amber banner when viewing the bounty problem |
| `packages/frontend/src/components/notifications/ToastNotifications.tsx` | Persistent `bounty` toast on `bounty:new` socket event |
| `packages/frontend/src/components/profile/ProfileClient.tsx` | 5th stat card: "Total XP" (amber) |
| `packages/frontend/src/hooks/useSubmissions.ts` | `recordSubmission` returns `{ xp_awarded }`, exposes `lastXpAward` state |

### Database

Migration: `prisma/migrations/20260320060104_add_xp_to_user/`

```sql
ALTER TABLE "users" ADD COLUMN "xp" INTEGER NOT NULL DEFAULT 0;
```

---

## API

### `GET /api/bounty/current`

Public. No auth required.

**Response — active:**
```json
{
  "active": true,
  "problemId": "two-sum",
  "problemTitle": "Two Sum",
  "difficulty": "Easy",
  "startsAt": "2026-03-21T14:00:00.000Z",
  "expiresAt": "2026-03-21T20:00:00.000Z",
  "bonusXp": 150
}
```

**Response — inactive:**
```json
{ "active": false }
```

### `POST /api/submissions` (updated)

Now returns `xp_awarded` in addition to existing fields:
```json
{
  "submission": { ... },
  "solvedProblems": ["two-sum", ...],
  "xp_awarded": 150
}
```

`xp_awarded` is `null` if: not accepted, already solved, or problem not found in problem list.

### `GET /api/users/:id` (updated)

`stats` object now includes:
```json
{ "xp": 1350 }
```

---

## Socket.IO

**Namespace:** `/notifications`

**Event:** `bounty:new`

**Payload:** `BountyInfo` (same shape as REST response minus `active`)

Emitted to **all connected clients** in the `/notifications` namespace at the exact UTC start time of each bounty window. The broadcaster uses a recursive `setTimeout` — no polling, no drift. It schedules itself for tomorrow's bounty immediately after each emission.

---

## `useBounty` Hook

```typescript
const { bounty, loading, timeRemaining } = useBounty();
// bounty: BountyInfo | null
// timeRemaining: seconds until expiry (updates every 1s, sets bounty=null at 0)
```

`formatTimeRemaining(seconds)` utility formats as `"4h 22m"` or `"22m"`.

---

## XP Toast (Phase 13)

`useSubmissions` exposes:
- `lastXpAward: number | null` — set after a submission that earned XP
- `clearLastXpAward: () => void` — call after displaying the toast

Components using `useSubmissions` can watch `lastXpAward` to display a "+150 XP Earned!" notification.
