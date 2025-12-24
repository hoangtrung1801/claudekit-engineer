import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

/**
 * Create Competitor DTO
 *
 * Implements: API Contract from 251224-competitor-tracking Section 8
 */
export class CreateCompetitorDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  storeUrl: string; // iOS or Android store URL
}
