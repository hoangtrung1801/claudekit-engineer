---
description: Update project status heartbeat
argument-hint: (no args)
---

# Update Project Status

Refresh the project heartbeat at `astraler-docs/01-system-core/project-status.md`.

---

## Workflow

1. **Scan current state:**
   - Check `astraler-docs/04-operations/implementation-active.md` for active work
   - Count features by status in `astraler-docs/03-features/`
   - Check recent changelog entries
   - Identify blockers
   - **Check `04-operations/locks/` for active locks**

2. **Update project-status.md:**

   ```markdown
   # Project Status

   > **Last Updated:** YYMMDD
   > **Version:** X.Y.Z
   > **Health:** [Green/Yellow/Red]

   ## Active Work
   - [Current task from implementation-active.md]
   - Progress: [X]%

   ## Feature Locks

   | Feature | Locked By | Since | Task |
   |---------|-----------|-------|------|
   | [feature] | [instance] | [timestamp] | [task] |

   > No locks = "No active locks. Features available for work."

   ## Feature Summary
   | Status | Count |
   |--------|-------|
   | Planned | X |
   | In Progress | X |
   | Blocked | X |
   | Implemented | X |

   ## Recent Changes
   - [Last 3-5 changelog entries]

   ## Blockers
   - [List or "None"]

   ## Next Priorities
   - [Top 3 upcoming items]
   ```

3. **Report:**
   - Show updated status
   - Highlight any concerns (blockers, stale features)

---

## When to Run

- Start of each session (quick orientation)
- After completing major milestones
- Before stakeholder updates
- When asked "what's the project status?"

---

## Rules

- **Factual only** — Report what IS, not what should be
- **Concise** — Status file should be scannable in 30 seconds
- **Actionable** — Blockers and next priorities clearly stated
