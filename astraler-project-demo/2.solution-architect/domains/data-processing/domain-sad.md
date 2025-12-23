# Domain SAD: Data Processing

## 1. Architecture Overview
The **Data Processing Domain** acts as the transformation layer. It consumes raw data events, normalizes them into a unified schema, and stores them. It is built using **NestJS** and **BullMQ**.

## 2. Component Design

### 2.1. Normalization Engine (Service)
*   **Role**: Converts provider-specific JSON (Apify TikTok vs YouTube) into a unified internal model.
*   **Input**: `DataIngested` event.
*   **Output**: Unified `Video` entity (containing both Organic and Ad data).
*   **Strategy**: Type-safe Mappers (AutoMapper or manual DTO transformation).

### 2.2. Cleaning Module (Service)
*   **Role**: Sanitizes text for AI (removes HTML, emojis, PII masking).
*   **Library**: `sanitize-html`, `linkify-it`.

### 2.3. Hero Video Processor (Processor)
*   **Role**: Detects viral growth.
*   **Logic**: Historical snapshot comparison -> Velocity Calculation -> Emit `HeroVideoDetected`.

## 3. Data Flow
1.  **Ingestion**: `CrawlerWorker` emits `DataIngested`.
2.  **Processing**: `ProcessingQueue` picks up task.
    *   **Normalization**: Maps raw JSON to `Video` entity.
    *   **Classification**: Sets `type` to `ORGANIC` or `AD`.
    *   **Cleaning**: Sanitizes text.
3.  **Storage**: Save to `Video` table (Prisma).
4.  **Events**: Emit `DataProcessed` (triggering Analysis Domain).

## 4. Integration
*   **Input**: Redis PubSub / Queue.
*   **Output**: Redis PubSub (`DataProcessed`, `HeroVideoDetected`).
