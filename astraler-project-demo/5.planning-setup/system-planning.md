# System Planning: CompetitorIQ

> **Version:** 1.0  
> **Created:** December 2024  
> **Status:** Active

---

## 1. Executive Summary

### 1.1 Project Overview

**CompetitorIQ** is a comprehensive Competitor Intelligence Platform designed for Mobile Apps (iOS/Android). The system helps Marketing, Product, ASO, and Founder teams track competitors, detect "Hero Videos", analyze strategies and extract actionable insights.

**Key Scope:**
- Backend: NestJS Modular Monolith (API Server)
- Frontend: React + Vite SPA (Dashboard)
- Database: PostgreSQL + Prisma
- Queue: BullMQ + Redis
- AI: LangChain.js + OpenAI

**Business Objectives:**
1. ✅ Proactive Competitor Tracking - Automatically collect metadata, creatives, and performance metrics
2. ✅ Market Understanding - Analyze the market with AI to identify positioning and opportunities
3. ✅ Creative Optimization - Detect Hero Videos to guide marketing strategy
4. ✅ Product Development - Identify feature gaps and pain points from reviews
5. ✅ Growth Strategy - Support data-driven decisions for Founders

**Success Criteria:**
- Dashboard load time < 3 seconds
- Support 50 competitors per project
- 10 specialized dashboard screens operational
- RBAC enforcement across all endpoints

### 1.2 Timeline Overview

| Phase | Timeline | Focus |
|-------|----------|-------|
| **Phase 1: Foundation** | 8-10 weeks | Core infrastructure, Auth, Project Management, Basic Dashboards |
| **Phase 2: Data Engine** | 6-8 weeks | Crawlers, Data Processing, Hero Video Detection |
| **Phase 3: Frontend Completion** | 4-6 weeks | Complete all Frontend (Dashboard, Admin, Alerts) - **Priority** |
| **Phase 4: Polish & Scale (Backend)** | 2-3 weeks | Alerts Backend, Performance Optimization |
| **Phase 5: Intelligence** | 4-6 weeks | AI Analysis, Insights, Advanced Features - **Deferred to Last** |

**Total Estimated Timeline:** 24-29 weeks (6-7 months)

> **⚠️ Priority Update (December 2024):** 
> - Admin Backend ✅ Completed
> - **Frontend Completion is now Priority** - Complete all Frontend implementations before AI Analysis
> - AI Analysis moved to Phase 5 (last)

### 1.3 Resource Overview

**Recommended Team Structure:**

| Role | Count | Responsibilities |
|------|-------|------------------|
| **Tech Lead** | 1 | Architecture decisions, code reviews, technical guidance |
| **Backend Developer** | 2 | NestJS modules, API development, Queue processing |
| **Frontend Developer** | 2 | React components, Dashboard UI, State management |
| **DevOps Engineer** | 0.5 | Docker setup, CI/CD, Infrastructure |
| **QA Engineer** | 0.5 | Testing strategy, E2E tests |

**Minimum Team (Solo/Small Team):**
- 1 Full-stack Developer can deliver in 10-14 months
- Focus on iterative delivery per domain

---

## 2. Phases Breakdown

### 2.1 Phase 1: Foundation (8-10 weeks)

**Objective:** Establish basic infrastructure, authentication, and project management.

**Domains Included:**
- ✅ **Auth Domain** - JWT authentication, RBAC guards
- ✅ **Project Management Domain** - Projects, Competitors CRUD
- ✅ **Dashboard Domain (Partial)** - Layout, Navigation, Basic screens

**Features:**

| Feature | Priority | Complexity | Est. Time |
|---------|----------|------------|-----------|
| Monorepo Setup (Backend + Frontend) | P0 | Low | 1 week |
| Database Schema & Prisma Setup | P0 | Medium | 1 week |
| Auth Module (JWT, Login, Register) | P0 | Medium | 1.5 weeks |
| RBAC Middleware & Guards | P0 | Medium | 1 week |
| Project CRUD API | P0 | Low | 1 week |
| Competitor CRUD API | P0 | Low | 1 week |
| Frontend Layout (Sidebar, Header) | P0 | Medium | 1 week |
| Login Page UI | P0 | Low | 0.5 week |
| Projects List Page | P0 | Low | 0.5 week |
| Competitors Management Page | P1 | Medium | 1 week |

**Dependencies:**
- Database must be ready before Auth module
- Auth must be ready before any protected routes
- Backend APIs must be ready before Frontend integration

**Deliverables:**
1. Working monorepo with Backend (NestJS) + Frontend (React)
2. PostgreSQL database with initial schema
3. JWT-based authentication flow
4. Basic RBAC (Admin, User roles)
5. Project & Competitor management functionality
6. Responsive layout with sidebar navigation

**Success Criteria:**
- User can register, login, and manage session
- User can create/edit/delete projects
- User can add/remove competitors to projects
- RBAC restricts unauthorized access

---

### 2.2 Phase 2: Data Engine (6-8 weeks)

**Objective:** Build a system to collect and process data from external sources.

**Domains Included:**
- ✅ **Data Collection Domain** - Store, Social, Ads crawlers
- ✅ **Data Processing Domain** - Normalization, Hero Video detection

**Features:**

| Feature | Priority | Complexity | Est. Time |
|---------|----------|------------|-----------|
| BullMQ Queue Setup | P0 | Medium | 1 week |
| Store Crawler (Apify Integration) | P0 | High | 2 weeks |
| Social Crawler (TikTok, YouTube) | P1 | High | 2 weeks |
| Crawler Scheduling System | P1 | Medium | 1 week |
| Data Normalization Pipeline | P1 | Medium | 1 week |
| Hero Video Detection Logic | P1 | Medium | 1 week |
| Videos Library Dashboard | P1 | Medium | 1 week |
| Channels Dashboard | P2 | Low | 0.5 week |

**Dependencies:**
- Phase 1 complete (Auth, Projects, Competitors)
- Redis server running for BullMQ
- 3rd-party API credentials (Apify, SearchAPI)

**Deliverables:**
1. Working queue system with job processing
2. App Store/Play Store data fetching
3. Social media profile & video data collection
4. Hero Video scoring algorithm
5. Videos Library with filters and sorting
6. Channels tracking dashboard

**Success Criteria:**
- Crawlers successfully fetch competitor data
- Data is normalized and stored in database
- Hero Videos are detected and scored
- Queue jobs retry on failure

---

### 2.3 Phase 3: Intelligence (4-6 weeks)

**Objective:** Integrate AI to analyze and extract insights.

**Domains Included:**
- ✅ **AI Analysis Domain** - LLM integration, Analysis types
- ✅ **Dashboard Domain (Extended)** - AI Insights, What's New, Reviews

**Features:**

| Feature | Priority | Complexity | Est. Time |
|---------|----------|------------|-----------|
| LangChain.js Integration | P0 | Medium | 1 week |
| Market Landscape Analysis | P0 | High | 1.5 weeks |
| Pain Point Extraction | P1 | Medium | 1 week |
| Review Sentiment Analysis | P1 | Medium | 1 week |
| AI Insights Dashboard | P0 | Medium | 1 week |
| What's New Dashboard | P1 | Low | 0.5 week |
| Reviews Dashboard | P1 | Low | 0.5 week |
| Executive Summary Widget | P2 | Medium | 0.5 week |

**Dependencies:**
- Phase 2 complete (Data collection working)
- OpenAI API key configured
- Sufficient data for meaningful analysis

**Deliverables:**
1. LangChain integration with OpenAI
2. Market landscape analysis with positioning insights
3. Pain point extraction from reviews
4. Sentiment analysis per review
5. AI Insights dashboard with categorized insights
6. Executive Summary with impact scoring

**Success Criteria:**
- AI analysis completes within acceptable time
- Insights are actionable and relevant
- Analysis queue handles concurrent requests
- Token usage is monitored

---

### 2.4 Phase 4: Polish & Scale (3-4 weeks)

**Objective:** Complete remaining features, optimize performance, and prepare for production.

**Domains Included:**
- ✅ **Alerts Domain** - Notifications system
- ✅ **Admin Domain** - System monitoring, API key management
- ✅ **Dashboard Domain (Complete)** - Remaining screens

**Features:**

| Feature | Priority | Complexity | Est. Time |
|---------|----------|------------|-----------|
| Notification System | P1 | Medium | 1 week |
| In-app Alerts UI | P1 | Low | 0.5 week |
| ASO Dashboard | P2 | Medium | 1 week |
| Marketing Dashboard | P2 | Medium | 1 week |
| Info Dashboard | P2 | Low | 0.5 week |
| Admin Panel (Basic) | P3 | Medium | 1 week |
| Performance Optimization | P1 | Medium | 1 week |
| Error Logging & Monitoring | P2 | Low | 0.5 week |

**Dependencies:**
- Phase 3 complete
- All core features stable

**Deliverables:**
1. Complete 10 dashboard screens
2. Notification system working
3. Admin panel for basic system monitoring
4. Optimized query performance
5. Comprehensive error handling

**Success Criteria:**
- All dashboards load < 3 seconds
- Notifications delivered reliably
- System handles concurrent users
- Error rates < 1%

---

## 3. Domain Dependencies Analysis

### 3.1 Dependency Graph

```
┌──────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: FOUNDATION                          │
│  ┌─────────────┐    ┌─────────────────────┐    ┌──────────────────┐  │
│  │    AUTH     │───▶│ PROJECT MANAGEMENT  │◀───│   DASHBOARD      │  │
│  │   DOMAIN    │    │      DOMAIN         │    │   (Layout)       │  │
│  └─────────────┘    └─────────────────────┘    └──────────────────┘  │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       PHASE 2: DATA ENGINE                           │
│  ┌─────────────────┐              ┌──────────────────────────────┐   │
│  │ DATA COLLECTION │─────────────▶│      DATA PROCESSING         │   │
│  │    DOMAIN       │              │         DOMAIN               │   │
│  │ (Crawlers)      │              │ (Hero Video, Normalization)  │   │
│  └─────────────────┘              └──────────────────────────────┘   │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      PHASE 3: INTELLIGENCE                           │
│  ┌─────────────────┐              ┌──────────────────────────────┐   │
│  │   AI ANALYSIS   │─────────────▶│      DASHBOARD               │   │
│  │     DOMAIN      │              │   (AI Insights, Reviews)     │   │
│  └─────────────────┘              └──────────────────────────────┘   │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      PHASE 4: POLISH & SCALE                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐  │
│  │     ALERTS      │    │     ADMIN       │    │   DASHBOARD      │  │
│  │     DOMAIN      │    │     DOMAIN      │    │   (Complete)     │  │
│  └─────────────────┘    └─────────────────┘    └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 Domain Priorities

| Domain | Priority | Business Value | Technical Complexity | Phase |
|--------|----------|----------------|---------------------|-------|
| **Auth** | P0 - Critical | High | Medium | 1 |
| **Project Management** | P0 - Critical | High | Low | 1 |
| **Data Collection** | P0 - Critical | Very High | High | 2 |
| **Data Processing** | P1 - High | High | Medium | 2 |
| **AI Analysis** | P1 - High | Very High | High | 3 |
| **Dashboard** | P1 - High | High | Medium | 1-4 |
| **Alerts** | P2 - Medium | Medium | Medium | 4 |
| **Admin** | P3 - Low | Low | Low | 4 |

### 3.3 Domain Sequencing & Parallel Work

**Sequential Dependencies:**
1. Auth → Project Management → Data Collection → AI Analysis
2. Data Collection → Data Processing → Dashboard (Videos, Channels)
3. AI Analysis → Dashboard (AI Insights, Reviews)

**Parallel Opportunities:**
- Frontend Layout can be developed in parallel with Backend APIs (Phase 1)
- Dashboard screens can be developed in parallel with each other
- Alerts & Admin can be developed in parallel (Phase 4)
- Unit tests can be written in parallel with feature development

---

## 4. Resource Planning

### 4.1 Team Structure

**Option A: Full Team (Recommended for 6-month timeline)**

```
┌───────────────────────────────────────────────────────────────┐
│                      TECH LEAD (1)                             │
│           Architecture, Code Review, Technical Decisions       │
└───────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  BACKEND TEAM   │   │  FRONTEND TEAM  │   │   SUPPORT       │
│    (2 devs)     │   │    (2 devs)     │   │  (0.5 DevOps,   │
│                 │   │                 │   │   0.5 QA)       │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

**Option B: Small Team (Solo/Duo)**

| Developer | Focus | Phases |
|-----------|-------|--------|
| Dev 1 (Full-stack) | Core Backend + Frontend | All |
| Dev 2 (Optional) | Crawlers + AI Integration | 2-3 |

### 4.2 Resource Allocation Per Phase

| Phase | Backend | Frontend | DevOps | QA |
|-------|---------|----------|--------|-----|
| Phase 1 | 60% | 40% | 10% | 5% |
| Phase 2 | 70% | 30% | 5% | 10% |
| Phase 3 | 60% | 40% | 5% | 15% |
| Phase 4 | 40% | 40% | 10% | 20% |

### 4.3 Capacity Planning

**Assumptions:**
- 1 developer = 32 productive hours/week (80% efficiency)
- Story point = ~4 hours of work
- Buffer = 20% for unexpected issues

**Velocity Estimates:**
- Backend Developer: 8-10 story points/week
- Frontend Developer: 8-10 story points/week
- Full-stack Developer: 6-8 story points/week (context switching)

---

## 5. Timeline & Milestones

### 5.1 High-Level Timeline

```
Week 1-2:   ████████ Project Setup & Database
Week 3-4:   ████████ Auth Module
Week 5-6:   ████████ Project Management
Week 7-8:   ████████ Frontend Layout & Basic Pages
Week 9-10:  ████████ Phase 1 Complete - MILESTONE 1 ✓
────────────────────────────────────────────────────
Week 11-12: ████████ Queue Setup & Store Crawler
Week 13-14: ████████ Social Crawler
Week 15-16: ████████ Data Processing & Hero Video
Week 17-18: ████████ Phase 2 Complete - MILESTONE 2 ✓
────────────────────────────────────────────────────
Week 19-20: ████████ LangChain & Market Analysis
Week 21-22: ████████ Pain Points & Sentiment
Week 23-24: ████████ AI Insights Dashboard
Week 24:    ████████ Phase 3 Complete - MILESTONE 3 ✓
────────────────────────────────────────────────────
Week 25-26: ████████ Alerts & Admin
Week 27-28: ████████ Polish & Optimization
Week 28:    ████████ Phase 4 Complete - LAUNCH ✓
```

### 5.2 Key Milestones

| Milestone | Week | Deliverables | Success Criteria |
|-----------|------|--------------|------------------|
| **M1: Foundation Complete** | Week 10 | Auth, Projects, Layout | User can login, create projects |
| **M2: Data Engine Ready** | Week 18 | Crawlers, Hero Videos | Data fetching automated |
| **M3: Intelligence Online** | Week 24 | AI Analysis, Insights | AI insights available |
| **M4: Production Ready** | Week 28 | All features, Optimized | Full system operational |

### 5.3 Critical Path

```
Database Setup → Auth Module → Project API → Data Collection → 
AI Analysis → Dashboard Integration → Production Deployment
```

**Bottlenecks:**
1. **3rd-party API integration** - Apify/SearchAPI may have rate limits or unexpected data formats
2. **AI Analysis** - Token costs and processing time may require optimization
3. **Queue reliability** - BullMQ configuration critical for data pipeline

### 5.4 Buffer & Contingency

| Phase | Base Estimate | Buffer (20%) | Total |
|-------|---------------|--------------|-------|
| Phase 1 | 8 weeks | 2 weeks | 10 weeks |
| Phase 2 | 6 weeks | 2 weeks | 8 weeks |
| Phase 3 | 4 weeks | 2 weeks | 6 weeks |
| Phase 4 | 3 weeks | 1 week | 4 weeks |
| **Total** | **21 weeks** | **7 weeks** | **28 weeks** |

---

## 6. Risk Assessment

### 6.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **3rd-party API changes** | Medium | High | Abstract integrations, have fallback providers |
| **Rate limiting from crawlers** | High | Medium | Implement backoff, queue delays, proxy rotation |
| **AI token costs exceed budget** | Medium | Medium | Set cost caps, optimize prompts, cache results |
| **Performance issues at scale** | Low | High | Load test early, implement caching |
| **Redis/Queue failures** | Low | High | Implement job persistence, retry logic |

### 6.2 Resource Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Developer unavailability** | Medium | High | Document thoroughly, pair programming |
| **Skill gaps (AI/LangChain)** | Medium | Medium | Training time, POC before implementation |
| **Scope creep** | High | Medium | Strict phase gates, MVP focus |

### 6.3 Dependency Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Apify service disruption** | Low | High | Alternative providers (SearchAPI, Bright Data) |
| **OpenAI API changes** | Low | Medium | Abstract LLM layer, support multiple providers |
| **Library deprecation** | Low | Low | Use stable, well-maintained packages |

---

## 7. Success Metrics

### 7.1 Phase Success Criteria

| Phase | Criteria | Definition of Done |
|-------|----------|-------------------|
| **Phase 1** | Core functional | Users can authenticate, manage projects |
| **Phase 2** | Data flowing | Crawlers fetch data on schedule |
| **Phase 3** | AI operational | Insights generated automatically |
| **Phase 4** | Production ready | All dashboards < 3s load time |

### 7.2 Key Performance Indicators (KPIs)

| Category | KPI | Target |
|----------|-----|--------|
| **Performance** | Dashboard load time | < 3 seconds |
| **Performance** | API response time (p95) | < 500ms |
| **Reliability** | System uptime | > 99% |
| **Reliability** | Queue job success rate | > 95% |
| **Scale** | Competitors per project | 50 |
| **Scale** | Concurrent users | 100 |
| **Cost** | AI token cost per analysis | < $0.10 |
| **Quality** | Bug rate (post-release) | < 5 critical/month |

### 7.3 Measurement Approach

1. **Performance**: New Relic / Datadog APM
2. **Reliability**: Uptime monitoring (Pingdom/UptimeRobot)
3. **Queue Health**: BullMQ Dashboard / Bull Board
4. **Cost**: OpenAI usage dashboard, Apify billing
5. **Quality**: GitHub Issues tracking, Error logging (Sentry)

---

## 8. Communication & Reporting

### 8.1 Stakeholder Communication

| Stakeholder | Frequency | Format | Content |
|-------------|-----------|--------|---------|
| **Product Owner** | Weekly | Meeting | Progress, blockers, decisions needed |
| **Team** | Daily | Standup | Yesterday, today, blockers |
| **Management** | Bi-weekly | Report | Milestone status, risks, budget |

### 8.2 Reporting Schedule

| Report | Frequency | Owner | Audience |
|--------|-----------|-------|----------|
| **Sprint Report** | Every 2 weeks | Tech Lead | Team, PO |
| **Milestone Report** | Per milestone | Tech Lead | All stakeholders |
| **Risk Report** | Monthly | Tech Lead | Management |

### 8.3 Communication Channels

| Purpose | Channel |
|---------|---------|
| **Daily updates** | Slack/Discord |
| **Code reviews** | GitHub PRs |
| **Documentation** | Notion/Confluence |
| **Issue tracking** | GitHub Issues / Jira |
| **Meetings** | Google Meet / Zoom |

---

## 9. Domain Planning Quick Reference

After System Planning is approved, proceed with Domain Planning for each domain in priority order:

| Priority | Domain | Document Path |
|----------|--------|---------------|
| 1 | Auth | `docs/5.planning-setup/domains/auth/domain-planning.md` |
| 2 | Project Management | `docs/5.planning-setup/domains/project-management/domain-planning.md` |
| 3 | Dashboard (Layout) | `docs/5.planning-setup/domains/dashboard/domain-planning.md` |
| 4 | Data Collection | `docs/5.planning-setup/domains/data-collection/domain-planning.md` |
| 5 | Data Processing | `docs/5.planning-setup/domains/data-processing/domain-planning.md` |
| 6 | AI Analysis | `docs/5.planning-setup/domains/ai-analysis/domain-planning.md` |
| 7 | Alerts | `docs/5.planning-setup/domains/alerts/domain-planning.md` |
| 8 | Admin | `docs/5.planning-setup/domains/admin/domain-planning.md` |

---

## 10. Appendix

### 10.1 Technology Stack Summary

| Layer | Technology |
|-------|------------|
| **Backend Framework** | NestJS 10+ (Fastify) |
| **Frontend Framework** | React 18+ (Vite) |
| **Database** | PostgreSQL 16 + Prisma |
| **Queue** | BullMQ + Redis |
| **AI** | LangChain.js + OpenAI |
| **UI Library** | Shadcn/UI + Tailwind CSS |
| **Routing** | TanStack Router |
| **State Management** | TanStack Query + Zustand |
| **Charts** | Tremor / Recharts |

### 10.2 Dashboard Screens Checklist

| Screen | Phase | Priority |
|--------|-------|----------|
| ✅ Login | 1 | P0 |
| ✅ Projects List | 1 | P0 |
| ✅ Overview (Activity Feed) | 1 | P1 |
| ✅ Competitors | 1 | P0 |
| ✅ Videos Library | 2 | P1 |
| ✅ Channels | 2 | P2 |
| ✅ AI Insights | 3 | P0 |
| ✅ Reviews | 3 | P1 |
| ✅ What's New | 3 | P1 |
| ✅ ASO | 4 | P2 |
| ✅ Marketing | 4 | P2 |
| ✅ Info | 4 | P2 |

### 10.3 Reference Documents

- System PRD: `docs/1.business-analyst/system-prd.md`
- System SAD: `docs/2.solution-architect/system-sad.md`
- System TDD: `docs/3.technical-design/system-tdd.md`
- System UI Design: `docs/4.ui-design/system-ui-design.md`
- Database Schema: `docs/3.technical-design/database-schema.md`

---

**Document End**

*Next Step: Proceed to Domain Planning (Level 2) for each domain in priority order.*

