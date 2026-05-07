---
date: 2026-05-07
agent-role: planner
agent-tool: claude-code
feature: general
type: context
---

# Initial repo scaffold

## What happened

Full repo scaffolded from scratch. Tech choices were made by the human + planner in the initial session before any feature work began.

## Why it matters

Every agent working in this repo starts here. The decisions below explain *why* things are set up the way they are — not just what exists.

## Key decisions

**Prisma (not raw pg)**
Prisma was chosen over `pg` + hand-written migrations. Migrations live in `apps/backend/prisma/migrations/`. The schema is at `apps/backend/prisma/schema.prisma`. Run `npm run db:migrate:dev -- --name <desc>` to create a new migration in dev. Never write raw SQL migrations manually.

**npm workspaces**
Three packages: `apps/backend`, `apps/frontend`, `packages/eslint-plugin-url-shorty`. All scripts run from the root. Use `-w apps/backend` to target a workspace.

**Custom ESLint plugin**
Four rules in `packages/eslint-plugin-url-shorty/index.js` actively steer agent behavior. These are not style rules — they enforce architecture. Violations fail CI. Always run `npm run check` (lint + typecheck) before opening a PR. The ESLint plugin itself stays as CommonJS JavaScript — ESLint plugins must be CJS.

**`.mcp.json` at root**
MCP servers (github, playwright) are defined in `.mcp.json` at the project root. Both Claude Code and Codex CLI read this file. Do not add MCP config to `.claude/settings.json`.

**AGENTS.md is the cross-tool entry point**
`AGENTS.md` is read by all agents regardless of tool. `CLAUDE.md` is Claude Code-specific and imports AGENTS.md. If you are adding instructions that should apply to all agents, put them in AGENTS.md.

**docs/ structure**
Follows the OpenAI harness pattern:
- `docs/references/*.llms.txt` — dense agent-optimized reference docs
- `docs/design-docs/` — architectural decisions (why)
- `docs/exec-plans/active/` — live work items
- `docs/product-specs/` — feature specs (Planner output)
- `docs/generated/` — auto-generated, do not edit

## Watch out for

- `redirect.ts` is the one route file where the `api-route-naming` ESLint rule is disabled. This is intentional — it handles `/:code` redirects which don't go under `/api/v1/`.
- The Prisma client singleton is at `apps/backend/src/db/index.ts`. Never instantiate `new PrismaClient()` inline in services or routes.
- Frontend's `api.ts` uses the Vite proxy in dev (no `VITE_API_BASE_URL` needed locally). The env var is for production deploys only.
- All source files are TypeScript: `apps/backend/src/**/*.ts`, `apps/frontend/src/**/*.tsx`. The ESLint plugin at `packages/eslint-plugin-url-shorty/index.js` stays as CommonJS JS — ESLint requires it.
- Backend uses `tsx` as the runner (no compilation). Type checking is `tsc --noEmit` via `npm run check`.
- Import paths in `.ts` files use `.js` extension (e.g. `import x from './foo.js'`) — TypeScript + tsx resolves them correctly.
