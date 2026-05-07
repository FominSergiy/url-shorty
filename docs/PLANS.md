# Plans

## Active work

Live execution plans are in `docs/exec-plans/active/`. Each file is one initiative.

## Workflow

```
main (protected)
  └── feat/<issue>-<name>   ← Worker branch
        └── PR → review → squash merge
```

### Branch naming
| Prefix | Use |
|---|---|
| `feat/` | New features (`feat/12-stats-endpoint`) |
| `fix/` | Bug fixes (`fix/14-click-count-race`) |
| `chore/` | Non-code (`chore/update-deps`) |

### Commit format
```
<type>(<scope>): <description>

Types: feat | fix | chore | docs | test | refactor
Scopes: backend | frontend | db | harness
```

### PR lifecycle
1. Worker creates `feat/*` from `main`
2. Implements, runs `npm run lint && npm test`
3. Opens PR (fills `.github/PULL_REQUEST_TEMPLATE.md`)
4. CI runs lint + tests
5. Reviewer reviews (max 3 rounds)
6. Reviewer approves → squash merge to `main`

### GitHub MCP calls

**Open a PR (Worker):**
```
mcp_github_create_pull_request({
  owner: "<owner>", repo: "url-shorty",
  title: "feat(backend): add stats endpoint",
  body: "<filled template>",
  head: "feat/12-stats-endpoint", base: "main"
})
```

**Post a review (Reviewer):**
```
mcp_github_create_review({
  owner: "<owner>", repo: "url-shorty",
  pull_number: <N>, event: "REQUEST_CHANGES",
  comments: [{ path, position, body }]
})
```

**Merge (Reviewer after approval):**
```
mcp_github_merge_pull_request({
  owner: "<owner>", repo: "url-shorty",
  pull_number: <N>, merge_method: "squash"
})
```

## Tech debt

See `docs/exec-plans/tech-debt-tracker.md`.
