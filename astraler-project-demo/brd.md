📘 PART 1 – OVERVIEW & PROJECT CONCEPTS

**BRD Version**: 2.3  
**Last updated**: 2025-12-12

System: **CompetitorIQ (Competitor Intelligence Platform)** for Mobile App iOS/Android

### 1.1. Brand Identity (summary as per PRD)
- **System Name**: CompetitorIQ
- **Primary Color**: Indigo (#6366F1)
- **Secondary Color**: Violet (#8B5CF6)
- **Typography**: Inter font family
- **Icon System**: Google Material Symbols (outlined & filled)
- **Design Language**: Modern, clean, professional (premium UI components)

⸻

1. Purpose Overview

The system empowers Marketing, Product, ASO, and Founders teams to proactively monitor competitors, detect Hero Videos, analyze Winning Creatives, and extract insights such as pain points to optimize app growth strategy.

Right from the creation of a new Project, the system will automatically gather competitor metadata (App name, Description, Reviews, Icon/Screenshot metadata) and use AI to draft a market overview, supporting the development of both strategy and suitable product.

In summary, the goals are: Closely monitor competitors – Understand the market – Detect Hero Videos & Winning Creatives – Formulate new app strategies – Optimize creative & features for growth.

⸻

2. PROJECT Concept

The system is organized around the **Project** concept – each Project represents an app your company is developing or operating. All data collection, analysis, dashboards, and alerts are performed separately per Project, ensuring that data and insights are compartmentalized per app to serve each operational objective.

**A Project consists of the following main components:**
- List of Competitors/Publishers and monitored keywords
- List of Social channels to monitor (Watchlist)
- Centralized data repository (reviews, social content, ads metadata, ASO content, etc.)
- Function-oriented dashboards (Marketing, Product, ASO, Founder)
- Automated alerts related to competitors in the Project
- AI to analyze pain points, feature gaps, creative angle trends
- Market Landscape Analysis by AI when initializing a Project (integrated into the analytics chain, not separated or over-emphasized)
- Scope, tracking, and evaluation criteria configuration

**Operational characteristics:**
- The system supports creating & managing multiple Projects in parallel, ensuring complete separation of data and analytics across Projects.
- All analyses (AI, dashboards, alerts) are referenced to individual Projects in a siloed structure.

### 2.1. Workspace Architecture & Access Control (RBAC) ⭐ PRIORITY (as per PRD)

**Project-Based Workspace Model**
- Each Project = a separate workspace (data, competitors, settings)
- Supports multi-projects with a **Project switcher** (TopBar dropdown)
- Membership by **invitation** (not open access)
- RBAC applies to both **API** and **UI**

**Module Organization (Sidebar)**
```
📊 OVERVIEW - Dashboard
📱 INTERNAL - Own App: Info, ASO, Marketing
🔍 EXTERNAL - Competitors: Competitors, What's New, Channels, Videos, Reviews
🤖 INSIGHTS - AI Insights
```

**Access Control Matrix (standardized as per PRD)**
| Role       | INTERNAL         | EXTERNAL             | INSIGHTS    |
|------------|------------------|----------------------|-------------|
| Marketing  | Marketing only   | Videos, Channels     | Full        |
| Product    | Limited          | What's New, Reviews  | Full        |
| ASO        | ASO only         | Competitors          | Limited     |
| Founder    | Full             | Full                 | Full        |
| Admin      | Full             | Full                 | Full        |

**Implementation Requirements**
- Backend: RBAC middleware validates all API requests
- Frontend: Sidebar module filtered by role
- Priority: HIGH (mandatory for Phase 1)

⸻

3. Purpose & Benefits by User Groups

Each Project fully serves the objectives of every functional team in the company.

**3.1. Marketing Team**
- Discover competitors’ Hero Videos & Winning Creatives in the Project
- Analyze creative angle, hook, CTA, storytelling flow to optimize campaigns
- Identify pain points from ad content
- Track multi-channel traffic (Social, Landing page, Website)
- Support Creative team in developing winning content based on Project insights

**3.2. Product Team**
- Track new features at competitors (What's New)
- Identify and monitor specific feature gaps for the app in the Project
- Analyze review sentiment to understand user reaction per competitor app
- Utilize AI Market Landscape Analysis when launching a Project for positioning, uncovering opportunities, and product planning

**3.3. ASO Team**
- Monitor rankings, competitor keywords, and metadata changes (icon, screenshot)
- Analyze review sentiment to support ASO optimization
- Connect with dashboards for detailed Project-specific change monitoring

**3.4. Founder / Management**
- Big-picture insights on the industry vertical, competitors, and market trends aggregated in each Project
- Help Management position the app, monitor emerging or disappearing competitors
- Proactively track and compare progress across Projects/development phases

⸻

📘 PART 2 – SYSTEM OUTPUTS

⸻

**Important Definition:**

**Hero Video:** A competitor's video with growth ≥ 20% in 24 hours, measured by the rate of increase in Likes / Comments / Shares / Views from system data snapshots.

⸻

1. Dashboard Output (Real-Time Tracking)

The system provides 4 groups of dashboards per Project. All dashboards support filtering by app, market, competitor, and time.

**List of Dashboard Screens (standardized as per PRD)**
1. **Overview**: Activity feed (App Updates / New Videos / Reviews / Hero Videos), event type filter
2. **Info**: Project information, configuration, watchlist overview
3. **ASO**: Keyword ranking, metadata change tracking (icon/screenshot metadata)
4. **Marketing**: Multi-platform marketing/creative analytics (read-only), KPI cards & charts
5. **Competitors**: Competitor table + version history + status
6. **What's New**: Version update timeline + AI strategic insights per update
7. **Channels**: Social platform tracking (TikTok, YouTube, Instagram, Facebook) + growth signals
8. **Videos**: Content library + Hero Video detection + creative performance analysis
9. **Reviews**: User feedback analysis + sentiment trends + pain points
10. **AI Insights**: Executive Summary + categorized insights (Product/Consumer/Content/Search & Discovery) + impact/sentiment

**1.1. Dashboard for Marketing**
- **Global Trending Feed:** Hottest Hero Videos of the day
- **Creative Ads Explorer:** Classify video/ad images by hook, angle, CTA, timeline
- **Pain Point Map (AI):** Analyze pain points from ad content, group by emotional angle
- **Traffic Channel Map:** All competitor traffic channels (Social, Website, Landing page)
- **Creative Angle Trend:** AI extracts Hook → Flow → CTA → Outcome, trend statistics
- **Competitor Detail Page:** Deep dive into a competitor (videos/week, Hero Videos, Ads vs. Organic ratio)

**1.2. Dashboard for Product**
- **Feature Update Tracker:** Timeline of version and new feature updates
- **Feature Gap Analysis (AI):** Compare competitors’ features to your own app, suggest gaps & priorities

**1.3. Dashboard for ASO**
- **Ranking Dashboard:** Track keyword rankings, change charts
- **Keyword Gap Dashboard:** Keyword comparison with competitors, new keyword suggestions
- **Icon/Screenshot Change Log:** Log of metadata changes (no images stored)
- **Review Sentiment Dashboard:** Classify reviews by intent (bug, feature request, complaint, satisfaction)

**1.4. Dashboard for Founder**
- **Market Growth Filter:** Filter fast-growing apps (ads volume, ranking, social growth)
- **Rising Competitors:** Identify emerging competitors

**1.5. Market Landscape Analysis (on Project creation)**
- AI auto-drafts a market overview based on metadata of added competitors, shown in Founder Dashboard as "Market Landscape Summary".
- (For details on Market Landscape Analysis, see FR19 – AI Reasoning.)

**1.6. Manual Review & Curation Dashboard (Phase 2 as per PRD)**
- **Pending Review Queue:** List of videos and social channels awaiting review and assignment to apps
- **Unassigned Items:** Videos found via keyword but not yet assigned to any app
- **Social Channel Assignment:** UI to assign social channels to competitor apps (encouraged but not mandatory)
- **Bulk Actions:** Approve/reject/assign multiple items at once for efficiency

⸻

2. Alerts Output — **Phase 2 as per PRD**

The system sends alerts via: Slack / Email / Telegram / In-app notification.

**2.1. Marketing Alerts**
- Detect new Hero Videos (official definition)
- Competitor just launched a new ad or experienced a spike in ad volume
- Competitor added a new social entity
- Competitor created a new landing page

**2.2. Product Alerts**
- Competitor just updated version
- New features found in "What's New"
- Icon/screenshot changes (metadata)
- Review spike related to a particular feature

**2.3. ASO Alerts**
- Competitor sudden ranking up/down
- Review spike (sharp increase or decrease)

**2.4. Founder Alerts**
- Competitor significant marketing growth
- Competitor app disappeared (removed from store)
- New app entered the market (similar niche)

**2.5. Manual Review Alerts**
- New video needs review and assignment to an app
- New social channel needs assignment to an app (encouraged)
- Number of pending review items exceeds threshold (to prevent backlog)

⸻

3. Data Layer (Data Warehouse for AI)

**Data TO STORE:**
- Review & sentiment
- ASO content (title, subtitle, description)
- What's New changelog
- Social content (post, video metadata, transcript, growth signals)
- Ads metadata (hook, angle, CTA, transcript, timeline)
- Landing page copy
- Social profile metadata
- Ranking & ASO signals
- App events (iOS Event, Play LiveOps)
- **Relationship data:** Relationships between social channel ↔ app, video ↔ app (assigning encouraged to improve analysis accuracy)
- **Manual review status:** Review status for video and social channels (pending, approved, rejected, assigned)

**Data NOT stored:**
- ❌ Screenshot + UI images
- ❌ Video files (ads, social videos)
→ Only metadata, transcript, CDN URL stored. No media files stored to save storage costs.

⸻

📘 PART 3 – SYSTEM SCOPE & OUT-OF-SCOPE

⸻

3.1. Scope (Included)

**✔ A. Gather Data from Store (App Store / Google Play)**
- App metadata, Version & "What's New", Icon & Screenshot metadata
- In-app events (iOS) & LiveOps (Google Play)
- Review + rating + sentiment, Ranking signals, Keyword visibility

**✔ B. Gather Social & Web Data**
- Social entity discovery: TikTok, YouTube, Instagram, Facebook (**X: optional/future**)
- Main website, satellite websites, Ad landing page
- Organic content (video, post, short) → only store metadata + transcript, no video files

**✔ C. Gather Advertising Data (Ads Intelligence)**
- Ads metadata (theme, angle, hook, CTA, duration, transcript, timeline)
- Only store metadata and transcript, no video files

**✔ D. AI Analysis**
- **Market Landscape Analysis:** AI reasoning to outline market overview on Project creation (based on App name, Description, Reviews, Icon/Screenshot metadata)
- Pain point extraction, Creative angle extraction
- Sentiment analysis, Feature gap analysis
- Topic clustering, Social trend & creative trend detection
- Hero Video detection (as per definition)

**✔ E. Real-time Dashboards (Marketing, Product, ASO, Founder)**
- Dashboards as defined in Part 2
- Supports filters by: app, market, time, competitor

**✔ F. Alerts & Notifications**
- New Hero Video, New ad/spike, New social entity, New landing page
- New app version, New feature, Ranking spike, Review spike
- New app in market / removed app

**✔ G. Data Layer / Data Warehouse**
- (For Data Layer details see PART 2 – Data Layer.)

⸻

3.2. Out-of-Scope

**✖ A. No asset media storage**
- No video file storage (ads, social videos)
- No screenshot or UI image storage

**✖ B. No UI/UX analysis from images**
- No visual diff
- No UI layout analysis via computer vision

**✖ C. No direct advertising intervention**
- No ad running, no **actions** for creating/editing campaigns on ad platforms
- (Read-only analytics/metadata supported for dashboard: KPI cards/charts, creative/library, growth signals)

**✖ D. No automated ASO**
- No automated suggestions for changing icon, screenshot, title
- No automated store listing updates

**✖ E. No crawling data requiring login/private**
- Only public data collection, ToS compliant

**✖ F. No competitor financial analysis**
- No revenue tracking, no revenue forecasting

⸻

3.3. Market Scope

**Platforms:** iOS, Android  
**Supported Markets:** US, EU, Asia, and others as configured

⸻

📘 PART 4 – USER PERSONAS & USER JOURNEY

⸻

4.1. User Personas

**4.1.1. Marketing Persona**
- Performance Marketer: view creative ads, find hook/angle/CTA, follow ad timelines
- Creative Strategist: analyze organic content, discover trends, identify pain points
- Social Intelligence Specialist: explore social entities, follow traffic growth

**4.1.2. Product Persona**
- Product Manager: track What's New, new features, identify feature gaps
- UX Researcher: analyze review sentiment, complaints, feature requests

**4.1.3. ASO Persona**
- Monitor ranking, keyword, review spikes, icon/screenshot metadata changes

**4.1.4. Founder / Management Persona**
- Big-picture insight, positioning apps in the market
- Decision-making based on: ad volume, ranking, review, emerging/disappearing competitors

⸻

4.2. User Journey (High-Level) — per Project

**Configuration Notes:**
- Global tracking (no specific market selection)
- AI-generated insights displayed directly in dashboard

**Flow:**

1. **Create New Project**
   - Enter Project name, Category (optional), Keywords (optional), Short Description (optional)

2. **Add competitors to Project**
   - **Add via URL:** Enter iOS App Store URL or Google Play URL → Validate and fetch metadata
   - **Add via Keyword:** Enter ASO keyword → System automatically finds related competitor apps → User selects app(s) to add
   - **Competitor Discovery:** Enter brand/Publisher name → System suggests related Social channels → User selects channels to follow (see FR3.3 for details)

2.1. **Market Landscape Analysis (Auto after adding competitor)**
   - AI automatically runs Market Landscape Analysis after adding competitor.
   - (See FR19 – Market Landscape Analysis for workflow details.)

3. **Target Management**
   - Manage Watchlist: Add/Remove/Pause competitors
   - Manage Keywords: Add/Remove keywords for Ads crawling

4. **Automated data crawl**
   - System auto-crawls Store, Social, Ads, and Landing page on schedule.
   - (See details in PART 8 – Functional Requirements, Crawler Scheduling.)

4.1. **Manual Review & Data Curation**
   - After crawl, some data require manual review:
     - **Videos from keyword search:** Video found by keyword, not yet assigned to app → Reviewer assigns it to the correct app or removes if not relevant
     - **Social channel:** Found but not linked to app → Reviewer assigns it to the owning app (encouraged, not mandatory)
   - Assigning video and social content to owned app is encouraged to increase analysis accuracy
   - (See PART 8 – Functional Requirements, Manual Review & Assignment.)

5. **Dashboard displayed per Project**
   - Marketing, Product, ASO, Founder dashboards (shows only Project’s data)
   - Global Trending Feed displays Hero Videos

6. **Automated alerts**
   - Push important events via Slack / Email / Telegram / In-app
   - Special: Immediate alert on new Hero Video discovery

7. **AI automatic analysis**
   - AI system auto-analyzes (pain points, feature gaps, creative angles, landscape, etc.) as per logic in PART 8 – AI Analysis Module.

⸻

📘 PART 5 – BUSINESS CONSTRAINTS & ASSUMPTIONS

⸻

5.1. Business Constraints

**A. Constraints Related to Data Collection Strategy**

**Data collection strategy:**
- **No use of official API:** The system does not use official Facebook, TikTok, YouTube APIs as these platforms do not provide public APIs for competitor intelligence.

- **Fully dependent on 3rd-party services:** The system is 100% dependent on third-party services (Apify, SearchAPI.io, etc.) for data collection. Key points:
  - **Social content** (TikTok, Instagram, YouTube, Facebook posts/videos): Crawled via 3rd-party services
  - **Ads data** (Facebook Ad Library, TikTok Creative Center, Google Ads Transparency): Also via 3rd-party, not direct Ads Library access
  - No direct access to these platforms – all must go through third-party layers

- **Future cost optimization:** To reduce costs and increase flexibility, the system may improve by:
  - Automation browsers (Selenium, Playwright) to self-crawl web and Ads Library
  - Phone farm infrastructure to emulate real devices and collect mobile app data

**B. Constraints Related to 3rd-party Providers**

1. **Dependency on 3rd-party availability**
   - System is fully dependent on Apify, SearchAPI.io, and similar 3rd-party services
   - All data (social content, ads data from Ads Library) are crawled through 3rd-parties
   - If a 3rd-party is down → system is delayed or loses data
   - No direct fallback to official API or Ads Library (since there’s no direct access)

2. **Rate limits & quota**
   - Each provider limits request volume → must manage quota systemwide and per Project
   - Auto-throttling as limit nears
   - Costs increase with crawl data volume

3. **Authentication & Billing**
   - 3rd-party API keys must be securely stored
   - Track costs by: provider → project → crawl type
   - Alert if over budget
   - 3rd-party service cost is a key operational expense

4. **Data schema changes**
   - Providers may change data schema → needs robust parser + schema validation
   - Provider crawl method change may affect data quality

5. **ToS & Legal Compliance**
   - Only collect public data via legal means
   - Comply with 3rd-party provider and social platform Terms of Service
   - Do not collect data needing login or breaching ToS

6. **Latency & Data Freshness**
   - Data update times depend on 3rd-party latency
   - Cannot guarantee absolute real-time due to 3rd-party layer (3rd-party → crawl → system)

**C. Constraints Related to AI Providers (OpenAI, Gemini, etc.)**

1. **Model availability & versioning**
   - Models may update → output changes → must track model versions

2. **Latency & Cost**
   - Some analyses are expensive → need batching, caching

3. **Privacy & Data Handling**
   - Do not send PII/sensitive data to AI providers
   - Clean/mask inputs before sending

4. **Hallucination**
   - AI may infer incorrectly → need confidence scores and validation logic

5. **AI token cost**
   - Must have daily cost cap
   - Auto-reduce analysis depth if cost exceeded

⸻

5.2. Assumptions

1. **3rd-party Service Availability:**
   - Apify / SearchAPI.io & similar services consistently provide stable, available data
   - 3rd-party services can successfully crawl Ads Library (Facebook Ad Library, TikTok Creative Center, Google Ads Transparency) and social platforms
   - Neither Ads Library nor social platforms block or alter structure to prevent 3rd-party crawling

2. **Budget & Cost:**
   - Company has budget for 3rd-party API & AI compute
   - 3rd-party service is a significant component of TCO

3. **Data Accessibility:**
   - Competitor social profiles are public and accessible via 3rd-parties
   - App Store / Play Store update metadata reliably and are crawlable

4. **System Scale:**
   - Each Project has < 50 competitors (for performance and cost control)
   - Crawler schedule optimized:
     - **Store listing metadata** (title/description/icon/screenshot): every 4–7 days (as mobile store metadata rarely changes)
     - **What's New (changelog):** every 24 hours (or as needed)
     - **Reviews:** ≤ 6 hours (to enable alerts/insight)
     - **Ranking & keyword signals:** ≤ 3 hours (to detect spikes)
     - **Ads data:** every 4 hours (as per Client Requirements)
     - **Social content:** every 24 hours
   - Scheduling configurable per Project and user needs

5. **Future Optimization:**
   - System may be improved with automation browser or phone farm to reduce 3rd-party costs

⸻

5.3. Key Risks & Mitigation

1. **Provider outage**
   - Retry + queue, fallback provider, use cache read-only mode

2. **API/AI cost spike**
   - Cost alerts, daily spend caps, disable non-critical jobs

3. **Schema changes**
   - Schema validation, contract test, fault-tolerant adapters

4. **ToS or Legal Risk**
   - Crawl public data only, complete query & frequency logging

5. **AI hallucination generating false insights**
   - Add confidence levels, human review for key insights, versioned prompts

⸻

5.4. Implementation Recommendations

**For MVP (using 3rd-party services):**
- Manage 3rd-party API Keys via Secret Manager
- Centralized rate limiter (per-provider / per-project) for quota & cost control
- Caching and batching to optimize API call cost
- Observability and cost control to monitor 3rd-party spending
- Fallback logic for provider errors (switch providers or use cache)
- Normalize schema for easier migration across providers

**For future (cost optimization):**
- Research & implement automation browsers (Selenium/Playwright) for direct web crawling
- Build phone farm infrastructure for mobile app data collection
- Compare costs between 3rd-party vs. in-house to inform migration strategy

⸻

📘 PART 6 – NON-FUNCTIONAL REQUIREMENTS (NFR)

⸻

6.1. Security Requirements

- **API Key Management:** API keys must be securely stored (Secret Manager), never hardcoded
- **Data Encryption:** Sensitive data must be encrypted at rest and in transit
- **Access Control:** System must support authentication and role-based authorization
- **Audit Logging:** Full logging of key operations (API calls, data access, admin actions)

⸻

6.2. Privacy Requirements

- **Data Minimization:** Only collect public data, no unnecessary PII
- **Data Masking:** Mask/replace PII before sending to AI providers
- **ToS Compliance:** Comply with platform Terms of Service (public data only)
- **User Consent:** Users must be informed about data collection and usage

⸻

6.3. Performance Requirements

- **Dashboard Load Time:** Dashboard must load in ≤ 3 seconds for 95% of requests
- **API Response Time:** API endpoints must respond in ≤ 2 seconds for 95% of requests
- **Data Processing:** AI analysis must complete in ≤ 5 minutes for batch processing
- **Concurrent Users:** System must support ≥ 50 concurrent users

⸻

6.4. Scalability Requirements

- **Project Scalability:** Support ≥ 20 concurrent Projects
- **Competitor per Project:** Each project can track ≤ 50 competitors while maintaining performance
- **Data Volume:** System must handle ≥ 10,000 video metadata records/project
- **Horizontal Scaling:** Architecture must allow horizontal scaling as load increases

⸻

6.5. Data Retention Policy

- **Raw Data:** Store raw data (metadata, transcript) for minimum 12 months
- **AI Analysis Results:** Store AI analysis results for at least 24 months to track trends
- **Historical Metrics:** Retain historical metrics (ranking, review count) for at least 24 months
- **Data Archival:** Archive data older than 24 months to cold storage
- **Deletion Policy:** Allow data deletion on user request (GDPR compliance)

⸻

6.6. Error Handling & Reliability

- **Error Recovery:** System must auto-retry on temporary errors (network, API timeout)
- **Graceful Degradation:** If one provider is down, system continues with others
- **Data Consistency:** Ensure no data duplication or loss during error handling
- **Error Notification:** Admin must be notified of serious or prolonged errors

⸻

6.7. Service Level Objectives (SLO) / Service Level Agreements (SLA)

- **System Uptime:** ≥ 99% uptime (≤ 7.2 hours downtime/month)
- **Data Freshness:** 
  - Ads data: ≤ 4 hours latency
  - Social content: ≤ 24 hours latency
  - Review data: ≤ 6 hours latency
  - Ranking data: ≤ 3 hours latency
- **Alert Delivery:** Alerts delivered within ≤ 5 minutes of event detection
- **API Availability:** API endpoints must have ≥ 99.5% availability

⸻

6.8. Monitoring & Observability

- **Metrics Collection:** Capture: Request rate, Error rate, Latency, API cost, Token usage
- **Alerting:** Notify for: System downtime, High error rate, Cost threshold exceeded, Provider outage
- **Logging:** Log: API calls, Crawler jobs, AI processing, User actions
- **Dashboard:** Provide Admin monitoring dashboard for system health and cost tracking

⸻

📘 PART 7 – SUCCESS METRICS (KPIs)

⸻

7.1. Product Success Metrics

**✔ 1. Coverage Rate**
- % of competitors per Project with discovered social entity (via 3rd-party service)
- % of app store signals fully collected (version, ranking, reviews, etc.)
- % of ads metadata obtained via 3rd-party services from Ads Library
- **Target: ≥ 85%**

**✔ 2. Freshness / Data Update Latency**
- **Store metadata** (Review, What's New, Ranking): ≤ 7 days (since crawled alongside metadata, rarely changes)
- **Ads data:** ≤ 4h (per Client Requirements)
- **Social content:** ≤ 24h (per Client Requirements)

**✔ 3. Alert Accuracy**
- % of correct alerts, no false-positives
- **Target: ≥ 90%**

**✔ 4. System Reliability**
- **Uptime ≥ 99%**

**✔ 5. Project Scalability**
- ≥ 20 concurrent projects
- ≤ 50 competitors/project remains stable

⸻

7.2. Business Success Metrics

**✔ 1. Creative Success Metric**
- % of effective creatives based on system insights
- **Target: ≥ 30%**

**✔ 2. Product Strategy Impact**
- % of feature roadmap influenced by "feature gap analysis"
- **Target: ≥ 20%**

**✔ 3. ASO Impact**
- Increased ranking, new keywords from competitor research
- **Target: ≥ 10–20 improved keywords**

**✔ 4. Founder Insight Impact**
- Founder dashboard usage frequency
- **Target: ≥ 3 times/week**

⸻

7.3. AI Performance Metrics

**✔ 1. Pain Point Extraction Accuracy**
- **Target: ≥ 80%**

**✔ 2. Topic Clustering Quality**
- **Target: silhouette ≥ 0.6–0.7**

**✔ 3. Sentiment Accuracy**
- **Error margin ≤ 10%**

**✔ 4. False Insight Reduction**
- **Hallucination ≤ 5%**

**✔ 5. AI Cost Efficiency**
- Optimize ≥ 30% token via batching

⸻

7.4. Adoption Metrics

**✔ 1. Weekly Active Users (WAU)**
- **Target: ≥ 80% of users active weekly**

**✔ 2. Feature Usage**
- **Target: ≥ 60% feature usage**

**✔ 3. Alert Engagement**
- **Target: ≥ 50% of alerts engaged**

⸻

📘 PART 8 – FUNCTIONAL REQUIREMENTS

⸻

8.1. Project Management Module

**FR1 – Create Project**
- Users create a Project with: Project Name, Category (optional), Keywords (optional), Short Description (optional)

**FR2 – Project Management**
- Edit Project Name, Add/remove keywords, Enable/disable tracking module
- Flexibly configure Crawler Scheduling as needed (frequency for Store metadata, Ads, Social content crawling)
- (As per PRD) UI for project management uses **Project cards/grid**, displaying overall stats (competitor count, alert count, last updated)
- (As per PRD) **Project Categories** reference: Shopping, Finance, Health & Fitness, Education, Productivity, Social, Games, Other

**FR3 – Add Competitor to Project**
- **FR3.1 – Add via URL:** Enter iOS App Store URL or Google Play URL → Validate and fetch metadata
- **FR3.2 – Add via Keyword:** Enter ASO keyword → Find related apps via providers → Suggest iOS + Android URLs → User selects apps to add
- **FR3.3 – Competitor Discovery:** Enter brand/Publisher name → System suggests related Social channels (Facebook Page, Instagram, TikTok, YouTube) → User selects channels to add to Watchlist

**FR4 – Market Landscape Analysis (Auto after competitor addition)**
- After adding a competitor to a Project, the system auto-triggers Market Landscape Analysis.
- Allows refreshing analysis upon adding/removing competitors.
- AI executes Market Landscape Analysis. (See FR19 for step-by-step and analytic logic.)

**FR5 – Competitor Management**
- Remove competitor, View metadata, View crawl error

**FR6 – Target Management**
- Manage Watchlist: Add/Remove/Pause competitors
- Manage Keywords: Add/Remove keywords for Ads crawling

**FR7 – Manual Review & Data Curation (Phase 2 as per PRD)**
- **Pending Review Queue:** Shows list of videos and social channels awaiting review
- **Video Assignment:**
  - Videos found via keyword but unassigned → Reviewer assigns to the correct app in Project
  - Remove videos not relevant for Project purpose
- **Social Channel Assignment:**
  - Assign social channels to owned competitor apps (encouraged, not mandatory)
  - Relationship between social channel and app is stored to improve analysis accuracy
- **Bulk Operations:** Approve/reject/assign multiple items simultaneously
- **Relationship Management:** Manage mapping between social channels, videos, and apps (assignment recommended for higher data quality)

⸻

8.2. Data Collection Module (Crawlers)

**FR8 – Crawl Store Metadata**
- Title, subtitle, description, Category
- Icon metadata, Screenshot metadata
- Version & What's New
- In-app event / LiveOps
- Ranking signals, Keyword ranking
- Review & sentiment

**FR9 – Crawl Social Entity**
- TikTok, Instagram, YouTube, Facebook (**X: optional / future**)
- Discover related profiles, collect metadata (username, bio, growth signals)
- Collect content metadata & transcript (do not store video files)
- Assigning social channel to owned competitor app is encouraged (not mandatory) to improve analysis

**FR10 – Crawl Ads Metadata**
- Gather ads metadata from Facebook Ad Library, TikTok Creative Center, Google Ads Transparency via 3rd-party service
- Store metadata (hook, angle, CTA, transcript, timeline)
- Only store metadata and transcript, do not store video files
- Note: The system does not access Ads Library directly – all through 3rd-parties

**FR11 – Crawl Landing Page**
- Crawl text content, detect changes, store copywriting content

**FR12 – Crawler Scheduling**
- **Store listing metadata** (title/description/icon/screenshot):
  - Default: every 4–7 days (since mobile store metadata changes infrequently)
- **What's New (changelog):**
  - Default: every 24h (or as needed)
- **Reviews:**
  - Default: ≤ 6h
- **Ranking & keyword signals:**
  - Default: ≤ 3h
- **Ads data:** Every 4h (per Client Requirements)
- **Social content:** Every 24h (daily crawl)
- **Flexible configuration:** Scheduling adjustable per Project and user needs via settings

⸻

8.3. Data Processing Module

**FR13 – Normalization**
- Standardize canonical schema (ads, social, review, ASO, changelog)

**FR14 – Data Pre-processing**
- Process transcripts and text data before AI input (clean, normalize, deduplicate)

**FR15 – Hero Video Detection**
- Detect Hero Videos per official definition: video with ≥ 20% growth in 24 hours, measured by rate of Likes/Comments/Shares/Views from system snapshot data

⸻

8.4. AI Analysis Module

**FR16 – Pain Point Extraction**
- Input: review + ads transcript + social transcript
- Output: pain point list, emotional signal, importance score

**FR17 – Creative Angle Analysis**
- Hook / setup / CTA / outcome
- Top-performing angle, time-based trends

**FR18 – Feature Gap Analysis**
- Compare What's New + ad-feature data vs. own app
- Suggest gaps & priorities

**FR19 – Market Landscape Analysis (AI Reasoning)**
- Input: App name, Description, Reviews (top/sentiment), Icon metadata, Screenshot metadata for all competitors in Project
- AI reasoning engine analyzes & outlines:
  - Competitor positioning overview
  - Market strengths/weaknesses analysis
  - Positioning & feature direction suggestions for your app
  - Analysis of market opportunity gaps
- Output: Market Landscape Summary (displayed in Founder Dashboard)
- Trigger: Runs automatically after first competitor is added, can be refreshed manually

**FR20 – Sentiment & Topic Modeling**
- Topic clustering, Sentiment scoring
- Intent labeling (feature request, bug, complaint, positive)

⸻

8.5. Dashboard Module

**FR21 – Marketing Dashboard**
- Global Trending Feed (Hero Video)
- Creative Explorer, Pain Point Map
- Traffic Channel Map, Content Strategy Tracker
- Creative Angle Trend, Competitor Detail Page

**FR22 – Product Dashboard**
- Feature Update Tracker, Feature Gap Analysis

**FR23 – ASO Dashboard**
- Ranking Dashboard, Keyword Gap
- Screenshot/Icon change log, Review sentiment

**FR24 – Founder Dashboard**
- Market growth, Rise/fall competitors, New competitor detection
- **Market Landscape Summary:** Shows AI reasoning for market overview (from FR19)

**FR25 – Manual Review & Curation Dashboard**
- Pending Review Queue, Unassigned Items, Social Channel Assignment
- Bulk Operations to approve/reject/assign

⸻

8.6. Alerts Module

**FR26 – Marketing Alerts (Phase 2 as per PRD)**
- New Hero Video (official definition)
- New ad, Ad spike
- New social entity, New landing page

**FR27 – Product Alerts (Phase 2 as per PRD)**
- Version update, New feature in What's New
- Review spike (feature-related)

**FR28 – ASO Alerts (Phase 2 as per PRD)**
- Ranking spike, Review spike, Keyword movement

**FR29 – Founder Alerts (Phase 2 as per PRD)**
- Competitor rise, Competitor removed, New app in niche

**FR30 – Manual Review Alerts (Phase 2 as per PRD)**
- New video needs reviewing/assignment to app
- New social channel needs assignment to app (encouraged)
- Pending review items exceeded threshold (for backlog prevention)

⸻

8.7. Admin & System Module

**FR31 – API Key Management (Phase 3 as per PRD)**
- Add / remove / rotate key, Quota alert

**FR32 – Cost Monitoring (Phase 3 as per PRD)**
- Costs by provider → project → module
- Cost alert threshold

**FR33 – Error Monitoring (Phase 3 as per PRD)**
- Crawler error, Provider error, AI error
- Dashboard retry log

**FR34 – Access Control**
- System supports roles: Admin, Marketing, Product, ASO, Founder

⸻

---

## Document Information

**BRD Version:** 2.3  
**Last Updated:** 2025-12-12  
**Status:** ✅ Updated — Aligned with `docs/1.business-analyst/system-prd.md`  
**Aligned with:** System PRD (CompetitorIQ)

---

**End of Document**
