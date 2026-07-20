/**
 * Feedback Learning Engine
 * Learns from feedback to improve decisions
 */

import {
  FeedbackEntry,
  LearningInsight,
  LearningConfig,
  LearningMetrics,
  defaultLearningConfig,
} from "./interfaces/IFeedbackLearningEngine";

// ============================================================================
// FEEDBACK LEARNING ENGINE CLASS
// ============================================================================

export class FeedbackLearningEngine {
  private static instance: FeedbackLearningEngine;
  private config: LearningConfig;
  private feedbackHistory: FeedbackEntry[] = [];
  private insights: LearningInsight[] = [];

  private constructor() {
    this.config = defaultLearningConfig;
  }

  static getInstance(): FeedbackLearningEngine {
    if (!FeedbackLearningEngine.instance) {
      FeedbackLearningEngine.instance = new FeedbackLearningEngine();
    }
    return FeedbackLearningEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<LearningConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Record feedback
   */
  recordFeedback(
    decisionId: string,
    actionId: string,
    feedback: "positive" | "negative" | "neutral",
    rating: number,
    reason: string,
    context: Record<string, any>
  ): FeedbackEntry {
    const entry: FeedbackEntry = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      decisionId,
      actionId,
      feedback,
      rating,
      reason,
      context,
      timestamp: new Date(),
    };

    this.feedbackHistory.push(entry);

    // Trigger learning if enough feedback
    if (this.feedbackHistory.length >= this.config.minFeedbackForLearning) {
      this.learnFromFeedback();
    }

    return entry;
  }

  /**
   * Learn from feedback
   */
  private learnFromFeedback(): void {
    if (!this.config.patternRecognitionEnabled) {
      return;
    }

    // Analyze patterns in feedback
    const patterns = this.analyzePatterns();

    // Generate insights from patterns
    patterns.forEach(pattern => {
      const insight = this.generateInsight(pattern);
      if (insight && insight.confidence >= this.config.confidenceThreshold) {
        this.insights.push(insight);
      }
    });
  }

  /**
   * Analyze patterns in feedback
   */
  private analyzePatterns(): Array<{
    pattern: string;
    confidence: number;
    context: Record<string, any>;
  }> {
    const patterns: Array<{
      pattern: string;
      confidence: number;
      context: Record<string, any>;
    }> = [];

    // Pattern 1: High rating with positive feedback
    const positiveHighRated = this.feedbackHistory.filter(
      f => f.feedback === "positive" && f.rating >= 8
    );
    if (positiveHighRated.length >= this.config.minFeedbackForLearning / 2) {
      patterns.push({
        pattern: "High-rated positive feedback",
        confidence: positiveHighRated.length / this.feedbackHistory.length,
        context: this.extractCommonContext(positiveHighRated),
      });
    }

    // Pattern 2: Low rating with negative feedback
    const negativeLowRated = this.feedbackHistory.filter(
      f => f.feedback === "negative" && f.rating <= 4
    );
    if (negativeLowRated.length >= this.config.minFeedbackForLearning / 2) {
      patterns.push({
        pattern: "Low-rated negative feedback",
        confidence: negativeLowRated.length / this.feedbackHistory.length,
        context: this.extractCommonContext(negativeLowRated),
      });
    }

    // Pattern 3: Specific action type feedback
    const actionTypes = Array.from(new Set(this.feedbackHistory.map(f => f.context.actionType)));
    actionTypes.forEach(actionType => {
      const typeFeedback = this.feedbackHistory.filter(f => f.context.actionType === actionType);
      if (typeFeedback.length >= this.config.minFeedbackForLearning / 3) {
        const avgRating = typeFeedback.reduce((sum, f) => sum + f.rating, 0) / typeFeedback.length;
        patterns.push({
          pattern: `Action type: ${actionType}`,
          confidence: typeFeedback.length / this.feedbackHistory.length,
          context: { actionType, avgRating },
        });
      }
    });

    return patterns;
  }

  /**
   * Extract common context from feedback
   */
  private extractCommonContext(feedback: FeedbackEntry[]): Record<string, any> {
    const context: Record<string, any> = {};

    // Find common action types
    const actionTypes = feedback.map(f => f.context.actionType);
    const actionTypeCounts = actionTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonActionType = Object.entries(actionTypeCounts)
      .sort(([, a], [, b]) => {
        const countA = typeof a === 'number' ? a : 0;
        const countB = typeof b === 'number' ? b : 0;
        return countB - countA;
      })[0];
    
    if (mostCommonActionType) {
      context.actionType = mostCommonActionType[0];
    }

    // Find common difficulty
    const difficulties = feedback.map(f => f.context.difficulty);
    const difficultyCounts = difficulties.reduce((acc, diff) => {
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonDifficulty = Object.entries(difficultyCounts)
      .sort(([, a], [, b]) => {
        const countA = typeof a === 'number' ? a : 0;
        const countB = typeof b === 'number' ? b : 0;
        return countB - countA;
      })[0];
    
    if (mostCommonDifficulty) {
      context.difficulty = mostCommonDifficulty[0];
    }

    return context;
  }

  /**
   * Generate insight from pattern
   */
  private generateInsight(pattern: {
    pattern: string;
    confidence: number;
    context: Record<string, any>;
  }): LearningInsight | null {
    let recommendation = "";
    let action = "";
    let expectedImprovement = 0;

    if (pattern.pattern === "High-rated positive feedback") {
      recommendation = "Continue with current approach";
      action = "Maintain current parameters";
      expectedImprovement = 0.1;
    } else if (pattern.pattern === "Low-rated negative feedback") {
      recommendation = "Adjust approach based on feedback";
      action = "Modify parameters or try alternative";
      expectedImprovement = 0.2;
    } else if (pattern.pattern.startsWith("Action type:")) {
      const actionType = pattern.context.actionType;
      const avgRating = pattern.context.avgRating;

      if (avgRating >= 7) {
        recommendation = `Increase use of ${actionType} actions`;
        action = `Prioritize ${actionType} in future decisions`;
        expectedImprovement = 0.15;
      } else if (avgRating <= 4) {
        recommendation = `Reduce use of ${actionType} actions`;
        action = `Deprioritize ${actionType} in future decisions`;
        expectedImprovement = 0.15;
      } else {
        recommendation = `Maintain current usage of ${actionType}`;
        action = `Keep ${actionType} at current priority`;
        expectedImprovement = 0.05;
      }
    } else {
      return null;
    }

    return {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pattern: pattern.pattern,
      confidence: pattern.confidence,
      recommendation,
      action,
      expectedImprovement,
      timestamp: new Date(),
    };
  }

  /**
   * Get insights
   */
  getInsights(): LearningInsight[] {
    return this.insights;
  }

  /**
   * Get insights by pattern
   */
  getInsightsByPattern(pattern: string): LearningInsight[] {
    return this.insights.filter(i => i.pattern === pattern);
  }

  /**
   * Get learning metrics
   */
  getMetrics(): LearningMetrics {
    const totalFeedback = this.feedbackHistory.length;
    const positiveFeedback = this.feedbackHistory.filter(f => f.feedback === "positive").length;
    const negativeFeedback = this.feedbackHistory.filter(f => f.feedback === "negative").length;
    const neutralFeedback = this.feedbackHistory.filter(f => f.feedback === "neutral").length;
    const averageRating = totalFeedback > 0
      ? this.feedbackHistory.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;

    const learningRate = this.config.learningRate;
    const patternCount = this.insights.length;

    // Calculate accuracy based on recent feedback
    const recentFeedback = this.feedbackHistory.slice(-20);
    const accuracy = recentFeedback.length > 0
      ? recentFeedback.filter(f => f.feedback === "positive").length / recentFeedback.length
      : 0;

    return {
      totalFeedback,
      positiveFeedback,
      negativeFeedback,
      neutralFeedback,
      averageRating,
      learningRate,
      patternCount,
      accuracy,
    };
  }

  /**
   * Get feedback history
   */
  getFeedbackHistory(): FeedbackEntry[] {
    return this.feedbackHistory;
  }

  /**
   * Get feedback by decision
   */
  getFeedbackByDecision(decisionId: string): FeedbackEntry[] {
    return this.feedbackHistory.filter(f => f.decisionId === decisionId);
  }

  /**
   * Get feedback by action
   */
  getFeedbackByAction(actionId: string): FeedbackEntry[] {
    return this.feedbackHistory.filter(f => f.actionId === actionId);
  }

  /**
   * Apply insight to improve future decisions
   */
  applyInsight(insightId: string): boolean {
    const insight = this.insights.find(i => i.id === insightId);
    if (!insight) {
      return false;
    }

    // In a real implementation, this would adjust decision weights
    // For now, we just mark it as applied
    return true;
  }

  /**
   * Clear insights
   */
  clearInsights(): void {
    this.insights = [];
  }

  /**
   * Clear feedback history
   */
  clearFeedbackHistory(): void {
    this.feedbackHistory = [];
  }

  /**
   * Export data
   */
  exportData(): {
    feedbackHistory: FeedbackEntry[];
    insights: LearningInsight[];
    config: LearningConfig;
  } {
    return {
      feedbackHistory: this.feedbackHistory,
      insights: this.insights,
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    feedbackHistory: FeedbackEntry[];
    insights: LearningInsight[];
    config?: LearningConfig;
  }): void {
    this.feedbackHistory = data.feedbackHistory;
    this.insights = data.insights;
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.feedbackHistory = [];
    this.insights = [];
  }
}

export const feedbackLearningEngine = FeedbackLearningEngine.getInstance();
