# Domain Planning: Data Processing

> **Reference:** [System Planning](../../system-planning.md)  
> **Phase:** 2 (Data Engine)  
> **Priority:** P1 - High

---

## 1. Domain Overview

### 1.1 Domain Name & Scope

**Data Processing Domain** processes and normalizes raw data from crawlers, detects Hero Videos and prepares data for AI Analysis.

**Scope:**
- Schema normalization (raw → canonical)
- Text cleaning and pre-processing
- Hero Video detection algorithm
- Deduplication logic
- Event emission for downstream

**Out of Scope:**
- Data fetching (Data Collection Domain)
- AI/LLM analysis (AI Analysis Domain)
- Data visualization (Dashboard Domain)

### 1.2 Domain Objectives

| Objective | Success Criteria |
|-----------|------------------|
| Data normalization | Single canonical schema for all sources |
| Hero Video detection | Detect videos with >20% growth in 24h |
| Text preparation | Clean text ready for AI analysis |
| Data integrity | No duplicates, valid references |

### 1.3 Domain Context

**Dependencies:**
- **From Data Collection:** Raw crawled data
- **To AI Analysis:** Cleaned text for LLM processing
- **To Alerts:** Hero Video events
- **To Dashboard:** Processed data for display

**Integration Points:**
- Event listeners from Data Collection
- Event emitters for Hero Video alerts
- Database writes for processed data

---

## 2. Features Breakdown

### 2.1 Feature List

| Feature ID | Feature Name | Priority | Complexity | Est. Points |
|------------|--------------|----------|------------|-------------|
| DP-01 | Normalization Engine | P0 | High | 8 |
| DP-02 | TikTok Data Transformer | P0 | Medium | 5 |
| DP-03 | YouTube Data Transformer | P0 | Medium | 5 |
| DP-04 | Instagram Data Transformer | P1 | Medium | 5 |
| DP-05 | Text Cleaning Service | P0 | Medium | 5 |
| DP-06 | Transcript Preparation | P1 | Medium | 5 |
| DP-07 | Hero Video Detection | P0 | High | 8 |
| DP-08 | Growth Rate Calculation | P0 | Medium | 5 |
| DP-09 | Hero Score Assignment | P0 | Low | 3 |
| DP-10 | Deduplication Logic | P1 | Medium | 5 |
| DP-11 | Data Validation | P0 | Medium | 5 |
| DP-12 | Event Emission (Hero Video) | P0 | Low | 2 |
| **Total** | | | | **61 points** |

### 2.2 Feature Dependencies

```
DP-01 (Normalization Engine)
     │
     ├──▶ DP-02 (TikTok Transformer)
     ├──▶ DP-03 (YouTube Transformer)
     ├──▶ DP-04 (Instagram Transformer)
     │
     └──▶ DP-11 (Validation) ──▶ DP-10 (Dedup)

DP-05 (Text Cleaning) ──▶ DP-06 (Transcript Prep)

DP-08 (Growth Rate) ──▶ DP-07 (Hero Detection) ──▶ DP-09 (Hero Score)
                                  │
                                  └──▶ DP-12 (Event)
```

---

## 3. Tasks Breakdown

### 3.1 Normalization Engine

#### Core Engine
- [ ] **DP-N01**: Create NormalizationService class - 2h
- [ ] **DP-N02**: Define CanonicalVideo interface - 1h
- [ ] **DP-N03**: Define CanonicalPost interface - 1h
- [ ] **DP-N04**: Define CanonicalChannel interface - 1h
- [ ] **DP-N05**: Create transformer interface/base class - 2h

#### Platform Transformers
- [ ] **DP-T01**: Implement TikTokTransformer - 4h
- [ ] **DP-T02**: Implement YouTubeTransformer - 4h
- [ ] **DP-T03**: Implement InstagramTransformer - 4h
- [ ] **DP-T04**: Implement FacebookTransformer - 3h

#### Validation
- [ ] **DP-V01**: Create ValidationService - 2h
- [ ] **DP-V02**: Implement required fields check - 2h
- [ ] **DP-V03**: Implement data type validation - 2h
- [ ] **DP-V04**: Implement reference validation - 2h

### 3.2 Text Processing

- [ ] **DP-TX01**: Create TextCleaningService - 2h
- [ ] **DP-TX02**: Implement HTML tag removal - 1h
- [ ] **DP-TX03**: Implement emoji handling (keep/remove config) - 2h
- [ ] **DP-TX04**: Implement URL extraction/removal - 1h
- [ ] **DP-TX05**: Implement text truncation for AI limits - 2h
- [ ] **DP-TX06**: Implement transcript chunking logic - 3h

### 3.3 Hero Video Detection

#### Growth Calculation
- [ ] **DP-H01**: Create HeroDetectionService - 2h
- [ ] **DP-H02**: Implement snapshot comparison logic - 3h
- [ ] **DP-H03**: Calculate view growth rate - 2h
- [ ] **DP-H04**: Calculate engagement growth rate - 2h
- [ ] **DP-H05**: Define hero threshold configuration - 1h

#### Scoring & Events
- [ ] **DP-H06**: Implement hero score calculation - 3h
- [ ] **DP-H07**: Update video heroScore field - 1h
- [ ] **DP-H08**: Emit `hero-video.detected` event - 1h
- [ ] **DP-H09**: Create job to run detection on schedule - 2h

### 3.4 Deduplication

- [ ] **DP-D01**: Implement duplicate detection by platformId - 2h
- [ ] **DP-D02**: Implement merge logic for duplicates - 2h
- [ ] **DP-D03**: Log duplicate occurrences - 1h

### 3.5 Event Listeners

- [ ] **DP-E01**: Listen to `video.created` → trigger processing - 1h
- [ ] **DP-E02**: Listen to `video.snapshot.created` → trigger hero check - 1h
- [ ] **DP-E03**: Emit events for AI Analysis queue - 1h

### 3.6 Testing

- [ ] **DP-TS01**: Unit tests for transformers - 3h
- [ ] **DP-TS02**: Unit tests for hero detection - 3h
- [ ] **DP-TS03**: Integration tests for pipeline - 2h

---

## 4. Timeline & Sprints

### 4.1 Sprint Breakdown

**Sprint 5 (Week 13-14): Normalization & Hero Detection**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | DP-N01 to DP-N05 | Core engine ready |
| Day 3-4 | DP-T01 to DP-T04 | Platform transformers |
| Day 5-6 | DP-H01 to DP-H05 | Growth calculation |
| Day 7-8 | DP-H06 to DP-H09 | Hero scoring & events |
| Day 9-10 | DP-V01 to DP-V04 | Validation |

**Sprint 6 (Week 15-16): Text Processing & Polish**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | DP-TX01 to DP-TX06 | Text cleaning |
| Day 3-4 | DP-D01 to DP-D03 | Deduplication |
| Day 5-6 | DP-E01 to DP-E03 | Event listeners |
| Day 7-10 | Testing & bug fixes | Domain complete |

### 4.2 Timeline Estimate

| Milestone | Duration | Week |
|-----------|----------|------|
| Normalization Engine | 1 week | Week 13 |
| Hero Video Detection | 1 week | Week 14 |
| Text Processing | 1 week | Week 15 |
| Testing & Polish | 0.5 week | Week 16 |
| **Total** | **3.5 weeks** | **Week 13-16** |

### 4.3 Milestones

1. **M1: Normalization Working** - Raw data transformed to canonical
2. **M2: Hero Videos Detected** - High-growth videos identified
3. **M3: Pipeline Complete** - Full processing flow operational

---

## 5. Resource Allocation

### 5.1 Team Assignment

| Role | Allocation | Tasks |
|------|------------|-------|
| Backend Developer | 100% | All DP tasks |

### 5.2 Capacity Planning

- Normalization: ~27 hours
- Hero Detection: ~17 hours
- Text Processing: ~11 hours
- Deduplication: ~5 hours
- Events & Testing: ~9 hours
- **Total: ~69 hours (~2 weeks)**

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies
- None (pure data processing)

### 6.2 Internal Dependencies
- Data Collection domain must provide raw data
- Database schema for snapshots must exist

### 6.3 Blockers

| Blocker | Mitigation |
|---------|------------|
| No snapshot data | Use first crawl as baseline |
| Platform schema changes | Robust validation, fallbacks |

---

## 7. Risk Assessment

### 7.1 Domain-Specific Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Incorrect hero detection | Medium | Medium | Tune thresholds, validate manually |
| Data loss during transform | Low | High | Validate before/after, keep raw backup |
| Performance with large data | Low | Medium | Batch processing, async |

---

## 8. Definition of Done

### 8.1 Feature Completion Criteria

- [ ] Raw data normalized to canonical schema
- [ ] All platform transformers implemented
- [ ] Hero videos detected and scored
- [ ] Text cleaned and ready for AI
- [ ] Duplicates handled correctly
- [ ] Events emitted to downstream

### 8.2 Quality Gates

- [ ] 100% of required fields populated
- [ ] Hero detection accuracy > 90%
- [ ] No data corruption during transform
- [ ] Processing latency < 1 second per item

---

## 9. Hero Video Detection Algorithm

```
Algorithm: Hero Video Detection

Input: VideoId

1. Get current video metrics (views, likes, engagement)
2. Get snapshot from 24h ago
3. If no previous snapshot:
   - Mark video as "too new" for hero detection
   - Exit
4. Calculate growth rates:
   - view_growth = (current_views - prev_views) / prev_views * 100
   - engagement_growth = (current_engagement - prev_engagement) / prev_engagement * 100
5. Calculate hero_score:
   - hero_score = (view_growth * 0.7) + (engagement_growth * 0.3)
6. If hero_score >= HERO_THRESHOLD (default 20):
   - Mark video as hero
   - Update video.heroScore
   - Emit 'hero-video.detected' event
7. Store metrics snapshot

Configuration:
- HERO_THRESHOLD: 20 (%)
- LOOKBACK_PERIOD: 24 hours
```

---

## 10. Data Flow Diagram

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Crawler   │────▶│  Normalization  │────▶│   Database   │
│  Raw Data   │     │    Engine       │     │  Canonical   │
└─────────────┘     └─────────────────┘     └──────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Text Cleaning │──────▶ AI Analysis
                    └───────────────┘
                            
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Snapshot   │────▶│ Hero Detection  │────▶│    Alerts    │
│   Created   │     │    Service      │     │   Domain     │
└─────────────┘     └─────────────────┘     └──────────────┘
```

---

**Next Step:** Proceed to AI Analysis Domain Planning.

