# UI Design: Project Social Management (Internal - Astraler Marketing Platform)

> [!NOTE]
> **Section**: Internal (Astraler Marketing Platform)  
> **Route**: `/projects/{id}/social`  
> **Purpose**: Manage and monitor **Astraler's own social channels** (channels that Astraler is building/growing). This is **completely separate** from External section (competitor channels).

## 1. Page Requirements

### 1.1. Social Channels Overview
*   **Goal**: Manage and monitor **Astraler's own social channels** (channels that Astraler is building/growing)
*   **Important**: This page **ONLY shows Astraler's own channels** (`projectId` set, `competitorId` null). **DO NOT show competitor channels** - those are in External section.
*   **Display**:
    *   **Grid/List View**: All social channels linked to this project via `projectId` (Astraler's own channels only)
    *   **NO Filter Toggle**: This page only shows Astraler's channels. Competitor channels are in External section.
    *   **Platform Icons**: TikTok, Facebook, Instagram, YouTube, X
    *   **Channel Cards**:
        *   Avatar + Display Name
        *   Handle (@username)
        *   Platform badge
        *   Current Stats: Followers, Following, Posts Count, Videos Count
        *   Growth Indicator: ↑/↓ with percentage change (last 30 days)
        *   Last Updated: Relative time (e.g., "2 hours ago")
        *   Actions: View Details, Refresh Stats, Delete (Admin only)
*   **Component**: Grid of `Card` with metrics

### 1.2. Add Social Channel Form
*   **Goal**: Add new social channel to Internal project
*   **Fields**:
    *   **Platform**: Dropdown (TikTok, Facebook, Instagram, YouTube, X)
    *   **Profile URL**: Input with validation (required)
    *   **Handle/Username**: Optional input (auto-filled if URL parsing succeeds)
    *   **Display Name**: Required input (auto-filled if URL parsing succeeds, user can edit)
    *   **Advertiser ID**: Optional input (for Ads Library integration)
*   **Validation**:
    *   Profile URL must be valid for selected platform
    *   System validates URL format and extracts platform ID
    *   Checks for duplicates (same platform + platformId)
*   **Actions**:
    *   "Add Channel" button
    *   "Cancel" button
*   **Component**: `Modal` or `Card` with `FormElements`
*   **Post-Submit**: Channel is created, initial crawl is triggered, user sees success message

### 1.3. Social Channel Detail View
*   **Trigger**: Click on channel card or "View Details" button
*   **Content**:
    *   **Profile Info**: Avatar, Display Name, Handle, Bio, Verification Badge
    *   **Growth Chart**: Followers over time (30-day, 90-day, 1-year views)
    *   **Engagement Metrics**: Engagement rate trend, posts/videos count over time
    *   **Recent Activity**: Latest posts/videos (if available from crawler)
    *   **Actions**: 
        *   "Refresh Stats" button (triggers immediate crawl)
        *   "Delete Channel" button (Admin only, with confirmation dialog)
*   **Component**: `Modal` or Slide-out panel

### 1.4. Summary Stats Cards
*   **Cards** (top of page):
    *   **Total Channels**: Count of all Astraler's social channels (project-linked only, `projectId` set)
    *   **Total Followers**: Sum of followers across all Astraler's channels
    *   **Average Growth Rate**: Average follower growth % (last 30 days) for Astraler's channels
    *   **Total Video Ads**: Count of VideoAds from Astraler's channels
    *   **Total Video Organic**: Count of VideoOrganic from Astraler's channels
*   **Component**: `CardDataStats` (x5)
*   **Data Source**: All metrics filtered to show **only Astraler's channels** (`projectId` set, `competitorId` null). **No competitor data**.

### 1.5. Growth Trends Section
*   **Goal**: Visualize growth across all project social channels
*   **Display**:
    *   **Line Chart**: Combined followers growth over time (all channels)
    *   **Bar Chart**: Growth rate comparison by platform
    *   **Table**: Top growing channels (sorted by growth %)
*   **Component**: Charts using chart library (e.g., Recharts, Chart.js)

### 1.6. Permissions & Actions
*   **Regular Users**:
    *   ✅ Can view all social channels
    *   ✅ Can add new social channels
    *   ✅ Can trigger manual refresh for stats
    *   ❌ Cannot delete social channels
*   **Admin Users**:
    *   ✅ All regular user permissions
    *   ✅ Can delete social channels (with confirmation)
*   **UI Indicators**:
    *   Delete button only visible for Admin users
    *   Tooltip/disabled state for regular users attempting delete

### 1.7. States
*   **Empty**: "No social channels tracked. Add your first social channel to start monitoring growth."
*   **Loading**: Skeleton grid/cards
*   **No Results (Filter)**: "No channels match your filters."
*   **Error**: Error message with retry button

### 1.8. Integration with Data Collection
*   **Automatic Crawling**: When a social channel is added, system automatically:
    *   Triggers initial profile crawl (fetches current stats)
    *   Schedules regular stats updates (same frequency as competitor social channels)
    *   **Video Organic Discovery**: Social Content crawler discovers organic videos from project's channels and creates `VideoOrganic` records (visible in Internal section).
    *   **Video Ads Discovery**: If channel has `advertiserId`, Ads Library crawler discovers video ads and creates `VideoAds` records (visible in Internal section).
*   **Manual Refresh**: User can trigger immediate stats crawl for any channel
*   **Growth Tracking**: System tracks metrics over time via `SocialChannelSnapshot` records

### 1.9. Links to Video Content
*   **Video Ads Link**: Each channel card can show count of VideoAds discovered from this channel, with link to Video Ads page (filtered to this channel).
*   **Video Organic Link**: Each channel card can show count of VideoOrganic published on this channel, with link to Video Organic page (filtered to this channel).
*   **Context**: All video content from project-linked channels is accessible in **Internal section**, not External section.
