# Data Collection Frontend Implementation Plan

> **Domain:** Data Collection
> **Status:** 🟢 Completed
> **Created:** December 13, 2024
> **Last Updated:** December 13, 2024
> **Progress:** 18/18 tasks completed
> **Priority:** P1 - High
> **Phase:** 2 (Data Engine)

---

## 1. Overview

This plan covers the frontend implementation for **Data Collection** domain. Note: This domain is **primarily backend-focused**. Frontend provides:
- Crawl status indicators
- Force refresh buttons
- Queue status view (admin)

Most data display is handled by Dashboard domain (Videos Library, Channels screens).

**Estimated Duration:** 3-4 days
**Dependencies:** Dashboard Layout, Data Collection Backend

---

## 2. Pages Summary

| Page | Route | Description | Priority |
|------|-------|-------------|----------|
| Videos Library | `/projects/:id/videos` | Display collected videos | P1 |
| Channels | `/projects/:id/channels` | Display social channels | P2 |
| Queue Status | `/admin/queues` | Bull Board integration | P2 |

*Note: These pages use data from Data Collection but are part of Dashboard domain.*

> **Update (Dec 2025)**  
> - Social area must surface **summary metrics** for **Organic Videos** and **Video Ads** (counts) on the Social Channels page.  
> - **TikTok Ads** functionality is locked/disabled; UI must not allow users to trigger TikTok Ads crawls or rely on TikTok Ads data (see `ads-library-ui` design).

---

## 3. Implementation Tasks

### 3.1 Components (DC-FE-CMP-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-FE-CMP-001 | Create CrawlStatusBadge component | 1h | ✅ |
| DC-FE-CMP-002 | Create ForceRefreshButton component | 2h | ✅ |
| DC-FE-CMP-003 | Create LastCrawledAt display | 1h | ✅ (in ChannelTable) |
| DC-FE-CMP-004 | Create CrawlProgressIndicator | 2h | ✅ (in ForceRefreshButton) |

### 3.2 API Integration (DC-FE-API-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-FE-API-001 | Create crawl API functions | 1h | ✅ |
| DC-FE-API-002 | Create useForceRefresh mutation | 1h | ✅ |
| DC-FE-API-003 | Create useCrawlStatus query | 1h | ✅ |

### 3.3 Videos Library Page (DC-FE-VID-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-FE-VID-001 | Create VideosPage layout | 2h | ✅ |
| DC-FE-VID-002 | Create VideoCard component | 2h | ✅ |
| DC-FE-VID-003 | Create VideoGrid with infinite scroll | 3h | ✅ |
| DC-FE-VID-004 | Create VideoFilters (platform, date, hero) | 3h | ✅ |
| DC-FE-VID-005 | Create VideoDetailModal | 2h | ✅ |

### 3.4 Channels Page (DC-FE-CH-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-FE-CH-001 | Create ChannelsPage layout | 2h | ✅ |
| DC-FE-CH-002 | Create ChannelTable component | 2h | ✅ |
| DC-FE-CH-003 | Create PlatformSummaryCards (metrics) | 2h | ✅ |
| DC-FE-CH-004 | Create AddChannelModal | 2h | ✅ |

---

## 4. Files Created

```
frontend/src/features/data-collection/
├── api/
│   ├── index.ts                        ✅
│   └── crawl.api.ts                    ✅
├── hooks/
│   ├── index.ts                        ✅
│   ├── use-crawl.ts                    ✅
│   ├── use-videos.ts                   ✅
│   └── use-channels.ts                 ✅
├── components/
│   ├── index.ts                        ✅
│   ├── crawl-status-badge.tsx          ✅
│   ├── force-refresh-button.tsx        ✅
│   └── platform-icon.tsx               ✅
├── types/
│   ├── index.ts                        ✅
│   └── crawl.types.ts                  ✅
└── index.ts                            ✅

frontend/src/features/videos/
├── pages/
│   ├── index.ts                        ✅
│   └── VideosPage.tsx                  ✅
├── components/
│   ├── index.ts                        ✅
│   ├── video-card.tsx                  ✅
│   ├── video-grid.tsx                  ✅
│   ├── video-filters.tsx               ✅
│   └── video-detail-modal.tsx          ✅
├── hooks/
│   └── index.ts                        ✅
├── types/
│   └── index.ts                        ✅
└── index.ts                            ✅

frontend/src/features/channels/
├── pages/
│   ├── index.ts                        ✅
│   └── ChannelsPage.tsx                ✅
├── components/
│   ├── index.ts                        ✅
│   ├── channel-table.tsx               ✅
│   ├── channel-filters.tsx             ✅
│   ├── platform-summary-cards.tsx      ✅
│   └── add-channel-modal.tsx           ✅
├── hooks/
│   └── index.ts                        ✅
├── types/
│   └── index.ts                        ✅
└── index.ts                            ✅
```

## 6. Additional Tasks (Social Video Stats & TikTok Ads Lock)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-FE-SOC-001 | Add Organic vs Ads summary cards on Social Channels page (using existing stats components) | 3h | ⬜ |
| DC-FE-SOC-002 | Wire cards to backend endpoints that expose counts for `VideoOrganic` and `VideoAds` per project | 3h | ⬜ |
| DC-FE-ADS-LOCK-001 | Hide or mark TikTok option as disabled in Video Ads filter chips | 1h | ⬜ |
| DC-FE-ADS-LOCK-002 | Ensure no UI action can directly trigger a TikTok Ads crawl (buttons, menus, etc.) | 1h | ⬜ |
| DC-FE-ADS-LOCK-003 | Review Video Ads pages to confirm no TikTok‑specific metrics or labels are displayed | 1h | ⬜ |

## 7. Additional Tasks (Meta Ads CTA Fields Display)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DC-FE-CTA-001 | Update VideoAds TypeScript interface to include `ctaText`, `ctaType`, `destinationUrl` fields | 0.5h | ⬜ |
| DC-FE-CTA-002 | Update VideoAds table/card component to display CTA button with `ctaText` and `ctaType` badge | 2h | ⬜ |
| DC-FE-CTA-003 | Add landing page link display in VideoAds table (if `destinationUrl` exists) with indicator that it was discovered from ad | 2h | ⬜ |
| DC-FE-CTA-004 | Update VideoAd detail modal to show CTA section prominently with `ctaText` as button and `ctaType` badge | 2h | ⬜ |
| DC-FE-CTA-005 | Add landing page link in VideoAd detail modal with label "Discovered Landing Page" and link to LandingPage detail if exists | 2h | ⬜ |
| DC-FE-CTA-006 | Update VideoAds API service to handle new fields in response | 1h | ⬜ |

---

## 5. Performance Optimization Requirements

### 5.1. Loading Performance
*   **Initial Load**: Channels and Videos pages must show skeleton/loading state within **< 500ms**
*   **API Response**: Backend must return initial page in **< 2 seconds**
*   **Pagination**: "Load More" must fetch next page in **< 2 seconds**
*   **Filter Changes**: Table/grid must update within **< 1 second** (with loading overlay)

### 5.2. Frontend Optimizations
*   **Lazy Loading**: 
    *   Video thumbnails load on scroll (Intersection Observer)
    *   Channel avatars load on scroll
*   **Caching**: 
    *   TanStack Query `staleTime`: 5 minutes for list queries
    *   TanStack Query `cacheTime`: 10 minutes
    *   `refetchOnWindowFocus: false` for list pages
    *   `keepPreviousData: true` for pagination
*   **Debouncing**: Filter inputs debounced 500ms before API call
*   **Skeleton States**: Show immediately (don't wait for API)
*   **Optimistic Updates**: Update UI optimistically for mutations

### 5.3. Pagination Strategy
*   **Default Page Size**: 
    *   Channels: 50 per page
    *   Videos: 20 per page
*   **Infinite Scroll**: Use "Load More" button (not auto-scroll to prevent performance issues)
*   **Cursor-based**: Backend should support cursor-based pagination (if implemented)

### 5.4. Error Handling
*   **Error States**: Show error message with retry button (don't block entire page)
*   **Retry Logic**: Automatic retry on network errors (max 3 attempts)
*   **Fallback**: Show cached data if available when API fails

## 6. Verification Checklist

- [x] Crawl status badge shows correct state
- [x] Force refresh triggers backend crawl
- [x] Videos library displays collected videos
- [x] Video filters work correctly
- [x] Channels page shows channel data
- [x] Platform metrics displayed (summary cards)
- [x] Load more button for pagination
- [x] Video detail modal opens on click
- [x] Add channel modal available
- [ ] Performance: Initial load < 2 seconds ⬜
- [ ] Performance: Pagination load < 2 seconds ⬜
- [ ] Performance: Lazy loading thumbnails implemented ⬜
- [ ] Performance: Caching configured correctly ⬜

---

**Next Step:** ✅ Completed. Proceed to Data Processing Frontend.
