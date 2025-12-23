# Planning Setup - CompetitorIQ

> **Generated:** December 2024  
> **Framework:** SDLC Planning Framework v1.0

---

## 📋 Overview

This planning document is created following a hierarchical structure (Hierarchical Planning):

1. **Level 1: System Planning** - Overall roadmap for the entire system
2. **Level 2: Domain Planning** - Detailed plan for each domain/module
3. **Level 3: Feature Planning** - Task breakdown for each feature (when needed)

---

## 📁 Document Structure

```
docs/5.planning-setup/
├── README.md                          ← You are here
├── system-planning.md                 ← Level 1: System Roadmap
└── domains/
    ├── auth/
    │   └── domain-planning.md         ← Level 2: Auth Domain
    ├── project-management/
    │   └── domain-planning.md         ← Level 2: Project Management
    ├── dashboard/
    │   └── domain-planning.md         ← Level 2: Dashboard (UI)
    ├── data-collection/
    │   └── domain-planning.md         ← Level 2: Crawlers
    ├── data-processing/
    │   └── domain-planning.md         ← Level 2: Processing & Hero Video
    ├── ai-analysis/
    │   └── domain-planning.md         ← Level 2: AI/LLM Analysis
    ├── alerts/
    │   └── domain-planning.md         ← Level 2: Notifications
    └── admin/
        └── domain-planning.md         ← Level 2: Admin Panel
```

---

## 🗓️ High-Level Timeline

| Phase | Timeline | Focus | Status |
|-------|----------|-------|--------|
| **Phase 1: Foundation** | Week 1-10 | Auth, Projects, Layout | 🔵 Not Started |
| **Phase 2: Data Engine** | Week 11-18 | Crawlers, Processing | 🔵 Not Started |
| **Phase 3: Intelligence** | Week 19-24 | AI Analysis, Insights | 🔵 Not Started |
| **Phase 4: Polish** | Week 25-28 | Alerts, Admin, Optimization | 🔵 Not Started |

**Total Estimated: 28 weeks (7 months)**

---

## 📊 Domain Summary

| Domain | Phase | Priority | Est. Points | Documents |
|--------|-------|----------|-------------|-----------|
| Auth | 1 | P0 | 39 pts | [Planning](./domains/auth/domain-planning.md) |
| Project Management | 1 | P0 | 60 pts | [Planning](./domains/project-management/domain-planning.md) |
| Dashboard | 1-4 | P1 | 88 pts | [Planning](./domains/dashboard/domain-planning.md) |
| Data Collection | 2 | P0 | 74 pts | [Planning](./domains/data-collection/domain-planning.md) |
| Data Processing | 2 | P1 | 61 pts | [Planning](./domains/data-processing/domain-planning.md) |
| AI Analysis | 3 | P1 | 79 pts | [Planning](./domains/ai-analysis/domain-planning.md) |
| Alerts | 4 | P2 | 47 pts | [Planning](./domains/alerts/domain-planning.md) |
| Admin | 4 | P3 | 52 pts | [Planning](./domains/admin/domain-planning.md) |
| **Total** | | | **500 pts** | |

---

## 🚀 Implementation Order

### Phase 1: Foundation (Week 1-10)

1. **Week 1-2:** Project Setup
   - Monorepo initialization (backend + frontend)
   - Database schema setup with Prisma
   - Docker Compose for local dev

2. **Week 3-4:** Auth Domain
   - JWT authentication
   - RBAC guards
   - Login UI

3. **Week 5-7:** Project Management Domain
   - Project CRUD
   - Competitor management
   - Social channel setup

4. **Week 7-10:** Dashboard Layout
   - Sidebar, Header, RightPanel
   - Component library (KPI cards, tables)
   - Core screens (Projects, Overview, Competitors)

### Phase 2: Data Engine (Week 11-18)

5. **Week 11-12:** Queue Infrastructure
   - BullMQ setup
   - Apify adapter

6. **Week 13-16:** Crawlers
   - Store crawler
   - Social channel crawler
   - Content crawler (videos, posts)

7. **Week 15-18:** Data Processing
   - Normalization engine
   - Hero Video detection
   - Text cleaning for AI

### Phase 3: Intelligence (Week 19-24)

8. **Week 19-20:** AI Infrastructure
   - LangChain.js setup
   - Prompt templates

9. **Week 21-24:** Analysis Features
   - Market Landscape
   - Pain Point Extraction
   - Executive Summary
   - AI Insights Dashboard

### Phase 4: Polish (Week 25-28)

10. **Week 25-26:** Alerts
    - In-app notifications
    - Slack integration

11. **Week 27-28:** Admin & Optimization
    - Admin panel
    - Performance tuning
    - Final testing

---

## 📏 Estimation Guidelines

**Story Points Scale:**
- 1 point = ~2 hours
- 3 points = ~1 day
- 5 points = ~2-3 days
- 8 points = ~1 week

**Velocity Assumption:**
- 1 developer = 8-10 points/week
- Buffer included = 20%

---

## ✅ Checklist Before Starting Implementation

- [ ] Review System Planning with stakeholders
- [ ] Confirm timeline and resources
- [ ] Setup development environment
- [ ] Create GitHub repository
- [ ] Configure CI/CD pipeline
- [ ] Setup staging environment
- [ ] Document environment variables
- [ ] Obtain API keys (Apify, OpenAI)

---

## 📚 Reference Documents

| Category | Document |
|----------|----------|
| Business Requirements | [System PRD](../1.business-analyst/system-prd.md) |
| Architecture | [System SAD](../2.solution-architect/system-sad.md) |
| Technical Design | [System TDD](../3.technical-design/system-tdd.md) |
| Database Schema | [Database Schema](../3.technical-design/database-schema.md) |
| UI Design | [System UI Design](../4.ui-design/system-ui-design.md) |

---

## 🔄 Next Steps

1. **Review this planning** with team/stakeholders
2. **Prioritize features** based on business value
3. **Start with Phase 1** - Foundation
4. **Create Feature Planning** (Level 3) for critical features if needed

---

**Happy Building! 🚀**

