# Domain TDD: Alerts

## 1. Module Structure
```text
src/modules/alerts/
├── adapters/
│   ├── slack.adapter.ts
│   ├── telegram.adapter.ts
│   └── email.adapter.ts (Future)
├── dto/
│   ├── send-alert.dto.ts
├── entities/
│   └── notification.entity.ts
├── alerts.service.ts
└── alerts.module.ts
```

## 2. Adapters
```typescript
export interface AlertAdapter {
  send(destination: string, message: string): Promise<void>;
}

@Injectable()
export class SlackAdapter implements AlertAdapter {
  constructor(private http: HttpService) {}

  async send(webhookUrl: string, message: string): Promise<void> {
    await firstValueFrom(this.http.post(webhookUrl, { text: message }));
  }
}

@Injectable()
export class TelegramAdapter implements AlertAdapter {
  constructor(private http: HttpService, private config: ConfigService) {}

  async send(chatId: string, message: string): Promise<void> {
    const token = this.config.get('TELEGRAM_BOT_TOKEN');
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await firstValueFrom(this.http.post(url, { chat_id: chatId, text: message }));
  }
}
```

## 3. Database Models (Prisma)
```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## 4. Service Logic (`alerts.service.ts`)
```typescript
@Injectable()
export class AlertsService {
  constructor(
    private slack: SlackAdapter,
    private telegram: TelegramAdapter,
    private prisma: PrismaService,
    private config: ConfigService
  ) {}

  @OnEvent('hero.detected')
  async handleHeroVideo(payload: HeroVideoEvent) {
    // 1. Load system-level destinations (not per-user)
    const slackWebhook = this.config.get('ALERTS_SLACK_WEBHOOK');
    const telegramChatId = this.config.get('ALERTS_TELEGRAM_CHAT_ID');

    // 2. Dispatch
    const message = `🚀 Hero Video Detected: ${payload.videoTitle}`;
    
    if (slackWebhook) await this.slack.send(slackWebhook, message);
    if (telegramChatId) await this.telegram.send(telegramChatId, message);
  }
}
```
