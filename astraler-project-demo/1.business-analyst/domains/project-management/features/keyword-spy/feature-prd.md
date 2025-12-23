# Feature PRD: Keyword Spy

> **Domain:** Project Management  
> **Feature ID:** PM-F08  
> **Priority:** P1 - High  
> **Complexity:** Medium

---

## 1. Feature Overview

**Keyword Spy** is a competitive intelligence feature that allows users to define keywords for monitoring competitors across multiple platforms (Ads Libraries, Social Media). Unlike ASO Keywords (which track App Store rankings), Spy Keywords are used to crawl and discover competitor activities on paid advertising platforms and organic social media content.

**Key Distinction:**
- **ASO Keywords**: Track keywords on App Store/Play Store for ranking optimization
- **Spy Keywords**: Monitor keywords across Ads Libraries and Social Media for competitive intelligence

---

## 2. Business Context

Product Managers and Marketers need to monitor competitor activities beyond app stores. They want to:
- Discover what ads competitors are running
- Monitor competitor content on social media
- Track competitor marketing strategies and messaging
- Identify trending topics and creative angles competitors use

Currently, users can only add ASO keywords for store tracking. There's no way to define keywords for crawling Ads Libraries or searching social media content. This feature fills that gap.

---

## 3. User Flows

### 3.1. Add Spy Keyword Flow

1. User navigates to Project → Keyword Spy section
2. User clicks "Add Spy Keyword"
3. User enters keyword text (e.g., "fitness app", "workout tracker")
4. User selects one or more platforms to monitor:
   - Meta Ads (Facebook, Instagram ads)
   - TikTok Ads
   - Google Ads
   - TikTok (organic content)
   - Instagram (organic content)
   - YouTube (organic content)
   - Facebook (organic content)
   - All platforms
5. User optionally adds description and tags
6. User chooses whether to auto-crawl immediately or manually trigger later
7. System creates Spy Keyword and optionally triggers crawl

### 3.2. View Spy Keyword Results Flow

1. User views Spy Keyword list for a project
2. User sees stats for each keyword:
   - Number of videos found (Video Ads and Video Organic)
   - Number of posts found
   - Last crawled timestamp
3. User clicks on a keyword to see detailed results
4. User can filter results by platform, date, video type (AD/ORGANIC), etc.

### 3.3. Manage Spy Keywords Flow

1. User can pause/resume keywords (disable temporarily)
2. User can edit platform selections
3. User can delete keywords (removes from monitoring)
4. User can trigger manual crawl for specific keywords

---

## 4. Business Rules

- **One Keyword Per Project**: A keyword text can only exist once per project (but can have multiple platforms)
- **Status Management**: Keywords can be ACTIVE (monitored), PAUSED (temporarily disabled), or INACTIVE (archived)
- **Platform Flexibility**: One keyword can monitor multiple platforms simultaneously
- **Auto-crawl Option**: User can choose to auto-crawl on creation or manually trigger later
- **Stats Tracking**: System maintains counts of discovered content (ads, videos, posts) per keyword
- **Crawl Frequency**: Crawl frequency is controlled by system-level scheduler (not per-keyword)

---

## 5. Domain Features (Detailed)

### FR-PM-SPY-01: Create Spy Keyword

**Description:** User adds a new keyword to monitor on specified platforms.

**Inputs:**
- Keyword text (required)
- Platforms (array, required, at least one)
- Description (optional)
- Tags (optional array)
- Auto-crawl flag (optional, default: false)

**Outputs:**
- Spy Keyword ID
- Created Spy Keyword object with metadata

**Business Logic:**
- Validate keyword text is not empty
- Validate at least one platform is selected
- Check for duplicate keyword text in same project (unique constraint)
- Create Spy Keyword record with status = ACTIVE
- If auto-crawl enabled, trigger crawl job immediately

**Acceptance Criteria:**
- ✅ Can create keyword with single platform
- ✅ Can create keyword with multiple platforms
- ✅ Cannot create duplicate keyword text in same project
- ✅ Auto-crawl triggers crawl job if enabled
- ✅ Stats counters initialized to 0

---

### FR-PM-SPY-02: List Spy Keywords

**Description:** User views all spy keywords for a project with filtering options.

**Inputs:**
- Project ID (required)
- Status filter (optional: ACTIVE, PAUSED, INACTIVE, ALL)
- Platform filter (optional)
- Search term (optional, search in keyword text)
- Pagination (limit, offset)

**Outputs:**
- Paginated list of Spy Keywords with stats

**Business Logic:**
- Filter by project ID
- Apply status filter if provided
- Apply platform filter if provided (check if keyword has that platform)
- Apply text search if provided
- Sort by createdAt (newest first) or lastCrawledAt
- Include stats (videosCount, postsCount)

**Acceptance Criteria:**
- ✅ Shows all active keywords by default
- ✅ Can filter by status
- ✅ Can filter by platform
- ✅ Can search by keyword text
- ✅ Shows stats for each keyword
- ✅ Pagination works correctly

---

### FR-PM-SPY-03: Update Spy Keyword

**Description:** User modifies existing spy keyword (platforms, description, tags, status).

**Inputs:**
- Spy Keyword ID (required)
- Platforms (optional, array)
- Description (optional)
- Tags (optional, array)
- Status (optional: ACTIVE, PAUSED, INACTIVE)

**Outputs:**
- Updated Spy Keyword object

**Business Logic:**
- Validate keyword exists
- Validate user has permission (project ownership)
- Update provided fields only (partial update)
- If status changed to ACTIVE, optionally trigger crawl

**Acceptance Criteria:**
- ✅ Can update platforms
- ✅ Can update description and tags
- ✅ Can change status (pause/resume)
- ✅ Cannot update keyword text (immutable, must delete and recreate)

---

### FR-PM-SPY-04: Delete Spy Keyword

**Description:** User removes spy keyword from monitoring.

**Inputs:**
- Spy Keyword ID (required)

**Outputs:**
- Success confirmation

**Business Logic:**
- Validate keyword exists
- Validate user has permission
- Delete keyword (CASCADE will handle related data)
- Optionally: Archive instead of delete (mark as INACTIVE)

**Acceptance Criteria:**
- ✅ Can delete keyword
- ✅ Confirmation dialog for safety
- ✅ Related ads/videos/posts keep reference (spyKeywordId = null)

---

### FR-PM-SPY-05: Trigger Manual Crawl

**Description:** User manually triggers crawl for specific spy keyword(s).

**Inputs:**
- Spy Keyword ID (required) or array of IDs
- Platform filter (optional, crawl only specific platform)

**Outputs:**
- Crawl job ID
- Success confirmation

**Business Logic:**
- Validate keyword exists and is ACTIVE
- Queue crawl job for specified platforms
- Update lastCrawledAt timestamp after crawl completes

**Acceptance Criteria:**
- ✅ Can trigger crawl for single keyword
- ✅ Can trigger batch crawl for multiple keywords
- ✅ Only crawls platforms assigned to keyword
- ✅ Updates lastCrawledAt after completion

---

### FR-PM-SPY-06: View Spy Keyword Results

**Description:** User views discovered content (videos, posts) for a spy keyword.

**Inputs:**
- Spy Keyword ID (required)
- Content type filter (optional: videos, posts, all)
- Platform filter (optional)
- Date range filter (optional)

**Outputs:**
- List of discovered content with metadata
- Stats summary

**Business Logic:**
- Query Video table where spyKeywordId matches (filter by type: AD or ORGANIC)
- Query SocialPost table where spyKeywordId matches
- Apply filters as requested
- Return paginated results

**Acceptance Criteria:**
- ✅ Shows all discovered videos for keyword (Video Ads and Video Organic)
- ✅ Shows all discovered posts for keyword
- ✅ Can filter by platform
- ✅ Can filter by date range
- ✅ Can filter videos by type (AD/ORGANIC)
- ✅ Shows content metadata (advertiser, platform, dates, etc.)

---

## 6. Integration Points

### 6.1. Data Collection Domain

**Event:** `spy-keyword.crawl.requested`
- **Triggered by:** Manual crawl trigger or auto-crawl on creation
- **Payload:** `{ projectId, spyKeywordId, keywordText, platforms: SpyPlatform[] }`
- **Handler:** AdsLibraryProcessor or SocialContentProcessor uses spy keywords instead of ASO keywords

**Changes Required:**
- AdsLibraryProcessor should use SpyKeyword instead of (or in addition to) ASO Keyword
- SocialContentProcessor should support spy keyword-based searches

### 6.2. Database Schema

**New Model:** `SpyKeyword`
- Links to Project
- Has array of platforms
- Has status (ACTIVE, PAUSED, INACTIVE)
- Has stats (videosCount, postsCount)

**Updated Models:**
- `Ad` model: Add `spyKeywordId` field
- `Video` model: Add `spyKeywordId` field
- `SocialPost` model: Add `spyKeywordId` field
- `Project` model: Add `spyKeywords` relation

---

## 7. Acceptance Criteria Summary

### Functional Requirements
- ✅ User can create spy keywords with multiple platform selections
- ✅ User can view list of spy keywords with stats
- ✅ User can update keyword platforms, description, tags, status
- ✅ User can delete spy keywords
- ✅ User can manually trigger crawl for keywords
- ✅ User can view discovered content (ads, videos, posts) per keyword
- ✅ System tracks stats (counts) for each keyword

### Non-Functional Requirements
- ✅ Keywords are project-scoped (one keyword per project)
- ✅ Platform selections are flexible (one keyword, multiple platforms)
- ✅ Stats are denormalized for quick access
- ✅ Integration with existing crawl system

---

## 8. Out of Scope

- ❌ Crawl scheduling per keyword (uses system-level scheduler)
- ❌ Real-time crawling (batch processing only)
- ❌ Keyword suggestions or autocomplete
- ❌ Keyword performance metrics (engagement, reach, etc.)
- ❌ Export keyword results

---

## 9. Future Enhancements

- Keyword groups/categories for better organization
- Keyword performance analytics
- Automated keyword suggestions based on competitor analysis
- Keyword alerts when new content is discovered
- Export discovered content to CSV/Excel

