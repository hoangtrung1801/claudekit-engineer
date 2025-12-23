# Page Structure Reference

> [!NOTE]
> **Architecture**: Project pages follow a 3-Tier Navigation structure: **INTERNAL**, **EXTERNAL**, and **INSIGHTS**.
> See `workspace-layout.md` for navigation details.

---

# Authentication

## 0. Login (`/login`)
```
CenteredLayout (Gradient Background)
 └── Login Card (White, Centered)
      ├── Logo: CompetitorIQ
      ├── Title: "Welcome back"
      ├── Login Form
      │    ├── Email Input
      │    ├── Password Input (with toggle)
      │    ├── Remember Me Checkbox
      │    └── Forgot Password Link
      ├── Submit Button: "Sign In" (Primary, Full-width)
      ├── Divider: "Or continue with" (Optional)
      ├── Social Login Buttons (Optional)
      └── Footer: "Don't have an account? Contact admin"
```

---

# Global Pages

## 1. Projects List (`/projects`)
```
DefaultLayout
 ├── Header
 └── Main Content
      ├── PageHeader (Actions: "Create Project")
      └── TableThree (Project List)
           ├── Columns: Icon, Name, Competitors Count, Status, Actions
           └── EmptyState (Illustration) -- if count == 0
```

## 2. Global Settings (`/settings`)
```
DefaultLayout
 ├── Sidebar (Settings Navigation)
 └── Main Content
      └── Tabs
           ├── Tab: Profile
           ├── Tab: API Keys
           ├── Tab: Billing
           └── Tab: Notifications (Slack/Telegram)

## 2.1. System Admin (`/admin`)
```
DefaultLayout
 ├── Sidebar (Admin Nav)
 │    ├── System Logs
 │    └── Metrics
 └── Main Content
      ├── Logs Table (Filter by Level/Component)
      └── Metrics Dashboard (Job Queues, API Counters)
```
```

---

# Project Workspace Pages

> All pages below use `WorkspaceLayout` with project-scoped sidebar navigation.

## 3. Overview / Dashboard (`/projects/{id}`)
```
WorkspaceLayout
 └── Main Content
      ├── Stats Cards (CardDataStats × 4)
      │    ├── Total Views
      │    ├── Hero Videos
      │    ├── Active Competitors
      │    └── Budget Usage
      ├── Charts Row
      │    ├── Trend Chart (ChartOne - Area)
      │    └── Market Share (ChartThree - Donut)
      └── Hero Video Feed (VideoFeedCard[])
```

---

# INTERNAL Section (Own App)

## 4. Info (`/projects/{id}/info`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "Project Info")
      ├── Project Details Card
      │    ├── Name Input, Icon Upload
      │    ├── Store URLs (iOS/Android)
      │    └── Goals Tag Input
      └── Metadata Card (Read-only from Store)
           ├── App Name, Bundle ID, Developer, Category, Rating
           └── Action: "Refresh from Store"
```

## 5. ASO (`/projects/{id}/aso`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "App Store Optimization", Actions: "Export")
      ├── Keyword Tracking Card
      │    ├── Add Keyword Input
      │    └── Keywords Table (Rank, Change, Volume, Traffic Share)
      └── Metadata Changes Timeline
           └── Timeline of icon/screenshot/text updates
```

## 6. Social (`/projects/{id}/social`) - Internal Project Social Management
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "Social Channels", Actions: "Add Channel")
      ├── Summary Stats Cards (x4)
      │    ├── Total Channels (project-linked + competitor-linked)
      │    ├── My Channels (project-linked only)
      │    ├── Total Followers (sum across all channels)
      │    └── Average Growth Rate (last 30 days)
      ├── Filter Toggle
      │    ├── "My Channels" (project-linked)
      │    └── "Competitor Channels" (competitor-linked)
      ├── Social Channels Grid/List
      │    └── ChannelCard[] (with stats, growth indicators)
      ├── Growth Trends Section
      │    ├── Combined Followers Growth Chart (Line)
      │    ├── Growth Rate by Platform (Bar)
      │    └── Top Growing Channels Table
      └── Add Channel Modal (triggered by "Add Channel" button)
```

## 6.1. Marketing (`/projects/{id}/marketing`) - Marketing Performance Dashboard
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "Marketing Performance")
      ├── Executive Summary Cards (x4)
      │    ├── Total Social Channels (count of project-linked channels)
      │    ├── Video Ads Running (count of VideoAds from project's social channels)
      │    ├── Video Organic Published (count of VideoOrganic from project's social channels)
      │    └── Total Followers Growth (sum of followers across all project channels, % change)
      ├── Social Channels Overview
      │    ├── Quick Stats: Channels count, Total followers, Growth rate
      │    └── Link to Social page: "View All Channels →"
      ├── Video Performance Section
      │    ├── Video Ads Summary
      │    │    ├── Total Ads: Count
      │    │    ├── Active Ads: Count (status = ACTIVE)
      │    │    ├── Total Impressions: Sum
      │    │    └── Link to Video Ads page: "View All Ads →"
      │    └── Video Organic Summary
      │         ├── Total Videos: Count
      │         ├── Total Views: Sum
      │         ├── Total Engagement: Sum (likes + comments + shares)
      │         └── Link to Video Organic page: "View All Videos →"
      ├── Growth Trends Charts
      │    ├── Followers Growth Over Time (Line chart - all project channels)
      │    ├── Video Ads Performance (Impressions over time)
      │    └── Video Organic Performance (Views over time)
      └── Recent Activity Feed
           ├── Latest social channel updates
           ├── Latest video ads discovered
           └── Latest video organic published
```

---

# EXTERNAL Section (Competitors)

## 7. Competitors (`/projects/{id}/competitors`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Actions: "Add Competitor via URL")
      └── Competitor Tracking Table
           ├── Columns: App, Version, Last Update, Social Channels, Video Count
           └── Actions: Add Landing Page, Manage, Delete
```

## 8. What's New (`/projects/{id}/whats-new`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "What's New")
      ├── Summary Stats (CardDataStats × 3)
      │    ├── Total Updates
      │    ├── High Impact Count
      │    └── Most Active Competitor
      ├── Filter Bar
      │    ├── Competitor Selector
      │    ├── Time Period (7d/30d/90d)
      │    ├── Update Type Chips
      │    └── Impact Level Chips
      └── Update Timeline
           ├── Date Header (grouped by date)
           └── Update Card
                ├── Competitor Logo + Name
                ├── Type Badge (App Update/Content/Policy)
                ├── Impact Badge (High/Medium/Low)
                ├── Version Change
                ├── Description + AI Insight
                └── Action: "View Details"
```

## 9. Social (`/projects/{id}/social`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "Social Channels", Actions: "Add Channel")
      ├── Summary Stats (CardDataStats × 3)
      │    ├── Total Channels
      │    ├── Fastest Growing
      │    └── Most Engaged
      ├── Platform Tabs (All / TikTok / YouTube / Instagram / Facebook)
      ├── Growth Signals Section
      │    ├── Fast Growing Channels
      │    ├── Viral Content Alerts
      │    └── New Channels
      └── Channels Grid
           └── Channel Card
                ├── Competitor Logo + Name
                ├── Platform Icon + Handle
                ├── Followers + Growth Rate
                ├── Engagement Rate
                └── Status Badge
```

## 10. Video Ads (`/projects/{id}/video-ads`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "Video Ads", Actions: "Filter", "Export")
      ├── Summary Stats (CardDataStats × 3)
      │    ├── Total Video Ads
      │    ├── Active Advertisers
      │    └── Total Impressions
      ├── Filters: Competitor, Platform, Advertiser, Date Range
      └── Video Ads Table
           └── Video Ad Row
                ├── Thumbnail
                ├── Advertiser + Platform
                ├── Title/Description
                ├── Impressions, Spend
                ├── Published Date
                └── Actions: View, Analyze
```

## 11. Video Organic (`/projects/{id}/video-organic`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "Video Organic", Actions: "Filter", "Export")
      ├── Hero Video Spotlight (Top Performing Creative)
      ├── Summary Stats (CardDataStats × 3)
      │    ├── Total Videos
      │    ├── Hero Videos Count
      │    └── Total Views
      ├── Filters: Competitor, Platform, Hero-Only, Date
      └── Video Masonry Grid
           └── Video Card: Thumbnail, Metrics, Hero Badge, "Analyze" Button
```

## 11. Reviews (`/projects/{id}/reviews`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader
      ├── Sentiment Summary (Positive/Neutral/Negative Bar)
      ├── Pain Point Cloud (Word Cloud / Heatmap)
      └── Review Stream List
           ├── Review Text, Rating, Detected Pain Points
           └── Filter by Sentiment/Keyword
```

---

# INSIGHTS Section

## 12. AI Insights (`/projects/{id}/ai-insights`)
```
WorkspaceLayout
 └── Main Content
      ├── PageHeader (Title: "Strategic Intelligence")
      ├── Executive Summary (Daily Briefing)
      │    ├── Market Move (Key Event)
      │    ├── Opportunity (Actionable Advice)
      │    └── Viral Alert (Trending Content)
      └── Insight Categories (Tabs/Grid)
           ├── Product Strategy
           ├── Consumer Sentiment
           ├── Content Strategy
           └── Search & Discovery
```

---

# Modals & Overlays

## 12. Create Project Modal
```
Modal
├── Header: "Create New Project"
├── Body: Name Input, Icon Upload, Store URLs
└── Footer: Cancel, Create
```

## 13. Video Player Modal
```
Modal (Large)
├── Header: Video Title
├── Body: Video Player + AI Analysis
└── Footer: Bookmark, Share, Export
```

## 14. Delete Confirmation Modal
```
Modal (Small)
├── Body: Warning + Message
└── Footer: Cancel, Delete
```

## 15. Evidence Drawer
```
Drawer (Right)
├── Header: "Evidence"
├── Body: Evidence List (Scrollable)
└── Footer: Close
```

## 18. Add Landing Page Modal
```
Modal
├── Header: "Add Landing Page"
├── Body: URL Input (Validation for http/https)
└── Footer: Cancel, Add & Scan
```

---

# Error & State Pages

## 16. 404 / 500 Error Pages
```
CenteredLayout
├── Illustration
├── Title & Message
└── Actions: Go Home, Retry
```

## 17. Loading & Empty Patterns
```
Loading: Skeleton / Spinner
Empty: Illustration + Title + CTA
```
