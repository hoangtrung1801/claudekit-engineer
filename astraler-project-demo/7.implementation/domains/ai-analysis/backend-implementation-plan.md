# AI Analysis Backend Implementation Plan

> **Domain:** AI Analysis  
> **Status:** 🔴 Not Started  
> **Created:** December 13, 2024  
> **Last Updated:** December 13, 2024  
> **Progress:** 0/48 tasks completed  
> **Priority:** P1 - High  
> **Phase:** 3 (Intelligence)

---

## 1. Overview

This plan covers the backend implementation for **AI Analysis** domain, the "brain" of the system using LLMs to extract insights:
- LangChain.js integration with OpenAI
- Market Landscape Analysis
- Pain Point Extraction
- Creative Angle Analysis
- Sentiment & Topic Modeling
- Feature Gap Analysis
- Executive Summary generation
- Token usage tracking

**Reference Documents:**
- Domain Planning: `docs/5.planning-setup/domains/ai-analysis/domain-planning.md`
- Domain TDD: `docs/3.technical-design/domains/ai-analysis/domain-tdd.md`

**Estimated Duration:** 4 weeks  
**Dependencies:** Data Processing (cleaned text)

---

## 2. Prerequisites

- [ ] Data Processing Backend completed
- [ ] OpenAI API key configured
- [ ] Sufficient data collected (reviews, competitors)
- [ ] BullMQ queue operational

---

## 3. API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/analysis/trigger/:projectId` | Trigger analysis | Yes |
| GET | `/api/analysis/:projectId` | Get all results | Yes |
| GET | `/api/analysis/:projectId/:type` | Get specific type | Yes |
| GET | `/api/analysis/:projectId/summary` | Get exec summary | Yes |
| GET | `/api/analysis/usage` | Token usage stats | Yes (Admin) |

---

## 4. Implementation Tasks

### 4.1 LangChain & OpenAI Setup (AI-I-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-I-001 | Install LangChain.js dependencies | 1h | ⬜ |
| AI-I-002 | Configure OpenAI API credentials | 1h | ⬜ |
| AI-I-003 | Create LangChainService | 3h | ⬜ |
| AI-I-004 | Implement chat completion wrapper | 2h | ⬜ |
| AI-I-005 | Create structured output parser | 2h | ⬜ |
| AI-I-006 | Implement JSON schema validation | 2h | ⬜ |

### 4.2 Prompt Templates (AI-P-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-P-001 | Create PromptTemplateService | 2h | ⬜ |
| AI-P-002 | Design Market Landscape prompt | 3h | ⬜ |
| AI-P-003 | Design Pain Point extraction prompt | 2h | ⬜ |
| AI-P-004 | Design Sentiment analysis prompt | 2h | ⬜ |
| AI-P-005 | Design Topic clustering prompt | 2h | ⬜ |
| AI-P-006 | Design Creative Angle prompt | 2h | ⬜ |
| AI-P-007 | Design Feature Gap prompt | 2h | ⬜ |
| AI-P-008 | Design Executive Summary prompt | 2h | ⬜ |

### 4.3 Queue Worker (AI-Q-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-Q-001 | Create analysis-queue in BullMQ | 1h | ⬜ |
| AI-Q-002 | Create AnalysisProcessor | 2h | ⬜ |
| AI-Q-003 | Implement job type routing | 2h | ⬜ |
| AI-Q-004 | Configure retry logic | 1h | ⬜ |

### 4.4 Market Landscape Analysis (AI-ML-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-ML-001 | Create MarketLandscapeService | 2h | ⬜ |
| AI-ML-002 | Implement competitor aggregation | 2h | ⬜ |
| AI-ML-003 | Create positioning matrix logic | 3h | ⬜ |
| AI-ML-004 | Parse and store results | 2h | ⬜ |

### 4.5 Pain Point Extraction (AI-PP-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-PP-001 | Create PainPointService | 2h | ⬜ |
| AI-PP-002 | Implement review batching | 2h | ⬜ |
| AI-PP-003 | Parse pain points to categories | 2h | ⬜ |
| AI-PP-004 | Store with frequency counts | 1h | ⬜ |

### 4.6 Sentiment & Topic (AI-ST-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-ST-001 | Create SentimentService | 2h | ⬜ |
| AI-ST-002 | Implement review sentiment scoring | 2h | ⬜ |
| AI-ST-003 | Aggregate sentiment by competitor | 1h | ⬜ |
| AI-ST-004 | Create TopicClusteringService | 2h | ⬜ |
| AI-ST-005 | Extract topics from reviews | 3h | ⬜ |
| AI-ST-006 | Assign sentiment per topic | 2h | ⬜ |

### 4.7 Executive Summary (AI-ES-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-ES-001 | Create ExecutiveSummaryService | 2h | ⬜ |
| AI-ES-002 | Aggregate daily insights | 3h | ⬜ |
| AI-ES-003 | Generate 3 key insights | 2h | ⬜ |
| AI-ES-004 | Add impact/sentiment scoring | 2h | ⬜ |

### 4.8 Storage & API (AI-S-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-S-001 | Create AnalysisResult service | 2h | ⬜ |
| AI-S-002 | Implement result storage with type | 1h | ⬜ |
| AI-S-003 | Create API to trigger analysis | 2h | ⬜ |
| AI-S-004 | Create API to get results | 2h | ⬜ |
| AI-S-005 | Create AnalysisController | 2h | ⬜ |

### 4.9 Token Management (AI-TM-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-TM-001 | Create TokenTrackingService | 2h | ⬜ |
| AI-TM-002 | Log token usage per analysis | 1h | ⬜ |
| AI-TM-003 | Implement daily/monthly caps | 2h | ⬜ |
| AI-TM-004 | Alert when approaching limits | 1h | ⬜ |

### 4.10 Module Setup (AI-MOD-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-MOD-001 | Create AIAnalysisModule | 1h | ⬜ |
| AI-MOD-002 | Register in AppModule | 0.5h | ⬜ |

### 4.11 Tests (AI-TST-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| AI-TST-001 | Unit tests for services | 3h | ⬜ |
| AI-TST-002 | Integration tests with mock LLM | 3h | ⬜ |
| AI-TST-003 | Prompt testing with sample data | 2h | ⬜ |

---

## 5. Files to Create

```
backend/src/modules/ai-analysis/
├── ai-analysis.module.ts               ⬜
├── controllers/
│   └── analysis.controller.ts          ⬜
├── services/
│   ├── langchain.service.ts            ⬜
│   ├── prompt-template.service.ts      ⬜
│   ├── market-landscape.service.ts     ⬜
│   ├── pain-point.service.ts           ⬜
│   ├── sentiment.service.ts            ⬜
│   ├── topic-clustering.service.ts     ⬜
│   ├── executive-summary.service.ts    ⬜
│   ├── analysis-result.service.ts      ⬜
│   └── token-tracking.service.ts       ⬜
├── processors/
│   └── analysis.processor.ts           ⬜
├── prompts/
│   ├── market-landscape.prompt.ts      ⬜
│   ├── pain-point.prompt.ts            ⬜
│   ├── sentiment.prompt.ts             ⬜
│   ├── topic.prompt.ts                 ⬜
│   └── summary.prompt.ts               ⬜
├── dto/
│   ├── trigger-analysis.dto.ts         ⬜
│   └── analysis-result.dto.ts          ⬜
├── types/
│   └── analysis.types.ts               ⬜
└── tests/
    └── analysis.service.spec.ts        ⬜
```

---

## 6. Analysis Result Schema

```typescript
interface AnalysisResult {
  id: string;
  projectId: string;
  type: AnalysisType;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  data: {
    insights: Insight[];
    recommendations: string[];
    metadata: {
      sourceCount: number;
      confidence: string;
      tokensUsed: number;
    };
  };
  createdAt: Date;
  completedAt?: Date;
}

interface Insight {
  title: string;
  description: string;
  category: 'MARKET_MOVE' | 'OPPORTUNITY' | 'THREAT' | 'VIRAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  evidence: string[];
}
```

---

## 7. Cost Estimation

| Analysis Type | Est. Tokens/Run | Cost (GPT-4) |
|---------------|-----------------|--------------|
| Market Landscape | ~3000 | ~$0.09 |
| Pain Points | ~2000 | ~$0.06 |
| Sentiment | ~1500 | ~$0.045 |
| Executive Summary | ~2500 | ~$0.075 |
| **Daily Total (1 project)** | ~9000 | ~$0.27 |

---

## 8. Verification Checklist

- [ ] LangChain integration working
- [ ] Market Landscape analysis generates insights
- [ ] Pain Points extracted and categorized
- [ ] Sentiment scores calculated
- [ ] Topics clustered correctly
- [ ] Executive Summary generated
- [ ] Results stored in database
- [ ] Token usage tracked
- [ ] Analysis completes < 30 seconds
- [ ] Error handling for API failures

---

**Next Step:** After AI Analysis Backend, proceed to Alerts Backend.

