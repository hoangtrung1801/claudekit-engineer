# Alerts Backend Implementation Plan

> **Domain:** Alerts  
> **Status:** 🔴 Not Started  
> **Created:** December 13, 2024  
> **Last Updated:** December 13, 2024  
> **Progress:** 0/38 tasks completed  
> **Priority:** P2 - Medium  
> **Phase:** 4 (Polish & Scale)

---

## 1. Overview

This plan covers the backend implementation for **Alerts** domain, including:
- In-app notifications system
- Slack webhook integration
- Telegram bot integration
- Email notifications (optional)
- Alert configuration per user
- Anti-spam/grouping logic
- Event listeners from all domains

**Reference Documents:**
- Domain Planning: `docs/5.planning-setup/domains/alerts/domain-planning.md`
- Domain TDD: `docs/3.technical-design/domains/alerts/domain-tdd.md`

**Estimated Duration:** 2 weeks  
**Dependencies:** All domains emitting events

---

## 2. Prerequisites

- [ ] Data Processing (hero-video events)
- [ ] AI Analysis (insight events)
- [ ] Data Collection (data events)
- [ ] Slack workspace + webhook URL
- [ ] Telegram bot token (optional)
- [ ] SMTP server (optional)

---

## 3. API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | List user notifications | Yes |
| GET | `/api/notifications/unread-count` | Get unread count | Yes |
| PATCH | `/api/notifications/:id/read` | Mark as read | Yes |
| PATCH | `/api/notifications/read-all` | Mark all as read | Yes |
| GET | `/api/alerts/config` | Get alert config | Yes |
| PATCH | `/api/alerts/config` | Update alert config | Yes |

---

## 4. Implementation Tasks

### 4.1 Notification Model & Service (AL-B-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-B-001 | Add Notification model to Prisma schema | 1h | ⬜ |
| AL-B-002 | Create NotificationService | 2h | ⬜ |
| AL-B-003 | Implement create notification | 1h | ⬜ |
| AL-B-004 | Implement list notifications by user | 1h | ⬜ |
| AL-B-005 | Implement mark as read | 1h | ⬜ |
| AL-B-006 | Implement mark all as read | 1h | ⬜ |
| AL-B-007 | Implement unread count | 1h | ⬜ |
| AL-B-008 | Create NotificationController | 2h | ⬜ |

### 4.2 Slack Integration (AL-SL-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-SL-001 | Create SlackService | 2h | ⬜ |
| AL-SL-002 | Implement webhook send | 2h | ⬜ |
| AL-SL-003 | Format message with blocks | 2h | ⬜ |
| AL-SL-004 | Add deep link to message | 1h | ⬜ |
| AL-SL-005 | Implement retry on failure | 1h | ⬜ |

### 4.3 Telegram Integration (AL-TG-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-TG-001 | Create TelegramService | 2h | ⬜ |
| AL-TG-002 | Implement bot sendMessage | 2h | ⬜ |
| AL-TG-003 | Format message with markdown | 1h | ⬜ |

### 4.4 Email Integration (AL-EM-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-EM-001 | Create EmailService with SMTP | 2h | ⬜ |
| AL-EM-002 | Create email templates | 2h | ⬜ |
| AL-EM-003 | Implement send notification | 1h | ⬜ |

### 4.5 Alert Configuration (AL-C-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-C-001 | Add AlertConfig model to Prisma | 1h | ⬜ |
| AL-C-002 | Create AlertConfigService | 2h | ⬜ |
| AL-C-003 | Store alert type preferences | 1h | ⬜ |
| AL-C-004 | Store channel preferences | 1h | ⬜ |
| AL-C-005 | Create config API endpoints | 2h | ⬜ |

### 4.6 Event Listeners (AL-E-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-E-001 | Listen to hero-video.detected | 1h | ⬜ |
| AL-E-002 | Listen to competitor.app-updated | 1h | ⬜ |
| AL-E-003 | Listen to insight.significant | 1h | ⬜ |
| AL-E-004 | Listen to review.spike | 1h | ⬜ |
| AL-E-005 | Listen to queue.warning | 1h | ⬜ |

### 4.7 Anti-spam Logic (AL-AS-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-AS-001 | Implement time-window grouping | 2h | ⬜ |
| AL-AS-002 | Implement similar event batching | 2h | ⬜ |
| AL-AS-003 | Add cooldown per alert type | 1h | ⬜ |

### 4.8 Deep Links (AL-DL-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-DL-001 | Create DeepLinkService | 1h | ⬜ |
| AL-DL-002 | Map event types to routes | 1h | ⬜ |
| AL-DL-003 | Include in all notifications | 0.5h | ⬜ |

### 4.9 Module Setup (AL-MOD-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-MOD-001 | Create AlertsModule | 1h | ⬜ |
| AL-MOD-002 | Register in AppModule | 0.5h | ⬜ |

### 4.10 Tests (AL-TST-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-TST-001 | Unit tests for NotificationService | 2h | ⬜ |
| AL-TST-002 | Integration tests for Slack webhook | 1h | ⬜ |
| AL-TST-003 | E2E test notification flow | 2h | ⬜ |

---

## 5. Files to Create

```
backend/src/modules/alerts/
├── alerts.module.ts                    ⬜
├── controllers/
│   ├── notification.controller.ts      ⬜
│   └── alert-config.controller.ts      ⬜
├── services/
│   ├── notification.service.ts         ⬜
│   ├── slack.service.ts                ⬜
│   ├── telegram.service.ts             ⬜
│   ├── email.service.ts                ⬜
│   ├── alert-config.service.ts         ⬜
│   ├── deep-link.service.ts            ⬜
│   └── anti-spam.service.ts            ⬜
├── listeners/
│   └── alert-event.listener.ts         ⬜
├── dto/
│   ├── notification.dto.ts             ⬜
│   └── alert-config.dto.ts             ⬜
├── types/
│   └── alert.types.ts                  ⬜
└── tests/
    └── notification.service.spec.ts    ⬜
```

---

## 6. Notification Schema (Prisma)

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  type      NotificationType
  title     String
  message   String
  metadata  Json?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
}

enum NotificationType {
  HERO_VIDEO
  APP_UPDATE
  NEW_COMPETITOR
  RANKING_CHANGE
  REVIEW_SPIKE
  INSIGHT_ALERT
  QUEUE_WARNING
}
```

---

## 7. Slack Message Format

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🔥 Hero Video Detected!"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Competitor:* Calm\n*Video:* Sleep better tonight\n*Growth:* +45% views in 24h"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View in Dashboard" },
          "url": "https://app.example.com/projects/123/videos/456"
        }
      ]
    }
  ]
}
```

---

## 8. Verification Checklist

- [ ] Notifications created in database
- [ ] Unread count accurate
- [ ] Mark as read updates correctly
- [ ] Slack webhook delivers messages
- [ ] Telegram messages sent (if configured)
- [ ] Alert config saves preferences
- [ ] Events trigger notifications
- [ ] Anti-spam prevents flooding
- [ ] Deep links navigate correctly
- [ ] Alert delivery < 1 minute

---

**Next Step:** After Alerts Backend, proceed to Admin Backend.

