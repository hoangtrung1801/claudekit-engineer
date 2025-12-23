# Feature SAD: Hero Video Detection

## 1. Architecture Overview
Hero Video detection is a pure **Data Processing** task that runs after every social crawl.

## 2. Algorithm Implementation

### 2.1. Data Requirements
We need at least 2 snapshot points for a specific video: `T_current` and `T_prev` (approx 24h ago).

### 2.2. Processing Pipeline
1.  **Ingest**: `CrawlWorker` saves `SocialVideoSnapshot` to `video_snapshots` table.
2.  **Trigger**: `PostIngestHook` triggers `HeroDetectionService`.
3.  **Query**:
    ```sql
    SELECT current.views, prev.views
    FROM video_snapshots current
    JOIN video_snapshots prev ON current.video_id = prev.video_id
    WHERE current.created_at >= NOW() - INTERVAL '1 hour'
      AND prev.created_at BETWEEN NOW() - INTERVAL '25 hours' AND NOW() - INTERVAL '23 hours'
    ```
4.  **Compute**: Calculate Growth %.
5.  **Action**: If Hero, update `videos` table flag `is_hero=true` and `hero_detected_at=NOW()`.

## 3. Database Changes
*   **Table**: `videos` (Metadata)
    *   `is_hero`: Boolean index.
    *   `hero_score`: Float (Growth rate).
*   **Table**: `video_snapshots` (TimeSeries)
    *   `views`, `likes`, `shares`.

## 4. Integration
*   Emits `Event: HeroVideoDetected(video_id)`.
*   Alerts Domain listens to this event.
