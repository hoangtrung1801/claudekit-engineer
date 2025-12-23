# Project Management Backend Implementation Plan

> **Domain:** Project Management
> **Status:** 🟢 Completed (with Project Status feature)
> **Created:** December 13, 2024
> **Last Updated:** December 15, 2024
> **Progress:** 42/54 tasks completed (78%)
> **Priority:** P0 - Critical
> **Phase:** 1 (Foundation)

---

## 1. Overview

This plan covers the backend implementation for **Project Management** domain, including:
- Project CRUD operations
- **Project Status (Pre-Launch/Live) with iOS URL requirement**
- **Project Info Management (SearchAPI crawler integration)**
- Competitor management (add, remove, update)
- Social channel tracking
- Landing page management
- Keywords & settings management

**Reference Documents:**
- Domain Planning: `docs/5.planning-setup/domains/project-management/domain-planning.md`
- Domain TDD: `docs/3.technical-design/domains/project-management/domain-tdd.md`

**Estimated Duration:** 15 days (2-3 weeks)
**Dependencies:** Auth Domain (completed), Database (completed)

---

## 2. Prerequisites

Before starting implementation:

- [x] System Backend completed
- [x] Auth Domain completed
- [x] Database running (PostgreSQL)
- [x] Domain schema in Prisma (Project, Competitor, SocialChannel, etc.)
- [x] Event Emitter configured (for downstream events)

---

## 3. API Endpoints Summary

### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/projects` | Create project | Yes |
| GET | `/api/projects` | List user's projects (admin sees all) | Yes |
| GET | `/api/projects/:id` | Get project details | Yes |
| PATCH | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |
| GET | `/api/projects/:id/info` | Get project info (crawled metadata) | Yes |
| POST | `/api/projects/:id/info/refresh` | Refresh project info from App Store | Yes |

### Competitors

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/projects/:id/competitors` | Add competitor | Yes |
| GET | `/api/projects/:id/competitors` | List competitors | Yes |
| GET | `/api/projects/:id/competitors/:cid` | Get competitor details | Yes |
| DELETE | `/api/projects/:id/competitors/:cid` | Remove competitor | Yes |

### Social Channels

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/projects/:projectId/competitors/:competitorId/social-channels` | Add social channel (competitor-linked) | Yes |
| GET | `/api/projects/:projectId/competitors/:competitorId/social-channels` | List social channels (competitor-linked) | Yes |
| DELETE | `/api/projects/:projectId/competitors/:competitorId/social-channels/:channelId` | Remove channel (competitor-linked) | Yes |
| **POST** | **`/api/projects/:projectId/social-channels`** | **Add social channel to Internal project (project-linked)** | **Yes** |
| **GET** | **`/api/projects/:projectId/social-channels`** | **List all social channels (project-linked + competitor-linked)** | **Yes** |
| **DELETE** | **`/api/projects/:projectId/social-channels/:channelId`** | **Delete social channel (Admin only)** | **Yes** |
| **POST** | **`/api/projects/:projectId/social-channels/:channelId/refresh`** | **Trigger manual social stats refresh** | **Yes** |

### Landing Pages

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/projects/:projectId/competitors/:competitorId/landing-pages` | Add landing page | Yes |
| GET | `/api/projects/:projectId/competitors/:competitorId/landing-pages` | List landing pages | Yes |
| DELETE | `/api/projects/:projectId/competitors/:competitorId/landing-pages/:pageId` | Remove page | Yes |

---

## 4. Implementation Tasks

### 4.1 Module Setup

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-MOD-001 | Create project-management module structure | 1h | ✅ Done |
| PM-MOD-002 | Create project.module.ts | 0.5h | ✅ Done |
| PM-MOD-003 | Register in AppModule | 0.5h | ✅ Done |
| PM-MOD-004 | Setup EventEmitter2 for domain events | 1h | ✅ Done |

**Checklist:**
- [x] **PM-MOD-001**: Create folder structure under `src/modules/projects/` ✅
- [x] **PM-MOD-002**: Create ProjectModule with providers and controllers ✅
- [x] **PM-MOD-003**: Import ProjectModule in app.module.ts ✅
- [x] **PM-MOD-004**: Install and configure @nestjs/event-emitter ✅

**Files Created:**
```
backend/src/modules/projects/
├── projects.module.ts
├── controllers/
│   ├── projects.controller.ts
│   ├── competitors.controller.ts
│   └── project-info.controller.ts ✅ (NEW)
├── services/
├── dto/
└── events/
    └── project.events.ts (updated with ProjectInfoRequestedEvent) ✅
```

### 4.2 DTOs & Validation

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-DTO-001 | Create CreateProjectDto | 1h | ✅ Done |
| PM-DTO-002 | Create UpdateProjectDto | 0.5h | ✅ Done |
| PM-DTO-003 | Create ProjectResponseDto | 0.5h | ✅ Done (inline in service) |
| PM-DTO-004 | Create AddCompetitorDto | 1h | ✅ Done |
| PM-DTO-005 | Create CompetitorResponseDto | 0.5h | ✅ Done (inline in service) |
| PM-DTO-006 | Create AddSocialChannelDto | 1h | ✅ Done |
| PM-DTO-007 | Create AddLandingPageDto | 0.5h | ✅ Done |
| PM-DTO-008 | Create query params DTOs (pagination, filters) | 1h | ✅ Done |
| PM-DTO-009 | Create DTO index exports | 0.5h | ✅ Done |
| PM-DTO-010 | Update CreateProjectDto with status and iOS URL validation | 1h | ✅ Done |

**Checklist:**
- [x] **PM-DTO-001**: CreateProjectDto with name, description, category, region ✅
- [x] **PM-DTO-002**: UpdateProjectDto using PartialType ✅
- [x] **PM-DTO-003**: ProjectResponseDto with computed fields ✅
- [x] **PM-DTO-004**: AddCompetitorDto with storeUrl, name validation ✅
- [x] **PM-DTO-005**: CompetitorResponseDto with metadata ✅
- [x] **PM-DTO-006**: AddSocialChannelDto with platform, profileUrl ✅
- [x] **PM-DTO-007**: AddLandingPageDto with URL validation ✅
- [x] **PM-DTO-008**: ProjectQueryDto for filtering ✅
- [x] **PM-DTO-009**: Create barrel export in `dto/index.ts` ✅

**Files Created:**
- `backend/src/modules/projects/dto/create-project.dto.ts` ✅
- `backend/src/modules/projects/dto/update-project.dto.ts` ✅
- `backend/src/modules/projects/dto/add-competitor.dto.ts` ✅
- `backend/src/modules/projects/dto/add-social-channel.dto.ts` ✅
- `backend/src/modules/projects/dto/add-landing-page.dto.ts` ✅
- `backend/src/modules/projects/dto/project-query.dto.ts` ✅
- `backend/src/modules/projects/dto/index.ts` ✅

### 4.3 Project Service

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-SVC-001 | Create ProjectService | 1h | ✅ Done |
| PM-SVC-002 | Implement create() method | 2h | ✅ Done |
| PM-SVC-003 | Implement findAll() with pagination | 2h | ✅ Done |
| PM-SVC-003A | Update findAll() to support admin role (bypass userId filter) | 1h | ⬜ |
| PM-SVC-003B | Update ProjectsController to pass user role to findAll() | 0.5h | ⬜ |
| PM-SVC-003C | Update findOne() to bypass ownership check for admin | 0.5h | ⬜ |
| PM-SVC-003D | Update update() to bypass ownership check for admin | 0.5h | ⬜ |
| PM-SVC-003E | Update remove() to bypass ownership check for admin | 0.5h | ⬜ |
| PM-SVC-003F | Update validateProjectOwnership() to bypass for admin | 0.5h | ⬜ |
| PM-SVC-003G | Update ProjectsController endpoints to pass user role (findOne, update, remove, keywords) | 1h | ⬜ |
| PM-SVC-004 | Implement findOne() with ownership check | 1h | ✅ Done |
| PM-SVC-005 | Implement update() method | 2h | ✅ Done |
| PM-SVC-006 | Implement delete() (soft delete) | 1h | ✅ Done |
| PM-SVC-007 | Add ownership validation helper | 1h | ✅ Done |
| PM-SVC-008 | Implement ProjectService.create() with ProjectStatus validation | 2h | ✅ Done |
| PM-SVC-009 | Implement ProjectService.update() with status change handling | 2h | ✅ Done |
| PM-SVC-010 | Implement getProjectInfo() method | 1h | ✅ Done |
| PM-SVC-011 | Implement triggerProjectInfoRefresh() method | 1h | ✅ Done |

**Checklist:**
- [x] **PM-SVC-001**: Create `projects.service.ts` with PrismaService injection ✅
- [x] **PM-SVC-002**: `create()` - Create project with userId, return with counts ✅
- [x] **PM-SVC-003**: `findAll()` - Paginated list filtered by userId ✅
- [ ] **PM-SVC-003A**: Update `findAll()` to accept userRole parameter, bypass userId filter if ADMIN ✅
- [ ] **PM-SVC-003B**: Update controller to get user role from `@CurrentUser('role')` and pass to service ⬜
- [x] **PM-SVC-004**: `findOne()` - Get by id with ownership validation ✅
- [x] **PM-SVC-005**: `update()` - Partial update with ownership check ✅
- [x] **PM-SVC-006**: `delete()` - Cascade delete ✅
- [x] **PM-SVC-007**: `validateOwnership()` - Throw ForbiddenException if not owner ✅

**Files Created:**
- `backend/src/modules/projects/services/projects.service.ts` ✅

### 4.4 Competitor Service

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-SVC-008 | Create CompetitorService | 1h | ✅ Done |
| PM-SVC-009 | Implement add() method | 3h | ✅ Done |
| PM-SVC-010 | Implement validateStoreUrl() | 2h | ✅ Done |
| PM-SVC-011 | Implement findAll() by projectId | 1h | ✅ Done |
| PM-SVC-012 | Implement findOne() | 1h | ✅ Done |
| PM-SVC-013 | Implement remove() | 1h | ✅ Done |
| PM-SVC-014 | Emit competitor.added event | 1h | ✅ Done |

**Checklist:**
- [x] **PM-SVC-008**: Create `competitors.service.ts` ✅
- [x] **PM-SVC-009**: `add()` - Validate URL, check duplicates, create record ✅
- [x] **PM-SVC-010**: `validateStoreUrl()` - Regex for App Store / Play Store URLs ✅
- [x] **PM-SVC-011**: `findAll()` - List competitors with social channels count ✅
- [x] **PM-SVC-012**: `findOne()` - Get with all relations ✅
- [x] **PM-SVC-013**: `remove()` - Cascade delete social channels, videos ✅
- [x] **PM-SVC-014**: Emit `competitor.added` for Data Collection domain ✅

**Files Created:**
- `backend/src/modules/projects/services/competitors.service.ts` ✅

### 4.5 Social Channel Service

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-SVC-015 | Create SocialChannelService | 1h | ✅ Done |
| PM-SVC-016 | Implement add() method | 2h | ✅ Done |
| PM-SVC-017 | Implement extractPlatformId() | 3h | ✅ Done |
| PM-SVC-018 | Implement getByCompetitor() | 1h | ✅ Done |
| PM-SVC-019 | Implement remove() | 1h | ✅ Done |
| PM-SVC-020 | Emit social-channel.added event | 1h | ✅ Done |

#### 4.5.1 Refactor Social Channel Model & DTOs (Advertiser-Centric)

> **Goal:** Align Project Management domain with updated schema for `SocialChannel` (optional `competitorId`, `advertiserId`, `displayName` required on manual add, `discoverySource` tracking).

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-SVC-021 | Update Prisma schema & generated types alignment for optional `competitorId` and new `advertiserId`/`discoverySource` fields (no business logic change here) | 1h | ⬜ |
| PM-SVC-022 | Update `AddSocialChannelDto` to require `displayName` and accept optional `advertiserId` | 1h | ⬜ |
| PM-SVC-023 | Update `SocialChannelService.addSocialChannel()` to set `displayName`, `advertiserId`, and `discoverySource = MANUAL` based on DTO | 2h | ⬜ |
| PM-SVC-024 | Review existing usages of SocialChannel to ensure they handle nullable `competitorId` safely | 2h | ⬜ |

**Checklist:**
- [x] **PM-SVC-015**: Create `social-channels.service.ts` ✅
- [x] **PM-SVC-016**: `add()` - Extract platform ID, check duplicates, create ✅
- [x] **PM-SVC-017**: `extractPlatformId()` - Parse TikTok, YouTube, Instagram, Facebook, X URLs ✅
- [x] **PM-SVC-018**: `getByCompetitor()` - List with latest snapshot ✅
- [x] **PM-SVC-019**: `remove()` - Delete channel and related data ✅
- [x] **PM-SVC-020**: Emit `social-channel.added` for Data Collection domain ✅

**Files Created:**
- `backend/src/modules/projects/services/social-channels.service.ts` ✅

#### 4.5.2 Internal Project Social Management (PM-30)

> **Context (Dec 2025):** Marketing teams need to manage their own social channels directly within Internal projects (not linked to competitors). Users can add channels, but only Admins can delete them.

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-SOC-INT-01 | Update database schema: Add `projectId` field to `SocialChannel` model with relation to `Project` | 2h | ⬜ |
| PM-SOC-INT-02 | Create migration script to add `projectId` and indexes to `SocialChannel` table | 1h | ⬜ |
| PM-SOC-INT-03 | Update `SocialChannelService.addProjectSocialChannel()` method to create project-linked channels | 3h | ⬜ |
| PM-SOC-INT-04 | Update `SocialChannelService.getProjectSocialChannels()` to return both project-linked and competitor-linked channels | 2h | ⬜ |
| PM-SOC-INT-05 | Implement `SocialChannelService.deleteSocialChannel()` with Admin-only permission check | 2h | ⬜ |
| PM-SOC-INT-06 | Implement `SocialChannelService.refreshSocialChannelStats()` to trigger manual crawl | 1h | ⬜ |
| PM-SOC-INT-07 | Add API endpoints in `ProjectsController` for project-level social channel management | 2h | ⬜ |
| PM-SOC-INT-08 | Update `social-channel.added` event to include `projectId` when channel is project-linked | 1h | ⬜ |
| PM-SOC-INT-09 | Ensure Data Collection `SocialChannelProcessor` handles both competitor-linked and project-linked channels | 2h | ⬜ |
| PM-SOC-INT-10 | Add validation to ensure `competitorId` and `projectId` are mutually exclusive | 1h | ⬜ |
| PM-SOC-INT-11 | Ensure AdsLibraryProcessor handles project-linked social channels (creates VideoAds for project's channels) | 2h | ⬜ |
| PM-SOC-INT-12 | Ensure SocialContentProcessor handles project-linked social channels (creates VideoOrganic for project's channels) | 2h | ⬜ |
| PM-SOC-INT-13 | Create API endpoint for marketing stats aggregation (GET /projects/:id/marketing/stats) | 3h | ⬜ |
| PM-SOC-INT-14 | Implement marketing stats service methods (counts, sums, growth rates for project-linked channels only) | 4h | ⬜ |
| PM-SOC-INT-15 | **CRITICAL FIX**: Pass `source` parameter in `videos.controller.ts` to `VideoAdsService.findByProject()` | 0.5h | ⬜ |
| PM-SOC-INT-16 | **CRITICAL FIX**: Pass `source` parameter in `videos.controller.ts` to `VideosService.findByProject()` | 0.5h | ⬜ |
| PM-SOC-INT-17 | **CRITICAL FIX**: Fix MIXED channel data (decide Internal vs External, update database) | 1h | ⬜ |
| PM-SOC-INT-18 | **CRITICAL FIX**: Add validation in `SocialChannelService` to prevent MIXED channels (both projectId and competitorId set) | 1h | ⬜ |

**Total Estimated Time:** ~33 hours (~4.125 days)

> [!WARNING]
> **Critical Bugs Found (Dec 2025)**:
> - Controller bug: `source` parameter not passed to service (PM-SOC-INT-15, PM-SOC-INT-16)
> - Data integrity: MIXED channels violate business constraint (PM-SOC-INT-17, PM-SOC-INT-18)
> - **See**: `docs/prompt-for-claude-code/critical-bug-fix-source-parameter.md` for details
> - **Priority**: P0 - Must fix immediately

### 4.6 Landing Page & Keywords Services

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-SVC-021 | Create LandingPageService | 1h | ✅ Done |
| PM-SVC-022 | Implement add landing page | 1h | ✅ Done |
| PM-SVC-023 | Emit landing-page.added event | 0.5h | ✅ Done |
| PM-SVC-024 | Create KeywordService | 1h | ✅ Done |
| PM-SVC-025 | Implement keyword CRUD | 2h | ✅ Done |

**Checklist:**
- [x] **PM-SVC-021**: Create `landing-pages.service.ts` ✅
- [x] **PM-SVC-022**: `add()` - URL validation, create record ✅
- [x] **PM-SVC-023**: Emit `landing-page.added` for social discovery ✅
- [x] **PM-SVC-024**: Create `keywords.service.ts` ✅
- [x] **PM-SVC-025**: Implement add, list, remove keywords for project ✅

**Files Created:**
- `backend/src/modules/projects/services/landing-pages.service.ts` ✅
- `backend/src/modules/projects/services/keywords.service.ts` ✅

### 4.7 Controllers

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-CTL-001 | Create ProjectsController | 2h | ✅ Done |
| PM-CTL-002 | Implement POST /projects | 1h | ✅ Done |
| PM-CTL-003 | Implement GET /projects | 1h | ✅ Done |
| PM-CTL-004 | Implement GET /projects/:id | 0.5h | ✅ Done |
| PM-CTL-005 | Implement PATCH /projects/:id | 1h | ✅ Done |
| PM-CTL-006 | Implement DELETE /projects/:id | 0.5h | ✅ Done |
| PM-CTL-007 | Create CompetitorsController | 2h | ✅ Done |
| PM-CTL-008 | Implement competitor endpoints | 2h | ✅ Done |
| PM-CTL-009 | Implement social channel endpoints | 1h | ✅ Done |
| PM-CTL-010 | Implement landing page endpoints | 1h | ✅ Done |
| PM-CTL-011 | Add Swagger documentation | 2h | ✅ Done |
| PM-CTL-012 | Create ProjectInfoController | 1h | ✅ Done |
| PM-CTL-013 | Implement GET /projects/:id/info endpoint | 0.5h | ✅ Done |
| PM-CTL-014 | Implement POST /projects/:id/info/refresh endpoint | 0.5h | ✅ Done |

**Checklist:**
- [x] **PM-CTL-001**: Create `projects.controller.ts` with @ApiTags('Projects') ✅
- [x] **PM-CTL-002**: POST `/projects` - Create project (protected) ✅
- [x] **PM-CTL-003**: GET `/projects` - List with pagination (protected) ✅
- [x] **PM-CTL-004**: GET `/projects/:id` - Get with relations (protected) ✅
- [x] **PM-CTL-005**: PATCH `/projects/:id` - Partial update (protected) ✅
- [x] **PM-CTL-006**: DELETE `/projects/:id` - Delete (protected) ✅
- [x] **PM-CTL-007**: Create `competitors.controller.ts` ✅
- [x] **PM-CTL-008**: POST/GET/DELETE competitor endpoints ✅
- [x] **PM-CTL-009**: POST/GET/DELETE social channel endpoints ✅
- [x] **PM-CTL-010**: POST/GET/DELETE landing page endpoints ✅
- [x] **PM-CTL-011**: Add @ApiOperation, @ApiResponse for all endpoints ✅

**Files Created:**
- `backend/src/modules/projects/controllers/projects.controller.ts` ✅
- `backend/src/modules/projects/controllers/competitors.controller.ts` ✅

### 4.8 Guards & Ownership

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-GRD-001 | Apply JwtAuthGuard to all routes | 1h | ✅ Done |
| PM-GRD-002 | Create ProjectOwnerGuard | 2h | ✅ Done (via service method) |
| PM-GRD-003 | Apply ownership validation | 1h | ✅ Done |

**Checklist:**
- [x] **PM-GRD-001**: Apply @UseGuards(JwtAuthGuard) at controller level ✅
- [x] **PM-GRD-002**: Ownership validation via `validateProjectOwnership()` in service ✅
- [x] **PM-GRD-003**: Apply validation before each operation ✅

**Implementation Note:** Instead of a separate guard, ownership validation is handled via service methods for better flexibility and error handling.

### 4.9 Events

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-EVT-001 | Define event types | 1h | ✅ Done |
| PM-EVT-002 | Create event emitters in services | 1h | ✅ Done |
| PM-EVT-003 | Define ProjectInfoRequestedEvent | 0.5h | ✅ Done |
| PM-EVT-004 | Emit project-info.requested event in ProjectService | 1h | ✅ Done |

**Checklist:**
- [x] **PM-EVT-001**: Define `competitor.added`, `social-channel.added`, `landing-page.added` event types ✅
- [x] **PM-EVT-002**: Emit events from services using EventEmitter2 ✅

**Files Created:**
- `backend/src/modules/projects/events/project.events.ts` ✅

### 4.10 Tests

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-TST-001 | Write ProjectService unit tests | 3h | ⬜ Deferred to Phase 4 |
| PM-TST-002 | Write CompetitorService unit tests | 3h | ⬜ Deferred to Phase 4 |
| PM-TST-003 | Write URL validation tests | 2h | ⬜ Deferred to Phase 4 |
| PM-TST-004 | Write E2E tests | 4h | ⬜ Deferred to Phase 4 |

**Checklist:**
- [ ] **PM-TST-001**: Tests for project CRUD
- [ ] **PM-TST-002**: Tests for competitor add/remove
- [ ] **PM-TST-003**: Tests for store URL and social URL parsing
- [ ] **PM-TST-004**: E2E tests for complete flows

---

## 5. Files Created Summary

```
backend/src/modules/projects/
├── projects.module.ts                    ✅
├── controllers/
│   ├── projects.controller.ts            ✅
│   └── competitors.controller.ts         ✅
├── services/
│   ├── projects.service.ts               ✅
│   ├── competitors.service.ts            ✅
│   ├── social-channels.service.ts        ✅
│   ├── landing-pages.service.ts          ✅
│   └── keywords.service.ts               ✅
├── dto/
│   ├── index.ts                          ✅
│   ├── create-project.dto.ts             ✅
│   ├── update-project.dto.ts             ✅
│   ├── add-competitor.dto.ts             ✅
│   ├── add-social-channel.dto.ts         ✅
│   ├── add-landing-page.dto.ts           ✅
│   └── project-query.dto.ts              ✅
├── events/
│   └── project.events.ts                 ✅
└── tests/
    ├── projects.service.spec.ts          ⬜ (Phase 4)
    ├── competitors.service.spec.ts       ⬜ (Phase 4)
    └── projects.e2e-spec.ts              ⬜ (Phase 4)
```

---

## 6. Verification Checklist

After completing all tasks:

- [x] ProjectModule registered in AppModule ✅
- [x] All API endpoints working (test with Swagger) ✅
- [x] Project ownership validation working ✅
- [x] Competitor add by URL working ✅
- [x] Social channel URL parsing working ✅
- [x] Events emitting correctly ✅
- [x] Pagination working for lists ✅
- [x] Swagger documentation complete ✅
- [ ] Unit tests passing (deferred)
- [ ] E2E tests passing (deferred)
- [x] No TypeScript errors ✅
- [x] Project Status (Pre-Launch/Live) working ✅
- [x] iOS URL validation for Live projects working ✅
- [x] Project Info endpoints working ✅
- [x] ProjectInfoRequestedEvent emitting correctly ✅
- [ ] Data Collection module listener for project-info.requested (pending integration)

---

## 7. Notes & Issues

### Implementation Notes
- URL validation patterns for App Store: `apps.apple.com/*/app/*/id*`
- URL validation patterns for Play Store: `play.google.com/store/apps/details?id=*`
- Social platform ID extraction uses regex patterns for TikTok, YouTube, Instagram, Facebook, X
- Events trigger Data Collection domain crawlers (Phase 2)
- Ownership validation implemented via service methods instead of guard for better error messages

### URL Patterns Implemented

**Store URLs:**
```typescript
const storePatterns = {
  appStore: /apps\.apple\.com\/([\w-]+)\/app\/[\w-]+\/id(\d+)/,
  playStore: /play\.google\.com\/store\/apps\/details\?id=([\w.]+)/
};
```

**Social URLs:**
```typescript
const socialPatterns = {
  TIKTOK: /tiktok\.com\/@?([^\/\?]+)/i,
  YOUTUBE: /youtube\.com\/(?:channel\/|@|c\/)?([^\/\?]+)/i,
  INSTAGRAM: /instagram\.com\/([^\/\?]+)/i,
  FACEBOOK: /facebook\.com\/([^\/\?]+)/i,
  X: /(?:twitter|x)\.com\/([^\/\?]+)/i
};
```

---

## 8. Progress Log

| Date | Tasks Completed | Notes |
|------|-----------------|-------|
| Dec 13, 2024 | PM-MOD-001 to PM-EVT-002 | Full implementation (34/38 tasks) |
| Dec 15, 2024 | PM-DTO-010, PM-SVC-008-011, PM-CTL-012-014, PM-EVT-003-004 | Project Status & Project Info feature (8 new tasks) |

---

## 9. API Testing with cURL

### Create Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "My App Analysis", "description": "Tracking fitness apps", "category": "Health & Fitness"}'
```

### List Projects
```bash
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>"
```

### Add Competitor
```bash
curl -X POST http://localhost:3000/api/projects/<projectId>/competitors \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"storeUrl": "https://apps.apple.com/us/app/competitor/id123456789"}'
```

### Add Social Channel
```bash
curl -X POST http://localhost:3000/api/projects/<projectId>/competitors/<competitorId>/social-channels \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"platform": "TIKTOK", "profileUrl": "https://www.tiktok.com/@competitor"}'
```

---

**Next Step:** Proceed to Dashboard Backend Implementation Plan or System Frontend Implementation Plan.
