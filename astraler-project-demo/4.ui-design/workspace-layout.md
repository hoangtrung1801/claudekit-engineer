# Project Workspace UI Layout

> [!NOTE]
> **Purpose**: Define the navigation structure for a Project as a complete "Workspace" with Internal (Astraler's own marketing platform) and External (competitor intelligence) sections.
> 
> **Important**: 
> - **INTERNAL Section**: Astraler's own marketing operations - managing Astraler's own social channels, video ads, and video organic content. **Completely separate** from competitor tracking.
> - **EXTERNAL Section**: Competitor intelligence - tracking and analyzing competitor data. **Completely separate** from Astraler's own operations.
> - These two sections are **independent business domains** with no data overlap.

## 1. Workspace Navigation Structure

### 1.1. Sidebar Navigation (Within Project)

```
📊 Overview (Dashboard)
─────────────────────────
📱 INTERNAL (Astraler Marketing Platform)
   ├── Info
   ├── ASO
   ├── Social (✨ New - Astraler's own social channels)
   └── Marketing (✨ New - Marketing performance dashboard)
─────────────────────────
🔍 EXTERNAL (Competitor Intelligence)
   ├── Competitors
   ├── Landing Pages     (✨ New)
   ├── What's New        (✨ New)
   ├── Social            (✨ New)
   ├── Video Ads         (✨ New)
   ├── Video Organic     (✨ New)
   └── Reviews
─────────────────────────
🧠 INSIGHTS
   └── AI Insights       (✨ New)
```

### 1.2. Route Structure

| Section | Page | Route |
|---------|------|-------|
| Overview | Dashboard | `/projects/{id}/` |
| Internal | Info | `/projects/{id}/info` |
| Internal | ASO | `/projects/{id}/aso` |
| Internal | Social | `/projects/{id}/social` |
| Internal | Marketing | `/projects/{id}/marketing` |
| External | Competitors | `/projects/{id}/competitors` |
| External | Landing Pages | `/projects/{id}/landing-pages` |
| External | What's New | `/projects/{id}/whats-new` |
| External | Social | `/projects/{id}/social` |
| External | Video Ads | `/projects/{id}/video-ads` |
| External | Video Organic | `/projects/{id}/video-organic` |
| External | Reviews | `/projects/{id}/reviews` |
| Insights | AI Insights | `/projects/{id}/ai-insights` |

## 2. Workspace Layout Component

```
WorkspaceLayout
├── TopBar
│   ├── Project Selector (Dropdown to switch projects)
│   ├── Project Icon + Name
│   └── Actions (Settings, Notifications)
├── Sidebar (Workspace Navigation)
│   ├── Section: Overview
│   ├── Section Group: INTERNAL
│   │   ├── NavItem: Info
│   │   ├── NavItem: ASO
│   │   └── NavItem: Marketing
│   ├── Section Group: EXTERNAL
│   │   ├── NavItem: Competitors
│   │   ├── NavItem: What's New
│   │   ├── NavItem: Social
│   │   ├── NavItem: Video Ads
│   │   ├── NavItem: Video Organic
│   │   └── NavItem: Reviews
│   ├── Section Group: INSIGHTS
│   │   └── NavItem: AI Insights
│   └── Bottom: Settings Link
└── Main Content Area
    └── {Current Page Component}
```

## 3. Visual Design

### 3.1. Section Headers
- **INTERNAL**: Indigo accent (`#6366F1`)
- **EXTERNAL**: Violet accent (`#8B5CF6`)
- **INSIGHTS**: Emerald accent (`#10B981`)

### 3.2. Icons
| Page | Icon |
|------|------|
| Overview | `LayoutDashboard` |
| Info | `Info` |
| ASO | `Search` |
| Marketing | `TrendingUp` |
| Competitors | `Users` |
| What's New | `Bell` |
| Social | `Share2` |
| Video Ads | `AdsClick` |
| Video Organic | `Video` |
| Reviews | `MessageSquare` |
| AI Insights | `BrainCircuit` |
