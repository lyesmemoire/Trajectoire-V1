/**
 * Decision Explainability Engine
 * Provides explanations for AI decisions
 */

import {
  ExplanationType,
  DecisionExplanation,
  ExplanationRequest,
  ExplanationComponent,
  ExplanationTemplate,
  ExplanationMetrics,
  DecisionExplainabilityEngineConfig,
  defaultDecisionExplainabilityEngineConfig,
} from "./interfaces/IDecisionExplainabilityEngine";

// ============================================================================
// DECISION EXPLAINABILITY ENGINE CLASS
// ============================================================================

export class DecisionExplainabilityEngine {
  private static instance: DecisionExplainabilityEngine;
  private config: DecisionExplainabilityEngineConfig;
  private explanations: Map<string, DecisionExplanation> = new Map();
  private components: Map<string, ExplanationComponent> = new Map();
  private templates: Map<string, ExplanationTemplate> = new Map();
  private cache: Map<string, DecisionExplanation> = new Map();

  private constructor() {
    this.config = defaultDecisionExplainabilityEngineConfig;
    this.initializeTemplates();
  }

  static getInstance(): DecisionExplainabilityEngine {
    if (!DecisionExplainabilityEngine.instance) {
      DecisionExplainabilityEngine.instance = new DecisionExplainabilityEngine();
    }
    return DecisionExplainabilityEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<DecisionExplainabilityEngineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize templates
   */
  private initializeTemplates(): void {
    // Recommendation template
    this.templates.set("recommendation", {
      id: "template_recommendation",
      type: "recommendation",
      template: "We recommend {action} because {reason}. This is based on {evidence}.",
      variables: ["action", "reason", "evidence"],
      defaultValues: {
        action: "this action",
        reason: "it aligns with your goals",
        evidence: "your profile and preferences",
      },
      detailLevels: {
        brief: "We recommend {action}.",
        standard: "We recommend {action} because {reason}.",
        detailed: "We recommend {action} because {reason}. This is based on {evidence}. Consider these alternatives: {alternatives}.",
      },
    });

    // Difficulty template
    this.templates.set("difficulty", {
      id: "template_difficulty",
      type: "difficulty",
      template: "The difficulty is {level} because {reason}. This is based on {evidence}.",
      variables: ["level", "reason", "evidence"],
      defaultValues: {
        level: "medium",
        reason: "of the complexity of the task",
        evidence: "historical data",
      },
      detailLevels: {
        brief: "Difficulty: {level}.",
        standard: "The difficulty is {level} because {reason}.",
        detailed: "The difficulty is {level} because {reason}. This is based on {evidence}. Factors: {factors}.",
      },
    });

    // Personality template
    this.templates.set("personality", {
      id: "template_personality",
      type: "personality",
      template: "Your personality is {trait} because {reason}. This is based on {evidence}.",
      variables: ["trait", "reason", "evidence"],
      defaultValues: {
        trait: "analytical",
        reason: "of your responses and behavior",
        evidence: "your interaction history",
      },
      detailLevels: {
        brief: "Personality: {trait}.",
        standard: "Your personality is {trait} because {reason}.",
        detailed: "Your personality is {trait} because {reason}. This is based on {evidence}. Traits: {traits}.",
      },
    });

    // Score template
    this.templates.set("score", {
      id: "template_score",
      type: "score",
      template: "Your score is {score} because {reason}. This is based on {evidence}.",
      variables: ["score", "reason", "evidence"],
      defaultValues: {
        score: "75",
        reason: "of your performance",
        evidence: "your responses",
      },
      detailLevels: {
        brief: "Score: {score}.",
        standard: "Your score is {score} because {reason}.",
        detailed: "Your score is {score} because {reason}. This is based on {evidence}. Breakdown: {breakdown}.",
      },
    });
  }

  /**
   * Generate explanation
   */
  async generateExplanation(request: ExplanationRequest): Promise<DecisionExplanation> {
    // Check cache
    if (this.config.enableCaching) {
      const cacheKey = this.generateCacheKey(request);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const explanationId = `explanation_${request.decisionId}_${Date.now()}`;

    // Generate explanation components
    const reason = await this.generateReason(request);
    const alternatives = request.includeAlternatives ? await this.generateAlternatives(request) : [];
    const evidence = request.includeEvidence ? await this.generateEvidence(request) : [];
    const historicalPrecedent = this.config.enableHistoricalPrecedent ? await this.findHistoricalPrecedent(request) : null;
    const tradeoffs = this.config.enableTradeoffs ? await this.generateTradeoffs(request) : [];
    const risk = await this.generateRisk(request);
    const expectedOutcome = await this.generateExpectedOutcome(request);
    const confidence = await this.calculateConfidence(request);

    const explanation: DecisionExplanation = {
      id: explanationId,
      decisionId: request.decisionId,
      type: request.type,
      reason,
      alternatives,
      confidence,
      evidence,
      historicalPrecedent,
      tradeoffs,
      risk,
      expectedOutcome,
      timestamp: new Date(),
      userId: request.userId,
    };

    this.explanations.set(explanationId, explanation);

    // Cache explanation
    if (this.config.enableCaching) {
      const cacheKey = this.generateCacheKey(request);
      this.cache.set(cacheKey, explanation);
    }

    return explanation;
  }

  /**
   * Generate reason
   */
  private async generateReason(request: ExplanationRequest): Promise<string> {
    const template = this.templates.get(request.type);
    if (template && this.config.enableTemplates) {
      const templateText = template.detailLevels[request.detailLevel];
      return this.fillTemplate(templateText, request.context);
    }

    // Default reason based on type
    switch (request.type) {
      case "recommendation":
        return "This recommendation is based on your profile, preferences, and historical data.";
      case "difficulty":
        return "The difficulty is calculated based on the complexity of the task and your current skills.";
      case "personality":
        return "Your personality is inferred from your responses, behavior, and interaction patterns.";
      case "follow_up":
        return "This follow-up is suggested based on your progress and areas for improvement.";
      case "score":
        return "Your score reflects your performance across multiple dimensions.";
      case "intervention":
        return "This intervention is triggered by specific patterns in your behavior.";
      case "journey":
        return "This journey is personalized based on your goals, skills, and learning pace.";
      case "feedback":
        return "This feedback is generated from your responses and performance metrics.";
      default:
        return "This decision is based on multiple factors including your profile and context.";
    }
  }

  /**
   * Generate alternatives
   */
  private async generateAlternatives(request: ExplanationRequest): Promise<string[]> {
    const alternatives: string[] = [];

    switch (request.type) {
      case "recommendation":
        alternatives.push("Alternative 1: Focus on different skills");
        alternatives.push("Alternative 2: Adjust timeline");
        alternatives.push("Alternative 3: Change approach");
        break;
      case "difficulty":
        alternatives.push("Alternative 1: Break down into smaller tasks");
        alternatives.push("Alternative 2: Provide more guidance");
        alternatives.push("Alternative 3: Adjust complexity");
        break;
      default:
        alternatives.push("Alternative option 1");
        alternatives.push("Alternative option 2");
        alternatives.push("Alternative option 3");
    }

    return alternatives.slice(0, this.config.maxAlternatives);
  }

  /**
   * Generate evidence
   */
  private async generateEvidence(request: ExplanationRequest): Promise<string[]> {
    const evidence: string[] = [];

    switch (request.type) {
      case "recommendation":
        evidence.push("Your profile indicates strong interest in this area");
        evidence.push("Historical data shows success with similar recommendations");
        evidence.push("Current market trends support this direction");
        evidence.push("Your skills align with this recommendation");
        evidence.push("User feedback has been positive for similar paths");
        break;
      case "score":
        evidence.push("Response quality: 85%");
        evidence.push("Completion rate: 90%");
        evidence.push("Time management: 75%");
        evidence.push("Engagement level: 80%");
        evidence.push("Feedback satisfaction: 85%");
        break;
      default:
        evidence.push("Evidence 1 from user profile");
        evidence.push("Evidence 2 from historical data");
        evidence.push("Evidence 3 from context analysis");
    }

    return evidence.slice(0, this.config.maxEvidence);
  }

  /**
   * Find historical precedent
   */
  private async findHistoricalPrecedent(request: ExplanationRequest): Promise<string | null> {
    // Placeholder for historical precedent search
    return "Similar decision made 3 months ago with positive outcome";
  }

  /**
   * Generate tradeoffs
   */
  private async generateTradeoffs(request: ExplanationRequest): Promise<string[]> {
    const tradeoffs: string[] = [];

    switch (request.type) {
      case "recommendation":
        tradeoffs.push("Pro: Higher success rate");
        tradeoffs.push("Con: Longer time commitment");
        tradeoffs.push("Pro: Better skill development");
        tradeoffs.push("Con: Higher cost");
        break;
      default:
        tradeoffs.push("Tradeoff 1");
        tradeoffs.push("Tradeoff 2");
    }

    return tradeoffs;
  }

  /**
   * Generate risk
   */
  private async generateRisk(request: ExplanationRequest): Promise<string> {
    switch (request.type) {
      case "recommendation":
        return "Low risk: Based on strong evidence and historical success";
      case "difficulty":
        return "Medium risk: May require additional support";
      default:
        return "Low to medium risk based on available data";
    }
  }

  /**
   * Generate expected outcome
   */
  private async generateExpectedOutcome(request: ExplanationRequest): Promise<string> {
    switch (request.type) {
      case "recommendation":
        return "Expected to improve skills by 20% and increase satisfaction by 15%";
      case "score":
        return "Expected to maintain or improve current score with continued engagement";
      default:
        return "Expected positive outcome based on analysis";
    }
  }

  /**
   * Calculate confidence
   */
  private async calculateConfidence(request: ExplanationRequest): Promise<number> {
    // Placeholder for confidence calculation
    return 0.85;
  }

  /**
   * Fill template
   */
  private fillTemplate(template: string, context: Record<string, unknown>): string {
    let filled = template;
    Object.entries(context).forEach(([key, value]) => {
      filled = filled.replace(new RegExp(`{${key}}`, "g"), String(value));
    });
    return filled;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(request: ExplanationRequest): string {
    return `${request.decisionId}_${request.type}_${request.userId}_${request.detailLevel}`;
  }

  /**
   * Get explanation
   */
  getExplanation(explanationId: string): DecisionExplanation | null {
    return this.explanations.get(explanationId) || null;
  }

  /**
   * Get explanations by decision
   */
  getExplanationsByDecision(decisionId: string): DecisionExplanation[] {
    return Array.from(this.explanations.values()).filter(exp => exp.decisionId === decisionId);
  }

  /**
   * Get explanations by user
   */
  getExplanationsByUser(userId: string): DecisionExplanation[] {
    return Array.from(this.explanations.values()).filter(exp => exp.userId === userId);
  }

  /**
   * Get template
   */
  getTemplate(type: ExplanationType): ExplanationTemplate | null {
    return this.templates.get(type) || null;
  }

  /**
   * Add template
   */
  addTemplate(template: ExplanationTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get metrics
   */
  getMetrics(): ExplanationMetrics {
    const totalExplanations = this.explanations.size;

    const explanationsByType: Record<string, number> = {};
    this.explanations.forEach(exp => {
      explanationsByType[exp.type] = (explanationsByType[exp.type] || 0) + 1;
    });

    const averageConfidence = totalExplanations > 0
      ? Array.from(this.explanations.values()).reduce((sum, exp) => sum + exp.confidence, 0) / totalExplanations
      : 0;

    const averageAlternatives = totalExplanations > 0
      ? Array.from(this.explanations.values()).reduce((sum, exp) => sum + exp.alternatives.length, 0) / totalExplanations
      : 0;

    const averageEvidence = totalExplanations > 0
      ? Array.from(this.explanations.values()).reduce((sum, exp) => sum + exp.evidence.length, 0) / totalExplanations
      : 0;

    return {
      totalExplanations,
      explanationsByType,
      averageConfidence,
      averageAlternatives,
      averageEvidence,
      userSatisfaction: 0.85, // Placeholder
      clarityScore: 0.9, // Placeholder
    };
  }
}

export const decisionExplainabilityEngine = DecisionExplainabilityEngine.getInstance();
