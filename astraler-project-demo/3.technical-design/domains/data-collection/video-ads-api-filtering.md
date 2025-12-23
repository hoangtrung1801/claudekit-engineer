# Video Ads API Filtering: Internal vs External

## Important Clarification

**VideoAds ALWAYS has `projectId`** (required field, cannot be null).  
**DO NOT filter by `projectId IS NULL`** - this is incorrect.

The distinction between Internal (project's own channels) and External (competitor channels) is made through the **`socialChannel` relationship**, not the VideoAds `projectId` field itself.

## Correct Query Patterns

### External Section (Competitor Video Ads)

```typescript
// ✅ CORRECT: Filter by socialChannel.competitorId (External)
const videoAds = await this.prisma.videoAds.findMany({
  where: {
    projectId,  // VideoAds always has projectId (required)
    socialChannel: {
      competitor: { projectId },  // From competitor channels
      competitorId: { not: null }, // Competitor-linked
      projectId: null,              // NOT project-linked (Internal)
    },
  },
  include: { 
    socialChannel: { 
      include: { competitor: true } 
    } 
  },
});
```

### Internal Section (Project's Own Video Ads)

```typescript
// ✅ CORRECT: Filter by socialChannel.projectId (Internal)
const videoAds = await this.prisma.videoAds.findMany({
  where: {
    projectId,  // VideoAds always has projectId (required)
    socialChannel: {
      projectId: projectId,  // Project-linked channel (Internal)
      competitorId: null,      // NOT competitor-linked (External)
    },
  },
  include: { socialChannel: true },
});
```

### ❌ INCORRECT Pattern (DO NOT USE)

```typescript
// ❌ WRONG: VideoAds.projectId is ALWAYS set, never null
const videoAds = await this.prisma.videoAds.findMany({
  where: {
    projectId: null,  // This will NEVER match - projectId is required!
  },
});
```

## API Endpoint Implementation

### Query Parameter: `source`

Add a `source` query parameter to VideoAds listing endpoints:

```typescript
@Get('video-ads')
async getVideoAds(
  @Param('projectId') projectId: string,
  @Query('source') source?: 'internal' | 'external',
  @Query() filters?: ListVideoAdsQueryDto,
) {
  const where: any = {
    projectId,  // Always required
  };

  if (source === 'internal') {
    // Internal: project's own channels
    where.socialChannel = {
      projectId: projectId,
      competitorId: null,
    };
  } else if (source === 'external') {
    // External: competitor channels (default for External section)
    where.socialChannel = {
      competitor: { projectId },
      competitorId: { not: null },
      projectId: null,
    };
  }
  // If source not specified, return all (both Internal and External)

  return this.videoAdsService.findAll(where, filters);
}
```

## Same Pattern for VideoOrganic

The same filtering logic applies to `VideoOrganic`:

```typescript
// External (competitor videos)
WHERE projectId = ? 
  AND socialChannel.competitorId IS NOT NULL 
  AND socialChannel.projectId IS NULL

// Internal (project's own videos)
WHERE projectId = ? 
  AND socialChannel.projectId = ? 
  AND socialChannel.competitorId IS NULL
```

## Summary

- ✅ **VideoAds/VideoOrganic always have `projectId`** (required field)
- ✅ **Filter by `socialChannel.competitorId`** for External (competitor channels)
- ✅ **Filter by `socialChannel.projectId`** for Internal (project's own channels)
- ❌ **DO NOT filter by `VideoAds.projectId IS NULL`** - this is incorrect
