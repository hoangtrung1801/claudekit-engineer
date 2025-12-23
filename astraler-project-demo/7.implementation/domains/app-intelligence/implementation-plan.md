# App Intelligence UI Implementation Plan

> **Domain:** App Intelligence (Phase 2.5)
> **Status:** 🔄 In Progress (85% Complete)
> **Created:** December 13, 2024
> **Priority:** P1 - High
> **Phase:** 2.5 (After Data Engine, Before AI Analysis)

---

## 1. Overview

This plan covers the implementation of **App Intelligence UI** features:
- **Competitor Detail Modal** - View full app metadata when clicking a competitor
- **Reviews Page** - Browse and filter all competitor reviews
- **What's New Page** - View competitor app updates timeline

**Reference Documents:**
- UI Theme: `references/themes/demo-website-v2/components/ReviewsScreen.tsx`
- UI Theme: `references/themes/demo-website-v2/components/WhatsNewScreen.tsx`
- Sidebar Navigation: Shows "Reviews" and "What's New" menu items

**Estimated Duration:** 1 week (5-7 days)
**Dependencies:** Data Collection Backend (completed), Phase 2 crawlers (completed)

---

## 2. Current State Analysis

### ✅ Backend Already Has

| Data | Crawl Status | Database | API Endpoint |
|------|--------------|----------|--------------|
| Reviews | ✅ Crawled | ✅ `Review` model | ✅ Partial (5 recent only) |
| AppUpdates | ✅ Crawled | ✅ `AppUpdate` model | ✅ Partial (5 recent only) |
| App Name | ✅ | ✅ `Competitor.name` | ✅ |
| App Icon | ✅ | ✅ `Competitor.iconUrl` | ✅ |
| Developer | ✅ | ✅ `Competitor.developerName` | ✅ |
| Category | ✅ | ✅ `Competitor.storeCategory` | ✅ |

### ❌ Missing (Need to Implement)

| Data | Crawl | Database | API | Frontend |
|------|-------|----------|-----|----------|
| Description | ❌ | ❌ | ❌ | ❌ |
| Screenshots | ❌ | ❌ | ❌ | ❌ |
| Full Reviews List | - | - | ❌ Need pagination | ❌ |
| Full AppUpdates List | - | - | ❌ Need pagination | ❌ |
| Reviews Page | - | - | - | ❌ |
| What's New Page | - | - | - | ❌ |
| Competitor Detail Modal | - | - | - | ❌ |

---

## 3. API Endpoints to Add

### 3.1 Reviews Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:projectId/reviews` | List all reviews with filters |
| GET | `/api/projects/:projectId/competitors/:competitorId/reviews` | Reviews for specific competitor |

**Query Params:**
- `competitorId` - Filter by competitor (optional for project-level)
- `sentiment` - Filter by sentiment (positive/neutral/negative)
- `rating` - Filter by rating (1-5)
- `limit` - Pagination limit (default: 20)
- `offset` - Pagination offset

### 3.2 App Updates Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:projectId/app-updates` | List all app updates |
| GET | `/api/projects/:projectId/competitors/:competitorId/app-updates` | Updates for specific competitor |

**Query Params:**
- `competitorId` - Filter by competitor
- `impactLevel` - Filter by impact (High/Medium/Low)
- `limit` - Pagination limit (default: 20)
- `offset` - Pagination offset

---

## 4. Implementation Tasks

### 4.1 Backend - Database Schema Updates (AI-DB-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-DB-001 | Add `description` field to Competitor model | 0.5h | ⬜ |
| AI-DB-002 | Create migration for schema changes | 0.5h | ⬜ |

### 4.2 Backend - Crawler Updates (AI-CR-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-CR-001 | Update StoreProcessor to crawl app description | 1h | ⬜ |
| AI-CR-002 | Save description to Competitor record | 0.5h | ⬜ |

### 4.3 Backend - Reviews API (AI-RV-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-RV-001 | Create ReviewsController | 1h | ✅ |
| AI-RV-002 | Create ReviewsService with pagination | 2h | ✅ |
| AI-RV-003 | Add filters (sentiment, rating, competitor) | 1h | ✅ |
| AI-RV-004 | Create ReviewDto and response types | 1h | ✅ |
| AI-RV-005 | Add sentiment statistics endpoint | 1h | ✅ |

### 4.4 Backend - App Updates API (AI-AU-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-AU-001 | Create AppUpdatesController | 1h | ✅ |
| AI-AU-002 | Create AppUpdatesService with pagination | 2h | ✅ |
| AI-AU-003 | Add filters (impact, competitor, date range) | 1h | ✅ |
| AI-AU-004 | Create AppUpdateDto and response types | 1h | ✅ |

### 4.5 Frontend - API Integration (AI-FE-API-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-FE-API-001 | Create reviews API functions | 1h | ✅ |
| AI-FE-API-002 | Create useReviews query hook | 1h | ✅ |
| AI-FE-API-003 | Create app-updates API functions | 1h | ✅ |
| AI-FE-API-004 | Create useAppUpdates query hook | 1h | ✅ |

### 4.6 Frontend - Reviews Page (AI-FE-RV-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-FE-RV-001 | Create ReviewsPage layout (from theme) | 2h | ✅ |
| AI-FE-RV-002 | Create SentimentDistribution component | 1h | ✅ |
| AI-FE-RV-003 | Create ReviewFilters component | 2h | ✅ |
| AI-FE-RV-004 | Create ReviewCard component | 1h | ✅ |
| AI-FE-RV-005 | Create ReviewsGrid with pagination | 2h | ✅ |
| AI-FE-RV-006 | Add route /projects/:id/reviews | 0.5h | ✅ |

### 4.7 Frontend - What's New Page (AI-FE-WN-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-FE-WN-001 | Create WhatsNewPage layout (from theme) | 2h | ✅ |
| AI-FE-WN-002 | Create UpdateFilters component | 1h | ✅ |
| AI-FE-WN-003 | Create UpdateCard component (timeline item) | 2h | ✅ |
| AI-FE-WN-004 | Create UpdatesTimeline component | 2h | ✅ |
| AI-FE-WN-005 | Add route /projects/:id/whats-new | 0.5h | ✅ |

### 4.8 Frontend - Competitor Detail Modal (AI-FE-CD-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-FE-CD-001 | Create CompetitorDetailModal component | 3h | ⬜ |
| AI-FE-CD-002 | Create AppInfoTab (icon, name, desc, category) | 2h | ⬜ |
| AI-FE-CD-003 | Create RecentReviewsTab | 1h | ⬜ |
| AI-FE-CD-004 | Create RecentUpdatesTab | 1h | ⬜ |
| AI-FE-CD-005 | Create SocialChannelsTab | 1h | ⬜ |
| AI-FE-CD-006 | Create LandingPagesTab (list + add landing page) | 2h | ⬜ |
| AI-FE-CD-007 | Add click handler to CompetitorRow | 0.5h | ⬜ |

### 4.9 Frontend - Navigation Updates (AI-FE-NAV-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-FE-NAV-001 | Add "Reviews" menu item to Sidebar | 0.5h | ✅ |
| AI-FE-NAV-002 | Add "What's New" menu item to Sidebar | 0.5h | ✅ |
| AI-FE-NAV-003 | Update router with new routes | 0.5h | ✅ |

---

## 5. Files to Create/Update

### Backend

```
backend/src/modules/projects/
├── controllers/
│   ├── reviews.controller.ts           ✅ CREATED
│   └── app-updates.controller.ts       ✅ CREATED
├── services/
│   ├── reviews.service.ts              ✅ CREATED
│   └── app-updates.service.ts          ✅ CREATED
├── dto/
│   ├── review-query.dto.ts             ✅ CREATED
│   └── app-update-query.dto.ts         ✅ CREATED
└── projects.module.ts                  ✅ UPDATED (registered new controllers)

backend/prisma/schema.prisma            ⬜ UPDATE (add description field)
```

### Frontend

```
frontend/src/features/reviews/
├── pages/
│   ├── index.ts                        ✅ CREATED
│   └── ReviewsPage.tsx                 ✅ CREATED
├── components/
│   ├── index.ts                        ✅ CREATED
│   ├── review-card.tsx                 ✅ CREATED
│   ├── review-filters.tsx              ✅ CREATED
│   ├── reviews-grid.tsx                ✅ CREATED
│   └── sentiment-distribution.tsx      ✅ CREATED
├── api/
│   └── reviews.api.ts                  ✅ CREATED
├── hooks/
│   └── use-reviews.ts                  ✅ CREATED
├── types/
│   └── review.types.ts                 ✅ CREATED
└── index.ts                            ✅ CREATED

frontend/src/features/whats-new/
├── pages/
│   ├── index.ts                        ✅ CREATED
│   └── WhatsNewPage.tsx                ✅ CREATED
├── components/
│   ├── index.ts                        ✅ CREATED
│   ├── update-card.tsx                 ✅ CREATED
│   ├── update-filters.tsx              ✅ CREATED
│   └── updates-timeline.tsx            ✅ CREATED
├── api/
│   └── app-updates.api.ts              ✅ CREATED
├── hooks/
│   └── use-app-updates.ts              ✅ CREATED
├── types/
│   └── app-update.types.ts             ✅ CREATED
└── index.ts                            ✅ CREATED

frontend/src/features/projects/components/
├── competitor-detail-modal.tsx         ⬜ NEW
├── app-info-tab.tsx                    ⬜ NEW
├── recent-reviews-tab.tsx              ⬜ NEW
├── recent-updates-tab.tsx              ⬜ NEW
├── landing-pages-tab.tsx               ⬜ NEW
└── competitor-row.tsx                  ⬜ UPDATE (add click to open modal)

frontend/src/components/layout/
└── Sidebar.tsx                         ✅ UPDATED (menu items already present)

frontend/src/App.tsx                    ✅ UPDATED (routes added)
```

---

## 6. UI Reference from Theme

### Reviews Page
Copy structure from: `references/themes/demo-website-v2/components/ReviewsScreen.tsx`

**Key Components:**
- Sentiment Distribution bar chart
- Filter bar (Competitor, Platform, Rating, Sentiment, Sort)
- ReviewCard grid (4 columns on desktop)

### What's New Page  
Copy structure from: `references/themes/demo-website-v2/components/WhatsNewScreen.tsx`

**Key Components:**
- Filter bar (Competitor, Time Period, Update Type, Impact)
- Timeline cards with impact stripe
- Strategic Insight sidebar (AI-generated - Phase 3)

### Competitor Detail Modal
Based on UI Design Doc: `docs/4.ui-design/domains/external/competitors-management-ui.md`

**Tabs:**
1. **Info** - Icon, Name, Developer, Category, Description
2. **Reviews** - Recent 5 reviews with link to full page
3. **Updates** - Recent 5 updates with link to full page
4. **Channels** - Social channels linked to this competitor
5. **Landing Pages** - List of landing pages (auto-discovered + manual add)

---

## 7. Task Summary

| Category | Tasks | Estimated Hours |
|----------|-------|-----------------|
| Backend - Schema | 2 | 1h |
| Backend - Crawler | 2 | 1.5h |
| Backend - Reviews API | 5 | 6h |
| Backend - Updates API | 4 | 5h |
| Frontend - API | 4 | 4h |
| Frontend - Reviews Page | 6 | 8.5h |
| Frontend - What's New | 5 | 7.5h |
| Frontend - Detail Modal | 7 | 10.5h |
| Frontend - Navigation | 3 | 1.5h |
| **Total** | **38** | **~46h (5-6 days)** |

---

## 8. Verification Checklist

- [x] Reviews page shows all competitor reviews
- [x] Reviews filters work (competitor, sentiment, rating)
- [x] Sentiment distribution displays correctly
- [x] Reviews pagination works
- [x] What's New page shows app updates timeline
- [x] What's New filters work (competitor, impact, date)
- [x] Update cards show impact stripe
- [ ] Competitor row click opens detail modal
- [ ] Modal tabs navigate correctly
- [ ] Modal shows recent reviews and updates
- [x] Sidebar has Reviews and What's New menu items
- [x] Routes work correctly

---

## 9. Screenshots Scope (Deferred)

**Note:** App screenshots crawling is **DEFERRED** because:
1. SearchAPI doesn't provide screenshot URLs in main endpoint
2. Would require additional API calls per app
3. Lower priority compared to Reviews/Updates

**Future Enhancement:**
- Add `CompetitorScreenshot` model
- Crawl screenshot URLs from store listing
- Display in carousel on Competitor Detail Modal

---

**Next Step:** Start with Backend API tasks (AI-RV-*, AI-AU-*), then Frontend.
