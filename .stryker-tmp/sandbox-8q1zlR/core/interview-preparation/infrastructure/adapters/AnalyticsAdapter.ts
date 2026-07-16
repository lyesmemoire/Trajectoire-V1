/**
 * AnalyticsAdapter
 *
 * Infrastructure adapter for analytics.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY analytics implementation.
 */
// @ts-nocheck


import {
  AnalyticsPort,
  GenerationAnalytics,
  ValidationAnalytics,
  CoverageAnalytics,
  TimeRange,
  GenerationStats,
} from "../../application/ports/AnalyticsPort";
import { ConfigurationService } from "../configuration/ConfigurationService";

export class AnalyticsAdapter implements AnalyticsPort {
  private generationEvents: GenerationAnalytics[] = [];
  private validationEvents: ValidationAnalytics[] = [];
  private coverageEvents: CoverageAnalytics[] = [];

  constructor(private readonly configurationService: ConfigurationService) {}

  trackGeneration(data: GenerationAnalytics): void {
    const config = this.configurationService.getAnalyticsConfig();

    if (!config.enabled) {
      return;
    }

    this.generationEvents.push(data);

    if (config.endpoint && config.apiKey) {
      this.sendGenerationEvent(data);
    }
  }

  trackValidation(data: ValidationAnalytics): void {
    const config = this.configurationService.getAnalyticsConfig();

    if (!config.enabled) {
      return;
    }

    this.validationEvents.push(data);

    if (config.endpoint && config.apiKey) {
      this.sendValidationEvent(data);
    }
  }

  trackCoverage(data: CoverageAnalytics): void {
    const config = this.configurationService.getAnalyticsConfig();

    if (!config.enabled) {
      return;
    }

    this.coverageEvents.push(data);

    if (config.endpoint && config.apiKey) {
      this.sendCoverageEvent(data);
    }
  }

  async getGenerationStats(timeRange: TimeRange): Promise<GenerationStats> {
    const filteredEvents = this.generationEvents.filter(
      (event) => event.generatedAt >= timeRange.start && event.generatedAt <= timeRange.end
    );

    if (filteredEvents.length === 0) {
      return {
        totalGenerated: 0,
        averageQuestionCount: 0,
        averageDuration: 0,
        averageCoverage: 0,
        successRate: 0,
      };
    }

    const totalGenerated = filteredEvents.length;
    const totalQuestions = filteredEvents.reduce((sum, e) => sum + e.questionCount, 0);
    const totalDuration = filteredEvents.reduce((sum, e) => sum + e.duration, 0);
    const totalCoverage = filteredEvents.reduce((sum, e) => sum + e.coveragePercentage, 0);

    const validPlans = this.validationEvents.filter(
      (e) => e.isValid && e.validatedAt >= timeRange.start && e.validatedAt <= timeRange.end
    ).length;

    return {
      totalGenerated,
      averageQuestionCount: totalQuestions / totalGenerated,
      averageDuration: totalDuration / totalGenerated,
      averageCoverage: totalCoverage / totalGenerated,
      successRate: totalGenerated > 0 ? validPlans / totalGenerated : 0,
    };
  }

  private async sendGenerationEvent(data: GenerationAnalytics): Promise<void> {
    const config = this.configurationService.getAnalyticsConfig();

    try {
      await fetch(`${config.endpoint}/generation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to send generation event:", error);
    }
  }

  private async sendValidationEvent(data: ValidationAnalytics): Promise<void> {
    const config = this.configurationService.getAnalyticsConfig();

    try {
      await fetch(`${config.endpoint}/validation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to send validation event:", error);
    }
  }

  private async sendCoverageEvent(data: CoverageAnalytics): Promise<void> {
    const config = this.configurationService.getAnalyticsConfig();

    try {
      await fetch(`${config.endpoint}/coverage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to send coverage event:", error);
    }
  }

  reset(): void {
    this.generationEvents = [];
    this.validationEvents = [];
    this.coverageEvents = [];
  }
}
