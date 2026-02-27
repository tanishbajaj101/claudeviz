# Frontend Components

> Component hierarchy, responsibilities, and where to find each piece of UI.

## Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `RootLayout` | `layouts/RootLayout.tsx` | App shell: wraps all pages with Providers + Navbar + FriendsSidebar |
| `Providers` | `components/layout/Providers.tsx` | Context provider composition (Auth, Friends, Notifications) |
| `Navbar` | `components/layout/Navbar.tsx` | Top navigation: logo, links, notifications icon, friends icon, profile menu |
| `ProtectedRoute` | `components/auth/ProtectedRoute.tsx` | Redirects unauthenticated users to `/auth/signin` |

---

## Problem Components

| Component | File | Purpose |
|-----------|------|---------|
| `ProblemTable` | `components/problems/ProblemTable.tsx` | Filterable/searchable problem list with difficulty badges, tags, and solve status |
| `ProblemWorkspace` | `components/problems/ProblemWorkspace.tsx` | Split-pane layout: problem description (left) + code editor + test runner + AI coach (right) |
| `RecommendModal` | `components/problems/RecommendModal.tsx` | Modal to recommend a problem to a friend via chat message |

### ProblemWorkspace internals:
- Left pane: problem description, examples, constraints
- Right pane tabs: **Code** (editor + run/submit), **Submissions** (history), **AI Coach** (chat), **Visualize** (algorithm viz)
- Uses `useJudge` hook for submission
- Uses `useSubmissions` hook for history

---

## Editor

| Component | File | Purpose |
|-----------|------|---------|
| `CodeEditor` | `components/editor/CodeEditor.tsx` | Thin wrapper around `react-simple-code-editor` with Prism.js C++ syntax highlighting |

---

## Contest Components

| Component | File | Purpose |
|-----------|------|---------|
| `CreateContestModal` | `components/contests/CreateContestModal.tsx` | Multi-step modal: title, timing, problem slots (difficulty + topics), friend invites |
| `CountdownTimer` | `components/contests/CountdownTimer.tsx` | Live countdown display for contest start/end |
| `LeaderboardTab` | `components/contests/LeaderboardTab.tsx` | Real-time leaderboard with scores, ranks |
| `DiscussionTab` | `components/contests/DiscussionTab.tsx` | Contest chat room (Socket.IO `/chat` with contest conversation) |
| `InviteFriendsDropdown` | `components/contests/InviteFriendsDropdown.tsx` | Dropdown to invite friends to a contest |
| `ContestProblemWorkspace` | `components/contests/ContestProblemWorkspace.tsx` | Contest-specific problem workspace (adds contest submit flow + scoring) |

---

## Friends & Chat Components

| Component | File | Purpose |
|-----------|------|---------|
| `FriendsContext` | `components/friends/FriendsContext.tsx` | Global context: friends list, online status, sidebar state, chat state |
| `FriendsSidebar` | `components/friends/FriendsSidebar.tsx` | Fixed right-side overlay: toggles between friends list, search, and chat views |
| `FriendsListView` | `components/friends/FriendsListView.tsx` | Friends list with online indicators, last activity, unread highlights |
| `FriendsSearchView` | `components/friends/FriendsSearchView.tsx` | User search with send friend request action |
| `SidebarChat` | `components/friends/SidebarChat.tsx` | Compact chat within the sidebar (message history + input) |
| `FullScreenChat` | `components/friends/FullScreenChat.tsx` | Full chat page with conversation thread |
| `ConversationList` | `components/friends/ConversationList.tsx` | Conversation list for messages page |
| `MessageRenderer` | `components/friends/MessageRenderer.tsx` | Renders different message types (text, problem card, code snippet, contest invite) |

### Friends sidebar flow:
1. Navbar friends icon → toggles `FriendsSidebar`
2. Default view: `FriendsListView` (sorted by activity)
3. Search icon → `FriendsSearchView` (find + add users)
4. Click friend → `SidebarChat` (compact chat)
5. Expand icon → navigates to `/messages` → `FullScreenChat`

---

## Notification Components

| Component | File | Purpose |
|-----------|------|---------|
| `NotificationsDropdown` | `components/notifications/NotificationsDropdown.tsx` | Bell icon dropdown in navbar with notification list |
| `NotificationItem` | `components/notifications/NotificationItem.tsx` | Single notification with type-specific rendering and actions |
| `ToastNotifications` | `components/notifications/ToastNotifications.tsx` | Bottom-right toast stack for real-time notifications |
| `NotificationsProvider` | `components/notifications/NotificationsProvider.tsx` | Connects to `/notifications` socket, manages unread count |

### Notification behavior:
- `friend_online` → 7s auto-dismiss toast
- `friend_request` → persistent toast with accept/reject actions
- `contest_invite` → persistent toast with join action
- All notifications persisted in DB + pushed via Socket.IO

---

## Profile Components

| Component | File | Purpose |
|-----------|------|---------|
| `ProfileClient` | `components/profile/ProfileClient.tsx` | Profile page content: avatar, stats, friendship actions, problem history |
| `ActivityHeatmap` | `components/profile/ActivityHeatmap.tsx` | 365-day GitHub-style activity heatmap (accepted submissions) |

---

## Visualization Components

Located in `components/visualization/` — renders algorithm step-by-step visualizations powered by the visualization agent.

**Tracer classes** (`lib/tracers/`):
- `Array1DTracer` — 1D array visualization
- `Array2DTracer` — 2D grid/matrix visualization
- `GraphTracer` — graph/tree visualization
- `ChartTracer` — bar chart visualization
- `LogTracer` — text log output
- `Commander` — step sequencing and playback control
- `Layout` — tracer arrangement

---

## Pages Summary

| Page | Route | Key Components Used |
|------|-------|--------------------|
| `HomePage` | `/` | `ProblemTable` |
| `ProblemPage` | `/problems/:id` | `ProblemWorkspace` |
| `SignInPage` | `/auth/signin` | Google OAuth button |
| `OnboardingPage` | `/onboarding` | Avatar generator (Bottts), username input |
| `ContestsPage` | `/contests` | `CreateContestModal`, contest cards |
| `ContestDetailPage` | `/contests/:id` | `LeaderboardTab`, `DiscussionTab`, `CountdownTimer` |
| `ContestProblemPage` | `/contests/:contestId/problems/:problemId` | `ContestProblemWorkspace` |
| `MessagesPage` | `/messages` | `ConversationList`, `FullScreenChat` |
| `ProfilePage` | `/profile` | Redirects to `/profile/:username` |
| `PublicProfilePage` | `/profile/:username` | `ProfileClient`, `ActivityHeatmap` |
