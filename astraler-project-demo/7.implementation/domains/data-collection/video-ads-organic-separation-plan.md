# Video Ads & Video Organic Table Separation Implementation Plan

> **Refactoring ID:** DC-REF-002  
> **Priority:** P0 - Critical  
> **Complexity:** Very High  
> **Status:** 🔵 Not Started  
> **Estimated Duration:** 3-4 weeks

---

## Overview

This is a **major database schema refactoring** that separates the unified `Video` table into two distinct tables: `VideoAds` and `VideoOrganic`. This separation reflects the fundamental differences in data structure, sources, and use cases between ads and organic videos.

### Key Changes Summary

**Before:**
```
Single Video table with type enum (AD/ORGANIC)
- Many nullable fields (videoUrl/videoHdUrl for ads, views/likes for organic)
- Complex queries with type filtering
- Mixed data structures
```

**After:**
```
Two separate tables: VideoAds and VideoOrganic
- VideoAds: Ad-specific fields (impressions, spend, advertiser info, ad video URLs)
- VideoOrganic: Engagement metrics (views, likes, comments, shares)
- Clear separation, no nullable fields that don't apply
- Simpler, more focused queries
```

---

## Reference Documents

- **Schema Proposal:** `docs/3.technical-design/database-schema-separation-proposal.md`
- **Database Schema:** `docs/3.technical-design/database-schema.md` (updated)
- **Data Collection TDD:** `docs/3.technical-design/domains/data-collection/domain-tdd.md` (to be updated)
- **Admin TDD:** `docs/3.technical-design/domains/admin/domain-tdd.md` (to be updated)

---

## 1. Database Schema Migration

### 1.1 Create New Tables (DC-SEP-B-01 to 04)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-B-01 | Create VideoAds table migration | 2h | ⬜ |
| DC-SEP-B-02 | Create VideoOrganic table migration | 2h | ⬜ |
| DC-SEP-B-03 | Create VideoAdsSnapshot table migration | 1h | ⬜ |
| DC-SEP-B-04 | Create VideoOrganicSnapshot table migration | 1h | ⬜ |

### 1.2 Update Relations (DC-SEP-B-05 to 08)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-B-05 | Update Project model: Add videoAds and videoOrganics relations, remove videos | 1h | ⬜ |
| DC-SEP-B-06 | Update SocialChannel model: Add videoAds and videoOrganics relations, remove videos | 1h | ⬜ |
| DC-SEP-B-07 | Update SpyKeyword model: Add videoAds and videoOrganics relations, remove videos | 1h | ⬜ |
| DC-SEP-B-08 | Remove VideoType enum (no longer needed) | 0.5h | ⬜ |

### 1.3 Data Migration Script (DC-SEP-B-09 to 12)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-B-09 | Create migration script to convert Video → VideoAds/VideoOrganic | 4h | ⬜ |
| DC-SEP-B-10 | Migrate VideoSnapshot → VideoAdsSnapshot/VideoOrganicSnapshot | 2h | ⬜ |
| DC-SEP-B-11 | Verify data integrity after migration | 2h | ⬜ |
| DC-SEP-B-12 | Drop old Video and VideoSnapshot tables | 1h | ⬜ |

**Database Total: ~18 hours (2.25 days)**

---

## 2. Backend Code Refactoring

### 2.1 Prisma Schema Updates (DC-SEP-B-20 to 25)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-B-20 | Update Prisma schema with VideoAds and VideoOrganic models | 2h | ⬜ |
| DC-SEP-B-21 | Update Prisma schema relations | 1h | ⬜ |
| DC-SEP-B-22 | Generate Prisma client | 0.5h | ⬜ |
| DC-SEP-B-23 | Update all Prisma imports/types | 2h | ⬜ |
| DC-SEP-B-24 | Fix TypeScript compilation errors | 3h | ⬜ |
| DC-SEP-B-25 | Update Prisma queries throughout codebase | 8h | ⬜ |

### 2.2 Services Refactoring (DC-SEP-B-26 to 35)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-B-26 | Create VideoAdsService (or refactor VideoService) | 4h | ⬜ |
| DC-SEP-B-27 | Create VideoOrganicService (or refactor VideoService) | 4h | ⬜ |
| DC-SEP-B-28 | Update AdsLibraryProcessor to create VideoAds records | 3h | ⬜ |
| DC-SEP-B-29 | Update SocialContentProcessor to create VideoOrganic records | 3h | ⬜ |
| DC-SEP-B-30 | Update Hero Video Detection service (handle both types) | 3h | ⬜ |
| DC-SEP-B-31 | Update AI Analysis service (handle both types) | 3h | ⬜ |
| DC-SEP-B-32 | Update Dashboard aggregation service (handle both types) | 4h | ⬜ |
| DC-SEP-B-33 | Update Event handlers (VideoCreated events) | 2h | ⬜ |
| DC-SEP-B-34 | Remove VideoService if split into separate services | 1h | ⬜ |
| DC-SEP-B-35 | Update all service dependencies | 3h | ⬜ |

### 2.3 Controllers Refactoring (DC-SEP-B-36 to 42)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-B-36 | Create VideoAdsController with CRUD endpoints | 4h | ⬜ |
| DC-SEP-B-37 | Create VideoOrganicController with CRUD endpoints | 4h | ⬜ |
| DC-SEP-B-38 | Update Admin VideoAdsController (if separate from user) | 2h | ⬜ |
| DC-SEP-B-39 | Update Admin VideoOrganicController (if separate from user) | 2h | ⬜ |
| DC-SEP-B-40 | Remove old VideoController | 1h | ⬜ |
| DC-SEP-B-41 | Update API routes configuration | 1h | ⬜ |
| DC-SEP-B-42 | Update Swagger/API documentation | 2h | ⬜ |

### 2.4 DTOs & Types (DC-SEP-B-43 to 48)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-B-43 | Create VideoAds DTOs (CreateVideoAdsDto, UpdateVideoAdsDto, etc.) | 2h | ⬜ |
| DC-SEP-B-44 | Create VideoOrganic DTOs (CreateVideoOrganicDto, UpdateVideoOrganicDto, etc.) | 2h | ⬜ |
| DC-SEP-B-45 | Update TypeScript types/interfaces | 3h | ⬜ |
| DC-SEP-B-46 | Remove VideoType enum from code | 1h | ⬜ |
| DC-SEP-B-47 | Update validation schemas | 2h | ⬜ |
| DC-SEP-B-48 | Update API response types | 2h | ⬜ |

**Backend Code Total: ~70 hours (8.75 days)**

---

## 3. Frontend Code Refactoring

### 3.1 Types & Interfaces (DC-SEP-F-01 to 05)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-F-01 | Create VideoAds TypeScript interface | 1h | ⬜ |
| DC-SEP-F-02 | Create VideoOrganic TypeScript interface | 1h | ⬜ |
| DC-SEP-F-03 | Remove Video type (or keep as union type if needed) | 1h | ⬜ |
| DC-SEP-F-04 | Update all Video type references | 3h | ⬜ |
| DC-SEP-F-05 | Remove VideoType enum from frontend | 0.5h | ⬜ |

### 3.2 API Services (DC-SEP-F-06 to 10)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-F-06 | Create VideoAds API service (`/api/video-ads`) | 2h | ⬜ |
| DC-SEP-F-07 | Create VideoOrganic API service (`/api/videos`) | 2h | ⬜ |
| DC-SEP-F-08 | Update Admin VideoAds API service | 1h | ⬜ |
| DC-SEP-F-09 | Update Admin VideoOrganic API service | 1h | ⬜ |
| DC-SEP-F-10 | Remove old Video API service | 0.5h | ⬜ |

### 3.3 Components (DC-SEP-F-11 to 20)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-F-11 | Create VideoAdsList component | 3h | ⬜ |
| DC-SEP-F-12 | Create VideoOrganicList component | 3h | ⬜ |
| DC-SEP-F-13 | Create VideoAdsCard component | 2h | ⬜ |
| DC-SEP-F-14 | Create VideoOrganicCard component | 2h | ⬜ |
| DC-SEP-F-15 | Create VideoAdsDetail component | 3h | ⬜ |
| DC-SEP-F-16 | Create VideoOrganicDetail component | 3h | ⬜ |
| DC-SEP-F-17 | Update Video player component (handle both types) | 2h | ⬜ |
| DC-SEP-F-18 | Update Video filters (separate for each type) | 2h | ⬜ |
| DC-SEP-F-19 | Remove old Video components | 1h | ⬜ |
| DC-SEP-F-20 | Update all Video component references | 4h | ⬜ |

### 3.4 Pages (DC-SEP-F-21 to 26)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-F-21 | Create VideoAdsPage (`/video-ads`) | 3h | ⬜ |
| DC-SEP-F-22 | Update VideosPage to VideoOrganicPage (`/videos`) | 3h | ⬜ |
| DC-SEP-F-23 | Create Admin VideoAdsPage (`/admin/video-ads`) | 3h | ⬜ |
| DC-SEP-F-24 | Update Admin VideosPage to VideoOrganicPage (`/admin/videos`) | 3h | ⬜ |
| DC-SEP-F-25 | Update Project VideosPage (if exists) | 2h | ⬜ |
| DC-SEP-F-26 | Update routes configuration | 1h | ⬜ |

**Frontend Code Total: ~45 hours (5.5 days)**

---

## 4. Testing

### 4.1 Backend Tests (DC-SEP-T-01 to 08)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-T-01 | Update VideoAdsService tests | 3h | ⬜ |
| DC-SEP-T-02 | Update VideoOrganicService tests | 3h | ⬜ |
| DC-SEP-T-03 | Update AdsLibraryProcessor tests | 2h | ⬜ |
| DC-SEP-T-04 | Update SocialContentProcessor tests | 2h | ⬜ |
| DC-SEP-T-05 | Update Hero Video Detection tests | 2h | ⬜ |
| DC-SEP-T-06 | Update API endpoint tests | 4h | ⬜ |
| DC-SEP-T-07 | Integration tests for VideoAds creation | 2h | ⬜ |
| DC-SEP-T-08 | Integration tests for VideoOrganic creation | 2h | ⬜ |

### 4.2 Frontend Tests (DC-SEP-T-09 to 12)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-T-09 | Update VideoAds component tests | 2h | ⬜ |
| DC-SEP-T-10 | Update VideoOrganic component tests | 2h | ⬜ |
| DC-SEP-T-11 | Update API service tests | 2h | ⬜ |
| DC-SEP-T-12 | E2E tests for both video types | 4h | ⬜ |

**Testing Total: ~30 hours (3.75 days)**

---

## 5. Documentation Updates

### 5.1 Technical Documentation (DC-SEP-D-01 to 06)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SEP-D-01 | Update database schema document | ✅ | ✅ |
| DC-SEP-D-02 | Update Data Collection TDD | 3h | ⬜ |
| DC-SEP-D-03 | Update Admin TDD | 2h | ⬜ |
| DC-SEP-D-04 | Update API documentation | 2h | ⬜ |
| DC-SEP-D-05 | Update README | 1h | ⬜ |
| DC-SEP-D-06 | Create migration guide | 2h | ⬜ |

**Documentation Total: ~10 hours (1.25 days)**

---

## Summary

| Category | Hours | Days |
|----------|-------|------|
| Database Schema | 18h | 2.25d |
| Backend Code | 70h | 8.75d |
| Frontend Code | 45h | 5.5d |
| Testing | 30h | 3.75d |
| Documentation | 10h | 1.25d |
| **Total** | **173h** | **~21.5d (4.3 weeks)** |

---

## Migration Strategy

### Phase 1: Database Schema (Week 1)
1. Create new tables (VideoAds, VideoOrganic, snapshots)
2. Update relations
3. Create migration script
4. Test migration on staging

### Phase 2: Backend Refactoring (Weeks 2-3)
1. Update Prisma schema
2. Refactor services (VideoAdsService, VideoOrganicService)
3. Refactor processors (AdsLibraryProcessor, SocialContentProcessor)
4. Refactor controllers
5. Update DTOs and types

### Phase 3: Data Migration (Week 3)
1. Run migration script on staging
2. Verify data integrity
3. Run migration on production (with backup)
4. Drop old tables

### Phase 4: Frontend Refactoring (Week 3-4)
1. Update types and interfaces
2. Create new API services
3. Create new components
4. Update pages and routes

### Phase 5: Testing & Documentation (Week 4)
1. Update all tests
2. Update documentation
3. Final verification

---

## Rollback Plan

If issues arise:
1. Keep old Video table until migration verified
2. Maintain feature flags for gradual rollout
3. Keep backup of Video table before migration
4. Document rollback procedures
5. Test rollback on staging first

---

## Critical Notes

1. **Breaking Changes:**
   - All Video API endpoints will change
   - Frontend components need complete refactoring
   - Database queries need rewriting

2. **Data Migration:**
   - Must migrate all existing Video records
   - Must migrate all VideoSnapshot records
   - Verify data integrity at each step

3. **API Compatibility:**
   - Consider API versioning or backward compatibility layer
   - Or accept breaking changes and update all clients

4. **Testing:**
   - Extensive testing required
   - Test migration script thoroughly
   - Test all video-related features

---

## Notes

- This is a very large refactoring affecting the entire codebase
- Consider doing this in phases if possible
- Ensure all stakeholders are aware of breaking changes
- Plan for downtime during migration if needed
