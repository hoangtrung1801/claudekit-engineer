# Performance SLAs

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect

---

## 1. Service Level Objectives (SLOs)

### 1.1 Availability

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Uptime** | 99.5% | Monthly rolling |
| **Error Rate** | < 1% | 5xx responses / total |
| **Incident Response** | < 15min | P0 issues |

### 1.2 Downtime Budget

| Period | Allowed Downtime |
|--------|------------------|
| Monthly | ~3.6 hours |
| Weekly | ~50 minutes |
| Daily | ~7 minutes |

---

## 2. Response Time Targets

### 2.1 API Endpoints

| Category | p50 | p95 | p99 |
|----------|-----|-----|-----|
| **Read (simple)** | 50ms | 100ms | 200ms |
| **Read (complex)** | 100ms | 200ms | 500ms |
| **Write (simple)** | 100ms | 200ms | 500ms |
| **Write (complex)** | 200ms | 500ms | 1000ms |
| **Search** | 200ms | 500ms | 1000ms |

### 2.2 Page Load (Web Vitals)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | < 2.5s | 2.5s - 4s | > 4s |
| **FID** | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** | < 0.1 | 0.1 - 0.25 | > 0.25 |
| **TTFB** | < 800ms | 800ms - 1.8s | > 1.8s |

### 2.3 Critical Paths

| Path | Target | Current |
|------|--------|---------|
| Login | < 500ms | ~400ms |
| Product list | < 300ms | ~200ms |
| Checkout | < 1s | ~800ms |
| Payment | < 2s | ~1.5s |

---

## 3. Throughput Targets

### 3.1 Capacity

| Metric | Target | Burst |
|--------|--------|-------|
| **Requests/sec** | 1,000 | 5,000 |
| **Concurrent Users** | 5,000 | 10,000 |
| **Database Connections** | 50 | 100 |

### 3.2 Growth Headroom

| Resource | Current Usage | Capacity | Headroom |
|----------|---------------|----------|----------|
| CPU | 30% | 100% | 70% |
| Memory | 40% | 100% | 60% |
| DB Connections | 20 | 100 | 80% |
| Storage | 10GB | 100GB | 90% |

---

## 4. Database Performance

### 4.1 Query Targets

| Query Type | Target | Alert |
|------------|--------|-------|
| Simple SELECT | < 10ms | > 50ms |
| Complex JOIN | < 50ms | > 200ms |
| Aggregation | < 100ms | > 500ms |
| Write | < 20ms | > 100ms |

### 4.2 Index Requirements

All queries must:
- Use indexes (no full table scans)
- Return in < 100ms for p95
- Be analyzed with `EXPLAIN ANALYZE`

---

## 5. Caching Strategy

### 5.1 Cache Layers

| Layer | TTL | Use Case |
|-------|-----|----------|
| **Browser** | 1 hour | Static assets |
| **CDN** | 5 min | Public pages |
| **Redis** | 5 min | API responses |
| **Memory** | 1 min | Hot data |

### 5.2 Cache Hit Targets

| Cache | Target Hit Rate |
|-------|-----------------|
| CDN | > 80% |
| Redis | > 90% |
| Database | > 95% |

---

## 6. Resource Limits

### 6.1 Request Limits

| Resource | Limit |
|----------|-------|
| Request body | 10MB |
| File upload | 50MB |
| Query params | 2KB |
| Headers | 8KB |

### 6.2 Rate Limits

| Tier | Limit | Window |
|------|-------|--------|
| Anonymous | 30 | 1 min |
| User | 100 | 1 min |
| API Key | 1000 | 1 min |

---

## 7. Monitoring & Alerts

### 7.1 Metrics to Track

| Metric | Tool | Dashboard |
|--------|------|-----------|
| Response time | Cloudflare | CF Analytics |
| Error rate | Sentry | Sentry Dashboard |
| Uptime | Better Uptime | Status Page |
| DB performance | Supabase | Supabase Dashboard |

### 7.2 Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Response p95 | > 500ms | > 1000ms |
| Error rate | > 0.5% | > 1% |
| Uptime | < 99.9% | < 99.5% |
| CPU | > 70% | > 90% |

---

## 8. Performance Testing

### 8.1 Test Types

| Type | Frequency | Tool |
|------|-----------|------|
| Load test | Weekly | k6 |
| Stress test | Monthly | k6 |
| Spike test | Quarterly | k6 |
| Soak test | Quarterly | k6 |

### 8.2 Baseline Scenarios

```javascript
// k6 load test
export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Steady
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};
```

---

## 9. Optimization Checklist

### 9.1 Before Launch

- [ ] All pages score > 90 on Lighthouse
- [ ] API p95 < 200ms
- [ ] No N+1 queries
- [ ] Images optimized (WebP, lazy load)
- [ ] Critical CSS inlined
- [ ] JavaScript code-split

### 9.2 Ongoing

- [ ] Weekly performance review
- [ ] Monthly load testing
- [ ] Quarterly capacity planning

---

**Cross-References:**
- Infrastructure: `01-architecture/infrastructure.md`
- Testing Strategy: `02-standards/testing-strategy.md`
