# Database Schema Proposal: VideoAds and VideoOrganic Separation

> **Status:** Proposal - Pending Approval  
> **Priority:** P0 - Critical  
> **Impact:** Major - Affects entire codebase

---

## 🎯 Rationale

**Why Separate Tables?**

1. **Different Data Sources:**
   - Video Ads: From Ads Library Transparency APIs (Meta, TikTok, Google Ads)
   - Video Organic: From social profile crawlers (TikTok, YouTube, Instagram, Facebook)

2. **Different Data Fields:**
   - Video Ads: Ad-specific metadata (impressions, spend, advertiser info, video URLs from ads)
   - Video Organic: Engagement metrics (views, likes, comments, shares from social platforms)

3. **Different Use Cases:**
   - Video Ads: Ad intelligence, competitor ad analysis
   - Video Organic: Content performance, hero video detection

4. **Schema Clarity:**
   - Clear separation makes queries simpler
   - No nullable fields that only apply to one type
   - Better type safety in code

---

## 📊 Proposed Schema Design

### Common Fields (Base Structure)

Both tables share these common fields:
- `id` (UUID)
- `projectId` (FK to Project)
- `socialChannelId` (FK to SocialChannel)
- `spyKeywordId` (FK to SpyKeyword, optional)
- `platform` (String: 'tiktok', 'youtube', 'facebook', 'instagram')
- `platformId` (String: External platform video ID)
- `title` (String)
- `description` (String?, Text)
- `thumbnailUrl` (String?)
- `createdAt` (DateTime)
- `publishedAt` (DateTime)
- `heroScore` (Float) - Calculated for both types

### VideoAds Table (Specific Fields)

**Ad-Specific Fields:**
- `videoUrl` (String?) - Direct video URL from ads API
- `videoHdUrl` (String?) - HD video URL from ads API
- `videoSdUrl` (String?) - SD video URL from ads API
- `videoPreviewImageUrl` (String?) - Preview image from ads

**Ad Metadata (from Ads Library):**
- `platformAdId` (String?) - Ad ID from platform (e.g., Meta ad_archive_id)
- `adPlatform` (String) - 'META', 'TIKTOK', 'GOOGLE'
- `advertiserName` (String?) - Advertiser/page name
- `pageId` (String?) - Platform page ID
- `pageProfileUri` (String?) - Advertiser profile URL
- `pageProfilePictureUrl` (String?) - Advertiser profile picture
- `pageCategories` (String[]) - Page categories
- `pageLikeCount` (Int?) - Page like count

**Ad Status & Timing:**
- `status` (String) - 'ACTIVE', 'INACTIVE', 'UNKNOWN'
- `firstShownDate` (DateTime?) - When ad first appeared
- `lastShownDate` (DateTime?) - When ad last appeared
- `deliveryStartDate` (DateTime?) - Ad delivery start
- `deliveryStopDate` (DateTime?) - Ad delivery stop

**Ad Targeting:**
- `publisherPlatforms` (String[]) - ['FACEBOOK', 'INSTAGRAM', etc.]
- `countries` (String[]) - Target countries

**Ad Metrics (Estimated):**
- `impressionsMin` (Int?) - Estimated min impressions
- `impressionsMax` (Int?) - Estimated max impressions
- `spendMin` (Float?) - Estimated min spend
- `spendMax` (Float?) - Estimated max spend
- `spendCurrency` (String?) - Currency code

**Ad Content:**
- `creativeBody` (String?, Text) - Ad copy/text
- `creativeLinkTitle` (String?) - Ad link title
- `destinationUrl` (String?) - Landing page URL
- `snapshotUrl` (String?) - Ad snapshot/preview URL

**Note:** No engagement metrics (views, likes, comments, shares) - these are not available from Ads Library APIs

### VideoOrganic Table (Specific Fields)

**Engagement Metrics (from Social Platforms):**
- `views` (Int, default 0)
- `likes` (Int, default 0)
- `comments` (Int, default 0)
- `shares` (Int, default 0)

**Video Metadata:**
- `duration` (Int) - Video duration in seconds
- `videoUrl` (String?) - Standard video URL from platform (if available)
- `transcript` (String?, Text) - Video transcript (if available)
- `captions` (String?) - Caption/subtitle URL (if available)

**Note:** No ad-specific fields - these don't apply to organic videos

### VideoSnapshot Table (Shared)

Both VideoAds and VideoOrganic can have snapshots for tracking metrics over time:

```prisma
model VideoAdsSnapshot {
  id         String   @id @default(uuid())
  videoAdId  String
  videoAd    VideoAds @relation(fields: [videoAdId], references: [id], onDelete: Cascade)
  
  // Ad metrics snapshots (if available)
  impressionsMin    Int?
  impressionsMax    Int?
  spendMin          Float?
  spendMax          Float?
  
  capturedAt DateTime @default(now())
  
  @@index([videoAdId, capturedAt])
}

model VideoOrganicSnapshot {
  id            String       @id @default(uuid())
  videoOrganicId String
  videoOrganic  VideoOrganic @relation(fields: [videoOrganicId], references: [id], onDelete: Cascade)
  
  // Engagement metrics snapshots
  views         Int
  likes         Int
  comments      Int      @default(0)
  shares        Int      @default(0)
  
  capturedAt DateTime @default(now())
  
  @@index([videoOrganicId, capturedAt])
}
```

---

## 🔄 Migration Strategy

### Step 1: Create New Tables
1. Create `VideoAds` table with all fields
2. Create `VideoOrganic` table with all fields
3. Create `VideoAdsSnapshot` table
4. Create `VideoOrganicSnapshot` table

### Step 2: Migrate Existing Data
1. Query existing `Video` table
2. For each video:
   - If `type = AD`: Insert into `VideoAds` table
   - If `type = ORGANIC`: Insert into `VideoOrganic` table
3. Migrate snapshots:
   - `VideoSnapshot` → `VideoAdsSnapshot` or `VideoOrganicSnapshot` based on parent video type

### Step 3: Update Relations
1. Update `Project` model: Remove `videos` relation, add `videoAds` and `videoOrganics` relations
2. Update `SocialChannel` model: Remove `videos` relation, add `videoAds` and `videoOrganics` relations
3. Update `SpyKeyword` model: Remove `videos` relation, add `videoAds` and `videoOrganics` relations

### Step 4: Drop Old Table
1. Drop `Video` table
2. Drop `VideoSnapshot` table
3. Remove `VideoType` enum (no longer needed)

---

## 📝 Complete Schema Definition

```prisma
// ============================================
// Video Ads (from Ads Library Transparency)
// ============================================

model VideoAds {
  id              String        @id @default(uuid())
  projectId       String
  project         Project       @relation("ProjectVideoAds", fields: [projectId], references: [id], onDelete: Cascade)
  socialChannelId String
  socialChannel   SocialChannel @relation("SocialChannelVideoAds", fields: [socialChannelId], references: [id], onDelete: Cascade)
  
  // Spy Keyword link (for tracking discovery source)
  spyKeywordId    String?
  spyKeyword      SpyKeyword?   @relation("SpyKeywordVideoAds", fields: [spyKeywordId], references: [id], onDelete: SetNull)
  
  // Platform identification
  platform        String        // 'tiktok', 'youtube', 'facebook', 'instagram'
  platformId      String        // External platform video ID
  platformAdId    String?       // Ad ID from platform (e.g., Meta ad_archive_id)
  adPlatform      String        // 'META', 'TIKTOK', 'GOOGLE'
  
  // Basic video info
  title           String
  description     String?       @db.Text
  thumbnailUrl    String?
  videoPreviewImageUrl String?
  
  // Video URLs (from Ads Library APIs)
  videoUrl        String?       // Direct video URL
  videoHdUrl      String?       // HD video URL
  videoSdUrl      String?       // SD video URL
  
  // Advertiser/Page info
  advertiserName  String?
  pageId          String?       // Platform page ID
  pageProfileUri  String?       // Advertiser profile URL
  pageProfilePictureUrl String? // Advertiser profile picture
  pageCategories  String[]      // Page categories
  pageLikeCount   Int?         // Page like count
  
  // Ad content
  creativeBody    String?       @db.Text  // Ad copy/text
  creativeLinkTitle String?     // Ad link title
  destinationUrl  String?      // Landing page URL
  snapshotUrl     String?      // Ad snapshot/preview URL
  
  // Ad status & timing
  status          String        @default("UNKNOWN") // 'ACTIVE', 'INACTIVE', 'UNKNOWN'
  firstShownDate  DateTime?
  lastShownDate   DateTime?
  deliveryStartDate DateTime?
  deliveryStopDate  DateTime?
  
  // Ad targeting
  publisherPlatforms String[]   // ['FACEBOOK', 'INSTAGRAM', etc.]
  countries         String[]   // Target countries
  
  // Ad metrics (estimated ranges)
  impressionsMin    Int?
  impressionsMax    Int?
  spendMin          Float?
  spendMax          Float?
  spendCurrency     String?
  
  // Common fields
  heroScore       Float         @default(0.0)
  createdAt       DateTime      @default(now())
  publishedAt     DateTime
  
  // Relations
  snapshots       VideoAdsSnapshot[]
  
  @@unique([platform, platformId])
  @@unique([adPlatform, platformAdId]) // Unique per ad platform
  @@index([projectId, publishedAt])
  @@index([projectId, heroScore])
  @@index([socialChannelId, publishedAt])
  @@index([spyKeywordId])
  @@index([projectId, status])
  @@index([adPlatform, platformAdId])
}

model VideoAdsSnapshot {
  id            String    @id @default(uuid())
  videoAdId     String
  videoAd       VideoAds  @relation(fields: [videoAdId], references: [id], onDelete: Cascade)
  
  // Ad metrics snapshots
  impressionsMin    Int?
  impressionsMax    Int?
  spendMin          Float?
  spendMax          Float?
  
  capturedAt    DateTime  @default(now())
  
  @@index([videoAdId, capturedAt])
}

// ============================================
// Video Organic (from Social Profile Crawlers)
// ============================================

model VideoOrganic {
  id              String        @id @default(uuid())
  projectId       String
  project         Project       @relation("ProjectVideoOrganics", fields: [projectId], references: [id], onDelete: Cascade)
  socialChannelId String
  socialChannel   SocialChannel @relation("SocialChannelVideoOrganics", fields: [socialChannelId], references: [id], onDelete: Cascade)
  
  // Spy Keyword link (for tracking discovery source)
  spyKeywordId    String?
  spyKeyword      SpyKeyword?   @relation("SpyKeywordVideoOrganics", fields: [spyKeywordId], references: [id], onDelete: SetNull)
  
  // Platform identification
  platform        String        // 'tiktok', 'youtube', 'facebook', 'instagram'
  platformId      String        // External platform video ID
  
  // Basic video info
  title           String
  description     String?       @db.Text
  thumbnailUrl    String?
  duration        Int           // seconds
  
  // Video URL (from social platform APIs)
  videoUrl        String?       // Standard video URL from platform
  
  // Engagement metrics (from social platforms)
  views           Int           @default(0)
  likes           Int           @default(0)
  comments        Int           @default(0)
  shares          Int           @default(0)
  
  // Additional metadata
  transcript      String?       @db.Text  // Video transcript (if available)
  captions        String?       // Caption/subtitle URL (if available)
  
  // Common fields
  heroScore       Float         @default(0.0)
  createdAt       DateTime      @default(now())
  publishedAt     DateTime
  
  // Relations
  snapshots       VideoOrganicSnapshot[]
  
  @@unique([platform, platformId])
  @@index([projectId, publishedAt])
  @@index([projectId, heroScore])
  @@index([socialChannelId, publishedAt])
  @@index([spyKeywordId])
  @@index([projectId, views])  // For top videos queries
}

model VideoOrganicSnapshot {
  id            String         @id @default(uuid())
  videoOrganicId String
  videoOrganic  VideoOrganic   @relation(fields: [videoOrganicId], references: [id], onDelete: Cascade)
  
  // Engagement metrics snapshots
  views         Int
  likes         Int
  comments      Int            @default(0)
  shares        Int            @default(0)
  
  capturedAt    DateTime       @default(now())
  
  @@index([videoOrganicId, capturedAt])
}
```

---

## 🔗 Updated Relations

### Project Model
```prisma
model Project {
  // ... existing fields ...
  videoAds        VideoAds[]       @relation("ProjectVideoAds")
  videoOrganics   VideoOrganic[]   @relation("ProjectVideoOrganics")
  // REMOVED: videos Video[]
}
```

### SocialChannel Model
```prisma
model SocialChannel {
  // ... existing fields ...
  videoAds        VideoAds[]       @relation("SocialChannelVideoAds")
  videoOrganics   VideoOrganic[]   @relation("SocialChannelVideoOrganics")
  // REMOVED: videos Video[]
}
```

### SpyKeyword Model
```prisma
model SpyKeyword {
  // ... existing fields ...
  videoAds        VideoAds[]       @relation("SpyKeywordVideoAds")
  videoOrganics   VideoOrganic[]   @relation("SpyKeywordVideoOrganics")
  // REMOVED: videos Video[]
}
```

---

## ⚠️ Impact Analysis

### Backend Changes Required

1. **Services:**
   - Split `VideoService` → `VideoAdsService` + `VideoOrganicService`
   - Or create unified service with type-specific methods

2. **Controllers:**
   - Split `VideoController` → `VideoAdsController` + `VideoOrganicController`
   - Or use single controller with type parameter

3. **Processors:**
   - `AdsLibraryProcessor`: Create `VideoAds` records
   - `SocialContentProcessor`: Create `VideoOrganic` records

4. **Queries:**
   - All queries need to target correct table
   - Union queries if need both types together

### Frontend Changes Required

1. **Types:**
   - Split `Video` type → `VideoAds` + `VideoOrganic`
   - Or use union type

2. **API Services:**
   - Split endpoints: `/api/video-ads` and `/api/videos` (organic)
   - Or use single endpoint with type parameter

3. **Components:**
   - Update Video components to handle both types
   - Or create separate components

### API Endpoints Changes

**Option 1: Separate Endpoints (Recommended)**
```
GET    /api/video-ads              # List Video Ads
GET    /api/video-ads/:id          # Get Video Ad detail
POST   /api/video-ads              # Create Video Ad (from crawler)
DELETE /api/video-ads/:id          # Delete Video Ad

GET    /api/videos                 # List Video Organic
GET    /api/videos/:id             # Get Video Organic detail
POST   /api/videos                 # Create Video Organic (from crawler)
DELETE /api/videos/:id             # Delete Video Organic
```

**Option 2: Unified Endpoint with Type Parameter**
```
GET    /api/videos?type=ads        # List Video Ads
GET    /api/videos?type=organic    # List Video Organic
GET    /api/videos/:id             # Get video (detect type automatically)
```

---

## ✅ Benefits

1. **Schema Clarity:** No nullable fields that only apply to one type
2. **Type Safety:** Clear separation in code
3. **Query Performance:** Simpler queries, better indexes
4. **Maintainability:** Easier to understand and modify
5. **Scalability:** Can optimize each table independently

---

## ❌ Trade-offs

1. **Code Duplication:** Some common logic needs to be duplicated or abstracted
2. **Union Queries:** If need both types together, requires UNION queries
3. **Migration Complexity:** Large migration effort
4. **API Changes:** Breaking changes to existing APIs

---

## 📋 Next Steps

1. Review and approve this proposal
2. Update database schema document
3. Create migration scripts
4. Update all technical documents
5. Create implementation plan
6. Implement changes
