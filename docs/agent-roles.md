# Agent Roles

Three roles exist. Each session is assigned exactly one role. The full loop is:

```
Planner → creates GitHub issue with structured spec
              ↓
Worker  → implements on feat/* branch, opens PR
              ↓
Reviewer → reviews, comments, worker iterates (max 3 rounds)
              ↓
Reviewer → approves + merges
```

---

## Planner Agent

**Typical tool**: Claude Code (has access to GitHub MCP and project docs)

### Responsibilities
- Receive a high-level feature request from the human
- Read `docs/architecture.md` and `docs/code-design.md` to understand constraints
- Break the feature into one or more concrete GitHub issues
- Write each issue so a Worker agent can act on it without asking questions

### Issue format (must use this structure)
```markdown
## Goal
[One sentence: what the user should be able to do after this is merged]

## Affected files
- apps/backend/src/routes/...
- apps/backend/src/services/...
- apps/frontend/src/...

## Acceptance criteria
- [ ] Specific, testable condition
- [ ] Another condition

## Constraints
- Follow docs/code-design.md service-layer rule
- [Any other relevant constraints from architecture.md]

## Out of scope
- [What the worker should NOT change]
```

### What Planners must NOT do
- Implement code
- Open PRs
- Make assumptions about the UI without reading `docs/ui/design.md`

---

## Worker Agent

**Typical tool**: OpenAI Codex CLI, Claude Code, or any coding agent

### Responsibilities
- Implement the feature described in the assigned GitHub issue
- Read `docs/architecture.md`, `docs/code-design.md`, and `docs/ui/design.md` (for UI work) before writing code
- Work exclusively on a feature branch (`feat/<issue-number>-<short-name>`)
- Writes unit tests for backend and frontend features
- Writes playwright tests for ui featues
- Run `npm run lint && npm test` — fix all failures before opening a PR
- Open a PR via GitHub, filling the PR template completely

### Workflow
1. Read the GitHub issue (all sections, especially constraints)
2. Read the relevant docs/ files
3. `git checkout -b feat/<issue-number>-<short-name>`
4. Implement — follow service layer, error handling, naming rules
5. `npm run lint && npm test` — fix until green
6. Open PR with filled template
7. Read reviewer comments → push fixes to same branch → re-request review

### What Workers must NOT do
- Commit to `main` directly
- Open PRs with failing lint or tests
- Call `db.query()` from route files
- Hardcode URLs
- Change files outside the scope listed in the issue

---

## Reviewer Agent

**Typical tool**: Claude Code (has access to GitHub MCP)

### Responsibilities
- Read the PR diff and linked issue
- Verify code against `docs/code-design.md`
- Post specific inline comments via GitHub
- verifies UI featues with playwright mcp - these have to pass
- Approve + merge when clean

### Review checklist
- [ ] No direct DB calls in route files
- [ ] All async handlers have try/catch + next(err)
- [ ] No hardcoded URLs
- [ ] API routes follow `/api/v1/` naming (except redirect.js)
- [ ] Frontend API calls go through `src/api.js`
- [ ] UI changes match `docs/ui/design.md` tokens
- [ ] PR template fully filled
- [ ] Lint green, tests pass, new code path covered

### Comment format
```
**Issue**: [what is wrong]
**Rule**: [which docs/code-design.md rule this violates]
**Fix**: [exactly what the worker should do]
```

### What Reviewers must NOT do
- Push code
- Approve PRs with open lint/test failures
- Leave vague comments without a Fix

---

## Multi-tool loop example

```
Human: "Add click stats endpoint"
  │
  └─ Claude (Planner) → creates GitHub issue #12
                          │
                          └─ Codex CLI (Worker) → reads issue #12
                                                   implements stats route
                                                   opens PR #7
                                                        │
                                                        └─ Claude (Reviewer) → reviews PR #7
                                                                               requests changes
                                                                                    │
                                                                                    └─ Codex CLI (Worker) → pushes fix
                                                                                                            │
                                                                                                            └─ Claude (Reviewer) → approves + merges
```

The GitHub issue is the handoff artifact between Planner and Worker.
The PR is the handoff artifact between Worker and Reviewer.
Both artifacts are persistent — agents pick up work by reading them, not by being in the same session.

---

## Escalation

Maximum 3 review rounds per PR. After round 3, the Worker comments:
> "Needs human review after 3 agent iterations."

and assigns the PR to the human.
