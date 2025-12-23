# Domain Initialization: Data Processing

> **Reference:** [System Initialization](../../system-initialization.md)  
> **Phase:** 2 (Data Engine)  
> **Priority:** P1 - High

---

## 1. Domain Structure Setup

### 1.1 Backend Folder Structure

```bash
# Create Data Processing module structure
mkdir -p backend/src/modules/data-processing/{services,transformers,events}

# Core files
touch backend/src/modules/data-processing/data-processing.module.ts

# Services
touch backend/src/modules/data-processing/services/normalization.service.ts
touch backend/src/modules/data-processing/services/hero-detection.service.ts
touch backend/src/modules/data-processing/services/text-cleaning.service.ts
touch backend/src/modules/data-processing/services/deduplication.service.ts

# Transformers
touch backend/src/modules/data-processing/transformers/base.transformer.ts
touch backend/src/modules/data-processing/transformers/tiktok.transformer.ts
touch backend/src/modules/data-processing/transformers/youtube.transformer.ts
touch backend/src/modules/data-processing/transformers/instagram.transformer.ts

# Events
touch backend/src/modules/data-processing/events/processing.events.ts
```

---

## 2. Domain Configuration

### 2.1 Environment Variables

Add to `backend/.env`:

```env
# Hero Video Detection
HERO_THRESHOLD=20
HERO_LOOKBACK_HOURS=24

# Text Processing
MAX_TEXT_LENGTH=5000
```

### 2.2 Module Registration

Update `backend/src/app.module.ts`:

```typescript
import { DataProcessingModule } from './modules/data-processing/data-processing.module';

@Module({
  imports: [
    // ... existing imports
    DataProcessingModule,
  ],
})
export class AppModule {}
```

---

## 3. Module Setup

Create `backend/src/modules/data-processing/data-processing.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { NormalizationService } from './services/normalization.service';
import { HeroDetectionService } from './services/hero-detection.service';
import { TextCleaningService } from './services/text-cleaning.service';
import { DeduplicationService } from './services/deduplication.service';
import { TikTokTransformer } from './transformers/tiktok.transformer';
import { YouTubeTransformer } from './transformers/youtube.transformer';
import { InstagramTransformer } from './transformers/instagram.transformer';

@Module({
  providers: [
    NormalizationService,
    HeroDetectionService,
    TextCleaningService,
    DeduplicationService,
    TikTokTransformer,
    YouTubeTransformer,
    InstagramTransformer,
  ],
  exports: [
    NormalizationService,
    HeroDetectionService,
    TextCleaningService,
  ],
})
export class DataProcessingModule {}
```

---

## 4. Transformers

### 4.1 Base Transformer

Create `backend/src/modules/data-processing/transformers/base.transformer.ts`:

```typescript
export interface CanonicalVideo {
  platformId: string;
  platform: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  publishedAt: Date;
}

export interface CanonicalChannel {
  platformId: string;
  platform: string;
  handle: string | null;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  followers: number;
  following: number;
  postsCount: number;
  videosCount: number;
}

export abstract class BaseTransformer {
  abstract platform: string;
  abstract transformVideo(raw: any): CanonicalVideo;
  abstract transformChannel(raw: any): CanonicalChannel;
}
```

### 4.2 TikTok Transformer

Create `backend/src/modules/data-processing/transformers/tiktok.transformer.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { BaseTransformer, CanonicalVideo, CanonicalChannel } from './base.transformer';

@Injectable()
export class TikTokTransformer extends BaseTransformer {
  platform = 'TIKTOK';

  transformVideo(raw: any): CanonicalVideo {
    return {
      platformId: raw.id || raw.videoId,
      platform: this.platform,
      title: raw.desc || raw.text || '',
      description: raw.desc || raw.text || null,
      thumbnailUrl: raw.cover || raw.thumbnail || null,
      duration: raw.duration || 0,
      views: raw.playCount || raw.plays || raw.views || 0,
      likes: raw.diggCount || raw.likes || 0,
      comments: raw.commentCount || raw.comments || 0,
      shares: raw.shareCount || raw.shares || 0,
      publishedAt: new Date(raw.createTime * 1000 || raw.createdAt),
    };
  }

  transformChannel(raw: any): CanonicalChannel {
    return {
      platformId: raw.id || raw.userId,
      platform: this.platform,
      handle: raw.uniqueId || raw.username,
      displayName: raw.nickname || raw.name,
      avatarUrl: raw.avatarThumb || raw.avatar,
      bio: raw.signature || raw.bio,
      isVerified: raw.verified || false,
      followers: raw.fans || raw.followerCount || 0,
      following: raw.following || 0,
      postsCount: raw.video || raw.videoCount || 0,
      videosCount: raw.video || raw.videoCount || 0,
    };
  }
}
```

### 4.3 YouTube Transformer

Create `backend/src/modules/data-processing/transformers/youtube.transformer.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { BaseTransformer, CanonicalVideo, CanonicalChannel } from './base.transformer';

@Injectable()
export class YouTubeTransformer extends BaseTransformer {
  platform = 'YOUTUBE';

  transformVideo(raw: any): CanonicalVideo {
    return {
      platformId: raw.id || raw.videoId,
      platform: this.platform,
      title: raw.title || '',
      description: raw.description || null,
      thumbnailUrl: raw.thumbnailUrl || raw.thumbnail || null,
      duration: this.parseDuration(raw.duration),
      views: raw.viewCount || raw.views || 0,
      likes: raw.likeCount || raw.likes || 0,
      comments: raw.commentCount || raw.comments || 0,
      shares: 0, // YouTube doesn't expose shares
      publishedAt: new Date(raw.uploadDate || raw.publishedAt),
    };
  }

  transformChannel(raw: any): CanonicalChannel {
    return {
      platformId: raw.channelId || raw.id,
      platform: this.platform,
      handle: raw.channelHandle || raw.customUrl,
      displayName: raw.channelName || raw.title,
      avatarUrl: raw.channelAvatar || raw.thumbnail,
      bio: raw.description,
      isVerified: raw.isVerified || false,
      followers: raw.subscriberCount || 0,
      following: 0,
      postsCount: raw.videoCount || 0,
      videosCount: raw.videoCount || 0,
    };
  }

  private parseDuration(duration: string | number): number {
    if (typeof duration === 'number') return duration;
    if (!duration) return 0;

    // Parse ISO 8601 duration (PT1H2M3S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
  }
}
```

---

## 5. Services

### 5.1 Normalization Service

Create `backend/src/modules/data-processing/services/normalization.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { TikTokTransformer } from '../transformers/tiktok.transformer';
import { YouTubeTransformer } from '../transformers/youtube.transformer';
import { InstagramTransformer } from '../transformers/instagram.transformer';
import { CanonicalVideo, CanonicalChannel, BaseTransformer } from '../transformers/base.transformer';

@Injectable()
export class NormalizationService {
  private readonly logger = new Logger(NormalizationService.name);
  private transformers: Map<string, BaseTransformer>;

  constructor(
    private tiktokTransformer: TikTokTransformer,
    private youtubeTransformer: YouTubeTransformer,
    private instagramTransformer: InstagramTransformer,
  ) {
    this.transformers = new Map([
      ['TIKTOK', this.tiktokTransformer],
      ['YOUTUBE', this.youtubeTransformer],
      ['INSTAGRAM', this.instagramTransformer],
    ]);
  }

  normalizeVideo(platform: string, rawData: any): CanonicalVideo | null {
    const transformer = this.transformers.get(platform);
    if (!transformer) {
      this.logger.warn(`No transformer for platform: ${platform}`);
      return null;
    }

    try {
      return transformer.transformVideo(rawData);
    } catch (error) {
      this.logger.error(`Failed to transform video from ${platform}:`, error.message);
      return null;
    }
  }

  normalizeChannel(platform: string, rawData: any): CanonicalChannel | null {
    const transformer = this.transformers.get(platform);
    if (!transformer) {
      this.logger.warn(`No transformer for platform: ${platform}`);
      return null;
    }

    try {
      return transformer.transformChannel(rawData);
    } catch (error) {
      this.logger.error(`Failed to transform channel from ${platform}:`, error.message);
      return null;
    }
  }

  normalizeVideos(platform: string, rawVideos: any[]): CanonicalVideo[] {
    return rawVideos
      .map((raw) => this.normalizeVideo(platform, raw))
      .filter((v): v is CanonicalVideo => v !== null);
  }
}
```

### 5.2 Hero Detection Service

Create `backend/src/modules/data-processing/services/hero-detection.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/database/prisma.service';

interface HeroDetectionResult {
  videoId: string;
  heroScore: number;
  isHero: boolean;
  viewGrowth: number;
  engagementGrowth: number;
}

@Injectable()
export class HeroDetectionService {
  private readonly logger = new Logger(HeroDetectionService.name);
  private readonly threshold: number;
  private readonly lookbackHours: number;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.threshold = this.configService.get('HERO_THRESHOLD', 20);
    this.lookbackHours = this.configService.get('HERO_LOOKBACK_HOURS', 24);
  }

  async detectHeroVideo(videoId: string): Promise<HeroDetectionResult> {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      include: {
        snapshots: {
          orderBy: { capturedAt: 'desc' },
          take: 2,
        },
      },
    });

    if (!video) {
      throw new Error(`Video not found: ${videoId}`);
    }

    const [current, previous] = video.snapshots;

    // If no previous snapshot, video is too new
    if (!previous) {
      return {
        videoId,
        heroScore: 0,
        isHero: false,
        viewGrowth: 0,
        engagementGrowth: 0,
      };
    }

    // Calculate growth rates
    const viewGrowth = this.calculateGrowthRate(previous.views, current.views);
    const engagementGrowth = this.calculateEngagementGrowth(previous, current);

    // Calculate hero score (weighted average)
    const heroScore = viewGrowth * 0.7 + engagementGrowth * 0.3;
    const isHero = heroScore >= this.threshold;

    // Update video
    await this.prisma.video.update({
      where: { id: videoId },
      data: { heroScore },
    });

    // Emit event if hero detected
    if (isHero) {
      this.eventEmitter.emit('hero-video.detected', {
        videoId,
        heroScore,
        viewGrowth,
        competitorName: video.socialChannel?.competitor?.name,
      });

      this.logger.log(`🔥 Hero Video detected: ${videoId} (score: ${heroScore.toFixed(2)})`);
    }

    return {
      videoId,
      heroScore,
      isHero,
      viewGrowth,
      engagementGrowth,
    };
  }

  private calculateGrowthRate(previous: number, current: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  private calculateEngagementGrowth(
    previous: { likes: number; comments: number; shares: number },
    current: { likes: number; comments: number; shares: number },
  ): number {
    const prevEngagement = previous.likes + previous.comments + previous.shares;
    const currEngagement = current.likes + current.comments + current.shares;
    return this.calculateGrowthRate(prevEngagement, currEngagement);
  }

  // Run hero detection on all recent videos daily
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async runDailyHeroDetection() {
    this.logger.log('Starting daily hero detection...');

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7); // Check videos from last 7 days

    const videos = await this.prisma.video.findMany({
      where: {
        publishedAt: { gte: cutoff },
        snapshots: { some: {} }, // Has at least one snapshot
      },
      select: { id: true },
    });

    let heroCount = 0;
    for (const video of videos) {
      const result = await this.detectHeroVideo(video.id);
      if (result.isHero) heroCount++;
    }

    this.logger.log(`Hero detection complete: ${heroCount}/${videos.length} videos are heroes`);
  }

  // Event listener for new video snapshots
  @OnEvent('video.snapshot.created')
  async onVideoSnapshotCreated(payload: { videoId: string }) {
    await this.detectHeroVideo(payload.videoId);
  }
}
```

### 5.3 Text Cleaning Service

Create `backend/src/modules/data-processing/services/text-cleaning.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TextCleaningService {
  private readonly maxLength: number;

  constructor(private configService: ConfigService) {
    this.maxLength = this.configService.get('MAX_TEXT_LENGTH', 5000);
  }

  clean(text: string | null | undefined): string {
    if (!text) return '';

    let cleaned = text;

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    cleaned = cleaned
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");

    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Truncate if too long
    if (cleaned.length > this.maxLength) {
      cleaned = cleaned.substring(0, this.maxLength) + '...';
    }

    return cleaned;
  }

  removeEmojis(text: string): string {
    return text.replace(
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
      '',
    );
  }

  extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }

  removeUrls(text: string): string {
    return text.replace(/(https?:\/\/[^\s]+)/g, '').trim();
  }

  prepareForAI(text: string): string {
    let prepared = this.clean(text);
    prepared = this.removeEmojis(prepared);
    prepared = this.removeUrls(prepared);
    return prepared;
  }

  chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

    const sentences = text.split(/(?<=[.!?])\s+/);

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());

    return chunks;
  }
}
```

---

## 6. Events

Create `backend/src/modules/data-processing/events/processing.events.ts`:

```typescript
export class HeroVideoDetectedEvent {
  constructor(
    public readonly videoId: string,
    public readonly heroScore: number,
    public readonly viewGrowth: number,
    public readonly competitorName?: string,
  ) {}
}

export class VideoProcessedEvent {
  constructor(
    public readonly videoId: string,
    public readonly platform: string,
  ) {}
}
```

---

## 7. Verification Checklist

### Transformers
- [ ] TikTok transformer implemented
- [ ] YouTube transformer implemented
- [ ] Instagram transformer implemented
- [ ] All transformers tested with sample data

### Services
- [ ] Normalization service working
- [ ] Hero detection algorithm correct
- [ ] Text cleaning working
- [ ] Deduplication logic implemented

### Events
- [ ] `hero-video.detected` emitting
- [ ] `video.snapshot.created` listener active
- [ ] Daily cron job scheduled

### Testing
- [ ] Unit tests for transformers
- [ ] Unit tests for hero detection
- [ ] Integration tests

---

## 8. Hero Detection Algorithm Summary

```
Input: VideoId

1. Get current video metrics
2. Get previous snapshot (24h ago)
3. If no previous snapshot → skip (too new)
4. Calculate:
   - view_growth = (current - previous) / previous * 100
   - engagement_growth = same formula for likes+comments+shares
5. hero_score = view_growth * 0.7 + engagement_growth * 0.3
6. If hero_score >= 20:
   - Mark as hero
   - Emit 'hero-video.detected' event
7. Update video.heroScore in database
```

---

**Next Step:** Proceed to AI Analysis Domain Initialization.

