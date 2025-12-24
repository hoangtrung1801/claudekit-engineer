---
description: Manage project roadmap phases and feature priorities
argument-hint: [action] (view|add|reorder|phase)
---

# Roadmap Management

**Action:** $ARGUMENTS

---

## Skills Required

- **Activate:** `context-loading` (for loading existing roadmap)

---

## Workflow

### Step 1: Load Roadmap

1. Read `astraler-docs/04-operations/roadmap.md`
2. Parse current phase, features, dependencies
3. Determine requested action from $ARGUMENTS

---

### Step 2: Execute Action

#### Action: `view` (default)

Display current roadmap state:

```markdown
**Project Roadmap**

Current Phase: [Phase Name] ([X]%)

**Phase Summary:**
| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1 | Active | 60% |
| Phase 2 | Planned | 0% |

**Current Phase Features:**
| Priority | Feature | Status | Blocker |
|----------|---------|--------|---------|
| P0 | [Feature] | Done | - |
| P0 | [Feature] | 60% | B-001 |

**Commands:**
- `/asdf:roadmap add [feature] [phase] [priority]`
- `/asdf:roadmap reorder [feature] [new-phase|priority]`
- `/asdf:roadmap phase [status|close|next]`
```

---

#### Action: `add [feature] [phase] [priority]`

Add feature to roadmap:

1. **Validate feature spec exists**
   ```
   [Check 03-features/*-[feature]/spec.md]

   If not found:
   "Feature spec not found. Create first: /asdf:spec [feature]"
   ```

2. **Check dependencies**
   - Read spec's Dependencies section
   - Verify all dependencies in same or earlier phase

3. **Validate placement**
   ```
   If dependencies in later phase:
   "Cannot add '[feature]' to Phase [X].

   Dependency conflict:
   - [DEP] is in Phase [Y] (must be Phase [X] or earlier)

   Options:
   - [move-dep] Move dependency to earlier phase
   - [later-phase] Add feature to Phase [Y] instead
   - [cancel] Abort"
   ```

4. **Add to roadmap**
   - Insert in correct phase with priority
   - Update dependency graph
   - Increment roadmap version

---

#### Action: `reorder [feature] [target]`

Move feature priority or phase:

**Target formats:**
- `P0`, `P1`, `P2` — Change priority within same phase
- `phase:2` — Move to different phase
- `before:[feature]` — Place before another feature

1. **Parse target**

2. **Validate move**
   ```
   [Check if move breaks dependencies]

   If blocked:
   "Cannot move '[feature]' to [target].

   Dependency conflict:
   - [DEP] must come before [feature]
   - [DEP] is currently in Phase [X]

   Options:
   - [cascade] Move dependencies too
   - [cancel] Abort reorder"
   ```

3. **Execute move**
   - Update feature position
   - Recalculate phase progress
   - Update dependency graph
   - Log in Reorder Log

4. **Present result**
   ```markdown
   **Roadmap Updated**

   Moved: [feature]
   From: Phase [X], P[Y]
   To: Phase [A], P[B]

   Version: [X.Y.Z] → [X.Y+1.Z]

   [Show updated phase view]
   ```

---

#### Action: `phase [subaction]`

Phase management:

**`phase status`**
```markdown
**Phase [N]: [Name]**

Progress: [X]%
Features: [Done]/[Total]

| Feature | Priority | Status |
|---------|----------|--------|

Exit Criteria:
- [x] Criterion 1
- [ ] Criterion 2

**Ready to close?** [yes/no]
```

**`phase close`**
1. Check all P0 features complete
2. Check exit criteria
3. If not ready:
   ```
   "Cannot close Phase [N].

   Incomplete:
   - P0 feature: [feature] ([X]%)
   - Exit criteria: [criterion]

   Complete these first, then run: /asdf:roadmap phase close"
   ```
4. If ready:
   - Mark phase as ✅ Done
   - Advance current phase
   - Update roadmap version

**`phase next`**
- Preview next phase
- Show dependencies from current phase
- Estimate readiness

---

## Dependency Validation Rules

| Rule | Description |
|------|-------------|
| No circular | A → B → A is invalid |
| Phase order | Dependencies must be in same or earlier phase |
| Priority respect | P0 deps should complete before P1 features |
| Cross-phase | Feature in Phase N can depend on Phase N-1 |

---

## Version Management

Roadmap versioning:
- **Patch** (1.0.+1): Status updates, progress changes
- **Minor** (1.+1.0): Feature additions, reorders
- **Major** (+1.0.0): Phase restructuring

---

## Rules

- **Dependency-first** — Always validate dependencies before changes
- **P0 critical** — P0 features block phase completion
- **Version tracked** — All changes logged in Reorder Log
- **No orphans** — Every feature must be in a phase
