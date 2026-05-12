---
date: 2026-05-07
agent-role: worker
agent-tool: claude-code
feature: fix/5-prisma-lint-migrate
type: learning
---

# Prisma lint, initial migration, and client generation (issue #5)

## What happened

Set up Prisma schema linting, generated the Prisma client, and created the initial DB migration.

Changes:
- Installed `prisma-lint ^0.13.1` as a dev dependency in `apps/backend`
- Created `apps/backend/.prismalintrc.json` with four rules: `model-name-pascal-case`, `field-name-camel-case`, `model-name-mapping-snake-case` (with `pluralize: true`), `field-name-mapping-snake-case`
- Fixed two lint errors in `prisma/schema.prisma`: added `@map("original_url")` to `originalUrl` and `@map("created_at")` to `createdAt`
- Added `lint:prisma` and `check` scripts to `apps/backend/package.json`
- Wired `lint:prisma` into root `check` via `npm run lint:prisma -w apps/backend`
- Created `apps/backend/.env` from `.env.example` (not committed — covered by root `.gitignore`)
- Created initial migration `20260507214446_init` and applied it to local Postgres
- Documented `prisma-lint` in `docs/references/dependencies.md`

## Why it matters

Future agents can now rely on `npm run check` to validate both ESLint rules and Prisma schema conventions. The initial migration exists — new migrations must be created with `prisma migrate dev --name <desc>` run from `apps/backend/`.

## Update (2026-05-12) — Prisma 7 upgrade (reviewer feedback on PR #6)

Upgraded Prisma 5.22.0 → 7.8.0 to fix the `url` datasource warning flagged by the IDE language server.

Additional changes required by Prisma 7:
- `url = env("DATABASE_URL")` removed from `datasource db` in `schema.prisma`; connection URL moved to `apps/backend/prisma.config.ts` (for CLI) using `defineConfig({ datasource: { url } })`
- Prisma 7 runtime `PrismaClient` with engine type `"client"` **requires** either `adapter` or `accelerateUrl` — it no longer reads `DATABASE_URL` automatically
- Installed `@prisma/adapter-pg ^7.8.0` and `pg`; `apps/backend/src/db/index.ts` now constructs `new PrismaPg(process.env.DATABASE_URL)` and passes it as `adapter` to `PrismaClient`
- `prisma.config.ts` at `apps/backend/prisma.config.ts` loads `dotenv/config` and exports `defineConfig({ datasource: { url: process.env.DATABASE_URL } })`

## Watch out for

- **`prisma migrate dev --name` must be run directly**: `npm run db:migrate:dev -- --name foo` from root does NOT pass `--name` through to Prisma. Run `cd apps/backend && npx prisma migrate dev --name <desc>` instead, or use `npm run db:migrate:dev -w apps/backend -- --name <desc>` only if the root script supports arg passthrough.
- **`apps/backend/.env` is required locally**: The root `.env` is NOT picked up by Prisma CLI commands run from `apps/backend/`. Copy from `.env.example` and set `DATABASE_URL`.
- **`model-name-mapping-snake-case` is configured with `pluralize: true`**: The `Url` model maps to `urls` (plural), which the rule accepts with pluralize. Without `pluralize: true`, the rule would flag `@@map("urls")` as wrong (expecting `@@map("url")`).
- **`@map` annotations change DB column names in the migration**: `originalUrl` → column `original_url`, `createdAt` → column `created_at`. Any future raw SQL must use the snake_case column names.
- **Prisma advisory lock**: Running `prisma migrate dev` while another instance holds the lock causes P1002 timeout. Kill stale prisma processes before retrying.
- **Prisma 7 runtime requires a driver adapter**: `new PrismaClient()` with no options throws `PrismaClientInitializationError`. You must pass `{ adapter }` (or `{ accelerateUrl }`). The old env-var auto-pickup is gone. Always instantiate via `src/db/index.ts` — never call `new PrismaClient()` inline.
- **`prisma.config.ts` must load dotenv**: `import 'dotenv/config'` must come before `process.env.DATABASE_URL` is read; otherwise CLI commands fail with an undefined URL in non-Docker environments.
