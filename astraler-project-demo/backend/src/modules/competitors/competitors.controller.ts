import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CompetitorsService } from './competitors.service';
import { CreateCompetitorDto } from './dto/create-competitor.dto';

/**
 * Competitors Controller
 *
 * Implements: API Contract from 251224-competitor-tracking Section 8
 *
 * Endpoints:
 * - POST /projects/:projectId/competitors (IT-001, IT-002, IT-003, IT-004)
 * - GET /projects/:projectId/competitors
 * - DELETE /projects/:projectId/competitors/:id (IT-005)
 */
@Controller('projects/:projectId/competitors')
export class CompetitorsController {
  constructor(private readonly competitorsService: CompetitorsService) {}

  /**
   * POST /projects/:projectId/competitors
   *
   * AC-001: Valid iOS URL → fetch and display app metadata
   * AC-002: Valid Play Store URL → fetch metadata
   * AC-003: Invalid URL → 400 "Invalid app store URL"
   * AC-004: Max competitors → 400 "Maximum competitors reached"
   */
  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() createCompetitorDto: CreateCompetitorDto,
  ) {
    return this.competitorsService.create(projectId, createCompetitorDto);
  }

  /**
   * GET /projects/:projectId/competitors
   */
  @Get()
  async findAll(@Param('projectId') projectId: string) {
    return this.competitorsService.findAll(projectId);
  }

  /**
   * DELETE /projects/:projectId/competitors/:id
   *
   * AC-005: Remove competitor → soft-delete and stop crawling
   */
  @Delete(':id')
  async remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.competitorsService.remove(projectId, id);
  }
}
