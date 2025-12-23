# Checkout Flow

> **Feature ID**: 241221-checkout-flow
> **Status**: 🔄 In Progress (60%)
> **Last Updated**: 241223

---

## 1. Overview

Implement the complete checkout process from cart review to order confirmation, supporting multiple payment methods for Vietnam market.

**Business Value**: Core revenue-generating feature; enables actual transactions.

---

## 2. Requirements

### 2.1 Functional (MUST)

- [x] FR-001: Display cart summary with item details
- [x] FR-002: Collect shipping address
- [x] FR-003: Calculate shipping fee based on location
- [ ] FR-004: Support bank transfer payment (SePay)
- [ ] FR-005: Support COD payment
- [ ] FR-006: Generate order on successful payment
- [ ] FR-007: Send order confirmation email
- [x] FR-008: Show order confirmation page

### 2.2 Non-Functional (SHOULD)

- [ ] NFR-001: Checkout completes in < 3 steps
- [x] NFR-002: Mobile-responsive design
- [ ] NFR-003: Payment timeout: 24h for bank transfer
- [ ] NFR-004: Real-time payment status updates

### 2.3 Out of Scope

- International shipping - v2
- Card payments (Stripe) - v1.1
- Guest checkout - v1.1
- Discount codes - v1.1

---

## 3. Technical Design

### 3.1 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Checkout   │────►│    API      │────►│   Orders    │
│    Page     │◄────│   Routes    │◄────│   Service   │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   SePay     │     │  Database   │
                    │  Webhooks   │     │ (Supabase)  │
                    └─────────────┘     └─────────────┘
```

### 3.2 Checkout Steps

```
Step 1: Cart Review
    ↓
Step 2: Shipping & Payment
    ↓
Step 3: Confirmation
```

### 3.3 Key Files

```
apps/web/
├── app/
│   ├── checkout/
│   │   ├── page.tsx           # Cart review
│   │   ├── shipping/page.tsx  # Address + payment
│   │   └── confirm/page.tsx   # Order confirmation
│   └── api/
│       ├── checkout/
│       │   ├── route.ts       # Create order
│       │   └── shipping/route.ts
│       └── webhooks/
│           └── sepay/route.ts
├── lib/
│   ├── checkout/
│   │   ├── actions.ts
│   │   └── validation.ts
│   └── payments/
│       └── sepay.ts
└── components/checkout/
    ├── cart-summary.tsx
    ├── address-form.tsx
    ├── payment-method-selector.tsx
    └── order-confirmation.tsx
```

---

## 4. UI/UX

### 4.1 Step 1: Cart Review

```
┌─────────────────────────────────────────────────┐
│  🛒 Your Cart (3 items)                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────┐ Product Name              ₫150,000   │
│  │ IMG  │ Variant: Blue, Size M                │
│  └──────┘ Qty: [1] [-][+]          [Remove]    │
│                                                 │
│  ┌──────┐ Product Name              ₫200,000   │
│  │ IMG  │ Qty: [2] [-][+]          [Remove]    │
│  └──────┘                                       │
│                                                 │
├─────────────────────────────────────────────────┤
│  Subtotal                           ₫550,000   │
│  Shipping                      Calculated next  │
│  ─────────────────────────────────────────────  │
│  Total                              ₫550,000   │
│                                                 │
│  [      Continue to Shipping      ]             │
└─────────────────────────────────────────────────┘
```

### 4.2 Step 2: Shipping & Payment

```
┌─────────────────────────────────────────────────┐
│  📦 Shipping Address                            │
├─────────────────────────────────────────────────┤
│  Full Name *                                    │
│  ┌─────────────────────────────────────────┐   │
│  │                                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Phone *                                        │
│  ┌─────────────────────────────────────────┐   │
│  │                                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Address *                                      │
│  ┌─────────────────────────────────────────┐   │
│  │                                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  City *              District *                 │
│  ┌──────────────┐   ┌──────────────────────┐   │
│  │ [Dropdown]   │   │ [Dropdown]           │   │
│  └──────────────┘   └──────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│  💳 Payment Method                              │
├─────────────────────────────────────────────────┤
│  ○ Bank Transfer (QR Code)                      │
│  ○ Cash on Delivery (COD)                       │
│                                                 │
├─────────────────────────────────────────────────┤
│  Order Summary                                  │
│  Subtotal                           ₫550,000   │
│  Shipping (Ho Chi Minh)              ₫30,000   │
│  ─────────────────────────────────────────────  │
│  Total                              ₫580,000   │
│                                                 │
│  [        Place Order        ]                  │
└─────────────────────────────────────────────────┘
```

### 4.3 Step 3: Confirmation

```
┌─────────────────────────────────────────────────┐
│              ✅ Order Placed!                   │
│                                                 │
│  Order #ORD-241223-0001                         │
│                                                 │
│  [If Bank Transfer: Show QR Code]               │
│  ┌─────────────────────────────┐               │
│  │                             │               │
│  │         [QR CODE]           │               │
│  │                             │               │
│  └─────────────────────────────┘               │
│  Amount: ₫580,000                               │
│  Bank: Vietcombank                              │
│  Account: 1234567890                            │
│  Reference: ORD-241223-0001                     │
│                                                 │
│  Payment expires in: 23:59:45                   │
│                                                 │
│  [If COD: Show delivery info]                   │
│                                                 │
│  [     View Order Details     ]                 │
│  [     Continue Shopping      ]                 │
└─────────────────────────────────────────────────┘
```

---

## 5. API Contract

### 5.1 Create Order

```typescript
// POST /api/checkout
{
  "items": [
    { "productId": "...", "variantId": "...", "quantity": 2 }
  ],
  "shippingAddress": {
    "fullName": "Nguyen Van A",
    "phone": "0901234567",
    "street": "123 Le Loi",
    "district": "Quan 1",
    "city": "Ho Chi Minh"
  },
  "paymentMethod": "bank_transfer"
}

// Response 201
{
  "success": true,
  "data": {
    "order": {
      "id": "...",
      "orderNumber": "ORD-241223-0001",
      "total": 580000,
      "status": "pending"
    },
    "payment": {
      "method": "bank_transfer",
      "qrCode": "data:image/png;base64,...",
      "bankInfo": { ... },
      "expiresAt": "2024-12-24T12:00:00Z"
    }
  }
}
```

### 5.2 SePay Webhook

```typescript
// POST /api/webhooks/sepay
// Signature: X-Sepay-Signature header

{
  "event": "payment.success",
  "data": {
    "transactionId": "...",
    "reference": "ORD-241223-0001",
    "amount": 580000
  }
}
```

---

## 6. Acceptance Criteria

- [x] AC-001: Cart displays accurate item totals
- [x] AC-002: User can modify quantities in cart
- [x] AC-003: Address form validates required fields
- [ ] AC-004: Shipping fee calculated based on city
- [ ] AC-005: Bank transfer shows QR code and payment info
- [ ] AC-006: COD option available for supported regions
- [ ] AC-007: Order created in database on checkout
- [ ] AC-008: Confirmation email sent within 1 minute
- [ ] AC-009: Payment status updates in real-time
- [ ] AC-010: Order accessible in user's order history

---

## 7. Blockers

| ID | Description | Status | ETA |
|----|-------------|--------|-----|
| B-001 | SePay sandbox access pending | Waiting | 241224 |

---

## 8. Implementation Progress

| Component | Status | Notes |
|-----------|--------|-------|
| Cart summary | ✅ Done | |
| Address form | ✅ Done | |
| Shipping calc | ✅ Done | |
| Payment selector | 🔄 WIP | Waiting SePay |
| SePay integration | ⏳ Blocked | B-001 |
| Order creation | 🔄 WIP | |
| Confirmation page | ✅ Done | |
| Webhook handler | ⏳ Blocked | B-001 |

---

## 9. Changelog

| Date | Change | By |
|------|--------|-----|
| 241221 | Spec created | PA |
| 241221 | Implementation started | AI |
| 241222 | Cart and address done | AI |
| 241223 | Blocked on SePay | AI |

---

**Domain**: `02-domains/payments/`, `02-domains/orders/`
**Status**: 🔄 In Progress (Blocked on B-001)
