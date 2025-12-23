# Feature SAD: Market Landscape Analysis

## 1. Architecture Overview
This is a heavy AI batch job. It aggregates large amounts of text.

## 2. Pipeline Design

### 2.1. Data Aggregation
*   **Input**: `project_id`.
*   **Query**: Fetch all `competitors` in project -> Get `description` and Top 5 `reviews` (by helpfulness).
*   **Context Limit Strategy**: If total context > 100k tokens, truncate reviews or summarization per competitor first (Map-Reduce pattern).

### 2.2. AI Interaction
*   **Model**: GPT-4o (High context window).
*   **Prompt Structure**:
    *   System: "You are a Strategic Business Consultant..."
    *   User: "Here is the market data for [Project Name]. Competitor A: ..., Competitor B: ..."
    *   Task: "Output SWOT JSON."

### 2.3. Storage
*   **Table**: `analysis_results` (with `type='MARKET_LANDSCAPE'`)
    *   `project_id`: FK.
    *   `data`: JSONB (contains `landscape_summary` and `swot_data`).

## 3. Error Handling
*   **Token Overflow**: Implement "Summarize Individual Competitor" step if master context is too big.
*   **Timeout**: Job can take 5+ minutes. Must be async.
