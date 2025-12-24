# Tech Debt Register

> **Last Updated:** YYMMDD
> **Total Items:** 0
> **Critical (P0):** 0
> **High (P1):** 0
> **Medium (P2):** 0

---

## Priority Definitions

| Priority | Definition | SLA |
|----------|------------|-----|
| P0 - Critical | Blocks release, security risk, data loss | Fix immediately |
| P1 - High | Significant impact, workaround exists | Fix within 2 sprints |
| P2 - Medium | Degraded experience, minor impact | Fix when capacity allows |

---

## Active Tech Debt

### P0 - Critical

| ID | Description | Impact | Effort | Created | Owner |
|----|-------------|--------|--------|---------|-------|
| <!-- TD-001 | [Description] | [Impact] | [S/M/L] | YYMMDD | [name] --> |

### P1 - High

| ID | Description | Impact | Effort | Created | Owner |
|----|-------------|--------|--------|---------|-------|
| <!-- TD-002 | [Description] | [Impact] | [S/M/L] | YYMMDD | [name] --> |

### P2 - Medium

| ID | Description | Impact | Effort | Created | Owner |
|----|-------------|--------|--------|---------|-------|
| <!-- TD-003 | [Description] | [Impact] | [S/M/L] | YYMMDD | [name] --> |

---

## Resolved (Recent)

| ID | Description | Resolved | By | Resolution |
|----|-------------|----------|-----|------------|
| <!-- TD-000 | [Description] | YYMMDD | [name] | [How resolved] --> |

---

## ID Convention

Format: `TD-XXX` (sequential, never reused)

| Field | Format | Example |
|-------|--------|---------|
| ID | TD-XXX | TD-001 |
| Effort | S (1-4h), M (4-16h), L (>16h) | M |
| Created | YYMMDD | 251224 |

---

## Common Tech Debt Sources

- Implementation shortcuts under time pressure
- Deferred refactoring from code reviews
- Dependencies needing updates
- Performance optimizations deferred
- Test coverage gaps
- Documentation gaps
- Security hardening deferred
- Accessibility improvements needed

---

## Adding New Tech Debt

When discovering tech debt during implementation:

1. Assign next available ID (TD-XXX)
2. Classify priority (P0/P1/P2)
3. Estimate effort (S/M/L)
4. Add to appropriate section above
5. Update counts in header

**Entry Example:**
```markdown
| TD-004 | API lacks rate limiting | Security risk under load | M | 251224 | @dev |
```

---

## Resolving Tech Debt

1. Move entry to "Resolved" section
2. Add resolution date and method
3. Update counts in header
4. Reference in related PR/commit

---

## Usage

**Location:** `astraler-docs/04-operations/tech-debt.md`

**Commands:**
- View: Read the file directly
- Add: Edit file, add new row
- Report: `/asdf:report all` includes tech debt summary
- Audit: `/asdf:audit` checks for new tech debt indicators
