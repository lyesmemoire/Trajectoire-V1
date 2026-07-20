/**
 * Adaptive Intelligence Orchestrator
 * Central brain that orchestrates all AI engines and services
 */

import {
  UserContext,
  OrchestratorDecision,
  ExecutionResult,
  OrchestratorConfig,
  defaultOrchestratorConfig,
} from "./interfaces/IAdaptiveIntelligenceOrchestrator";
import { contextAnalyzer } from "./ContextAnalyzer";
import { decisionEngine } from "./DecisionEngine";
import { executionPipeline } from "./ExecutionPipeline";
import { decisionPolicyEngine } from "./DecisionPolicyEngine";
import { costOptimizationEngine } from "./CostOptimizationEngine";
import { strategyEngine } from "./StrategyEngine";
import { planningEngine } from "./PlanningEngine";
import { recommendationFusionEngine } from "./RecommendationFusionEngine";
import { roiEngine } from "./ROIEngine";
import { impactSimulationEngine } from "./ImpactSimulationEngine";
import { feedbackLearningEngine } from "./FeedbackLearningEngine";
import { userPersonalizationEngine } from "./UserPersonalizationEngine";
import { metaIntelligenceEngine } from "./MetaIntelligenceEngine";
import { humanPresenceService } from "../human-presence/HumanPresenceService";
import { emotionalSignatureService } from "../emotional-signature/EmotionalSignatureService";
import { interactionPhilosophyValidator } from "../interaction-philosophy/InteractionPhilosophyValidator";

// ============================================================================
// ADAPTIVE INTELLIGENCE ORCHESTRATOR CLASS
// ============================================================================

export class AdaptiveIntelligenceOrchestrator {
  private static instance: AdaptiveIntelligenceOrchestrator;
  private config: OrchestratorConfig;
  private decisionHistory: OrchestratorDecision[] = [];
  private executionHistory: ExecutionResult[] = [];

  private constructor() {
    this.config = defaultOrchestratorConfig;
  }

  static getInstance(): AdaptiveIntelligenceOrchestrator {
    if (!AdaptiveIntelligenceOrchestrator.instance) {
      AdaptiveIntelligenceOrchestrator.instance = new AdaptiveIntelligenceOrchestrator();
    }
    return AdaptiveIntelligenceOrchestrator.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<OrchestratorConfig>): void {
    this.config = { ...this.config, ...config };
    decisionEngine.setConfig(config);
    executionPipeline.setConfig(config);
  }

  /**
   * Process user context and orchestrate AI engines
   */
  async processContext(context: UserContext): Promise<{
    decision: OrchestratorDecision;
    execution: ExecutionResult;
  }> {
    // Step 0: Initialize emotional signature if not already done
    const currentEmotionalState = emotionalSignatureService.getCurrentState(context.userId);
    if (!currentEmotionalState) {
      // Initialize with default confidence level
      emotionalSignatureService.initializeUser(context.userId, 0.5);
    }

    // Step 1: Analyze context
    const analysis = contextAnalyzer.analyzeContext(context);

    // Step 2: Determine emotional state based on metrics
    const emotionalState = emotionalSignatureService.determineEmotionalState(context.userId, {
      confidence: 0.5,
      stress: 0.3,
      responseQuality: 0.5,
      fatigue: 0.2,
      rhythm: 0.5,
      engagement: 0.5,
      progression: 0.5,
    });

    // Step 3: Get emotional influence to apply to decision
    const emotionalInfluence = emotionalSignatureService.getEmotionalInfluence(context.userId);

    // Step 4: Make decision with emotional influence
    const decision = decisionEngine.makeDecision(context);

    // Step 5: Apply human presence to decision reasoning
    // Modifie uniquement la manière dont la décision est vécue
    try {
      const presenceModification = await humanPresenceService.applyPresence(
        context.userId,
        `session_${Date.now()}`,
        decision.reasoning,
        context as unknown as Record<string, unknown>
      );

      // Apply presence modification to decision reasoning
      if (presenceModification.modifiedDecision) {
        decision.reasoning = presenceModification.modifiedDecision;
      }
    } catch (error) {
      // If presence fails, continue with original decision
      // Presence is a nice-to-have, not critical
    }

    // Step 5.5: Validate against interaction philosophy
    // La philosophie est supérieure aux prompts, modèles et décisions
    try {
      const philosophyValidation = interactionPhilosophyValidator.validateResponse(
        decision.reasoning,
        {
          isEndOfSession: false, // À déterminer selon le contexte
          userPerformance: 0.5, // À déterminer selon le contexte
          previousViolations: 0,
        }
      );

      // Si la réponse viole la philosophie, la réécrire automatiquement
      if (philosophyValidation.needsRewrite) {
        decision.reasoning = interactionPhilosophyValidator.rewriteResponse(
          decision.reasoning,
          philosophyValidation.violations
        );
      }
    } catch (error) {
      // If philosophy validation fails, continue with original decision
      // Philosophy validation is critical but should not block the system
    }

    // Step 6: Execute decision
    const execution = await executionPipeline.executeDecision(decision);

    // Store in history
    this.decisionHistory.push(decision);
    this.executionHistory.push(execution);

    return {
      decision,
      execution,
    };
  }

  /**
   * Get decision history
   */
  getDecisionHistory(): OrchestratorDecision[] {
    return this.decisionHistory;
  }

  /**
   * Get execution history
   */
  getExecutionHistory(): ExecutionResult[] {
    return this.executionHistory;
  }

  /**
   * Get user-specific history
   */
  getUserHistory(userId: string): {
    decisions: OrchestratorDecision[];
    executions: ExecutionResult[];
  } {
    const decisions = this.decisionHistory.filter(d => d.userId === userId);
    const executions = this.executionHistory.filter(e => e.userId === userId);

    return {
      decisions,
      executions,
    };
  }

  /**
   * Get orchestrator statistics
   */
  getStatistics(): {
    totalDecisions: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageDecisionTime: number;
    averageExecutionTime: number;
    averageValue: number;
    enginesUsed: string[];
    commonActions: Record<string, number>;
    commonEngines: Record<string, number>;
  } {
    const totalDecisions = this.decisionHistory.length;
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(e => e.overallSuccess).length;
    const failedExecutions = totalExecutions - successfulExecutions;

    // Calculate average times
    const averageDecisionTime =
      totalDecisions > 0
        ? this.decisionHistory.reduce((sum, d) => sum + (d.timestamp.getTime() - d.timestamp.getTime()), 0) / totalDecisions
        : 0;

    const averageExecutionTime =
      totalExecutions > 0
        ? this.executionHistory.reduce((sum, e) => sum + e.totalDuration, 0) / totalExecutions
        : 0;

    const averageValue =
      totalExecutions > 0
        ? this.executionHistory.reduce((sum, e) => sum + e.totalValue, 0) / totalExecutions
        : 0;

    // Get engines used
    const enginesUsed = Array.from(
      new Set(this.executionHistory.flatMap(e => e.actions.map(a => a.engine)))
    );

    // Count common actions
    const commonActions: Record<string, number> = {};
    this.decisionHistory.forEach(decision => {
      decision.actions.forEach(action => {
        commonActions[action.type] = (commonActions[action.type] || 0) + 1;
      });
    });

    // Count common engines
    const commonEngines: Record<string, number> = {};
    this.decisionHistory.forEach(decision => {
      decision.actions.forEach(action => {
        commonEngines[action.engine] = (commonEngines[action.engine] || 0) + 1;
      });
    });

    return {
      totalDecisions,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageDecisionTime,
      averageExecutionTime,
      averageValue,
      enginesUsed,
      commonActions,
      commonEngines,
    };
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.decisionHistory = [];
    this.executionHistory = [];
    executionPipeline.clearHistory();
  }

  /**
   * Clear user-specific history
   */
  clearUserHistory(userId: string): void {
    this.decisionHistory = this.decisionHistory.filter(d => d.userId !== userId);
    this.executionHistory = this.executionHistory.filter(e => e.userId !== userId);
  }

  /**
   * Export data
   */
  exportData(): {
    decisions: OrchestratorDecision[];
    executions: ExecutionResult[];
    config: OrchestratorConfig;
  } {
    return {
      decisions: this.decisionHistory,
      executions: this.executionHistory,
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    decisions: OrchestratorDecision[];
    executions: ExecutionResult[];
    config?: OrchestratorConfig;
  }): void {
    this.decisionHistory = data.decisions;
    this.executionHistory = data.executions;
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Get decision engine statistics
   */
  getDecisionEngineStats() {
    return decisionEngine.getStatistics();
  }

  /**
   * Get execution pipeline statistics
   */
  getExecutionPipelineStats() {
    return executionPipeline.getStatistics();
  }

  /**
   * Add custom decision rule
   */
  addCustomRule(rule: any): void {
    decisionEngine.addRule(rule);
  }

  /**
   * Remove decision rule
   */
  removeRule(index: number): void {
    decisionEngine.removeRule(index);
  }

  /**
   * Register custom engine executor
   */
  registerEngineExecutor(engine: any, executor: any): void {
    executionPipeline.registerExecutor(engine, executor);
  }

  /**
   * Unregister engine executor
   */
  unregisterEngineExecutor(engine: any): void {
    executionPipeline.unregisterExecutor(engine);
  }

  // ============================================================================
  // ADVANCED ENGINES INTEGRATION
  // ============================================================================

  /**
   * Get Decision Policy Engine statistics
   */
  getDecisionPolicyEngineStats() {
    return decisionPolicyEngine.getStatistics();
  }

  /**
   * Set Decision Policy Engine configuration
   */
  setDecisionPolicyEngineConfig(config: any): void {
    decisionPolicyEngine.setConfig(config);
  }

  /**
   * Get Cost Optimization Engine statistics
   */
  getCostOptimizationEngineStats() {
    return costOptimizationEngine.getStatistics();
  }

  /**
   * Set Cost Optimization Engine configuration
   */
  setCostOptimizationEngineConfig(config: any): void {
    costOptimizationEngine.setConfig(config);
  }

  /**
   * Get Strategy Engine statistics
   */
  getStrategyEngineStats() {
    return strategyEngine.getStatistics();
  }

  /**
   * Set Strategy Engine configuration
   */
  setStrategyEngineConfig(config: any): void {
    strategyEngine.setConfig(config);
  }

  /**
   * Get Planning Engine statistics
   */
  getPlanningEngineStats() {
    return planningEngine.getStatistics();
  }

  /**
   * Set Planning Engine configuration
   */
  setPlanningEngineConfig(config: any): void {
    planningEngine.setConfig(config);
  }

  /**
   * Get Recommendation Fusion Engine statistics
   */
  getRecommendationFusionEngineStats() {
    return recommendationFusionEngine.getStatistics();
  }

  /**
   * Set Recommendation Fusion Engine configuration
   */
  setRecommendationFusionEngineConfig(config: any): void {
    recommendationFusionEngine.setConfig(config);
  }

  /**
   * Get ROI Engine statistics
   */
  getROIEngineStats() {
    return roiEngine.getStatistics();
  }

  /**
   * Set ROI Engine configuration
   */
  setROIEngineConfig(config: any): void {
    roiEngine.setConfig(config);
  }

  /**
   * Get Impact Simulation Engine statistics
   */
  getImpactSimulationEngineStats() {
    return impactSimulationEngine.getStatistics();
  }

  /**
   * Set Impact Simulation Engine configuration
   */
  setImpactSimulationEngineConfig(config: any): void {
    impactSimulationEngine.setConfig(config);
  }

  /**
   * Get Feedback Learning Engine statistics
   */
  getFeedbackLearningEngineStats() {
    return feedbackLearningEngine.getMetrics();
  }

  /**
   * Set Feedback Learning Engine configuration
   */
  setFeedbackLearningEngineConfig(config: any): void {
    feedbackLearningEngine.setConfig(config);
  }

  /**
   * Get User Personalization Engine statistics
   */
  getUserPersonalizationEngineStats() {
    return userPersonalizationEngine.getStatistics();
  }

  /**
   * Set User Personalization Engine configuration
   */
  setUserPersonalizationEngineConfig(config: any): void {
    userPersonalizationEngine.setConfig(config);
  }

  /**
   * Get Meta Intelligence Engine statistics
   */
  getMetaIntelligenceEngineStats() {
    return metaIntelligenceEngine.getStatistics();
  }

  /**
   * Set Meta Intelligence Engine configuration
   */
  setMetaIntelligenceEngineConfig(config: any): void {
    metaIntelligenceEngine.setConfig(config);
  }

  /**
   * Get comprehensive statistics from all engines
   */
  getAllEngineStatistics(): {
    decisionPolicy: any;
    costOptimization: any;
    strategy: any;
    planning: any;
    recommendationFusion: any;
    roi: any;
    impactSimulation: any;
    feedbackLearning: any;
    userPersonalization: any;
    metaIntelligence: any;
    humanPresence: any;
  } {
    return {
      decisionPolicy: this.getDecisionPolicyEngineStats(),
      costOptimization: this.getCostOptimizationEngineStats(),
      strategy: this.getStrategyEngineStats(),
      planning: this.getPlanningEngineStats(),
      recommendationFusion: this.getRecommendationFusionEngineStats(),
      roi: this.getROIEngineStats(),
      impactSimulation: this.getImpactSimulationEngineStats(),
      feedbackLearning: this.getFeedbackLearningEngineStats(),
      userPersonalization: this.getUserPersonalizationEngineStats(),
      metaIntelligence: this.getMetaIntelligenceEngineStats(),
      humanPresence: humanPresenceService.getMetrics(),
    };
  }

  /**
   * Get Human Presence Service statistics
   */
  getHumanPresenceStats() {
    return humanPresenceService.getMetrics();
  }

  /**
   * Get Emotional Signature Service statistics
   */
  getEmotionalSignatureStats(userId: string) {
    return {
      currentState: emotionalSignatureService.getCurrentState(userId),
      recruiterPosture: emotionalSignatureService.getRecruiterPosture(userId),
      transitionHistory: emotionalSignatureService.getTransitionHistory(userId),
    };
  }

  /**
   * Guarantee final positive emotional state
   */
  guaranteeFinalPositiveState(userId: string, finalConfidence: number) {
    return emotionalSignatureService.guaranteeFinalPositiveState(userId, finalConfidence);
  }

  /**
   * Check confidence progression
   */
  checkConfidenceProgression(userId: string, finalConfidence: number) {
    return emotionalSignatureService.checkConfidenceProgression(userId, finalConfidence);
  }

  /**
   * Clear emotional signature session
   */
  clearEmotionalSignatureSession(userId: string) {
    emotionalSignatureService.clearUserSession(userId);
  }
}

export const adaptiveIntelligenceOrchestrator = AdaptiveIntelligenceOrchestrator.getInstance();
