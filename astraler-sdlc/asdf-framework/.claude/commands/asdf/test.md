---
description: TEST MODE - Generate test suites from feature specifications
argument-hint: [spec-path]
---

# TEST MODE: Generate Tests from Spec

**Spec Path:** $ARGUMENTS

---

## Skills Required

- **Activate:** `testing` (for test generation patterns)
- **Activate:** `context-loading` (for project test conventions)

---

## Workflow

### Step 0.5: Check Spec Status

1. Load the spec at provided path (or find by feature name in `astraler-docs/03-features/`)
2. Check spec status from header

**If status is NOT "Synced":**

```markdown
**⚠️ WARNING: Spec Not Synced**

Spec Status: [Draft | Review | Approved | Implemented]

The spec has not been synced with the implementation yet.
Tests generated from an unsynced spec may not reflect the actual code behavior.

**Correct workflow order:**
1. `/asdf:code` → Status becomes "Implemented"
2. `/asdf:sync` → Status becomes "Synced"
3. `/asdf:test` → Generate tests from synced spec ← You are here

**Options:**
- **[proceed]** Generate tests anyway (may need updates later)
- **[sync-first]** Run `/asdf:sync` first, then come back
- **[abort]** Cancel and sync manually

What would you like to do?
```

**If status is "Synced":** Continue to Step 1.

---

### Step 1: Load Spec and Test Context

1. Load the spec at provided path (or find by feature name in `astraler-docs/03-features/`)
2. Load testing standards from `astraler-docs/01-system-core/02-standards/testing-strategy.md`
3. Identify existing test patterns in codebase
4. Note acceptance criteria (AC-XXX) — these become test cases

---

### Step 2: Analyze and Present Test Matrix

Present test matrix with classification:

```markdown
**Test Matrix: [feature-name]**

Spec Version: [X.Y.Z]

---

## Test Coverage Matrix

┌────────┬───────────────────────────────────────────────────────────────┐
│ AC     │ Test Types                                                    │
│        ├────────────┬─────────────┬────────────┬───────────────────────┤
│        │ Unit       │ Integration │ API        │ E2E (Playwright)      │
├────────┼────────────┼─────────────┼────────────┼───────────────────────┤
│ AC-001 │ [x] P1     │ [ ]         │ [ ]        │ [ ]                   │
│ AC-002 │ [ ]        │ [x] P1      │ [x] P1     │ [ ]                   │
│ AC-003 │ [ ]        │ [ ]         │ [ ]        │ [x] P2                │
│ AC-004 │ [x] P1     │ [x] P2      │ [ ]        │ [ ]                   │
└────────┴────────────┴─────────────┴────────────┴───────────────────────┘

---

## Test Classification

| Type | Framework | Location | Count |
|------|-----------|----------|-------|
| Unit | Jest/Vitest | `__tests__/[feature]/` | [N] |
| Integration | Jest + Supertest | `__tests__/[feature]/*.integration.test.ts` | [N] |
| API | Jest + HTTP client | `__tests__/[feature]/*.api.test.ts` | [N] |
| E2E | Playwright | `e2e/[feature].spec.ts` | [N] |

---

## Priority Legend

- **P0**: Critical path, must pass for release
- **P1**: High priority, core functionality
- **P2**: Medium priority, important but not blocking
- **P3**: Low priority, edge cases

---

**Additional Tests (from spec analysis):**
- Edge case: [description]
- Error handling: [description]
- Performance: [if NFR defined]

**Options:**
- **[yes]** Generate all tests (Unit + Integration + API + E2E files)
- **[skip-e2e]** Generate Unit + Integration + API only (recommended for most features)
- **[run-e2e]** Generate Unit/Integration/API files + run E2E via Playwright MCP directly
- **[feedback]** Adjust test plan
```

---

### Step 3: Generate Test Files

For each acceptance criterion, generate tests:

**Unit Tests:**
```typescript
// __tests__/[feature]/[component].test.ts
describe('[Feature]: [Component]', () => {
  describe('AC-001: [criteria]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle edge case: [case]', () => {
      // Test edge case
    });
  });
});
```

**Integration Tests:**
```typescript
// __tests__/[feature]/[endpoint].integration.test.ts
describe('[Feature] API', () => {
  describe('POST /api/[endpoint]', () => {
    it('should return 200 with valid input (AC-002)', async () => {
      // Test happy path
    });

    it('should return 400 with invalid input', async () => {
      // Test validation
    });

    it('should return 401 without auth', async () => {
      // Test auth requirement
    });
  });
});
```

**E2E Tests (Playwright MCP) — Optional:**

> E2E tests add complexity. Only use for critical user journeys.
> Use `skip-e2e` option if not needed.

**Two Options for E2E Testing:**

**Option A: Run Directly via Playwright MCP (Recommended)**

If Playwright MCP is available, run E2E tests interactively without generating files:

```markdown
**E2E Test: [AC-XXX] - [description]**

Running via Playwright MCP...

1. Navigate to [url]
2. [Action from spec user flow]
3. Assert: [expected result]

Result: ✅ PASS | ❌ FAIL

[Screenshot captured if needed]
```

Use MCP tools:
- `playwright_navigate` — Go to URL
- `playwright_click` — Click elements
- `playwright_fill` — Fill form fields
- `playwright_screenshot` — Capture state
- `playwright_evaluate` — Run assertions

**Option B: Generate Test File**

For CI/CD integration, generate Playwright test files:

```typescript
// e2e/[feature].spec.ts
import { test, expect } from '@playwright/test';

test.describe('[Feature] - [User Journey]', () => {
  test('AC-XXX: [description]', async ({ page }) => {
    // Navigate
    await page.goto('/[url]');

    // Interact (from spec user flow)
    // ...

    // Assert
    await expect(page.getByText('[expected]')).toBeVisible();
  });
});
```

**Setup:** Run `npm init playwright@latest` — see https://playwright.dev/docs/intro

---

### Step 4: Generate Test Fixtures

Create fixtures from spec examples:

```typescript
// __tests__/[feature]/fixtures.ts
export const validInput = {
  // From spec examples
};

export const invalidInput = {
  // Edge cases
};

export const mockResponses = {
  // API response mocks
};
```

---

### Step 5: Update Spec with Test Coverage

Add test mapping to spec (Reverse Sync):

```markdown
## 7. Testing (Auto-generated)

| AC | Test File | Test Name | Status |
|----|-----------|-----------|--------|
| AC-001 | `component.test.ts` | "should [behavior]" | ✅ |
| AC-002 | `endpoint.integration.test.ts` | "should return 200" | ✅ |
| AC-003 | `feature.spec.ts` | "should complete flow" | ✅ |

**Coverage Target:** 80%
**Generated:** YYMMDD
```

---

### Step 6: Present Test Report

```markdown
**Test Generation Complete**

Feature: [feature-name]
Tests Generated: [N] total

**Breakdown:**
- Unit: [N] tests in [M] files
- Integration: [N] tests in [M] files
- E2E: [N] tests in [M] files

**Files Created:**
- `__tests__/[feature]/[component].test.ts`
- `__tests__/[feature]/[endpoint].integration.test.ts`
- `e2e/[feature].spec.ts`
- `__tests__/[feature]/fixtures.ts`

**Next Steps:**
1. Run tests: `npm test -- --grep "[feature]"`
2. Check coverage: `npm run coverage`
3. Review and adjust as needed

**Spec updated:** Testing section added with test mapping
```

---

## Test Generation Rules

| Rule | Description |
|------|-------------|
| AC-First | Every AC must have at least one test |
| Naming | Test names include AC reference |
| Fixtures | Use spec examples as test data |
| Coverage | Aim for 80% minimum |
| Isolation | Tests must be independent |
| Deterministic | No flaky tests |

---

## Test Types by Spec Section

| Spec Section | Test Type |
|--------------|-----------|
| Functional Requirements | Unit + Integration |
| Non-Functional Requirements | Performance + Load |
| API Contract | Integration |
| UI/UX | E2E + Visual regression |
| Error Codes | Unit + Integration |
| State Machine | Unit |

---

## Rules

- **Spec-Driven** — Tests derived from acceptance criteria
- **Traceable** — Every test maps to spec section
- **Comprehensive** — Happy path + edge cases + error cases
- **Maintainable** — Use fixtures, avoid magic values
- **Fast Feedback** — Prioritize unit over E2E where possible
- **Living Docs** — Tests document expected behavior
- **Matrix First** — Present test matrix before generating
- **Playwright for E2E** — Use Playwright for browser tests

---

## Help

**Usage:** `/asdf:test [spec-path|feature-name]`

**Arguments:**
- spec-path: Full path to spec.md (e.g., `astraler-docs/03-features/241220-checkout/`)
- feature-name: Feature name to find in `03-features/` (e.g., `checkout`)

**Behavior:**
1. Load spec and testing standards
2. Analyze acceptance criteria
3. Present test matrix with classification
4. Generate test files (Unit, Integration, API, E2E)
5. Generate fixtures from spec examples
6. Update spec with test mapping

**Test Frameworks:**
- Unit: Jest or Vitest
- Integration: Jest + Supertest
- API: Jest + HTTP client
- E2E: Playwright

**Examples:**
- `/asdf:test checkout` — Generate tests for checkout feature
- `/asdf:test astraler-docs/03-features/241220-user-auth/` — Full path

**Options during generation:**
- `skip-e2e` — Generate Unit + Integration + API only (recommended)
- `yes` — Generate all tests including E2E
- `feedback` — Adjust test plan

**Correct Workflow Order:**
1. `/asdf:code` — Implement feature → Status: Implemented
2. `/asdf:sync` — Sync deviations → Status: Synced
3. `/asdf:test` — Generate tests ← Run after sync!

**Related:**
- `/asdf:code` — Implement feature
- `/asdf:sync` — Sync spec with code (run BEFORE test)
- `/asdf:report` — Check test coverage
- `/asdf` — All commands
