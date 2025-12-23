# Domain Planning: AI Analysis

> **Reference:** [System Planning](../../system-planning.md)  
> **Phase:** 3 (Intelligence)  
> **Priority:** P1 - High

---

## 1. Domain Overview

### 1.1 Domain Name & Scope

**AI Analysis Domain** is the "brain" of the system, using LLMs to extract insights from processed data.

**Scope:**
- LangChain.js integration with OpenAI
- Market Landscape Analysis
- Pain Point Extraction
- Creative Angle Analysis
- Sentiment & Topic Modeling
- Feature Gap Analysis
- Executive Summary generation

**Out of Scope:**
- Data collection/crawling
- Data visualization (Dashboard)
- Real-time streaming responses

### 1.2 Domain Objectives

| Objective | Success Criteria |
|-----------|------------------|
| Actionable insights | Insights can be applied immediately to strategy |
| Cost efficiency | Token usage optimized with batching |
| Speed | Analysis complete < 30 seconds |
| Accuracy | No hallucination about critical data |

### 1.3 Domain Context

**Dependencies:**
- **From Data Processing:** Cleaned text, prepared data
- **To Dashboard:** Insights for display
- **To Alerts:** Significant findings trigger notifications

**Integration Points:**
- OpenAI API
- LangChain.js for prompt orchestration
- BullMQ for async processing
- Database for storing results

---

## 2. Features Breakdown

### 2.1 Feature List

| Feature ID | Feature Name | Priority | Complexity | Est. Points |
|------------|--------------|----------|------------|-------------|
| AI-01 | LangChain.js Setup | P0 | Medium | 5 |
| AI-02 | OpenAI Adapter | P0 | Medium | 5 |
| AI-03 | Prompt Templates Engine | P0 | Medium | 5 |
| AI-04 | Market Landscape Analysis | P0 | High | 8 |
| AI-05 | Pain Point Extraction | P0 | High | 8 |
| AI-06 | Sentiment Analysis | P1 | Medium | 5 |
| AI-07 | Topic Clustering | P1 | High | 8 |
| AI-08 | Creative Angle Analysis | P2 | High | 8 |
| AI-09 | Feature Gap Analysis | P2 | High | 8 |
| AI-10 | Executive Summary | P0 | Medium | 5 |
| AI-11 | Analysis Queue Worker | P0 | Medium | 5 |
| AI-12 | Result Storage | P0 | Low | 3 |
| AI-13 | Token Usage Tracking | P1 | Low | 3 |
| AI-14 | Analysis Trigger API | P0 | Low | 3 |
| **Total** | | | | **79 points** |

### 2.2 Analysis Types

| Type | Input | Output | Priority |
|------|-------|--------|----------|
| MARKET_LANDSCAPE | Competitors + Reviews | Positioning, Gaps, Opportunities | P0 |
| PAIN_POINT | Negative Reviews | User problems categorized | P0 |
| SENTIMENT_TOPIC | Reviews | Topics with sentiment scores | P1 |
| CREATIVE_ANGLE | Ad transcripts | Hook, Body, CTA analysis | P2 |
| FEATURE_GAP | What's New + Reviews | Missing features | P2 |
| VIDEO_TRENDS | Hero videos | Pattern insights | P2 |
| EXECUTIVE_SUMMARY | All data | Daily briefing | P0 |

### 2.3 Feature Dependencies

```
AI-01 (LangChain) ──▶ AI-02 (OpenAI) ──▶ AI-03 (Prompts)
                                              │
        ┌─────────────────────────────────────┴────────────────────────┐
        │                             │                                │
        ▼                             ▼                                ▼
AI-04 (Landscape)            AI-05 (Pain Points)              AI-06 (Sentiment)
        │                             │                                │
        └─────────────────────────────┴────────────────────────────────┘
                                      │
                                      ▼
                              AI-10 (Executive Summary)
                                      │
                              AI-12 (Storage)

AI-11 (Queue) ←── All Analysis Tasks
AI-13 (Token Tracking) ←── All AI Calls
```

---

## 3. Tasks Breakdown

### 3.1 Infrastructure Setup

#### LangChain & OpenAI
- [ ] **AI-I01**: Install LangChain.js dependencies - 1h
- [ ] **AI-I02**: Configure OpenAI API credentials - 1h
- [ ] **AI-I03**: Create LangChainService - 3h
- [ ] **AI-I04**: Implement chat completion wrapper - 2h
- [ ] **AI-I05**: Create structured output parser - 2h

#### Prompt Templates
- [ ] **AI-P01**: Create PromptTemplateService - 2h
- [ ] **AI-P02**: Design Market Landscape prompt - 3h
- [ ] **AI-P03**: Design Pain Point prompt - 2h
- [ ] **AI-P04**: Design Sentiment prompt - 2h
- [ ] **AI-P05**: Design Executive Summary prompt - 2h

#### Queue Worker
- [ ] **AI-Q01**: Create analysis-queue in BullMQ - 1h
- [ ] **AI-Q02**: Create AnalysisProcessor - 2h
- [ ] **AI-Q03**: Implement job type routing - 2h
- [ ] **AI-Q04**: Configure retry logic - 1h

### 3.2 Analysis Implementations

#### Market Landscape Analysis
- [ ] **AI-ML01**: Create MarketLandscapeService - 2h
- [ ] **AI-ML02**: Implement competitor aggregation - 2h
- [ ] **AI-ML03**: Create positioning matrix logic - 3h
- [ ] **AI-ML04**: Parse and store results - 2h

#### Pain Point Extraction
- [ ] **AI-PP01**: Create PainPointService - 2h
- [ ] **AI-PP02**: Implement review batching - 2h
- [ ] **AI-PP03**: Parse pain points to categories - 2h
- [ ] **AI-PP04**: Store with frequency counts - 1h

#### Sentiment Analysis
- [ ] **AI-SA01**: Create SentimentService - 2h
- [ ] **AI-SA02**: Implement review sentiment scoring - 2h
- [ ] **AI-SA03**: Aggregate sentiment by competitor - 1h

#### Topic Clustering
- [ ] **AI-TC01**: Create TopicClusteringService - 2h
- [ ] **AI-TC02**: Extract topics from reviews - 3h
- [ ] **AI-TC03**: Assign sentiment per topic - 2h

#### Executive Summary
- [ ] **AI-ES01**: Create ExecutiveSummaryService - 2h
- [ ] **AI-ES02**: Aggregate daily insights - 3h
- [ ] **AI-ES03**: Generate 3 key insights - 2h
- [ ] **AI-ES04**: Add impact/sentiment scoring - 2h

### 3.3 Storage & API

- [ ] **AI-S01**: Create AnalysisResult model/service - 2h
- [ ] **AI-S02**: Implement result storage with type - 1h
- [ ] **AI-S03**: Create API to trigger analysis - 2h
- [ ] **AI-S04**: Create API to get analysis results - 2h

### 3.4 Token Management

- [ ] **AI-TM01**: Create TokenTrackingService - 2h
- [ ] **AI-TM02**: Log token usage per analysis - 1h
- [ ] **AI-TM03**: Implement daily/monthly caps - 2h
- [ ] **AI-TM04**: Alert when approaching limits - 1h

### 3.5 Testing

- [ ] **AI-T01**: Unit tests for services - 3h
- [ ] **AI-T02**: Integration tests with mock LLM - 3h
- [ ] **AI-T03**: Prompt testing with sample data - 2h

---

## 4. Timeline & Sprints

### 4.1 Sprint Breakdown

**Sprint 7 (Week 19-20): Infrastructure & Core Analysis**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | AI-I01 to AI-I05 | LangChain setup |
| Day 3-4 | AI-P01 to AI-P05 | Prompt templates |
| Day 5-6 | AI-Q01 to AI-Q04 | Queue worker |
| Day 7-8 | AI-ML01 to AI-ML04 | Market Landscape |
| Day 9-10 | AI-PP01 to AI-PP04 | Pain Points |

**Sprint 8 (Week 21-22): Extended Analysis & Polish**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | AI-SA01 to AI-TC03 | Sentiment & Topics |
| Day 3-4 | AI-ES01 to AI-ES04 | Executive Summary |
| Day 5-6 | AI-S01 to AI-S04 | Storage & APIs |
| Day 7-8 | AI-TM01 to AI-TM04 | Token management |
| Day 9-10 | AI-T01 to AI-T03 | Testing |

### 4.2 Timeline Estimate

| Milestone | Duration | Week |
|-----------|----------|------|
| Infrastructure | 1 week | Week 19 |
| Core Analysis (Landscape, Pain Points) | 1 week | Week 20 |
| Extended Analysis | 1 week | Week 21 |
| Polish & Testing | 1 week | Week 22 |
| **Total** | **4 weeks** | **Week 19-22** |

### 4.3 Milestones

1. **M1: LangChain Operational** - LLM calls working
2. **M2: Market Landscape Ready** - First analysis type complete
3. **M3: All Analysis Types** - Full analysis suite
4. **M4: Production Ready** - Token tracking, testing complete

---

## 5. Resource Allocation

### 5.1 Team Assignment

| Role | Allocation | Tasks |
|------|------------|-------|
| Backend Developer | 100% | All AI tasks |

### 5.2 Capacity Planning

- Infrastructure: ~18 hours
- Analysis Services: ~35 hours
- Storage & API: ~7 hours
- Token Management: ~6 hours
- Testing: ~8 hours
- **Total: ~74 hours (~2 weeks)**

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies

| Dependency | Provider | Purpose |
|------------|----------|---------|
| OpenAI API | OpenAI | GPT-4 for analysis |
| LangChain.js | LangChain | Prompt orchestration |

### 6.2 Internal Dependencies
- Data Processing complete (cleaned text available)
- Sufficient data collected (reviews, competitors)

### 6.3 Blockers

| Blocker | Mitigation |
|---------|------------|
| OpenAI rate limits | Implement queuing, backoff |
| High token costs | Batching, prompt optimization |
| Insufficient data | Show "not enough data" state |

---

## 7. Risk Assessment

### 7.1 Domain-Specific Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API cost overrun | Medium | High | Token caps, alerts |
| Hallucination | Low | High | Structured outputs, validation |
| Slow response | Medium | Medium | Async processing, caching |
| API downtime | Low | Medium | Retry logic, queue for later |

### 7.2 Cost Estimation

| Analysis Type | Est. Tokens/Run | Cost (GPT-4) |
|---------------|-----------------|--------------|
| Market Landscape | ~3000 | ~$0.09 |
| Pain Points | ~2000 | ~$0.06 |
| Sentiment | ~1500 | ~$0.045 |
| Executive Summary | ~2500 | ~$0.075 |
| **Daily Total (1 project)** | ~9000 | ~$0.27 |

---

## 8. Definition of Done

### 8.1 Feature Completion Criteria

- [ ] LangChain integration working
- [ ] Market Landscape analysis generates insights
- [ ] Pain Points extracted and categorized
- [ ] Sentiment scores calculated
- [ ] Executive Summary generated daily
- [ ] Results stored in database
- [ ] Token usage tracked

### 8.2 Quality Gates

- [ ] Analysis completes < 30 seconds
- [ ] No hallucinated facts
- [ ] Structured output parseable
- [ ] Token usage within budget
- [ ] Error handling for API failures

---

## 9. Prompt Engineering Guidelines

### 9.1 Prompt Structure

```
[SYSTEM]
You are a competitive intelligence analyst for mobile apps.
Your task is to {TASK_DESCRIPTION}.

[CONTEXT]
Project: {PROJECT_NAME}
Competitors: {COMPETITOR_LIST}
Data: {DATA_SUMMARY}

[INSTRUCTIONS]
1. Analyze the provided data
2. Focus on actionable insights
3. Be specific with evidence
4. Format output as JSON

[OUTPUT FORMAT]
{
  "insights": [...],
  "recommendations": [...],
  "confidence": "HIGH|MEDIUM|LOW"
}
```

### 9.2 Best Practices

1. **Be specific** - Clear task definition
2. **Provide context** - Project/competitor info
3. **Structured output** - JSON for parsing
4. **Limit scope** - One analysis type per prompt
5. **Evidence-based** - Cite data in insights

---

## 10. Analysis Result Schema

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
  category: string; // 'MARKET_MOVE' | 'OPPORTUNITY' | 'THREAT' | 'VIRAL'
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  evidence: string[];
}
```

---

## 11. API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analysis/trigger/:projectId` | Trigger analysis |
| GET | `/analysis/:projectId` | Get all analysis results |
| GET | `/analysis/:projectId/:type` | Get specific analysis type |
| GET | `/analysis/:projectId/summary` | Get executive summary |
| GET | `/analysis/usage` | Get token usage stats |

---

**Next Step:** Proceed to Alerts Domain Planning.

