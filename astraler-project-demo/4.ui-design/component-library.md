# Custom Component Library

> [!CAUTION]
> **MANDATORY**: All components listed here are from the reference theme at `references/themes/demo-website-v2/`. 
> When building new features, you MUST reference and replicate styles from these existing components.
> **Do NOT design new components from scratch.**

## How to Use This Reference

1. **Find the closest matching component** in the list below
2. **Open the source file** at `references/themes/demo-website-v2/components/`
3. **Copy the structure and CSS classes** into your implementation
4. **Adapt only the data/logic**, keep the visual design intact

---

## 1. Screen Components (Pages)
These components represent full-page views corresponding to specific routes.

| Component | File Path | Responsibility |
| :--- | :--- | :--- |
| `ProjectsScreen` | `components/ProjectsScreen.tsx` | List of all projects. |
| `ProjectDashboard` | `components/ProjectDashboard.tsx` | Main overview for a specific project. |
| `InfoScreen` | `components/InfoScreen.tsx` | Project metadata and settings. |
| `ASOScreen` | `components/ASOScreen.tsx` | App Store Optimization tracking. |
| `MarketingScreen` | `components/MarketingScreen.tsx` | Ad performance and budget analytics. |
| `CompetitorsScreen` | `components/CompetitorsScreen.tsx` | Competitor tracking and management. |
| `WhatsNewScreen` | `components/WhatsNewScreen.tsx` | Timeline of competitor updates. |
| `ChannelsScreen` | `components/ChannelsScreen.tsx` | Social media growth tracking. |
| `VideosLibrary` | `components/VideosLibrary.tsx` | Grid of competitor videos/ads. |
| `ReviewsScreen` | `components/ReviewsScreen.tsx` | User feedback and sentiment analysis. |
| `AIInsightsScreen` | `components/AIInsightsScreen.tsx` | Strategic AI-generated insights. |
| `LoginScreen` | `components/LoginScreen.tsx` | Authentication entry point. |

> 💡 **Tip**: All paths are relative to `references/themes/demo-website-v2/`

## 2. Layout Components
Structural components that define the application shell. **These are critical for consistent page structure.**

| Component | File Path | Responsibility |
| :--- | :--- | :--- |
| `Sidebar` | `components/Sidebar.tsx` | Main navigation menu (Internal, External, Insights). |
| `Header` | `components/Header.tsx` | Top bar with breadcrumbs and actions. |
| `RightPanel` | `components/RightPanel.tsx` | Supplementary information (desktop only). |

> ⚠️ **Important**: When creating new pages, always wrap content with the same layout structure used in existing screens.

## 3. Reusable UI Cards (`components/cards/`)
Specialized display components for data visualization. **Copy these patterns for similar data displays.**

| Component | File Path | Responsibility |
| :--- | :--- | :--- |
| `NewContentCard` | `components/cards/NewContentCard.tsx` | Displays a single content update item. |
| `ReviewsCard` | `components/cards/ReviewsCard.tsx` | Displays user reviews with sentiment. |
| `TrendingCard` | `components/cards/TrendingCard.tsx` | Highlights trending topics or metrics. |
| `VersionUpdateCard` | `components/cards/VersionUpdateCard.tsx` | Shows app version changes and impact. |

## 4. Usage Guidelines

### Styling Rules
- All components use **TailwindCSS** for styling - copy classes directly from source files
- Components are functional and stateless where possible; state is managed by parent pages or context
- Colors follow the `system-ui-design.md` palette (Indigo/Violet/Emerald)

### How to Replicate a Component

```bash
# Step 1: Run the reference theme to see it in action
cd references/themes/demo-website-v2 && npm run dev

# Step 2: Open the component source file
# Example: references/themes/demo-website-v2/components/ProjectDashboard.tsx

# Step 3: Copy the JSX structure and className attributes
# Step 4: Adapt props/data to your use case
```

### Common CSS Patterns to Reuse

| Pattern | Classes | Use For |
|---------|---------|---------|
| Card Container | `bg-white rounded-2xl p-6 shadow-sm` | All card wrappers |
| Primary Button | `bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg` | Main actions |
| Section Header | `text-lg font-semibold text-slate-800` | Section titles |
| Subtle Text | `text-sm text-slate-500` | Metadata, labels |
| Success Badge | `bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs` | Positive status |
| Warning Badge | `bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs` | Warning status |

### ❌ Anti-Patterns to Avoid
- Do NOT create custom color classes like `bg-[#123456]`
- Do NOT use inline styles when TailwindCSS classes exist
- Do NOT introduce new UI component libraries (stick to the theme patterns)
- Do NOT deviate from established spacing (use `p-4`, `p-6`, `gap-4`, `gap-6`)
