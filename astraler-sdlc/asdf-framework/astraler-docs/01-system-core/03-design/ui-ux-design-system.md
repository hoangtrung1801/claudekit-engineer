# UI/UX Design System

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## 1. Design Principles

### Core Values

1. **Clarity over Cleverness** - Users should never guess what something does
2. **Progressive Disclosure** - Show only what's needed, when needed
3. **Forgiveness** - Allow undo, confirm destructive actions
4. **Consistency** - Same action = same result everywhere
5. **Speed** - Perceived performance matters as much as actual

### Accessibility Standards

- WCAG 2.1 AA compliance minimum
- Color contrast ratio: 4.5:1 for text, 3:1 for UI
- All interactive elements keyboard accessible
- Screen reader compatible (ARIA labels)

---

## 2. Visual Foundation

### 2.1 Color Palette

#### Primary Colors
```css
--primary-50:  #eff6ff;  /* Backgrounds */
--primary-100: #dbeafe;  /* Hover states */
--primary-500: #3b82f6;  /* Primary actions */
--primary-600: #2563eb;  /* Primary hover */
--primary-700: #1d4ed8;  /* Active states */
```

#### Semantic Colors
```css
--success-500: #22c55e;  /* Success states */
--warning-500: #f59e0b;  /* Warnings */
--error-500:   #ef4444;  /* Errors */
--info-500:    #06b6d4;  /* Information */
```

#### Neutral Colors
```css
--gray-50:  #f9fafb;  /* Page backgrounds */
--gray-100: #f3f4f6;  /* Card backgrounds */
--gray-200: #e5e7eb;  /* Borders */
--gray-500: #6b7280;  /* Secondary text */
--gray-700: #374151;  /* Primary text */
--gray-900: #111827;  /* Headings */
```

#### Dark Mode
```css
--dark-bg:      #0f172a;  /* Page background */
--dark-surface: #1e293b;  /* Card background */
--dark-border:  #334155;  /* Borders */
--dark-text:    #f1f5f9;  /* Primary text */
```

### 2.2 Typography

#### Font Family
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

#### Type Scale
| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| h1 | 36px | 700 | 1.2 | Page titles |
| h2 | 30px | 600 | 1.25 | Section headers |
| h3 | 24px | 600 | 1.3 | Card titles |
| h4 | 20px | 500 | 1.4 | Subsections |
| body | 16px | 400 | 1.5 | Body text |
| small | 14px | 400 | 1.5 | Captions, labels |
| xs | 12px | 500 | 1.4 | Badges, tags |

### 2.3 Spacing System

```css
--space-1:  4px;   /* Tight spacing */
--space-2:  8px;   /* Compact elements */
--space-3:  12px;  /* Default gap */
--space-4:  16px;  /* Standard padding */
--space-5:  20px;  /* Section gaps */
--space-6:  24px;  /* Card padding */
--space-8:  32px;  /* Major sections */
--space-10: 40px;  /* Page margins */
--space-12: 48px;  /* Hero spacing */
```

### 2.4 Border Radius

```css
--radius-sm:   4px;   /* Buttons, inputs */
--radius-md:   8px;   /* Cards, dropdowns */
--radius-lg:   12px;  /* Modals, panels */
--radius-xl:   16px;  /* Feature cards */
--radius-full: 9999px; /* Pills, avatars */
```

### 2.5 Shadows

```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 4px 6px rgba(0,0,0,0.07);
--shadow-lg:  0 10px 15px rgba(0,0,0,0.1);
--shadow-xl:  0 20px 25px rgba(0,0,0,0.15);
```

---

## 3. Component Library

### 3.1 Buttons

| Variant | Usage | States |
|---------|-------|--------|
| **Primary** | Main actions (Submit, Save) | default, hover, active, disabled, loading |
| **Secondary** | Alternative actions | default, hover, active, disabled |
| **Outline** | Tertiary actions | default, hover, active, disabled |
| **Ghost** | Inline actions | default, hover, active, disabled |
| **Destructive** | Delete, Cancel | default, hover, active, disabled |

**Sizing:**
- `sm`: 32px height, 12px padding
- `md`: 40px height, 16px padding (default)
- `lg`: 48px height, 20px padding

### 3.2 Form Elements

#### Text Input
```
┌─────────────────────────────────┐
│ Label                           │
├─────────────────────────────────┤
│ Placeholder text                │
├─────────────────────────────────┤
│ Helper text or error message    │
└─────────────────────────────────┘
```

**States:** default, focus, error, disabled, readonly

#### Select
- Single select with search
- Multi-select with chips
- Async loading for large datasets

#### Checkbox & Radio
- Custom styled, accessible
- Support for indeterminate state (checkbox)
- Group layouts (vertical, horizontal)

### 3.3 Feedback Components

#### Toast Notifications
- Position: top-right
- Duration: 5s (info), 8s (error)
- Actions: dismiss, action button
- Stacking: max 3 visible

#### Alerts
- Inline contextual messages
- Variants: info, success, warning, error
- Optional: dismiss, action

#### Loading States
- Spinner: small inline operations
- Skeleton: page/section loading
- Progress bar: determinate operations

### 3.4 Navigation

#### Top Navigation
- Logo left
- Primary nav center (desktop)
- User menu right
- Mobile: hamburger menu

#### Sidebar (Admin)
- Collapsible
- Nested navigation
- Active state indicator
- Keyboard navigation

#### Breadcrumbs
- Max 4 levels visible
- Truncate middle on overflow

### 3.5 Data Display

#### Tables
- Sortable columns
- Row selection
- Pagination (10/25/50/100)
- Responsive: card view on mobile

#### Cards
- Consistent padding (24px)
- Optional: header, footer, actions
- Hover state for clickable cards

---

## 4. Layout Patterns

### 4.1 Page Structure

```
┌─────────────────────────────────────────────────┐
│                   TOP NAV                       │
├─────────────────────────────────────────────────┤
│         │                                       │
│         │                                       │
│ SIDEBAR │           MAIN CONTENT                │
│ (240px) │                                       │
│         │                                       │
│         │                                       │
├─────────────────────────────────────────────────┤
│                   FOOTER                        │
└─────────────────────────────────────────────────┘
```

### 4.2 Responsive Breakpoints

```css
--breakpoint-sm:  640px;   /* Mobile landscape */
--breakpoint-md:  768px;   /* Tablet */
--breakpoint-lg:  1024px;  /* Desktop */
--breakpoint-xl:  1280px;  /* Large desktop */
--breakpoint-2xl: 1536px;  /* Extra large */
```

### 4.3 Grid System

- 12-column grid
- Gutter: 24px (desktop), 16px (mobile)
- Max container width: 1280px
- Fluid margins below max width

---

## 5. Interaction Patterns

### 5.1 Micro-interactions

| Action | Animation | Duration |
|--------|-----------|----------|
| Button click | Scale 0.98 | 100ms |
| Hover | Opacity/color | 150ms |
| Page transition | Fade | 200ms |
| Modal open | Slide up + fade | 250ms |
| Dropdown | Slide down | 150ms |
| Toast appear | Slide in right | 300ms |

### 5.2 Loading Behavior

1. **Optimistic Updates** - Show success, rollback on failure
2. **Skeleton Loaders** - For content that takes > 300ms
3. **Progressive Loading** - Load critical content first
4. **Stale While Revalidate** - Show cached, update in background

### 5.3 Error Handling

| Error Type | UI Response |
|------------|-------------|
| Validation | Inline field error |
| API Error | Toast notification |
| Network Error | Full-page retry state |
| Auth Error | Redirect to login |
| 404 | Custom 404 page |
| 500 | Friendly error page |

---

## 6. Iconography

### Icon Set
- Primary: Lucide Icons
- Size: 16px (inline), 20px (buttons), 24px (standalone)
- Stroke width: 2px

### Common Icons

| Action | Icon |
|--------|------|
| Add | Plus |
| Edit | Pencil |
| Delete | Trash-2 |
| Search | Search |
| Close | X |
| Menu | Menu |
| Settings | Settings |
| User | User |
| Logout | LogOut |
| Success | CheckCircle |
| Error | XCircle |
| Warning | AlertTriangle |

---

## 7. Motion Guidelines

### Timing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Duration Scale
- Instant: 0ms (state changes)
- Fast: 100ms (micro-interactions)
- Normal: 200ms (transitions)
- Slow: 300ms (modals, pages)
- Deliberate: 500ms (celebrations)

---

## 8. Implementation Notes

### CSS Framework
- Tailwind CSS v3.4+
- Custom theme via `tailwind.config.js`
- CSS variables for runtime theming

### Component Library
- shadcn/ui as base
- Custom components extend shadcn primitives
- Storybook for documentation

### Asset Management
- SVG icons via Lucide React
- Images via Next.js Image component
- Optimized formats: WebP, AVIF

---

**Cross-References:**
- Master Map: `01-architecture/master-map.md`
- Coding Standards: `02-standards/coding-standards.md`
- Component Library: `03-design/component-library.md`
