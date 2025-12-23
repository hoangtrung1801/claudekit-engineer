# Testing Strategy

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## 1. Testing Philosophy

- **Test behavior**, not implementation
- **Fast feedback** - unit tests < 10s, integration < 60s
- **Reliable** - no flaky tests allowed
- **Meaningful coverage** - quality over quantity

---

## 2. Test Pyramid

```
        ╱╲
       ╱  ╲        E2E Tests (10%)
      ╱────╲       - Critical user journeys
     ╱      ╲      - Slow, expensive
    ╱────────╲
   ╱          ╲    Integration Tests (30%)
  ╱────────────╲   - API endpoints
 ╱              ╲  - Database interactions
╱────────────────╲
                   Unit Tests (60%)
                   - Functions, utilities
                   - Fast, isolated
```

---

## 3. Coverage Targets

| Category | Target | Blocking |
|----------|--------|----------|
| **Overall** | > 70% | No |
| **Critical Paths** | > 90% | Yes |
| **New Code** | > 80% | Yes |
| **Utilities** | > 95% | No |

### Critical Paths

- Authentication flow
- Payment processing
- Order creation
- Data validation

---

## 4. Test Types

### 4.1 Unit Tests

**Purpose**: Test individual functions/modules in isolation

```typescript
// ✓ GOOD: Test behavior
describe('calculateOrderTotal', () => {
  it('should sum item prices with quantities', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ];
    expect(calculateOrderTotal(items)).toBe(250);
  });

  it('should apply discount percentage', () => {
    const items = [{ price: 100, quantity: 1 }];
    expect(calculateOrderTotal(items, { discount: 10 })).toBe(90);
  });
});
```

**Tools**: Vitest
**Location**: `*.test.ts` alongside source files
**Run**: `pnpm test:unit`

### 4.2 Integration Tests

**Purpose**: Test component interactions and API endpoints

```typescript
describe('POST /api/orders', () => {
  it('should create order with valid data', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: 'xxx', quantity: 1 }],
        shippingAddress: validAddress,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.orderNumber).toMatch(/^ORD-/);
  });
});
```

**Tools**: Vitest + Supertest
**Location**: `__tests__/integration/`
**Run**: `pnpm test:integration`

### 4.3 E2E Tests

**Purpose**: Test complete user flows in real browser

```typescript
test('user can complete checkout', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Add to cart
  await page.goto('/products/test-product');
  await page.click('button:has-text("Add to Cart")');

  // Checkout
  await page.goto('/checkout');
  await page.fill('[name="address"]', '123 Test St');
  await page.click('button:has-text("Place Order")');

  // Verify
  await expect(page).toHaveURL(/\/orders\//);
  await expect(page.locator('h1')).toContainText('Order Confirmed');
});
```

**Tools**: Playwright
**Location**: `e2e/`
**Run**: `pnpm test:e2e`

---

## 5. Test Data

### 5.1 Factories

```typescript
// factories/user.ts
export const createUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  role: 'customer',
  ...overrides,
});

// Usage
const adminUser = createUser({ role: 'admin' });
```

### 5.2 Fixtures

```typescript
// fixtures/products.ts
export const sampleProducts = [
  { id: 'prod-1', name: 'Test Product', price: 100000 },
  { id: 'prod-2', name: 'Another Product', price: 200000 },
];
```

### 5.3 Rules

- **NEVER** use production data
- **NEVER** hardcode IDs (use factories)
- **ALWAYS** clean up after tests
- **PREFER** in-memory DB for unit tests

---

## 6. Mocking Guidelines

### 6.1 What to Mock

| Mock | Don't Mock |
|------|------------|
| External APIs | Internal modules |
| Time/Date | Pure functions |
| Random values | Database (integration) |
| Network requests | Business logic |

### 6.2 Mock Examples

```typescript
// Mock external API
vi.mock('@/lib/sepay', () => ({
  createPayment: vi.fn().mockResolvedValue({ id: 'pay_xxx' }),
}));

// Mock time
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-12-23'));

// Mock environment
vi.stubEnv('API_KEY', 'test-key');
```

---

## 7. CI/CD Integration

### 7.1 Pipeline Stages

```yaml
test:
  stage: test
  script:
    - pnpm test:unit --coverage
    - pnpm test:integration
  artifacts:
    reports:
      coverage: coverage/lcov.info

test-e2e:
  stage: test
  needs: [deploy-preview]
  script:
    - pnpm test:e2e
```

### 7.2 Quality Gates

| Check | Threshold | Action |
|-------|-----------|--------|
| Unit tests | 100% pass | Block merge |
| Integration tests | 100% pass | Block merge |
| Coverage | > 70% | Warning |
| E2E tests | 100% pass | Block deploy |

---

## 8. Test Naming

### 8.1 Convention

```
describe('[Unit/Feature]', () => {
  describe('[method/scenario]', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange, Act, Assert
    });
  });
});
```

### 8.2 Examples

```typescript
describe('OrderService', () => {
  describe('createOrder', () => {
    it('should create order with valid items', () => {});
    it('should throw when items array is empty', () => {});
    it('should apply discount when coupon is valid', () => {});
  });
});
```

---

## 9. Debugging Tests

### 9.1 Commands

```bash
# Run single test file
pnpm test path/to/file.test.ts

# Run tests matching pattern
pnpm test -t "should create order"

# Watch mode
pnpm test --watch

# Debug mode
pnpm test --inspect-brk
```

### 9.2 Troubleshooting

| Issue | Solution |
|-------|----------|
| Flaky test | Add explicit waits, check async |
| Slow test | Mock external calls, reduce scope |
| Failing in CI | Check environment differences |

---

**Cross-References:**
- Coding Standards: `02-standards/coding-standards.md`
- CI/CD: `01-architecture/infrastructure.md`
