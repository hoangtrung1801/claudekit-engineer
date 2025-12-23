# UI Design: Keywords Management

> [!NOTE]
> **Implementation Reference**:
> - Components: `docs/4.ui-design/component-library.md`
> - Page Structure: `docs/4.ui-design/page-structure.md` Section 10

## 1. Page Requirements: Keywords Management

**Route**: `/projects/{id}/keywords`

### 1.1. Keywords Table
*   **Goal**: Manage SEO/ASO keywords for tracking competitor rankings
*   **Data Points**:
    1.  **Keyword**: The search term
    2.  **Platform**: iOS, Android, or All
    3.  **Date Added**: Created timestamp
    4.  **Actions**: Edit, Delete
*   **Component**: `TableThree`

### 1.2. Add Keyword Form
*   **Goal**: Quick keyword entry with platform selection
*   **Fields**:
    *   **Keyword Input**: Text field (Required)
    *   **Platform Selector**: Dropdown (iOS / Android / All)
    *   **Add Button**: Primary action
*   **Component**: `Card` + `FormElements`

### 1.3. Filtering
*   **Requirements**: Filter by Platform
*   **UX**: Pill/Chip selector above table

### 1.4. States
*   **Empty**: "No keywords added. Start tracking competitor rankings."
*   **Loading**: Skeleton rows in table
