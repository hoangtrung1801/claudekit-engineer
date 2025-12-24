---
name: maintenance
description: Patterns for spec health auditing, cleanup, and tech debt tracking.
---

# Maintenance Skill

Maintain spec health through auditing, cleanup, and tech debt tracking.

## When to Use

- `/asdf:audit` command — Scan for spec health issues
- `/asdf:cleanup` command — Remove unused specs
- Tech debt identification and tracking
- Project health assessment

---

## Audit Patterns

### Outdated Spec Detection

**Definition:** Spec exists but code has changed since spec was last updated.

```bash
# Get spec last-updated date from file
grep -m1 "Last Updated" [spec-path]/spec.md

# Compare with git log for corresponding code
git log --since="[spec-date]" --oneline -- [code-path]/
```

**Classification:**
| Age Since Update | Status | Action |
|------------------|--------|--------|
| <7 days | Fresh | None |
| 7-30 days | Aging | Review recommended |
| >30 days | Stale | Sync required |

---

### Missing Spec Detection

**Definition:** Code directory exists without corresponding spec.

**Scan Pattern:**
1. List all source directories (e.g., `src/services/`, `src/features/`)
2. For each directory, check if spec exists in `02-domains/` or `03-features/`
3. If no match → MISSING

```markdown
## Missing Specs

| Code Location | Type | Suggestion |
|---------------|------|------------|
| src/services/[name]/ | Domain | Create 02-domains/[name]/ |
| src/features/[name]/ | Feature | Create 03-features/YYMMDD-[name]/ |
```

---

### Orphaned Spec Detection

**Definition:** Spec exists but corresponding code has been deleted or moved.

**Scan Pattern:**
1. For each spec in `02-domains/` and `03-features/`
2. Check if corresponding code path exists
3. If code deleted → ORPHANED

```markdown
## Orphaned Specs

| Spec | Expected Code Path | Status |
|------|-------------------|--------|
| 02-domains/[name]/ | src/services/[name]/ | Deleted |
| 03-features/YYMMDD-[name]/ | src/features/[name]/ | Moved |
```

---

## Cleanup Patterns

### Archive vs Delete

| Category | Action | Destination |
|----------|--------|-------------|
| Orphaned specs | Archive | `04-operations/archived/` |
| Deprecated specs | Archive | `04-operations/archived/` |
| Empty files | Delete | — |

### Archive Structure

```
04-operations/archived/
├── 241201-legacy-auth/
│   ├── spec.md
│   ├── changelog.md
│   └── tombstone.md    # Reason for archive
└── 241215-temp-fix/
    ├── spec.md
    └── tombstone.md
```

### Tombstone Template

```markdown
# Archived: [spec-name]

**Archived:** YYMMDD
**Reason:** [Orphaned | Deprecated | Replaced]
**Replacement:** [New spec path or "None"]
**Archived by:** [Instance ID or "Manual"]

## Original Location
[Original path]

## Notes
[Any relevant context for future reference]
```

### Cleanup Log Template

```markdown
# Cleanup Log

## YYMMDD - Cleanup Session

| Action | Spec | Reason | Archived To |
|--------|------|--------|-------------|
| Archived | 03-features/241201-legacy-auth | Code deleted | archived/241201-legacy-auth |
| Archived | 02-domains/old-payments | Replaced by payments-v2 | archived/old-payments |
| Deleted | 01-system-core/empty-file.md | Empty file | — |

**Summary:**
- Archived: [N] specs
- Deleted: [M] empty files
```

---

## Tech Debt Tracking

### Tech Debt Template

**Reference:** See `references/tech-debt-template.md` for full template.

**Location:** `04-operations/tech-debt.md`

```markdown
# Tech Debt Register

> **Last Updated:** YYMMDD
> **Total Items:** [N]
> **Estimated Effort:** [X] hours

---

## High Priority (P0)

| ID | Description | Impact | Effort | Created | Owner |
|----|-------------|--------|--------|---------|-------|
| TD-001 | [Description] | [Impact on system] | [S/M/L] | YYMMDD | [name] |

---

## Medium Priority (P1)

| ID | Description | Impact | Effort | Created | Owner |
|----|-------------|--------|--------|---------|-------|
| TD-002 | [Description] | [Impact] | [S/M/L] | YYMMDD | [name] |

---

## Low Priority (P2)

| ID | Description | Impact | Effort | Created | Owner |
|----|-------------|--------|--------|---------|-------|
| TD-003 | [Description] | [Impact] | [S/M/L] | YYMMDD | [name] |

---

## Resolved (Recent)

| ID | Description | Resolved | By | Notes |
|----|-------------|----------|-----|-------|
| TD-000 | [Description] | YYMMDD | [name] | [How resolved] |

---

## Tech Debt Sources

- Implementation shortcuts during time pressure
- Deferred refactoring from code reviews
- Dependencies needing updates
- Performance optimizations deferred
- Test coverage gaps
- Documentation gaps
```

### Tech Debt Entry Rules

| Field | Format | Example |
|-------|--------|---------|
| ID | TD-XXX | TD-001 |
| Priority | P0/P1/P2 | P1 |
| Effort | S (1-2h), M (4-8h), L (>8h) | M |
| Impact | Brief description | "Slows API by 200ms" |

### Adding Tech Debt

When discovering tech debt during implementation:

```markdown
**New Tech Debt Identified:**

| Field | Value |
|-------|-------|
| ID | TD-[next] |
| Description | [What needs to be fixed] |
| Impact | [Why it matters] |
| Priority | [P0/P1/P2] |
| Effort | [S/M/L] |
| Source | [Feature/Code review/Audit] |

Added to: 04-operations/tech-debt.md
```

---

## Health Indicators

### Project Health Thresholds

| Indicator | Green | Yellow | Red |
|-----------|-------|--------|-----|
| Specs up-to-date | >80% | 50-80% | <50% |
| Tech debt items | <5 | 5-15 | >15 |
| Active blockers | 0 | 1-2 | >2 |
| Test coverage | >70% | 40-70% | <40% |
| Missing specs | 0 | 1-3 | >3 |
| Orphaned specs | 0 | 1-2 | >2 |

### Health Report Template

```markdown
**Project Health Report**

| Indicator | Value | Status | Trend |
|-----------|-------|--------|-------|
| Specs up-to-date | [N]% | [🟢/🟡/🔴] | [↑/↓/→] |
| Tech debt | [N] items | [🟢/🟡/🔴] | [↑/↓/→] |
| Active blockers | [N] | [🟢/🟡/🔴] | [↑/↓/→] |
| Test coverage | [N]% | [🟢/🟡/🔴] | [↑/↓/→] |

**Overall:** [Healthy / Needs Attention / Critical]
```

---

## Rules

| Rule | Description |
|------|-------------|
| Non-destructive | Audit only reports, doesn't change |
| Archive, don't delete | Preserve history for orphaned/deprecated |
| Log everything | All actions logged for audit trail |
| Prioritize debt | P0 blocks release, P1/P2 backlog |
| Regular audits | Run weekly or after major changes |
| Actionable | Reports include specific fix commands |
