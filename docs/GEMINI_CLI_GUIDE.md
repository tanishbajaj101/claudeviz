# Using Gemini CLI for Large Codebase Analysis

Use `gemini -p` to leverage Google Gemini's massive context window for analyzing large portions of the codebase that would exceed Claude's context limits. This saves tokens and is ideal for read-only analysis across many files.

## When to Use Gemini CLI

- Analyzing entire directories or the full codebase (100KB+ of files)
- Comparing multiple large files simultaneously
- Understanding project-wide patterns or architecture
- Verifying if specific features, patterns, or security measures are implemented across the codebase
- Checking for coding patterns, missing implementations, or inconsistencies at scale

## File and Directory Inclusion Syntax

Use the `@` prefix to include files and directories. Paths are **relative to the current working directory** when invoking `gemini`.

### Single file
```bash
gemini -p "@src/main.py Explain this file's purpose and structure"
```

### Multiple files
```bash
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"
```

### Entire directory
```bash
gemini -p "@src/ Summarize the architecture of this codebase"
```

### Multiple directories
```bash
gemini -p "@src/ @tests/ Analyze test coverage for the source code"
```

### Current directory (everything)
```bash
gemini -p "@./ Give me an overview of this entire project"
# Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"
```

## AlgoArena-Specific Examples

### Full architecture review
```bash
gemini -p "@packages/ Summarize the architecture and data flow of this monorepo"
```

### Check frontend component patterns
```bash
gemini -p "@packages/frontend/src/components/ Are all components following React functional component + hooks patterns? List any that don't"
```

### Verify API endpoint coverage
```bash
gemini -p "@packages/backend/src/routes/ @packages/frontend/src/ Are all backend API endpoints being consumed by the frontend? List any unused or missing integrations"
```

### Check Socket.IO implementation consistency
```bash
gemini -p "@packages/backend/src/socket/ @packages/frontend/src/hooks/useSocket.ts Are all Socket.IO events properly handled on both client and server? List mismatches"
```

### Verify security measures
```bash
gemini -p "@packages/backend/src/ Is proper input validation and sanitization implemented for all API endpoints? Are there any SQL injection or XSS vulnerabilities?"
```

### Check for implementation completeness
```bash
gemini -p "@packages/frontend/src/ @packages/backend/src/ Has dark mode / theming been fully implemented? Show all relevant files and any gaps"
```

### Audit error handling
```bash
gemini -p "@packages/backend/src/routes/ Are all route handlers wrapped in try-catch? List any endpoints missing proper error handling"
```

### Check test coverage
```bash
gemini -p "@packages/ @tests/ What test coverage exists? Which modules are untested?"
```

### Review database usage patterns
```bash
gemini -p "@packages/backend/src/ Are all database queries using Prisma correctly? List any raw queries or potential N+1 issues"
```

### Verify authentication flow
```bash
gemini -p "@packages/backend/src/middleware/ @packages/backend/src/routes/ @packages/backend/src/config/auth.ts Are all protected routes using the auth middleware? List any unprotected endpoints that should be protected"
```

## Important Notes

- `gemini -p` is **read-only** — no `--yolo` flag needed for analysis
- Paths in `@` syntax are relative to your current working directory
- The CLI includes file contents directly in the context
- Best for broad analysis; for targeted searches (specific function/class), use Grep/Glob directly
- Do not use for writing code — use it for analysis, then implement changes with Claude's tools
