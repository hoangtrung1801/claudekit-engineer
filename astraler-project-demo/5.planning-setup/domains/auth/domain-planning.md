# Domain Planning: Auth

> **Reference:** [System Planning](../../system-planning.md)  
> **Phase:** 1 (Foundation)  
> **Priority:** P0 - Critical

---

## 1. Domain Overview

### 1.1 Domain Name & Scope

**Auth Domain** handles all authentication and authorization for the CompetitorIQ system.

**Scope:**
- User registration and login
- JWT token management
- Password hashing and security
- Role-Based Access Control (RBAC)
- Session management

**Out of Scope:**
- Social login (Google, GitHub) - Phase 4 optional
- Multi-factor authentication - Future consideration

### 1.2 Domain Objectives

| Objective | Success Criteria |
|-----------|------------------|
| Secure authentication | JWT-based, Argon2 password hashing |
| Role-based authorization | 5 roles: Admin, Founder, Marketing, Product, ASO |
| Session management | Token expiry, refresh logic |
| API protection | All endpoints protected by guards |

### 1.3 Domain Context

**Dependencies with other domains:**
- **Project Management:** Needs Auth to protect project APIs
- **Dashboard:** Needs RBAC to filter UI components
- **All Domains:** Depend on Auth guards

**Integration Points:**
- Frontend Login/Register pages
- API Middleware (Guards)
- Database (User model)

---

## 2. Features Breakdown

### 2.1 Feature List

| Feature ID | Feature Name | Priority | Complexity | Est. Points |
|------------|--------------|----------|------------|-------------|
| AUTH-01 | User Registration | P0 | Low | 3 |
| AUTH-02 | User Login | P0 | Low | 3 |
| AUTH-03 | JWT Token Management | P0 | Medium | 5 |
| AUTH-04 | Password Hashing (Argon2) | P0 | Low | 2 |
| AUTH-05 | RBAC Guards | P0 | Medium | 5 |
| AUTH-06 | Role Decorator | P0 | Low | 2 |
| AUTH-07 | Current User Decorator | P0 | Low | 1 |
| AUTH-08 | Logout & Session Clear | P1 | Low | 2 |
| AUTH-09 | Password Reset (Email) | P2 | Medium | 5 |
| AUTH-10 | Frontend Login Page | P0 | Medium | 5 |
| AUTH-11 | Frontend Auth Guards | P0 | Medium | 3 |
| **Total** | | | | **36 points** |

### 2.2 Feature Dependencies

```
AUTH-04 (Argon2) ─┐
                  ├──▶ AUTH-01 (Registration) ──▶ AUTH-10 (Login UI)
AUTH-03 (JWT)  ───┘                                      │
       │                                                 ▼
       └──────────▶ AUTH-02 (Login) ─────────▶ AUTH-11 (Auth Guards FE)
                           │
                           ▼
                    AUTH-05 (RBAC Guards)
                           │
                    ┌──────┴──────┐
                    ▼             ▼
             AUTH-06 (Role)  AUTH-07 (User)
```

### 2.3 Feature Estimates

| Feature | Backend | Frontend | Total |
|---------|---------|----------|-------|
| Registration + Login | 8 pts | 8 pts | 16 pts |
| JWT + Security | 7 pts | 0 pts | 7 pts |
| RBAC | 8 pts | 3 pts | 11 pts |
| Password Reset | 5 pts | 0 pts | 5 pts |
| **Total** | **28 pts** | **11 pts** | **39 pts** |

---

## 3. Tasks Breakdown

### 3.1 Backend Tasks

#### Setup & Configuration
- [ ] **AUTH-B01**: Setup Prisma User model with roles - 2h
- [ ] **AUTH-B02**: Install dependencies (passport, argon2, @nestjs/jwt) - 1h
- [ ] **AUTH-B03**: Configure JWT module with env variables - 2h

#### Authentication
- [ ] **AUTH-B04**: Create RegisterDto with validation - 1h
- [ ] **AUTH-B05**: Implement register service (hash password, create user) - 3h
- [ ] **AUTH-B06**: Create LoginDto - 1h
- [ ] **AUTH-B07**: Implement login service (validate, generate token) - 3h
- [ ] **AUTH-B08**: Create AuthController (register, login endpoints) - 2h

#### Authorization
- [ ] **AUTH-B09**: Implement JwtStrategy (passport-jwt) - 2h
- [ ] **AUTH-B10**: Create JwtAuthGuard - 1h
- [ ] **AUTH-B11**: Create RolesGuard for RBAC - 3h
- [ ] **AUTH-B12**: Create @Roles() decorator - 1h
- [ ] **AUTH-B13**: Create @CurrentUser() decorator - 1h
- [ ] **AUTH-B14**: Apply guards globally to protected routes - 2h

#### User Management
- [ ] **AUTH-B15**: Create UsersService (findByEmail, findById) - 2h
- [ ] **AUTH-B16**: Create profile endpoint (GET /auth/me) - 1h

### 3.2 Frontend Tasks

#### Setup
- [ ] **AUTH-F01**: Create auth store (Zustand) - 2h
- [ ] **AUTH-F02**: Setup API client with auth header interceptor - 2h

#### Pages & Components
- [ ] **AUTH-F03**: Create LoginPage component - 3h
- [ ] **AUTH-F04**: Create RegisterPage component (optional for MVP) - 2h
- [ ] **AUTH-F05**: Implement login form with validation - 2h
- [ ] **AUTH-F06**: Handle login/logout state in store - 2h

#### Guards & Routing
- [ ] **AUTH-F07**: Create ProtectedRoute wrapper - 2h
- [ ] **AUTH-F08**: Redirect to login on 401 - 1h
- [ ] **AUTH-F09**: Persist token in localStorage - 1h

### 3.3 Testing Tasks
- [ ] **AUTH-T01**: Unit tests for AuthService - 3h
- [ ] **AUTH-T02**: Unit tests for Guards - 2h
- [ ] **AUTH-T03**: E2E tests for auth flow - 3h

---

## 4. Timeline & Sprints

### 4.1 Sprint Breakdown

**Sprint 1 (Week 3-4): Auth Core**

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| Day 1-2 | AUTH-B01 to AUTH-B03 | Database + Config ready |
| Day 3-4 | AUTH-B04 to AUTH-B08 | Registration & Login APIs |
| Day 5-6 | AUTH-B09 to AUTH-B14 | Guards & Decorators |
| Day 7-8 | AUTH-F01 to AUTH-F06 | Frontend Login Page |
| Day 9-10 | AUTH-F07 to AUTH-F09, AUTH-T01-T03 | Guards & Tests |

### 4.2 Timeline Estimate

| Milestone | Duration | Week |
|-----------|----------|------|
| Backend Auth Complete | 5 days | Week 3 |
| Frontend Auth Complete | 3 days | Week 4 |
| Testing & Polish | 2 days | Week 4 |
| **Total** | **10 days** | **Week 3-4** |

### 4.3 Milestones

1. **M1: Auth API Ready** - Login/Register endpoints working
2. **M2: RBAC Active** - Guards protecting routes by role
3. **M3: Frontend Integrated** - Full auth flow working E2E

---

## 5. Resource Allocation

### 5.1 Team Assignment

| Role | Allocation | Tasks |
|------|------------|-------|
| Backend Developer | 70% | AUTH-B01 to AUTH-B16 |
| Frontend Developer | 30% | AUTH-F01 to AUTH-F09 |

### 5.2 Capacity Planning

- Backend: ~25 hours
- Frontend: ~17 hours
- Testing: ~8 hours
- **Total: ~50 hours (1.5 weeks)**

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies
- PostgreSQL database running
- Redis (optional for session store)
- Environment variables configured

### 6.2 Internal Dependencies
- Database schema must be finalized before AUTH-B01

### 6.3 Blockers
| Blocker | Mitigation |
|---------|------------|
| Database not ready | Use SQLite for local dev initially |
| JWT secret not configured | Document required env vars clearly |

---

## 7. Risk Assessment

### 7.1 Domain-Specific Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Token security issues | Low | High | Use industry-standard JWT library |
| Password storage vulnerability | Low | Critical | Use Argon2, never store plaintext |
| RBAC bypass | Medium | High | Thorough guard testing |

### 7.2 Contingency Plans

- If Argon2 has issues: Fallback to bcrypt
- If JWT refresh complexity: Start with simple expiry, add refresh later

---

## 8. Definition of Done

### 8.1 Feature Completion Criteria

- [ ] User can register with email/password
- [ ] User can login and receive JWT
- [ ] Invalid credentials return 401
- [ ] Protected routes require valid token
- [ ] Role-based access enforced
- [ ] Frontend login page functional
- [ ] Session persists across page refresh

### 8.2 Quality Gates

- [ ] All unit tests passing
- [ ] E2E auth flow tested
- [ ] No security vulnerabilities in dependencies
- [ ] Code reviewed and approved
- [ ] Documentation updated

---

## 9. API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login, get token | No |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/logout` | Invalidate session | Yes |
| POST | `/auth/forgot-password` | Request reset | No |
| POST | `/auth/reset-password` | Reset with token | No |

---

**Next Step:** Proceed to Feature Planning for critical features if needed, or start implementation.

