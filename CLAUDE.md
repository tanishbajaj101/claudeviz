# AlgoArena

A LeetCode alternative with AI-guided DSA coaching, algorithm visualizations, integrated code editor, and Judge0-powered execution.

## Stack

- **Framework**: Next.js 14+ (App Router, TypeScript strict mode)
- **Styling**: Tailwind CSS — utility classes only, no custom CSS files
- **Auth**: NextAuth.js with Google OAuth 2.0
- **Code Editor**: `react-simple-code-editor` + Prism.js (C++ only, `language_id: 54`)
- **Code Execution**: Judge0 CE API (self-hosted or RapidAPI)
- **AI Chatbot**: LangChain → two-agent system (Main Agent + Visualization Agent)
- **Visualization**: Custom tracer library (Array1DTracer, GraphTracer, LogTracer, etc.) executed client-side via web worker

## Architecture

```
/src
  /app
    page.tsx                    # Home: filterable problem list
    /problems/[id]/page.tsx     # Problem workspace (split-pane)
    /profile/page.tsx           # User progress + submission history
    /auth/signin/page.tsx       # Google OAuth sign-in
    /api
      /chat/route.ts            # LangChain chatbot endpoint
      /judge/route.ts           # Judge0 proxy (base64, polling, results)
      /auth/[...nextauth]/route.ts
  /components
    /ui                         # Shared design system components
    /chat                       # Chat panel, message bubbles, viz renderer
    /editor                     # Code editor wrapper
    /visualization              # Tracer renderers, web worker bridge
    /problems                   # Problem list, filters, cards
    /layout                     # Navbar, sidebar, split-pane
  /lib
    judge0.ts                   # Judge0 API client
    chatbot.ts                  # LangChain agent setup
    visualization-agent.ts      # Visualization code generator
    auth.ts                     # NextAuth config
    problems.ts                 # Problem data loader
  /data
    problems.ts                 # Problem definitions (see schema below)
  /types
    index.ts                    # All TypeScript interfaces
  /hooks                        # Custom React hooks
```

## Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript strict check

## Code Style

- TypeScript strict mode, no `any` types
- Use named exports, not default exports
- React: functional components only, prefer hooks
- File naming: `kebab-case.ts` for utils, `PascalCase.tsx` for components
- Imports: absolute paths via `@/*` alias
- All API routes return typed JSON responses — never raw strings

## Environment Variables

Required in `.env.local` (NEVER commit this file):

```
JUDGE0_API_URL=
JUDGE0_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
OPENAI_API_KEY=
```

## Critical Rules

- NEVER hardcode problem data in components. All problems come from `/data/problems.ts` and are injected dynamically.
- NEVER expose Judge0 API key to the client. All Judge0 calls go through `/api/judge`.
- NEVER expose the editorial to the user in the chatbot. It's internal-only context for the AI.
- All Judge0 submissions use `base64_encoded=true`. Encode `source_code`, `stdin`, and `expected_output`.
- The chatbot NEVER gives users the full coded solution. It guides, nudges, and visualizes — never solves.

## Judge0 Integration

Language: C++ (GCC 9.2.0) → `language_id: 54`

Every submission includes resource limits from the problem definition:

| Parameter | What it controls | Unit |
|-----------|-----------------|------|
| `cpu_time_limit` | Pure CPU computation time (OS scheduling excluded) | seconds |
| `cpu_extra_time` | Grace period after CPU limit for accurate reporting | seconds (default 0.5) |
| `wall_time_limit` | Total real-world elapsed time (includes I/O, sleep, waits) | seconds |
| `memory_limit` | Maximum process memory (RSS) | kilobytes |
| `stack_limit` | Stack size (relevant for deep recursion) | kilobytes |

Status codes: 3=Accepted, 4=Wrong Answer, 5=TLE, 6=Compilation Error, 7=SIGSEGV, 9=SIGFPE, 11=NZEC

## Problem Data Schema

Every problem in `/data/problems.ts` must follow this structure:

```typescript
interface Problem {
  id: string;                    // URL slug
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  description: string;           // Markdown
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  testCases: { input: string; expectedOutput: string }[];
  judge0Limits: {
    cpu_time_limit: number;      // Easy=2, Medium=3, Hard=5
    wall_time_limit: number;     // Typically 2-3x cpu_time_limit
    memory_limit: number;        // 256000 (256MB) typical
    stack_limit: number;         // 64000 (64MB), 128000 for recursion
  };
  languageId: 54;
  starterCode: string;           // C++ boilerplate with main() + I/O
  editorial: string;             // Markdown. INTERNAL ONLY.
  acceptanceRate?: number;
}
```

## Chatbot Agent System

Two LangChain agents behind `/api/chat`:

### Main Agent
- Receives: problem context, user message, user's current code, last submission result
- Behavior: understand approach → encourage or nudge → use failing test cases → delegate visualization when dry-run needed
- NEVER reveals editorial or full solution

### Visualization Agent
- Triggered by Main Agent when a test case walkthrough would help
- Generates self-contained JavaScript using the tracer library
- Must insert `Tracer.delay()` at every pedagogically meaningful checkpoint
- Returns: `{ "type": "visualization", "code": "...", "description": "..." }`
- Rendered inline in chat panel via web worker

Tracer API quick reference:
- `Array1DTracer` / `Array2DTracer` — array visualization
- `GraphTracer` — trees and graphs
- `LogTracer` — step-by-step text narration
- `ChartTracer` — bar charts
- `tracer.select(i)` / `deselect(i)` — highlight range
- `tracer.patch(i)` / `depatch(i)` — highlight single element
- `logger.println(msg)` — add narration line
- `Tracer.delay()` — animation breakpoint
- `Layout.setRoot(new VerticalLayout([...]))` — arrange tracers

## Testing

- Verify Judge0 integration: submit known C++ code, confirm status 3 (Accepted)
- Verify chatbot: send a message with problem context, confirm response is guidance (not solution)
- Verify visualization: trigger a viz response, confirm JSON parses and code executes in web worker
- Verify auth: confirm Google sign-in flow works, unauthenticated users can't submit or chat
