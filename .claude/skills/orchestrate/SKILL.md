---
name: orchestrate
description: Run the multi-phase build workflow
---

# Orchestration Workflow

When invoked, read the current state from CLAUDE.md "Completed Work" section
to determine which phase to execute next. Then delegate to the appropriate
subagent or agent team for that phase.

After each phase completes:
1. Verify the work (run migrations, type-check, lint)
2. Update CLAUDE.md "Completed Work" with file paths, exports, routes, socket events
3. Proceed to the next phase only after verification passes