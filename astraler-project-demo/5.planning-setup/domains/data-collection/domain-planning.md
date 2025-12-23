# Domain Planning: Data Collection

> **Reference:** [System Planning](../../system-planning.md)  
> **Phase:** 2 (Data Engine)  
> **Priority:** P0 - Critical

---

## 1. Domain Overview

### 1.1 Domain Name & Scope

**Data Collection Domain** is responsible for collecting data from external sources through 3rd-party providers.

**Scope:**
- Store Crawler (App Store, Play Store)
- Social Crawler (TikTok, YouTube, Instagram, Facebook)
- Ads Crawler (FB Ads Library, TikTok Creative Center)
- Landing Page Crawler (Social Discovery)
- Queue management (BullMQ)
- Scheduling system

**Out of Scope:**
- Data normalization (Data Processing Domain)
- AI Analysis (AI Analysis Domain)
- Media file storage (only metadata)

### 1.2 Domain Objectives

| Objective | Success Criteria |
|-----------|------------------|
| Reliable data fetching | 95% success rate on crawl jobs |
| Automated scheduling | Ads every 4h, Social every 24h, Store every 7d |
| Rate limit handling | Graceful retry with backoff |
| No media storage | Only metadata and CDN URLs |

### 1.3 Domain Context

**Dependencies:**
- **From Project Management:** Competitor IDs, Social Channel IDs to crawl
- **To Data Processing:** Raw data for normalization
- **Events:** `competitor.added`, `social-channel.added`, `landing-page.added`, `project-info.requested`

**Integration Points:**
- Apify API for social scraping
- SearchAPI for store data
- Redis/BullMQ for job queue

---

## 2. Features Breakdown

### 2.1 Feature List

| Feature ID | Feature Name | Priority | Complexity | Est. Points | Notes |
|------------|--------------|----------|------------|-------------|-------|
| DC-01 | BullMQ Queue Setup | P0 | Medium | 5 | |
| DC-02 | Queue Dashboard (Bull Board) | P2 | Low | 2 | |
| DC-03 | Apify Adapter | P0 | High | 8 | |
| DC-04 | Store Metadata Crawler | P0 | Medium | 5 | |
| DC-05 | Social Channel Crawler | P0 | High | 8 | |
| DC-06 | Social Videos Crawler | P0 | High | 8 | Covers organic TikTok + Facebook videos via Apify providers |
| DC-07 | Social Posts Crawler | P1 | Medium | 5 | |
| DC-08 | Landing Page Crawler | P2 | Medium | 5 | |
| DC-09 | Ads Library Crawler | **P0** | High | 8 | **Scope updated:** Meta + Google Ads only; TikTok Ads disabled (Dec 2025) |
| DC-10 | Crawler Scheduling System | P1 | Medium | 5 | |
| DC-11 | Force Refresh API | P1 | Low | 2 | |
| DC-12 | Retry & Error Handling | P0 | Medium | 5 | |
| DC-13 | Rate Limit Management | P1 | Medium | 5 | |
| DC-14 | Event Listeners (on add) | P0 | Low | 3 | |
| DC-15 | Project Info Crawler (SearchAPI) | P0 | Medium | 5 | |
| ~~**DC-16**~~ | ~~**Ads Curation Workflow - Backend**~~ | ~~**P1**~~ | ~~**High**~~ | ~~13~~ | 🔴 **DEPRECATED** (Dec 2024) |
| ~~**DC-17**~~ | ~~**Ads Curation Workflow - Frontend**~~ | ~~**P1**~~ | ~~**High**~~ | ~~13~~ | 🔴 **DEPRECATED** (Dec 2024) |
| **DC-18** | **Platform-Specific Profiles & Posts Schema Refactor** | **P1** | **High** | **13** | |
| **Total** | | | | **92 points** (118 - 26 deprecated) | |

### 2.2 Feature Dependencies

```
DC-01 (Queue) ───▶ DC-14 (Events) ───▶ DC-05 (Social Channel)
      │                                        │
      ▼                                        ▼
DC-03 (Apify) ──────────────────────▶ DC-06 (Videos)
      │                                        │
      ├──────────────────────────────▶ DC-07 (Posts)
      │
      └──────────▶ DC-04 (Store)
      
DC-12 (Retry) ◀───── All Processors
DC-13 (Rate Limit) ◀── DC-03 (Apify)

DC-10 (Scheduling) ───▶ Triggers all crawlers

DC-15 (Project Info) ◀── project-info.requested event (from Project Management)
```

### 2.3 Feature Estimates

| Category | Story Points |
|----------|--------------|
| Queue Infrastructure | 7 pts |
| Adapters & Integrations | 8 pts |
| Crawlers (Store/Social) | 26 pts |
| Extended Crawlers (Ads/Landing) | 13 pts |
| Scheduling & Management | 12 pts |
| Error Handling | 8 pts |
| Project Info Crawler | 5 pts |
| **Total** | **79 pts** |

---

## 3. Tasks Breakdown

### 3.1 Infrastructure Setup

#### Queue System
- [ ] **DC-I01**: Install BullMQ and Redis dependencies - 1h
- [ ] **DC-I02**: Configure Redis connection in NestJS - 2h
- [ ] **DC-I03**: Create `crawl-queue` queue definition - 1h
- [ ] **DC-I04**: Setup Bull Board for monitoring (optional) - 2h
- [ ] **DC-I05**: Configure job options (retries, backoff) - 2h

#### Adapters
- [ ] **DC-I06**: Create ApifyAdapter service - 4h
- [ ] **DC-I07**: Implement Apify API authentication - 2h
- [ ] **DC-I08**: Create response type definitions - 2h
- [ ] **DC-I09**: Implement error handling wrapper - 2h

### 3.2 Crawler Processors

#### Store Crawler
- [ ] **DC-S01**: Create StoreProcessor class - 2h
- [ ] **DC-S02**: Implement App Store metadata fetch - 3h
- [ ] **DC-S03**: Implement Play Store metadata fetch - 3h
- [ ] **DC-S04**: Save competitor metadata to database (name, developer, icon, category, description, rating, ratingsCount, bundleId) - 2h
- [ ] **DC-S05**: Save competitor screenshots to CompetitorScreenshot table - 1h
- [ ] **DC-S06**: Fetch and save reviews - 3h
- [ ] **DC-S07**: Fetch and save app updates (version history) - 2h

#### Social Channel Crawler
- [ ] **DC-SC01**: Create SocialChannelProcessor class - 2h
- [ ] **DC-SC02**: Implement TikTok profile fetch - 3h
- [ ] **DC-SC03**: Implement YouTube channel fetch - 3h
- [ ] **DC-SC04**: Implement Instagram profile fetch - 3h
- [ ] **DC-SC05**: Save channel data and create snapshot - 2h
- [ ] **DC-SC06**: Emit event for content crawl - 1h

#### Social Content Crawler
- [ ] **DC-CC01**: Create SocialContentProcessor class - 2h
- [ ] **DC-CC02**: Implement video list fetch (all platforms) - 4h
- [ ] **DC-CC03**: Upsert videos to database - 2h
- [ ] **DC-CC04**: Create video snapshots - 1h
- [ ] **DC-CC05**: Implement posts fetch - 3h
- [ ] **DC-CC06**: Upsert posts to database - 2h
- [ ] **DC-CC07**: Emit `video.created` event - 1h

#### Project Info Crawler
- [ ] **DC-PI01**: Add listener for `project-info.requested` event - 1h
- [ ] **DC-PI02**: Create ProjectInfoCrawlJobData type - 0.5h
- [ ] **DC-PI03**: Add PROJECT_INFO_CRAWL to CrawlJobType enum - 0.5h
- [ ] **DC-PI04**: Implement addProjectInfoCrawlJob() in CrawlJobService - 1h
- [ ] **DC-PI05**: Implement processProjectInfoCrawl() in CrawlProcessor - 3h
- [ ] **DC-PI06**: Update Project with crawled metadata (appName, developerName, iconUrl, etc.) - 2h
- [ ] **DC-PI07**: Create ProjectScreenshot records from screenshots - 1h
- [ ] **DC-PI08**: Create ProjectUpdate records from version_history - 1h

#### Landing Page Crawler
- [ ] **DC-LP01**: Setup Playwright service - 2h
- [ ] **DC-LP02**: Create LandingPageProcessor - 2h
- [ ] **DC-LP03**: Implement social link extraction - 3h
- [ ] **DC-LP04**: Emit `social.discovered` event - 1h

#### Ads Library Crawler (P0 - Next Priority)
> ⚠️ **Priority**: P0 - Next Implementation Step  
> **Scope (Updated Dec 2025)**: Crawl **video ads** from **Meta Ads Library** and **Google Ads Transparency** using:
> - **Advertiser IDs** stored on `SocialChannel.advertiserId` (per platform) as primary search keys, and
> - **Project-level keywords** (Keyword/SpyKeyword) as additional filters where supported.  
> **TikTok Ads** crawling is **out of scope / disabled** until further notice.

- [ ] **DC-ADS01**: Create AdsLibraryProcessor class - 2h
- [ ] **DC-ADS02**: Add ADS_CRAWL to CrawlJobType enum - 0.5h
- [ ] **DC-ADS03**: Create AdsLibraryCrawlJobData type (projectId, keywordId?, platform?) - 1h
- [ ] **DC-ADS04**: Implement fetch keywords from Project's Keyword table - 1h
- [ ] **DC-ADS05**: Implement Meta Ads Library crawl using SearchAPI (with `advertiserId` + optional keyword filters) - 3h
- [ ] ~~**DC-ADS06**: Implement TikTok Ads Library crawl using SearchAPI (with `advertiserId` + optional keyword filters) - 3h~~ 🔴 **DISABLED** (Dec 2025 — TikTok Ads crawler locked)
- [ ] **DC-ADS07**: Implement Google Ads Transparency crawl using SearchAPI (with `advertiserId` as primary key) - 3h
- [ ] **DC-ADS08**: Save ads metadata to dedicated `Ad` model with links to `SocialChannel`/`Competitor` where applicable - 2h
- [ ] **DC-ADS09**: Link ads to Project and Keyword/SpyKeyword (if keywordId provided) - 1h
- [ ] **DC-ADS10**: Emit `ads.crawled` event for downstream processing - 1h
- [ ] **DC-ADS11**: Add listener for scheduled ads crawl (every 4h) - 1h
- [ ] **DC-ADS12**: Add API endpoint for manual ads crawl trigger - 1h

### 3.3 Scheduling & Management

- [ ] **DC-M01**: Create SchedulerService using @nestjs/schedule - 2h
- [ ] **DC-M02**: Implement cron job for social crawl (daily) - 2h
- [ ] **DC-M03**: Implement cron job for store crawl (weekly) - 1h
- [ ] **DC-M04**: Implement cron job for ads crawl (4h) - 1h
- [ ] **DC-M05**: Create API endpoint for force refresh - 2h

### 3.4 Event Listeners

- [ ] **DC-E01**: Listen to `competitor.added` → trigger store crawl - 1h
- [ ] **DC-E02**: Listen to `social-channel.added` → trigger channel crawl - 1h
- [ ] **DC-E03**: Listen to `landing-page.added` → trigger LP crawl - 1h
- [ ] **DC-E04**: Listen to `social-channel.updated` → trigger content crawl - 1h
- [ ] **DC-E05**: Listen to `project-info.requested` → trigger Project Info crawl - 1h (See DC-PI01)

### 3.5 Error Handling & Resilience

- [ ] **DC-R01**: Implement exponential backoff for retries - 2h
- [ ] **DC-R02**: Create dead letter queue for failed jobs - 2h
- [ ] **DC-R03**: Implement rate limit detection and pause - 3h
- [ ] **DC-R04**: Add logging for all crawl operations - 2h

### 3.6 Testing

- [ ] **DC-T01**: Unit tests for ApifyAdapter - 2h
- [ ] **DC-T02**: Integration tests for processors - 3h
- [ ] **DC-T03**: Mock Apify responses for testing - 2h

---

## 4. Timeline & Sprints

### 4.1 Sprint Breakdown

**Sprint 4 (Week 11-12): Infrastructure & Store Crawler**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | DC-I01 to DC-I05 | Queue system ready |
| Day 3-4 | DC-I06 to DC-I09 | Apify adapter ready |
| Day 5-6 | DC-S01 to DC-S05 | Store crawler working |
| Day 7-8 | DC-E01, DC-M03 | Events + Weekly schedule |
| Day 9-10 | Testing, bug fixes | Phase 1 complete |

**Sprint 5 (Week 13-14): Social Crawlers**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-3 | DC-SC01 to DC-SC06 | Social channel crawler |
| Day 4-6 | DC-CC01 to DC-CC07 | Videos/Posts crawler |
| Day 7-8 | DC-E02 to DC-E04 | Event listeners |
| Day 9-10 | DC-M01, DC-M02 | Scheduling system |

**Sprint 6 (Week 15-16): Ads Library Crawler (P0 Priority)**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | DC-ADS01 to DC-ADS04 | Ads Library processor setup & keyword fetching |
| Day 3-5 | DC-ADS05 to DC-ADS07 | Meta, TikTok, Google Ads Library integration |
| Day 6-7 | DC-ADS08 to DC-ADS10 | Save ads metadata & event emission |
| Day 8-9 | DC-ADS11 to DC-ADS12 | Scheduled crawl & API endpoint |
| Day 10 | Testing & bug fixes | Ads Library crawler complete |

**Sprint 7 (Week 17-18): Extended & Polish**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-3 | DC-LP01 to DC-LP04 | Landing page crawler |
| Day 4-5 | DC-R01 to DC-R04 | Error handling |
| Day 6-7 | DC-M04, DC-M05 | Force refresh polish |
| Day 8-10 | DC-T01 to DC-T03 | Testing complete |

### 4.2 Timeline Estimate

| Milestone | Duration | Week |
|-----------|----------|------|
| Queue + Store Crawler | 2 weeks | Week 11-12 |
| Social Crawlers | 2 weeks | Week 13-14 |
| **Ads Library Crawler** | **2 weeks** | **Week 15-16** |
| Extended Features | 2 weeks | Week 17-18 |
| **Total** | **8 weeks** | **Week 11-18** |

### 4.3 Milestones

1. **M1: Queue Operational** - BullMQ processing jobs
2. **M2: Store Data Flowing** - Competitor metadata updated
3. **M3: Social Data Flowing** - Channels, Videos, Posts collected
4. **M4: Full Automation** - Scheduled crawls running

---

## 5. Resource Allocation

### 5.1 Team Assignment

| Role | Allocation | Tasks |
|------|------------|-------|
| Backend Developer | 100% | All DC tasks |

### 5.2 Capacity Planning

- Infrastructure: ~18 hours
- Crawlers: ~42 hours
- Scheduling: ~8 hours
- Error Handling: ~9 hours
- Testing: ~7 hours
- **Total: ~84 hours (~2.5 weeks)**

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies

| Dependency | Provider | Purpose |
|------------|----------|---------|
| Apify API | Apify.com | Social media scraping |
| SearchAPI | searchapi.io | Store data (alternative) |
| Redis | Self-hosted/Cloud | Job queue |

### 6.2 Internal Dependencies
- Project Management domain complete (Competitor entities exist)
- Database schema finalized

### 6.3 Blockers

| Blocker | Mitigation |
|---------|------------|
| Apify quota limits | Monitor usage, implement batching |
| Rate limiting | Implement backoff, use proxies |
| Platform API changes | Abstract adapters, easy to update |

---

## 7. Risk Assessment

### 7.1 Domain-Specific Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Apify actor unavailable | Low | High | Have backup actors, alert on failure |
| Rate limiting from platforms | High | Medium | Backoff logic, respect limits |
| Data format changes | Medium | Medium | Schema validation, alert on failures |
| High API costs | Medium | Medium | Implement cost caps, batching |

### 7.2 Contingency Plans

- **Apify Down:** Queue jobs for later retry
- **Rate Limited:** Exponential backoff, pause crawler
- **Budget Exceeded:** Stop non-critical crawls, alert admin

---

## 8. Definition of Done

### 8.1 Feature Completion Criteria

- [ ] Queue processes jobs reliably
- [ ] Store metadata fetched and saved
- [ ] Social profiles data collected
- [ ] Videos/Posts collected and stored
- [ ] Snapshots created for time-series
- [ ] Events emitted for downstream
- [ ] Scheduled jobs running on time
- [ ] Failed jobs retry with backoff

### 8.2 Quality Gates

- [ ] 95% job success rate
- [ ] No memory leaks in processors
- [ ] Logs contain useful debugging info
- [ ] Dead letter queue for manual review
- [ ] Monitoring dashboard accessible

---

## 9. Queue Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        REDIS                                  │
├──────────────────────────────────────────────────────────────┤
│  crawl-queue                                                  │
│  ├── Job: store-crawl { competitorId, platform }             │
│  ├── Job: social-channel-crawl { socialChannelId }           │
│  ├── Job: social-content-crawl { socialChannelId, type }     │
│  ├── Job: landing-page-crawl { url, competitorId }           │
│  └── Job: ads-crawl { competitorId }                         │
├──────────────────────────────────────────────────────────────┤
│  analysis-queue (for Data Processing domain)                  │
│  └── Job: detect-hero-video { videoId }                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/crawl/force-refresh/:competitorId` | Force immediate crawl |
| GET | `/crawl/status/:jobId` | Get job status |
| GET | `/crawl/queue/stats` | Queue statistics |

---

**Next Step:** Proceed to Data Processing Domain Planning.

