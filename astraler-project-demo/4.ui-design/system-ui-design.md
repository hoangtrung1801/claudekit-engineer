# System UI Design Document

> [!NOTE]
> This document defines the global design system, layout, and component standards for the Competitor Video Analysis System. All domain interfaces must adhere to these guidelines to ensure consistency.

---

## ⚠️ CRITICAL: Reference Theme is the Single Source of Truth

> [!CAUTION]
> **ALL frontend development MUST follow the reference theme exactly.** Do not create custom designs.

### Reference Theme Location
```
references/themes/demo-website-v2/
├── App.tsx                    # App structure, routing
├── index.tsx                  # Entry point  
├── index.html                 # HTML + CDN CSS imports
├── components/
│   ├── Sidebar.tsx            # ⭐ Navigation component
│   ├── Header.tsx             # ⭐ Top bar component
│   ├── RightPanel.tsx         # Right sidebar
│   ├── LoginScreen.tsx        # Auth page
│   ├── ProjectsScreen.tsx     # Projects list
│   ├── ProjectDashboard.tsx   # Project overview
│   ├── *Screen.tsx            # Other page components
│   └── cards/                 # Reusable card components
└── data/                      # Demo data structure
```

### What to Copy from Reference Theme

| Aspect | Where to Find | How to Use |
|--------|---------------|------------|
| **CSS Classes** | Any `*.tsx` file | Copy TailwindCSS classes exactly as-is |
| **Color Palette** | Component `className` | Use same `indigo-`, `violet-`, `emerald-` colors |
| **Spacing/Sizing** | Component `className` | Match `p-4`, `p-6`, `gap-4`, `rounded-xl` patterns |
| **Layout Grid** | `Sidebar.tsx`, `App.tsx` | Replicate flex/grid structure |
| **Card Designs** | `cards/*.tsx` | Use same shadows, borders, padding |
| **Typography** | Throughout components | Match font sizes, weights |
| **Icons** | Material Symbols usage | Same icon names and sizes |
| **Hover Effects** | Button/link styles | Copy transition classes |

### Development Workflow
1. **Run theme locally**: `cd references/themes/demo-website-v2 && npm run dev`
2. **Find similar UI**: Browse the running demo to find closest matching component
3. **Inspect source**: Open the component's `.tsx` file
4. **Extract styles**: Copy the className patterns and structure
5. **Adapt for your use**: Keep visual style, change only the data/logic

### Rules
- ✅ Copy CSS classes from reference components
- ✅ Follow the same component structure patterns  
- ✅ Use the same color variables and spacing scale
- ❌ Do NOT create new color schemes
- ❌ Do NOT invent new component styles
- ❌ Do NOT use different icon libraries
- ❌ Do NOT modify the established visual language

---

## 1. Design Principles

*   **Data-Centric but Clean**: The interface deals with high-density data (video metrics, analysis keywords). Use whitespace effectively to prevent clutter.
*   **Action-Oriented**: Key actions (Add Competitor, Run Analysis) should be prominent and accessible.
*   **Professional & Modern**: Use a sleek, trustworthy aesthetic suitable for business intelligence tools.
*   **Feedback-Rich**: Asynchronous tasks (crawling, analysis) are core to the system. Provide clear status indicators, progress bars, and toast notifications.

## 2. Color Palette & Typography

### 2.1. Color Palette

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `Indigo` | `#6366F1` (Indigo-500) | Primary actions, branding, active states |
| **Secondary** | `Violet` | `#8B5CF6` (Violet-500) | Secondary accents, gradients, creative elements |
| **Success** | `Emerald` | `#10B981` (Emerald-500) | Success states, growth trends, verified items |
| **Warning** | `Amber` | `#F59E0B` (Amber-500) | Warnings, "Needs Review", medium impact |
| **Danger** | `Rose` | `#F43F5E` (Rose-500) | Destructive actions, negative trends, high impact |
| **Background** | `Slate Light` | `#F8FAFC` (Slate-50) | App background |
| **Surface** | `White` | `#FFFFFF` | Cards, modals, input backgrounds |
| **Text** | `Slate Dark` | `#1E293B` (Slate-800) | Headings, primary text |
| **Subtext** | `Slate Gray` | `#64748B` (Slate-500) | Secondary text, labels |

### 2.2. Typography

*   **Font Family**: `Inter` (Google Fonts), sans-serif.
*   **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold).
*   **Scale**:
    *   **H1**: 24px/32px (Page Titles)
    *   **H2**: 20px/28px (Section Headers)
    *   **H3**: 16px/24px (Card Headers)
    *   **Body**: 14px/20px (Standard Text)
    *   **Small**: 12px/16px (Metadata, Labels)

## 3. Layout Structure

The application uses a **Persistent Sidebar Layout**.

### 3.1. Sidebar (Left, Fixed)
*   **Width**: 250px (Desktop), Collapsed Icon View (Tablet), Drawer (Mobile)
*   **Elements**:
    *   **Logo Area**: Branding at top.
    *   **Navigation Menu**: Dashboard, Projects, Reports, Settings.
    *   **Quick Actions**: "+ New Project" button.
    *   **User Profile**: Bottom align (Avatar + Name).

### 3.2. Header (Top, Sticky)
*   **Height**: 64px
*   **Elements**:
    *   **Breadcrumbs**: Navigation path (e.g., Projects > Project A).
    *   **Project Context Switcher**: Dropdown to switch active project globally.
    *   **Global Search**: Search bar for active project content.
    *   **Notification Bell**: Alerts trigger.

### 3.3. Main Content Area
*   **Padding**: 24px
*   **Background**: #F8FAFC
*   **Structure**:
    *   **Page Header**: Title + Page-level Actions (Buttons).
    *   **Content Grid**: 12-column grid system for cards and widgets.

## 4. Component Standards

> [!NOTE]
> We utilize a **Custom Component Library** built with React + TailwindCSS. Refer to `component-library.md` for the list of available reusable components.

### 4.1. General Guidelines
*   **Buttons**: Use `Button` component (Primary/Secondary variants).
*   **Tables**: Use `TableOne`, `TableTwo`, or `TableThree` base.
*   **Cards**: All content must be wrapped in standard `Card` containers with white bg and shadow-sm.

## 5. Accessibility Standards (WCAG)

### 5.1. Requirements
*   **Contrast**: Text must meet 4.5:1 ratio (Slate-700 on White meets this).
*   **Focus**: All interactive elements must have visible focus rings (`ring-primary`).
*   **Alt Text**: All images/charts must have `alt` or `aria-label`.

### 5.2. Screen Readers
*   **Status Changes**: Use `aria-live="polite"` for dynamic feed updates.
*   **Forms**: All inputs must have associated `<label>` tags.

## 6. Feedback & States

### 6.1. Loading States
*   **Skeleton**: Use for initial data fetch (Cards, Charts).
*   **Spinner**: Inside buttons during API actions.
*   **Progress**: Use Top-bar progress (NProgress) for route transitions.

### 6.2. Error States
*   **Inline**: Red text + Icon below input fields.
*   **Global**: Toast notification (Top-Right) for system errors.
*   **Empty**: Use `Illustration` component with clear CTA when no data exists.

## 7. Responsive Strategy
*   **Desktop**: Full Sidebar.
*   **Tablet**: Iconic Sidebar (Collapsed).
*   **Mobile**: Drawer Sidebar (Hamburger).
*   **Charts**: Auto-resize or switch to "Summary List" on mobile.

## 8. Technology Integration
*   **Framework**: React (Vite).
*   **Icons**: Google Material Symbols.
*   **Charts**: ApexCharts.

