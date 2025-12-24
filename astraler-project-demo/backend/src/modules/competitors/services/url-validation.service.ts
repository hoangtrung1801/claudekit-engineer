import { Injectable, BadRequestException } from '@nestjs/common';

/**
 * URL Validation Service
 *
 * Implements: FR-001 from 251224-competitor-tracking
 * Tests: UT-001, UT-002, UT-003, UT-004
 */

// From spec Section 6: Technical Design
const URL_PATTERNS = {
  ios: /apps\.apple\.com\/.*\/app\/.*\/id(\d+)/,
  android: /play\.google\.com\/store\/apps\/details\?id=([a-zA-Z0-9._]+)/,
};

export interface ValidationResult {
  isValid: boolean;
  platform: 'ios' | 'android' | null;
  bundleId: string | null;
}

@Injectable()
export class UrlValidationService {
  /**
   * Validates app store URL and extracts bundle ID
   *
   * AC-001: Valid iOS URL → extract bundle ID
   * AC-002: Valid Android URL → extract bundle ID
   * AC-003: Invalid URL → throw BadRequestException
   */
  validate(url: string): ValidationResult {
    // UT-004: Empty URL rejection
    if (!url || url.trim() === '') {
      throw new BadRequestException('Invalid app store URL');
    }

    // Normalize URL (EC-002: Uppercase URL)
    const normalizedUrl = url.toLowerCase().trim();

    // UT-001: Valid iOS URL pattern
    const iosMatch = normalizedUrl.match(URL_PATTERNS.ios);
    if (iosMatch) {
      return {
        isValid: true,
        platform: 'ios',
        bundleId: iosMatch[1],
      };
    }

    // UT-002: Valid Play Store URL
    const androidMatch = normalizedUrl.match(URL_PATTERNS.android);
    if (androidMatch) {
      return {
        isValid: true,
        platform: 'android',
        bundleId: androidMatch[1],
      };
    }

    // UT-003: Invalid URL rejection
    throw new BadRequestException('Invalid app store URL');
  }
}
