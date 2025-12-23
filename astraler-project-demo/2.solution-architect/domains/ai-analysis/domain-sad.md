# Domain SAD: AI Analysis

## 1. Architecture Overview
The **AI Analysis Domain** processes text and structured data to generate insights. It uses a **Pipeline Architecture** to chain multiple small logic steps (Preprocessing -> AI Call -> Postprocessing).

## 2. Pipeline Design Reference

### 2.1. "Pain Point" Pipeline
1.  **Step 1: Aggregator**: Fetch last 100 negative reviews **where `isAnalyzed` = false**.
2.  **Step 2: Chunker**: Split into token batches.
3.  **Step 3: Reasoning**: "Extract key complaints..." (GPT-4o-mini).
4.  **Step 4: Persister**: 
    *   Save to `AnalysisResult`.
    *   **Mark source reviews as analyzed** (`isAnalyzed = true`).

### 2.2. "Market Landscape" Pipeline
1.  **Step 1: Aggregator**: Fetch all competitor Context (Descriptions, Top Reviews).
2.  **Step 2: Reasoning**: "Generate SWOT analysis..." (GPT-4o).
3.  **Step 3: Persister**: Save to `AnalysisResult` (Type: MARKET_LANDSCAPE).

### 2.3. "What's New" Analysis Pipeline
1.  **Step 1: Input**: Receive `AppVersion` update.
2.  **Step 2: Filter**: Check if `strategicInsight` is already present. If yes, Skip.
3.  **Step 3: Reasoning**: "Analyze technical changes..." (GPT-4o).
4.  **Step 4: Persister**: embedded in `AppUpdate` entity.

### 3.2. Pipeline Architecture
*   **Pattern**: Chain of Responsibility (LangChain `Sequence`).
*   **Error Handling**:
    *   **Retry**: Exponential backoff for `RateLimitError`.
    *   **Fallback**: Use cheaper model (GPT-3.5) if quota exceeded (Future).

## 3. Database Design
*   **Table: `analysis_results`** (see Master Schema in `database-schema.md`)
    *   `id`: UUID
    *   `project_id`: UUID (FK)
    *   `type`: Enum (MARKET_LANDSCAPE, PAIN_POINT, FEATURE_GAP, CREATIVE_ANGLE, VIDEO_TRENDS, SENTIMENT_TOPIC, WHATS_NEW_SUMMARY)
    *   `status`: Enum (PENDING, PROCESSING, COMPLETED, FAILED)
    *   `data`: JSONB (Flexible schema for different insight types)
    *   `summary`: Text (Human-readable summary for quick display)
    *   `source_count`: Int (Number of source items analyzed)
    *   `triggered_by`: String ('auto' | 'manual')
    *   `created_at`: Timestamp
    *   `completed_at`: Timestamp (nullable)

## 4. Technology Choices
*   **LLM Interface**: LangChain.js (Node.js).
*   **Queue**: BullMQ `ai_tasks` queue.
