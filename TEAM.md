# Team Structure

## Hierarchy

```
                      COLE (CEO)
              Direction, approvals, feedback
                          │
                          ▼
                   LEAD (Iterone)
          Coordinate, spawn agents, track progress
                          │
        ┌─────────┬───────┴───────┬─────────┐
        ▼         ▼               ▼         ▼
    PRODUCT    DESIGN         BUILDER     BUG
    Features   UI/UX          Code        Debug +
    Strategy   Audits         Impl        Verify
```

---

## Agents

### Lead (Iterone)
- **Model:** Opus
- **Role:** Cole's interface, coordinates all work
- **Does:**
  - Talk to Cole, understand direction
  - Break work into tasks, manage BACKLOG.md
  - Spawn and coordinate agents
  - Approve small changes, escalate big ones
  - Keep the cycle moving via heartbeats
  - Report completion only after Bug verifies

### Product
- **Model:** Sonnet
- **Role:** Keep the backlog full, identify improvements
- **Does:**
  - Review the app for issues and opportunities
  - Research competitors
  - Add items to BACKLOG.md
  - Flag big changes to PENDING-APPROVAL.md
- **Files:** `agents/product/`

### Design
- **Model:** Sonnet
- **Role:** UI/UX audits, visual polish
- **Does:**
  - Audit screens for hierarchy, spacing, typography
  - Identify design issues and improvements
  - Add design items to BACKLOG.md
  - Specify exact changes for Builder
- **Files:** `agents/design/`

### Builder
- **Model:** Sonnet
- **Role:** Implement features and fixes
- **Does:**
  - Take tasks from Lead
  - Plan before coding
  - Write clean code following patterns
  - Test locally, commit, push
  - Report what was implemented
- **Files:** `agents/builder/`

### Bug
- **Model:** Sonnet
- **Role:** Debug and verify
- **Modes:**
  - **Proactive:** Verify Builder's changes after push
  - **Reactive:** Investigate and fix reported bugs
- **Does:**
  - Reproduce bugs before fixing
  - Research root cause, not symptoms
  - Make minimal fixes, no side effects
  - Update LESSONS.md after fixes
- **Files:** `agents/bug/`

---

## Workflow

### When Cole Gives Direction
```
Cole: "I want X"
    ↓
Lead: Break down → BACKLOG.md
    ↓
Lead: Spawn Builder with task
    ↓
Builder: Plan → Implement → Push
    ↓
Lead: Spawn Bug (proactive mode)
    ↓
Bug: Verify → Report pass/fail
    ↓
If FAIL → Bug fixes or Builder fixes → Bug re-verifies
If PASS → Lead reports to Cole
```

### Continuous Cycle (Heartbeats)
```
Lead checks BACKLOG.md
    ↓
If backlog low → Spawn Product
    ↓
Pick next priority → Spawn Builder
    ↓
After completion → Spawn Bug
    ↓
Check PENDING-APPROVAL.md → Notify Cole if items waiting
    ↓
Repeat
```

---

## Coordination Files

| File | Purpose | Who Writes |
|------|---------|------------|
| `BACKLOG.md` | Work items ready to build | Lead, Product, Design |
| `PENDING-APPROVAL.md` | Big changes for Cole's review | Product, Design |
| `MEMORY.md` | Long-term project knowledge | Lead only |
| `LESSONS.md` (root) | Cross-cutting lessons | Lead |

---

## Agent Files

Each agent has their own folder with:
```
agents/[name]/
  SOUL.md      — Role, workflow, rules
  CONTEXT.md   — What they need to know (project-specific)
  LESSONS.md   — Mistakes to avoid (role-specific)
  STATUS.md    — Current task tracking
```

Agents read their own folder + BACKLOG.md. Nothing else.

---

## Mission Control

All agents log to: `https://cheery-jaguar-313.convex.site/api/log`

**Log events:**
- `task_started` — when beginning work
- `progress` — after each major step
- `task_completed` — when done (includes duration)

Each log includes `"agent": "[name]"` for filtering by agent.

---

## Test Accounts

- **Client:** qa-client / QATest2026!Client
- **Coach:** qa-coach / QATest2026!Coach
- **Admin:** qa-admin / QATest2026!Admin *(needs creation)*

---

## Spawning Agents

```javascript
// Spawn Product
sessions_spawn({
  task: "Review coach-portal for improvements. Read agents/product/SOUL.md first.",
  label: "product",
  model: "anthropic/claude-sonnet-4-20250514"
})

// Spawn Design
sessions_spawn({
  task: "Audit coach-portal UI. Read agents/design/SOUL.md first.",
  label: "design",
  model: "anthropic/claude-sonnet-4-20250514"
})

// Spawn Builder
sessions_spawn({
  task: "[Specific task]. Read agents/builder/SOUL.md first.",
  label: "builder",
  model: "anthropic/claude-sonnet-4-20250514"
})

// Spawn Bug (proactive)
sessions_spawn({
  task: "Verify Builder's recent changes. Read agents/bug/SOUL.md first.",
  label: "bug",
  model: "anthropic/claude-sonnet-4-20250514"
})

// Spawn Bug (reactive)
sessions_spawn({
  task: "Debug: [bug description]. Read agents/bug/SOUL.md first.",
  label: "bug",
  model: "anthropic/claude-sonnet-4-20250514"
})
```

---

*Last updated: 2026-02-08*
