// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotPersonalizationIntelligenceV1 } from "../../ai/Prompts/career-copilot-personalization-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface PersonalizationIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface PersonalizationIntelligenceOutput {
  learningProfile: {
    autonomy: {
      level: "high" | "medium" | "low";
      confidence: number;
      evidence: string[];
      observations: string[];
    };
    guidancePreference: {
      explanationLength: "short" | "medium" | "long";
      detailLevel: "minimal" | "moderate" | "comprehensive";
      examplePreference: "none" | "few" | "many";
      confidence: number;
      evidence: string[];
      observations: string[];
    };
    motivationSensitivity: {
      encouragement: "low" | "medium" | "high";
      reminder: "low" | "medium" | "high";
      challenge: "low" | "medium" | "high";
      feedback: "low" | "medium" | "high";
      confidence: number;
      evidence: string[];
      observations: string[];
    };
    learningCharacteristics: {
      learningSpeed: "very_slow" | "slow" | "moderate" | "fast" | "very_fast";
      executionSpeed: "very_slow" | "slow" | "moderate" | "fast" | "very_fast";
      complexityTolerance: "low" | "medium" | "high";
      planningCapability: "low" | "medium" | "high";
      habitStability: "low" | "medium" | "high";
      confidence: number;
      evidence: string[];
      observations: string[];
    };
    reactionPatterns: {
      failureReaction: "discouraged" | "resilient" | "motivated";
      successReaction: "celebrates" | "moves_on" | "builds_on";
      overloadThreshold: string;
      understimulationThreshold: string;
      confidence: number;
      evidence: string[];
      observations: string[];
    };
  };
  currentCoachingStyle: {
    responseLength: "short" | "medium" | "long";
    detailLevel: "minimal" | "moderate" | "comprehensive";
    vocabulary: "simple" | "standard" | "technical";
    exampleUsage: "none" | "few" | "many";
    reminderFrequency: "none" | "low" | "medium" | "high";
    reminderTiming: "morning" | "afternoon" | "evening" | "flexible";
    reminderFormat: "gentle" | "direct" | "motivational";
    goalDifficulty: "very_easy" | "easy" | "moderate" | "challenging" | "very_challenging";
    goalCount: "single" | "2-3" | "4-5";
    goalTimeline: "short" | "medium" | "long";
    goalBreakdown: "pre_broken" | "self_breakdown" | "no_breakdown";
    autonomyLevel: "high" | "medium" | "low";
    checkinFrequency: "none" | "weekly" | "bi_weekly" | "daily";
    decisionAuthority: "full" | "shared" | "minimal";
    recommendationLoad: "1" | "2-3" | "4-5" | "6+";
    priorityFocus: "single" | "balanced" | "multi";
    recommendationComplexity: "simple" | "moderate" | "complex";
    encouragementLevel: "minimal" | "moderate" | "high";
    directnessLevel: "gentle" | "balanced" | "direct";
    formalityLevel: "casual" | "professional" | "formal";
    progressionSpeed: "very_slow" | "slow" | "moderate" | "fast" | "very_fast";
    milestoneFrequency: "none" | "weekly" | "bi_weekly" | "monthly";
    adjustmentFrequency: "none" | "frequent" | "occasional";
    confidence: number;
    reasoning: string;
  };
  coachingEffectiveness: {
    overallEffectiveness: number;
    followThroughRate: number;
    implementationQuality: number;
    outcomeQuality: number;
    engagementLevel: number;
    satisfactionIndicators: string[];
    concernIndicators: string[];
    confidence: number;
    evidence: string[];
  };
  detectedPatterns: {
    effectiveFormats: string[];
    ineffectiveFormats: string[];
    motivationTriggers: string[];
    demotivators: string[];
    optimalDifficulty: string;
    optimalPace: string;
    optimalSupport: string;
    confidence: number;
    evidence: string[];
  };
  adaptationRecommendations: {
    shouldAdapt: boolean;
    adaptationType: "none" | "simplify" | "complexify" | "encourage" | "challenge" | "support" | "autonomize";
    specificChanges?: {
      responseLength?: "short" | "medium" | "long";
      detailLevel?: "minimal" | "moderate" | "comprehensive";
      reminderFrequency?: "none" | "low" | "medium" | "high";
      goalDifficulty?: "very_easy" | "easy" | "moderate" | "challenging" | "very_challenging";
      goalCount?: "single" | "2-3" | "4-5";
      autonomyLevel?: "high" | "medium" | "low";
      recommendationLoad?: "1" | "2-3" | "4-5" | "6+";
      encouragementLevel?: "minimal" | "moderate" | "high";
      progressionSpeed?: "very_slow" | "slow" | "moderate" | "fast" | "very_fast";
    };
    reasoning: string;
    expectedImpact: string;
    confidence: number;
  };
  explainability: {
    whyThisCoachingStyle: string;
    whyTheseAdaptations: string;
    observationsUsed: string[];
    learnings: string[];
    confidence: number;
    limitations: string[];
  };
  confidence: number;
  evidenceLevel: "none" | "very_weak" | "weak" | "moderate" | "strong" | "very_strong";
  dataQuality: number;
}

/**
 * Personalization Intelligence Engine
 *
 * Learns how to best accompany each individual candidate.
 * Adapts coaching style based on learning profile and effectiveness.
 */
export class CareerCopilotPersonalizationIntelligenceEngine {
  private static lastPersonalization: PersonalizationIntelligenceOutput | null = null;
  private static personalizationHistory: Array<{
    timestamp: Date;
    event: string;
    output: PersonalizationIntelligenceOutput;
  }> = [];

  /**
   * Track coaching interaction and outcome
   */
  static trackCoachingInteraction({
    coachingType,
    coachingStyle,
    responseLength,
    detailLevel,
    followed,
    implemented,
    outcome,
    timeToImplement,
    engagement,
    feedback,
  }: {
    coachingType: string;
    coachingStyle: any;
    responseLength: number;
    detailLevel: string;
    followed: boolean;
    implemented: boolean;
    outcome: "positive" | "neutral" | "negative";
    timeToImplement?: number;
    engagement: "high" | "medium" | "low";
    feedback?: string;
  }) {
    const trackingData = {
      timestamp: new Date(),
      coachingType,
      coachingStyle,
      responseLength,
      detailLevel,
      followed,
      implemented,
      outcome,
      timeToImplement,
      engagement,
      feedback,
    };

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-personalization-intelligence",
      type: "general",
      data: trackingData,
      confidence: 1.0,
    });
  }

  /**
   * Extract coaching history from Brain
   */
  private static extractCoachingHistory(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-personalization-intelligence")
      .map(obs => (obs.data as any))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Extract follow-through data from Brain
   */
  private static extractFollowThroughData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-personalization-intelligence")
      .map(obs => ({
        followed: (obs.data as any)?.followed,
        implemented: (obs.data as any)?.implemented,
        timeToImplement: (obs.data as any)?.timeToImplement,
        coachingType: (obs.data as any)?.coachingType,
        coachingStyle: (obs.data as any)?.coachingStyle,
      }));
  }

  /**
   * Extract outcome data from Brain
   */
  private static extractOutcomeData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-personalization-intelligence")
      .filter(obs => (obs.data as any)?.followed)
      .map(obs => ({
        outcome: (obs.data as any)?.outcome,
        engagement: (obs.data as any)?.engagement,
        coachingType: (obs.data as any)?.coachingType,
        coachingStyle: (obs.data as any)?.coachingStyle,
      }));
  }

  /**
   * Extract engagement patterns from Brain
   */
  private static extractEngagementPatterns(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-conversation")
      .map(obs => ({
        timestamp: obs.timestamp,
        engagement: (obs.data as any)?.engagement,
        responseTime: (obs.data as any)?.responseTime,
        questionCount: (obs.data as any)?.questionCount,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract feedback from Brain
   */
  private static extractFeedback(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-conversation")
      .filter(obs => (obs.data as any)?.feedback)
      .map(obs => ({
        timestamp: obs.timestamp,
        feedback: (obs.data as any)?.feedback,
        sentiment: (obs.data as any)?.sentiment,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Calculate follow-through rate
   */
  private static calculateFollowThroughRate(): number {
    const followThroughData = this.extractFollowThroughData();
    if (followThroughData.length === 0) return 0;

    const followed = followThroughData.filter(d => d.followed).length;
    return (followed / followThroughData.length) * 100;
  }

  /**
   * Calculate implementation rate
   */
  private static calculateImplementationRate(): number {
    const followThroughData = this.extractFollowThroughData();
    if (followThroughData.length === 0) return 0;

    const implemented = followThroughData.filter(d => d.implemented).length;
    return (implemented / followThroughData.length) * 100;
  }

  /**
   * Analyze personalization intelligence
   */
  static async analyzePersonalizationIntelligence(
    input: PersonalizationIntelligenceInput
  ): Promise<PersonalizationIntelligenceOutput> {
    // Extract candidate profile from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      careerLevel: input.candidateGraph.career?.level || "unknown",
      goals: input.candidateGraph.goals || [],
      skills: input.candidateGraph.skills || [],
      experience: input.candidateGraph.experience || [],
    };

    // Extract data from Brain
    const coachingHistory = this.extractCoachingHistory();
    const followThroughData = this.extractFollowThroughData();
    const outcomeData = this.extractOutcomeData();
    const engagementPatterns = this.extractEngagementPatterns();
    const feedback = this.extractFeedback();

    // Get constraint intelligence for constraint-aware personalization
    let constraintContext = null;
    try {
      const constraintIntelligence = CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis();
      if (constraintIntelligence) {
        constraintContext = {
          activeConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.active).map(con => con.name)),
          criticalConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.strength === "strong" && !con.negotiable).map(con => con.name)),
          constraintImpact: constraintIntelligence.constraintImpact,
          constraintRecommendations: constraintIntelligence.constraintRecommendations,
        };
      }
    } catch (error) {
      console.error("Failed to get constraint intelligence:", error);
    }

    // Get resource intelligence for resource-aware personalization
    let resourceContext = null;
    try {
      const resourceIntelligence = CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis();
      if (resourceIntelligence) {
        resourceContext = {
          resourceSummary: resourceIntelligence.resourceSummary,
          availableResources: resourceIntelligence.resourcesByCategory.reduce((acc, cat) => {
            acc[cat.category] = cat.resources.map(r => ({ name: r.name, availability: r.availability, unit: r.unit, criticality: r.criticality }));
            return acc;
          }, {} as Record<string, any>),
          resourceOptimization: resourceIntelligence.resourceOptimization,
          resourceRecommendations: resourceIntelligence.resourceRecommendations,
          detectedChanges: resourceIntelligence.detectedChanges,
        };
      }
    } catch (error) {
      console.error("Failed to get resource intelligence:", error);
    }

    // Get previous personalization
    const previousPersonalization = this.lastPersonalization;

    // Get current coaching style (default if none exists)
    const currentCoachingStyle = this.lastPersonalization?.currentCoachingStyle || {
      responseLength: "medium",
      detailLevel: "moderate",
      vocabulary: "standard",
      exampleUsage: "few",
      reminderFrequency: "medium",
      reminderTiming: "flexible",
      reminderFormat: "gentle",
      goalDifficulty: "moderate",
      goalCount: "2-3",
      goalTimeline: "medium",
      goalBreakdown: "pre_broken",
      autonomyLevel: "medium",
      checkinFrequency: "weekly",
      decisionAuthority: "shared",
      recommendationLoad: "2-3",
      priorityFocus: "balanced",
      recommendationComplexity: "moderate",
      encouragementLevel: "moderate",
      directnessLevel: "balanced",
      formalityLevel: "professional",
      progressionSpeed: "moderate",
      milestoneFrequency: "weekly",
      adjustmentFrequency: "occasional",
      confidence: 50,
      reasoning: "Default coaching style - no personalization data yet",
    };

    // Call AI Orchestrator with personalization intelligence prompt
    const result = await aiOrchestrator.execute(
      careerCopilotPersonalizationIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile, null, 2),
        coachingHistory: JSON.stringify(coachingHistory, null, 2),
        followThroughData: JSON.stringify(followThroughData, null, 2),
        outcomeData: JSON.stringify(outcomeData, null, 2),
        engagementPatterns: JSON.stringify(engagementPatterns, null, 2),
        feedbackReceived: JSON.stringify(feedback, null, 2),
        previousPersonalization: JSON.stringify(previousPersonalization, null, 2),
        currentCoachingStyle: JSON.stringify(currentCoachingStyle, null, 2),
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        promptId: "career-copilot-personalization-intelligence-v1",
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to analyze personalization intelligence");
    }

    const output: PersonalizationIntelligenceOutput = result.data as PersonalizationIntelligenceOutput;

    // Save personalization analysis to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-personalization-intelligence",
      type: "general",
      data: output,
      confidence: output.confidence / 100,
    });

    // Publish personalization analysis event to EventBus
    eventBus.publish({
      id: `personalization-intelligence-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-personalization-intelligence",
        observationType: "general",
        data: output,
        confidence: output.confidence / 100,
      },
    });

    // Update last personalization and history
    this.lastPersonalization = output;
    this.personalizationHistory.push({
      timestamp: new Date(),
      event: input.currentEvent?.type || "manual_analysis",
      output,
    });

    // Keep only last 50 analyses in history
    if (this.personalizationHistory.length > 50) {
      this.personalizationHistory = this.personalizationHistory.slice(-50);
    }

    return output;
  }

  /**
   * Get current coaching style
   */
  static getCurrentCoachingStyle(): PersonalizationIntelligenceOutput["currentCoachingStyle"] | null {
    return this.lastPersonalization?.currentCoachingStyle || null;
  }

  /**
   * Get learning profile
   */
  static getLearningProfile(): PersonalizationIntelligenceOutput["learningProfile"] | null {
    return this.lastPersonalization?.learningProfile || null;
  }

  /**
   * Check if adaptation is recommended
   */
  static shouldAdaptCoaching(): boolean {
    return this.lastPersonalization?.adaptationRecommendations?.shouldAdapt || false;
  }

  /**
   * Get recommended adaptations
   */
  static getAdaptationRecommendations(): PersonalizationIntelligenceOutput["adaptationRecommendations"] | null {
    return this.lastPersonalization?.adaptationRecommendations || null;
  }

  /**
   * Get coaching effectiveness
   */
  static getCoachingEffectiveness(): PersonalizationIntelligenceOutput["coachingEffectiveness"] | null {
    return this.lastPersonalization?.coachingEffectiveness || null;
  }

  /**
   * Get last personalization analysis
   */
  static getLastPersonalization(): PersonalizationIntelligenceOutput | null {
    return this.lastPersonalization;
  }

  /**
   * Get personalization history
   */
  static getPersonalizationHistory(): Array<{
    timestamp: Date;
    event: string;
    output: PersonalizationIntelligenceOutput;
  }> {
    return this.personalizationHistory;
  }

  /**
   * Get explainability
   */
  static getExplainability(): PersonalizationIntelligenceOutput["explainability"] | null {
    return this.lastPersonalization?.explainability || null;
  }
}
