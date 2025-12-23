# Architecture Decision Log

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## Purpose

Records significant architectural decisions using ADR (Architecture Decision Record) format. Each decision captures context, options considered, and rationale.

---

## Decision Index

| ID | Date | Title | Status |
|----|------|-------|--------|
| ADR-001 | 241210 | Edge-first architecture | Accepted |
| ADR-002 | 241212 | Supabase as primary database | Accepted |
| ADR-003 | 241215 | Monorepo with pnpm | Accepted |
| ADR-004 | 241218 | SePay for Vietnam payments | Accepted |
| ADR-005 | 241220 | Better Auth for authentication | Accepted |

---

## ADR-001: Edge-First Architecture

**Date**: 241210
**Status**: Accepted
**Deciders**: Product Architect, Tech Lead

### Context

Need to select deployment architecture for e-commerce platform targeting Vietnamese market. Key requirements:
- Low latency for SEA users
- Cost efficiency at scale
- Serverless operations

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Traditional VPS** | Full control, predictable costs | Ops overhead, scaling complexity |
| **AWS Lambda + API Gateway** | Proven, rich ecosystem | Cold starts, vendor lock-in, cost at scale |
| **Cloudflare Workers** | Edge latency, generous free tier, simple | Limited runtime, newer ecosystem |

### Decision

**Cloudflare Workers** as primary compute layer.

### Rationale

1. Edge deployment = ~20ms latency in Vietnam vs ~200ms from US regions
2. No cold starts (V8 isolates)
3. Free tier covers MVP traffic
4. Workers KV and D1 for edge data
5. Simpler than managing containers

### Consequences

- Must work within Workers constraints (CPU time, memory)
- Limited Node.js API compatibility
- Team needs to learn Workers patterns
- Fallback to traditional API for heavy compute

---

## ADR-002: Supabase as Primary Database

**Date**: 241212
**Status**: Accepted
**Deciders**: Product Architect

### Context

Need managed PostgreSQL with real-time capabilities, auth integration, and developer experience suitable for small team.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **PlanetScale** | Excellent scaling, branching | MySQL only, no FK constraints |
| **Neon** | Serverless Postgres, branching | Newer, smaller community |
| **Supabase** | Full Postgres, built-in auth, real-time | Singapore region only |

### Decision

**Supabase** with Singapore region.

### Rationale

1. Full PostgreSQL = familiar, powerful
2. Built-in auth saves development time
3. Real-time subscriptions for order updates
4. Row Level Security for multi-tenant data
5. Dashboard for non-technical team access
6. Singapore region acceptable latency for Vietnam

### Consequences

- Single region (can add read replicas later)
- Tied to Supabase ecosystem
- Must use connection pooling for Workers

---

## ADR-003: Monorepo with pnpm

**Date**: 241215
**Status**: Accepted
**Deciders**: Tech Lead

### Context

Project has multiple packages: web app, API workers, shared types, UI components. Need to manage dependencies and enable code sharing.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Separate repos** | Clear boundaries, independent deploys | Sync overhead, version hell |
| **npm workspaces** | Built-in, simple | Slower installs, hoisting issues |
| **pnpm workspaces** | Fast, strict, disk efficient | Less common, learning curve |
| **Turborepo + pnpm** | Caching, task orchestration | Additional complexity |

### Decision

**pnpm workspaces** with **Turborepo** for task orchestration.

### Rationale

1. pnpm is 2-3x faster than npm
2. Strict dependency resolution prevents phantom deps
3. Turborepo caches builds across CI runs
4. Shared packages (`@astraler/types`, `@astraler/ui`) reduce duplication
5. Single PR for cross-cutting changes

### Consequences

- Team must learn pnpm commands
- CI caching requires Turborepo configuration
- Need clear package boundaries

---

## ADR-004: SePay for Vietnam Payments

**Date**: 241218
**Status**: Accepted
**Deciders**: Product Architect, Business Lead

### Context

Need payment gateway supporting Vietnamese payment methods (bank transfer, VietQR, cards) with reasonable fees and good developer experience.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **VNPay** | Market leader, trusted | Poor DX, complex integration |
| **Momo** | Popular wallet | Limited to Momo users |
| **SePay** | Modern API, VietQR, webhooks | Smaller, newer |
| **Stripe** | Excellent DX | No Vietnam support yet |

### Decision

**SePay** as primary payment gateway.

### Rationale

1. Modern REST API with webhooks
2. VietQR support (growing adoption)
3. Automatic bank reconciliation
4. Reasonable fees (0.5-1%)
5. Good documentation
6. Can add alternatives later

### Consequences

- Depends on smaller provider (risk)
- Need fallback plan if SePay has issues
- Must handle VND currency formatting

---

## ADR-005: Better Auth for Authentication

**Date**: 241220
**Status**: Accepted
**Deciders**: Tech Lead

### Context

Need authentication solution that works with Cloudflare Workers, supports multiple providers, and doesn't lock into Supabase Auth.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Supabase Auth** | Integrated, simple | Tied to Supabase, limited customization |
| **Auth.js (NextAuth)** | Popular, many providers | Heavy, not edge-native |
| **Lucia** | Lightweight, flexible | Deprecated, moving to Better Auth |
| **Better Auth** | Edge-native, TypeScript, flexible | Newer, smaller community |

### Decision

**Better Auth** for authentication.

### Rationale

1. TypeScript-first, excellent DX
2. Works on Cloudflare Workers edge
3. Built-in support for OAuth, magic links, 2FA
4. Not tied to specific framework
5. Active development, Lucia successor
6. Easy migration path

### Consequences

- Team must learn Better Auth patterns
- Community smaller than Auth.js
- May need to contribute fixes

---

## Template

```markdown
## ADR-XXX: [Title]

**Date**: YYMMDD
**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-XXX
**Deciders**: [Names/Roles]

### Context

[What is the issue? Why do we need to make this decision?]

### Options Considered

| Option | Pros | Cons |
|--------|------|------|

### Decision

[What is the change we're proposing/making?]

### Rationale

[Why is this the best option? Key factors in the decision.]

### Consequences

[What are the trade-offs? What do we need to do differently?]
```

---

**Cross-References:**
- Master Map: `01-architecture/master-map.md`
- Infrastructure: `01-architecture/infrastructure.md`
