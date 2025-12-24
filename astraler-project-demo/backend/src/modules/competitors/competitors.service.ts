import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { UrlValidationService } from './services/url-validation.service';

/**
 * Competitors Service
 *
 * Implements: 251224-competitor-tracking spec v1.0.0
 *
 * Business Rules (from Project Management domain):
 * - PROJ-001: Max 10 competitors per project
 */

const MAX_COMPETITORS_PER_PROJECT = 10; // FR-006

@Injectable()
export class CompetitorsService {
  constructor(private readonly urlValidationService: UrlValidationService) {}

  /**
   * Create competitor from store URL
   *
   * AC-001, AC-002: Validate and fetch metadata
   * AC-003: Reject invalid URLs
   * AC-004: Enforce max competitors limit
   */
  async create(projectId: string, dto: CreateCompetitorDto) {
    // Step 1: Validate URL (FR-001)
    const validation = this.urlValidationService.validate(dto.storeUrl);

    // Step 2: Check competitor limit (FR-006, AC-004)
    const currentCount = await this.countByProject(projectId);
    if (currentCount >= MAX_COMPETITORS_PER_PROJECT) {
      throw new BadRequestException('Maximum competitors reached');
    }

    // Step 3: Fetch app metadata (FR-002)
    // TODO: Integrate with SearchAPI.io
    const metadata = await this.fetchMetadata(dto.storeUrl, validation.platform);

    // Step 4: Save competitor
    const competitor = {
      id: this.generateId(),
      projectId,
      name: metadata.name,
      storeUrl: dto.storeUrl,
      bundleId: validation.bundleId,
      platform: validation.platform,
      developerName: metadata.developerName,
      rating: metadata.rating,
      ratingsCount: metadata.ratingsCount,
      iconUrl: metadata.iconUrl,
      createdAt: new Date(),
    };

    // TODO: Save to database via Prisma

    // Step 5: Auto-discover social channels (FR-004)
    // TODO: Implement channel discovery

    return {
      competitor,
      discoveredChannels: [], // FR-004: To be implemented
    };
  }

  /**
   * Get all competitors for a project
   */
  async findAll(projectId: string) {
    // TODO: Fetch from database
    return {
      competitors: [],
      total: 0,
      limit: MAX_COMPETITORS_PER_PROJECT,
    };
  }

  /**
   * Remove competitor (soft delete)
   *
   * AC-005: Soft-delete and stop crawling
   */
  async remove(projectId: string, id: string) {
    // TODO: Soft delete in database
    // TODO: Cancel scheduled crawl jobs
    return { message: 'Competitor removed' };
  }

  // --- Private helpers ---

  private async countByProject(projectId: string): Promise<number> {
    // TODO: Query database
    return 0;
  }

  private async fetchMetadata(url: string, platform: string) {
    // TODO: Call SearchAPI.io
    // NFR-001: Must complete in < 5 seconds
    return {
      name: 'Sample App',
      developerName: 'Sample Developer',
      rating: 4.5,
      ratingsCount: 12345,
      iconUrl: 'https://example.com/icon.png',
    };
  }

  private generateId(): string {
    return `comp_${Date.now()}`;
  }
}
