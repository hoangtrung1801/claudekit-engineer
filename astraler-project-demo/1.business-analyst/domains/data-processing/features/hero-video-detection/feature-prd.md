# Feature PRD: Hero Video Detection

## 1. Feature Overview
**Hero Video Detection** is the system's ability to swiftly identify a competitor's video ad or organic video that is "Going Viral". This is the primary signal for the Marketing team to study a creative concept.

## 2. Business Context
In performance marketing, speed is everything. If a competitor finds a winning creative angle today, we need to know tomorrow, not next week. The "Hero" status is defined by *Velocity* (speed of growth), not just total views.

## 3. Algorithm Logic
**Hero Definition**: A video is "Hero" if:
$$ GrowthRate_{24h} = \frac{Metrics_{now} - Metrics_{24h\_ago}}{Metrics_{24h\_ago}} \ge 20\% $$
*AND*
$$ AbsoluteGrowth_{view} \ge 10,000 $$ (To avoid false positives on small videos going from 10 to 20 views).

## 4. User Flows

### 4.1. Detection & Alert Flow
1.  **Crawler** updates video metrics (Views, Likes).
2.  **Processor** compares new metrics with previous snapshot.
3.  **Condition Check**: Metric delta breaks threshold.
4.  **Tagging**: Video marked as `is_hero = true` in DB.
5.  **Notification**: "New Hero Video Found!" sent to Slack.
6.  **Feed Update**: Video appears at top of "Global Trending Feed" in Marketing Dashboard.

## 5. Acceptance Criteria

### AC1: Growth Calculation
*   System must store historical snapshots of metrics (at least 1 per 24h).
*   Calculation must handle "Divide by Zero" (new videos with 0 previous views).

### AC2: Threshold Configuration
*   The 20% threshold should be a configurable constant `HERO_GROWTH_THRESHOLD` per Project (default 20%).

### AC3: Alerting
*   When a video becomes Hero, an alert MUST be sent within 15 minutes of detection (assuming crawler runs every 4h).

## 6. Test Scenarios

### TS1: New Viral Video
*   Mock video V1. T0: 100k views. T1 (4h later): 150k views (50% growth).
*   Assert: V1 marked as Hero. Alert sent.

### TS2: Old Stable Video
*   Mock video V2. T0: 1M views. T1: 1.01M views (1% growth).
*   Assert: V2 NOT marked as Hero.

### TS3: Fresh Video (Cold Start)
*   Mock video V3. T0: Does not exist. T1: 50k views.
*   Assert: V3 marked as Hero (Infinite growth implies Viral).
