/**
 * Meta Cognition Engine
 * Self-monitoring of intelligence
 */

import {
  MetricType,
  MetricValue,
  ImprovementProposal,
  SelfMonitoringReport,
  EnginePerformance,
  SystemPerformance,
  MetaCognitionConfig,
  defaultMetaCognitionConfig,
} from "./interfaces/IMetaCognitionEngine";
import { adaptiveIntelligenceOrchestrator } from "../../adaptive-intelligence/AdaptiveIntelligenceOrchestrator";

// ============================================================================
// META COGNITION ENGINE CLASS
// ============================================================================

export class MetaCognitionEngine {
  private static instance: MetaCognitionEngine;
  private config: MetaCognitionConfig;
  private metricsHistory: Map<string, MetricValue[]> = new Map();
  private enginePerformances: Map<string, EnginePerformance> = new Map();
  private systemPerformances: SystemPerformance[] = [];
  private improvementProposals: Map<string, ImprovementProposal> = new Map();
  private reports: Map<string, SelfMonitoringReport> = new Map();

  private constructor() {
    this.config = defaultMetaCognitionConfig;
  }

  static getInstance(): MetaCognitionEngine {
    if (!MetaCognitionEngine.instance) {
      MetaCognitionEngine.instance = new MetaCognitionEngine();
    }
    return MetaCognitionEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<MetaCognitionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Perform self-monitoring
   */
  async performSelfMonitoring(): Promise<SelfMonitoringReport> {
    const reportId = `report_${Date.now()}`;

    // Collect metrics
    const metrics = await this.collectMetrics();

    // Calculate overall health
    const overallHealth = this.calculateOverallHealth(metrics);

    // Determine health status
    const healthStatus = this.determineHealthStatus(overallHealth);

    // Generate improvement proposals
    const improvementProposals = this.config.autoGenerateProposals
      ? await this.generateImprovementProposals(metrics)
      : [];

    // Analyze trends
    const trends = this.analyzeTrends(metrics);

    // Generate alerts
    const alerts = this.generateAlerts(metrics, healthStatus);

    // Generate summary
    const summary = this.generateSummary(metrics, overallHealth, healthStatus);

    const report: SelfMonitoringReport = {
      id: reportId,
      timestamp: new Date(),
      metrics,
      overallHealth,
      healthStatus,
      improvementProposals,
      trends,
      alerts,
      summary,
    };

    this.reports.set(reportId, report);

    // Store metrics in history
    metrics.forEach(metric => {
      const history = this.metricsHistory.get(metric.type) || [];
      history.push(metric);

      // Limit history size
      const maxHistorySize = this.config.metricRetentionDays * 24 * 60; // Assuming monitoring every minute
      if (history.length > maxHistorySize) {
        history.shift();
      }

      this.metricsHistory.set(metric.type, history);
    });

    return report;
  }

  /**
   * Collect metrics
   */
  private async collectMetrics(): Promise<MetricValue[]> {
    const metrics: MetricValue[] = [];

    // Collect engine performance metrics
    const allEngineStats = adaptiveIntelligenceOrchestrator.getAllEngineStatistics();

    Object.entries(allEngineStats).forEach(([engineId, stats]) => {
      const performance = this.calculateEnginePerformance(engineId, stats);
      this.enginePerformances.set(engineId, performance);

      metrics.push({
        type: "quality",
        value: performance.quality,
        unit: "score",
        timestamp: new Date(),
        threshold: 0.7,
        status: performance.quality >= 0.7 ? "good" : performance.quality >= 0.5 ? "warning" : "critical",
      });

      metrics.push({
        type: "coherence",
        value: performance.coherence,
        unit: "score",
        timestamp: new Date(),
        threshold: 0.7,
        status: performance.coherence >= 0.7 ? "good" : performance.coherence >= 0.5 ? "warning" : "critical",
      });

      metrics.push({
        type: "speed",
        value: performance.speed,
        unit: "ms",
        timestamp: new Date(),
        threshold: 1000,
        status: performance.speed <= 1000 ? "good" : performance.speed <= 2000 ? "warning" : "critical",
      });
    });

    // Collect system performance metrics
    const systemPerformance = await this.collectSystemPerformance();
    this.systemPerformances.push(systemPerformance);

    metrics.push({
      type: "openai_consumption",
      value: systemPerformance.openaiConsumption,
      unit: "tokens",
      timestamp: new Date(),
      threshold: 100000,
      status: systemPerformance.openaiConsumption <= 100000 ? "good" : systemPerformance.openaiConsumption <= 200000 ? "warning" : "critical",
    });

    metrics.push({
      type: "cost",
      value: systemPerformance.totalCost,
      unit: "dollars",
      timestamp: new Date(),
      threshold: 100,
      status: systemPerformance.totalCost <= 100 ? "good" : systemPerformance.totalCost <= 200 ? "warning" : "critical",
    });

    return metrics;
  }

  /**
   * Calculate engine performance
   */
  private calculateEnginePerformance(engineId: string, stats: any): EnginePerformance {
    return {
      engineId,
      quality: (stats.overallSuccessRate || 0.8),
      coherence: 0.8, // Placeholder
      cost: (stats.totalCost || 0),
      speed: (stats.averageDecisionTime || 100),
      utility: 0.7, // Placeholder
      relevance: 0.75, // Placeholder
      confidence: (stats.overallSuccessRate || 0.8),
      explainability: 0.7, // Placeholder
      impact: 0.8, // Placeholder
      complexity: 0.6, // Placeholder
      lastUpdated: new Date(),
    };
  }

  /**
   * Collect system performance
   */
  private async collectSystemPerformance(): Promise<SystemPerformance> {
    // Placeholder implementation
    return {
      openaiConsumption: 50000,
      openaiCost: 50,
      supabaseConsumption: 1000,
      supabaseCost: 5,
      totalCost: 55,
      averageResponseTime: 500,
      uptime: 0.99,
      errorRate: 0.01,
      timestamp: new Date(),
    };
  }

  /**
   * Calculate overall health
   */
  private calculateOverallHealth(metrics: MetricValue[]): number {
    if (metrics.length === 0) return 0.5;

    let sum = 0;
    metrics.forEach(metric => {
      if (metric.status === "good") sum += 1;
      else if (metric.status === "warning") sum += 0.5;
    });

    return sum / metrics.length;
  }

  /**
   * Determine health status
   */
  private determineHealthStatus(overallHealth: number): "healthy" | "degraded" | "critical" {
    if (overallHealth >= 0.8) return "healthy";
    if (overallHealth >= 0.5) return "degraded";
    return "critical";
  }

  /**
   * Generate improvement proposals
   */
  private async generateImprovementProposals(metrics: MetricValue[]): Promise<ImprovementProposal[]> {
    const proposals: ImprovementProposal[] = [];

    metrics.forEach(metric => {
      if (metric.status === "critical" || metric.status === "warning") {
        const proposal = this.createImprovementProposal(metric);
        if (proposal) {
          proposals.push(proposal);
        }
      }
    });

    // Sort by priority
    proposals.sort((a, b) => b.priority - a.priority);

    // Limit proposals
    return proposals.slice(0, this.config.maxProposalsPerReport);
  }

  /**
   * Create improvement proposal
   */
  private createImprovementProposal(metric: MetricValue): ImprovementProposal | null {
    let description = "";
    let strategy = "";
    let targetValue = 0;

    switch (metric.type) {
      case "quality":
        description = "Engine quality is below threshold";
        strategy = "Improve decision logic and accuracy";
        targetValue = 0.8;
        break;
      case "coherence":
        description = "Engine coherence is below threshold";
        strategy = "Improve consistency of decisions";
        targetValue = 0.8;
        break;
      case "speed":
        description = "Response time is too slow";
        strategy = "Optimize algorithms and caching";
        targetValue = 500;
        break;
      case "cost":
        description = "Cost is above threshold";
        strategy = "Implement cost optimization strategies";
        targetValue = 50;
        break;
      case "openai_consumption":
        description = "OpenAI token consumption is high";
        strategy = "Reduce token usage and implement caching";
        targetValue = 50000;
        break;
      default:
        return null;
    }

    return {
      id: `proposal_${metric.type}_${Date.now()}`,
      metricType: metric.type,
      currentValue: metric.value,
      targetValue,
      description,
      strategy,
      expectedImpact: 0.7,
      effort: 0.5,
      priority: metric.status === "critical" ? 90 : 70,
      status: "pending",
      createdAt: new Date(),
    };
  }

  /**
   * Analyze trends
   */
  private analyzeTrends(metrics: MetricValue[]): Record<string, "improving" | "stable" | "degrading"> {
    const trends: Record<string, "improving" | "stable" | "degrading"> = {};

    metrics.forEach(metric => {
      const history = this.metricsHistory.get(metric.type) || [];
      if (history.length < 2) {
        trends[metric.type] = "stable";
        return;
      }

      const recentValues = history.slice(-5).map(m => m.value);
      const avgRecent = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
      const avgPrevious = recentValues.slice(0, -1).reduce((sum, val) => sum + val, 0) / (recentValues.length - 1);

      if (avgRecent > avgPrevious * 1.05) {
        trends[metric.type] = "improving";
      } else if (avgRecent < avgPrevious * 0.95) {
        trends[metric.type] = "degrading";
      } else {
        trends[metric.type] = "stable";
      }
    });

    return trends;
  }

  /**
   * Generate alerts
   */
  private generateAlerts(metrics: MetricValue[], healthStatus: "healthy" | "degraded" | "critical"): string[] {
    const alerts: string[] = [];

    if (healthStatus === "critical") {
      alerts.push("System health is critical. Immediate attention required.");
    }

    metrics.forEach(metric => {
      if (metric.status === "critical") {
        alerts.push(`${metric.type} is critical: ${metric.value} ${metric.unit}`);
      }
    });

    return alerts;
  }

  /**
   * Generate summary
   */
  private generateSummary(metrics: MetricValue[], overallHealth: number, healthStatus: "healthy" | "degraded" | "critical"): string {
    const criticalMetrics = metrics.filter(m => m.status === "critical").length;
    const warningMetrics = metrics.filter(m => m.status === "warning").length;
    const goodMetrics = metrics.filter(m => m.status === "good").length;

    return `System health: ${healthStatus} (${(overallHealth * 100).toFixed(0)}%). Metrics: ${goodMetrics} good, ${warningMetrics} warning, ${criticalMetrics} critical.`;
  }

  /**
   * Get engine performance
   */
  getEnginePerformance(engineId: string): EnginePerformance | null {
    return this.enginePerformances.get(engineId) || null;
  }

  /**
   * Get all engine performances
   */
  getAllEnginePerformances(): EnginePerformance[] {
    return Array.from(this.enginePerformances.values());
  }

  /**
   * Get system performance
   */
  getSystemPerformance(): SystemPerformance | null {
    return this.systemPerformances[this.systemPerformances.length - 1] || null;
  }

  /**
   * Get improvement proposals
   */
  getImprovementProposals(): ImprovementProposal[] {
    return Array.from(this.improvementProposals.values());
  }

  /**
   * Update proposal status
   */
  updateProposalStatus(proposalId: string, status: "pending" | "in_progress" | "implemented" | "rejected"): void {
    const proposal = this.improvementProposals.get(proposalId);
    if (proposal) {
      proposal.status = status;
    }
  }

  /**
   * Get report by ID
   */
  getReport(reportId: string): SelfMonitoringReport | null {
    return this.reports.get(reportId) || null;
  }

  /**
   * Get latest report
   */
  getLatestReport(): SelfMonitoringReport | null {
    const reports = Array.from(this.reports.values());
    if (reports.length === 0) return null;
    return reports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  /**
   * Clear old data
   */
  clearOldData(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.metricRetentionDays);

    // Clear old metrics
    this.metricsHistory.forEach((history, type) => {
      const filtered = history.filter(metric => metric.timestamp >= cutoffDate);
      this.metricsHistory.set(type, filtered);
    });

    // Clear old system performances
    this.systemPerformances = this.systemPerformances.filter(perf => perf.timestamp >= cutoffDate);
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalReports: number;
    totalProposals: number;
    averageHealth: number;
    healthDistribution: Record<string, number>;
    metricDistribution: Record<string, number>;
  } {
    const totalReports = this.reports.size;
    const totalProposals = this.improvementProposals.size;

    const averageHealth = totalReports > 0
      ? Array.from(this.reports.values()).reduce((sum, report) => sum + report.overallHealth, 0) / totalReports
      : 0;

    const healthDistribution: Record<string, number> = {
      healthy: 0,
      degraded: 0,
      critical: 0,
    };

    this.reports.forEach(report => {
      healthDistribution[report.healthStatus]++;
    });

    const metricDistribution: Record<string, number> = {};
    this.metricsHistory.forEach((history, type) => {
      metricDistribution[type] = history.length;
    });

    return {
      totalReports,
      totalProposals,
      averageHealth,
      healthDistribution,
      metricDistribution,
    };
  }
}

export const metaCognitionEngine = MetaCognitionEngine.getInstance();
