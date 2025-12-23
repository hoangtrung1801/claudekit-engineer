# Admin Feature TDD: Keyword Spy Management

> **Domain:** Admin  
> **Feature ID:** AD-F07  
> **Reference:** [Admin PRD](../../../../1.business-analyst/domains/admin/domain-prd.md#fr39-keyword-spy-management-admin)

---

## 1. Service Implementation

### 1.1. Spy Keywords Admin Service

```typescript
@Injectable()
export class SpyKeywordsAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * List all spy keywords across all projects (admin view)
   */
  async findAll(query: {
    projectId?: string;
    platforms?: SpyPlatform[];
    status?: SpyKeywordStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<SpyKeyword>> {
    const where: Prisma.SpyKeywordWhereInput = {
      ...(query.projectId && { projectId: query.projectId }),
      ...(query.platforms && {
        platforms: {
          hasSome: query.platforms,
        },
      }),
      ...(query.status && { status: query.status }),
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
        include: {
          project: {
            select: {
              id: true,
              name: true,
              user: { select: { id: true, email: true } },
            },
          },
          _count: {
            select: {
              ads: true,
              videos: true,
              socialPosts: true,
            },
          },
        },
        skip: query.offset || 0,
        take: query.limit || 50,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.spyKeyword.count({ where }),
    ]);

    return {
      items,
      total,
      limit: query.limit || 50,
      offset: query.offset || 0,
    };
  }

  /**
   * Get spy keyword detail (admin view)
   */
  async findOne(id: string): Promise<SpyKeyword & { stats: any }> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            user: { select: { id: true, email: true } },
          },
        },
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
   * Create spy keyword for any project (admin)
   */
  async create(dto: CreateSpyKeywordDto): Promise<SpyKeyword> {
    // Validate project exists
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    // Check duplicate
    const existing = await this.prisma.spyKeyword.findUnique({
      where: {
        projectId_text: {
          projectId: dto.projectId,
          text: dto.text.trim(),
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Spy keyword "${dto.text}" already exists in this project`,
      );
    }

    // Create spy keyword
    const spyKeyword = await this.prisma.spyKeyword.create({
      data: {
        projectId: dto.projectId,
        text: dto.text.trim(),
        platforms: dto.platforms,
        status: dto.status || SpyKeywordStatus.ACTIVE,
        description: dto.description?.trim(),
        tags: dto.tags || [],
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            user: { select: { id: true, email: true } },
          },
        },
      },
    });

    // Auto-trigger crawl if enabled
    if (dto.autoCrawl !== false) {
      this.eventEmitter.emit(SpyKeywordEvents.CRAWL_REQUESTED, {
        projectId: spyKeyword.projectId,
        spyKeywordId: spyKeyword.id,
        keywordText: spyKeyword.text,
        platforms: spyKeyword.platforms,
      });
    }

    return spyKeyword;
  }

  /**
   * Update spy keyword (admin)
   */
  async update(id: string, dto: UpdateSpyKeywordDto): Promise<SpyKeyword> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${id} not found`);
    }

    const updateData: Prisma.SpyKeywordUpdateInput = {};
    if (dto.platforms !== undefined) {
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
      include: {
        project: {
          select: {
            id: true,
            name: true,
            user: { select: { id: true, email: true } },
          },
        },
      },
    });
  }

  /**
   * Delete spy keyword (admin)
   */
  async remove(id: string): Promise<void> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${id} not found`);
    }

    await this.prisma.spyKeyword.delete({
      where: { id },
    });
  }

  /**
   * Trigger crawl for spy keyword (admin)
   */
  async triggerCrawl(id: string, platforms?: SpyPlatform[]): Promise<void> {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${id} not found`);
    }

    if (spyKeyword.status !== SpyKeywordStatus.ACTIVE) {
      throw new BadRequestException('Can only trigger crawl for ACTIVE keywords');
    }

    const platformsToCrawl = platforms || spyKeyword.platforms;

    this.eventEmitter.emit(SpyKeywordEvents.CRAWL_REQUESTED, {
      projectId: spyKeyword.projectId,
      spyKeywordId: spyKeyword.id,
      keywordText: spyKeyword.text,
      platforms: platformsToCrawl,
    });
  }

  /**
   * Get discovered content for spy keyword (admin)
   */
  async getResults(
    id: string,
    query: {
      contentType?: 'ads' | 'videos' | 'posts' | 'all';
      platform?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const spyKeyword = await this.prisma.spyKeyword.findUnique({
      where: { id },
    });

    if (!spyKeyword) {
      throw new NotFoundException(`Spy keyword with ID ${id} not found`);
    }

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
}
```

---

## 2. Controller Implementation

```typescript
@ApiTags('Admin - Keyword Spy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('admin/spy-keywords')
export class SpyKeywordsAdminController {
  constructor(
    private readonly spyKeywordsAdminService: SpyKeywordsAdminService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all spy keywords (admin)' })
  async findAll(@Query() query: SpyKeywordAdminQueryDto) {
    return this.spyKeywordsAdminService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get spy keyword detail (admin)' })
  async findOne(@Param('id') id: string) {
    return this.spyKeywordsAdminService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create spy keyword for any project (admin)' })
  async create(@Body() dto: CreateSpyKeywordAdminDto) {
    return this.spyKeywordsAdminService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update spy keyword (admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateSpyKeywordDto) {
    return this.spyKeywordsAdminService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete spy keyword (admin)' })
  async remove(@Param('id') id: string) {
    return this.spyKeywordsAdminService.remove(id);
  }

  @Post(':id/crawl')
  @ApiOperation({ summary: 'Trigger crawl for spy keyword (admin)' })
  async triggerCrawl(
    @Param('id') id: string,
    @Body() dto?: { platforms?: SpyPlatform[] },
  ) {
    await this.spyKeywordsAdminService.triggerCrawl(id, dto?.platforms);
    return { message: 'Crawl triggered successfully' };
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get discovered content for spy keyword (admin)' })
  async getResults(@Param('id') id: string, @Query() query: any) {
    return this.spyKeywordsAdminService.getResults(id, query);
  }
}
```

---

## 3. DTOs

### CreateSpyKeywordAdminDto

```typescript
export class CreateSpyKeywordAdminDto {
  @IsString()
  @IsUUID()
  projectId: string; // Admin can specify any project

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
  @IsEnum(SpyKeywordStatus)
  status?: SpyKeywordStatus;

  @IsOptional()
  @IsBoolean()
  autoCrawl?: boolean;
}
```

### SpyKeywordAdminQueryDto

```typescript
export class SpyKeywordAdminQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(SpyPlatform, { each: true })
  platforms?: SpyPlatform[];

  @IsOptional()
  @IsEnum(SpyKeywordStatus)
  status?: SpyKeywordStatus;

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

## 4. Module Registration

```typescript
// admin.module.ts
@Module({
  imports: [PrismaModule, EventEmitterModule],
  controllers: [
    // ... existing controllers
    SpyKeywordsAdminController,
  ],
  providers: [
    // ... existing providers
    SpyKeywordsAdminService,
  ],
  exports: [SpyKeywordsAdminService],
})
export class AdminModule {}
```

