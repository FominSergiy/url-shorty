# Frontend

## Stack

- **React 18** + **Vite 5** + **TypeScript** — dev server on `:3000`
- **Playwright** — e2e tests in `apps/frontend/e2e/`
- **ESLint** + `@typescript-eslint` — same root config as backend

## Folder layout

```
apps/frontend/src/
  main.tsx          ← React entry, mounts App to #root
  App.tsx           ← root component, owns result/error state
  api.ts            ← ALL fetch() calls live here — nowhere else
  components/
    ShortenForm.tsx ← URL input + submit
    ResultCard.tsx  ← displays short link + copy button
    StatsView.tsx   ← click stats (add when needed)

apps/frontend/e2e/
  shorten.spec.ts   ← Playwright tests
```

## Rules

- **All API calls go through `src/api.ts`** — no `fetch()` inline in components
- Read base URL from `import.meta.env.VITE_API_BASE_URL` — no hardcoded strings
- Components are props-driven: receive typed props and callbacks, no direct fetch inside
- Every interactive element must have a `data-testid` attribute (Playwright relies on these)
- Export interfaces for all API response shapes from `api.ts` — import them in components

## Adding a new API call

1. Add the response interface and function to `src/api.ts`
2. Import both in the component
3. Call the function from an event handler or effect
4. Never import `api.ts` functions inside other `api.ts` functions

## Vite proxy

In dev, `/api/*` requests are proxied to `http://localhost:3001` (configured in `vite.config.ts`). The `VITE_API_BASE_URL` env var is only needed in production.

## Type checking

```bash
npm run typecheck -w apps/frontend   # tsc --noEmit
npm run check                        # lint + typecheck both workspaces
```

Type errors fail CI. Fix them before opening a PR.

## E2E tests (Playwright)

Tests live in `apps/frontend/e2e/`. Run with `npm run test:e2e -w apps/frontend`.

Use `data-testid` selectors — not CSS classes or text:
```ts
page.getByTestId('url-input')
page.getByTestId('shorten-btn')
page.getByTestId('short-url')
page.getByTestId('copy-btn')
```

Agents working on UI features: **run `npm run test:e2e` before opening a PR**. Use Playwright MCP to test interactively during development.

## Visual regression

After implementing a UI feature, capture a baseline screenshot:
```ts
await expect(page).toHaveScreenshot('feature-name.png');
```
Store baselines in `docs/design-docs/mocks/`.
