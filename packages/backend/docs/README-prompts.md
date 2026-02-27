# AlgoArena — Prompt Architecture for Claude Code

## File Structure

```
algoarena/
├── CLAUDE.md                              ← Claude Code reads this automatically
├── docs/
│   ├── chatbot-system-prompt.md           ← Runtime prompt for Main Chatbot Agent
│   ├── visualization-agent-prompt.md      ← Runtime prompt for Visualization Agent
│   └── problem-data-reference.md          ← Schema + examples for adding problems
└── .env.local                             ← Secrets (never commit)
```

## How It Works with Claude Code

### `CLAUDE.md` (Project Root)
- Claude Code loads this as the **first user message** at the start of every session
- Contains: stack, architecture, commands, code style, critical rules, schemas
- Kept **lean and scannable** — only universally applicable instructions
- Every instruction here is relevant to any task you'd ask Claude Code to do on this project

### `docs/chatbot-system-prompt.md`
- This is **NOT** read by Claude Code automatically
- It's the system prompt that gets injected into **LangChain** at runtime for the Main Chatbot Agent
- Claude Code uses it as reference when building or modifying `src/lib/chatbot.ts`
- Contains: coaching behavior, anti-gaming rules, Judge0 status handling, visualization triggers

### `docs/visualization-agent-prompt.md`
- Also NOT read by Claude Code automatically
- It's the system prompt for the **Visualization Agent** (called as a LangChain tool)
- Claude Code uses it as reference when building or modifying `src/lib/visualization-agent.ts`
- Contains: tracer API reference, code generation rules, three full examples, common mistakes

### `docs/problem-data-reference.md`
- Reference for adding new problems to `src/data/problems.ts`
- Contains: Judge0 limits guidelines, two complete example problems, starter code pattern

## Usage

When working with Claude Code on this project:

```bash
# Claude Code automatically reads CLAUDE.md
claude

# To reference the chatbot prompt specifically:
# "Look at @docs/chatbot-system-prompt.md and update the LangChain agent setup"

# To add a new problem:
# "Look at @docs/problem-data-reference.md and add a 'Valid Parentheses' problem"

# To modify visualization behavior:
# "Look at @docs/visualization-agent-prompt.md and add support for GraphTracer examples"
```

## Why This Split?

Claude Code works best when `CLAUDE.md` contains **only universally applicable instructions** (per Anthropic's guidance). Claude Code's system prompt includes a reminder to ignore CLAUDE.md content that isn't relevant to the current task — so bloating it with chatbot behavior rules, visualization examples, and problem schemas would make it ignore more of it.

Instead:
- `CLAUDE.md` = project-wide rules Claude Code always needs
- `docs/*.md` = task-specific context Claude Code reads when you `@`-reference them
