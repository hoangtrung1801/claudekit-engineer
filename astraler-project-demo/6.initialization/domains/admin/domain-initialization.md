# Domain Initialization: Admin

> **Reference:** [System Initialization](../../system-initialization.md)  
> **Phase:** 4 (Polish & Scale)  
> **Priority:** P3 - Low

---

## 1. Domain Structure Setup

### 1.1 Backend Folder Structure

```bash
# Create Admin module structure
mkdir -p backend/src/modules/admin/{controllers,services,dto,guards}

# Core files
touch backend/src/modules/admin/admin.module.ts

# Controllers
touch backend/src/modules/admin/controllers/admin-users.controller.ts
touch backend/src/modules/admin/controllers/admin-costs.controller.ts
touch backend/src/modules/admin/controllers/admin-health.controller.ts
touch backend/src/modules/admin/controllers/admin-logs.controller.ts

# Services
touch backend/src/modules/admin/services/user-admin.service.ts
touch backend/src/modules/admin/services/cost-tracking.service.ts
touch backend/src/modules/admin/services/system-health.service.ts
touch backend/src/modules/admin/services/system-logger.service.ts
touch backend/src/modules/admin/services/metrics.service.ts

# Guards
touch backend/src/modules/admin/guards/admin-role.guard.ts
```

### 1.2 Frontend Folder Structure

```bash
# Create Admin feature
mkdir -p frontend/src/features/admin/{components,hooks,pages}

touch frontend/src/features/admin/AdminLayout.tsx
touch frontend/src/features/admin/pages/AdminDashboard.tsx
touch frontend/src/features/admin/pages/UsersPage.tsx
touch frontend/src/features/admin/pages/CostsPage.tsx
touch frontend/src/features/admin/pages/HealthPage.tsx
touch frontend/src/features/admin/pages/LogsPage.tsx
touch frontend/src/features/admin/api.ts
touch frontend/src/features/admin/hooks/useAdminData.ts
```

---

## 2. Domain Configuration

### 2.1 Module Registration

Update `backend/src/app.module.ts`:

```typescript
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // ... existing imports
    AdminModule,
  ],
})
export class AppModule {}
```

---

## 3. Database Setup

### 3.1 System Models

Ensure in `backend/prisma/schema.prisma`:

```prisma
model SystemLog {
  id        String   @id @default(uuid())
  level     String   // INFO, WARN, ERROR
  module    String   // 'Crawler', 'Auth', 'AI'
  message   String
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([level])
  @@index([module])
  @@index([createdAt])
}

model SystemMetric {
  id        String   @id @default(uuid())
  name      String   // 'token_usage', 'api_calls', 'queue_depth'
  value     Float
  tags      Json?    // { provider: 'openai', endpoint: '/analysis' }
  timestamp DateTime @default(now())

  @@index([name, timestamp])
}

model TokenUsage {
  id               String   @id @default(uuid())
  date             DateTime @default(now()) @db.Date
  promptTokens     Int      @default(0)
  completionTokens Int      @default(0)
  totalTokens      Int      @default(0)
  estimatedCostUsd Float    @default(0)
  provider         String   @default("openai")

  @@unique([date, provider])
  @@index([date])
}
```

---

## 4. Module Setup

Create `backend/src/modules/admin/admin.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminCostsController } from './controllers/admin-costs.controller';
import { AdminHealthController } from './controllers/admin-health.controller';
import { AdminLogsController } from './controllers/admin-logs.controller';
import { UserAdminService } from './services/user-admin.service';
import { CostTrackingService } from './services/cost-tracking.service';
import { SystemHealthService } from './services/system-health.service';
import { SystemLoggerService } from './services/system-logger.service';
import { MetricsService } from './services/metrics.service';
import { AdminRoleGuard } from './guards/admin-role.guard';

@Module({
  controllers: [
    AdminUsersController,
    AdminCostsController,
    AdminHealthController,
    AdminLogsController,
  ],
  providers: [
    UserAdminService,
    CostTrackingService,
    SystemHealthService,
    SystemLoggerService,
    MetricsService,
    AdminRoleGuard,
  ],
  exports: [SystemLoggerService, MetricsService, CostTrackingService],
})
export class AdminModule {}
```

---

## 5. Guards

### 5.1 Admin Role Guard

Create `backend/src/modules/admin/guards/admin-role.guard.ts`:

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
```

---

## 6. Services

### 6.1 User Admin Service

Create `backend/src/modules/admin/services/user-admin.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class UserAdminService {
  constructor(private prisma: PrismaService) {}

  async findAll(options?: { page?: number; limit?: number }) {
    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { projects: true } },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        projects: { select: { id: true, name: true, createdAt: true } },
        _count: { select: { projects: true, notifications: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateRole(id: string, role: 'ADMIN' | 'USER') {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }

  async deactivate(id: string) {
    // Soft delete or mark as inactive
    // For now, we'll just return success
    // In production, you might want to add an 'isActive' field
    return { success: true, message: 'User deactivated' };
  }
}
```

### 6.2 Cost Tracking Service

Create `backend/src/modules/admin/services/cost-tracking.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

interface TokenUsageData {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

@Injectable()
export class CostTrackingService {
  // Pricing per 1M tokens (GPT-4o-mini as of 2024)
  private readonly pricing = {
    prompt: 0.15, // $0.15 per 1M input tokens
    completion: 0.60, // $0.60 per 1M output tokens
  };

  constructor(private prisma: PrismaService) {}

  async recordTokenUsage(data: TokenUsageData, provider = 'openai') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const estimatedCost = this.calculateCost(data);

    await this.prisma.tokenUsage.upsert({
      where: { date_provider: { date: today, provider } },
      create: {
        date: today,
        provider,
        ...data,
        estimatedCostUsd: estimatedCost,
      },
      update: {
        promptTokens: { increment: data.promptTokens },
        completionTokens: { increment: data.completionTokens },
        totalTokens: { increment: data.totalTokens },
        estimatedCostUsd: { increment: estimatedCost },
      },
    });
  }

  async getDailyCosts(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.tokenUsage.findMany({
      where: { date: { gte: startDate } },
      orderBy: { date: 'asc' },
    });
  }

  async getMonthlySummary() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usage = await this.prisma.tokenUsage.aggregate({
      where: { date: { gte: startOfMonth } },
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        estimatedCostUsd: true,
      },
    });

    return {
      month: startOfMonth.toISOString().substring(0, 7),
      totalTokens: usage._sum.totalTokens || 0,
      totalCostUsd: usage._sum.estimatedCostUsd || 0,
      breakdown: {
        promptTokens: usage._sum.promptTokens || 0,
        completionTokens: usage._sum.completionTokens || 0,
      },
    };
  }

  private calculateCost(data: TokenUsageData): number {
    const promptCost = (data.promptTokens / 1_000_000) * this.pricing.prompt;
    const completionCost = (data.completionTokens / 1_000_000) * this.pricing.completion;
    return promptCost + completionCost;
  }
}
```

### 6.3 System Health Service

Create `backend/src/modules/admin/services/system-health.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/database/prisma.service';

interface ComponentStatus {
  status: 'healthy' | 'degraded' | 'down';
  latencyMs?: number;
  message?: string;
}

@Injectable()
export class SystemHealthService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('crawl-queue') private crawlQueue: Queue,
    @InjectQueue('analysis-queue') private analysisQueue: Queue,
  ) {}

  async getHealth() {
    const [database, redis, queues] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkQueues(),
    ]);

    const components = { database, redis, queues };
    const allHealthy = Object.values(components).every((c) => c.status === 'healthy');

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      components,
      lastChecked: new Date().toISOString(),
    };
  }

  private async checkDatabase(): Promise<ComponentStatus> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', latencyMs: Date.now() - start };
    } catch (error) {
      return { status: 'down', message: error.message };
    }
  }

  private async checkRedis(): Promise<ComponentStatus> {
    try {
      // Queue connection implies Redis is working
      await this.crawlQueue.getJobCounts();
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'down', message: error.message };
    }
  }

  private async checkQueues(): Promise<ComponentStatus> {
    try {
      const [crawl, analysis] = await Promise.all([
        this.crawlQueue.getJobCounts(),
        this.analysisQueue.getJobCounts(),
      ]);

      const totalWaiting = crawl.waiting + analysis.waiting;
      const totalFailed = crawl.failed + analysis.failed;

      if (totalFailed > 100) {
        return { status: 'degraded', message: `${totalFailed} failed jobs` };
      }

      return {
        status: 'healthy',
        message: `${totalWaiting} waiting, ${totalFailed} failed`,
      };
    } catch (error) {
      return { status: 'down', message: error.message };
    }
  }

  async getQueueStats() {
    const [crawl, analysis] = await Promise.all([
      this.crawlQueue.getJobCounts(),
      this.analysisQueue.getJobCounts(),
    ]);

    return {
      crawlQueue: crawl,
      analysisQueue: analysis,
    };
  }
}
```

### 6.4 System Logger Service

Create `backend/src/modules/admin/services/system-logger.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

@Injectable()
export class SystemLoggerService {
  constructor(private prisma: PrismaService) {}

  async log(level: LogLevel, module: string, message: string, metadata?: any) {
    // Console output
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] [${module}] ${message}`);

    // Persist to database
    await this.prisma.systemLog.create({
      data: { level, module, message, metadata: metadata || {} },
    });
  }

  async info(module: string, message: string, metadata?: any) {
    await this.log('INFO', module, message, metadata);
  }

  async warn(module: string, message: string, metadata?: any) {
    await this.log('WARN', module, message, metadata);
  }

  async error(module: string, message: string, metadata?: any) {
    await this.log('ERROR', module, message, metadata);
  }

  async search(options: {
    level?: string;
    module?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { level, module, search, limit = 100, offset = 0 } = options;

    const where: any = {};
    if (level) where.level = level;
    if (module) where.module = module;
    if (search) where.message = { contains: search, mode: 'insensitive' };

    return this.prisma.systemLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}
```

---

## 7. Controllers

### 7.1 Admin Users Controller

Create `backend/src/modules/admin/controllers/admin-users.controller.ts`:

```typescript
import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { UserAdminService } from '../services/user-admin.service';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private userAdminService: UserAdminService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.userAdminService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  findOne(@Param('id') id: string) {
    return this.userAdminService.findOne(id);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  updateRole(@Param('id') id: string, @Body('role') role: 'ADMIN' | 'USER') {
    return this.userAdminService.updateRole(id, role);
  }
}
```

### 7.2 Admin Costs Controller

Create `backend/src/modules/admin/controllers/admin-costs.controller.ts`:

```typescript
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { CostTrackingService } from '../services/cost-tracking.service';

@ApiTags('Admin - Costs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('admin/costs')
export class AdminCostsController {
  constructor(private costTrackingService: CostTrackingService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily cost breakdown' })
  getDailyCosts(@Query('days') days?: number) {
    return this.costTrackingService.getDailyCosts(days || 30);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly summary' })
  getMonthlySummary() {
    return this.costTrackingService.getMonthlySummary();
  }
}
```

### 7.3 Admin Health Controller

Create `backend/src/modules/admin/controllers/admin-health.controller.ts`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { SystemHealthService } from '../services/system-health.service';

@ApiTags('Admin - Health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('admin/health')
export class AdminHealthController {
  constructor(private healthService: SystemHealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get system health' })
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get('queues')
  @ApiOperation({ summary: 'Get queue statistics' })
  getQueueStats() {
    return this.healthService.getQueueStats();
  }
}
```

---

## 8. Frontend Admin Pages

### 8.1 Admin Layout

Create `frontend/src/features/admin/AdminLayout.tsx`:

```typescript
import { Outlet, Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { Users, DollarSign, Activity, FileText, Settings } from 'lucide-react';

const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: Activity },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/costs', label: 'Costs', icon: DollarSign },
  { path: '/admin/logs', label: 'Logs', icon: FileText },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="h-16 flex items-center px-4 border-b">
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <nav className="p-4 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

---

## 9. Verification Checklist

### Backend
- [ ] AdminModule registered
- [ ] AdminRoleGuard working
- [ ] User management APIs
- [ ] Cost tracking APIs
- [ ] Health check APIs
- [ ] System logs APIs

### Frontend
- [ ] Admin layout
- [ ] Dashboard page
- [ ] Users list page
- [ ] Costs chart page
- [ ] Logs viewer page

### Security
- [ ] Admin-only access
- [ ] Audit logging
- [ ] Sensitive data protected

---

## 10. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| GET | `/admin/users/:id` | Get user details |
| PATCH | `/admin/users/:id/role` | Update user role |
| GET | `/admin/costs/daily` | Daily cost breakdown |
| GET | `/admin/costs/monthly` | Monthly summary |
| GET | `/admin/health` | System health check |
| GET | `/admin/health/queues` | Queue statistics |
| GET | `/admin/logs` | Search system logs |

---

## 11. Admin Routes

```
/admin
├── /                → Admin Dashboard
├── /users           → User Management
│   └── /:id         → User Details
├── /costs           → Cost Monitoring
├── /health          → System Health
├── /logs            → Error Logs
└── /settings        → System Settings
```

---

**Initialization Complete!**

All 8 domains have been initialized. The project is now ready for implementation.

