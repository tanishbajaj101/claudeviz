# Coding Conventions

> Code style rules, import patterns, and anti-patterns for AlgoArena development.

## TypeScript

- **Strict mode** enabled — no `any` types
- **Named exports only** — never use `export default` for components
- **Functional components + hooks** — no class components
- **No "use client" directive** — Vite doesn't need it (remove if found in old code)

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Utility / lib | `kebab-case.ts` | `api-client.ts`, `contest-status.ts` |
| React component | `PascalCase.tsx` | `ProblemTable.tsx`, `Navbar.tsx` |
| Route file | `kebab-case.ts` | `friends.ts`, `notifications.ts` |
| Type definitions | `kebab-case.ts` | `user.ts`, `contest.ts` |

## Import Patterns

```ts
// Frontend — absolute imports via @ alias
import { ProblemTable } from '@/components/problems/ProblemTable';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';

// Backend — absolute imports via @ alias  
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/middleware/auth';

// Shared types — package import
import type { User, Problem } from '@algoarena/shared';

// ⚠️ NEVER use relative imports for cross-directory references
// ❌ import { foo } from '../../lib/api-client';
// ✅ import { foo } from '@/lib/api-client';
```

## React Router (NOT Next.js)

```tsx
// ✅ Correct
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';

// ❌ Wrong — these are Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
```

| Next.js (old) | React Router (correct) |
|---------------|----------------------|
| `<Link href="/path">` | `<Link to="/path">` |
| `useRouter().push('/path')` | `useNavigate()('/path')` |
| `usePathname()` | `useLocation().pathname` |
| `useParams()` | `useParams()` (same) |
| `"use client"` | Remove entirely |

## Express API Routes

```ts
// Always return typed JSON, never raw strings
res.json({ user });           // ✅
res.json({ error: "msg" });   // ✅
res.send("ok");               // ❌

// Always handle errors
try {
  // ...
} catch (error) {
  console.error("[ROUTE_NAME] Error:", error);
  res.status(500).json({ error: "Internal server error" });
}

// Use authenticate/optionalAuth middleware
router.get('/protected', authenticate, async (req, res) => { ... });
router.get('/public', optionalAuth, async (req, res) => { ... });
```

## Database Access

```ts
// ✅ New features — use Prisma
import { prisma } from '../lib/prisma.js';
const user = await prisma.user.findUnique({ where: { id: userId } });

// ⚠️ Legacy — better-sqlite3 for users/submissions only
import { getUserById, createUser } from '../lib/db.js';
```

## Socket.IO

```ts
// Always wrap in try/catch (best-effort)
try {
  getChatNamespace().to(`conversation:${id}`).emit('message:new', payload);
} catch (err) {
  console.error('Socket emit failed:', err);
}
```

## Problem Data

```ts
// ✅ From data files only
import { problems } from '@/data/problems';

// ❌ NEVER hardcode problem data in components
const problems = [{ id: 'two-sum', ... }]; // WRONG
```

## Critical Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Store contest status in DB | Compute with `getContestStatus()` |
| Expose Judge0 API key to client | Proxy through `/api/judge` |
| Show editorial content to users | Keep editorial as AI-only context |
| Use `any` type | Use proper TypeScript types from `@algoarena/shared` |
| Use class components | Use functional components + hooks |
| Use `export default` | Use named exports |
| Import from `next/*` | Import from `react-router-dom` |
| Store JWT in localStorage | Use httpOnly cookies |
| Skip error handling in routes | Always try/catch + log + 500 response |

## Tailwind CSS

The frontend uses Tailwind CSS for styling. Common patterns:
- Dark theme: `bg-zinc-900`, `text-zinc-100`, `border-zinc-700`
- Accent colors: project-specific palette (see `docs/COLOR_SYSTEM_GUIDE.md`)
- Responsive: `sm:`, `md:`, `lg:` breakpoints
- Flex layouts: `flex items-center justify-between gap-4`
