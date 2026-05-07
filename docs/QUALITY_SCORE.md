# Quality Score

A PR is mergeable when all boxes are checked. Reviewer agents use this as the merge checklist.

## Code quality

- [ ] No direct DB calls in route files (lint rule: `url-shorty/no-direct-db-in-routes`)
- [ ] All async route handlers have `try/catch` + `next(err)` (lint rule: `url-shorty/require-error-handling-in-async`)
- [ ] No hardcoded URLs (lint rule: `url-shorty/no-hardcoded-urls`)
- [ ] API routes follow `/api/v1/` naming (lint rule: `url-shorty/api-route-naming`)
- [ ] `npm run check` exits 0 (lint + typecheck — both must pass)
- [ ] No `any` types introduced without a comment explaining why

## Tests

- [ ] `npm test` exits 0 (unit tests)
- [ ] New code path has at least one unit test
- [ ] If frontend changed: `npm run test:e2e` exits 0

## Design compliance (UI changes only)

- [ ] Only design tokens from `docs/DESIGN.md` used (no new colors, font sizes, or spacing values)
- [ ] All interactive elements have `data-testid`
- [ ] Matches ASCII mockup in `docs/DESIGN.md`

## Agent memory

- [ ] A memory entry was written to `docs/agent-memory/entries/` describing decisions, learnings, or blockers from this PR
- [ ] The entry is indexed in `docs/agent-memory/INDEX.md`

## PR hygiene

- [ ] PR template fully filled (`Summary`, `Changes`, `Docs referenced`, `Test plan`)
- [ ] Branch is `feat/*`, `fix/*`, or `chore/*` — not `main`
- [ ] No out-of-scope file changes (matches issue `Affected files` list)

## Escalation

If any box is unchecked after 3 review rounds, the Worker comments:
> "Needs human review after 3 agent iterations."
and assigns the PR to the repo owner.
