# UI Design: Video Organic

> [!NOTE]
> **Implementation Reference**:
> - Components: `docs/4.ui-design/component-library.md`
> - Page Structure: `docs/4.ui-design/page-structure.md` Section 11
> 
> **Usage Context**:
> - **External Section**: Shows competitor video organic (from competitor social channels).
> - **Internal Section**: Can also show project's own video organic (from project-linked social channels) when accessed from Internal section context.

## 1. Page Requirements: Video Organic

**Route**: `/projects/{id}/video-organic`  
**Section**: External (default) or Internal (when viewing project's own videos)

### 1.1. Video Organic Grid
*   **Goal**: Browse organic videos from social platforms
    *   **External Section**: Shows competitor organic videos (from competitor social channels).
    *   **Internal Section**: Shows project's own organic videos (from project-linked social channels).
*   **Card Requirements**:
    *   **Thumbnail**: 16:9 video preview
    *   **Source Badge**: 
        *   "My Channel" badge if from project-linked channel (Internal context)
        *   "Competitor" badge with logo + name if from competitor-linked channel (External context)
    *   **Platform**: Icon (TikTok, Facebook, YouTube, IG)
    *   **Metrics**: Views/Plays, Likes/Hearts, Comments, Shares, Engagement Rate
    *   **Hero Badge**: Gold star if `is_hero = true`
    *   **Date**: Published date
    *   **Action**: Click to open Video Player Modal
*   **Component**: Grid of `VideoFeedCard` (Custom)

### 1.2. View Toggle
*   **Options**: Grid View / List View
*   **Component**: Toggle buttons (Icons)

### 1.3. Advanced Filters
*   **Requirements**:
    *   **Source Filter** (when accessed from Internal section): Toggle "My Channels" vs "Competitor Channels" to filter by project-linked vs competitor-linked social channels.
    *   **Competitor**: Multi-select dropdown (for External section / competitor filtering)
    *   **Platform**: Chips (TikTok, Facebook, YouTube, IG)
    *   **Date Range**: Date picker
    *   **Hero Only**: Toggle switch
    *   **Sort By**: Views, Date, Hero Score
*   **Component**: Filter bar with `FormElements`
*   **Note**: When accessed from Internal section context, default filter should show "My Channels" (project-linked) only.

### 1.4. Pagination
*   **Requirements**: Load more / Infinite scroll
*   **UX**: "Load More" button at bottom

### 1.5. States
*   **Empty**: "No videos collected yet. Videos will appear after first crawl."
*   **Loading**: Skeleton grid
*   **No Results**: "No videos match your filters."
