# Feature PRD: Pain Point Extraction (AI)

## 1. Feature Overview
**Pain Point Extraction** uses LLMs to read user reviews and ad comments, identifying specific, actionable problems users have with competitor apps (e.g., "Hidden fees", "Login bugs").

## 2. Business Context
Product Managers use this to find "Gaps". If a competitor has 500 reviews saying "Too expensive", that's an opportunity. Manually reading 500 reviews is impossible.

## 3. Algorithm / AI Logic

### 3.1. Input Preparation
*   Filter reviews: `Rating <= 3` (Negative sentiment focus).
*   Filter Ad Comments: Keywords like "Scam", "Broken", "Help".
*   Batching: Group 50 reviews into one Prompt.

### 3.2. Prompt Engineering Strategy
*   **Role**: "You are a UX Researcher."
*   **Task**: "Extract specific problems. Ignore generic insults. Group similar issues."
*   **Output Format**: JSON list `[{ "issue": "App crashes on iOS 16", "frequency": "High", "sentiment": "Angry" }]`.

## 4. Acceptance Criteria

### AC1: Accuracy
*   AI must NOT hallucinate features that don't exist.
*   Must deduplicate: "Crash on launch" and "App won't open" should be grouped.

### AC2: Performance
*   Process 1000 reviews in < 2 minutes (using parallel batches).

### AC3: Display
*   Show as a "Pain Point Map" (Bubble chart or Ranked List) in Dashboard.

## 5. Test Scenarios
*   **TS1**: Input 10 reviews mentions "Login error". Output should show "Login Error" count = 10.
*   **TS2**: Input Mixed languages. AI should translate/standardize to English (System Language).
