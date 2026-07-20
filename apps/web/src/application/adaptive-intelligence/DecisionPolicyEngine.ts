/**
 * Decision Policy Engine
 * Automatic rule weighting instead of static if/then rules
 */

import {
  PolicyFactors,
  PolicyWeights,
  PolicyScore,
  PolicyDecision,
  PolicyAlternative,
  PolicyConfig,
  PolicyLearning,
  defaultPolicyConfig,
} from "./interfaces/IDecisionPolicyEngine";

// ============================================================================
// DECISION POLICY ENGINE CLASS
// ============================================================================

export class DecisionPolicyEngine {
  private static instance: DecisionPolicyEngine;
  private config: PolicyConfig;
  private learningHistory: PolicyLearning[] = [];

  private constructor() {
    this.config = defaultPolicyConfig;
  }

  static getInstance(): DecisionPolicyEngine {
    if (!DecisionPolicyEngine.instance) {
      DecisionPolicyEngine.instance = new DecisionPolicyEngine();
    }
    return DecisionPolicyEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<PolicyConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      weights: { ...this.config.weights, ...config.weights },
      thresholds: { ...this.config.thresholds, ...config.thresholds },
    };
  }

  /**
   * Calculate policy score from factors
   */
  calculateScore(factors: PolicyFactors): PolicyScore {
    const components = this.calculateComponents(factors);
    const overall = this.calculateOverallScore(components);
    const priority = this.determinePriority(overall);
    const confidence = this.calculateConfidence(factors, components);

    return {
      overall,
      components,
      priority,
      confidence,
      timestamp: new Date(),
    };
  }

  /**
   * Calculate individual component scores
   */
  private calculateComponents(factors: PolicyFactors): PolicyScore["components"] {
    return {
      stress: this.normalizeFactor(factors.stress, true), // Higher stress = higher score (needs attention)
      confidence: this.normalizeFactor(factors.confidence, false), // Lower confidence = higher score
      employability: this.normalizeFactor(factors.employability, false), // Lower employability = higher score
      goalUrgency: this.normalizeFactor(factors.goalUrgency, true), // Higher urgency = higher score
      timeAvailable: this.normalizeFactor(factors.timeAvailable, false), // Less time = higher score
      historyCount: this.normalizeFactor(factors.historyCount, false), // Less history = higher score
      engagement: this.normalizeFactor(factors.engagement, false), // Lower engagement = higher score
      readiness: this.normalizeFactor(factors.readiness, false), // Lower readiness = higher score
      capability: this.normalizeFactor(factors.capability, false), // Lower capability = higher score
      motivation: this.normalizeFactor(factors.motivation, false), // Lower motivation = higher score
      fatigue: this.normalizeFactor(factors.fatigue, true), // Higher fatigue = higher score
      recentPerformance: this.normalizeFactor(factors.recentPerformance, false), // Declining = higher score
      goalProgress: this.normalizeFactor(factors.goalProgress, false), // Lower progress = higher score
      skillGaps: this.normalizeFactor(factors.skillGaps, true), // Higher gaps = higher score
      weaknessSeverity: this.normalizeFactor(factors.weaknessSeverity, true), // Higher severity = higher score
      sessionCount: this.normalizeFactor(factors.sessionCount, false), // Fewer sessions = higher score
      streak: this.normalizeFactor(factors.streak, false), // Lower streak = higher score
    };
  }

  /**
   * Normalize factor to 0-1 range
   */
  private normalizeFactor(value: number, higherIsWorse: boolean): number {
    // Normalize to 0-1 range
    const normalized = Math.min(1, Math.max(0, value / 100));
    
    // If higher is worse, invert the score
    return higherIsWorse ? normalized : 1 - normalized;
  }

  /**
   * Calculate overall weighted score
   */
  private calculateOverallScore(components: PolicyScore["components"]): number {
    const weights = this.config.weights;
    
    return (
      components.stress * weights.stress +
      components.confidence * weights.confidence +
      components.employability * weights.employability +
      components.goalUrgency * weights.goalUrgency +
      components.timeAvailable * weights.timeAvailable +
      components.historyCount * weights.historyCount +
      components.engagement * weights.engagement +
      components.readiness * weights.readiness +
      components.capability * weights.capability +
      components.motivation * weights.motivation +
      components.fatigue * weights.fatigue +
      components.recentPerformance * weights.recentPerformance +
      components.goalProgress * weights.goalProgress +
      components.skillGaps * weights.skillGaps +
      components.weaknessSeverity * weights.weaknessSeverity +
      components.sessionCount * weights.sessionCount +
      components.streak * weights.streak
    );
  }

  /**
   * Determine priority based on score
   */
  private determinePriority(score: number): "critical" | "high" | "medium" | "low" {
    const thresholds = this.config.thresholds;
    
    if (score >= thresholds.critical) return "critical";
    if (score >= thresholds.high) return "high";
    if (score >= thresholds.medium) return "medium";
    return "low";
  }

  /**
   * Calculate confidence in the score
   */
  private calculateConfidence(factors: PolicyFactors, components: PolicyScore["components"]): number {
    // Confidence based on data quality and consistency
    let confidence = 0.5; // Base confidence

    // More history = higher confidence
    confidence += Math.min(0.2, factors.historyCount * 0.01);

    // More sessions = higher confidence
    confidence += Math.min(0.15, factors.sessionCount * 0.01);

    // Consistent streak = higher confidence
    if (factors.streak > 5) confidence += 0.1;

    // High engagement = higher confidence
    if (factors.engagement > 0.7) confidence += 0.1;

    return Math.min(1, confidence);
  }

  /**
   * Make policy decision
   */
  makeDecision(factors: PolicyFactors): PolicyDecision {
    const score = this.calculateScore(factors);
    const recommendedActions = this.generateRecommendedActions(factors, score);
    const reasoning = this.generateReasoning(factors, score);
    const alternatives = this.generateAlternatives(factors, score);

    return {
      id: `policy_decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      factors,
      score,
      recommendedActions,
      reasoning,
      alternatives,
      timestamp: new Date(),
    };
  }

  /**
   * Generate recommended actions based on score
   */
  private generateRecommendedActions(factors: PolicyFactors, score: PolicyScore): string[] {
    const actions: string[] = [];

    // Critical factors
    if (score.components.stress > 0.7) {
      actions.push("intervene_stress_relief");
      actions.push("guide_calming_techniques");
    }

    if (score.components.confidence > 0.6) {
      actions.push("boost_confidence");
      actions.push("provide_encouragement");
    }

    if (score.components.engagement > 0.6) {
      actions.push("re_engagement_strategies");
      actions.push("gamification_elements");
    }

    // High priority factors
    if (score.components.goalUrgency > 0.7) {
      actions.push("goal_support");
      actions.push("accelerate_progress");
    }

    if (score.components.weaknessSeverity > 0.7) {
      actions.push("address_weaknesses");
      actions.push("skill_development");
    }

    if (score.components.skillGaps > 0.6) {
      actions.push("skill_training");
      actions.push("learning_path");
    }

    // Medium priority factors
    if (score.components.employability > 0.5) {
      actions.push("employability_improvement");
      actions.push("career_guidance");
    }

    if (score.components.capability > 0.5) {
      actions.push("capability_building");
      actions.push("advanced_training");
    }

    // Low priority factors
    if (score.components.motivation > 0.5) {
      actions.push("motivation_boost");
      actions.push("goal_reinforcement");
    }

    return actions;
  }

  /**
   * Generate reasoning for the decision
   */
  private generateReasoning(factors: PolicyFactors, score: PolicyScore): string {
    const reasons: string[] = [];

    // Identify top contributing factors
    const sortedComponents = Object.entries(score.components)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    sortedComponents.forEach(([component, value]) => {
      if (value > 0.5) {
        reasons.push(`${component} (${(value * 100).toFixed(0)}%)`);
      }
    });

    if (reasons.length === 0) {
      return "All factors within acceptable range - standard monitoring";
    }

    return `Primary factors: ${reasons.join(", ")}`;
  }

  /**
   * Generate alternative actions
   */
  private generateAlternatives(factors: PolicyFactors, score: PolicyScore): PolicyAlternative[] {
    const alternatives: PolicyAlternative[] = [];

    // Alternative 1: Focus on top factor only
    const topFactor = Object.entries(score.components)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (topFactor[1] > 0.5) {
      alternatives.push({
        actions: [`address_${topFactor[0]}`],
        expectedScore: score.overall - topFactor[1] * 0.5,
        confidence: score.confidence * 0.8,
        tradeoffs: ["Single focus", "May miss other factors"],
      });
    }

    // Alternative 2: Balanced approach
    alternatives.push({
      actions: ["balanced_approach"],
      expectedScore: score.overall * 0.9,
      confidence: score.confidence * 0.9,
      tradeoffs: ["Slower progress", "More comprehensive"],
    });

    // Alternative 3: Minimal intervention
    alternatives.push({
      actions: ["minimal_intervention"],
      expectedScore: score.overall * 0.7,
      confidence: score.confidence * 0.7,
      tradeoffs: ["Low cost", "May not address issues"],
    });

    return alternatives.slice(0, this.config.maxAlternatives);
  }

  /**
   * Learn from feedback
   */
  learnFromFeedback(learning: PolicyLearning): void {
    this.learningHistory.push(learning);

    // Adjust weights based on feedback
    if (learning.feedback === "positive") {
      // Increase weights for factors that contributed positively
      Object.entries(learning.weightAdjustments).forEach(([factor, adjustment]) => {
        if (this.config.weights[factor as keyof PolicyWeights] !== undefined) {
          this.config.weights[factor as keyof PolicyWeights] += adjustment * this.config.adaptationRate;
        }
      });
    } else if (learning.feedback === "negative") {
      // Decrease weights for factors that contributed negatively
      Object.entries(learning.weightAdjustments).forEach(([factor, adjustment]) => {
        if (this.config.weights[factor as keyof PolicyWeights] !== undefined) {
          this.config.weights[factor as keyof PolicyWeights] -= adjustment * this.config.adaptationRate;
        }
      });
    }

    // Normalize weights to sum to 1
    this.normalizeWeights();
  }

  /**
   * Normalize weights to sum to 1
   */
  private normalizeWeights(): void {
    const total = Object.values(this.config.weights).reduce((sum, weight) => sum + weight, 0);
    
    Object.keys(this.config.weights).forEach(key => {
      this.config.weights[key as keyof PolicyWeights] /= total;
    });
  }

  /**
   * Get learning history
   */
  getLearningHistory(): PolicyLearning[] {
    return this.learningHistory;
  }

  /**
   * Get policy statistics
   */
  getStatistics(): {
    totalDecisions: number;
    averageScore: number;
    averageConfidence: number;
    priorityDistribution: Record<string, number>;
    learningRate: number;
    weightStability: number;
  } {
    const totalDecisions = this.learningHistory.length;
    const averageScore =
      totalDecisions > 0
        ? this.learningHistory.reduce((sum, l) => sum + l.score.overall, 0) / totalDecisions
        : 0;

    const averageConfidence =
      totalDecisions > 0
        ? this.learningHistory.reduce((sum, l) => sum + l.score.confidence, 0) / totalDecisions
        : 0;

    const priorityDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    this.learningHistory.forEach(learning => {
      priorityDistribution[learning.score.priority]++;
    });

    const learningRate = this.config.adaptationRate;
    const weightStability = this.calculateWeightStability();

    return {
      totalDecisions,
      averageScore,
      averageConfidence,
      priorityDistribution,
      learningRate,
      weightStability,
    };
  }

  /**
   * Calculate weight stability (how much weights have changed)
   */
  private calculateWeightStability(): number {
    if (this.learningHistory.length < 10) return 1;

    const recentWeights = this.learningHistory.slice(-10).map(l => l.weightAdjustments);
    const totalAdjustment = recentWeights.reduce((sum, adjustments) => {
      return sum + Object.values(adjustments).reduce((s, a) => s + Math.abs(a), 0);
    }, 0);

    return Math.max(0, 1 - totalAdjustment / 10);
  }

  /**
   * Export configuration
   */
  exportConfig(): PolicyConfig {
    return { ...this.config };
  }

  /**
   * Import configuration
   */
  importConfig(config: PolicyConfig): void {
    this.config = config;
  }

  /**
   * Clear learning history
   */
  clearLearningHistory(): void {
    this.learningHistory = [];
  }

  /**
   * Reset to default configuration
   */
  resetToDefault(): void {
    this.config = defaultPolicyConfig;
    this.clearLearningHistory();
  }
}

export const decisionPolicyEngine = DecisionPolicyEngine.getInstance();
