# url-shorty

A URL shortener. Backend: Node/Express + Prisma + TypeScript. Frontend: React + TypeScript. DB: Postgres.

> **Read the relevant docs before touching any code. Do not inline architecture here.**

## Navigation

| Topic | File |
|---|---|
| System topology, ports, API routes, env vars | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Architectural principles and why | [docs/design-docs/core-beliefs.md](docs/design-docs/core-beliefs.md) |
| JS conventions, folder layout, service layer | [docs/references/express-llms.txt](docs/references/express-llms.txt) |
| Prisma ORM usage | [docs/references/prisma-llms.txt](docs/references/prisma-llms.txt) |
| DB schema | [docs/generated/db-schema.md](docs/generated/db-schema.md) |
| UI design tokens and mockups | [docs/DESIGN.md](docs/DESIGN.md) |
| Frontend conventions and Playwright | [docs/FRONTEND.md](docs/FRONTEND.md) |
| Agent roles: Planner, Worker, Reviewer | [docs/agent-roles.md](docs/agent-roles.md) |
| Branch naming, PR lifecycle, GitHub MCP calls | [docs/PLANS.md](docs/PLANS.md) |
| PR merge checklist | [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md) |
| Security rules | [docs/SECURITY.md](docs/SECURITY.md) |
| Active work | [docs/exec-plans/active/](docs/exec-plans/active/) |
| Product specs | [docs/product-specs/index.md](docs/product-specs/index.md) |
| **Agent memory (shared logs)** | [docs/agent-memory/INDEX.md](docs/agent-memory/INDEX.md) |

## Your role

You will be assigned one of three roles in your prompt. Declare it at the start of your response.

| Role | Tool | Responsibility |
|---|---|---|
| **Planner** | Claude Code | Breaks feature request into GitHub issues with structured specs |
| **Worker** | Codex CLI or any coding agent | Implements one issue on a feature branch, opens PR |
| **Reviewer** | Claude Code | Reviews PRs, posts inline comments, approves and merges |

If your role is not specified, ask before doing anything.

## Shared memory — mandatory

Agents share state through `docs/agent-memory/`. This is how you pick up context from previous agents and leave context for future ones.

**At the start of every session:**
1. Read `docs/agent-memory/INDEX.md`
2. Read any entries where `Feature/Area` overlaps with your task

**At the end of every session (after PR is merged or work is blocked):**
1. Create `docs/agent-memory/entries/YYYY-MM-DD-<slug>.md` using the template in INDEX.md
2. Append one row to the index table in INDEX.md
3. Commit the memory files on the same branch as your work (or directly to main for general learnings)

Entry types: `decision` | `learning` | `blocker` | `context`

---

## Hard rules (all agents, all tools)

- `npm run check && npm test` must pass before opening any PR (`check` = lint + typecheck)
- Never commit directly to `main`
- All DB access goes through `apps/backend/src/services/` — never from route files
- Use only the Prisma singleton from `src/db/index.ts` — never `new PrismaClient()` inline
- Base URLs must come from environment variables — no hardcoded `http://` strings
- Every PR must fill `.github/PULL_REQUEST_TEMPLATE.md`

## Build & test commands

```bash
npm install                  # install all workspaces
docker compose up -d         # start Postgres
npm run db:migrate           # apply Prisma migrations
npm run db:generate          # regenerate Prisma client after schema changes
npm run dev                  # start backend (:3001) + frontend (:3000)
npm run lint                 # ESLint with custom url-shorty rules
npm run typecheck            # tsc --noEmit on both workspaces
npm run check                # lint + typecheck (run this before every PR)
npm test                     # Vitest unit tests (backend)
npm run test:e2e             # Playwright e2e (frontend)
```

## MCP servers

Defined in `.mcp.json` at the project root. Both Claude Code and Codex CLI read this file.

| Server | Use |
|---|---|
| `github` | PR operations — create, review, merge via GitHub MCP tools |
| `playwright` | UI testing — navigate, click, assert in a real browser |


`GITHUB_TOKEN` is configured and defined in `.env` file - use it for github mcp

## Lint rules that block CI

| Rule | What it catches |
|---|---|
| `url-shorty/no-direct-db-in-routes` | `prisma.*` or `db.*` called in route files |
| `url-shorty/require-error-handling-in-async` | async handlers without try/catch |
| `url-shorty/no-hardcoded-urls` | `http://` string literals outside config |
| `url-shorty/api-route-naming` | routes not starting with `/api/v1/` |
