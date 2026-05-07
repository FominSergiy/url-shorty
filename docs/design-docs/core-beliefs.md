# Core Beliefs

These are the architectural principles that drive decisions in this codebase.
When in doubt, default to these. Deviations require a design-docs entry explaining why.

## 1. Service layer is the DB boundary

Routes handle HTTP concerns (request parsing, response shaping, error propagation).
Services handle data concerns (DB queries, business logic, data transformation).
The two must not mix. This makes each layer independently testable and prevents
agent-written code from scattering DB logic across the codebase.

## 2. Agents need machine-checkable rules

Every architectural rule that matters has a corresponding ESLint rule.
If a rule isn't enforced by the linter, agents will eventually violate it.
Lint failures are CI failures — they block merges, giving agents actionable error messages.

## 3. No hidden state — env vars only

Base URLs, DB connections, and configuration live in environment variables.
No hardcoded values, no config objects built from string literals.
This makes the codebase portable and prevents agents from embedding localhost addresses
that break in other environments.

## 4. GitHub is the state machine

Agents don't coordinate by passing messages. They coordinate through GitHub artifacts:
issues (Planner → Worker handoff) and PRs (Worker → Reviewer handoff).
This means any agent tool can participate — the interface is GitHub, not a shared session.

## 5. Minimum surface area

One framework (Express), one ORM (Prisma), one test runner per layer (Vitest/Playwright).
Adding a second way to do the same thing doubles the surface area agents must reason about.
Resist adding convenience libraries; prefer explicit code.

## 6. Docs are agent-consumable first

Every doc in this repo is written to be read by an AI agent, not a human.
Prefer tables over prose, explicit file paths over vague references, and
ASCII mockups over descriptions of mockups. Human readers can read agent-targeted docs;
agents struggle with human-targeted prose.
