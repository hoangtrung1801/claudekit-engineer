# API Architecture Patterns: Role-Based Access

> **Document:** API Architecture Decision  
> **Status:** Design Recommendation  
> **Last Updated:** December 2024

---

## Problem Statement

With multiple roles (USER, ADMIN, and potentially more roles in the future), we need a pattern to handle API access control without having to create separate API sets for each role.

---

## Current Approach: Separate APIs

**Pattern:** `/api/projects/:id/...` vs `/api/admin/...`

**Pros:**
- ✅ Simple and clear separation
- ✅ Easy to understand
- ✅ Clear security boundaries

**Cons:**
- ❌ Not scalable (each role = 1 API set)
- ❌ Code duplication
- ❌ Hard to maintain when there are many roles

---

## Recommended Approach: Unified API with Role-Aware Logic

### Pattern 1: Single API with Role-Based Guards (Recommended)

**Principle:** One endpoint, guard/service automatically handles based on user role.

**Structure:**
```
/api/projects/:projectId/spy-keywords  ← Same endpoint for all roles
/api/projects/:projectId/ads           ← Same endpoint for all roles
```

**Implementation:**

```typescript
// 1. Role-Aware Guard
@Injectable()
export class ProjectAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.projectId;

    // Admin: always allowed
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Other roles: check ownership
    if (projectId) {
      return this.checkProjectOwnership(projectId, user.id);
    }

    return true;
  }
}

// 2. Unified Controller
@Controller('projects/:projectId/spy-keywords')
@UseGuards(JwtAuthGuard, ProjectAccessGuard)
export class SpyKeywordsController {
  constructor(private spyKeywordsService: SpyKeywordsService) {}

  @Get()
  async findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
    @Query() query: SpyKeywordQueryDto,
  ) {
    // Service handles role-based logic internally
    return this.spyKeywordsService.findAll(projectId, user, query);
  }
}

// 3. Role-Aware Service
@Injectable()
export class SpyKeywordsService {
  async findAll(projectId: string, user: User, query: SpyKeywordQueryDto) {
    const where: Prisma.SpyKeywordWhereInput = { projectId };

    // Admin: can filter by project, no ownership check needed
    // User: automatically filtered to own projects (guard already checked)
    
    // Additional filters based on role
    if (user.role !== Role.ADMIN && query.projectId) {
      // Users can only query their own projects (already enforced by guard)
      // But if query has projectId, we can validate it matches
    }

    return this.prisma.spyKeyword.findMany({ where, ...query });
  }
}
```

**Benefits:**
- ✅ Single source of truth (one endpoint)
- ✅ Role logic centralized in service
- ✅ Easy to add new roles (just update service logic)
- ✅ Consistent URL structure
- ✅ No code duplication

---

### Pattern 2: Hybrid Approach (Current + Recommended)

**Principle:** 
- User-scoped resources: Use unified API (`/api/projects/:id/...`)
- System-wide admin operations: Keep separate admin APIs (`/api/admin/...`)

**When to use Admin API:**
- ✅ List all resources across all projects (system-wide)
- ✅ Operations that don't fit project-scoped pattern
- ✅ Admin-specific features (user management, system config)

**When to use Unified API:**
- ✅ Project-scoped operations (CRUD on project resources)
- ✅ Operations that work the same way for all roles (just different access level)

**Example:**

```typescript
// Unified API (for project-scoped operations)
GET  /api/projects/:projectId/spy-keywords       // All roles (guard checks access)
POST /api/projects/:projectId/spy-keywords       // All roles
GET  /api/projects/:projectId/spy-keywords/:id   // All roles

// Admin API (for system-wide operations)
GET  /api/admin/spy-keywords                     // Admin only: list ALL across projects
GET  /api/admin/spy-keywords/stats               // Admin only: system-wide stats
```

**Benefits:**
- ✅ Best of both worlds
- ✅ Clear separation for system-wide vs project-scoped
- ✅ Reduces duplication while keeping flexibility

---

### Pattern 3: Query Parameter Approach

**Alternative:** Use query params to enable admin mode.

```typescript
GET /api/projects/:projectId/spy-keywords?admin=true
GET /api/spy-keywords?admin=true&projectId=optional
```

**Not Recommended:**
- ❌ Less clear
- ❌ Security concerns (easy to abuse)
- ❌ Inconsistent URL structure

---

## Recommended Strategy for This System

### Use Hybrid Approach (Pattern 2)

**Rules:**

1. **Project-Scoped Resources** → Unified API with Role-Aware Guard
   - `/api/projects/:projectId/spy-keywords`
   - `/api/projects/:projectId/ads`
   - Guard checks: Admin bypasses ownership, Users require ownership

2. **System-Wide Admin Operations** → Separate Admin API
   - `/api/admin/spy-keywords` (list ALL across projects)
   - `/api/admin/users` (user management)
   - `/api/admin/system/*` (system config)

3. **Future Roles:**
   - Add role checks in guards
   - Update service logic based on role
   - NO need for new API endpoints

---

## Migration Path (If Needed)

### Step 1: Update Guards to be Role-Aware

```typescript
// Before (User only)
@UseGuards(JwtAuthGuard, ProjectOwnershipGuard)

// After (Role-aware)
@UseGuards(JwtAuthGuard, ProjectAccessGuard) // Handles all roles
```

### Step 2: Update Services to Handle Roles

```typescript
// Service method accepts user object
async findAll(projectId: string, user: User) {
  // Role-based logic inside
  if (user.role === Role.ADMIN) {
    // Admin logic
  } else {
    // User logic
  }
}
```

### Step 3: Keep Admin APIs for System-Wide Operations

- Only keep admin APIs that truly need system-wide access
- Other operations migrate to unified API

---

## Future Roles Support

When adding a new role (e.g., MANAGER, VIEWER):

### Option A: Extend Guard Logic

```typescript
async canActivate(context: ExecutionContext): Promise<boolean> {
  const user = request.user;
  
  switch (user.role) {
    case Role.ADMIN:
      return true; // Full access
    case Role.MANAGER:
      return this.checkManagerAccess(projectId, user.id);
    case Role.VIEWER:
      return this.checkViewerAccess(projectId, user.id);
    case Role.USER:
      return this.checkOwnership(projectId, user.id);
  }
}
```

### Option B: Permission-Based System

```typescript
// More flexible: define permissions per role
const permissions = {
  ADMIN: ['read:all', 'write:all'],
  MANAGER: ['read:assigned', 'write:assigned'],
  USER: ['read:own', 'write:own'],
  VIEWER: ['read:own'],
};

// Guard checks permissions
if (hasPermission(user.role, 'read:all')) {
  return true;
}
```

---

## Best Practices

1. **Default to Unified API:**
   - Start with unified API pattern
   - Only create admin API when truly needed (system-wide operations)

2. **Centralize Role Logic:**
   - Put role-based logic in services, not controllers
   - Guards handle access control
   - Services handle business logic based on role

3. **Document Access Patterns:**
   - Document which roles can access which endpoints
   - Use decorators to make it clear: `@RequiresRole([Role.ADMIN, Role.MANAGER])`

4. **Test Role Scenarios:**
   - Unit test service methods with different roles
   - Integration test guards with different roles
   - E2E test API endpoints with different roles

---

## Summary

**Current State:** Separate APIs (`/api/projects/...` vs `/api/admin/...`)

**Recommended:** Hybrid Approach
- Unified API for project-scoped operations (with role-aware guards)
- Admin API only for system-wide operations

**Future-Proof:** When adding new roles, extend guard/service logic, NOT create new API endpoints.

