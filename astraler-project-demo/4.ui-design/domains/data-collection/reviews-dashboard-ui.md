# UI Design: Reviews Dashboard

> [!NOTE]
> **Implementation Reference**:
> - Components: `docs/4.ui-design/component-library.md`
> - Page Structure: `docs/4.ui-design/page-structure.md` Section 14

## 1. Page Requirements: Reviews Dashboard

**Route**: `/projects/{id}/reviews`

### 1.1. Reviews List
*   **Goal**: Browse and analyze app store reviews
*   **Row Requirements**:
    *   **Competitor**: Logo + App Name
    *   **Platform**: Icon (iOS / Android)
    *   **Rating**: Star icons (1-5)
    *   **Sentiment**: Badge (Positive/Neutral/Negative with colors)
    *   **Review Title**: Bold text
    *   **Review Content**: Truncated with "Read More"
    *   **Pain Point Tags**: AI-extracted issue tags (colored badges)
    *   **Date**: Published date
    *   **Helpfulness**: Thumbs up count
*   **Component**: `TableOne` or Custom List

### 1.2. Advanced Filters
*   **Requirements**:
    *   **Competitor**: Multi-select dropdown
    *   **Platform**: iOS / Android chips
    *   **Rating**: Star range selector (1-5)
    *   **Sentiment**: Positive / Neutral / Negative chips
    *   **Pain Points**: Tag filter (multi-select)
    *   **Date Range**: Date picker
*   **Component**: Filter bar with `FormElements`

### 1.3. Summary Stats
*   **Goal**: Quick overview of review sentiment
*   **Cards**:
    *   **Average Rating**: Number + Star visual
    *   **Sentiment Distribution**: Donut chart (Positive/Neutral/Negative)
    *   **Top Pain Points**: Tag cloud or bar chart
*   **Component**: `CardDataStats` + `ChartThree`

### 1.4. Export Function
*   **Requirements**: Export filtered reviews to CSV
*   **UX**: "Export CSV" button in page header
*   **Component**: `Button` (Secondary)

### 1.5. States
*   **Empty**: "No reviews collected. Reviews will appear after first crawl."
*   **Loading**: Skeleton rows
*   **No Results**: "No reviews match your filters."
