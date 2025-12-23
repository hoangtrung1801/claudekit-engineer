# Domain PRD: Data Collection (Crawlers)

## 1. Overview
The **Data Collection Domain** is responsible for interfacing with external 3rd-party providers to gather intelligence from App Stores, Social Media Platforms, Ad Libraries, and Websites. This domain acts as the "eyes" of the system, ensuring data is fetched reliably and consistently.

## 2. Business Context
To analyze competitors, we need raw data. Since we cannot access official APIs for generic monitoring (e.g., Tikok API doesn't allow scraping competitors), we rely on 3rd-party scrapers (Apify, SearchAPI). This domain manages those integrations, handling quotas, retries, and scheduling.

## 3. User Flows (System Flows)

### 3.1. Scheduled Crawl Flow
1.  **Scheduler** (system-level) triggers jobs based on global intervals (configured in `.env` / crawler module config).
2.  **Job Manager** checks which modules are enabled (Store, Social, Ads).
3.  **Dispatcher** sends requests to the appropriate 3rd-party provider (e.g., Apify Actor).
4.  **Poller/Webhook** waits for the job to complete.
5.  **Ingestion** receives the raw JSON, validates schema, and passes it to the Data Processing Domain.

### 3.2. Ad-hoc/On-demand Crawl
1.  User clicks "Refresh Data" on a competitor.
2.  System triggers an immediate high-priority crawl job.
3.  UI updates to show "Crawling in progress...".

## 4. Business Rules
*   **Third-Party Dependency**: System must handle provider downtime gracefully (retry logic).
*   **No Media Storage**: We DO NOT store video files. We only store metadata, transcripts, and CDN URLs.
*   **Respect Limits**: Crawl frequency must obey configured limits to control costs.
*   **Public Data Only**: We strictly crawl public data. No scraping behind login walls.

## 5. Domain Features (Detailed)

### FR8: Store Metadata Crawler (Competitors)
*   **Sources**: App Store (iOS).
    > ⚠️ **Note**: Google Play Store is planned for future phases (pending provider research).
*   **Data Points**: 
    *   **Competitor Metadata** (saved to Competitor table):
        *   App Name, Developer Name, App Icon
        *   Category, Description
        *   Rating, Reviews Count
        *   Bundle ID / Product ID
    *   **Screenshots** (saved to CompetitorScreenshot table): Screenshot URLs with position
    *   **Reviews** (saved to Review table): Individual reviews with rating, text, sentiment
    *   **Version History** (saved to AppUpdate table): Version numbers, release dates, changelogs
*   **Frequency**: ~4-7 days (low frequency).
*   **Trigger**: When competitor is added to a project.
*   **Note**: Competitor crawler must collect the same comprehensive metadata as Project Info crawler (FR8.1) for consistency and complete analysis.

### FR8.1: Project Info Crawler (User's Own App)
*   **Sources**: App Store (iOS) via SearchAPI.
    > ⚠️ **Note**: Focus on iOS first. Android support planned for future phases.
*   **Data Points**: 
    *   App Name, Developer Name, App Icon
    *   Category, Rating, Reviews Count
    *   Screenshots (metadata URLs)
    *   Version History (What's New)
    *   Bundle ID
*   **Frequency**: On-demand (when Live project created/updated with iOS URL, or manual refresh).
*   **Trigger**: 
    *   Automatically when Live project is created with iOS Store URL
    *   Automatically when Live project's iOS Store URL is updated
    *   Manually via "Refresh from Store" action on Project Info page
*   **Purpose**: Populate Project's own app information for analysis and comparison with competitors.

### FR9: Social Entity Crawler
*   **Sources**: TikTok, Instagram, Facebook.
    > ⚠️ **Note**: YouTube crawler is planned for Phase 2.1 (lower priority for MVP).
*   **Data Points**:
    *   **Channel/Profile**: Followers, Following, Bio, Verification Status, Profile Avatar.
    *   **Videos**: Title, Description, Duration, Views, Likes, Comments, Shares, Thumbnail URL.
    *   **Posts (Non-Video)**: Images, Carousels, Text Posts, Stories, Reels — Caption, Views, Likes, Comments, Shares.
    *   **Transcripts**: If available via API (for AI analysis).
*   **Constraint**: No media file download (only metadata and CDN URLs).
*   **Channel Types Supported**:
    *   **Competitor-linked channels** (`competitorId` set): Creates `VideoOrganic` records visible in **External section** (competitor tracking).
    *   **Project-linked channels** (`projectId` set): Creates `VideoOrganic` records visible in **Internal section** (marketing team's own content).

#### FR9.1: Organic Video Collector (TikTok & Facebook)
*   **Goal**: Collect **organic video content** (non-ads) from TikTok profiles and Facebook pages for competitor analysis and social insights.
*   **Sources**:
    *   **TikTok**: Via 3rd-party profile/video scrapers (e.g., `clockworks/tiktok-profile-scraper` on Apify).
    *   **Facebook**: Via page/posts scrapers (e.g., `apify/facebook-posts-scraper` on Apify).
*   **Business Requirements**:
    *   System must reliably collect **organic videos** from tracked competitor channels/pages.
    *   Each organic video must be stored as a **first‑class record** (Video Organic) with full engagement metrics.
    *   System must support **time‑series analysis** of organic performance (snapshots over time).
*   **Data Points (per Organic Video)**:
    *   Platform & IDs: Platform, Profile/Page ID, Video ID, URL.
    *   Content: Caption/Text, Hashtags, Thumbnail URL, Duration.
    *   Engagement: Views/Plays, Likes/Hearts, Comments, Shares, Saves/Collections (if available).
    *   Timing: Published timestamp (ISO), Relative age.
*   **Business Rules**:
    *   Only **public** profiles/pages are in scope (no private/personal profiles).
    *   **No raw media files** are stored (only metadata + CDN URLs).
    *   Organic videos must be clearly separated from Ads in reporting and UI.

### FR10: Ads Intelligence Crawler (Video Ads)
*   **Sources**: Facebook/Meta Ads Library, ~~TikTok Creative Center~~, Google Ads Transparency (per platform).
*   **Data Model (Simplified):**
    *   **Video Ads**: Created directly as `Video` records with `type = AD` from Ads Library Transparency APIs.
    *   **Video Organic**: Created as `Video` records with `type = ORGANIC` from social profile crawlers.
    *   **No Ad Model**: Removed intermediate Ad model and curation workflow for simplicity.
*   **Data Points (per Video Ad):**
    *   Video metadata (title, description, thumbnail, video URLs: videoUrl, videoHdUrl, videoSdUrl).
    *   **Call-to-Action (CTA) fields**: `cta_text` (button text, e.g., "Learn more", "Send message"), `cta_type` (CTA type, e.g., "LEARN_MORE", "MESSAGE_PAGE", "DOWNLOAD") — always present in Meta Ads response.
    *   **Landing page URL** (`link_url`): Optional field that, when present, represents a landing page discovered from the ad. System must track this as a `LandingPage` record with `discoverySource = ADS_LIBRARY` and link it back to the originating `VideoAds` record.
    *   Linked to SocialChannel via advertiserId (advertiser profile).
    *   Linked to SpyKeyword for tracking discovery source.
    *   Published date from ads API (firstShownDate).
*   **Frequency**: High (~4 hours).
*   **Note**:
    *   Video Ads are created immediately when Ads Library crawler finds them. No review/curation step required.
    *   **TikTok Ads Support:** As of Dec 2025, **TikTok Ads crawling is disabled/paused** due to low signal quality and high noise for this product. Ads Intelligence for MVP focuses on **Meta Ads Library** (and future Google Ads Transparency) only. Any TikTok Ads‑related crawlers, quotas, and UI filters must be **treated as non‑functional / hidden** until re‑enabled in a future phase.

### FR11: Landing Page Crawler (Social Discovery)
*   **Context**: Competitors use multiple landing pages (funnels, sales pages) which often contain links to specific social channels or "hidden" marketing assets not found on their main website.
*   **Function**:
    *   Crawl specific Landing Page URLs (extracted from Ads or manually added).
    *   **Social Entity Discovery**: Scan the page to identify and extract links to social media profiles (TikTok, YouTube, Instagram, Facebook, X).
    *   **Entity Resolution**: Check if these found profiles exist in the system. If new, tag them for "New Entity Discovery" alerts.
*   **Data Points**: Social Profile Links (Priority).
    > ⚠️ **MVP Scope**: Landing Page Crawler is **limited to social link extraction only**. Copywriting/Headlines extraction is out of scope for MVP.

### FR12: Crawler Scheduling Mechanism
*   **Logic**: 
    *   Ads: Every 4h (configurable globally).
    *   Social: Every 24h.
    *   Store: Every 7 days.
    *   Allow "Force Run" for immediate updates.
