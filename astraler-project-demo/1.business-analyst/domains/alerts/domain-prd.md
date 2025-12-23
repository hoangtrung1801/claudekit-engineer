# Domain PRD: Alerts

## 1. Overview
The **Alerts Domain** ensures users don't need to stare at the dashboard 24/7. It pushes critical information to them where they work (Slack, Email, Telegram).

## 2. Business Context
Speed is key. Knowing a competitor launched a "Hero Video" immediately (real-time) allows the marketing team to react instantly.

## 3. User Flows
1.  **Configuration (System-level)**: Admin configures Slack Webhook / Telegram destination once for the system (not per-user).
2.  **Trigger**: System detects event (e.g., Hero Video).
3.  **Delivery**: System delivers notifications to configured channels with deep link to Dashboard.

## 4. Business Rules
*   **Anti-Spam**: Group alerts if multiple happen effectively simultaneously.
*   **Relevance**: Only send alert types enabled in system-level configuration.

## 5. Domain Features (Detailed)

### FR26: Marketing Alerts
*   Hero Video detected, New Ads spike.

### FR27: Product Alerts
*   Competitor Version Update, New Feature detected.

### FR28: ASO Alerts
*   Ranking changes, Review spikes.

### FR29: Founder Alerts
*   Market shifts, New competitor.

### FR30: Manual Review Alerts
*   "Pending Queue is full" warning.
