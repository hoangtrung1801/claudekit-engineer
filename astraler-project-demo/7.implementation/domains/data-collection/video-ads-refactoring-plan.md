# Video Ads Refactoring Implementation Plan

> **Refactoring ID:** DC-REF-001  
> **Priority:** P0 - Critical  
> **Complexity:** High  
> **Status:** 🔵 Not Started  
> **Estimated Duration:** 2 weeks

---

## Overview

This refactoring simplifies the video data model by removing the complex Ads Curation workflow and Ad model. The new approach:

- **Video Ads**: Created directly from Ads Library Transparency APIs → `Video` with `type = AD`
- **Video Organic**: Created from social profile crawlers → `Video` with `type = ORGANIC`
- **No Ad Model**: Removed intermediate `Ad` model and curation workflow
- **No Curation Fields**: Removed `curationStatus`, `curatedAt`, `curatedBy`, `isAd`, `adMetadata` from Video model

---

## Reference Documents

- **Database Schema:** `docs/3.technical-design/database-schema.md` (updated)
- **Data Collection TDD:** `docs/3.technical-design/domains/data-collection/domain-tdd.md` (updated)
- **Deprecated:** `docs/1.business-analyst/domains/data-collection/features/ads-curation-workflow/feature-prd.md` (deprecated)
- **Deprecated:** `docs/3.technical-design/domains/data-collection/features/ads-curation-workflow/feature-tdd.md` (deprecated)

---

## 1. Database Schema Refactoring

### 1.1 Remove Ad Model (DC-REF-B-01 to 05)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-01 | Create migration to drop Ad table | 1h | ⬜ |
| DC-REF-B-02 | Remove Ad relations from Project model | 0.5h | ⬜ |
| DC-REF-B-03 | Remove Ad relations from SpyKeyword model | 0.5h | ⬜ |
| DC-REF-B-04 | Remove Ad relations from SocialChannel model | 0.5h | ⬜ |
| DC-REF-B-05 | Remove Ad relations from Video and SocialPost models | 1h | ⬜ |

### 1.2 Simplify Video Model (DC-REF-B-06 to 10)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-06 | Remove `sourceAdId` field from Video model | 0.5h | ⬜ |
| DC-REF-B-07 | Remove `isAd` field from Video model | 0.5h | ⬜ |
| DC-REF-B-08 | Remove `adMetadata` field from Video model | 0.5h | ⬜ |
| DC-REF-B-09 | Remove `curationStatus`, `curatedAt`, `curatedBy` fields from Video model | 0.5h | ⬜ |
| DC-REF-B-10 | Keep `videoUrl`, `videoHdUrl`, `videoSdUrl` fields (used for Video Ads) | - | ✅ |
| DC-REF-B-11 | Update Video indexes: remove curation-related indexes, add `type` index | 0.5h | ⬜ |

### 1.3 Simplify SocialPost Model (DC-REF-B-12 to 15)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-12 | Remove `sourceAdId` field from SocialPost model | 0.5h | ⬜ |
| DC-REF-B-13 | Remove `isAd` field from SocialPost model | 0.5h | ⬜ |
| DC-REF-B-14 | Remove `adMetadata` field from SocialPost model | 0.5h | ⬜ |
| DC-REF-B-15 | Remove `curationStatus`, `curatedAt`, `curatedBy` fields from SocialPost model | 0.5h | ⬜ |

### 1.4 Update SpyKeyword Model (DC-REF-B-16)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-16 | Remove `adsCount` field from SpyKeyword model | 0.5h | ⬜ |

**Database Total: ~8 hours (1 day)**

---

## 2. Backend Code Refactoring

### 2.1 Remove Ads Curation Module (DC-REF-B-20 to 25)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-20 | Delete `ads-curation/` module directory | 0.5h | ⬜ |
| DC-REF-B-21 | Remove AdsCurationService | - | ✅ |
| DC-REF-B-22 | Remove AdContentService | - | ✅ |
| DC-REF-B-23 | Remove AdsCurationController | - | ✅ |
| DC-REF-B-24 | Remove Ads Curation DTOs | - | ✅ |
| DC-REF-B-25 | Remove Ads Curation module registration | 0.5h | ⬜ |

### 2.2 Refactor AdsLibraryProcessor (DC-REF-B-26 to 30)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-26 | Update `saveMetaAd()` to create Video directly with `type = AD` | 3h | ⬜ |
| DC-REF-B-27 | Update `saveTikTokAd()` to create Video directly with `type = AD` | 3h | ⬜ |
| DC-REF-B-28 | Update `saveGoogleAd()` to create Video directly with `type = AD` | 3h | ⬜ |
| DC-REF-B-29 | Remove Ad model creation logic | 1h | ⬜ |
| DC-REF-B-30 | Update to use `saveVideoAd()` helper (creates Video directly) | 2h | ⬜ |

### 2.3 Update Video Service (DC-REF-B-31 to 35)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-31 | Remove references to `sourceAdId` in Video queries | 1h | ⬜ |
| DC-REF-B-32 | Remove references to `isAd` flag in Video queries | 1h | ⬜ |
| DC-REF-B-33 | Remove references to `curationStatus` in Video queries | 1h | ⬜ |
| DC-REF-B-34 | Update Video filters to use `type` field instead of `isAd` | 2h | ⬜ |
| DC-REF-B-35 | Update Video DTOs to remove curation fields | 1h | ⬜ |

### 2.4 Update Admin Module (DC-REF-B-36 to 40)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-36 | Remove Ads Curation endpoints from Admin controller | 1h | ⬜ |
| DC-REF-B-37 | Update Admin Video endpoints to use `type` filter (AD/ORGANIC) | 2h | ⬜ |
| DC-REF-B-38 | Remove Ads Review Queue endpoints | 1h | ⬜ |
| DC-REF-B-39 | Update Admin DTOs to remove Ad-related fields | 1h | ⬜ |
| DC-REF-B-40 | Update Admin service methods to remove Ad queries | 2h | ⬜ |

### 2.5 Update Other Services (DC-REF-B-41 to 45)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-B-41 | Update Hero Video Detection to use `type` field | 1h | ⬜ |
| DC-REF-B-42 | Update AI Analysis to remove Ad model references | 2h | ⬜ |
| DC-REF-B-43 | Update Dashboard aggregations to use `type` field | 2h | ⬜ |
| DC-REF-B-44 | Remove Ad-related event handlers | 1h | ⬜ |
| DC-REF-B-45 | Update all TypeScript types/interfaces | 2h | ⬜ |

**Backend Code Total: ~35 hours (4.5 days)**

---

## 3. Frontend Refactoring

### 3.1 Remove Ads Curation UI (DC-REF-F-01 to 05)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-F-01 | Delete Ads Review Queue page/components | 1h | ⬜ |
| DC-REF-F-02 | Remove Ads Curation routes | 0.5h | ⬜ |
| DC-REF-F-03 | Remove Ads Curation API service methods | 0.5h | ⬜ |
| DC-REF-F-04 | Remove Ads Curation types/interfaces | 0.5h | ⬜ |
| DC-REF-F-05 | Remove Ads Curation navigation items | 0.5h | ⬜ |

### 3.2 Update Video Components (DC-REF-F-06 to 10)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-F-06 | Update Video types to remove `sourceAdId`, `isAd`, `curationStatus` | 1h | ⬜ |
| DC-REF-F-07 | Update Video filters to use `type` (AD/ORGANIC) instead of `isAd` | 2h | ⬜ |
| DC-REF-F-08 | Update Video list components to show type badge | 1h | ⬜ |
| DC-REF-F-09 | Update Video detail components to remove curation fields | 1h | ⬜ |
| DC-REF-F-10 | Update Video cards to remove curation indicators | 1h | ⬜ |

### 3.3 Update Admin Pages (DC-REF-F-11 to 15)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-F-11 | Remove Ads Review Queue page | 1h | ⬜ |
| DC-REF-F-12 | Update Admin Video page to use `type` filter | 2h | ⬜ |
| DC-REF-F-13 | Update Admin Social Channels page (remove Ads Curation actions) | 1h | ⬜ |
| DC-REF-F-14 | Update Admin Competitor page (remove Ads Curation sections) | 1h | ⬜ |
| DC-REF-F-15 | Update Admin navigation (remove Ads Curation menu items) | 0.5h | ⬜ |

**Frontend Total: ~15 hours (2 days)**

---

## 4. Data Migration

### 4.1 Migrate Existing Ad Data (DC-REF-M-01 to 05)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-M-01 | Create migration script to convert Ad records to Video (type=AD) | 4h | ⬜ |
| DC-REF-M-02 | Migrate video ads (Ad.displayFormat = VIDEO) to Video records | 2h | ⬜ |
| DC-REF-M-03 | Migrate image ads (Ad.displayFormat = IMAGE) to SocialPost records | 2h | ⬜ |
| DC-REF-M-04 | Update existing Video records: remove curation fields, set type correctly | 2h | ⬜ |
| DC-REF-M-05 | Verify data migration integrity | 2h | ⬜ |

**Migration Total: ~12 hours (1.5 days)**

---

## 5. Testing

### 5.1 Backend Tests (DC-REF-T-01 to 05)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-T-01 | Update AdsLibraryProcessor tests (direct Video creation) | 3h | ⬜ |
| DC-REF-T-02 | Update Video service tests (remove curation fields) | 2h | ⬜ |
| DC-REF-T-03 | Update Admin service tests (remove Ad queries) | 2h | ⬜ |
| DC-REF-T-04 | Update Hero Video Detection tests | 1h | ⬜ |
| DC-REF-T-05 | Integration tests for Video Ads creation flow | 3h | ⬜ |

### 5.2 Frontend Tests (DC-REF-T-06 to 08)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-T-06 | Update Video component tests | 2h | ⬜ |
| DC-REF-F-07 | Update Admin page tests | 2h | ⬜ |
| DC-REF-F-08 | E2E tests for Video Ads display | 2h | ⬜ |

**Testing Total: ~17 hours (2 days)**

---

## 6. Documentation Updates

### 6.1 Technical Documentation (DC-REF-D-01 to 05)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-REF-D-01 | Mark Ads Curation PRD/SAD/TDD as deprecated | 0.5h | ⬜ |
| DC-REF-D-02 | Update database schema documentation | ✅ | ✅ |
| DC-REF-D-03 | Update Data Collection domain TDD | ✅ | ✅ |
| DC-REF-D-04 | Update API documentation (remove Ads Curation endpoints) | 1h | ⬜ |
| DC-REF-D-05 | Update README with new architecture | 1h | ⬜ |

**Documentation Total: ~2.5 hours**

---

## Summary

| Category | Hours | Days |
|----------|-------|------|
| Database Schema | 8h | 1d |
| Backend Code | 35h | 4.5d |
| Frontend Code | 15h | 2d |
| Data Migration | 12h | 1.5d |
| Testing | 17h | 2d |
| Documentation | 2.5h | 0.5d |
| **Total** | **89.5h** | **~11.5d (2.3 weeks)** |

---

## Migration Strategy

1. **Phase 1: Database Schema** (Day 1)
   - Create migrations to remove Ad model and curation fields
   - Test migrations on staging database

2. **Phase 2: Backend Refactoring** (Days 2-6)
   - Remove Ads Curation module
   - Refactor AdsLibraryProcessor to create Video directly
   - Update all services to remove Ad references

3. **Phase 3: Data Migration** (Day 7-8)
   - Run migration script to convert existing Ad records
   - Verify data integrity

4. **Phase 4: Frontend Refactoring** (Days 9-10)
   - Remove Ads Curation UI
   - Update Video components to use `type` field

5. **Phase 5: Testing & Documentation** (Days 11-12)
   - Update all tests
   - Update documentation
   - Final verification

---

## Rollback Plan

If issues arise:
1. Keep database migrations reversible
2. Maintain feature flags for gradual rollout
3. Keep backup of Ad table data before migration
4. Document rollback procedures

---

## Notes

- This refactoring simplifies the codebase significantly
- Removes ~2000+ lines of Ads Curation code
- Makes Video Ads creation more straightforward
- Aligns with user's requirement for clear separation: Video Ads vs Video Organic
