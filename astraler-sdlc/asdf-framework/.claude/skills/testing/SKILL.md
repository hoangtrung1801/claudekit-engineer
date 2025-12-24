---
name: testing
description: Generate test cases from spec acceptance criteria and testing section.
---

# Testing Skill

Generate comprehensive test suites from feature specifications.

## When to Use

- `/asdf:test` command
- When spec Testing section needs population
- After implementation to verify coverage
- Creating new feature specs (generate initial test plan)

---

## Test Generation Protocol

### Step 1: Extract Test Sources

From spec, extract:

| Spec Section | Test Type | Priority |
|--------------|-----------|----------|
| Acceptance Criteria (AC-XXX) | Direct test cases | P0 |
| Functional Requirements (FR-XXX) | Unit tests | P0-P1 |
| Non-Functional Requirements (NFR-XXX) | Performance tests | P1 |
| Error Codes | Error handling tests | P0 |
| API Contracts | Integration tests | P0 |
| State Machines | State transition tests | P0 |
| Edge Cases (from Open Questions) | Edge case tests | P1-P2 |

### Step 2: Generate Test Plan

Present for review:

```markdown
**Test Plan for [Feature]**

Spec: `03-features/YYMMDD-[feature]/spec.md`
Version: [X.Y.Z]

---

### Unit Tests

| Test ID | AC/FR | Description | Input | Expected Output |
|---------|-------|-------------|-------|-----------------|
| UT-001 | AC-001 | Valid login with correct credentials | valid email/password | JWT token returned |
| UT-002 | AC-001 | Invalid password rejected | valid email, wrong password | 401 Unauthorized |
| UT-003 | AC-001 | Non-existent user rejected | unknown email | 404 Not Found |
| UT-004 | FR-002 | Password hashed before storage | plain password | bcrypt hash stored |

### Integration Tests

| Test ID | AC/FR | Description | Preconditions | Steps | Expected Result |
|---------|-------|-------------|---------------|-------|-----------------|
| IT-001 | AC-003 | Complete login flow | User exists | 1. POST /auth/login 2. Verify token | 200 + valid JWT |
| IT-002 | AC-004 | Token refresh | Valid refresh token | 1. POST /auth/refresh | New access token |

### Edge Cases

| Case ID | Scenario | Description | How to Handle |
|---------|----------|-------------|---------------|
| EC-001 | Rate limit | 10+ login attempts | Return 429, block 5 min |
| EC-002 | Concurrent sessions | Same user, multiple devices | Allow up to 5 sessions |
| EC-003 | Token expiry | Access token expired | 401, use refresh token |

---

**Summary:**
- Unit Tests: [N] cases
- Integration Tests: [M] cases
- Edge Cases: [O] cases

Proceed with test generation? (yes/feedback)
```

### Step 3: Update Spec Testing Section

After confirmation, update spec's `## Testing` section:

```markdown
## Testing

> **Generated:** YYMMDD
> **Coverage Target:** 80%

### Unit Tests

| Test ID | Description | Input | Expected Output | Status |
|---------|-------------|-------|-----------------|--------|
| UT-001 | Valid login | valid email/password | JWT token returned | Pending |
| UT-002 | Invalid password | valid email, wrong pass | 401 Unauthorized | Pending |
| UT-003 | Non-existent user | unknown email | 404 Not Found | Pending |

### Integration Tests

| Test ID | Description | Preconditions | Steps | Expected Result | Status |
|---------|-------------|---------------|-------|-----------------|--------|
| IT-001 | Complete login flow | User exists | 1. POST /auth/login | 200 + JWT | Pending |

### Edge Cases

| Case ID | Description | How to Handle | Status |
|---------|-------------|---------------|--------|
| EC-001 | Rate limit (10+ attempts) | 429, block 5 min | Pending |
| EC-002 | Concurrent sessions | Allow up to 5 | Pending |
```

---

## Test File Generation

When user confirms "generate test files", create:

### Unit Test Template

```typescript
// __tests__/[feature]/[component].test.ts

describe('[Feature]: [Component]', () => {
  describe('AC-001: [Acceptance Criteria]', () => {
    it('UT-001: should [expected behavior]', () => {
      // Arrange
      const input = { /* from spec examples */ };

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toEqual(/* expected */);
    });

    it('UT-002: should handle edge case: [case]', () => {
      // Test edge case from EC-XXX
    });
  });
});
```

### Integration Test Template

```typescript
// __tests__/[feature]/[endpoint].integration.test.ts

describe('[Feature] API', () => {
  describe('POST /api/[endpoint]', () => {
    it('IT-001: should return 200 with valid input (AC-002)', async () => {
      // Arrange
      const request = { /* from spec API examples */ };

      // Act
      const response = await api.post('/endpoint', request);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(/* expected */);
    });

    it('IT-002: should return 400 with invalid input', async () => {
      // Test validation
    });

    it('IT-003: should return 401 without auth', async () => {
      // Test auth requirement
    });
  });
});
```

### Fixtures Template

```typescript
// __tests__/[feature]/fixtures.ts

// From spec examples
export const validInput = {
  email: 'user@example.com',
  password: 'SecurePass123!',
};

// Edge cases
export const invalidInputs = {
  emptyEmail: { email: '', password: 'pass' },
  malformedEmail: { email: 'not-an-email', password: 'pass' },
  shortPassword: { email: 'user@example.com', password: '123' },
};

// Mock responses
export const mockResponses = {
  successfulLogin: {
    token: 'eyJ...',
    expiresIn: 3600,
  },
};
```

---

## Test Naming Convention

| Type | File Pattern | Test ID Pattern |
|------|--------------|-----------------|
| Unit | `[component].test.ts` | UT-001, UT-002, ... |
| Integration | `[endpoint].integration.test.ts` | IT-001, IT-002, ... |
| E2E | `[flow].e2e.test.ts` | E2E-001, E2E-002, ... |
| Edge Case | (within unit/integration) | EC-001, EC-002, ... |

---

## Test Report Template

After test generation:

```markdown
**Test Generation Complete**

Feature: [feature-name]
Spec Version: [X.Y.Z]

**Summary:**
| Type | Count | Files |
|------|-------|-------|
| Unit | [N] | [M] |
| Integration | [N] | [M] |
| Edge Cases | [N] | - |
| **Total** | [T] | [F] |

**Files Created:**
- `__tests__/[feature]/[component].test.ts`
- `__tests__/[feature]/[endpoint].integration.test.ts`
- `__tests__/[feature]/fixtures.ts`

**Spec Updated:**
- `03-features/YYMMDD-[feature]/spec.md` — Testing section populated

**Next Steps:**
1. Run tests: `npm test -- --grep "[feature]"`
2. Check coverage: `npm run coverage`
3. Mark tests as Passing/Failing in spec

**Coverage Target:** 80%
```

---

## Rules

| Rule | Description |
|------|-------------|
| AC-First | Every acceptance criterion must have at least one test |
| Traceable | Test names include AC/FR reference |
| Complete | Happy path + error cases + edge cases |
| Prioritized | P0 tests block release, P1 should have, P2 nice to have |
| Isolated | Tests must be independent |
| Deterministic | No flaky tests |
| Fixtures | Use spec examples as test data |

---

## Test Types by Spec Section

| Spec Section | Test Type |
|--------------|-----------|
| Acceptance Criteria | Unit + Integration |
| Functional Requirements | Unit |
| Non-Functional Requirements | Performance + Load |
| API Contract | Integration + API |
| UI/UX | E2E (Playwright) + Visual regression |
| Error Codes | Unit + Integration |
| State Machine | Unit (state transitions) |

---

## Test Matrix Format (v4)

Present test coverage as a matrix before generating:

```markdown
**Test Matrix: [feature-name]**

┌────────┬───────────────────────────────────────────────────────────────┐
│ AC     │ Test Types                                                    │
│        ├────────────┬─────────────┬────────────┬───────────────────────┤
│        │ Unit       │ Integration │ API        │ E2E (Playwright)      │
├────────┼────────────┼─────────────┼────────────┼───────────────────────┤
│ AC-001 │ [x] P1     │ [ ]         │ [ ]        │ [ ]                   │
│ AC-002 │ [ ]        │ [x] P1      │ [x] P1     │ [ ]                   │
│ AC-003 │ [ ]        │ [ ]         │ [ ]        │ [x] P2                │
└────────┴────────────┴─────────────┴────────────┴───────────────────────┘
```

**Priority Legend:**
- P0: Critical path, blocks release
- P1: Core functionality
- P2: Important edge cases
- P3: Nice to have

---

## E2E Tests (Optional)

> **Note:** E2E tests are optional and add complexity. Prioritize Unit + Integration tests first.
> Only add E2E for critical user journeys that can't be tested otherwise.

### When to Use E2E

| Use E2E | Skip E2E |
|---------|----------|
| Critical checkout/payment flows | CRUD operations |
| Complex multi-step wizards | API-only features |
| Cross-browser compatibility required | Backend services |

---

### E2E File Structure

```
e2e/
├── [feature].spec.ts        # Test specs (one per feature)
├── pages/                   # Page Object Model (optional)
│   └── [page-name].page.ts
├── fixtures/                # Test data and setup
│   └── [feature].fixtures.ts
└── playwright.config.ts     # Config (generated by init)
```

---

### Basic E2E Template (Playwright)

```typescript
// e2e/[feature].spec.ts
import { test, expect } from '@playwright/test';

test.describe('[Feature] - [User Journey]', () => {
  test('AC-XXX: [description from spec]', async ({ page }) => {
    // 1. Navigate
    await page.goto('/[url]');

    // 2. Interact (use accessible locators)
    await page.getByRole('button', { name: '[button-text]' }).click();
    await page.getByLabel('[label-text]').fill('[value]');

    // 3. Assert outcome
    await expect(page).toHaveURL('/[expected-url]');
    await expect(page.getByText('[expected-text]')).toBeVisible();
  });
});
```

---

### Page Object Pattern (Optional)

Use for complex, reusable page interactions:

```typescript
// e2e/pages/[page-name].page.ts
import { Page, Locator } from '@playwright/test';

export class [PageName]Page {
  readonly page: Page;
  readonly [element]: Locator;

  constructor(page: Page) {
    this.page = page;
    this.[element] = page.getByRole('[role]', { name: '[name]' });
  }

  async [action]() {
    await this.[element].click();
  }
}
```

Usage:
```typescript
// e2e/[feature].spec.ts
import { [PageName]Page } from './pages/[page-name].page';

test('AC-XXX: [description]', async ({ page }) => {
  const [pageName] = new [PageName]Page(page);
  await [pageName].[action]();
});
```

---

### Locator Best Practices

| Priority | Locator | Example |
|----------|---------|---------|
| 1st | `getByRole()` | `page.getByRole('button', { name: 'Submit' })` |
| 2nd | `getByLabel()` | `page.getByLabel('Email')` |
| 3rd | `getByText()` | `page.getByText('Welcome')` |
| 4th | `getByTestId()` | `page.getByTestId('submit-btn')` |
| Last | CSS/XPath | Avoid unless necessary |

---

### Setup Reference

For Playwright setup and configuration:
- **Install:** `npm init playwright@latest`
- **Docs:** https://playwright.dev/docs/intro
- **Best practices:** https://playwright.dev/docs/best-practices
- **Locators:** https://playwright.dev/docs/locators
