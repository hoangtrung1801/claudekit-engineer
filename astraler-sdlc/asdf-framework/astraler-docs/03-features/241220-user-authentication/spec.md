# User Authentication

> **Feature ID**: 241220-user-authentication
> **Status**: ✅ Implemented
> **Last Updated**: 241222 [Reverse Synced]

---

## 1. Overview

Implement core authentication functionality enabling users to register, login, and manage their sessions securely.

**Business Value**: Foundation for all user-facing features; blocks all other development until complete.

---

## 2. Requirements

### 2.1 Functional (MUST)

- [x] FR-001: User can register with email and password
- [x] FR-002: User can login with email and password
- [x] FR-003: User can logout (invalidate session)
- [x] FR-004: User can request password reset via email
- [x] FR-005: User can reset password with valid token
- [x] FR-006: System sends verification email on registration
- [x] FR-007: Access tokens refresh automatically

### 2.2 Non-Functional (SHOULD)

- [x] NFR-001: Login response < 500ms
- [x] NFR-002: Support 100 concurrent auth requests
- [ ] NFR-003: OAuth with Google (Deferred to v1.1)
- [x] NFR-004: Rate limit: 10 auth attempts/min/IP

### 2.3 Out of Scope

- OAuth providers (Google, GitHub) - v1.1
- MFA/2FA - v1.2
- Biometric authentication - Future

---

## 3. Technical Design

### 3.1 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────►│  API Route  │────►│  Supabase   │
│  (Next.js)  │◄────│  (Hono)     │◄────│    Auth     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Resend    │
                    │   (Email)   │
                    └─────────────┘
```

### 3.2 Token Strategy

<!-- Original: Custom JWT implementation -->
Using Supabase built-in JWT handling for simplicity and security.
[Reverse Synced: 241222]

| Token | Storage | Lifetime | Refresh |
|-------|---------|----------|---------|
| Access | Memory | 15 min | Auto via SDK |
| Refresh | HttpOnly Cookie | 7 days | On access expiry |

### 3.3 Key Files

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   └── api/auth/
│       └── [...supabase]/route.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── auth/
│       └── actions.ts
└── components/auth/
    ├── login-form.tsx
    ├── register-form.tsx
    └── password-reset-form.tsx
```

---

## 4. UI/UX

### 4.1 Screens

| Screen | Route | Auth Required |
|--------|-------|---------------|
| Login | `/login` | No |
| Register | `/register` | No |
| Forgot Password | `/forgot-password` | No |
| Reset Password | `/reset-password` | No (token required) |

### 4.2 Login Form

```
┌─────────────────────────────────────┐
│            🔐 Login                 │
├─────────────────────────────────────┤
│                                     │
│  Email                              │
│  ┌─────────────────────────────┐    │
│  │ you@example.com             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Password                           │
│  ┌─────────────────────────────┐    │
│  │ ••••••••                    │ 👁  │
│  └─────────────────────────────┘    │
│                                     │
│  [        Sign In        ]          │
│                                     │
│  Forgot password?                   │
│                                     │
│  ─────────── or ───────────         │
│                                     │
│  [ 🔵 Continue with Google ]        │  ← v1.1
│                                     │
│  Don't have an account? Sign up     │
└─────────────────────────────────────┘
```

### 4.3 States

| State | Behavior |
|-------|----------|
| Default | Form ready for input |
| Loading | Button disabled, spinner shown |
| Error | Inline error below field, toast for API errors |
| Success | Redirect to dashboard |

---

## 5. API Contract

### 5.1 Register

```typescript
// POST /api/auth/register
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

// Response 201
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "..." },
    "message": "Verification email sent"
  }
}

// Response 400
{
  "success": false,
  "error": {
    "code": "AUTH_EMAIL_EXISTS",
    "message": "Email already registered"
  }
}
```

### 5.2 Login

```typescript
// POST /api/auth/login
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "..." },
    "accessToken": "eyJ..."
  }
}
// + Set-Cookie: refresh_token=...; HttpOnly; Secure
```

---

## 6. Acceptance Criteria

- [x] AC-001: User can register with valid email/password and receives verification email
- [x] AC-002: User cannot register with existing email (shows error)
- [x] AC-003: User can login with correct credentials and is redirected to dashboard
- [x] AC-004: User sees error message with incorrect credentials
- [x] AC-005: User can request password reset and receives email within 1 minute
- [x] AC-006: User can reset password with valid token
- [x] AC-007: Expired/invalid reset tokens show appropriate error
- [x] AC-008: Logged-in user is redirected away from auth pages
- [x] AC-009: Session persists across page refreshes
- [x] AC-010: Logout clears session and redirects to login

---

## 7. Testing

### 7.1 Unit Tests

- [x] Validation schemas (email, password format)
- [x] Auth utility functions

### 7.2 Integration Tests

- [x] Register flow (success, duplicate email)
- [x] Login flow (success, wrong password, unverified)
- [x] Password reset flow

### 7.3 E2E Tests

- [ ] Full registration journey
- [ ] Full login journey
- [ ] Password reset journey

---

## 8. Implementation Notes

### 8.1 Decisions Made

| Decision | Rationale |
|----------|-----------|
| Supabase Auth over custom | Faster, more secure, maintained |
| Email verification required | Reduces spam accounts |
| 15min access token | Balance security/UX |

### 8.2 Known Issues

- Email delivery can be slow (Resend cold start)
- Google OAuth deferred due to scope complexity

---

## 9. Changelog

| Date | Change | By |
|------|--------|-----|
| 241220 | Spec created | PA |
| 241220 | Implementation started | AI |
| 241221 | Core auth complete | AI |
| 241222 | Email verification added | AI |
| 241222 | Reverse sync: updated token strategy | AI |

---

**Domain**: `02-domains/authentication/`
**Status**: ✅ Complete (OAuth pending)
