# Security Policy

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Product Architect
> **Classification**: Internal

---

## 1. Security Principles

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimum access required
3. **Secure by Default** - Security on, not optional
4. **Fail Secure** - Deny access on error
5. **Zero Trust** - Verify everything, trust nothing

---

## 2. Authentication & Authorization

### 2.1 Authentication Requirements

| Requirement | Implementation |
|-------------|----------------|
| Password Policy | Min 8 chars, 1 upper, 1 number, 1 special |
| Password Storage | Argon2id (via Supabase) |
| MFA | Optional, recommended for admin |
| Session Duration | 15min access token, 7d refresh |
| OAuth Providers | Google, GitHub (future) |

### 2.2 Authorization Model

```
Roles:
├── super_admin    # Full system access
├── admin          # Store management
├── staff          # Order processing
└── customer       # Self-service only

Permissions:
├── users:read, users:write, users:delete
├── orders:read, orders:write, orders:cancel
├── products:read, products:write, products:delete
└── settings:read, settings:write
```

### 2.3 Session Management

- HttpOnly cookies for tokens
- Secure flag in production
- SameSite=Lax (Strict for admin)
- Token rotation on privilege change
- Immediate invalidation on logout

---

## 3. Data Protection

### 3.1 Data Classification

| Level | Description | Examples | Controls |
|-------|-------------|----------|----------|
| **Public** | No restrictions | Product names | None |
| **Internal** | Business data | Order counts | Auth required |
| **Confidential** | Sensitive PII | Email, address | Encryption + access log |
| **Restricted** | Payment/secrets | Card data, API keys | Never store raw |

### 3.2 PII Handling

| Data Type | Storage | Access | Retention |
|-----------|---------|--------|-----------|
| Email | Encrypted | Auth users | Account lifetime |
| Phone | Encrypted | Auth users | Account lifetime |
| Address | Encrypted | Order context | 7 years (legal) |
| Payment | Via Stripe/SePay | Never stored | N/A |

### 3.3 Encryption Standards

| Context | Algorithm | Key Size |
|---------|-----------|----------|
| At Rest (DB) | AES-256-GCM | 256-bit |
| In Transit | TLS 1.3 | - |
| Passwords | Argon2id | - |
| Tokens | HS256/RS256 | 256-bit |

---

## 4. API Security

### 4.1 Authentication

All API endpoints require authentication except:
- `GET /api/products` (public catalog)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/webhooks/*` (signature verified)

### 4.2 Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Auth endpoints | 10 | 1 min |
| API (authenticated) | 100 | 1 min |
| API (unauthenticated) | 30 | 1 min |
| Webhooks | 1000 | 1 min |

### 4.3 Input Validation

```typescript
// REQUIRED for all endpoints
const schema = z.object({
  // Strict type validation
  id: z.string().uuid(),
  email: z.string().email().max(255),
  amount: z.number().positive().max(1_000_000_00), // cents

  // Sanitization
  name: z.string().trim().max(100),
  description: z.string().trim().max(1000),
});
```

### 4.4 CORS Policy

```typescript
// Production
{
  origin: ['https://app.astraler.com', 'https://admin.astraler.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}
```

---

## 5. Infrastructure Security

### 5.1 Environment Separation

| Environment | Access | Data |
|-------------|--------|------|
| Development | All devs | Fake/seeded |
| Staging | All devs | Anonymized prod |
| Production | Limited | Real |

### 5.2 Secret Management

| Secret Type | Storage | Rotation |
|-------------|---------|----------|
| API Keys | Env vars (Cloudflare) | 90 days |
| DB Credentials | Supabase managed | Automatic |
| JWT Secret | Env vars | 30 days |
| Webhook Secrets | Env vars | On compromise |

### 5.3 Logging Requirements

**Must Log:**
- Authentication events (success/failure)
- Authorization failures
- Data access (read/write)
- Admin actions
- API errors

**Never Log:**
- Passwords (even hashed)
- Full credit card numbers
- Session tokens
- API keys

---

## 6. Incident Response

### 6.1 Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| P0 | Critical breach | 15 min | Data leak, auth bypass |
| P1 | High risk | 1 hour | Vulnerability discovered |
| P2 | Medium risk | 24 hours | Suspicious activity |
| P3 | Low risk | 1 week | Policy violation |

### 6.2 Response Procedure

1. **Detect** - Identify and confirm incident
2. **Contain** - Limit damage (revoke access, isolate)
3. **Investigate** - Determine scope and cause
4. **Remediate** - Fix vulnerability
5. **Recover** - Restore normal operations
6. **Review** - Post-mortem, update procedures

### 6.3 Contact List

| Role | Contact | Escalation |
|------|---------|------------|
| On-call Dev | [Slack channel] | Immediate |
| Security Lead | [Email] | 15 min |
| Product Architect | [Email] | 30 min |

---

## 7. Compliance

### 7.1 Applicable Regulations

| Regulation | Scope | Status |
|------------|-------|--------|
| GDPR | EU users | Planned |
| PDPA (Vietnam) | VN users | Planned |
| PCI DSS | Payments | Via Stripe/SePay |

### 7.2 Required Controls

- [ ] Cookie consent banner
- [ ] Privacy policy page
- [ ] Data export capability
- [ ] Account deletion capability
- [ ] Breach notification procedure

---

## 8. Security Checklist

### Pre-Deploy

- [ ] All inputs validated
- [ ] No secrets in code
- [ ] Dependencies updated
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting enabled

### Periodic Review

- [ ] Dependency audit (weekly)
- [ ] Access review (monthly)
- [ ] Secret rotation (per schedule)
- [ ] Penetration test (quarterly)

---

**Cross-References:**
- Master Map: `01-architecture/master-map.md`
- Coding Standards: `02-standards/coding-standards.md`
- API Standards: `02-standards/api-standards.md`
