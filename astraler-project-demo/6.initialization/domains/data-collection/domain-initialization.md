# Domain Initialization: Data Collection

> **Reference:** [System Initialization](../../system-initialization.md)  
> **Phase:** 2 (Data Engine)  
> **Priority:** P0 - Critical

---

## 1. Domain Structure Setup

### 1.1 Backend Folder Structure

```bash
# Create Data Collection module structure
mkdir -p backend/src/modules/data-collection/{controllers,services,processors,adapters,dto,events}

# Core files
touch backend/src/modules/data-collection/data-collection.module.ts
touch backend/src/modules/data-collection/controllers/crawl.controller.ts

# Services
touch backend/src/modules/data-collection/services/crawler-scheduler.service.ts
touch backend/src/modules/data-collection/services/store-crawler.service.ts
touch backend/src/modules/data-collection/services/social-crawler.service.ts

# Queue Processors
touch backend/src/modules/data-collection/processors/store.processor.ts
touch backend/src/modules/data-collection/processors/social-channel.processor.ts
touch backend/src/modules/data-collection/processors/social-content.processor.ts

# Adapters (3rd-party integrations)
touch backend/src/modules/data-collection/adapters/apify.adapter.ts
touch backend/src/modules/data-collection/adapters/searchapi.adapter.ts

# DTOs & Events
touch backend/src/modules/data-collection/dto/crawl.dto.ts
touch backend/src/modules/data-collection/events/crawl.events.ts
```

---

## 2. Domain Configuration

### 2.1 Install Dependencies

```bash
cd backend

# BullMQ for queue processing
npm install @nestjs/bullmq bullmq ioredis

# Scheduler
npm install @nestjs/schedule

# HTTP client
npm install axios
```

### 2.2 Environment Variables

Add to `backend/.env`:

```env
# Redis (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Apify (Social Media Scraping)
APIFY_API_KEY=your-apify-api-key

# SearchAPI (Store Data - optional)
SEARCHAPI_API_KEY=your-searchapi-key

# Crawler Configuration
CRAWLER_STORE_INTERVAL_DAYS=7
CRAWLER_SOCIAL_INTERVAL_HOURS=24
CRAWLER_ADS_INTERVAL_HOURS=4

# Rate Limiting
CRAWLER_MAX_CONCURRENT_JOBS=5
CRAWLER_RETRY_ATTEMPTS=3
CRAWLER_RETRY_DELAY_MS=5000
```

### 2.3 Module Registration

Update `backend/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
// ... other imports
import { DataCollectionModule } from './modules/data-collection/data-collection.module';

@Module({
  imports: [
    // ... existing imports
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
        },
      }),
    }),
    DataCollectionModule,
  ],
})
export class AppModule {}
```

---

## 3. Database Setup

### 3.1 Verify Prisma Models

Ensure these models exist in `backend/prisma/schema.prisma`:

```prisma
model SocialChannelSnapshot {
  id              String        @id @default(uuid())
  socialChannelId String
  socialChannel   SocialChannel @relation(fields: [socialChannelId], references: [id], onDelete: Cascade)
  
  followers       Int           @default(0)
  following       Int           @default(0)
  postsCount      Int           @default(0)
  videosCount     Int           @default(0)
  engagementRate  Float?
  
  capturedAt      DateTime      @default(now())

  @@index([socialChannelId, capturedAt])
}

model Video {
  id              String        @id @default(uuid())
  projectId       String
  project         Project       @relation(fields: [projectId], references: [id])
  socialChannelId String
  socialChannel   SocialChannel @relation(fields: [socialChannelId], references: [id], onDelete: Cascade)
  
  platform        String
  platformId      String
  type            VideoType     @default(ORGANIC)
  
  title           String
  description     String?       @db.Text
  thumbnailUrl    String?
  duration        Int
  
  views           Int           @default(0)
  likes           Int           @default(0)
  comments        Int           @default(0)
  shares          Int           @default(0)
  heroScore       Float         @default(0.0)
  
  createdAt       DateTime      @default(now())
  publishedAt     DateTime
  
  snapshots       VideoSnapshot[]

  @@unique([platform, platformId])
  @@index([projectId, publishedAt])
  @@index([projectId, heroScore])
  @@index([socialChannelId, publishedAt])
}

model VideoSnapshot {
  id         String   @id @default(uuid())
  videoId    String
  video      Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  views      Int
  likes      Int
  comments   Int      @default(0)
  shares     Int      @default(0)
  capturedAt DateTime @default(now())

  @@index([videoId, capturedAt])
}
```

---

## 4. Queue Setup

### 4.1 Queue Definitions

Create `backend/src/modules/data-collection/queues.ts`:

```typescript
export const QUEUES = {
  CRAWL: 'crawl-queue',
  ANALYSIS: 'analysis-queue',
} as const;

export const JOB_TYPES = {
  STORE_CRAWL: 'store-crawl',
  SOCIAL_CHANNEL_CRAWL: 'social-channel-crawl',
  SOCIAL_CONTENT_CRAWL: 'social-content-crawl',
  LANDING_PAGE_CRAWL: 'landing-page-crawl',
} as const;
```

### 4.2 Module with Queue

Create `backend/src/modules/data-collection/data-collection.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { HttpModule } from '@nestjs/axios';
import { QUEUES } from './queues';

// Controllers
import { CrawlController } from './controllers/crawl.controller';

// Services
import { CrawlerSchedulerService } from './services/crawler-scheduler.service';
import { StoreCrawlerService } from './services/store-crawler.service';
import { SocialCrawlerService } from './services/social-crawler.service';

// Processors
import { StoreProcessor } from './processors/store.processor';
import { SocialChannelProcessor } from './processors/social-channel.processor';
import { SocialContentProcessor } from './processors/social-content.processor';

// Adapters
import { ApifyAdapter } from './adapters/apify.adapter';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: QUEUES.CRAWL,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    }),
  ],
  controllers: [CrawlController],
  providers: [
    // Services
    CrawlerSchedulerService,
    StoreCrawlerService,
    SocialCrawlerService,
    // Processors
    StoreProcessor,
    SocialChannelProcessor,
    SocialContentProcessor,
    // Adapters
    ApifyAdapter,
  ],
  exports: [StoreCrawlerService, SocialCrawlerService],
})
export class DataCollectionModule {}
```

---

## 5. Adapters (3rd-Party Integrations)

### 5.1 Apify Adapter

Create `backend/src/modules/data-collection/adapters/apify.adapter.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface ApifyRunResult {
  id: string;
  status: string;
  defaultDatasetId: string;
}

@Injectable()
export class ApifyAdapter {
  private readonly logger = new Logger(ApifyAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.apify.com/v2';

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.apiKey = this.configService.get('APIFY_API_KEY', '');
  }

  async runActor<T>(actorId: string, input: Record<string, any>): Promise<T[]> {
    if (!this.apiKey) {
      this.logger.warn('Apify API key not configured');
      return [];
    }

    try {
      // Start the actor run
      const runResponse = await firstValueFrom(
        this.httpService.post<ApifyRunResult>(
          `${this.baseUrl}/acts/${actorId}/runs`,
          input,
          {
            params: { token: this.apiKey },
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      const runId = runResponse.data.id;
      this.logger.log(`Started Apify actor ${actorId}, run: ${runId}`);

      // Wait for completion
      await this.waitForRun(runId);

      // Get results
      const datasetId = runResponse.data.defaultDatasetId;
      return this.getDatasetItems<T>(datasetId);
    } catch (error) {
      this.logger.error(`Apify actor ${actorId} failed:`, error.message);
      throw error;
    }
  }

  private async waitForRun(runId: string, maxWaitMs = 300000): Promise<void> {
    const startTime = Date.now();
    const pollInterval = 5000;

    while (Date.now() - startTime < maxWaitMs) {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/actor-runs/${runId}`, {
          params: { token: this.apiKey },
        }),
      );

      const status = response.data.data.status;

      if (status === 'SUCCEEDED') {
        return;
      }

      if (status === 'FAILED' || status === 'ABORTED') {
        throw new Error(`Apify run ${runId} ${status}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Apify run ${runId} timed out`);
  }

  private async getDatasetItems<T>(datasetId: string): Promise<T[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/datasets/${datasetId}/items`, {
        params: { token: this.apiKey },
      }),
    );

    return response.data;
  }

  // Platform-specific actors
  async scrapeTikTokProfile(profileUrl: string) {
    return this.runActor('clockworks~free-tiktok-scraper', {
      profiles: [profileUrl],
      resultsPerPage: 1,
      shouldDownloadVideos: false,
    });
  }

  async scrapeTikTokVideos(profileUrl: string, maxVideos = 50) {
    return this.runActor('clockworks~free-tiktok-scraper', {
      profiles: [profileUrl],
      resultsPerPage: maxVideos,
      shouldDownloadVideos: false,
    });
  }

  async scrapeYouTubeChannel(channelUrl: string) {
    return this.runActor('bernardo~youtube-channel-scraper', {
      channelUrls: [channelUrl],
      maxVideos: 50,
    });
  }

  async scrapeInstagramProfile(username: string) {
    return this.runActor('apify~instagram-scraper', {
      directUrls: [`https://instagram.com/${username}`],
      resultsType: 'posts',
      resultsLimit: 50,
    });
  }
}
```

---

## 6. Processors (Queue Workers)

### 6.1 Social Channel Processor

Create `backend/src/modules/data-collection/processors/social-channel.processor.ts`:

```typescript
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/database/prisma.service';
import { ApifyAdapter } from '../adapters/apify.adapter';
import { QUEUES, JOB_TYPES } from '../queues';

interface SocialChannelJobData {
  socialChannelId: string;
  competitorId: string;
  platform: string;
  profileUrl: string;
}

@Processor(QUEUES.CRAWL)
export class SocialChannelProcessor extends WorkerHost {
  private readonly logger = new Logger(SocialChannelProcessor.name);

  constructor(
    private prisma: PrismaService,
    private apify: ApifyAdapter,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<SocialChannelJobData>) {
    if (job.name !== JOB_TYPES.SOCIAL_CHANNEL_CRAWL) {
      return;
    }

    const { socialChannelId, platform, profileUrl } = job.data;
    this.logger.log(`Processing social channel: ${socialChannelId} (${platform})`);

    try {
      let profileData: any;

      switch (platform) {
        case 'TIKTOK':
          const tiktokResult = await this.apify.scrapeTikTokProfile(profileUrl);
          profileData = tiktokResult[0];
          break;
        case 'YOUTUBE':
          const youtubeResult = await this.apify.scrapeYouTubeChannel(profileUrl);
          profileData = youtubeResult[0];
          break;
        case 'INSTAGRAM':
          const handle = profileUrl.split('/').pop();
          const igResult = await this.apify.scrapeInstagramProfile(handle!);
          profileData = igResult[0];
          break;
        default:
          this.logger.warn(`Unsupported platform: ${platform}`);
          return;
      }

      if (!profileData) {
        throw new Error('No profile data returned');
      }

      // Update channel and create snapshot
      await this.updateChannelData(socialChannelId, platform, profileData);

      // Emit event to trigger content crawl
      this.eventEmitter.emit('social-channel.crawled', {
        socialChannelId,
        platform,
      });

      return { success: true, socialChannelId };
    } catch (error) {
      this.logger.error(`Failed to crawl channel ${socialChannelId}:`, error.message);
      throw error;
    }
  }

  private async updateChannelData(channelId: string, platform: string, data: any) {
    const normalized = this.normalizeProfileData(platform, data);

    // Update channel
    await this.prisma.socialChannel.update({
      where: { id: channelId },
      data: {
        displayName: normalized.displayName,
        avatarUrl: normalized.avatarUrl,
        bio: normalized.bio,
        isVerified: normalized.isVerified,
      },
    });

    // Create snapshot
    await this.prisma.socialChannelSnapshot.create({
      data: {
        socialChannelId: channelId,
        followers: normalized.followers,
        following: normalized.following,
        postsCount: normalized.postsCount,
        videosCount: normalized.videosCount,
        engagementRate: normalized.engagementRate,
      },
    });
  }

  private normalizeProfileData(platform: string, data: any) {
    switch (platform) {
      case 'TIKTOK':
        return {
          displayName: data.nickname || data.name,
          avatarUrl: data.avatarThumb || data.avatar,
          bio: data.signature || data.bio,
          isVerified: data.verified || false,
          followers: data.fans || data.followerCount || 0,
          following: data.following || 0,
          postsCount: data.video || data.videoCount || 0,
          videosCount: data.video || data.videoCount || 0,
          engagementRate: null,
        };
      case 'YOUTUBE':
        return {
          displayName: data.channelName || data.title,
          avatarUrl: data.channelAvatar || data.thumbnail,
          bio: data.description,
          isVerified: data.isVerified || false,
          followers: data.subscriberCount || 0,
          following: 0,
          postsCount: data.videoCount || 0,
          videosCount: data.videoCount || 0,
          engagementRate: null,
        };
      case 'INSTAGRAM':
        return {
          displayName: data.fullName || data.username,
          avatarUrl: data.profilePicUrl,
          bio: data.biography,
          isVerified: data.isVerified || false,
          followers: data.followersCount || 0,
          following: data.followingCount || 0,
          postsCount: data.postsCount || 0,
          videosCount: data.igtvVideoCount || 0,
          engagementRate: null,
        };
      default:
        return {
          displayName: 'Unknown',
          avatarUrl: null,
          bio: null,
          isVerified: false,
          followers: 0,
          following: 0,
          postsCount: 0,
          videosCount: 0,
          engagementRate: null,
        };
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, error.message);
  }
}
```

---

## 7. Scheduler Service

Create `backend/src/modules/data-collection/services/crawler-scheduler.service.ts`:

```typescript
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/database/prisma.service';
import { QUEUES, JOB_TYPES } from '../queues';

@Injectable()
export class CrawlerSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(CrawlerSchedulerService.name);

  constructor(
    @InjectQueue(QUEUES.CRAWL) private crawlQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    this.logger.log('Crawler Scheduler initialized');
  }

  // Run social channel crawl daily at 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async scheduleDailySocialCrawl() {
    this.logger.log('Starting daily social channel crawl...');

    const channels = await this.prisma.socialChannel.findMany({
      select: {
        id: true,
        competitorId: true,
        platform: true,
        profileUrl: true,
      },
    });

    for (const channel of channels) {
      await this.crawlQueue.add(
        JOB_TYPES.SOCIAL_CHANNEL_CRAWL,
        {
          socialChannelId: channel.id,
          competitorId: channel.competitorId,
          platform: channel.platform,
          profileUrl: channel.profileUrl,
        },
        {
          delay: Math.random() * 60000, // Random delay to avoid rate limits
        },
      );
    }

    this.logger.log(`Queued ${channels.length} social channel crawl jobs`);
  }

  // Event listeners for on-demand crawls
  @OnEvent('social-channel.added')
  async onSocialChannelAdded(payload: { socialChannelId: string; competitorId: string }) {
    const channel = await this.prisma.socialChannel.findUnique({
      where: { id: payload.socialChannelId },
    });

    if (!channel) return;

    await this.crawlQueue.add(JOB_TYPES.SOCIAL_CHANNEL_CRAWL, {
      socialChannelId: channel.id,
      competitorId: payload.competitorId,
      platform: channel.platform,
      profileUrl: channel.profileUrl,
    });

    this.logger.log(`Queued immediate crawl for new channel: ${channel.id}`);
  }

  @OnEvent('competitor.added')
  async onCompetitorAdded(payload: { competitorId: string; storeUrl: string }) {
    await this.crawlQueue.add(JOB_TYPES.STORE_CRAWL, {
      competitorId: payload.competitorId,
      storeUrl: payload.storeUrl,
    });

    this.logger.log(`Queued store crawl for new competitor: ${payload.competitorId}`);
  }

  // Manual trigger
  async forceRefresh(competitorId: string) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id: competitorId },
      include: { socialChannels: true },
    });

    if (!competitor) {
      throw new Error('Competitor not found');
    }

    // Queue store crawl
    await this.crawlQueue.add(JOB_TYPES.STORE_CRAWL, {
      competitorId: competitor.id,
      storeUrl: competitor.storeUrl,
    });

    // Queue all social channels
    for (const channel of competitor.socialChannels) {
      await this.crawlQueue.add(JOB_TYPES.SOCIAL_CHANNEL_CRAWL, {
        socialChannelId: channel.id,
        competitorId: competitor.id,
        platform: channel.platform,
        profileUrl: channel.profileUrl,
      });
    }

    return { queued: 1 + competitor.socialChannels.length };
  }
}
```

---

## 8. Controller

Create `backend/src/modules/data-collection/controllers/crawl.controller.ts`:

```typescript
import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { CrawlerSchedulerService } from '../services/crawler-scheduler.service';
import { QUEUES } from '../queues';

@ApiTags('Crawl')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crawl')
export class CrawlController {
  constructor(
    @InjectQueue(QUEUES.CRAWL) private crawlQueue: Queue,
    private schedulerService: CrawlerSchedulerService,
  ) {}

  @Post('force-refresh/:competitorId')
  @ApiOperation({ summary: 'Force immediate crawl for competitor' })
  async forceRefresh(@Param('competitorId') competitorId: string) {
    return this.schedulerService.forceRefresh(competitorId);
  }

  @Get('queue/stats')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get queue statistics' })
  async getQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.crawlQueue.getWaitingCount(),
      this.crawlQueue.getActiveCount(),
      this.crawlQueue.getCompletedCount(),
      this.crawlQueue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
    };
  }
}
```

---

## 9. Verification Checklist

### Infrastructure
- [ ] Redis running and accessible
- [ ] BullMQ configured in AppModule
- [ ] Queues created successfully
- [ ] Bull Board accessible (optional)

### Adapters
- [ ] Apify API key configured
- [ ] Apify adapter methods working
- [ ] Error handling in place

### Processors
- [ ] Store processor implemented
- [ ] Social channel processor implemented
- [ ] Social content processor implemented
- [ ] Retry logic working

### Scheduler
- [ ] Cron jobs configured
- [ ] Event listeners active
- [ ] Force refresh API working

### Events
- [ ] `social-channel.added` triggering crawl
- [ ] `competitor.added` triggering crawl
- [ ] `social-channel.crawled` emitting

---

## 10. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/crawl/force-refresh/:competitorId` | Force immediate crawl |
| GET | `/crawl/queue/stats` | Get queue statistics |

---

**Next Step:** Proceed to Data Processing Domain Initialization.

