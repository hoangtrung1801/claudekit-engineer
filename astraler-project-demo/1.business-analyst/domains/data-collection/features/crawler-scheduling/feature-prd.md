# Feature PRD: Crawler Scheduling

## 1. Feature Overview
**Crawler Scheduling** manages *when* and *how often* data is fetched. It ensures freshness (Ads updated every 4h) while respecting API quotas and budgets.

## 2. Business Context
Data freshness is a selling point, but costs money. Users (Admins) need control. The system needs a "Heartbeat" to dispatch jobs automatically.

## 3. Logic & Configuration

### 3.1. Default Schedules
*   **Ads Crawler**: Interval = 4 hours.
*   **Social Crawler**: Interval = 24 hours.
*   **Store Metadata**: Interval = 7 days.

### 3.2. Dispatch Logic
*   **Cron Job** runs every minute.
*   Uses **system-level schedule configuration** (e.g., `.env` / crawler module config).
*   Checks which modules are enabled for each Project (e.g., Ads enabled? Social enabled?).
*   Finds jobs where `last_run_at + interval < now`.
*   Pushes job to `Job Queue` (e.g., Redis/Celery).

## 4. Acceptance Criteria

### AC1: Configurable Intervals
*   Admin/System config must allow overriding defaults (e.g., set Ads to 12h to save money). This is **not** configured per project.

### AC2: Concurrency Control
*   Do not trigger a new job if the previous one is still `RUNNING`.

### AC3: Quota Safety
*   Before dispatching, check `DailyBudgetConsumed`. If > 100%, skip dispatch and log "Quota Exceeded".

## 5. Test Scenarios
*   **TS1**: Set interval 1 hour. Run at 10:00. Check at 11:01. Job should be queued.
*   **TS2**: Trigger "Force Crawl". Job should be queued immediately regardless of schedule.
