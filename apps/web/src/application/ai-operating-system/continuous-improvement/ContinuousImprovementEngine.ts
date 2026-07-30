/**
 * Continuous Self Improvement Engine
 * Automatically learns from results and improves strategies
 */

import {
  ComparisonMetric,
  ImprovementAction,
  LearningEvent,
  ImprovementSession,
  ImprovementMetrics,
  ContinuousImprovementEngineConfig,
  defaultContinuousImprovementEngineConfig,
} from "./interfaces/IContinuousImprovementEngine";

// ============================================================================
// CONTINUOUS IMPROVEMENT ENGINE CLASS
// ============================================================================

export class ContinuousImprovementEngine {
  private static instance: ContinuousImprovementEngine;
  private config: ContinuousImprovementEngineConfig;
  private sessions: Map<string, ImprovementSession> = new Map();
  private learningEvents: Map<string, LearningEvent> = new Map();
  private improvementActions: Map<string, ImprovementAction> = new Map();

  private constructor() {
    this.config = defaultContinuousImprovementEngineConfig;
  }

  static getInstance(): ContinuousImprovementEngine {
    if (!ContinuousImprovementEngine.instance) {
      ContinuousImprovementEngine.instance = new ContinuousImprovementEngine();
    }
    return ContinuousImprovementEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<ContinuousImprovementEngineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Start improvement session
   */
  async startSession(userId: string, expectedDecision: any): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session: ImprovementSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      endTime: null,
      comparison: {
        expectedDecision,
        actualDecision: null,
        realResult: null,
        userFeedback: "",
        roi: 0,
        quality: 0,
        satisfaction: 0,
        timestamp: new Date(),
      },
      learningEvents: [],
      improvementActions: [],
      overallImprovement: 0,
      status: "active",
    };

    this.sessions.set(sessionId, session);

    return sessionId;
  }

  /**
   * Complete session
   */
  async completeSession(sessionId: string, actualDecision: any, realResult: any, userFeedback: string): Promise<ImprovementSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Update comparison
    session.comparison.actualDecision = actualDecision;
    session.comparison.realResult = realResult;
    session.comparison.userFeedback = userFeedback;
    session.comparison.timestamp = new Date();

    // Calculate metrics
    session.comparison.roi = this.calculateROI(session.comparison);
    session.comparison.quality = this.calculateQuality(session.comparison);
    session.comparison.satisfaction = this.calculateSatisfaction(session.comparison);

    // Generate learning events
    const learningEvents = await this.generateLearningEvents(sessionId, session.comparison);
    session.learningEvents = learningEvents;

    // Generate improvement actions
    const improvementActions = await this.generateImprovementActions(sessionId, session.comparison);
    session.improvementActions = improvementActions;

    // Calculate overall improvement
    session.overallImprovement = this.calculateOverallImprovement(session.comparison);

    // Update session status
    session.endTime = new Date();
    session.status = "completed";

    // Auto-apply improvements if enabled
    if (this.config.enableAutoImprovement) {
      await this.autoApplyImprovements(sessionId);
    }

    return session;
  }

  /**
   * Calculate ROI
   */
  private calculateROI(comparison: ComparisonMetric): number {
    // Placeholder for ROI calculation
    return 0.8;
  }

  /**
   * Calculate quality
   */
  private calculateQuality(comparison: ComparisonMetric): number {
    // Placeholder for quality calculation
    return 0.75;
  }

  /**
   * Calculate satisfaction
   */
  private calculateSatisfaction(comparison: ComparisonMetric): number {
    // Placeholder for satisfaction calculation
    const feedback = comparison.userFeedback.toLowerCase();
    if (feedback.includes("excellent") || feedback.includes("great")) return 0.9;
    if (feedback.includes("good")) return 0.75;
    if (feedback.includes("ok") || feedback.includes("average")) return 0.5;
    if (feedback.includes("bad") || feedback.includes("poor")) return 0.25;
    return 0.5;
  }

  /**
   * Generate learning events
   */
  private async generateLearningEvents(sessionId: string, comparison: ComparisonMetric): Promise<LearningEvent[]> {
    const events: LearningEvent[] = [];

    // Success event
    if (comparison.roi > 0.8 && comparison.quality > 0.8) {
      events.push({
        id: `event_${sessionId}_success`,
        sessionId,
        eventType: "success",
        description: "Decision achieved high ROI and quality",
        context: { roi: comparison.roi, quality: comparison.quality },
        metrics: comparison,
        impact: 0.9,
        timestamp: new Date(),
      });
    }

    // Failure event
    if (comparison.roi < 0.5 || comparison.quality < 0.5) {
      events.push({
        id: `event_${sessionId}_failure`,
        sessionId,
        eventType: "failure",
        description: "Decision achieved low ROI or quality",
        context: { roi: comparison.roi, quality: comparison.quality },
        metrics: comparison,
        impact: 0.7,
        timestamp: new Date(),
      });
    }

    // Improvement event
    if (comparison.satisfaction > 0.7) {
      events.push({
        id: `event_${sessionId}_improvement`,
        sessionId,
        eventType: "improvement",
        description: "User satisfaction indicates improvement",
        context: { satisfaction: comparison.satisfaction },
        metrics: comparison,
        impact: 0.6,
        timestamp: new Date(),
      });
    }

    // Discovery event
    if (comparison.userFeedback.includes("unexpected") || comparison.userFeedback.includes("surprise")) {
      events.push({
        id: `event_${sessionId}_discovery`,
        sessionId,
        eventType: "discovery",
        description: "Unexpected outcome discovered",
        context: { feedback: comparison.userFeedback },
        metrics: comparison,
        impact: 0.5,
        timestamp: new Date(),
      });
    }

    // Store learning events
    events.forEach(event => {
      this.learningEvents.set(event.id, event);
    });

    return events;
  }

  /**
   * Generate improvement actions
   */
  private async generateImprovementActions(sessionId: string, comparison: ComparisonMetric): Promise<ImprovementAction[]> {
    const actions: ImprovementAction[] = [];

    // Weight adjustment
    if (comparison.roi < 0.7) {
      actions.push({
        id: `action_${sessionId}_weight`,
        sessionId,
        type: "weight",
        target: "decision_weight",
        currentValue: 0.5,
        newValue: 0.7,
        reason: "ROI below threshold, increasing decision weight",
        expectedImpact: 0.3,
        confidence: 0.7,
        status: "pending",
        createdAt: new Date(),
        appliedAt: null,
        result: null,
      });
    }

    // Policy adjustment
    if (comparison.quality < 0.7) {
      actions.push({
        id: `action_${sessionId}_policy`,
        sessionId,
        type: "policy",
        target: "decision_policy",
        currentValue: "current_policy",
        newValue: "optimized_policy",
        reason: "Quality below threshold, adjusting policy",
        expectedImpact: 0.4,
        confidence: 0.6,
        status: "pending",
        createdAt: new Date(),
        appliedAt: null,
        result: null,
      });
    }

    // Confidence adjustment
    if (comparison.satisfaction < 0.6) {
      actions.push({
        id: `action_${sessionId}_confidence`,
        sessionId,
        type: "confidence",
        target: "decision_confidence",
        currentValue: 0.8,
        newValue: 0.6,
        reason: "Satisfaction below threshold, reducing confidence",
        expectedImpact: 0.2,
        confidence: 0.8,
        status: "pending",
        createdAt: new Date(),
        appliedAt: null,
        result: null,
      });
    }

    // Threshold adjustment
    if (comparison.roi > 0.9) {
      actions.push({
        id: `action_${sessionId}_threshold`,
        sessionId,
        type: "threshold",
        target: "decision_threshold",
        currentValue: 0.7,
        newValue: 0.8,
        reason: "High ROI achieved, increasing threshold",
        expectedImpact: 0.3,
        confidence: 0.7,
        status: "pending",
        createdAt: new Date(),
        appliedAt: null,
        result: null,
      });
    }

    // Store improvement actions
    actions.forEach(action => {
      this.improvementActions.set(action.id, action);
    });

    return actions;
  }

  /**
   * Calculate overall improvement
   */
  private calculateOverallImprovement(comparison: ComparisonMetric): number {
    return (comparison.roi + comparison.quality + comparison.satisfaction) / 3;
  }

  /**
   * Auto-apply improvements
   */
  private async autoApplyImprovements(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    for (const action of session.improvementActions) {
      // Check if auto-improvement is enabled
      if (!this.config.enableAutoImprovement) continue;

      // Check confidence threshold
      if (action.confidence < this.config.minConfidenceForAuto) continue;

      // Check impact threshold
      if (action.expectedImpact < this.config.minImpactForAuto) continue;

      // Apply action
      await this.applyAction(action.id);
    }
  }

  /**
   * Apply action
   */
  async applyAction(actionId: string): Promise<boolean> {
    const action = this.improvementActions.get(actionId);
    if (!action) return false;

    action.status = "applied";
    action.appliedAt = new Date();
    action.result = "Successfully applied";

    // Simulate application
    await new Promise(resolve => setTimeout(resolve, 100));

    return true;
  }

  /**
   * Reject action
   */
  rejectAction(actionId: string): void {
    const action = this.improvementActions.get(actionId);
    if (action) {
      action.status = "rejected";
    }
  }

  /**
   * Rollback action
   */
  async rollbackAction(actionId: string): Promise<boolean> {
    const action = this.improvementActions.get(actionId);
    if (!action) return false;

    action.status = "rolled_back";
    action.result = "Rolled back";

    // Simulate rollback
    await new Promise(resolve => setTimeout(resolve, 100));

    return true;
  }

  /**
   * Get session
   */
  getSession(sessionId: string): ImprovementSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get sessions by user
   */
  getSessionsByUser(userId: string): ImprovementSession[] {
    return Array.from(this.sessions.values()).filter(session => session.userId === userId);
  }

  /**
   * Get learning events
   */
  getLearningEvents(): LearningEvent[] {
    return Array.from(this.learningEvents.values());
  }

  /**
   * Get learning events by session
   */
  getLearningEventsBySession(sessionId: string): LearningEvent[] {
    return Array.from(this.learningEvents.values()).filter(event => event.sessionId === sessionId);
  }

  /**
   * Get improvement actions
   */
  getImprovementActions(): ImprovementAction[] {
    return Array.from(this.improvementActions.values());
  }

  /**
   * Get improvement actions by session
   */
  getImprovementActionsBySession(sessionId: string): ImprovementAction[] {
    return Array.from(this.improvementActions.values()).filter(action => action.sessionId === sessionId);
  }

  /**
   * Get improvement action
   */
  getImprovementAction(actionId: string): ImprovementAction | null {
    return this.improvementActions.get(actionId) || null;
  }

  /**
   * Get metrics
   */
  getMetrics(): ImprovementMetrics {
    const totalSessions = this.sessions.size;
    const totalLearningEvents = this.learningEvents.size;
    const totalImprovementActions = this.improvementActions.size;

    const totalAppliedActions = Array.from(this.improvementActions.values()).filter(action => action.status === "applied").length;
    const totalRejectedActions = Array.from(this.improvementActions.values()).filter(action => action.status === "rejected").length;

    const completedSessions = Array.from(this.sessions.values()).filter(session => session.status === "completed");
    const averageImprovement = completedSessions.length > 0
      ? completedSessions.reduce((sum, session) => sum + session.overallImprovement, 0) / completedSessions.length
      : 0;

    const improvementByType: Record<string, number> = {};
    this.improvementActions.forEach(action => {
      improvementByType[action.type] = (improvementByType[action.type] || 0) + 1;
    });

    const successRate = totalImprovementActions > 0 ? totalAppliedActions / totalImprovementActions : 0;

    const averageConfidence = totalImprovementActions > 0
      ? Array.from(this.improvementActions.values()).reduce((sum, action) => sum + action.confidence, 0) / totalImprovementActions
      : 0;

    return {
      totalSessions,
      totalLearningEvents,
      totalImprovementActions,
      totalAppliedActions,
      totalRejectedActions,
      averageImprovement,
      improvementByType,
      successRate,
      averageConfidence,
    };
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.sessions.clear();
    this.learningEvents.clear();
    this.improvementActions.clear();
  }
}

export const continuousImprovementEngine = ContinuousImprovementEngine.getInstance();
