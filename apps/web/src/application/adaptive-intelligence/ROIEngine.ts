/**
 * ROI Engine
 * Calculates return on investment for each action
 */

import {
  ROIMetrics,
  ROIAnalysis,
  ROIConfig,
  ROIHistory,
  defaultROIConfig,
} from "./interfaces/IROIEngine";

// ============================================================================
// ROI ENGINE CLASS
// ============================================================================

export class ROIEngine {
  private static instance: ROIEngine;
  private config: ROIConfig;
  private history: ROIHistory[] = [];

  private constructor() {
    this.config = defaultROIConfig;
  }

  static getInstance(): ROIEngine {
    if (!ROIEngine.instance) {
      ROIEngine.instance = new ROIEngine();
    }
    return ROIEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<ROIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Calculate ROI metrics
   */
  calculateMetrics(
    actionId: string,
    cost: number,
    value: number,
    timeToValue: number,
    valueDuration: number
  ): ROIMetrics {
    const roi = value - cost;
    const roiPercentage = cost > 0 ? (roi / cost) * 100 : 0;
    const valuePerMinute = valueDuration > 0 ? value / valueDuration : 0;
    const costPerMinute = timeToValue > 0 ? cost / timeToValue : 0;

    return {
      actionId,
      cost,
      value,
      roi,
      roiPercentage,
      timeToValue,
      valueDuration,
      valuePerMinute,
      costPerMinute,
    };
  }

  /**
   * Analyze ROI
   */
  analyzeROI(
    actionId: string,
    cost: number,
    value: number,
    timeToValue: number,
    valueDuration: number
  ): ROIAnalysis {
    const metrics = this.calculateMetrics(actionId, cost, value, timeToValue, valueDuration);
    const recommended = this.isRecommended(metrics);
    const reason = this.generateReason(metrics, recommended);
    const alternative = this.generateAlternative(metrics, recommended);
    const confidence = this.calculateConfidence(metrics);
    const riskLevel = this.determineRiskLevel(metrics);

    const analysis: ROIAnalysis = {
      actionId,
      metrics,
      recommended,
      reason,
      alternative,
      confidence,
      riskLevel,
    };

    return analysis;
  }

  /**
   * Check if action is recommended based on ROI
   */
  private isRecommended(metrics: ROIMetrics): boolean {
    // Check minimum ROI
    if (metrics.roi < this.config.minROI) {
      return false;
    }

    // Check minimum ROI percentage
    if (metrics.roiPercentage < this.config.minROIPercentage) {
      return false;
    }

    // Check maximum cost
    if (metrics.cost > this.config.maxCost) {
      return false;
    }

    // Check time to value
    if (metrics.timeToValue > this.config.maxTimeToValue) {
      return false;
    }

    // Check value duration
    if (metrics.valueDuration < this.config.minValueDuration) {
      return false;
    }

    // Check value threshold
    if (metrics.value < this.config.valueThreshold) {
      return false;
    }

    // Check cost threshold
    if (metrics.cost > this.config.costThreshold) {
      return false;
    }

    return true;
  }

  /**
   * Generate reason for recommendation
   */
  private generateReason(metrics: ROIMetrics, recommended: boolean): string {
    const reasons: string[] = [];

    if (recommended) {
      reasons.push(`Positive ROI: ${metrics.roiPercentage.toFixed(1)}%`);
      reasons.push(`Value exceeds cost by ${metrics.roi.toFixed(4)}`);
    } else {
      reasons.push(`Negative ROI: ${metrics.roiPercentage.toFixed(1)}%`);
      reasons.push(`Cost exceeds value by ${Math.abs(metrics.roi).toFixed(4)}`);
    }

    reasons.push(`Value per minute: ${metrics.valuePerMinute.toFixed(4)}`);
    reasons.push(`Cost per minute: ${metrics.costPerMinute.toFixed(4)}`);

    return reasons.join("; ");
  }

  /**
   * Generate alternative action
   */
  private generateAlternative(metrics: ROIMetrics, recommended: boolean): string | null {
    if (recommended) {
      return null;
    }

    // Suggest alternatives based on what failed
    if (metrics.cost > this.config.maxCost) {
      return "Use cheaper model or reduce action scope";
    }

    if (metrics.roiPercentage < this.config.minROIPercentage) {
      return "Increase expected value or reduce cost";
    }

    if (metrics.timeToValue > this.config.maxTimeToValue) {
      return "Optimize action for faster value realization";
    }

    return "Review action parameters";
  }

  /**
   * Calculate confidence in ROI analysis
   */
  private calculateConfidence(metrics: ROIMetrics): number {
    let confidence = 0.5;

    // Higher confidence with higher ROI
    if (metrics.roiPercentage > 100) confidence += 0.2;
    else if (metrics.roiPercentage > 50) confidence += 0.1;

    // Higher confidence with lower cost
    if (metrics.cost < this.config.costThreshold) confidence += 0.1;

    // Higher confidence with faster time to value
    if (metrics.timeToValue < this.config.maxTimeToValue / 2) confidence += 0.1;

    return Math.min(1, confidence);
  }

  /**
   * Determine risk level
   */
  private determineRiskLevel(metrics: ROIMetrics): "low" | "medium" | "high" {
    const riskScore = this.calculateRiskScore(metrics);

    if (this.config.riskTolerance === "low") {
      if (riskScore < 0.3) return "low";
      if (riskScore < 0.6) return "medium";
      return "high";
    } else if (this.config.riskTolerance === "medium") {
      if (riskScore < 0.5) return "low";
      if (riskScore < 0.8) return "medium";
      return "high";
    } else {
      if (riskScore < 0.7) return "low";
      return "medium";
    }
  }

  /**
   * Calculate risk score
   */
  private calculateRiskScore(metrics: ROIMetrics): number {
    let riskScore = 0;

    // Higher cost = higher risk
    riskScore += (metrics.cost / this.config.maxCost) * 0.3;

    // Lower ROI = higher risk
    if (metrics.roiPercentage < 0) riskScore += 0.4;
    else if (metrics.roiPercentage < 50) riskScore += 0.2;

    // Longer time to value = higher risk
    riskScore += (metrics.timeToValue / this.config.maxTimeToValue) * 0.2;

    // Shorter value duration = higher risk
    if (metrics.valueDuration < this.config.minValueDuration) riskScore += 0.1;

    return Math.min(1, riskScore);
  }

  /**
   * Record actual ROI outcome
   */
  recordOutcome(
    actionId: string,
    metrics: ROIMetrics,
    analysis: ROIAnalysis,
    actualValue: number
  ): void {
    const expectedValue = metrics.value;
    const accuracy = expectedValue > 0 ? 1 - Math.abs(actualValue - expectedValue) / expectedValue : 0;

    const historyEntry: ROIHistory = {
      actionId,
      metrics,
      analysis,
      actualValue,
      expectedValue,
      accuracy: Math.max(0, Math.min(1, accuracy)),
      timestamp: new Date(),
    };

    this.history.push(historyEntry);
  }

  /**
   * Get ROI statistics
   */
  getStatistics(): {
    totalAnalyses: number;
    recommendedActions: number;
    notRecommendedActions: number;
    averageROI: number;
    averageROIPercentage: number;
    averageAccuracy: number;
    riskDistribution: Record<string, number>;
    costDistribution: {
      low: number;
      medium: number;
      high: number;
    };
  } {
    const totalAnalyses = this.history.length;
    const recommendedActions = this.history.filter(h => h.analysis.recommended).length;
    const notRecommendedActions = totalAnalyses - recommendedActions;

    const averageROI = totalAnalyses > 0
      ? this.history.reduce((sum, h) => sum + h.metrics.roi, 0) / totalAnalyses
      : 0;

    const averageROIPercentage = totalAnalyses > 0
      ? this.history.reduce((sum, h) => sum + h.metrics.roiPercentage, 0) / totalAnalyses
      : 0;

    const averageAccuracy = totalAnalyses > 0
      ? this.history.reduce((sum, h) => sum + h.accuracy, 0) / totalAnalyses
      : 0;

    const riskDistribution: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };

    this.history.forEach(h => {
      riskDistribution[h.analysis.riskLevel]++;
    });

    const costDistribution = {
      low: this.history.filter(h => h.metrics.cost < this.config.costThreshold).length,
      medium: this.history.filter(h => 
        h.metrics.cost >= this.config.costThreshold && h.metrics.cost < this.config.maxCost
      ).length,
      high: this.history.filter(h => h.metrics.cost >= this.config.maxCost).length,
    };

    return {
      totalAnalyses,
      recommendedActions,
      notRecommendedActions,
      averageROI,
      averageROIPercentage,
      averageAccuracy,
      riskDistribution,
      costDistribution,
    };
  }

  /**
   * Get ROI history
   */
  getHistory(): ROIHistory[] {
    return this.history;
  }

  /**
   * Get history by action ID
   */
  getHistoryByAction(actionId: string): ROIHistory[] {
    return this.history.filter(h => h.actionId === actionId);
  }

  /**
   * Export data
   */
  exportData(): {
    history: ROIHistory[];
    config: ROIConfig;
  } {
    return {
      history: this.history,
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    history: ROIHistory[];
    config?: ROIConfig;
  }): void {
    this.history = data.history;
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
  }
}

export const roiEngine = ROIEngine.getInstance();
