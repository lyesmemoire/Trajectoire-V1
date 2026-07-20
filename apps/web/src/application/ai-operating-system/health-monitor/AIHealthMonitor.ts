/**
 * AI Health Monitor
 * Real-time monitoring of all AI components
 */

import {
  HealthScoreType,
  HealthStatus,
  ComponentHealth,
  HealthSnapshot,
  HealthAlert,
  HealthTrend,
  HealthMetrics,
  AIHealthMonitorConfig,
  defaultAIHealthMonitorConfig,
} from "./interfaces/IAIHealthMonitor";

// ============================================================================
// AI HEALTH MONITOR CLASS
// ============================================================================

export class AIHealthMonitor {
  private static instance: AIHealthMonitor;
  private config: AIHealthMonitorConfig;
  private snapshots: Map<string, HealthSnapshot> = new Map();
  private alerts: Map<string, HealthAlert> = new Map();
  private trends: Map<string, HealthTrend> = new Map();
  private componentHealth: Map<string, ComponentHealth> = new Map();

  private constructor() {
    this.config = defaultAIHealthMonitorConfig;
    this.initializeComponentHealth();
  }

  static getInstance(): AIHealthMonitor {
    if (!AIHealthMonitor.instance) {
      AIHealthMonitor.instance = new AIHealthMonitor();
    }
    return AIHealthMonitor.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<AIHealthMonitorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize component health
   */
  private initializeComponentHealth(): void {
    const components: ComponentHealth[] = [
      {
        componentId: "reasoning_engine",
        componentName: "Reasoning Engine",
        status: "healthy",
        score: 0.85,
        metrics: { confidence: 0.85, speed: 0.8, accuracy: 0.9 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "memory_engine",
        componentName: "Memory Engine",
        status: "healthy",
        score: 0.9,
        metrics: { retention: 0.9, retrieval: 0.85, consolidation: 0.8 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "planning_engine",
        componentName: "Planning Engine",
        status: "healthy",
        score: 0.8,
        metrics: { accuracy: 0.8, efficiency: 0.75, adaptability: 0.85 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "conversation_engine",
        componentName: "Conversation Engine",
        status: "healthy",
        score: 0.85,
        metrics: { engagement: 0.85, relevance: 0.8, coherence: 0.9 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "recommendation_engine",
        componentName: "Recommendation Engine",
        status: "healthy",
        score: 0.75,
        metrics: { acceptance: 0.75, relevance: 0.8, diversity: 0.7 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "reflection_engine",
        componentName: "Reflection Engine",
        status: "healthy",
        score: 0.8,
        metrics: { accuracy: 0.8, depth: 0.75, actionability: 0.85 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "cost_optimizer",
        componentName: "Cost Optimizer",
        status: "healthy",
        score: 0.85,
        metrics: { savings: 0.85, efficiency: 0.8, accuracy: 0.9 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "governance_engine",
        componentName: "Governance Engine",
        status: "healthy",
        score: 0.9,
        metrics: { compliance: 0.9, accuracy: 0.85, coverage: 0.95 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "optimization_engine",
        componentName: "Optimization Engine",
        status: "healthy",
        score: 0.8,
        metrics: { effectiveness: 0.8, efficiency: 0.75, impact: 0.85 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
      {
        componentId: "explainability_engine",
        componentName: "Explainability Engine",
        score: 0.85,
        status: "healthy",
        metrics: { clarity: 0.85, completeness: 0.8, accuracy: 0.9 },
        lastUpdated: new Date(),
        issues: [],
        warnings: [],
      },
    ];

    components.forEach(component => {
      this.componentHealth.set(component.componentId, component);
    });
  }

  /**
   * Take health snapshot
   */
  async takeSnapshot(): Promise<HealthSnapshot> {
    const snapshotId = `snapshot_${Date.now()}`;

    // Calculate scores
    const globalIntelligenceScore = this.calculateGlobalIntelligenceScore();
    const reasoningScore = this.getComponentScore("reasoning_engine");
    const memoryScore = this.getComponentScore("memory_engine");
    const planningScore = this.getComponentScore("planning_engine");
    const conversationScore = this.getComponentScore("conversation_engine");
    const recommendationScore = this.getComponentScore("recommendation_engine");
    const reflectionScore = this.getComponentScore("reflection_engine");
    const costScore = this.getComponentScore("cost_optimizer");
    const productScore = 0.8; // Placeholder
    const executionScore = this.calculateExecutionScore();
    const governanceScore = this.getComponentScore("governance_engine");
    const optimizationScore = this.getComponentScore("optimization_engine");
    const explainabilityScore = this.getComponentScore("explainability_engine");

    // Calculate overall health
    const overallHealth = (
      globalIntelligenceScore +
      reasoningScore +
      memoryScore +
      planningScore +
      conversationScore +
      recommendationScore +
      reflectionScore +
      costScore +
      productScore +
      executionScore +
      governanceScore +
      optimizationScore +
      explainabilityScore
    ) / 13;

    // Determine health status
    const healthStatus = this.determineHealthStatus(overallHealth);

    const snapshot: HealthSnapshot = {
      id: snapshotId,
      timestamp: new Date(),
      globalIntelligenceScore,
      reasoningScore,
      memoryScore,
      planningScore,
      conversationScore,
      recommendationScore,
      reflectionScore,
      costScore,
      productScore,
      executionScore,
      governanceScore,
      optimizationScore,
      explainabilityScore,
      overallHealth,
      healthStatus,
      componentHealth: new Map(this.componentHealth),
    };

    this.snapshots.set(snapshotId, snapshot);

    // Generate alerts if enabled
    if (this.config.enableAutoAlerts) {
      await this.generateAlerts(snapshot);
    }

    // Generate trends if enabled
    if (this.config.enableTrendAnalysis) {
      await this.generateTrends(snapshot);
    }

    return snapshot;
  }

  /**
   * Calculate global intelligence score
   */
  private calculateGlobalIntelligenceScore(): number {
    const scores = Array.from(this.componentHealth.values()).map(component => component.score);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  /**
   * Get component score
   */
  private getComponentScore(componentId: string): number {
    const component = this.componentHealth.get(componentId);
    return component?.score || 0.5;
  }

  /**
   * Calculate execution score
   */
  private calculateExecutionScore(): number {
    return 0.85; // Placeholder
  }

  /**
   * Determine health status
   */
  private determineHealthStatus(overallHealth: number): HealthStatus {
    if (overallHealth >= this.config.healthThresholds.healthy) return "healthy";
    if (overallHealth >= this.config.healthThresholds.degraded) return "degraded";
    if (overallHealth >= this.config.healthThresholds.critical) return "critical";
    return "unknown";
  }

  /**
   * Generate alerts
   */
  private async generateAlerts(snapshot: HealthSnapshot): Promise<void> {
    // Check for critical health
    if (snapshot.healthStatus === "critical") {
      this.createAlert("critical", "system", "System", "System health is critical", `Overall health: ${snapshot.overallHealth.toFixed(2)}`);
    }

    // Check component health
    snapshot.componentHealth.forEach(component => {
      if (component.status === "critical") {
        this.createAlert("critical", component.componentId, component.componentName, "Component health is critical", `Score: ${component.score.toFixed(2)}`);
      } else if (component.status === "degraded") {
        this.createAlert("warning", component.componentId, component.componentName, "Component health is degraded", `Score: ${component.score.toFixed(2)}`);
      }
    });
  }

  /**
   * Create alert
   */
  private createAlert(severity: "info" | "warning" | "error" | "critical", componentId: string, componentName: string, message: string, details: string): void {
    const alert: HealthAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      severity,
      componentId,
      componentName,
      message,
      details,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
      resolvedAt: null,
    };

    this.alerts.set(alert.id, alert);
  }

  /**
   * Generate trends
   */
  private async generateTrends(snapshot: HealthSnapshot): Promise<void> {
    const scoreTypes: HealthScoreType[] = [
      "global_intelligence",
      "reasoning",
      "memory",
      "planning",
      "conversation",
      "recommendation",
      "reflection",
      "cost",
      "product",
      "execution",
      "governance",
      "optimization",
      "explainability",
    ];

    scoreTypes.forEach(scoreType => {
      const currentValue = this.getScoreValue(snapshot, scoreType);
      const previousValue = this.getPreviousScoreValue(scoreType);
      const trend = this.calculateTrend(currentValue, previousValue);
      const changePercentage = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

      const healthTrend: HealthTrend = {
        scoreType,
        currentValue,
        previousValue,
        trend,
        changePercentage,
        timeRange: "1h",
        timestamp: new Date(),
      };

      this.trends.set(`${scoreType}_trend`, healthTrend);
    });
  }

  /**
   * Get score value from snapshot
   */
  private getScoreValue(snapshot: HealthSnapshot, scoreType: HealthScoreType): number {
    switch (scoreType) {
      case "global_intelligence": return snapshot.globalIntelligenceScore;
      case "reasoning": return snapshot.reasoningScore;
      case "memory": return snapshot.memoryScore;
      case "planning": return snapshot.planningScore;
      case "conversation": return snapshot.conversationScore;
      case "recommendation": return snapshot.recommendationScore;
      case "reflection": return snapshot.reflectionScore;
      case "cost": return snapshot.costScore;
      case "product": return snapshot.productScore;
      case "execution": return snapshot.executionScore;
      case "governance": return snapshot.governanceScore;
      case "optimization": return snapshot.optimizationScore;
      case "explainability": return snapshot.explainabilityScore;
      default: return 0.5;
    }
  }

  /**
   * Get previous score value
   */
  private getPreviousScoreValue(scoreType: HealthScoreType): number {
    const snapshots = Array.from(this.snapshots.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (snapshots.length < 2) return 0.5;

    const previousSnapshot = snapshots[1];
    return this.getScoreValue(previousSnapshot, scoreType);
  }

  /**
   * Calculate trend
   */
  private calculateTrend(currentValue: number, previousValue: number): "improving" | "stable" | "degrading" {
    if (currentValue > previousValue * 1.05) return "improving";
    if (currentValue < previousValue * 0.95) return "degrading";
    return "stable";
  }

  /**
   * Get latest snapshot
   */
  getLatestSnapshot(): HealthSnapshot | null {
    const snapshots = Array.from(this.snapshots.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return snapshots[0] || null;
  }

  /**
   * Get snapshot
   */
  getSnapshot(snapshotId: string): HealthSnapshot | null {
    return this.snapshots.get(snapshotId) || null;
  }

  /**
   * Get component health
   */
  getComponentHealth(componentId: string): ComponentHealth | null {
    return this.componentHealth.get(componentId) || null;
  }

  /**
   * Update component health
   */
  updateComponentHealth(componentId: string, updates: Partial<ComponentHealth>): void {
    const component = this.componentHealth.get(componentId);
    if (component) {
      const updated = { ...component, ...updates, lastUpdated: new Date() };
      this.componentHealth.set(componentId, updated);
    }
  }

  /**
   * Get alerts
   */
  getAlerts(): HealthAlert[] {
    return Array.from(this.alerts.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): HealthAlert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
    }
  }

  /**
   * Get trends
   */
  getTrends(): HealthTrend[] {
    return Array.from(this.trends.values());
  }

  /**
   * Get trend
   */
  getTrend(scoreType: HealthScoreType): HealthTrend | null {
    return this.trends.get(`${scoreType}_trend`) || null;
  }

  /**
   * Get metrics
   */
  getMetrics(): HealthMetrics {
    const totalSnapshots = this.snapshots.size;
    const totalAlerts = this.alerts.size;
    const activeAlerts = Array.from(this.alerts.values()).filter(alert => !alert.resolved).length;
    const resolvedAlerts = totalAlerts - activeAlerts;

    const snapshots = Array.from(this.snapshots.values());
    const averageHealth = snapshots.length > 0
      ? snapshots.reduce((sum, snapshot) => sum + snapshot.overallHealth, 0) / snapshots.length
      : 0;

    const healthDistribution: Record<string, number> = {
      healthy: 0,
      degraded: 0,
      critical: 0,
      unknown: 0,
    };

    snapshots.forEach(snapshot => {
      healthDistribution[snapshot.healthStatus]++;
    });

    const trendDistribution: Record<string, number> = {
      improving: 0,
      stable: 0,
      degrading: 0,
    };

    this.trends.forEach(trend => {
      trendDistribution[trend.trend]++;
    });

    const uptime = 0.99; // Placeholder
    const averageResponseTime = 500; // Placeholder

    return {
      totalSnapshots,
      totalAlerts,
      activeAlerts,
      resolvedAlerts,
      averageHealth,
      healthDistribution,
      trendDistribution,
      uptime,
      averageResponseTime,
    };
  }

  /**
   * Clear old data
   */
  clearOldData(): void {
    const snapshotCutoff = new Date();
    snapshotCutoff.setDate(snapshotCutoff.getDate() - this.config.snapshotRetentionDays);

    const alertCutoff = new Date();
    alertCutoff.setDate(alertCutoff.getDate() - this.config.alertRetentionDays);

    // Clear old snapshots
    this.snapshots.forEach((snapshot, id) => {
      if (snapshot.timestamp < snapshotCutoff) {
        this.snapshots.delete(id);
      }
    });

    // Clear old alerts
    this.alerts.forEach((alert, id) => {
      if (alert.timestamp < alertCutoff) {
        this.alerts.delete(id);
      }
    });
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.snapshots.clear();
    this.alerts.clear();
    this.trends.clear();
  }
}

export const aiHealthMonitor = AIHealthMonitor.getInstance();
