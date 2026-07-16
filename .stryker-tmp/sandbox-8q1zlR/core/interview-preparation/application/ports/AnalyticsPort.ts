/**
 * AnalyticsPort
 *
 * Port interface for analytics and reporting.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY interface definition for analytics adapter.
 */
// @ts-nocheck


export interface AnalyticsPort {
  /**
   * Track interview plan generation
   * @param data - Generation analytics data
   */
  trackGeneration(data: GenerationAnalytics): void;

  /**
   * Track interview plan validation
   * @param data - Validation analytics data
   */
  trackValidation(data: ValidationAnalytics): void;

  /**
   * Track competency coverage
   * @param data - Coverage analytics data
   */
  trackCoverage(data: CoverageAnalytics): void;

  /**
   * Get generation statistics
   * @param timeRange - Time range for statistics
   * @returns Generation statistics
   */
  getGenerationStats(timeRange: TimeRange): Promise<GenerationStats>;
}

export interface GenerationAnalytics {
  candidateId: string;
  jobOfferId: string;
  questionCount: number;
  duration: number;
  coveragePercentage: number;
  generatedAt: Date;
}

export interface ValidationAnalytics {
  planId: string;
  isValid: boolean;
  score: number;
  errorCount: number;
  warningCount: number;
  validatedAt: Date;
}

export interface CoverageAnalytics {
  planId: string;
  overallCoverage: number;
  softSkillCoverage: number;
  hardSkillCoverage: number;
  gaps: string[];
  analyzedAt: Date;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface GenerationStats {
  totalGenerated: number;
  averageQuestionCount: number;
  averageDuration: number;
  averageCoverage: number;
  successRate: number;
}
