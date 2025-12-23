# UI Design: Social Channels

> [!NOTE]
> **Section**: External  
> **Route**: `/projects/{id}/social`

## 1. Page Requirements

### 1.1. Channels Overview Grid
*   **Goal**: Monitor social media presence of all competitors
*   **Card Requirements**:
    *   **Competitor**: Logo + App Name
    *   **Platform Icon**: TikTok, YouTube, Instagram, Facebook
    *   **Handle**: @username
    *   **Followers**: Count with trend indicator (↑/↓)
    *   **Growth Rate**: % change (last 30 days)
    *   **Engagement Rate**: Avg engagement %
    *   **Last Post**: Relative date
    *   **Status**: Active (Green) / Inactive (Gray)
*   **Component**: Grid of `Card` with metrics

### 1.2. Platform Tabs
*   **Goal**: Filter channels by platform
*   **Options**: All / TikTok / YouTube / Instagram / Facebook
*   **Component**: Tab navigation

### 1.3. Growth Signals Section
*   **Goal**: Highlight channels with significant growth
*   **Display**:
    *   **Fast Growing**: Channels with >10% follower growth
    *   **Viral Content**: Recent posts with unusual engagement
    *   **New Channels**: Recently added competitor channels
*   **Component**: `Card` with highlights list

### 1.4. Add Channel Form
*   **Goal**: Link new social channel to competitor
*   **Fields**:
    *   **Competitor**: Dropdown (existing competitors)
    *   **Channel URL**: Input with auto-detection
    *   Auto-detect platform from URL
*   **Component**: `Card` + `FormElements`

### 1.5. Channel Detail (Click/Expand)
*   **Content**:
    *   Profile info: Bio, verified status
    *   Recent posts summary
    *   Growth chart (30-day trend)
    *   Top performing content links
*   **Component**: `Modal` or Slide-out panel

### 1.6. Summary Stats
*   **Cards**:
    *   **Total Channels**: Count tracked
    *   **Fastest Growing**: Channel with highest growth rate
    *   **Most Engaged**: Channel with highest engagement
*   **Component**: `CardDataStats` (x3)

### 1.7. Social Video Stats (Organic vs Ads)
*   **Goal**: Give a quick **social video breakdown** per project from the Social page.
*   **Cards** (above channels grid or in a dedicated \"Video Stats\" section):
    *   **Organic Videos**: Total count of `VideoOrganic` records for the current project (all platforms).
    *   **Video Ads**: Total count of `VideoAds` records for the current project (Meta + Google Ads only while TikTok Ads is disabled).
    *   **Top Platform (Organic)**: Platform with the highest organic video volume / engagement.
*   **UX Notes**:
    *   Cards should clearly label **Organic** vs **Ads** to avoid confusion.
    *   Each card can deep-link to the corresponding detail pages (`/projects/{id}/video-organic`, `/projects/{id}/video-ads`).

### 1.7. States
*   **Empty**: "No channels tracked. Add social channels from Competitors page."
*   **Loading**: Skeleton grid
*   **No Results**: "No channels match your filters."

