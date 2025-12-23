# Admin Backend Implementation Plan

> **Domain:** Admin  
> **Status:** 🟢 Completed  
> **Created:** December 13, 2024  
> **Last Updated:** December 14, 2024  
> **Progress:** 72/72 tasks completed  
> **Priority:** P3 - Low  
> **Phase:** 4 (Polish & Scale)

---

## 1. Overview

This plan covers the backend implementation for **Admin** domain, including:
- User management (list, create, update role, deactivate)
- Project management (list all projects, view details, trigger info refresh)
- Background task management (list jobs, view details, retry failed jobs)
- API key management
- Cost monitoring (AI tokens, API calls)
- System health dashboard
- Error logging & viewing
- Queue management integration

**Reference Documents:**
- Domain Planning: `docs/5.planning-setup/domains/admin/domain-planning.md`
- Domain TDD: `docs/3.technical-design/domains/admin/domain-tdd.md`

**Estimated Duration:** 2.5 weeks  
**Dependencies:** Auth (Admin role), All domains (metrics)

---

## 2. Prerequisites

- [ ] Auth domain with ADMIN role working
- [ ] All domains emitting metrics/logs
- [ ] Redis/BullMQ operational

---

## 3. API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/users/:id` | Get user details | Admin |
| POST | `/api/admin/users` | Create new user | Admin |
| PATCH | `/api/admin/users/:id/role` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Deactivate user | Admin |
| GET | `/api/admin/projects` | List all projects (with crawl status) | Admin |
| GET | `/api/admin/projects/:id` | Get project details | Admin |
| GET | `/api/admin/projects/:id/info` | Get project info (crawled metadata) | Admin |
| POST | `/api/admin/projects/:id/refresh-info` | Trigger project info refresh | Admin |
| GET | `/api/admin/tasks` | List all jobs (filterable) | Admin |
| GET | `/api/admin/tasks/queues/stats` | Get queue statistics | Admin |
| GET | `/api/admin/tasks/:jobId` | Get job details | Admin |
| POST | `/api/admin/tasks/:jobId/retry` | Retry failed job | Admin |
| GET | `/api/admin/costs` | Get cost summary | Admin |
| GET | `/api/admin/costs/daily` | Daily cost breakdown | Admin |
| PATCH | `/api/admin/costs/cap` | Set cost cap | Admin |
| GET | `/api/admin/health` | System health check | Admin |
| GET | `/api/admin/metrics` | System metrics | Admin |
| GET | `/api/admin/logs` | Search error logs | Admin |
| GET | `/api/admin/api-keys` | List API keys | Admin |
| POST | `/api/admin/api-keys` | Create API key | Admin |
| DELETE | `/api/admin/api-keys/:id` | Revoke API key | Admin |

---

## 4. Implementation Tasks

### 4.1 Access Control (AD-AC-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-AC-001 | Create AdminGuard | 1h | ⬜ |
| AD-AC-002 | Apply guard to admin routes | 1h | ⬜ |
| AD-AC-003 | Create @AdminOnly decorator | 1h | ⬜ |

### 4.2 User Management (AD-UM-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-UM-001 | Create UserAdminService | 2h | ⬜ |
| AD-UM-002 | Implement list all users | 1h | ⬜ |
| AD-UM-003 | Implement user details view | 1h | ⬜ |
| AD-UM-004 | Implement user creation | 2h | ⬜ |
| AD-UM-005 | Implement role update | 2h | ⬜ |
| AD-UM-006 | Implement user deactivation | 1h | ⬜ |
| AD-UM-007 | Create UserAdminController | 2h | ⬜ |
| AD-UM-008 | Create DTOs (CreateUserDto, UpdateUserRoleDto) | 1h | ⬜ |

### 4.3 API Key Management (AD-AK-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-AK-001 | Add APIKey model to Prisma schema | 1h | ⬜ |
| AD-AK-002 | Create APIKeyService | 2h | ⬜ |
| AD-AK-003 | Implement key generation | 1h | ⬜ |
| AD-AK-004 | Implement key rotation | 2h | ⬜ |
| AD-AK-005 | Implement key revocation | 1h | ⬜ |
| AD-AK-006 | Create APIKeyController | 1h | ⬜ |

### 4.4 Cost Monitoring (AD-CM-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-CM-001 | Create CostTrackingService | 2h | ⬜ |
| AD-CM-002 | Aggregate token usage by day | 2h | ⬜ |
| AD-CM-003 | Calculate estimated costs | 1h | ⬜ |
| AD-CM-004 | Create cost dashboard data API | 2h | ⬜ |
| AD-CM-005 | Implement cost cap logic | 2h | ⬜ |
| AD-CM-006 | Alert when approaching cap | 1h | ⬜ |
| AD-CM-007 | Create CostController | 1h | ⬜ |

### 4.5 System Health (AD-SH-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-SH-001 | Create SystemMetricsService | 2h | ⬜ |
| AD-SH-002 | Collect queue metrics | 1h | ⬜ |
| AD-SH-003 | Collect database stats | 1h | ⬜ |
| AD-SH-004 | Collect API response times | 2h | ⬜ |
| AD-SH-005 | Create health check endpoint | 1h | ⬜ |
| AD-SH-006 | Create metrics API | 2h | ⬜ |

### 4.6 Error Logging (AD-EL-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-EL-001 | Add SystemLog model to Prisma | 1h | ⬜ |
| AD-EL-002 | Create LoggingService | 2h | ⬜ |
| AD-EL-003 | Implement log write | 1h | ⬜ |
| AD-EL-004 | Implement log search | 2h | ⬜ |
| AD-EL-005 | Create log viewer API | 2h | ⬜ |

### 4.7 Project Management (AD-PM-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-PM-001 | Create ProjectAdminService | 2h | ⬜ |
| AD-PM-002 | Implement list all projects | 1h | ⬜ |
| AD-PM-003 | Implement project details view | 1h | ⬜ |
| AD-PM-004 | Implement project info crawl status tracking | 2h | ⬜ |
| AD-PM-005 | Implement get project info endpoint | 1h | ⬜ |
| AD-PM-006 | Implement update project info endpoint (edit) | 2h | ⬜ |
| AD-PM-007 | Implement project info refresh trigger | 1h | ⬜ |
| AD-PM-008 | Implement create project endpoint (with optional targetUserId) | 1h | ⬜ |
| AD-PM-009 | Implement delete project endpoint (admin can delete any) | 0.5h | ⬜ |
| AD-PM-010 | Create ProjectAdminController | 1h | ⬜ |
| AD-PM-011 | Create DTOs (ListProjectsQueryDto, UpdateProjectInfoDto, CreateProjectAdminDto) | 1h | ⬜ |
| AD-PM-012 | Inject BullMQ crawl queue in ProjectAdminService | 0.5h | ⬜ |
| AD-PM-013 | Update crawler to save description field | 1h | ⬜ |

### 4.8 Data Management (AD-DM-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-DM-001 | Create DataAdminService | 3h | ⬜ |
| AD-DM-002 | Implement findAllReviews | 2h | ⬜ |
| AD-DM-003 | Implement findAllAppUpdates | 2h | ⬜ |
| AD-DM-004 | Implement findAllCompetitors | 1h | ⬜ |
| AD-DM-004a | Implement create competitor (POST /admin/competitors, fetch metadata) | 2h | ⬜ |
| AD-DM-005 | Implement findOneCompetitor | 1h | ⬜ |
| AD-DM-006 | Implement refreshCompetitor (trigger store crawl) | 1h | ⬜ |
| AD-DM-006a | Implement SocialChannel CRUD (POST/PATCH/DELETE admin endpoints) | 3h | ⬜ |
| AD-DM-007 | Implement findAllLandingPages | 1h | ⬜ |
| AD-DM-008 | Create DataAdminController | 1h | ⬜ |
| AD-DM-009 | Create DTOs (ListReviewsQueryDto, ListAppUpdatesQueryDto, ListCompetitorsQueryDto, ListLandingPagesQueryDto, Create/UpdateSocialChannelAdminDto) | 2h | ⬜ |
| AD-DM-010 | Add POST /admin/competitors/:id/refresh endpoint | 0.5h | ⬜ |
| AD-DM-011 | Add **internal social channels admin endpoints** (`/admin/internal/social`): list with filters (platform/project/search), create/update/delete from `ProjectSocialChannel` table | 4h | ⬜ |
| AD-DM-011B | Add **external social channels admin endpoints** (`/admin/external/social`): list with filters (platform/competitor/project/search), create/update/delete from `CompetitorSocialChannel` table | 4h | ⬜ |
| AD-DM-012 | Create Internal/External DTOs (ListInternalSocialQueryDto, ListExternalSocialQueryDto, CreateInternalSocialDto, CreateExternalSocialDto, etc.) | 2h | ⬜ |
| AD-DM-013 | Add **internal videos admin endpoints** (`/admin/internal/videos`): list/filter from `ProjectVideoOrganic` table, platform, project, date, search; read-only | 3h | ⬜ |
| AD-DM-013B | Add **external videos admin endpoints** (`/admin/external/videos`): list/filter from `CompetitorVideoOrganic` table, platform, competitor, project, date, search; read-only | 3h | ⬜ |
| AD-DM-013C | Add **internal video ads admin endpoints** (`/admin/internal/video-ads`): list/filter from `ProjectVideoAds` table | 3h | ⬜ |
| AD-DM-013D | Add **external video ads admin endpoints** (`/admin/external/video-ads`): list/filter from `CompetitorVideoAds` table | 3h | ⬜ |
| AD-DM-013E | Add **internal landing pages admin endpoints** (`/admin/internal/landing-pages`): list/filter from `ProjectLandingPage` table | 2h | ⬜ |
| AD-DM-013F | Add **external landing pages admin endpoints** (`/admin/external/landing-pages`): list/filter from `CompetitorLandingPage` table | 2h | ⬜ |
| AD-DM-014 | Support **bulk delete** APIs for internal/external social channels | 1h | ⬜ |
| AD-DM-015 | Support **bulk delete** APIs for internal/external videos and video ads | 1h | ⬜ |
| AD-DM-016 | Add **internal social channels Ads Library trigger endpoint** (`POST /admin/internal/social/:id/crawl-ads`): query from `ProjectSocialChannel`, trigger crawl | 2h | ⬜ |
| AD-DM-016B | Add **external social channels Ads Library trigger endpoint** (`POST /admin/external/social/:id/crawl-ads`): query from `CompetitorSocialChannel`, trigger crawl | 2h | ⬜ |
| AD-DM-016C | Add crawl trigger endpoints for videos and stats (internal/external): `/admin/internal/social/:id/crawl-videos`, `/admin/internal/social/:id/crawl-stats`, etc. | 2h | ⬜ |
| AD-DM-017 | Remove old unified endpoints (`/admin/social`, `/admin/videos`) and all `prisma.socialChannel` queries (fail-fast approach) | 2h | ⬜ |
| AD-DM-018 | Add **ads-by-social** filter support to Ads Library admin endpoints (e.g. accept `socialChannelId` or `pageId` on `/admin/ads`), so clicking a stats number can open `/admin/ads` pre-filtered for that channel | 2h | ⬜ |

### 4.8 Background Task Management (AD-TM-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-TM-001 | Create TaskAdminService | 3h | ⬜ |
| AD-TM-002 | Implement list all jobs (all queues) | 2h | ⬜ |
| AD-TM-003 | Implement job details view | 1h | ⬜ |
| AD-TM-004 | Implement job retry | 1h | ⬜ |
| AD-TM-005 | Implement queue statistics | 1h | ⬜ |
| AD-TM-006 | Create TaskAdminController | 1h | ⬜ |
| AD-TM-007 | Create DTOs (ListTasksQueryDto, RetryJobDto) | 0.5h | ⬜ |
| AD-TM-008 | Inject BullMQ queues (crawl-queue, analysis-queue) | 1h | ⬜ |

### 4.9 Module Setup (AD-MOD-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-MOD-001 | Create AdminModule | 1h | ⬜ |
| AD-MOD-002 | Register in AppModule | 0.5h | ⬜ |
| AD-MOD-003 | Setup Bull Board route | 1h | ⬜ |
| AD-MOD-004 | Import BullMQ queues in AdminModule | 0.5h | ⬜ |

### 4.10 Tests (AD-TST-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AD-TST-001 | Unit tests for services | 2h | ⬜ |
| AD-TST-002 | API tests for admin endpoints | 2h | ⬜ |

---

## 5. Files to Create

```
backend/src/modules/admin/
├── admin.module.ts                     ⬜
├── controllers/
│   ├── user-admin.controller.ts        ⬜
│   ├── project-admin.controller.ts     ⬜
│   ├── task-admin.controller.ts        ⬜
│   ├── api-key.controller.ts           ⬜
│   ├── cost.controller.ts              ⬜
│   ├── health.controller.ts            ⬜
│   └── logs.controller.ts              ⬜
├── services/
│   ├── user-admin.service.ts           ⬜
│   ├── project-admin.service.ts         ⬜
│   ├── task-admin.service.ts           ⬜
│   ├── api-key.service.ts              ⬜
│   ├── cost-tracking.service.ts        ⬜
│   ├── system-metrics.service.ts       ⬜
│   └── logging.service.ts              ⬜
├── guards/
│   └── admin.guard.ts                  ⬜
├── decorators/
│   └── admin-only.decorator.ts         ⬜
├── dto/
│   ├── create-user.dto.ts              ⬜
│   ├── update-user-role.dto.ts         ⬜
│   ├── list-projects.dto.ts            ⬜
│   ├── list-tasks.dto.ts               ⬜
│   ├── api-key.dto.ts                  ⬜
│   └── cost.dto.ts                     ⬜
├── types/
│   └── admin.types.ts                  ⬜
└── tests/
    └── admin.service.spec.ts           ⬜
```

---

## 6. Prisma Schema Additions

```prisma
model APIKey {
  id          String    @id @default(cuid())
  name        String
  key         String    @unique
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  createdBy   String
  user        User      @relation(fields: [createdBy], references: [id])
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
}

model SystemLog {
  id        String   @id @default(cuid())
  level     LogLevel
  message   String
  context   String?
  stack     String?
  metadata  Json?
  createdAt DateTime @default(now())
}

enum LogLevel {
  DEBUG
  INFO
  WARN
  ERROR
  FATAL
}
```

---

## 7. System Metrics Schema

```typescript
interface SystemMetric {
  id: string;
  name: string;          // 'api_response_time', 'queue_depth', 'token_usage'
  value: number;
  tags: {
    endpoint?: string;
    queue?: string;
    provider?: string;
  };
  timestamp: Date;
}

interface CostSummary {
  date: string;
  tokenUsage: {
    openai: number;
    total: number;
  };
  apiCalls: {
    apify: number;
    searchapi: number;
  };
  estimatedCost: number;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  components: {
    database: ComponentStatus;
    redis: ComponentStatus;
    queue: ComponentStatus;
    api: ComponentStatus;
  };
  lastChecked: Date;
}
```

---

## 8. Verification Checklist

- [ ] Admin guard protecting routes
- [ ] User list returns all users
- [ ] Role update works
- [ ] User deactivation works
- [ ] API keys can be created/revoked
- [ ] Cost dashboard has data
- [ ] Token usage tracked
- [ ] Cost caps enforced
- [ ] Health check returns status
- [ ] Metrics API returns data
- [ ] Error logs searchable

---

**Next Step:** After Admin Backend, proceed to Admin Frontend.

