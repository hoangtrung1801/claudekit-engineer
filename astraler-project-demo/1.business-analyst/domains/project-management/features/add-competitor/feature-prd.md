# Feature PRD: Add Competitor

## 1. Feature Overview
**Add Competitor** is the entry point for data collection. Users can add competitors via Store URL or Keywords. This feature orchestrates the validation of the URL, fetching of initial metadata, and initialization of tracking.

## 2. Business Context
Users want to get started quickly. The "Add" process must be robust—handling invalid URLs, duplicate entries, and immediate fetching of basic info (Icon, Name) to give instant feedback.

## 3. User Flows

### 3.1. Add by URL
1.  User pastes URL (App Store or Google Play).
2.  System validates URL format.
3.  **Backend**: Calls Metadata Provider (e.g., SearchAPI) to fetch App Name, Icon, ID.
4.  **UI**: Displays "Found: [App Name]" with Icon.
5.  User clicks "Confirm & Add".
6.  System creates `Competitor` record and enqueues an initial crawl job (periodic re-crawls are handled by the system scheduler).

### 3.2. Add by Keyword
1.  User enters keyword "Fitness Tracker".
2.  System searches 3rd-party App Store API.
3.  Display list of top 5 results.
4.  User selects specific apps.
5.  System adds selected apps to Project.

## 4. Acceptance Criteria

### AC1: Validation
*   Must accept valid `apps.apple.com` and `play.google.com` URLs.
*   Must reject invalid domains.
*   Must detect if competitor already exists in the **same** Project (prevent duplicates).

### AC2: Initial Fetch
*   Must fetch: Title, Icon, Bundle ID, Developer Name.
*   Timeout: If fetch takes > 10s, show error.

### AC3: Landscape Trigger
*   Adding the first 3 competitors MUST trigger the "Market Landscape Analysis" job (FR19).

## 5. Technical Constraints
*   **Rate Limits**: Determine if validating 50 URLs in bulk calls hits API limits.
*   **Proxy**: Use resilient proxies for store requests.
