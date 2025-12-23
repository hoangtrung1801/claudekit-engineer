# Domain TDD: AI Analysis

## 1. Module Structure
```text
src/modules/ai-analysis/
├── chains/
│   ├── market-landscape.chain.ts
│   ├── pain-points.chain.ts
│   ├── creative-angle.chain.ts
│   ├── video-trends.chain.ts
│   └── whats-new.chain.ts
├── dto/
│   ├── trigger-analysis.dto.ts
│   └── analysis-result.dto.ts
├── entities/
│   └── analysis-result.entity.ts (Prisma Type)
├── processors/
│   ├── ai-analysis.processor.ts
├── ai-analysis.controller.ts
├── ai-analysis.service.ts
└── ai-analysis.module.ts
```

## 2. Database Models (Prisma Schema)
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
  triggeredBy String?        // 'auto' | 'manual'
  createdAt   DateTime       @default(now())
  completedAt DateTime?

  @@index([projectId, type])
  @@index([projectId, createdAt])
}
```

## 3. Chains (`whats-new.chain.ts`)
```typescript
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

export const createWhatsNewChain = () => {
  const model = new ChatOpenAI({ model: "gpt-4o" });
  
  const prompt = PromptTemplate.fromTemplate(`
    Analyze this app update:
    Version: {version}
    Changelog: {changelog}
    
    Determine the strategic intent and impact (HIGH/MEDIUM/LOW).
    Return JSON: { "insight": "...", "impact": "HIGH" }
  `);

  return prompt.pipe(model).pipe(new JsonOutputParser());
};
```

## 5. Service Logic (`ai-analysis.service.ts`)
```typescript
@Injectable()
export class AiAnalysisService {
  constructor(
    @InjectQueue('ai-tasks') private queue: Queue,
    private prisma: PrismaService
  ) {}

  async triggerAnalysis(projectId: string, type: AnalysisType, triggeredBy: 'auto' | 'manual' = 'auto') {
    // 1. Create pending AnalysisResult record
    const analysis = await this.prisma.analysisResult.create({
      data: {
        projectId,
        type,
        status: 'PENDING',
        triggeredBy,
      }
    });

    // 2. Enqueue job
    await this.queue.add(type, { projectId, analysisId: analysis.id });

    return analysis;
  }

  async triggerPainPointAnalysis(projectId: string) {
    // Check for unanalyzed reviews
    const pendingCount = await this.prisma.review.count({
      where: { competitor: { projectId }, isAnalyzed: false, sentiment: 'NEGATIVE' }
    });

    if (pendingCount > 10) { // Batch threshold
       return this.triggerAnalysis(projectId, 'PAIN_POINT', 'auto');
    }
  }

  async getLatestAnalysis(projectId: string, type: AnalysisType) {
    return this.prisma.analysisResult.findFirst({
      where: { projectId, type, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' }
    });
  }

  async getAnalysisHistory(projectId: string, type?: AnalysisType) {
    return this.prisma.analysisResult.findMany({
      where: { projectId, ...(type && { type }) },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }
}
```

## 6. Worker Processor (`ai-analysis.processor.ts`)
```typescript
@Processor('ai-tasks')
export class AiAnalysisProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private painPointChain: PainPointChain,
    private marketLandscapeChain: MarketLandscapeChain
  ) { super(); }

  async process(job: Job) {
    const { projectId, analysisId } = job.data;

    // 1. Mark as PROCESSING
    await this.prisma.analysisResult.update({
      where: { id: analysisId },
      data: { status: 'PROCESSING' }
    });

    try {
      let result: { data: any; summary: string; sourceCount: number };

      switch (job.name) {
        case 'PAIN_POINT':
          result = await this.processPainPoints(projectId);
          break;
        case 'MARKET_LANDSCAPE':
          result = await this.processMarketLandscape(projectId);
          break;
        // ... other types
        default:
          throw new Error(`Unknown analysis type: ${job.name}`);
      }

      // 2. Save result and mark COMPLETED
      await this.prisma.analysisResult.update({
        where: { id: analysisId },
        data: {
          status: 'COMPLETED',
          data: result.data,
          summary: result.summary,
          sourceCount: result.sourceCount,
          completedAt: new Date()
        }
      });
    } catch (error) {
      // 3. Mark FAILED
      await this.prisma.analysisResult.update({
        where: { id: analysisId },
        data: { status: 'FAILED', data: { error: error.message } }
      });
      throw error;
    }
  }

  private async processPainPoints(projectId: string) {
    // Fetch unanalyzed negative reviews
    const reviews = await this.prisma.review.findMany({
      where: { competitor: { projectId }, isAnalyzed: false, sentiment: 'NEGATIVE' },
      take: 100
    });

    // Run AI chain
    const aiResult = await this.painPointChain.invoke({ reviews });

    // Mark reviews as analyzed
    await this.prisma.review.updateMany({
      where: { id: { in: reviews.map(r => r.id) } },
      data: { isAnalyzed: true }
    });

    return {
      data: aiResult, // { painPoints: [{ issue, frequency, sentiment }] }
      summary: `Extracted ${aiResult.painPoints.length} pain points from ${reviews.length} reviews`,
      sourceCount: reviews.length
    };
  }

  private async processMarketLandscape(projectId: string) {
    // Fetch competitors with descriptions and top reviews
    const competitors = await this.prisma.competitor.findMany({
      where: { projectId },
      include: { reviews: { take: 5, orderBy: { rating: 'asc' } } }
    });

    // Run AI chain
    const aiResult = await this.marketLandscapeChain.invoke({ competitors });

    return {
      data: aiResult, // { positioning, gaps, swot, opportunities }
      summary: `Market landscape analysis for ${competitors.length} competitors`,
      sourceCount: competitors.length
    };
  }
}
```
