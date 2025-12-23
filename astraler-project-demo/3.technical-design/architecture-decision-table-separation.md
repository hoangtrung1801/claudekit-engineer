# Architecture Decision: Table Separation vs Shared Tables

**Date**: December 18, 2025  
**Status**: 🔴 **UNDER REVIEW**  
**Decision Type**: Critical Architecture Decision

---

## Problem Statement

The current architecture uses **shared tables** (`SocialChannel`, `VideoAds`, `VideoOrganic`) with classification rules (`projectId` vs `competitorId`). This has caused:

1. **Complex WHERE clauses**: `WHERE projectId IS NOT NULL AND competitorId IS NULL`
2. **Easy to forget classification logic** → Bugs where `source` parameter is not passed
3. **Data integrity violations**: MIXED channels (both `projectId` and `competitorId` set)
4. **Hard-to-maintain code**: Every query must include classification logic
5. **Error-prone**: Easy to misapply rules → data contamination

---

## Proposed Solution: Table Separation

### Architecture Overview

**Separate tables entirely** - no classification rules needed.

```
INTERNAL (Astraler Marketing Platform)          EXTERNAL (Competitor Intelligence)
─────────────────────────────────               ────────────────────────────────
ProjectSocialChannel                            CompetitorSocialChannel
├─ id                                           ├─ id
├─ projectId (required)                         ├─ competitorId (required)
├─ platform                                     ├─ platform
├─ displayName                                  ├─ displayName
└─ ...                                          └─ ...

ProjectVideoAds                                 CompetitorVideoAds
├─ id                                           ├─ id
├─ projectSocialChannelId                       ├─ competitorSocialChannelId
└─ ...                                          └─ ...

ProjectVideoOrganic                             CompetitorVideoOrganic
├─ id                                           ├─ id
├─ projectSocialChannelId                       ├─ competitorSocialChannelId
└─ ...                                          └─ ...
```

---

## Comparison: Shared Tables vs Separate Tables

| Aspect | Shared Tables (Current) | Separate Tables (Proposed) |
|--------|------------------------|----------------------------|
| **Classification Logic** | Required in every query | Not needed - table name IS classification |
| **Query Complexity** | Complex WHERE clauses | Simple - just query the right table |
| **Data Integrity** | Easy to violate (MIXED channels) | Impossible to mix - enforced by schema |
| **Type Safety** | Runtime checks needed | Compile-time TypeScript types |
| **Self-Documenting** | Requires comments/docs | Table names are self-explanatory |
| **Code Duplication** | Low - shared services | Medium - some logic duplication |
| **Migration Effort** | None (current state) | High - requires data migration |
| **Breaking Changes** | None | High - API changes required |
| **Maintenance** | Error-prone | Simpler, less error-prone |
| **Performance** | Same | Same (or slightly better with simpler queries) |

---

## Benefits of Table Separation

1. ✅ **No Classification Logic**: Table name IS the classification
2. ✅ **Self-Documenting**: `ProjectVideoAds` vs `CompetitorVideoAds` is obvious
3. ✅ **Impossible to Mix**: Can't accidentally put competitor data in project table
4. ✅ **Simpler Queries**: Just query the right table, no WHERE filters needed
5. ✅ **Type Safety**: TypeScript types enforce correct usage
6. ✅ **Eliminates Bugs**: No more "forgot to pass source parameter" bugs
7. ✅ **Data Integrity**: Schema enforces separation, no MIXED channels possible

---

## Drawbacks of Table Separation

1. ❌ **Code Duplication**: Some common logic needs duplication or abstraction
2. ❌ **Migration Complexity**: Large migration effort required
3. ❌ **Breaking Changes**: API endpoints need to change
4. ❌ **Union Queries**: If need both types together, requires UNION queries
5. ❌ **Timeline Impact**: Significant development time required

---

## Current Issues (Supporting Table Separation)

### Issue 1: Controller Bug
- **Problem**: `source` parameter not passed to service
- **Root Cause**: Easy to forget classification logic
- **With Separate Tables**: Not possible - different services, different tables

### Issue 2: MIXED Channel Data
- **Problem**: Channel with both `projectId` and `competitorId` set
- **Root Cause**: Classification rules can be violated
- **With Separate Tables**: Impossible - schema enforces separation

### Issue 3: Complex Queries
- **Problem**: Every query needs `WHERE projectId = ? AND competitorId IS NULL`
- **Root Cause**: Classification logic required everywhere
- **With Separate Tables**: Not needed - just query `ProjectSocialChannel`

---

## Recommended Approach

### Option A: Quick Fix (Short-term) - Keep Shared Tables

**Actions**:
1. Fix controller to pass `source` parameter ✅
2. Fix MIXED channel data ✅
3. Add validation to prevent MIXED channels ✅
4. Improve error handling and logging

**Timeline**: 1-2 days  
**Risk**: Low  
**Impact**: Fixes immediate bugs, maintains current architecture

### Option B: Table Separation (Long-term) - Recommended

**Actions**:
1. Create new schema with separate tables
2. Create data migration script
3. Update all services and controllers
4. Update frontend API calls
5. Comprehensive testing

**Timeline**: 2-3 weeks  
**Risk**: Medium (migration complexity)  
**Impact**: Eliminates root cause, prevents future bugs, improves maintainability

---

## Decision Matrix

| Criteria | Weight | Shared Tables (Quick Fix) | Separate Tables (Long-term) |
|----------|--------|---------------------------|----------------------------|
| **Fixes Current Bugs** | High | ✅ Yes (immediate) | ✅ Yes (after migration) |
| **Prevents Future Bugs** | High | ⚠️ Partial (still error-prone) | ✅ Yes (schema enforced) |
| **Development Time** | Medium | ✅ 1-2 days | ❌ 2-3 weeks |
| **Maintainability** | High | ⚠️ Complex queries | ✅ Simple queries |
| **Data Integrity** | High | ⚠️ Can be violated | ✅ Schema enforced |
| **Breaking Changes** | Medium | ✅ None | ❌ High |
| **Code Quality** | Medium | ⚠️ Error-prone | ✅ Cleaner |

---

## Recommendation

### Phase 1: Quick Fix (Immediate - This Week)
1. ✅ Fix controller to pass `source` parameter
2. ✅ Fix MIXED channel data
3. ✅ Add validation to prevent future violations
4. ✅ Improve error handling

**Goal**: Fix critical bugs immediately, restore functionality

### Phase 2: Table Separation (Next Sprint - 2-3 Weeks)
1. Design new schema with separate tables
2. Create migration plan and scripts
3. Implement new services and controllers
4. Update frontend
5. Comprehensive testing and migration

**Goal**: Eliminate root cause, improve long-term maintainability

---

## Implementation Plan for Table Separation

### Phase 1: Schema Changes (Prisma)

**File**: `backend/prisma/schema.prisma`

1. Create Internal Tables:
   - `ProjectSocialChannel` (rename/add from current `SocialChannel` with `projectId`)
   - `ProjectVideoAds` (new table for Internal video ads) - **DO NOT** link to `SpyKeyword`
   - `ProjectVideoOrganic` (new table for Internal organic videos) - **DO NOT** link to `SpyKeyword`

2. Rename External Tables:
   - `CompetitorSocialChannel` (rename from `SocialChannel` with `competitorId`)
   - `CompetitorVideoAds` (rename from `VideoAds` for competitors) - Links to `SpyKeyword`
   - `CompetitorVideoOrganic` (rename from `VideoOrganic` for competitors) - Links to `SpyKeyword`

3. Update Related Models:
   - `SpyKeyword`: **ONLY** links to External tables (`CompetitorVideoAds`, `CompetitorVideoOrganic`)
   - `LandingPage`: Add nullable FKs to both Internal and External tables (one table approach)

### Phase 2: Backend Services

**New Services**:
- `ProjectChannelsService` (Internal channels)
- `ProjectVideoAdsService` (Internal video ads)
- `ProjectVideoOrganicService` (Internal organic videos)

**Renamed Services**:
- `CompetitorChannelsService` (External channels)
- `CompetitorVideoAdsService` (External video ads)
- `CompetitorVideoOrganicService` (External organic videos)

**Updated Processors**:
- `AdsLibraryProcessor`: Works with **BOTH Internal AND External** data:
  - Internal: Query `ProjectSocialChannel`, create `ProjectVideoAds` and `ProjectVideoOrganic` (for internal KPIs/OKRs)
  - External: Query `CompetitorSocialChannel`, create `CompetitorVideoAds` and `CompetitorVideoOrganic` (for competitor intelligence)
  - Both need crawling for performance measurement (KPI, OKR, growth metrics)
- `SocialContentProcessor`: Handles both Internal and External (based on `channelType` parameter)
- `SocialChannelProcessor`: Handles both Internal and External (based on `channelType` parameter)

### Phase 3: API Endpoints

**Internal Endpoints**:
- `POST /api/projects/:projectId/channels` - Add internal channel
- `GET /api/projects/:projectId/channels` - List internal channels
- `GET /api/projects/:projectId/video-ads` - Internal video ads
- `GET /api/projects/:projectId/video-organic` - Internal organic videos

**External Endpoints**:
- `POST /api/projects/:projectId/competitors/:competitorId/channels` - Add competitor channel
- `GET /api/projects/:projectId/competitors/:competitorId/channels` - Competitor channels
- `GET /api/projects/:projectId/competitors/video-ads` - All competitor video ads
- `GET /api/projects/:projectId/competitors/video-organic` - All competitor organic

### Phase 4: Data Migration

1. Create new tables (via Prisma migration)
2. Migrate Internal data: `WHERE projectId IS NOT NULL AND competitorId IS NULL`
3. Migrate External data: `WHERE competitorId IS NOT NULL AND projectId IS NULL` (pure External channels)
4. **MIXED Channels Decision**: Review each MIXED channel (both `projectId` and `competitorId` set) case-by-case:
   - If it's actually Astraler's channel (Internal): Migrate to `ProjectSocialChannel`
   - If it's actually a competitor channel (External): Migrate to `CompetitorSocialChannel`
   - This may require manual review or business logic to determine correct classification
5. Migrate VideoAds/VideoOrganic based on channel classification
6. Update `SpyKeyword` relations: Only link to External tables (`CompetitorVideoAds`, `CompetitorVideoOrganic`)
7. Update `LandingPage` relations: Add nullable FKs to both Internal and External tables
8. Verify data integrity
9. Drop old tables after verification

### Phase 5: Frontend Updates

- Update API calls to use new endpoints
- Remove `source` parameter logic (no longer needed)
- Update TypeScript types

---

## Risk Assessment

### Risks of Table Separation

1. **Migration Risk**: Data loss or corruption during migration
   - **Mitigation**: Comprehensive backup, staged migration, rollback plan

2. **Breaking Changes**: API changes break existing integrations
   - **Mitigation**: Version API endpoints, maintain backward compatibility during transition

3. **Timeline Risk**: Takes longer than expected
   - **Mitigation**: Phased approach, thorough planning

4. **Code Duplication**: Duplicate logic in services
   - **Mitigation**: Extract common logic to base classes or utilities

---

## Conclusion

**Immediate Action**: Implement quick fixes (Option A) to restore functionality.

**Long-term Strategy**: Plan and execute table separation (Option B) in next sprint to eliminate root cause and improve maintainability.

**Decision**: 
- **Short-term**: Keep shared tables, fix bugs immediately
- **Long-term**: Migrate to separate tables for better architecture
