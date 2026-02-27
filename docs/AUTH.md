# Authentication System

> JWT-based auth with Google OAuth, covering the full flow from sign-in to session management.

## Architecture

```
Frontend (SPA)              Backend (Express)           Google
     │                           │                        │
     │  click "Sign In"          │                        │
     ├──────────────────────────►│ GET /api/auth/google    │
     │                           ├───────────────────────►│
     │                           │◄───────────────────────┤
     │                           │ GET /callback           │
     │                           │                        │
     │  (redirect + cookie set)  │                        │
     │◄──────────────────────────┤                        │
     │                           │                        │
     │  GET /api/auth/session    │                        │
     ├──────────────────────────►│ verify JWT from cookie  │
     │◄──────────────────────────┤ return user data       │
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/config/auth.ts` | Passport strategy setup (Google OAuth + JWT) |
| `backend/src/middleware/auth.ts` | `authenticate` + `optionalAuth` middleware |
| `backend/src/routes/auth.ts` | OAuth routes + session endpoint + logout |
| `backend/src/lib/db.ts` | `createUser`, `getUserByGoogleId` (legacy SQLite) |
| `frontend/src/contexts/AuthContext.tsx` | `AuthProvider` + `useAuth()` hook |
| `frontend/src/components/auth/ProtectedRoute.tsx` | Route guard component |

## JWT Token

**Payload:**
```json
{
  "sub": "google-oauth-id",
  "dbUserId": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Storage:** `auth-token` httpOnly cookie
- `httpOnly: true` — not accessible to JavaScript (XSS protection)
- `secure: true` in production (HTTPS only)
- `sameSite: strict` in production, `lax` in development
- Expires in 7 days

## Auth Flow

### New User
1. Click "Sign in with Google" → `window.location.href = /api/auth/google`
2. Passport redirects to Google consent screen
3. Google redirects back to `/api/auth/google/callback`
4. Passport creates user in DB (no username yet)
5. Backend generates JWT, sets cookie
6. Since no username → redirect to `/onboarding?token=<jwt>`
7. User picks avatar (Bottts) + username
8. Frontend POSTs to `/api/users` with name, username, avatarSvg
9. User redirected to `/` (home)

### Returning User
1. Click "Sign in with Google" → OAuth flow
2. Backend finds existing user by `google_id`
3. JWT set, redirect to `/`
4. Frontend calls `GET /api/auth/session` → gets user data

### Session Check (Every Page Load)
1. `AuthContext.useEffect` calls `fetchSession()`
2. `GET /api/auth/session` with httpOnly cookie
3. If 200 → set user state
4. If 401 → set user null, redirect to sign-in if on protected route

## Middleware

### `authenticate` (required auth)
```ts
// Extracts JWT from cookie, verifies, attaches req.user
// Returns 401 if missing or invalid
router.get('/protected', authenticate, (req, res) => {
  const userId = req.user!.id;
});
```

### `optionalAuth` (optional auth)
```ts
// Same as authenticate but doesn't reject if no token
// req.user may be undefined
router.get('/public', optionalAuth, (req, res) => {
  if (req.user) { /* logged in */ }
});
```

## Client-Side

### `useAuth()` Hook
```ts
const { user, loading, signIn, signOut, refreshUser } = useAuth();
```

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user or null |
| `loading` | `boolean` | True during initial session check |
| `signIn()` | `() => void` | Redirects to Google OAuth |
| `signOut()` | `() => Promise<void>` | Clears cookie + redirects to sign-in |
| `refreshUser()` | `() => Promise<void>` | Re-fetches session (after profile update) |

### `ProtectedRoute`
Wraps routes that require authentication. If `loading` → shows spinner. If `!user` → navigates to `/auth/signin`.

## Socket.IO Authentication

Socket connections also use JWT:
1. Socket.IO client sends cookie with `withCredentials: true`
2. Server middleware (`socket/auth.ts`) extracts JWT from cookie or `handshake.auth.token`
3. Validates + attaches user to `socket.data.user`
4. Unauthorized → socket disconnected

## Environment Variables

```bash
JWT_SECRET=<random-secret>          # Used to sign/verify JWTs
SESSION_SECRET=<random-secret>      # Express session secret (Passport)
GOOGLE_CLIENT_ID=...                # Google OAuth app
GOOGLE_CLIENT_SECRET=...            # Google OAuth app
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```
