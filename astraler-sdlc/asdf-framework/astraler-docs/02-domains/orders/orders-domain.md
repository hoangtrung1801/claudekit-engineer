# Orders Domain

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Status**: Planned

---

## 1. Domain Purpose

Manage the complete order lifecycle from cart to delivery, including fulfillment tracking and order history.

---

## 2. Business Rules

### 2.1 Order Creation Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| ORD-001 | Order must have at least 1 item | Validation |
| ORD-002 | Items must be in stock at checkout | Real-time check |
| ORD-003 | Shipping address required | Validation |
| ORD-004 | Order total must match calculated total | Server validation |

### 2.2 Fulfillment Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| ORD-010 | Orders confirmed within 24h or auto-cancel | Cron job |
| ORD-011 | Shipped orders cannot be cancelled | State machine |
| ORD-012 | Delivery within 3-7 business days (domestic) | SLA |
| ORD-013 | Customer notified at each status change | Events |

### 2.3 Cancellation Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| ORD-020 | Customer can cancel before shipping | Application |
| ORD-021 | Admin can cancel any non-delivered order | Application |
| ORD-022 | Cancellation triggers refund process | Event |

---

## 3. Entities

### 3.1 Order

```typescript
interface Order {
  id: string;
  orderNumber: string;    // Human-readable: ORD-YYMMDD-XXXX
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: 'VND';
  shippingAddress: Address;
  billingAddress?: Address;
  paymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

type OrderStatus =
  | 'pending'       // Awaiting payment
  | 'confirmed'     // Payment received
  | 'processing'    // Being prepared
  | 'shipped'       // In transit
  | 'delivered'     // Completed
  | 'cancelled'     // Cancelled
  | 'refunded';     // Refunded
```

### 3.2 OrderItem

```typescript
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;   // Snapshot
  productImage: string;  // Snapshot
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

### 3.3 Address

```typescript
interface Address {
  fullName: string;
  phone: string;
  street: string;
  ward?: string;
  district: string;
  city: string;
  country: string;      // Default: 'VN'
  postalCode?: string;
}
```

---

## 4. State Machine

```
┌─────────────┐
│   Pending   │──────────────────────────┐
└──────┬──────┘                          │
       │ payment confirmed               │ timeout/cancel
       ▼                                 ▼
┌─────────────┐                   ┌─────────────┐
│  Confirmed  │──────────────────►│  Cancelled  │
└──────┬──────┘   cancel          └─────────────┘
       │ prepare
       ▼
┌─────────────┐
│ Processing  │──────────────────►│  Cancelled  │
└──────┬──────┘   cancel          └─────────────┘
       │ ship
       ▼
┌─────────────┐                   ┌─────────────┐
│   Shipped   │──────────────────►│  Refunded   │
└──────┬──────┘   return          └─────────────┘
       │ deliver
       ▼
┌─────────────┐
│  Delivered  │
└─────────────┘
```

---

## 5. Integration Points

### 5.1 Inbound

| Source | Event | Action |
|--------|-------|--------|
| Payments | `payment.succeeded` | Confirm order |
| Payments | `payment.failed` | Mark failed, notify |

### 5.2 Outbound

| Target | Event | Payload |
|--------|-------|---------|
| Notifications | Order created | `{ orderId, userId, items }` |
| Notifications | Status changed | `{ orderId, oldStatus, newStatus }` |
| Inventory | Order confirmed | `{ items[] }` (reserve) |
| Inventory | Order cancelled | `{ items[] }` (release) |

---

## 6. API Contracts

### 6.1 Customer Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/orders` | Create order |
| GET | `/orders` | List my orders |
| GET | `/orders/:id` | Order details |
| POST | `/orders/:id/cancel` | Cancel order |

### 6.2 Admin Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/orders` | List all orders |
| PATCH | `/admin/orders/:id/status` | Update status |
| POST | `/admin/orders/:id/cancel` | Cancel order |

---

## 7. Order Number Format

```
ORD-{YYMMDD}-{XXXX}

Examples:
- ORD-241223-0001
- ORD-241223-0002
```

- Sequential per day
- Reset daily
- Padded to 4 digits

---

**Related Features:**
- `03-features/241221-checkout-flow/`
