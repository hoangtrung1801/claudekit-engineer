# System PRD: CompetitorIQ (Competitor Intelligence Platform)

## 1. System Overview
**CompetitorIQ** (Competitor Intelligence Platform) is a comprehensive competitive intelligence system designed for Mobile Apps (iOS/Android). It empowers Marketing, Product, ASO, and Founder teams to proactively monitor competitors, detect "Hero Videos" (high-performing creatives), analyze winning strategies, and extract actionable insights (pain points, creative angles, feature gaps).

The system operates on a **Project-based** model, where each project represents a specific app being developed or optimized. It utilizes 3rd-party services to crawl data from App Stores, Social Media (TikTok, YouTube, Instagram, FB), and Ad Libraries, then applies AI to analyze and visualize this data.

### 1.1 Brand Identity
- **System Name**: CompetitorIQ
- **Primary Color**: Indigo (#6366F1)
- **Secondary Color**: Violet (#8B5CF6)
- **Typography**: Inter font family
- **Icon System**: Google Material Symbols (outlined & filled)
- **Design Language**: Modern, clean, professional with premium UI components

## 2. Business Goals & Objectives
*   **Proactive Competitor Tracking**: Automate the collection of competitor metadata, creatives, and performance metrics.
*   **Market Understanding**: Provide enhanced market landscape analysis using AI to identify positioning and opportunities.
*   **Creative Optimization**: Detect "Hero Videos" (videos with significant growth) to inform marketing strategies.
*   **Product Development**: Identify feature gaps and user pain points from reviews and social listening to guide product roadmap.
*   **Growth Strategy**: Enable data-driven decisions for Founders and Management regarding market entry and expansion.

## 3. User Personas & Access Control
The system serves four main internal user groups with role-based access control (RBAC):

1.  **Marketing Team** (Performance Marketers, Creative Strategists)
    *   Focus: Ad creatives, hooks, angles, traffic channels, Hero Videos.
    *   **Primary Dashboards**: Marketing, Channels, Videos, AI Insights
2.  **Product Team** (Product Managers, UX Researchers)
    *   Focus: Feature updates ("What's New"), feature gaps, user sentiment, reviews.
    *   **Primary Dashboards**: What's New, Reviews, AI Insights
3.  **ASO Team**
    *   Focus: Keyword rankings, metadata changes (Icon/Screenshot), store presence.
    *   **Primary Dashboards**: ASO, Competitors
4.  **Founder / Management**
    *   Focus: High-level market landscape, competitor growth trends, strategic positioning.
    *   **Primary Dashboards**: Overview, AI Insights, Marketing
5.  **Admin / System Manager**
    *   Focus: Project management, competitor monitoring setup, system configuration, API key management, cost monitoring.
    *   **Primary Dashboards**: Admin Panel (Users, Projects, Tasks, Health), Data Management (Videos, Social, ASO Keywords).

### 3.6. Workspace Architecture & Access Control ⭐ PRIORITY

**Project-Based Workspace Model:**
*   Each project = isolated workspace (own data, competitors, settings)
*   Multi-project support with TopBar dropdown switcher
*   Invitation-based membership (no open access)
*   RBAC enforcement at API and UI levels

**Module Organization:**
```
📊 OVERVIEW - Dashboard
📱 INTERNAL - Own App: Info, ASO, Marketing
🔍 EXTERNAL - Competitors: Competitors, What's New, Channels, Videos, Reviews
🤖 INSIGHTS - AI Insights
```

**Access Control Matrix:**

| Role | INTERNAL | EXTERNAL | INSIGHTS |
|------|----------|----------|----------|
| Marketing | Marketing only | Videos, Channels | Full |
| Product | Limited | What's New, Reviews | Full |
| ASO | ASO only | Competitors | Limited |
| Founder | Full | Full | Full |
| Admin | Full | Full | Full |

**Implementation Requirements:**
*   Backend: RBAC middleware validates all API requests
*   Frontend: Sidebar filters modules by role
*   Priority: HIGH - Required for Phase 1 completion

## 4. System Architecture & Domain Breakdown
The system is divided into key domains (modules) to ensure modularity and scalability.

### 4.1. Core Domain (Project Management)
*   **Function**: Manages the lifecycle of Projects, Competitors, and Targets.
*   **Key Features**:
    *   **Project CRUD**: Create, view, update, and delete projects.
    *   **Project Cards UI**: Visual grid layout displaying project metrics (competitor count, alert count, last updated).
    *   **Project Categories**: Shopping, Finance, Health & Fitness, Education, Productivity, Social, Games, Other.
    *   **Add Competitors**: Via App Store/Play Store URL or App ID.
    *   **Competitor Management**: Track app name, version, developer, rating, reviews, social channels, video count, and status.
    *   **Watchlists and Keywords**: Configure monitoring parameters per project.
    *   **Project Selection**: Click-to-enter dashboard view for detailed analysis.
    *   **Multi-Project Support**: Users can manage multiple projects simultaneously.

### 4.2. Data Collection Domain (Crawlers)
*   **Function**: Interacts with 3rd-party providers (Apify, SearchAPI, etc.) to fetch external data.
*   **Sub-modules**:
    *   **Store Crawler**: Metadata, reviews, rankings, version history.
    *   **Social Crawler**: Profiles, content metadata, growth signals.
    *   **Ads Crawler**: Ad library metadata (via 3rd party).
    *   **Web Crawler**: Landing page content.
*   **Scheduling**: configurable frequencies (e.g., Ads every 4h, Social every 24h).

### 4.3. Data Processing Domain
*   **Function**: Normalizes, cleans, and stores raw data; prepares text for AI analysis.
*   **Key Features**:
    *   Schema normalization.
    *   Transcript cleaning.
    *   Hero Video detection logic (growth calculation).

### 4.4. Intelligence Domain (AI Analysis)
*   **Function**: The "Brain" of the system, using LLMs to extract insights.
*   **Key Features**:
    *   **Executive Summary Dashboard**: Daily intelligence briefing with 3 key insights (Market Move, Opportunity, Viral Alert).
    *   **Impact Scoring**: High/Medium/Low classification for competitive intelligence prioritization.
    *   **Sentiment Indicators**: Positive/Negative/Neutral outlook on market trends.
    *   **Multi-source Synthesis**: Combines data from App Updates, User Reviews, Video Analysis, and ASO Metrics.
    *   **Market Landscape Analysis**: Strategic overview of the market with positioning insights.
    *   **Pain Point Extraction**: From reviews and transcripts to identify user frustrations.
    *   **Creative Angle Analysis**: Identify hooks, CTAs, content flows from competitor creatives.
    *   **Feature Gap Analysis**: Compare competitor features vs. own product.
    *   **Sentiment & Topic Modeling**: Analyze user feedback trends over time.
    *   **Strategic Recommendations**: AI-generated actionable recommendations for product and marketing teams.

### 4.5. Presentation Domain (Dashboards & Alerts)
*   **Function**: Visualizes data and notifies users of meaningful events.
*   **Dashboard Screens** (14+ specialized views):
    1.  **Overview**: Activity feed with real-time competitor updates.
    2.  **Info**: Project information and detailed configuration.
    3.  **Settings**: Project-specific settings and parameters.
    4.  **ASO**: App Store Optimization metrics and keyword rankings.
    5.  **Marketing**: Ad performance metrics and DAU tracking (Phase 3/Placeholder).
    6.  **Spy Keywords**: Monitor specific keywords across Ads Libraries and Social Media.
    7.  **Competitors**: Competitor app list and storage management.
    8.  **What's New**: Version update timeline with AI strategic insights.
    9.  **Social**: Social media profile monitoring (TikTok, Instagram, FB).
    10. **Video Ads**: Library of competitor video ads with performance metadata.
    11. **Video Organic**: Library of organic social videos from competitors.
    12. **Reviews**: User feedback analysis with sentiment trends.
    13. **Landing Pages**: Monitoring of competitor landing pages and social link extraction.
    14. **AI Insights**: Strategic intelligence (Phase 3/Placeholder).
*   **UI Components**:
    *   KPI summary cards with trend indicators
    *   Data tables (sortable, searchable, paginated)
    *   Charts (bar, donut, area, line) for data visualization
    *   Filter panels for data refinement
    *   Timeline views for historical tracking
    *   Insight cards with impact badges and sentiment indicators
*   **Alerts** (Phase 2): Multi-channel notifications (Slack, Telegram, Email, In-app) for significant events.
*   **Manual Review** (Phase 2): Tools for human curation of assigned data.

### 4.6. Admin & Infrastructure Domain
*   **Function**: System health, security, and cost control.
*   **Key Features**:
    *   API Key Management.
    *   Cost Monitoring & caps.
    *   Error Logging & Observability.

## 5. User Interface & Experience

### 5.1. Authentication
*   **Login Screen**: Email/password authentication with professional branding
*   **Features**: "Remember me", "Forgot password" functionality
*   **Loading States**: Spinner animations during authentication
*   **Session Management**: Secure user session handling
*   **Note**: Social login (Google, GitHub) available but low priority - basic auth sufficient

### 5.2. Navigation Architecture
*   **3-Tier Sidebar Structure**:
    *   **INTERNAL**: Info, ASO, Marketing
    *   **EXTERNAL**: Competitors, What's New, Channels, Videos, Reviews
    *   **INSIGHTS**: AI Insights
*   **Header Navigation**:
    *   Breadcrumb: Project Name → Screen Name  
    *   Notification bell with badge
    *   User profile display
*   **Right Panel** (Desktop only, XL+ breakpoints):
    *   Today's Summary widget
    *   Monitored Brands quick access
    *   Filter by Competitor checkboxes

### 5.3. Design System
*   **Color Palette**:
    *   Primary: Indigo (#6366F1)
    *   Secondary: Violet (#8B5CF6)
    *   Success: Emerald (#10B981)
    *   Warning: Amber (#F59E0B)
    *   Danger: Rose (#F43F5E)
*   **Typography**: Inter font family (300, 400, 500, 600, 700 weights)
*   **Icons**: Google Material Symbols (outlined & filled variants)
*   **UI Components**:
    *   Premium glassmorphism effects
    *   Gradient accents (indigo-violet)
    *   Custom scrollbars
    *   Color-coded badges (status, impact, sentiment)
    *   Micro-animations on hover
    *   Empty states with helpful messaging
    *   Loading states with spinners
    *   Tooltips for data visualization

### 5.4. Responsive Design
*   **Breakpoints**: Mobile-first (sm, md, lg, xl, 2xl)
*   **Mobile**: Simplified navigation, stacked layouts
*   **Tablet**: 2-column layouts, accessible sidebar
*   **Desktop**: Full 3-column layouts with right panel
*   **Performance Target**: < 3 seconds dashboard load time

## 6. Constraints & Assumptions
### 6.1. Technical Constraints
*   **No Official APIs**: Reliance strictly on 3rd-party scrapers/services for Social and Ads data.
*   **Proxy/Rate Limits**: Must handle quotas and potential failures from 3rd-party providers.
*   **Data Retention**: Specific policies for raw vs. analyzed data (12-24 months).
*   **Performance**: Dashboards load < 3s; High concurrent processing capability.

### 6.2. Business Assumptions
*   **Budget Availability**: Sufficient budget for 3rd-party APIs and AI tokens.
*   **Data Availability**: Competitor data is public and accessible via the chosen 3rd-party tools.
*   **Scale**: Each project tracks ~50 competitors maximum.

## 7. Roadmap Phase Breakdown
### Phase 7.1: MVP Core (Foundation) - ✅ COMPLETE (V2)
*   ✅ Project & Competitor Management.
*   ✅ Authentication system (email/password).
*   ✅ Core Dashboard screens (Overview, ASO, Competitors, What's New, Social, Video Ads, Video Organic, Reviews, Landing Pages, Spy Keywords).
*   ✅ Store & Social Crawlers integration.
*   ✅ Hero Video Detection.
*   ✅ Premium UI/UX with responsive design.
*   ✅ Admin Panel (User/Project management).

### Phase 7.2: Advanced Intelligence & Analytics
*   AI Analysis (Pain Points, Landscape, Executive Summary) - **PENDING**.
*   Marketing Analytics (Full integration).
*   Feature Gap Analysis (enhanced visualization).
*   Full Alerting System (Slack/Telegram integrations).
*   Enhanced ASO analytics.

### Phase 7.3: Optimization & Scale
*   Enhanced Manual Review workflows.
*   Cost optimization (Batching, Caching).
*   Advanced Sentiment Analysis.
*   Admin Cost Monitoring tools.
*   Performance optimizations for concurrent users.
*   Advanced Sentiment Analysis.
*   Admin Cost Monitoring tools.
