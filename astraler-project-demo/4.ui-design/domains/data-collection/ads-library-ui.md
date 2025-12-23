# UI Design: Video Ads

> [!NOTE]
> **Implementation Reference**:
> - Components: `docs/4.ui-design/component-library.md`
> - Page Structure: `docs/4.ui-design/page-structure.md` Section 10
> 
> **Usage Context**:
> - **External Section**: Shows competitor video ads (from competitor social channels).
> - **Internal Section**: Can also show project's own video ads (from project-linked social channels) when accessed from Internal section context.

## 1. Page Requirements: Video Ads

**Route**: `/projects/{id}/video-ads`  
**Section**: External (default) or Internal (when viewing project's own ads)

### 1.1. Video Ads Table
*   **Goal**: Browse Video Ads from Ads Library Transparency APIs in a table format
    *   **External Section**: Shows competitor video ads (from competitor social channels).
    *   **Internal Section**: Shows project's own video ads (from project-linked social channels).
*   **Table Requirements**:
    *   **Thumbnail**: Video preview thumbnail (small)
    *   **Source Badge**: 
        *   "My Channel" badge if from project-linked channel (Internal context)
        *   "Competitor" badge with advertiser name if from competitor-linked channel (External context)
    *   **Advertiser**: Advertiser profile name + avatar
    *   **Platform**: Icon (Facebook/Instagram, ~~TikTok~~, Google Ads)
    *   **Title/Description**: Video title and description (truncated)
    *   **CTA Button**: Display `cta_text` (e.g., "Learn more", "Send message") with badge/icon indicating `cta_type` if available
    *   **Landing Page**: If `link_url` exists, show as clickable link with indicator that it was discovered from this ad
    *   **Impressions**: Ad impressions count
    *   **Spend**: Ad spend (if available)
    *   **Published Date**: When ad was first shown
    *   **Actions**: View, Analyze buttons
*   **Component**: DataTable with sortable columns

### 1.2. Advanced Filters
*   **Requirements**:
    *   **Source Filter** (when accessed from Internal section): Toggle "My Channels" vs "Competitor Channels" to filter by project-linked vs competitor-linked social channels.
    *   **Competitor**: Multi-select dropdown (optional, for External section / competitor filtering)
    *   **Platform**: Chips (**Facebook/Instagram**, **Google Ads**, ~~TikTok~~)
    *   **Advertiser**: Filter by advertiser profile
    *   **Date Range**: Date picker
    *   **Search**: Search by title/description
*   **Component**: Filter bar with `FormElements`
*   **Note**: When accessed from Internal section context, default filter should show "My Channels" (project-linked) only.

### 1.3. Summary Stats
*   **Cards**:
    *   **Total Video Ads**: Count of all video ads (Meta + Google Ads only while TikTok Ads is disabled)
    *   **Active Advertisers**: Count of unique advertisers
    *   **Total Impressions**: Sum of all impressions
*   **Component**: `CardDataStats` (x3)

### 1.4. Video Ad Detail Modal
*   **Trigger**: Click "View" button in table row
*   **Content**:
    *   **Video Player**: Full-size video player (videoUrl, videoHdUrl, videoSdUrl)
    *   **Metadata**: Title, description, published date, platform
    *   **CTA Section**: Display `cta_text` as prominent button/link with `cta_type` badge (e.g., "LEARN_MORE", "MESSAGE_PAGE")
    *   **Landing Page**: If `link_url` exists, show as clickable link with label "Discovered Landing Page" and link to LandingPage detail if it exists in system
    *   **Advertiser Info**: Advertiser profile info
    *   **Ad Metrics**: Impressions, spend, reach
    *   **Analysis**: AI insights (if available)
*   **Component**: `Modal` (Large)

### 1.5. States
*   **Empty**: "No video ads found. Video Ads will appear after Ads Library crawl runs."
*   **Loading**: Skeleton table
*   **No Results**: "No video ads match your filters."

### 1.6. TikTok Ads Lock (Product Constraint)
*   **Constraint**: TikTok Ads crawler is **disabled/paused** for this product version.
*   **UI Requirements**:
    *   TikTok as a platform option in filters must be **hidden or clearly marked as “Disabled / Coming later”**.
    *   No TikTok Ads‑specific stats or counters should be shown in this page.
    *   Any existing toggles/actions that rely on TikTok Ads data must be removed or disabled.
