# Push Notifications

> **Feature ID**: 241222-push-notifications
> **Status**: 🔄 In Progress (30%)
> **Last Updated**: 241223

---

## 1. Overview

Enable real-time push notifications for order updates, promotions, and system alerts across web and mobile platforms.

**Business Value**: Increases engagement and keeps users informed about their orders.

---

## 2. Requirements

### 2.1 Functional (MUST)

- [x] FR-001: Request notification permission from user
- [x] FR-002: Store FCM tokens per device
- [ ] FR-003: Send push on order status change
- [ ] FR-004: Send push on payment received
- [ ] FR-005: User can manage notification preferences
- [ ] FR-006: Support web push (PWA)
- [ ] FR-007: Support mobile push (Flutter)

### 2.2 Non-Functional (SHOULD)

- [ ] NFR-001: Notification delivered within 5 seconds
- [ ] NFR-002: Retry failed sends 3 times
- [x] NFR-003: Rate limit: 5 notifications/hour/user

### 2.3 Out of Scope

- SMS notifications - Future
- In-app notification center - v1.1
- Rich media notifications - v1.1

---

## 3. Technical Design

### 3.1 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────►│   Server    │────►│  Firebase   │
│ (Web/App)   │◄────│   (API)     │◄────│    FCM      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       └───────────►│  IndexedDB  │
                    │  (Tokens)   │
                    └─────────────┘
```

### 3.2 Token Management

```typescript
// Store token on permission grant
async function registerPushToken(token: string) {
  await api.post('/notifications/push-token', {
    token,
    platform: getPlatform(), // 'web' | 'ios' | 'android'
    deviceName: getDeviceName(),
  });
}

// Remove on logout or permission revoke
async function unregisterPushToken(tokenId: string) {
  await api.delete(`/notifications/push-token/${tokenId}`);
}
```

### 3.3 Key Files

```
apps/web/
├── app/api/notifications/
│   ├── push-token/route.ts
│   └── send/route.ts
├── lib/
│   ├── firebase/
│   │   ├── client.ts
│   │   └── admin.ts
│   └── notifications/
│       ├── push.ts
│       └── templates.ts
└── public/
    └── firebase-messaging-sw.js  # Service worker

packages/mobile/
└── lib/
    └── services/
        └── push_notification_service.dart
```

---

## 4. Notification Types

| Type | Trigger | Title | Body |
|------|---------|-------|------|
| `order.confirmed` | Payment success | Order Confirmed | Your order #{num} is being prepared |
| `order.shipped` | Status change | Order Shipped | Your order is on the way! |
| `order.delivered` | Status change | Order Delivered | Your order has arrived |
| `payment.success` | Webhook | Payment Received | Thank you for your payment of {amount} |
| `promo.campaign` | Admin trigger | {title} | {body} |

---

## 5. API Contract

### 5.1 Register Token

```typescript
// POST /api/notifications/push-token
{
  "token": "fcm-token-here",
  "platform": "web",
  "deviceName": "Chrome on MacOS"
}

// Response 201
{
  "success": true,
  "data": { "id": "token-id" }
}
```

### 5.2 Send Notification (Internal)

```typescript
// POST /api/notifications/send (internal only)
{
  "userId": "user-uuid",
  "type": "order.shipped",
  "data": {
    "orderId": "order-uuid",
    "orderNumber": "ORD-241223-0001"
  }
}
```

---

## 6. Acceptance Criteria

- [x] AC-001: Browser prompts for notification permission
- [x] AC-002: Token stored in database after permission grant
- [ ] AC-003: User receives push when order status changes
- [ ] AC-004: Push works on Chrome, Firefox, Safari
- [ ] AC-005: Push works on iOS and Android apps
- [ ] AC-006: User can disable notifications in settings
- [ ] AC-007: Notification click opens relevant page

---

## 7. Blockers

| ID | Description | Status | ETA |
|----|-------------|--------|-----|
| B-002 | iOS simulator not receiving push | Investigating | 241225 |

---

## 8. Implementation Progress

| Component | Status | Notes |
|-----------|--------|-------|
| Firebase setup | ✅ Done | Project configured |
| Token registration | ✅ Done | API + client |
| Service worker | ✅ Done | Web push ready |
| Send notification | 🔄 WIP | |
| Preferences UI | ⏳ Pending | |
| Mobile integration | ⏳ Blocked | B-002 |

---

## 9. Changelog

| Date | Change | By |
|------|--------|-----|
| 241222 | Spec created | PA |
| 241222 | Firebase configured | AI |
| 241223 | Token management done | AI |
| 241223 | iOS issue discovered (B-002) | AI |

---

**Domain**: `02-domains/notifications/`
**Status**: 🔄 In Progress (Blocked on B-002)
