# Domain TDD: Data Collection

> **✅ Unified API Architecture:** All controllers in this domain should use `ProjectAccessGuard` for role-based access control. See `docs/3.technical-design/UNIFIED-API-ARCHITECTURE-PATTERN.md` for details.

## 1. Module Structure
```text
src/modules/data-collection/
├── adapters/
│   ├── apify.adapter.ts           # Apify API integration
│   └── playwright.service.ts      # Headless Browser for landing pages
├── dto/
│   ├── crawl-social-channel.dto.ts
│   ├── crawl-social-post.dto.ts
│   └── crawl-video.dto.ts
├── entities/
│   ├── social-channel.entity.ts   # Prisma Type
│   ├── social-post.entity.ts
│   └── video.entity.ts
├── processors/
│   ├── social-channel.processor.ts  # Crawl channel profiles
│   ├── social-content.processor.ts  # Crawl videos & posts
│   └── landing-page.processor.ts    # Social discovery from landing pages
├── queues/
│   └── crawl.queue.ts
├── data-collection.service.ts
└── data-collection.module.ts
```

## 2. Database Models (Reference)
See Master Schema in `database-schema.md` for full definitions:
- `Competitor` — competitor app metadata (name, developer, category, description, rating, ratingsCount, bundleId)
- `CompetitorScreenshot` — competitor app screenshots (url, position)
- **Platform Profiles/Pages** (e.g., `SocialChannel` / ProfilePage) — competitor/advertiser profiles on each platform (TikTok, YouTube, Instagram, Facebook, X, Google Ads).
  - `competitorId` is **optional**: a social channel can either:
    - Be owned by a tracked `Competitor` (official/app-owned channels), or
    - Be an **independent advertiser / brand channel** discovered from ads libraries or manually added by the user (no direct competitor mapping yet).
  - `advertiserId` (optional) stores the platform-specific Advertiser ID used for Ads Transparency / Ads Library queries.
  - `discoverySource` tracks how the channel entered the system (`MANUAL`, `LANDING_PAGE`, `ADS_LIBRARY`, `IMPORT`).
- **Profile Snapshots** (e.g., `SocialChannelSnapshot`) — profile metrics over time (followers, posts/videos counts, engagement).
- **Platform Posts (Video & Non-Video)** (e.g., `VideoAds`, `VideoOrganic`, `SocialPost`) — posts/content items attached to a ProfilePage.
  - **`VideoAds`** — Videos discovered directly from Ads Library Transparency APIs (Meta, TikTok, Google Ads).
    - Created immediately when Ads Library crawler finds video ads
    - Contains ad-specific fields: video URLs (videoUrl, videoHdUrl, videoSdUrl), advertiser info, impressions, spend, ad status
    - Linked to SocialChannel via advertiserId (advertiser profile)
    - **Separate table** from Video Organic due to different data structure
  - **`VideoOrganic`** — Videos discovered from social profile crawlers.
    - Created from competitor/brand social channel profiles using platform APIs
    - Contains engagement metrics: views, likes, comments, shares from social platforms
    - Contains standard video metadata from platform APIs (Apify, etc.)
    - Linked to SocialChannel via platformId (social profile)
    - **Separate table** from Video Ads due to different data structure
- `VideoAdsSnapshot` — ad metrics over time (impressions, spend).
- `VideoOrganicSnapshot` — engagement metrics over time (views, likes, comments, shares).
- `SocialPostSnapshot` — non-video post metrics over time.

## 3. Store Processor (`store.processor.ts`)

> ⚠️ **Important**: Store Processor must collect the same comprehensive metadata as Project Info crawler for consistency.

```typescript
@Processor(CRAWL_QUEUE)
export class StoreProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private searchApiAdapter: SearchAPIAdapter,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<StoreCrawlJobData, CrawlJobResult>): Promise<CrawlJobResult> {
    const { competitorId, storeUrl, platform } = job.data;

    // 1. Extract product ID from store URL
    const productId = SearchAPIAdapter.extractAppleProductId(storeUrl);
    if (!productId) {
      throw new Error(`Could not extract product ID from URL: ${storeUrl}`);
    }

    // 2. Fetch app metadata from App Store
    const product = await this.searchApiAdapter.getAppleProduct(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    // 3. Update Competitor with fetched metadata (same fields as Project Info crawler)
    await this.prisma.competitor.update({
      where: { id: competitorId },
      data: {
        name: product.name,
        developerName: product.developer,
        iconUrl: product.logo || '',
        storeCategory: product.category,
        // Additional metadata fields (same as Project Info)
        description: product.description || undefined,
        rating: product.rating || undefined,
        ratingsCount: product.ratings_count || undefined,
        bundleId: product.product_id || undefined,
      },
    });

    // 4. Save screenshots (same pattern as ProjectScreenshot)
    if (product.screenshots && product.screenshots.length > 0) {
      // Delete existing screenshots first
      await this.prisma.competitorScreenshot.deleteMany({
        where: { competitorId },
      });

      // Create new screenshots
      for (let i = 0; i < product.screenshots.length; i++) {
        await this.prisma.competitorScreenshot.create({
          data: {
            competitorId,
            url: product.screenshots[i],
            position: i,
          },
        });
      }
    }

    // 5. Auto-create landing page from developer website if available
    if (product.website) {
      await this.createLandingPageIfNotExists(competitorId, product.website);
    }

    // 6. Fetch and save reviews
    const reviews = await this.searchApiAdapter.getAppleReviewsPaginated(productId, 3);
    for (const review of reviews) {
      await this.prisma.review.create({
        data: {
          competitorId,
          rating: review.rating,
          text: review.text || review.title,
          sentiment: this.analyzeSentiment(review.rating),
          postedAt: new Date(review.review_date),
        },
      });
    }

    // 7. Save app updates (version history)
    // ⚠️ ISSUE IDENTIFIED: Current implementation only saves first 10 versions from API response
    // Problem: API may return only latest versions in each crawl, causing incomplete timeline
    // Solution Required: Save ALL versions from response, not just slice(0, 10)
    // UI Requirement: What's New page needs full version history timeline (see docs/4.ui-design/domains/external/whats-new-ui.md)
    if (product.version_history) {
      // TODO: Remove .slice(0, 10) limitation to save complete version history
      // Current: Only saves first 10 versions from response
      // Required: Save all versions to support timeline view in UI
      for (const version of product.version_history.slice(0, 10)) {
        await this.prisma.appUpdate.upsert({
          where: {
            competitorId_version: {
              competitorId,
              version: version.version,
            },
          },
          create: {
            competitorId,
            version: version.version,
            releaseDate: new Date(version.date),
            changelog: version.notes || 'No release notes',
          },
          update: {
            changelog: version.notes || 'No release notes',
            // Note: releaseDate should not be updated if version already exists
            // to preserve original release date
          },
        });
      }
    }

    // 8. Emit event for downstream processing
    this.eventEmitter.emit('competitor.metadata.updated', {
      competitorId,
      platform,
    });

    return {
      success: true,
      jobType: CrawlJobType.STORE_CRAWL,
      processedAt: new Date(),
      itemsProcessed: reviews.length,
    };
  }

  private analyzeSentiment(rating: number): string {
    if (rating >= 4) return 'positive';
    if (rating >= 3) return 'neutral';
    return 'negative';
  }

  private async createLandingPageIfNotExists(competitorId: string, websiteUrl: string): Promise<void> {
    // Implementation: normalize URL, check for duplicates, create record, emit event
  }
}
```

## 4. Social Channel Processor (`social-channel.processor.ts`)
```typescript
@Processor('crawl-execution')
export class SocialChannelProcessor extends WorkerHost {
  constructor(
    private apify: ApifyAdapter,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) { super(); }

  async process(job: Job<{ socialChannelId: string, projectId?: string, competitorId?: string }>) {
    const channel = await this.prisma.socialChannel.findUnique({
      where: { id: job.data.socialChannelId },
      include: {
        competitor: { select: { projectId: true } },
        project: { select: { id: true } }
      }
    });

    // 1. Fetch profile data from Apify
    // Works for both competitor-linked and project-linked channels
    const profileData = await this.apify.fetchProfile(channel.platform, channel.platformId);

    // 2. Update channel info
    await this.prisma.socialChannel.update({
      where: { id: channel.id },
      data: {
        displayName: profileData.displayName,
        avatarUrl: profileData.avatarUrl,
        bio: profileData.bio,
        isVerified: profileData.isVerified
      }
    });

    // 3. Create snapshot
    await this.prisma.socialChannelSnapshot.create({
      data: {
        socialChannelId: channel.id,
        followers: profileData.followers,
        following: profileData.following,
        postsCount: profileData.postsCount,
        videosCount: profileData.videosCount,
        /// Optional "profile likes" / cumulative appreciation signal at **profile level**
        /// (NOT likes on a single video/post).
        /// Examples from providers:
        /// - TikTok SearchAPI: `profile.hearts`
        /// - Facebook / Instagram: page/profile likes if exposed by provider
        profileLikes: profileData.profileLikes,
        engagementRate: profileData.engagementRate
      }
    });

    // 4. Enqueue content crawl
    this.eventEmitter.emit('social-channel.updated', { socialChannelId: channel.id });
  }
}
```

## 5. Social Content Processor (`social-content.processor.ts`)
```typescript
@Processor('crawl-execution')
export class SocialContentProcessor extends WorkerHost {
  constructor(
    private apify: ApifyAdapter,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) { super(); }

  async process(job: Job<{ socialChannelId: string, contentType: 'videos' | 'posts' }>) {
    const { socialChannelId, contentType } = job.data;
    const channel = await this.prisma.socialChannel.findUnique({
      where: { id: socialChannelId },
      include: { 
        competitor: { select: { projectId: true } },
        project: { select: { id: true } }
      }
    });

    // Get projectId from either competitor-linked or project-linked channel
    const projectId = channel.projectId || channel.competitor?.projectId;
    if (!projectId) {
      throw new Error(`SocialChannel ${socialChannelId} is not linked to any project or competitor`);
    }

    if (contentType === 'videos') {
      await this.crawlVideos(channel, projectId);
    } else {
      await this.crawlPosts(channel, projectId);
    }
  }

  private async crawlVideos(channel: SocialChannel, projectId: string) {
    // Works for both competitor-linked and project-linked channels
    // If channel.projectId is set, it's an Internal project channel
    // If channel.competitorId is set, it's a competitor channel
    // Both create VideoOrganic records linked to the same project
    const videos = await this.apify.fetchVideos(channel.platform, channel.platformId);

    for (const video of videos) {
      // Check if video already exists
      const existing = await this.prisma.videoOrganic.findUnique({
        where: { platform_platformId: { platform: channel.platform, platformId: video.id } }
      });

      // Create VideoOrganic record (not Video with type enum)
      // Works for both competitor-linked and project-linked channels
      const videoRecord = await this.prisma.videoOrganic.upsert({
        where: { platform_platformId: { platform: channel.platform, platformId: video.id } },
        update: { 
          views: video.views, 
          likes: video.likes, 
          comments: video.comments, 
          shares: video.shares 
        },
        create: {
          projectId,
          socialChannelId: channel.id,
          platform: channel.platform,
          platformId: video.id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnail,
          duration: video.duration || 0,
          views: video.views || 0,
          likes: video.likes || 0,
          comments: video.comments || 0,
          shares: video.shares || 0,
          publishedAt: video.publishedAt
        }
      });

      // Create snapshot
      await this.prisma.videoOrganicSnapshot.create({
        data: {
          videoOrganicId: videoRecord.id,
          views: video.views || 0,
          likes: video.likes || 0,
          comments: video.comments || 0,
          shares: video.shares || 0
        }
      });

      // Emit for hero detection
      if (!existing) {
        this.eventEmitter.emit('video.created', { videoId: videoRecord.id, type: 'ORGANIC' });
      }
    }
  }

  private async crawlPosts(channel: SocialChannel, projectId: string) {
    const posts = await this.apify.fetchPosts(channel.platform, channel.platformId);

    for (const post of posts) {
      const postRecord = await this.prisma.socialPost.upsert({
        where: { platform_platformId: { platform: channel.platform, platformId: post.id } },
        update: { views: post.views, likes: post.likes, comments: post.comments, shares: post.shares },
        create: {
          projectId,
          socialChannelId: channel.id,
          platform: channel.platform,
          platformId: post.id,
          contentType: this.mapContentType(post.type),
          contentUrl: post.url,
          thumbnailUrl: post.thumbnail,
          caption: post.caption,
          views: post.views,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          publishedAt: post.publishedAt
        }
      });

      // Create snapshot
      await this.prisma.socialPostSnapshot.create({
        data: {
          socialPostId: postRecord.id,
          views: post.views,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares
        }
      });
    }
  }

  private mapContentType(type: string): SocialPostType {
    const mapping = {
      'image': 'IMAGE',
      'carousel': 'CAROUSEL',
      'text': 'TEXT',
      'story': 'STORY',
      'reel': 'REEL',
      'link': 'LINK'
    };
    return mapping[type] || 'IMAGE';
  }
}
```

> **Note (Dec 2025):** In the **final schema**, organic videos are persisted to `VideoOrganic` / `VideoOrganicSnapshot` tables. The conceptual example above illustrates processor flow only; see Database Schema section for the canonical models.

## 6. Landing Page Processor (`landing-page.processor.ts`)

> ⚠️ **Scope**: Social link extraction ONLY. No content/copywriting crawling.

```typescript
@Processor('crawl-execution')
export class LandingPageProcessor extends WorkerHost {
  constructor(private playwright: PlaywrightService, private eventEmitter: EventEmitter2) {
    super();
  }

  async process(job: Job<{ url: string, competitorId: string }>) {
    const { url } = job.data;
    const page = await this.playwright.newPage(url);
    
    // Scan for Social Links (TikTok, YouTube, Instagram, Facebook, X)
    const socialLinks = await page.evaluate(() => {
       const anchors = Array.from(document.querySelectorAll('a'));
       return anchors
         .map(a => a.href)
         .filter(href => 
           href.includes('tiktok.com') || 
           href.includes('youtube.com') ||
           href.includes('instagram.com') ||
           href.includes('facebook.com') ||
           href.includes('twitter.com') ||
           href.includes('x.com')
         );
    });

    // Deduplicate
    const uniqueLinks = [...new Set(socialLinks)];

    if (uniqueLinks.length > 0) {
      this.eventEmitter.emit('social.discovered', {
        competitorId: job.data.competitorId,
        links: uniqueLinks
      });
    }
  }
}
```

## 7. Ads Library Processor (`ads-library.processor.ts`)

> ⚠️ **Scope (Updated Dec 2025)**  
> **Video Ads only** from **Meta Ads Library** and (future) **Google Ads Transparency**.  
> - **TikTok Ads crawling is disabled/removed** from this processor due to low‑quality, noisy signal for this product.  
> - **Advertiser IDs** (`SocialChannel.advertiserId`) remain the primary search key per supported platform.  
> - **Project-level keywords** (from `SpyKeyword`) are used as additional filters where supported.  
> - **Direct Video Ads Creation**: Creates `VideoAds` records immediately (no intermediate Ad model or curation workflow).
>
> **Video Organic** (separate flow): Discovered via social profile crawlers using `SocialChannel.platformId` + provider‑specific APIs (e.g., Apify Actors for TikTok profiles & Facebook pages). Creates `VideoOrganic` records for organic content only.

> ⚠️ **CRITICAL: Scope Clarification (Dec 2025 - Table Separation)**  
> **AdsLibraryProcessor works with BOTH Internal AND External channels** - it crawls ads for both performance measurement and competitor intelligence.
> 
> **After Table Separation**:
> - **Internal channels (Astraler's own)**:
>   - Query `ProjectSocialChannel` (where `projectId` matches)
>   - Create `ProjectVideoAds` for Astraler's paid ads (for internal KPIs/OKRs)
>   - Create `ProjectVideoOrganic` for Astraler's organic content (for performance tracking)
>   - Use case: Marketing team tracks their own channel performance, paid ads performance, organic content performance
> - **External channels (Competitors)**:
>   - Query `CompetitorSocialChannel` (where `competitor.projectId` matches)
>   - Create `CompetitorVideoAds` for competitor ads (for competitor intelligence)
>   - Create `CompetitorVideoOrganic` for competitor organic content (for competitor intelligence)
> - Both Internal and External need crawling for performance measurement (KPI, OKR, growth metrics)

```typescript
@Processor(CRAWL_QUEUE)
export class AdsLibraryProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private searchApiAdapter: SearchAPIAdapter,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<AdsLibraryCrawlJobData, CrawlJobResult>): Promise<CrawlJobResult> {
    const { projectId, keywordId, platform } = job.data;
    this.logger.log(`Processing ads library crawl for project: ${projectId}, keywordId: ${keywordId || 'all'}`);

    // 1. Fetch keywords from Project's Keyword / SpyKeyword tables
    // Note: Keywords are managed in Admin Page, but stored in Keyword / SpyKeyword tables linked to Project
    const keywords = await this.prisma.keyword.findMany({
      where: {
        projectId,
        ...(keywordId && { id: keywordId }), // If specific keyword provided (from Admin trigger)
      },
    });

    if (keywords.length === 0) {
      this.logger.warn(`No keywords found for project: ${projectId}`);
      return {
        success: true,
        jobType: CrawlJobType.ADS_CRAWL,
        processedAt: new Date(),
        itemsProcessed: 0,
      };
    }

    // 2. Get advertiser profiles (SocialChannels) for this project
    // IMPORTANT: After table separation, AdsLibraryProcessor works with BOTH Internal AND External channels
    // - Query ProjectSocialChannel (Internal channels - Astraler's own channels)
    // - Query CompetitorSocialChannel (External channels - Competitor channels)
    // - Both need crawling for performance measurement (KPI, OKR, growth metrics)
    // Each platform-specific Ads Library requires an `advertiserId` to query its transparency API.
    
    // Get Internal channels (Astraler's own)
    const internalChannels = await this.prisma.projectSocialChannel.findMany({
      where: {
        projectId,
        advertiserId: { not: null },
        ...(platform && { platform: this.mapAdPlatformToSocialPlatform(platform) }),
      },
    });
    
    // Get External channels (Competitors)
    const externalChannels = await this.prisma.competitorSocialChannel.findMany({
      where: {
        competitor: { projectId },
        advertiserId: { not: null },
        ...(platform && { platform: this.mapAdPlatformToSocialPlatform(platform) }),
      },
    });
    
    // Process both Internal and External channels
    const advertisers = [...internalChannels, ...externalChannels];
      select: {
        id: true,
        platform: true,
        platformId: true,
        advertiserId: true,
        competitorId: true,
      },
    });

    let totalAdsProcessed = 0;

    // 3. For each keyword and advertiser, search ads on each platform
    // Note: Advertisers can be either competitor-linked (competitorId) or project-linked (projectId)
    // Both types are processed the same way - VideoAds are created and linked to the project
    for (const keyword of keywords) {
      // 3a. Meta Ads (Facebook/Instagram) — use advertiserId + keyword
      if (!platform || platform === 'META') {
        const metaAds = await this.searchApiAdapter.getMetaAds(keyword.text, {
          country: 'ALL',
          activeStatus: 'active',
          startDate: this.getStartDate(30), // Last 30 days
        });

        for (const ad of metaAds) {
          // Extract CTA fields and link_url from Meta Ads response
          // Meta Ads response structure: ad.snapshot.cta_text, ad.snapshot.cta_type, ad.snapshot.link_url
          await this.saveAd({
            projectId,
            keywordId: keyword.id,
            platform: 'META',
            adData: {
              ...ad,
              // Extract CTA fields from snapshot (always present in Meta Ads)
              ctaText: ad.snapshot?.cta_text,
              ctaType: ad.snapshot?.cta_type,
              // Extract link_url (optional, may be null)
              linkUrl: ad.snapshot?.link_url,
            },
          });
          totalAdsProcessed++;
        }
      }

      // 3b. TikTok Ads — use advertiserId + keyword
      if (!platform || platform === 'TIKTOK') {
        const tiktokAds = await this.searchApiAdapter.getTikTokAds(keyword.text, {
          country: 'all',
          timePeriod: this.getTimePeriod(30),
        });

        for (const ad of tiktokAds) {
          await this.saveAd({
            projectId,
            keywordId: keyword.id,
            platform: 'TIKTOK',
            adData: ad,
          });
          totalAdsProcessed++;
        }
      }

      // 3c. Google Ads Transparency (Video ads) — use advertiserId (not store URL domain)
      //     Google Ads library searches by advertiser identity; we rely on `SocialChannel.advertiserId`
      //     for any Google Ads–enabled channels curated for this project.
    }

    // 4. Emit event for downstream processing
    this.eventEmitter.emit('ads.crawled', {
      projectId,
      adsCount: totalAdsProcessed,
    });

    return {
      success: true,
      jobType: CrawlJobType.ADS_CRAWL,
      processedAt: new Date(),
      itemsProcessed: totalAdsProcessed,
    };
  }

  /**
   * Save video ad directly as VideoAds record
   * Separate table from VideoOrganic - direct creation for clarity
   */
  private async saveVideoAd(data: {
    projectId: string;
    spyKeywordId: string | null;
    socialChannelId: string;
    platform: string; // 'tiktok', 'youtube', 'facebook', 'instagram'
    platformId: string; // Ad platform video ID
    platformAdId: string; // Ad ID from platform (e.g., Meta ad_archive_id)
    adPlatform: string; // 'META', 'TIKTOK', 'GOOGLE'
    adData: {
      title?: string;
      description?: string;
      thumbnailUrl?: string;
      videoUrl?: string;
      videoHdUrl?: string;
      videoSdUrl?: string;
      advertiserName?: string;
      pageId?: string;
      status?: string;
      firstShownDate?: Date;
      impressionsMin?: number;
      impressionsMax?: number;
      spendMin?: number;
      spendMax?: number;
      publishedAt: Date;
      // CTA fields (from Meta Ads Library response)
      ctaText?: string;  // CTA button text (e.g., "Learn more", "Send message")
      ctaType?: string;  // CTA type (e.g., "LEARN_MORE", "MESSAGE_PAGE", "DOWNLOAD")
      linkUrl?: string;  // Landing page URL (optional, if present)
    };
  }): Promise<void> {
    // Check if video ad already exists
    const existing = await this.prisma.videoAds.findUnique({
      where: {
        platform_platformId: {
          platform: data.platform,
          platformId: data.platformId,
        },
      },
    });

    if (existing) {
      // Update existing video ad with latest data
      await this.prisma.videoAds.update({
        where: { id: existing.id },
        data: {
          title: data.adData.title || existing.title,
          description: data.adData.description || existing.description,
          thumbnailUrl: data.adData.thumbnailUrl || existing.thumbnailUrl,
          videoUrl: data.adData.videoUrl || existing.videoUrl,
          videoHdUrl: data.adData.videoHdUrl || existing.videoHdUrl,
          videoSdUrl: data.adData.videoSdUrl || existing.videoSdUrl,
          status: data.adData.status || existing.status,
          impressionsMin: data.adData.impressionsMin ?? existing.impressionsMin,
          impressionsMax: data.adData.impressionsMax ?? existing.impressionsMax,
          spendMin: data.adData.spendMin ?? existing.spendMin,
          spendMax: data.adData.spendMax ?? existing.spendMax,
          // Update CTA fields if provided
          ctaText: data.adData.ctaText ?? existing.ctaText,
          ctaType: data.adData.ctaType ?? existing.ctaType,
          destinationUrl: data.adData.linkUrl ?? existing.destinationUrl,
        },
      });
      
      // Handle landing page discovery if linkUrl is present
      if (data.adData.linkUrl) {
        await this.handleLandingPageDiscovery(data.adData.linkUrl, existing.id, data.socialChannelId, data.projectId);
      }
      
      return;
    }

    // Create new VideoAds record
    const videoAd = await this.prisma.videoAds.create({
      data: {
        projectId: data.projectId,
        socialChannelId: data.socialChannelId,
        spyKeywordId: data.spyKeywordId,
        platform: data.platform,
        platformId: data.platformId,
        platformAdId: data.platformAdId,
        adPlatform: data.adPlatform,
        title: data.adData.title || 'Ad Video',
        description: data.adData.description,
        thumbnailUrl: data.adData.thumbnailUrl,
        videoUrl: data.adData.videoUrl,
        videoHdUrl: data.adData.videoHdUrl,
        videoSdUrl: data.adData.videoSdUrl,
        advertiserName: data.adData.advertiserName,
        pageId: data.adData.pageId,
        status: data.adData.status || 'UNKNOWN',
        firstShownDate: data.adData.firstShownDate,
        impressionsMin: data.adData.impressionsMin,
        impressionsMax: data.adData.impressionsMax,
        spendMin: data.adData.spendMin,
        spendMax: data.adData.spendMax,
        publishedAt: data.adData.publishedAt,
        // CTA fields
        ctaText: data.adData.ctaText,
        ctaType: data.adData.ctaType,
        destinationUrl: data.adData.linkUrl,
      },
    });
    
    // Handle landing page discovery if linkUrl is present
    if (data.adData.linkUrl) {
      await this.handleLandingPageDiscovery(data.adData.linkUrl, videoAd.id, data.socialChannelId, data.projectId);
    }
  }
  
  /**
   * Handle landing page discovery from VideoAds link_url
   * Creates or updates LandingPage record with discoverySource = ADS_LIBRARY
   */
  private async handleLandingPageDiscovery(
    linkUrl: string,
    videoAdId: string,
    socialChannelId: string,
    projectId: string
  ): Promise<void> {
    // Get competitorId from socialChannel
    const socialChannel = await this.prisma.socialChannel.findUnique({
      where: { id: socialChannelId },
      select: { competitorId: true }
    });
    
    if (!socialChannel?.competitorId) {
      this.logger.warn(`Cannot create landing page: socialChannel ${socialChannelId} has no competitorId`);
      return;
    }
    
    // Upsert LandingPage with discoverySource = ADS_LIBRARY
    await this.prisma.landingPage.upsert({
      where: {
        competitorId_url: {
          competitorId: socialChannel.competitorId,
          url: linkUrl,
        },
      },
      create: {
        competitorId: socialChannel.competitorId,
        url: linkUrl,
        status: 'ACTIVE',
        discoverySource: 'ADS_LIBRARY',
        discoveredFromVideoAdId: videoAdId,
        discoveredFromSocialChannelId: socialChannelId,
      },
      update: {
        // If landing page already exists, update discovery source if it was MANUAL
        // to preserve ADS_LIBRARY as the source if it was discovered from ads
        discoverySource: 'ADS_LIBRARY',
        discoveredFromVideoAdId: videoAdId,
        discoveredFromSocialChannelId: socialChannelId,
      },
    });
    
    // Emit event for downstream processing (e.g., trigger landing page crawler)
    this.eventEmitter.emit('landing-page.discovered-from-ad', {
      url: linkUrl,
      competitorId: socialChannel.competitorId,
      videoAdId,
      socialChannelId,
    });
  }

  private getStartDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  private getTimePeriod(days: number): string {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return `${start.toISOString().split('T')[0]}..${end.toISOString().split('T')[0]}`;
  }

  private extractDomainFromStoreUrl(storeUrl: string): string | null {
    // Extract domain from App Store URL or return null
    // This is a placeholder - actual implementation needed
    return null;
  }
}
```

**Key Design Decisions:**
1. **Separate Tables (Video Ads & Video Organic)**:
   - Ads Library crawler creates `VideoAds` records directly
   - Social crawler creates `VideoOrganic` records directly
   - **Separate tables** due to different data structures and use cases
   - No shared `Video` table or `type` enum
2. **VideoAds Table**:
   - Contains ad-specific fields: video URLs (videoUrl, videoHdUrl, videoSdUrl), advertiser info, impressions, spend, ad status
   - Linked to `SocialChannel` via advertiserId (advertiser profile)
   - Linked to `SpyKeyword` for tracking discovery source
   - No engagement metrics (views, likes) - not available from Ads Library APIs
3. **VideoOrganic Table**:
   - Contains engagement metrics: views, likes, comments, shares from social platforms
   - Contains standard video metadata: duration, transcript, captions
   - Linked to `SocialChannel` via platformId (social profile)
   - Linked to `SpyKeyword` for tracking discovery source
   - No ad-specific fields
4. **Advertiser-centric Search (Video Ads)**:
   - Primary lookup is by **Advertiser ID** stored on `SocialChannel.advertiserId` (per platform)
   - Project-level keywords (`SpyKeyword`) are used as **filters** / query terms where supported by each Ads Library
5. **Multi-platform Support**: Supports Meta, TikTok, and Google Ads Transparency endpoints using a unified adapter (`SearchAPIAdapter`)
6. **Scheduled Execution**: Runs every 4 hours via SchedulerService (high-frequency, cost-controlled)
7. **Manual Trigger**: Supports on-demand crawl via API endpoint for a given project / subset of keywords

## 9. Social Profile Info Providers (Facebook, Instagram, TikTok)

### 9.1. Supported Profile Platforms

Data Collection now supports **social profile info crawling** for the following competitor platforms:

- **Facebook** – brand pages / advertiser profiles
- **Instagram** – business accounts / creator profiles
- **TikTok** – creator / brand accounts

These platforms are represented in the existing `SocialChannel.platform` enum and are used to enrich `SocialChannel` + `SocialChannelSnapshot` records.

### 9.2. External Profile Info APIs

The system integrates **3rd-party profile info APIs** (see research prototypes in `researchs/searchapi/profile-info/`) to fetch competitor profile metadata.  
Each provider returns a **different raw response structure per platform**, so the Data Collection layer MUST:

- Use a **provider-specific adapter** to call the external API for each platform.
- Map heterogeneous responses into a **single canonical ProfileInfo shape** used internally by the crawlers.
- Keep the **SocialChannelProcessor** and downstream logic independent from provider-specific fields.

### 9.3. Canonical ProfileInfo Shape (Conceptual)

All profile providers must be normalized into a common structure before updating the database, for example:

- **Identity & Branding**
  - Platform (`TIKTOK`, `FACEBOOK`, `INSTAGRAM`, etc.)
  - `platformId` / ref social ID
  - Display name
  - Handle / username
  - Profile URL
  - Avatar URL
  - Bio / description
  - Verification status
- **Channel Metrics (Snapshot)**
  - Followers
  - Following
  - Posts count / videos count
  - Profile likes (optional cumulative likes metric at profile level, e.g. TikTok hearts, Facebook/Instagram page likes)
  - Engagement metrics (if available)

This normalized shape is what `SocialChannelProcessor` and `SocialChannelSnapshot` creation logic consume, regardless of which external API was used to fetch the data.

### 9.4. Extensibility & Future Providers

When adding a new profile provider or extending to additional social platforms:

- Create a **new adapter function** that:
  - Calls the provider-specific profile endpoint.
  - Transforms the provider response into the canonical ProfileInfo shape.
- Keep the rest of the pipeline (queue payloads, processor flow, Prisma upserts) unchanged.
- Document any provider-specific limitations (rate limits, missing fields) in this TDD and in the relevant research notes under `researchs/`.

## 8. Crawler Service (`data-collection.service.ts`)
```typescript
@Injectable()
export class DataCollectionService {
  constructor(@InjectQueue('crawl-execution') private queue: Queue) {}

  @OnEvent('landing-page.added')
  async handleLandingPageAdded(payload: LandingPageAddedEvent) {
    await this.queue.add('crawl-landing-page', {
      url: payload.url,
      competitorId: payload.competitorId
    });
  }

  @OnEvent('ads.crawl.requested')
  async handleAdsCrawlRequested(payload: { projectId: string; keywordId?: string }) {
    await this.queue.add('crawl-ads-library', {
      projectId: payload.projectId,
      keywordId: payload.keywordId,
    });
  }
}
```

## 7.5. Known Issues & Technical Debt

### 7.5.1. Version History Storage Limitation ⚠️

**Issue:** Current implementation in `StoreProcessor` only saves first 10 versions from API response using `.slice(0, 10)`, which prevents building a complete version history timeline required by the "What's New" UI feature.

**Root Cause:**
- SearchAPI response contains `version_history` array with potentially many entries
- Current code limits processing to first 10 entries only
- Each crawl may return different subset of versions (typically latest ones)
- This prevents accumulating complete version history over time

**Impact:**
- "What's New" page (see `docs/4.ui-design/domains/external/whats-new-ui.md`) requires full version timeline with chronological flow
- UI needs to display version progression (e.g., "v2.5.0 → v2.6.0")
- Missing historical versions prevent accurate timeline visualization
- Users cannot see complete version update history

**Expected Behavior:**
- Save ALL versions from `version_history` array, not just first 10
- Accumulate versions across multiple crawl cycles
- Use `upsert` with unique constraint `competitorId_version` to prevent duplicates
- Maintain chronological order via `releaseDate` field for timeline queries

**Recommended Fix:**
```typescript
// Current (INCORRECT):
for (const version of product.version_history.slice(0, 10)) { ... }

// Should be:
for (const version of product.version_history) {
  await this.prisma.appUpdate.upsert({
    where: { competitorId_version: { competitorId, version: version.version } },
    create: {
      competitorId,
      version: version.version,
      releaseDate: new Date(version.date),
      changelog: version.notes || 'No release notes',
    },
    update: {
      changelog: version.notes || 'No release notes',
      // Do NOT update releaseDate if version exists (preserve original date)
    },
  });
}
```

**Related Documents:**
- UI Requirement: `docs/4.ui-design/domains/external/whats-new-ui.md`
- Implementation Plan: `docs/7.implementation/domains/app-intelligence/implementation-plan.md`
- API Response Structure: `researchs/searchapi/apple-product-searchapi-response.json`

**Priority:** High (P1) - Blocks complete "What's New" feature functionality

---

## 8. Performance Requirements

### 7.1. API Response Time Requirements
*   **Channels List API**: Must return initial page (< 50 channels) in **< 2 seconds**
*   **Videos List API**: Must return initial page (< 20 videos) in **< 2 seconds**
*   **Channel Detail API**: Must return single channel with latest snapshot in **< 1 second**
*   **Video Detail API**: Must return single video with metadata in **< 1 second**

### 7.2. Pagination Strategy
*   **Default Page Size**: 
    *   Channels: 50 per page
    *   Videos: 20 per page
*   **Maximum Page Size**: 100 items per page (to prevent timeout)
*   **Cursor-based Pagination**: Use `cursor` + `limit` for better performance than offset-based
*   **Frontend**: Implement infinite scroll or "Load More" button (not traditional page numbers)

### 7.3. Caching Strategy
*   **Redis Cache**:
    *   Channel list (project-scoped): Cache for 5 minutes
    *   Video list (project-scoped): Cache for 5 minutes
    *   Channel detail: Cache for 10 minutes
    *   Video detail: Cache for 10 minutes
*   **Cache Keys**: Include projectId, filters, and pagination params in cache key
*   **Cache Invalidation**: 
    *   Invalidate on new crawl completion
    *   Invalidate on manual refresh
    *   Invalidate on data updates

### 7.4. Database Query Optimization
*   **Indexes Required**:
    *   `Video`: `projectId`, `publishedAt`, `heroScore`, `socialChannelId`
    *   `SocialChannel`: `projectId` (via competitor relation), `platform`
    *   `SocialChannelSnapshot`: `socialChannelId`, `capturedAt`
*   **Query Patterns**:
    *   Use `select` to fetch only required fields (avoid `include` for large relations)
    *   Use `take` to limit results
    *   Use `orderBy` with indexed columns
*   **Avoid N+1 Queries**: Use `include` strategically, or batch load relations

### 7.5. Frontend Performance Optimizations
*   **Lazy Loading**: 
    *   Load video thumbnails lazily (intersection observer)
    *   Load channel avatars lazily
*   **Skeleton States**: Show loading skeletons immediately (don't wait for API)
*   **Optimistic Updates**: Update UI optimistically for mutations (add/remove)
*   **Debouncing**: Debounce filter inputs (500ms) before triggering API calls
*   **TanStack Query**:
    *   Use `staleTime` of 5 minutes for list queries
    *   Use `cacheTime` of 10 minutes
    *   Use `refetchOnWindowFocus: false` for list pages
    *   Use `keepPreviousData: true` for pagination

### 7.6. Loading States
*   **Initial Load**: Show skeleton/loading state immediately
*   **Pagination Load**: Show loading indicator at bottom (not full page spinner)
*   **Filter Changes**: Show loading overlay on table/grid (preserve existing data)
*   **Error States**: Show error message with retry button (don't block entire page)

### 7.7. Backend API Endpoints Performance
```typescript
// Example: Optimized Channels List Endpoint
@Get('projects/:projectId/channels')
async getChannels(
  @Param('projectId') projectId: string,
  @Query() query: ListChannelsQueryDto
) {
  // 1. Check cache first
  const cacheKey = `channels:${projectId}:${JSON.stringify(query)}`;
  const cached = await this.redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Optimized query with select only needed fields
  const channels = await this.prisma.socialChannel.findMany({
    where: {
      competitor: { projectId },
      ...(query.platform && { platform: query.platform })
    },
    select: {
      id: true,
      platform: true,
      handle: true,
      displayName: true,
      avatarUrl: true,
      snapshots: {
        take: 1,
        orderBy: { capturedAt: 'desc' },
        select: {
          followers: true,
          engagementRate: true,
          capturedAt: true
        }
      },
      competitor: {
        select: {
          id: true,
          name: true,
          iconUrl: true
        }
      }
    },
    take: query.limit || 50,
    skip: query.offset || 0,
    orderBy: { createdAt: 'desc' }
  });

  // 3. Cache result
  await this.redis.setex(cacheKey, 300, JSON.stringify(channels)); // 5 min

  return channels;
}
```
