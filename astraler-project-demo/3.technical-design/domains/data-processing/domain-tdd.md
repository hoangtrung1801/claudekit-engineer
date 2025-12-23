# Domain TDD: Data Processing

## 1. Module Structure
```text
src/modules/data-processing/
├── dto/
│   ├── normalize-video.dto.ts
│   ├── normalize-post.dto.ts
│   └── hero-detection.dto.ts
├── entities/
│   ├── video.entity.ts (Prisma)
│   └── social-post.entity.ts (Prisma)
├── normalization/
│   ├── normalization.service.ts
│   ├── strategies/
│   │   ├── tiktok.strategy.ts
│   │   ├── youtube.strategy.ts
│   │   ├── instagram.strategy.ts
│   │   └── facebook.strategy.ts
├── processors/
│   ├── video-processing.processor.ts
│   ├── post-processing.processor.ts
│   └── hero-detection.processor.ts
├── services/
│   └── hero-detection.service.ts
└── data-processing.module.ts
```

## 2. Database Models (Reference)
See Master Schema in `database-schema.md` for full definitions:
- `Video`, `VideoSnapshot` — video content and metrics history
- `SocialPost`, `SocialPostSnapshot` — non-video content (images, carousels, stories)

## 3. Normalization Service (`normalization.service.ts`)
```typescript
@Injectable()
export class NormalizationService {
  normalizeVideo(data: any, platform: SocialPlatform): Partial<Video> {
    switch(platform) {
      case 'TIKTOK': return this.normalizeTikTokVideo(data);
      case 'YOUTUBE': return this.normalizeYouTubeVideo(data);
      case 'INSTAGRAM': return this.normalizeInstagramVideo(data);
      default: throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  normalizePost(data: any, platform: SocialPlatform): Partial<SocialPost> {
    switch(platform) {
      case 'INSTAGRAM': return this.normalizeInstagramPost(data);
      case 'FACEBOOK': return this.normalizeFacebookPost(data);
      case 'X': return this.normalizeXPost(data);
      default: throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  private normalizeTikTokVideo(data: any): Partial<Video> {
    return {
      platformId: data.id,
      title: data.desc || 'Untitled',
      description: data.desc,
      thumbnailUrl: data.cover,
      duration: data.duration,
      views: data.stats?.playCount || 0,
      likes: data.stats?.diggCount || 0,
      comments: data.stats?.commentCount || 0,
      shares: data.stats?.shareCount || 0,
      type: data.isAd ? 'AD' : 'ORGANIC',
      publishedAt: new Date(data.createTime * 1000)
    };
  }

  private normalizeInstagramPost(data: any): Partial<SocialPost> {
    return {
      platformId: data.id,
      contentType: this.mapInstagramType(data.type),
      contentUrl: data.url,
      thumbnailUrl: data.thumbnail,
      caption: data.caption,
      views: data.views || 0,
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: 0, // Instagram doesn't expose shares
      publishedAt: new Date(data.timestamp)
    };
  }

  private mapInstagramType(type: string): SocialPostType {
    const mapping = {
      'image': 'IMAGE',
      'sidecar': 'CAROUSEL',
      'video': 'REEL',  // Short videos are usually Reels
      'story': 'STORY'
    };
    return mapping[type] || 'IMAGE';
  }
}
```

## 4. Hero Detection Service (`hero-detection.service.ts`)
```typescript
@Injectable()
export class HeroDetectionService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  /**
   * Calculates hero score based on growth velocity.
   * A "Hero Video" shows exceptional growth (>20% in 24h).
   */
  async calculateHeroScore(videoId: string): Promise<number> {
    const snapshots = await this.prisma.videoSnapshot.findMany({
      where: { videoId },
      orderBy: { capturedAt: 'desc' },
      take: 2
    });

    if (snapshots.length < 2) return 0;

    const [current, previous] = snapshots;
    const hoursDiff = (current.capturedAt.getTime() - previous.capturedAt.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 48 || hoursDiff < 1) return 0; // Invalid time window

    const viewGrowth = previous.views > 0 
      ? ((current.views - previous.views) / previous.views) * 100 
      : 0;

    // Normalize to 24h growth rate
    const normalized24hGrowth = (viewGrowth / hoursDiff) * 24;

    return Math.min(normalized24hGrowth, 100); // Cap at 100
  }

  async checkAndMarkHero(videoId: string): Promise<void> {
    const heroScore = await this.calculateHeroScore(videoId);

    await this.prisma.video.update({
      where: { id: videoId },
      data: { heroScore }
    });

    // Threshold: 20% growth in 24h = hero video
    if (heroScore >= 20) {
      this.eventEmitter.emit('hero.detected', { videoId, heroScore });
    }
  }
}
```

## 5. Video Processing Processor (`video-processing.processor.ts`)
```typescript
@Processor('data-processing')
export class VideoProcessingProcessor extends WorkerHost {
  constructor(
    private normalizeService: NormalizationService,
    private heroService: HeroDetectionService,
    private prisma: PrismaService
  ) { super(); }

  async process(job: Job<{ videoId: string }>) {
    const { videoId } = job.data;

    // Run hero detection after new snapshot is created
    await this.heroService.checkAndMarkHero(videoId);
  }
}
```

## 6. Post Processing Processor (`post-processing.processor.ts`)
```typescript
@Processor('data-processing')
export class PostProcessingProcessor extends WorkerHost {
  constructor(
    private normalizeService: NormalizationService,
    private prisma: PrismaService
  ) { super(); }

  async process(job: Job<{ socialPostId: string }>) {
    // Currently just logs; future: engagement analysis, trend detection
    const post = await this.prisma.socialPost.findUnique({
      where: { id: job.data.socialPostId },
      include: { snapshots: { orderBy: { capturedAt: 'desc' }, take: 2 } }
    });

    // Calculate engagement trends if needed
    if (post.snapshots.length >= 2) {
      // Similar growth calculation as hero detection
    }
  }
}
```
