# Domain TDD: Admin & System

> **✅ Unified API Architecture:** Admin controllers for project-scoped operations should reuse unified services. System-wide operations keep separate endpoints. See `docs/3.technical-design/UNIFIED-API-ARCHITECTURE-PATTERN.md` for details.

> **✅ Separate Tables Refactor (December 2024):** Admin endpoints have been split into Internal (`/admin/internal/*`) and External (`/admin/external/*`) routes to align with separate database tables (`ProjectSocialChannel`/`ProjectVideoAds`/`ProjectVideoOrganic`/`ProjectLandingPage` vs `CompetitorSocialChannel`/`CompetitorVideoAds`/`CompetitorVideoOrganic`/`CompetitorLandingPage`). Old unified endpoints (`/admin/social`, `/admin/videos`) have been removed. See `docs/prompt-for-claude-code/admin-separate-endpoints-refactor.md` for details.

## 1. Module Structure
```text
src/modules/admin/
├── controllers/
│   ├── user-admin.controller.ts
│   ├── project-admin.controller.ts
│   ├── task-admin.controller.ts
│   ├── data-admin.controller.ts
│   ├── aso-admin.controller.ts
│   ├── ads-library-admin.controller.ts
│   ├── spy-keywords-admin.controller.ts
│   ├── [REMOVED] ads-curation-admin.controller.ts
│   ├── social-admin.controller.ts
│   ├── video-admin.controller.ts
│   ├── admin-logs.controller.ts
│   └── admin-metrics.controller.ts
├── services/
│   ├── user-admin.service.ts
│   ├── project-admin.service.ts
│   ├── task-admin.service.ts
│   ├── data-admin.service.ts
│   ├── aso-admin.service.ts
│   ├── ads-library-admin.service.ts
│   ├── spy-keywords-admin.service.ts
│   ├── [REMOVED] ads-curation-admin.service.ts
│   ├── social-admin.service.ts
│   ├── video-admin.service.ts
│   ├── system-logger.service.ts
│   └── metrics.service.ts
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user-role.dto.ts
│   ├── list-projects.dto.ts
│   ├── create-project-admin.dto.ts
│   ├── update-project-info.dto.ts
│   ├── list-tasks.dto.ts
│   ├── retry-job.dto.ts
│   ├── list-reviews.dto.ts
│   ├── list-app-updates.dto.ts
│   ├── list-competitors.dto.ts
│   ├── create-competitor-admin.dto.ts
│   ├── create-social-channel-admin.dto.ts
│   ├── update-social-channel-admin.dto.ts
│   ├── list-social-channels.dto.ts
│   ├── link-competitor.dto.ts
│   ├── bulk-delete.dto.ts
│   ├── list-landing-pages.dto.ts
│   ├── create-keyword.dto.ts
│   ├── update-keyword.dto.ts
│   ├── list-keywords.dto.ts
│   ├── list-ads.dto.ts
│   ├── list-videos.dto.ts
│   ├── trigger-ads-crawl.dto.ts
│   ├── create-spy-keyword-admin.dto.ts
│   ├── list-spy-keywords-admin.dto.ts
│   ├── review-ad.dto.ts
│   ├── batch-review.dto.ts
│   └── add-to-content.dto.ts
├── guards/
│   └── admin-role.guard.ts
└── admin.module.ts
```

## 2. Database Models (Prisma)
```prisma
model SystemLog {
  id        String   @id @default(uuid())
  level     String   // INFO, ERROR, WARN
  module    String   // 'Crawler', 'Auth', 'AI'
  message   String
  metadata  Json?    // { "jobId": "...", "error": "..." }
  createdAt DateTime @default(now())

  @@index([level, module])
}

model SystemMetric {
  id        String   @id @default(uuid())
  name      String   // 'active_jobs', 'api_calls'
  value     Float
  tags      Json?    // { "provider": "openai" }
  timestamp DateTime @default(now())

  @@index([name, timestamp])
}


```

## 3. Services

### 3.1. System Logger (`system-logger.service.ts`)
```typescript
@Injectable()
export class SystemLoggerService {
  constructor(private prisma: PrismaService) {}

  async log(level: 'INFO' | 'ERROR' | 'WARN', module: string, message: string, meta?: any) {
    // 1. Console Output (for Dev/CloudWatch)
    console.log(`[${level}] [${module}] ${message}`);

    // 2. Persist to DB (for Admin Dashboard)
    await this.prisma.systemLog.create({
      data: { level, module, message, metadata: meta ?? {} }
    });
  }

  async error(module: string, message: string, trace?: string) {
    await this.log('ERROR', module, message, { trace });
  }
}
```

### 3.2. Metrics Service (`metrics.service.ts`)
```typescript
@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async recordMetric(name: string, value: number, tags: Record<string, string> = {}) {
    await this.prisma.systemMetric.create({
      data: { name, value, tags }
    });
  }

  async getMetrics(name: string, timeRange: '1h' | '24h') {
    // Return aggregated time-series data
    return this.prisma.systemMetric.findMany({
      where: { name },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
  }
}
```

## 4. Services (New)

### 4.1. User Admin Service (`user-admin.service.ts`)
```typescript
@Injectable()
export class UserAdminService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService, // For password reset token
  ) {}

  async findAll(query: { search?: string; limit?: number; offset?: number }) {
    const where = query.search
      ? { email: { contains: query.search, mode: 'insensitive' } }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          profile: true,
          _count: { select: { projects: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data: users, total };
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        projects: { select: { id: true, name: true } },
        _count: { select: { projects: true } },
      },
    });
  }

  async create(dto: CreateUserDto) {
    // Create user with temporary password
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: '', // Will be set via password reset
        role: dto.role || Role.USER,
      },
    });

    // Generate password reset token and send email
    await this.authService.sendPasswordResetEmail(user.email);

    return user;
  }

  async updateRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async deactivate(id: string) {
    // Soft delete: mark as inactive (if we add isActive field)
    // Or hard delete if needed
    return this.prisma.user.delete({ where: { id } });
  }
}
```

### 4.2. Project Admin Service (`project-admin.service.ts`)
```typescript
@Injectable()
export class ProjectAdminService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    @InjectQueue(CRAWL_QUEUE) private crawlQueue: Queue,
  ) {}

  async create(dto: CreateProjectDto, adminUserId: string, targetUserId?: string) {
    // Admin can create project for any user, defaults to admin's own userId
    const projectOwnerId = targetUserId || adminUserId;

    // Validate iOS URL requirement for Live projects
    if (dto.status === ProjectStatus.LIVE && !dto.iosStoreUrl) {
      throw new BadRequestException('iOS Store URL is required for Live projects');
    }

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
      include: {
        user: { select: { id: true, email: true } },
        _count: {
          select: {
            competitors: true,
            keywords: true,
          },
        },
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

  async findAll(query: { search?: string; userId?: string; limit?: number; offset?: number }) {
    const where: any = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { appName: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.userId) {
      where.userId = query.userId;
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: {
          user: { select: { id: true, email: true } },
          _count: { select: { competitors: true, keywords: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.project.count({ where }),
    ]);

    // Add info crawl status to each project
    const projectsWithStatus = await Promise.all(
      projects.map(async (project) => ({
        ...project,
        infoCrawlStatus: await this.getInfoCrawlStatus(project),
      })),
    );

    return { data: projectsWithStatus, total };
  }

  private async getInfoCrawlStatus(project: any): Promise<'not_crawled' | 'crawled' | 'crawling' | 'failed'> {
    // If project is PRE_LAUNCH or no iOS URL, status is 'not_crawled'
    if (project.status === 'PRE_LAUNCH' || !project.iosStoreUrl) {
      return 'not_crawled';
    }

    // If appName exists, project has been crawled
    if (project.appName || project.iconUrl) {
      return 'crawled';
    }

    // Check if there's an active crawl job for this project
    const activeJobs = await this.crawlQueue.getActive();
    const projectInfoJob = activeJobs.find(
      (job) => job.name === 'project-info-crawl' && job.data.projectId === project.id,
    );
    if (projectInfoJob) {
      return 'crawling';
    }

    // Check if last job failed
    const failedJobs = await this.crawlQueue.getFailed();
    const lastFailedJob = failedJobs
      .filter((job) => job.name === 'project-info-crawl' && job.data.projectId === project.id)
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
    
    if (lastFailedJob) {
      // Check if there's a completed job after the failed one
      const completedJobs = await this.crawlQueue.getCompleted();
      const lastCompletedJob = completedJobs
        .filter((job) => job.name === 'project-info-crawl' && job.data.projectId === project.id)
        .sort((a, b) => (b.finishedOn || 0) - (a.finishedOn || 0))[0];
      
      if (!lastCompletedJob || (lastFailedJob.timestamp || 0) > (lastCompletedJob.finishedOn || 0)) {
        return 'failed';
      }
    }

    // If LIVE but no appName and no active job, assume 'not_crawled'
    return 'not_crawled';
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
        competitors: { include: { socialChannels: true } },
        keywords: true,
      },
    });
  }

  async getProjectInfo(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        screenshots: { orderBy: { order: 'asc' } },
        updates: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    const infoCrawlStatus = await this.getInfoCrawlStatus(project);

    return {
      id: project.id,
      appName: project.appName,
      developerName: project.developerName,
      iconUrl: project.iconUrl,
      description: project.description,
      category: project.category,
      rating: project.rating,
      ratingsCount: project.ratingsCount,
      bundleId: project.bundleId,
      description: project.description,
      screenshots: project.screenshots,
      recentUpdates: project.updates,
      infoCrawlStatus,
      iosStoreUrl: project.iosStoreUrl,
      androidStoreUrl: project.androidStoreUrl,
    };
  }

  async updateProjectInfo(projectId: string, dto: UpdateProjectInfoDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    // Update only the fields provided in DTO
    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(dto.appName !== undefined && { appName: dto.appName }),
        ...(dto.iconUrl !== undefined && { iconUrl: dto.iconUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.developerName !== undefined && { developerName: dto.developerName }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.ratingsCount !== undefined && { ratingsCount: dto.ratingsCount }),
        ...(dto.bundleId !== undefined && { bundleId: dto.bundleId }),
      },
    });

    return this.getProjectInfo(projectId);
  }

  async updateProjectInfo(projectId: string, dto: UpdateProjectInfoDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    // Update only the fields provided in DTO
    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(dto.appName !== undefined && { appName: dto.appName }),
        ...(dto.iconUrl !== undefined && { iconUrl: dto.iconUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.developerName !== undefined && { developerName: dto.developerName }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.ratingsCount !== undefined && { ratingsCount: dto.ratingsCount }),
        ...(dto.bundleId !== undefined && { bundleId: dto.bundleId }),
      },
    });

    return this.getProjectInfo(projectId);
  }

  async refreshProjectInfo(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    if (!project.iosStoreUrl) {
      throw new BadRequestException('Project must have iOS Store URL to refresh info');
    }

    // Emit event to trigger project info crawl
    this.eventEmitter.emit('project-info.requested', {
      projectId: project.id,
      iosStoreUrl: project.iosStoreUrl,
    });

    return { message: 'Project info refresh queued', projectId };
  }

  async delete(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    // Admin can delete any project (no ownership check needed)
    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted successfully', projectId };
  }
}
```

### 4.3. Task Admin Service (`task-admin.service.ts`)
```typescript
@Injectable()
export class TaskAdminService {
  constructor(
    @InjectQueue(CRAWL_QUEUE) private crawlQueue: Queue,
    @InjectQueue(ANALYSIS_QUEUE) private analysisQueue: Queue,
  ) {}

  async findAll(query: {
    queue?: 'crawl' | 'analysis';
    status?: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
    limit?: number;
    offset?: number;
  }) {
    const queue = query.queue === 'analysis' ? this.analysisQueue : this.crawlQueue;
    
    let jobs: Job[] = [];
    
    if (query.status) {
      switch (query.status) {
        case 'waiting':
          jobs = await queue.getWaiting();
          break;
        case 'active':
          jobs = await queue.getActive();
          break;
        case 'completed':
          jobs = await queue.getCompleted();
          break;
        case 'failed':
          jobs = await queue.getFailed();
          break;
        case 'delayed':
          jobs = await queue.getDelayed();
          break;
      }
    } else {
      // Get all statuses
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed(),
        queue.getDelayed(),
      ]);
      jobs = [...waiting, ...active, ...completed, ...failed, ...delayed];
    }

    // Sort by timestamp (newest first) and paginate
    jobs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const paginated = jobs.slice(
      query.offset || 0,
      (query.offset || 0) + (query.limit || 50),
    );

    return {
      data: paginated.map((job) => ({
        id: job.id,
        name: job.name,
        queue: query.queue || 'crawl',
        status: this.getJobStatus(job),
        progress: job.progress,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        data: job.data,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      })),
      total: jobs.length,
    };
  }

  async findOne(jobId: string, queueName: 'crawl' | 'analysis' = 'crawl') {
    const queue = queueName === 'analysis' ? this.analysisQueue : this.crawlQueue;
    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    return {
      id: job.id,
      name: job.name,
      queue: queueName,
      status: this.getJobStatus(job),
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      failedReason: job.failedReason,
      stacktrace: job.stacktrace,
      data: job.data,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
    };
  }

  async retry(jobId: string, queueName: 'crawl' | 'analysis' = 'crawl') {
    const queue = queueName === 'analysis' ? this.analysisQueue : this.crawlQueue;
    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    if (job.finishedOn) {
      // Job already completed, cannot retry
      throw new BadRequestException('Cannot retry completed job');
    }

    await job.retry();
    return { message: 'Job retry queued', jobId };
  }

  async getQueueStats() {
    const [crawlStats, analysisStats] = await Promise.all([
      this.getQueueStatsForQueue(this.crawlQueue),
      this.getQueueStatsForQueue(this.analysisQueue),
    ]);

    return {
      crawl: crawlStats,
      analysis: analysisStats,
    };
  }

  private async getQueueStatsForQueue(queue: Queue) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  private getJobStatus(job: Job): string {
    if (job.finishedOn) {
      return job.failedReason ? 'failed' : 'completed';
    }
    if (job.processedOn) {
      return 'active';
    }
    if (job.delay) {
      return 'delayed';
    }
    return 'waiting';
  }
}
```

## 5. Controllers

### 5.1. User Admin Controller (`user-admin.controller.ts`)
```typescript
@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class UserAdminController {
  constructor(private userAdminService: UserAdminService) {}

  @Get()
  async findAll(@Query() query: ListUsersQueryDto) {
    return this.userAdminService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userAdminService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userAdminService.create(dto);
  }

  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.userAdminService.updateRole(id, dto.role);
  }

  @Delete(':id')
  async deactivate(@Param('id') id: string) {
    return this.userAdminService.deactivate(id);
  }
}
```

### 5.2. DTOs

#### CreateProjectAdminDto (`create-project-admin.dto.ts`)
```typescript
export class CreateProjectAdminDto extends CreateProjectDto {
  @IsOptional()
  @IsUUID()
  targetUserId?: string; // Optional: Admin can specify target user to create project for
}
```

#### ListReviewsQueryDto (`list-reviews.dto.ts`)
```typescript
export class ListReviewsQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string;

  @IsOptional()
  @IsEnum(['IOS', 'ANDROID'])
  platform?: 'IOS' | 'ANDROID';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsEnum(['POSITIVE', 'NEUTRAL', 'NEGATIVE'])
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

#### ListAppUpdatesQueryDto (`list-app-updates.dto.ts`)
```typescript
export class ListAppUpdatesQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string;

  @IsOptional()
  @IsEnum(['HIGH', 'MEDIUM', 'LOW'])
  impactLevel?: 'HIGH' | 'MEDIUM' | 'LOW';

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

#### ListCompetitorsQueryDto (`list-competitors.dto.ts`)
```typescript
export class ListCompetitorsQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

#### ListLandingPagesQueryDto (`list-landing-pages.dto.ts`)
```typescript
export class ListLandingPagesQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

#### UpdateProjectInfoDto (`update-project-info.dto.ts`)
```typescript
export class UpdateProjectInfoDto {
  @IsOptional()
  @IsString()
  appName?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  developerName?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ratingsCount?: number;

  @IsOptional()
  @IsString()
  bundleId?: string;
}
```

### 5.3. Data Admin Service (`data-admin.service.ts`)
```typescript
@Injectable()
export class DataAdminService {
  constructor(private prisma: PrismaService) {}

  async findAllReviews(query: ListReviewsQueryDto) {
    const where: any = {};
    
    if (query.projectId) {
      where.competitor = { projectId: query.projectId };
    }
    if (query.competitorId) {
      where.competitorId = query.competitorId;
    }
    if (query.platform) {
      where.platform = query.platform;
    }
    if (query.rating) {
      where.rating = query.rating;
    }
    if (query.sentiment) {
      where.sentiment = query.sentiment;
    }
    if (query.dateFrom || query.dateTo) {
      where.publishedAt = {};
      if (query.dateFrom) {
        where.publishedAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.publishedAt.lte = new Date(query.dateTo);
      }
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          competitor: {
            include: {
              project: { select: { id: true, name: true, user: { select: { email: true } } } },
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.review.count({ where }),
    ]);

    return { data: reviews, total };
  }

  async findAllAppUpdates(query: ListAppUpdatesQueryDto) {
    const where: any = {};
    
    if (query.projectId) {
      where.competitor = { projectId: query.projectId };
    }
    if (query.competitorId) {
      where.competitorId = query.competitorId;
    }
    if (query.updateType) {
      where.updateType = query.updateType;
    }
    if (query.impactLevel) {
      where.impactLevel = query.impactLevel;
    }
    if (query.dateFrom || query.dateTo) {
      where.releasedAt = {};
      if (query.dateFrom) {
        where.releasedAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.releasedAt.lte = new Date(query.dateTo);
      }
    }

    const [updates, total] = await Promise.all([
      this.prisma.appUpdate.findMany({
        where,
        include: {
          competitor: {
            include: {
              project: { select: { id: true, name: true, user: { select: { email: true } } } },
            },
          },
        },
        orderBy: { releasedAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.appUpdate.count({ where }),
    ]);

    return { data: updates, total };
  }

  async findAllCompetitors(query: ListCompetitorsQueryDto) {
    const where: any = {};
    
    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { developerName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [competitors, total] = await Promise.all([
      this.prisma.competitor.findMany({
        where,
        include: {
          project: { 
            select: { id: true, name: true, user: { select: { id: true, email: true } } },
          },
          _count: {
            select: {
              socialChannels: true,
              landingPages: true,
              reviews: true,
              appUpdates: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.competitor.count({ where }),
    ]);

    return { data: competitors, total };
  }

  async createCompetitor(dto: CreateCompetitorAdminDto, createdByAdminId: string) {
    // 1) Validate project exists and admin has access
    const project = await this.prisma.project.findUnique({ where: { id: dto.projectId } });
    if (!project) {
      throw new NotFoundException(`Project ${dto.projectId} not found`);
    }

    // 2) Parse store URL to determine platform + app identifier
    const { platform, storeId } = parseStoreUrl(dto.appUrl); // helper that validates and extracts IDs

    // 3) Prevent duplicate competitor for same project + storeId
    const existing = await this.prisma.competitor.findFirst({
      where: { projectId: dto.projectId, storeAppId: storeId },
    });
    if (existing) {
      throw new BadRequestException('Competitor already exists for this project');
    }

    // 4) Fetch metadata (app name, developer, icon, category, rating) via crawler/service
    const metadata = await this.appInfoService.fetchStoreMetadata({
      appUrl: dto.appUrl,
      platform,
    });

    // 5) Create competitor and enqueue optional deep crawl
    const competitor = await this.prisma.competitor.create({
      data: {
        projectId: dto.projectId,
        name: metadata.appName,
        developerName: metadata.developerName,
        category: metadata.category,
        iconUrl: metadata.iconUrl,
        rating: metadata.rating,
        ratingsCount: metadata.ratingsCount,
        storeAppId: storeId,
        storeUrl: dto.appUrl,
        platform,
        createdByAdminId,
      },
    });

    // Optional: trigger crawl for social channels / landing pages
    this.eventEmitter.emit('competitor.crawl.requested', {
      competitorId: competitor.id,
      projectId: dto.projectId,
    });

    return competitor;
  }

  async findOneCompetitor(competitorId: string) {
    return this.prisma.competitor.findUnique({
      where: { id: competitorId },
      include: {
        project: { 
          select: { id: true, name: true, user: { select: { id: true, email: true } } },
        },
        socialChannels: true,
        landingPages: true,
        _count: {
          select: {
            reviews: true,
            appUpdates: true,
          },
        },
      },
    });
  }

  async addSocialChannel(competitorId: string, dto: CreateSocialChannelAdminDto) {
    const competitor = await this.prisma.competitor.findUnique({ where: { id: competitorId } });
    if (!competitor) {
      throw new NotFoundException(`Competitor ${competitorId} not found`);
    }

    // Prevent duplicate channel with same platform + URL
    const existing = await this.prisma.socialChannel.findFirst({
      where: {
        competitorId,
        platform: dto.platform,
        url: dto.url,
      },
    });
    if (existing) {
      throw new BadRequestException('Channel already exists for this competitor');
    }

    return this.prisma.socialChannel.create({
      data: {
        competitorId,
        platform: dto.platform,
        url: dto.url,
        platformExternalId: dto.platformExternalId,
        status: dto.status ?? 'ACTIVE',
        lastCrawledAt: null,
      },
    });
  }

  async updateSocialChannel(channelId: string, dto: UpdateSocialChannelAdminDto) {
    const channel = await this.prisma.socialChannel.findUnique({ where: { id: channelId } });
    if (!channel) {
      throw new NotFoundException(`SocialChannel ${channelId} not found`);
    }

    return this.prisma.socialChannel.update({
      where: { id: channelId },
      data: {
        ...(dto.url !== undefined && { url: dto.url }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  async deleteSocialChannel(channelId: string) {
    const channel = await this.prisma.socialChannel.findUnique({ where: { id: channelId } });
    if (!channel) {
      throw new NotFoundException(`SocialChannel ${channelId} not found`);
    }

    await this.prisma.socialChannel.delete({ where: { id: channelId } });
    return { message: 'Channel deleted', channelId };
  }

  async findAllLandingPages(query: ListLandingPagesQueryDto) {
    const where: any = {};
    
    if (query.projectId) {
      where.competitor = { projectId: query.projectId };
    }
    if (query.competitorId) {
      where.competitorId = query.competitorId;
    }

    const [landingPages, total] = await Promise.all([
      this.prisma.landingPage.findMany({
        where,
        include: {
          competitor: {
            include: {
              project: { 
                select: { id: true, name: true, user: { select: { email: true } } },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.landingPage.count({ where }),
    ]);

    return { data: landingPages, total };
  }
}
```

### 5.4. Data Admin Controller (`data-admin.controller.ts`)
```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class DataAdminController {
  constructor(private dataAdminService: DataAdminService) {}

  @Get('reviews')
  async findAllReviews(@Query() query: ListReviewsQueryDto) {
    return this.dataAdminService.findAllReviews(query);
  }

  @Get('whats-new')
  async findAllAppUpdatesWhatsNew(@Query() query: ListAppUpdatesQueryDto) {
    return this.dataAdminService.findAllAppUpdates(query);
  }

  @Get('app-updates')
  async findAllAppUpdates(@Query() query: ListAppUpdatesQueryDto) {
    return this.dataAdminService.findAllAppUpdates(query);
  }
```

#### ListReviewsQueryDto (`list-reviews.dto.ts`)
```typescript
export class ListReviewsQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string;

  @IsOptional()
  @IsEnum(['IOS', 'ANDROID'])
  platform?: 'IOS' | 'ANDROID';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsEnum(['POSITIVE', 'NEUTRAL', 'NEGATIVE'])
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

#### ListAppUpdatesQueryDto (`list-app-updates.dto.ts`)
```typescript
export class ListAppUpdatesQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string;

  @IsOptional()
  @IsEnum(['APP_UPDATE', 'CONTENT', 'POLICY'])
  updateType?: 'APP_UPDATE' | 'CONTENT' | 'POLICY';

  @IsOptional()
  @IsEnum(['HIGH', 'MEDIUM', 'LOW'])
  impactLevel?: 'HIGH' | 'MEDIUM' | 'LOW';

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

#### ListCompetitorsQueryDto (`list-competitors.dto.ts`)
```typescript
export class ListCompetitorsQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

#### CreateCompetitorAdminDto (`create-competitor-admin.dto.ts`)
```typescript
export class CreateCompetitorAdminDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @IsUrl()
  appUrl: string; // Store URL to fetch metadata
}
```

#### CreateSocialChannelAdminDto (`create-social-channel-admin.dto.ts`)
```typescript
export class CreateSocialChannelAdminDto {
  @IsEnum(['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK'])
  platform: 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE' | 'FACEBOOK';

  @IsString()
  @IsUrl()
  url: string; // Required: channel URL only

  @IsOptional()
  @IsString()
  platformExternalId?: string; // Optional: platform-specific ID if already known

  @IsOptional()
  @IsEnum(['ACTIVE', 'PENDING', 'ERROR'])
  status?: 'ACTIVE' | 'PENDING' | 'ERROR';
}
```

#### UpdateSocialChannelAdminDto (`update-social-channel-admin.dto.ts`)
```typescript
export class UpdateSocialChannelAdminDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'PENDING', 'ERROR'])
  status?: 'ACTIVE' | 'PENDING' | 'ERROR';
}
```

#### ListLandingPagesQueryDto (`list-landing-pages.dto.ts`)
```typescript
export class ListLandingPagesQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

### 5.6. Project Admin Controller (`project-admin.controller.ts`)

  @Get('competitors')
  async findAllCompetitors(@Query() query: ListCompetitorsQueryDto) {
    return this.dataAdminService.findAllCompetitors(query);
  }

  @Get('competitors/:id')
  async findOneCompetitor(@Param('id') id: string) {
    return this.dataAdminService.findOneCompetitor(id);
  }

  @Post('competitors/:id/channels')
  async addSocialChannel(
    @Param('id') competitorId: string,
    @Body() dto: CreateSocialChannelAdminDto,
  ) {
    return this.dataAdminService.addSocialChannel(competitorId, dto);
  }

  @Patch('competitors/:id/channels/:channelId')
  async updateSocialChannel(
    @Param('channelId') channelId: string,
    @Body() dto: UpdateSocialChannelAdminDto,
  ) {
    return this.dataAdminService.updateSocialChannel(channelId, dto);
  }

  @Delete('competitors/:id/channels/:channelId')
  async deleteSocialChannel(@Param('channelId') channelId: string) {
    return this.dataAdminService.deleteSocialChannel(channelId);
  }

  @Post('competitors')
  async createCompetitor(
    @CurrentUser('id') adminUserId: string,
    @Body() dto: CreateCompetitorAdminDto,
  ) {
    return this.dataAdminService.createCompetitor(dto, adminUserId);
  }

  @Get('landing-pages')
  async findAllLandingPages(@Query() query: ListLandingPagesQueryDto) {
    return this.dataAdminService.findAllLandingPages(query);
  }
}
```

### 5.5. Project Admin Controller (`project-admin.controller.ts`)
```typescript
@Controller('admin/projects')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class ProjectAdminController {
  constructor(private projectAdminService: ProjectAdminService) {}

  @Get()
  async findAll(@Query() query: ListProjectsQueryDto) {
    return this.projectAdminService.findAll(query);
  }

  @Post()
  async create(
    @CurrentUser('id') adminUserId: string,
    @Body() dto: CreateProjectAdminDto,
  ) {
    return this.projectAdminService.create(dto, adminUserId, dto.targetUserId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectAdminService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.projectAdminService.delete(id);
  }

  @Get(':id/info')
  async getProjectInfo(@Param('id') id: string) {
    return this.projectAdminService.getProjectInfo(id);
  }

  @Patch(':id/info')
  async updateProjectInfo(
    @Param('id') id: string,
    @Body() dto: UpdateProjectInfoDto,
  ) {
    return this.projectAdminService.updateProjectInfo(id, dto);
  }

  @Post(':id/refresh-info')
  async refreshInfo(@Param('id') id: string) {
    return this.projectAdminService.refreshProjectInfo(id);
  }
}
```

### 5.3. Task Admin Controller (`task-admin.controller.ts`)
```typescript
@Controller('admin/tasks')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class TaskAdminController {
  constructor(private taskAdminService: TaskAdminService) {}

  @Get()
  async findAll(@Query() query: ListTasksQueryDto) {
    return this.taskAdminService.findAll(query);
  }

  @Get('queues/stats')
  async getQueueStats() {
    return this.taskAdminService.getQueueStats();
  }

  @Get(':jobId')
  async findOne(
    @Param('jobId') jobId: string,
    @Query('queue') queue?: 'crawl' | 'analysis',
  ) {
    return this.taskAdminService.findOne(jobId, queue);
  }

  @Post(':jobId/retry')
  async retry(
    @Param('jobId') jobId: string,
    @Query('queue') queue?: 'crawl' | 'analysis',
  ) {
    return this.taskAdminService.retry(jobId, queue);
  }
}
```

### 5.4. Admin Logs Controller (`admin-logs.controller.ts`)
```typescript
@Controller('admin/logs')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class AdminLogsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getLogs(
    @Query('level') level?: string,
    @Query('module') module?: string,
    @Query('limit') limit = '50'
  ) {
    return this.prisma.systemLog.findMany({
      where: { level, module },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });
  }
}
```

### 5.5. Admin Video Ads Management

> ⚠️ **UPDATED**: Ads Curation workflow has been removed. Video Ads are now created directly from Ads Library Transparency APIs.

#### 5.5.1. Backend Components

- `AdsLibraryAdminController` (`/admin/ads-library`)  
  - Trigger Ads Library crawl for project/keyword (creates Video records directly with `type = AD`).
  - View crawl history and status.
- `DataAdminController` (Internal: `/admin/internal/videos`, `/admin/internal/video-ads`; External: `/admin/external/videos`, `/admin/external/video-ads`)
  - Internal routes: List all internal videos from `ProjectVideoOrganic` and `ProjectVideoAds` tables.
  - External routes: List all external videos from `CompetitorVideoOrganic` and `CompetitorVideoAds` tables.
  - Filter by platform, project, socialChannelId, date range.
  - View video details, delete videos.

**Note:** Video Ads are created directly as `Video` records with `type = AD` when Ads Library crawler runs. No intermediate Ad model or curation workflow.

#### 5.5.2. Frontend Routing & UX

- **Admin Videos routes:**
  - Internal routes: `/admin/internal/videos` (organic), `/admin/internal/video-ads` (ads)
  - External routes: `/admin/external/videos` (organic), `/admin/external/video-ads` (ads)
  - Sidebar labels: `Video Organic`, `Video Ads` (under Internal/External sections)
  - Purpose: View and manage videos separated by Internal (Astraler's own) vs External (Competitor) data.

- **Video Filters:**
  - For Internal: Filter by project, platform, socialChannelId, date range, search
  - For External: Filter by competitor, project, platform, socialChannelId, date range, search
  - Display source badge (Internal/External) on video cards

- **Video Ads Creation:**
  - Trigger Ads Library crawl from Admin Internal/External Social Channels pages
  - For Internal channels: Crawler creates records in `ProjectVideoAds` table
  - For External channels: Crawler creates records in `CompetitorVideoAds` table
  - No review/curation step required

## 6. ASO Keywords Management

### 6.1. ASO Admin Service (`aso-admin.service.ts`)
```typescript
@Injectable()
export class AsoAdminService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAllKeywords(query: {
    projectId?: string;
    platform?: 'IOS' | 'ANDROID' | 'BOTH';
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.platform) {
      where.platform = query.platform;
    }

    const [keywords, total] = await Promise.all([
      this.prisma.keyword.findMany({
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
            select: { ads: true }, // Count ads found for this keyword
          },
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.keyword.count({ where }),
    ]);

    return { data: keywords, total };
  }

  async findOneKeyword(id: string) {
    return this.prisma.keyword.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            user: { select: { id: true, email: true } },
          },
        },
        ads: {
          take: 20,
          orderBy: { discoveredAt: 'desc' },
        },
      },
    });
  }

  async createKeyword(dto: { projectId: string; text: string; platform: 'IOS' | 'ANDROID' | 'BOTH' }) {
    // Check if keyword already exists for this project
    const existing = await this.prisma.keyword.findFirst({
      where: {
        projectId: dto.projectId,
        text: dto.text,
      },
    });

    if (existing) {
      throw new BadRequestException(`Keyword "${dto.text}" already exists for this project`);
    }

    const keyword = await this.prisma.keyword.create({
      data: {
        projectId: dto.projectId,
        text: dto.text,
        platform: dto.platform,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Trigger Ads Library crawl for this new keyword
    this.eventEmitter.emit('ads.crawl.requested', {
      projectId: dto.projectId,
      keywordId: keyword.id,
    });

    return keyword;
  }

  async updateKeyword(id: string, dto: { text?: string; platform?: 'IOS' | 'ANDROID' | 'BOTH' }) {
    return this.prisma.keyword.update({
      where: { id },
      data: dto,
    });
  }

  async deleteKeyword(id: string) {
    return this.prisma.keyword.delete({
      where: { id },
    });
  }

  async triggerAdsCrawl(keywordId: string) {
    const keyword = await this.prisma.keyword.findUnique({
      where: { id: keywordId },
      select: { id: true, projectId: true },
    });

    if (!keyword) {
      throw new NotFoundException(`Keyword ${keywordId} not found`);
    }

    // Emit event to trigger Ads Library crawl
    this.eventEmitter.emit('ads.crawl.requested', {
      projectId: keyword.projectId,
      keywordId: keyword.id,
    });

    return { message: 'Ads Library crawl triggered', keywordId };
  }
}
```

### 6.2. Ads Library Admin Service (`ads-library-admin.service.ts`)
```typescript
@Injectable()
export class AdsLibraryAdminService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAllAds(query: {
    projectId?: string;
    keywordId?: string;
    platform?: 'META' | 'TIKTOK' | 'GOOGLE';
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.keywordId) {
      where.keywordId = query.keywordId;
    }
    if (query.platform) {
      where.platform = query.platform;
    }
    if (query.startDate || query.endDate) {
      where.discoveredAt = {};
      if (query.startDate) {
        where.discoveredAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.discoveredAt.lte = new Date(query.endDate);
      }
    }

    const [ads, total] = await Promise.all([
      this.prisma.ad.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              user: { select: { id: true, email: true } },
            },
          },
          keyword: {
            select: {
              id: true,
              text: true,
            },
          },
        },
        orderBy: { discoveredAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.ad.count({ where }),
    ]);

    return { data: ads, total };
  }

  async findOneAd(id: string) {
    return this.prisma.ad.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            user: { select: { id: true, email: true } },
          },
        },
        keyword: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });
  }

  async triggerCrawl(dto: { projectId?: string; keywordId?: string }) {
    if (!dto.projectId && !dto.keywordId) {
      throw new BadRequestException('Either projectId or keywordId must be provided');
    }

    this.eventEmitter.emit('ads.crawl.requested', dto);

    return { message: 'Ads Library crawl triggered', ...dto };
  }
}
```

### 6.3. ASO Admin Controller (`aso-admin.controller.ts`)
```typescript
@Controller('admin/aso/keywords')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class AsoAdminController {
  constructor(private asoAdminService: AsoAdminService) {}

  @Get()
  async findAllKeywords(@Query() query: ListKeywordsQueryDto) {
    return this.asoAdminService.findAllKeywords(query);
  }

  @Get(':id')
  async findOneKeyword(@Param('id') id: string) {
    return this.asoAdminService.findOneKeyword(id);
  }

  @Post()
  async createKeyword(@Body() dto: CreateKeywordDto) {
    return this.asoAdminService.createKeyword(dto);
  }

  @Patch(':id')
  async updateKeyword(@Param('id') id: string, @Body() dto: UpdateKeywordDto) {
    return this.asoAdminService.updateKeyword(id, dto);
  }

  @Delete(':id')
  async deleteKeyword(@Param('id') id: string) {
    return this.asoAdminService.deleteKeyword(id);
  }

  @Post(':id/trigger-crawl')
  async triggerAdsCrawl(@Param('id') id: string) {
    return this.asoAdminService.triggerAdsCrawl(id);
  }
}
```

### 6.4. Ads Library Admin Controller (`ads-library-admin.controller.ts`)
```typescript
@Controller('admin/ads-library')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class AdsLibraryAdminController {
  constructor(private adsLibraryAdminService: AdsLibraryAdminService) {}

  @Get()
  async findAllAds(@Query() query: ListAdsQueryDto) {
    return this.adsLibraryAdminService.findAllAds(query);
  }

  @Get(':id')
  async findOneAd(@Param('id') id: string) {
    return this.adsLibraryAdminService.findOneAd(id);
  }

  @Post('trigger-crawl')
  async triggerCrawl(@Body() dto: TriggerAdsCrawlDto) {
    return this.adsLibraryAdminService.triggerCrawl(dto);
  }
}
```

### 6.5. Global Social Management Service (`social-admin.service.ts`)
```typescript
@Injectable()
export class SocialAdminService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAllSocialChannels(query: {
    platform?: SocialPlatform;
    status?: SocialChannelStatus;
    projectId?: string;
    competitorId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (query.platform) {
      where.platform = query.platform;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.projectId) {
      where.competitor = { projectId: query.projectId };
    }
    if (query.competitorId) {
      where.competitorId = query.competitorId;
    }
    if (query.search) {
      where.OR = [
        { displayName: { contains: query.search, mode: 'insensitive' } },
        { handle: { contains: query.search, mode: 'insensitive' } },
        { profileUrl: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [channels, total] = await Promise.all([
      this.prisma.socialChannel.findMany({
        where,
        include: {
          competitor: {
            include: {
              project: { select: { id: true, name: true } },
            },
          },
          _count: {
            select: {
              videos: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.socialChannel.count({ where }),
    ]);

    // Add ads count per channel (for Meta/Facebook only)
    const channelsWithStats = await Promise.all(
      channels.map(async (channel) => {
        let adsCount = 0;
        if (channel.platform === SocialPlatform.FACEBOOK && channel.advertiserId) {
          adsCount = await this.prisma.ad.count({
            where: {
              platform: 'META',
              OR: [
                { socialChannelId: channel.id },
                { pageId: channel.platformId },
              ],
            },
          });
        }
        return {
          ...channel,
          adsCount,
        };
      }),
    );

    return { data: channelsWithStats, total };
  }

  async findOneSocialChannel(id: string) {
    return this.prisma.socialChannel.findUnique({
      where: { id },
      include: {
        competitor: {
          include: {
            project: { select: { id: true, name: true } },
          },
        },
        videos: {
          take: 20,
          orderBy: { publishedAt: 'desc' },
        },
      },
    });
  }

  async createSocialChannel(dto: CreateSocialChannelAdminDto) {
    // Validate required fields
    if (!dto.profileUrl || !dto.displayName) {
      throw new BadRequestException('profileUrl and displayName are required');
    }

    // Validate projectId is required
    if (!dto.projectId) {
      throw new BadRequestException('projectId is required');
    }

    // If competitorId is provided, validate it belongs to the projectId
    if (dto.competitorId) {
      const competitor = await this.prisma.competitor.findUnique({
        where: { id: dto.competitorId },
        select: { projectId: true },
      });
      if (!competitor) {
        throw new NotFoundException(`Competitor ${dto.competitorId} not found`);
      }
      if (competitor.projectId !== dto.projectId) {
        throw new BadRequestException('Competitor must belong to the selected project');
      }
    }

    // Prevent duplicate by platform + platformId or platform + profileUrl
    const existing = await this.prisma.socialChannel.findFirst({
      where: {
        platform: dto.platform,
        OR: [
          { platformId: dto.platformId },
          { profileUrl: dto.profileUrl },
        ],
      },
    });
    if (existing) {
      throw new BadRequestException('Social channel already exists');
    }

    // Note: If SocialChannel model has direct projectId field, use it.
    // Otherwise, derive projectId from competitor or store separately.
    // For now, assuming we can derive from competitor or need to add projectId to schema.
    return this.prisma.socialChannel.create({
      data: {
        platform: dto.platform,
        platformId: dto.platformId || '',
        handle: dto.handle,
        displayName: dto.displayName,
        profileUrl: dto.profileUrl,
        advertiserId: dto.advertiserId,
        competitorId: dto.competitorId,
        status: dto.status || SocialChannelStatus.ACTIVE,
        discoverySource: SocialDiscoverySource.MANUAL,
        // TODO: Add projectId field if schema supports it, or ensure we can derive from competitor
      },
    });
  }

  async updateSocialChannel(id: string, dto: UpdateSocialChannelAdminDto) {
    const channel = await this.prisma.socialChannel.findUnique({ where: { id } });
    if (!channel) {
      throw new NotFoundException(`SocialChannel ${id} not found`);
    }

    return this.prisma.socialChannel.update({
      where: { id },
      data: {
        ...(dto.displayName !== undefined && { displayName: dto.displayName }),
        ...(dto.handle !== undefined && { handle: dto.handle }),
        ...(dto.profileUrl !== undefined && { profileUrl: dto.profileUrl }),
        ...(dto.advertiserId !== undefined && { advertiserId: dto.advertiserId }),
        ...(dto.competitorId !== undefined && { competitorId: dto.competitorId }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  async deleteSocialChannel(id: string) {
    const channel = await this.prisma.socialChannel.findUnique({ where: { id } });
    if (!channel) {
      throw new NotFoundException(`SocialChannel ${id} not found`);
    }

    await this.prisma.socialChannel.delete({ where: { id } });
    return { message: 'Social channel deleted', id };
  }

  async bulkDeleteSocialChannels(ids: string[]) {
    const deleted = await this.prisma.socialChannel.deleteMany({
      where: { id: { in: ids } },
    });
    return { message: `${deleted.count} social channels deleted`, count: deleted.count };
  }

  async linkCompetitor(socialChannelId: string, competitorId: string | null) {
    const channel = await this.prisma.socialChannel.findUnique({ where: { id: socialChannelId } });
    if (!channel) {
      throw new NotFoundException(`SocialChannel ${socialChannelId} not found`);
    }

    if (competitorId) {
      const competitor = await this.prisma.competitor.findUnique({ where: { id: competitorId } });
      if (!competitor) {
        throw new NotFoundException(`Competitor ${competitorId} not found`);
      }
    }

    return this.prisma.socialChannel.update({
      where: { id: socialChannelId },
      data: { competitorId },
    });
  }

  async triggerAdsCrawl(socialChannelId: string) {
    const channel = await this.prisma.socialChannel.findUnique({
      where: { id: socialChannelId },
      include: { competitor: { select: { projectId: true } } },
    });

    if (!channel) {
      throw new NotFoundException(`SocialChannel ${socialChannelId} not found`);
    }

    // Only support Facebook/Meta for now
    if (channel.platform !== SocialPlatform.FACEBOOK) {
      throw new BadRequestException('Ads Library crawl is only supported for Facebook/Meta channels');
    }

    // Require advertiserId or platformId as page_id
    const pageId = channel.advertiserId || channel.platformId;
    if (!pageId) {
      throw new BadRequestException('SocialChannel must have advertiserId or platformId to trigger Ads Library crawl');
    }

    // Get projectId: from direct field if exists, or derive from competitor
    // Since all channels now require projectId, this should always be available
    const projectId = (channel as any).projectId || channel.competitor?.projectId;
    if (!projectId) {
      throw new BadRequestException('SocialChannel must be associated with a project to trigger Ads Library crawl');
    }

    // Emit event for background job (Data Collection domain handles the actual crawl)
    this.eventEmitter.emit('ads.crawl.requested', {
      projectId,
      socialChannelId: channel.id,
      pageId,
      platform: 'META',
    });

    return { message: 'Ads Library crawl triggered', socialChannelId, pageId };
  }
}
```

### 6.6. Internal Social Admin Controller (`data-admin.controller.ts` - Internal Routes)

> **UPDATED**: Endpoints have been split into Internal and External routes. Internal routes query from `ProjectSocialChannel` table.

```typescript
@Controller('admin/internal/social')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class DataAdminController {
  constructor(private dataAdminService: DataAdminService) {}

  @Get()
  async findAllInternalSocialChannels(@Query() query: ListInternalSocialQueryDto) {
    return this.dataAdminService.findAllInternalSocialChannels(query);
  }

  @Get(':id')
  async findOneInternalSocialChannel(@Param('id') id: string) {
    return this.dataAdminService.findOneInternalSocialChannel(id);
  }

  @Post()
  async createInternalSocialChannel(@Body() dto: CreateInternalSocialDto) {
    return this.dataAdminService.createInternalSocialChannel(dto);
  }

  @Patch(':id')
  async updateInternalSocialChannel(@Param('id') id: string, @Body() dto: UpdateInternalSocialDto) {
    return this.dataAdminService.updateInternalSocialChannel(id, dto);
  }

  @Delete(':id')
  async deleteInternalSocialChannel(@Param('id') id: string) {
    return this.dataAdminService.deleteInternalSocialChannel(id);
  }

  @Post('bulk-delete')
  async deleteInternalSocialChannelsBulk(@Body() dto: BulkDeleteDto) {
    return this.dataAdminService.deleteInternalSocialChannelsBulk(dto.ids);
  }

  @Post(':id/crawl-ads')
  async triggerInternalAdsCrawl(@Param('id') id: string) {
    return this.dataAdminService.triggerInternalAdsLibraryCrawl(id);
  }

  @Post(':id/crawl-videos')
  async triggerInternalVideoCrawl(@Param('id') id: string) {
    return this.dataAdminService.triggerInternalSocialVideoCrawl(id);
  }

  @Post(':id/crawl-stats')
  async triggerInternalStatsCrawl(@Param('id') id: string) {
    return this.dataAdminService.triggerInternalSocialStatsCrawl(id);
  }
}
```

### 6.6b. External Social Admin Controller (`data-admin.controller.ts` - External Routes)

> **UPDATED**: Endpoints have been split into Internal and External routes. External routes query from `CompetitorSocialChannel` table.

```typescript
@Controller('admin/external/social')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class DataAdminController {
  constructor(private dataAdminService: DataAdminService) {}

  @Get()
  async findAllExternalSocialChannels(@Query() query: ListExternalSocialQueryDto) {
    return this.dataAdminService.findAllExternalSocialChannels(query);
  }

  @Get(':id')
  async findOneExternalSocialChannel(@Param('id') id: string) {
    return this.dataAdminService.findOneExternalSocialChannel(id);
  }

  @Post()
  async createExternalSocialChannel(@Body() dto: CreateExternalSocialDto) {
    return this.dataAdminService.createExternalSocialChannel(dto);
  }

  @Patch(':id')
  async updateExternalSocialChannel(@Param('id') id: string, @Body() dto: UpdateExternalSocialDto) {
    return this.dataAdminService.updateExternalSocialChannel(id, dto);
  }

  @Delete(':id')
  async deleteExternalSocialChannel(@Param('id') id: string) {
    return this.dataAdminService.deleteExternalSocialChannel(id);
  }

  @Post('bulk-delete')
  async deleteExternalSocialChannelsBulk(@Body() dto: BulkDeleteDto) {
    return this.dataAdminService.deleteExternalSocialChannelsBulk(dto.ids);
  }

  @Post(':id/crawl-ads')
  async triggerExternalAdsCrawl(@Param('id') id: string) {
    return this.dataAdminService.triggerExternalAdsLibraryCrawl(id);
  }

  @Post(':id/crawl-videos')
  async triggerExternalVideoCrawl(@Param('id') id: string) {
    return this.dataAdminService.triggerExternalSocialVideoCrawl(id);
  }

  @Post(':id/crawl-stats')
  async triggerExternalStatsCrawl(@Param('id') id: string) {
    return this.dataAdminService.triggerExternalSocialStatsCrawl(id);
  }
}
```

### 6.7. Global Video Ads Management Service (`video-ads-admin.service.ts`)

> **Updated:** Separated into VideoAds and VideoOrganic services due to separate tables.
```typescript
@Injectable()
export class VideoAdsAdminService {
  constructor(private prisma: PrismaService) {}

  async findAllVideoAds(query: {
    platform?: string;
    adPlatform?: string; // 'META', 'TIKTOK', 'GOOGLE'
    projectId?: string;
    competitorId?: string;
    socialChannelId?: string;
    source?: 'internal' | 'external'; // NEW: Filter by Internal (project-linked) vs External (competitor-linked)
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (query.platform) {
      where.platform = query.platform;
    }
    if (query.adPlatform) {
      where.adPlatform = query.adPlatform;
    }
    if (query.projectId) {
      where.projectId = query.projectId; // VideoAds always has projectId (required field)
    }
    
    // Filter by source: Internal (project-linked) vs External (competitor-linked)
    if (query.source === 'internal') {
      // Internal: VideoAds from project's own social channels
      where.socialChannel = {
        projectId: query.projectId,  // Project-linked channel
        competitorId: null,            // Not competitor-linked
      };
    } else if (query.source === 'external') {
      // External: VideoAds from competitor social channels
      where.socialChannel = {
        competitor: query.projectId ? { projectId: query.projectId } : undefined,
        competitorId: { not: null },  // Competitor-linked channel
        projectId: null,               // Not project-linked
      };
    } else {
      // Default: No source filter, but can still filter by competitorId or socialChannelId
      if (query.competitorId) {
        where.socialChannel = {
          competitorId: query.competitorId,
        };
      }
    }
    
    if (query.socialChannelId) {
      where.socialChannelId = query.socialChannelId;
    }
    if (query.dateFrom || query.dateTo) {
      where.publishedAt = {};
      if (query.dateFrom) {
        where.publishedAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.publishedAt.lte = new Date(query.dateTo);
      }
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { advertiserName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [videoAds, total] = await Promise.all([
      this.prisma.videoAds.findMany({
        where,
        include: {
          socialChannel: {
            include: {
              competitor: {
                include: {
                  project: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.videoAds.count({ where }),
    ]);

    return { data: videoAds, total };
  }

  async findOneVideoAd(id: string) {
    return this.prisma.videoAds.findUnique({
      where: { id },
      include: {
        socialChannel: {
          include: {
            competitor: {
              include: {
                project: { select: { id: true, name: true } },
              },
            },
          },
        },
        snapshots: {
          orderBy: { capturedAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async bulkDeleteVideoAds(ids: string[]) {
    const deleted = await this.prisma.videoAds.deleteMany({
      where: { id: { in: ids } },
    });
    return { message: `${deleted.count} video ads deleted`, count: deleted.count };
  }
}

### 6.7b. Global Video Organic Management Service (`video-organic-admin.service.ts`)

```typescript
@Injectable()
export class VideoOrganicAdminService {
  constructor(private prisma: PrismaService) {}

  async findAllVideoOrganics(query: {
    platform?: string;
    projectId?: string;
    competitorId?: string;
    socialChannelId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (query.platform) {
      where.platform = query.platform;
    }
    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.competitorId) {
      where.socialChannel = {
        competitorId: query.competitorId,
      };
    }
    if (query.socialChannelId) {
      where.socialChannelId = query.socialChannelId;
    }
    if (query.dateFrom || query.dateTo) {
      where.publishedAt = {};
      if (query.dateFrom) {
        where.publishedAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.publishedAt.lte = new Date(query.dateTo);
      }
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [videoOrganics, total] = await Promise.all([
      this.prisma.videoOrganic.findMany({
        where,
        include: {
          socialChannel: {
            include: {
              competitor: {
                include: {
                  project: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.videoOrganic.count({ where }),
    ]);

    return { data: videoOrganics, total };
  }

  async findOneVideoOrganic(id: string) {
    return this.prisma.videoOrganic.findUnique({
      where: { id },
      include: {
        socialChannel: {
          include: {
            competitor: {
              include: {
                project: { select: { id: true, name: true } },
              },
            },
          },
        },
        snapshots: {
          orderBy: { capturedAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async bulkDeleteVideoOrganics(ids: string[]) {
    const deleted = await this.prisma.videoOrganic.deleteMany({
      where: { id: { in: ids } },
    });
    return { message: `${deleted.count} videos deleted`, count: deleted.count };
  }
}
```

### 6.8. Global Video Ads Admin Controller (`video-ads-admin.controller.ts`)
```typescript
@Controller('admin/video-ads')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class VideoAdsAdminController {
  constructor(private videoAdsAdminService: VideoAdsAdminService) {}

  @Get()
  async findAllVideoAds(@Query() query: ListVideoAdsQueryDto) {
    return this.videoAdsAdminService.findAllVideoAds(query);
  }

  @Get(':id')
  async findOneVideoAd(@Param('id') id: string) {
    return this.videoAdsAdminService.findOneVideoAd(id);
  }

  @Post('bulk-delete')
  async bulkDeleteVideoAds(@Body() dto: BulkDeleteDto) {
    return this.videoAdsAdminService.bulkDeleteVideoAds(dto.ids);
  }
}
```

### 6.8b. Global Video Organic Admin Controller (`video-organic-admin.controller.ts`)
```typescript
@Controller('admin/videos')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class VideoOrganicAdminController {
  constructor(private videoOrganicAdminService: VideoOrganicAdminService) {}

  @Get()
  async findAllVideoOrganics(@Query() query: ListVideoOrganicsQueryDto) {
    return this.videoOrganicAdminService.findAllVideoOrganics(query);
  }

  @Get(':id')
  async findOneVideoOrganic(@Param('id') id: string) {
    return this.videoOrganicAdminService.findOneVideoOrganic(id);
  }

  @Post('bulk-delete')
  async bulkDeleteVideoOrganics(@Body() dto: BulkDeleteDto) {
    return this.videoOrganicAdminService.bulkDeleteVideoOrganics(dto.ids);
  }
}
```

### 6.9. Updated Ads Library Admin Service (with social filter support)
```typescript
@Injectable()
export class AdsLibraryAdminService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAllAds(query: {
    projectId?: string;
    keywordId?: string;
    socialChannelId?: string; // NEW: filter by social channel
    pageId?: string; // NEW: filter by Facebook page ID
    platform?: 'META' | 'TIKTOK' | 'GOOGLE';
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.keywordId) {
      where.keywordId = query.keywordId;
    }
    if (query.socialChannelId) {
      where.socialChannelId = query.socialChannelId;
    }
    if (query.pageId) {
      where.pageId = query.pageId;
    }
    if (query.platform) {
      where.platform = query.platform;
    }
    if (query.startDate || query.endDate) {
      where.discoveredAt = {};
      if (query.startDate) {
        where.discoveredAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.discoveredAt.lte = new Date(query.endDate);
      }
    }

    const [ads, total] = await Promise.all([
      this.prisma.ad.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              user: { select: { id: true, email: true } },
            },
          },
          keyword: {
            select: {
              id: true,
              text: true,
            },
          },
          socialChannel: {
            select: {
              id: true,
              displayName: true,
              platform: true,
            },
          },
        },
        orderBy: { discoveredAt: 'desc' },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.ad.count({ where }),
    ]);

    return { data: ads, total };
  }

  // ... rest of methods remain the same
}
```

### 6.10. DTOs for Global Social & Video Management

#### ListSocialChannelsQueryDto (`list-social-channels.dto.ts`)
```typescript
export class ListSocialChannelsQueryDto {
  @IsOptional()
  @IsEnum(SocialPlatform)
  platform?: SocialPlatform;

  @IsOptional()
  @IsEnum(SocialChannelStatus)
  status?: SocialChannelStatus;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```

#### CreateSocialChannelAdminDto (`create-social-channel-admin.dto.ts`)
```typescript
export class CreateSocialChannelAdminDto {
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsString()
  displayName: string; // Required: social name

  @IsString()
  @IsUrl()
  profileUrl: string; // Required: canonical URL

  @IsUUID()
  @IsNotEmpty()
  projectId: string; // Required: channel must belong to a project

  @IsOptional()
  @IsString()
  platformId?: string; // External platform ID

  @IsOptional()
  @IsString()
  handle?: string; // @username

  @IsOptional()
  @IsString()
  advertiserId?: string; // For Ads Library queries

  @IsOptional()
  @IsUUID()
  competitorId?: string; // Optional: link to competitor (must belong to projectId)

  @IsOptional()
  @IsEnum(SocialChannelStatus)
  status?: SocialChannelStatus;
}
```

#### UpdateSocialChannelAdminDto (`update-social-channel-admin.dto.ts`)
```typescript
export class UpdateSocialChannelAdminDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  handle?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  profileUrl?: string;

  @IsOptional()
  @IsString()
  advertiserId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string | null; // null to unlink, must belong to channel's project if provided

  @IsOptional()
  @IsEnum(SocialChannelStatus)
  status?: SocialChannelStatus;
}
```

#### LinkCompetitorDto (`link-competitor.dto.ts`)
```typescript
export class LinkCompetitorDto {
  @IsOptional()
  @IsUUID()
  competitorId?: string | null; // null to unlink
}
```

#### BulkDeleteDto (`bulk-delete.dto.ts`)
```typescript
export class BulkDeleteDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  ids: string[];
}
```

#### ListVideoAdsQueryDto (`list-video-ads.dto.ts`)
```typescript
export class ListVideoAdsQueryDto {
  @IsOptional()
  @IsString()
  platform?: string; // 'tiktok', 'youtube', 'facebook', 'instagram'
  
  @IsOptional()
  @IsEnum(['META', 'TIKTOK', 'GOOGLE'])
  adPlatform?: string; // 'META', 'TIKTOK', 'GOOGLE'

  @IsOptional()
  @IsEnum(SocialPlatform)
  platform?: SocialPlatform;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  competitorId?: string;

  @IsOptional()
  @IsUUID()
  socialChannelId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
```
