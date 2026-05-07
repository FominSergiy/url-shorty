# Agent Memory Index

This index is the first thing agents read when starting a session.
Scan it to find entries relevant to your current feature or area.
After completing work, append a row here and create the entry file.

**Sorted: newest first.**

## Protocol

### Before starting work
1. Read this index
2. Find entries where `Feature/Area` overlaps with your task
3. Read those entry files — they contain decisions, learnings, and blockers

### After completing work (mandatory)
1. Create `docs/agent-memory/entries/YYYY-MM-DD-<slug>.md` (use the template below)
2. Append a row to the table in this file
3. If your entry contains a learning that overrides an older entry, note it with `(supersedes YYYY-MM-DD-<slug>)`

## Entry types

| Type | When to use |
|---|---|
| `decision` | An architectural or design choice was made that isn't obvious from the code |
| `learning` | Something discovered about the codebase that isn't documented elsewhere |
| `blocker` | Something that blocked work — helps future agents avoid the same trap |
| `context` | Background needed to understand a feature or area |

## Entry template

```markdown
---
date: YYYY-MM-DD
agent-role: planner | worker | reviewer
agent-tool: claude-code | codex-cli | other
feature: feat/<name> | fix/<name> | general
type: decision | learning | blocker | context
---

# <Title>

## What happened
[What you did or observed]

## Why it matters
[What future agents need to know because of this]

## Watch out for
[Specific traps, gotchas, or things that broke]
```

---

## Index

| Date | Type | Feature/Area | Agent | Summary | File |
|---|---|---|---|---|---|
| 2026-05-07 | context | scaffold | claude-code | Initial repo setup — Prisma, workspaces, ESLint plugin, MCP config | [2026-05-07-initial-scaffold.md](entries/2026-05-07-initial-scaffold.md) |
