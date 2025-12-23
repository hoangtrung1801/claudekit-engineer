# Domain Planning: Admin

> **Reference:** [System Planning](../../system-planning.md)  
> **Phase:** 4 (Polish & Scale)  
> **Priority:** P3 - Low

---

## 1. Domain Overview

### 1.1 Domain Name & Scope

**Admin Domain** provides system management tools, monitoring, and configuration for administrators.

**Scope:**
- User management
- API key management
- Cost monitoring (AI tokens, API calls)
- System health dashboard
- Error logging & viewing
- Queue management UI

**Out of Scope:**
- Infrastructure provisioning
- Database management
- Code deployment

### 1.2 Domain Objectives

| Objective | Success Criteria |
|-----------|------------------|
| System visibility | Real-time health metrics |
| Cost control | Token usage tracked, caps enforced |
| Error handling | Errors visible, searchable |
| User administration | Manage users, roles |

### 1.3 Domain Context

**Dependencies:**
- **From All Domains:** Metrics, logs, usage data
- **From Auth:** Admin role verification

**Integration Points:**
- System metrics collection
- Error logging (Sentry/custom)
- BullMQ dashboard
- Database admin

---

## 2. Features Breakdown

### 2.1 Feature List

| Feature ID | Feature Name | Priority | Complexity | Est. Points |
|------------|--------------|----------|------------|-------------|
| AD-01 | Admin Guard & Role Check | P0 | Low | 2 |
| AD-02 | User List Management | P1 | Medium | 5 |
| AD-03 | User Role Update | P1 | Low | 2 |
| AD-04 | API Key Management | P2 | Medium | 5 |
| AD-05 | Cost Dashboard | P1 | Medium | 5 |
| AD-06 | Token Usage Charts | P1 | Medium | 5 |
| AD-07 | Cost Cap Settings | P2 | Low | 3 |
| AD-08 | System Health Dashboard | P2 | Medium | 5 |
| AD-09 | Error Log Viewer | P2 | Medium | 5 |
| AD-10 | Queue Monitor Integration | P2 | Low | 2 |
| AD-11 | System Metrics API | P2 | Medium | 5 |
| AD-12 | Admin Panel UI | P1 | High | 8 |
| AD-13 | Project Management (Admin) | P1 | Medium | 11 |
| AD-14 | Background Task Management | P1 | Medium | 8 |
| AD-15 | Data Management (Reviews, Updates, Competitors, Landing Pages) | P1 | Medium | 13 |
| AD-16 | ASO Keywords Management | P1 | Medium | 8 |
| AD-17 | Ads Library Transparency Management | P1 | Medium | 8 |
| **AD-18** | **Keyword Spy Management (Admin)** | **P1** | **Medium** | **8** |
| **AD-19** | **Ads Curation Management (Admin)** | **P1** | **Medium** | **10** |
| **Total** | | | | **112 points** |

### 2.2 Feature Dependencies

```
AD-01 (Guard) ──▶ All Admin Features

AD-02 (User List) ──▶ AD-03 (Role Update)

AD-05 (Cost Dashboard) ──▶ AD-06 (Charts) ──▶ AD-07 (Caps)

AD-08 (Health) ◀── AD-11 (Metrics API)
AD-09 (Errors) ◀── AD-11 (Metrics API)

AD-12 (UI) ◀── All Features

AD-16 (ASO Keywords) ──▶ AD-17 (Ads Library Transparency)
AD-17 (Ads Library) ◀── Data Collection (Ads Library Crawler)
```

---

## 3. Tasks Breakdown

### 3.1 Access Control

- [ ] **AD-AC01**: Create AdminGuard - 1h
- [ ] **AD-AC02**: Apply guard to admin routes - 1h
- [ ] **AD-AC03**: Create admin role verification - 1h

### 3.2 User Management

- [ ] **AD-UM01**: Create UserAdminService - 2h
- [ ] **AD-UM02**: Implement list all users - 1h
- [ ] **AD-UM03**: Implement user details view - 1h
- [ ] **AD-UM04**: Implement user creation - 2h
- [ ] **AD-UM05**: Implement role update - 2h
- [ ] **AD-UM06**: Implement user deactivation - 1h
- [ ] **AD-UM07**: Create UserAdmin controller - 2h

### 3.3 API Key Management

- [ ] **AD-AK01**: Create APIKey Prisma model - 1h
- [ ] **AD-AK02**: Create APIKeyService - 2h
- [ ] **AD-AK03**: Implement key generation - 1h
- [ ] **AD-AK04**: Implement key rotation - 2h
- [ ] **AD-AK05**: Create APIKey controller - 1h

### 3.4 Cost Monitoring

- [ ] **AD-CM01**: Create CostTrackingService - 2h
- [ ] **AD-CM02**: Aggregate token usage by day - 2h
- [ ] **AD-CM03**: Calculate estimated costs - 1h
- [ ] **AD-CM04**: Create cost dashboard data API - 2h
- [ ] **AD-CM05**: Implement cost cap logic - 2h
- [ ] **AD-CM06**: Alert when approaching cap - 1h

### 3.5 System Health

- [ ] **AD-SH01**: Create SystemMetricsService - 2h
- [ ] **AD-SH02**: Collect queue metrics - 1h
- [ ] **AD-SH03**: Collect database stats - 1h
- [ ] **AD-SH04**: Collect API response times - 2h
- [ ] **AD-SH05**: Create health check endpoint - 1h
- [ ] **AD-SH06**: Create metrics API - 2h

### 3.6 Error Logging

- [ ] **AD-EL01**: Create SystemLog Prisma model - 1h
- [ ] **AD-EL02**: Create LoggingService - 2h
- [ ] **AD-EL03**: Implement log write - 1h
- [ ] **AD-EL04**: Implement log search - 2h
- [ ] **AD-EL05**: Create log viewer API - 2h

### 3.7 Project Management (Admin)

- [ ] **AD-PM01**: Create ProjectAdminService - 2h
- [ ] **AD-PM02**: Implement list all projects - 1h
- [ ] **AD-PM03**: Implement project info crawl status tracking - 1h
- [ ] **AD-PM04**: Implement project details view - 1h
- [ ] **AD-PM05**: Implement project info view (get app metadata) - 1h
- [ ] **AD-PM06**: Implement project info refresh trigger - 1h
- [ ] **AD-PM07**: Create ProjectAdminController - 1h

### 3.10 Data Management (Admin)

- [ ] **AD-DM01**: Create DataAdminService - 2h
- [ ] **AD-DM02**: Implement list all reviews - 1h
- [ ] **AD-DM03**: Implement list all app updates - 1h
- [ ] **AD-DM04**: Implement list all competitors - 1h
- [ ] **AD-DM04a**: Implement create competitor (store URL + project selection, fetch metadata) - 2h
- [ ] **AD-DM05**: Implement competitor details view - 1h
// Social Channels management (Admin)
- [ ] **AD-DM06**: Implement competitor refresh trigger - 1h
- [ ] **AD-DM06a**: Implement social channel CRUD (POST/PATCH/DELETE for competitor channels) - 3h
- [ ] **AD-DM07**: Implement list all landing pages - 1h
- [ ] **AD-DM08**: Create DataAdminController - 1h

### 3.8 Background Task Management

- [ ] **AD-TM01**: Create TaskAdminService - 3h
- [ ] **AD-TM02**: Implement list all jobs (all queues) - 2h
- [ ] **AD-TM03**: Implement job details view - 1h
- [ ] **AD-TM04**: Implement job retry - 1h
- [ ] **AD-TM05**: Implement queue statistics - 1h
- [ ] **AD-TM06**: Create TaskAdminController - 1h

### 3.9 Frontend Admin Panel

- [ ] **AD-F01**: Create AdminLayout - 2h
- [ ] **AD-F02**: Create AdminSidebar - 1h
- [ ] **AD-F03**: Create UsersListPage - 3h
- [ ] **AD-F04**: Create UserCreateModal - 2h
- [ ] **AD-F05**: Create ProjectsListPage - 3h
- [ ] **AD-F06**: Create ProjectDetailsModal - 2h
- [ ] **AD-F07**: Create TasksListPage - 3h
- [ ] **AD-F08**: Create TaskDetailsModal - 2h
- [ ] **AD-F09**: Create QueueStatsCards - 1h
- [ ] **AD-F10**: Create CostDashboardPage - 3h
- [ ] **AD-F11**: Create token usage charts - 2h
- [ ] **AD-F12**: Create SystemHealthPage - 2h
- [ ] **AD-F13**: Create ErrorLogsPage - 2h
- [ ] **AD-F14**: Integrate Bull Board - 1h

### 3.8 Testing

- [ ] **AD-T01**: Unit tests for services - 2h
- [ ] **AD-T02**: API tests for admin endpoints - 2h

---

## 4. Timeline & Sprints

### 4.1 Sprint Breakdown

**Sprint 10 (Week 27-28): Admin Panel**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | AD-AC*, AD-UM* | Access control & User management |
| Day 3-4 | AD-CM01 to AD-CM06 | Cost monitoring |
| Day 5-6 | AD-SH*, AD-EL* | Health & Logging |
| Day 7-8 | AD-F01 to AD-F08 | Admin UI |
| Day 9-10 | AD-AK*, AD-T* | API keys & Testing |

### 4.2 Timeline Estimate

| Milestone | Duration | Week |
|-----------|----------|------|
| User Management | 0.5 week | Week 27 |
| Cost Monitoring | 0.5 week | Week 27 |
| System Health | 0.5 week | Week 28 |
| Admin UI | 0.5 week | Week 28 |
| **Total** | **2 weeks** | **Week 27-28** |

### 4.3 Milestones

1. **M1: User Management** - Admin can manage users
2. **M2: Cost Visibility** - Token usage tracked
3. **M3: System Health** - Health dashboard live
4. **M4: Full Admin Panel** - All features complete

---

## 5. Resource Allocation

### 5.1 Team Assignment

| Role | Allocation | Tasks |
|------|------------|-------|
| Backend Developer | 60% | AD-AC*, AD-UM*, AD-CM*, AD-SH*, AD-EL* |
| Frontend Developer | 40% | AD-F* |

### 5.2 Capacity Planning

- Backend: ~40 hours
- Frontend: ~16 hours
- Testing: ~4 hours
- **Total: ~60 hours (1.5 weeks)**

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies

| Dependency | Provider | Purpose |
|------------|----------|---------|
| Sentry (optional) | Sentry.io | Error tracking |
| Bull Board | Open source | Queue UI |

### 6.2 Internal Dependencies
- All domains should emit metrics/logs
- Auth domain with admin role

### 6.3 Blockers

| Blocker | Mitigation |
|---------|------------|
| No error data | Use console logs initially |
| No usage data | Start tracking from deployment |

---

## 7. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Admin panel low priority | High | Low | Keep minimal, expand later |
| Cost data inaccurate | Medium | Medium | Validate with provider bills |
| Security exposure | Low | High | Admin-only guards, audit logs |

---

## 8. Definition of Done

### 8.1 Feature Completion Criteria

- [ ] Admin guard protecting routes
- [ ] User list and role management working
- [ ] Cost dashboard displaying usage
- [ ] System health metrics visible
- [ ] Error logs searchable
- [ ] Queue status viewable

### 8.2 Quality Gates

- [ ] Only admins can access
- [ ] No sensitive data exposed
- [ ] Responsive admin UI
- [ ] Audit trail for admin actions

---

## 9. Admin Panel Pages

```
/admin
├── /dashboard        → System overview
├── /users           → User management
│   └── /:id         → User details
├── /projects        → Project management (all projects)
│   └── /:id         → Project details (competitors clickable → navigate to competitor)
├── /reviews         → Reviews management (all reviews)
├── /whats-new        → What's New management (all app updates)
├── /competitors      → Competitors management (all competitors)
│   └── /:id         → Competitor detail page
├── /landing-pages    → Landing pages management (all landing pages)
├── /aso/keywords     → ASO Keywords management (all keywords, create/edit/delete)
├── /ads              → Admin Ads (unified view: Ads Library Transparency + Ads Curation)
├── /tasks           → Background task management
│   └── /:jobId      → Task details
├── /costs           → Cost monitoring
├── /health          → System health
├── /logs            → Error logs
├── /queues          → Bull Board integration
└── /settings        → System settings
    ├── /api-keys    → API key management
    └── /caps        → Cost caps
```

---

## 10. System Metrics Schema

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

## 11. API Endpoints Reference

### 11.1. User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| GET | `/admin/users/:id` | Get user details |
| POST | `/admin/users` | Create new user |
| PATCH | `/admin/users/:id/role` | Update user role |
| DELETE | `/admin/users/:id` | Deactivate user |

### 11.2. Project Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/projects` | List all projects (with crawl status) |
| GET | `/admin/projects/:id` | Get project details |
| POST | `/admin/projects` | Create new project (optional targetUserId) |
| GET | `/admin/projects/:id/info` | Get project info (crawled metadata) |
| PATCH | `/admin/projects/:id/info` | Update project info (manual edit) |
| POST | `/admin/projects/:id/refresh-info` | Trigger project info re-crawl |
| DELETE | `/admin/projects/:id` | Delete project (admin can delete any) |
| GET | `/admin/reviews` | List all reviews (filterable) |
| GET | `/admin/whats-new` or `/admin/app-updates` | List all app updates (filterable) |
| GET | `/admin/competitors` | List all competitors (filterable) |
| GET | `/admin/competitors/:id` | Get competitor details |

### 11.2a. Internal Data Management (Astraler's Own Data)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/internal/social` | List all internal social channels (from ProjectSocialChannel) |
| POST | `/admin/internal/social` | Create internal social channel |
| PATCH | `/admin/internal/social/:id` | Update internal social channel |
| DELETE | `/admin/internal/social/:id` | Delete internal social channel |
| POST | `/admin/internal/social/bulk-delete` | Bulk delete internal social channels |
| POST | `/admin/internal/social/:id/crawl-ads` | Trigger Ads Library crawl for internal channel |
| POST | `/admin/internal/social/:id/crawl-videos` | Trigger video crawl for internal channel |
| POST | `/admin/internal/social/:id/crawl-stats` | Trigger stats crawl for internal channel |
| GET | `/admin/internal/videos` | List all internal organic videos (from ProjectVideoOrganic) |
| GET | `/admin/internal/videos/:id` | Get internal video details |
| DELETE | `/admin/internal/videos/:id` | Delete internal video |
| POST | `/admin/internal/videos/bulk-delete` | Bulk delete internal videos |
| GET | `/admin/internal/video-ads` | List all internal video ads (from ProjectVideoAds) |
| GET | `/admin/internal/video-ads/:id` | Get internal video ad details |
| DELETE | `/admin/internal/video-ads/:id` | Delete internal video ad |
| POST | `/admin/internal/video-ads/bulk-delete` | Bulk delete internal video ads |
| GET | `/admin/internal/landing-pages` | List all internal landing pages (from ProjectLandingPage) |
| DELETE | `/admin/internal/landing-pages/:id` | Delete internal landing page |
| POST | `/admin/internal/landing-pages/bulk-delete` | Bulk delete internal landing pages |

### 11.2b. External Data Management (Competitor Data)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/external/social` | List all external social channels (from CompetitorSocialChannel) |
| POST | `/admin/external/social` | Create external social channel |
| PATCH | `/admin/external/social/:id` | Update external social channel |
| DELETE | `/admin/external/social/:id` | Delete external social channel |
| POST | `/admin/external/social/bulk-delete` | Bulk delete external social channels |
| POST | `/admin/external/social/:id/crawl-ads` | Trigger Ads Library crawl for external channel |
| POST | `/admin/external/social/:id/crawl-videos` | Trigger video crawl for external channel |
| POST | `/admin/external/social/:id/crawl-stats` | Trigger stats crawl for external channel |
| GET | `/admin/external/videos` | List all external organic videos (from CompetitorVideoOrganic) |
| GET | `/admin/external/videos/:id` | Get external video details |
| DELETE | `/admin/external/videos/:id` | Delete external video |
| POST | `/admin/external/videos/bulk-delete` | Bulk delete external videos |
| GET | `/admin/external/video-ads` | List all external video ads (from CompetitorVideoAds) |
| GET | `/admin/external/video-ads/:id` | Get external video ad details |
| DELETE | `/admin/external/video-ads/:id` | Delete external video ad |
| POST | `/admin/external/video-ads/bulk-delete` | Bulk delete external video ads |
| GET | `/admin/external/landing-pages` | List all external landing pages (from CompetitorLandingPage) |
| DELETE | `/admin/external/landing-pages/:id` | Delete external landing page |
| POST | `/admin/external/landing-pages/bulk-delete` | Bulk delete external landing pages |

### 11.3. Background Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/tasks` | List all jobs (filterable) |
| GET | `/admin/tasks/queues/stats` | Get queue statistics |
| GET | `/admin/tasks/:jobId` | Get job details |
| POST | `/admin/tasks/:jobId/retry` | Retry failed job |

### 11.4. System Observability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/costs` | Get cost summary |
| GET | `/admin/costs/daily` | Daily cost breakdown |
| PATCH | `/admin/costs/cap` | Set cost cap |
| GET | `/admin/health` | System health check |
| GET | `/admin/metrics` | System metrics |
| GET | `/admin/logs` | Search error logs |
| GET | `/admin/api-keys` | List API keys |
| POST | `/admin/api-keys` | Create API key |
| DELETE | `/admin/api-keys/:id` | Revoke API key |

---

**Planning Complete!**

All 8 domains have been planned. Next step is to proceed with Feature Planning (Level 3) for critical features if needed, or start Implementation.

