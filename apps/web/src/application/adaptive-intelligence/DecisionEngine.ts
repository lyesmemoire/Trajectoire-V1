/**
 * Decision Engine
 * Decides which AI engines to use, when, why, and in what order
 */

import {
  UserContext,
  ContextAnalysis,
  OrchestratorDecision,
  OrchestratorAction,
  ActionType,
  EngineType,
  OrchestratorConfig,
  defaultOrchestratorConfig,
} from "./interfaces/IAdaptiveIntelligenceOrchestrator";
import { contextAnalyzer } from "./ContextAnalyzer";

// ============================================================================
// DECISION RULES
// ============================================================================

interface DecisionRule {
  condition: (context: UserContext, analysis: ContextAnalysis) => boolean;
  actions: Partial<OrchestratorAction>[];
  priority: number;
  reasoning: string;
  expectedOutcome: string;
}

// ============================================================================
// DECISION ENGINE CLASS
// ============================================================================

export class DecisionEngine {
  private static instance: DecisionEngine;
  private config: OrchestratorConfig;
  private rules: DecisionRule[] = [];

  private constructor() {
    this.config = defaultOrchestratorConfig;
    this.initializeRules();
  }

  static getInstance(): DecisionEngine {
    if (!DecisionEngine.instance) {
      DecisionEngine.instance = new DecisionEngine();
    }
    return DecisionEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<OrchestratorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize decision rules
   */
  private initializeRules(): void {
    this.rules = [
      // Critical: High stress - immediate intervention
      {
        condition: (context, analysis) => analysis.userState.stress > 0.7,
        actions: [
          {
            type: "intervene" as ActionType,
            engine: "conversationEngine" as EngineType,
            priority: 100,
            parameters: { intervention: "stress_relief", urgency: "high" },
            dependencies: [],
            expectedDuration: 5000,
            estimatedValue: 0.9,
            risk: "low",
          },
          {
            type: "guide" as ActionType,
            engine: "personalityEngine" as EngineType,
            priority: 90,
            parameters: { guidance: "calming_techniques", personalized: true },
            dependencies: [],
            expectedDuration: 3000,
            estimatedValue: 0.8,
            risk: "low",
          },
        ],
        priority: 100,
        reasoning: "User experiencing high stress - immediate intervention required",
        expectedOutcome: "Reduced stress and improved user state",
      },

      // Critical: Low confidence - confidence building
      {
        condition: (context, analysis) => analysis.userState.confidence < 0.4,
        actions: [
          {
            type: "guide" as ActionType,
            engine: "confidenceScore" as EngineType,
            priority: 95,
            parameters: { strategy: "boost_confidence", immediate: true },
            dependencies: [],
            expectedDuration: 4000,
            estimatedValue: 0.85,
            risk: "low",
          },
          {
            type: "recommend" as ActionType,
            engine: "recommendationEngine" as EngineType,
            priority: 85,
            parameters: { type: "confidence_building", personalized: true },
            dependencies: [],
            expectedDuration: 3000,
            estimatedValue: 0.75,
            risk: "low",
          },
        ],
        priority: 95,
        reasoning: "User has low confidence - confidence building intervention needed",
        expectedOutcome: "Increased confidence and engagement",
      },

      // Critical: Low engagement - re-engagement
      {
        condition: (context, analysis) => analysis.userState.engagement < 0.4,
        actions: [
          {
            type: "intervene" as ActionType,
            engine: "conversationEngine" as EngineType,
            priority: 90,
            parameters: { intervention: "re_engagement", gamification: true },
            dependencies: [],
            expectedDuration: 5000,
            estimatedValue: 0.8,
            risk: "low",
          },
          {
            type: "recommend" as ActionType,
            engine: "recommendationEngine" as EngineType,
            priority: 80,
            parameters: { type: "engagement_boost", personalized: true },
            dependencies: [],
            expectedDuration: 3000,
            estimatedValue: 0.7,
            risk: "low",
          },
        ],
        priority: 90,
        reasoning: "User has low engagement - re-engagement strategies needed",
        expectedOutcome: "Increased engagement and session continuation",
      },

      // High: Current simulation with low score - immediate feedback
      {
        condition: (context, analysis) =>
          context.currentSimulation !== null && context.currentSimulation.currentScore < 50,
        actions: [
          {
            type: "evaluate" as ActionType,
            engine: "evaluationEngine" as EngineType,
            priority: 85,
            parameters: { immediate: true, detailed: true },
            dependencies: [],
            expectedDuration: 3000,
            estimatedValue: 0.8,
            risk: "low",
          },
          {
            type: "guide" as ActionType,
            engine: "conversationEngine" as EngineType,
            priority: 80,
            parameters: { guidance: "improvement", real_time: true },
            dependencies: ["evaluate"],
            expectedDuration: 5000,
            estimatedValue: 0.75,
            risk: "low",
          },
        ],
        priority: 85,
        reasoning: "Current simulation has low score - immediate feedback and guidance needed",
        expectedOutcome: "Improved simulation performance and learning",
      },

      // High: High priority goals - goal support
      {
        condition: (context, analysis) =>
          context.goals.priority === "high" && context.goals.progress < 0.5,
        actions: [
          {
            type: "recommend" as ActionType,
            engine: "goalEngine" as EngineType,
            priority: 80,
            parameters: { focus: "goal_support", priority: "high" },
            dependencies: [],
            expectedDuration: 4000,
            estimatedValue: 0.85,
            risk: "low",
          },
          {
            type: "recommend" as ActionType,
            engine: "learningPath" as EngineType,
            priority: 75,
            parameters: { goal: "primary_goal", personalized: true },
            dependencies: ["goalEngine"],
            expectedDuration: 5000,
            estimatedValue: 0.8,
            risk: "low",
          },
        ],
        priority: 80,
        reasoning: "User has high priority goals with low progress - goal support needed",
        expectedOutcome: "Accelerated goal progress and motivation",
      },

      // High: High severity weaknesses - immediate attention
      {
        condition: (context, analysis) => {
          const highSeverityWeaknesses = context.weaknesses.identified.filter(
            w => context.weaknesses.severity[w] === "high"
          );
          return highSeverityWeaknesses.length > 0;
        },
        actions: [
          {
            type: "analyze" as ActionType,
            engine: "weaknessDetector" as EngineType,
            priority: 85,
            parameters: { severity: "high", detailed: true },
            dependencies: [],
            expectedDuration: 4000,
            estimatedValue: 0.8,
            risk: "low",
          },
          {
            type: "recommend" as ActionType,
            engine: "learningPath" as EngineType,
            priority: 80,
            parameters: { focus: "weakness_improvement", personalized: true },
            dependencies: ["weaknessDetector"],
            expectedDuration: 5000,
            estimatedValue: 0.75,
            risk: "low",
          },
        ],
        priority: 85,
        reasoning: "User has high severity weaknesses - immediate attention needed",
        expectedOutcome: "Addressed weaknesses and improved capabilities",
      },

      // Medium: Career profile analysis - periodic
      {
        condition: (context, analysis) => {
          const daysSinceLastAnalysis = Math.floor(
            (Date.now() - context.history.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceLastAnalysis > 7;
        },
        actions: [
          {
            type: "analyze" as ActionType,
            engine: "careerProfile" as EngineType,
            priority: 60,
            parameters: { comprehensive: true },
            dependencies: [],
            expectedDuration: 5000,
            estimatedValue: 0.7,
            risk: "low",
          },
          {
            type: "recommend" as ActionType,
            engine: "recommendationEngine" as EngineType,
            priority: 55,
            parameters: { type: "career_guidance", personalized: true },
            dependencies: ["careerProfile"],
            expectedDuration: 4000,
            estimatedValue: 0.65,
            risk: "low",
          },
        ],
        priority: 60,
        reasoning: "Periodic career profile analysis needed",
        expectedOutcome: "Updated career insights and recommendations",
      },

      // Medium: Employability assessment - periodic
      {
        condition: (context, analysis) => {
          const daysSinceLastAnalysis = Math.floor(
            (Date.now() - context.history.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceLastAnalysis > 14;
        },
        actions: [
          {
            type: "analyze" as ActionType,
            engine: "employability" as EngineType,
            priority: 55,
            parameters: { comprehensive: true },
            dependencies: [],
            expectedDuration: 6000,
            estimatedValue: 0.7,
            risk: "low",
          },
          {
            type: "recommend" as ActionType,
            engine: "learningPath" as EngineType,
            priority: 50,
            parameters: { focus: "employability", personalized: true },
            dependencies: ["employability"],
            expectedDuration: 5000,
            estimatedValue: 0.65,
            risk: "low",
          },
        ],
        priority: 55,
        reasoning: "Periodic employability assessment needed",
        expectedOutcome: "Updated employability insights and improvement path",
      },

      // Medium: Diagnostic - when performance is declining
      {
        condition: (context, analysis) => context.context.recentPerformance === "declining",
        actions: [
          {
            type: "analyze" as ActionType,
            engine: "diagnostic" as EngineType,
            priority: 70,
            parameters: { focus: "performance_decline", detailed: true },
            dependencies: [],
            expectedDuration: 5000,
            estimatedValue: 0.75,
            risk: "low",
          },
          {
            type: "recommend" as ActionType,
            engine: "recommendationEngine" as EngineType,
            priority: 65,
            parameters: { type: "performance_improvement", personalized: true },
            dependencies: ["diagnostic"],
            expectedDuration: 4000,
            estimatedValue: 0.7,
            risk: "low",
          },
        ],
        priority: 70,
        reasoning: "Performance is declining - diagnostic analysis needed",
        expectedOutcome: "Identified performance issues and improvement strategies",
      },

      // Medium: Personality analysis - periodic
      {
        condition: (context, analysis) => {
          const daysSinceLastAnalysis = Math.floor(
            (Date.now() - context.history.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceLastAnalysis > 30;
        },
        actions: [
          {
            type: "analyze" as ActionType,
            engine: "personalityEngine" as EngineType,
            priority: 50,
            parameters: { comprehensive: true },
            dependencies: [],
            expectedDuration: 5000,
            estimatedValue: 0.6,
            risk: "low",
          },
          {
            type: "adapt" as ActionType,
            engine: "conversationEngine" as EngineType,
            priority: 45,
            parameters: { adaptation: "personality_based", personalized: true },
            dependencies: ["personalityEngine"],
            expectedDuration: 3000,
            estimatedValue: 0.55,
            risk: "low",
          },
        ],
        priority: 50,
        reasoning: "Periodic personality analysis needed",
        expectedOutcome: "Updated personality insights and adapted interactions",
      },

      // Low: AI Quality Platform - continuous monitoring
      {
        condition: (context, analysis) => true, // Always run
        actions: [
          {
            type: "evaluate" as ActionType,
            engine: "aiQualityPlatform" as EngineType,
            priority: 30,
            parameters: { monitoring: true, continuous: true },
            dependencies: [],
            expectedDuration: 2000,
            estimatedValue: 0.5,
            risk: "low",
          },
        ],
        priority: 30,
        reasoning: "Continuous AI quality monitoring",
        expectedOutcome: "Maintained AI quality standards",
      },

      // Low: Learning recommendations - when opportunities exist
      {
        condition: (context, analysis) => analysis.opportunities.learning.length > 0,
        actions: [
          {
            type: "recommend" as ActionType,
            engine: "learningPath" as EngineType,
            priority: 40,
            parameters: { topics: ["learning_opportunities"], personalized: true },
            dependencies: [],
            expectedDuration: 4000,
            estimatedValue: 0.6,
            risk: "low",
          },
        ],
        priority: 40,
        reasoning: "Learning opportunities identified",
        expectedOutcome: "Personalized learning recommendations",
      },

      // Low: Skill development recommendations
      {
        condition: (context, analysis) => analysis.opportunities.skillDevelopment.length > 0,
        actions: [
          {
            type: "train" as ActionType,
            engine: "learningPath" as EngineType,
            priority: 45,
            parameters: { skills: ["skill_development"], personalized: true },
            dependencies: [],
            expectedDuration: 5000,
            estimatedValue: 0.65,
            risk: "low",
          },
        ],
        priority: 45,
        reasoning: "Skill development opportunities identified",
        expectedOutcome: "Targeted skill development",
      },
    ];
  }

  /**
   * Make decision based on context
   */
  makeDecision(context: UserContext): OrchestratorDecision {
    // Analyze context
    const analysis = contextAnalyzer.analyzeContext(context);

    // Find matching rules
    const matchingRules = this.rules.filter(rule => rule.condition(context, analysis));

    // Generate actions from matching rules
    const actions: OrchestratorAction[] = [];
    const actionIds = new Set<string>();

    matchingRules.forEach(rule => {
      rule.actions.forEach(actionTemplate => {
        const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (!actionIds.has(actionId)) {
          actionIds.add(actionId);
          
          const action: OrchestratorAction = {
            id: actionId,
            type: actionTemplate.type as ActionType,
            engine: actionTemplate.engine as EngineType,
            priority: actionTemplate.priority || 50,
            parameters: actionTemplate.parameters || {},
            dependencies: actionTemplate.dependencies || [],
            expectedDuration: actionTemplate.expectedDuration || 3000,
            estimatedValue: actionTemplate.estimatedValue || 0.5,
            risk: actionTemplate.risk as "low" | "medium" | "high" || "low",
          };

          actions.push(action);
        }
      });
    });

    // Sort actions by priority
    actions.sort((a, b) => b.priority - a.priority);

    // Determine overall priority
    const highestPriority = actions.length > 0 ? actions[0].priority : 0;
    let overallPriority: "critical" | "high" | "medium" | "low" = "low";
    if (highestPriority >= 90) overallPriority = "critical";
    else if (highestPriority >= 70) overallPriority = "high";
    else if (highestPriority >= 50) overallPriority = "medium";

    // Generate reasoning
    const reasoning = this.generateReasoning(matchingRules, analysis);

    // Generate expected outcome
    const expectedOutcome = this.generateExpectedOutcome(actions, analysis);

    // Create decision
    const decision: OrchestratorDecision = {
      id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: context.userId,
      context,
      analysis,
      actions,
      priority: overallPriority,
      reasoning,
      expectedOutcome,
    };

    return decision;
  }

  /**
   * Generate reasoning
   */
  private generateReasoning(matchingRules: DecisionRule[], analysis: ContextAnalysis): string {
    if (matchingRules.length === 0) {
      return "No specific conditions met - standard monitoring and recommendations";
    }

    const reasons = matchingRules.map(rule => rule.reasoning);
    return reasons.join("; ");
  }

  /**
   * Generate expected outcome
   */
  private generateExpectedOutcome(actions: OrchestratorAction[], analysis: ContextAnalysis): string {
    if (actions.length === 0) {
      return "Continue standard operations with quality monitoring";
    }

    const outcomes: string[] = [];

    // Add outcomes based on action types
    const actionTypes = new Set(actions.map(a => a.type));
    if (actionTypes.has("intervene")) {
      outcomes.push("Immediate intervention for critical issues");
    }
    if (actionTypes.has("guide")) {
      outcomes.push("Personalized guidance and support");
    }
    if (actionTypes.has("recommend")) {
      outcomes.push("Targeted recommendations");
    }
    if (actionTypes.has("train")) {
      outcomes.push("Skill development and training");
    }
    if (actionTypes.has("analyze")) {
      outcomes.push("Comprehensive analysis and insights");
    }
    if (actionTypes.has("evaluate")) {
      outcomes.push("Performance evaluation and feedback");
    }

    return outcomes.join("; ");
  }

  /**
   * Filter actions by value threshold
   */
  filterActionsByValue(actions: OrchestratorAction[]): OrchestratorAction[] {
    return actions.filter(action => action.estimatedValue >= this.config.valueThreshold);
  }

  /**
   * Filter actions by risk tolerance
   */
  filterActionsByRisk(actions: OrchestratorAction[]): OrchestratorAction[] {
    const riskLevels = { low: 1, medium: 2, high: 3 };
    const tolerance = riskLevels[this.config.riskTolerance];

    return actions.filter(action => riskLevels[action.risk] <= tolerance);
  }

  /**
   * Limit concurrent actions
   */
  limitConcurrentActions(actions: OrchestratorAction[]): OrchestratorAction[] {
    return actions.slice(0, this.config.maxConcurrentActions);
  }

  /**
   * Get decision statistics
   */
  getStatistics(): {
    totalRules: number;
    activeRules: number;
    averagePriority: number;
    enginesUsed: EngineType[];
  } {
    const allEngines = this.rules.flatMap(rule => rule.actions.map(a => a.engine));
    const uniqueEngines = Array.from(new Set(allEngines)) as EngineType[];
    
    return {
      totalRules: this.rules.length,
      activeRules: this.rules.length,
      averagePriority: this.rules.reduce((sum, rule) => sum + rule.priority, 0) / this.rules.length,
      enginesUsed: uniqueEngines,
    };
  }

  /**
   * Add custom rule
   */
  addRule(rule: DecisionRule): void {
    this.rules.push(rule);
  }

  /**
   * Remove rule
   */
  removeRule(index: number): void {
    this.rules.splice(index, 1);
  }

  /**
   * Clear all rules
   */
  clearRules(): void {
    this.rules = [];
  }
}

export const decisionEngine = DecisionEngine.getInstance();
