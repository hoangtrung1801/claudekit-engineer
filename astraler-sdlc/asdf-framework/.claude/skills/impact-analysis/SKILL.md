---
name: impact-analysis
description: Check dependencies and detect breaking changes before implementation.
---

# Impact Analysis

Analyze feature dependencies and detect potential breaking changes to existing specs before implementation.

## When to Use

- Before `/asdf:code` (mandatory in EXECUTE MODE)
- When creating specs that modify shared entities
- Before major refactoring
- When adding features that touch existing domains

---

## Part 1: Dependency Check

### Protocol

1. **Read spec Dependencies section**
   ```markdown
   ## Dependencies

   ### Domain Dependencies
   - `auth` - User authentication required

   ### Feature Dependencies
   - `241220-user-auth` - Must be implemented first

   ### External Dependencies
   - Supabase Auth SDK
   ```

2. **Check implementation status**
   - Query `04-operations/active/[feature].md` for in-progress features
   - Query `implementation-active.md` for completion status
   - Check domain specs for implementation markers

3. **Present dependency result**

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

4. **If BLOCKED, present options**

```markdown
**BLOCKED: Dependencies not satisfied**

Missing Dependencies:
| Dependency | Type | Status | Required For |
|------------|------|--------|--------------|
| 241221-checkout | Feature | 60% | Payment processing |

Options:
- **[wait]** Abort until dependencies ready
- **[stub]** Create interface stubs, implement later
- **[override]** Proceed anyway (RISK: integration failures)

What would you like to do?
```

---

## Part 2: Breaking Change Detection

### Analysis Scope

| Category | What to Check |
|----------|---------------|
| Database | Shared tables, column changes, FK relationships |
| API | Endpoint signature changes, response structure |
| Shared Code | Utility functions, types, interfaces |
| Config | Environment variables, feature flags |
| External | Third-party API contracts |

### Protocol

1. **Scan existing features**
   - Load all specs from `03-features/`
   - Extract entities, endpoints, dependencies
   - Build shared resource map

2. **Identify overlaps**
   - Compare current feature's technical design with existing
   - Find shared entities (same table names)
   - Find shared endpoints (same API paths)
   - Find shared utilities

3. **Assess impact severity**

| Severity | Criteria | Example | Action |
|----------|----------|---------|--------|
| HIGH | Breaking change, requires code update | API signature change | Must acknowledge |
| MEDIUM | Behavioral change, may need adjustment | Default value change | Should review |
| LOW | Additive change, backwards compatible | New optional field | Proceed safely |

4. **Present impact analysis**

```markdown
**Impact Analysis**

Feature: [current-feature]

**Breaking Changes Detected:**

| Affected Feature | Type | Change | Severity |
|------------------|------|--------|----------|
| 241220-user-auth | API | POST /auth/login adds required field | HIGH |
| 241221-checkout | Schema | Order.userId type UUID→string | HIGH |
| 241222-notifications | Config | New env var required | MEDIUM |

**Total Impact:** [N] HIGH, [M] MEDIUM, [O] LOW
```

5. **If HIGH severity, present details**

```markdown
### HIGH Impact: 241220-user-auth

**Current State:**
- POST /auth/login accepts `{email, password}`

**After This Feature:**
- POST /auth/login requires `{email, password, deviceId}`

**Breaking Impact:**
- All existing login flows will fail without deviceId
- Mobile app version 1.x will break
- Integration tests need update

**Mitigation Options:**
1. Make deviceId optional with default
2. Version the API (/v2/auth/login)
3. Deprecation period for old format

---

Options:
- **[review]** Show detailed impact for each affected feature
- **[proceed]** Continue (will update affected specs later)
- **[abort]** Cancel implementation

What would you like to do?
```

---

## Quick Reference

### Dependency Section Template for Specs

```markdown
## Dependencies

### Requires (must be implemented first)

| Feature | Reason | Status |
|---------|--------|--------|
| 241220-user-auth | Need auth token | Implemented |
| 241221-checkout | Need order data | In Progress |

### Required By (other features waiting)

| Feature | Reason |
|---------|--------|
| 241225-order-history | Needs order data |

### Domain Dependencies

- `auth` - User authentication and session management
- `payments` - Payment processing integration

### External Dependencies

- Supabase Auth SDK v2.x
- SePay API v1
```

### Files to Check

| File | Purpose |
|------|---------|
| `03-features/*/spec.md` | Feature dependencies and entities |
| `02-domains/*/[domain]-domain.md` | Domain entities and APIs |
| `04-operations/active/` | In-progress features |
| `implementation-active.md` | Completion status |

---

## Override Tracking

When user chooses `[override]` or `[proceed]` with HIGH impact:

1. Log in `implementation-active.md`:
   ```markdown
   ## Impact Overrides

   | Date | Feature | Impact | Decision | Reason |
   |------|---------|--------|----------|--------|
   | YYMMDD | [feature] | HIGH: [affected] | Proceed | [user reason] |
   ```

2. Create sync task:
   ```markdown
   **Reminder:** Run `/asdf:sync` for affected features after implementation.

   Affected specs to update:
   - `03-features/241220-user-auth/spec.md`
   - `03-features/241221-checkout/spec.md`
   ```

---

## Rules

- **Block on HIGH** — HIGH severity requires explicit acknowledgment
- **Warn on MEDIUM** — Show but allow proceeding
- **Log overrides** — Track all override decisions
- **Cascade awareness** — Show downstream impacts (features that depend on affected features)
