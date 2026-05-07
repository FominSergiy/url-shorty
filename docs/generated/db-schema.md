# DB Schema (generated from Prisma)

> Auto-generated from `apps/backend/prisma/schema.prisma`. Do not edit manually.
> Regenerate with: `npx prisma generate && npx prisma migrate status`

## Table: urls

| Column | Type | Constraints |
|---|---|---|
| `id` | `INTEGER` | Primary key, auto-increment |
| `code` | `VARCHAR(12)` | Unique, not null |
| `original_url` | `TEXT` | Not null |
| `created_at` | `TIMESTAMPTZ` | Default: `now()` |
| `clicks` | `INTEGER` | Default: `0` |

## Indexes

| Index | Column | Type |
|---|---|---|
| `urls_pkey` | `id` | Primary key |
| `urls_code_key` | `code` | Unique |

## Prisma model

```prisma
model Url {
  id          Int      @id @default(autoincrement())
  code        String   @unique @db.VarChar(12)
  originalUrl String
  createdAt   DateTime @default(now())
  clicks      Int      @default(0)

  @@map("urls")
}
```

## Migration history

Migrations tracked by Prisma in `apps/backend/prisma/migrations/`.
Run `npm run db:migrate` to apply pending migrations.
Run `npm run db:migrate:dev -- --name <description>` to create a new migration in dev.
