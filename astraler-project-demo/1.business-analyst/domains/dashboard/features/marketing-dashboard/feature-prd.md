# Feature PRD: Marketing Dashboard

## 1. Feature Overview
The **Marketing Dashboard** is the command center for the Marketing Persona. It aggregates Hero Videos, Creative Trends, and Ad Intelligence into a visual feed.

## 2. User Components

### 2.1. Global Trending Feed
*   **Layout**: TikTok-style or Grid view of videos.
*   **Sorting**: "Highest Momentum" (Growth Rate) first.
*   **Data**: Thumbnail, Play Button, Growth % Badge, Competitor Name.

### 2.2. Creative Ads Explorer
*   **Filters**: "Hook Type" (e.g., UGC, Skit), "Duration" (<15s, >30s), "Platform" (TikTok vs FB).
*   **Search**: Full-text search on Ad Transcripts.

### 2.3. Pain Point Map
*   Visual representation of Competitor Weaknesses (from FR16).

## 3. Acceptance Criteria

### AC1: Load Time
*   Dashboard must render in < 3 seconds. Heavy queries (aggregations) must be pre-calculated or cached.

### AC2: Filtering
*   Changing a date range (e.g., "Last 7 days") must update all widgets instantly.

### AC3: Playback
*   Clicking a video thumbnail opens a Modal playing the video (via CDN URL) with Metadata sidebar (Transcript, Stats).

## 4. Technical Constraints
*   **Pagination**: Trending feed must support infinite scroll or pagination to handle thousands of ads.
*   **Media**: Do NOT auto-play all videos (bandwidth cost). Auto-play only on hover.
