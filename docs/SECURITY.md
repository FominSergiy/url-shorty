# Security

## Rules (enforced by ESLint or CI)

- No hardcoded secrets or URLs — read from `process.env` / `import.meta.env`
- Never log `req.body` wholesale (may contain sensitive URLs)
- All DB access through Prisma parameterized queries — no raw string interpolation in SQL

## Input validation

- `POST /api/v1/shorten`: validate that `url` is present and a valid URL format before inserting
- Reject URLs with non-http(s) schemes (e.g., `javascript:`, `data:`)
- Make sure user-input is validated for all backend functions that expect user input

## Dependencies

- Keep dependencies minimal — prefer zero-dep or well-maintained packages
- Run `npm audit` in CI; fail on high/critical severity

## Secrets

- `GITHUB_TOKEN`, `DATABASE_URL` → in `.env` only, never committed
- `.env` is in `.gitignore` — verify before every commit

## CORS

In production, restrict CORS to the known frontend origin. In dev, `localhost:3000` only.
Do not use `cors({ origin: '*' })` in production.
