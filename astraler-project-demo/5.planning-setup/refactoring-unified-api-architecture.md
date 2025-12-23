# Refactoring Plan: Unified API Architecture - FULL SYSTEM

> **Status:** Planning  
> **Priority:** High  
> **Complexity:** High  
> **Risk Level:** Medium  
> **Estimated Duration:** 4-5 weeks

---

## Executive Summary

Refactor **ALL APIs** in the system from **separate APIs per role** to **unified API with role-aware guards** to ensure:
- ✅ **Consistency** - All APIs follow the same pattern
- ✅ **Scalability** - Easy to add new roles
- ✅ **Maintainability** - Code is easier to maintain
- ✅ **Reduced Duplication** - Less code duplication

---

## 1. Current State Analysis

### 1.1 All APIs That Need Refactoring

#### Project Management Domain
- ✅ **ProjectsController** - `/api/projects`
- ✅ **CompetitorsController** - `/api/projects/:projectId/competitors`
- ✅ **KeywordsController (ASO)** - `/api/projects/:projectId/keywords`
- ✅ **SpyKeywordsController** - `/api/projects/:projectId/spy-keywords`
- ✅ **LandingPagesController** - `/api/landing-pages`, `/api/projects/:projectId/landing-pages`
- ✅ **SocialChannelsController** - `/api/competitors/:competitorId/social-channels`

#### Data Collection Domain
- ✅ **VideoAdsController** - `/api/projects/:projectId/video-ads`
- ✅ **VideoOrganicController** - `/api/projects/:projectId/videos`
- ✅ **SocialPostsController** - `/api/projects/:projectId/social-posts`
- ✅ **ReviewsController** - `/api/projects/:projectId/reviews`
- ✅ **AppUpdatesController** - `/api/competitors/:competitorId/app-updates`

#### Admin Domain
- ✅ **UserAdminController** - `/api/admin/users` (system-wide, keep as is)
- ✅ **ProjectAdminController** - `/api/admin/projects` (system-wide + project-scoped)
- ✅ **TaskAdminController** - `/api/admin/tasks` (system-wide, keep as is)
- ✅ **AsoAdminController** - `/api/admin/aso/keywords` (system-wide + project-scoped)
- ✅ **AdsLibraryAdminController** - `/api/admin/ads-library` (system-wide, keep as is)
- ✅ **SpyKeywordsAdminController** - `/api/admin/spy-keywords` (system-wide + project-scoped)
- ✅ **VideoAdsAdminController** - `/api/admin/video-ads` (system-wide + project-scoped)
- ✅ **VideoOrganicAdminController** - `/api/admin/videos` (system-wide + project-scoped)
- ✅ **DataAdminController** - `/api/admin/reviews`, `/api/admin/competitors`, etc. (system-wide)

### 1.2 Current Pattern Issues

**Pattern 1: Service with role check inside (ProjectsController)**
```typescript
// Current: Role check inside service
async findAll(userId: string, userRole: Role) {
  const where = userRole !== Role.ADMIN ? { userId } : {};
  // ...
}
```

**Pattern 2: Separate Admin Service (SpyKeywords)**
```typescript
// Current: Duplicate service for admin
class SpyKeywordsService { /* user logic */ }
class SpyKeywordsAdminService { /* admin logic, duplicated */ }
```

**Pattern 3: Ownership check in controller (old pattern)**
```typescript
// Current: Manual ownership check
@UseGuards(JwtAuthGuard, ProjectOwnershipGuard)
async update(@Param('projectId') projectId: string, @CurrentUser('id') userId: string) {
  await this.validateOwnership(projectId, userId);
  // ...
}
```

---

## 2. Target State: Unified Architecture

### 2.1 Pattern: Role-Aware Guard + Unified Service

**All project-scoped resources:**
```typescript
// Unified Guard (handles role logic)
@UseGuards(JwtAuthGuard, ProjectAccessGuard)

// Unified Service (accepts user, no role checks needed)
async findAll(projectId: string, user: User) {
  // Guard already validated access
  // Service focuses on business logic
  return this.prisma.resource.findMany({ where: { projectId } });
}
```

**System-wide admin operations:**
```typescript
// Keep separate admin endpoints for cross-project operations
@Controller('admin/spy-keywords')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
async findAllAcrossProjects(@CurrentUser() user: User) {
  // System-wide listing
}
```

---

## 3. Refactoring Strategy

### 3.1 Approach: Incremental, Domain-by-Domain

**Phase 1:** Infrastructure (Guards, Utils)
**Phase 2:** Project Management Domain
**Phase 3:** Data Collection Domain  
**Phase 4:** Admin Domain (project-scoped operations)
**Phase 5:** Frontend Migration
**Phase 6:** Cleanup & Documentation

### 3.2 Backward Compatibility

- ✅ Keep old admin APIs working during transition
- ✅ Mark deprecated endpoints with `@Deprecated()` decorator
- ✅ Update frontend gradually
- ✅ Remove old APIs after full migration

---

## 4. Detailed Refactoring Plan

### Phase 1: Infrastructure (Week 1, Days 1-2)

#### 1.1 Create Role-Aware Guards

**Files to Create:**
```
backend/src/common/guards/
├── project-access.guard.ts        (new)
├── resource-access.guard.ts       (new, generic)
└── role-aware.guard.ts            (new, base class)
```

**Tasks:**
- [ ] Create `ProjectAccessGuard` - validates project access based on role
- [ ] Create `ResourceAccessGuard` - generic guard for any resource
- [ ] Create base `RoleAwareGuard` class for extensibility
- [ ] Add unit tests for all guards (ADMIN, USER, future roles)
- [ ] Document guard usage patterns

**Acceptance Criteria:**
- ✅ ADMIN bypasses ownership checks
- ✅ USER requires ownership validation
- ✅ Guards handle edge cases (missing IDs, invalid formats)
- ✅ Unit tests cover all scenarios

---

#### 1.2 Create Role Utilities

**Files to Create:**
```
backend/src/common/utils/
├── role.utils.ts                  (new)
└── permissions.utils.ts           (new, future-proof)
```

**Tasks:**
- [ ] Create role helper functions
- [ ] Create permission checker (for future fine-grained permissions)
- [ ] Add unit tests

---

### Phase 2: Project Management Domain (Week 1, Days 3-5)

#### 2.1 ProjectsController

**Current:** Service has role logic inside
**Target:** Guard handles access, service accepts `user` object

**Tasks:**
- [ ] Update `ProjectService.findAll()` to accept `user: User` instead of `userId` and `userRole`
- [ ] Remove role logic from service (guard handles it)
- [ ] Update `ProjectController` to use `ProjectAccessGuard`
- [ ] Update `ProjectController` to pass `@CurrentUser()` to service
- [ ] Update `ProjectService.create()`, `update()`, `remove()` methods
- [ ] Write integration tests
- [ ] Update admin controller to reuse unified service

**Files:**
- `backend/src/modules/project-management/projects.service.ts`
- `backend/src/modules/project-management/projects.controller.ts`
- `backend/src/modules/admin/services/project-admin.service.ts`

---

#### 2.2 CompetitorsController

**Tasks:**
- [ ] Update `CompetitorsService` methods to accept `user: User`
- [ ] Remove ownership checks from service (guard handles it)
- [ ] Update `CompetitorsController` to use `ProjectAccessGuard`
- [ ] Write integration tests
- [ ] Update admin controller

**Files:**
- `backend/src/modules/project-management/competitors.service.ts`
- `backend/src/modules/project-management/competitors.controller.ts`
- `backend/src/modules/admin/services/data-admin.service.ts`

---

#### 2.3 KeywordsController (ASO)

**Tasks:**
- [ ] Update `KeywordsService` methods to accept `user: User`
- [ ] Update `KeywordsController` to use `ProjectAccessGuard`
- [ ] Write integration tests
- [ ] Update `AsoAdminController` to reuse unified service

**Files:**
- `backend/src/modules/project-management/keywords.service.ts`
- `backend/src/modules/project-management/keywords.controller.ts`
- `backend/src/modules/admin/services/aso-admin.service.ts`

---

#### 2.4 SpyKeywordsController

**Tasks:**
- [ ] Update `SpyKeywordsService` methods to accept `user: User`
- [ ] Update `SpyKeywordsController` to use `ProjectAccessGuard`
- [ ] Write integration tests
- [ ] Update `SpyKeywordsAdminController` to reuse unified service

**Files:**
- `backend/src/modules/project-management/spy-keywords.service.ts`
- `backend/src/modules/project-management/spy-keywords.controller.ts`
- `backend/src/modules/admin/services/spy-keywords-admin.service.ts`

---

#### 2.5 LandingPagesController

**Tasks:**
- [ ] Update `LandingPagesService` methods to accept `user: User`
- [ ] Update `LandingPagesController` to use `ProjectAccessGuard` or `ResourceAccessGuard`
- [ ] Write integration tests

**Files:**
- `backend/src/modules/project-management/landing-pages.service.ts`
- `backend/src/modules/project-management/landing-pages.controller.ts`

---

#### 2.6 SocialChannelsController

**Tasks:**
- [ ] Update `SocialChannelsService` methods to accept `user: User`
- [ ] Create `CompetitorAccessGuard` or use `ResourceAccessGuard` (competitor belongs to project)
- [ ] Update `SocialChannelsController` to use guard
- [ ] Write integration tests

**Files:**
- `backend/src/modules/data-collection/social-channels.service.ts`
- `backend/src/modules/data-collection/social-channels.controller.ts`

---

### Phase 3: Data Collection Domain (Week 2, Days 1-4)

#### 3.1 VideoAdsController & VideoOrganicController

**Tasks:**
- [ ] Update `VideoAdsService` methods to accept `user: User`
- [ ] Update `VideoAdsController` to use `ProjectAccessGuard`
- [ ] Update `VideoOrganicService` methods to accept `user: User`
- [ ] Update `VideoOrganicController` to use `ProjectAccessGuard`
- [ ] Write integration tests
- [ ] Update `VideoAdsAdminController` to reuse unified service
- [ ] Update `VideoOrganicAdminController` to reuse unified service

**Files:**
- `backend/src/modules/data-collection/video-ads.service.ts`
- `backend/src/modules/data-collection/video-ads.controller.ts`
- `backend/src/modules/data-collection/video-organic.service.ts`
- `backend/src/modules/data-collection/video-organic.controller.ts`
- `backend/src/modules/admin/services/video-ads-admin.service.ts`
- `backend/src/modules/admin/services/video-organic-admin.service.ts`

---

#### 3.2 VideosController

**Tasks:**
- [ ] Update `VideosService` methods to accept `user: User`
- [ ] Update `VideosController` to use `ProjectAccessGuard`
- [ ] Write integration tests

**Files:**
- `backend/src/modules/data-collection/videos.service.ts`
- `backend/src/modules/data-collection/videos.controller.ts`

---

#### 3.3 SocialPostsController

**Tasks:**
- [ ] Update `SocialPostsService` methods to accept `user: User`
- [ ] Update `SocialPostsController` to use `ProjectAccessGuard`
- [ ] Write integration tests

**Files:**
- `backend/src/modules/data-collection/social-posts.service.ts`
- `backend/src/modules/data-collection/social-posts.controller.ts`

---

#### 3.4 ReviewsController

**Tasks:**
- [ ] Update `ReviewsService` methods to accept `user: User`
- [ ] Update `ReviewsController` to use `ProjectAccessGuard`
- [ ] Write integration tests
- [ ] Update `DataAdminController` to reuse unified service

**Files:**
- `backend/src/modules/data-collection/reviews.service.ts`
- `backend/src/modules/data-collection/reviews.controller.ts`
- `backend/src/modules/admin/services/data-admin.service.ts`

---

#### 3.5 AppUpdatesController

**Tasks:**
- [ ] Update `AppUpdatesService` methods to accept `user: User`
- [ ] Create `CompetitorAccessGuard` or use `ResourceAccessGuard`
- [ ] Update `AppUpdatesController` to use guard
- [ ] Write integration tests

**Files:**
- `backend/src/modules/data-collection/app-updates.service.ts`
- `backend/src/modules/data-collection/app-updates.controller.ts`

---

### Phase 4: Admin Domain - Project-Scoped Operations (Week 2, Days 5 - Week 3, Days 1-2)

#### 4.1 ProjectAdminController

**Tasks:**
- [ ] Update `ProjectAdminService` to reuse `ProjectService` for project-scoped operations
- [ ] Keep system-wide endpoints separate (`GET /admin/projects` - list all)
- [ ] Update project-scoped endpoints to use unified APIs
- [ ] Mark duplicate endpoints as deprecated

**Files:**
- `backend/src/modules/admin/services/project-admin.service.ts`
- `backend/src/modules/admin/controllers/project-admin.controller.ts`

---

#### 4.2 AsoAdminController

**Tasks:**
- [ ] Update `AsoAdminService` to reuse `KeywordsService` for project-scoped operations
- [ ] Keep system-wide endpoints separate
- [ ] Mark duplicate endpoints as deprecated

**Files:**
- `backend/src/modules/admin/services/aso-admin.service.ts`
- `backend/src/modules/admin/controllers/aso-admin.controller.ts`

---

#### 4.3 SpyKeywordsAdminController

**Tasks:**
- [ ] Update `SpyKeywordsAdminService` to reuse `SpyKeywordsService` for project-scoped operations
- [ ] Keep system-wide endpoints separate
- [ ] Mark duplicate endpoints as deprecated

**Files:**
- `backend/src/modules/admin/services/spy-keywords-admin.service.ts`
- `backend/src/modules/admin/controllers/spy-keywords-admin.controller.ts`

---

#### 4.4 VideoAdsAdminController & VideoOrganicAdminController

**Tasks:**
- [ ] Update `VideoAdsAdminService` to reuse `VideoAdsService` for project-scoped operations
- [ ] Update `VideoOrganicAdminService` to reuse `VideoOrganicService` for project-scoped operations
- [ ] Keep system-wide endpoints separate
- [ ] Mark duplicate endpoints as deprecated

**Files:**
- `backend/src/modules/admin/services/video-ads-admin.service.ts`
- `backend/src/modules/admin/controllers/video-ads-admin.controller.ts`
- `backend/src/modules/admin/services/video-organic-admin.service.ts`
- `backend/src/modules/admin/controllers/video-organic-admin.controller.ts`

---

#### 4.5 DataAdminController

**Tasks:**
- [ ] Update `DataAdminService` to reuse unified services (Reviews, Competitors, etc.)
- [ ] Keep system-wide endpoints separate
- [ ] Mark duplicate endpoints as deprecated

**Files:**
- `backend/src/modules/admin/services/data-admin.service.ts`
- `backend/src/modules/admin/controllers/data-admin.controller.ts`

---

### Phase 5: Frontend Migration (Week 3, Days 3-5)

#### 5.1 Update API Clients

**Tasks:**
- [ ] Update all API clients to use unified endpoints
- [ ] Remove admin-specific clients for project-scoped operations
- [ ] Keep admin clients only for system-wide operations
- [ ] Update TypeScript types/interfaces

---

#### 5.2 Update Components

**Tasks:**
- [ ] Update all components to use unified APIs
- [ ] Test with both USER and ADMIN roles
- [ ] Verify UI works correctly
- [ ] Fix any breaking changes

---

### Phase 6: Cleanup & Documentation (Week 4)

#### 6.1 Remove Deprecated Code

**Tasks:**
- [ ] Remove deprecated admin endpoints (after frontend migration)
- [ ] Remove duplicate service methods
- [ ] Clean up unused guards
- [ ] Remove old ownership validation code

---

#### 6.2 Documentation Updates

**Tasks:**
- [ ] Update API documentation (Swagger/OpenAPI)
- [ ] Update architecture documentation
- [ ] Update developer guides
- [ ] Create migration guide

---

#### 6.3 Final Testing

**Tasks:**
- [ ] Full regression test suite
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] Code review

---

## 5. Testing Strategy

### 5.1 Test Coverage Goals

- **Unit Tests:** > 90% coverage for guards and services
- **Integration Tests:** All endpoints covered
- **E2E Tests:** Critical user flows
- **Security Tests:** All access control scenarios

### 5.2 Test Matrix

| Controller | Unit Tests | Integration Tests | E2E Tests | Security Tests |
|------------|------------|-------------------|-----------|----------------|
| ProjectsController | ✅ | ✅ | ✅ | ✅ |
| CompetitorsController | ✅ | ✅ | ✅ | ✅ |
| KeywordsController | ✅ | ✅ | ✅ | ✅ |
| SpyKeywordsController | ✅ | ✅ | ✅ | ✅ |
| LandingPagesController | ✅ | ✅ | ✅ | ✅ |
| SocialChannelsController | ✅ | ✅ | ✅ | ✅ |
| VideoAdsController | ✅ | ✅ | ✅ | ✅ |
| VideoOrganicController | ✅ | ✅ | ✅ | ✅ |
| SocialPostsController | ✅ | ✅ | ✅ | ✅ |
| ReviewsController | ✅ | ✅ | ✅ | ✅ |
| AppUpdatesController | ✅ | ✅ | ✅ | ✅ |
| All Admin Controllers | ✅ | ✅ | ✅ | ✅ |

---

## 6. Risk Assessment & Mitigation

### 6.1 High Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Breaking existing functionality | High | Medium | Comprehensive testing, gradual migration |
| Security vulnerabilities | High | Low | Security audit, thorough guard testing |
| Performance degradation | Medium | Low | Performance testing, monitoring |

### 6.2 Medium Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Frontend breaking changes | Medium | Medium | Keep backward compatibility, gradual migration |
| Confusion during transition | Medium | Medium | Clear documentation, deprecation notices |

---

## 7. Timeline & Resources

### 7.1 Timeline

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1: Infrastructure | 2 days | Week 1, Day 1 | Week 1, Day 2 |
| Phase 2: Project Management | 3 days | Week 1, Day 3 | Week 1, Day 5 |
| Phase 3: Data Collection | 4 days | Week 2, Day 1 | Week 2, Day 4 |
| Phase 4: Admin Domain | 3 days | Week 2, Day 5 | Week 3, Day 2 |
| Phase 5: Frontend Migration | 3 days | Week 3, Day 3 | Week 3, Day 5 |
| Phase 6: Cleanup | 5 days | Week 4 | Week 4, Day 5 |
| **Total** | **20 days** | | |

### 7.2 Resources Needed

- **Backend Developer:** 1-2 (full-time)
- **Frontend Developer:** 1 (part-time for Phase 5)
- **QA Engineer:** 1 (part-time for testing)
- **DevOps:** 0.25 (for deployment)

---

## 8. Success Criteria

### 8.1 Functional Criteria

- ✅ All existing functionality preserved
- ✅ Role-based access control works correctly for ALL endpoints
- ✅ No breaking changes for end users
- ✅ Admin can access all projects
- ✅ Users can only access own projects

### 8.2 Quality Criteria

- ✅ Code coverage > 80% for new/refactored code
- ✅ All tests passing
- ✅ No security vulnerabilities
- ✅ Performance maintained or improved
- ✅ Documentation updated

### 8.3 Architecture Criteria

- ✅ All project-scoped APIs use unified pattern
- ✅ All services accept `user: User` object
- ✅ Guards handle all access control
- ✅ No duplicate code between user/admin services
- ✅ Consistent URL patterns

---

## 9. Rollback Plan

### 9.1 If Issues Occur

**Immediate Actions:**
1. Revert to previous version (git revert)
2. Restore old guards
3. Re-enable old admin endpoints

**Communication:**
- Notify team immediately
- Document issues
- Plan fix before retry

### 9.2 Rollback Triggers

- Critical security vulnerability found
- Significant performance degradation (>20% slower)
- Breaking changes affecting production users
- Data integrity issues

---

## 10. Post-Refactoring

### 10.1 Monitoring

- Monitor error rates
- Monitor performance metrics
- Monitor security events
- Monitor user feedback

### 10.2 Future Improvements

- Consider permission-based system (if more roles needed)
- Consider fine-grained permissions (per-resource)
- Consider audit logging for admin actions

---

**Refactoring Plan Complete - Ready for Execution!**

