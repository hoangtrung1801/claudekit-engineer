# Domain Initialization: AI Analysis

> **Reference:** [System Initialization](../../system-initialization.md)  
> **Phase:** 3 (Intelligence)  
> **Priority:** P1 - High

---

## 1. Domain Structure Setup

### 1.1 Backend Folder Structure

```bash
# Create AI Analysis module structure
mkdir -p backend/src/modules/ai-analysis/{controllers,services,prompts,dto}

# Core files
touch backend/src/modules/ai-analysis/ai-analysis.module.ts
touch backend/src/modules/ai-analysis/controllers/analysis.controller.ts

# Services
touch backend/src/modules/ai-analysis/services/langchain.service.ts
touch backend/src/modules/ai-analysis/services/market-landscape.service.ts
touch backend/src/modules/ai-analysis/services/pain-point.service.ts
touch backend/src/modules/ai-analysis/services/sentiment.service.ts
touch backend/src/modules/ai-analysis/services/executive-summary.service.ts
touch backend/src/modules/ai-analysis/services/token-tracking.service.ts

# Prompts
touch backend/src/modules/ai-analysis/prompts/market-landscape.prompt.ts
touch backend/src/modules/ai-analysis/prompts/pain-point.prompt.ts
touch backend/src/modules/ai-analysis/prompts/sentiment.prompt.ts
touch backend/src/modules/ai-analysis/prompts/executive-summary.prompt.ts

# DTOs
touch backend/src/modules/ai-analysis/dto/analysis.dto.ts
touch backend/src/modules/ai-analysis/dto/trigger-analysis.dto.ts
```

### 1.2 Frontend Folder Structure

```bash
# Create AI Insights feature
mkdir -p frontend/src/features/ai-insights/{components,hooks}

touch frontend/src/features/ai-insights/AIInsightsPage.tsx
touch frontend/src/features/ai-insights/api.ts
touch frontend/src/features/ai-insights/components/ExecutiveSummary.tsx
touch frontend/src/features/ai-insights/components/InsightCard.tsx
touch frontend/src/features/ai-insights/components/InsightCategoryTabs.tsx
touch frontend/src/features/ai-insights/hooks/useAnalysis.ts
```

---

## 2. Domain Configuration

### 2.1 Install Dependencies

```bash
cd backend

# LangChain
npm install langchain @langchain/openai @langchain/core

# Zod for structured output
npm install zod
```

### 2.2 Environment Variables

Add to `backend/.env`:

```env
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.3

# Token Limits
AI_DAILY_TOKEN_LIMIT=100000
AI_MONTHLY_TOKEN_LIMIT=3000000
AI_COST_CAP_USD=50
```

### 2.3 Module Registration

Update `backend/src/app.module.ts`:

```typescript
import { AIAnalysisModule } from './modules/ai-analysis/ai-analysis.module';

@Module({
  imports: [
    // ... existing imports
    AIAnalysisModule,
  ],
})
export class AppModule {}
```

---

## 3. Database Setup

### 3.1 Verify Prisma Models

Ensure in `backend/prisma/schema.prisma`:

```prisma
enum AnalysisType {
  MARKET_LANDSCAPE
  PAIN_POINT
  FEATURE_GAP
  CREATIVE_ANGLE
  VIDEO_TRENDS
  SENTIMENT_TOPIC
  WHATS_NEW_SUMMARY
}

enum AnalysisStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model AnalysisResult {
  id          String         @id @default(uuid())
  projectId   String
  project     Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)

  type        AnalysisType
  status      AnalysisStatus @default(PENDING)

  data        Json?
  summary     String?        @db.Text

  sourceCount Int?
  triggeredBy String?

  createdAt   DateTime       @default(now())
  completedAt DateTime?

  @@index([projectId, type])
  @@index([projectId, createdAt])
  @@index([projectId, status])
}
```

---

## 4. Module Setup

Create `backend/src/modules/ai-analysis/ai-analysis.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalysisController } from './controllers/analysis.controller';
import { LangChainService } from './services/langchain.service';
import { MarketLandscapeService } from './services/market-landscape.service';
import { PainPointService } from './services/pain-point.service';
import { SentimentService } from './services/sentiment.service';
import { ExecutiveSummaryService } from './services/executive-summary.service';
import { TokenTrackingService } from './services/token-tracking.service';
import { AnalysisProcessor } from './processors/analysis.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analysis-queue',
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: 'exponential', delay: 10000 },
        removeOnComplete: 50,
      },
    }),
  ],
  controllers: [AnalysisController],
  providers: [
    LangChainService,
    MarketLandscapeService,
    PainPointService,
    SentimentService,
    ExecutiveSummaryService,
    TokenTrackingService,
    AnalysisProcessor,
  ],
  exports: [LangChainService, MarketLandscapeService, PainPointService],
})
export class AIAnalysisModule {}
```

---

## 5. LangChain Service

Create `backend/src/modules/ai-analysis/services/langchain.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { TokenTrackingService } from './token-tracking.service';

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(LangChainService.name);
  private readonly model: ChatOpenAI;

  constructor(
    private configService: ConfigService,
    private tokenTracking: TokenTrackingService,
  ) {
    this.model = new ChatOpenAI({
      openAIApiKey: this.configService.get('OPENAI_API_KEY'),
      modelName: this.configService.get('OPENAI_MODEL', 'gpt-4o-mini'),
      temperature: this.configService.get('OPENAI_TEMPERATURE', 0.3),
      maxTokens: this.configService.get('OPENAI_MAX_TOKENS', 4000),
    });
  }

  async chat(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ]);

      // Track token usage
      const usage = response.response_metadata?.usage;
      if (usage) {
        await this.tokenTracking.recordUsage({
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        });
      }

      return response.content as string;
    } catch (error) {
      this.logger.error('LangChain chat error:', error.message);
      throw error;
    }
  }

  async chatWithStructuredOutput<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
  ): Promise<T> {
    const response = await this.chat(
      systemPrompt +
        '\n\nYou MUST respond with valid JSON matching the expected schema. Do not include any text outside the JSON.',
      userPrompt,
    );

    try {
      // Clean response (remove markdown code blocks if present)
      let jsonStr = response.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }

      const parsed = JSON.parse(jsonStr.trim());
      return schema.parse(parsed);
    } catch (error) {
      this.logger.error('Failed to parse structured output:', error.message);
      this.logger.debug('Raw response:', response);
      throw new Error('Invalid AI response format');
    }
  }
}
```

---

## 6. Analysis Services

### 6.1 Market Landscape Service

Create `backend/src/modules/ai-analysis/services/market-landscape.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { z } from 'zod';
import { PrismaService } from '@/database/prisma.service';
import { LangChainService } from './langchain.service';
import { MARKET_LANDSCAPE_PROMPT } from '../prompts/market-landscape.prompt';

const MarketLandscapeSchema = z.object({
  insights: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['MARKET_MOVE', 'OPPORTUNITY', 'THREAT', 'TREND']),
      impact: z.enum(['HIGH', 'MEDIUM', 'LOW']),
      evidence: z.array(z.string()),
    }),
  ),
  positioningMatrix: z.object({
    yourPosition: z.object({
      x: z.number(),
      y: z.number(),
      label: z.string(),
    }),
    competitors: z.array(
      z.object({
        name: z.string(),
        x: z.number(),
        y: z.number(),
      }),
    ),
  }),
  recommendations: z.array(z.string()),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

type MarketLandscapeResult = z.infer<typeof MarketLandscapeSchema>;

@Injectable()
export class MarketLandscapeService {
  private readonly logger = new Logger(MarketLandscapeService.name);

  constructor(
    private prisma: PrismaService,
    private langchain: LangChainService,
    private eventEmitter: EventEmitter2,
  ) {}

  async analyze(projectId: string): Promise<MarketLandscapeResult> {
    this.logger.log(`Starting Market Landscape analysis for project: ${projectId}`);

    // Fetch data
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        competitors: {
          include: {
            reviews: { take: 100, orderBy: { postedAt: 'desc' } },
            socialChannels: {
              include: {
                snapshots: { take: 1, orderBy: { capturedAt: 'desc' } },
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Prepare context for AI
    const competitorSummaries = project.competitors.map((c) => ({
      name: c.name,
      category: c.storeCategory,
      reviewCount: c.reviews.length,
      avgRating:
        c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length || 0,
      topComplaints: this.extractTopComplaints(c.reviews),
      socialFollowers: c.socialChannels.reduce(
        (sum, ch) => sum + (ch.snapshots[0]?.followers || 0),
        0,
      ),
    }));

    const userPrompt = `
Project: ${project.name}
Category: ${project.category || 'Unknown'}

Competitors:
${JSON.stringify(competitorSummaries, null, 2)}

Analyze the market landscape and provide strategic insights.
`;

    // Call AI
    const result = await this.langchain.chatWithStructuredOutput(
      MARKET_LANDSCAPE_PROMPT,
      userPrompt,
      MarketLandscapeSchema,
    );

    // Store result
    await this.prisma.analysisResult.create({
      data: {
        projectId,
        type: 'MARKET_LANDSCAPE',
        status: 'COMPLETED',
        data: result as any,
        summary: result.insights[0]?.description || '',
        sourceCount: project.competitors.length,
        completedAt: new Date(),
      },
    });

    // Emit event for significant insights
    const highImpact = result.insights.filter((i) => i.impact === 'HIGH');
    if (highImpact.length > 0) {
      this.eventEmitter.emit('insight.significant', {
        projectId,
        insights: highImpact,
      });
    }

    return result;
  }

  private extractTopComplaints(reviews: { text: string; sentiment: string }[]): string[] {
    const negative = reviews.filter((r) => r.sentiment === 'NEGATIVE');
    return negative.slice(0, 5).map((r) => r.text.substring(0, 100));
  }
}
```

### 6.2 Pain Point Service

Create `backend/src/modules/ai-analysis/services/pain-point.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/database/prisma.service';
import { LangChainService } from './langchain.service';
import { PAIN_POINT_PROMPT } from '../prompts/pain-point.prompt';

const PainPointSchema = z.object({
  painPoints: z.array(
    z.object({
      category: z.string(),
      description: z.string(),
      frequency: z.enum(['HIGH', 'MEDIUM', 'LOW']),
      severity: z.enum(['CRITICAL', 'MAJOR', 'MINOR']),
      examples: z.array(z.string()),
      recommendation: z.string(),
    }),
  ),
  summary: z.string(),
  totalReviewsAnalyzed: z.number(),
});

type PainPointResult = z.infer<typeof PainPointSchema>;

@Injectable()
export class PainPointService {
  private readonly logger = new Logger(PainPointService.name);

  constructor(
    private prisma: PrismaService,
    private langchain: LangChainService,
  ) {}

  async analyze(projectId: string): Promise<PainPointResult> {
    this.logger.log(`Starting Pain Point analysis for project: ${projectId}`);

    // Fetch negative reviews from all competitors
    const reviews = await this.prisma.review.findMany({
      where: {
        competitor: { projectId },
        sentiment: 'NEGATIVE',
      },
      orderBy: { postedAt: 'desc' },
      take: 200,
      include: { competitor: true },
    });

    if (reviews.length < 10) {
      throw new Error('Not enough negative reviews for analysis');
    }

    const userPrompt = `
Analyze these ${reviews.length} negative reviews and identify common pain points:

${reviews.map((r) => `[${r.competitor.name}] "${r.text}"`).join('\n\n')}

Extract patterns and categorize the main user complaints.
`;

    const result = await this.langchain.chatWithStructuredOutput(
      PAIN_POINT_PROMPT,
      userPrompt,
      PainPointSchema,
    );

    // Store result
    await this.prisma.analysisResult.create({
      data: {
        projectId,
        type: 'PAIN_POINT',
        status: 'COMPLETED',
        data: result as any,
        summary: result.summary,
        sourceCount: reviews.length,
        completedAt: new Date(),
      },
    });

    return result;
  }
}
```

---

## 7. Prompts

### 7.1 Market Landscape Prompt

Create `backend/src/modules/ai-analysis/prompts/market-landscape.prompt.ts`:

```typescript
export const MARKET_LANDSCAPE_PROMPT = `You are a competitive intelligence analyst specializing in mobile app markets.

Your task is to analyze the competitive landscape and provide strategic insights.

ANALYSIS GUIDELINES:
1. Identify market trends and movements
2. Spot opportunities and threats
3. Position competitors on a value/capability matrix
4. Provide actionable recommendations

INSIGHT CATEGORIES:
- MARKET_MOVE: Significant competitor actions
- OPPORTUNITY: Gaps or underserved segments
- THREAT: Competitive risks
- TREND: Industry-wide patterns

IMPACT LEVELS:
- HIGH: Requires immediate attention
- MEDIUM: Should be addressed in 1-3 months
- LOW: Monitor but not urgent

OUTPUT REQUIREMENTS:
- Be specific with evidence from the data
- Avoid generic statements
- Focus on actionable insights
- Provide confidence level based on data quality`;

export const PAIN_POINT_PROMPT = `You are a user experience researcher analyzing customer complaints.

Your task is to extract and categorize pain points from negative reviews.

CATEGORIZATION:
Group complaints into meaningful categories like:
- UX/Usability issues
- Performance problems
- Feature gaps
- Pricing concerns
- Customer support issues
- Bugs/Technical issues

SEVERITY LEVELS:
- CRITICAL: Causes users to uninstall/leave
- MAJOR: Significantly impacts user satisfaction
- MINOR: Annoying but tolerable

FREQUENCY:
- HIGH: Appears in >30% of negative reviews
- MEDIUM: Appears in 10-30%
- LOW: Appears in <10%

OUTPUT REQUIREMENTS:
- Quote specific examples from reviews
- Provide clear recommendations
- Focus on patterns, not individual complaints`;
```

---

## 8. Controller

Create `backend/src/modules/ai-analysis/controllers/analysis.controller.ts`:

```typescript
import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/database/prisma.service';
import { MarketLandscapeService } from '../services/market-landscape.service';
import { PainPointService } from '../services/pain-point.service';

@ApiTags('Analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analysis')
export class AnalysisController {
  constructor(
    private prisma: PrismaService,
    private marketLandscape: MarketLandscapeService,
    private painPoint: PainPointService,
    @InjectQueue('analysis-queue') private analysisQueue: Queue,
  ) {}

  @Post('trigger/:projectId')
  @ApiOperation({ summary: 'Trigger analysis for project' })
  async trigger(
    @Param('projectId') projectId: string,
    @Query('type') type: string,
  ) {
    // Queue the analysis job
    const job = await this.analysisQueue.add('run-analysis', {
      projectId,
      type: type || 'MARKET_LANDSCAPE',
    });

    return { jobId: job.id, status: 'queued' };
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Get all analysis results for project' })
  async getAll(@Param('projectId') projectId: string) {
    return this.prisma.analysisResult.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':projectId/:type')
  @ApiOperation({ summary: 'Get specific analysis type' })
  async getByType(
    @Param('projectId') projectId: string,
    @Param('type') type: string,
  ) {
    return this.prisma.analysisResult.findFirst({
      where: {
        projectId,
        type: type as any,
        status: 'COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':projectId/summary')
  @ApiOperation({ summary: 'Get executive summary' })
  async getSummary(@Param('projectId') projectId: string) {
    return this.prisma.analysisResult.findFirst({
      where: {
        projectId,
        type: 'WHATS_NEW_SUMMARY',
        status: 'COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

---

## 9. Frontend Components

### 9.1 AI Insights Page

Create `frontend/src/features/ai-insights/AIInsightsPage.tsx`:

```typescript
import { useParams } from '@tanstack/react-router';
import { useAnalysisResults } from './hooks/useAnalysis';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { InsightCategoryTabs } from './components/InsightCategoryTabs';
import { PageSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Lightbulb } from 'lucide-react';

export function AIInsightsPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' });
  const { data: analyses, isLoading } = useAnalysisResults(projectId);

  if (isLoading) {
    return <PageSkeleton />;
  }

  const marketLandscape = analyses?.find((a) => a.type === 'MARKET_LANDSCAPE');
  const painPoints = analyses?.find((a) => a.type === 'PAIN_POINT');

  if (!marketLandscape && !painPoints) {
    return (
      <EmptyState
        icon={Lightbulb}
        title="No insights yet"
        description="AI analysis will appear here once enough data is collected from competitors."
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Insights</h2>

      {/* Executive Summary */}
      <ExecutiveSummary analysis={marketLandscape} />

      {/* Insights by Category */}
      <InsightCategoryTabs
        marketLandscape={marketLandscape}
        painPoints={painPoints}
      />
    </div>
  );
}
```

---

## 10. Verification Checklist

### Infrastructure
- [ ] OpenAI API key configured
- [ ] LangChain installed and working
- [ ] Analysis queue configured

### Services
- [ ] LangChain service initialized
- [ ] Market Landscape analysis working
- [ ] Pain Point extraction working
- [ ] Token tracking active

### Prompts
- [ ] Prompts returning structured output
- [ ] JSON parsing working
- [ ] Error handling for invalid responses

### Frontend
- [ ] AI Insights page rendering
- [ ] Executive summary component
- [ ] Insight cards displaying

---

## 11. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analysis/trigger/:projectId` | Trigger analysis |
| GET | `/analysis/:projectId` | Get all results |
| GET | `/analysis/:projectId/:type` | Get by type |
| GET | `/analysis/:projectId/summary` | Get summary |
| GET | `/analysis/usage` | Token usage stats |

---

**Next Step:** Proceed to Alerts Domain Initialization.

