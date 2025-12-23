# Domain UI: Project Management

> [!NOTE]
> **Implementation Reference**:
> - Components: `docs/4.ui-design/component-library.md`

## 1. Page Requirements: Project List

**Route**: `/projects`

### 1.1. List Table
*   **Data**: Project Name, Competitor Count, Status (Active/Idle), Last Sync.
    *   **Admin View**: Additional column "Owner" showing user email who owns the project.
*   **Actions**: 
    *   **Regular User**: Edit, Delete, View Dashboard.
    *   **Admin**: Edit, Delete, View Dashboard (can delete any project).
*   **Component**: `TableThree`.
*   **Admin Behavior**: 
    *   Admin users see **all projects** from all users (not just their own).
    *   Regular users see only their own projects.
    *   Frontend automatically uses the same `/projects` endpoint - backend handles filtering based on user role.
    *   Admin can delete any project (with confirmation dialog).
*   **States**:
    *   **Empty**: Illustration with "Create Project" CTA.
    *   **Loading**: Skeleton rows.

### 1.2. Create Project (Admin)
*   **Location**: "Create Project" button in projects list page.
*   **Form Fields** (same as regular user):
    *   Project Name (required)
    *   Description (optional)
    *   Category (optional)
    *   Status: Pre-Launch / Live (required)
    *   iOS Store URL (required if Live)
    *   Android Store URL (optional)
    *   Region (default: US)
*   **Admin-Specific Field**:
    *   **Owner** (optional dropdown): Select user to create project for. If not specified, project is created for admin.
    *   **Visibility**: Only shown when user is admin.
*   **Component**: Modal with form (`FormElements`).
*   **Validation**: Same as regular user creation.
*   **Actions**: Create button, Cancel button.

## 2. Page Requirements: Project Settings

**Route**: `/projects/{id}/settings`

### 2.1. Competitor Management
*   **Input**:
    *   URL entry field with built-in validation (Regex check).
    *   "Add" button with loading spinner.
*   **List**:
    *   Shows Competitor Profile (Avatar + Name).
    *   Status Icon: Spinning (Crawling) -> Check (Done).
*   **Component**: `FormElements` (Input), `TableTwo` (List).

### 2.2. General Settings
*   **Fields**: Project Name rename, Keyword tags management.
*   **Danger Zone**: Delete Project button (Red).
*   **Component**: `FormElements`.

## 3. Page Requirements: Landing Pages

**Route**: `/projects/{id}/landing-pages`

### 3.1. List View
*   **Data**: Landing Page URL, Competitor Name (with icon), Status (Active/Pending/Error), Last Scanned Date.
*   **Grouping**: Group by Competitor (expandable sections).
*   **Actions**: 
    *   Open URL (external link icon)
    *   Remove landing page (delete icon with confirmation)
    *   Filter by competitor (dropdown)
*   **Component**: `TableTwo` or custom grouped list.
*   **States**:
    *   **Empty**: Illustration with "Add Landing Page" CTA linking to Competitors page.
    *   **Loading**: Skeleton rows.

### 3.2. Status Indicators
*   **Active**: Green badge - Landing page is being crawled regularly.
*   **Pending**: Yellow badge - Landing page added but not yet scanned.
*   **Error**: Red badge - Last scan failed (with error message tooltip).

### 3.3. Add Landing Page
*   **Note**: Adding landing pages is done from Competitors page (nested action).
*   **This page**: Shows all landing pages across all competitors in the project.
