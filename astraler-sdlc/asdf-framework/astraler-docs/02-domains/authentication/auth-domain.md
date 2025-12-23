# Authentication Domain

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Status**: Active

---

## 1. Domain Purpose

Manage user identity, authentication, and session lifecycle across all platform applications.

---

## 2. Business Rules

### 2.1 Identity Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| AUTH-001 | Email must be unique per account | DB constraint |
| AUTH-002 | Email must be verified before full access | Application |
| AUTH-003 | Password minimum 8 chars with complexity | Validation |
| AUTH-004 | Account lockout after 5 failed attempts | Application |
| AUTH-005 | Users can have multiple OAuth providers | Application |

### 2.2 Session Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| AUTH-010 | Access tokens expire in 15 minutes | JWT exp claim |
| AUTH-011 | Refresh tokens expire in 7 days | DB + JWT |
| AUTH-012 | Max 5 concurrent sessions per user | Application |
| AUTH-013 | Session invalidated on password change | Application |
| AUTH-014 | Admin sessions require re-auth after 1h | Application |

---

## 3. Entities

### 3.1 User

```typescript
interface User {
  id: string;           // UUID
  email: string;        // Unique, lowercase
  emailVerified: boolean;
  passwordHash?: string; // Null for OAuth-only
  role: 'customer' | 'staff' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
```

### 3.2 Session

```typescript
interface Session {
  id: string;
  userId: string;
  refreshToken: string;  // Hashed
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
}
```

### 3.3 OAuthAccount

```typescript
interface OAuthAccount {
  id: string;
  userId: string;
  provider: 'google' | 'github';
  providerAccountId: string;
  accessToken?: string;  // Encrypted
  refreshToken?: string; // Encrypted
  expiresAt?: Date;
}
```

---

## 4. State Machine

### 4.1 Account States

```
                    ┌─────────────┐
                    │   Created   │
                    └──────┬──────┘
                           │ verify email
                           ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Suspended  │◄────│   Active    │────►│   Deleted   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   ▲
       │                   │
       └───────────────────┘
           reactivate
```

### 4.2 Session States

```
Created → Active → Expired
              ↓
           Revoked
```

---

## 5. Integration Points

### 5.1 Inbound

| Source | Event | Action |
|--------|-------|--------|
| API Gateway | Request | Validate token |
| Webhook | OAuth callback | Create/link account |

### 5.2 Outbound

| Target | Event | Payload |
|--------|-------|---------|
| Notifications | User registered | `{ userId, email }` |
| Notifications | Password reset | `{ userId, email, token }` |
| Analytics | Login success | `{ userId, method, timestamp }` |

---

## 6. API Contracts

### 6.1 Public Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Authenticate |
| POST | `/auth/logout` | End session |
| POST | `/auth/refresh` | Refresh tokens |
| POST | `/auth/forgot-password` | Request reset |
| POST | `/auth/reset-password` | Complete reset |
| GET | `/auth/verify-email` | Verify email |

### 6.2 Protected Endpoints

| Method | Endpoint | Purpose | Role |
|--------|----------|---------|------|
| GET | `/auth/me` | Current user | Any |
| PATCH | `/auth/me` | Update profile | Any |
| POST | `/auth/change-password` | Change password | Any |
| GET | `/auth/sessions` | List sessions | Any |
| DELETE | `/auth/sessions/:id` | Revoke session | Any |

---

## 7. Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `AUTH_EMAIL_NOT_VERIFIED` | 403 | Email verification required |
| `AUTH_ACCOUNT_SUSPENDED` | 403 | Account suspended |
| `AUTH_ACCOUNT_LOCKED` | 423 | Too many failed attempts |
| `AUTH_TOKEN_EXPIRED` | 401 | Token needs refresh |
| `AUTH_TOKEN_INVALID` | 401 | Token malformed/tampered |
| `AUTH_SESSION_REVOKED` | 401 | Session invalidated |

---

## 8. Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Supabase Auth | External | Core auth provider |
| Notifications | Internal | Email delivery |
| Database | Internal | User/session storage |

---

**Related Features:**
- `03-features/241220-user-authentication/`
