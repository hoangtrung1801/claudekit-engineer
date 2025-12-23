# Keyword Spy Implementation Plan

> **Feature ID:** PM-F08  
> **Priority:** P1 - High  
> **Complexity:** Medium  
> **Status:** 🔵 Not Started  
> **Estimated Duration:** 2 weeks

---

## Reference Documents

- **PRD:** `docs/1.business-analyst/domains/project-management/features/keyword-spy/feature-prd.md`
- **SAD:** `docs/2.solution-architect/domains/project-management/features/keyword-spy/feature-sad.md`
- **TDD:** `docs/3.technical-design/domains/project-management/features/keyword-spy/feature-tdd.md`
- **UI Design:** `docs/4.ui-design/domains/project-management/keyword-spy-ui.md`

---

## 1. Prerequisites

- [ ] Project Management module exists
- [ ] Prisma schema updated with SpyKeyword model
- [ ] Database migration created and applied
- [ ] Event emitter configured

---

## 2. Backend Implementation Tasks

### 2.1 Database Schema (PM-KS-B-01 to 03)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-B-01 | Create Prisma migration for SpyKeyword model | 1h | ⬜ |
| PM-KS-B-02 | Update Ad, Video, SocialPost models with spyKeywordId | 1h | ⬜ |
| PM-KS-B-03 | Update Project model with spyKeywords relation | 0.5h | ⬜ |

### 2.2 Service Implementation (PM-KS-B-04 to 10)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-B-04 | Create SpyKeywordsService with create() method | 2h | ⬜ |
| PM-KS-B-05 | Implement findAll() with filtering and pagination | 2h | ⬜ |
| PM-KS-B-06 | Implement findOne() with stats | 1h | ⬜ |
| PM-KS-B-07 | Implement update() method | 1.5h | ⬜ |
| PM-KS-B-08 | Implement remove() method | 1h | ⬜ |
| PM-KS-B-09 | Implement triggerCrawl() with event emission | 1.5h | ⬜ |
| PM-KS-B-10 | Implement getResults() for discovered content | 2h | ⬜ |
| PM-KS-B-11 | Implement updateStats() helper method | 1h | ⬜ |

### 2.3 Controller & DTOs (PM-KS-B-12 to 17)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-B-12 | Create CreateSpyKeywordDto with validation | 1h | ⬜ |
| PM-KS-B-13 | Create UpdateSpyKeywordDto with validation | 1h | ⬜ |
| PM-KS-B-14 | Create SpyKeywordQueryDto for filtering | 1h | ⬜ |
| PM-KS-B-15 | Create SpyKeywordsController with all endpoints | 3h | ⬜ |
| PM-KS-B-16 | Add API documentation (Swagger decorators) | 1h | ⬜ |
| PM-KS-B-17 | Register SpyKeywordsController in module | 0.5h | ⬜ |

### 2.4 Events & Integration (PM-KS-B-18 to 20)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-B-18 | Create SpyKeywordEvents constants | 0.5h | ⬜ |
| PM-KS-B-19 | Update AdsLibraryProcessor to support spy keywords | 4h | ⬜ |
| PM-KS-B-20 | Update SocialContentProcessor to support spy keywords | 3h | ⬜ |

### 2.5 Testing (PM-KS-B-21 to 24)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-B-21 | Unit tests for SpyKeywordsService | 3h | ⬜ |
| PM-KS-B-22 | Integration tests for API endpoints | 2h | ⬜ |
| PM-KS-B-23 | E2E tests for complete workflow | 2h | ⬜ |
| PM-KS-B-24 | Test stats updates after crawl | 1h | ⬜ |

**Backend Total: ~32 hours (4 days)**

---

## 3. Frontend Implementation Tasks

### 3.1 API Client (PM-KS-F-01 to 02)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-F-01 | Create API client functions for spy keywords | 2h | ⬜ |
| PM-KS-F-02 | Add TypeScript types/interfaces | 1h | ⬜ |

### 3.2 Components (PM-KS-F-03 to 08)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-F-03 | Create SpyKeywordsListPage component | 4h | ⬜ |
| PM-KS-F-04 | Create CreateSpyKeywordModal component | 3h | ⬜ |
| PM-KS-F-05 | Create EditSpyKeywordModal component | 2h | ⬜ |
| PM-KS-F-06 | Create SpyKeywordCard component | 2h | ⬜ |
| PM-KS-F-07 | Create SpyKeywordDetailModal component | 3h | ⬜ |
| PM-KS-F-08 | Create SpyKeywordFilters component | 2h | ⬜ |

### 3.3 Hooks & State (PM-KS-F-09 to 11)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-F-09 | Create useSpyKeywords hook | 2h | ⬜ |
| PM-KS-F-10 | Create useSpyKeywordActions hook | 2h | ⬜ |
| PM-KS-F-11 | Add routing for spy keywords page | 1h | ⬜ |

### 3.4 Integration (PM-KS-F-12 to 13)

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-F-12 | Add navigation link in Project sidebar | 1h | ⬜ |
| PM-KS-F-13 | Add empty states and error handling | 2h | ⬜ |

**Frontend Total: ~27 hours (3.5 days)**

---

## 4. Testing & QA

| ID | Task | Est. | Status |
|----|------|------|--------|
| PM-KS-QA-01 | Manual testing: Create keyword with multiple platforms | 1h | ⬜ |
| PM-KS-QA-02 | Manual testing: Filter and search keywords | 1h | ⬜ |
| PM-KS-QA-03 | Manual testing: Trigger manual crawl | 1h | ⬜ |
| PM-KS-QA-04 | Manual testing: View discovered content | 1h | ⬜ |
| PM-KS-QA-05 | Verify stats update after crawl | 0.5h | ⬜ |

**QA Total: ~4.5 hours**

---

## 5. Dependencies

- Database schema migration must be applied first
- AdsLibraryProcessor updates depend on backend service completion
- Frontend depends on backend API completion

---

## 6. Acceptance Criteria

- [ ] User can create spy keyword with multiple platform selections
- [ ] User can view list of spy keywords with stats
- [ ] User can update keyword platforms, description, tags, status
- [ ] User can delete spy keywords
- [ ] User can manually trigger crawl for keywords
- [ ] User can view discovered content (ads, videos, posts) per keyword
- [ ] System tracks stats (counts) for each keyword
- [ ] AdsLibraryProcessor uses spy keywords for crawling
- [ ] Stats update correctly after crawl completes

---

## 7. Notes

- Stats are denormalized for performance (adsCount, videosCount, postsCount)
- Keyword text is immutable (cannot update, must delete and recreate)
- One keyword per project (unique constraint on projectId + text)
- Integration with existing crawl system via events

