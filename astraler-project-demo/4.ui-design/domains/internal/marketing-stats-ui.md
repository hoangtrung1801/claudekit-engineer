# UI Design: Marketing Stats Dashboard (Internal - Astraler Marketing Platform)

> [!NOTE]
> **Section**: Internal (Astraler Marketing Platform)  
> **Route**: `/projects/{id}/marketing`  
> **Purpose**: Executive dashboard for marketing team and senior management to track **Astraler's own social channels, video ads, and video organic performance**. This dashboard **ONLY shows Astraler's own data** - completely separate from competitor data in External section.

## 1. Page Requirements

### 1.1. Executive Summary Cards
*   **Goal**: Provide high-level overview for senior management about **Astraler's own marketing performance**
*   **Important**: All metrics show **ONLY Astraler's own data** (`projectId` set, `competitorId` null). **No competitor data**.
*   **Cards** (x4):
    *   **Total Social Channels**: Count of all Astraler's social channels (project-linked only, `projectId` set)
    *   **Video Ads Running**: Count of `VideoAds` records from Astraler's social channels (ads that Astraler is running)
    *   **Video Organic Published**: Count of `VideoOrganic` records from Astraler's social channels (organic content that Astraler is publishing)
    *   **Total Followers Growth**: Sum of followers across all Astraler's channels with % change (last 30 days)
*   **Component**: `CardDataStats` (x4) with trend indicators

### 1.2. Social Channels Overview Section
*   **Goal**: Quick view of social channel performance
*   **Content**:
    *   **Summary Stats**:
        *   Total Channels (project-linked)
        *   Total Followers (sum)
        *   Average Growth Rate (%)
        *   Total Posts/Videos Count
    *   **Action**: "View All Channels →" link to `/projects/{id}/social` page
*   **Component**: `Card` with stats grid + link

### 1.3. Video Ads Performance Section
*   **Goal**: Track video ads performance from project's own social channels
*   **Content**:
    *   **Summary Stats**:
        *   **Total Ads**: Count of all VideoAds from project's social channels
        *   **Active Ads**: Count of VideoAds with `status = ACTIVE`
        *   **Total Impressions**: Sum of impressions (min + max range)
        *   **Total Spend**: Sum of spend (if available)
    *   **Action**: "View All Ads →" link to `/projects/{id}/video-ads` page (filtered to show only project's ads)
*   **Component**: `Card` with stats grid + link

### 1.4. Video Organic Performance Section
*   **Goal**: Track organic video performance from project's own social channels
*   **Content**:
    *   **Summary Stats**:
        *   **Total Videos**: Count of all VideoOrganic from project's social channels
        *   **Total Views**: Sum of views across all organic videos
        *   **Total Engagement**: Sum of likes + comments + shares
        *   **Average Engagement Rate**: Calculated engagement rate
    *   **Action**: "View All Videos →" link to `/projects/{id}/video-organic` page (filtered to show only project's videos)
*   **Component**: `Card` with stats grid + link

### 1.5. Growth Trends Charts
*   **Goal**: Visualize growth trends over time
*   **Charts**:
    *   **Followers Growth Over Time**: Line chart showing combined followers growth across all project social channels (30-day, 90-day, 1-year views)
    *   **Video Ads Performance**: Line chart showing impressions over time (if ads are running)
    *   **Video Organic Performance**: Line chart showing views over time
*   **Component**: Charts using chart library (e.g., Recharts)

### 1.6. Recent Activity Feed
*   **Goal**: Show latest updates across social channels, ads, and organic videos
*   **Content**:
    *   **Latest Social Channel Updates**: New channels added, follower milestones, etc.
    *   **Latest Video Ads Discovered**: New ads found from ads library crawler
    *   **Latest Video Organic Published**: New organic videos published on social channels
*   **Component**: Timeline or feed list

### 1.7. States
*   **Empty (No Channels)**: "No social channels tracked. Add your first social channel to start monitoring."
*   **Empty (No Videos)**: "No videos yet. Videos will appear after crawlers run."
*   **Loading**: Skeleton cards and charts
*   **Error**: Error message with retry button

### 1.8. Data Source Clarification
*   **CRITICAL**: This page shows data from **Astraler's own social channels** (project-linked `SocialChannel` records with `projectId` set, `competitorId` null), **NOT competitor data**.
*   **Business Separation**: 
    *   **Internal Section (this page)**: Astraler's own marketing operations - channels, ads, organic content that Astraler is building/running.
    *   **External Section**: Competitor intelligence - competitor channels, competitor ads, competitor organic content.
    *   **No Data Overlap**: These two sections are completely separate business domains.
*   **Video Ads**: Only shows VideoAds where `socialChannel.projectId = currentProjectId AND socialChannel.competitorId IS NULL` (ads from Astraler's own channels).
*   **Video Organic**: Only shows VideoOrganic where `socialChannel.projectId = currentProjectId AND socialChannel.competitorId IS NULL` (organic videos from Astraler's own channels).
*   **Filtering**: All queries must filter by `projectId` and ensure `socialChannel.projectId = projectId AND socialChannel.competitorId IS NULL`. **Never mix with competitor data**.
