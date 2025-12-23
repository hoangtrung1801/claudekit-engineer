# UI Design: Watchlists Management

> [!NOTE]
> **Implementation Reference**:
> - Components: `docs/4.ui-design/component-library.md`
> - Page Structure: `docs/4.ui-design/page-structure.md` Section 11

## 1. Page Requirements: Social Media Watchlists

**Route**: `/projects/{id}/watchlists`

### 1.1. Watchlists Table (Grouped by Competitor)
*   **Goal**: Track all social media accounts for each competitor
*   **Data Structure**: Grouped list
    *   **Competitor Name** (Header)
        *   Platform Icon + Account Name
        *   Status: Active / Inactive
        *   Last Crawled: Timestamp
        *   Actions: Delete
*   **Component**: `Accordion` + `TableTwo`

### 1.2. Add Social Account Form
*   **Goal**: Add new social media account with auto-detection
*   **Fields**:
    *   **Competitor Selector**: Dropdown (existing competitors)
    *   **Account URL Input**: Text field with validation (`URLInput` - Custom)
    *   **Platform**: Auto-detected from URL (TikTok, Instagram, YouTube, Facebook)
    *   **Add Button**: Primary action
*   **Component**: `Card` + `FormElements`

### 1.3. Platform Icons
*   **Requirements**: Clear visual platform identification
*   **UX**: Icon badges with brand colors

### 1.4. States
*   **Empty**: "No social accounts added. Track competitor content."
*   **Loading**: Skeleton rows
*   **Crawling**: Spinning icon on "Last Crawled" field
