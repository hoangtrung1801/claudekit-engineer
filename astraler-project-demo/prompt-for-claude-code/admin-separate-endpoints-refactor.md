# Admin Panel: Refactor to Separate Internal/External Endpoints

## Context

Database schema has been refactored to separate **Internal (Astraler)** and **External (Competitors)** data into separate tables:

**Internal Tables:**
- `ProjectSocialChannel` - Astraler's own social channels
- `ProjectVideoAds` - Astraler's video ads
- `ProjectVideoOrganic` - Astraler's organic videos  
- `ProjectLandingPage` - Astraler's landing pages

**External Tables:**
- `CompetitorSocialChannel` - Competitor social channels
- `CompetitorVideoAds` - Competitor video ads
- `CompetitorVideoOrganic` - Competitor organic videos
- `CompetitorLandingPage` - Competitor landing pages

**Deprecated Table (needs to be completely removed):**
- `SocialChannel` - Old unified table (no longer used)

## Current Problem

**Backend Admin APIs** are currently:
- Querying from old `SocialChannel` table (deprecated)
- Using query param `?source=internal` or `?source=external` to distinguish
- Endpoints: `/admin/social`, `/admin/videos`, `/admin/landing-pages`

**Frontend Admin Panel** is currently:
- Sidebar links with `?source=internal` or `?source=external`
- Components reading `source` from URL query params

## Decision

✅ **Choose Option 2**: Separate Backend Endpoints with Shared UI Components

**Requirements:**
1. **Backend**: Split endpoints into `/admin/internal/*` and `/admin/external/*`
   - `/admin/internal/social` → Query `ProjectSocialChannel`
   - `/admin/external/social` → Query `CompetitorSocialChannel`
   - Similarly for videos, video-ads, landing-pages

2. **Frontend**: 
   - Sidebar links: `/admin/internal/social` and `/admin/external/social`
   - Component reuse with `source` prop from route path
   - API calls to correct endpoint based on route

3. **Fail-Fast Strategy**: 
   - **Completely remove** all queries from old `SocialChannel` table
   - **Do not maintain** backward compatibility
   - **Do not redirect** old routes
   - If any code still uses old table, it will error immediately → force refactor

## Scope

Need to refactor the following admin endpoints:

1. **Social Channels**: `/admin/social` → `/admin/internal/social` + `/admin/external/social`
   - GET, POST, PATCH, DELETE, bulk-delete
   - Link/unlink operations
   - Crawl triggers (ads, videos, stats)

2. **Videos (Organic)**: `/admin/videos` → `/admin/internal/videos` + `/admin/external/videos`
   - GET, GET by ID, DELETE, bulk-delete

3. **Video Ads**: Need to check and split if endpoint `/admin/video-ads` exists

4. **Landing Pages**: `/admin/landing-pages` → `/admin/internal/landing-pages` + `/admin/external/landing-pages`
   - GET, DELETE, bulk-delete

## Files to Update

### Backend
- `backend/src/modules/admin/services/data-admin.service.ts`
  - Remove: All methods querying from `prisma.socialChannel`
  - Add: Internal methods (query `ProjectSocialChannel`, `ProjectVideoAds`, `ProjectVideoOrganic`, `ProjectLandingPage`)
  - Add: External methods (query `CompetitorSocialChannel`, `CompetitorVideoAds`, `CompetitorVideoOrganic`, `CompetitorLandingPage`)

- `backend/src/modules/admin/controllers/data-admin.controller.ts`
  - Remove: Old endpoints `/admin/social`, `/admin/videos`, `/admin/landing-pages`
  - Add: `/admin/internal/social/*` endpoints
  - Add: `/admin/external/social/*` endpoints
  - Add: Internal/External video endpoints
  - Add: Internal/External landing page endpoints

- `backend/src/modules/admin/dto/`
  - Split DTOs into Internal and External versions
  - Remove old global DTOs

### Frontend
- `frontend/src/App.tsx`
  - Add routes: `/admin/internal/social`, `/admin/external/social`, etc.
  - Remove old routes or redirect

- `frontend/src/features/admin/components/admin-layout.tsx`
  - Update sidebar links: Remove `?source=` param, use separate routes

- `frontend/src/features/admin/pages/global-social-list.page.tsx`
  - Update: Receive `source` from route path instead of query param
  - Update: API calls to call correct endpoint

- `frontend/src/features/admin/api/admin.api.ts`
  - Remove: `listGlobalSocialChannels()`
  - Add: `listInternalSocialChannels()` and `listExternalSocialChannels()`
  - Add: Internal/External CRUD methods

- `frontend/src/features/admin/types/admin.types.ts`
  - Add: `AdminProjectSocialChannel` and `AdminCompetitorSocialChannel` types
  - Update: Query params types

## Critical Requirements

1. **Fail-Fast**: Completely remove all `prisma.socialChannel` queries
2. **No Backward Compatibility**: Do not keep old endpoints, do not redirect
3. **Type Safety**: Separate types for Internal vs External data
4. **Component Reuse**: Same component for Internal/External, only API endpoint differs

## Reference Files

- `docs/prompt-for-claude-code/admin-separate-tables-endpoints-discussion.md` - Discussion about the problem and solution

---

**Status:** ✅ **READY FOR IMPLEMENTATION** - Claude Code needs to implement according to the requirements above
