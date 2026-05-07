# Dependency Versions

Accepted versions and pinning rationale for all direct dependencies.
Update this file whenever a version range is changed.

## Policy

- Prefer the latest stable minor/patch within the current major.
- Only bump a major if required to fix a security CVE or eliminate deprecation warnings — document why here.
- All changes must leave `npm install` producing zero vulnerabilities and `npm run check && npm test` passing.

---

## Root workspace

| Package | Range | Notes |
|---|---|---|
| `eslint` | `^8.57.0` | Pinned to ESLint 8.x. ESLint 9 introduces flat config format, which requires migrating `packages/eslint-plugin-url-shorty` from the legacy API (`context.getFilename()`, etc.). That migration is a standalone task — do not upgrade to ESLint 9 without migrating the plugin in the same PR. |
| `@typescript-eslint/eslint-plugin` | `^7.18.0` | Latest 7.x. v7 is the last major compatible with ESLint 8 alone. Upgrade to v8 when ESLint is upgraded to v9. |
| `@typescript-eslint/parser` | `^7.18.0` | Same constraint as the plugin — keep versions in sync. |
| `concurrently` | `^9.2.1` | No breaking changes affecting this project. Bumped from 8 to 9. |

## apps/backend

| Package | Range | Notes |
|---|---|---|
| `express` | `^4.19.2` | Express 5 changed error-handling middleware signatures. Upgrade is a separate task requiring route-file review. |
| `@prisma/client` | `^5.15.0` | Prisma 6/7 introduced breaking schema changes. Upgrade is a separate migration task. |
| `prisma` | `^5.15.0` | Keep in sync with `@prisma/client`. |
| `vitest` | `^3.2.4` | Upgraded from 1.x to fix CVE GHSA-67mh-4wv8-2f99 (esbuild dev-server vulnerability via vite). Vitest 3.x requires `--passWithNoTests` flag when no test files exist. |
| `prisma-lint` | `^0.13.1` | Prisma schema linter. Config at `apps/backend/.prismalintrc.json`. Rules: `model-name-pascal-case`, `field-name-camel-case`, `model-name-mapping-snake-case` (pluralize: true), `field-name-mapping-snake-case`. Runs via `npm run lint:prisma` and is included in `npm run check`. |
| `tsx` | `^4.15.0` | No known issues at this version. |
| `typescript` | `^5.5.0` | TypeScript 6 is not yet stable for production use. |
| `dotenv` | `^16.4.5` | No known issues. |
| `nanoid` | `^5.0.7` | No known issues. |

## apps/frontend

| Package | Range | Notes |
|---|---|---|
| `vite` | `^6.4.2` | Upgraded from 5.x to 6.4.2 to fix CVE GHSA-67mh-4wv8-2f99 (esbuild <=0.24.2 allows cross-origin requests to the dev server). All 5.x and 6.x versions up to 6.4.1 are affected. |
| `@vitejs/plugin-react` | `^4.7.0` | 4.7.0 is the minimum version that declares vite 6.x in its peer dependency range. |
| `react` / `react-dom` | `^18.3.1` | React 19 requires updating component patterns. Upgrade is a separate task. |
| `@types/react` | `^18.3.3` | Keep in sync with react major. |
| `@types/react-dom` | `^18.3.0` | Keep in sync with react-dom major. |
| `@playwright/test` | `^1.44.1` | No known issues at this version. |
| `typescript` | `^5.5.0` | Same as backend. |
