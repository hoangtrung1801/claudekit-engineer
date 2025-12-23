# Feature SAD: Add Competitor

## 1. Architecture Overview
This feature spans synchronous API calls (validation) and asynchronous background work (initial crawl).

## 2. Component Design

### 2.1. Synchronous Flow (Validation)
*   **Endpoint**: `POST /competitors/validate`
*   **Logic**:
    *   Regex check URL.
    *   Check `competitors` table for existing entry in Project.
    *   Call `SearchAPI.fetch_app_details(url)` (Timeout: 10s).
*   **Return**: `AppMetadata` (Name, Icon, ID) or Error.

### 2.2. Asynchronous Flow (Ingestion)
*   **Endpoint**: `POST /competitors`
*   **Logic**:
    *   Publish `Event: CompetitorCreated`.
*   **Worker**:
    *   Listener `CompetitorCreatedHandler`.
    *   Dispatches `CrawlStoreJob` (immediate) and `CrawlSocialDiscoveryJob` (delayed).

## 3. Database Changes
*   **Table**: `competitors`
    *   `store_url` (UK): Unique Constraint to prevent duplicates per project? No, per project is `(project_id, store_url)`.
    *   `status`: Enum (`PENDING`, `ACTIVE`, `ERROR`).

## 4. API Specification (Internal)
*   `SearchAPIAdapter.get_app_details(url: str) -> AppMetadata`
