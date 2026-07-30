/**
 * Quality Metrics Engine
 * Manages metrics history, aggregation, and tracking over time
 */

import {
  QualityMetrics,
  CriteriaScores,
  EvaluationHistory,
} from "./interfaces/IEvaluationPlatform";

// ============================================================================
// METRICS AGGREGATION
// ============================================================================

export interface MetricsAggregation {
  count: number;
  average: number;
  min: number;
  max: number;
  median: number;
  percentile90: number;
  percentile95: number;
  standardDeviation: number;
}

export interface MetricsTimeSeries {
  timestamp: Date;
  value: number;
  version: string;
  scenarioId?: string;
}

export interface MetricsTrend {
  metric: keyof QualityMetrics | keyof CriteriaScores;
  current: number;
  previous: number;
  trend: "up" | "down" | "stable";
  changePercentage: number;
  timeSeries: MetricsTimeSeries[];
}

// ============================================================================
// QUALITY METRICS ENGINE CLASS
// ============================================================================

export class QualityMetricsEngine {
  private static instance: QualityMetricsEngine;
  private metricsHistory: Map<string, EvaluationHistory[]> = new Map();
  private metricsTimeSeries: Map<string, MetricsTimeSeries[]> = new Map();

  private constructor() {}

  static getInstance(): QualityMetricsEngine {
    if (!QualityMetricsEngine.instance) {
      QualityMetricsEngine.instance = new QualityMetricsEngine();
    }
    return QualityMetricsEngine.instance;
  }

  /**
   * Record metrics for a conversation
   */
  recordMetrics(
    evaluationId: string,
    version: string,
    overallScore: number,
    criteriaScores: CriteriaScores,
    metrics: QualityMetrics,
    scenarioId: string,
    conversationId: string
  ): void {
    const history: EvaluationHistory = {
      evaluationId,
      timestamp: new Date(),
      version,
      overallScore,
      criteriaScores,
      metrics,
      scenarioId,
      conversationId,
    };

    // Store by version
    if (!this.metricsHistory.has(version)) {
      this.metricsHistory.set(version, []);
    }
    this.metricsHistory.get(version)!.push(history);

    // Store time series for each metric
    this.recordTimeSeries("overallScore", overallScore, version, scenarioId);
    this.recordCriteriaTimeSeries(criteriaScores, version, scenarioId);
    this.recordQualityTimeSeries(metrics, version, scenarioId);
  }

  /**
   * Record time series data
   */
  private recordTimeSeries(
    metric: string,
    value: number,
    version: string,
    scenarioId?: string
  ): void {
    const key = `${metric}_${scenarioId || "all"}`;
    if (!this.metricsTimeSeries.has(key)) {
      this.metricsTimeSeries.set(key, []);
    }
    this.metricsTimeSeries.get(key)!.push({
      timestamp: new Date(),
      value,
      version,
      scenarioId,
    });
  }

  /**
   * Record criteria time series
   */
  private recordCriteriaTimeSeries(
    criteriaScores: CriteriaScores,
    version: string,
    scenarioId?: string
  ): void {
    Object.entries(criteriaScores).forEach(([key, value]) => {
      this.recordTimeSeries(`criteria_${key}`, value, version, scenarioId);
    });
  }

  /**
   * Record quality metrics time series
   */
  private recordQualityTimeSeries(
    metrics: QualityMetrics,
    version: string,
    scenarioId?: string
  ): void {
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === "number") {
        this.recordTimeSeries(`metrics_${key}`, value, version, scenarioId);
      }
    });
  }

  /**
   * Get metrics history for a version
   */
  getMetricsHistory(version: string): EvaluationHistory[] {
    return this.metricsHistory.get(version) || [];
  }

  /**
   * Get all metrics history
   */
  getAllMetricsHistory(): EvaluationHistory[] {
    const all: EvaluationHistory[] = [];
    this.metricsHistory.forEach(history => {
      all.push(...history);
    });
    return all.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Aggregate metrics for a version
   */
  aggregateMetrics(version: string): {
    criteriaAggregation: Partial<Record<keyof CriteriaScores, MetricsAggregation>>;
    metricsAggregation: Partial<Record<keyof QualityMetrics, MetricsAggregation>>;
    overallAggregation: MetricsAggregation;
  } {
    const history = this.getMetricsHistory(version);
    if (history.length === 0) {
      return {
        criteriaAggregation: {},
        metricsAggregation: {},
        overallAggregation: this.createEmptyAggregation(),
      };
    }

    const overallScores = history.map(h => h.overallScore);
    const criteriaAggregation: Partial<Record<keyof CriteriaScores, MetricsAggregation>> = {};
    const metricsAggregation: Partial<Record<keyof QualityMetrics, MetricsAggregation>> = {};

    // Aggregate criteria scores
    Object.keys(history[0].criteriaScores).forEach(key => {
      const k = key as keyof CriteriaScores;
      const values = history.map(h => h.criteriaScores[k]);
      criteriaAggregation[k] = this.calculateAggregation(values);
    });

    // Aggregate quality metrics
    Object.keys(history[0].metrics).forEach(key => {
      const k = key as keyof QualityMetrics;
      const values = history.map(h => h.metrics[k]);
      if (typeof values[0] === "number") {
        metricsAggregation[k] = this.calculateAggregation(values as number[]);
      }
    });

    return {
      criteriaAggregation,
      metricsAggregation,
      overallAggregation: this.calculateAggregation(overallScores),
    };
  }

  /**
   * Calculate aggregation statistics
   */
  private calculateAggregation(values: number[]): MetricsAggregation {
    if (values.length === 0) {
      return this.createEmptyAggregation();
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = this.calculateMedian(sorted);
    const percentile90 = this.calculatePercentile(sorted, 90);
    const percentile95 = this.calculatePercentile(sorted, 95);
    const standardDeviation = this.calculateStandardDeviation(values, average);

    return {
      count: values.length,
      average,
      min,
      max,
      median,
      percentile90,
      percentile95,
      standardDeviation,
    };
  }

  /**
   * Calculate median
   */
  private calculateMedian(sorted: number[]): number {
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(sorted: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
  }

  /**
   * Calculate standard deviation
   */
  private calculateStandardDeviation(values: number[], mean: number): number {
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  /**
   * Create empty aggregation
   */
  private createEmptyAggregation(): MetricsAggregation {
    return {
      count: 0,
      average: 0,
      min: 0,
      max: 0,
      median: 0,
      percentile90: 0,
      percentile95: 0,
      standardDeviation: 0,
    };
  }

  /**
   * Get metric trend
   */
  getMetricTrend(
    metric: keyof QualityMetrics | keyof CriteriaScores,
    scenarioId?: string
  ): MetricsTrend | null {
    const key = `${metric.startsWith("criteria_") ? metric : `metrics_${metric}`}_${scenarioId || "all"}`;
    const timeSeries = this.metricsTimeSeries.get(key);

    if (!timeSeries || timeSeries.length < 2) {
      return null;
    }

    const sorted = [...timeSeries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const current = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];

    const changePercentage = previous.value !== 0
      ? ((current.value - previous.value) / previous.value) * 100
      : 0;

    let trend: "up" | "down" | "stable";
    if (Math.abs(changePercentage) < 1) {
      trend = "stable";
    } else if (changePercentage > 0) {
      trend = "up";
    } else {
      trend = "down";
    }

    return {
      metric,
      current: current.value,
      previous: previous.value,
      trend,
      changePercentage,
      timeSeries: sorted,
    };
  }

  /**
   * Compare versions
   */
  compareVersions(versionA: string, versionB: string): {
    versionA: string;
    versionB: string;
    overallScoreA: number;
    overallScoreB: number;
    scoreDelta: number;
    criteriaComparison: Partial<Record<keyof CriteriaScores, number>>;
    metricsComparison: Partial<Record<keyof QualityMetrics, number>>;
    recommendation: "deploy" | "hold" | "rollback";
  } {
    const aggregationA = this.aggregateMetrics(versionA);
    const aggregationB = this.aggregateMetrics(versionB);

    const overallScoreA = aggregationA.overallAggregation.average;
    const overallScoreB = aggregationB.overallAggregation.average;
    const scoreDelta = overallScoreB - overallScoreA;

    const criteriaComparison: Partial<Record<keyof CriteriaScores, number>> = {};
    Object.keys(aggregationA.criteriaAggregation).forEach(key => {
      const k = key as keyof CriteriaScores;
      criteriaComparison[k] =
        (aggregationB.criteriaAggregation[k]?.average || 0) -
        (aggregationA.criteriaAggregation[k]?.average || 0);
    });

    const metricsComparison: Partial<Record<keyof QualityMetrics, number>> = {};
    Object.keys(aggregationA.metricsAggregation).forEach(key => {
      const k = key as keyof QualityMetrics;
      metricsComparison[k] =
        (aggregationB.metricsAggregation[k]?.average || 0) -
        (aggregationA.metricsAggregation[k]?.average || 0);
    });

    let recommendation: "deploy" | "hold" | "rollback";
    if (scoreDelta > 5) {
      recommendation = "deploy";
    } else if (scoreDelta < -5) {
      recommendation = "rollback";
    } else {
      recommendation = "hold";
    }

    return {
      versionA,
      versionB,
      overallScoreA,
      overallScoreB,
      scoreDelta,
      criteriaComparison,
      metricsComparison,
      recommendation,
    };
  }

  /**
   * Get metrics by scenario
   */
  getMetricsByScenario(scenarioId: string): EvaluationHistory[] {
    const all = this.getAllMetricsHistory();
    return all.filter(h => h.scenarioId === scenarioId);
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(): {
    totalEvaluations: number;
    versions: string[];
    scenarios: string[];
    averageOverallScore: number;
    bestVersion: string;
    worstVersion: string;
  } {
    const all = this.getAllMetricsHistory();
    const versions = Array.from(this.metricsHistory.keys());
    const scenarios = new Set(all.map(h => h.scenarioId));

    const averageOverallScore =
      all.length > 0
        ? all.reduce((sum, h) => sum + h.overallScore, 0) / all.length
        : 0;

    let bestVersion = "";
    let worstVersion = "";
    let bestScore = -Infinity;
    let worstScore = Infinity;

    versions.forEach(version => {
      const aggregation = this.aggregateMetrics(version);
      const score = aggregation.overallAggregation.average;
      if (score > bestScore) {
        bestScore = score;
        bestVersion = version;
      }
      if (score < worstScore) {
        worstScore = score;
        worstVersion = version;
      }
    });

    return {
      totalEvaluations: all.length,
      versions,
      scenarios: Array.from(scenarios),
      averageOverallScore,
      bestVersion,
      worstVersion,
    };
  }

  /**
   * Clear metrics history
   */
  clearMetricsHistory(): void {
    this.metricsHistory.clear();
    this.metricsTimeSeries.clear();
  }

  /**
   * Clear metrics for a specific version
   */
  clearMetricsForVersion(version: string): void {
    this.metricsHistory.delete(version);
    // Also clear time series for this version
    this.metricsTimeSeries.forEach((series, key) => {
      const filtered = series.filter(s => s.version !== version);
      if (filtered.length === 0) {
        this.metricsTimeSeries.delete(key);
      } else {
        this.metricsTimeSeries.set(key, filtered);
      }
    });
  }

  /**
   * Export metrics data
   */
  exportMetrics(): {
    history: EvaluationHistory[];
    timeSeries: Record<string, MetricsTimeSeries[]>;
  } {
    const timeSeries: Record<string, MetricsTimeSeries[]> = {};
    this.metricsTimeSeries.forEach((series, key) => {
      timeSeries[key] = series;
    });

    return {
      history: this.getAllMetricsHistory(),
      timeSeries,
    };
  }

  /**
   * Import metrics data
   */
  importMetrics(data: {
    history: EvaluationHistory[];
    timeSeries: Record<string, MetricsTimeSeries[]>;
  }): void {
    // Clear existing data
    this.clearMetricsHistory();

    // Import history
    data.history.forEach(history => {
      if (!this.metricsHistory.has(history.version)) {
        this.metricsHistory.set(history.version, []);
      }
      this.metricsHistory.get(history.version)!.push(history);
    });

    // Import time series
    Object.entries(data.timeSeries).forEach(([key, series]) => {
      this.metricsTimeSeries.set(key, series);
    });
  }
}

export const qualityMetricsEngine = QualityMetricsEngine.getInstance();
