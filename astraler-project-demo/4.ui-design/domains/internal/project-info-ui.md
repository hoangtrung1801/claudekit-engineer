# UI Design: Project Info Page

> [!NOTE]
> **Section**: Internal  
> **Route**: `/projects/{id}/info`

## 1. Page Requirements

### 1.1. Project Details Card
*   **Fields**:
    *   **Project Name**: Editable text
    *   **Description**: Textarea (optional, multi-line description of the project)
    *   **Icon**: Upload/URL preview
    *   **Project Status**: Dropdown/Radio (Pre-Launch / Live)
    *   **iOS Store URL**: Link with validation (required when status = Live)
    *   **Android Store URL**: Link with validation (optional)
*   **Component**: `Card` + `FormElements`
*   **Note**: Project uses separate `iosStoreUrl` and `androidStoreUrl` fields (not generic `storeUrl`) for clear platform distinction

### 1.2. Purpose & Goals Section
*   **Fields**:
    *   **Purpose**: Textarea (What this project tracks)
    *   **Goals**: Tag input (e.g., "Find hero videos", "Track ASO")
*   **Component**: `Card` + `FormElements`

### 1.3. Submitted Metadata Display
*   **Content**:
    *   App Name from Store
    *   Bundle ID
    *   Developer Name
    *   Category
    *   Rating (if pulled from store)
*   **Component**: `Card` (Read-only display)
*   **Action**: "Refresh from Store" button

### 1.4. States
*   **New Project**: Empty metadata, prompt to add store URLs
*   **Loading**: Skeleton cards
