# Implementation Plan: Table Separation Refactoring (Internal vs External)

**Status**: ✅ **APPROVED - READY FOR IMPLEMENTATION**  
**Date**: December 18, 2025  
**Priority**: P0 - Critical Refactoring  
**Complexity**: Very High - Major Database Schema Refactoring

---

## 1. Problem Statement

The current architecture uses **shared tables with classification rules** (`projectId` vs `competitorId` on the same `SocialChannel` table). This has caused:

- Confusing logic with null checks everywhere
- Bugs where data is incorrectly classified
- Hard-to-maintain code that's error-prone

### Root Cause

Using classification rules on shared tables requires:

- Complex WHERE clauses: `WHERE projectId IS NOT NULL AND competitorId IS NULL`
- Every query must include classification logic
- Easy to forget or misapply rules → data contamination

### Solution

**Separate the tables entirely** - no classification rules needed.

---

## 2. Business Context

### Internal (Astraler's Own Assets)

- Astraler operates multiple social channels (TikTok, Instagram, YouTube, etc.)
- Marketing team tracks their own channel performance
- Need Video Ads (paid ads) + Video Organic (content) data
- Used for internal KPIs, OKRs, and performance measurement
- Requires full crawling: Growth metrics, stats, video performance

### External (Competitor Monitoring)

- Spy on competitors' social channels
- Analyze competitor Video Ads and Video Organic
- Used for market analysis, competitive intelligence
- Requires full crawling: Competitor stats, video performance

**Both Internal AND External need full crawling capabilities via AdsLibraryProcessor.**

---

## 3. Migration Decision: MIXED Channels

✅ **CONFIRMED**: Migrate ALL existing data (including MIXED channels) to External (`CompetitorSocialChannel`)

**Reason**: Current data is competitor-sourced. Internal channels will be added fresh by users after migration.

---

## 4. New Schema Architecture

### Internal Tables (Astraler's Own Assets)

```
ProjectSocialChannel
├─ id
├─ projectId (required)
├─ platform
├─ displayName
└─ ... (no unique constraint on [platform, platformId])

ProjectVideoAds
├─ id
├─ projectSocialChannelId
├─ NO spyKeywordId (SpyKeyword is External only)
└─ ...

ProjectVideoOrganic
├─ id
├─ projectSocialChannelId
├─ NO spyKeywordId (SpyKeyword is External only)
└─ ...

ProjectLandingPage
├─ id
├─ projectId
├─ url
├─ discoveredFromProjectVideoAdId
├─ discoveredFromProjectSocialChannelId
└─ ...
```

### External Tables (Competitor Monitoring)

```
CompetitorSocialChannel
├─ id
├─ competitorId (required)
├─ platform
├─ displayName
└─ ... (no unique constraint on [platform, platformId])

CompetitorVideoAds
├─ id
├─ competitorSocialChannelId
├─ spyKeywordId (links to SpyKeyword)
└─ ...

CompetitorVideoOrganic
├─ id
├─ competitorSocialChannelId
├─ spyKeywordId (links to SpyKeyword)
└─ ...

CompetitorLandingPage
├─ id
├─ competitorId
├─ url
├─ discoveredFromCompetitorVideoAdId
├─ discoveredFromCompetitorSocialChannelId
└─ ...
```

### Snapshot Tables

- `ProjectSocialChannelSnapshot`
- `ProjectVideoAdsSnapshot`
- `ProjectVideoOrganicSnapshot`
- `CompetitorSocialChannelSnapshot`
- `CompetitorVideoAdsSnapshot`
- `CompetitorVideoOrganicSnapshot`

---

## 5. Benefits

1. ✅ **No classification logic** - Table name IS the classification
2. ✅ **Self-documenting** - `ProjectVideoAds` vs `CompetitorVideoAds` is obvious
3. ✅ **Impossible to mix** - Can't accidentally put competitor data in project table
4. ✅ **Simpler queries** - Just query the right table, no WHERE filters
5. ✅ **Type safety** - TypeScript types enforce correct usage

---

## 6. Implementation Phases

### Phase 1: Schema Changes (Prisma)

**File**: `backend/prisma/schema.prisma`

**Create 8 new tables + 6 snapshot tables**:

- **Internal**: `ProjectSocialChannel`, `ProjectVideoAds`, `ProjectVideoOrganic`, `ProjectLandingPage`
- **External**: `CompetitorSocialChannel`, `CompetitorVideoAds`, `CompetitorVideoOrganic`, `CompetitorLandingPage`
- **Snapshots**: 6 snapshot tables (3 Internal + 3 External)

**Important Notes**:

- `ProjectVideoAds` and `ProjectVideoOrganic`: **NO** `spyKeywordId` field (SpyKeyword is External only)
- `CompetitorVideoAds` and `CompetitorVideoOrganic`: **HAVE** `spyKeywordId` field (links to SpyKeyword)
- LandingPage: Split into `ProjectLandingPage` (Internal) and `CompetitorLandingPage` (External)
- ⚠️ **Unique Constraint**: Remove `@@unique([platform, platformId])` from both `ProjectSocialChannel` and `CompetitorSocialChannel` (same channel can exist in both tables)

### Phase 2: Data Migration

✅ **CONFIRMED**: ALL existing data migrates to External tables (including MIXED channels)

**Migration Steps**:

1. **Migrate ALL SocialChannels → CompetitorSocialChannel**
   - Pure External: `competitorId IS NOT NULL AND projectId IS NULL`
   - MIXED channels: `competitorId IS NOT NULL AND projectId IS NOT NULL` → Migrate to External, ignore `projectId`
   - Pure Internal: `projectId IS NOT NULL AND competitorId IS NULL` → Should be empty (new feature)

2. **Migrate ALL VideoAds → CompetitorVideoAds**

3. **Migrate ALL VideoOrganic → CompetitorVideoOrganic**

4. **Migrate all snapshots accordingly**

5. **Update LandingPage relations**
   - Split `LandingPage` → `ProjectLandingPage` (Internal) and `CompetitorLandingPage` (External)
   - Migrate existing `LandingPage` → `CompetitorLandingPage` (all existing data is External)

6. **Update SpyKeyword relations**
   - ✅ **CONFIRMED**: SpyKeyword ONLY links to External tables (`CompetitorVideoAds`, `CompetitorVideoOrganic`)
   - Remove any links to Internal tables (if any exist)

7. **Drop old tables after verification**

### Phase 3: Backend Services

#### Internal Services (NEW)

- `ProjectChannelsService` → CRUD on `ProjectSocialChannel`
- `ProjectVideoAdsService` → Query `ProjectVideoAds`
- `ProjectVideoOrganicService` → Query `ProjectVideoOrganic`
- `ProjectLandingPageService` → CRUD on `ProjectLandingPage`

#### External Services (Rename/Update)

- `CompetitorChannelsService` → CRUD on `CompetitorSocialChannel`
- `CompetitorVideoAdsService` → Query `CompetitorVideoAds`
- `CompetitorVideoOrganicService` → Query `CompetitorVideoOrganic`
- `CompetitorLandingPageService` → CRUD on `CompetitorLandingPage`

### Phase 4: API Endpoints

#### Internal Endpoints

- `POST /api/projects/:projectId/channels` - Add internal channel
- `GET /api/projects/:projectId/channels` - List internal channels
- `DELETE /api/projects/:projectId/channels/:channelId` - Delete internal channel (Admin only)
- `GET /api/projects/:projectId/video-ads` - Internal video ads
- `GET /api/projects/:projectId/video-organic` - Internal organic videos
- `GET /api/projects/:projectId/marketing/stats` - Marketing stats dashboard

#### External Endpoints

- `POST /api/projects/:projectId/competitors/:competitorId/channels` - Add competitor channel
- `GET /api/projects/:projectId/competitors/:competitorId/channels` - List competitor channels
- `GET /api/projects/:projectId/competitors/video-ads` - All competitor video ads
- `GET /api/projects/:projectId/competitors/video-organic` - All competitor organic videos

### Phase 5: Processors Update

#### AdsLibraryProcessor

**Handle BOTH Internal and External**:

- **Internal channels** (`ProjectSocialChannel`):
  - Create `ProjectVideoAds`, `ProjectVideoOrganic` (NO `spyKeywordId`)
  - Landing Page Discovery: Create `ProjectLandingPage`, link to `ProjectVideoAds`/`ProjectSocialChannel`

- **External channels** (`CompetitorSocialChannel`):
  - Create `CompetitorVideoAds`, `CompetitorVideoOrganic` (WITH `spyKeywordId` if from SpyKeyword)
  - Landing Page Discovery: Create `CompetitorLandingPage`, link to `CompetitorVideoAds`/`CompetitorSocialChannel`

✅ **IMPORTANT**: SpyKeyword ONLY used for External channels (`CompetitorSocialChannel`)

#### Other Processors

- `SocialChannelProcessor`: Handle BOTH types (based on `channelType` parameter)
- `SocialContentProcessor`: Handle BOTH types (based on `channelType` parameter)

### Phase 6: Frontend API Updates

#### General Updates

- Remove `source` parameter from all API calls
- Internal pages → Use Internal APIs
- External pages → Use External APIs
- No classification logic needed in frontend

**Route Structure** (✅ CONFIRMED):

- Internal: `/projects/:id/video-ads` (no source param, Internal by default)
- External: `/projects/:id/competitors/video-ads` (no source param, External by default)

### Phase 7: UI Design Implementation (Internal - Astraler Marketing Platform)

#### 7.1. Social Management Page (`/projects/{id}/social`)

**Purpose**: Manage and monitor **Astraler's own social channels** (channels that Astraler is building/growing)

**Key Requirements**:
- **ONLY shows Astraler's channels** (`ProjectSocialChannel` - `projectId` set, `competitorId` null)
- **NO competitor channels** - those are in External section
- **NO filter toggle** - this page is Internal by design

**Components**:
1. **Summary Stats Cards** (top of page):
   - Total Channels (count of `ProjectSocialChannel`)
   - Total Followers (sum across all channels)
   - Average Growth Rate (% last 30 days)
   - Total Video Ads (count from `ProjectVideoAds`)
   - Total Video Organic (count from `ProjectVideoOrganic`)
   - Component: `CardDataStats` (x5)

2. **Social Channels Grid/List**:
   - Channel Cards with:
     - Avatar + Display Name
     - Handle (@username)
     - Platform badge (TikTok, Facebook, Instagram, YouTube, X)
     - Current Stats: Followers, Following, Posts Count, Videos Count
     - Growth Indicator: ↑/↓ with percentage change (last 30 days)
     - Last Updated: Relative time
     - Actions: View Details, Refresh Stats, Delete (Admin only)
   - Component: Grid of `Card` components

3. **Add Social Channel Form**:
   - Platform dropdown (TikTok, Facebook, Instagram, YouTube, X)
   - Profile URL input (required, with validation)
   - Handle/Username input (optional, auto-filled from URL)
   - Display Name input (required, auto-filled from URL)
   - Advertiser ID input (optional, for Ads Library integration)
   - Actions: "Add Channel" button, "Cancel" button
   - Component: `Modal` with `FormElements`

4. **Growth Trends Section**:
   - Line Chart: Combined followers growth over time (all channels)
   - Bar Chart: Growth rate comparison by platform
   - Table: Top growing channels (sorted by growth %)
   - Component: Charts using chart library (Recharts, Chart.js)

5. **Permissions**:
   - Regular Users: Can view, add, refresh stats (cannot delete)
   - Admin Users: All permissions + can delete channels

**API Integration**:
- `GET /api/projects/:projectId/channels` - List internal channels
- `POST /api/projects/:projectId/channels` - Add internal channel
- `DELETE /api/projects/:projectId/channels/:channelId` - Delete channel (Admin only)
- `POST /api/projects/:projectId/channels/:channelId/refresh` - Refresh stats

**Reference**: `docs/4.ui-design/domains/internal/project-social-management-ui.md`

#### 7.2. Marketing Stats Dashboard (`/projects/{id}/marketing`)

**Purpose**: Executive dashboard for marketing team and senior management to track **Astraler's own marketing performance**

**Key Requirements**:
- **ONLY shows Astraler's data** (`ProjectSocialChannel`, `ProjectVideoAds`, `ProjectVideoOrganic`)
- **Completely separate** from competitor data in External section

**Components**:
1. **Executive Summary Cards** (x4):
   - Total Social Channels (count of `ProjectSocialChannel`)
   - Video Ads Running (count of `ProjectVideoAds`)
   - Video Organic Published (count of `ProjectVideoOrganic`)
   - Total Followers Growth (sum with % change last 30 days)
   - Component: `CardDataStats` with trend indicators

2. **Social Channels Overview Section**:
   - Summary Stats: Total Channels, Total Followers, Average Growth Rate, Total Posts/Videos
   - Action: "View All Channels →" link to `/projects/{id}/social`
   - Component: `Card` with stats grid + link

3. **Video Ads Performance Section**:
   - Summary Stats: Total Ads, Active Ads, Total Impressions, Total Spend
   - Action: "View All Ads →" link to `/projects/{id}/video-ads` (Internal)
   - Component: `Card` with stats grid + link

4. **Video Organic Performance Section**:
   - Summary Stats: Total Videos, Total Views, Total Engagement, Average Engagement Rate
   - Action: "View All Videos →" link to `/projects/{id}/video-organic` (Internal)
   - Component: `Card` with stats grid + link

5. **Growth Trends Charts**:
   - Followers Growth Over Time (Line chart - 30-day, 90-day, 1-year views)
   - Video Ads Performance (Line chart - impressions over time)
   - Video Organic Performance (Line chart - views over time)
   - Component: Charts using chart library (Recharts)

6. **Recent Activity Feed**:
   - Latest Social Channel Updates
   - Latest Video Ads Discovered
   - Latest Video Organic Published
   - Component: Timeline or feed list

**API Integration**:
- `GET /api/projects/:projectId/marketing/stats` - Get marketing stats aggregation

**Reference**: `docs/4.ui-design/domains/internal/marketing-stats-ui.md`

#### 7.3. Internal Video Ads Page (`/projects/{id}/video-ads`)

**Purpose**: View and manage **Astraler's own video ads** (ads that Astraler is running)

**Key Requirements**:
- **ONLY shows Internal video ads** (`ProjectVideoAds` - from `ProjectSocialChannel`)
- **NO competitor ads** - those are in External section
- Route: `/projects/{id}/video-ads` (no `source` parameter needed - Internal by default)

**Components**:
1. **Page Header**:
   - Title: "Video Ads" (or "My Video Ads")
   - Badge: "Internal" or "Astraler Marketing"
   - Filters: Channel, Platform, Date Range, Status
   - Actions: Export, Refresh

2. **Video Ads Table/Grid**:
   - Columns/Cards: Thumbnail, Title, Channel, Platform, CTA Text, CTA Type, Published Date, Status, Impressions, Spend
   - Source Badge: "Internal" or "Astraler" (to distinguish from External if accessed from shared route)
   - Actions: View Details, View Landing Page (if `destinationUrl` exists)
   - Component: `DataTable` or Grid of `VideoFeedCard`

3. **Summary Stats**:
   - Total Ads, Active Ads, Total Impressions, Total Spend
   - Component: `CardDataStats` (x4)

**API Integration**:
- `GET /api/projects/:projectId/video-ads` - List internal video ads (no `source` parameter)

**Reference**: `docs/4.ui-design/domains/data-collection/ads-library-ui.md` (Internal context)

#### 7.4. Internal Video Organic Page (`/projects/{id}/video-organic`)

**Purpose**: View and manage **Astraler's own organic videos** (organic content that Astraler is publishing)

**Key Requirements**:
- **ONLY shows Internal organic videos** (`ProjectVideoOrganic` - from `ProjectSocialChannel`)
- **NO competitor videos** - those are in External section
- Route: `/projects/{id}/video-organic` (no `source` parameter needed - Internal by default)

**Components**:
1. **Page Header**:
   - Title: "Video Organic" (or "My Organic Videos")
   - Badge: "Internal" or "Astraler Marketing"
   - Filters: Channel, Platform, Date Range
   - Actions: Export, Refresh

2. **Video Organic Grid**:
   - Video Cards: Thumbnail, Title, Channel, Platform, Views, Likes, Comments, Shares, Published Date
   - Source Badge: "Internal" or "Astraler" (to distinguish from External if accessed from shared route)
   - Actions: View Details, Watch Video
   - Component: Grid of `VideoFeedCard`

3. **Summary Stats**:
   - Total Videos, Total Views, Total Engagement, Average Engagement Rate
   - Component: `CardDataStats` (x4)

**API Integration**:
- `GET /api/projects/:projectId/video-organic` - List internal organic videos (no `source` parameter)

**Reference**: `docs/4.ui-design/domains/data-collection/videos-library-ui.md` (Internal context)

#### 7.5. Navigation Updates

**Sidebar Navigation** (Internal Section):

```
📱 INTERNAL (Astraler Marketing Platform)
   ├── Info
   ├── ASO
   ├── Social (✨ Manage Astraler's own social channels)
   └── Marketing (✨ Marketing performance dashboard)
```

**Routes**:
- `/projects/{id}/social` - Social Management (Internal)
- `/projects/{id}/marketing` - Marketing Stats Dashboard (Internal)
- `/projects/{id}/video-ads` - Video Ads (Internal - Astraler's ads)
- `/projects/{id}/video-organic` - Video Organic (Internal - Astraler's videos)

**Visual Design**:
- **INTERNAL Section**: Indigo accent (`#6366F1`)
- Icons: `Share2` for Social, `TrendingUp` for Marketing

**Reference**: `docs/4.ui-design/workspace-layout.md`

---

## 7. Critical Files to Modify

| Priority | File | Change |
|----------|------|--------|
| P0 | `backend/prisma/schema.prisma` | Create separated table schema |
| P0 | Data migration script | Migrate ALL data to External tables |
| P1 | `backend/src/modules/projects/services/*.ts` | Create Internal services |
| P1 | `backend/src/modules/data-collection/services/*.ts` | Rename to External services |
| P1 | `backend/src/modules/data-collection/processors/*.ts` | Handle both table types |
| P2 | `backend/src/modules/projects/controllers/*.ts` | Update endpoints |
| P2 | `frontend/src/features/*/api/*.ts` | Update API calls |
| P2 | `frontend/src/features/videos/pages/*.tsx` | Remove source parameter |

---

## 8. Decisions & Clarifications

### ✅ Decision 1: Unique Constraint on Social Channels

**Question**: Can the same channel (e.g., same TikTok account `@username`) exist as BOTH Internal and External?

**✅ Decision**: **YES** - Same channel CAN exist in both tables

**Action Required**: Remove `@@unique([platform, platformId])` constraint from both `ProjectSocialChannel` and `CompetitorSocialChannel`, or use composite unique constraint that includes table context.

### ✅ Decision 2: Project Model Relations

**Recommendation**: Follow standard Prisma pattern

- **Direct relations** (Internal): `projectSocialChannels`, `projectVideoAds`, `projectVideoOrganics`, `projectLandingPages`
- **Indirect relations** (External via Competitor): `competitorVideoAds`, `competitorVideoOrganics`, `competitorLandingPages` (through `competitor` relation)

**✅ Decision**: Confirmed - Use direct relations for Internal, indirect for External via Competitor

### ✅ Decision 3: Competitor Model Relations

**Recommendation**: Follow standard Prisma pattern

- **Direct relations**: `competitorSocialChannels`, `competitorLandingPages`
- **Indirect relations**: `competitorVideoAds`, `competitorVideoOrganics` (through `competitorSocialChannel` relation)

**✅ Decision**: Confirmed - Use direct relations for channels/landing pages, indirect for videos via channels

### ✅ Decision 4: Migration Script Execution Strategy

**Recommendation**: **Two-phase migration** (Safer approach)

1. **Phase 1**: Create new tables (Prisma migration) - don't migrate data
2. **Phase 2**: Migrate data from old tables to new tables (SQL script)
3. **Phase 3**: Verify data integrity
4. **Phase 4**: Drop old tables (after verification)

**Reason**: Safer, can verify each step, doesn't lock database for too long

**✅ Decision**: Use Two-phase migration approach

### ✅ Decision 5: Backward Compatibility During Migration

**Recommendation**: **No backward compatibility** (Simpler approach)

- Migrate everything at once (schema + data + code)
- Drop old tables immediately after verification
- Keep old tables for 1-2 weeks for verification, then drop

**Reason**: Simpler, avoids confusion, avoids bugs from code running on both sets of tables

**✅ Decision**: No backward compatibility - migrate everything at once, drop old tables after verification period

### ✅ Decision 6: Frontend Route Structure

**✅ Decision**: **CONFIRMED** - Use proposed route structure

- Internal: `/projects/:id/video-ads` (no source param, Internal by default)
- External: `/projects/:id/competitors/video-ads` (no source param, External by default)

---

## 9. Verification Checklist

After implementation, verify:

- [ ] No shared tables with classification rules
- [ ] Internal pages query `Project*` tables only
- [ ] External pages query `Competitor*` tables only
- [ ] No `source` parameter needed in any query
- [ ] TypeScript prevents mixing Internal/External types
- [ ] Crawlers create data in correct tables based on channel type
- [ ] SpyKeyword ONLY links to External tables (`CompetitorVideoAds`, `CompetitorVideoOrganic`)
- [ ] LandingPage split into `ProjectLandingPage` (Internal) and `CompetitorLandingPage` (External)
- [ ] Unique constraint removed from both `ProjectSocialChannel` and `CompetitorSocialChannel`
- [ ] All data migrated successfully (no data loss)
- [ ] All relations updated correctly
- [ ] Internal UI pages implemented (Social Management, Marketing Stats, Video Ads, Video Organic)
- [ ] Internal pages show ONLY Astraler's data (no competitor data)
- [ ] Navigation updated with Internal section (Social, Marketing)
- [ ] All UI components follow design system guidelines
- [ ] Permissions correctly implemented (Admin can delete, regular users cannot)

---

## 10. Related Documents

### Technical Documents
- `docs/prompt-for-claude-code/table-separation-refactoring-final.md` - Detailed requirements
- `docs/3.technical-design/architecture-decision-table-separation.md` - Architecture decision
- `docs/3.technical-design/database-schema.md` - Current schema
- `docs/3.technical-design/domains/data-collection/domain-tdd.md` - Processor patterns

### UI Design Documents
- `docs/4.ui-design/workspace-layout.md` - Workspace navigation structure
- `docs/4.ui-design/domains/internal/project-social-management-ui.md` - Social Management page design
- `docs/4.ui-design/domains/internal/marketing-stats-ui.md` - Marketing Stats dashboard design
- `docs/4.ui-design/domains/data-collection/ads-library-ui.md` - Video Ads page design
- `docs/4.ui-design/domains/data-collection/videos-library-ui.md` - Video Organic page design
- `docs/4.ui-design/system-ui-design.md` - System UI design guidelines
- `docs/4.ui-design/component-library.md` - Component library reference

---

## 11. Implementation Notes

- **No time constraints** - Implement thoroughly
- **Follow existing codebase patterns** - See `.framework-sdlc/usecase-for-prompting/maintain.md`
- **Test thoroughly** - Verify data integrity at each step
- **Document changes** - Update all related documentation

---

**Status**: ✅ **READY FOR IMPLEMENTATION**
