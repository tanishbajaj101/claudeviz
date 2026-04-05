# Profile: Contest History Tab

## Overview

The profile page has a two-tab layout:
- **Overview** — stats ring, XP card, activity heatmap (existing)
- **Contests** — list of public contests the user participated in

The Contests tab is lazy-loaded (fetches only on first click).

---

## Backend

### New Endpoint

**`GET /api/contests/history/:userId`**

- No authentication required
- Returns only `is_public: true` contests
- Sorted by `starts_at` descending (most recent first)

**Response:**
```json
{
  "contests": [
    {
      "id": "uuid",
      "title": "Contest Name",
      "starts_at": "2026-03-01T10:00:00.000Z",
      "duration_minutes": 90,
      "score": 300,
      "rank": 2,
      "total_participants": 12,
      "status": "completed"
    }
  ]
}
```

**Rank computation** — uses two efficient `count` queries per contest (not a full leaderboard build):
```ts
const rank = await prisma.contestParticipant.count({
  where: { contest_id, total_score: { gt: userScore } }
}) + 1;
```

All contests are processed in parallel via `Promise.all`.

**File:** `packages/backend/src/routes/contests.ts` — registered before the `/:id` wildcard route.

---

## Frontend

**File:** `packages/frontend/src/components/profile/ProfileClient.tsx`

### Tab bar

Placed between the profile header and content. Uses the same emerald underline pattern as other tabs in the app:

- Active: `border-b-2 border-emerald-500 text-emerald-400`
- Inactive: `text-muted-foreground hover:text-foreground`

### State

| Variable | Type | Purpose |
|----------|------|---------|
| `activeTab` | `"overview" \| "contests"` | Which tab is active |
| `contestHistory` | `ContestHistoryItem[] \| null` | `null` = not yet fetched |
| `contestsLoading` | `boolean` | Spinner while fetching |
| `contestsError` | `string \| null` | Error message on failure |

### Lazy fetch

Fires only when the Contests tab is first opened. The `null` sentinel on `contestHistory` prevents re-fetching on subsequent tab switches.

### ContestHistoryRow

Each row shows:
- Contest title (links to `/contests/:id`)
- Status badge: `Upcoming` / `Live` / `Completed`
- Date
- Score (emerald)
- Rank: `#2 / 12`

### Empty state

Trophy icon + "No public contests participated in yet."

---

## Access

Navigate to any profile page (`/profile/:username`) and click the **Contests** tab.
