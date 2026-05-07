# Architecture

## System topology

```
Browser
  ├── GET /               → Frontend (React/Vite, :3000)
  │     └── fetch()       → Backend API (:3001)
  └── GET /:code          → Backend (:3001) → 302 redirect
```

## Services

| Service | Port | Command |
|---|---|---|
| Frontend (React/Vite) | 3000 | `npm run dev -w apps/frontend` |
| Backend (Express) | 3001 | `npm run dev -w apps/backend` |
| Postgres | 5432 | `docker compose up -d` |

## API surface

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/shorten` | Create short URL → `{ code, shortUrl }` |
| GET | `/:code` | Redirect to original URL, increments clicks |
| GET | `/api/v1/stats/:code` | Return `{ code, originalUrl, clicks, createdAt }` |

## Environment variables

**Backend** (copy `apps/backend/.env.example` → `.env`):
```
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/urlshorty
BASE_URL=http://localhost:3001
```

**Frontend** (copy `apps/frontend/.env.example` → `.env`):
```
VITE_API_BASE_URL=http://localhost:3001
```

## Data model (Prisma)

Schema lives at `apps/backend/prisma/schema.prisma`. Generated docs at `docs/generated/db-schema.md`.

```prisma
model Url {
  id          Int      @id @default(autoincrement())
  code        String   @unique @db.VarChar(12)
  originalUrl String
  createdAt   DateTime @default(now())
  clicks      Int      @default(0)
}
```

Migrations: `npm run db:migrate` (runs `prisma migrate deploy`).

## Package layout (npm workspaces)

```
apps/backend      Node/Express API + Prisma
apps/frontend     React/Vite SPA
packages/eslint-plugin-url-shorty   Custom ESLint rules
```

## Tech choices

| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript 5 | Strict mode; type errors fail CI via `npm run check` |
| Backend | Node 20 + Express 4 | Minimal, widely understood |
| Backend runner | `tsx` | Runs `.ts` files directly — no build step in dev |
| ORM | Prisma | Type-safe, migration-tracked, auto-generates TS types |
| Frontend | React 18 + Vite | Fast dev server, good Playwright support |
| Unit tests | Vitest | ESM-native, fast |
| E2E tests | Playwright | MCP-compatible for agent UI testing |
| Linting | ESLint + `@typescript-eslint` + custom plugin | Agent-steering rules that fail CI |
