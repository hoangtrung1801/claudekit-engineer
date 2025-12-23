# Notifications Domain

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Status**: In Development

---

## 1. Domain Purpose

Deliver timely, relevant notifications to users across multiple channels (email, push, SMS) with preference management.

---

## 2. Business Rules

### 2.1 Delivery Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| NOT-001 | Respect user channel preferences | Application |
| NOT-002 | Critical notifications bypass preferences | Application |
| NOT-003 | Max 5 push notifications per hour | Rate limit |
| NOT-004 | Marketing emails require opt-in | Preference check |
| NOT-005 | Retry failed deliveries 3 times | Queue |

### 2.2 Priority Levels

| Priority | Use Case | Channels | Bypass Prefs |
|----------|----------|----------|--------------|
| Critical | Security alerts | All | Yes |
| High | Order updates | Email + Push | No |
| Normal | Promotions | Email | No |
| Low | Tips, education | Email | No |

---

## 3. Entities

### 3.1 Notification

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: 'email' | 'push' | 'sms';
  priority: 'critical' | 'high' | 'normal' | 'low';
  subject: string;
  body: string;
  data?: Record<string, unknown>;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  createdAt: Date;
}

type NotificationType =
  | 'auth.welcome'
  | 'auth.password_reset'
  | 'auth.email_verify'
  | 'order.created'
  | 'order.confirmed'
  | 'order.shipped'
  | 'order.delivered'
  | 'payment.success'
  | 'payment.failed'
  | 'promo.campaign';
```

### 3.2 NotificationPreference

```typescript
interface NotificationPreference {
  userId: string;
  email: {
    orders: boolean;      // Default: true
    promotions: boolean;  // Default: false
    security: boolean;    // Default: true (cannot disable)
  };
  push: {
    orders: boolean;
    promotions: boolean;
    security: boolean;
  };
  sms: {
    orders: boolean;
    security: boolean;
  };
}
```

### 3.3 PushToken

```typescript
interface PushToken {
  id: string;
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceName?: string;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date;
}
```

---

## 4. Templates

### 4.1 Email Templates

| Template ID | Subject | Variables |
|-------------|---------|-----------|
| `auth.welcome` | Welcome to Astraler | `{ name }` |
| `auth.verify` | Verify your email | `{ name, link }` |
| `auth.reset` | Reset your password | `{ name, link }` |
| `order.confirmed` | Order #{orderNumber} confirmed | `{ name, orderNumber, items, total }` |
| `order.shipped` | Your order is on the way | `{ name, orderNumber, trackingUrl }` |

### 4.2 Push Templates

| Template ID | Title | Body |
|-------------|-------|------|
| `order.confirmed` | Order Confirmed | Your order #{orderNumber} is being prepared |
| `order.shipped` | Order Shipped | Your order is on the way! |
| `payment.success` | Payment Received | Thank you for your payment |

---

## 5. Integration Points

### 5.1 Providers

| Channel | Provider | Credentials |
|---------|----------|-------------|
| Email | Resend | `RESEND_API_KEY` |
| Push | Firebase FCM | `FIREBASE_*` |
| SMS | (Future) | TBD |

### 5.2 Inbound Events

| Source | Event | Action |
|--------|-------|--------|
| Auth | User registered | Send welcome email |
| Auth | Password reset requested | Send reset email |
| Orders | Order status changed | Send update |
| Payments | Payment received | Send confirmation |

---

## 6. API Contracts

### 6.1 Customer Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/notifications` | List my notifications |
| PATCH | `/notifications/:id/read` | Mark as read |
| GET | `/notifications/preferences` | Get preferences |
| PUT | `/notifications/preferences` | Update preferences |
| POST | `/notifications/push-token` | Register push token |
| DELETE | `/notifications/push-token/:id` | Remove token |

---

## 7. Error Handling

| Scenario | Action |
|----------|--------|
| Email bounce | Mark email invalid, notify admin |
| Push token invalid | Remove token, don't retry |
| Rate limit exceeded | Queue for later |
| Provider down | Retry with backoff |

---

**Related Features:**
- `03-features/241222-push-notifications/`
