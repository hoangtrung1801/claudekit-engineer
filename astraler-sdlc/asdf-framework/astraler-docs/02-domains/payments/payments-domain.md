# Payments Domain

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Status**: In Development

---

## 1. Domain Purpose

Process financial transactions, manage payment methods, handle refunds, and ensure PCI compliance through third-party providers.

---

## 2. Business Rules

### 2.1 Transaction Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| PAY-001 | Minimum order amount: 10,000 VND | Validation |
| PAY-002 | Maximum single transaction: 100M VND | Provider limit |
| PAY-003 | COD available only in supported regions | Application |
| PAY-004 | Bank transfer expires after 24 hours | Cron job |
| PAY-005 | Card payments require 3DS for >2M VND | Provider |

### 2.2 Refund Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| PAY-010 | Refunds within 7 days of delivery | Application |
| PAY-011 | Partial refunds allowed | Application |
| PAY-012 | COD refunds via bank transfer | Manual process |
| PAY-013 | Refund processing: 3-5 business days | SLA |

---

## 3. Entities

### 3.1 Payment

```typescript
interface Payment {
  id: string;
  orderId: string;
  amount: number;         // In smallest unit (VND dong)
  currency: 'VND' | 'USD';
  method: PaymentMethod;
  status: PaymentStatus;
  provider: 'sepay' | 'stripe';
  providerPaymentId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  failedAt?: Date;
}

type PaymentMethod =
  | 'bank_transfer'
  | 'card'
  | 'cod'
  | 'momo'
  | 'vnpay';

type PaymentStatus =
  | 'pending'      // Awaiting payment
  | 'processing'   // Payment initiated
  | 'succeeded'    // Payment confirmed
  | 'failed'       // Payment failed
  | 'cancelled'    // User cancelled
  | 'refunded'     // Fully refunded
  | 'partial_refund';
```

### 3.2 Refund

```typescript
interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  providerRefundId?: string;
  createdAt: Date;
  processedAt?: Date;
}
```

---

## 4. State Machine

### 4.1 Payment States

```
┌─────────────┐
│   Pending   │
└──────┬──────┘
       │ initiate
       ▼
┌─────────────┐     ┌─────────────┐
│ Processing  │────►│   Failed    │
└──────┬──────┘     └─────────────┘
       │ confirm
       ▼
┌─────────────┐     ┌─────────────┐
│  Succeeded  │────►│  Refunded   │
└─────────────┘     └─────────────┘
```

### 4.2 Allowed Transitions

| From | To | Trigger |
|------|-----|---------|
| pending | processing | User initiates |
| pending | cancelled | User cancels / timeout |
| processing | succeeded | Provider confirms |
| processing | failed | Provider rejects |
| succeeded | refunded | Admin refunds |
| succeeded | partial_refund | Partial refund |

---

## 5. Integration Points

### 5.1 Providers

| Provider | Methods | Markets |
|----------|---------|---------|
| SePay | Bank transfer, VietQR | Vietnam |
| Stripe | Card, Apple Pay | International |

### 5.2 Webhooks

| Provider | Endpoint | Events |
|----------|----------|--------|
| SePay | `/webhooks/sepay` | `payment.success`, `payment.failed` |
| Stripe | `/webhooks/stripe` | `payment_intent.*`, `refund.*` |

### 5.3 Outbound Events

| Event | Target | Payload |
|-------|--------|---------|
| `payment.succeeded` | Orders | `{ paymentId, orderId }` |
| `payment.failed` | Orders | `{ paymentId, orderId, reason }` |
| `payment.succeeded` | Notifications | `{ userId, amount, orderId }` |

---

## 6. API Contracts

### 6.1 Customer Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/payments/initiate` | Start payment flow |
| GET | `/payments/:id` | Get payment status |
| POST | `/payments/:id/cancel` | Cancel pending payment |

### 6.2 Admin Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/payments` | List all payments |
| POST | `/admin/payments/:id/refund` | Issue refund |
| GET | `/admin/payments/stats` | Payment analytics |

---

## 7. Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `PAY_AMOUNT_TOO_LOW` | 400 | Below minimum |
| `PAY_AMOUNT_TOO_HIGH` | 400 | Above maximum |
| `PAY_METHOD_UNAVAILABLE` | 400 | Method not supported |
| `PAY_PROVIDER_ERROR` | 502 | Provider issue |
| `PAY_ALREADY_PAID` | 409 | Duplicate payment |
| `PAY_REFUND_EXCEEDED` | 400 | Refund > paid amount |

---

## 8. Security Considerations

- Never store raw card numbers (PCI compliance via providers)
- Webhook signatures must be verified
- Payment amounts validated server-side
- Idempotency keys for duplicate prevention

---

**Related Features:**
- `03-features/241221-checkout-flow/`
