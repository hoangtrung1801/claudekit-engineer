# Data Collection Backend Implementation Plan

> **Domain:** Data Collection
> **Status:** 🟢 Mostly Complete (Refactoring Done)
> **Created:** December 13, 2024
> **Last Updated:** December 17, 2024
> **Progress:** 67/70 tasks completed (96%)
> **Priority:** P0 - Critical
> **Phase:** 2 (Data Engine) - Refactoring Complete

---

## ⚠️ Scope Adjustments

| Feature | Status | Notes |
|---------|--------|-------|
| **YouTube Crawler** | 🟡 Deferred to Phase 2.1 | Lower priority for MVP |
| **Google Play Store** | 🔴 Backlog | SearchAPI does not support, need to find another provider |
| **Landing Page Crawler** | ✅ Included | Only extract social links (does not crawl content) |

---

## 1. Overview

This plan covers the backend implementation for **Data Collection** domain, including:
- BullMQ queue setup for job processing
- Apify adapter for social media scraping
- Store crawler (App Store only - Google Play deferred)
- Social channel & content crawlers
- Landing page crawler
- Scheduling system
- Error handling & rate limiting

**Reference Documents:**
- Domain Planning: `docs/5.planning-setup/domains/data-collection/domain-planning.md`
- Domain TDD: `docs/3.technical-design/domains/data-collection/domain-tdd.md`

**Estimated Duration:** 6 weeks  
**Dependencies:** Project Management (Competitors, Social Channels)

---

## 2. Prerequisites

- [ ] Project Management Backend completed
- [ ] Redis server running
- [ ] Apify API key configured
- [ ] Event emitter configured

---

## 3. API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/crawl/force-refresh/:competitorId` | Force immediate crawl | Yes |
| GET | `/api/crawl/status/:jobId` | Get job status | Yes |
| GET | `/api/crawl/queue/stats` | Queue statistics | Yes (Admin) |

---

## 4. Implementation Tasks

### 4.1 Infrastructure Setup (DC-I-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-I-001 | Install BullMQ and Redis dependencies | 1h | ✅ |
| DC-I-002 | Configure Redis connection in NestJS | 2h | ✅ |
| DC-I-003 | Create crawl-queue queue definition | 1h | ✅ |
| DC-I-004 | Setup Bull Board for monitoring | 2h | ✅ |
| DC-I-005 | Configure job options (retries, backoff) | 2h | ✅ |

### 4.2 Apify Adapter (DC-AP-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-AP-001 | Create ApifyAdapter service | 4h | ✅ |
| DC-AP-002 | Implement Apify API authentication | 2h | ✅ |
| DC-AP-003 | Create response type definitions | 2h | ✅ |
| DC-AP-004 | Implement error handling wrapper | 2h | ✅ |
| DC-AP-005 | Implement actor run and wait | 2h | ✅ |

### 4.3 Store Crawler (DC-ST-*) - Apple App Store Only

> ⚠️ **Note**: Google Play Store (DC-ST-003) moved to backlog - pending provider research.  
> ⚠️ **Important**: Store Crawler must collect the same comprehensive metadata as Project Info crawler (description, rating, ratingsCount, bundleId, screenshots) for consistency.

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-ST-001 | Create StoreProcessor class | 2h | ✅ |
| DC-ST-002 | Implement App Store metadata fetch | 3h | ✅ |
| ~~DC-ST-003~~ | ~~Implement Play Store metadata fetch~~ | ~~3h~~ | 🔴 Backlog |
| DC-ST-004 | Save competitor metadata to database (name, developer, icon, category) | 2h | ✅ |
| DC-ST-004A | Add description, rating, ratingsCount, bundleId fields to Competitor model | 1h | ✅ |
| DC-ST-004B | Update StoreProcessor to save description, rating, ratingsCount, bundleId | 1h | ✅ |
| DC-ST-005 | Create CompetitorScreenshot model and save screenshots | 2h | ✅ |
| DC-ST-006 | Fetch and save reviews | 3h | ✅ |
| DC-ST-007 | Fetch and save app updates | 2h | ✅ |

### 4.4 Social Channel Crawler (DC-SC-*)

> ⚠️ **Note**: YouTube (DC-SC-003) moved to Phase 2.1 - lower priority for MVP.

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SC-001 | Create SocialChannelProcessor class | 2h | ✅ |
| DC-SC-002 | Implement TikTok profile fetch | 3h | ✅ |
| ~~DC-SC-003~~ | ~~Implement YouTube channel fetch~~ | ~~3h~~ | 🟡 Phase 2.1 |
| DC-SC-004 | Implement Instagram profile fetch | 3h | ✅ |
| DC-SC-005 | Implement Facebook page fetch | 3h | ✅ |
| DC-SC-006 | Save channel data and create snapshot | 2h | ✅ |
| DC-SC-007 | Emit event for content crawl | 1h | ✅ |

### 4.5 Social Content Crawler (DC-CC-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-CC-001 | Create SocialContentProcessor class | 2h | ✅ |
| DC-CC-002 | Implement video list fetch (all platforms) | 4h | ✅ |
| DC-CC-003 | Upsert videos to database | 2h | ✅ |
| DC-CC-004 | Create video snapshots | 1h | ✅ |
| DC-CC-005 | Implement posts fetch | 3h | ✅ |
| DC-CC-006 | Upsert posts to database | 2h | ✅ |
| DC-CC-007 | Emit video.created event | 1h | ✅ |

### 4.6 Landing Page Crawler (DC-LP-*) - Social Link Extraction Only

> ⚠️ **Scope**: Only extract social links from landing page. DOES NOT crawl full content/copywriting.

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-LP-001 | Setup Playwright service | 2h | ✅ (using fetch) |
| DC-LP-002 | Create LandingPageProcessor | 2h | ✅ |
| DC-LP-003 | Implement social link extraction (TikTok, YouTube, IG, FB, X) | 3h | ✅ |
| DC-LP-004 | Emit social.discovered event | 1h | ✅ |

### 4.7 Ads Library Crawler (DC-ADS-*) – Initial Implementation (Keywords-Centric)

> ✅ **Completed**: December 15, 2024  
> **Original Scope**: Crawl ads from Meta, TikTok, and Google Ads Library using ASO keywords from Project's Keyword table.

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-ADS-001 | Create AdsLibraryProcessor class | 2h | ✅ |
| DC-ADS-002 | Add ADS_LIBRARY_CRAWL to CrawlJobType enum | 0.5h | ✅ |
| DC-ADS-003 | Create AdsLibraryCrawlJobData type (projectId, keywordId?, platform?) | 1h | ✅ |
| DC-ADS-004 | Implement fetch keywords from Project's Keyword table | 1h | ✅ |
| DC-ADS-005 | Implement Meta Ads Library crawl using SearchAPI (keyword-based) | 3h | ✅ |
| DC-ADS-006 | Implement TikTok Ads Library crawl using SearchAPI (keyword-based) | 3h | ✅ |
| DC-ADS-007 | Implement Google Ads Library crawl using SearchAPI (domain-based) | 3h | ✅ |
| DC-ADS-008 | Save ads metadata to database (dedicated Ad model) | 2h | ✅ |
| DC-ADS-009 | Link ads to Project and Keyword (if keywordId provided) | 1h | ✅ |
| DC-ADS-010 | Emit ads.crawled event for downstream processing | 1h | ✅ |
| DC-ADS-011 | Update SchedulerService for scheduled ads crawl (every 4h) | 1h | ✅ |
| DC-ADS-012 | Add API endpoint for manual ads crawl trigger | 1h | ✅ |

### 4.7b Ads Library Crawler Refactor – Advertiser-Centric Video Ads (DC-ADS-R-*)

> ✅ **COMPLETED**: December 2024  
> **Scope**: Refactored Ads Library crawler to be **advertiser-centric** and aligned with updated schema:
> - Use `SocialChannel.advertiserId` as the primary search key per platform.
> - Use project-level keywords (Keyword/SpyKeyword) as optional filters.
> - Creates VideoAds records directly (no intermediate Ad model).
> - Supports multiple modes: advertiserIds, socialChannelId, spyKeywordId, keywordId.

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-ADS-R-01 | Update AdsLibraryCrawlJobData to support advertiser-driven queries (link to SocialChannel IDs where needed) | 2h | ✅ |
| DC-ADS-R-02 | Implement lookup of advertisers from SocialChannel (with non-null advertiserId, competitor-linked or independent) per project | 3h | ✅ |
| DC-ADS-R-03 | Refactor Meta Ads crawl to use advertiserId + optional keyword filters | 3h | ✅ |
| DC-ADS-R-04 | Refactor TikTok Ads crawl to use advertiserId + optional keyword filters | 3h | ✅ |
| DC-ADS-R-05 | Refactor Google Ads Transparency crawl to use advertiserId instead of domain | 3h | ✅ |
| DC-ADS-R-06 | Ensure VideoAds records link back to SocialChannel/Competitor when possible (without breaking existing data) | 2h | ✅ |
| DC-ADS-R-07 | Document and enforce that only video ads are materialized into VideoAds table (not Video table) | 2h | ✅ |
| DC-ADS-R-08 | Update ads.crawled event payload description to include advertiser-centric context | 1h | ✅ |

**Implementation Notes:**
- Refactoring completed in `backend/src/modules/data-collection/processors/ads-library.processor.ts`
- Methods implemented: `processAdvertiserCrawl()`, `processSocialChannelAdvertiserCrawl()`, `processSpyKeywordCrawl()`
- VideoAds table created via migration (20251217012034_video_ads_organic_separation)
- Ads Curation workflow removed - VideoAds created directly from Ads Library APIs

#### 4.7c TikTok Ads Lock (Product Decision – Dec 2025)

> **Context:** TikTok Ads Library data has been evaluated as low signal / high noise for this product phase. To control complexity and cost, TikTok ads crawling is **locked/disabled**, while Meta + Google Ads remain supported.

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-ADS-L-01 | Remove/disable TikTok‑specific branches in AdsLibraryProcessor so that no new TikTok VideoAds are created | 2h | ⬜ |
| DC-ADS-L-02 | Ensure scheduler and manual triggers do not enqueue TikTok Ads crawl jobs | 1h | ⬜ |
| DC-ADS-L-03 | Update feature flags / configuration so TikTok Ads is treated as \"off\" for all environments | 1h | ⬜ |
| DC-ADS-L-04 | Verify DB: no TikTok VideoAds are being written after lock is enabled | 1h | ⬜ |

**Notes:**
- Existing TikTok VideoAds data may remain in the database for historical analysis, but no **new** records should be created after the lock.
- Frontend UI must not expose TikTok‑specific filters as active options on the Video Ads page (see UI design docs).

#### 4.7d Meta Ads CTA Fields & Landing Page Discovery Enhancement (DC-ADS-CTA-*)

> **Context (Dec 2025):** Meta Ads Library response includes `cta_text`, `cta_type` (always present), and optional `link_url`. These fields must be extracted and stored in `VideoAds` records. When `link_url` is present, it represents a landing page discovered from the ad, which must be tracked as a `LandingPage` record with `discoverySource = ADS_LIBRARY`.

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-ADS-CTA-01 | Update database schema: Add `ctaText` and `ctaType` fields to `VideoAds` model | 1h | ⬜ |
| DC-ADS-CTA-02 | Update database schema: Add `discoverySource` enum and discovery tracking fields to `LandingPage` model | 2h | ⬜ |
| DC-ADS-CTA-03 | Create migration script to add new fields to `VideoAds` and `LandingPage` tables | 1h | ⬜ |
| DC-ADS-CTA-04 | Update `saveVideoAd()` method in `AdsLibraryProcessor` to extract and save `ctaText`, `ctaType`, `linkUrl` from Meta Ads response | 2h | ⬜ |
| DC-ADS-CTA-05 | Implement `handleLandingPageDiscovery()` method to create/update `LandingPage` records when `linkUrl` is present | 3h | ⬜ |
| DC-ADS-CTA-06 | Update Meta Ads extraction logic to map `snapshot.cta_text`, `snapshot.cta_type`, `snapshot.link_url` from response | 2h | ⬜ |
| DC-ADS-CTA-07 | Emit `landing-page.discovered-from-ad` event when landing page is discovered from VideoAds | 1h | ⬜ |
| DC-ADS-CTA-08 | Update VideoAds DTOs to include `ctaText`, `ctaType`, `destinationUrl` fields | 1h | ⬜ |
| DC-ADS-CTA-09 | Add validation to ensure `ctaText` and `ctaType` are always extracted for Meta Ads (log warning if missing) | 1h | ⬜ |

**Total Estimated Time:** ~14 hours (~1.75 days)

### 4.7 Scheduling (DC-SCH-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-SCH-001 | Create SchedulerService with @nestjs/schedule | 2h | ✅ |
| DC-SCH-002 | Implement cron job for social crawl (daily) | 2h | ✅ |
| DC-SCH-003 | Implement cron job for store crawl (weekly) | 1h | ✅ |
| DC-SCH-004 | Implement cron job for ads crawl (4h) | 1h | ✅ |
| DC-SCH-005 | Create API endpoint for force refresh | 2h | ✅ |

### 4.8 Event Listeners (DC-EV-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-EV-001 | Listen to competitor.added → trigger store crawl | 1h | ✅ |
| DC-EV-002 | Listen to social-channel.added → trigger channel crawl | 1h | ✅ |
| DC-EV-003 | Listen to landing-page.added → trigger LP crawl | 1h | ✅ |
| DC-EV-004 | Listen to social-channel.updated → trigger content crawl | 1h | ✅ |

### 4.9 Error Handling (DC-ERR-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-ERR-001 | Implement exponential backoff for retries | 2h | ✅ (via BullMQ config) |
| DC-ERR-002 | Create dead letter queue for failed jobs | 2h | ⬜ (Deferred) |
| DC-ERR-003 | Implement rate limit detection and pause | 3h | ⬜ (Deferred) |
| DC-ERR-004 | Add logging for all crawl operations | 2h | ✅ |

### 4.10 Module & Controller (DC-MOD-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-MOD-001 | Create DataCollectionModule | 1h | ✅ |
| DC-MOD-002 | Create CrawlController | 2h | ✅ |
| DC-MOD-003 | Register in AppModule | 0.5h | ✅ |

### 4.11 Tests (DC-TST-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-TST-001 | Unit tests for ApifyAdapter | 2h | ⬜ (Phase 4) |
| DC-TST-002 | Integration tests for processors | 3h | ⬜ (Phase 4) |
| DC-TST-003 | Mock Apify responses for testing | 2h | ⬜ (Phase 4) |

---

## 5. Files to Create

```
backend/src/modules/data-collection/
├── data-collection.module.ts           ⬜
├── controllers/
│   └── crawl.controller.ts             ⬜
├── services/
│   ├── scheduler.service.ts            ⬜
│   └── crawl-job.service.ts            ⬜
├── processors/
│   ├── store.processor.ts              ⬜
│   ├── social-channel.processor.ts     ⬜
│   ├── social-content.processor.ts     ⬜
│   ├── landing-page.processor.ts       ⬜
│   └── ads-library.processor.ts       ⬜
├── adapters/
│   ├── apify.adapter.ts                ⬜
│   └── playwright.adapter.ts           ⬜
├── listeners/
│   └── crawl-event.listener.ts         ⬜
├── dto/
│   ├── force-crawl.dto.ts              ⬜
│   └── crawl-status.dto.ts             ⬜
├── types/
│   └── crawl.types.ts                  ⬜
└── tests/
    └── apify.adapter.spec.ts           ⬜
```

---

## 6. Queue Architecture

```
┌─────────────────────────────────────────────┐
│                  REDIS                       │
├─────────────────────────────────────────────┤
│  crawl-queue                                 │
│  ├── Job: store-crawl                       │
│  ├── Job: social-channel-crawl              │
│  ├── Job: social-content-crawl              │
│  ├── Job: landing-page-crawl                │
│  └── Job: ads-crawl                         │
├─────────────────────────────────────────────┤
│  dead-letter-queue (failed jobs)            │
└─────────────────────────────────────────────┘
```

---

## 7. Verification Checklist

- [ ] BullMQ queue processing jobs
- [ ] Apify adapter making API calls
- [ ] Store metadata being fetched and saved
- [ ] Social channels data collected
- [ ] Videos and posts collected
- [ ] Snapshots created for time-series
- [ ] Events emitting to downstream
- [ ] Scheduled jobs running on time
- [ ] Failed jobs retrying with backoff
- [ ] Rate limits detected and respected
- [ ] Ads Library crawler fetching ads using ASO keywords
- [ ] Ads metadata saved to database
- [ ] Scheduled ads crawl running every 4h

---

## 8. Implementation Status

**✅ COMPLETED: Ads Library Crawler (DC-ADS-001 to DC-ADS-012)**

The Ads Library crawler has been implemented with the following features:
- Uses ASO keywords from Project's Keyword table to search for competitor ads
- Crawls Meta (Facebook/Instagram), TikTok, and Google Ads Library via SearchAPI
- Saves ads metadata to dedicated `Ad` model in database
- Runs on scheduled basis (every 4 hours) and supports manual triggers via API

**Files Created/Modified:**
- `backend/prisma/schema.prisma` - Added `Ad`, `AdPlatform`, `AdStatus` models
- `backend/src/modules/data-collection/processors/ads-library.processor.ts` - New processor
- `backend/src/modules/data-collection/types/crawl.types.ts` - Added `ADS_LIBRARY_CRAWL`, `AdsLibraryCrawlJobData`
- `backend/src/modules/data-collection/processors/crawl.processor.ts` - Added ads crawl handler
- `backend/src/modules/data-collection/services/crawl-job.service.ts` - Added `addAdsLibraryCrawlJob`
- `backend/src/modules/data-collection/services/scheduler.service.ts` - Updated with new scheduler
- `backend/src/modules/data-collection/controllers/crawl.controller.ts` - Added `POST /crawl/ads/:projectId`
- `backend/src/modules/data-collection/dto/trigger-ads-crawl.dto.ts` - New DTO
- `backend/src/modules/data-collection/data-collection.module.ts` - Registered `AdsLibraryProcessor`

**API Endpoint:**
- `POST /api/crawl/ads/:projectId` - Trigger manual ads crawl for a project

**Next Steps:** Proceed to Data Processing Backend or Frontend Ads UI.

