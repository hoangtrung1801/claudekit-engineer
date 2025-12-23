# Domain UI: Dashboard

> [!NOTE]
> **Implementation Reference**:
> - Components: `docs/4.ui-design/component-library.md`
> - Page Structure: `docs/4.ui-design/page-structure.md`

## 1. Page Requirements: Marketing Dashboard

**Route**: `/projects/{id}`

### 1.1. Statistics Section
*   **Goal**: Instant health check of the project.
*   **Data Points**:
    1.  **Total Views**: Aggregated count + % growth.
    2.  **Hero Videos**: Count of videos that match the BRD definition (growth ≥ 20% within 24 hours, based on snapshot deltas).
    3.  **Active Competitors**: Count.
    4.  **Budget**: Spent amount vs Limit (Progress bar).
*   **Component**: `CardDataStats` (x4).

### 1.2. Visual Insights
*   **Market Share**: Donut chart showing "Share of Voice" (Views per competitor).
*   **Trends**: Area chart showing "Daily Views" over last 30 days.
*   **Component**: `ChartThree` (Share), `ChartOne` (Trends).

### 1.3. Hero Video Feed
*   **Goal**: "TikTok-style" feed of high-performing competitor content.
*   **Card Requirements**:
    *   **Thumbnail**: Large, clear visual.
    *   **Metrics**: Views, Engagement Rate prominently displayed.
    *   **AI Insight**: "Why it worked" snippet (Yellow highlight).
    *   **Action**: Click triggers Play modal.
*   **Component**: Custom `VideoFeedCard` (extends `ChatCard`).

### 1.4. Filtering
*   **Requirements**: Filter by Platform (IG/TikTok), Date Range, and "Heroes Only".
*   **UX**: Pill/Chip selector above feed.
