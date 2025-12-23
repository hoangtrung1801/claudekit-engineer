# UI Design: What's New

> [!NOTE]
> **Section**: External  
> **Route**: `/projects/{id}/whats-new`

## 1. Page Requirements

### 1.1. Update Timeline
*   **Goal**: Track version updates and changes from competitor apps
*   **Timeline Item**:
    *   **Date Header**: Group updates by date
    *   **Update Card**:
        *   Competitor: Logo + App Name
        *   Type Badge: App Update / Content / Policy
        *   Impact Badge: High (Red) / Medium (Amber) / Low (Green)
        *   Version: e.g., "v2.5.0 → v2.6.0"
        *   Description: What changed (AI-generated summary)
        *   AI Insight: Strategic implication (highlighted box)
        *   Action: "View Details" → Expand or Modal
*   **Component**: Custom Timeline with `Card` items

### 1.2. Filter Bar
*   **Requirements**:
    *   **Competitor**: Multi-select dropdown
    *   **Time Period**: Last 7 days / 30 days / 90 days / Custom
    *   **Update Type**: App Update / Content / Policy chips
    *   **Impact Level**: High / Medium / Low chips
*   **Component**: Filter bar with `FormElements`

### 1.3. Summary Stats
*   **Cards**:
    *   **Total Updates**: Count this period
    *   **High Impact**: Count of critical updates
    *   **Most Active**: Competitor with most updates
*   **Component**: `CardDataStats` (x3)

### 1.4. Update Detail (Expanded/Modal)
*   **Trigger**: Click "View Details"
*   **Content**:
    *   Full version changelog
    *   Screenshot comparisons (before/after if available)
    *   AI analysis: Impact assessment
    *   Related competitor actions
*   **Component**: `Modal` or `Accordion`

### 1.5. States
*   **Empty**: "No updates tracked yet. Updates will appear after first crawl."
*   **Loading**: Skeleton timeline
*   **No Results**: "No updates match your filters."

