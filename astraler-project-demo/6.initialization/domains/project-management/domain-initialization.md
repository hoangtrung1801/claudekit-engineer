# Domain Initialization: Project Management

> **Reference:** [System Initialization](../../system-initialization.md)  
> **Phase:** 1 (Foundation)  
> **Priority:** P0 - Critical

---

## 1. Domain Structure Setup

### 1.1 Backend Folder Structure

```bash
# Create Project Management module structure
mkdir -p backend/src/modules/project-management/{controllers,services,dto,events}

# Create files
touch backend/src/modules/project-management/project-management.module.ts
touch backend/src/modules/project-management/controllers/project.controller.ts
touch backend/src/modules/project-management/controllers/competitor.controller.ts
touch backend/src/modules/project-management/controllers/social-channel.controller.ts
touch backend/src/modules/project-management/services/project.service.ts
touch backend/src/modules/project-management/services/competitor.service.ts
touch backend/src/modules/project-management/services/social-channel.service.ts
touch backend/src/modules/project-management/dto/create-project.dto.ts
touch backend/src/modules/project-management/dto/update-project.dto.ts
touch backend/src/modules/project-management/dto/add-competitor.dto.ts
touch backend/src/modules/project-management/dto/add-social-channel.dto.ts
touch backend/src/modules/project-management/dto/add-landing-page.dto.ts
touch backend/src/modules/project-management/dto/index.ts
touch backend/src/modules/project-management/events/project.events.ts
```

### 1.2 Frontend Folder Structure

```bash
# Create Projects feature structure
mkdir -p frontend/src/features/projects/{components,hooks}
mkdir -p frontend/src/features/competitors/{components,hooks}

# Projects feature
touch frontend/src/features/projects/ProjectsPage.tsx
touch frontend/src/features/projects/api.ts
touch frontend/src/features/projects/components/ProjectCard.tsx
touch frontend/src/features/projects/components/AddProjectModal.tsx
touch frontend/src/features/projects/hooks/useProjects.ts

# Competitors feature
touch frontend/src/features/competitors/CompetitorsPage.tsx
touch frontend/src/features/competitors/api.ts
touch frontend/src/features/competitors/components/CompetitorTable.tsx
touch frontend/src/features/competitors/components/AddCompetitorModal.tsx
touch frontend/src/features/competitors/components/SocialChannelsSection.tsx
touch frontend/src/features/competitors/hooks/useCompetitors.ts

# Project store
touch frontend/src/stores/project.store.ts
```

---

## 2. Domain Configuration

### 2.1 Install Event Emitter

```bash
cd backend
npm install @nestjs/event-emitter
```

### 2.2 Module Registration

Update `backend/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectManagementModule } from './modules/project-management/project-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProjectManagementModule,
  ],
})
export class AppModule {}
```

---

## 3. Database Setup

### 3.1 Prisma Schema Updates

The models are already defined in System Initialization. Ensure these exist in `backend/prisma/schema.prisma`:

```prisma
model Project {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  description String?  @db.Text
  category    String?
  region      String   @default("US")
  storeUrl    String?
  iconUrl     String?
  createdAt   DateTime @default(now())

  competitors  Competitor[]
  videos       Video[]
  socialPosts  SocialPost[]
  keywords     Keyword[]
  screenshots  ProjectScreenshot[]
  updates      ProjectUpdate[]
  analyses     AnalysisResult[]

  @@unique([userId, storeUrl])
  @@index([userId])
}

model Competitor {
  id            String   @id @default(uuid())
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  name          String
  storeUrl      String
  iconUrl       String
  developerName String?
  storeCategory String?

  landingPages   LandingPage[]
  socialChannels SocialChannel[]
  reviews        Review[]
  appUpdates     AppUpdate[]

  @@unique([projectId, storeUrl])
  @@index([projectId])
}

model LandingPage {
  id           String     @id @default(uuid())
  competitorId String
  competitor   Competitor @relation(fields: [competitorId], references: [id], onDelete: Cascade)
  url          String
  status       String     @default("ACTIVE")
  lastScanned  DateTime?

  @@index([competitorId])
}

enum SocialPlatform {
  TIKTOK
  YOUTUBE
  INSTAGRAM
  FACEBOOK
  X
}

model SocialChannel {
  id           String         @id @default(uuid())
  competitorId String
  competitor   Competitor     @relation(fields: [competitorId], references: [id], onDelete: Cascade)
  platform     SocialPlatform
  platformId   String
  handle       String?
  displayName  String
  profileUrl   String
  avatarUrl    String?
  bio          String?        @db.Text
  isVerified   Boolean        @default(false)
  createdAt    DateTime       @default(now())

  snapshots SocialChannelSnapshot[]
  videos    Video[]
  posts     SocialPost[]

  @@unique([platform, platformId])
  @@index([competitorId])
  @@index([competitorId, platform])
}
```

### 3.2 Migration

```bash
cd backend
npx prisma migrate dev --name add_project_management
npx prisma generate
```

---

## 4. API Setup

### 4.1 Module

Create `backend/src/modules/project-management/project-management.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { CompetitorController } from './controllers/competitor.controller';
import { SocialChannelController } from './controllers/social-channel.controller';
import { ProjectService } from './services/project.service';
import { CompetitorService } from './services/competitor.service';
import { SocialChannelService } from './services/social-channel.service';

@Module({
  controllers: [ProjectController, CompetitorController, SocialChannelController],
  providers: [ProjectService, CompetitorService, SocialChannelService],
  exports: [ProjectService, CompetitorService, SocialChannelService],
})
export class ProjectManagementModule {}
```

### 4.2 DTOs

Create `backend/src/modules/project-management/dto/create-project.dto.ts`:

```typescript
import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Meditation App Analysis' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'Health & Fitness', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  storeUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}
```

Create `backend/src/modules/project-management/dto/add-competitor.dto.ts`:

```typescript
import { IsString, IsUrl, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCompetitorDto {
  @ApiProperty({ example: 'https://apps.apple.com/app/calm/id571800810' })
  @IsUrl()
  storeUrl: string;

  @ApiProperty({ example: 'Calm', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}
```

Create `backend/src/modules/project-management/dto/add-social-channel.dto.ts`:

```typescript
import { IsEnum, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum SocialPlatform {
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  X = 'X',
}

export class AddSocialChannelDto {
  @ApiProperty({ enum: SocialPlatform })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @ApiProperty({ example: 'https://tiktok.com/@calm' })
  @IsUrl()
  profileUrl: string;

  @ApiProperty({ example: '@calm', required: false })
  @IsOptional()
  @IsString()
  handle?: string;
}
```

### 4.3 Services

Create `backend/src/modules/project-management/services/project.service.ts`:

```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/database/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        userId,
        ...dto,
      },
    });

    this.eventEmitter.emit('project.created', { projectId: project.id, userId });
    return project;
  }

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        _count: { select: { competitors: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        competitors: {
          include: {
            socialChannels: true,
          },
        },
        keywords: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    await this.findOne(id, userId); // Verify ownership

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Verify ownership

    await this.prisma.project.delete({ where: { id } });
    this.eventEmitter.emit('project.deleted', { projectId: id });
    return { success: true };
  }
}
```

Create `backend/src/modules/project-management/services/competitor.service.ts`:

```typescript
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/database/prisma.service';
import { AddCompetitorDto } from '../dto/add-competitor.dto';

@Injectable()
export class CompetitorService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async add(projectId: string, dto: AddCompetitorDto) {
    // Validate URL format
    if (!this.isValidStoreUrl(dto.storeUrl)) {
      throw new BadRequestException('Invalid store URL. Must be App Store or Play Store URL.');
    }

    // Check if already exists
    const existing = await this.prisma.competitor.findUnique({
      where: { projectId_storeUrl: { projectId, storeUrl: dto.storeUrl } },
    });

    if (existing) {
      throw new ConflictException('Competitor already added to this project');
    }

    // Extract name from URL if not provided
    const name = dto.name || this.extractAppNameFromUrl(dto.storeUrl);

    const competitor = await this.prisma.competitor.create({
      data: {
        projectId,
        name,
        storeUrl: dto.storeUrl,
        iconUrl: dto.iconUrl || '',
      },
    });

    // Emit event for downstream processing (crawling)
    this.eventEmitter.emit('competitor.added', {
      competitorId: competitor.id,
      projectId,
      storeUrl: dto.storeUrl,
    });

    return competitor;
  }

  async findAll(projectId: string) {
    return this.prisma.competitor.findMany({
      where: { projectId },
      include: {
        socialChannels: {
          include: {
            snapshots: {
              orderBy: { capturedAt: 'desc' },
              take: 1,
            },
          },
        },
        _count: { select: { reviews: true, appUpdates: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
      include: {
        socialChannels: true,
        landingPages: true,
      },
    });

    if (!competitor) {
      throw new NotFoundException('Competitor not found');
    }

    return competitor;
  }

  async remove(id: string) {
    await this.findOne(id); // Verify exists

    await this.prisma.competitor.delete({ where: { id } });
    this.eventEmitter.emit('competitor.removed', { competitorId: id });
    return { success: true };
  }

  private isValidStoreUrl(url: string): boolean {
    const appStorePattern = /apps\.apple\.com\/.*\/app\//;
    const playStorePattern = /play\.google\.com\/store\/apps\/details/;
    return appStorePattern.test(url) || playStorePattern.test(url);
  }

  private extractAppNameFromUrl(url: string): string {
    // Extract app name from URL path
    const match = url.match(/\/app\/([^\/]+)/);
    if (match) {
      return match[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return 'Unknown App';
  }
}
```

Create `backend/src/modules/project-management/services/social-channel.service.ts`:

```typescript
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/database/prisma.service';
import { AddSocialChannelDto } from '../dto/add-social-channel.dto';

@Injectable()
export class SocialChannelService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async add(competitorId: string, dto: AddSocialChannelDto) {
    // Extract platform ID from URL
    const platformId = this.extractPlatformId(dto.platform, dto.profileUrl);

    // Check if already exists
    const existing = await this.prisma.socialChannel.findUnique({
      where: { platform_platformId: { platform: dto.platform, platformId } },
    });

    if (existing) {
      throw new ConflictException('Social channel already tracked');
    }

    const channel = await this.prisma.socialChannel.create({
      data: {
        competitorId,
        platform: dto.platform,
        platformId,
        handle: dto.handle,
        displayName: dto.handle || 'Unknown',
        profileUrl: dto.profileUrl,
      },
    });

    // Emit event for crawling
    this.eventEmitter.emit('social-channel.added', {
      socialChannelId: channel.id,
      competitorId,
      platform: dto.platform,
    });

    return channel;
  }

  async getByCompetitor(competitorId: string) {
    return this.prisma.socialChannel.findMany({
      where: { competitorId },
      include: {
        snapshots: {
          orderBy: { capturedAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  private extractPlatformId(platform: string, url: string): string {
    const patterns: Record<string, RegExp> = {
      TIKTOK: /tiktok\.com\/@?([^\/\?]+)/,
      YOUTUBE: /youtube\.com\/(channel\/|@|c\/)?([^\/\?]+)/,
      INSTAGRAM: /instagram\.com\/([^\/\?]+)/,
      FACEBOOK: /facebook\.com\/([^\/\?]+)/,
      X: /(?:twitter|x)\.com\/([^\/\?]+)/,
    };

    const pattern = patterns[platform];
    if (!pattern) {
      throw new BadRequestException(`Unsupported platform: ${platform}`);
    }

    const match = url.match(pattern);
    if (!match) {
      throw new BadRequestException('Invalid profile URL for platform');
    }

    return platform === 'YOUTUBE' ? match[2] : match[1];
  }
}
```

### 4.4 Controllers

Create `backend/src/modules/project-management/controllers/project.controller.ts`:

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create new project' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects for user' })
  findAll(@CurrentUser('id') userId: string) {
    return this.projectService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectService.remove(id, userId);
  }
}
```

Create `backend/src/modules/project-management/controllers/competitor.controller.ts`:

```typescript
import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CompetitorService } from '../services/competitor.service';
import { SocialChannelService } from '../services/social-channel.service';
import { AddCompetitorDto } from '../dto/add-competitor.dto';
import { AddSocialChannelDto } from '../dto/add-social-channel.dto';

@ApiTags('Competitors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/competitors')
export class CompetitorController {
  constructor(
    private competitorService: CompetitorService,
    private socialChannelService: SocialChannelService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add competitor to project' })
  add(@Param('projectId') projectId: string, @Body() dto: AddCompetitorDto) {
    return this.competitorService.add(projectId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List competitors in project' })
  findAll(@Param('projectId') projectId: string) {
    return this.competitorService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get competitor details' })
  findOne(@Param('id') id: string) {
    return this.competitorService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove competitor from project' })
  remove(@Param('id') id: string) {
    return this.competitorService.remove(id);
  }

  @Post(':id/social-channels')
  @ApiOperation({ summary: 'Add social channel to competitor' })
  addSocialChannel(@Param('id') competitorId: string, @Body() dto: AddSocialChannelDto) {
    return this.socialChannelService.add(competitorId, dto);
  }

  @Get(':id/social-channels')
  @ApiOperation({ summary: 'List social channels for competitor' })
  getSocialChannels(@Param('id') competitorId: string) {
    return this.socialChannelService.getByCompetitor(competitorId);
  }
}
```

---

## 5. Frontend Setup

### 5.1 Project Store

Create `frontend/src/stores/project.store.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Project {
  id: string;
  name: string;
  description?: string;
  category?: string;
  iconUrl?: string;
}

interface ProjectState {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
    }),
    { name: 'project-storage' }
  )
);
```

### 5.2 Projects API

Create `frontend/src/features/projects/api.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Project {
  id: string;
  name: string;
  description?: string;
  category?: string;
  region: string;
  storeUrl?: string;
  iconUrl?: string;
  createdAt: string;
  _count?: { competitors: number };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  category?: string;
  region?: string;
  storeUrl?: string;
  iconUrl?: string;
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient<Project[]>('/projects'),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => apiClient<Project>(`/projects/${id}`),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      apiClient<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/projects/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

### 5.3 Competitors API

Create `frontend/src/features/competitors/api.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Competitor {
  id: string;
  name: string;
  storeUrl: string;
  iconUrl: string;
  developerName?: string;
  storeCategory?: string;
  socialChannels: SocialChannel[];
  _count?: { reviews: number; appUpdates: number };
}

export interface SocialChannel {
  id: string;
  platform: string;
  handle?: string;
  displayName: string;
  profileUrl: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface AddCompetitorRequest {
  storeUrl: string;
  name?: string;
  iconUrl?: string;
}

export function useCompetitors(projectId: string) {
  return useQuery({
    queryKey: ['competitors', projectId],
    queryFn: () => apiClient<Competitor[]>(`/projects/${projectId}/competitors`),
    enabled: !!projectId,
  });
}

export function useAddCompetitor(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCompetitorRequest) =>
      apiClient<Competitor>(`/projects/${projectId}/competitors`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors', projectId] });
    },
  });
}

export function useRemoveCompetitor(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (competitorId: string) =>
      apiClient(`/projects/${projectId}/competitors/${competitorId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors', projectId] });
    },
  });
}
```

### 5.4 Projects Page

Create `frontend/src/features/projects/ProjectsPage.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useProjects } from './api';
import { useProjectStore } from '@/stores/project.store';
import { ProjectCard } from './components/ProjectCard';
import { AddProjectModal } from './components/AddProjectModal';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/icons';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useProjects();
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleProjectClick = (project: any) => {
    setCurrentProject(project);
    navigate({ to: '/projects/$projectId/overview', params: { projectId: project.id } });
  };

  if (isLoading) {
    return <div className="p-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-8 text-destructive">Failed to load projects</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      )}

      <AddProjectModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
```

---

## 6. Event System

### 6.1 Event Definitions

Create `backend/src/modules/project-management/events/project.events.ts`:

```typescript
export class ProjectCreatedEvent {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
  ) {}
}

export class CompetitorAddedEvent {
  constructor(
    public readonly competitorId: string,
    public readonly projectId: string,
    public readonly storeUrl: string,
  ) {}
}

export class SocialChannelAddedEvent {
  constructor(
    public readonly socialChannelId: string,
    public readonly competitorId: string,
    public readonly platform: string,
  ) {}
}

export class LandingPageAddedEvent {
  constructor(
    public readonly landingPageId: string,
    public readonly url: string,
    public readonly competitorId: string,
  ) {}
}
```

---

## 7. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create project |
| GET | `/projects` | List user's projects |
| GET | `/projects/:id` | Get project details |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST | `/projects/:id/competitors` | Add competitor |
| GET | `/projects/:id/competitors` | List competitors |
| DELETE | `/projects/:id/competitors/:cid` | Remove competitor |
| POST | `/competitors/:id/social-channels` | Add social channel |
| GET | `/competitors/:id/social-channels` | List social channels |

---

## 8. Verification Checklist

### Backend
- [ ] Module registered in AppModule
- [ ] EventEmitter configured
- [ ] Prisma models created
- [ ] Migration applied
- [ ] Services implemented
- [ ] Controllers with guards
- [ ] Events emitting correctly

### Frontend
- [ ] Project store configured
- [ ] API hooks implemented
- [ ] Projects page functional
- [ ] Add project modal working
- [ ] Competitors management working

### Events
- [ ] `project.created` emitting
- [ ] `competitor.added` emitting
- [ ] `social-channel.added` emitting

---

**Next Step:** Proceed to Dashboard Domain Initialization.

