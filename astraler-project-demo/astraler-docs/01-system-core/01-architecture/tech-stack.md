# Tech Stack

> **Version:** 1.0.0
> **Status:** Draft
> **Last Updated:** 251224

---

## 1. Overview

CompetitorIQ is built with TypeScript end-to-end, using NestJS for the backend and React for the frontend. This ensures type safety from database to UI.

---

## 2. Backend Stack

### Runtime & Language
| Technology | Version | Rationale |
|------------|---------|-----------|
| Node.js | 20 LTS | Long-term support, performance |
| TypeScript | 5.x | Type safety, developer experience |

### Framework
| Technology | Version | Rationale |
|------------|---------|-----------|
| NestJS | 10.x | Enterprise-grade, modular architecture |
| Fastify | 4.x | High performance (vs Express) |

### Database
| Technology | Version | Rationale |
|------------|---------|-----------|
| PostgreSQL | 15 | ACID compliance, JSON support |
| Prisma | 5.x | Type-safe ORM, migrations |

### Queue & Cache
| Technology | Version | Rationale |
|------------|---------|-----------|
| Redis | 7.x | Queue backend, caching |
| BullMQ | 4.x | Reliable job processing |

### AI/LLM
| Technology | Version | Rationale |
|------------|---------|-----------|
| LangChain.js | 0.1.x | LLM orchestration |
| OpenAI API | GPT-4 | Analysis quality |

### Security
| Technology | Purpose |
|------------|---------|
| Passport.js | JWT authentication |
| Argon2 | Password hashing |
| class-validator | Input validation |
| Helmet | HTTP security headers |

---

## 3. Frontend Stack

### Framework
| Technology | Version | Rationale |
|------------|---------|-----------|
| React | 18.x | Component model, ecosystem |
| Vite | 5.x | Fast HMR, modern bundling |
| TypeScript | 5.x | Type safety |

### Routing & State
| Technology | Version | Rationale |
|------------|---------|-----------|
| TanStack Router | 1.x | Type-safe, nested routes |
| TanStack Query | 5.x | Server state, caching |
| Zustand | 4.x | Lightweight client state |
| nuqs | 1.x | URL state management |

### UI Components
| Technology | Version | Rationale |
|------------|---------|-----------|
| Shadcn/UI | latest | Customizable, accessible |
| Tailwind CSS | 3.x | Utility-first styling |
| Radix UI | latest | Headless primitives |

### Charts & Visualization
| Technology | Purpose |
|------------|---------|
| Tremor | Dashboard charts |
| Recharts | Custom visualizations |

### Icons
| Technology | Style |
|------------|-------|
| Material Symbols | Outlined & filled |

---

## 4. External Services

### Data Collection
| Service | Purpose | Cost Model |
|---------|---------|------------|
| Apify | Social media crawling | Per actor run |
| SearchAPI.io | App store data | Per request |

### AI/ML
| Service | Purpose | Cost Model |
|---------|---------|------------|
| OpenAI | GPT-4 analysis | Per token |

---

## 5. Development Tools

### Code Quality
| Tool | Purpose |
|------|---------|
| ESLint | Linting |
| Prettier | Formatting |
| Husky | Git hooks |

### Testing
| Tool | Purpose |
|------|---------|
| Jest | Unit tests (backend) |
| Vitest | Unit tests (frontend) |
| Playwright | E2E tests |

### Documentation
| Tool | Purpose |
|------|---------|
| Swagger/OpenAPI | API docs |
| Storybook | Component docs |

---

## 6. Rules & Constraints

- TypeScript strict mode enabled everywhere
- All API endpoints documented with OpenAPI
- No `any` types without explicit justification
- Backend modules follow NestJS conventions
- Frontend features follow feature-based structure

---

## 7. Open Questions

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 1 | Add GraphQL alongside REST? | Developer experience | Open |
| 2 | Upgrade to React 19 when stable? | Performance | Open |

---

## 8. Changelog

### 251224 - v1.0.0 - Initial Draft
- Documented complete tech stack from SAD
- Added all libraries with versions and rationale
