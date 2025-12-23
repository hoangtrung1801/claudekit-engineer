# Domain UI Design: Admin & Settings

> [!NOTE]
> Based on **TailAdmin** template components.
> **Scope**: System Configuration, User Settings, Billing, and Alerts.

## 1. Overview
This domain manages the "Settings" section of the application. It consolidates Admin, Alerts, and Data Collection configurations into a unified interface.

## 2. Layout & Navigation (`/settings`)

*   **Layout**: `DefaultLayout` with a persistent **Settings Sidebar** (internal navigation).
*   **Menu Items**:
    *   **Profile**: Personal info.
    *   **API Keys**: Manage Provider keys (Admin).
    *   **Billing**: Usage & Limits (Admin).
    *   **Notifications**: Alert preferences (Alerts).

## 3. Page: API Keys (`/settings/api-keys`)

### 3.1. Components

#### A. Key Management Table (Component: `TableThree`)
*   **Columns**:
    *   `Provider`: Icon + Name (OpenAI, Apify).
    *   `Key Prefix`: "sk-proj-..." (Masked).
    *   `Added On`: Date.
    *   `Status`: Active (Green) / Expired (Red).
    *   `Actions`: Delete (Trash).

#### B. Add Key Form (Component: `FormElements`)
*   **Structure**: Card "Add New Provider".
*   **Fields**:
    *   `Provider`: Dropdown (OpenAI / Apify).
    *   `Secret Key`: Password Input (Masked).
    *   `Save Button`: Primary.

## 4. Page: Billing & Usage (`/settings/billing`)

### 4.1. Components

#### A. Budget Overview (Component: `CardDataStats`)
*   **Card 1: Monthly Budget**
    *   Value: "$100.00".
    *   Progress: Visual bar showing current spend vs limit.
*   **Card 2: Current Spend**
    *   Value: "$45.20".
    *   Detail: "45% of limit".

#### B. Usage History (Component: `TableOne`)
*   **Header**: Service, Request Count, Cost.
*   **Rows**: ex. "AI Analysis - GPT4", "150 req", "$12.50".

## 5. Page: Notifications (`/settings/notifications`)

### 5.1. Components

#### A. Channel Preferences (Component: `Checkbox` Group)
*   **Section**: "Email Notifications".
    *   [x] Critical System Alerts.
    *   [ ] Daily Digests.
*   **Section**: "Slack Integration".
    *   Input: Webhook URL.
    *   Button: "Test Connection".

## 6. Page: User Management (`/admin/users`)

### 6.1. Components

#### A. Users List Table (Component: `TableOne`)
*   **Columns**:
    *   `Email`: User email address.
    *   `Role`: Badge (Admin/User) with color coding.
    *   `Projects`: Count of user's projects.
    *   `Created`: Date created.
    *   `Actions`: Edit Role, Deactivate buttons.

#### B. Create User Form (Component: `FormElements`)
*   **Structure**: Modal or Card "Create New User".
*   **Fields**:
    *   `Email`: Text input (required, email validation).
    *   `Role`: Dropdown (USER/ADMIN).
    *   `Create Button`: Primary.
*   **Behavior**: On create, sends password reset email to user.

#### C. Role Update Dropdown (Component: `Select`)
*   **Inline Edit**: Click role badge → Dropdown appears.
*   **Options**: USER, ADMIN.
*   **Save**: Auto-saves on selection.

## 7. Page: Project Management (`/admin/projects`)

### 7.1. Components

#### A. Projects List Table (Component: `TableOne`)
*   **Columns**:
    *   `Project Name`: Link to project details.
    *   `App Name`: App name from crawled data (or "Not crawled" if empty).
    *   `Info Status`: Badge showing crawl status:
        *   "Not Crawled" (gray) - PRE_LAUNCH or no iOS URL
        *   "Crawled" (green) - Has appName
        *   "Crawling" (yellow) - Active crawl job
        *   "Failed" (red) - Last crawl failed
    *   `Owner`: User email (link to user).
    *   `Competitors`: Count badge.
    *   `Status`: Badge (PRE_LAUNCH/LIVE).
    *   `Actions`: View Info (opens modal with details + info), Refresh Info buttons.

#### B. Project Info Modal (Component: `Modal`) - Combined View
*   **Tabs or Sections**:
    *   **Tab 1: Project Details**:
        *   Project Name, Owner (user email), Created date.
        *   Competitors: List with clickable links (navigates to competitor detail page).
        *   Keywords: List of keywords.
    *   **Tab 2: App Info** (crawled metadata):
        *   App Header: App icon (large), app name, developer name, category badge.
        *   Rating Section: Star rating, ratings count, rating value.
        *   Description: Full app description text.
        *   Screenshots Gallery: Grid of screenshots (if available).
        *   Metadata: Bundle ID, category, last crawled date.
        *   Recent Updates: List of recent app updates (if available).
*   **Actions**: 
    *   Edit Info button (opens edit form)
    *   Refresh Info button (triggers re-crawl)
*   **Empty State**: If not crawled, show message "Project info not crawled yet. Click Refresh to crawl."

#### C. Edit Project Info Modal (Component: `Modal` with Form)
*   **Form Fields** (editable):
    *   App Name: Text input
    *   Logo URL: Text input (URL)
    *   Description: Textarea (multi-line)
    *   Developer Name: Text input
    *   Category: Text input
    *   Rating: Number input (optional)
    *   Ratings Count: Number input (optional)
    *   Bundle ID: Text input
*   **Actions**: 
    *   Save button (updates project info)
    *   Cancel button (closes modal)
*   **Validation**: Required fields marked with asterisk

#### D. Refresh Info Button
*   **Location**: In project details, project info modal, or table row.
*   **Behavior**: Shows loading state → Success toast → Updates project data.

## 8. Page: Background Tasks (`/admin/tasks`)

### 8.1. Components

#### A. Tasks List Table (Component: `TableOne`)
*   **Columns**:
    *   `Job ID`: Truncated ID (click to view details).
    *   `Type`: Job type (store-crawl, social-crawl, analysis, etc.).
    *   `Queue`: Badge (crawl-queue/analysis-queue).
    *   `Status`: Badge with color (Pending/Active/Completed/Failed).
    *   `Progress`: Progress bar (0-100%).
    *   `Created`: Timestamp.
    *   `Actions`: View Details, Retry (if failed).

#### B. Task Filters (Component: `Select`, `Input`)
*   **Filters**:
    *   Queue: Dropdown (All/Crawl/Analysis).
    *   Status: Dropdown (All/Pending/Active/Completed/Failed).
    *   Search: Text input (search by job ID or type).

#### C. Task Details Modal (Component: `Modal`)
*   **Sections**:
    *   Job Info: ID, type, queue, status, progress.
    *   Timeline: Created, started, finished timestamps.
    *   Attempts: Attempts made, max attempts.
    *   Error: Failed reason and stacktrace (if failed).
    *   Data: Job data payload (JSON view).
*   **Actions**: Retry button (if failed).

#### D. Queue Statistics Cards (Component: `CardDataStats`)
*   **Cards**:
    *   Crawl Queue: Waiting, Active, Completed, Failed counts.
    *   Analysis Queue: Waiting, Active, Completed, Failed counts.
*   **Refresh**: Auto-refresh every 5 seconds.

## 9. Page: Reviews Management (`/admin/reviews`)

### 9.1. Components

#### A. Reviews List Table (Component: `TableOne`)
*   **Columns**:
    *   `Competitor`: Logo + App Name (link to competitor detail).
    *   `Project`: Project name + Owner email (link to project).
    *   `Platform`: Badge (iOS/Android).
    *   `Rating`: Star icons (1-5).
    *   `Sentiment`: Badge (Positive/Neutral/Negative).
    *   `Review Title`: Truncated text.
    *   `Date`: Published date.
*   **Actions**: View Details (opens modal).

#### B. Reviews Filters (Component: `FormElements`)
*   **Filters**:
    *   Project: Dropdown (All projects).
    *   Competitor: Dropdown (All competitors, filtered by selected project).
    *   Platform: Dropdown (All/iOS/Android).
    *   Rating: Dropdown (All/1-5 stars).
    *   Sentiment: Dropdown (All/Positive/Neutral/Negative).
    *   Date Range: Date picker (from/to).

## 10. Page: What's New Management (`/admin/whats-new`)

### 10.1. Components

#### A. App Updates Timeline (Component: Custom Timeline)
*   **Update Cards**:
    *   Competitor: Logo + App Name (link to competitor detail).
    *   Project: Project name + Owner email (link to project).
    *   Version: Version number.
    *   Impact: Badge (High/Medium/Low).
    *   Release Date: Date.
    *   Description: Update notes.
*   **Actions**: View Details (opens modal).

#### B. Updates Filters (Component: `FormElements`)
*   **Filters**:
    *   Project: Dropdown (All projects).
    *   Competitor: Dropdown (All competitors, filtered by selected project).
    *   Time Period: Dropdown (Last 7/30/90 days, Custom).
    *   Impact Level: Dropdown (All/High/Medium/Low).

## 11. Page: Competitors Management (`/admin/competitors`)

### 11.1. Components

#### A. Competitors List Table (Component: `TableOne`)
*   **Columns**:
    *   `Competitor`: Logo + App Name (clickable, navigates to competitor detail).
    *   `Project`: Project name + Owner email (link to project).
    *   `Category`: Category badge.
    *   `Social Channels`: Count badge (clickable to open channels management in competitor detail).
    *   `Landing Pages`: Count badge.
    *   `Reviews`: Count badge.
    *   `App Updates`: Count badge.
*   **Actions**: 
    *   View Details (navigates to competitor detail page).
    *   Edit (opens edit modal).
    *   Refresh (triggers re-crawl of competitor data from store - shows loading state, success toast).
    *   Delete (opens delete confirmation modal).
    *   **Add Competitor**: Primary button opens "Add Competitor" modal (store URL + project selection).

#### B. Competitors Filters (Component: `FormElements`)
*   **Filters**:
    *   Project: Dropdown (All projects).
    *   Search: Text input (search by name, developer).

#### C. Add Competitor Modal (Component: `Modal` with Form)
*   **Trigger**: Primary button on Competitors page.
*   **Fields**:
    *   Project: Dropdown (required).
    *   App Store / Play Store URL: Text input with URL validation (required).
*   **Behavior**:
    *   On submit → shows loading → fetches app metadata → creates competitor → success toast → table refreshes.
    *   Duplicate store URL for same project shows inline error.
*   **Empty State CTA**: If no competitors, show “Add competitor” with same modal trigger.

#### C. Competitor Detail Page (`/admin/competitors/:id` or `/projects/:projectId/competitors/:competitorId`)
*   **Sections**:
    *   **App Info**: Icon, name, developer, category, rating.
    *   **Project Info**: Project name, owner email (link to project).
    *   **Social Channels Management**:
        * **Social Channels Table**:
            * Columns: Platform (TikTok/IG/YouTube/FB badge), Social Name, URL (clickable), Optional Platform ID / ref_social_id, Status (Active/Pending/Error), Last Crawled.
            * Row Actions: Edit (inline or modal), Delete (with confirmation).
        * **Social Filters** (right above the table):
            * Platform filter: `All / TikTok / Instagram / YouTube / Facebook`.
            * Status filter: `All / Active / Pending / Error`.
            * Search box: search theo Social Name / URL.
        * **Add Channel**:
            * Button opens modal to create new channel (Platform + URL + Social Name required, optional Platform ID, optional Status, optional Advertiser ID).
        * **Crawler Actions (UI-only triggers)**:
            * Button `Crawler Advertiser Ads`:
                * Located in Social Channels section (per row or in row actions).
                * When clicked, shows confirm → calls API to trigger crawler Ads Library by advertiser_id of the selected channel.
                * UI only sends request and displays status (loading, success toast, error toast); does not display detailed crawler logic.
            * Button `Crawler Video Social`:
                * Located in Social Channels section.
                * When clicked, sends request to trigger crawler video social (videos/feed) for the selected channel.
                * UI displays similar status: loading + toast, does not handle crawler logic.
    *   **Video Section (Per Competitor)**:
        * **Layout**: Separate card/section below Social, reuse component card grid/table from Videos Library UI.
        * **Menu/Filter Type**:
            * Toggle or Tabs: `Ads` and `Brand`.
            * When selecting `Ads`: only displays Video Ads (marked as type = AD, source from Ads Library).
            * When selecting `Brand`: only displays Video Brand (type = ORGANIC, source from social feed/brand).
        * **Columns/Cards** (depending on layout applied from Videos Library):
            * Thumbnail / preview.
            * Title / caption (truncated).
            * Platform badge (TikTok/YouTube/...).
            * Basic metrics (views/likes if available).
            * Published date.
        * **Additional Filters** (re-use pattern from Videos Library UI):
            * Platform filter (All / TikTok / YouTube / ...).
            * Date range (Last 7/30/90 days).
        * **Interaction**:
            * Click card opens Video detail modal (shared design with admin or project video modal).
            * This section is **read-only** for Admin (does not edit videos here), focused on quick comparison of Ads vs Brand by competitor.
    *   **Landing Pages**: List of landing pages with URLs.
    *   **Recent Reviews**: List of recent reviews (last 10).
    *   **Recent Updates**: List of recent app updates (last 10).
*   **Navigation**: Breadcrumb showing Project → Competitor.

#### D. Internal Social Management Page — `/admin/internal/social`
*   **Objective**: Manage Astraler's own social channels (from `ProjectSocialChannel` table). Each channel belongs to a Project.
*   **Layout**: Table + filters + actions.
*   **Columns**:
    * Social Name, Platform badge, Profile URL (clickable), ref_social_id / platformId (optional), Advertiser ID (optional), Linked Competitor (optional, clickable), Project (required, clickable), Status, Last Crawled.
*   **Filters**:
    * Platform (All/TikTok/Instagram/YouTube/Facebook/X)
    * Status (All/Active/Pending/Error)
    * Project (All projects)
    * Competitor (All competitors; has option "None" to filter channels not linked to competitor)
    * Search (Social name / URL)
*   **Actions**:
    * **Add Social** (modal):
      * **Required**: Platform, Profile URL, Social Name, **Project** (dropdown, required selection)
      * Optional: Platform ID / ref_social_id, Advertiser ID, Status
      * **Optional link**: Competitor (dropdown filtered by selected Project; only shows competitors belonging to that project)
      * Behavior: When user selects Project, Competitor dropdown automatically filters; when changing Project, reset Competitor selection
    * **Edit Link to Competitor** (button in Actions dropdown):
      * Opens modal to allow reselecting Competitor for current channel
      * Competitor dropdown (filtered by channel's project)
      * Option "No competitor (independent)" to unlink
      * Save button to save changes
    * **Delete Social**
    * **Bulk Delete**: checkbox to select multiple rows, Bulk Delete button (confirm).
    * **Crawler actions (UI-only)** per row:
      * `Crawler Advertiser Ads` → trigger Ads Library crawl theo advertiserId
      * `Crawler Video Social` → trigger social video crawl
*   **Navigation**:
    * Click Competitor → Competitor Detail
    * Click Project → Project Detail

#### E. Video Ads Management Page — `/admin/video-ads`
*   **Objective**: Manage Video Ads from Ads Library Transparency APIs (Video.type = AD).
*   **Layout**: Table or card grid (reuse Videos Library UI pattern).
*   **Data Source**: Only videos with `Video.type = AD`
*   **Filters**:
    * Platform: TikTok / YouTube / Instagram / Facebook / All
    * Project: All projects
    * Competitor: All competitors (allow “None” to see videos not linked to competitor)
    * Date range, Search (title/caption)
*   **Columns/Cards** (similar to Videos Library):
    * Thumbnail/preview, Title/Caption, Platform badge, Metrics (views/likes if available), Published date, Linked Competitor (optional, clickable), Project (optional).
*   **Actions**:
    * View detail modal (read-only)
    * (Optional) Link/Unlink Competitor if video supports linking and data model allows
    * **Bulk Delete**: checkbox to select multiple videos, Bulk Delete button (confirm)
*   **Navigation**:
    * Click Competitor → Competitor Detail
    * Click Project → Project Detail

## 12. Page: Landing Pages Management

*   **Data Source**: `ProjectLandingPage` table
*   **Filters**: Project, Search (URL)
*   **Columns**: URL (clickable), Project (clickable), Status, Last Scanned, Actions (Delete)
*   **Actions**: View Details, Open URL (external link), Delete, Bulk Delete

### 12.2. External Landing Pages — `/admin/external/landing-pages`
*   **Objective**: Manage competitor landing pages (from `CompetitorLandingPage` table).
*   **Data Source**: `CompetitorLandingPage` table
*   **Filters**: Competitor, Project (filtered by competitor), Search (URL)
*   **Columns**: URL (clickable), Competitor (clickable), Project (clickable), Status, Last Scanned, Actions (Delete)
*   **Actions**: View Details, Open URL (external link), Delete, Bulk Delete

### 12.3. Components

#### A. Landing Pages List Table (Component: `TableOne`)
*   **Columns**:
    *   `URL`: Landing page URL (link, opens in new tab).
    *   For Internal: `Project`: Project name + Owner email (link to project).
    *   For External: `Competitor`: Logo + App Name (link to competitor detail), `Project`: Project name (link to project).
    *   `Status`: Badge (Active/Pending/Error).
    *   `Last Scanned`: Date.
*   **Actions**: View Details, Open URL (external link), Delete, Bulk Delete.

#### B. Landing Pages Filters (Component: `FormElements`)
*   **Filters**:
    *   For Internal: Project: Dropdown (All projects).
    *   For External: Competitor: Dropdown (All competitors), Project: Dropdown (filtered by selected competitor).

## 13. Page: ASO Keywords Management (`/admin/aso/keywords`)

### 13.1. Components

#### A. Keywords List Table (Component: `TableOne`)
*   **Columns**:
    *   `Keyword`: Keyword text (clickable, opens details).
    *   `Project`: Project name + Owner email (link to project).
    *   `Platform`: Badge (iOS/Android/Both).
    *   `Ads Found`: Count of ads discovered for this keyword (from Ads Library crawler).
    *   `Date Added`: Created timestamp.
    *   `Actions`: Edit, Delete, Trigger Crawl buttons.
*   **Actions**:
    *   **Trigger Crawl**: Triggers Ads Library Transparency crawler for this keyword.

#### B. Keywords Filters (Component: `FormElements`)
*   **Filters**:
    *   Project: Dropdown (All projects).
    *   Platform: Dropdown (All/iOS/Android/Both).
    *   Search: Text input (search by keyword text).

#### C. Create Keyword Form (Component: `Modal` with Form)
*   **Fields**:
    *   Project: Dropdown (select project - required).
    *   Keyword: Text input (required).
    *   Platform: Dropdown (iOS/Android/Both - required).
    *   Save Button: Primary action.
*   **Behavior**: On create, automatically triggers Ads Library crawl for this keyword.

#### D. Keyword Details Modal (Component: `Modal`)
*   **Sections**:
    *   Keyword Info: Keyword text, Platform, Project (link to project).
    *   Ads Found: List of ads discovered for this keyword (from Ads Library crawler).
    *   Ads Count: Total number of ads found.
*   **Actions**: 
    *   Edit Keyword button.
    *   Trigger Crawl button (manual trigger).
    *   View Ads button (navigates to `/admin/ads-library?keywordId=:id`).

## 14. Page: Ads Library Transparency (`/admin/ads-library`)

### 14.1. Components

#### A. Ads List Table (Component: `TableOne`)
*   **Columns**:
    *   `Ad Creative`: Thumbnail or preview (if available).
    *   `Keyword`: Keyword text (link to keyword details).
    *   `Project`: Project name + Owner email (link to project).
    *   `Platform`: Badge (Meta/TikTok/Google).
    *   `Active Status`: Badge (Active/Inactive).
    *   `Discovered`: Date when ad was discovered.
    *   `Actions`: View Details button.
*   **Actions**:
    *   **View Details**: Opens ad details modal.

#### B. Ads Filters (Component: `FormElements`)
*   **Filters**:
    *   Project: Dropdown (All projects).
    *   Keyword: Dropdown (All keywords, filtered by selected project).
    *   Platform: Dropdown (All/Meta/TikTok/Google).
    *   Date Range: Date picker (from/to).
    *   Active Status: Dropdown (All/Active/Inactive).

#### C. Ad Details Modal (Component: `Modal`)
*   **Sections**:
    *   Ad Creative: Full creative content (image/video preview if available).
    *   Ad Metadata: Hook, Angle, CTA, Active Status, Duration.
    *   Keyword Info: Keyword used to find this ad (link to keyword).
    *   Project Info: Project this ad belongs to (link to project).
    *   Platform: Platform where ad was found (Meta/TikTok/Google).
    *   Discovery Date: When ad was discovered by crawler.
*   **Actions**: 
    *   View Keyword button (navigates to keyword details).
    *   View Project button (navigates to project details).

#### D. Trigger Crawl Button (Component: `Button`)
*   **Location**: Top of page (next to filters).
*   **Modal**: Opens modal to select project or keyword to trigger crawl.
*   **Behavior**: Triggers Ads Library Transparency crawler for selected project/keyword.

## 15. Navigation Updates

### 15.1. Project Details Navigation
*   **Competitor Links**: In project details modal, competitor names are clickable.
*   **Navigation**: Clicking competitor navigates to `/admin/competitors/:id` or `/projects/:projectId/competitors/:competitorId`.
*   **Breadcrumb**: Shows navigation path (Projects → Project Name → Competitor Name).

### 15.2. Admin Sidebar Menu (Updated Structure)

**Sidebar Layout:** Organized into logical sections with section headers.

#### Section 1: Overview & Management
*   **Dashboard** (`/admin`)
    *   Icon: `dashboard`
    *   Overview of system metrics and activity
*   **Users** (`/admin/users`)
    *   Icon: `people`
    *   User management and role assignment
*   **Projects** (`/admin/projects`)
    *   Icon: `folder`
    *   Project management and configuration

#### Section 2: External (Competitors)
*   **Competitors** (`/admin/competitors`)
    *   Icon: `groups`
    *   Competitor tracking and management
*   **Reviews** (`/admin/reviews`)
    *   Icon: `rate_review`
    *   App store reviews analysis
*   **What's New** (`/admin/whats-new`)
    *   Icon: `new_releases`
    *   App update tracking

#### Section 2a: Internal (Astraler)
*   **Social Channels** (`/admin/internal/social`)
    *   Icon: `group`
    *   Astraler's own social media profiles management
*   **Video Ads** (`/admin/internal/video-ads`)
    *   Icon: `ads_click`
    *   Astraler's video ads from Ads Library Transparency
*   **Video Organic** (`/admin/internal/videos`)
    *   Icon: `video_library`
    *   Astraler's organic videos from social crawlers
*   **Landing Pages** (`/admin/internal/landing-pages`)
    *   Icon: `language`
    *   Astraler's landing pages management

#### Section 2b: External (Competitors)
*   **Social Channels** (`/admin/external/social`)
    *   Icon: `group`
    *   Competitor social media profiles management
*   **Video Ads** (`/admin/external/video-ads`)
    *   Icon: `ads_click`
    *   Competitor video ads from Ads Library Transparency
*   **Video Organic** (`/admin/external/videos`)
    *   Icon: `video_library`
    *   Competitor organic videos from social crawlers
*   **Landing Pages** (`/admin/external/landing-pages`)
    *   Icon: `language`
    *   Competitor landing pages management

#### Section 3: Keywords & Discovery
*   **ASO Keywords** (`/admin/aso-keywords`)
    *   Icon: `search`
    *   App Store Optimization keywords
*   **Spy Keywords** (`/admin/spy-keywords`)
    *   Icon: `campaign`
    *   Competitor monitoring keywords

#### Section 4: System Operations
*   **Background Tasks** (`/admin/tasks`)
    *   Icon: `check_circle`
    *   BullMQ job monitoring and management
*   **System Health** (`/admin/health`)
    *   Icon: `monitoring`
    *   System metrics and health monitoring

**Removed Menu Items:**
*   ❌ **Ads** - Removed (replaced by "Video Ads" in Section 3)
*   ❌ **Ads Library** - Removed (functionality moved to Video Ads page)

## 14. Interactions

*   **Validation**: Invalid API Key format triggers Red border + Field Error.
*   **Feedback**: "Webhook Verified" Toast on successful Slack test.
*   **User Creation**: Success toast → Password reset email sent notification.
*   **Project Refresh**: Loading state → Success toast → Project data updates.
*   **Task Retry**: Loading state → Success toast → Job queued notification.
*   **Competitor Navigation**: Clicking competitor from project details navigates to competitor detail page.
