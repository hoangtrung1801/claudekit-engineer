# Code Standards

> **Version:** 1.0.0
> **Status:** Draft
> **Last Updated:** 251224

---

## 1. Overview

This document defines coding standards for CompetitorIQ. All backend and frontend code must adhere to these conventions for consistency, maintainability, and type safety.

---

## 2. Project Structure

### 2.1. Monorepo Structure

```
competitor-iq/
├── backend/                     # NestJS API Server
├── frontend/                    # React SPA Dashboard
├── shared/                      # Shared TypeScript types (optional)
├── docker-compose.yml           # Local development
└── README.md
```

### 2.2. Backend Structure (NestJS)

```
backend/
├── src/
│   ├── modules/                 # Feature Modules
│   │   ├── auth/                # AuthModule
│   │   ├── projects/            # ProjectModule
│   │   ├── crawler/             # CrawlerModule
│   │   ├── data-collection/     # DataCollectionModule
│   │   ├── data-processing/     # DataProcessingModule
│   │   ├── analysis/            # AnalysisModule
│   │   └── dashboard/           # DashboardModule
│   ├── common/                  # Shared utilities
│   │   ├── decorators/          # @Roles, @User
│   │   ├── filters/             # Exception Filters
│   │   ├── guards/              # Auth Guards
│   │   └── interceptors/        # Response Interceptors
│   ├── config/                  # Configuration validation
│   ├── database/                # Prisma Module
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma            # Single Source of Truth for DB
└── test/
```

### 2.3. Frontend Structure (React + Vite)

```
frontend/
├── src/
│   ├── app/                     # App Configuration
│   │   ├── router.tsx
│   │   ├── providers.tsx
│   │   └── App.tsx
│   ├── components/              # Reusable UI Components
│   │   ├── ui/                  # Shadcn/UI base
│   │   ├── layout/              # Sidebar, Header
│   │   └── shared/              # KPICard, DataTable
│   ├── features/                # Feature Modules (Domain-based)
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── dashboard/
│   │   ├── competitors/
│   │   └── videos/
│   ├── hooks/                   # Global Custom Hooks
│   ├── lib/                     # Utilities & Configs
│   ├── stores/                  # Zustand Global State
│   ├── types/                   # TypeScript Definitions
│   └── styles/
└── public/
```

---

## 3. TypeScript Standards

### 3.1. Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 3.2. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `UserService`, `AuthGuard` |
| Interfaces | PascalCase, I-prefix optional | `User`, `IUserRepository` |
| Functions | camelCase | `getUserById`, `validateToken` |
| Variables | camelCase | `accessToken`, `userId` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Files | kebab-case | `user.service.ts`, `auth.guard.ts` |
| Folders | kebab-case | `data-collection/`, `ai-analysis/` |

### 3.3. Type Definitions

```typescript
// ✅ GOOD: Explicit types
interface User {
  id: string;
  email: string;
  role: UserRole;
}

// ❌ BAD: Using `any`
const user: any = fetchUser();

// ✅ GOOD: Use unknown + type guard
const user: unknown = fetchUser();
if (isUser(user)) { /* ... */ }
```

---

## 4. Backend Standards (NestJS)

### 4.1. Module Structure

Each module follows NestJS conventions:

```
modules/auth/
├── auth.module.ts           # Module definition
├── auth.controller.ts       # HTTP endpoints
├── auth.service.ts          # Business logic
├── dto/                     # Data Transfer Objects
│   ├── login.dto.ts
│   └── register.dto.ts
├── entities/                # Prisma entities (if needed)
└── guards/                  # Module-specific guards
```

### 4.2. Validation

Global validation pipe enabled:

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,    // Strip unknown properties
  transform: true,    // Auto-transform to DTO
  forbidNonWhitelisted: true,
}));
```

### 4.3. DTO Patterns

```typescript
// dto/create-project.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  iosStoreUrl?: string;
}
```

---

## 5. API Standards

### 5.1. Response Format

All responses wrapped in standard format:

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful"
}
```

### 5.2. Error Format

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### 5.3. Pagination

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5,
  "nextPage": 2
}
```

---

## 6. Frontend Standards (React)

### 6.1. Component Patterns

```typescript
// ✅ GOOD: Functional component with TypeScript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

### 6.2. Feature Module Structure

```
features/videos/
├── components/              # Feature-specific components
│   ├── VideoCard.tsx
│   └── VideoGrid.tsx
├── hooks/                   # Feature-specific hooks
│   └── useVideos.ts
├── api.ts                   # API functions
├── types.ts                 # Feature types
└── VideosPage.tsx           # Page component
```

### 6.3. TanStack Query Patterns

```typescript
// api.ts
export function useVideos(projectId: string) {
  return useQuery({
    queryKey: ['videos', projectId],
    queryFn: () => apiClient<Video[]>(`/projects/${projectId}/videos`),
  });
}

// Mutations
export function useCreateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVideoDto) => apiClient.post('/videos', data),
    onSuccess: () => queryClient.invalidateQueries(['videos']),
  });
}
```

---

## 7. Code Quality Rules

### 7.1. ESLint Configuration

- No unused variables
- No console.log in production
- Consistent import ordering
- Max line length: 100 characters

### 7.2. Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 7.3. Git Hooks (Husky)

- Pre-commit: lint-staged
- Pre-push: type-check

---

## 8. Open Questions

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 1 | Shared types package or manual sync? | DX | Open |
| 2 | Stricter ESLint rules for MVP? | Code quality | Open |

---

## 9. Changelog

### 251224 - v1.0.0 - Initial Draft
- Created code standards from system-tdd.md
- Documented project structure conventions
- Defined TypeScript and API standards
