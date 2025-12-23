# Dashboard Frontend Implementation Plan

> **Domain:** Dashboard  
> **Status:** 🟡 In Progress
> **Created:** December 13, 2024
> **Last Updated:** December 15, 2024
> **Progress:** 50/58 tasks completed (86%)  
> **Priority:** P0 - Critical (Layout) / P1-P2 (Screens)  
> **Phase:** 1-4 (Cross-cutting)

---

## 1. Overview

This plan covers the frontend implementation for **Dashboard** domain, the main UI layer including:
- **Layout Components:** Sidebar, Header, MainContent, RightPanel
- **Shared Components:** KPICard, DataTable, ChartCard, EmptyState
- **10 Dashboard Screens:** Projects, Overview, Competitors, Videos, Channels, AI Insights, Reviews, What's New, ASO, Marketing, Info

**Reference Documents:**
- Domain UI Design: `docs/4.ui-design/domains/dashboard/domain-ui.md`
- System UI Design: `docs/4.ui-design/system-ui-design.md`
- Reference Theme: `references/themes/demo-website-v2/` ⚠️ **MUST FOLLOW**

**Estimated Duration:** 15-20 days (across all phases)  
**Dependencies:** System Frontend, Auth, Project Management Backend

---

## 2. Prerequisites

Before starting implementation:

- [x] System Frontend setup completed ✅
- [x] TanStack Query configured ✅
- [x] Tailwind CSS (no Shadcn/UI) ✅
- [x] Reference theme reviewed ✅
- [x] Auth domain functional ✅

---

## 3. Pages Summary

### Phase 1 - Foundation (P0-P1)

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| ProjectsListPage | `/projects` | Grid of user's projects | P0 |
| OverviewPage | `/projects/:id/overview` | Activity feed, summary | P1 |
| CompetitorsPage | `/projects/:id/competitors` | Competitors table | P0 |

### Phase 2-4 - Extended

| Page | Route | Description | Priority | Phase |
|------|-------|-------------|----------|-------|
| VideoAdsPage | `/projects/:id/video-ads` | Video Ads table | P1 | 2 |
| VideoOrganicPage | `/projects/:id/video-organic` | Video Organic library | P1 | 2 |
| SocialPage | `/projects/:id/social` | Social channels | P2 | 2 |
| AIInsightsPage | `/projects/:id/ai-insights` | AI analysis | P0 | 3 |
| ReviewsPage | `/projects/:id/reviews` | Reviews analysis | P1 | 3 |
| WhatsNewPage | `/projects/:id/whats-new` | App updates | P1 | 3 |
| ASOPage | `/projects/:id/aso` | ASO tracking | P2 | 4 |
| MarketingPage | `/projects/:id/marketing` | Marketing stats | P2 | 4 |
| InfoPage | `/projects/:id/info` | Project info | P2 | 4 |

---

## 4. Implementation Tasks

### 4.1 Layout Components (Phase 1 - Critical)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-LY-001 | Create AppLayout wrapper | 2h | ✅ Done (ProjectLayout) |
| DASH-LY-002 | Create Sidebar component | 4h | ✅ Done |
| DASH-LY-003 | Create Header component | 3h | ✅ Done |
| DASH-LY-004 | Create MainContent wrapper | 1h | ✅ Done (in ProjectLayout) |
| DASH-LY-005 | Create RightPanel component | 3h | ⬜ Deferred (not needed for MVP) |
| DASH-LY-006 | Implement responsive sidebar | 3h | ✅ Done |
| DASH-LY-007 | Create Breadcrumb component | 1h | ✅ Done (in Header) |
| DASH-LY-008 | Create UI store (sidebar, theme) | 2h | ✅ Done |

**Checklist:**
- [x] **DASH-LY-001**: Create AppLayout with sidebar + main content structure ✅
- [x] **DASH-LY-002**: Sidebar with navigation items (copy from reference theme) ✅
- [x] **DASH-LY-003**: Header with breadcrumbs, project selector, user menu ✅
- [x] **DASH-LY-004**: MainContent with padding and scroll ✅
- [ ] **DASH-LY-005**: RightPanel for summary/filters (optional, collapsible) - Deferred
- [x] **DASH-LY-006**: Mobile drawer, tablet collapsed, desktop full ✅
- [x] **DASH-LY-007**: Breadcrumb with project > page context ✅
- [x] **DASH-LY-008**: Zustand store for sidebarOpen, theme ✅

**Files Created:**
```
frontend/src/components/layout/
├── index.ts                    ✅
├── ProjectLayout.tsx           ✅ (AppLayout equivalent)
├── Sidebar.tsx                 ✅
├── Header.tsx                  ✅

frontend/src/stores/
└── ui.store.ts                 ✅
```

**Reference Files Used:**
- `references/themes/demo-website-v2/components/Sidebar.tsx`
- `references/themes/demo-website-v2/components/Header.tsx`
- `references/themes/demo-website-v2/App.tsx`

### 4.2 Shared Component Library (Phase 1)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-CMP-001 | Create KPICard component | 2h | ✅ Done |
| DASH-CMP-002 | Create DataTable component | 4h | ⬜ (use existing table patterns) |
| DASH-CMP-003 | Create ChartCard wrapper | 2h | ✅ Done |
| DASH-CMP-004 | Create EmptyState component | 1h | ✅ Done |
| DASH-CMP-005 | Create LoadingSkeleton components | 2h | ✅ Done |
| DASH-CMP-006 | Create Badge components | 1h | ✅ Done |
| DASH-CMP-007 | Create FilterPanel component | 3h | ⬜ |
| DASH-CMP-008 | Create InsightCard component | 2h | ✅ Done |
| DASH-CMP-009 | Create ActivityItem component | 1h | ✅ Done |
| DASH-CMP-010 | Create PageHeader component | 1h | ✅ Done |

**Checklist:**
- [x] **DASH-CMP-001**: KPI card with title, value, change indicator, icon ✅
- [ ] **DASH-CMP-002**: Sortable, filterable table with TanStack Table
- [x] **DASH-CMP-003**: Card wrapper for chart containers ✅
- [x] **DASH-CMP-004**: Empty state with icon, message, CTA ✅
- [x] **DASH-CMP-005**: Skeletons for cards, tables, charts ✅
- [x] **DASH-CMP-006**: Status badges (success, warning, danger) ✅
- [ ] **DASH-CMP-007**: Filter controls (date range, platform, etc.)
- [x] **DASH-CMP-008**: Insight card with impact badge, category ✅
- [x] **DASH-CMP-009**: Activity feed item with type icon, timestamp ✅
- [x] **DASH-CMP-010**: Page title with actions slot ✅

**Files Created:**
```
frontend/src/components/shared/
├── index.ts                    ✅
├── kpi-card.tsx                ✅
├── empty-state.tsx             ✅
├── loading-skeleton.tsx        ✅
├── status-badge.tsx            ✅
├── page-header.tsx             ✅
├── chart-card.tsx              ✅
├── insight-card.tsx            ✅
├── activity-item.tsx           ✅
├── data-table.tsx              ⬜
└── filter-panel.tsx            ⬜
```

### 4.3 Router Setup

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-RT-001 | Setup TanStack Router (or React Router) | 2h | ✅ Done (React Router) |
| DASH-RT-002 | Define route tree for all screens | 2h | ✅ Done |
| DASH-RT-003 | Create project layout route | 1h | ✅ Done |
| DASH-RT-004 | Setup route guards | 1h | ✅ Done |
| DASH-RT-005 | Setup route loading states | 1h | ✅ Done |

**Checklist:**
- [x] **DASH-RT-001**: Configure router with nested layouts ✅
- [x] **DASH-RT-002**: Define all routes matching pages summary ✅
- [x] **DASH-RT-003**: ProjectLayout wraps all /projects/:id/* routes ✅
- [x] **DASH-RT-004**: Auth guard on all project routes ✅
- [x] **DASH-RT-005**: Loading UI during route transitions ✅

**Files Updated:**
- `frontend/src/App.tsx` - All routes defined with ProtectedRoute and ProjectLayout

### 4.4 Phase 1 Pages

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-PG-001 | Create OverviewPage | 4h | ✅ Done |
| DASH-PG-002 | Create activity feed section | 2h | ✅ Done (demo data) |
| DASH-PG-003 | Create summary cards section | 2h | ✅ Done (demo data) |

**Checklist:**
- [x] **DASH-PG-001**: Overview page with layout ✅
- [x] **DASH-PG-002**: Activity feed with demo data ✅
- [x] **DASH-PG-003**: KPI cards row at top ✅

**Files Created:**
- `frontend/src/features/dashboard/DashboardOverview.tsx` ✅

### 4.5 Phase 2 Pages (Video Ads, Video Organic & Social)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-PG-004 | Create VideoAdsPage layout | 2h | ⬜ |
| DASH-PG-005 | Create VideoAdsTable component | 3h | ⬜ |
| DASH-PG-006 | Implement video ads filters | 3h | ⬜ |
| DASH-PG-007 | Create VideoOrganicPage layout | 2h | ⬜ |
| DASH-PG-008 | Create VideoCard component | 2h | ✅ |
| DASH-PG-009 | Create VideoGrid with infinite scroll | 3h | ✅ |
| DASH-PG-010 | Implement video organic filters | 3h | ⬜ |
| DASH-PG-011 | Create VideoDetailModal | 2h | ✅ |
| DASH-PG-012 | Create SocialPage layout | 2h | ⬜ |
| DASH-PG-013 | Create ChannelCard component | 2h | ✅ (ChannelTable) |
| DASH-PG-014 | Display channel metrics | 2h | ✅ |

**Files Created:**
```
frontend/src/features/video-ads/
├── pages/VideoAdsPage.tsx         ⬜
├── components/
│   ├── video-ads-table.tsx       ⬜
│   ├── video-ads-filters.tsx      ⬜
│   └── video-ad-detail-modal.tsx  ⬜

frontend/src/features/video-organic/
├── pages/VideoOrganicPage.tsx    ⬜
├── components/
│   ├── video-card.tsx            ✅
│   ├── video-grid.tsx            ✅
│   ├── video-filters.tsx         ⬜
│   └── video-detail-modal.tsx    ✅

frontend/src/features/social/
├── pages/SocialPage.tsx          ⬜
└── components/
    ├── channel-table.tsx         ✅
    ├── channel-filters.tsx       ✅
    ├── add-channel-modal.tsx      ✅
    └── platform-summary-cards.tsx ✅
```

### 4.6 Phase 3 Pages (AI, Reviews, What's New)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-PG-012 | Create AIInsightsPage layout | 2h | ⬜ |
| DASH-PG-013 | Create ExecutiveSummary component | 3h | ⬜ |
| DASH-PG-014 | Create InsightCategoryTabs | 2h | ⬜ |
| DASH-PG-015 | Create InsightsList component | 3h | ⬜ |
| DASH-PG-016 | Create ReviewsPage layout | 2h | ✅ |
| DASH-PG-017 | Create ReviewCard component | 2h | ✅ |
| DASH-PG-018 | Create SentimentChart | 2h | ✅ (SentimentDistribution) |
| DASH-PG-019 | Create WhatsNewPage layout | 2h | ✅ |
| DASH-PG-020 | Create UpdateTimeline component | 3h | ✅ |
| DASH-PG-021 | Create UpdateCard component | 2h | ✅ |

**Files Created:**
```
frontend/src/features/ai-insights/
├── pages/ai-insights.page.tsx    ⬜
└── components/
    ├── executive-summary.tsx     ⬜
    ├── insight-tabs.tsx          ⬜
    └── insights-list.tsx         ⬜

frontend/src/features/reviews/
├── pages/ReviewsPage.tsx         ✅
├── api/reviews.api.ts            ✅
├── hooks/use-reviews.ts          ✅
└── components/
    ├── review-card.tsx           ✅
    ├── review-filters.tsx        ✅
    ├── reviews-grid.tsx          ✅
    └── sentiment-distribution.tsx ✅

frontend/src/features/whats-new/
├── pages/WhatsNewPage.tsx        ✅
├── api/app-updates.api.ts        ✅
├── hooks/use-app-updates.ts      ✅
└── components/
    ├── update-timeline.tsx       ✅
    ├── update-filters.tsx        ✅
    └── update-card.tsx           ✅
```

### 4.7 Phase 4 Pages (ASO, Marketing, Info)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-PG-022 | Create ASOPage layout | 2h | ⬜ |
| DASH-PG-023 | Create KeywordRankingTable | 3h | ⬜ |
| DASH-PG-024 | Create MetadataChangeLog | 2h | ⬜ |
| DASH-PG-025 | Create MarketingPage layout | 2h | ⬜ |
| DASH-PG-026 | Create AdPerformanceChart | 3h | ⬜ |
| DASH-PG-027 | Create BudgetAllocationChart | 2h | ⬜ |
| DASH-PG-028 | Create InfoPage | 2h | ⬜ |

### 4.8 API Integration

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-API-001 | Create dashboard API functions | 2h | ✅ Done |
| DASH-API-002 | Create useOverview query hook | 1h | ✅ Done |
| DASH-API-003 | Create useActivityFeed query hook | 1h | ✅ Done |
| DASH-API-004 | Define dashboard types | 1h | ✅ Done |

**Files Created:**
```
frontend/src/features/dashboard/
├── api/dashboard.api.ts         ✅
├── hooks/index.ts               ✅
├── hooks/use-dashboard-overview.ts  ✅
├── hooks/use-activity-feed.ts   ✅
└── types/dashboard.types.ts     ✅
```

### 4.9 Tests

| ID | Task | Est. | Status |
|----|------|------|--------|
| DASH-TST-001 | Write layout component tests | 2h | ⬜ |
| DASH-TST-002 | Write shared component tests | 3h | ⬜ |
| DASH-TST-003 | Write page integration tests | 3h | ⬜ |

---

## 5. Navigation Structure

```
/login                           → LoginPage
/projects                        → ProjectsListPage (Project Management)
/projects/:id                    → Redirect to /overview
/projects/:id/overview           → OverviewPage
/projects/:id/info               → InfoPage
/projects/:id/aso                → ASOPage
/projects/:id/marketing          → MarketingPage
/projects/:id/competitors        → CompetitorsPage (Project Management)
/projects/:id/whats-new          → WhatsNewPage
/projects/:id/social              → SocialPage
/projects/:id/video-ads           → VideoAdsPage
/projects/:id/video-organic       → VideoOrganicPage
/projects/:id/reviews             → ReviewsPage
/projects/:id/ai-insights        → AIInsightsPage
```

---

## 6. Sidebar Navigation Items

```typescript
const navigationItems = [
  // Internal - Your App
  { section: 'Internal', items: [
    { name: 'Overview', icon: 'monitoring', path: 'overview' },
    { name: 'Info', icon: 'info', path: 'info' },
    { name: 'ASO', icon: 'bar_chart', path: 'aso' },
    { name: 'Marketing', icon: 'ads_click', path: 'marketing' },
  ]},
  // External - Competitors
  { section: 'External', items: [
    { name: 'Competitors', icon: 'groups', path: 'competitors' },
    { name: "What's New", icon: 'new_releases', path: 'whats-new' },
    { name: 'Social', icon: 'share', path: 'social' },
    { name: 'Video Ads', icon: 'ads_click', path: 'video-ads' },
    { name: 'Video Organic', icon: 'play_circle', path: 'video-organic' },
  ]},
  // Analysis
  { section: 'Analysis', items: [
    { name: 'Reviews', icon: 'reviews', path: 'reviews' },
    { name: 'AI Insights', icon: 'psychology', path: 'ai-insights' },
  ]},
];
```

---

## 7. Verification Checklist

### Layout
- [ ] Sidebar shows navigation correctly
- [ ] Sidebar collapses on tablet
- [ ] Sidebar is drawer on mobile
- [ ] Header shows breadcrumb
- [ ] Header shows user menu
- [ ] Theme toggle works (if implemented)

### Pages (Phase 1)
- [ ] Overview page loads
- [ ] Activity feed displays items
- [ ] KPI cards show data
- [ ] Competitors page works (from PM domain)

### Performance
- [ ] All pages load < 3 seconds
- [ ] No layout shifts during load
- [ ] Loading states display correctly

---

## 8. Notes & Issues

### Critical: Reference Theme
- **ALL UI MUST FOLLOW** `references/themes/demo-website-v2/`
- Copy CSS classes exactly
- Match colors, spacing, shadows
- Use same icon names (Material Symbols)

### Implementation Order
1. **Layout Components** (DASH-LY-*) - Critical for all pages
2. **Shared Components** (DASH-CMP-*) - Reused everywhere
3. **Router Setup** (DASH-RT-*) - Navigation foundation
4. **Phase 1 Pages** - Minimum viable dashboard
5. **Phase 2-4 Pages** - As backend data becomes available

---

## 9. Progress Log

| Date | Tasks Completed | Notes |
|------|-----------------|-------|
| Dec 13, 2024 | DASH-LY-001-004,006-008, DASH-RT-*, DASH-PG-001-003 | Layout, routing, overview page with demo data |
| Dec 13, 2024 | DASH-CMP-003,008,009, DASH-API-001-004 | Shared components (ChartCard, InsightCard, ActivityItem), Dashboard API integration with hooks |

---

**Next Step:** Start with Layout Components (DASH-LY-*), then Shared Components, then Pages.

