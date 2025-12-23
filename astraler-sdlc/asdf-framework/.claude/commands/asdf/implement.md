---
description: Execute implementation based on specification
argument-hint: [spec-path]
---

## Mission

Implement a feature following the provided specification with full spec governance.

<spec-path>
$ARGUMENTS
</spec-path>

## Pre-Execution

### Context Loading (Mandatory)

1. Activate `context-loading` skill
2. Load context hierarchy:
   - `asdf-docs/01-system-core/` → Global rules
   - Relevant `asdf-docs/02-domains/` → Business logic
   - Target spec file → Feature requirements
3. Check `asdf-docs/04-operations/session-handoff.md` → Continuity
4. Read specification END-TO-END before any coding

### Validation Gates

Before proceeding, verify:
- [ ] Spec file exists and is readable
- [ ] Spec has been approved (check status section)
- [ ] All dependencies documented in spec are available
- [ ] No blocking issues in `implementation-active.md`

If validation fails, **STOP** and report to Product Architect.

## Execution Steps

### Step 1: Task Decomposition

Break spec into implementation tasks:
```markdown
## Implementation Plan

1. [Task 1] - [Estimated complexity: Low/Med/High]
2. [Task 2] - [Estimated complexity]
...

Dependencies:
- Task 2 depends on Task 1
- Task 3 can run parallel to Task 2
```

Update `asdf-docs/04-operations/implementation-active.md` with task list.

### Step 2: Implementation Loop

For each task:

1. **Read** relevant spec section
2. **Implement** following spec precisely
3. **Track** any deviations (improvements, blockers, discoveries)
4. **Test** if applicable
5. **Mark** task complete in `implementation-active.md`

### Step 3: Deviation Tracking

If implementation differs from spec, document:
```markdown
## Deviation Log

### [YYMMDD] - [Component/Feature]
- **Spec said**: [Original requirement]
- **Implementation**: [What was actually done]
- **Reason**: [Why deviation was necessary]
- **Impact**: [Effect on other components]
- **Reverse Sync Required**: Yes/No
```

### Step 4: Quality Checks

After implementation complete:
- [ ] All tasks marked complete
- [ ] Tests pass (if applicable)
- [ ] Code follows project standards
- [ ] No untracked deviations

### Step 5: Trigger Reverse Sync

If ANY deviations were logged:
1. Activate `reverse-sync` skill
2. Update spec file with actual implementation
3. Add `[Reverse Synced: YYMMDD]` annotations
4. Update `asdf-docs/04-operations/changelog/`

### Step 6: Update Status Files

**Update spec status:**
```markdown
## Status
- [x] Spec approved by Architect
- [x] Implementation started
- [x] Implementation complete
- [x] Testing complete
- [x] Reverse synced (if applicable)
```

**Update project-status.md:**
- Increment "Features Complete" count
- Update completion percentage
- Add to "Recent Activity"

**Update implementation-active.md:**
- Move feature to "Recently Completed"
- Clear "Current Task"

### Step 7: Session Handoff

Update `session-handoff.md`:
```markdown
## Last Session
- Date: [YYMMDD]
- Feature: [feature-name]

## Completed This Session
- [x] [List of completed items]

## Pending Next Session
- [ ] [Any remaining items]

## Notes for Next Session
[Any context for continuation]
```

## Post-Execution Report

```
Implementation Complete: [feature-name]

Tasks Completed: [X/Y]
Deviations: [Count] (reverse synced: Yes/No)
Tests: [Pass/Fail/N/A]

Files Modified:
- [list of changed files]

Spec Updated: [Yes/No - if reverse sync occurred]

Next Steps:
- [Suggestions for follow-up]
```

## Error Handling

If implementation blocked:
1. Document blocker in `implementation-active.md`
2. Update `session-handoff.md` with blocker details
3. Report to Product Architect with:
   - What was attempted
   - Why it failed
   - Proposed solutions
