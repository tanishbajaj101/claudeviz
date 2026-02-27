# Socket.IO Real-time System

> Reference for the Socket.IO server, namespaces, events, and client hooks.

## Server Setup

**File:** `packages/backend/src/socket/index.ts`

The Socket.IO server is attached to the Express HTTP server in `server.ts` before `listen()`.

```ts
import { initializeSocketIO } from './socket/index.js';
const io = initializeSocketIO(httpServer);
```

Three namespaces are configured, each with JWT auth middleware.

## Authentication

**File:** `packages/backend/src/socket/auth.ts`

All sockets authenticate via JWT on connect:
1. Token read from `socket.handshake.auth.token` or cookie `auth-token`
2. Verified against `JWT_SECRET`
3. User looked up by `google_id` from token payload
4. `socket.data.user` set with `{ id, google_id, username, email, name }`
5. Unauthorized → connection rejected

## Presence Tracking

**File:** `packages/backend/src/socket/connections.ts`

In-memory tracking (not persisted):
```ts
Map<number, Set<string>>  // userId → Set of socketIds
```

**Key functions:**
- `addConnection(userId, socketId)` — on connect
- `removeConnection(userId, socketId)` — on disconnect
- `isUserOnline(userId) → boolean`
- `broadcastToUser(namespace, userId, event, data)` — emit to all user's sockets

## Room Management

**File:** `packages/backend/src/socket/rooms.ts`

Rooms are DB-validated before join:
- `joinConversation(socket, conversationId)` — checks `ConversationParticipant`
- `joinContest(socket, contestId)` — checks `ContestParticipant`
- Automatic leave on disconnect

---

## Namespaces & Events

### `/chat` — Direct Messages & Contest Chat

**Room pattern:** `conversation:<conversationId>`

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| Client → Server | `message:send` | `{ conversationId, content, type, metadata? }` | Send a message |
| Client → Server | `conversation:join` | `{ conversationId }` | Join conversation room |
| Client → Server | `conversation:leave` | `{ conversationId }` | Leave conversation room |
| Client → Server | `message:read` | `{ conversationId, messageId }` | Mark messages as read |
| Client → Server | `user:typing` | `{ conversationId }` | Typing indicator |
| Server → Client | `message:new` | `{ id, conversation_id, sender_id, sender_username, type, content, metadata, created_at }` | New message broadcast |
| Server → Client | `message:read` | `{ conversationId, userId, messageId }` | Read receipt |
| Server → Client | `user:typing` | `{ conversationId, userId, username }` | Typing indicator |

**Contest chat:** Messages in contest conversations are send-gated — only allowed when contest is active.

### `/contests` — Contest Events

**Room pattern:** `contest:<contestId>`

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| Client → Server | `contest:join` | `{ contestId }` | Join contest room |
| Client → Server | `contest:leave` | `{ contestId }` | Leave contest room |
| Server → Client | `contest:started` | `{ contestId }` | Contest has started |
| Server → Client | `contest:ending` | `{ contestId, minutes_remaining }` | 5-minute warning |
| Server → Client | `contest:ended` | `{ contestId }` | Contest has ended |
| Server → Client | `submission:new` | `{ contestId, userId, problemId, isCorrect, score }` | New submission |
| Server → Client | `leaderboard:update` | `{ contestId, leaderboard[] }` | Updated leaderboard |

### `/notifications` — Personal Notifications

**Room pattern:** `notifications:<userId>` (auto-joined on connect)

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| Server → Client | `notification:new` | `{ id, type, data, created_at }` | New notification |
| Server → Client | `notification:read` | `{ notificationId }` | Notification marked read |
| Server → Client | `friend:online` | `{ userId, username }` | Friend came online |
| Server → Client | `friend:offline` | `{ userId }` | Friend went offline |
| Server → Client | `unread_update` | `{ unread_count }` | Unread message count changed |

---

## Client-Side Hooks

**File:** `packages/frontend/src/hooks/useSocket.ts`

### `useSocket(namespace)` — Core Hook
```ts
const { socket, status, isConnected } = useSocket("/notifications");
```

- Waits for auth session before connecting
- Auto-disconnects on unmount or session end
- Handles reconnection (10 attempts, exponential backoff up to 30s)
- Returns typed socket for the namespace

**Status values:** `idle` → `connecting` → `connected` / `disconnected` / `error`

### Convenience Aliases
```ts
const { socket } = useChatSocket();         // useSocket("/chat")
const { socket } = useContestSocket();      // useSocket("/contests")
const { socket } = useNotificationSocket(); // useSocket("/notifications")
```

### `useSocketEvent(socket, event, handler)`
```ts
useSocketEvent(socket, "notification:new", (payload) => {
  // Handle notification
});
```
Auto-subscribes/unsubscribes with cleanup. Uses ref for stable handler.

---

## Notification Helpers

**File:** `packages/backend/src/socket/notification-helpers.ts`

**Key functions:**
- `sendNotificationToUser(userId, type, data)` — creates DB record + emits to socket
- `sendContestInvites(contestId, title, startsAt, userIds, creatorName)` — batch invite
- `broadcastFriendOnline(userId, username, friendIds)` — notify all friends

---

## Accessing Namespaces from Routes

From any Express route handler:
```ts
import { getChatNamespace, getContestsNamespace, getNotificationsNamespace } from '../socket/index.js';

const chatNs = getChatNamespace();
chatNs.to(`conversation:${id}`).emit('message:new', payload);
```

---

## Common Patterns

### Sending a chat message (full flow):
1. Client emits `message:send` via `/chat` socket
2. Server validates participant membership
3. Server writes message to DB
4. Server updates conversation `updated_at`
5. Server broadcasts `message:new` to conversation room
6. Server emits `unread_update` to other participants via `/notifications`

### Contest submission broadcast:
1. Client POSTs to `/api/contests/:id/submit`
2. Server runs all test cases via Judge0
3. Server scores submission + recalculates `total_score`
4. Server broadcasts `submission:new` to contest room
5. Server broadcasts `leaderboard:update` to contest room

### Friend online notification:
1. User connects to any Socket.IO namespace
2. `connections.ts` registers presence
3. Server queries user's friend list
4. Server emits `friend:online` to each friend's notification room
5. `ToastNotifications` shows 7s auto-dismiss toast
