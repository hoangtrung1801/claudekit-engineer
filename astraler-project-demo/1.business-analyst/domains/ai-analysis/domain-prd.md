# Domain PRD: AI Analysis

## 1. Overview
The **AI Analysis Domain** is the intelligence core. It takes processed text data (reviews, transcripts, descriptions) and uses Large Language Models (LLMs) to extract meaningful insights that human analysts might miss at scale.

## 2. Business Context
Raw data (thousands of reviews, hundreds of ad scripts) is overwhelming. The value proposition is **AI Summarization and Insight Extraction**. We treat "Analysis" as a pipeline that runs after data collection.

## 3. User Flows (System Flows)

### 3.1. Analysis Pipeline Trigger
1.  **Trigger**: New batch of data arrives (e.g., 50 new reviews or 10 new ad transcripts).
2.  **Accumulator**: System buffers data to optimize token usage (Batching).
3.  **Processing**: Sends batched prompt to AI Provider (OpenAI/Gemini).
4.  **Result Parsing**: Extracts structured JSON (Insights, Sentiment, Scores).
5.  **Storage**: Saves insights to database linked to the Project/Competitor.

### 3.2. Market Landscape Flows
1.  **Trigger**: User adds first few competitors to a Project.
2.  **Aggregation**: System collects Description + High-impact Reviews of all competitors.
3.  **Reasoning**: AI generates a "Market Landscape" report (Positioning, Gaps).
4.  **Display**: Updates the Founder Dashboard.

## 4. Business Rules
*   **PII Masking**: AI must not receive PII. Pre-processing must scrub names/emails.
*   **Hallucination Check**: Critical insights (like "Competitor is shutting down") might need human flag or confidence scores.
*   **Cost Control**: Use batching to reduce prompt overhead. Implement daily token caps.

## 5. Domain Features (Detailed)

### FR16: Pain Point Extraction
*   **Input**: Negative reviews, specific ad hooks.
*   **Output**: List of specific user problems (e.g., "App crashes on login", "Too expensive").

### FR17: Creative Angle Analysis
*   **Input**: Ad transcripts.
*   **Logic**: Identify the "Hook" (first 3s), the "Body" (Problem/Solution), and "CTA".
*   **Output**: Classification of ad strategy (e.g., "UGC style", "Founder story", "Direct offer").

### FR18: Feature Gap Analysis
*   **Input**: "What's New" logs, Positive reviews of competitors.
*   **Comparison**: Contrast with "My App" features.
*   **Output**: Missing high-value features.

### FR19: Market Landscape Analysis (Reasoning Engine)
*   **Function**: High-level strategic synthesis.
*   **Output**: Market Maturity, Competitor Matrix (Leader vs Challenger), Strategic Opportunites.

### FR20: Sentiment & Topic Modeling
*   **Function**: Cluster reviews/comments into Topics (e.g., "Pricing", "UX", "Bug"). Assign sentiment score to each cluster.
