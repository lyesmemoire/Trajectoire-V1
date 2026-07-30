import { TemporalCatalogProvider, TemporalPattern, TemporalExtractionRule } from "../../catalogs/TemporalCatalogProvider";

// ===================================================================
// TEMPORAL EXTRACTION VALIDATOR — Business Logic for Temporal Extraction
// ===================================================================

export interface TemporalExtractionContext {
  content: string;
  patterns: TemporalPattern[];
  extractionRules: TemporalExtractionRule[];
}

export interface TemporalExtractionResult {
  expressions: string[];
  timestamp?: Date;
  duration?: number;
  eventType: string;
  confidence: number;
}

export class TemporalExtractionValidator {
  readonly id = "temporal-extraction-validator";
  readonly version = "1.0.0";

  constructor(private catalogProvider: TemporalCatalogProvider) {}

  /**
   * Extract temporal expressions from content
   */
  extractTemporalExpressions(content: string): string[] {
    const patterns = this.catalogProvider.getPatterns();
    const expressions: string[] = [];

    for (const pattern of patterns) {
      const regex = new RegExp(pattern.regex, "gi");
      const matches = content.match(regex);
      if (matches) {
        expressions.push(...matches);
      }
    }

    return [...new Set(expressions.map(e => e.toLowerCase()))];
  }

  /**
   * Parse timestamp from content
   */
  parseTimestamp(content: string): Date | undefined {
    const yearMatch = content.match(/\b(20\d{2}|19\d{2})\b/);
    if (yearMatch) {
      return new Date(parseInt(yearMatch[1]), 0, 1);
    }
    return undefined;
  }

  /**
   * Parse duration from content
   */
  parseDuration(content: string): number | undefined {
    const yearMatch = content.match(/(\d+)\s*years?/i);
    if (yearMatch) {
      return parseInt(yearMatch[1]) * 365 * 24 * 60 * 60 * 1000;
    }

    const monthMatch = content.match(/(\d+)\s*months?/i);
    if (monthMatch) {
      return parseInt(monthMatch[1]) * 30 * 24 * 60 * 60 * 1000;
    }

    const weekMatch = content.match(/(\d+)\s*weeks?/i);
    if (weekMatch) {
      return parseInt(weekMatch[1]) * 7 * 24 * 60 * 60 * 1000;
    }

    return undefined;
  }

  /**
   * Infer event type from content
   */
  inferEventType(content: string): string {
    const rules = this.catalogProvider.getExtractionRules();
    const lower = content.toLowerCase();

    for (const rule of rules) {
      for (const pattern of rule.patterns) {
        if (lower.includes(pattern)) {
          return rule.eventType;
        }
      }
    }

    return "general";
  }

  /**
   * Calculate confidence based on extracted data
   */
  calculateConfidence(expressions: string[], timestamp?: Date, duration?: number): number {
    let confidence = 0.5;

    if (expressions.length > 0) {
      confidence += 0.2 * Math.min(expressions.length, 3) / 3;
    }

    if (timestamp) {
      confidence += 0.2;
    }

    if (duration) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Validate and extract temporal information from content
   */
  validate(context: TemporalExtractionContext): TemporalExtractionResult {
    const expressions = this.extractTemporalExpressions(context.content);
    const timestamp = this.parseTimestamp(context.content);
    const duration = this.parseDuration(context.content);
    const eventType = this.inferEventType(context.content);
    const confidence = this.calculateConfidence(expressions, timestamp, duration);

    return {
      expressions,
      timestamp,
      duration,
      eventType,
      confidence,
    };
  }
}
