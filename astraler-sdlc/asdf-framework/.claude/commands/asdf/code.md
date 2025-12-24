---
description: EXECUTE MODE - Implement code from specification with deviation handling
argument-hint: [spec-path]
---

# EXECUTE MODE: Implement from Spec

**Spec Path:** $ARGUMENTS

---

## Skills Required

- **Activate:** `context-loading` (for proper hierarchy)
- **Activate:** `refinement-loop` (for deviation handling)
- **Activate:** `impact-analysis` (for dependency and impact checks)

---

## Workflow

### Step 0: Acquire Lock (Multi-Instance)

**Check for existing locks:**

1. Look for `04-operations/locks/[feature-name].lock`
2. Extract feature name from $ARGUMENTS

**If lock exists:**
```markdown
**FEATURE LOCKED**

Feature: [feature-name]
Locked by: [instance-id from lock file]
Since: [locked_at timestamp]
Task: [task description]

Options:
- **[wait]** Check again later (recommended)
- **[force]** Override lock (DANGER: may cause conflicts)
- **[other]** Work on different feature

What would you like to do?
```

**If force override:**
- Log override in `04-operations/conflict-log.md` (create if not exists)
- Delete old lock
- Create new lock

**If no lock (or after acquiring):**
1. Create lock file: `04-operations/locks/[feature-name].lock`
   ```yaml
   feature: YYMMDD-feature-name
   instance_id: session-[id]
   locked_at: [ISO timestamp]
   task: "Starting implementation"
   ```
2. Create execution file: `04-operations/active/[feature-name].md`
3. Update `implementation-active.md` Feature Execution Status table
4. Proceed to Step 1

---

### Step 1: Read Spec Completely

1. Load the spec at provided path (or find by feature name in `astraler-docs/03-features/`)
2. Understand ALL requirements before writing any code
3. Note acceptance criteria — these define "done"
4. Verify spec status is "Approved" (warn if still "Draft" or "Review")

---

### Step 1.5: Dependency Check

**Use `impact-analysis` skill for this step.**

1. Read spec's `## Dependencies` section
2. Check each dependency's implementation status:
   - Query `04-operations/active/[feature].md` for in-progress features
   - Query `implementation-active.md` for completion status
3. Present dependency check result:

```markdown
**Dependency Check**

Feature: [current-feature]

| Dependency | Type | Status | Blocker? |
|------------|------|--------|----------|
| auth domain | Domain | Implemented | No |
| 241220-user-auth | Feature | Complete | No |
| 241221-checkout | Feature | 60% | Yes |

**Result:** [PASS | BLOCKED]
```

**If BLOCKED:**
```markdown
**BLOCKED: Dependencies not satisfied**

Missing Dependencies:
| Dependency | Status | Required For |
|------------|--------|--------------|
| [dep-name] | [status] | [reason] |

Options:
- **[wait]** Abort until dependencies ready
- **[stub]** Create interface stubs, implement later
- **[override]** Proceed anyway (RISK: integration failures)

What would you like to do?
```

---

### Step 2: Load Supporting Context

1. System standards from `astraler-docs/01-system-core/02-standards/`
2. Relevant domain logic from `astraler-docs/02-domains/`
3. Check `astraler-docs/04-operations/session-handoff.md` for prior work

---

### Step 2.5: Impact Analysis

**Use `impact-analysis` skill for this step.**

1. Scan existing features in `03-features/` for shared dependencies:
   - Shared database entities
   - Shared API endpoints
   - Shared utility functions
   - Environment variables

2. If breaking changes detected, present analysis:

```markdown
**Impact Analysis**

Feature: [current-feature]

**Breaking Changes Detected:**

| Affected Feature | Type | Change | Severity |
|------------------|------|--------|----------|
| 241220-user-auth | API | POST /auth/login signature change | HIGH |
| 241221-checkout | Schema | Order.userId type change | HIGH |
| 241222-notifications | Config | New env var required | MEDIUM |

**Total Impact:** [N] HIGH, [M] MEDIUM, [O] LOW
```

**If HIGH severity found:**
```markdown
Options:
- **[review]** Show detailed impact for each affected feature
- **[proceed]** Continue with awareness (update affected specs later)
- **[abort]** Cancel implementation

What would you like to do?
```

**If proceed with HIGH impact:**
- Log in `implementation-active.md` Impact Overrides section
- Remind to run `/asdf:sync` for affected features after implementation

---

### Step 3: Implement

1. Follow spec precisely — no more, no less
2. Use patterns from existing codebase
3. YAGNI: Don't add features not in spec

---

### Step 4: Handle Deviations

If implementation requires change from spec:

1. **STOP** — Do not silently deviate
2. **Explain** the deviation:

```markdown
**Deviation Detected**

- **Spec says:** [original requirement]
- **Implementation needs:** [what's actually required]
- **Reason:** [why the change is necessary]

Options:
- **A) Update spec now** — Minor clarification, proceed with change
- **B) Continue + sync later** — Tracked deviation, run `/asdf:sync` after
- **C) Wait for decision** — Blocking issue, need human input

Which option? (A/B/C)
```

3. **Track choice:**
   - **A**: Update spec inline, note in changelog, continue
   - **B**: Continue, mark deviation in `implementation-active.md`, sync later
   - **C**: Wait for human response before proceeding

---

### Step 5: Update Progress

Update `astraler-docs/04-operations/implementation-active.md`:

```markdown
# Implementation Active

> **Last Updated:** YYMMDD
> **Session:** [Feature being implemented]

## Current Task

- **Feature:** [feature-name]
- **Spec:** [path to spec]
- **Status:** In Progress
- **Progress:** [X]%

## Files Modified

- `path/to/file.ts` — [What changed]
- `path/to/file.tsx` — [What changed]

## Deviations

| Spec Section | Deviation | Reason | Resolution |
|--------------|-----------|--------|------------|
| [Section] | [What changed] | [Why] | A/B/C |

## Blockers

- [Any blockers]

## Next Actions

- [What's next]
```

---

### Step 6: Verify Completion

1. Check each acceptance criterion from spec
2. Run relevant tests
3. Present completion report:

```markdown
**Implementation Complete**

- **Feature:** [feature-name]
- **Spec Version:** [X.Y.Z]
- **Files Modified:** [N]

**Acceptance Criteria:**
- [x] AC-001: [criteria] — Verified
- [x] AC-002: [criteria] — Verified
- [ ] AC-003: [criteria] — Blocked by [reason]

**Deviations:** [N] (resolved via A/B/C)

**Next steps:**
- Run `/asdf:sync` if deviations exist
- Update `session-handoff.md` before ending session
```

---

### Step 6.5: Release Lock

**On completion:**
1. Delete lock file: `04-operations/locks/[feature-name].lock`
2. Move execution file to completed: `04-operations/active/[feature-name].md` → `04-operations/completed/[feature-name].md`
3. Update `implementation-active.md`:
   - Remove from Feature Execution Status table (or mark as Complete)
   - Add to Recently Completed section

**On handoff (incomplete):**
1. Delete lock file: `04-operations/locks/[feature-name].lock`
2. Keep execution file in `04-operations/active/[feature-name].md`
3. Update status to "Paused" or "Available"
4. Note: Next session can re-acquire lock with `/asdf:code`

```markdown
**Lock Released**

Feature: [feature-name]
Final Status: [Complete | Paused]

[If Complete]
Execution file moved to: `04-operations/completed/[feature-name].md`

[If Paused]
Execution file remains at: `04-operations/active/[feature-name].md`
Next session can continue with: `/asdf:code [feature]`
```

---

## Deviation Handling Rules

| Deviation Type | Action | Example |
|----------------|--------|---------|
| Minor clarification | Option A | "Field is VARCHAR(50) not VARCHAR(255)" |
| Better approach | Option B | "Using bulk insert instead of loop" |
| Requirement conflict | Option C | "Spec says X but dependency requires Y" |
| Missing info | Option C | "Spec doesn't specify timeout behavior" |

---

## Rules

- **Spec is law** — Deviation requires explicit acknowledgment
- **Read before write** — No coding until spec is understood
- **Track everything** — Update implementation-active.md as you go
- **YAGNI** — If it's not in spec, don't build it
- **Honest reporting** — Flag blockers immediately, don't hide problems
- **Version awareness** — Note which spec version you're implementing against
- **Deviation choices** — Always give user A/B/C options for deviations
