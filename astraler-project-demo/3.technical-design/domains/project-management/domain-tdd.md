# Domain TDD: Project Management

## 1. Module Structure
```text
src/modules/project-management/
├── dto/
│   ├── create-project.dto.ts
│   ├── update-project.dto.ts
│   ├── add-competitor.dto.ts
│   ├── add-landing-page.dto.ts
│   └── add-social-channel.dto.ts
├── entities/
│   ├── project.entity.ts (Prisma Type)
│   ├── competitor.entity.ts
│   └── social-channel.entity.ts
├── project.controller.ts
├── competitor.controller.ts
├── project.service.ts
├── competitor.service.ts
├── social-channel.service.ts
└── project.module.ts
```

## 2. Database Models (Reference)
See Master Schema in `database-schema.md` for full definitions:
- `Project` — user's app being analyzed (with metadata, screenshots, updates)
  - **New Fields**: `status` (ProjectStatus enum), `iosStoreUrl`, `androidStoreUrl`
- `Competitor` — tracked competitor apps
- `SocialChannel` — competitor's social media profiles (TikTok, YouTube, Instagram, Facebook, X)
- `LandingPage` — competitor landing pages for social discovery
- `ProjectScreenshot`, `ProjectUpdate` — project app metadata (populated by Project Info crawler)

```prisma
model Competitor {
  id              String          @id @default(uuid())
  projectId       String
  project         Project         @relation(fields: [projectId], references: [id])
  name            String
  storeUrl        String
  iconUrl         String

  // Normalized metadata aligned with Store/Project Info crawlers
  developerName     String?
  developerWebsite  String?
  storeCategory     String?
  description       String?   @db.Text
  rating            Float?
  ratingsCount      Int?
  bundleId          String?

  landingPages      LandingPage[]
  socialChannels    SocialChannel[]
  reviews           Review[]
  appUpdates        AppUpdate[]

  @@unique([projectId, storeUrl])
}

model SocialChannel {
  id           String         @id @default(uuid())

  /// Optional owner competitor. When null, this represents either:
  /// - An independent advertiser/brand channel not yet mapped to a specific Competitor, OR
  /// - A social channel owned by the Project itself (Internal project social management)
  competitorId String?
  competitor   Competitor?    @relation(fields: [competitorId], references: [id], onDelete: SetNull)
  
  /// Optional direct link to Project (for Internal project social management).
  /// When set, this represents a social channel owned/managed by the project's marketing team.
  /// Mutually exclusive with competitorId: a channel is either linked to a Competitor OR directly to a Project.
  projectId    String?
  project      Project?       @relation("ProjectSocialChannels", fields: [projectId], references: [id], onDelete: Cascade)

  platform     SocialPlatform // TIKTOK, YOUTUBE, INSTAGRAM, FACEBOOK, X

  /// Primary external reference ID (ref_social_id) used to call 3rd-party APIs.
  /// Examples:
  /// - Meta / Facebook Page: page_id / profile_id
  /// - TikTok: user_id
  /// - YouTube: channel_id
  platformId   String

  /// Human-readable handle (e.g. @username) when available.
  handle       String?

  /// Social name / display name shown in UI (required when user adds channel manually).
  displayName  String

  /// Canonical public URL to the profile/page (required when user adds channel manually).
  profileUrl   String

  avatarUrl    String?
  bio          String?        @db.Text
  isVerified   Boolean        @default(false)

  /// Optional advertiser identifier used by Ads Transparency / Ads Library APIs.
  advertiserId String?

  /// How this channel was discovered/created.
  discoverySource SocialDiscoverySource @default(MANUAL)

  createdAt    DateTime       @default(now())

  @@unique([platform, platformId])
  @@index([projectId])
  @@index([projectId, platform])
}

enum SocialDiscoverySource {
  MANUAL
  LANDING_PAGE
  ADS_LIBRARY
  IMPORT
}
```

## 3. DTOs
```typescript
enum ProjectStatus {
  PRE_LAUNCH = 'PRE_LAUNCH',
  LIVE = 'LIVE'
}

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  // IMPORTANT: Project uses separate iosStoreUrl and androidStoreUrl (not generic storeUrl)
  // This provides clear platform distinction for Project Info crawling
  @ValidateIf((o) => o.status === ProjectStatus.LIVE)
  @IsUrl()
  @Matches(/apps\.apple\.com/, { message: 'iOS Store URL must be from apps.apple.com' })
  iosStoreUrl?: string;  // Required when status = LIVE

  @IsOptional()
  @IsUrl()
  @Matches(/play\.google\.com/, { message: 'Android Store URL must be from play.google.com' })
  androidStoreUrl?: string;  // Optional (Android support planned for future)

  @IsOptional()
  @IsString()
  region?: string;
}

export class AddLandingPageDto {
  @IsUrl()
  url: string;
}

export class AddSocialChannelDto {
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  // Canonical profile URL (required)
  @IsString()
  profileUrl: string;

  // Optional @handle for display & discovery
  @IsOptional()
  @IsString()
  handle?: string;

  // Required social name / display name when user adds channel manually
  @IsString()
  displayName: string;

  // Optional advertiser identifier used by Ads Library / Ads Transparency APIs
  @IsOptional()
  @IsString()
  advertiserId?: string;
}
```

## 4. Service Logic

### `project.service.ts`
```typescript
@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  // ✅ Unified API Pattern: Accept user object, guard handles access control
  async findAll(user: User, query: ProjectQueryDto) {
    const { search, category, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Guard already validated access
    // For list endpoint, filter by userId unless admin (admin sees all in list)
    const where: any = {
      ...(user.role !== Role.ADMIN && { userId: user.id }), // Only filter by userId if not admin
      ...(search && {
        name: { contains: search, mode: 'insensitive' as const },
      }),
      ...(category && { category }),
    };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              competitors: true,
              keywords: true,
            },
          },
          ...(user.role === Role.ADMIN && {
            user: { select: { id: true, email: true } }, // Include owner info for admin
          }),
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects.map(this.formatProjectResponse),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ✅ Unified API Pattern: Accept user object, guard handles access control
  async create(dto: CreateProjectDto, user: User, targetUserId?: string) {
    // Validate iOS URL requirement for Live projects
    if (dto.status === ProjectStatus.LIVE && !dto.iosStoreUrl) {
      throw new BadRequestException('iOS Store URL is required for Live projects');
    }

    // Admin can create project for any user, regular users can only create for themselves
    const projectOwnerId = user.role === Role.ADMIN && targetUserId ? targetUserId : user.id;

    // Create project
    const project = await this.prisma.project.create({
      data: {
        userId: projectOwnerId,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        status: dto.status,
        iosStoreUrl: dto.iosStoreUrl,
        androidStoreUrl: dto.androidStoreUrl,
        region: dto.region || 'US',
      },
    });

    // If Live project with iOS URL, trigger Project Info crawl
    if (dto.status === ProjectStatus.LIVE && dto.iosStoreUrl) {
      this.eventEmitter.emit('project-info.requested', {
        projectId: project.id,
        iosStoreUrl: dto.iosStoreUrl,
      });
    }

    return project;
  }

  // ✅ Unified API Pattern: Guard handles access control
  async update(projectId: string, dto: UpdateProjectDto, user: User) {
    // Guard already validated access (admin can update any, user can update own)

    // If status changed to Live or iOS URL added/updated, trigger crawl
    const existing = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    const shouldTriggerCrawl =
      (dto.status === ProjectStatus.LIVE && dto.iosStoreUrl) ||
      (existing?.status === ProjectStatus.LIVE &&
        (dto.status === ProjectStatus.LIVE || dto.iosStoreUrl));

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...dto,
        ...(dto.status === ProjectStatus.LIVE && !dto.iosStoreUrl
          ? { iosStoreUrl: null }
          : {}),
      },
    });

    if (shouldTriggerCrawl && project.iosStoreUrl) {
      this.eventEmitter.emit('project-info.requested', {
        projectId: project.id,
        iosStoreUrl: project.iosStoreUrl,
      });
    }

    return project;
  }

  async addLandingPage(competitorId: string, url: string) {
    const lp = await this.prisma.landingPage.create({
      data: { competitorId, url }
    });

    this.eventEmitter.emit('landing-page.added', {
      landingPageId: lp.id,
      url: lp.url,
      competitorId: competitorId
    });

    return lp;
  }

  async getLandingPages(competitorId: string) {
    return this.prisma.landingPage.findMany({
      where: { competitorId },
      include: {
        competitor: {
          select: { id: true, name: true, iconUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getProjectLandingPages(projectId: string) {
    return this.prisma.landingPage.findMany({
      where: {
        competitor: { projectId }
      },
      include: {
        competitor: {
          select: { id: true, name: true, iconUrl: true, storeUrl: true }
        }
      },
      orderBy: [
        { competitor: { name: 'asc' } },
        { createdAt: 'desc' }
      ]
    });
  }

  // ✅ Unified API Pattern: Guard handles access control
  async remove(id: string, user: User) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Guard already validated access (admin can delete any, user can delete own)

    await this.prisma.project.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully' };
  }

  // ⚠️ DEPRECATED: Ownership validation is now handled by ProjectAccessGuard
  // This method is kept for backward compatibility but should not be used in new code
  // Guard validates access before service methods are called

  async removeLandingPage(landingPageId: string) {
    return this.prisma.landingPage.delete({
      where: { id: landingPageId }
    });
  }
}
```

### `social-channel.service.ts`
```typescript
@Injectable()
export class SocialChannelService {
  constructor(private prisma: PrismaService, private eventEmitter: EventEmitter2) {}

  async addSocialChannel(competitorId: string, dto: AddSocialChannelDto) {
    // 1. Extract platform ID (ref_social_id) from URL
    const platformId = this.extractPlatformId(dto.platform, dto.profileUrl);

    // 2. Check if already exists
    const existing = await this.prisma.socialChannel.findUnique({
      where: { platform_platformId: { platform: dto.platform, platformId } }
    });

    if (existing) {
      throw new ConflictException('Social channel already tracked');
    }

    // 3. Create channel record linked to Competitor (not Project)
    // Business constraint: projectId must be null when competitorId is set
    const channel = await this.prisma.socialChannel.create({
      data: {
        competitorId,
        projectId: null,  // Not linked to project (enforce constraint)
        platform: dto.platform,
        platformId,
        handle: dto.handle,
        displayName: dto.displayName,
        profileUrl: dto.profileUrl,
        advertiserId: dto.advertiserId,
        discoverySource: 'MANUAL'
      }
    });

    // 4. Emit event to trigger crawl
    this.eventEmitter.emit('social-channel.added', {
      socialChannelId: channel.id,
      competitorId
    });

    return channel;
  }

  async getCompetitorChannels(competitorId: string) {
    return this.prisma.socialChannel.findMany({
      where: { competitorId },
      include: {
        snapshots: { orderBy: { capturedAt: 'desc' }, take: 1 }
      }
    });
  }
  
  /**
   * Add social channel to Internal project (not linked to competitor)
   * For marketing team to track their own social channels
   */
  async addProjectSocialChannel(projectId: string, dto: AddSocialChannelDto) {
    // 1. Validate project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    
    // 2. Extract platform ID (ref_social_id) from URL
    const platformId = this.extractPlatformId(dto.platform, dto.profileUrl);
    
    // 3. Check if already exists (either linked to project or competitor)
    const existing = await this.prisma.socialChannel.findUnique({
      where: { platform_platformId: { platform: dto.platform, platformId } }
    });
    
    if (existing) {
      throw new ConflictException('Social channel already tracked');
    }
    
    // 4. Create channel record linked to Project (not Competitor)
    // Business constraint: competitorId must be null when projectId is set
    const channel = await this.prisma.socialChannel.create({
      data: {
        projectId,  // Link directly to Project
        competitorId: null,  // Not linked to competitor (enforce constraint)
        platform: dto.platform,
        platformId,
        handle: dto.handle,
        displayName: dto.displayName,
        profileUrl: dto.profileUrl,
        advertiserId: dto.advertiserId,
        discoverySource: 'MANUAL'
      }
    });
    
    // 4. Emit event to trigger crawl
    this.eventEmitter.emit('social-channel.added', {
      socialChannelId: channel.id,
      projectId  // Include projectId for project-linked channels
    });
    
    return channel;
  }
  
  /**
   * List all social channels for a project (both competitor-linked and project-linked)
   */
  async getProjectSocialChannels(projectId: string) {
    return this.prisma.socialChannel.findMany({
      where: {
        OR: [
          { projectId },  // Direct project-linked channels
          { competitor: { projectId } }  // Competitor-linked channels in this project
        ]
      },
      include: {
        snapshots: { orderBy: { capturedAt: 'desc' }, take: 1 },
        competitor: {
          select: { id: true, name: true, iconUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  /**
   * Delete social channel (Admin only)
   * Regular users cannot delete social channels
   */
  async deleteSocialChannel(channelId: string, user: User) {
    // Check if user is admin
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can delete social channels');
    }
    
    const channel = await this.prisma.socialChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!channel) {
      throw new NotFoundException('Social channel not found');
    }
    
    await this.prisma.socialChannel.delete({
      where: { id: channelId }
    });
    
    return { message: 'Social channel deleted successfully' };
  }
  
  /**
   * Trigger manual refresh of social stats for a channel
   */
  async refreshSocialChannelStats(channelId: string) {
    const channel = await this.prisma.socialChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!channel) {
      throw new NotFoundException('Social channel not found');
    }
    
    // Emit event to trigger immediate crawl
    this.eventEmitter.emit('social-channel.added', {
      socialChannelId: channel.id,
      ...(channel.projectId && { projectId: channel.projectId }),
      ...(channel.competitorId && { competitorId: channel.competitorId })
    });
    
    return { message: 'Social stats refresh triggered' };
  }

  private extractPlatformId(platform: SocialPlatform, url: string): string {
    // Platform-specific URL parsing logic
    const patterns = {
      TIKTOK: /tiktok\.com\/@?([^\/\?]+)/,
      YOUTUBE: /youtube\.com\/(channel\/|@|c\/)?([^\/\?]+)/,
      INSTAGRAM: /instagram\.com\/([^\/\?]+)/,
      FACEBOOK: /facebook\.com\/([^\/\?]+)/,
      X: /(?:twitter|x)\.com\/([^\/\?]+)/
    };

    const match = url.match(patterns[platform]);
    if (!match) throw new BadRequestException('Invalid profile URL for platform');

    return match[platform === 'YOUTUBE' ? 2 : 1];
  }
}
```

## 5. Controller

> **✅ Unified API Pattern:** All controllers use `ProjectAccessGuard` for role-based access control. Guards validate access before service methods are called.

```typescript
@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Create doesn't need project access guard (no projectId in URL)
  async create(
    @CurrentUser() user: User, // ✅ Pass full user object
    @Body() dto: CreateProjectDto,
    @Body('targetUserId') targetUserId?: string, // Optional: Admin can specify target user
  ) {
    return this.projectService.create(dto, user, targetUserId);
  }

  @Get()
  @UseGuards(JwtAuthGuard) // List doesn't need project access guard (no projectId in URL)
  async findAll(
    @CurrentUser() user: User, // ✅ Pass full user object
    @Query() query: ProjectQueryDto,
  ) {
    return this.projectService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard) // ✅ Unified guard handles access control
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User, // ✅ Pass full user object
  ) {
    return this.projectService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard) // ✅ Unified guard handles access control
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User, // ✅ Pass full user object
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard) // ✅ Unified guard handles access control
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User, // ✅ Pass full user object
  ) {
    return this.projectService.remove(id, user);
  }

  @Post(':id/keywords')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard) // ✅ Unified guard handles access control
  async addKeyword(
    @Param('id') projectId: string,
    @CurrentUser() user: User, // ✅ Pass full user object
    @Body('text') text: string,
  ) {
    // Guard already validated project access
    return this.keywordsService.add(projectId, text);
  }

  @Get(':id/keywords')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard) // ✅ Unified guard handles access control
  async getKeywords(
    @Param('id') projectId: string,
    @CurrentUser() user: User, // ✅ Pass full user object
  ) {
    // Guard already validated project access
    return this.keywordsService.findByProject(projectId);
  }

  @Delete(':id/keywords/:keywordId')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard) // ✅ Unified guard handles access control
  async removeKeyword(
    @Param('id') projectId: string,
    @Param('keywordId') keywordId: string,
    @CurrentUser() user: User, // ✅ Pass full user object
  ) {
    // Guard already validated project access
    return this.keywordsService.remove(keywordId, projectId);
  }
}

@Controller('projects/:projectId/competitors/:competitorId')
@UseGuards(JwtAuthGuard, ProjectAccessGuard) // ✅ Unified guard validates project access
export class CompetitorController {
  constructor(
    private projectService: ProjectService,
    private socialChannelService: SocialChannelService
  ) {}

  @Post('landing-pages')
  async addLandingPage(
    @Param('competitorId') competitorId: string,
    @CurrentUser() user: User, // ✅ Pass full user object
    @Body() dto: AddLandingPageDto
  ) {
    // Guard already validated project access
    return this.projectService.addLandingPage(competitorId, dto.url);
  }

  @Post('social-channels')
  async addSocialChannel(
    @Param('competitorId') competitorId: string,
    @CurrentUser() user: User, // ✅ Pass full user object
    @Body() dto: AddSocialChannelDto
  ) {
    // Guard already validated project access
    return this.socialChannelService.addSocialChannel(competitorId, dto);
  }

  @Get('social-channels')
  async getSocialChannels(
    @Param('competitorId') competitorId: string,
    @CurrentUser() user: User, // ✅ Pass full user object
  ) {
    // Guard already validated project access
    return this.socialChannelService.getCompetitorChannels(competitorId);
  }

  @Get('landing-pages')
  async getLandingPages(
    @Param('competitorId') competitorId: string,
    @CurrentUser() user: User, // ✅ Pass full user object
  ) {
    // Guard already validated project access
    return this.projectService.getLandingPages(competitorId);
  }
}

@Controller('projects/:projectId/landing-pages')
@UseGuards(JwtAuthGuard, ProjectAccessGuard) // ✅ Unified guard validates project access
export class LandingPageController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async getProjectLandingPages(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User, // ✅ Pass full user object
  ) {
    // Guard already validated project access
    return this.projectService.getProjectLandingPages(projectId);
  }
}

@Controller('projects/:projectId/info')
export class ProjectInfoController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async getProjectInfo(@Param('projectId') projectId: string) {
    return this.projectService.getProjectInfo(projectId);
  }

  @Post('refresh')
  async refreshProjectInfo(@Param('projectId') projectId: string) {
    const project = await this.projectService.findOne(projectId);
    
    if (project.status !== ProjectStatus.LIVE || !project.iosStoreUrl) {
      throw new BadRequestException('Project must be Live with iOS Store URL to refresh info');
    }

    this.eventEmitter.emit('project-info.requested', {
      projectId: project.id,
      iosStoreUrl: project.iosStoreUrl,
    });

    return { message: 'Project info refresh triggered' };
  }
}
```

## 6. Project Ads Curation (User-Facing UI at `/projects/:projectId/ads`)

> ⚠️ **DEPRECATED**: This section is **OBSOLETE** as of December 2024.  
> **Status:** 🔴 Removed - Ads Curation workflow has been **REMOVED**  
> **Reason:** Video Ads Refactoring - Ads Curation workflow replaced by direct VideoAds creation  
> **Alternative:** Video Ads are now browsed via Videos page with `type=AD` filter or dedicated Video Ads page  
> **Reference:** See `docs/7.implementation/domains/data-collection/video-ads-refactoring-plan.md` and `docs/4.ui-design/domains/data-collection/ads-library-ui.md`

> ~~**Goal:** Provide a clear, user-facing Ads Curation experience per project where users can:~~
> - ~~See all crawled ads relevant to their project (not just a single platform at a time).~~
> - ~~Filter ads by platform and other criteria.~~
> - ~~Review and curate ads (approve/reject/add to content).~~
> - ~~Inspect full ad details, play the ad video when available, and visit the advertiser profile on the underlying platform.~~

### 6.1. Backend Integration (Reference)

> ⚠️ **DEPRECATED**: All Ads Curation APIs listed below have been **REMOVED**.  
> Video Ads are now created directly as `VideoAds` records when Ads Library crawler runs.  
> No intermediate Ad model or curation workflow exists.

~~- Core Ads Curation APIs (implemented in Data Collection domain, see Ads Curation Workflow TDD):~~
  - ~~`GET /projects/:projectId/ads/review-queue` – Pending ads.~~
  - ~~`GET /projects/:projectId/ads/approved` – Approved ads.~~
  - ~~`GET /projects/:projectId/ads/added` – Ads already converted to content.~~
  - ~~`GET /projects/:projectId/ads/stats` – Curation stats (pending/approved/rejected/added).~~
  - ~~`GET /projects/:projectId/ads/:id` – Ad detail (with relations).~~
  - ~~`POST /projects/:projectId/ads/:id/review` – Approve/Reject a single ad.~~
  - ~~`POST /projects/:projectId/ads/batch-review` – Batch approve/reject.~~
  - ~~`POST /projects/:projectId/ads/:id/add-to-content` – Create Video/SocialPost from ad.~~
  - ~~`PATCH /projects/:projectId/ads/:id/competitor` – Link ad to competitor.~~

~~The Project Management domain frontend integrates these endpoints to render the per-project Ads Curation page.~~

**Current Implementation:**
- Video Ads are browsed via `/admin/videos` or `/projects/:projectId/video-ads` with `type=AD` filter
- VideoAds records are created directly from Ads Library Transparency APIs
- No curation step required - ads are immediately available for viewing

### 6.2. User Ads Curation UX Requirements

- **Route & Access**
  - Frontend route: `/projects/:projectId/ads`.
  - Accessible to authenticated users with access to the project (guarded by ProjectAccessGuard on API).

- **Tabs / States**
  - The UI must present three logical states of ads:
    - **Pending** – ads awaiting review (backed by `review-queue` endpoint).
    - **Approved** – ads already approved but not yet added to content.
    - **Added** – ads that have been converted to Video/SocialPost.
  - Switching tabs should:
    - Load the correct list (pending/approved/added).
    - Preserve current filter state where reasonable (e.g., platform filter).

- **Filters & Pagination**
  - **Platform filter**:
    - Supported values: `META`, `TIKTOK`, `GOOGLE`, plus an **“All Platforms”** state.
    - Default state must be “All Platforms” so users can see a unified list of ads.
  - **Pagination / Load more**:
    - The frontend must use `limit` / `offset` from `AdQueryParams` when calling list endpoints.
    - UX must expose either:
      - A “Load more” control, or
      - Explicit pagination (page numbers / next/previous).
    - The UI must display how many ads are being shown and the total available (e.g., “Showing X–Y of Z ads”).

- **Ad Card & Detail**
  - Each ad should be represented by a **card** with:
    - Thumbnail or preview image.
    - Advertiser/page name.
    - Platform badge (Meta/TikTok/Google).
    - Short snippet of the ad copy.
    - Basic metrics (e.g., firstShown date, impressions range if available).
  - **Card click behavior**:
    - Clicking the main area of the ad card opens an **Ad Detail Modal** (not navigate away from the page).
    - Selection checkboxes for batch actions must not conflict with this click behavior (checkbox click should not open the modal).

- **Ad Detail Modal (User-Facing)**
  - Content requirements:
    - Large preview (image or video thumbnail).
    - Advertiser/page name and platform badge.
    - Spy keyword (if present).
    - Full ad copy (creativeBody) in a readable format.
    - Date/metrics: firstShown/lastShown, impressions/spend range if present.
  - **Video playback:**
    - If `videoUrl` or `videoHdUrl` is present:
      - The modal must expose a clear **“Watch Video”** action.
      - Behavior: open the video in a new browser tab/window (either direct video URL or platform URL as provided by backend).
  - **Profile hyperlink (platform-specific)**
    - If `pageProfileUri` or equivalent profile URL is available from the Ad model:
      - The modal must display a clickable **Profile** link (e.g., "View Profile").
      - Clicking this link opens the advertiser profile in a new tab.
    - The link target should be platform-specific based on `platform`:
      - For **Meta** (Facebook/Instagram): use the profile URI/URL returned by the Ads Library response when present.
      - For other platforms (TikTok/Google), use any profile URL exposed by the backend for that ad; if none is available, omit the link (do not render a disabled or broken link).

- **Review & Curation Actions**
  - **Pending tab:**
    - Per-ad actions: Approve / Reject.
    - Batch actions:
      - “Select all” applies to ads currently loaded in the view (current page/batch).
      - “Approve All” / “Reject All” apply to the selected set only.
  - **Approved tab:**
    - Per-ad action: “Add to Content” (invokes add-to-content endpoint).
  - **Added tab:**
    - For ads that have been converted:
      - Display read-only indicators like “Added as Video” and/or “Added as Post”.
      - Include links to the created Video/SocialPost pages if such routes exist (as defined in UI design for content library).

## 7. Query Patterns: Internal vs External Data

> [!WARNING]
> **Current Issues (Dec 2025)**:
> - Controller bug: `source` parameter not passed to service → causes incorrect filtering
> - Data integrity: MIXED channels (both `projectId` and `competitorId` set) violate business constraint
> - **See**: `docs/prompt-for-claude-code/critical-bug-fix-source-parameter.md` for bug details
> - **See**: `docs/3.technical-design/architecture-decision-table-separation.md` for proposed long-term solution

### 7.1. Shared Tables Design (Current)
All data uses **shared tables** for both Internal (project's own) and External (competitor) data:
- **`SocialChannel`**: Shared table, distinguished by `projectId` (Internal) vs `competitorId` (External)
- **`VideoAds`**: Shared table, distinguished by `socialChannel.projectId` vs `socialChannel.competitorId`
- **`VideoOrganic`**: Shared table, distinguished by `socialChannel.projectId` vs `socialChannel.competitorId`

**Critical Requirements**:
- **Every query MUST include classification logic** (easy to forget → causes bugs)
- **Controller MUST pass `source` parameter** to service (current bug)
- **Validation MUST prevent MIXED channels** (both fields set)

### 7.2. Query Patterns

#### Get Internal Project Social Channels (My Channels)
```typescript
// Get all project-linked channels (Internal)
const channels = await this.prisma.socialChannel.findMany({
  where: {
    projectId: projectId,
    competitorId: null,  // Ensure not competitor-linked
  },
});
```

#### Get External Competitor Social Channels
```typescript
// Get all competitor-linked channels (External)
const channels = await this.prisma.socialChannel.findMany({
  where: {
    competitor: { projectId },
    projectId: null,  // Ensure not project-linked
  },
});
```

#### Get Internal Video Ads (from project's own channels)
```typescript
// Get VideoAds from project-linked channels only (Internal)
const videoAds = await this.prisma.videoAds.findMany({
  where: {
    projectId,
    socialChannel: {
      projectId: projectId,  // Project-linked channel
      competitorId: null,      // Not competitor-linked
    },
  },
  include: { socialChannel: true },
});
```

#### Get External Video Ads (from competitor channels)
```typescript
// Get VideoAds from competitor-linked channels only (External)
// IMPORTANT: VideoAds ALWAYS has projectId (required field)
// We filter by socialChannel.competitorId (External) vs socialChannel.projectId (Internal)
const videoAds = await this.prisma.videoAds.findMany({
  where: {
    projectId,  // Still need projectId - VideoAds always belongs to a project
    socialChannel: {
      competitor: { projectId },  // From competitor channels
      competitorId: { not: null }, // Competitor-linked (not independent)
      projectId: null,              // Not project-linked (Internal)
    },
  },
  include: { socialChannel: { include: { competitor: true } } },
});
```

#### Get Internal Video Organic (from project's own channels)
```typescript
// Get VideoOrganic from project-linked channels only (Internal)
const videoOrganic = await this.prisma.videoOrganic.findMany({
  where: {
    projectId,
    socialChannel: {
      projectId: projectId,  // Project-linked channel
      competitorId: null,      // Not competitor-linked
    },
  },
  include: { socialChannel: true },
});
```

#### Get External Video Organic (from competitor channels)
```typescript
// Get VideoOrganic from competitor-linked channels only (External)
// IMPORTANT: VideoOrganic ALWAYS has projectId (required field)
// We filter by socialChannel.competitorId (External) vs socialChannel.projectId (Internal)
const videoOrganic = await this.prisma.videoOrganic.findMany({
  where: {
    projectId,  // Still need projectId - VideoOrganic always belongs to a project
    socialChannel: {
      competitor: { projectId },  // From competitor channels
      competitorId: { not: null }, // Competitor-linked (not independent)
      projectId: null,              // Not project-linked (Internal)
    },
  },
  include: { socialChannel: { include: { competitor: true } } },
});
```

### 7.3. Service Method Examples

#### Marketing Stats Aggregation (Internal)
```typescript
async getMarketingStats(projectId: string) {
  // Count project-linked channels
  const totalChannels = await this.prisma.socialChannel.count({
    where: { projectId, competitorId: null },
  });

  // Count VideoAds from project's channels
  const videoAdsCount = await this.prisma.videoAds.count({
    where: {
      projectId,
      socialChannel: { projectId, competitorId: null },
    },
  });

  // Count VideoOrganic from project's channels
  const videoOrganicCount = await this.prisma.videoOrganic.count({
    where: {
      projectId,
      socialChannel: { projectId, competitorId: null },
    },
  });

  // Sum followers from project's channels
  const totalFollowers = await this.prisma.socialChannelSnapshot.aggregate({
    where: {
      socialChannel: { projectId, competitorId: null },
      capturedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    },
    _sum: { followers: true },
  });

  return {
    totalChannels,
    videoAdsCount,
    videoOrganicCount,
    totalFollowers: totalFollowers._sum.followers || 0,
  };
}
```

## 8. API Endpoints Summary

