---
description: AI code review of PR package from fresh context
argument-hint: [pr-package-path]
---

# AI Code Review

**PR Package:** $ARGUMENTS

---

## Skills Required

- **Activate:** `pr-review` (for review protocol and templates)
- **Activate:** `context-loading` (for standards loading)

---

## CRITICAL: Fresh Context Requirement

**This review MUST be performed with fresh perspective.**

Before starting:
1. Clear any assumptions from prior work on this feature
2. Load spec FRESH from PR package path
3. Apply checklist objectively as if seeing code for first time

**Best practice:** Run this command in a NEW Claude instance for unbiased review.

---

## Workflow

### Step 1: Load PR Package

1. Read `$ARGUMENTS/summary.md` to understand PR scope
2. Read `$ARGUMENTS/changes.md` for file details
3. Read `$ARGUMENTS/spec-diff.md` for deviations
4. Read `$ARGUMENTS/checklist.md` for review criteria

**If package not found:**
```markdown
**PR Package Not Found**

Cannot find PR package at "$ARGUMENTS".

Create package first: `/asdf:pr [feature-name]`
```

---

### Step 2: Load Fresh Context

1. **Extract feature spec path** from summary.md
2. **Load spec FRESH** — Read `03-features/.../spec.md` completely
3. **Load coding standards** from `01-system-core/02-standards/`
4. **Load domain context** if referenced

**DO NOT use prior conversation context about this feature.**

---

### Step 3: Spec Compliance Check

For EACH acceptance criterion in spec:

1. Read AC description and testable criteria
2. Check if implementation fulfills AC
3. Mark status: PASS / FAIL / PARTIAL

```markdown
**Spec Compliance Check**

| AC | Description | Status | Evidence | Notes |
|----|-------------|--------|----------|-------|
| AC-001 | [criteria] | PASS | [file:line] | |
| AC-002 | [criteria] | FAIL | - | Missing validation |
| AC-003 | [criteria] | PARTIAL | [file:line] | Happy path only |
```

---

### Step 4: Code Quality Review

Apply checklist systematically:

**Spec Compliance:**
- [ ] Code matches spec intent
- [ ] All ACs implemented
- [ ] No scope creep (undocumented features)
- [ ] No missing requirements

**Code Quality:**
- [ ] Follows coding standards
- [ ] No hardcoded values
- [ ] Error handling complete
- [ ] No debug code

**Security:**
- [ ] No secrets in code
- [ ] Input validation
- [ ] SQL injection prevented
- [ ] XSS prevented

**Performance:**
- [ ] No N+1 queries
- [ ] Appropriate caching

**Testing:**
- [ ] Unit tests present
- [ ] Integration tests for APIs
- [ ] Edge cases covered

---

### Step 5: Identify Issues

Categorize by severity:

**Critical (Blocks Merge):**
- Security vulnerabilities
- Data loss risks
- Spec violations (missing ACs)
- Breaking changes without handling

**Major (Should Fix):**
- Bug potential
- Missing error handling
- Maintainability issues

**Minor (Consider):**
- Style improvements
- Optimization opportunities
- Naming suggestions

For each issue:
- File and line number
- Clear description
- Suggested fix

---

### Step 6: Generate Verdict

Based on findings, choose ONE:

**APPROVE**
- All critical checks pass
- All ACs implemented
- No security issues
- Minor issues acceptable for follow-up

**REQUEST_CHANGES**
- Critical issues found
- Must be fixed before merge
- List specific blockers

**NEEDS_DISCUSSION**
- Architectural decision required
- Spec ambiguity discovered
- Trade-off decision needed

---

### Step 7: Present Review

```markdown
# AI Review: [Feature Name]

> **Reviewed:** YYMMDD
> **PR Package:** $ARGUMENTS
> **Spec Version:** vX.Y.Z
> **Review Duration:** [time]

---

## Verdict: [APPROVE | REQUEST_CHANGES | NEEDS_DISCUSSION]

---

## Spec Compliance: [X]/[Y] ACs Passing

| AC | Status | Notes |
|----|--------|-------|
| AC-001 | PASS | |
| AC-002 | FAIL | [reason] |

---

## Issues Found

### Critical ([N])
| # | File:Line | Issue | Fix |
|---|-----------|-------|-----|

### Major ([N])
| # | File:Line | Issue | Suggestion |
|---|-----------|-------|------------|

### Minor ([N])
| # | File:Line | Issue | Suggestion |
|---|-----------|-------|------------|

---

## Checklist Summary

| Category | Pass | Fail |
|----------|------|------|
| Spec Compliance | [X] | [Y] |
| Code Quality | [X] | [Y] |
| Security | [X] | [Y] |
| Performance | [X] | [Y] |
| Testing | [X] | [Y] |

---

## Positive Notes

- [Good thing 1]
- [Good thing 2]

---

## Verdict Explanation

[Why this verdict was chosen]

---

## Required Actions

[If REQUEST_CHANGES:]
1. Fix: [Critical issue 1]
2. Fix: [Critical issue 2]
3. Re-run: `/asdf:review $ARGUMENTS`

[If APPROVE:]
Ready for merge. Address minor issues in follow-up if desired.

[If NEEDS_DISCUSSION:]
Question requiring decision:
- [Question]
```

---

## Rules

| Rule | Description |
|------|-------------|
| Fresh Context | MUST load spec fresh, ignore prior conversation |
| Objective | Apply same checklist every time |
| Actionable | Every issue includes file:line and fix |
| Verdict Required | MUST choose APPROVE / REQUEST_CHANGES / NEEDS_DISCUSSION |
| Balanced | Note positives, not just problems |
| Traceable | Reference specific code locations |
