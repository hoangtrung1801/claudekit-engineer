# System Technical Design Document (TDD)

## 1. Introduction
This document defines the technical implementation details for the **Competitor Video Analysis System**. The system consists of two main applications:
- **Backend**: NestJS Modular Monolith (API Server)
- **Frontend**: React + Vite SPA (Merchant Dashboard)

It serves as the blueprint for the `Implementation` phase.

## 2. Project Structure

### 2.1. Monorepo Structure
```text
competitor-iq/
├── backend/                     # NestJS API Server
├── frontend/                    # React SPA Dashboard
├── shared/                      # Shared TypeScript types (optional)
├── docker-compose.yml           # Local development
└── README.md
```

### 2.2. Backend Structure (NestJS)
We follow the standard **NestJS Modular** structure.

```text
backend/
├── src/
│   ├── modules/                 # Feature Modules
│   │   ├── auth/                # AuthModule (JWT, Passport)
│   │   ├── users/               # UsersModule
│   │   ├── projects/            # ProjectModule (Core Domain)
│   │   ├── crawler/             # CrawlerModule (Queue handling)
│   │   ├── data-collection/     # DataCollectionModule (Apify, SearchAPI)
│   │   ├── data-processing/     # DataProcessingModule (Normalization)
│   │   ├── analysis/            # AnalysisModule (LangChain)
│   │   ├── admin/               # AdminModule (System Management)
│   │   └── dashboard/           # DashboardModule (Aggregation)
│   ├── common/                  # Shared utilities
│   │   ├── decorators/          # Custom Decorators (@Roles, @User)
│   │   ├── filters/             # Exception Filters
│   │   ├── guards/              # Auth Guards
│   │   └── interceptors/        # Response Interceptors
│   ├── config/                  # Configuration validation
│   ├── database/                # Prisma Module
│   ├── app.module.ts            # Root Module
│   └── main.ts                  # Entrypoint
├── prisma/
│   └── schema.prisma            # Single Source of Truth for DB
├── test/                        # E2E Tests
└── package.json
```

### 2.3. Frontend Structure (React + Vite)
We follow a **Feature-based** structure with clean separation.

```text
frontend/
├── src/
│   ├── app/                     # App Configuration
│   │   ├── router.tsx           # React Router setup
│   │   ├── providers.tsx        # Context Providers (Query, Auth)
│   │   └── App.tsx              # Root App Component
│   ├── components/              # Reusable UI Components
│   │   ├── ui/                  # Shadcn/UI base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/              # Layout Components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── RightPanel.tsx
│   │   │   └── MainLayout.tsx
│   │   └── shared/              # Common Business Components
│   │       ├── KPICard.tsx
│   │       ├── DataTable.tsx
│   │       ├── ChartCard.tsx
│   │       ├── EmptyState.tsx
│   │       └── LoadingSkeleton.tsx
│   ├── features/                # Feature Modules (Domain-based)
│   │   ├── auth/                # Authentication
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   └── LoginPage.tsx
│   │   ├── projects/            # Project Management
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   └── ProjectsPage.tsx
│   │   ├── dashboard/           # Overview Dashboard
│   │   │   ├── components/
│   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   └── SummaryCards.tsx
│   │   │   ├── hooks/
│   │   │   └── DashboardPage.tsx
│   │   ├── competitors/         # Competitor Management
│   │   ├── videos/              # Videos Library
│   │   ├── reviews/             # Reviews Analysis
│   │   ├── channels/            # Social Channels
│   │   ├── marketing/           # Marketing Stats
│   │   ├── aso/                 # ASO Tracking
│   │   ├── whats-new/           # Version Updates
│   │   └── ai-insights/         # AI Analysis
│   ├── hooks/                   # Global Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useProject.ts
│   │   └── useMediaQuery.ts
│   ├── lib/                     # Utilities & Configs
│   │   ├── api-client.ts        # Axios/Fetch wrapper
│   │   ├── utils.ts             # Helper functions
│   │   └── constants.ts
│   ├── stores/                  # Zustand Global State
│   │   ├── auth.store.ts
│   │   ├── ui.store.ts          # Sidebar, Theme
│   │   └── project.store.ts
│   ├── types/                   # TypeScript Definitions
│   │   ├── api.types.ts         # API Response types
│   │   ├── entities.types.ts    # Domain entities
│   │   └── index.ts
│   ├── styles/                  # Global Styles
│   │   └── globals.css          # Tailwind + Custom CSS
│   └── main.tsx                 # Entrypoint
├── public/                      # Static Assets
│   ├── favicon.ico
│   └── logo.svg
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 3. Technology Stack Specifics

### 3.1. Backend Core
*   **Framework**: NestJS 10+
*   **Platform**: `platform-fastify` (chosen for high performance).
*   **Language**: TypeScript 5.x.

### 3.2. Frontend Core
*   **Framework**: React 18+
*   **Build Tool**: Vite 5.x (HMR, fast builds).
*   **Language**: TypeScript 5.x (Strict mode).

### 3.3. Frontend Libraries
| Category | Library | Purpose |
| :--- | :--- | :--- |
| **Routing** | react-router-dom | Standard SPA routing |
| **Server State** | TanStack Query | API caching, refetch, pagination |
| **Client State** | Zustand | UI state (sidebar, theme, session) |
| **UI Components** | Shadcn/UI | Customizable Radix-based components |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Icons** | Google Material Symbols | Consistent iconography |
| **Charts** | Tremor / Recharts | Dashboard visualizations |
| **Forms** | React Hook Form + Zod | Form handling with validation |

### 3.4. Data & Storage
*   **Database**: PostgreSQL 16.
*   **ORM**: **Prisma**.
*   **Redis**: For BullMQ and Caching.

### 3.5. Background Processing
*   **Library**: **BullMQ** (`@nestjs/bullmq`).
*   **Usage**: Two main queues:
    *   `crawl-queue`: For long-running scraping tasks.
    *   `analysis-queue`: For LLM processing tasks.

## 4. Core Implementation Details

### 4.1. Configuration
Using `@nestjs/config` with `joi` validation or `class-validator`.

```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
});
```

### 4.2. Database (Prisma Services)
NestJS wraps Prisma Client in a Service.

```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### 4.3. Crawler Module (Queue Producer)
Example of adding a job to the queue.

```typescript
// src/modules/crawler/crawler.service.ts
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CrawlerService {
  constructor(@InjectQueue('crawl-queue') private crawlQueue: Queue) {}

  async triggerCrawl(projectId: string, platform: string) {
    await this.crawlQueue.add('crawl-job', {
      projectId,
      platform,
    });
  }
}
```

### 4.4. Crawler Processor (Queue Consumer)
Example of processing the job.

```typescript
// src/modules/crawler/crawler.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('crawl-queue')
export class CrawlerProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing job ${job.id} for project ${job.data.projectId}...`);
    // Call Playwright or Apify logic here
  }
}
```

### 4.5. Authentication
*   **Strategy**: JWT (Access Token).
*   **Library**: `passport`, `passport-jwt`, `@nestjs/passport`.

### 4.6. Validation
Global validation pipe enabled in `main.ts`.

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true, // properties not in DTO are stripped
  transform: true, // auto-transform payloads to DTO instances
}));
```

## 5. API Response Standard
We use an Interceptor (`TransformInterceptor`) to wrap all successful responses.

**Format**:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful"
}
```

## 6. Observability
*   **Logger**: `nestjs-pino` for high-performance structured logging.
*   **Docs**: Swagger (OpenAPI) auto-generated at `/api/docs`.

---

## 7. Frontend Implementation Details

### 7.1. Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### 7.2. API Client Setup
Using TanStack Query with a configured fetch wrapper.

```typescript
// src/lib/api-client.ts
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

### 7.3. TanStack Query Provider
```typescript
// src/app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 7.4. Feature Query Example (Videos)
```typescript
// src/features/videos/api.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useVideos(projectId: string, filters: VideoFilters) {
  return useInfiniteQuery({
    queryKey: ['videos', projectId, filters],
    queryFn: ({ pageParam = 1 }) =>
      apiClient<PaginatedResponse<Video>>(
        `/projects/${projectId}/videos?page=${pageParam}&${new URLSearchParams(filters)}`
      ),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

export function useVideo(videoId: string) {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => apiClient<Video>(`/videos/${videoId}`),
  });
}
```

### 7.5. Zustand Store Example
```typescript
// src/stores/ui.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'light',
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-storage' }
  )
);

### 7.6. Routing & URL State
The current implementation uses **React Router (v6)** for navigation and standard component state/hooks for managing query parameters.

### 7.7. Future Phase Tech Stack (Planned Upgrade)
> [!NOTE]
> > The system is planned to migrate to **TanStack Router** and **nuqs** in future phases to achieve:
> - **Strict Type-Safety**: Eliminate runtime errors from invalid URL parameters.
> - **Declarative URL State**: Better management of complex dashboard filters.
> - **Search Parameter Synchronization**: Native support for binding complex objects to URLs.

## 8. Frontend-Backend Integration

### 8.1. Type Sharing Strategy
*   **Option A (Recommended for MVP)**: Manually sync TypeScript types in `frontend/src/types/`.
*   **Option B (Future)**: Use `shared/` package in monorepo with shared DTOs.

### 8.2. API Response Contract
All API responses follow the standard format defined in Section 5.

```typescript
// frontend/src/types/api.types.ts
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  nextPage?: number;
}
```

### 8.3. Authentication Flow
1. User submits credentials → `POST /auth/login`
2. Backend returns `{ access_token: string }`
3. Frontend stores token in `localStorage`
4. All subsequent requests include `Authorization: Bearer <token>`
5. TanStack Query handles token refresh on 401

## 9. Development Workflow

### 9.1. Local Development
```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Frontend proxies /api/* to backend:3000
```

### 9.2. Environment Variables
```env
# frontend/.env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=CompetitorIQ
```

### 9.3. Build & Deploy
```bash
# Build frontend
cd frontend && npm run build
# Output: frontend/dist/

# Build backend
cd backend && npm run build
# Output: backend/dist/
```
