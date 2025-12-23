# Domain Initialization: Dashboard

> **Reference:** [System Initialization](../../system-initialization.md)  
> **Phase:** 1-4 (Cross-cutting)  
> **Priority:** P1 - High

---

## 1. Domain Structure Setup

### 1.1 Frontend Folder Structure

```bash
# Create Layout components
mkdir -p frontend/src/components/layout

touch frontend/src/components/layout/MainLayout.tsx
touch frontend/src/components/layout/Sidebar.tsx
touch frontend/src/components/layout/Header.tsx
touch frontend/src/components/layout/RightPanel.tsx
touch frontend/src/components/layout/ProjectLayout.tsx

# Create Shared components
mkdir -p frontend/src/components/shared

touch frontend/src/components/shared/KPICard.tsx
touch frontend/src/components/shared/DataTable.tsx
touch frontend/src/components/shared/ChartCard.tsx
touch frontend/src/components/shared/EmptyState.tsx
touch frontend/src/components/shared/LoadingSkeleton.tsx
touch frontend/src/components/shared/InsightCard.tsx
touch frontend/src/components/shared/FilterPanel.tsx

# Create Dashboard features
mkdir -p frontend/src/features/dashboard/{components,hooks}

touch frontend/src/features/dashboard/OverviewPage.tsx
touch frontend/src/features/dashboard/components/ActivityFeed.tsx
touch frontend/src/features/dashboard/components/SummaryCards.tsx
touch frontend/src/features/dashboard/hooks/useDashboard.ts
```

### 1.2 Backend Folder Structure (Aggregation APIs)

```bash
# Create Dashboard module for aggregation APIs
mkdir -p backend/src/modules/dashboard/{controllers,services,dto}

touch backend/src/modules/dashboard/dashboard.module.ts
touch backend/src/modules/dashboard/controllers/dashboard.controller.ts
touch backend/src/modules/dashboard/services/dashboard.service.ts
touch backend/src/modules/dashboard/dto/dashboard.dto.ts
```

---

## 2. Domain Configuration

### 2.1 UI Store Configuration

Create `frontend/src/stores/ui.store.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      rightPanelOpen: true,
      theme: 'light',
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-storage' }
  )
);
```

### 2.2 Router Configuration

Create `frontend/src/app/router.tsx`:

```typescript
import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectLayout } from '@/components/layout/ProjectLayout';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProjectsPage } from '@/features/projects/ProjectsPage';
import { OverviewPage } from '@/features/dashboard/OverviewPage';
import { CompetitorsPage } from '@/features/competitors/CompetitorsPage';
// Import other pages as they're created

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Protected routes with layout
const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main',
  component: MainLayout,
});

const projectsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/projects',
  component: ProjectsPage,
});

// Project-scoped routes
const projectLayoutRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/projects/$projectId',
  component: ProjectLayout,
});

const overviewRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/overview',
  component: OverviewPage,
});

const competitorsRoute = createRoute({
  getParentRoute: () => projectLayoutRoute,
  path: '/competitors',
  component: CompetitorsPage,
});

// Add more routes as needed...

const routeTree = rootRoute.addChildren([
  loginRoute,
  mainLayoutRoute.addChildren([
    projectsRoute,
    projectLayoutRoute.addChildren([
      overviewRoute,
      competitorsRoute,
      // Add more project routes...
    ]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
```

---

## 3. Layout Components

### 3.1 Main Layout

Create `frontend/src/components/layout/MainLayout.tsx`:

```typescript
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';

export function MainLayout() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
```

### 3.2 Project Layout

Create `frontend/src/components/layout/ProjectLayout.tsx`:

```typescript
import { Outlet, useParams } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RightPanel } from './RightPanel';
import { useUIStore } from '@/stores/ui.store';
import { useProject } from '@/features/projects/api';
import { cn } from '@/lib/utils';

export function ProjectLayout() {
  const { projectId } = useParams({ from: '/projects/$projectId' });
  const { data: project } = useProject(projectId);
  const { sidebarCollapsed, rightPanelOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} projectId={projectId} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header project={project} />
        
        <div className="flex-1 flex overflow-hidden">
          <main className={cn(
            "flex-1 overflow-auto p-6",
            rightPanelOpen && "mr-80"
          )}>
            <Outlet />
          </main>
          
          {rightPanelOpen && (
            <RightPanel projectId={projectId} />
          )}
        </div>
      </div>
    </div>
  );
}
```

### 3.3 Sidebar

Create `frontend/src/components/layout/Sidebar.tsx`:

```typescript
import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui.store';
import {
  LayoutDashboard,
  Users,
  Video,
  MessageSquare,
  Share2,
  AdsClick,
  Lightbulb,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  projectId: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: 'overview' },
  { icon: Users, label: 'Competitors', path: 'competitors' },
  { icon: Share2, label: 'Social', path: 'social' },
  { icon: AdsClick, label: 'Video Ads', path: 'video-ads' },
  { icon: Video, label: 'Video Organic', path: 'video-organic' },
  { icon: MessageSquare, label: 'Reviews', path: 'reviews' },
  { icon: Lightbulb, label: 'AI Insights', path: 'ai-insights' },
  { icon: Bell, label: "What's New", path: 'whats-new' },
];

export function Sidebar({ collapsed, projectId }: SidebarProps) {
  const location = useLocation();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "bg-card border-r flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <span className="font-bold text-lg">CompetitorIQ</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-accent rounded-lg"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={`/projects/${projectId}/${item.path}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t py-4">
        <Link
          to={`/projects/${projectId}/settings`}
          className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg hover:bg-accent"
        >
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
```

### 3.4 Header

Create `frontend/src/components/layout/Header.tsx`:

```typescript
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, PanelRight, LogOut, User } from 'lucide-react';

interface HeaderProps {
  project?: { name: string; iconUrl?: string } | null;
}

export function Header({ project }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const toggleRightPanel = useUIStore((s) => s.toggleRightPanel);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {project && (
          <>
            {project.iconUrl && (
              <img src={project.iconUrl} alt="" className="w-8 h-8 rounded" />
            )}
            <h1 className="font-semibold text-lg">{project.name}</h1>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleRightPanel}>
          <PanelRight size={20} />
        </Button>

        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

---

## 4. Shared Components

### 4.1 KPI Card

Create `frontend/src/components/shared/KPICard.tsx`:

```typescript
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  className,
}: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {isPositive && <TrendingUp className="h-4 w-4 text-green-500" />}
                {isNegative && <TrendingDown className="h-4 w-4 text-red-500" />}
                {!isPositive && !isNegative && <Minus className="h-4 w-4 text-gray-400" />}
                <span
                  className={cn(
                    "text-sm",
                    isPositive && "text-green-500",
                    isNegative && "text-red-500"
                  )}
                >
                  {isPositive && "+"}
                  {change}%
                </span>
                {changeLabel && (
                  <span className="text-sm text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4.2 Empty State

Create `frontend/src/components/shared/EmptyState.tsx`:

```typescript
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="rounded-full bg-muted p-4 mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
```

### 4.3 Loading Skeleton

Create `frontend/src/components/shared/LoadingSkeleton.tsx`:

```typescript
import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-6">
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-8 w-1/2 mb-4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}
```

---

## 5. Dashboard Pages

### 5.1 Overview Page

Create `frontend/src/features/dashboard/OverviewPage.tsx`:

```typescript
import { useParams } from '@tanstack/react-router';
import { useCompetitors } from '@/features/competitors/api';
import { KPICard } from '@/components/shared/KPICard';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageSkeleton } from '@/components/shared/LoadingSkeleton';
import { ActivityFeed } from './components/ActivityFeed';
import { SummaryCards } from './components/SummaryCards';
import { Users, Video, MessageSquare, TrendingUp } from 'lucide-react';

export function OverviewPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' });
  const { data: competitors, isLoading } = useCompetitors(projectId);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!competitors?.length) {
    return (
      <EmptyState
        icon={Users}
        title="No competitors yet"
        description="Add your first competitor to start tracking and analyzing their performance."
        action={{
          label: "Add Competitor",
          onClick: () => {/* Navigate to competitors */},
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Competitors"
          value={competitors.length}
          icon={<Users size={24} />}
        />
        <KPICard
          title="Videos Tracked"
          value="--"
          change={0}
          changeLabel="vs last week"
          icon={<Video size={24} />}
        />
        <KPICard
          title="Reviews Analyzed"
          value="--"
          change={0}
          changeLabel="vs last week"
          icon={<MessageSquare size={24} />}
        />
        <KPICard
          title="Hero Videos"
          value="--"
          icon={<TrendingUp size={24} />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed projectId={projectId} />
        </div>
        <div>
          <SummaryCards projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Backend Aggregation API

### 6.1 Dashboard Module

Create `backend/src/modules/dashboard/dashboard.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
```

### 6.2 Dashboard Service

Create `backend/src/modules/dashboard/services/dashboard.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverviewStats(projectId: string) {
    const [competitors, videos, reviews] = await Promise.all([
      this.prisma.competitor.count({ where: { projectId } }),
      this.prisma.video.count({ where: { projectId } }),
      this.prisma.review.count({
        where: { competitor: { projectId } },
      }),
    ]);

    const heroVideos = await this.prisma.video.count({
      where: { projectId, heroScore: { gte: 20 } },
    });

    return {
      competitors,
      videos,
      reviews,
      heroVideos,
    };
  }

  async getActivityFeed(projectId: string, limit = 20) {
    // Fetch recent activities across different entities
    const [videos, updates, reviews] = await Promise.all([
      this.prisma.video.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { socialChannel: { include: { competitor: true } } },
      }),
      this.prisma.appUpdate.findMany({
        where: { competitor: { projectId } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { competitor: true },
      }),
      this.prisma.review.findMany({
        where: { competitor: { projectId } },
        orderBy: { postedAt: 'desc' },
        take: limit,
        include: { competitor: true },
      }),
    ]);

    // Merge and sort by date
    const activities = [
      ...videos.map((v) => ({ type: 'video', data: v, date: v.createdAt })),
      ...updates.map((u) => ({ type: 'update', data: u, date: u.createdAt })),
      ...reviews.map((r) => ({ type: 'review', data: r, date: r.postedAt })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);

    return activities;
  }
}
```

---

## 7. Verification Checklist

### Layout
- [ ] MainLayout renders with auth check
- [ ] ProjectLayout with sidebar, header, content
- [ ] Sidebar navigation working
- [ ] Header with user menu
- [ ] Right panel toggle working
- [ ] Responsive on mobile

### Components
- [ ] KPICard displays correctly
- [ ] EmptyState with action
- [ ] LoadingSkeleton components
- [ ] All Shadcn UI components installed

### Router
- [ ] TanStack Router configured
- [ ] Protected routes working
- [ ] Project-scoped routes working
- [ ] Navigation state preserved

### Stores
- [ ] UI store persisting
- [ ] Project store working
- [ ] Theme toggle functional

---

## 8. Screen Roadmap

| Screen | Phase | Status |
|--------|-------|--------|
| Projects List | 1 | ⬜ |
| Overview | 1 | ⬜ |
| Competitors | 1 | ⬜ |
| Videos Library | 2 | ⬜ |
| Channels | 2 | ⬜ |
| AI Insights | 3 | ⬜ |
| Reviews | 3 | ⬜ |
| What's New | 3 | ⬜ |
| ASO | 4 | ⬜ |
| Marketing | 4 | ⬜ |
| Info | 4 | ⬜ |

---

**Next Step:** Proceed to Data Collection Domain Initialization.

