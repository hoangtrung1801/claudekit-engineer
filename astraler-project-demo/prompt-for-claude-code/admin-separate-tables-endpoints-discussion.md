# Admin Panel: Separate Tables Architecture - Endpoints Design Discussion

## Current Problem

### Context

Database schema has been refactored to separate **Internal (Astraler)** and **External (Competitors)** data into separate tables:

**Internal Tables (Astraler's Own Data):**
- `ProjectSocialChannel` - Astraler's own social channels
- `ProjectVideoAds` - Astraler's video ads
- `ProjectVideoOrganic` - Astraler's organic videos  
- `ProjectLandingPage` - Astraler's landing pages

**External Tables (Competitor Data):**
- `CompetitorSocialChannel` - Competitor social channels
- `CompetitorVideoAds` - Competitor video ads
- `CompetitorVideoOrganic` - Competitor organic videos
- `CompetitorLandingPage` - Competitor landing pages

**Deprecated Table (still exists but should not be used anymore):**
- `SocialChannel` - Old unified table (has both `projectId` and `competitorId`)

### Current State

**Backend Admin APIs:**
- `GET /admin/social` - Currently querying from old `SocialChannel` table (deprecated)
- `GET /admin/video-ads` - Querying from `VideoAds` (needs to be split)
- `GET /admin/videos` - Querying from `VideoOrganic` (needs to be split)
- `GET /admin/landing-pages` - Querying from `LandingPage` (needs to be split)

**Frontend Admin Panel:**
- Sidebar has 2 sections: "Internal (Astraler)" and "External (Competitors)"
- Currently using query param `?source=internal` or `?source=external`
- Example: `/admin/social?source=internal` and `/admin/social?source=external`

### Problem

With **separate tables**, the approach using `source` parameter **is no longer appropriate** because:

1. Backend must query from 2 different tables (`ProjectSocialChannel` vs `CompetitorSocialChannel`)
2. Cannot use one endpoint with query param to query from 2 separate tables clearly
3. Type safety: Internal and External data have different structures
4. Code complexity: Logic must distinguish internal vs external in the same method

## Proposed Solution

### Option 1: Separate Routes/Pages (Not Recommended)
- Frontend has 2 separate pages for Internal and External
- **Disadvantages**: Duplicate UI code, does not leverage component reuse

### Option 2: Separate Backend Endpoints with Shared UI Components (Recommended)

**Backend:**
```
GET /admin/internal/social           → Query ProjectSocialChannel
GET /admin/external/social           → Query CompetitorSocialChannel
GET /admin/internal/video-ads        → Query ProjectVideoAds
GET /admin/external/video-ads        → Query CompetitorVideoAds
GET /admin/internal/videos           → Query ProjectVideoOrganic
GET /admin/external/videos           → Query CompetitorVideoOrganic
GET /admin/internal/landing-pages    → Query ProjectLandingPage
GET /admin/external/landing-pages    → Query CompetitorLandingPage
```

**Frontend:**
- Sidebar links: `/admin/internal/social` and `/admin/external/social`
- Component reuse: `GlobalSocialListPage` receives `source` prop from route
- API calls: Call correct endpoint based on route path

**Advantages:**
- ✅ Clear, easy-to-understand URLs
- ✅ Backend logic separated (easier to maintain)
- ✅ Type-safe with separate types
- ✅ Component reuse (no duplicate UI)
- ✅ Aligns with separate tables architecture

**Disadvantages:**
- Need to update routes and API calls

## Implementation Details (If choosing Option 2)

### Backend Changes

**Service Methods:**
```typescript
// data-admin.service.ts
async findAllInternalSocialChannels(query: ListInternalSocialQueryDto) {
  // Query ProjectSocialChannel table
  return this.prisma.projectSocialChannel.findMany({...});
}

async findAllExternalSocialChannels(query: ListExternalSocialQueryDto) {
  // Query CompetitorSocialChannel table
  return this.prisma.competitorSocialChannel.findMany({...});
}
```

**Controller Routes:**
```typescript
// data-admin.controller.ts
@Get('internal/social')
async findAllInternalSocialChannels(@Query() query: ListInternalSocialQueryDto) {
  return this.dataAdminService.findAllInternalSocialChannels(query);
}

@Get('external/social')
async findAllExternalSocialChannels(@Query() query: ListExternalSocialQueryDto) {
  return this.dataAdminService.findAllExternalSocialChannels(query);
}
```

### Frontend Changes

**Routes (App.tsx):**
```typescript
<Route path="admin/internal/social" element={<GlobalSocialListPage source="internal" />} />
<Route path="admin/external/social" element={<GlobalSocialListPage source="external" />} />
```

**Sidebar (admin-layout.tsx):**
```typescript
// Internal section
{ icon: "group", label: "Social Channels", to: "/admin/internal/social" }

// External section  
{ icon: "group", label: "Social Channels", to: "/admin/external/social" }
```

**API Calls:**
```typescript
// admin.api.ts
listInternalSocialChannels: (params) =>
  apiClient(`/admin/internal/social${buildQueryString(params)}`),

listExternalSocialChannels: (params) =>
  apiClient(`/admin/external/social${buildQueryString(params)}`),
```

**Component:**
```typescript
// global-social-list.page.tsx
function GlobalSocialListPage({ source }: { source: 'internal' | 'external' }) {
  const endpoint = source === 'internal' 
    ? '/admin/internal/social'
    : '/admin/external/social';
  
  const { data } = useQuery(endpoint);
  // ... rest of component logic
}
```

## Decision Questions

1. **Should we implement Option 2 (Separate Endpoints)?**
   - Advantages/disadvantages have been analyzed above
   
2. **If choosing Option 2, what is the migration path?**
   - Should we maintain backward compatibility with old routes?
   - Redirect `/admin/social?source=internal` → `/admin/internal/social`?

3. **Timeline:**
   - Implement immediately or wait for database migration to complete?
   - Do we need to support both approaches during transition period?

4. **Alternative approach:**
   - Is there a better way?

## Current Files Reference

**Backend:**
- `backend/src/modules/admin/services/data-admin.service.ts` - Line 972: `findAllGlobalSocialChannels()` is querying from `SocialChannel` table
- `backend/src/modules/admin/controllers/data-admin.controller.ts` - Line 335: `@Get('social')` endpoint

**Frontend:**
- `frontend/src/features/admin/components/admin-layout.tsx` - Line 33, 43: Sidebar links with `?source=` param
- `frontend/src/features/admin/pages/global-social-list.page.tsx` - Line 147: Reading `source` from query params
- `frontend/src/features/admin/api/admin.api.ts` - Line 485: `listGlobalSocialChannels()` API call

## ✅ DECISION: Option 2 - Separate Endpoints + Remove Old Table Mechanism

**Decision:**
- ✅ Choose **Option 2**: Separate Backend Endpoints with Shared UI Components
- ✅ **Completely remove** old table mechanism (`SocialChannel` table queries)
- ✅ **Fail-fast approach**: If any code still uses old table, it will error immediately → force refactor

**Reasoning:**
- Fail-fast helps detect errors early, no hidden bugs
- Clear code, no legacy code paths
- Force complete refactor, no half-measures

## Next Steps

1. ✅ Confirm approach (Option 2)
2. ✅ Design detailed implementation plan
3. ⬜ Implement backend endpoints (query from ProjectSocialChannel/CompetitorSocialChannel)
4. ⬜ Remove all `prisma.socialChannel` queries
5. ⬜ Update frontend routes and components
6. ⬜ Update API calls
7. ⬜ Testing
8. ⬜ Migration/deployment

---

**Status:** ✅ **DECIDED** - Option 2 with fail-fast approach (remove old table)
