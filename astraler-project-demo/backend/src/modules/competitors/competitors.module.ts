import { Module } from '@nestjs/common';
import { CompetitorsController } from './competitors.controller';
import { CompetitorsService } from './competitors.service';
import { UrlValidationService } from './services/url-validation.service';

/**
 * Competitors Module
 *
 * Implements: 251224-competitor-tracking spec v1.0.0
 *
 * Features:
 * - FR-001: Accept iOS/Android store URLs
 * - FR-002: Auto-fetch app metadata
 * - FR-005: Display competitor card
 * - FR-006: Limit to 10 competitors per project
 * - FR-007: Remove competitors
 */
@Module({
  controllers: [CompetitorsController],
  providers: [CompetitorsService, UrlValidationService],
  exports: [CompetitorsService],
})
export class CompetitorsModule {}
