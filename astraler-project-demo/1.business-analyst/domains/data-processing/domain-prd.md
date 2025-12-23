# Domain PRD: Data Processing

## 1. Overview
The **Data Processing Domain** is the intermediate layer between raw data ingestion (Data Collection) and analysis/storage. It is responsible for normalizing disparate data sources into a canonical schema, cleaning text, and storing data efficiently.

## 2. Business Context
Data comes from various 3rd-party sources (Apify, etc.) in different formats (JSON schemas vary by provider and platform). We need a robust processing layer to standardize this data so that the AI module and Dashboards can consume it without worrying about the source format.

## 3. User Flows (System Flows)

### 3.1. Ingestion Pipeline
1.  **Input**: Raw JSON from Data Collection job.
2.  **Validation**: Check against `RawSchema`.
3.  **Normalization**: Map fields to `CanonicalSchema` (e.g., standardizing `video_url`, `published_at`, `engagement_metrics`).
4.  **Cleaning**: Remove HTML tags, emojis (if needed for AI), duplicates.
5.  **Storage**: Save to Data Warehouse / Database.

### 3.2. Hero Video Calculation
1.  **Input**: Snapshot of video metrics at T1 and T2.
2.  **Logic**: Calculate growth rate (Velocity).
3.  **Threshold Check**: If Velocity >= 20% in 24h -> Mark as `is_hero_video = true`.
4.  **Event Generation**: Trigger "New Hero Video" event for Alerts Domain.

## 4. Business Rules
*   **Data Integrity**: Never modify the original raw data (store raw separately if possible, though strict BRD says store metadata). Ideally, keep a copy of raw response for debugging.
*   **Deduplication**: Prevent duplicate entries if the crawler runs overlapping ranges.
*   **Canonical Format**: All downstream modules (AI, UI) must strictly use the canonical schema, never source-specific schemas.

## 5. Domain Features (Detailed)

### FR13: Normalization Engine
*   **Function**: Transformers for TikTok, YouTube, Meta, etc., converting them to a unified `MediaItem` model.

### FR14: Data Pre-processing
*   **Function**: Text extraction and cleaning.
*   **Detail**: Prepare transcripts for AI (chunking if text is too long).

### FR15: Hero Video Detection Engine
*   **Logic**: 
    *   Compare current metrics vs. last snapshot (24h ago).
    *   Formula: `(Current - Previous) / Previous * 100`.
    *   Condition: `> 20%`.
