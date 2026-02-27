# Database Schema

> Prisma schema reference — all models, relations, enums, and key constraints.
>
> **File:** `prisma/schema.prisma`
> **Database:** PostgreSQL via Supabase
> **Legacy:** `better-sqlite3` still used for `users`/`submissions` via `packages/backend/src/lib/db.ts`

## Models

### User
```prisma
model User {
  id                      Int       @id @default(autoincrement())
  google_id               String    @unique
  email                   String
  name                    String
  username                String    @unique
  avatar_svg              String              # Bottts SVG stored as string
  created_at              DateTime  @default(now())
  last_opened_problem_id  String?             # Currently open problem
  last_active             DateTime?           # Updated on activity

  @@index([google_id])
  @@map("users")
}
```
**Key fields:**
- `avatar_svg` — Bottts-generated SVG string (not a URL)
- `last_opened_problem_id` — tracks the problem the user last opened (used for "solving" status)
- `last_active` — updated on problem activity

### Submission
```prisma
model Submission {
  id         Int      @id @default(autoincrement())
  user_id    Int
  problem_id String             # References problem slug (e.g., "two-sum")
  status     String             # "Accepted", "Wrong Answer", etc.
  time       String?            # Execution time (from Judge0)
  memory     Float?             # Memory usage
  created_at DateTime @default(now())

  @@index([problem_id])
  @@index([user_id])
  @@map("submissions")
}
```
**Note:** This table is also accessed via legacy `better-sqlite3` in `db.ts`.

### Contest
```prisma
model Contest {
  id                 String    @id @default(uuid())
  title              String
  creator_id         Int
  is_public          Boolean   @default(false)
  starts_at          DateTime
  duration_minutes   Int
  created_at         DateTime  @default(now())
  updated_at         DateTime  @updatedAt
  
  @@map("contests")
}
```
**⚠️ Critical:** Contest status is **NEVER stored** in DB. Always computed at runtime:
```ts
getContestStatus(starts_at, duration_minutes) → "upcoming" | "active" | "ended"
```

### ContestProblem
```prisma
model ContestProblem {
  id         String            @id @default(uuid())
  contest_id String
  problem_id String            # References problem slug
  order      Int               # Display order (1-based)
  difficulty ProblemDifficulty

  @@unique([contest_id, problem_id])
  @@map("contest_problems")
}
```

### ContestParticipant
```prisma
model ContestParticipant {
  id          String   @id @default(uuid())
  contest_id  String
  user_id     Int
  total_score Int      @default(0)    # Sum of best scores per problem
  joined_at   DateTime @default(now())

  @@unique([contest_id, user_id])
  @@map("contest_participants")
}
```

### ContestSubmission
```prisma
model ContestSubmission {
  id           String   @id @default(uuid())
  contest_id   String
  user_id      Int
  problem_id   String
  is_correct   Boolean
  score        Int      @default(0)    # easy=100, medium=200, hard=300
  submitted_at DateTime @default(now())

  @@map("contest_submissions")
}
```

### Conversation
```prisma
model Conversation {
  id           String             @id @default(uuid())
  type         ConversationType   # direct | contest
  contest_id   String?            # Only for contest chat
  created_at   DateTime           @default(now())
  updated_at   DateTime           @updatedAt

  @@map("conversations")
}
```

### ConversationParticipant
```prisma
model ConversationParticipant {
  id                   String    @id @default(uuid())
  conversation_id      String
  user_id              Int
  last_seen_message_id String?   # Tracks read state

  @@unique([conversation_id, user_id])
  @@map("conversation_participants")
}
```

### Message
```prisma
model Message {
  id              String       @id @default(uuid())
  conversation_id String
  sender_id       Int
  type            MessageType  # text | problem_recommendation | code_snippet | contest_invite
  content         String
  metadata        String?      # JSON string — parsed at read time
  created_at      DateTime     @default(now())

  @@index([conversation_id, created_at])
  @@map("messages")
}
```
**Metadata examples:**
- `problem_recommendation`: `{ "problem_id": "two-sum", "problem_name": "Two Sum", "difficulty": "easy" }`
- `code_snippet`: `{ "language": "cpp", "problem_id": "two-sum" }`
- `contest_invite`: `{ "contest_id": "uuid", "contest_title": "Weekly #1" }`

### Notification
```prisma
model Notification {
  id         String           @id @default(uuid())
  user_id    Int
  type       NotificationType
  data       String           # JSON string
  is_read    Boolean          @default(false)
  created_at DateTime         @default(now())

  @@map("notifications")
}
```

### FriendRequest
```prisma
model FriendRequest {
  id          String              @id @default(uuid())
  sender_id   Int
  receiver_id Int
  status      FriendRequestStatus @default(pending)
  created_at  DateTime            @default(now())
  updated_at  DateTime            @updatedAt

  @@map("friend_requests")
}
```
**⚠️ Bidirectional check required:** When checking friendship, must check both directions:
```sql
WHERE (sender_id = A AND receiver_id = B) OR (sender_id = B AND receiver_id = A)
```

## Enums

```prisma
enum ConversationType    { direct, contest }
enum MessageType         { text, problem_recommendation, code_snippet, contest_invite }
enum NotificationType    { friend_request, friend_request_accepted, friend_online, contest_invite, contest_starting }
enum FriendRequestStatus { pending, accepted, rejected }
enum ProblemDifficulty   { easy, medium, hard }
```

## Access Patterns

| Operation | Use | Location |
|-----------|-----|----------|
| New features | Prisma ORM | `packages/backend/src/lib/prisma.ts` |
| Legacy user/submission ops | better-sqlite3 | `packages/backend/src/lib/db.ts` |
| Schema migrations | `npx prisma migrate` | `prisma/schema.prisma` |
| DB browser | `npx prisma studio` | Opens web UI on :5555 |

## Commands

```bash
npm run prisma:generate -w @algoarena/backend    # Regenerate Prisma client
npm run prisma:migrate -w @algoarena/backend     # Run pending migrations
npm run prisma:studio -w @algoarena/backend      # Open Prisma Studio
```
