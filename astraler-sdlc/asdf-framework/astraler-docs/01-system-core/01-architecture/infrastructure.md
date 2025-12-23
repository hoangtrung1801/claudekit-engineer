# Infrastructure Architecture

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## 1. Overview

Defines deployment infrastructure, CI/CD pipelines, and operational architecture.

---

## 2. Environment Strategy

### 2.1 Environments

| Environment | Purpose | URL | Branch |
|-------------|---------|-----|--------|
| **Development** | Local dev | localhost:3000 | feature/* |
| **Preview** | PR previews | *.preview.astraler.com | PR branches |
| **Staging** | Pre-prod testing | staging.astraler.com | develop |
| **Production** | Live system | app.astraler.com | main |

### 2.2 Environment Parity

All environments use identical:
- Docker images
- Database schema (different data)
- Environment variable structure
- Infrastructure configuration

---

## 3. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    DNS      │  │    CDN      │  │    WAF      │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                   EDGE LAYER                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Cloudflare Workers                      │   │
│  │    ┌─────────┐  ┌─────────┐  ┌─────────┐           │   │
│  │    │   API   │  │  Auth   │  │ Webhooks│           │   │
│  │    └─────────┘  └─────────┘  └─────────┘           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Supabase   │  │   Upstash   │  │     R2      │         │
│  │ (Postgres)  │  │   (Redis)   │  │  (Storage)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. CI/CD Pipeline

### 4.1 Pipeline Stages

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Stage 1: Quality Checks
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm typecheck

  # Stage 2: Testing
  test:
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
    steps:
      - uses: actions/checkout@v4
      - run: pnpm test:ci
      - uses: codecov/codecov-action@v3

  # Stage 3: Build
  build:
    runs-on: ubuntu-latest
    needs: [test]
    steps:
      - uses: actions/checkout@v4
      - run: pnpm build

  # Stage 4: Deploy
  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: [build]
    # Deploy to preview environment

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: [build]
    # Deploy to staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [build]
    # Deploy to production
```

### 4.2 Quality Gates

| Gate | Requirement | Blocking |
|------|-------------|----------|
| Linting | 0 errors | Yes |
| Type Check | 0 errors | Yes |
| Unit Tests | Pass | Yes |
| Coverage | > 70% | No (warning) |
| Build | Success | Yes |
| E2E Tests | Pass (staging) | Yes |

---

## 5. Monitoring & Observability

### 5.1 Metrics

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Error Rate | Sentry | > 1% |
| Response Time | Cloudflare | p95 > 500ms |
| Uptime | Better Uptime | < 99.5% |
| DB Connections | Supabase | > 80% pool |

### 5.2 Logging

| Log Type | Destination | Retention |
|----------|-------------|-----------|
| Application | Cloudflare Logs | 7 days |
| Access | Cloudflare | 3 days |
| Error | Sentry | 90 days |
| Audit | Supabase | 1 year |

### 5.3 Alerting

| Severity | Response Time | Channel |
|----------|---------------|---------|
| Critical | 15 min | PagerDuty + Slack |
| High | 1 hour | Slack |
| Medium | 24 hours | Email |
| Low | 1 week | Dashboard |

---

## 6. Scaling Strategy

### 6.1 Horizontal Scaling

| Component | Strategy |
|-----------|----------|
| API | Cloudflare Workers (auto) |
| Database | Read replicas + pooling |
| Cache | Redis cluster |
| Storage | R2 (unlimited) |

### 6.2 Capacity Targets

| Metric | Current | Target |
|--------|---------|--------|
| Concurrent Users | 100 | 10,000 |
| Requests/sec | 50 | 5,000 |
| Database Connections | 20 | 100 |
| Storage | 1 GB | 100 GB |

---

## 7. Disaster Recovery

### 7.1 Backup Strategy

| Data | Method | Frequency | Location |
|------|--------|-----------|----------|
| Database | pg_dump | Daily | R2 bucket |
| Files | R2 replication | Real-time | Multi-region |
| Configs | Git | On change | GitHub |
| Secrets | Encrypted backup | Weekly | Secure vault |

### 7.2 Recovery Procedures

1. **Database Recovery**: Restore from Supabase point-in-time
2. **Service Recovery**: Redeploy from last known good commit
3. **Full Recovery**: Terraform apply from infrastructure-as-code

---

## 8. Security Infrastructure

### 8.1 Network Security

- DDoS protection via Cloudflare
- WAF rules for common attacks
- Rate limiting at edge
- IP allowlisting for admin

### 8.2 Secret Management

| Secret Type | Storage | Access |
|-------------|---------|--------|
| API Keys | Cloudflare env | Workers only |
| DB Credentials | Supabase managed | Service role |
| JWT Secrets | Cloudflare env | Auth service |

---

**Cross-References:**
- Master Map: `01-architecture/master-map.md`
- Security Policy: `04-governance/security-policy.md`
