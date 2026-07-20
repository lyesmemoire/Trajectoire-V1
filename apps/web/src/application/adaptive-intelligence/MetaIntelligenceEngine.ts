/**
 * Meta Intelligence Engine
 * Decides when NOT to invoke certain engines for efficiency
 */

import {
  EngineInvocationDecision,
  MetaDecision,
  MetaContext,
  EngineHistoryEntry,
  MetaIntelligenceConfig,
  defaultMetaIntelligenceConfig,
} from "./interfaces/IMetaIntelligenceEngine";

// ============================================================================
// META INTELLIGENCE ENGINE CLASS
// ============================================================================

export class MetaIntelligenceEngine {
  private static instance: MetaIntelligenceEngine;
  private config: MetaIntelligenceConfig;
  private decisionHistory: MetaDecision[] = [];
  private engineHistory: Map<string, EngineHistoryEntry[]> = new Map();

  private constructor() {
    this.config = defaultMetaIntelligenceConfig;
  }

  static getInstance(): MetaIntelligenceEngine {
    if (!MetaIntelligenceEngine.instance) {
      MetaIntelligenceEngine.instance = new MetaIntelligenceEngine();
    }
    return MetaIntelligenceEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<MetaIntelligenceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Make meta decision for engine invocation
   */
  makeDecision(context: MetaContext): MetaDecision {
    const engines = [
      "DecisionPolicyEngine",
      "CostOptimizationEngine",
      "StrategyEngine",
      "PlanningEngine",
      "RecommendationFusionEngine",
      "ROIEngine",
      "ImpactSimulationEngine",
      "FeedbackLearningEngine",
      "UserPersonalizationEngine",
    ];

    const decisions = engines.map(engine => this.evaluateEngine(engine, context));
    const totalSavings = decisions.reduce((sum, d) => sum + d.expectedSavings, 0);
    const overallRecommendation = this.generateOverallRecommendation(decisions, context);

    const metaDecision: MetaDecision = {
      id: `meta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      context,
      decisions,
      overallRecommendation,
      totalSavings,
      timestamp: new Date(),
    };

    this.decisionHistory.push(metaDecision);
    return metaDecision;
  }

  /**
   * Evaluate whether to invoke a specific engine
   */
  private evaluateEngine(engine: string, context: MetaContext): EngineInvocationDecision {
    const history = this.getEngineHistory(engine, context);
    const shouldInvoke = this.shouldInvokeEngine(engine, context, history);
    const reason = this.generateReason(engine, shouldInvoke, context, history);
    const confidence = this.calculateConfidence(engine, context, history);
    const alternative = shouldInvoke ? null : this.generateAlternative(engine, context);
    const expectedSavings = shouldInvoke ? 0 : this.calculateSavings(engine, context, history);

    return {
      engine,
      shouldInvoke,
      reason,
      confidence,
      alternative,
      expectedSavings,
      timestamp: new Date(),
    };
  }

  /**
   * Get engine history
   */
  private getEngineHistory(engine: string, context: MetaContext): EngineHistoryEntry | null {
    const userHistory = this.engineHistory.get(context.userId) || [];
    return userHistory.find(h => h.engine === engine) || null;
  }

  /**
   * Determine if engine should be invoked
   */
  private shouldInvokeEngine(
    engine: string,
    context: MetaContext,
    history: EngineHistoryEntry | null
  ): boolean {
    // Check budget constraint
    if (context.budgetRemaining < this.config.budgetThreshold) {
      if (this.isExpensiveEngine(engine)) {
        return false;
      }
    }

    // Check time constraint
    if (context.timeAvailable < this.config.timeThreshold) {
      if (this.isTimeConsumingEngine(engine)) {
        return false;
      }
    }

    // Check urgency
    if (context.urgency === "high") {
      // Skip non-critical engines in high urgency
      if (!this.isCriticalEngine(engine)) {
        return false;
      }
    }

    // Check user state
    if (context.userState.stress > this.config.stressThreshold) {
      if (this.isStressSensitiveEngine(engine)) {
        return false;
      }
    }

    if (context.userState.fatigue > this.config.fatigueThreshold) {
      if (this.isCognitiveHeavyEngine(engine)) {
        return false;
      }
    }

    if (context.userState.engagement < this.config.engagementThreshold) {
      if (this.isEngagementDependentEngine(engine)) {
        return false;
      }
    }

    // Check success rate
    if (history && history.successRate < this.config.successRateThreshold) {
      return false;
    }

    // Check cost-benefit ratio
    if (history) {
      const ratio = history.averageValue / history.averageCost;
      if (ratio < this.config.costBenefitRatio) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if engine is expensive
   */
  private isExpensiveEngine(engine: string): boolean {
    const expensiveEngines = [
      "ImpactSimulationEngine",
      "StrategyEngine",
      "PlanningEngine",
    ];
    return expensiveEngines.includes(engine);
  }

  /**
   * Check if engine is time-consuming
   */
  private isTimeConsumingEngine(engine: string): boolean {
    const timeConsumingEngines = [
      "StrategyEngine",
      "PlanningEngine",
      "ImpactSimulationEngine",
      "FeedbackLearningEngine",
    ];
    return timeConsumingEngines.includes(engine);
  }

  /**
   * Check if engine is critical
   */
  private isCriticalEngine(engine: string): boolean {
    const criticalEngines = [
      "DecisionPolicyEngine",
      "CostOptimizationEngine",
      "ROIEngine",
    ];
    return criticalEngines.includes(engine);
  }

  /**
   * Check if engine is stress-sensitive
   */
  private isStressSensitiveEngine(engine: string): boolean {
    const stressSensitiveEngines = [
      "ImpactSimulationEngine",
      "FeedbackLearningEngine",
    ];
    return stressSensitiveEngines.includes(engine);
  }

  /**
   * Check if engine is cognitively heavy
   */
  private isCognitiveHeavyEngine(engine: string): boolean {
    const cognitiveHeavyEngines = [
      "StrategyEngine",
      "PlanningEngine",
      "ImpactSimulationEngine",
    ];
    return cognitiveHeavyEngines.includes(engine);
  }

  /**
   * Check if engine is engagement-dependent
   */
  private isEngagementDependentEngine(engine: string): boolean {
    const engagementDependentEngines = [
      "FeedbackLearningEngine",
      "UserPersonalizationEngine",
    ];
    return engagementDependentEngines.includes(engine);
  }

  /**
   * Generate reason for decision
   */
  private generateReason(
    engine: string,
    shouldInvoke: boolean,
    context: MetaContext,
    history: EngineHistoryEntry | null
  ): string {
    const reasons: string[] = [];

    if (shouldInvoke) {
      reasons.push("Engine invocation recommended");
      reasons.push(`Budget sufficient: $${context.budgetRemaining.toFixed(4)}`);
      reasons.push(`Time available: ${context.timeAvailable} minutes`);
    } else {
      reasons.push("Engine invocation NOT recommended");

      if (context.budgetRemaining < this.config.budgetThreshold && this.isExpensiveEngine(engine)) {
        reasons.push("Insufficient budget for expensive engine");
      }

      if (context.timeAvailable < this.config.timeThreshold && this.isTimeConsumingEngine(engine)) {
        reasons.push("Insufficient time for time-consuming engine");
      }

      if (context.urgency === "high" && !this.isCriticalEngine(engine)) {
        reasons.push("Non-critical engine skipped due to high urgency");
      }

      if (context.userState.stress > this.config.stressThreshold && this.isStressSensitiveEngine(engine)) {
        reasons.push("Engine skipped due to high user stress");
      }

      if (context.userState.fatigue > this.config.fatigueThreshold && this.isCognitiveHeavyEngine(engine)) {
        reasons.push("Engine skipped due to high user fatigue");
      }

      if (history && history.successRate < this.config.successRateThreshold) {
        reasons.push(`Low success rate: ${(history.successRate * 100).toFixed(0)}%`);
      }
    }

    return reasons.join("; ");
  }

  /**
   * Calculate confidence in decision
   */
  private calculateConfidence(
    engine: string,
    context: MetaContext,
    history: EngineHistoryEntry | null
  ): number {
    let confidence = 0.5;

    // Higher confidence with more history
    if (history) {
      confidence += 0.2;
    }

    // Higher confidence with clear budget/time constraints
    if (context.budgetRemaining > this.config.budgetThreshold * 2) {
      confidence += 0.1;
    }

    if (context.timeAvailable > this.config.timeThreshold * 2) {
      confidence += 0.1;
    }

    // Higher confidence with clear user state
    if (context.userState.stress < this.config.stressThreshold) {
      confidence += 0.05;
    }

    if (context.userState.fatigue < this.config.fatigueThreshold) {
      confidence += 0.05;
    }

    return Math.min(1, confidence);
  }

  /**
   * Generate alternative action
   */
  private generateAlternative(engine: string, context: MetaContext): string | null {
    const alternatives: Record<string, string> = {
      DecisionPolicyEngine: "Use default decision rules",
      CostOptimizationEngine: "Use default cost parameters",
      StrategyEngine: "Use existing strategy",
      PlanningEngine: "Use existing plan",
      RecommendationFusionEngine: "Use raw recommendations",
      ROIEngine: "Skip ROI calculation",
      ImpactSimulationEngine: "Execute without simulation",
      FeedbackLearningEngine: "Defer feedback processing",
      UserPersonalizationEngine: "Use default personalization",
    };

    return alternatives[engine] || null;
  }

  /**
   * Calculate expected savings
   */
  private calculateSavings(
    engine: string,
    context: MetaContext,
    history: EngineHistoryEntry | null
  ): number {
    let savings = 0;

    // Cost savings
    if (this.isExpensiveEngine(engine)) {
      savings += 0.05; // Estimated cost savings
    }

    // Time savings
    if (this.isTimeConsumingEngine(engine)) {
      savings += 30; // Estimated time savings in minutes
    }

    // Cognitive load savings
    if (this.isCognitiveHeavyEngine(engine)) {
      savings += 20; // Estimated cognitive load savings
    }

    return savings;
  }

  /**
   * Generate overall recommendation
   */
  private generateOverallRecommendation(
    decisions: EngineInvocationDecision[],
    context: MetaContext
  ): string {
    const invokedEngines = decisions.filter(d => d.shouldInvoke).length;
    const skippedEngines = decisions.filter(d => !d.shouldInvoke).length;
    const totalSavings = decisions.reduce((sum, d) => sum + d.expectedSavings, 0);

    if (skippedEngines === 0) {
      return "All engines recommended for invocation";
    }

    if (invokedEngines === 0) {
      return "All engines skipped - use default behavior";
    }

    return `${invokedEngines} engines invoked, ${skippedEngines} skipped. Estimated savings: ${totalSavings.toFixed(2)}`;
  }

  /**
   * Record engine invocation result
   */
  recordEngineInvocation(
    userId: string,
    engine: string,
    success: boolean,
    cost: number,
    value: number
  ): void {
    const userHistory = this.engineHistory.get(userId) || [];
    const existingEntry = userHistory.find(h => h.engine === engine);

    if (existingEntry) {
      // Update existing entry
      const newSuccessRate = (existingEntry.successRate * 0.9) + (success ? 0.1 : 0);
      const newAverageCost = (existingEntry.averageCost * 0.9) + (cost * 0.1);
      const newAverageValue = (existingEntry.averageValue * 0.9) + (value * 0.1);

      existingEntry.lastInvoked = new Date();
      existingEntry.successRate = newSuccessRate;
      existingEntry.averageCost = newAverageCost;
      existingEntry.averageValue = newAverageValue;
    } else {
      // Create new entry
      userHistory.push({
        engine,
        lastInvoked: new Date(),
        successRate: success ? 1 : 0,
        averageCost: cost,
        averageValue: value,
      });
    }

    this.engineHistory.set(userId, userHistory);
  }

  /**
   * Get decision history
   */
  getDecisionHistory(): MetaDecision[] {
    return this.decisionHistory;
  }

  /**
   * Get decisions by user
   */
  getDecisionsByUser(userId: string): MetaDecision[] {
    return this.decisionHistory.filter(d => d.context.userId === userId);
  }

  /**
   * Get engine history
   */
  getEngineHistoryByUser(userId: string): EngineHistoryEntry[] {
    return this.engineHistory.get(userId) || [];
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalDecisions: number;
    averageEnginesInvoked: number;
    averageEnginesSkipped: number;
    averageSavings: number;
    engineInvocationRates: Record<string, number>;
    overallSuccessRate: number;
  } {
    const totalDecisions = this.decisionHistory.length;
    const averageEnginesInvoked = totalDecisions > 0
      ? this.decisionHistory.reduce((sum, d) => sum + d.decisions.filter(dec => dec.shouldInvoke).length, 0) / totalDecisions
      : 0;

    const averageEnginesSkipped = totalDecisions > 0
      ? this.decisionHistory.reduce((sum, d) => sum + d.decisions.filter(dec => !dec.shouldInvoke).length, 0) / totalDecisions
      : 0;

    const averageSavings = totalDecisions > 0
      ? this.decisionHistory.reduce((sum, d) => sum + d.totalSavings, 0) / totalDecisions
      : 0;

    const engineInvocationRates: Record<string, number> = {};
    const allEngines = Array.from(new Set(
      this.decisionHistory.flatMap(d => d.decisions.map(dec => dec.engine))
    ));

    allEngines.forEach(engine => {
      const totalInvocations = this.decisionHistory.reduce(
        (sum, d) => sum + (d.decisions.find(dec => dec.engine === engine)?.shouldInvoke ? 1 : 0),
        0
      );
      engineInvocationRates[engine] = totalInvocations / totalDecisions;
    });

    // Calculate overall success rate from engine history
    const allHistoryEntries = Array.from(this.engineHistory.values()).flat();
    const overallSuccessRate = allHistoryEntries.length > 0
      ? allHistoryEntries.reduce((sum, h) => sum + h.successRate, 0) / allHistoryEntries.length
      : 0;

    return {
      totalDecisions,
      averageEnginesInvoked,
      averageEnginesSkipped,
      averageSavings,
      engineInvocationRates,
      overallSuccessRate,
    };
  }

  /**
   * Export data
   */
  exportData(): {
    decisionHistory: MetaDecision[];
    engineHistory: Record<string, EngineHistoryEntry[]>;
    config: MetaIntelligenceConfig;
  } {
    const engineHistoryObj: Record<string, EngineHistoryEntry[]> = {};
    this.engineHistory.forEach((value, key) => {
      engineHistoryObj[key] = value;
    });

    return {
      decisionHistory: this.decisionHistory,
      engineHistory: engineHistoryObj,
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    decisionHistory: MetaDecision[];
    engineHistory: Record<string, EngineHistoryEntry[]>;
    config?: MetaIntelligenceConfig;
  }): void {
    this.decisionHistory = data.decisionHistory;
    Object.entries(data.engineHistory).forEach(([userId, history]) => {
      this.engineHistory.set(userId, history);
    });
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.decisionHistory = [];
    this.engineHistory.clear();
  }
}

export const metaIntelligenceEngine = MetaIntelligenceEngine.getInstance();
