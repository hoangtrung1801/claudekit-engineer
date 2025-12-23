# UI Design: ASO Dashboard

> [!NOTE]
> **Section**: Internal  
> **Route**: `/projects/{id}/aso`

## 1. Page Requirements

### 1.1. Keywords Tracking Table
*   **Goal**: Monitor keyword rankings for own app
*   **Columns**:
    *   Keyword
    *   Platform (iOS/Android)
    *   Current Rank
    *   Change (↑/↓ indicator)
    *   Volume (if available)
    *   Actions (Edit, Delete)
*   **Component**: `TableThree`

### 1.2. Add Keyword Form
*   **Fields**:
    *   Keyword Input
    *   Platform Selector (iOS/Android/Both)
*   **Component**: `Card` + `FormElements`

### 1.3. Store Presence (Future)
*   **Placeholder**: "Store rankings coming soon"
*   **Component**: `Card` with illustration

### 1.4. States
*   **Empty**: "No keywords tracked. Add your first keyword."
*   **Loading**: Skeleton rows
