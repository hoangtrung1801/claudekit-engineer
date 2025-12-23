# Domain SAD: Project Management

## 1. Architecture Overview
The **Project Management Domain** is the source of truth for all entity configurations. It manages the relational web between `Users`, `Projects`, `Competitors`, and `Watchlists`.

**Important: Business Domain Separation**
- **Internal Section (Astraler Marketing Platform)**: Manages Astraler's own social channels, video ads, and video organic content. This is a **complete marketing platform** for Astraler's own business operations. Social channels are linked via `projectId` field.
- **External Section (Competitor Intelligence)**: Manages competitor tracking - competitor social channels, competitor video ads, competitor video organic content. This is **competitor intelligence** for market analysis. Social channels are linked via `competitorId` field.
- These two sections are **completely separate business domains** with no data overlap or shared business logic.

## 2. Database Design (ERD Concept)

> [!NOTE]
> **Architecture Decision (Dec 2025)**: 
> - **Current**: Shared tables with field separation (`projectId` vs `competitorId`)
> - **Proposed**: Table separation (`ProjectSocialChannel` vs `CompetitorSocialChannel`)
> - **See**: `docs/3.technical-design/architecture-decision-table-separation.md` for detailed analysis

### 2.1. Key Entities
*   **User**: `id`, `email`, `role`, `subscription_tier`.
*   **Project**: `id`, `user_id`, `name`, `config` (JSON), `status` (PRE_LAUNCH/LIVE), `ios_store_url`, `android_store_url`, `created_at`.
*   **Competitor**: `id`, `project_id`, `store_url`, `name`, `icon_url`, `metadata` (JSON).
*   **LandingPage**: `id`, `competitor_id`, `url`, `status`.
*   **Watchlist**: `id`, `project_id`, `competitor_id`, `type` (Social/LandingPage), `identifier`.
*   **Keyword**: `id`, `project_id`, `term`, `platform`.
*   **SocialChannel** (Current - Shared Table):
    *   Internal: `projectId` set, `competitorId` null
    *   External: `competitorId` set, `projectId` null
*   **VideoAds** / **VideoOrganic** (Current - Shared Tables):
    *   Linked via `socialChannel.projectId` (Internal) or `socialChannel.competitorId` (External)

### 2.2. Relationships
*   User 1:N Project
*   Project 1:N Competitor
*   Project 1:N Keyword
*   **Project 1:N SocialChannel** (for Internal project social management — channels owned by the project, not competitors)
*   Competitor 0:N LandingPage
*   Competitor 0:N SocialChannel (for competitor tracking)
*   Competitor 0:N Watchlist

### 2.3. Proposed Architecture (Table Separation)
If table separation is adopted:
*   **Project 1:N ProjectSocialChannel** (Internal - Astraler's channels)
*   **ProjectSocialChannel 1:N ProjectVideoAds** (Internal video ads)
*   **ProjectSocialChannel 1:N ProjectVideoOrganic** (Internal organic videos)
*   **Competitor 0:N CompetitorSocialChannel** (External - Competitor channels)
*   **CompetitorSocialChannel 1:N CompetitorVideoAds** (External video ads)
*   **CompetitorSocialChannel 1:N CompetitorVideoOrganic** (External organic videos)

## 3. API Design (Service Interface)

### 3.1. REST Endpoints
*   `POST /projects`: Create new project (with status, iOS URL validation).
*   `PATCH /projects/{id}`: Update project (including status and store URLs).
*   `POST /projects/{id}/competitors`: Add competitor.
*   `POST /projects/{id}/competitors/{compId}/landing-pages`: **Manual add LP**.
*   `GET /projects/{id}/config`: Get crawling settings.
*   `GET /projects/{id}/info`: Get project info (crawled metadata from App Store).
*   `POST /projects/{id}/info/refresh`: Trigger manual refresh of project info from App Store.
*   **Social Management (Internal Projects)**:
    *   `POST /projects/{id}/social-channels`: Add social channel to Internal project (user can add).
    *   `GET /projects/{id}/social-channels`: List all social channels for the project.
    *   `DELETE /projects/{id}/social-channels/{channelId}`: Delete social channel (Admin only).
    *   `POST /projects/{id}/social-channels/{channelId}/refresh`: Trigger manual social stats crawl.

### 3.2. Integration Events
*   **Event Emitted**: `CompetitorCreated` (Trigger for Data Collection).
*   **Event Emitted**: `LandingPageAdded` (Trigger for Landing Page Crawler).
*   **Event Emitted**: `ProjectInfoRequested` (Trigger for Project Info Crawler via SearchAPI when Live project created/updated with iOS URL).
*   **Event Emitted**: `SocialChannelAdded` (Trigger for Social Channel Crawler — works for both competitor-linked and project-linked channels).

## 4. Technology Choices
*   **Framework**: NestJS (Modular).
*   **DB**: PostgreSQL (Prisma ORM).
*   **Project Info Crawler**: SearchAPI (Apple App Store) - same adapter used for Competitor store crawling, reused for Project Info.

## 5. Project Status Architecture

### 5.1. Status Enum
```typescript
enum ProjectStatus {
  PRE_LAUNCH = 'PRE_LAUNCH',
  LIVE = 'LIVE'
}
```

### 5.2. Validation Rules
*   **Pre-Launch**: Store URLs optional, no automatic crawling.
*   **Live**: iOS Store URL required, Android Store URL optional (focus iOS first).
*   **Status Change**: When changing from Pre-Launch to Live, if iOS URL provided, trigger Project Info crawl.

### 5.3. Project Info Crawling Flow
1.   User creates/updates Live project with iOS Store URL.
2.   ProjectService validates iOS URL format.
3.   ProjectService emits `ProjectInfoRequested` event.
4.   Data Collection module (CrawlProcessor) listens to event.
5.   CrawlProcessor calls SearchAPIAdapter to fetch Apple product metadata.
6.   CrawlProcessor updates Project with crawled data (name, icon, screenshots, etc.).
7.   CrawlProcessor creates ProjectScreenshot and ProjectUpdate records.
