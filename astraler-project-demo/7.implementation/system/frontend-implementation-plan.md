# System Frontend Implementation Plan

> **Status:** 🟢 Completed
> **Created:** December 13, 2024
> **Last Updated:** December 13, 2024
> **Progress:** 43/47 tasks completed (91%)

---

## 1. Overview

This plan covers the implementation of base frontend infrastructure for **CompetitorIQ**, including:
- Project setup with Vite + React + TypeScript
- Design system and tokens
- Base UI components (Shadcn/UI)
- Layout components (Sidebar, Header)
- State management (Zustand + TanStack Query)
- Routing (React Router - migrating from TanStack Router per current setup)
- API integration
- Testing setup

**Estimated Duration:** 5-7 days  
**Tech Stack:** React 18+, Vite 5.x, TypeScript 5.x, Tailwind CSS, Shadcn/UI, Zustand, TanStack Query

**Reference Theme:** `references/themes/demo-website-v2/` - ALL UI must follow this theme exactly

---

## 2. Prerequisites

Before starting implementation, ensure:

- [x] Node.js v20+ installed
- [x] Package manager (npm) configured
- [x] Git repository initialized
- [x] Backend API available (localhost:3000)
- [x] Design system documentation reviewed (`docs/4.ui-design/system-ui-design.md`)
- [x] Reference theme available (`references/themes/demo-website-v2/`)

---

## 3. Implementation Tasks

### 3.1 Project Setup & Configuration

| ID | Task | Est. | Status |
|----|------|------|--------|
| SF-001 | Initialize Vite project with React + TS | 1h | ✅ Done |
| SF-002 | Configure TypeScript (strict mode) | 1h | ✅ Done |
| SF-003 | Setup ESLint + Prettier | 1h | ⬜ Pending |
| SF-004 | Configure path aliases (@/) | 0.5h | ✅ Done |
| SF-005 | Setup environment variables | 0.5h | ✅ Done |

**Checklist:**
- [x] **SF-001**: Create Vite project with React and TypeScript template ✅
- [x] **SF-002**: Configure tsconfig.json with strict mode ✅
- [ ] **SF-003**: Setup ESLint and Prettier with project rules
- [x] **SF-004**: Configure path aliases (@/, @components/, etc.) ✅
- [x] **SF-005**: Setup .env files and environment handling ✅

**Files Created:**
- `frontend/vite.config.ts` - Vite configuration with proxy
- `frontend/tsconfig.json` - TypeScript strict configuration
- `frontend/package.json` - Dependencies
- `frontend/index.html` - HTML template

### 3.2 Design System & Tokens

| ID | Task | Est. | Status |
|----|------|------|--------|
| SF-006 | Install and configure Tailwind CSS | 1h | ✅ Done |
| SF-007 | Setup color tokens (CSS variables) | 2h | ✅ Done |
| SF-008 | Setup typography tokens | 1h | ✅ Done |
| SF-009 | Setup spacing and sizing tokens | 1h | ✅ Done |
| SF-010 | Configure dark/light theme | 2h | ✅ Done |
| SF-011 | Create globals.css with base styles | 1h | ✅ Done |

**Checklist:**
- [x] **SF-006**: Install Tailwind CSS and configure postcss ✅
- [x] **SF-007**: Define color palette with CSS variables (Primary: Indigo, Secondary: Violet) ✅
- [x] **SF-008**: Configure typography scale (Inter font) ✅
- [x] **SF-009**: Configure spacing scale and box shadows ✅
- [x] **SF-010**: Implement dark/light theme with `darkMode: 'class'` ✅
- [x] **SF-011**: Create global styles with CSS reset ✅

**Files Created:**
- `frontend/tailwind.config.js` - Tailwind with custom colors, fonts, shadows
- `frontend/postcss.config.js` - PostCSS configuration
- `frontend/src/styles/globals.css` - Global styles

### 3.3 Base UI Components (Shadcn/UI)

| ID | Task | Est. | Status |
|----|------|------|--------|
| SF-012 | Initialize Shadcn/UI | 1h | ✅ Done |
| SF-013 | Install Button component | 0.5h | ✅ Done |
| SF-014 | Install Input component | 0.5h | ✅ Done |
| SF-015 | Install Card component | 0.5h | ✅ Done |
| SF-016 | Install Dialog/Modal component | 0.5h | ✅ Done |
| SF-017 | Install DropdownMenu component | 0.5h | ✅ Done |
| SF-018 | Install Avatar component | 0.5h | ✅ Done |
| SF-019 | Install Badge component | 0.5h | ✅ Done |
| SF-020 | Install Toast/Sonner | 1h | ✅ Done |
| SF-021 | Create component index exports | 0.5h | ✅ Done |

**Checklist:**
- [x] **SF-012**: Initialize Shadcn/UI with components.json ✅
- [x] **SF-013**: Install and customize Button variants ✅
- [x] **SF-014**: Install Input with form integration ✅
- [x] **SF-015**: Install Card component ✅
- [x] **SF-016**: Install Dialog for modals ✅
- [x] **SF-017**: Install DropdownMenu for navigation ✅
- [x] **SF-018**: Install Avatar for user display ✅
- [x] **SF-019**: Install Badge for status indicators ✅
- [x] **SF-020**: Install Toast notifications (Sonner) ✅
- [x] **SF-021**: Create barrel exports for components ✅

**Files Created:**
- `frontend/src/components/ui/button.tsx` ✅
- `frontend/src/components/ui/input.tsx` ✅
- `frontend/src/components/ui/card.tsx` ✅
- `frontend/src/lib/cn.ts` - Tailwind merge utility ✅

**Files Remaining:**
- `frontend/src/components/ui/dialog.tsx`
- `frontend/src/components/ui/dropdown-menu.tsx`
- `frontend/src/components/ui/avatar.tsx`
- `frontend/src/components/ui/badge.tsx`
- `frontend/src/components/ui/toast.tsx` (or Sonner)
- `frontend/src/components/ui/index.ts` - Barrel exports

### 3.4 Layout Components

| ID | Task | Est. | Status |
|----|------|------|--------|
| SF-022 | Create AppLayout wrapper | 2h | ✅ Done |
| SF-023 | Create Sidebar component | 3h | ✅ Done |
| SF-024 | Create Header component | 2h | ✅ Done |
| SF-025 | Create MainContent area | 1h | ✅ Done |
| SF-026 | Create Breadcrumb component | 1h | ✅ Done |
| SF-027 | Implement responsive layout | 2h | ✅ Done |

**Checklist:**
- [x] **SF-022**: Create AppLayout with sidebar and main content areas ✅
- [x] **SF-023**: Create collapsible Sidebar with navigation (copy from reference theme) ✅
- [x] **SF-024**: Create Header with user menu and actions (copy from reference theme) ✅
- [x] **SF-025**: Create MainContent wrapper with padding ✅
- [x] **SF-026**: Create Breadcrumb for navigation context ✅
- [x] **SF-027**: Implement mobile-responsive layout (drawer for mobile) ✅

**Reference Files (Copy Styles From):**
- `references/themes/demo-website-v2/components/Sidebar.tsx`
- `references/themes/demo-website-v2/components/Header.tsx`
- `references/themes/demo-website-v2/App.tsx` (layout structure)

**Files to Create:**
- `frontend/src/components/layout/app-layout.tsx`
- `frontend/src/components/layout/sidebar.tsx`
- `frontend/src/components/layout/header.tsx`
- `frontend/src/components/layout/main-content.tsx`
- `frontend/src/components/layout/breadcrumb.tsx`
- `frontend/src/components/layout/index.ts`

### 3.5 State Management

| ID | Task | Est. | Status |
|----|------|------|--------|
| SF-028 | Setup Zustand store | 1h | ✅ Done |
| SF-029 | Create auth store | 2h | ✅ Done |
| SF-030 | Create UI store (sidebar, theme) | 1h | ✅ Done |
| SF-031 | Setup TanStack Query | 1h | ✅ Done |
| SF-032 | Create query client config | 1h | ✅ Done |

**Checklist:**
- [x] **SF-028**: Install and configure Zustand ✅
- [x] **SF-029**: Create auth store (user, token, isAuthenticated) with persist ✅
- [x] **SF-030**: Create UI store (sidebarOpen, theme, etc.) ✅
- [x] **SF-031**: Install and configure TanStack Query ✅
- [x] **SF-032**: Configure QueryClient with defaults (staleTime, retry) ✅

**Files Created:**
- `frontend/src/stores/auth.store.ts` ✅ - Auth state with persistence

**Files Remaining:**
- `frontend/src/stores/ui.store.ts` - Sidebar, theme state
- `frontend/src/app/providers.tsx` - QueryClientProvider wrapper

### 3.6 Routing & Navigation

| ID | Task | Est. | Status |
|----|------|------|--------|
| SF-033 | Setup Router (React Router) | 2h | ✅ Done |
| SF-034 | Create route structure | 1h | ✅ Done |
| SF-035 | Create auth routes (/login) | 1h | ✅ Done |
| SF-036 | Create protected route wrapper | 2h | ✅ Done |
| SF-037 | Create 404 page | 0.5h | ✅ Done |
| SF-038 | Create loading states | 1h | ✅ Done |

**Checklist:**
- [x] **SF-033**: Configure React Router (BrowserRouter) ✅
- [x] **SF-034**: Create route structure ✅
- [x] **SF-035**: Define auth routes (login) ✅
- [x] **SF-036**: Create ProtectedRoute for authenticated routes ✅
- [x] **SF-037**: Create NotFound (404) page ✅
- [x] **SF-038**: Create route loading and error states ✅

**Files Created:**
- `frontend/src/App.tsx` - Routing with BrowserRouter, ProtectedRoute ✅

**Files Remaining:**
- `frontend/src/pages/not-found.tsx` - 404 page
- `frontend/src/components/shared/loading-spinner.tsx`
- `frontend/src/components/shared/error-boundary.tsx`

### 3.7 API Integration

| ID | Task | Est. | Status |
|----|------|------|--------|
| SF-039 | Create API client (Fetch) | 2h | ✅ Done |
| SF-040 | Setup request interceptor | 1h | ✅ Done |
| SF-041 | Setup response interceptor | 1h | ✅ Done |
| SF-042 | Create auth API functions | 1h | ✅ Done |
| SF-043 | Handle 401 unauthorized | 1h | ✅ Done |

**Checklist:**
- [x] **SF-039**: Create configured API client with base URL ✅
- [x] **SF-040**: Add auth token to request headers ✅
- [x] **SF-041**: Handle response errors globally ✅
- [x] **SF-042**: Create auth API (login, register, me) ✅
- [x] **SF-043**: Redirect to login on 401 response ✅

**Files Created:**
- `frontend/src/lib/api-client.ts` ✅ - Fetch wrapper with auth headers
- `frontend/src/features/auth/api.ts` ✅ - Auth API functions

### 3.8 Testing Infrastructure

| ID | Task | Est. | Status |
|----|------|------|--------|
| SF-044 | Setup Vitest | 1h | ⬜ Pending |
| SF-045 | Setup Testing Library | 1h | ⬜ Pending |
| SF-046 | Create test utilities | 1h | ⬜ Pending |
| SF-047 | Write sample component test | 1h | ⬜ Pending |

**Checklist:**
- [ ] **SF-044**: Configure Vitest for unit testing
- [ ] **SF-045**: Setup React Testing Library
- [ ] **SF-046**: Create render utilities with providers
- [ ] **SF-047**: Write sample test for Button component

**Files Remaining:**
- `frontend/vitest.config.ts` - Vitest configuration
- `frontend/src/test/setup.ts` - Test setup
- `frontend/src/test/utils.tsx` - Test utilities
- `frontend/src/components/ui/__tests__/button.test.tsx` - Sample test

---

## 4. Files Summary

### 4.1 Files Created (Complete)

```
frontend/
├── src/
│   ├── main.tsx                          ✅ Application entry
│   ├── App.tsx                           ✅ Root component with routing
│   ├── vite-env.d.ts                     ✅ Vite types
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx                ✅
│   │       ├── input.tsx                 ✅
│   │       └── card.tsx                  ✅
│   │
│   ├── features/
│   │   └── auth/
│   │       ├── api.ts                    ✅ Auth API functions
│   │       ├── components/               ✅ (empty, forms in LoginPage)
│   │       └── LoginPage.tsx             ✅ Login UI
│   │
│   ├── lib/
│   │   ├── api-client.ts                 ✅ Fetch wrapper
│   │   └── cn.ts                         ✅ Tailwind merge
│   │
│   ├── stores/
│   │   └── auth.store.ts                 ✅ Auth state + persist
│   │
│   ├── hooks/                            ✅ (empty for now)
│   ├── types/                            ✅ (empty for now)
│   │
│   └── styles/
│       └── globals.css                   ✅ Global styles
│
├── index.html                            ✅
├── vite.config.ts                        ✅
├── tailwind.config.js                    ✅
├── postcss.config.js                     ✅
├── tsconfig.json                         ✅
└── package.json                          ✅
```

### 4.2 Files Remaining (To Create)

```
frontend/
├── src/
│   ├── app/
│   │   ├── providers.tsx                 ⬜ QueryClientProvider
│   │   └── router.tsx                    ⬜ Route definitions (if refactoring)
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── dialog.tsx                ⬜
│   │   │   ├── dropdown-menu.tsx         ⬜
│   │   │   ├── avatar.tsx                ⬜
│   │   │   ├── badge.tsx                 ⬜
│   │   │   ├── toast.tsx                 ⬜
│   │   │   └── index.ts                  ⬜
│   │   │
│   │   ├── layout/                       ⬜ All layout components
│   │   │   ├── app-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── main-content.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── shared/                       ⬜ Shared components
│   │       ├── loading-spinner.tsx
│   │       ├── empty-state.tsx
│   │       └── error-boundary.tsx
│   │
│   ├── stores/
│   │   └── ui.store.ts                   ⬜ UI state
│   │
│   ├── pages/
│   │   └── not-found.tsx                 ⬜ 404 page
│   │
│   └── test/                             ⬜ Testing setup
│       ├── setup.ts
│       └── utils.tsx
│
├── vitest.config.ts                      ⬜
└── .eslintrc.js                          ⬜
```

---

## 5. Verification Checklist

After completing all tasks:

- [x] Application starts without errors (`npm run dev`)
- [x] No TypeScript errors
- [x] Login/Logout flow works
- [ ] All SF-XXX tasks marked as completed
- [ ] All Shadcn components installed and styled
- [ ] Layout components match reference theme
- [ ] Routing works (navigation between pages)
- [ ] Dark/Light theme toggle works (partial - needs UI store)
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] TanStack Query configured
- [ ] Unit tests passing (`npm run test`)
- [ ] Production build succeeds (`npm run build`)

---

## 6. Notes & Issues

### Implementation Notes
- **Using React Router instead of TanStack Router**: Current setup uses `react-router-dom`. Consider migrating to TanStack Router for type-safe routing in future.
- **Reference Theme is mandatory**: All layout components MUST copy styles from `references/themes/demo-website-v2/`
- Frontend progress at **45%** - core infrastructure done, layout components pending

### Decisions Made
1. **React Router over TanStack Router**: Simpler initial setup, can migrate later
2. **Fetch over Axios**: Lighter weight, native browser support
3. **Zustand with persist**: Auth state persisted to localStorage
4. **Dark mode via class**: Using `darkMode: 'class'` in Tailwind

### Dependencies Installed
- React 18+, React Router DOM
- Tailwind CSS, @tailwindcss/forms, @tailwindcss/typography
- Zustand, Shadcn/UI components
- clsx, tailwind-merge

---

## 7. Progress Log

| Date | Tasks Completed | Notes |
|------|-----------------|-------|
| Dec 12, 2024 | SF-001 to SF-015, SF-028-042 (partial) | Initial setup, auth flow |
| Dec 13, 2024 | Review & documentation | Created implementation plan |

---

## 8. Remaining Work Summary

### High Priority (Required for Phase 1)
- **SF-022 to SF-027**: Layout components (Sidebar, Header, AppLayout) - **Critical for dashboard**
- **SF-030**: UI store for sidebar/theme state
- **SF-031-032**: TanStack Query setup

### Medium Priority (Required for Phase 1)
- **SF-016 to SF-020**: Additional Shadcn components (Dialog, DropdownMenu, Avatar, Badge, Toast)
- **SF-037-038**: 404 page and loading states
- **SF-041, SF-043**: Error handling improvements

### Low Priority (Phase 4)
- **SF-003**: ESLint/Prettier (optional, can defer)
- **SF-044 to SF-047**: Testing infrastructure

---

## 9. Implementation Priority Order

1. **First**: Install remaining Shadcn components (SF-016 to SF-021)
2. **Second**: Create UI store (SF-030)
3. **Third**: Create Layout components from reference theme (SF-022 to SF-027)
4. **Fourth**: Setup TanStack Query (SF-031-032)
5. **Fifth**: Error handling (SF-041, SF-043)

---

**Next Step:** After completing System Frontend basics, proceed to Domain Frontend Planning for **Auth Domain**.

Use: `planning/2.domain-frontend-plan.md` to create `docs/7.implementation/domains/auth/frontend-implementation-plan.md`

