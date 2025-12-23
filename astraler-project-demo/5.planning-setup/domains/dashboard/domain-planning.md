# Domain Planning: Dashboard (Presentation)

> **Reference:** [System Planning](../../system-planning.md)  
> **Phase:** 1-4 (Cross-cutting)  
> **Priority:** P1 - High

---

## 1. Domain Overview

### 1.1 Domain Name & Scope

**Dashboard Domain** is the main UI layer, providing 10 specialized dashboard screens for different user roles.

**Scope:**
- Layout components (Sidebar, Header, RightPanel)
- 10 Dashboard screens (Overview, Info, ASO, Marketing, Competitors, What's New, Channels, Videos, Reviews, AI Insights)
- Shared UI components (KPI Cards, Tables, Charts)
- Responsive design
- Role-based view filtering

**Out of Scope:**
- Data fetching logic (handled by feature hooks)
- Backend aggregation APIs (separate per feature)

### 1.2 Domain Objectives

| Objective | Success Criteria |
|-----------|------------------|
| Role-specific views | Marketing sees Videos/Channels, Product sees Reviews |
| Performance | Dashboard load < 3 seconds |
| Consistency | All screens use shared component library |
| Responsive | Works on mobile, tablet, desktop |

### 1.3 Domain Context

**Dependencies:**
- **From Auth:** User role for view filtering
- **From Project Management:** Project context for data scope
- **From All Domains:** Data APIs for each dashboard

**Integration Points:**
- TanStack Router for navigation
- TanStack Query for data fetching
- Zustand for UI state (sidebar, theme)

---

## 2. Features Breakdown

### 2.1 Feature List

| Feature ID | Feature Name | Priority | Complexity | Phase | Est. Points |
|------------|--------------|----------|------------|-------|-------------|
| DASH-01 | Main Layout (Sidebar, Header) | P0 | Medium | 1 | 8 |
| DASH-02 | RightPanel (Summary, Filters) | P1 | Medium | 1 | 5 |
| DASH-03 | Navigation Router Setup | P0 | Medium | 1 | 5 |
| DASH-04 | Projects Dashboard | P0 | Low | 1 | 3 |
| DASH-05 | Overview Screen (Activity Feed) | P1 | Medium | 1 | 5 |
| DASH-06 | Competitors Screen | P0 | Medium | 1 | 5 |
| DASH-07 | Video Ads Screen | P1 | High | 2 | 8 |
| DASH-08 | Video Organic Screen | P1 | High | 2 | 8 |
| DASH-09 | Social Screen | P2 | Medium | 2 | 5 |
| DASH-10 | AI Insights Screen | P0 | High | 3 | 8 |
| DASH-11 | Reviews Screen | P1 | Medium | 3 | 5 |
| DASH-12 | What's New Screen | P1 | Medium | 3 | 5 |
| DASH-13 | ASO Screen | P2 | Medium | 4 | 5 |
| DASH-14 | Marketing Screen | P2 | High | 4 | 8 |
| DASH-15 | Info Screen | P2 | Low | 4 | 3 |
| DASH-16 | Shared Components Library | P0 | High | 1 | 10 |
| **Total** | | | | | **96 points** |

### 2.2 Phase Distribution

```
Phase 1 (Foundation):
├── DASH-01: Layout ─────────────▶ Core structure
├── DASH-02: RightPanel
├── DASH-03: Router
├── DASH-04: Projects
├── DASH-05: Overview
├── DASH-06: Competitors
└── DASH-15: Component Library

Phase 2 (Data Engine):
├── DASH-07: Video Ads ─────▶ Depends on Ads Library data
├── DASH-08: Video Organic ─────▶ Depends on Social Crawler data
└── DASH-09: Social

Phase 3 (Intelligence):
├── DASH-10: AI Insights ────────▶ Depends on AI Analysis
├── DASH-11: Reviews
└── DASH-12: What's New

Phase 4 (Polish):
├── DASH-13: ASO
├── DASH-14: Marketing
└── DASH-15: Info
```

---

## 3. Tasks Breakdown

### 3.1 Phase 1: Foundation (Layout & Core Screens)

#### Layout Components
- [ ] **DASH-B01**: Setup TanStack Router configuration - 3h
- [ ] **DASH-B02**: Create MainLayout wrapper component - 2h
- [ ] **DASH-B03**: Create Sidebar component with navigation items - 4h
- [ ] **DASH-B04**: Create Header component (breadcrumb, user, notifications) - 3h
- [ ] **DASH-B05**: Create RightPanel component (summary, filters) - 3h
- [ ] **DASH-B06**: Implement responsive sidebar (collapse on mobile) - 3h
- [ ] **DASH-B07**: Setup Zustand UI store (sidebar state, theme) - 2h

#### Shared Component Library
- [ ] **DASH-C01**: Create KPICard component - 2h
- [ ] **DASH-C02**: Create DataTable component (sortable, filterable) - 4h
- [ ] **DASH-C03**: Create ChartCard wrapper - 2h
- [ ] **DASH-C04**: Create EmptyState component - 1h
- [ ] **DASH-C05**: Create LoadingSkeleton components - 2h
- [ ] **DASH-C06**: Create Badge components (status, impact) - 1h
- [ ] **DASH-C07**: Create FilterPanel component - 3h
- [ ] **DASH-C08**: Create InsightCard component - 2h

#### Core Screens
- [ ] **DASH-P01**: Create ProjectsPage (grid of project cards) - 3h
- [ ] **DASH-P02**: Create OverviewPage (activity feed) - 4h
- [ ] **DASH-P03**: Create CompetitorsPage (table view) - 4h

### 3.2 Phase 2: Data Screens

#### Video Ads
- [ ] **DASH-VA01**: Create VideoAdsPage layout - 2h
- [ ] **DASH-VA02**: Create VideoAdsTable component - 3h
- [ ] **DASH-VA03**: Implement video ads filters (platform, advertiser, date) - 3h
- [ ] **DASH-VA04**: Create VideoAdDetailModal - 2h

#### Video Organic
- [ ] **DASH-VO01**: Create VideoOrganicPage layout - 2h
- [ ] **DASH-VO02**: Create VideoCard component - 2h
- [ ] **DASH-VO03**: Create VideoGrid with infinite scroll - 3h
- [ ] **DASH-VO04**: Implement video organic filters (platform, date, hero) - 3h
- [ ] **DASH-VO05**: Create VideoDetailModal - 2h

#### Social
- [ ] **DASH-SO01**: Create SocialPage layout - 2h
- [ ] **DASH-SO02**: Create ChannelCard component - 2h
- [ ] **DASH-SO03**: Display channel metrics and growth - 2h

### 3.3 Phase 3: Intelligence Screens

#### AI Insights
- [ ] **DASH-AI01**: Create AIInsightsPage layout - 2h
- [ ] **DASH-AI02**: Create ExecutiveSummary component - 3h
- [ ] **DASH-AI03**: Create InsightCategoryTabs - 2h
- [ ] **DASH-AI04**: Create InsightsList with impact badges - 3h

#### Reviews
- [ ] **DASH-R01**: Create ReviewsPage layout - 2h
- [ ] **DASH-R02**: Create ReviewCard component - 2h
- [ ] **DASH-R03**: Implement sentiment filter - 1h
- [ ] **DASH-R04**: Create SentimentChart - 2h

#### What's New
- [ ] **DASH-W01**: Create WhatsNewPage layout - 2h
- [ ] **DASH-W02**: Create UpdateTimeline component - 3h
- [ ] **DASH-W03**: Create UpdateCard with strategic insight - 2h

### 3.4 Phase 4: Extended Screens

#### ASO
- [ ] **DASH-A01**: Create ASOPage layout - 2h
- [ ] **DASH-A02**: Create KeywordRankingTable - 3h
- [ ] **DASH-A03**: Create MetadataChangeLog - 2h

#### Marketing
- [ ] **DASH-M01**: Create MarketingPage layout - 2h
- [ ] **DASH-M02**: Create AdPerformanceChart - 3h
- [ ] **DASH-M03**: Create BudgetAllocationChart - 2h
- [ ] **DASH-M04**: Create KPI Dashboard Cards - 2h

#### Info
- [ ] **DASH-I01**: Create InfoPage (project details) - 2h
- [ ] **DASH-I02**: Display project configuration - 1h

---

## 4. Timeline & Sprints

### 4.1 Timeline per Phase

| Phase | Screens | Duration | Weeks |
|-------|---------|----------|-------|
| Phase 1 | Layout + Projects + Overview + Competitors | 2 weeks | Week 7-8 |
| Phase 2 | Video Ads + Video Organic + Social | 2 weeks | Week 15-16 |
| Phase 3 | AI Insights + Reviews + What's New | 1.5 weeks | Week 21-22 |
| Phase 4 | ASO + Marketing + Info | 1 week | Week 25-26 |

### 4.2 Milestones

1. **M1: Core Layout Ready** (Week 8) - Sidebar, Header, Navigation working
2. **M2: Data Screens Ready** (Week 16) - Videos, Channels populated
3. **M3: Intelligence Screens Ready** (Week 22) - AI Insights functional
4. **M4: All Screens Complete** (Week 26) - Full dashboard operational

---

## 5. Resource Allocation

### 5.1 Team Assignment

| Role | Allocation | Tasks |
|------|------------|-------|
| Frontend Developer | 100% | All DASH tasks |

### 5.2 Capacity Planning

- Phase 1: ~40 hours (Component lib + Core screens)
- Phase 2: ~16 hours
- Phase 3: ~22 hours
- Phase 4: ~17 hours
- **Total: ~95 hours**

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies
- Shadcn/UI installed and configured
- Tailwind CSS configured
- Chart library (Tremor/Recharts) setup

### 6.2 Internal Dependencies by Screen

| Screen | Depends On |
|--------|------------|
| Projects | Auth, Project APIs |
| Competitors | Project Management APIs |
| Video Ads | Data Collection (Ads Library) completed |
| Video Organic | Data Collection (Social Crawler) completed |
| Social | Data Collection completed |
| AI Insights | AI Analysis completed |
| Reviews | Data Collection + AI Analysis |
| What's New | Data Collection |
| ASO | Data Collection |
| Marketing | Data Collection + Analytics |

---

## 7. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Chart library issues | Low | Medium | Have backup (Recharts → Victory) |
| Performance with large data | Medium | Medium | Implement virtualization, pagination |
| Responsive design complexity | Medium | Low | Mobile-first approach, test early |

---

## 8. Definition of Done

### 8.1 Per Screen Criteria

- [ ] Screen renders without errors
- [ ] Loading states shown appropriately
- [ ] Empty states with helpful messaging
- [ ] Data filters functional
- [ ] Responsive on all breakpoints
- [ ] Accessible (keyboard nav, screen reader)

### 8.2 Overall Quality Gates

- [ ] All screens load < 3 seconds
- [ ] No layout shifts during load
- [ ] Consistent styling across screens
- [ ] Dark mode support (if applicable)

---

## 9. Screen Navigation Map

```
/login                    → LoginPage
/projects                 → ProjectsPage
/projects/:id             → DashboardLayout
  ├── /overview           → OverviewPage
  ├── /info               → InfoPage
  ├── /aso                → ASOPage
  ├── /marketing          → MarketingPage
  ├── /competitors        → CompetitorsPage
  ├── /whats-new          → WhatsNewPage
  ├── /social             → SocialPage
  ├── /video-ads          → VideoAdsPage
  ├── /video-organic      → VideoOrganicPage
  ├── /reviews            → ReviewsPage
  └── /ai-insights        → AIInsightsPage
```

---

**Next Step:** Start with Layout components and shared library, then build screens progressively per phase.

