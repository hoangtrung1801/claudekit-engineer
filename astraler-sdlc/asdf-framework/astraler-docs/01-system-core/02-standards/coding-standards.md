# Coding Standards

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## 1. General Principles

### 1.1 Core Philosophy

| Principle | Description |
|-----------|-------------|
| **YAGNI** | Don't build features until needed |
| **KISS** | Simplest solution that works |
| **DRY** | Extract when pattern repeats 3+ times |
| **Explicit > Implicit** | Clarity over cleverness |
| **Fail Fast** | Validate early, error explicitly |

### 1.2 Code Quality Targets

- **File Size**: Max 200 lines (excluding tests)
- **Function Size**: Max 50 lines
- **Cyclomatic Complexity**: Max 10 per function
- **Nesting Depth**: Max 3 levels
- **Test Coverage**: Min 80% for critical paths

---

## 2. TypeScript Standards

### 2.1 Type Definitions

```typescript
// ✓ GOOD: Explicit return types for public functions
export function calculateTotal(items: CartItem[]): Money {
  // ...
}

// ✗ BAD: Implicit return type
export function calculateTotal(items: CartItem[]) {
  // ...
}

// ✓ GOOD: Use type aliases for complex types
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

// ✗ BAD: Inline union types repeated
function updateOrder(status: 'pending' | 'confirmed' | 'shipped' | 'delivered') {}
```

### 2.2 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `orderTotal` |
| Functions | camelCase, verb prefix | `getUserById`, `calculateTax` |
| Types/Interfaces | PascalCase | `UserProfile`, `OrderItem` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Files | kebab-case | `user-service.ts` |
| Components | PascalCase | `UserProfile.tsx` |

### 2.3 Import Order

```typescript
// 1. Node built-ins
import { readFile } from 'fs/promises';

// 2. External packages
import { z } from 'zod';
import { Hono } from 'hono';

// 3. Internal aliases (@/)
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// 4. Relative imports
import { validateOrder } from './validators';
import type { Order } from './types';
```

### 2.4 Error Handling

```typescript
// ✓ GOOD: Explicit error types
class OrderNotFoundError extends Error {
  constructor(public orderId: string) {
    super(`Order not found: ${orderId}`);
    this.name = 'OrderNotFoundError';
  }
}

// ✓ GOOD: Result pattern for expected failures
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function getOrder(id: string): Promise<Result<Order, OrderNotFoundError>> {
  const order = await db.orders.find(id);
  if (!order) {
    return { success: false, error: new OrderNotFoundError(id) };
  }
  return { success: true, data: order };
}
```

---

## 3. React/Next.js Standards

### 3.1 Component Structure

```typescript
// components/user-profile.tsx

// 1. Imports
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Types
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// 3. Component
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 3a. Hooks (in order: state, context, queries, effects)
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // 3b. Derived state
  const displayName = user?.name ?? 'Anonymous';

  // 3c. Handlers
  const handleSave = async () => {
    // ...
    onUpdate?.(user);
  };

  // 3d. Early returns
  if (isLoading) return <Skeleton />;
  if (!user) return <NotFound />;

  // 3e. Render
  return (
    <div className="user-profile">
      {/* ... */}
    </div>
  );
}
```

### 3.2 Server Components vs Client Components

| Use Server Component When | Use Client Component When |
|---------------------------|---------------------------|
| Fetching data | Interactive elements |
| Accessing backend resources | useState/useEffect needed |
| Keeping secrets server-side | Browser APIs needed |
| Large dependencies | Event handlers needed |
| SEO-critical content | Real-time updates |

### 3.3 Data Fetching Patterns

```typescript
// ✓ GOOD: Server Component data fetching
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductDetails product={product} />;
}

// ✓ GOOD: Client-side with TanStack Query
function ProductReviews({ productId }: { productId: string }) {
  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getReviews(productId),
  });
  // ...
}
```

---

## 4. API Standards

### 4.1 REST Conventions

| Method | Usage | Response |
|--------|-------|----------|
| GET | Retrieve resource(s) | 200 + data |
| POST | Create resource | 201 + created resource |
| PUT | Replace resource | 200 + updated resource |
| PATCH | Partial update | 200 + updated resource |
| DELETE | Remove resource | 204 no content |

### 4.2 Response Format

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order with ID xxx not found",
    "details": { ... }
  }
}
```

### 4.3 Validation

```typescript
// ✓ GOOD: Zod schemas for validation
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddress: AddressSchema,
  paymentMethod: z.enum(['card', 'bank_transfer', 'cod']),
});

// Use in handler
app.post('/orders', async (c) => {
  const body = await c.req.json();
  const result = CreateOrderSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  // result.data is typed
});
```

---

## 5. Database Standards

### 5.1 Naming

| Entity | Convention | Example |
|--------|------------|---------|
| Tables | snake_case, plural | `order_items` |
| Columns | snake_case | `created_at` |
| Primary Keys | `id` | `id` |
| Foreign Keys | `{table}_id` | `order_id` |
| Indexes | `idx_{table}_{columns}` | `idx_orders_user_id` |

### 5.2 Common Columns

Every table should have:
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
```

### 5.3 Query Patterns

```typescript
// ✓ GOOD: Parameterized queries
const order = await db
  .select()
  .from(orders)
  .where(eq(orders.id, orderId))
  .limit(1);

// ✗ BAD: String interpolation
const order = await db.execute(
  `SELECT * FROM orders WHERE id = '${orderId}'` // SQL injection!
);
```

---

## 6. Testing Standards

### 6.1 Test Structure

```typescript
describe('OrderService', () => {
  describe('createOrder', () => {
    it('should create order with valid items', async () => {
      // Arrange
      const items = [{ productId: '123', quantity: 2 }];

      // Act
      const order = await orderService.createOrder(items);

      // Assert
      expect(order.status).toBe('pending');
      expect(order.items).toHaveLength(1);
    });

    it('should throw when items array is empty', async () => {
      // Arrange & Act & Assert
      await expect(orderService.createOrder([]))
        .rejects.toThrow('Order must have at least one item');
    });
  });
});
```

### 6.2 Test Types

| Type | Coverage Target | Tools |
|------|-----------------|-------|
| Unit | 80%+ critical paths | Vitest |
| Integration | Key flows | Vitest + testcontainers |
| E2E | Happy paths | Playwright |

### 6.3 Mocking Guidelines

- Mock external services (APIs, DB in unit tests)
- Don't mock what you own (internal modules)
- Use factories for test data
- Reset mocks between tests

---

## 7. Git Standards

### 7.1 Commit Messages

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(orders): add COD payment method

Implement cash-on-delivery payment option for Vietnam market.
Includes validation and order status handling.

Closes #123
```

### 7.2 Branch Naming

```
<type>/<ticket-id>-<short-description>
```

Examples:
- `feat/ASTR-123-add-cod-payment`
- `fix/ASTR-456-order-total-calculation`
- `refactor/ASTR-789-auth-service`

---

## 8. Security Standards

### 8.1 Input Validation

- Validate ALL user input
- Use allowlists, not blocklists
- Sanitize before storage AND display
- Limit input lengths

### 8.2 Authentication

- Never store plain-text passwords
- Use short-lived tokens (15min access, 7d refresh)
- Implement rate limiting on auth endpoints
- Log authentication failures

### 8.3 Secrets Management

- Never commit secrets to git
- Use environment variables
- Rotate secrets regularly
- Different secrets per environment

---

**Cross-References:**
- Master Map: `01-architecture/master-map.md`
- Security Policy: `04-governance/security-policy.md`
- Testing Strategy: `02-standards/testing-strategy.md`
