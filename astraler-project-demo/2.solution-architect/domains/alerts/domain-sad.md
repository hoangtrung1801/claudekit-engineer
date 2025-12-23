# Domain SAD: Alerts

## 1. Architecture Overview
The **Alerts Domain** acts as a reliable notification delivery system. It decouples "Analysis" from "Delivery", ensuring that insights reach users regardless of the channel (Slack, Email, Telegram).

## 2. Component Design

### 2.1. Event Listener
*   **Role**: Listens for system-wide meaningful events.
*   **Subscriptions**: `HeroVideoDetected`, `CompetitorCreated`, `AnalysisCompleted`, `QuotaExceeded`.

### 2.2. Notification Dispatcher
*   **Role**: Routes notifications to configured channels.
*   **Channels**:
    *   **Slack**: Webhook integration (Priority).
    *   **Telegram**: Bot API (Priority).
    *   **Email**: (Phase 3/Future).
    *   **In-App**: Save to `notifications` table.

### 2.3. Anti-Spam (Throttle)
*   **Logic**: Prevent flood. If `last_alert_time[user][type] < 10 mins`, debounce or group.

## 3. Data Flow
1.  **Trigger**: `Redis PubSub` receives `HeroVideoDetected`.
2.  **Filter**: Check system-level config (enabled alert types / routing rules).
3.  **Format**: Convert event payload to human-readable message (Markdown).
4.  **Send**: Call external API (Slack/Email).
5.  **Log**: Record in `notifications` table.

## 4. Database Schema Support
*   `notifications` (id, user_id, message, read_status) for in-app history/audit.
*   System-level channel configuration is managed by the Admin/System config module (not per-user).
