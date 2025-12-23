# Domain Planning: Alerts

> **Reference:** [System Planning](../../system-planning.md)  
> **Phase:** 4 (Polish & Scale)  
> **Priority:** P2 - Medium

---

## 1. Domain Overview

### 1.1 Domain Name & Scope

**Alerts Domain** ensures users are notified about important events without needing to continuously monitor the dashboard.

**Scope:**
- In-app notifications
- Slack webhook integration
- Telegram bot integration
- Email notifications (optional)
- Alert configuration
- Anti-spam/grouping logic

**Out of Scope:**
- SMS notifications
- Push notifications (mobile app)
- Real-time streaming

### 1.2 Domain Objectives

| Objective | Success Criteria |
|-----------|------------------|
| Timely delivery | Alert sent within 1 minute of event |
| Relevance | Only configured alert types sent |
| No spam | Similar alerts grouped |
| Actionable | Deep links to relevant dashboard |

### 1.3 Domain Context

**Dependencies:**
- **From Data Processing:** Hero Video events
- **From AI Analysis:** Significant insight events
- **From Data Collection:** New data events

**Integration Points:**
- Event listeners from all domains
- External services (Slack, Telegram)
- Database for notification storage

---

## 2. Features Breakdown

### 2.1 Feature List

| Feature ID | Feature Name | Priority | Complexity | Est. Points |
|------------|--------------|----------|------------|-------------|
| AL-01 | Notification Model & Service | P0 | Low | 3 |
| AL-02 | In-app Notification UI | P0 | Medium | 5 |
| AL-03 | Notification Bell Component | P0 | Low | 2 |
| AL-04 | Mark as Read API | P0 | Low | 2 |
| AL-05 | Slack Webhook Integration | P1 | Medium | 5 |
| AL-06 | Telegram Bot Integration | P2 | Medium | 5 |
| AL-07 | Email Notification (SMTP) | P3 | Medium | 5 |
| AL-08 | Alert Configuration Service | P1 | Medium | 5 |
| AL-09 | Alert Type Filtering | P1 | Low | 3 |
| AL-10 | Anti-spam Grouping | P1 | Medium | 5 |
| AL-11 | Event Listeners Setup | P0 | Medium | 5 |
| AL-12 | Deep Link Generation | P1 | Low | 2 |
| **Total** | | | | **47 points** |

### 2.2 Alert Types

| Type | Event Source | Priority | Notification |
|------|--------------|----------|--------------|
| HERO_VIDEO | Data Processing | P0 | In-app, Slack |
| APP_UPDATE | Data Collection | P1 | In-app, Slack |
| NEW_COMPETITOR | Project Management | P2 | In-app |
| RANKING_CHANGE | Data Collection | P2 | In-app |
| REVIEW_SPIKE | Data Processing | P1 | In-app, Slack |
| INSIGHT_ALERT | AI Analysis | P1 | In-app, Slack |
| QUEUE_FULL | Data Collection | P2 | Slack, Telegram |

### 2.3 Feature Dependencies

```
AL-01 (Model) ──▶ AL-02 (UI) ──▶ AL-03 (Bell)
      │                              │
      └──────────▶ AL-04 (Mark Read)─┘

AL-11 (Events) ──▶ AL-01 (Create Notification)
      │
      ├──▶ AL-05 (Slack)
      ├──▶ AL-06 (Telegram)
      └──▶ AL-07 (Email)

AL-08 (Config) ──▶ AL-09 (Filter)
AL-10 (Anti-spam) ◀── All notification creation
```

---

## 3. Tasks Breakdown

### 3.1 Core Notifications

#### Model & Service
- [ ] **AL-B01**: Create Notification Prisma model - 1h
- [ ] **AL-B02**: Create NotificationService - 2h
- [ ] **AL-B03**: Implement create notification - 1h
- [ ] **AL-B04**: Implement list notifications by user - 1h
- [ ] **AL-B05**: Implement mark as read - 1h
- [ ] **AL-B06**: Implement mark all as read - 1h
- [ ] **AL-B07**: Implement unread count - 1h

#### Frontend UI
- [ ] **AL-F01**: Create NotificationBell component - 2h
- [ ] **AL-F02**: Create NotificationDropdown - 3h
- [ ] **AL-F03**: Create NotificationItem component - 1h
- [ ] **AL-F04**: Implement useNotifications hook - 2h
- [ ] **AL-F05**: Add polling for new notifications - 1h
- [ ] **AL-F06**: Add click handler with navigation - 1h

### 3.2 External Integrations

#### Slack
- [ ] **AL-SL01**: Create SlackService - 2h
- [ ] **AL-SL02**: Implement webhook send - 2h
- [ ] **AL-SL03**: Format message with blocks - 2h
- [ ] **AL-SL04**: Add deep link to message - 1h

#### Telegram
- [ ] **AL-TG01**: Create TelegramService - 2h
- [ ] **AL-TG02**: Implement bot sendMessage - 2h
- [ ] **AL-TG03**: Format message with markdown - 1h

#### Email (Optional)
- [ ] **AL-EM01**: Create EmailService with SMTP - 2h
- [ ] **AL-EM02**: Create email templates - 2h
- [ ] **AL-EM03**: Implement send notification - 1h

### 3.3 Configuration

- [ ] **AL-C01**: Create AlertConfig model/service - 2h
- [ ] **AL-C02**: Store alert type preferences - 1h
- [ ] **AL-C03**: Store channel preferences - 1h
- [ ] **AL-C04**: Create config API endpoints - 2h

### 3.4 Event Listeners

- [ ] **AL-E01**: Listen to `hero-video.detected` - 1h
- [ ] **AL-E02**: Listen to `competitor.app-updated` - 1h
- [ ] **AL-E03**: Listen to `insight.significant` - 1h
- [ ] **AL-E04**: Listen to `review.spike` - 1h
- [ ] **AL-E05**: Listen to `queue.warning` - 1h

### 3.5 Anti-spam

- [ ] **AL-AS01**: Implement time-window grouping - 2h
- [ ] **AL-AS02**: Implement similar event batching - 2h
- [ ] **AL-AS03**: Add cooldown per alert type - 1h

### 3.6 Deep Links

- [ ] **AL-DL01**: Create DeepLinkService - 1h
- [ ] **AL-DL02**: Map event types to routes - 1h
- [ ] **AL-DL03**: Include in all notifications - 0.5h

### 3.7 Testing

- [ ] **AL-T01**: Unit tests for NotificationService - 2h
- [ ] **AL-T02**: Integration tests for Slack webhook - 1h
- [ ] **AL-T03**: E2E test notification flow - 2h

---

## 4. Timeline & Sprints

### 4.1 Sprint Breakdown

**Sprint 9 (Week 25-26): Alerts Implementation**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | AL-B01 to AL-B07 | Core notification service |
| Day 3-4 | AL-F01 to AL-F06 | Frontend notification UI |
| Day 5-6 | AL-SL01 to AL-SL04 | Slack integration |
| Day 7-8 | AL-E01 to AL-E05 | Event listeners |
| Day 9-10 | AL-AS01 to AL-T03 | Anti-spam & Testing |

### 4.2 Timeline Estimate

| Milestone | Duration | Week |
|-----------|----------|------|
| Core Notifications | 0.5 week | Week 25 |
| External Integrations | 0.5 week | Week 25 |
| Events & Anti-spam | 0.5 week | Week 26 |
| Testing & Polish | 0.5 week | Week 26 |
| **Total** | **2 weeks** | **Week 25-26** |

### 4.3 Milestones

1. **M1: In-app Notifications** - Bell, dropdown, list working
2. **M2: Slack Connected** - Webhooks delivering
3. **M3: Full Integration** - All events triggering alerts

---

## 5. Resource Allocation

### 5.1 Team Assignment

| Role | Allocation | Tasks |
|------|------------|-------|
| Backend Developer | 60% | AL-B*, AL-SL*, AL-TG*, AL-E* |
| Frontend Developer | 40% | AL-F* |

### 5.2 Capacity Planning

- Backend: ~35 hours
- Frontend: ~10 hours
- Testing: ~5 hours
- **Total: ~50 hours (1.5 weeks)**

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies

| Dependency | Provider | Purpose |
|------------|----------|---------|
| Slack Webhook URL | Slack | Send alerts |
| Telegram Bot Token | Telegram | Send alerts |
| SMTP Server | Email provider | Email notifications |

### 6.2 Internal Dependencies
- Events from all domains must be emitting
- Frontend layout with header ready

### 6.3 Blockers

| Blocker | Mitigation |
|---------|------------|
| No Slack workspace | Skip Slack, focus on in-app |
| Email deliverability | Use transactional email service |

---

## 7. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Alert spam | Medium | Medium | Anti-spam logic, rate limiting |
| Webhook failures | Low | Low | Retry logic, queue |
| User fatigue | Medium | Medium | Alert configuration, grouping |

---

## 8. Definition of Done

### 8.1 Feature Completion Criteria

- [ ] In-app notifications display correctly
- [ ] Unread count shows in bell icon
- [ ] Mark as read updates UI
- [ ] Slack notifications delivered
- [ ] Events trigger appropriate alerts
- [ ] Anti-spam prevents flooding
- [ ] Deep links navigate correctly

### 8.2 Quality Gates

- [ ] Alert delivery < 1 minute
- [ ] No duplicate notifications
- [ ] Mobile responsive UI
- [ ] Graceful handling of webhook failures

---

## 9. Notification Schema

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: {
    eventId: string;
    entityType: string;
    entityId: string;
    deepLink: string;
  };
  isRead: boolean;
  createdAt: Date;
}

enum NotificationType {
  HERO_VIDEO = 'HERO_VIDEO',
  APP_UPDATE = 'APP_UPDATE',
  NEW_COMPETITOR = 'NEW_COMPETITOR',
  RANKING_CHANGE = 'RANKING_CHANGE',
  REVIEW_SPIKE = 'REVIEW_SPIKE',
  INSIGHT_ALERT = 'INSIGHT_ALERT',
  QUEUE_WARNING = 'QUEUE_WARNING',
}
```

---

## 10. Slack Message Format

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
          "url": "https://app.competitoriq.com/projects/123/videos/456"
        }
      ]
    }
  ]
}
```

---

## 11. API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List user notifications |
| GET | `/notifications/unread-count` | Get unread count |
| PATCH | `/notifications/:id/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all as read |
| GET | `/alerts/config` | Get alert configuration |
| PATCH | `/alerts/config` | Update alert configuration |

---

**Next Step:** Proceed to Admin Domain Planning.

