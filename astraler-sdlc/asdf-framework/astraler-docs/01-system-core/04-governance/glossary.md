# Glossary

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## Purpose

Defines domain-specific terms, abbreviations, and concepts used throughout the Astraler project. Ensures consistent understanding across team and AI assistants.

---

## A

**ADR (Architecture Decision Record)**
: Documented record of significant architectural decisions, including context, options, and rationale. See `decision-log.md`.

**ASDF (Astraler Spec-Driven Framework)**
: Development methodology where specifications are the single source of truth. Code follows specs, and specs are updated via Reverse Sync.

---

## B

**Better Auth**
: TypeScript-first authentication library used for user login, OAuth, and session management. Edge-compatible.

---

## C

**CDN (Content Delivery Network)**
: Network of edge servers caching static assets. We use Cloudflare's global CDN.

**CLS (Cumulative Layout Shift)**
: Core Web Vital measuring visual stability. Target: < 0.1.

**Cloudflare Workers**
: Serverless compute platform running at the edge. Our primary API runtime.

---

## D

**Domain**
: Bounded context representing a business capability (e.g., Authentication, Payments, Orders). Second tier in ASDF hierarchy.

---

## E

**Edge**
: Computing at locations geographically close to users. Reduces latency vs centralized servers.

**ERD (Entity Relationship Diagram)**
: Visual representation of database tables and relationships.

---

## F

**FAB (Floating Action Button)**
: Circular button floating above UI, typically for primary actions on mobile.

**Feature Spec**
: Detailed specification for a single feature, including requirements, acceptance criteria, and technical design. Third tier in ASDF hierarchy.

**FID (First Input Delay)**
: Core Web Vital measuring interactivity. Target: < 100ms.

---

## G

**Guest User**
: Unauthenticated user with limited access. Can browse products but not checkout.

---

## H

**Handoff Notes**
: Session continuity document in `04-operations/session-handoff.md`. Captures what was done, what's pending, and blockers.

---

## I

**Idempotent**
: Operation that produces same result if executed multiple times. Important for payment webhooks.

---

## J

**JWT (JSON Web Token)**
: Compact token format for securely transmitting claims. Used for API authentication.

---

## K

**KV (Key-Value)**
: Simple data storage pattern. Cloudflare KV used for edge caching.

---

## L

**LCP (Largest Contentful Paint)**
: Core Web Vital measuring loading performance. Target: < 2.5s.

---

## M

**Master Map**
: Central document defining project DNA, tech stack, and architecture overview. Located at `01-system-core/01-architecture/master-map.md`.

**MoR (Merchant of Record)**
: Entity responsible for payment processing and tax compliance. SePay acts as payment facilitator.

---

## N

**N+1 Query**
: Performance anti-pattern where N additional queries are made for N items. Must be avoided via proper joins or batching.

---

## O

**Order**
: Core entity representing customer purchase. States: pending → confirmed → processing → shipped → delivered.

**OTP (One-Time Password)**
: Temporary code for verification, typically 6 digits, expires in 5 minutes.

---

## P

**P50/P95/P99**
: Percentile metrics. P95 = 95% of requests complete within this time.

**PDR (Product Development Requirement)**
: High-level requirement document preceding feature specs.

**Product Architect**
: Role responsible for specifications, architecture decisions, and AI guidance. The "Driver" in ASDF.

---

## Q

**Quality Gate**
: Checkpoint that must pass before proceeding. Examples: tests pass, coverage > 70%.

---

## R

**R2**
: Cloudflare's S3-compatible object storage. Used for file uploads.

**Redis**
: In-memory data store used for caching. We use Upstash (serverless Redis).

**Reverse Sync**
: ASDF process where code changes trigger specification updates. Keeps docs in sync with reality.

**RLS (Row Level Security)**
: PostgreSQL feature restricting data access at row level based on user context.

---

## S

**SePay**
: Vietnamese payment gateway supporting VietQR, bank transfers, and cards.

**SLA (Service Level Agreement)**
: Contractual commitment to performance/availability targets.

**SLO (Service Level Objective)**
: Target metrics for service performance (internal goals, not contractual).

**SKU (Stock Keeping Unit)**
: Unique identifier for product variants.

**Supabase**
: Backend-as-a-Service platform providing PostgreSQL, auth, and real-time subscriptions.

---

## T

**TTFB (Time to First Byte)**
: Time from request to first response byte. Target: < 800ms.

**TTL (Time to Live)**
: Duration before cached data expires.

---

## U

**UUID (Universally Unique Identifier)**
: 128-bit identifier used for all primary keys. Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

**Upstash**
: Serverless Redis and Kafka provider. Used for caching and rate limiting.

---

## V

**VietQR**
: Vietnamese QR code payment standard. Growing adoption for bank transfers.

**VND (Vietnamese Dong)**
: Primary currency. Stored as integers (no decimal places).

---

## W

**WAF (Web Application Firewall)**
: Security layer filtering malicious requests. Cloudflare WAF enabled.

**Webhook**
: HTTP callback triggered by external events (e.g., payment confirmed, order shipped).

**Workers**
: See Cloudflare Workers.

---

## Abbreviations Quick Reference

| Abbrev | Full Form |
|--------|-----------|
| ADR | Architecture Decision Record |
| API | Application Programming Interface |
| CDN | Content Delivery Network |
| CI/CD | Continuous Integration/Continuous Deployment |
| CLS | Cumulative Layout Shift |
| DX | Developer Experience |
| ERD | Entity Relationship Diagram |
| FID | First Input Delay |
| JWT | JSON Web Token |
| KV | Key-Value |
| LCP | Largest Contentful Paint |
| MoR | Merchant of Record |
| OTP | One-Time Password |
| PDR | Product Development Requirement |
| RLS | Row Level Security |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| SLA | Service Level Agreement |
| SLO | Service Level Objective |
| SKU | Stock Keeping Unit |
| TTFB | Time to First Byte |
| TTL | Time to Live |
| UUID | Universally Unique Identifier |
| VND | Vietnamese Dong |
| WAF | Web Application Firewall |

---

**Cross-References:**
- Master Map: `01-architecture/master-map.md`
- Decision Log: `04-governance/decision-log.md`
