# Feature SAD: Keyword Spy

> **Domain:** Project Management  
> **Feature ID:** PM-F08  
> **Reference:** [Feature PRD](../../../../1.business-analyst/domains/project-management/features/keyword-spy/feature-prd.md)

---

## 1. Architecture Overview

**Keyword Spy** introduces a new keyword management system separate from ASO Keywords. It allows users to define keywords for monitoring competitors across multiple platforms (Ads Libraries, Social Media) and integrates with the Data Collection domain to trigger crawls.

**Architecture Pattern:** RESTful API with event-driven integration

---

## 2. Component Design

### 2.1. Backend Components

**New Module:** `spy-keywords` module
- `SpyKeywordService` - Business logic for CRUD operations
- `SpyKeywordController` - REST API endpoints
- `SpyKeywordDto` - Data transfer objects

**Integration Points:**
- Emits `spy-keyword.crawl.requested` event to trigger crawls
- Uses existing PrismaService for database operations

### 2.2. Frontend Components

**New Feature:** `keyword-spy` feature
- `SpyKeywordsPage` - Main management page
- `CreateSpyKeywordModal` - Add keyword form
- `SpyKeywordCard` - Keyword list item with stats
- `SpyKeywordDetailModal` - View keyword details and results
- `SpyKeywordFilters` - Filter panel

---

## 3. Data Model

### 3.1. New Database Model

**SpyKeyword Model:**
- `id` - UUID primary key
- `projectId` - Foreign key to Project
- `text` - Keyword text (unique per project)
- `platforms` - Array of SpyPlatform enum values
- `status` - SpyKeywordStatus enum (ACTIVE, PAUSED, INACTIVE)
- `description` - Optional description
- `tags` - Array of strings
- `createdAt`, `updatedAt` - Timestamps
- `lastCrawledAt` - Last crawl timestamp
- `adsCount`, `videosCount`, `postsCount` - Denormalized stats

**New Enums:**
- `SpyPlatform`: META_ADS, TIKTOK_ADS, GOOGLE_ADS, TIKTOK, INSTAGRAM, YOUTUBE, FACEBOOK, ALL
- `SpyKeywordStatus`: ACTIVE, PAUSED, INACTIVE

### 3.2. Updated Models

**Ad, Video, SocialPost:**
- Add `spyKeywordId` foreign key (nullable)
- Add relation to SpyKeyword

**Project:**
- Add `spyKeywords` relation (one-to-many)

---

## 4. API Design

### 4.1. REST Endpoints

```
GET    /api/projects/:projectId/spy-keywords          # List spy keywords
POST   /api/projects/:projectId/spy-keywords          # Create spy keyword
GET    /api/projects/:projectId/spy-keywords/:id      # Get spy keyword detail
PATCH  /api/projects/:projectId/spy-keywords/:id      # Update spy keyword
DELETE /api/projects/:projectId/spy-keywords/:id      # Delete spy keyword
POST   /api/projects/:projectId/spy-keywords/:id/crawl # Trigger manual crawl
GET    /api/projects/:projectId/spy-keywords/:id/results # Get discovered content
```

### 4.2. Request/Response DTOs

**CreateSpyKeywordDto:**
```typescript
{
  text: string;
  platforms: SpyPlatform[];
  description?: string;
  tags?: string[];
  autoCrawl?: boolean;
}
```

**UpdateSpyKeywordDto:**
```typescript
{
  platforms?: SpyPlatform[];
  description?: string;
  tags?: string[];
  status?: SpyKeywordStatus;
}
```

**SpyKeywordResponse:**
```typescript
{
  id: string;
  projectId: string;
  text: string;
  platforms: SpyPlatform[];
  status: SpyKeywordStatus;
  description?: string;
  tags: string[];
  adsCount: number;
  videosCount: number;
  postsCount: number;
  lastCrawledAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Integration Design

### 5.1. Event-Driven Integration

**Event:** `spy-keyword.crawl.requested`
- **Emitter:** SpyKeywordService (when manual crawl triggered or auto-crawl enabled)
- **Payload:**
```typescript
{
  projectId: string;
  spyKeywordId: string;
  keywordText: string;
  platforms: SpyPlatform[];
}
```
- **Consumer:** AdsLibraryProcessor, SocialContentProcessor
- **Action:** Processors use spy keyword text to crawl specified platforms

### 5.2. Data Collection Integration

**AdsLibraryProcessor Changes:**
- Accept `spyKeywordId` in crawl job data
- Use SpyKeyword.text for search queries
- Filter platforms based on SpyKeyword.platforms
- Link discovered ads with `spyKeywordId`
- Update SpyKeyword.stats after crawl

**SocialContentProcessor Changes:**
- Support spy keyword-based searches for organic content
- Link discovered videos/posts with `spyKeywordId`
- Update SpyKeyword.stats

---

## 6. Data Flow

### 6.1. Create Spy Keyword Flow

```
User → POST /api/projects/:id/spy-keywords
  → SpyKeywordController.create()
  → SpyKeywordService.create()
  → Prisma: Create SpyKeyword
  → If autoCrawl: Emit 'spy-keyword.crawl.requested'
  → Return SpyKeywordResponse
```

### 6.2. Crawl Trigger Flow

```
User → POST /api/projects/:id/spy-keywords/:id/crawl
  → SpyKeywordController.triggerCrawl()
  → SpyKeywordService.triggerCrawl()
  → Emit 'spy-keyword.crawl.requested' event
  → AdsLibraryProcessor/SocialContentProcessor consumes event
  → Crawls specified platforms using keyword text
  → Saves discovered content with spyKeywordId
  → Updates SpyKeyword.stats
```

### 6.3. View Results Flow

```
User → GET /api/projects/:id/spy-keywords/:id/results
  → SpyKeywordController.getResults()
  → SpyKeywordService.getResults()
  → Query Ad/Video/SocialPost where spyKeywordId matches
  → Return paginated results
```

---

## 7. Security & Permissions

- **Authorization:** User must own the project (project.userId === currentUser.id)
- **Validation:** Validate keyword text (non-empty, reasonable length)
- **Platform Validation:** Ensure at least one platform selected
- **Duplicate Check:** Prevent duplicate keyword text in same project

---

## 8. Error Handling

- **Duplicate Keyword:** Return 409 Conflict
- **Invalid Platform:** Return 400 Bad Request
- **Keyword Not Found:** Return 404 Not Found
- **Permission Denied:** Return 403 Forbidden
- **Crawl Failure:** Log error, don't fail keyword creation

---

## 9. Performance Considerations

- **Stats Denormalization:** adsCount, videosCount, postsCount are stored (not calculated) for quick access
- **Indexing:** Index on projectId, status, platforms for efficient queries
- **Pagination:** All list endpoints support pagination
- **Batch Updates:** Stats updated in batch after crawl completes

---

## 10. Migration Strategy

1. Create SpyKeyword model with migrations
2. Add spyKeywordId to Ad, Video, SocialPost models
3. Update AdsLibraryProcessor to support spy keywords
4. Deploy backend changes
5. Deploy frontend UI
6. Migrate existing data (if needed)

