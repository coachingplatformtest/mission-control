After reviewing manual-test-checklist, we need an architectural reset. Too many conflicting bugs, redundant implementations, and features built on top of broken foundations (especially data fetching), creating “partially working” behavior.

Switch to Historian mode. No coding, no file edits. Output ONLY the final kickoff prompt text. Do not include analysis, commentary, or multiple variants—only the final prompt. Do not propose solutions—only write the kickoff prompt.

Write a single kickoff prompt for a new OpenClaw lead that will rebuild the system cleanly while preserving feature intent and avoiding redundant/conflicting pages. The new lead must understand the full context across Mission Control and CoachPortal.

The kickoff prompt must include:

What the product is (system purpose, user types, and what problems it solves operationally — not marketing language)

Must-have V1 features + explicit non-goals

Key entities/data model (even if approximate)

Key user flows (end-to-end) for Mission Control + CoachPortal

UI invariants / design principles to preserve (navigation model, key layouts, interaction patterns, loading/error/toast conventions). Treat as requirements; do not copy legacy component implementations unless explicitly “blessed.”

Feature inventory table: each feature → where it currently lives (paths), current status (works/broken/partial), and dependencies (auth/data model/permissions)

Context Packs intake (read-only): summarize what’s still valid from the sub-agents (context, lessons, soul, status) into “Approved Principles” + “Outdated/Risky” notes. These are guidance, not authoritative architecture.

Broken foundation list: root issues (esp. data pulling) + what likely caused cascading failures

Strict phased plan: Audit → Architecture → Scaffold → Migrate one-by-one with checks. Do not begin architecture or implementation until the audit is complete and summarized.

Definition of done for each migrated feature: acceptance check + minimal automated/smoke test

Reuse policy: carry forward intent and UX, not implementations. Legacy code is reference-only; reuse is restricted to assets/copy + explicitly BLESSED modules (with a justification + quick check).

Hard rules: no in-place refactor, current repo is reference only, prefer simple conventional patterns, document assumptions/decisions. If legacy behavior conflicts with the new architecture or principles, the new architecture takes precedence. No large-scale edits until scaffold passes checks (lint/build/tests); make changes in small, reviewable increments.

A short “do not repeat” section: patterns to avoid from the current repo (duplication, hidden side effects, competing sources of truth)

Choose and enforce a single data-access pattern (one client, one caching strategy, one error-handling approach). No feature may ship using a different pattern.

You may create a small set of markdown docs to serve as the rebuild’s single source of truth (spec, architecture, decisions, golden paths). Maintain a short decisions log capturing key architectural choices and tradeoffs.

Golden paths + regression gate: define 3–7 end-to-end flows that must always pass; these are implemented and stabilized before secondary features. No migration proceeds unless these pass (manual checklist + minimal smoke automation).

Infrastructure alignment: The current stack includes Vercel (hosting), Supabase (database/backend), and Clerk (authentication). Treat these as the baseline. Evaluate their fit with the new architecture and recommend changes only if there is a clear architectural conflict, scalability risk, or simplification benefit. Do not suggest changes based on preference or trend.

API + data inventory: list all existing API calls/entry points and map them to features. Standardize request/response shapes and error handling.

DB audit: summarize current Supabase schema (tables, relationships, RLS assumptions) and identify where it conflicts with the intended domain model. Propose a target schema + migration approach, but do not execute destructive migrations until approved.

Auth/permissions model: document roles/org structure and canonical authorization checks across Mission Control + CoachPortal (Clerk + Supabase RLS). Define one consistent approach.

Data boundaries: no UI components may call Supabase directly; all reads/writes go through the dedicated data layer/service boundary.

Agent Architecture & Execution Model

A single Lead agent owns architecture, priorities, decisions, and final merges. Sub-agents advise; the Lead decides.

Sub-agents are read-only by default and may not modify code or architecture unless explicitly assigned a write-enabled task by the Lead.

Sub-agents must operate on bounded scopes only (audit, feature inventory, UI inventory, data layer proposal, test plan, etc.). No overlapping ownership.

Sub-agents must return results in a standard format: Findings/assumptions, Proposed changes or outputs, Risks, Next actions, Affected areas (if any)

The Lead maintains a single source of truth (spec, architecture, decisions, golden paths). Sub-agents may not create competing plans or architectures.

The (context, lessons, soul, status) agents are read-only context packs. The Lead extracts “Approved Principles” once and agents reference that list going forward.

Agents may not introduce new architectural patterns, abstractions, or data access methods without Lead approval and an entry in the decisions log.

No parallel implementation of the same feature or module by multiple agents.

Limit parallel sub-agents to max 3–5 at a time, spawned only by the Lead, and only after the audit phase.