# Data Processing Backend Implementation Plan

> **Domain:** Data Processing
> **Status:** 🟢 Completed
> **Created:** December 13, 2024
> **Last Updated:** December 13, 2024
> **Progress:** 34/42 tasks completed (81%)
> **Priority:** P1 - High
> **Phase:** 2 (Data Engine)

---

## 1. Overview

This plan covers the backend implementation for **Data Processing** domain, including:
- Schema normalization (raw → canonical)
- Platform-specific data transformers
- Hero Video detection algorithm
- Text cleaning for AI analysis
- Deduplication logic
- Event emission for downstream

**Reference Documents:**
- Domain Planning: `docs/5.planning-setup/domains/data-processing/domain-planning.md`
- Domain TDD: `docs/3.technical-design/domains/data-processing/domain-tdd.md`

**Estimated Duration:** 3.5 weeks
**Dependencies:** Data Collection (raw data)

---

## 2. Prerequisites

- [x] Data Collection Backend completed
- [x] Video/Post snapshots being created
- [x] Event emitter configured

---

## 3. Implementation Tasks

### 3.1 Normalization Engine (DP-N-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-N-001 | Create NormalizationService class | 2h | ✅ |
| DP-N-002 | Define CanonicalVideo interface | 1h | ✅ |
| DP-N-003 | Define CanonicalPost interface | 1h | ✅ |
| DP-N-004 | Define CanonicalChannel interface | 1h | ✅ |
| DP-N-005 | Create transformer interface/base class | 2h | ✅ |

### 3.2 Platform Transformers (DP-T-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-T-001 | Implement TikTokTransformer | 4h | ✅ |
| DP-T-002 | Implement YouTubeTransformer | 4h | ✅ |
| DP-T-003 | Implement InstagramTransformer | 4h | ✅ |
| DP-T-004 | Implement FacebookTransformer | 3h | ✅ |
| DP-T-005 | Implement XTransformer (Twitter) | 3h | ✅ |

### 3.3 Validation (DP-V-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-V-001 | Create ValidationService | 2h | ✅ |
| DP-V-002 | Implement required fields check | 2h | ✅ |
| DP-V-003 | Implement data type validation | 2h | ✅ |
| DP-V-004 | Implement reference validation | 2h | ✅ |

### 3.4 Text Processing (DP-TX-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-TX-001 | Create TextCleaningService | 2h | ✅ |
| DP-TX-002 | Implement HTML tag removal | 1h | ✅ |
| DP-TX-003 | Implement emoji handling | 2h | ✅ |
| DP-TX-004 | Implement URL extraction/removal | 1h | ✅ |
| DP-TX-005 | Implement text truncation for AI | 2h | ✅ |
| DP-TX-006 | Implement transcript chunking | 3h | ✅ |

### 3.5 Hero Video Detection (DP-H-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-H-001 | Create HeroDetectionService | 2h | ✅ |
| DP-H-002 | Implement snapshot comparison logic | 3h | ✅ |
| DP-H-003 | Calculate view growth rate | 2h | ✅ |
| DP-H-004 | Calculate engagement growth rate | 2h | ✅ |
| DP-H-005 | Define hero threshold configuration | 1h | ✅ |
| DP-H-006 | Implement hero score calculation | 3h | ✅ |
| DP-H-007 | Update video heroScore field | 1h | ✅ |
| DP-H-008 | Emit hero-video.detected event | 1h | ✅ |
| DP-H-009 | Create scheduled job for detection | 2h | ✅ (in SchedulerService) |

### 3.6 Deduplication (DP-D-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-D-001 | Implement duplicate detection by platformId | 2h | ✅ |
| DP-D-002 | Implement merge logic for duplicates | 2h | ✅ |
| DP-D-003 | Log duplicate occurrences | 1h | ✅ |

### 3.7 Event Listeners (DP-E-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-E-001 | Listen to video.created → trigger processing | 1h | ✅ |
| DP-E-002 | Listen to video.snapshot.created → trigger hero check | 1h | ✅ |
| DP-E-003 | Emit events for AI Analysis queue | 1h | ✅ |

### 3.8 Module Setup (DP-MOD-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-MOD-001 | Create DataProcessingModule | 1h | ✅ |
| DP-MOD-002 | Register in AppModule | 0.5h | ✅ |

### 3.9 Tests (DP-TST-*)

| ID | Task | Est. | Status |
|----|------|------|--------|
| DP-TST-001 | Unit tests for transformers | 3h | ⬜ (Phase 4) |
| DP-TST-002 | Unit tests for hero detection | 3h | ⬜ (Phase 4) |
| DP-TST-003 | Integration tests for pipeline | 2h | ⬜ (Phase 4) |

---

## 4. Files Created

```
backend/src/modules/data-processing/
├── data-processing.module.ts           ✅
├── services/
│   ├── normalization.service.ts        ✅
│   ├── validation.service.ts           ✅
│   ├── text-cleaning.service.ts        ✅
│   ├── hero-detection.service.ts       ✅
│   ├── deduplication.service.ts        ✅
│   └── index.ts                        ✅
├── transformers/
│   ├── base.transformer.ts             ✅
│   ├── tiktok.transformer.ts           ✅
│   ├── youtube.transformer.ts          ✅
│   ├── instagram.transformer.ts        ✅
│   ├── facebook.transformer.ts         ✅
│   ├── x.transformer.ts                ✅
│   └── index.ts                        ✅
├── listeners/
│   └── processing-event.listener.ts    ✅
├── types/
│   ├── canonical.types.ts              ✅
│   ├── processing.types.ts             ✅
│   └── index.ts                        ✅
└── tests/
    ├── transformers.spec.ts            ⬜
    └── hero-detection.spec.ts          ⬜
```

---

## 5. Hero Detection Algorithm

```
Input: VideoId

1. Get current video metrics (views, likes, engagement)
2. Get snapshot from 24h ago
3. If no previous snapshot → mark as "too new"
4. Calculate growth rates:
   - view_growth = (current - prev) / prev * 100
   - engagement_growth = (current - prev) / prev * 100
5. Calculate hero_score:
   - hero_score = (view_growth * 0.7) + (engagement_growth * 0.3)
6. If hero_score >= HERO_THRESHOLD (20%):
   - Mark video as hero
   - Update video.heroScore
   - Emit 'hero-video.detected' event

Configuration:
- HERO_THRESHOLD: 20%
- LOOKBACK_PERIOD: 24 hours
```

---

## 6. Verification Checklist

- [x] Raw data normalized to canonical schema
- [x] All platform transformers working
- [x] Text cleaned and ready for AI
- [x] Hero videos detected and scored
- [x] Duplicates handled correctly
- [x] Events emitting to downstream
- [ ] Processing latency < 1 second per item (needs testing)

---

**Next Step:** After Data Processing Backend, proceed to AI Analysis Backend.

