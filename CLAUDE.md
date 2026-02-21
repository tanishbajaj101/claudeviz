# AlgoArena

LeetCode alternative: problem list → split-pane workspace (editor + Judge0 runner + AI coach) → algorithm visualizations.

## Stack

- Next.js 14+ (App Router), TypeScript strict, Tailwind CSS
- `react-simple-code-editor` + Prism.js — C++ only (`language_id: 54`, GCC 9.2.0)
- Judge0 CE API — code execution with per-problem resource limits
- NextAuth.js — Google OAuth 2.0
- LangChain — two-agent chatbot (Main Agent + Visualization Agent)
- Custom tracer library — client-side algorithm animations via web worker

## Commands

- `npm run dev` — Dev server, port 3000
- `npm run build` — Production build (run after every change set)
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript strict check

## Architecture

```
src/
├── app/
│   ├── page.tsx                          # Home: problem list with filters
│   ├── problems/[id]/page.tsx            # Problem workspace (split-pane)
│   ├── profile/page.tsx                  # User progress + submission history
│   └── api/
│       ├── chat/route.ts                 # LangChain chatbot endpoint
│       ├── judge/route.ts                # Judge0 proxy (base64 + polling)
│       └── auth/[...nextauth]/route.ts   # NextAuth catch-all
├── components/
│   ├── ui/                               # Design system primitives
│   ├── chat/                             # Chat panel + viz renderer
│   ├── editor/                           # Code editor wrapper
│   ├── visualization/                    # Tracer renderers, web worker bridge
│   ├── problems/                         # Problem list, filters, cards
│   └── layout/                           # Navbar, split-pane, sidebar
├── lib/
│   ├── judge0.ts                         # Judge0 API client
│   ├── chatbot.ts                        # Main Agent (detects viz needs, calls viz agent)
│   ├── visualization-agent.ts            # Viz Agent (generates tracer code from requests)
│   ├── tracers/                          # Client-side algorithm tracers
│   ├── auth.ts                           # NextAuth config
│   └── problems.ts                       # Problem data loader
├── data/
│   └── problems.ts                       # All problem definitions (→ docs/problem-data-reference.md)
├── types/index.ts                        # TypeScript interfaces
└── hooks/                                # Custom React hooks
```

## Code Style

- TypeScript strict, no `any`
- Named exports only (no default exports)
- Functional components, hooks only
- `kebab-case.ts` for utils, `PascalCase.tsx` for components
- Absolute imports via `@/*`
- API routes return typed JSON — never raw strings

## Env Vars (.env.local — NEVER commit)

```
JUDGE0_API_URL=          # Judge0 CE endpoint
JUDGE0_API_KEY=          # X-Auth-Token (if auth required)
GOOGLE_CLIENT_ID=        # console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=         # openssl rand -base64 32
OPENAI_API_KEY=
```

Google OAuth callback (register in Google Cloud Console):
`{NEXTAUTH_URL}/api/auth/callback/google`

## Critical Rules

1. **Problem data is never hardcoded in components.** Everything comes from `src/data/problems.ts`, injected dynamically per route.
2. **Judge0 key never reaches the client.** All execution goes through `/api/judge/route.ts`.
3. **Editorial is never shown to the user.** It's internal context for the AI chatbot only.
4. **All Judge0 payloads use `base64_encoded=true`.** Encode `source_code`, `stdin`, `expected_output`.
5. **The chatbot never gives users the full solution.** It guides, nudges, visualizes — never solves.

## Judge0 Quick Reference

Language: C++ (GCC 9.2.0) → `language_id: 54`

| Parameter | Controls | Unit |
|-----------|----------|------|
| `cpu_time_limit` | CPU computation time (OS scheduling excluded) | seconds |
| `cpu_extra_time` | Grace period after CPU limit for reporting | seconds (0.5) |
| `wall_time_limit` | Total wall-clock time (includes I/O, sleep) | seconds |
| `memory_limit` | Max process memory | kilobytes |
| `stack_limit` | Stack size (deep recursion) | kilobytes |

Statuses: 3=Accepted, 4=Wrong Answer, 5=TLE, 6=Compile Error, 7=SIGSEGV, 9=SIGFPE, 11=NZEC

## Specialized Docs — Use `@` References

CLAUDE.md covers project-wide rules. For **task-specific** work, reference the appropriate doc:

| When working on... | Read this |
|---------------------|-----------|
| Chatbot behavior, coaching rules, anti-gaming, Judge0 result handling | `@docs/chatbot-system-prompt.md` |
| Visualization code generation, tracer API, animation examples | `@docs/visualization-agent-prompt.md` |
| Adding/editing problems, test cases, Judge0 limits, starter code | `@docs/problem-data-reference.md` |
| Build steps, setup instructions, phased prompts | `@docs/BUILD_GUIDE.md` |

### What each doc contains:

**`docs/chatbot-system-prompt.md`** — The runtime LangChain system prompt for the Main Agent. Loaded by `src/lib/chatbot.ts`. Defines: identity, what context it receives per session (`problemDescription`, `editorial`, `codeContext`, `lastSubmissionResult`, `previouslySolved`), 7 core rules (never give solution, understand before responding, use failing test cases, react to Judge0 statuses, reference user's code, reference past problems, anti-gaming), when/how to trigger the Visualization Agent, and conversational style guidelines.

**`docs/visualization-agent-prompt.md`** — The runtime LangChain system prompt for the Visualization Agent. Loaded by `src/lib/visualization-agent.ts`. Defines: what it receives from the Main Agent, exact JSON response format (`{ type, code, description }`), full tracer API reference (`Array1DTracer`, `Array2DTracer`, `GraphTracer`, `LogTracer`, `ChartTracer` — all methods), 6 code generation rules, 3 complete working examples (binary search, two sum correct, two sum wrong approach), and common mistakes to avoid.

**`docs/problem-data-reference.md`** — Schema and examples for `src/data/problems.ts`. Includes: `Problem` TypeScript interface, Judge0 limits table by difficulty, two fully worked examples (Two Sum, Binary Search) with all fields populated (description, constraints, test cases, judge0Limits, starterCode, editorial), and the starter code pattern (why `main()` handles I/O so users only implement the `Solution` method).

## Testing Checklist

- [ ] `npm run build` succeeds
- [ ] `npm run typecheck` passes
- [ ] Judge0: submit known C++ code → status 3 (Accepted)
- [ ] Auth: Google sign-in works, unauthenticated users blocked from submit/chat
- [ ] Chatbot: responds with guidance, never gives full solution
- [ ] Visualization: viz JSON from chat renders animated tracer inline
- [ ] Home page: problem list renders, filters work, rows link to `/problems/[id]`
- [ ] Problem page: editor loads `starterCode`, Run/Submit execute via Judge0, results display