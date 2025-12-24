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

### Step 1: Load Spec and Test Context

1. Load the spec at provided path (or find by feature name in `astraler-docs/03-features/`)
2. Load testing standards from `astraler-docs/01-system-core/02-standards/testing-strategy.md`
3. Identify existing test patterns in codebase
4. Note acceptance criteria (AC-XXX) — these become test cases

---

### Step 2: Analyze Test Requirements

Present test plan:

```markdown
**Test Generation Plan**

Feature: [feature-name]
Spec Version: [X.Y.Z]

**Test Types Required:**

| Type | Count | Coverage |
|------|-------|----------|
| Unit | [N] | Core logic |
| Integration | [N] | API endpoints |
| E2E | [N] | User flows |

**From Acceptance Criteria:**

| AC | Description | Test Type | Priority |
|----|-------------|-----------|----------|
| AC-001 | [criteria] | Unit | P1 |
| AC-002 | [criteria] | Integration | P1 |
| AC-003 | [criteria] | E2E | P2 |

**Additional Tests (from spec analysis):**

- Edge case: [description]
- Error handling: [description]
- Performance: [if NFR defined]

**Proceed with test generation? (yes/feedback)**
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

**E2E Tests:**
```typescript
// e2e/[feature].spec.ts
describe('[Feature] User Flow', () => {
  it('should complete [flow name] (AC-003)', () => {
    // User journey steps
  });
});
```

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
