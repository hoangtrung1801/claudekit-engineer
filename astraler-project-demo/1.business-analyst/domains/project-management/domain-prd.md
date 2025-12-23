# Domain PRD: Project Management

## 1. Overview
The **Project Management Domain** is the core module that manages the lifecycle of analysis projects. It allows users to define the scope of their competitive intelligence gathering by grouping competitors, keywords, and watchlists into distinct "Projects". Ideally, one Project corresponds to one app the user is analyzing.

**Important Architecture Note:**
- **INTERNAL Section**: Represents a **complete marketing platform** for Astraler's own business. This includes managing Astraler's own social channels, video ads, and video organic content. It is **completely separate** from competitor tracking.
- **EXTERNAL Section**: Represents **competitor intelligence** - tracking and analyzing competitor data (competitors, their social channels, video ads, video organic, etc.).

These two sections are **business domains that do not overlap** - Internal is for Astraler's own marketing operations, External is for competitor analysis.

## 2. Business Context
Users need a way to organize their competitive analysis. Instead of a flat list of competitors, they need to group them by "Project" (e.g., "My Fitness App" vs "My Meditation App"). This domain handles the setup, configuration, and curation of these entities.

**Internal Section (Astraler Marketing Platform):**
- Manages Astraler's own social channels (TikTok, Facebook, Instagram, etc.) that Astraler is building/growing.
- Tracks Astraler's own video ads and video organic content.
- Provides marketing performance dashboard for senior management.
- **Completely independent** from competitor tracking - no shared data or business logic.

## 3. User Flows

### 3.1. List Projects
1. User (or Admin) navigates to `/projects` page.
2. **Regular User**: Sees only their own projects.
3. **Admin User**: Sees all projects from all users (with owner information).
4. Can filter by search term and category.
5. Can paginate through results.

### 3.1. Create New Project
1.  User clicks "New Project".
2.  Enters `Project Name`, optional `Description`, `Category`.
3.  **Selects Project Status**: `Pre-Launch` or `Live`.
4.  **If Live**: User must enter `iOS Store URL` (Android URL optional for now, focus on iOS first).
5.  **If Pre-Launch**: Store URLs are optional.
6.  Initializes the project.
7.  **If Live with iOS URL**: System automatically triggers SearchAPI crawler to fetch Project Info (app metadata, screenshots, updates).
8.  Redirects to "Add Competitor" flow.

### 3.2. Add Competitor Mechanism
1.  **By URL**: User pastes App Store / Play Store URL -> System validates -> Fetches Metadata -> Adds to Project.
2.  **By Keyword**: User enters keyword -> System suggests apps -> User selects apps to add.
3.  **Discovery (Social)**: User enters Brand Name -> System suggests Social Profiles -> User adds to Watchlist.

### 3.3. Manual Review & Curation
1.  User visits "Manual Review" dashboard.
2.  Views "Pending" videos/channels found by broad keywords.
3.  Assigns item to a specific App in the Project OR Rejects it.

## 4. Business Rules
*   **Project Isolation**: Data from one project does not bleed into another.
*   **Competitor Limit**: Maximum 50 competitors per project (soft limit for performance).
*   **Scheduling**: Crawl scheduling (cron/interval) is a **system-level** configuration managed by the crawler module (e.g., via `.env` / global config). Projects only control **what to track** (enable/disable modules), not the schedule itself.
*   **Market Landscape Trigger**: Adding the first competitor triggers the initial AI Market Landscape analysis.
*   **Project Status**: Projects have two states:
    *   **Pre-Launch**: App is not yet published. Store URLs are optional.
    *   **Live**: App is published. **iOS Store URL is required** (Android URL optional, focus on iOS first).
*   **Project Info Crawling**: When a Live project is created or updated with an iOS Store URL, the system automatically calls SearchAPI to crawl Project Info (app metadata, screenshots, version history, ratings). This populates the Project's own app information for analysis.

## 5. Domain Features (Detailed)

### FR1: Create Project
*   **Description**: Create a container for analysis.
*   **Inputs**: Name, Category, Keywords, **Status** (Pre-Launch/Live), **iOS Store URL** (required if Live).
*   **Output**: New Project ID.
*   **Business Logic**:
    *   If Status = Live and iOS URL provided: Trigger SearchAPI crawler to fetch Project Info.
    *   If Status = Pre-Launch: Store URLs are optional, no automatic crawling.

### FR2: Manage Project Settings
*   **Description**: Configure what to track per project.
*   **Configurables**: Enable/Disable tracking modules (e.g., Social Crawl, Ads Crawl) and other project-scoped settings (e.g., region). Scheduling/frequency is configured globally (not per project).

### FR3: Add Competitor
*   **Sub-feature 3.1 (URL)**: Fetch metadata from Store URL.
*   **Sub-feature 3.2 (Keyword)**: Search store by keyword and suggest apps.
*   **Sub-feature 3.3 (Social Discovery)**: Search social platforms by brand name.
*   **Sub-feature 3.4 (Manual Landing Page)**: Allows users to manually declare Landing Page URLs (e.g., funnels, sales pages) for a competitor. This triggers the **Landing Page Crawler** (Data Collection FR11) to discover social entities.

### FR4: Market Landscape Analysis Trigger
*   **Logic**: Auto-trigger AI analysis when competitor list changes (add/remove). Allows manual refresh.

### FR5: Manage Competitors
*   **Description**: List view of competitors. Actions: View details, Delete (Stop tracking).

### FR6: Target Management
*   **Description**: granular control over what to track.
*   **Watchlist**: Social channels to monitor (for competitors).
*   **Keywords**: Ad keywords to monitor.

### FR10: Internal Project Social Management (Astraler Marketing Platform)
*   **Description**: Internal section is a **complete marketing platform** for Astraler's own business operations. This feature allows marketing teams to manage **Astraler's own social channels** (channels that Astraler is building/growing), track Astraler's own video ads and video organic content. This is **completely separate** from External section (competitor tracking).
*   **Business Separation**: 
    *   **Internal Section**: Astraler's own marketing operations (channels, ads, organic content built by Astraler).
    *   **External Section**: Competitor intelligence (competitor channels, competitor ads, competitor organic content).
    *   These two sections **do not share data or business logic** - they are independent business domains.
*   **Use Case**: 
    *   Marketing teams need to track and monitor **Astraler's own social channels** (TikTok, Facebook, Instagram, etc.) that Astraler is building/growing.
    *   Marketing teams need to view **Astraler's own video ads** they are running (from Ads Library crawler).
    *   Marketing teams need to view **Astraler's own video organic content** they are publishing (from social profile crawlers).
    *   Senior management needs an executive dashboard to see: how many channels Astraler is building, how many video ads Astraler is running, how many video organic Astraler is publishing, and growth trends.
*   **Business Rules**:
    *   **User Permissions**:
        *   **Regular Users**: Can **add** social channels to their Internal projects.
        *   **Admin Users**: Can **add** and **delete** social channels (regular users cannot delete).
    *   **Social Channel Ownership**: Social channels added to Internal projects are linked directly to the `Project` (not to a `Competitor`).
    *   **Video Ads & Organic**: When social channels are project-linked, their associated `VideoAds` and `VideoOrganic` records are also accessible in the **Internal section** (not just External).
    *   **Crawler Integration**: System automatically crawls social stats (followers, engagement, posts count) for Astraler's channels on a scheduled basis. **Separate from competitor channel crawling** - different business domain.
    *   **Growth Tracking**: System tracks growth metrics over time via `SocialChannelSnapshot` records for Astraler's channels.
    *   **Data Visibility**: All data (social channels, video ads, video organic) from project-linked channels (`projectId` set) is **exclusively visible in Internal section** pages. External section pages **only show competitor data** (`competitorId` set). **No overlap or mixing of data**.
*   **Data Points (per Social Channel)**:
    *   Platform (TikTok, Facebook, Instagram, YouTube, X)
    *   Profile URL (required for manual add)
    *   Handle/Username
    *   Display Name
    *   Avatar URL
    *   Bio/Description
    *   Verification Status
    *   Growth Metrics (followers, following, posts count, videos count, engagement rate) — updated via crawler
*   **Actions**:
    *   **Add Social Channel**: User enters profile URL or handle → System validates and fetches metadata → Adds to project.
    *   **View Social Channels**: List/grid view of all social channels in the project with current stats.
    *   **View Growth Trends**: Display growth charts (followers over time, engagement trends).
    *   **Delete Social Channel** (Admin only): Remove channel from project tracking.
    *   **Manual Refresh**: Trigger immediate social stats crawl for a specific channel.
*   **Integration with Data Collection**:
    *   When a social channel is added to an Internal project, system automatically:
        *   Creates `SocialChannel` record with `projectId` (not `competitorId`).
        *   Triggers initial social profile crawl via `SocialChannelProcessor`.
        *   Schedules regular social stats updates (same frequency as competitor social channels).
        *   **Video Ads Discovery**: If the social channel has an `advertiserId`, the Ads Library crawler will discover video ads from this channel and create `VideoAds` records linked to the project.
        *   **Video Organic Discovery**: The Social Content crawler will discover organic videos from this channel and create `VideoOrganic` records linked to the project.
*   **Executive Dashboard (Marketing Stats Page)**:
    *   **Purpose**: Provide senior management with high-level overview of project's social marketing performance.
    *   **Key Metrics**:
        *   Total Social Channels (project-linked)
        *   Video Ads Running (count of active VideoAds from project's channels)
        *   Video Organic Published (count of VideoOrganic from project's channels)
        *   Total Followers Growth (sum and % change)
    *   **Location**: Internal section at `/projects/{id}/marketing` (not External section).
    *   **Data Source**: All metrics are filtered to show only data from project-linked social channels (not competitor data).

### FR7: Data Curation (Manual Review)
*   **Description**: Workflow for human-in-the-loop validation of collected data.
*   **Queue**: "Pending Review" items.
*   **Actions**: Approve (Assign to App), Reject (Ignore), Bulk actions.

### FR8: View Landing Pages
*   **Description**: Display all landing pages tracked for competitors in a project.
*   **View Options**: 
    *   List view grouped by competitor
    *   Filter by competitor
    *   View landing page status (Active, Pending, Error)
*   **Actions**: 
    *   View landing page URL (open in new tab)
    *   View last scan date
    *   Remove landing page
    *   Add new landing page (redirects to competitor management)
*   **Purpose**: Allow users to monitor and manage landing pages used for social discovery across all competitors in a project.

### FR9: Project Info Management (Live Projects)
*   **Description**: For Live projects, manage and display the project's own app information crawled from App Store.
*   **Trigger**: Automatically triggered when:
    *   Creating a Live project with iOS Store URL
    *   Updating a Live project's iOS Store URL
*   **Data Crawled** (via SearchAPI):
    *   App Name
    *   Developer Name
    *   App Icon
    *   Category
    *   Rating & Reviews Count
    *   Screenshots
    *   Version History (What's New)
    *   Bundle ID
*   **Display**: Project Info page shows crawled metadata in read-only format with "Refresh from Store" action.
*   **Priority**: Focus on iOS first. Android support planned for future phases.
