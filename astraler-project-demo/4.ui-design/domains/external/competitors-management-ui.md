# UI Design: Competitors Management (Enhanced)

> [!NOTE]
> **Section**: External  
> **Route**: `/projects/{id}/competitors`

## 1. Page Requirements

### 1.1. Competitors List View
*   **Goal**: Overview of all tracked competitor apps
*   **Card/Row Display**:
    *   **App Icon**: 48x48 image
    *   **App Name**: Primary text
    *   **Category**: Badge (e.g., "Games", "Productivity")
    *   **Social Channels Count**: Badge showing count (e.g., "3 channels")
    *   **Status**: Active/Pending/Error badge
    *   **Actions**: Expand, Edit, Delete
*   **Component**: `TableThree` or Card Grid

### 1.2. Add Competitor Form
*   **Goal**: Add competitor by App Store URL
*   **Fields**:
    *   **App URL**: Input with validation (iOS/Android store URL)
    *   Auto-detection of platform from URL
*   **Behavior**:
    *   Submit → Fetch app metadata → Create competitor
    *   Show loading spinner during fetch
*   **Component**: `Card` + `URLInput` (Custom)

### 1.3. Competitor Detail (Expanded/Modal)
*   **Trigger**: Click row or "Expand" action
*   **Content**:
    *   **App Info**: Icon, Name, Developer, Category, Rating
    *   **Social Channels Section**:
        *   List of linked channels (TikTok, IG, YouTube, FB)
        *   Platform icon + Username + Last Crawled
        *   Add Channel button
    *   **Actions**: Edit competitor, Remove competitor
*   **Component**: `Accordion` or `Modal`

### 1.4. Add Social Channel Form
*   **Context**: Within competitor detail
*   **Fields**:
    *   **Channel URL**: Input with platform auto-detect
*   **Platforms Supported**: TikTok, Instagram, YouTube, Facebook
*   **Component**: `FormElements` with `URLInput`

### 1.5. States
*   **Empty**: "No competitors tracked. Add your first competitor."
*   **Loading**: Skeleton cards
*   **Fetching**: Spinner on add form during metadata fetch
