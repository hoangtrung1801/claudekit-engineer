# Domain TDD: Dashboard

## 1. Module Structure
```text
src/modules/dashboard/
├── dto/
│   ├── feed-filter.dto.ts
├── entities/
│   ├── feed-item.entity.ts (Union Type)
├── dashboard.controller.ts
├── dashboard.service.ts
└── dashboard.module.ts
```

## 2. API Implementation (`dashboard.controller.ts`)
```typescript
@Controller('projects/:projectId/dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('feed')
  async getFeed(
    @Param('projectId') projectId: string,
    @Query() filters: FeedFilterDto
  ) {
    return this.service.getFeed(projectId, filters);
  }

  @Get('summary')
  async getSummary(@Param('projectId') projectId: string) {
    return this.service.getSummary(projectId);
  }
}
```

## 3. Service Layer (`dashboard.service.ts`)
```typescript
@Injectable()
export class DashboardService {
  async getFeed(projectId: string, filters: FeedFilterDto) {
    // Parallel Fetching
    const [updates, videos, reviews] = await Promise.all([
      this.prisma.appUpdate.findMany({ where: { projectId } }),
      this.prisma.video.findMany({ where: { projectId } }),
      this.prisma.reviewBatch.findMany({ where: { projectId } })
    ]);

    // Merge & Sort
    const feed = [
      ...updates.map(u => ({ type: 'APP_UPDATE', date: u.date, data: u })),
      ...videos.map(v => ({ type: 'VIDEO', date: v.createdAt, data: v })),
      ...reviews.map(r => ({ type: 'REVIEW_BATCH', date: r.date, data: r }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return feed;
  }

  async getSummary(projectId: string) {
    // Return counts for sidebar
    return {
      appUpdates: await this.prisma.appUpdate.count({ where: { projectId } }),
      newVideos: await this.prisma.video.count({ where: { projectId } }),
      heroVideos: await this.prisma.video.count({ where: { projectId, type: 'HERO' } }),
      newReviews: await this.prisma.review.count({ where: { projectId } })
    };
  }
}
```

## 4. DTOs
```typescript
export class FeedFilterDto {
  type?: 'ALL' | 'APP_UPDATE' | 'VIDEO' | 'REVIEW';
  competitorId?: string;
}
```
