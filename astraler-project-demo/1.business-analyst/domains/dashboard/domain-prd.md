# Domain PRD: Dashboard (Presentation)

## 1. Overview
The **Dashboard Domain** is the user interface layer where insights meet the user. It provides role-specific views (Marketing, Product, ASO, Founder) to ensure users see only what matters to them without noise.

## 2. Business Context
Different stakeholders care about different things. A Marketer wants "Hero Videos". A Founder wants "Market Trends". A "One size fits all" dashboard fails. We need specialized views.

## 3. User Flows

### 3.1. Marketing Dashboard Flow
1.  User Selects Project.
2.  Views "Global Trending Feed" (Hero Videos).
3.  Filters by "Last 24h".
4.  Clicks into a specific video to see "Creative Analysis".

### 3.2. Founder Dashboard Flow
1.  User enters dashboard.
2.  Sees "Market Landscape Summary" (AI generated).
3.  Checks "Rising Competitors".

## 4. Business Rules
*   **Role Specificity**: Default view depends on user role.
*   **Real-time Interaction**: Filtering should be instant (on cached data).
*   **Data Freshness**: Indicate clearly when data was last updated.

## 5. Domain Features (Detailed)

### FR21: Marketing Dashboard
*   **Components**: Trending Feed, Creative Explorer, Pain Point Map, Traffic Channel Map.

### FR22: Product Dashboard
*   **Components**: Feature Update Tracker, Feature Gap Analysis.

### FR23: ASO Dashboard
*   **Components**: Ranking Charts, Keyword Gaps, Metadata Change Log.

### FR24: Founder Dashboard
*   **Components**: Market Growth, Rising Competitors, **Market Landscape Summary**.

### FR25: Manual Review Dashboard
*   **Components**: Queue of pending items, Assignment tools.
