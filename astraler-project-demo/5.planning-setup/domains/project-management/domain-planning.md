# Domain Planning: Project Management

> **Reference:** [System Planning](../../system-planning.md)  
> **Phase:** 1 (Foundation)  
> **Priority:** P0 - Critical

---

## 1. Domain Overview

### 1.1 Domain Name & Scope

**Project Management Domain** manages the lifecycle of analysis projects, competitors, and configuration.

**Scope:**
- Project CRUD operations
- Competitor management (add, remove, update)
- Social channel tracking
- Landing page management
- Keywords & Watchlists management
- Project settings & configuration

**Out of Scope:**
- Data crawling (Data Collection Domain)
- AI Analysis (AI Analysis Domain)
- Notifications (Alerts Domain)

### 1.2 Domain Objectives

| Objective | Success Criteria |
|-----------|------------------|
| Project isolation | Data does not leak between projects |
| Competitor tracking | Max 50 competitors per project |
| Easy onboarding | Add competitor by URL in < 3 clicks |
| Configuration control | Enable/disable tracking modules |

### 1.3 Domain Context

**Dependencies:**
- **From Auth Domain:** User authentication, RBAC
- **To Data Collection:** Trigger crawls when adding competitor
- **To AI Analysis:** Trigger market landscape on first competitors

**Integration Points:**
- Frontend: Projects List, Competitors Management, Settings
- Events: `competitor.added`, `landing-page.added`, `social-channel.added`

---

## 2. Features Breakdown

### 2.1 Feature List

| Feature ID | Feature Name | Priority | Complexity | Est. Points |
|------------|--------------|----------|------------|-------------|
| PM-01 | Create Project | P0 | Low | 3 |
| PM-02 | List Projects | P0 | Low | 2 |
| PM-02A | Admin View All Projects | P1 | Low | 2 |
| PM-03 | Update Project | P1 | Low | 2 |
| PM-04 | Delete Project | P1 | Low | 2 |
| PM-05 | Add Competitor by URL | P0 | Medium | 5 |
| PM-06 | Validate Store URL | P0 | Medium | 3 |
| PM-07 | Fetch Competitor Metadata | P1 | Medium | 5 |
| PM-08 | List Competitors | P0 | Low | 2 |
| PM-09 | Remove Competitor | P1 | Low | 2 |
| PM-10 | Add Social Channel (Competitor) | P1 | Medium | 5 |
| PM-11 | Extract Platform ID from URL | P1 | Medium | 3 |
| **PM-30** | **Internal Project Social Management - Backend** | **P1** | **High** | **13** |
| **PM-31** | **Internal Project Social Management - Frontend** | **P1** | **High** | **13** |
| PM-12 | Add Landing Page | P2 | Low | 2 |
| PM-13 | View Landing Pages (List Page) | P1 | Medium | 5 |
| PM-14 | Manage Keywords | P2 | Low | 3 |
| PM-15 | Project Settings | P2 | Low | 3 |
| PM-16 | Frontend Projects List | P0 | Medium | 5 |
| PM-17 | Frontend Add Project Modal | P0 | Low | 3 |
| PM-18 | Frontend Competitors Table | P0 | Medium | 5 |
| PM-19 | Frontend Add Competitor Modal | P0 | Medium | 5 |
| PM-20 | Frontend Landing Pages Page | P1 | Medium | 5 |
| PM-21 | Project Status (Pre-Launch/Live) | P0 | Medium | 5 |
| PM-22 | iOS URL Validation for Live Projects | P0 | Medium | 3 |
| PM-23 | Project Info Crawler (SearchAPI) | P0 | High | 8 |
| PM-24 | Project Info API Endpoints | P0 | Low | 3 |
| PM-25 | Frontend Project Status Selection | P0 | Low | 2 |
| PM-26 | Frontend Project Info Page | P1 | Medium | 5 |
| **PM-27** | **Keyword Spy - Backend API** | **P1** | **Medium** | **8** |
| **PM-28** | **Keyword Spy - Frontend UI** | **P1** | **Medium** | **8** |
| ~~**PM-29**~~ | ~~**Project Ads Curation UI (User)**~~ | ~~**P1**~~ | ~~**Medium**~~ | ~~**8**~~ | 🔴 **DEPRECATED** (Dec 2024) |
| **Total** | | | | **99 points** (107 - 8 deprecated) |

### 2.2 Feature Dependencies

```
PM-01 (Create Project) ──▶ PM-05 (Add Competitor) ──▶ PM-10 (Add Social)
         │                         │                         │
         ▼                         ▼                         ▼
    PM-02 (List)              PM-06 (Validate)         PM-11 (Extract ID)
         │                         │
         ▼                         ▼
    PM-15 (FE List)           PM-07 (Fetch Meta)
         │                         │
         ▼                         ▼
    PM-16 (FE Modal)          PM-17 (FE Table) ──▶ PM-18 (FE Add Modal)
```

### 2.3 Feature Estimates

| Category | Story Points |
|----------|--------------|
| Project CRUD (Backend) | 9 pts |
| Competitor Management (Backend) | 17 pts |
| Social/Landing (Backend) | 10 pts |
| Keywords/Settings (Backend) | 6 pts |
| Frontend Pages | 18 pts |
| **Total** | **60 pts** |

---

## 3. Tasks Breakdown

### 3.1 Backend Tasks

#### Project CRUD
- [x] **PM-B01**: Create ProjectModule structure - 1h ✅ Done
- [x] **PM-B02**: Define CreateProjectDto (name, category, description, status, iosStoreUrl) - 1h ✅ Done
- [x] **PM-B03**: Add ProjectStatus enum to Prisma schema - 0.5h ✅ Done
- [x] **PM-B04**: Add status, iosStoreUrl, androidStoreUrl fields to Project model - 0.5h ✅ Done
- [x] **PM-B05**: Implement ProjectService.create() with status validation - 2h ✅ Done
- [x] **PM-B06**: Implement iOS URL validation for Live projects - 2h ✅ Done
- [x] **PM-B07**: Implement ProjectService.findAll(userId) - 1h ✅ Done
- [ ] **PM-B07A**: Update ProjectService.findAll() to support admin role (bypass userId filter) - 1h
- [ ] **PM-B07B**: Update ProjectsController to pass user role to service - 0.5h
- [ ] **PM-B07C**: Update ProjectService.findOne() to bypass ownership check for admin - 0.5h
- [ ] **PM-B07D**: Update ProjectService.update() to bypass ownership check for admin - 0.5h
- [ ] **PM-B07E**: Update ProjectService.remove() to bypass ownership check for admin - 0.5h
- [ ] **PM-B07F**: Update ProjectService.validateProjectOwnership() to bypass for admin - 0.5h
- [ ] **PM-B07G**: Update ProjectsController endpoints to pass user role (findOne, update, remove, keywords) - 1h
- [x] **PM-B08**: Implement ProjectService.findOne(id) - 1h ✅ Done
- [x] **PM-B09**: Implement ProjectService.update() with status change handling - 2h ✅ Done
- [x] **PM-B10**: Implement ProjectService.delete() - 1h ✅ Done
- [x] **PM-B11**: Create ProjectController with all endpoints - 2h ✅ Done
- [x] **PM-B12**: Add ownership validation (user can only access own projects) - 2h ✅ Done

#### Competitor Management
- [ ] **PM-B10**: Create CompetitorModule structure - 1h
- [ ] **PM-B11**: Define AddCompetitorDto (storeUrl, name) - 1h
- [ ] **PM-B12**: Implement URL validation (App Store/Play Store patterns) - 2h
- [ ] **PM-B13**: Implement CompetitorService.add() - 3h
- [ ] **PM-B14**: Implement metadata fetch from store (basic) - 4h
- [ ] **PM-B15**: Implement CompetitorService.findAll(projectId) - 1h
- [ ] **PM-B16**: Implement CompetitorService.remove() - 1h
- [ ] **PM-B17**: Create CompetitorController - 2h
- [ ] **PM-B18**: Emit `competitor.added` event for downstream - 1h

#### Social Channel Management
- [ ] **PM-B19**: Define AddSocialChannelDto - 1h
- [ ] **PM-B20**: Implement platform ID extraction from URL - 3h
- [ ] **PM-B21**: Implement SocialChannelService.add() - 2h
- [ ] **PM-B22**: Implement SocialChannelService.getByCompetitor() - 1h
- [ ] **PM-B23**: Emit `social-channel.added` event - 1h

#### Landing Page
- [ ] **PM-B24**: Define AddLandingPageDto - 0.5h
- [ ] **PM-B25**: Implement LandingPageService.add() - 1h
- [ ] **PM-B26**: Emit `landing-page.added` event - 0.5h
- [ ] **PM-B29**: Implement getLandingPages(competitorId) - 1h
- [ ] **PM-B30**: Implement getProjectLandingPages(projectId) - 1h
- [ ] **PM-B31**: Implement removeLandingPage(landingPageId) - 0.5h
- [ ] **PM-B32**: Create LandingPageController with GET endpoints - 1h

#### Keywords & Settings
- [ ] **PM-B27**: Implement KeywordService (add, list, remove) - 2h
- [ ] **PM-B28**: Implement project settings update - 2h

#### ASO Management (Backend)
- [ ] **PM-B33**: Create ASOController with GET /projects/:id/aso/keywords endpoint - 1h ⬜ Pending
- [ ] **PM-B34**: Create POST /projects/:id/aso/keywords endpoint - 1h ⬜ Pending
- [ ] **PM-B35**: Create DELETE /projects/:id/aso/keywords/:keywordId endpoint - 0.5h ⬜ Pending
- [ ] **PM-B36**: Extend KeywordService to support platform (iOS/Android/Both) - 1h ⬜ Pending

#### Project Info Management
- [x] **PM-B29**: Emit project-info.requested event when Live project created/updated - 1h ✅ Done
- [x] **PM-B30**: Create ProjectInfoController with GET /projects/:id/info endpoint - 1h ✅ Done
- [x] **PM-B31**: Create POST /projects/:id/info/refresh endpoint - 1h ✅ Done
- [ ] **PM-B32**: Integrate with Data Collection module for Project Info crawling - 2h ⬜ Pending (Data Collection listener)

### 3.2 Frontend Tasks

#### Projects List Page
- [x] **PM-F01**: Create ProjectsPage layout - 2h ✅ Done
- [x] **PM-F02**: Create ProjectCard component - 2h ✅ Done
- [x] **PM-F03**: Implement useProjects() hook with TanStack Query - 2h ✅ Done
- [x] **PM-F04**: Create AddProjectModal component - 2h ✅ Done
- [ ] **PM-F05**: Add Project Status selection (Pre-Launch/Live) to form - 1h ⬜ Pending
- [ ] **PM-F06**: Add iOS Store URL field with conditional validation (required if Live) - 2h ⬜ Pending
- [x] **PM-F07**: Implement project creation form - 2h ✅ Done (basic form, missing status/URL fields)
- [x] **PM-F08**: Add project selection/navigation - 1h ✅ Done

#### Competitors Management Page
- [ ] **PM-F07**: Create CompetitorsPage layout - 2h
- [ ] **PM-F08**: Create CompetitorTable component - 3h
- [ ] **PM-F09**: Implement useCompetitors() hook - 2h
- [ ] **PM-F10**: Create AddCompetitorModal - 2h
- [ ] **PM-F11**: Implement competitor add form with URL validation - 2h
- [ ] **PM-F12**: Add remove competitor action - 1h
- [ ] **PM-F13**: Display competitor metadata (icon, name, ratings) - 2h

#### Social Channels (Nested in Competitors)
- [ ] **PM-F14**: Create SocialChannelsSection component - 2h
- [ ] **PM-F15**: Create AddSocialChannelForm - 1h

#### Landing Pages Page
- [ ] **PM-F16**: Create LandingPagesPage layout - 2h
- [ ] **PM-F17**: Create LandingPageTable component - 3h
- [ ] **PM-F18**: Create LandingPageRow component (with competitor info) - 2h
- [ ] **PM-F19**: Implement useLandingPages() hook - 1h
- [ ] **PM-F20**: Create CompetitorFilter dropdown - 1h
- [ ] **PM-F21**: Create RemoveLandingPageDialog - 1h
- [ ] **PM-F22**: Create EmptyLandingPagesState - 1h

#### Project Info Page
- [ ] **PM-F23**: Create ProjectInfoPage layout - 2h ⬜ Pending
- [ ] **PM-F24**: Create ProjectInfoCard component (display crawled metadata) - 3h ⬜ Pending
- [ ] **PM-F25**: Implement useProjectInfo() hook - 1h ⬜ Pending
- [ ] **PM-F26**: Add "Refresh from Store" button - 1h ⬜ Pending
- [ ] **PM-F27**: Display project screenshots, updates, ratings - 2h ⬜ Pending
- [ ] **PM-F28**: Add Description field to Project Info form - 1h ⬜ Pending

#### ASO Dashboard Page
- [ ] **PM-F29**: Create ASODashboardPage layout - 2h ⬜ Pending
- [ ] **PM-F30**: Create KeywordsTrackingTable component - 3h ⬜ Pending
- [ ] **PM-F31**: Create AddKeywordForm component - 2h ⬜ Pending
- [ ] **PM-F32**: Implement useKeywords() hook - 1h ⬜ Pending
- [ ] **PM-F33**: Implement useAddKeyword() mutation - 1h ⬜ Pending
- [ ] **PM-F34**: Create KeywordRow component with rank/change indicators - 2h ⬜ Pending
- [ ] **PM-F35**: Create StorePresencePlaceholder component - 1h ⬜ Pending

#### Project Ads Curation (User-Facing `/projects/:projectId/ads`)

> ⚠️ **DEPRECATED**: This feature has been **REMOVED** as of December 2024.  
> **Reason:** Video Ads Refactoring - Ads Curation workflow replaced by direct VideoAds creation  
> **Alternative:** Video Ads are now browsed via Videos page with `type=AD` filter  
> **Reference:** `docs/7.implementation/domains/data-collection/video-ads-refactoring-plan.md`

- [x] ~~**PM-F36**: Design UX for Project Ads Curation page, including tabs (Pending/Approved/Added), filters, and pagination controls.~~ 🔴 **CANCELLED**
- [x] ~~**PM-F37**: Define Ad Detail Modal layout for user-facing ads (preview, copy, metrics, actions).~~ 🔴 **CANCELLED**
- [x] ~~**PM-F38**:~~ 🔴 **CANCELLED** Specify behavior and copy for “Watch Video” action (open video in new tab when video URL is available).
- [x] ~~**PM-F39**: Specify behavior and copy for advertiser **Profile hyperlink**:~~ 🔴 **CANCELLED**
    - ~~Use profile URL/URI when available.~~
    - ~~Open in new tab.~~
    - ~~Omit the link when no valid profile URL is present.~~

### 3.3 Testing Tasks
- [ ] **PM-T01**: Unit tests for ProjectService - 2h
- [ ] **PM-T02**: Unit tests for CompetitorService - 2h
- [ ] **PM-T03**: Unit tests for URL validation - 1h
- [ ] **PM-T04**: E2E tests for project flow - 3h

---

## 4. Timeline & Sprints

### 4.1 Sprint Breakdown

**Sprint 2 (Week 5-6): Projects & Competitors Core**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | PM-B01 to PM-B09 | Project CRUD APIs |
| Day 3-4 | PM-B10 to PM-B18 | Competitor CRUD APIs |
| Day 5-6 | PM-F01 to PM-F06 | Projects List UI |
| Day 7-8 | PM-F07 to PM-F13 | Competitors Management UI |
| Day 9-10 | PM-B19 to PM-B26, Tests | Social Channels & Landing Pages |

**Sprint 3 (Week 7-8): Extended Features (Parallel with Dashboard)**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | PM-B27 to PM-B28 | Keywords & Settings |
| Day 3-4 | PM-F14 to PM-F15 | Social Channels UI |
| Day 5-6 | PM-T01 to PM-T04 | Testing complete |

### 4.2 Timeline Estimate

| Milestone | Duration | Week |
|-----------|----------|------|
| Project CRUD Complete | 4 days | Week 5 |
| Competitor Management Complete | 4 days | Week 5-6 |
| Frontend Integration | 4 days | Week 6-7 |
| Social/Keywords/Tests | 3 days | Week 7 |
| **Total** | **15 days** | **Week 5-7** |

### 4.3 Milestones

1. **M1: Projects API Ready** - Create/List/Update/Delete projects
2. **M2: Competitors Tracking** - Add competitors by URL, fetch metadata
3. **M3: Full UI Integration** - Projects list, Competitors table functional
4. **M4: Events Emitting** - Downstream domains can react

---

## 5. Resource Allocation

### 5.1 Team Assignment

| Role | Allocation | Tasks |
|------|------------|-------|
| Backend Developer | 60% | PM-B01 to PM-B28 |
| Frontend Developer | 40% | PM-F01 to PM-F15 |

### 5.2 Capacity Planning

- Backend: ~42 hours
- Frontend: ~28 hours
- Testing: ~8 hours
- **Total: ~78 hours (2 weeks)**

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies
- App Store/Play Store metadata fetch (may use simple scraping or Apify)

### 6.2 Internal Dependencies
- Auth Domain must be complete
- Database schema must be finalized

### 6.3 Blockers
| Blocker | Mitigation |
|---------|------------|
| Store metadata fetch fails | Allow manual entry as fallback |
| Auth not ready | Use mock auth for development |

---

## 7. Risk Assessment

### 7.1 Domain-Specific Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Store URL patterns change | Low | Medium | Abstract URL parser, easy to update |
| Metadata fetch rate-limited | Medium | Low | Implement caching, fallback to manual |
| 50 competitor limit issues | Low | Low | Soft limit with warning |

---

## 8. Definition of Done

### 8.1 Feature Completion Criteria

- [ ] User can create projects with name/category
- [ ] User can view list of their projects
- [ ] User can add competitors by store URL
- [ ] Competitor metadata (icon, name) displayed
- [ ] User can remove competitors
- [ ] Events emitted for downstream processing
- [ ] UI responsive on all devices

### 8.2 Quality Gates

- [ ] All unit tests passing
- [ ] E2E tests for main flows
- [ ] Code reviewed
- [ ] No console errors in UI

---

## 9. API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create project |
| GET | `/projects` | List user's projects (admin sees all projects) |
| GET | `/projects/:id` | Get project details |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST | `/projects/:id/competitors` | Add competitor |
| GET | `/projects/:id/competitors` | List competitors |
| DELETE | `/projects/:id/competitors/:cid` | Remove competitor |
| POST | `/competitors/:id/social-channels` | Add social channel |
| GET | `/competitors/:id/social-channels` | List social channels |
| POST | `/competitors/:id/landing-pages` | Add landing page |
| GET | `/competitors/:id/landing-pages` | List competitor landing pages |
| GET | `/projects/:id/landing-pages` | List all project landing pages |
| DELETE | `/landing-pages/:id` | Remove landing page |

---

**Next Step:** Proceed to Dashboard Domain Planning or start implementation.

