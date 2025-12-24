---
name: pr-review
description: Create PR packages and perform AI code reviews.
---

# PR Review Skill

Bundle changes for review and perform automated code quality checks.

## When to Use

- `/asdf:pr [feature]` — Create PR package for review
- `/asdf:review [path]` — AI review from fresh context
- After implementation before merge
- When requesting code review from another instance

---

## Part 1: PR Package Creation

### Output Structure

```
.pr-review/
└── YYMMDD-[feature]/
    ├── summary.md           # PR description
    ├── changes.md           # Detailed file changes
    ├── spec-diff.md         # Spec deviations (if any)
    └── checklist.md         # Review checklist
```

### Protocol

1. **Locate feature spec**
   - Find in `03-features/*-[feature]/spec.md`
   - Load changelog for recent changes

2. **Gather implementation changes**
   - List all modified files (from execution file or git)
   - Identify deviations from spec

3. **Generate PR package**

---

### summary.md Template

```markdown
# PR: [Feature Name]

> **Feature ID:** YYMMDD-feature-name
> **Spec Version:** vX.Y.Z
> **Created:** YYMMDD

---

## Summary

[1-3 sentences describing what this PR does, derived from spec overview]

## Changes

- [High-level change 1]
- [High-level change 2]
- [High-level change 3]

## Files Changed

| File | Change Type | Lines |
|------|-------------|-------|
| `src/auth/login.ts` | Modified | +50/-10 |
| `src/auth/types.ts` | Added | +100 |
| `__tests__/auth/login.test.ts` | Added | +80 |

## Acceptance Criteria Status

| AC | Description | Status |
|----|-------------|--------|
| AC-001 | User can login with email/password | Implemented |
| AC-002 | JWT token returned on success | Implemented |
| AC-003 | Rate limiting after 10 attempts | Implemented |

## Deviations from Spec

| Section | Deviation | Reason | Resolution |
|---------|-----------|--------|------------|
| API Contract | Added `deviceId` field | Mobile tracking requirement | Spec updated (A) |

## Related

- Spec: `astraler-docs/03-features/YYMMDD-feature/spec.md`
- Domain: `astraler-docs/02-domains/auth/`
- Execution: `astraler-docs/04-operations/active/[feature].md`
```

---

### checklist.md Template

```markdown
# Review Checklist: [Feature Name]

## Spec Compliance
- [ ] Code matches spec intent
- [ ] All acceptance criteria implemented
- [ ] No undocumented features added (scope creep)
- [ ] No spec requirements missing
- [ ] Deviations documented and resolved

## Code Quality
- [ ] Follows coding standards (`01-system-core/02-standards/`)
- [ ] No hardcoded values (use config)
- [ ] Error handling complete
- [ ] Logging added for critical paths
- [ ] No console.log or debug code
- [ ] No commented-out code

## Security
- [ ] No secrets in code
- [ ] Input validation implemented
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
- [ ] CSRF protection (if applicable)
- [ ] Authentication/authorization correct

## Performance
- [ ] No N+1 queries
- [ ] Appropriate caching
- [ ] No blocking operations in hot path
- [ ] Pagination for list endpoints

## Testing
- [ ] Unit tests for new logic
- [ ] Integration tests for APIs
- [ ] Edge cases covered
- [ ] Tests passing

## Documentation
- [ ] Reverse sync completed (if deviations)
- [ ] API docs updated (if new endpoints)
- [ ] Comments for complex logic
```

---

## Part 2: AI Review

### Protocol

1. **Load fresh context** (CRITICAL)
   - Read PR package summary.md
   - Identify feature spec path
   - Load spec FRESH (ignore prior conversation context)
   - Load coding standards from `01-system-core/02-standards/`

2. **Spec compliance check**
   - Extract ALL acceptance criteria from spec
   - Verify each AC against implementation
   - Mark PASS/FAIL with notes

3. **Code quality review**
   - Apply checklist systematically
   - Identify issues by severity

4. **Generate verdict**

---

### Review Report Template

```markdown
# AI Review: [Feature Name]

> **Reviewed:** YYMMDD
> **PR Package:** `.pr-review/YYMMDD-[feature]/`
> **Spec Version:** vX.Y.Z

---

## Verdict: [APPROVE | REQUEST_CHANGES | NEEDS_DISCUSSION]

---

## Spec Compliance

| AC | Description | Status | Notes |
|----|-------------|--------|-------|
| AC-001 | User can login | PASS | |
| AC-002 | JWT returned | PASS | |
| AC-003 | Rate limiting | FAIL | Only 5 attempts, spec says 10 |

**Compliance:** [X]/[Y] passing

---

## Issues Found

### Critical (Blocks Merge)

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| 1 | `auth.ts` | 45 | SQL injection: user input in query | Use parameterized query |
| 2 | `login.ts` | 78 | No error handling for DB failure | Add try-catch |

### Major (Should Fix)

| # | File | Line | Issue | Suggestion |
|---|------|------|-------|------------|
| 1 | `user.ts` | 23 | Missing null check | Add optional chaining |
| 2 | `config.ts` | 10 | Hardcoded timeout | Move to env config |

### Minor (Consider)

| # | File | Line | Issue | Suggestion |
|---|------|------|-------|------------|
| 1 | `utils.ts` | 12 | Could use const | Change let to const |

---

## Checklist Summary

| Category | Status |
|----------|--------|
| Spec Compliance | [X]/[Y] |
| Code Quality | [X]/[Y] |
| Security | [X]/[Y] |
| Performance | [X]/[Y] |
| Testing | [X]/[Y] |
| Documentation | [X]/[Y] |

---

## Positive Notes

- Good test coverage (85%)
- Clear function naming
- Proper TypeScript types
- Well-structured error handling

---

## Verdict Explanation

**[APPROVE]**
All critical checks pass. Minor issues can be addressed in follow-up.

**[REQUEST_CHANGES]**
[N] critical issues must be fixed before merge:
1. [Issue 1 summary]
2. [Issue 2 summary]

**[NEEDS_DISCUSSION]**
Architectural decision needed:
- [Question requiring human decision]

---

## Next Steps

1. [Action item 1]
2. [Action item 2]
3. After fixes: Re-run `/asdf:review`
```

---

## Severity Classification

| Severity | Criteria | Action |
|----------|----------|--------|
| **Critical** | Security vulnerability, data loss risk, spec violation | Blocks merge |
| **Major** | Bug potential, maintainability issue, missing error handling | Should fix before merge |
| **Minor** | Style, optimization opportunity, naming | Consider, can merge without |

---

## Fresh Context Requirement

**CRITICAL:** AI review MUST be performed with fresh context.

**Why:**
- Prevents bias from implementation work
- Ensures objective review
- Catches issues missed during development

**How to achieve:**
1. Use new Claude instance if possible
2. Or explicitly state: "Review this as if you've never seen the code before"
3. Load ONLY from PR package, not prior conversation

---

## Rules

| Rule | Description |
|------|-------------|
| Fresh Context | Load spec fresh, no prior assumptions |
| Objective | Apply checklist consistently |
| Actionable | Issues include file:line and fix suggestion |
| Verdict Required | Must give clear APPROVE/REQUEST_CHANGES/NEEDS_DISCUSSION |
| Traceable | Every issue references specific code location |
| Balanced | Note positives, not just problems |
