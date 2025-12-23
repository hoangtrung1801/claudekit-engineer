# Domain SAD: Dashboard (Presentation)

## 1. Architecture Overview
The **Dashboard Domain** provides a **unified feed** of competitor activities. It aggregates data from multiple domains (Updates, Videos, Reviews) into a single timeline view.

## 2. Component Design (Visual Structure)
Based on the approved design:

### 2.1. Main Feed (Masonry/List Layout)
*   **Filter Tabs**: `All Activities`, `App Updates`, `New Videos`, `Reviews`, `Hero Videos`.
*   **Card Types**:
    *   **App Update Card**: Version number, changelog list, "AI Strategic Insight" box.
    *   **Review Batch Card**: Avg rating, sentiment score, "AI Sentiment Analysis" (Top Complaint/Praise).
    *   **Video Content Card**: Thumbnail, duration, "Hero" badge (if viral), "New Content" badge.
    *   **Viral Alert Card**: Special high-priority card for "Hero Video Detected" with growth metrics.

### 2.2. Right Sidebar (Summary & Navigation)
*   **Today's Summary**: Counter widgets for App Updates, New Videos, Hero Videos, New Reviews.
*   **Monitored Brands**: List of active competitors with status dots.
*   **Filter by Competitor**: Checkboxes to toggle visibility in the main feed.

## 3. Data Flow
1.  **Request**: `GET /dashboard/feed?filters=...`
2.  **Aggregation**: Service queries `Video`, `AppUpdate`, `ReviewBatch` tables.
3.  **Sorting**: Chronological order (newest first).
4.  **Response**: Polymorphic list of feed items.

## 4. Technology Choices
*   **Backend**: NestJS (Aggregation Service).
*   **Frontend**: React + TanStack Query (Infinite Scroll).
