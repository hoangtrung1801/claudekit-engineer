# Domain Initialization: Alerts

> **Reference:** [System Initialization](../../system-initialization.md)  
> **Phase:** 4 (Polish & Scale)  
> **Priority:** P2 - Medium

---

## 1. Domain Structure Setup

### 1.1 Backend Folder Structure

```bash
# Create Alerts module structure
mkdir -p backend/src/modules/alerts/{controllers,services,dto,events}

# Core files
touch backend/src/modules/alerts/alerts.module.ts
touch backend/src/modules/alerts/controllers/notification.controller.ts
touch backend/src/modules/alerts/controllers/alert-config.controller.ts

# Services
touch backend/src/modules/alerts/services/notification.service.ts
touch backend/src/modules/alerts/services/slack.service.ts
touch backend/src/modules/alerts/services/telegram.service.ts
touch backend/src/modules/alerts/services/alert-config.service.ts
touch backend/src/modules/alerts/services/anti-spam.service.ts

# DTOs
touch backend/src/modules/alerts/dto/notification.dto.ts
touch backend/src/modules/alerts/dto/alert-config.dto.ts

# Events
touch backend/src/modules/alerts/events/alert.events.ts
```

### 1.2 Frontend Folder Structure

```bash
# Create Notifications feature
mkdir -p frontend/src/features/notifications/{components,hooks}

touch frontend/src/features/notifications/api.ts
touch frontend/src/features/notifications/components/NotificationBell.tsx
touch frontend/src/features/notifications/components/NotificationDropdown.tsx
touch frontend/src/features/notifications/components/NotificationItem.tsx
touch frontend/src/features/notifications/hooks/useNotifications.ts
```

---

## 2. Domain Configuration

### 2.1 Environment Variables

Add to `backend/.env`:

```env
# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
SLACK_ENABLED=false

# Telegram Integration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id
TELEGRAM_ENABLED=false

# Alert Configuration
ALERT_ANTI_SPAM_WINDOW_MINUTES=30
ALERT_COOLDOWN_MINUTES=60
```

### 2.2 Module Registration

Update `backend/src/app.module.ts`:

```typescript
import { AlertsModule } from './modules/alerts/alerts.module';

@Module({
  imports: [
    // ... existing imports
    AlertsModule,
  ],
})
export class AppModule {}
```

---

## 3. Database Setup

### 3.1 Notification Model

Ensure in `backend/prisma/schema.prisma`:

```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      String   // HERO_VIDEO, APP_UPDATE, etc.
  title     String
  message   String
  metadata  Json?    // { entityType, entityId, deepLink }
  isRead    Boolean  @default(false)
  
  createdAt DateTime @default(now())

  @@index([userId, isRead])
  @@index([userId, createdAt])
}

model AlertConfig {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Alert type toggles
  heroVideo       Boolean @default(true)
  appUpdate       Boolean @default(true)
  newCompetitor   Boolean @default(true)
  reviewSpike     Boolean @default(false)
  insightAlert    Boolean @default(true)
  
  // Channel preferences
  inAppEnabled    Boolean @default(true)
  slackEnabled    Boolean @default(false)
  telegramEnabled Boolean @default(false)
  emailEnabled    Boolean @default(false)
  
  // Slack/Telegram credentials (user-specific)
  slackWebhook    String?
  telegramChatId  String?
  
  updatedAt DateTime @updatedAt
}
```

---

## 4. Module Setup

Create `backend/src/modules/alerts/alerts.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationController } from './controllers/notification.controller';
import { AlertConfigController } from './controllers/alert-config.controller';
import { NotificationService } from './services/notification.service';
import { SlackService } from './services/slack.service';
import { TelegramService } from './services/telegram.service';
import { AlertConfigService } from './services/alert-config.service';
import { AntiSpamService } from './services/anti-spam.service';
import { AlertEventListener } from './events/alert.listener';

@Module({
  imports: [HttpModule],
  controllers: [NotificationController, AlertConfigController],
  providers: [
    NotificationService,
    SlackService,
    TelegramService,
    AlertConfigService,
    AntiSpamService,
    AlertEventListener,
  ],
  exports: [NotificationService],
})
export class AlertsModule {}
```

---

## 5. Services

### 5.1 Notification Service

Create `backend/src/modules/alerts/services/notification.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { SlackService } from './slack.service';
import { TelegramService } from './telegram.service';
import { AlertConfigService } from './alert-config.service';
import { AntiSpamService } from './anti-spam.service';

interface CreateNotificationDto {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: {
    entityType: string;
    entityId: string;
    deepLink?: string;
  };
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private slackService: SlackService,
    private telegramService: TelegramService,
    private alertConfig: AlertConfigService,
    private antiSpam: AntiSpamService,
  ) {}

  async create(dto: CreateNotificationDto) {
    // Check anti-spam
    const isDuplicate = await this.antiSpam.isDuplicate(
      dto.userId,
      dto.type,
      dto.metadata?.entityId,
    );

    if (isDuplicate) {
      this.logger.debug(`Skipping duplicate notification: ${dto.type}`);
      return null;
    }

    // Get user's alert config
    const config = await this.alertConfig.getConfig(dto.userId);

    // Check if this alert type is enabled
    if (!this.isAlertTypeEnabled(config, dto.type)) {
      return null;
    }

    // Create in-app notification
    let notification = null;
    if (config?.inAppEnabled !== false) {
      notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          type: dto.type,
          title: dto.title,
          message: dto.message,
          metadata: dto.metadata || {},
        },
      });
    }

    // Send to external channels
    if (config?.slackEnabled && config.slackWebhook) {
      await this.slackService.send(config.slackWebhook, {
        type: dto.type,
        title: dto.title,
        message: dto.message,
        deepLink: dto.metadata?.deepLink,
      });
    }

    if (config?.telegramEnabled && config.telegramChatId) {
      await this.telegramService.send(config.telegramChatId, {
        title: dto.title,
        message: dto.message,
        deepLink: dto.metadata?.deepLink,
      });
    }

    // Record for anti-spam
    await this.antiSpam.record(dto.userId, dto.type, dto.metadata?.entityId);

    return notification;
  }

  async getByUser(userId: string, limit = 50) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  private isAlertTypeEnabled(config: any, type: string): boolean {
    if (!config) return true;

    const typeMap: Record<string, string> = {
      HERO_VIDEO: 'heroVideo',
      APP_UPDATE: 'appUpdate',
      NEW_COMPETITOR: 'newCompetitor',
      REVIEW_SPIKE: 'reviewSpike',
      INSIGHT_ALERT: 'insightAlert',
    };

    const configKey = typeMap[type];
    return configKey ? config[configKey] !== false : true;
  }
}
```

### 5.2 Slack Service

Create `backend/src/modules/alerts/services/slack.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface SlackMessage {
  type: string;
  title: string;
  message: string;
  deepLink?: string;
}

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);

  constructor(private httpService: HttpService) {}

  async send(webhookUrl: string, msg: SlackMessage) {
    const emoji = this.getEmoji(msg.type);

    const payload = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${emoji} ${msg.title}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: msg.message,
          },
        },
      ],
    };

    if (msg.deepLink) {
      payload.blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View in Dashboard' },
            url: msg.deepLink,
          },
        ],
      } as any);
    }

    try {
      await firstValueFrom(this.httpService.post(webhookUrl, payload));
      this.logger.log(`Slack notification sent: ${msg.type}`);
    } catch (error) {
      this.logger.error('Slack send failed:', error.message);
    }
  }

  private getEmoji(type: string): string {
    const emojis: Record<string, string> = {
      HERO_VIDEO: '🔥',
      APP_UPDATE: '📱',
      NEW_COMPETITOR: '👀',
      REVIEW_SPIKE: '📈',
      INSIGHT_ALERT: '💡',
    };
    return emojis[type] || '🔔';
  }
}
```

### 5.3 Anti-Spam Service

Create `backend/src/modules/alerts/services/anti-spam.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SpamRecord {
  timestamp: number;
  entityId?: string;
}

@Injectable()
export class AntiSpamService {
  private records: Map<string, SpamRecord[]> = new Map();
  private readonly windowMs: number;
  private readonly cooldownMs: number;

  constructor(private configService: ConfigService) {
    this.windowMs = this.configService.get('ALERT_ANTI_SPAM_WINDOW_MINUTES', 30) * 60 * 1000;
    this.cooldownMs = this.configService.get('ALERT_COOLDOWN_MINUTES', 60) * 60 * 1000;
  }

  async isDuplicate(userId: string, type: string, entityId?: string): Promise<boolean> {
    const key = `${userId}:${type}`;
    const now = Date.now();

    // Clean old records
    this.cleanOldRecords(key, now);

    const records = this.records.get(key) || [];

    // Check for exact duplicate (same entity)
    if (entityId) {
      const exactMatch = records.find(
        (r) => r.entityId === entityId && now - r.timestamp < this.cooldownMs,
      );
      if (exactMatch) return true;
    }

    // Check for flood (too many of same type)
    const recentCount = records.filter((r) => now - r.timestamp < this.windowMs).length;
    return recentCount >= 5; // Max 5 per window
  }

  async record(userId: string, type: string, entityId?: string) {
    const key = `${userId}:${type}`;
    const records = this.records.get(key) || [];
    records.push({ timestamp: Date.now(), entityId });
    this.records.set(key, records);
  }

  private cleanOldRecords(key: string, now: number) {
    const records = this.records.get(key) || [];
    const filtered = records.filter((r) => now - r.timestamp < this.cooldownMs);
    this.records.set(key, filtered);
  }
}
```

---

## 6. Event Listener

Create `backend/src/modules/alerts/events/alert.listener.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/database/prisma.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AlertEventListener {
  private readonly logger = new Logger(AlertEventListener.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  @OnEvent('hero-video.detected')
  async onHeroVideoDetected(payload: {
    videoId: string;
    heroScore: number;
    competitorName?: string;
  }) {
    this.logger.log(`Hero video event: ${payload.videoId}`);

    // Get project and user
    const video = await this.prisma.video.findUnique({
      where: { id: payload.videoId },
      include: {
        project: { include: { user: true } },
        socialChannel: { include: { competitor: true } },
      },
    });

    if (!video) return;

    const competitor = video.socialChannel?.competitor?.name || 'Unknown';

    await this.notificationService.create({
      userId: video.project.userId,
      type: 'HERO_VIDEO',
      title: '🔥 Hero Video Detected!',
      message: `${competitor} has a video with ${payload.heroScore.toFixed(0)}% growth rate`,
      metadata: {
        entityType: 'video',
        entityId: payload.videoId,
        deepLink: `/projects/${video.projectId}/videos?highlight=${payload.videoId}`,
      },
    });
  }

  @OnEvent('competitor.app-updated')
  async onAppUpdate(payload: { competitorId: string; version: string; changelog: string }) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id: payload.competitorId },
      include: { project: true },
    });

    if (!competitor) return;

    await this.notificationService.create({
      userId: competitor.project.userId,
      type: 'APP_UPDATE',
      title: '📱 Competitor App Updated',
      message: `${competitor.name} released version ${payload.version}`,
      metadata: {
        entityType: 'competitor',
        entityId: payload.competitorId,
        deepLink: `/projects/${competitor.projectId}/whats-new`,
      },
    });
  }

  @OnEvent('insight.significant')
  async onSignificantInsight(payload: { projectId: string; insights: any[] }) {
    const project = await this.prisma.project.findUnique({
      where: { id: payload.projectId },
    });

    if (!project) return;

    await this.notificationService.create({
      userId: project.userId,
      type: 'INSIGHT_ALERT',
      title: '💡 New Strategic Insight',
      message: `${payload.insights.length} high-impact insights discovered`,
      metadata: {
        entityType: 'analysis',
        entityId: payload.projectId,
        deepLink: `/projects/${payload.projectId}/ai-insights`,
      },
    });
  }
}
```

---

## 7. Controller

Create `backend/src/modules/alerts/controllers/notification.controller.ts`:

```typescript
import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { NotificationService } from '../services/notification.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  getAll(@CurrentUser('id') userId: string) {
    return this.notificationService.getByUser(userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread count' })
  getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark as read' })
  markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationService.markAsRead(id, userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all as read' })
  markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }
}
```

---

## 8. Frontend Components

### 8.1 Notification Bell

Create `frontend/src/features/notifications/components/NotificationBell.tsx`:

```typescript
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnreadCount } from '../hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: count } = useUnreadCount();

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Button>

      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
```

---

## 9. Verification Checklist

### Backend
- [ ] Notification model created
- [ ] NotificationService working
- [ ] Event listeners active
- [ ] Slack integration (optional)
- [ ] Anti-spam logic working

### Frontend
- [ ] Notification bell component
- [ ] Dropdown with notifications
- [ ] Mark as read functionality
- [ ] Unread count updating

### Events
- [ ] `hero-video.detected` triggering
- [ ] `competitor.app-updated` triggering
- [ ] `insight.significant` triggering

---

## 10. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications |
| GET | `/notifications/unread-count` | Get unread count |
| PATCH | `/notifications/:id/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all read |
| GET | `/alerts/config` | Get config |
| PATCH | `/alerts/config` | Update config |

---

**Next Step:** Proceed to Admin Domain Initialization.

