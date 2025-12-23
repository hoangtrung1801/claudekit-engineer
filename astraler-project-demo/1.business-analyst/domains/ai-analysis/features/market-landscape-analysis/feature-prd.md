# Feature PRD: Market Landscape Analysis

## 1. Feature Overview
**Market Landscape Analysis** is an AI-driven feature that generates a strategic overview of the market based on competitor data. It is triggered automatically when a new Project is populated with competitors or manually refreshed. It helps Founders and Product Managers understand where their app fits in the ecosystem.

## 2. Business Context
Founders often spend weeks researching competitors to answer: "What is the standard feature set?", "What are the common complaints?", "Is this market saturated?". This feature uses AI to answer these questions in minutes by synthesizing data from App Store descriptions, reviews, and metadata.

## 3. User Flows

### 3.1. Automatic Trigger Flow
1.  User adds 3+ competitors to the Project.
2.  System detects "Enough Data" threshold.
3.  System triggers `Background Job: Run Market Landscape Analysis`.
4.  Job completes -> Notification sent to Founder/Admin.

### 3.2. View Analysis Flow
1.  User navigates to **Founder Dashboard**.
2.  Locates "Market Landscape" widget.
3.  Views "Summary", "SWOT Analysis", and "Positioning Matrix".
4.  Optionally clicks "Refresh Analysis" if new competitors were added recently.

## 4. Acceptance Criteria

### AC1: Trigger Logic
*   **Assuming**: Project has >= 1 competitor.
*   **When**: User finishes adding competitors.
*   **Then**: Analysis job is queued.

### AC2: Input Data scope
*   AI must use: App Names, Categories, Short/Long Descriptions, Top 20 most helpful reviews per competitor, Average Ratings.

### AC3: Output Content
*   The analysis MUST return a JSON object containing:
    *   `market_maturity` (Low/Medium/High)
    *   `common_pain_points` (List of strings)
    *   `standard_features` (List of strings)
    *   `underserved_needs` (List of strings)
    *   `strategic_recommendation` (Paragraph)

### AC4: UI Display
*   Must render a "SWOT" style grid.
*   Must show a "Refresh" button with "Last updated: [Time]" timestamp.

## 5. Test Scenarios

### TS1: Empty Project
*   Create project, add 0 competitors.
*   Assert: Analysis does NOT run. UI shows "Add competitors to unlock analysis".

### TS2: Standard Run
*   Add 5 fitness apps. Wait for job.
*   Assert: Founder Dashboard displays analysis text. Check for "Pain points" about "Subscription cost" (common in fitness).

### TS3: Error Handling
*   Simulate AI Provider API failure.
*   Assert: UI shows "Analysis failed. Retrying..." and does not crash dashboard.
