# Feature TDD: Keyword Spy

> **Domain:** Project Management  
> **Feature ID:** PM-F08  
> **Reference:** [Feature PRD](../../../../1.business-analyst/domains/project-management/features/keyword-spy/feature-prd.md), [Feature SAD](../../../../2.solution-architect/domains/project-management/features/keyword-spy/feature-sad.md)

---

## 1. Module Structure

```text
backend/src/modules/project-management/
├── spy-keywords/
│   ├── spy-keywords.module.ts
│   ├── controllers/
│   │   └── spy-keywords.controller.ts
│   ├── services/
│   │   └── spy-keywords.service.ts
│   ├── dto/
│   │   ├── create-spy-keyword.dto.ts
│   │   ├── update-spy-keyword.dto.ts
│   │   ├── spy-keyword-query.dto.ts
│   │   └── index.ts
│   └── events/
│       └── spy-keyword.events.ts
```

---

## 2. Database Schema

### 2.1. New Models

See detailed schema in `database-schema.md`:

```prisma
enum SpyPlatform {
  META_ADS
  TIKTOK_ADS
  GOOGLE_ADS
  TIKTOK
  INSTAGRAM
  YOUTUBE
  FACEBOOK
  ALL
}

enum SpyKeywordStatus {
  ACTIVE
  PAUSED
  INACTIVE
}

model SpyKeyword {
  id            String         @id @default(uuid())
  projectId     String
  project       Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  text          String
  platforms     SpyPlatform[]
  status        SpyKeywordStatus @default(ACTIVE)
  
  description   String?        @db.Text
  tags          String[]
  
  ads           Ad[]
  videos        Video[]
  socialPosts   SocialPost[]
  
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  lastCrawledAt DateTime?
  
  adsCount      Int            @default(0)
  videosCount   Int            @default(0)
  postsCount    Int            @default(0)
  
  @@unique([projectId, text])
  @@index([projectId])
  @@index([projectId, status])
  @@index([status])
}
```

### 2.2. Updated Models

```prisma
model Ad {
  // ... existing fields ...
  spyKeywordId  String?
  spyKeyword    SpyKeyword? @relation(fields: [spyKeywordId], references: [id], onDelete: SetNull)
  
  @@index([spyKeywordId])
}

model Video {
  // ... existing fields ...
  spyKeywordId  String?
  spyKeyword    SpyKeyword? @relation(fields: [spyKeywordId], references: [id], onDelete: SetNull)
  
  @@index([spyKeywordId])
}

model SocialPost {
  // ... existing fields ...
  spyKeywordId  String?
  spyKeyword    SpyKeyword? @relation(fields: [spyKeywordId], references: [id], onDelete: SetNull)
  
  @@index([spyKeywordId])
}

model Project {
  // ... existing fields ...
  spyKeywords   SpyKeyword[]
}
```

---

## 3. Service Implementation

### 3.1. SpyKeywordsService

```typescript
@Injectable()
export class SpyKeywordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create new spy keyword
   */
  async create(
    projectId: string,
    userId: string,
    dto: CreateSpyKeywordDto,
  ): Promise<SpyKeyword> {
    // Validate project ownership
    await this.validateProjectOwnership(projectId, userId);

    // Check duplicate
    const existing = await this.prisma.spyKeyword.findUnique({
      where: {
        projectId_text: {
          projectId,
          text: dto.text.trim(),
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Spy keyword "${dto.text}" already exists in this project`,
      );
    }

    // Validate platforms
    if (!dto.platforms || dto.platforms.length === 0) {
      throw new BadRequestException('At least one platform must be selected');
    }

    // Create spy keyword
    const spyKeyword = await this.prisma.spyKeyword.create({
      data: {
        projectId,
        text: dto.text.trim(),
        platforms: dto.platforms,
        status: SpyKeywordStatus.ACTIVE,
        description: dto.description?.trim(),
        tags: dto.tags || [],
      },
    });

    // Auto-trigger crawl if enabled
    if (dto.autoCrawl !== false) {
      await this.triggerCrawl(spyKeyword.id, spyKeyword.platforms);
    }

    return spyKeyword;
  }

  /**
   * List spy keywords with filters
   */
  async findAll(
    projectId: string,
    userId: string,
    query: SpyKeywordQueryDto,
  ): Promise<PaginatedResponse<SpyKeyword>> {
    await this.validateProjectOwnership(projectId, userId);

    const where: Prisma.SpyKeywordWhereInput = {
      projectId,
      ...(query.status && { status: query.status }),
      ...(query.platforms && {
        platforms: {
          hasSome: query.platforms,
        },
      }),
      ...(query.search && {
        text: {
          contains: query.search,
          mode: 'insensitive',
        },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.spyKeyword.findMany({
        where,
        skip: query.offset || 0,
        take: query.limit || 20,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.spyKeyword.count({ where }),
    ]);

    return {
      items,
      total,
      limit: query.limit || 20,
      offset: query.offset || 0,
    };
  }

  /**
   * Get spy keyword detail
   */
  async findOne(
    id: string,
    userId: string,
  ): Promise<SpyKeyword & { stats: { ads: number; videos: number; posts: number } }> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            ads: true,
            videos: true,
            socialPosts: true,
          },
        },
      },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${id} not found`);
    }

    await this.validateProjectOwnership(spyKeyword.projectId, userId);

    return {
      ...spyKeyword,
      stats: {
        ads: spyKeyword._count.ads,
        videos: spyKeyword._count.videos,
        posts: spyKeyword._count.socialPosts,
      },
    };
  }

  /**
   * Update spy keyword
   */
  async update(
    id: string,
    userId: string,
    dto: UpdateSpyKeywordDto,
  ): Promise<SpyKeyword> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${id} not found`);
    }

    await this.validateProjectOwnership(spyKeyword.projectId, userId);

    // Update fields
    const updateData: Prisma.SpyKeywordUpdateInput = {};
    if (dto.platforms !== undefined) {
      if (dto.platforms.length === 0) {
        throw new BadRequestException('At least one platform must be selected');
      }
      updateData.platforms = dto.platforms;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description?.trim() || null;
    }
    if (dto.tags !== undefined) {
      updateData.tags = dto.tags;
    }
    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }

    return this.prisma.spyKeyword.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete spy keyword
   */
  async remove(id: string, userId: string): Promise<void> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${id} not found`);
    }

    await this.validateProjectOwnership(spyKeyword.projectId, userId);

    await this.prisma.spyKeyword.delete({
      where: { id },
    });
  }

  /**
   * Trigger manual crawl for spy keyword
   */
  async triggerCrawl(
    spyKeywordId: string,
    platforms?: SpyPlatform[],
    userId?: string,
  ): Promise<void> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id: spyKeywordId },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${spyKeywordId} not found`);
    }

    if (userId) {
      await this.validateProjectOwnership(spyKeyword.projectId, userId);
    }

    if (spyKeyword.status !== SpyKeywordStatus.ACTIVE) {
      throw new BadRequestException('Can only trigger crawl for ACTIVE keywords');
    }

    const platformsToCrawl = platforms || spyKeyword.platforms;

    // Emit crawl event
    this.eventEmitter.emit(SpyKeywordEvents.CRAWL_REQUESTED, {
      projectId: spyKeyword.projectId,
      spyKeywordId: spyKeyword.id,
      keywordText: spyKeyword.text,
      platforms: platformsToCrawl,
    });
  }

  /**
   * Get discovered content for spy keyword
   */
  async getResults(
    id: string,
    userId: string,
    query: {
      contentType?: 'ads' | 'videos' | 'posts' | 'all';
      platform?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<{
    ads: Ad[];
    videos: Video[];
    posts: SocialPost[];
    total: number;
  }> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${id} not found`);
    }

    await this.validateProjectOwnership(spyKeyword.projectId, userId);

    const where = { spyKeywordId: id };

    const [ads, videos, posts] = await Promise.all([
      query.contentType === 'all' || query.contentType === 'ads' || !query.contentType
        ? this.prisma.ad.findMany({
            where: {
              ...where,
              ...(query.platform && { platform: query.platform }),
            },
            take: query.limit || 20,
            skip: query.offset || 0,
            orderBy: { createdAt: 'desc' },
          })
        : [],
      query.contentType === 'all' || query.contentType === 'videos' || !query.contentType
        ? this.prisma.video.findMany({
            where: {
              ...where,
              ...(query.platform && { platform: query.platform }),
            },
            take: query.limit || 20,
            skip: query.offset || 0,
            orderBy: { createdAt: 'desc' },
          })
        : [],
      query.contentType === 'all' || query.contentType === 'posts' || !query.contentType
        ? this.prisma.socialPost.findMany({
            where: {
              ...where,
              ...(query.platform && { platform: query.platform }),
            },
            take: query.limit || 20,
            skip: query.offset || 0,
            orderBy: { createdAt: 'desc' },
          })
        : [],
    ]);

    return {
      ads,
      videos,
      posts,
      total: ads.length + videos.length + posts.length,
    };
  }

  /**
   * Update spy keyword stats (called after crawl)
   */
  async updateStats(spyKeywordId: string): Promise<void> {
    const [adsCount, videosCount, postsCount] = await Promise.all([
      this.prisma.ad.count({ where: { spyKeywordId } }),
      this.prisma.video.count({ where: { spyKeywordId } }),
      this.prisma.socialPost.count({ where: { spyKeywordId } }),
    ]);

    await this.prisma.spyKeyword.update({
      where: { id: spyKeywordId },
      data: {
        adsCount,
        videosCount,
        postsCount,
        lastCrawledAt: new Date(),
      },
    });
  }

  private async validateProjectOwnership(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this project');
    }
  }
}
```

---

## 4. Controller Implementation

### 4.1. SpyKeywordsController

```typescript
@ApiTags('Spy Keywords')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/spy-keywords')
export class SpyKeywordsController {
  constructor(private readonly spyKeywordsService: SpyKeywordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create spy keyword' })
  @ApiResponse({ status: 201, type: SpyKeywordResponse })
  async create(
    @Param('projectId') projectId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSpyKeywordDto,
  ): Promise<SpyKeywordResponse> {
    return this.spyKeywordsService.create(projectId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List spy keywords' })
  @ApiResponse({ status: 200, type: PaginatedSpyKeywordResponse })
  async findAll(
    @Param('projectId') projectId: string,
    @CurrentUser('id') userId: string,
    @Query() query: SpyKeywordQueryDto,
  ): Promise<PaginatedResponse<SpyKeywordResponse>> {
    return this.spyKeywordsService.findAll(projectId, userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get spy keyword detail' })
  @ApiResponse({ status: 200, type: SpyKeywordDetailResponse })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<SpyKeywordDetailResponse> {
    return this.spyKeywordsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update spy keyword' })
  @ApiResponse({ status: 200, type: SpyKeywordResponse })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateSpyKeywordDto,
  ): Promise<SpyKeywordResponse> {
    return this.spyKeywordsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete spy keyword' })
  @ApiResponse({ status: 204 })
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    return this.spyKeywordsService.remove(id, userId);
  }

  @Post(':id/crawl')
  @ApiOperation({ summary: 'Trigger manual crawl for spy keyword' })
  @ApiResponse({ status: 200, type: { message: string } })
  async triggerCrawl(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: { platforms?: SpyPlatform[] },
  ): Promise<{ message: string }> {
    await this.spyKeywordsService.triggerCrawl(id, dto.platforms, userId);
    return { message: 'Crawl triggered successfully' };
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get discovered content for spy keyword' })
  @ApiResponse({ status: 200 })
  async getResults(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Query() query: {
      contentType?: 'ads' | 'videos' | 'posts' | 'all';
      platform?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    return this.spyKeywordsService.getResults(id, userId, query);
  }
}
```

---

## 5. DTOs

### 5.1. CreateSpyKeywordDto

```typescript
export class CreateSpyKeywordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  text: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SpyPlatform, { each: true })
  platforms: SpyPlatform[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  autoCrawl?: boolean;
}
```

### 5.2. UpdateSpyKeywordDto

```typescript
export class UpdateSpyKeywordDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SpyPlatform, { each: true })
  platforms?: SpyPlatform[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(SpyKeywordStatus)
  status?: SpyKeywordStatus;
}
```

### 5.3. SpyKeywordQueryDto

```typescript
export class SpyKeywordQueryDto {
  @IsOptional()
  @IsEnum(SpyKeywordStatus)
  status?: SpyKeywordStatus;

  @IsOptional()
  @IsArray()
  @IsEnum(SpyPlatform, { each: true })
  platforms?: SpyPlatform[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
```

---

## 6. Events

### 6.1. SpyKeywordEvents

```typescript
export const SpyKeywordEvents = {
  CRAWL_REQUESTED: 'spy-keyword.crawl.requested',
  CREATED: 'spy-keyword.created',
  UPDATED: 'spy-keyword.updated',
  DELETED: 'spy-keyword.deleted',
} as const;

export interface SpyKeywordCrawlRequestedPayload {
  projectId: string;
  spyKeywordId: string;
  keywordText: string;
  platforms: SpyPlatform[];
}
```

---

## 7. Integration with Data Collection

### 7.1. AdsLibraryProcessor Updates

```typescript
// In AdsLibraryProcessor
async processAdsLibraryCrawl(job: Job<AdsLibraryCrawlJobData>) {
  const { projectId, spyKeywordId, platform } = job.data;

  // Fetch spy keywords (if spyKeywordId provided, use specific one; otherwise all active)
  const spyKeywords = await this.prisma.spyKeyword.findMany({
    where: {
      projectId,
      status: SpyKeywordStatus.ACTIVE,
      ...(spyKeywordId && { id: spyKeywordId }),
      ...(platform && {
        platforms: {
          has: this.mapAdPlatformToSpyPlatform(platform),
        },
      }),
    },
  });

  if (spyKeywords.length === 0) {
    this.logger.warn(`No active spy keywords found for project: ${projectId}`);
    return { success: true, itemsProcessed: 0 };
  }

  let totalAdsProcessed = 0;

  for (const spyKeyword of spyKeywords) {
    const platformsToCrawl = this.getPlatformsToCrawl(spyKeyword.platforms, platform);

    for (const crawlPlatform of platformsToCrawl) {
      if (crawlPlatform === SpyPlatform.META_ADS) {
        const count = await this.crawlMetaAds(
          projectId,
          spyKeyword.id, // Use spyKeywordId instead of keywordId
          spyKeyword.text,
        );
        totalAdsProcessed += count;
      } else if (crawlPlatform === SpyPlatform.TIKTOK_ADS) {
        const count = await this.crawlTikTokAds(
          projectId,
          spyKeyword.id,
          spyKeyword.text,
        );
        totalAdsProcessed += count;
      }
      // ... other platforms
    }

    // Update stats
    await this.updateSpyKeywordStats(spyKeyword.id);
  }

  return { success: true, itemsProcessed: totalAdsProcessed };
}

private async crawlMetaAds(
  projectId: string,
  spyKeywordId: string, // Changed from keywordId
  keywordText: string,
): Promise<number> {
  // ... crawl logic ...
  
  // Save ad with spyKeywordId
  await this.saveMetaAd(projectId, spyKeywordId, ad);
  
  // ... rest of logic ...
}

private async saveMetaAd(
  projectId: string,
  spyKeywordId: string, // Changed from keywordId
  ad: SearchAPIMetaAd,
): Promise<boolean> {
  // ... extract ad data ...
  
  await this.prisma.ad.create({
    data: {
      projectId,
      spyKeywordId, // Link to spy keyword
      // ... other fields ...
    },
  });
  
  // Update spy keyword stats (increment counter)
  // Stats will be updated in batch after crawl completes
}
```

---

## 8. Module Registration

```typescript
// project-management.module.ts
@Module({
  imports: [PrismaModule, EventEmitterModule],
  controllers: [
    ProjectsController,
    CompetitorsController,
    SpyKeywordsController, // Add new controller
  ],
  providers: [
    ProjectsService,
    CompetitorsService,
    SpyKeywordsService, // Add new service
  ],
  exports: [SpyKeywordsService],
})
export class ProjectManagementModule {}
```

---

## 9. Error Handling

- **Duplicate Keyword:** `ConflictException` (409)
- **Invalid Platform:** `BadRequestException` (400)
- **Keyword Not Found:** `NotFoundException` (404)
- **Permission Denied:** `ForbiddenException` (403)
- **Invalid Status:** `BadRequestException` (400)

---

## 10. Testing Considerations

### 10.1. Unit Tests
- Service methods (create, update, delete, findAll, findOne)
- Validation logic
- Permission checks
- Event emission

### 10.2. Integration Tests
- API endpoints
- Database operations
- Event handling
- Stats updates

### 10.3. E2E Tests
- Complete workflow: Create → Crawl → View Results
- Permission scenarios
- Error scenarios

