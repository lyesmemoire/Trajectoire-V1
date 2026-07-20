/**
 * Product Analytics Service
 * Administrator dashboard for product intelligence
 */

import {
  TimeRange,
  EngagementMetrics,
  PerformanceMetrics,
  CostMetrics,
  EngineUsageMetrics,
  ProductAnalyticsData,
  ProductAnalyticsConfig,
  defaultProductAnalyticsConfig,
} from "./interfaces/IProductAnalytics";
import { adaptiveIntelligenceOrchestrator } from "../adaptive-intelligence/AdaptiveIntelligenceOrchestrator";
import { costOptimizationEngine } from "../adaptive-intelligence/CostOptimizationEngine";
import { experienceMemoryService } from "../experience-memory/ExperienceMemoryService";

// ============================================================================
// PRODUCT ANALYTICS SERVICE CLASS
// ============================================================================

export class ProductAnalyticsService {
  private static instance: ProductAnalyticsService;
  private config: ProductAnalyticsConfig;
  private analyticsCache: Map<string, ProductAnalyticsData> = new Map();

  private constructor() {
    this.config = defaultProductAnalyticsConfig;
  }

  static getInstance(): ProductAnalyticsService {
    if (!ProductAnalyticsService.instance) {
      ProductAnalyticsService.instance = new ProductAnalyticsService();
    }
    return ProductAnalyticsService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<ProductAnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate product analytics
   */
  async generateAnalytics(timeRange: TimeRange): Promise<ProductAnalyticsData> {
    const cacheKey = `${timeRange}_${Date.now()}`;
    const cached = this.analyticsCache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      return cached;
    }

    const { startDate, endDate } = this.calculateDateRange(timeRange);

    // Generate metrics
    const engagement = await this.generateEngagementMetrics(startDate, endDate);
    const performance = await this.generatePerformanceMetrics(startDate, endDate);
    const costs = await this.generateCostMetrics(startDate, endDate);
    const engineUsage = await this.generateEngineUsageMetrics(startDate, endDate);

    const analyticsData: ProductAnalyticsData = {
      timeRange,
      startDate,
      endDate,
      engagement,
      performance,
      costs,
      engineUsage,
      generatedAt: new Date(),
    };

    // Cache the result
    this.analyticsCache.set(cacheKey, analyticsData);

    return analyticsData;
  }

  /**
   * Calculate date range
   */
  private calculateDateRange(timeRange: TimeRange): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "hour":
        startDate.setHours(startDate.getHours() - 1);
        break;
      case "day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "all":
        startDate.setFullYear(2020); // Arbitrary start date
        break;
    }

    return { startDate, endDate };
  }

  /**
   * Generate engagement metrics
   */
  private async generateEngagementMetrics(startDate: Date, endDate: Date): Promise<EngagementMetrics> {
    const experienceStats = experienceMemoryService.getStatistics();

    return {
      totalUsers: experienceStats.totalUsers,
      activeUsers: Math.floor(experienceStats.totalUsers * 0.7), // Estimate
      dailyActiveUsers: Math.floor(experienceStats.totalUsers * 0.3),
      weeklyActiveUsers: Math.floor(experienceStats.totalUsers * 0.5),
      monthlyActiveUsers: Math.floor(experienceStats.totalUsers * 0.6),
      averageSessionDuration: experienceStats.averageDuration,
      sessionsPerUser: experienceStats.averageSessionsPerUser,
      retentionRate: 0.75, // Placeholder
      churnRate: 0.05, // Placeholder
    };
  }

  /**
   * Generate performance metrics
   */
  private async generatePerformanceMetrics(startDate: Date, endDate: Date): Promise<PerformanceMetrics> {
    const experienceStats = experienceMemoryService.getStatistics();

    return {
      averageScore: experienceStats.averageSatisfaction * 100,
      scoreDistribution: {
        "0-20": 5,
        "20-40": 10,
        "40-60": 25,
        "60-80": 35,
        "80-100": 25,
      },
      completionRate: 0.85, // Placeholder
      averageResponseTime: 15, // Placeholder
      averageStressLevel: 0.5, // Placeholder
      averageConfidenceLevel: experienceStats.averageSatisfaction,
      improvementRate: 0.12, // Placeholder
      successRate: 0.78, // Placeholder
    };
  }

  /**
   * Generate cost metrics
   */
  private async generateCostMetrics(startDate: Date, endDate: Date): Promise<CostMetrics> {
    const costStats = costOptimizationEngine.getStatistics();

    return {
      totalOpenAICost: costStats.totalCost,
      costPerSession: costStats.totalCost / Math.max(1, experienceMemoryService.getStatistics().totalSessions),
      costPerUser: costStats.totalCost / Math.max(1, experienceMemoryService.getStatistics().totalUsers),
      tokenUsage: costStats.totalTokens,
      modelDistribution: costStats.modelDistribution,
      costTrend: costStats.totalCost > 100 ? "increasing" : "stable",
      roi: costStats.averageROI,
    };
  }

  /**
   * Generate engine usage metrics
   */
  private async generateEngineUsageMetrics(startDate: Date, endDate: Date): Promise<EngineUsageMetrics> {
    const allEngineStats = adaptiveIntelligenceOrchestrator.getAllEngineStatistics();

    const engineUsage: Record<string, number> = {};
    const engineSuccessRate: Record<string, number> = {};
    const engineLatency: Record<string, number> = {};
    const engineCost: Record<string, number> = {};

    // Extract stats from each engine
    Object.entries(allEngineStats).forEach(([engineName, stats]) => {
      engineUsage[engineName] = (stats as any).totalDecisions || 0;
      engineSuccessRate[engineName] = (stats as any).overallSuccessRate || 0.8;
      engineLatency[engineName] = (stats as any).averageDecisionTime || 100;
      engineCost[engineName] = (stats as any).totalCost || 0;
    });

    // Sort engines by usage
    const sortedEngines = Object.entries(engineUsage).sort((a, b) => b[1] - a[1]);
    const mostUsedEngines = sortedEngines.slice(0, 3).map(([name]) => name);
    const leastUsedEngines = sortedEngines.slice(-3).map(([name]) => name);

    return {
      engineUsage,
      engineSuccessRate,
      engineLatency,
      engineCost,
      mostUsedEngines,
      leastUsedEngines,
    };
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(cached: ProductAnalyticsData): boolean {
    const minutesDiff = (Date.now() - cached.generatedAt.getTime()) / (1000 * 60);
    return minutesDiff < this.config.cacheDuration;
  }

  /**
   * Get analytics by time range
   */
  getAnalytics(timeRange: TimeRange): ProductAnalyticsData | null {
    const cacheKey = `${timeRange}_${Date.now()}`;
    return this.analyticsCache.get(cacheKey) || null;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.analyticsCache.clear();
  }

  /**
   * Export analytics
   */
  exportAnalytics(timeRange: TimeRange): string {
    const analytics = this.getAnalytics(timeRange);
    if (!analytics) {
      return "{}";
    }

    return JSON.stringify(analytics, null, 2);
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    totalUsers: number;
    totalSessions: number;
    totalCost: number;
    averageScore: number;
    topEngine: string;
  } {
    const experienceStats = experienceMemoryService.getStatistics();
    const costStats = costOptimizationEngine.getStatistics();
    const allEngineStats = adaptiveIntelligenceOrchestrator.getAllEngineStatistics();

    // Find top engine
    let topEngine = "DecisionPolicyEngine";
    let maxUsage = 0;
    Object.entries(allEngineStats).forEach(([engineName, stats]) => {
      const usage = (stats as any).totalDecisions || 0;
      if (usage > maxUsage) {
        maxUsage = usage;
        topEngine = engineName;
      }
    });

    return {
      totalUsers: experienceStats.totalUsers,
      totalSessions: experienceStats.totalSessions,
      totalCost: costStats.totalCost,
      averageScore: experienceStats.averageSatisfaction * 100,
      topEngine,
    };
  }
}

export const productAnalyticsService = ProductAnalyticsService.getInstance();
