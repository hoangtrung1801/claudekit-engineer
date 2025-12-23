# Domain SAD: Data Collection

## 1. Architecture Overview
The **Data Collection Domain** is an **Event-Driven** system powered by **BullMQ** (Redis). It listens for events from the Project Domain (`CompetitorCreated`, `LandingPageAdded`, `SocialChannelAdded`) and schedules asynchronous jobs to crawl social platforms for profiles, videos, and posts.

## 2. Component Design

### 2.1. Queues (BullMQ)
*   **`crawl-scheduler`**: Manages cron-based re-crawls (system-level intervals).
*   **`crawl-execution`**: Handles high-priority, immediate crawl jobs.

### 2.2. Processors (Consumers)
*   **`StoreProcessor`**: Fetches App Store/Google Play metadata.
*   **`SocialChannelProcessor`**: Crawls social channel profiles (followers, bio, verification status) → saves to `SocialChannel` + `SocialChannelSnapshot`.
*   **`SocialContentProcessor`**: Crawls **organic videos** and posts from social channels → saves to `VideoOrganic`, `VideoOrganicSnapshot`, `SocialPost`, `SocialPostSnapshot`.
*   **`AdsProcessor`**: Fetches ad library data (Meta Ads Library, Google Ads Transparency).  
    > ⚠️ **TikTok Ads Branch Disabled (Dec 2025)**: TikTok Ads crawling is **disabled/removed** from this processor to avoid low‑signal, noisy data. Only Meta + (future) Google Ads Transparency remain in scope for Ads Intelligence.  
    > **CTA Fields & Landing Page Discovery (Dec 2025)**: Meta Ads Library response includes `cta_text`, `cta_type` (always present), and optional `link_url`. When `link_url` is present, the processor automatically creates/updates a `LandingPage` record with `discoverySource = ADS_LIBRARY` and links it back to the originating `VideoAds` and `SocialChannel`.
*   **`LandingPageProcessor`**: Visits Landing Page URLs using Headless Browser to discover social links (extraction only, no content crawling).

## 3. Data Flow

### 3.1. Social Channel Discovery Flow
1.  **Input Event**: `LandingPageAdded(url, competitorId)`.
2.  **Processor (`LandingPageProcessor`)**: Scans DOM for social patterns → Discovered Social URLs.
3.  **Integration**: Publishes `SocialEntityDiscovered` event → Project Domain creates `SocialChannel` record.

### 3.2. Social Channel Crawl Flow
1.  **Input Event**: `SocialChannelAdded(socialChannelId)` or scheduled re-crawl.
2.  **Processor (`SocialChannelProcessor`)**: 
    *   Fetches profile data via Apify (TikTok, Instagram, Facebook).
        > ⚠️ **Note**: YouTube crawler deferred to Phase 2.1.
    *   Updates `SocialChannel` (displayName, avatarUrl, bio, isVerified).
    *   Creates `SocialChannelSnapshot` (followers, following, postsCount, videosCount, engagementRate).
3.  **Output**: `SocialChannelUpdated` event → triggers content crawl.

### 3.3. Social Content Crawl Flow
1.  **Input Event**: `SocialChannelUpdated(socialChannelId)`.
2.  **Processor (`SocialContentProcessor`)**: 
    *   Works for both **competitor-linked** and **project-linked** social channels.
    *   Fetches **organic videos** from TikTok & Facebook using provider‑specific integrations (e.g., Apify Actors) → Upserts `VideoOrganic`, creates `VideoOrganicSnapshot`.
    *   Fetches posts (images, carousels, stories) → Upserts `SocialPost`, creates `SocialPostSnapshot`.
    *   **Data Visibility**: VideoOrganic from project-linked channels are accessible in **Internal section**; from competitor-linked channels in **External section**.
3.  **Output**: `VideoCreated`, `PostCreated` events → consumed by Data Processing (Hero Detection).

## 4. Database Design
See Master Schema in `database-schema.md`:
*   `SocialChannel` / **ProfilePage** — competitor or advertiser profile on a platform (TikTok, YouTube, Instagram, Facebook, X, Google Ads).
*   `SocialChannelSnapshot` / **ProfileSnapshot** — profile metrics over time (followers, engagement, posts/videos counts).
*   **`VideoAds` / `VideoAdsSnapshot`** — video ads created directly from Ads Library Transparency APIs (Meta, Google Ads).
*   **`VideoOrganic` / `VideoOrganicSnapshot`** — organic videos created from social profile crawlers (TikTok, Facebook, Instagram, etc.).
*   `SocialPost` / **Platform Non-Video Posts** — non-video content (IMAGE, CAROUSEL, TEXT, STORY, REEL, LINK) linked to a ProfilePage.
*   `SocialPostSnapshot` — post metrics over time.
*   **Note**:  
    *   Video Ads are created directly as `VideoAds` records when Ads Library crawler runs. No intermediate Ad model or curation workflow.  
    *   Organic videos are created as `VideoOrganic` records from social content crawlers using normalized provider responses.

## 5. Integration Design
*   **Input**: Redis PubSub / Queue (`LandingPageAdded`, `SocialChannelAdded`, scheduled triggers).
*   **Output**: Redis PubSub (`SocialEntityDiscovered`, `SocialChannelUpdated`, `VideoCreated`, `PostCreated`).
*   **Failure Config**: BullMQ Automatic Retries (3 attempts, exponential backoff).

### 5.1. Heterogeneous Apify Providers (Organic Videos)

**Context:**  
TikTok and Facebook organic video providers (e.g., `clockworks/tiktok-profile-scraper`, `apify/facebook-posts-scraper`) return **different JSON response structures** (field names, nesting, timestamp formats).

**Decision:**  
Introduce a **Video Content Provider Abstraction** in Data Collection:
* Provider‑specific adapters call each external Actor and transform raw JSON into a **canonical `VideoOrganic` DTO**.
* `SocialContentProcessor` only consumes the canonical DTO and does not depend on provider‑specific fields.

**Canonical `VideoOrganic` DTO (Conceptual):**
* Identity: `platform`, `profileId`/`pageId`, `videoId`, `url`.
* Content: `caption`, `hashtags`, `thumbnailUrl`, `durationSeconds`.
* Metrics: `views`, `likes`, `comments`, `shares`, `saves` (if available).
* Timing: `publishedAt` (ISO), `capturedAt`.

**Consequences:**
* Downstream domains (Data Processing, Dashboard) read from a **stable schema** for organic videos.
* Adding/changing providers (new Apify actors, fallbacks) only impacts the adapter layer, not queues, processors, or database consumers.
