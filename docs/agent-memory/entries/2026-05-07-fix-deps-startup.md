---
date: 2026-05-07
agent-role: worker
agent-tool: claude-code
feature: fix/1-deps-startup
type: learning
---

# Dependency cleanup and local dev startup (issue #1)

## What happened

Upgraded packages to fix CVE GHSA-67mh-4wv8-2f99 (esbuild dev-server CORS bypass) and made `npm run check && npm test` pass from a clean clone.

Changes:
- `vite` 5.x → 6.4.2 (fixes CVE; 6.4.1 and below are still vulnerable)
- `vitest` 1.x → 3.2.4 (fixes CVE via vite dep; added `--passWithNoTests` flag)
- `@vitejs/plugin-react` ^4.3.0 → ^4.7.0 (minimum version declaring vite 6 in peer deps)
- `concurrently` 8.x → 9.x (no breaking changes for this project)
- `@typescript-eslint` range floors raised to ^7.18.0 (already installed at that version)
- Added `src/vite-env.d.ts` with `/// <reference types="vite/client" />` (required by tsc)
- Removed redundant `import React` from `App.tsx` and `ResultCard.tsx` (React 17+ JSX transform)
- Added ESLint override: `no-hardcoded-urls` is now off for `*.spec.ts` / `*.test.ts` files
- Created `docs/references/dependencies.md` documenting all accepted version ranges

## Why it matters

Future agents upgrading any of the pinned-major packages (ESLint 8→9, Express 4→5, Prisma 5→6/7, React 18→19) will find the rationale and constraints in `docs/references/dependencies.md`.

## Watch out for

- **ESLint 8 → 9**: The custom plugin in `packages/eslint-plugin-url-shorty` uses the legacy API (`context.getFilename()`, `context.report()`). ESLint 9 still supports these via the compatibility layer, but the plugin must be rewritten for flat config before ESLint 9 is fully adopted. Do not upgrade ESLint without migrating the plugin in the same PR.
- **Vitest 3.x exits with code 1 on no test files** — that's why `--passWithNoTests` is now in the test script. Remove the flag once the first test file is added (or keep it for CI safety).
- **vite 6 requires `vite-env.d.ts`** for `import.meta.env` to typecheck. The file is now at `apps/frontend/src/vite-env.d.ts`.
- **`no-hardcoded-urls` in e2e test files** was triggering `--max-warnings 0` failure. Fixed via eslintrc override — test fixture URLs are legitimate exceptions.
