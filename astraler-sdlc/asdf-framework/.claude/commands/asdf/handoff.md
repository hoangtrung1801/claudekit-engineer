---
description: Create session handoff notes for continuity
argument-hint: (no args)
---

# Session Handoff

Capture session state for seamless continuation in next session.

---

## Workflow

### Step 0: Release Feature Lock

**If a feature is currently locked by this session:**

1. Check `04-operations/locks/` for locks owned by this session
2. For each lock:
   - Delete the lock file
   - Update execution file status in `04-operations/active/[feature].md` to "Paused"
   - Update `implementation-active.md` Feature Execution Status (remove lock indicator)

```markdown
**Locks Released:**

| Feature | Previous Status | Now |
|---------|-----------------|-----|
| [feature-name] | In Progress | Paused (Available) |

Next session can continue with: `/asdf:code [feature]`
```

---

### Step 1: Gather Session Context

1. **Gather session context:**
   - What was the goal this session?
   - What was accomplished?
   - What's in progress (incomplete)?
   - What blockers were encountered?
   - What decisions were made?

### Step 2: Update implementation-active.md
   ```markdown
   # Implementation Active

   > **Last Updated:** YYMMDD HH:MM
   > **Session:** [Brief description]

   ## Current Task
   - **Feature:** [feature path]
   - **Status:** [In Progress / Blocked / Paused]
   - **Progress:** [X]%

   ## Files Changed This Session
   - [file1.ts] — [what changed]
   - [file2.ts] — [what changed]

   ## Blockers
   - [List or "None"]

   ## Uncommitted Work
   - [List any uncommitted changes]
   ```

3. **Update session-handoff.md:**
   ```markdown
   # Session Handoff

   > **Date:** YYMMDD
   > **Duration:** ~[X] hours

   ## Completed This Session
   - [List of completed items]

   ## In Progress
   - [Item] — [X]% complete, next step: [action]

   ## Blockers
   - [Blocker] — [Status: Waiting/Investigating/Resolved]

   ## Decisions Made
   - [Decision] — Rationale: [why]

   ## Next Session Should
   1. [First priority action]
   2. [Second priority]
   3. [Third priority]

   ## Quick Start
   ```bash
   # Resume from here:
   [command to continue work]
   ```
   ```

4. **Trigger related updates:**
   - Run `/asdf:sync` if any specs need updating
   - Run `/asdf:status` to refresh project heartbeat

5. **Verify completeness:**
   - All changes committed? (remind if not)
   - Specs up to date?
   - Blockers documented?

6. **Report:**
   - Summary of handoff notes created
   - Remind human of any pending actions

---

## When to Run

- **Always** before ending a session
- After significant milestone completion
- Before switching to different feature
- When pausing work for extended period

---

## Rules

- **Capture everything** — Next session has no memory of this one
- **Be specific** — "Fix auth bug" is useless; "Fix JWT expiry check in auth/middleware.ts:47" is useful
- **Include quick start** — Reduce context-loading time for next session
- **Honest about blockers** — Don't hide problems, document them
