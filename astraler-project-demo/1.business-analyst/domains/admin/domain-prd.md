# Domain PRD: Admin & System

## 1. Overview
The **Admin & System Domain** manages the platform's infrastructure constraints, security, and administrative functions. It ensures the system remains healthy, secure, and cost-effective.

## 2. Business Context
As a system relying heavily on paid 3rd-party APIs and AI tokens, cost control is a primary business concern. Security of API keys and user access is also critical.

## 3. User Flows

### 3.1. User Management
1. Admin views "Users" page.
2. Sees list of all users with their roles and status.
3. Can create new user with email and role.
4. Can update user role (USER/ADMIN).
5. Can deactivate user account.

### 3.2. Project Management
1. Admin views "Projects" page.
2. Sees list of all projects across all users.
3. Can create new project (for any user or for themselves).
4. Can see project info crawl status (not crawled, crawled, crawling, failed).
5. Can view project details (app name, developer, competitors, etc.).
6. Can click on competitor in project details to navigate to competitor detail page.
7. Can view project info (app metadata from App Store): app name, developer, icon, description, screenshots, rating, category, bundle ID.
8. Can edit project info: app name, logo URL, description, developer name, category, rating, ratings count, bundle ID.
9. Can delete any project (regardless of owner).
10. Can trigger project info refresh to re-crawl data from SearchAPI.
11. Project info includes: app name, developer, icon, description, category, rating, screenshots, bundle ID.

### 3.3. ASO Keywords Management
1. Admin views "ASO Keywords" page.
2. Sees list of all ASO keywords across all projects.
3. Can filter by project, platform (iOS/Android/Both).
4. Can add new ASO keyword for any project.
5. Can edit existing keyword (text, platform).
6. Can delete keyword.
7. Can trigger Ads Library Transparency crawler for a specific keyword.
8. Can view ads found for each keyword (from Ads Library crawler).
9. Can see keyword tracking status (tracking/not tracking).

### 3.4. Ads Library Transparency Management
1. Admin views "Ads Library" page (or section within ASO Keywords page).
2. Sees all ads found by Ads Library Transparency crawler.
3. Can filter by project, keyword, platform (Meta/TikTok/Google), date range.
4. Can view ad details: ad creative, hook, angle, CTA, active status, duration.
5. Can trigger manual crawl for specific keyword or project.
6. Can see crawl history and status.

### 3.5. Data Management (Admin)
1. Admin views "Reviews" page.
2. Sees all reviews from all competitors across all projects.
3. Can filter by project, competitor, platform, rating, sentiment, date range.
4. Admin views "What's New" page.
5. Sees all app updates from all competitors across all projects.
6. Can filter by project, competitor, time period, update type, impact level.
7. Admin views "Competitors" page.
8. Sees all competitors from all projects.
9. Can filter by project, view competitor details, manage social channels and landing pages.
10. Admin views "Landing Pages" page.
11. Sees all landing pages from all competitors across all projects.
12. Can filter by project, competitor, view landing page details.

### 3.3. Background Task Management
1. Admin views "Tasks" or "Queue" page.
2. Sees all background jobs (crawl jobs, analysis jobs) with status.
3. Can filter by status: pending, active, completed, failed.
4. Can view job details: job ID, type, progress, error messages.
5. Can retry failed jobs.

### 3.4. Cost Monitoring
1. Admin views "Cost Dashboard".
2. Checks daily spend vs. Budget Cap.
3. Receives alert if projection exceeds budget.

## 4. Business Rules
*   **Cost Safety**: If a provider burns > X% of daily budget in 1 hour, auto-pause crawling to prevent runaway costs.
*   **Access Control**: Only Admins can see/manage API keys, users, projects, and system tasks.
*   **User Creation**: Admin can create users with email and role. Password reset link must be sent to user.
*   **Project Access**: Admin can view and manage all projects, regardless of owner.
*   **Frontend Access**: Admin can see all projects in the main `/projects` page (not limited to admin-only pages). The frontend should automatically show all projects when user has ADMIN role.
*   **Project Creation**: Admin can create new projects. Admin can optionally specify a target userId to create project for a specific user (defaults to admin's own userId if not specified).
*   **Project Details Access**: Admin can view, update, and delete any project (bypass ownership checks).
*   **ASO Keywords Management**: Admin can manage ASO keywords for any project. Keywords are used by Ads Library Transparency crawler to find competitor ads.
*   **Ads Library Transparency**: Admin can trigger and monitor Ads Library Transparency crawler for any project/keyword combination.
*   **Keyword Spy Management**: Admin can manage spy keywords for any project. Spy keywords are used to crawl competitors across Ads Libraries and Social Media.
*   **Video Ads Management**: Admin can view and manage Video Ads (created directly from Ads Library) via Global Video page with `type = AD` filter. No curation workflow required.
*   **Data Access**: Admin can view all Reviews, What's New (App Updates), Competitors, Landing Pages, Ads, and Spy Keywords from all projects (bypass project ownership).
*   **Navigation**: From project details, clicking on a competitor navigates to competitor detail page (route: `/admin/competitors/:id` or `/projects/:projectId/competitors/:competitorId`).
*   **Task Visibility**: Admin can view all background tasks across all queues (crawl-queue, analysis-queue).
*   **Project Refresh**: When admin triggers project info refresh, it re-crawls from SearchAPI and updates project metadata.
*   **Crawl Status**: Project info crawl status is determined by:
    - **Not Crawled**: Project has no `appName` or `iconUrl` (metadata not populated)
    - **Crawled**: Project has `appName` or `iconUrl` (metadata exists)
    - **Crawling**: There is an active job in queue for this project
    - **Failed**: Last crawl job for this project failed

## 5. Domain Features (Detailed)

### FR30: User Management
*   **User List**: Admin can view all users in the system with pagination and search.
*   **User Details**: Admin can view detailed user information (email, role, created date, projects count).
*   **User Creation**: Admin can create new users with email and role assignment. System sends password reset email.
*   **Role Management**: Admin can update user roles (USER/ADMIN).
*   **User Deactivation**: Admin can deactivate user accounts (soft delete).

### FR31: Project Management (Admin)
*   **Project List**: Admin can view all projects across all users with pagination and filters.
*   **Project Creation**: Admin can create new projects. Admin can optionally specify target userId to create project for a specific user (via admin endpoint or frontend form).
*   **Project Deletion**: Admin can delete any project regardless of owner.
*   **Frontend Integration**: Admin users see all projects in the main `/projects` page, not just their own projects. The backend API `/projects` should bypass userId filter for admin users.
*   **Project Info Status**: Admin can see crawl status for each project (not crawled, crawled, crawling, failed) in the project list.
*   **Project Info View**: Admin can view combined project details and app info in a single modal (tabs: Project Details, App Info).
*   **Project Info Edit**: Admin can edit project info fields: app name, logo URL, description, developer name, category, rating, ratings count, bundle ID.
*   **Project Info Refresh**: Admin can trigger re-crawl of project info from SearchAPI to update app metadata (name, developer, icon, description, screenshots, rating).

### FR36: Data Management (Admin)
*   **Reviews Management**: Admin can view all reviews from all competitors across all projects with advanced filtering (project, competitor, platform, rating, sentiment, date range).
*   **What's New Management**: Admin can view all app updates from all competitors across all projects with filtering (project, competitor, time period, update type, impact level).
*   **Competitors Management**: Admin can view all competitors from all projects, filter by project, view competitor details, manage social channels and landing pages.
*   **Social Management (Global, not only per Competitor)**:
    *   **Social channel can be independent** (not linked to competitor), or **linked** to competitor (optional).  
    *   **Internal Social Page** (`/admin/internal/social`): list of all Astraler's own social channels (from `ProjectSocialChannel` table), filter by Platform / Project / Search (name/URL). CRUD operations for internal channels.
    *   **External Social Page** (`/admin/external/social`): list of all competitor social channels (from `CompetitorSocialChannel` table), filter by Platform / Competitor / Project / Search (name/URL). CRUD operations for external channels.
    *   **CRUD Social Channel**:
        *   Create new: requires Platform, URL, Social Name; optional Platform ID/Advertiser ID; optional link to Competitor/Project.
        *   Edit/Delete: update competitor link (link/unlink), advertiserId, platformId, status.
        *   **Bulk delete**: select multiple channels and delete in bulk.
    *   **Crawler triggers (UI-only)** on Social page:
        *   **Crawler Advertiser Ads Library**: trigger crawl Video Ads by advertiserId of the channel.
        *   **Crawler Video Social**: trigger crawl video organic/brand for the channel.
    *   **Per-Competitor view** still displays social linked to competitor, but this is just a filter slice; not required to go into competitor to add social.
    *   **Internal Videos**:
        * **Internal Video Organic Page** (`/admin/internal/videos`): list of Astraler's own organic videos (from `ProjectVideoOrganic` table), filter by Project, Platform, Date, Search.
        * **Internal Video Ads Page** (`/admin/internal/video-ads`): list of Astraler's own video ads (from `ProjectVideoAds` table), filter by Project, Platform, Date, Search.
        *   **Bulk delete**: supports selecting multiple videos to delete (read-only on content, but allows deleting records).
    *   **External Videos**:
        * **External Video Organic Page** (`/admin/external/videos`): list of competitor organic videos (from `CompetitorVideoOrganic` table), filter by Competitor, Project, Platform, Date, Search.
        * **External Video Ads Page** (`/admin/external/video-ads`): list of competitor video ads (from `CompetitorVideoAds` table), filter by Competitor, Project, Platform, Date, Search.
        *   **Bulk delete**: supports selecting multiple videos to delete (read-only on content, but allows deleting records).
*   **Add Competitor**: Admin can add a competitor from `/admin/competitors` by submitting an App Store / Play Store URL, selecting the target project, and auto-fetching metadata (app name, icon, developer, category, rating) to create the competitor record. On success, competitor appears in list and detail page is accessible.
*   **Internal Landing Pages Management** (`/admin/internal/landing-pages`): Admin can view all Astraler's own landing pages (from `ProjectLandingPage` table) with filtering (project, search).
*   **External Landing Pages Management** (`/admin/external/landing-pages`): Admin can view all competitor landing pages (from `CompetitorLandingPage` table) with filtering (competitor, project, search).
*   **Navigation**: From Project Management, clicking on a competitor navigates to competitor detail page showing full competitor information.

### FR32: Background Task Management
*   **Task List**: Admin can view all background jobs (BullMQ) across all queues with status filtering.
*   **Task Status**: Jobs show status: pending, active, completed, failed, delayed.
*   **Task Details**: Admin can view job details: job ID, type, data, progress, attempts, error messages.
*   **Task Retry**: Admin can retry failed jobs manually.
*   **Queue Statistics**: Admin can see queue metrics: waiting, active, completed, failed counts per queue.

### FR33: System Observability (Logs)
*   **Centralized Logging**: Store all critical system events (Info, Error, Warn) in a queryable format.
*   **Contextual Tracing**: Link logs to specific `TraceID` or `JobID` for debugging crawler issues.
*   **External API Logging**: Log details of all 3rd-party API calls (Status, Duration, Provider) for auditing.

### FR34: Performance Metrics
*   **Queue Monitoring**: Track number of active/waiting/failed jobs in BullMQ.
*   **Usage Metrics**: Track daily crawling volume and AI analysis counts (without monetary budget enforcement).

### FR37: ASO Keywords Management (Admin)
*   **Keywords List**: Admin can view all ASO keywords across all projects with filtering (project, platform).
*   **Keyword CRUD**: Admin can create, read, update, and delete keywords for any project.
*   **Keyword Fields**: Keyword text, Platform (iOS/Android/Both), Project association.
*   **Ads Library Integration**: Admin can trigger Ads Library Transparency crawler for specific keywords.
*   **Ads View**: Admin can view ads found by crawler for each keyword.

### FR38: Ads Library Transparency Management (Admin)
*   **Ads List**: Admin can view all ads discovered by Ads Library Transparency crawler.
*   **Ads Filtering**: Filter by project, keyword, platform (Meta/TikTok/Google), date range.
*   **Ad Details**: View ad creative, hook, angle, CTA, active status, delivery duration.
*   **Crawl Trigger**: Admin can manually trigger Ads Library crawl for specific keyword or project.
*   **Crawl Status**: View crawl history and status for each keyword/project.

### FR39: Keyword Spy Management (Admin)
*   **Spy Keywords List**: Admin can view all spy keywords across all projects with filtering (project, platform, status).
*   **Spy Keyword CRUD**: Admin can create, read, update, and delete spy keywords for any project.
*   **Spy Keyword Fields**: Keyword text, Platforms (multi-select), Status (ACTIVE/PAUSED/INACTIVE), Description, Tags.
*   **Stats View**: Admin can see stats for each spy keyword (videosCount, postsCount, lastCrawledAt).
*   **Crawl Trigger**: Admin can trigger manual crawl for specific spy keyword(s).
*   **Results View**: Admin can view discovered content (videos, posts) for each spy keyword.

### FR40: Video Ads Management (Admin)
> ⚠️ **UPDATED**: Ads Curation workflow has been removed. Video Ads are now created directly from Ads Library without review/curation step.

*   **Internal Video Management**: Admin can view Astraler's own videos via `/admin/internal/videos` (organic) and `/admin/internal/video-ads` (ads) pages.
*   **External Video Management**: Admin can view competitor videos via `/admin/external/videos` (organic) and `/admin/external/video-ads` (ads) pages.
*   **Video Filtering**: 
  - Internal: Filter by project, platform, socialChannelId, date range, search
  - External: Filter by competitor, project, platform, socialChannelId, date range, search
*   **Video Ads**: Created directly when Ads Library crawler runs (no review needed)
  - Internal: Stored in `ProjectVideoAds` table
  - External: Stored in `CompetitorVideoAds` table
*   **Video Organic**: Created from social profile crawlers
  - Internal: Stored in `ProjectVideoOrganic` table
  - External: Stored in `CompetitorVideoOrganic` table
*   **Video Actions**: Admin can view video details, delete videos (bulk delete supported).
*   **Crawl Trigger**: Admin can trigger Ads Library crawl from Internal/External Social Channels pages (creates Video Ads in appropriate table).

### FR35: Access Control (RBAC)
*   Roles: Admin, User.
*   Admin-only endpoints: All `/admin/*` routes require ADMIN role.
*   Permissions: Admin has full access to all resources.
