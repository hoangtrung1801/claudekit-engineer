# Domain SAD: Admin & System

## 1. Architecture Overview
The **Admin Domain** manages system configuration, security secrets, and operational monitoring. It is the "Control Plane" of the Modular Monolith.

## 2. Component Design

### 2.1. User Management
*   **Role**: Admin can manage all users in the system.
*   **Component 1: UserAdminService**
    *   **Goal**: Provide admin operations on users (list, create, update role, deactivate).
    *   **Storage**: `User` table (PostgreSQL via Prisma).
    *   **Integration**: Uses existing `UsersModule` but bypasses ownership checks.
*   **Component 2: User Creation**
    *   **Goal**: Create new users with email and role.
    *   **Process**: Generate password reset token, send email via Auth module.
    *   **Storage**: User record created in `User` table with `role` field.

### 2.2. Project Management (Admin)
*   **Role**: Admin can view and manage all projects across all users.
*   **Component 1: ProjectAdminService**
    *   **Goal**: Provide admin operations on projects (list all, view details, get project info, trigger refresh).
    *   **Storage**: `Project` table (PostgreSQL via Prisma).
    *   **Integration**: Uses existing `ProjectsModule` but bypasses ownership checks.
*   **Component 2: Project Info Status**
    *   **Goal**: Determine if project info has been crawled.
    *   **Logic**: Check if `appName` field is populated (not null) to indicate crawled status.
    *   **Status Values**: "not_crawled" (appName is null), "crawled" (appName exists), "failed" (can be determined from job status if needed).
*   **Component 3: Project Info View**
    *   **Goal**: Display crawled project info (app metadata).
    *   **Data Source**: Project fields: appName, developerName, iconUrl, description, category, rating, ratingsCount, bundleId, screenshots.
    *   **Integration**: Reuses existing `ProjectsService.getProjectInfo()` method but bypasses ownership check.
*   **Component 4: Project Info Edit**
    *   **Goal**: Allow admin to manually edit project info fields.
    *   **Editable Fields**: appName, iconUrl, description, developerName, category, rating, ratingsCount, bundleId.
    *   **Storage**: Updates Project table directly via Prisma.
*   **Component 5: Project Info Refresh**
    *   **Goal**: Re-crawl project info from SearchAPI.
    *   **Process**: Emit `project-info.requested` event → Data Collection module handles crawl → Updates Project metadata.
    *   **Integration**: Reuses existing `CrawlProcessor.processProjectInfoCrawl()` logic.
*   **Component 6: Data Management (Reviews, Updates, Competitors, Landing Pages)**
    *   **Goal**: Admin can view and manage all data across all projects.
    *   **Data Sources**: 
        *   Reviews: `Review` table (filterable by project, competitor)
        *   App Updates: `AppUpdate` table (filterable by project, competitor)
        *   Competitors: `Competitor` table (filterable by project)
        *   Landing Pages: `LandingPage` table (filterable by project, competitor)
*   **Integration**: Reuses existing services from Projects module but bypasses ownership checks.
*   **Channel Management**: Admin can manage `SocialChannel` records attached to each `Competitor` (TikTok/Instagram/YouTube/Facebook). CRUD operations are exposed via admin endpoints and reuse the same underlying `SocialChannel` model used by external competitors UI.
*   **Creation Flow**: Admin can add competitor by store URL from `/admin/competitors`. Flow: validate URL → infer platform → fetch app metadata via crawler/service → create Competitor linked to selected Project → enqueue crawl for extended data (social channels, landing pages) when available.
*   **Navigation**: Competitor links from project details navigate to competitor detail page.

### 2.3. Background Task Management
*   **Role**: Admin can monitor and manage all background jobs.
*   **Component 1: QueueAdminService**
    *   **Goal**: Query BullMQ queues for job status and statistics.
    *   **Storage**: Redis (BullMQ job storage).
    *   **Integration**: Uses BullMQ `Queue` API to query jobs.
*   **Component 2: Job Status Query**
    *   **Goal**: Get job details (status, progress, error, attempts).
    *   **Process**: Query BullMQ queue by job ID or filter by status.
    *   **Queues**: `crawl-queue`, `analysis-queue`.
*   **Component 3: Job Retry**
    *   **Goal**: Manually retry failed jobs.
    *   **Process**: Use BullMQ `retry()` method on failed job.

### 2.4. Observability Stack
*   **Role**: Provides visibility into system health and performance.
*   **Component 1: System Logger**
    *   **Goal**: Persistent record of operations and errors.
    *   **Storage**: `system_logs` table (PostgreSQL).
    *   **Levels**: INFO, WARN, ERROR, DEBUG.
*   **Component 2: Metrics Collector**
    *   **Goal**: track operational stats (e.g., "Crawls per hour").
    *   **Storage**: `system_metrics` table (Simple Time-Series).
    *   **Visualization**: Simple Admin Dashboard Charts.

### 2.5. System Config
*   **Role**: Global settings (Default crawl intervals, max retry attempts). Crawl scheduling is **system-level** (not stored per Project).
*   **Storage**: Redis (for fast access) backed by DB.
*   **Note**: In early versions, defaults can be sourced from `.env` / crawler module config, and later promoted to Admin-managed config if needed.

## 3. Security Architecture
*   **Encryption**: All secrets (API keys) validated and encrypted before DB insert.
*   **Access**: Admin-only API endpoints (`/admin/*`) protected by `RoleGuard`.

## 4. Key API Endpoints

### 4.1. User Management
*   `GET /admin/users`: List all users (paginated, searchable).
*   `GET /admin/users/:id`: Get user details.
*   `POST /admin/users`: Create new user.
*   `PATCH /admin/users/:id/role`: Update user role.
*   `DELETE /admin/users/:id`: Deactivate user.

### 4.2. Project Management
*   `GET /admin/projects`: List all projects (paginated, filterable) with info crawl status.
*   `POST /admin/projects`: Create new project (optional targetUserId for admin).
*   `GET /admin/projects/:id`: Get project details.
*   `GET /admin/projects/:id/info`: Get project info (app metadata from App Store).
*   `PATCH /admin/projects/:id/info`: Update project info (manual edit).
*   `POST /admin/projects/:id/refresh-info`: Trigger project info re-crawl.
*   `DELETE /admin/projects/:id`: Delete project (admin can delete any project).

### 4.3. Background Tasks
*   `GET /admin/tasks`: List all jobs across queues (filterable by status, queue, type).
*   `GET /admin/tasks/:jobId`: Get job details.
*   `POST /admin/tasks/:jobId/retry`: Retry failed job.
*   `GET /admin/tasks/queues/stats`: Get queue statistics.

### 4.4. Data Management
*   `GET /admin/reviews`: List all reviews (filterable by project, competitor, platform, rating, sentiment).
*   `GET /admin/whats-new` or `GET /admin/app-updates`: List all app updates (filterable by project, competitor, time period).
*   `GET /admin/competitors`: List all competitors (filterable by project).
*   `GET /admin/competitors/:id`: Get competitor details.
*   `POST /admin/competitors`: Create competitor by store URL and projectId (fetch metadata then persist).
*   `POST /admin/competitors/:id/channels`: Create new social channel for competitor (TikTok/IG/YouTube/FB).
*   `PATCH /admin/competitors/:id/channels/:channelId`: Update existing social channel metadata.
*   `DELETE /admin/competitors/:id/channels/:channelId`: Delete social channel.
*   ~~`GET /admin/landing-pages`~~ **DEPRECATED**: Use `/admin/internal/landing-pages` or `/admin/external/landing-pages` instead.

### 4.5. Internal Social Management (Astraler's Own Channels)
*   `GET /admin/internal/social`: List all internal social channels (from `ProjectSocialChannel` table, filterable by platform, project, search).
*   `GET /admin/internal/social/:id`: Get internal social channel details.
*   `POST /admin/internal/social`: Create new internal social channel.
*   `PATCH /admin/internal/social/:id`: Update internal social channel (displayName, handle, profileUrl, advertiserId, status).
*   `DELETE /admin/internal/social/:id`: Delete internal social channel.
*   `POST /admin/internal/social/bulk-delete`: Bulk delete internal social channels by IDs.
*   `POST /admin/internal/social/:id/crawl-ads`: Trigger Ads Library crawl for Facebook/Meta internal channel (requires `advertiserId` or `platformId` as `page_id`). Emits background job event.
*   `POST /admin/internal/social/:id/crawl-videos`: Trigger social video crawl for internal channel. Emits background job event.
*   `POST /admin/internal/social/:id/crawl-stats`: Trigger social stats crawl for internal channel. Creates snapshot.

### 4.6. External Social Management (Competitor Channels)
*   `GET /admin/external/social`: List all external social channels (from `CompetitorSocialChannel` table, filterable by platform, competitor, project, search).
*   `GET /admin/external/social/:id`: Get external social channel details.
*   `POST /admin/external/social`: Create new external social channel (linked to competitor).
*   `PATCH /admin/external/social/:id`: Update external social channel (displayName, handle, profileUrl, advertiserId, competitorId, status).
*   `DELETE /admin/external/social/:id`: Delete external social channel.
*   `POST /admin/external/social/bulk-delete`: Bulk delete external social channels by IDs.
*   `POST /admin/external/social/:id/crawl-ads`: Trigger Ads Library crawl for Facebook/Meta external channel (requires `advertiserId` or `platformId` as `page_id`). Emits background job event.
*   `POST /admin/external/social/:id/crawl-videos`: Trigger social video crawl for external channel. Emits background job event.
*   `POST /admin/external/social/:id/crawl-stats`: Trigger social stats crawl for external channel. Creates snapshot.

### 4.7. Internal Video Management (Astraler's Own Videos)
*   `GET /admin/internal/videos`: List all internal organic videos (from `ProjectVideoOrganic` table, filterable by platform, project, socialChannelId, date range, search). Read-only.
*   `GET /admin/internal/videos/:id`: Get internal video details with snapshots.
*   `DELETE /admin/internal/videos/:id`: Delete internal video.
*   `POST /admin/internal/videos/bulk-delete`: Bulk delete internal videos by IDs.
*   `GET /admin/internal/video-ads`: List all internal video ads (from `ProjectVideoAds` table, filterable by platform, project, socialChannelId, date range, search). Read-only.
*   `GET /admin/internal/video-ads/:id`: Get internal video ad details.
*   `DELETE /admin/internal/video-ads/:id`: Delete internal video ad.
*   `POST /admin/internal/video-ads/bulk-delete`: Bulk delete internal video ads by IDs.

### 4.8. External Video Management (Competitor Videos)
*   `GET /admin/external/videos`: List all external organic videos (from `CompetitorVideoOrganic` table, filterable by platform, competitor, project, socialChannelId, date range, search). Read-only.
*   `GET /admin/external/videos/:id`: Get external video details with snapshots.
*   `DELETE /admin/external/videos/:id`: Delete external video.
*   `POST /admin/external/videos/bulk-delete`: Bulk delete external videos by IDs.
*   `GET /admin/external/video-ads`: List all external video ads (from `CompetitorVideoAds` table, filterable by platform, competitor, project, socialChannelId, date range, search). Read-only.
*   `GET /admin/external/video-ads/:id`: Get external video ad details.
*   `DELETE /admin/external/video-ads/:id`: Delete external video ad.
*   `POST /admin/external/video-ads/bulk-delete`: Bulk delete external video ads by IDs.

### 4.9. Internal Landing Pages (Astraler's Own)
*   `GET /admin/internal/landing-pages`: List all internal landing pages (from `ProjectLandingPage` table, filterable by project, search).
*   `DELETE /admin/internal/landing-pages/:id`: Delete internal landing page.
*   `POST /admin/internal/landing-pages/bulk-delete`: Bulk delete internal landing pages by IDs.

### 4.10. External Landing Pages (Competitor Landing Pages)
*   `GET /admin/external/landing-pages`: List all external landing pages (from `CompetitorLandingPage` table, filterable by competitor, project, search).
*   `DELETE /admin/external/landing-pages/:id`: Delete external landing page.
*   `POST /admin/external/landing-pages/bulk-delete`: Bulk delete external landing pages by IDs.

### 4.11. Ads Library (Updated with Social Filter Support)
*   `GET /admin/ads-library`: List all ads (filterable by project, keyword, **socialChannelId**, **pageId**, platform, date range). Supports deep-linking from social stats.
*   `GET /admin/ads-library/:id`: Get ad details.
*   `POST /admin/ads-library/trigger-crawl`: Trigger Ads Library crawl for project/keyword.

### 4.8. System Observability
*   `GET /admin/logs`: Query logs with filters.
*   `GET /admin/metrics`: Fetch time-series data for dashboard.
*   `POST /admin/system/config`: Update global settings.
