# Alerts Frontend Implementation Plan

> **Domain:** Alerts  
> **Status:** 🔴 Not Started  
> **Created:** December 13, 2024  
> **Last Updated:** December 13, 2024  
> **Progress:** 0/20 tasks completed  
> **Priority:** P2 - Medium  
> **Phase:** 4 (Polish & Scale)

---

## 1. Overview

This plan covers the frontend implementation for **Alerts** domain, including:
- Notification bell in header
- Notification dropdown/panel
- Notification list page
- Alert settings page
- Real-time notification updates

**Reference Documents:**
- Domain Planning: `docs/5.planning-setup/domains/alerts/domain-planning.md`
- UI Design: `docs/4.ui-design/system-ui-design.md`

**Estimated Duration:** 1 week  
**Dependencies:** Dashboard Layout, Alerts Backend

---

## 2. Pages Summary

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| Notification Center | `/notifications` | All notifications | P1 |
| Alert Settings | `/settings/alerts` | Configure alerts | P2 |

---

## 3. Implementation Tasks

### 3.1 API Integration (AL-FE-API-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-FE-API-001 | Create notification API functions | 1h | ⬜ |
| AL-FE-API-002 | Create useNotifications query | 1h | ⬜ |
| AL-FE-API-003 | Create useUnreadCount query | 1h | ⬜ |
| AL-FE-API-004 | Create useMarkAsRead mutation | 1h | ⬜ |
| AL-FE-API-005 | Create useAlertConfig query/mutation | 1h | ⬜ |

### 3.2 Notification Bell (AL-FE-BELL-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-FE-BELL-001 | Create NotificationBell component | 2h | ⬜ |
| AL-FE-BELL-002 | Create unread count badge | 1h | ⬜ |
| AL-FE-BELL-003 | Add polling for new notifications | 1h | ⬜ |
| AL-FE-BELL-004 | Add bell animation on new | 1h | ⬜ |

### 3.3 Notification Dropdown (AL-FE-DROP-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-FE-DROP-001 | Create NotificationDropdown panel | 3h | ⬜ |
| AL-FE-DROP-002 | Create NotificationItem component | 2h | ⬜ |
| AL-FE-DROP-003 | Add click handler with navigation | 1h | ⬜ |
| AL-FE-DROP-004 | Add "Mark all as read" button | 1h | ⬜ |
| AL-FE-DROP-005 | Add "View all" link | 0.5h | ⬜ |

### 3.4 Notifications Page (AL-FE-PAGE-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-FE-PAGE-001 | Create NotificationsPage layout | 2h | ⬜ |
| AL-FE-PAGE-002 | Create notification list with grouping | 2h | ⬜ |
| AL-FE-PAGE-003 | Add filter by type | 1h | ⬜ |

### 3.5 Alert Settings (AL-FE-SET-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AL-FE-SET-001 | Create AlertSettingsPage | 2h | ⬜ |
| AL-FE-SET-002 | Create alert type toggle list | 2h | ⬜ |
| AL-FE-SET-003 | Create channel config (Slack/Email) | 2h | ⬜ |

---

## 4. Files to Create

```
frontend/src/features/alerts/
├── pages/
│   ├── notifications.page.tsx          ⬜
│   └── alert-settings.page.tsx         ⬜
├── api/notification.api.ts             ⬜
├── hooks/
│   ├── use-notifications.ts            ⬜
│   ├── use-unread-count.ts             ⬜
│   ├── use-mark-as-read.ts             ⬜
│   └── use-alert-config.ts             ⬜
├── components/
│   ├── notification-bell.tsx           ⬜
│   ├── notification-dropdown.tsx       ⬜
│   ├── notification-item.tsx           ⬜
│   ├── notification-list.tsx           ⬜
│   └── alert-type-toggle.tsx           ⬜
└── types/notification.types.ts         ⬜
```

---

## 5. UI Specifications

### Notification Bell
- Bell icon with badge for unread count
- Badge shows number (max "99+")
- Subtle animation when new notification
- Click opens dropdown

### Notification Dropdown
- Max 5 recent notifications
- Group by time (Today, Yesterday, Earlier)
- Click item → navigate to relevant page
- "View all" link at bottom

### Notification Item
- Icon based on type (🔥 hero, 📊 insight, etc.)
- Title + short message
- Time ago format
- Unread indicator (blue dot)

---

## 6. Verification Checklist

- [ ] Notification bell displays in header
- [ ] Unread count shows correctly
- [ ] Dropdown opens on click
- [ ] Items clickable and navigate
- [ ] Mark as read works
- [ ] Notifications page lists all
- [ ] Alert settings save correctly
- [ ] Mobile responsive
- [ ] Polling updates count

---

**Next Step:** After Alerts Frontend, proceed to Admin domain.

