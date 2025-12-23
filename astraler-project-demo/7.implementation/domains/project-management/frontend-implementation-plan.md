# Project Management Frontend Implementation Plan – Project Ads Curation (User)

> ⚠️ **DEPRECATED**: This plan is **OBSOLETE** as of December 2024.  
> **Status:** 🔴 Cancelled - Ads Curation workflow has been **REMOVED**  
> **Reason:** Video Ads Refactoring - Ads Curation workflow replaced by direct VideoAds creation  
> **Alternative:** Video Ads are now browsed via Videos page with `type=AD` filter (see `docs/7.implementation/domains/data-collection/video-ads-refactoring-plan.md`)

---

## 1. Overview

> **This section is kept for historical reference only. Do not implement these tasks.**

~~This plan covers the **user-facing Ads Curation experience** per project. It builds on the shared Ads Curation workflow (Data Collection Domain) and exposes a focused UI for project owners at route:~~

- ~~`/projects/:projectId/ads`~~

~~The page enables users to:~~

- ~~View and filter crawled ads for the selected project.~~
- ~~Review ads (approve/reject) and convert approved ads into Video/SocialPost content.~~
- ~~Inspect rich ad details, **play ad videos**, and **navigate to advertiser profiles** on the underlying platforms when supported.~~

**Reference Documents:**

- PRD: `docs/1.business-analyst/domains/data-collection/features/ads-curation-workflow/feature-prd.md`
- SAD: `docs/2.solution-architect/domains/data-collection/features/ads-curation-workflow/feature-sad.md`
- TDD (Ads Curation Workflow): `docs/3.technical-design/domains/data-collection/features/ads-curation-workflow/feature-tdd.md`
- TDD (Project Management): `docs/3.technical-design/domains/project-management/domain-tdd.md` – see section **6. Project Ads Curation (User-Facing UI at `/projects/:projectId/ads`)**
- Planning: `docs/5.planning-setup/domains/project-management/domain-planning.md` – feature **PM-29 Project Ads Curation UI (User)** and tasks **PM-F36–PM-F39**

---

## 2. Page Summary

| Page | Route | Description | Priority | Status |
|------|-------|-------------|----------|--------|
| ~~Project Ads Curation~~ | ~~`/projects/:projectId/ads`~~ | ~~Per-project ads review & curation UI (Pending/Approved/Added)~~ | ~~P1~~ | 🔴 **CANCELLED** |

---

## 3. Implementation Tasks

### 3.1 API Integration (PM-ADS-FE-API-*)

> Uses existing `adsCurationApi` in the Projects frontend and Ads Curation endpoints from Data Collection.

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-ADS-FE-API-001 | Ensure `Ad` and `AdQueryParams` types cover fields needed for detail modal (video URLs, profile URIs, metrics) | 1h | ⬜ |
| PM-ADS-FE-API-002 | Extend `AdQueryParams` usage to include `limit` and `offset` in user-facing ads curation queries | 1h | ⬜ |
| PM-ADS-FE-API-003 | Verify `adsCurationApi.getReviewQueue/approved/added` correctly pass platform + pagination params | 1h | ⬜ |

### 3.2 Project Ads Curation Page (PM-ADS-FE-PAGE-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-ADS-FE-PAGE-001 | Refine `AdsCurationPage` layout to clearly show tabs/states (Pending/Approved/Added) and active state | 2h | ⬜ |
| PM-ADS-FE-PAGE-002 | Implement “All Platforms” default with explicit platform filter toggles (Meta/TikTok/Google) | 2h | ⬜ |
| PM-ADS-FE-PAGE-003 | Add pagination / “Load more” behavior using `limit`/`offset` and show “Showing X–Y of Z ads” | 3h | ⬜ |
| PM-ADS-FE-PAGE-004 | Preserve platform filter and tab state when switching between Pending/Approved/Added | 1h | ⬜ |

### 3.3 Ad Card & Detail Modal (PM-ADS-FE-UI-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-ADS-FE-UI-001 | Ensure ad cards show key info: thumbnail/preview, advertiser/page name, platform badge, short copy, basic metrics | 2h | ⬜ |
| PM-ADS-FE-UI-002 | Implement click behavior on card body to open **Ad Detail Modal** (without interfering with batch-select checkbox) | 2h | ⬜ |
| PM-ADS-FE-UI-003 | Implement `AdDetailModal` (user-facing): large preview, advertiser info, platform badge, spy keyword, full copy, dates & metrics | 3h | ⬜ |
| PM-ADS-FE-UI-004 | Implement “Watch Video” action in modal: open `videoUrl`/`videoHdUrl` in a new tab when available | 2h | ⬜ |
| PM-ADS-FE-UI-005 | Implement advertiser **Profile hyperlink** in modal: open `pageProfileUri` / profile URL in new tab when present, hide link when absent | 2h | ⬜ |

### 3.4 Curation Actions (PM-ADS-FE-ACT-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-ADS-FE-ACT-001 | Confirm single-ad Approve/Reject actions in Pending tab integrate correctly with backend and refresh lists/stats | 2h | ⬜ |
| PM-ADS-FE-ACT-002 | Refine batch actions: “Select all” applies to ads currently loaded in the grid; “Approve All”/“Reject All” operate on selected set | 2h | ⬜ |
| PM-ADS-FE-ACT-003 | Ensure “Add to Content” is only available on Approved tab and updates Added tab & stats on success | 2h | ⬜ |
| PM-ADS-FE-ACT-004 | Show clear read-only indicators for Added ads (e.g., “Added as Video”, “Added as Post”) and, where available, links to created content | 2h | ⬜ |

---

## 4. Files Impacted (Frontend)

Planned changes will primarily affect:

- `frontend/src/features/projects/pages/AdsCurationPage.tsx`
- `frontend/src/features/projects/hooks/use-ads-curation.ts`
- `frontend/src/features/projects/api/ads-curation.api.ts`
- Potential new UI components for Ad Detail Modal and shared UI primitives (under `frontend/src/features/projects/components/` or similar).

No backend file changes are planned under this implementation plan; backend contracts are defined by the Data Collection Ads Curation workflow.

---

## 5. Verification Checklist

- [ ] `/projects/:projectId/ads` loads successfully for projects with Ads Curation enabled.
- [ ] Tabs/states (Pending/Approved/Added) switch correctly and show the right data.
- [ ] Platform filter defaults to “All Platforms” and filtering by single platform behaves as expected.
- [ ] Pagination or Load more reveals additional ads beyond the first batch; the user is not “stuck” on the first page of results.
- [ ] Clicking an ad card opens an Ad Detail Modal with complete, readable information.
- [ ] “Watch Video” opens the ad video in a new browser tab when a video URL is provided.
- [ ] Advertiser Profile hyperlink is visible only when a valid profile URL/URI exists and opens in a new tab with the correct platform.
- [ ] Approve/Reject for single and batch operations work and update counts/stats.
- [ ] “Add to Content” moves ads from Approved to Added state and updates indicators accordingly.

---

## 6. Progress Log

| Date | Tasks Completed | Notes |
|------|-----------------|-------|
| - | - | Not started yet |

---

**Next Steps:**
1. Implement API integration refinements (PM-ADS-FE-API-*).
2. Update `AdsCurationPage` structure for filters, pagination, and state handling.
3. Implement Ad Detail Modal with video playback and profile hyperlink behavior.
4. Validate the full curation flow against the verification checklist above.

# Project Management Frontend Implementation Plan

> **Domain:** Project Management
> **Status:** ✅ Complete
> **Created:** December 13, 2024
> **Last Updated:** December 15, 2024
> **Progress:** 48/52 tasks completed (92%) - Core Complete, Tests Deferred
> **Priority:** P0 - Critical
> **Phase:** 1 (Foundation)

---

## 1. Overview

This plan covers the frontend implementation for **Project Management** domain, including:
- Pages: Projects List, Project Dashboard, Competitors Management
- Components: ProjectCard, CompetitorTable, AddProjectModal, AddCompetitorModal
- State management: Project context, TanStack Query for data
- Forms: Create Project, Add Competitor, Add Social Channel

**Reference Documents:**
- Domain UI Design: `docs/4.ui-design/domains/project-management/domain-ui.md`
- Backend API: `docs/7.implementation/domains/project-management/backend-implementation-plan.md`

**Estimated Duration:** 8-10 days  
**Dependencies:** System Frontend (layout), Auth (protected routes), Dashboard Layout

---

## 2. Prerequisites

Before starting implementation:

- [x] System Frontend layout components completed ✅
- [x] Dashboard Layout (Sidebar, Header) completed ✅
- [x] Project Management Backend API available ✅
- [x] UI designs reviewed and approved ✅
- [x] TanStack Query configured ✅

---

## 3. Pages Summary

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| ProjectsListPage | `/projects` | Grid of user's projects | P0 |
| ProjectDashboard | `/projects/:id` | Project overview (redirect) | P0 |
| CompetitorsPage | `/projects/:id/competitors` | Competitors management | P0 |
| LandingPagesPage | `/projects/:id/landing-pages` | Landing pages list | P1 |
| **ProjectSocialPage** | **`/projects/:id/social`** | **Internal project social management (marketing team)** | **P1** |
| SettingsPage | `/projects/:id/settings` | Project configuration | P2 |

---

## 4. Implementation Tasks

### 4.1 Routes Setup

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-RT-001 | Create projects route structure | 1h | ✅ Done |
| PM-RT-002 | Setup project context from route params | 1h | ✅ Done |
| PM-RT-003 | Create nested routes for project screens | 1h | ✅ Done |
| PM-RT-004 | Apply auth guard to all project routes | 0.5h | ✅ Done |

**Checklist:**
- [x] **PM-RT-001**: Define /projects, /projects/:id routes ✅
- [x] **PM-RT-002**: Extract projectId from params, validate project access ✅
- [x] **PM-RT-003**: Setup /projects/:id/competitors, /settings routes ✅
- [x] **PM-RT-004**: All routes require authentication ✅

### 4.2 API Integration

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-API-001 | Create projects API functions | 2h | ✅ Done |
| PM-API-002 | Create competitors API functions | 2h | ✅ Done |
| PM-API-003 | Create social channels API functions | 1h | ✅ Done |
| PM-API-004 | Define TypeScript types | 1h | ✅ Done |
| PM-API-005 | Create useProjects query hook | 1h | ✅ Done |
| PM-API-006 | Create useProject query hook | 1h | ✅ Done |
| PM-API-007 | Create useCompetitors query hook | 1h | ✅ Done |
| PM-API-008 | Create useCreateProject mutation | 1h | ✅ Done |
| PM-API-009 | Create useAddCompetitor mutation | 1h | ✅ Done |
| PM-API-010 | Create useDeleteProject mutation | 1h | ✅ Done |
| PM-API-011 | Create useRemoveCompetitor mutation | 1h | ✅ Done |

**Checklist:**
- [x] **PM-API-001**: Create, update, delete, list projects ✅
- [x] **PM-API-002**: Add, list, remove competitors ✅
- [x] **PM-API-003**: Add, list social channels ✅
- [x] **PM-API-004**: Project, Competitor, SocialChannel types ✅
- [x] **PM-API-005**: useProjects() - list user's projects ✅
- [x] **PM-API-006**: useProject(id) - single project with relations ✅
- [x] **PM-API-007**: useCompetitors(projectId) - list competitors ✅
- [x] **PM-API-008**: useCreateProject() - create with optimistic update ✅
- [x] **PM-API-009**: useAddCompetitor() - add by URL ✅
- [x] **PM-API-010**: useDeleteProject() - with confirmation ✅
- [x] **PM-API-011**: useRemoveCompetitor() - remove from project ✅

**Files Created:**
- `frontend/src/features/projects/api/projects.api.ts` ✅
- `frontend/src/features/projects/api/competitors.api.ts` ✅
- `frontend/src/features/projects/hooks/use-projects.ts` ✅
- `frontend/src/features/projects/hooks/use-project.ts` ✅
- `frontend/src/features/projects/hooks/use-competitors.ts` ✅
- `frontend/src/features/projects/hooks/use-project-mutations.ts` ✅
- `frontend/src/features/projects/types/project.types.ts` ✅

### 4.3 State Management

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-ST-001 | Create project store (current project) | 2h | ✅ Done |
| PM-ST-002 | Store selected project in context | 1h | ✅ Done |
| PM-ST-003 | Sync project selection with URL | 1h | ✅ Done |

**Checklist:**
- [x] **PM-ST-001**: Using existing ui.store.ts for current project context ✅
- [x] **PM-ST-002**: Store currentProjectId, project data in UI store ✅
- [x] **PM-ST-003**: ProjectLayout syncs with route params ✅

**Files Updated:**
- `frontend/src/stores/ui.store.ts` - Already has project state ✅
- `frontend/src/components/layout/ProjectLayout.tsx` - Fetches project data ✅
- `frontend/src/features/projects/hooks/use-project-context.ts` - Outlet context ✅

### 4.4 Components - Projects

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-CMP-001 | Create ProjectCard component | 2h | ✅ Done |
| PM-CMP-002 | Create ProjectsGrid component | 1h | ✅ Done |
| PM-CMP-003 | Create AddProjectModal | 3h | ✅ Done |
| PM-CMP-004 | Create ProjectForm | 2h | ✅ Done |
| PM-CMP-005 | Create ProjectSkeleton | 1h | ✅ Done |
| PM-CMP-006 | Create EmptyProjectsState | 1h | ✅ Done |

**Checklist:**
- [x] **PM-CMP-001**: Card with icon, name, competitor count, last updated ✅
- [x] **PM-CMP-002**: Grid layout with responsive columns ✅
- [x] **PM-CMP-003**: Modal with form for creating project ✅
- [x] **PM-CMP-004**: Form with name, description, category, region ✅
- [x] **PM-CMP-005**: Loading skeleton for project cards ✅
- [x] **PM-CMP-006**: Empty state with CTA to create first project ✅

**Files Created:**
- `frontend/src/features/projects/components/project-card.tsx` ✅
- `frontend/src/features/projects/components/projects-grid.tsx` ✅
- `frontend/src/features/projects/components/add-project-modal.tsx` ✅
- `frontend/src/features/projects/components/project-form.tsx` ✅
- `frontend/src/features/projects/components/project-skeleton.tsx` ✅
- `frontend/src/features/projects/components/empty-projects-state.tsx` ✅

### 4.5 Components - Competitors

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-CMP-007 | Create CompetitorTable component | 3h | ✅ Done |
| PM-CMP-008 | Create CompetitorRow component | 1h | ✅ Done |
| PM-CMP-009 | Create AddCompetitorModal | 3h | ✅ Done |
| PM-CMP-010 | Create AddCompetitorForm | 2h | ✅ Done |
| PM-CMP-011 | Create CompetitorSkeleton | 1h | ⬜ Deferred |
| PM-CMP-012 | Create EmptyCompetitorsState | 1h | ✅ Done |
| PM-CMP-013 | Create RemoveCompetitorDialog | 1h | ✅ Done |

**Checklist:**
- [x] **PM-CMP-007**: Table with columns: Icon, Name, Store, Channels, Actions ✅
- [x] **PM-CMP-008**: Row with competitor data and action buttons ✅
- [x] **PM-CMP-009**: Modal for adding competitor by URL ✅
- [x] **PM-CMP-010**: Form with store URL input and validation ✅
- [ ] **PM-CMP-011**: Loading skeleton for table rows (deferred - using page skeleton)
- [x] **PM-CMP-012**: Empty state with instructions ✅
- [x] **PM-CMP-013**: Inline confirm delete in row actions ✅

**Files Created:**
- `frontend/src/features/projects/components/competitor-table.tsx` ✅
- `frontend/src/features/projects/components/competitor-row.tsx` ✅
- `frontend/src/features/projects/components/add-competitor-modal.tsx` ✅
- `frontend/src/features/projects/components/empty-competitors-state.tsx` ✅
- `frontend/src/features/projects/components/summary-card.tsx` ✅
- `frontend/src/features/projects/components/index.ts` ✅

### 4.6 Components - Social Channels

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-CMP-014 | Create SocialChannelsSection | 2h | ✅ Done (inline in CompetitorRow) |
| PM-CMP-015 | Create SocialChannelBadge | 1h | ✅ Done (getChannelBadge in CompetitorRow) |
| PM-CMP-016 | Create AddSocialChannelForm | 2h | ✅ Done (AddChannelModal in channels feature) |

**Checklist:**
- [x] **PM-CMP-014**: Channels displayed inline in competitor table row ✅
- [x] **PM-CMP-015**: Badge with platform icon and count (getChannelBadge function) ✅
- [x] **PM-CMP-016**: AddChannelModal in channels feature with platform select and URL input ✅

**Files Created:**
- `frontend/src/features/projects/components/competitor-row.tsx` - Contains channel badges ✅
- `frontend/src/features/channels/components/add-channel-modal.tsx` - Channel add form ✅

### 4.6b Components - Internal Project Social Management (PM-31)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-SOC-FE-01 | Create ProjectSocialChannelsPage component | 3h | ⬜ |
| PM-SOC-FE-02 | Create SocialChannelCard component (for grid/list view) | 2h | ⬜ |
| PM-SOC-FE-03 | Create AddProjectSocialChannelModal component | 3h | ⬜ |
| PM-SOC-FE-04 | Create SocialChannelDetailModal component | 4h | ⬜ |
| PM-SOC-FE-05 | Create GrowthTrendsChart component (followers over time) | 3h | ⬜ |
| PM-SOC-FE-06 | Create SocialStatsSummaryCards component (total channels, followers, growth rate) | 2h | ⬜ |
| PM-SOC-FE-07 | Create FilterToggle component (My Channels vs Competitor Channels) | 1h | ⬜ |
| PM-SOC-FE-08 | Create DeleteChannelDialog component (Admin only, with confirmation) | 2h | ⬜ |
| PM-SOC-FE-09 | Create RefreshStatsButton component | 1h | ⬜ |
| PM-SOC-FE-10 | Update SocialChannel TypeScript interface to include `projectId` field | 0.5h | ⬜ |
| PM-SOC-FE-11 | Create useProjectSocialChannels query hook | 1h | ⬜ |
| PM-SOC-FE-12 | Create useAddProjectSocialChannel mutation hook | 1h | ⬜ |
| PM-SOC-FE-13 | Create useDeleteSocialChannel mutation hook (Admin only) | 1h | ⬜ |
| PM-SOC-FE-14 | Create useRefreshSocialChannelStats mutation hook | 1h | ⬜ |
| PM-SOC-FE-15 | Create project social channels API service functions | 2h | ⬜ |
| PM-SOC-FE-16 | Implement permission checks (hide delete button for non-admin users) | 1h | ⬜ |
| PM-SOC-FE-17 | Add route for `/projects/:id/social` page | 0.5h | ⬜ |
| PM-SOC-FE-18 | Add links to VideoAds and VideoOrganic from channel cards (with counts) | 2h | ⬜ |
| PM-SOC-FE-19 | Ensure VideoAds and VideoOrganic pages can filter by project-linked channels (Internal context) | 2h | ⬜ |

**Total Estimated Time:** ~32 hours (~4 days)

### 4.6c Components - Marketing Stats Dashboard (Internal)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-MKT-FE-01 | Update MarketingStatsPage to replace placeholder with executive dashboard | 3h | ⬜ |
| PM-MKT-FE-02 | Create ExecutiveSummaryCards component (total channels, video ads, video organic, followers growth) | 3h | ⬜ |
| PM-MKT-FE-03 | Create SocialChannelsOverviewCard component (with link to Social page) | 2h | ⬜ |
| PM-MKT-FE-04 | Create VideoAdsPerformanceCard component (with link to Video Ads page, filtered to project) | 2h | ⬜ |
| PM-MKT-FE-05 | Create VideoOrganicPerformanceCard component (with link to Video Organic page, filtered to project) | 2h | ⬜ |
| PM-MKT-FE-06 | Create GrowthTrendsCharts component (followers, ads impressions, organic views) | 4h | ⬜ |
| PM-MKT-FE-07 | Create RecentActivityFeed component (latest channels, ads, videos) | 3h | ⬜ |
| PM-MKT-FE-08 | Create API hooks for marketing stats aggregation (counts, sums, growth rates) | 3h | ⬜ |
| PM-MKT-FE-09 | Ensure all queries filter by projectId and project-linked social channels only | 2h | ⬜ |

**Total Estimated Time:** ~24 hours (~3 days)

### 4.7 Components - Landing Pages

> **Note:** Landing Pages implemented as separate feature module at `frontend/src/features/landing-pages/`

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-CMP-017 | Create LandingPageTable component | 3h | ✅ Done |
| PM-CMP-018 | Create LandingPageRow component | 2h | ✅ Done (inline in table) |
| PM-CMP-019 | Create CompetitorFilter dropdown | 1h | ✅ Done |
| PM-CMP-020 | Create RemoveLandingPageDialog | 1h | ✅ Done (inline confirm) |
| PM-CMP-021 | Create EmptyLandingPagesState | 1h | ✅ Done (inline in page) |
| PM-CMP-022 | Create StatusBadge component | 1h | ✅ Done |

**Checklist:**
- [x] **PM-CMP-017**: Table with columns: Competitor, URL, Status, Last Scanned, Actions ✅
- [x] **PM-CMP-018**: Row with competitor icon/name, URL link, status badge ✅
- [x] **PM-CMP-019**: Filter dropdown to show landing pages by competitor ✅
- [x] **PM-CMP-020**: Inline delete confirmation in table actions ✅
- [x] **PM-CMP-021**: Empty state with message when no landing pages ✅
- [x] **PM-CMP-022**: Status badge (ACTIVE/PENDING/FAILED) with colors ✅

**Files Created:**
- `frontend/src/features/landing-pages/components/landing-pages-table.tsx` ✅
- `frontend/src/features/landing-pages/components/landing-pages-filter.tsx` ✅
- `frontend/src/features/landing-pages/components/landing-page-status-badge.tsx` ✅
- `frontend/src/features/landing-pages/components/index.ts` ✅

### 4.8 API Integration - Landing Pages

> **Note:** Landing Pages API implemented in `frontend/src/features/landing-pages/`

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-API-012 | Create landing pages API functions | 1h | ✅ Done |
| PM-API-013 | Create useLandingPages query hook | 1h | ✅ Done |
| PM-API-014 | Create useRemoveLandingPage mutation | 1h | ✅ Done |
| PM-API-015 | Define LandingPage TypeScript types | 0.5h | ✅ Done |

**Checklist:**
- [x] **PM-API-012**: GET /landing-pages with project filter, DELETE /landing-pages/:id ✅
- [x] **PM-API-013**: useLandingPages(projectId) with competitor filter support ✅
- [x] **PM-API-014**: useDeleteLandingPage() with cache invalidation ✅
- [x] **PM-API-015**: LandingPage type with competitor relation ✅

**Files Created:**
- `frontend/src/features/landing-pages/api/landing-pages.api.ts` ✅
- `frontend/src/features/landing-pages/hooks/use-landing-pages.ts` ✅
- `frontend/src/features/landing-pages/types/landing-page.types.ts` ✅

### 4.9 Forms & Validation

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-FRM-001 | Create project form schema (Zod) | 1h | ✅ Done |
| PM-FRM-002 | Create competitor form schema (Zod) | 1h | ✅ Done |
| PM-FRM-003 | Create social channel form schema | 1h | ✅ Done |
| PM-FRM-004 | Implement store URL validation | 2h | ✅ Done |
| PM-FRM-005 | Handle form submissions | 1h | ✅ Done |
| PM-FRM-006 | Add Description field to Project Info form | 1h | ⬜ Pending |
| PM-FRM-007 | Create ASO keyword form schema (Zod) | 1h | ⬜ Pending |

**Checklist:**
- [x] **PM-FRM-001**: name (required), description, category, region ✅
- [x] **PM-FRM-002**: storeUrl (valid App Store/Play Store URL) ✅ (for Competitor, not Project)
- [ ] **PM-FRM-002-PROJECT**: status, iosStoreUrl, androidStoreUrl (for Project) ⬜ Pending
- [x] **PM-FRM-003**: platform (enum), profileUrl ✅
- [x] **PM-FRM-004**: Regex validation for store URLs ✅
- [x] **PM-FRM-005**: Connect forms to mutations ✅
- [ ] **PM-FRM-006**: Description field in Project Info form (textarea, optional) ⬜
- [ ] **PM-FRM-007**: Keyword (required), Platform (iOS/Android/Both) ⬜

**Files Created:**
- `frontend/src/features/projects/schemas/project.schema.ts` ✅
- `frontend/src/features/projects/schemas/competitor.schema.ts` ✅

### 4.10 Pages

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-PG-001 | Create ProjectsListPage | 3h | ✅ Done |
| PM-PG-002 | Create CompetitorsPage | 4h | ✅ Done |
| PM-PG-003 | Create LandingPagesPage | 3h | ✅ Done |
| PM-PG-004 | Create ProjectSettingsPage | 2h | ✅ Done |
| PM-PG-005 | Implement responsive design | 2h | ✅ Done |
| PM-PG-006 | Create ProjectInfoPage with Description field | 3h | ⬜ Pending |
| PM-PG-007 | Create ASODashboardPage | 3h | ⬜ Pending |
| **PM-PG-008** | **Create ProjectSocialPage** | **4h** | **⬜** |
| **PM-PG-009** | **Update MarketingStatsPage** (replace placeholder with executive dashboard) | **5h** | **⬜** |

**Checklist:**
- [x] **PM-PG-001**: Grid of projects with add button, API integration ✅
- [x] **PM-PG-002**: Table of competitors with add/remove actions ✅
- [x] **PM-PG-003**: Landing pages table with competitor filter and status badges ✅
- [x] **PM-PG-004**: Settings form for project configuration (name, description, category, status, store URLs) ✅
- [x] **PM-PG-005**: Mobile-responsive tables and modals ✅
- [ ] **PM-PG-006**: Project Info page with Description field display and edit ⬜
- [ ] **PM-PG-007**: ASO Dashboard page with keywords tracking table ⬜

**Files Created:**
- `frontend/src/features/projects/ProjectsPage.tsx` ✅ (refactored with hooks)
- `frontend/src/features/projects/pages/CompetitorsPage.tsx` ✅
- `frontend/src/features/landing-pages/pages/LandingPagesPage.tsx` ✅
- `frontend/src/features/projects/pages/ProjectSettingsPage.tsx` ✅
- `frontend/src/features/projects/pages/index.ts` ✅

### 4.11 Tests

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-TST-001 | Write ProjectCard tests | 1h | ⬜ |
| PM-TST-002 | Write CompetitorTable tests | 2h | ⬜ |
| PM-TST-003 | Write form validation tests | 1h | ⬜ |
| PM-TST-004 | Write integration tests | 2h | ⬜ |

**Checklist:**
- [ ] **PM-TST-001**: Test card rendering, click navigation
- [ ] **PM-TST-002**: Test table sorting, row actions
- [ ] **PM-TST-003**: Test URL validation patterns
- [ ] **PM-TST-004**: Test complete CRUD flows

---

## 5. Files Created Summary

```
frontend/src/features/projects/
├── index.ts                           ✅
├── api/
│   ├── index.ts                       ✅
│   ├── projects.api.ts                ✅
│   └── competitors.api.ts             ✅
├── hooks/
│   ├── index.ts                       ✅
│   ├── use-projects.ts                ✅
│   ├── use-project.ts                 ✅
│   ├── use-competitors.ts             ✅
│   ├── use-project-mutations.ts       ✅
│   └── use-project-context.ts         ✅
├── components/
│   ├── index.ts                       ✅
│   ├── project-card.tsx               ✅
│   ├── projects-grid.tsx              ✅
│   ├── add-project-modal.tsx          ✅
│   ├── project-form.tsx               ✅
│   ├── project-skeleton.tsx           ✅
│   ├── empty-projects-state.tsx       ✅
│   ├── competitor-table.tsx           ✅
│   ├── competitor-row.tsx             ✅ (includes social channel badges)
│   ├── add-competitor-modal.tsx       ✅
│   ├── summary-card.tsx               ✅
│   └── empty-competitors-state.tsx    ✅
├── pages/
│   ├── index.ts                       ✅
│   ├── ProjectsPage.tsx               ✅
│   ├── CompetitorsPage.tsx            ✅
│   ├── ProjectInfoPage.tsx            ✅
│   └── ProjectSettingsPage.tsx        ✅
├── schemas/
│   ├── project.schema.ts              ✅
│   └── competitor.schema.ts           ✅
└── types/
    └── project.types.ts               ✅

frontend/src/features/landing-pages/   (separate feature module)
├── index.ts                           ✅
├── api/
│   ├── index.ts                       ✅
│   └── landing-pages.api.ts           ✅
├── hooks/
│   ├── index.ts                       ✅
│   └── use-landing-pages.ts           ✅
├── components/
│   ├── index.ts                       ✅
│   ├── landing-pages-table.tsx        ✅
│   ├── landing-pages-filter.tsx       ✅
│   └── landing-page-status-badge.tsx  ✅
├── pages/
│   ├── index.ts                       ✅
│   └── LandingPagesPage.tsx           ✅
└── types/
    ├── index.ts                       ✅
    └── landing-page.types.ts          ✅

frontend/src/features/channels/        (separate feature module)
├── index.ts                           ✅
├── hooks/
│   └── index.ts                       ✅
├── components/
│   ├── index.ts                       ✅
│   ├── channel-table.tsx              ✅
│   ├── channel-filters.tsx            ✅
│   ├── platform-summary-cards.tsx     ✅
│   └── add-channel-modal.tsx          ✅
├── pages/
│   ├── index.ts                       ✅
│   └── ChannelsPage.tsx               ✅
└── types/
    └── index.ts                       ✅

frontend/src/stores/
└── ui.store.ts                        ✅ (combined with UI store)

Tests (deferred to Phase 5):
└── tests/
    ├── project-card.test.tsx          ⬜
    └── competitor-table.test.tsx      ⬜
```

---

## 6. Verification Checklist

After completing all tasks:

- [x] Projects list loads and displays correctly ✅
- [x] Create project modal works ✅
- [x] New project appears in list after creation ✅
- [x] Project card navigates to project dashboard ✅
- [x] Competitors table loads for selected project ✅
- [x] Add competitor by URL works ✅
- [x] URL validation shows appropriate errors ✅
- [x] Remove competitor with confirmation works ✅
- [x] Social channels display on competitor row ✅
- [x] Landing pages table with filters works ✅
- [x] Project settings page with form works ✅
- [x] All forms validate properly ✅
- [x] Loading states display correctly ✅
- [x] Empty states show appropriate messages ✅
- [x] Responsive design verified ✅
- [x] No console errors ✅

---

## 7. Notes & Issues

### Implementation Notes
- Store URL validation uses regex patterns for App Store and Play Store
- Competitor metadata should show icon fetched from store
- Social channels should expand on row click

### URL Validation Patterns

```typescript
// App Store: apps.apple.com/[country]/app/[name]/id[numbers]
const appStorePattern = /apps\.apple\.com\/[\w-]+\/app\/[\w-]+\/id\d+/;

// Play Store: play.google.com/store/apps/details?id=[package]
const playStorePattern = /play\.google\.com\/store\/apps\/details\?id=[\w.]+/;
```

---

## 8. Progress Log

| Date | Tasks Completed | Notes |
|------|-----------------|-------|
| Dec 13, 2024 | PM-RT-*, PM-API-*, PM-FRM-* | API, hooks, schemas, ProjectsPage refactored |
| Dec 13, 2024 | PM-ST-*, PM-CMP-007-013, PM-PG-001,002,004 | State, competitor components, pages |
| Dec 13, 2024 | PM-CMP-001-006 | Project components extracted from ProjectsPage |

---

**Next Step:** After completing Project Management Frontend, proceed to Dashboard Layout implementation.

