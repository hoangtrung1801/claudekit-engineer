# Admin Frontend Implementation Plan

> **Domain:** Admin
> **Status:** 🟡 In Progress
> **Created:** December 13, 2024
> **Last Updated:** December 15, 2024
> **Progress:** 50/60 tasks completed (83%)
> **Priority:** P3 - Low
> **Phase:** 4 (Polish & Scale)

---

## 1. Overview

This plan covers the frontend implementation for **Admin** domain, including:
- Admin panel layout
- User management pages (list, create, update role)
- Project management pages (list all projects, view details, refresh info)
- Background task management pages (list jobs, view details, retry)
- Cost monitoring dashboard
- System health dashboard
- Error log viewer
- Queue monitor integration (Bull Board)

**Reference Documents:**
- Domain Planning: `docs/5.planning-setup/domains/admin/domain-planning.md`
- UI Design: `docs/4.ui-design/domains/admin/domain-ui-design.md`

**Estimated Duration:** 2 weeks
**Dependencies:** Dashboard Layout, Admin Backend

---

## 2. Pages Summary

| Page | Route | Description | Priority | Status |
|------|-------|-------------|----------|--------|
| Admin Dashboard | `/admin` | System overview | P1 | ⬜ |
| Users | `/admin/users` | User management | P1 | ✅ |
| Projects | `/admin/projects` | Project management (all) | P1 | ✅ |
| Reviews | `/admin/reviews` | Reviews management (all) | P1 | ✅ |
| What's New | `/admin/whats-new` | App updates management (all) | P1 | ✅ |
| Competitors | `/admin/competitors` | Competitors management (all) | P1 | ✅ |
| Competitor Detail | `/admin/competitors/:id` | Competitor detail page | P1 | ✅ |
| Landing Pages (Internal) | `/admin/internal/landing-pages` | Internal landing pages management | P1 | ⬜ |
| Landing Pages (External) | `/admin/external/landing-pages` | External landing pages management | P1 | ⬜ |
| Tasks | `/admin/tasks` | Background task management | P1 | ✅ |
| Keyword Spy | `/admin/spy-keywords` | Spy keywords management (all projects) | P1 | ⬜ |
| Video Ads (Internal) | `/admin/internal/video-ads` | Internal video ads management | P1 | ⬜ |
| Video Ads (External) | `/admin/external/video-ads` | External video ads management | P1 | ⬜ |
| Videos (Internal) | `/admin/internal/videos` | Internal video organic management | P1 | ⬜ |
| Videos (External) | `/admin/external/videos` | External video organic management | P1 | ⬜ |
| Social Channels (Internal) | `/admin/internal/social` | Internal social channels management | P1 | ⬜ |
| Social Channels (External) | `/admin/external/social` | External social channels management | P1 | ⬜ |
| Costs | `/admin/costs` | Cost monitoring | P1 | ⬜ |
| Health | `/admin/health` | System health | P2 | ⬜ |
| Logs | `/admin/logs` | Error logs | P2 | ⬜ |
| Queues | `/admin/queues` | Bull Board | P2 | ⬜ |
| Settings | `/admin/settings` | System settings | P2 | ⬜ |

---

## 3. Implementation Tasks

### 3.1 API Integration (AD-FE-API-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-API-001 | Create admin API functions | 2h | ✅ |
| AD-FE-API-002 | Create useAdminUsers query | 1h | ✅ |
| AD-FE-API-003 | Create useCreateUser mutation | 1h | ✅ |
| AD-FE-API-004 | Create useUpdateRole mutation | 1h | ✅ |
| AD-FE-API-005 | Create useAdminProjects query | 1h | ✅ |
| AD-FE-API-006 | Create useRefreshProjectInfo mutation | 1h | ✅ |
| AD-FE-API-007 | Create useAdminTasks query | 1h | ✅ |
| AD-FE-API-014 | Create useRefreshCompetitor mutation | 1h | ⬜ |
| AD-FE-API-015 | Create useCreateCompetitor mutation (store URL + project) | 1h | ⬜ |
| AD-FE-API-016 | Create `useTriggerInternalSocialAdsCrawl` and `useTriggerExternalSocialAdsCrawl` mutation hooks (calls `POST /admin/internal/social/:id/crawl-ads` and `POST /admin/external/social/:id/crawl-ads`) | 2h | ⬜ |
| AD-FE-API-016B | Create crawl trigger hooks for videos and stats (internal/external) | 2h | ⬜ |
| AD-FE-API-017 | Update admin API module: Remove old `listGlobalSocialChannels()`, add `listInternalSocialChannels()` and `listExternalSocialChannels()` | 2h | ⬜ |
| AD-FE-API-018 | Update admin API module: Add internal/external video and video-ads API methods | 2h | ⬜ |
| AD-FE-API-019 | Update admin API module: Add internal/external landing pages API methods | 1h | ⬜ |
| AD-FE-API-017 | Extend Admin Ads API client to support filtering by `socialChannelId` / `pageId` (for deep-link navigation from social stats) | 1h | ⬜ |
| AD-FE-API-008 | Create useQueueStats query | 1h | ✅ |
| AD-FE-API-009 | Create useRetryJob mutation | 1h | ✅ |
| AD-FE-API-010 | Create useCostData query | 1h | ⬜ |
| AD-FE-API-011 | Create useSystemHealth query | 1h | ⬜ |
| AD-FE-API-012 | Create useErrorLogs query | 1h | ⬜ |
| AD-FE-API-013 | Create useAdminProjectInfo query | 1h | ✅ |

### 3.2 Admin Layout (AD-FE-LAY-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-LAY-001 | Create AdminLayout component | 2h | ✅ |
| AD-FE-LAY-002 | Create AdminSidebar | 1h | ✅ (integrated in AdminLayout) |
| AD-FE-LAY-003 | Create AdminHeader | 1h | ✅ (integrated in AdminLayout) |

### 3.3 Users Management (AD-FE-USR-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-USR-001 | Create UsersListPage | 3h | ✅ |
| AD-FE-USR-002 | Create UserTable component | 2h | ✅ (integrated in page) |
| AD-FE-USR-003 | Create UserCreateModal | 2h | ✅ |
| AD-FE-USR-004 | Create RoleSelectDropdown | 1h | ✅ (inline select in table) |
| AD-FE-USR-005 | Create UserDetailModal | 2h | ✅ (part of UsersListPage) |

### 3.4 Projects Management (AD-FE-PROJ-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-PROJ-001 | Create ProjectsListPage | 3h | ✅ |
| AD-FE-PROJ-002 | Create ProjectTable component with crawl status badge | 2h | ✅ |
| AD-FE-PROJ-003 | Create ProjectInfoModal (combined view with tabs) | 3h | ✅ |
| AD-FE-PROJ-004 | Create EditProjectInfoModal component | 3h | ✅ |
| AD-FE-PROJ-005 | Create CreateProjectModal with owner selection (admin only) | 2h | ✅ |
| AD-FE-PROJ-006 | Create DeleteProjectButton with confirmation (admin can delete any) | 1h | ✅ |
| AD-FE-PROJ-007 | Create useProjectInfo query hook | 1h | ✅ |
| AD-FE-PROJ-008 | Create useUpdateProjectInfo mutation hook | 1h | ✅ |
| AD-FE-PROJ-009 | Create useCreateProject mutation hook (admin with targetUserId) | 1h | ✅ |
| AD-FE-PROJ-010 | Create RefreshInfoButton | 1h | ✅ |
| AD-FE-PROJ-011 | Add competitor click handler (navigate to competitor detail) | 1h | ✅ |

### 3.5 Data Management (AD-FE-DATA-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-DATA-001 | Create ReviewsListPage | 3h | ✅ |
| AD-FE-DATA-002 | Create ReviewsTable component | 2h | ✅ |
| AD-FE-DATA-003 | Create ReviewsFilters component | 2h | ✅ |
| AD-FE-DATA-004 | Create WhatsNewListPage | 3h | ✅ |
| AD-FE-DATA-005 | Create UpdatesTimeline component | 2h | ✅ |
| AD-FE-DATA-006 | Create UpdatesFilters component | 2h | ✅ |
| AD-FE-DATA-007 | Create CompetitorsListPage | 3h | ✅ |
| AD-FE-DATA-008 | Create CompetitorsTable component | 2h | ✅ |
| AD-FE-DATA-009 | Create CompetitorDetailPage (includes Social Channels & Landing Pages sections) | 4h | ✅ |
| AD-FE-DATA-013 | Add Refresh button in CompetitorsListPage Actions column | 1h | ⬜ |
| AD-FE-DATA-014 | Add Competitor creation (modal + form, calls useCreateCompetitor) | 2h | ⬜ |
| AD-FE-DATA-015 | Add Social Channel management UI (table + Add/Edit/Delete channel in CompetitorDetailPage) | 3h | ⬜ |
| AD-FE-DATA-016 | Enhance Social Channels section with filters (platform/status/search) and integrate UI-only actions for “Crawler Advertiser Ads” & “Crawler Video Social” buttons (calling existing admin trigger APIs) | 4h | ⬜ |
| AD-FE-DATA-017 | Add Competitor-level Video section on CompetitorDetailPage with menu/filter `type = Ads / Brand` + basic platform/date filters (read-only list using existing videos APIs) | 4h | ⬜ |
| AD-FE-DATA-018 | Create **Internal Social Management Page** `/admin/internal/social` (list from `ProjectSocialChannel`) with filters (platform/project/search) + CRUD + **Crawler Ads Library** & **Crawler Video Social** & **Crawler Stats** buttons | 6h | ⬜ |
| AD-FE-DATA-018B | Create **External Social Management Page** `/admin/external/social` (list from `CompetitorSocialChannel`) with filters (platform/competitor/project/search) + CRUD + **Crawler Ads Library** & **Crawler Video Social** & **Crawler Stats** buttons | 6h | ⬜ |
| AD-FE-DATA-019 | Create **Internal Video Organic Management Page** `/admin/internal/videos` with filters (platform, project, date, search) and read-only list/cards | 5h | ⬜ |
| AD-FE-DATA-019B | Create **External Video Organic Management Page** `/admin/external/videos` with filters (platform, competitor, project, date, search) and read-only list/cards | 5h | ⬜ |
| AD-FE-DATA-019C | Create **Internal Video Ads Management Page** `/admin/internal/video-ads` with filters (platform, project, date, search) and read-only list/cards | 5h | ⬜ |
| AD-FE-DATA-019D | Create **External Video Ads Management Page** `/admin/external/video-ads` with filters (platform, competitor, project, date, search) and read-only list/cards | 5h | ⬜ |
| AD-FE-DATA-019E | Create **Internal Landing Pages Management Page** `/admin/internal/landing-pages` | 3h | ⬜ |
| AD-FE-DATA-019F | Create **External Landing Pages Management Page** `/admin/external/landing-pages` | 3h | ⬜ |
| AD-FE-DATA-020 | Add bulk delete for Internal/External Social lists | 2h | ⬜ |
| AD-FE-DATA-021 | Add bulk delete for Internal/External Video and Video Ads lists | 2h | ⬜ |
| AD-FE-DATA-022 | Update AdminSidebar: Split into Internal and External sections, update routes to `/admin/internal/*` and `/admin/external/*` | 2h | ⬜ |
| AD-FE-DATA-023 | Update App.tsx routes: Add internal/external routes, remove old unified routes | 1h | ⬜ |
| AD-FE-DATA-010 | Create LandingPagesListPage | 2h | ✅ |
| AD-FE-DATA-011 | Create LandingPagesTable component | 2h | ✅ |
| AD-FE-DATA-012 | Update AdminSidebar with new menu items | 1h | ✅ |

### 3.6 Background Tasks (AD-FE-TASK-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-TASK-001 | Create TasksListPage | 3h | ✅ |
| AD-FE-TASK-002 | Create TaskTable component | 2h | ✅ |
| AD-FE-TASK-003 | Create TaskFilters component | 2h | ✅ |
| AD-FE-TASK-004 | Create TaskDetailsModal | 2h | ✅ |
| AD-FE-TASK-005 | Create QueueStatsCards | 2h | ✅ |
| AD-FE-TASK-006 | Create RetryJobButton | 1h | ✅ |

### 3.7 Cost Dashboard (AD-FE-COST-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-COST-001 | Create CostDashboardPage | 3h | ⬜ |
| AD-FE-COST-002 | Create TokenUsageChart | 2h | ⬜ |
| AD-FE-COST-003 | Create DailyCostTable | 2h | ⬜ |
| AD-FE-COST-004 | Create CostCapSettings | 2h | ⬜ |

### 3.8 System Health (AD-FE-HEALTH-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-HEALTH-001 | Create SystemHealthPage | 2h | ✅ |
| AD-FE-HEALTH-002 | Create ComponentStatusCard | 1h | ✅ |
| AD-FE-HEALTH-003 | Create MetricsChart | 2h | ⬜ |

### 3.9 Error Logs (AD-FE-LOG-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-LOG-001 | Create ErrorLogsPage | 2h | ⬜ |
| AD-FE-LOG-002 | Create LogsTable with filters | 2h | ⬜ |
| AD-FE-LOG-003 | Create LogDetailModal | 1h | ⬜ |

### 3.10 Admin Video Ads (AD-FE-VA-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-VA-001 | Create `AdminInternalVideoAdsPage` at `/admin/internal/video-ads` | 3h | ⬜ |
| AD-FE-VA-001B | Create `AdminExternalVideoAdsPage` at `/admin/external/video-ads` | 3h | ⬜ |
| AD-FE-VA-002 | Create VideoAdsList component with filters (project, platform, status, date range) | 3h | ⬜ |
| AD-FE-VA-003 | Create VideoAdsCard component (show ad metadata, impressions, spend) | 2h | ⬜ |
| AD-FE-VA-004 | Create VideoAdsDetailModal component | 2h | ⬜ |
| AD-FE-VA-005 | Add bulk delete functionality | 1h | ⬜ |
| AD-FE-VA-006 | Update Admin sidebar navigation | 0.5h | ⬜ |

**Note:** Ads Curation workflow has been deprecated. Video Ads are now created directly from Ads Library and managed via VideoAdsAdminController.

### 3.11 Admin Video Organic (AD-FE-VO-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-FE-VO-001 | Create `AdminInternalVideoOrganicPage` at `/admin/internal/videos` | 3h | ⬜ |
| AD-FE-VO-001B | Create `AdminExternalVideoOrganicPage` at `/admin/external/videos` | 3h | ⬜ |
| AD-FE-VO-002 | Create VideoOrganicList component with filters (project, platform, engagement metrics) | 3h | ⬜ |
| AD-FE-VO-003 | Create VideoOrganicCard component (show views, likes, comments, shares) | 2h | ⬜ |
| AD-FE-VO-004 | Create VideoOrganicDetailModal component | 2h | ⬜ |
| AD-FE-VO-005 | Add bulk delete functionality | 1h | ⬜ |
| AD-FE-VO-006 | Update Admin sidebar navigation (rename "Videos" to clarify it's organic only) | 0.5h | ⬜ |

---

## 4. Files Created/Status

```
frontend/src/features/admin/
├── pages/
│   ├── index.ts                       ✅
│   ├── admin-dashboard.page.tsx       ✅
│   ├── users-list.page.tsx            ✅
│   ├── projects-list.page.tsx         ✅
│   ├── admin-project-edit.page.tsx    ✅
│   ├── admin-project-info-edit.page.tsx ✅
│   ├── reviews-list.page.tsx          ✅
│   ├── whats-new-list.page.tsx        ✅
│   ├── competitors-list.page.tsx      ✅
│   ├── competitor-detail.page.tsx     ✅
│   ├── landing-pages-list.page.tsx    ✅
│   ├── tasks-list.page.tsx            ✅
│   ├── cost-dashboard.page.tsx        ⬜
│   ├── system-health.page.tsx         ✅
│   ├── error-logs.page.tsx            ⬜
│   └── admin-settings.page.tsx        ⬜
├── api/admin.api.ts                   ✅
├── hooks/
│   ├── index.ts                       ✅
│   ├── use-admin-users.ts             ✅
│   ├── use-admin-projects.ts          ✅
│   ├── use-admin-reviews.ts           ✅
│   ├── use-admin-app-updates.ts       ✅
│   ├── use-admin-competitors.ts       ✅
│   ├── use-admin-landing-pages.ts     ✅
│   ├── use-admin-tasks.ts             ✅
│   ├── use-cost-data.ts               ⬜
│   ├── use-system-health.ts           ⬜
│   └── use-error-logs.ts              ⬜
├── components/
│   ├── index.ts                       ✅
│   ├── admin-layout.tsx               ✅
│   ├── user-create-modal.tsx          ✅
│   ├── role-badge.tsx                 ✅
│   ├── status-badge.tsx               ✅
│   ├── queue-stats-cards.tsx          ✅
│   ├── delete-confirmation-modal.tsx  ✅
│   ├── token-usage-chart.tsx          ⬜
│   ├── daily-cost-table.tsx           ⬜
│   ├── cost-cap-settings.tsx          ⬜
│   ├── component-status-card.tsx      ⬜
│   ├── metrics-chart.tsx              ⬜
│   ├── logs-table.tsx                 ⬜
│   └── log-detail-modal.tsx           ⬜
└── types/admin.types.ts               ✅
```

---

## 5. Admin Panel Structure

```
/admin
├── /users           → User management ✅
├── /projects        → Project management (all projects) ✅
│   ├── /:id/edit    → Edit project details ✅
│   └── /:id/edit-info → Edit app info ✅
├── /competitors     → Competitors management ✅
│   └── /:id         → Competitor details ✅
├── /reviews         → Reviews management ✅
├── /whats-new       → App updates management ✅
├── /landing-pages   → Landing pages management ✅
├── /tasks           → Background task management ✅
├── /costs           → Cost monitoring ⬜
├── /health          → System health ⬜
├── /logs            → Error logs ⬜
├── /queues          → Bull Board iframe ⬜
└── /settings        → System settings ⬜
```

---

## 6. UI Specifications

### Admin Dashboard (⬜ Not Started)
- Quick stats cards (Users, Projects, API calls)
- Cost summary chart
- System health status
- Recent errors list

### Users Page (✅ Complete)
- Data table with pagination
- Search by email
- Role dropdown inline edit
- Delete button with confirm
- Bulk delete support

### Projects Page (✅ Complete)
- Data table with pagination
- Search by name/app name
- Status badges (project status, info crawl status)
- View/Edit/Delete actions
- Refresh info button
- Create project modal with owner selection
- Bulk delete support

### Data Management Pages (✅ Complete)
- Reviews list with filters and bulk delete
- What's New list with filters and bulk delete
- Competitors list with detail page navigation
- Landing Pages list with filters and bulk delete

### Tasks Page (✅ Complete)
- Queue stats cards
- Task table with status filters
- Task details modal
- Retry job functionality

### Cost Dashboard (⬜ Not Started)
- Line chart for daily token usage
- Bar chart for provider breakdown
- Cost cap progress bar
- Edit cap modal

### System Health (⬜ Not Started)
- Status cards: Database, Redis, Queue, API
- Green/Yellow/Red indicators
- Response time sparklines
- Last checked timestamp

---

## 7. Verification Checklist

- [x] Admin layout renders correctly
- [x] Only admin users can access
- [x] User list with pagination
- [x] Role update works
- [x] User create/delete works
- [x] Project list with all user projects
- [x] Project create/edit/delete works
- [x] Project info refresh works
- [x] Reviews management works
- [x] What's New management works
- [x] Competitors management with detail page
- [x] Landing Pages management works
- [x] Tasks management works
- [x] Queue stats display
- [ ] Cost charts display data
- [ ] Cost cap settings save
- [ ] Health status shows correctly
- [ ] Error logs searchable/filterable
- [ ] Bull Board iframe loads
- [x] Mobile responsive (limited)

---

## 8. Progress Log

| Date | Tasks Completed | Notes |
|------|-----------------|-------|
| Dec 14, 2024 | AD-FE-LAY-*, AD-FE-USR-*, AD-FE-PROJ-* | Layout, Users, Projects pages |
| Dec 14, 2024 | AD-FE-DATA-*, AD-FE-TASK-* | Data management pages, Tasks page |
| Dec 15, 2024 | Documentation update | Updated plan to reflect actual progress |

---

**Next Steps:**
1. Implement Admin Dashboard page (system overview)
2. Implement Cost Dashboard page
3. Implement System Health page
4. Implement Error Logs page

