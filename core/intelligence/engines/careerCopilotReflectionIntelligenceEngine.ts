import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { careerCopilotReflectionIntelligenceV1 } from "../../ai/Prompts/career-copilot-reflection-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotEvidenceIntelligenceEngine } from "./careerCopilotEvidenceIntelligenceEngine";
import { CareerCopilotMissionIntelligenceEngine } from "./careerCopilotMissionIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";

export interface ReflectionInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface ReflectionOutput {
  recommendationReview: {
    recommendations: Array<{
      recommendation: string;
      quality: number;
      coherence: number;
      justification: string;
      confidence: number;
      improvementSuggestion: string;
    }>;
    overallQuality: number;
  };
  alternativeAnalysis: {
    alternatives: Array<{
      alternative: string;
      advantages: string[];
      disadvantages: string[];
      risks: string[];
      confidence: number;
    }>;
    preferredChoice: string;
    rationale: string;
  };
  assumptionDetection: {
    assumptions: Array<{
      assumption: string;
      category: "market" | "skill" | "goal" | "motivation" | "constraint";
      validity: "high" | "medium" | "low";
      needsValidation: boolean;
      reason: string;
    }>;
    criticalAssumptions: string[];
  };
  blindSpotDetection: {
    blindSpots: Array<{
      blindSpot: string;
      category: "skill" | "opportunity" | "experience" | "evidence" | "risk";
      impact: "high" | "medium" | "low";
      suggestion: string;
    }>;
    priorityBlindSpots: string[];
  };
  contradictionDetection: {
    contradictions: Array<{
      contradiction: string;
      sourceA: string;
      sourceB: string;
      severity: "high" | "medium" | "low";
      resolution: string;
    }>;
    unresolvedContradictions: string[];
  };
  evidenceReview: {
    conclusions: Array<{
      conclusion: string;
      evidenceStrength: "strong" | "moderate" | "weak";
      missingEvidence: string[];
      contradictoryEvidence: string[];
      needsStrengthening: boolean;
    }>;
    overallEvidenceQuality: number;
  };
  confidenceCalibration: {
    calibrations: Array<{
      recommendation: string;
      originalConfidence: number;
      calibratedConfidence: number;
      reason: string;
    }>;
    overallConfidence: number;
  };
  reflectionSummary: {
    confirmed: string[];
    improved: string[];
    uncertain: string[];
    needsMoreInfo: string[];
    overallReflectionQuality: number;
    reflectionTimestamp: string;
  };
  explainability: {
    enginesConsulted: string[];
    evidenceUsed: string[];
    assumptionsRetained: string[];
    assumptionsRejected: string[];
    contradictionsDetected: string[];
    alternativesAnalyzed: string[];
    reasonsForDecision: string[];
    finalConfidence: number;
  };
}

export class CareerCopilotReflectionIntelligenceEngine {
  private static lastReflectionAnalysis: ReflectionOutput | null = null;
  private static reflectionHistory: Array<{
    timestamp: Date;
    event: string;
    output: ReflectionOutput;
  }> = [];

  /**
   * Perform critical reflection on recommendations and reasoning
   */
  static async performReflection(
    input: ReflectionInput
  ): Promise<ReflectionOutput> {
    // Extract candidate profile from CandidateGraph (PRIMARY SOURCE)
    const candidateProfile = {
      name: input.candidateGraph.name || "",
      currentRole: input.candidateGraph.currentRole || "",
      targetRole: input.candidateGraph.targetRole || "",
      experience: input.candidateGraph.experience || "",
      education: input.candidateGraph.education || [],
      skills: input.candidateGraph.skills || [],
      achievements: input.candidateGraph.achievements || [],
    };

    // Extract career timeline from CandidateGraph (PRIMARY SOURCE)
    const careerTimeline = input.candidateGraph.careerTimeline || [];
    const careerTimelineText = careerTimeline
      .map((item: any) => {
        return `${item.role} at ${item.company} (${item.startDate} - ${item.endDate || 'Present'})\n${item.description || ''}`;
      })
      .join("\n\n");

    // Extract skills evolution from CandidateGraph (PRIMARY SOURCE)
    const skillsEvolution = input.candidateGraph.skillsEvolution || [];
    const skillsEvolutionText = skillsEvolution
      .map((item: any) => {
        return `${item.skill}: ${item.level} (acquired: ${item.acquiredDate})`;
      })
      .join("\n");

    // Extract achievements from CandidateGraph (PRIMARY SOURCE)
    const achievements = input.candidateGraph.achievements || [];
    const achievementsText = achievements
      .map((item: any) => {
        return `${item.title}: ${item.description}`;
      })
      .join("\n");

    // Extract goals from CandidateGraph (PRIMARY SOURCE)
    const goals = input.candidateGraph.goals || [];
    const goalsText = goals
      .map((item: any) => {
        return `${item.title}: ${item.description}`;
      })
      .join("\n");

    // Career narrative context (simplified - Career Narrative Intelligence Engine removed)
    let careerNarrativeContext = null;

    let decisionContext = null;
    let forecastContext = null;

    let evidenceContext = null;
    try {
      const evidenceIntelligence = CareerCopilotEvidenceIntelligenceEngine.getLastEvidenceAnalysis();
      if (evidenceIntelligence) {
        evidenceContext = {
          evidenceSummary: evidenceIntelligence.evidenceSummary,
          strongEvidence: evidenceIntelligence.evidenceByCategory.directObservations,
          criticalEvidence: evidenceIntelligence.evidenceSummary.criticalEvidence,
        };
      }
    } catch (error) {
      console.error("Failed to get evidence intelligence context (non-critical):", error);
    }

    let missionContext = null;
    try {
      const missionIntelligence = CareerCopilotMissionIntelligenceEngine.getLastMissionAnalysis();
      if (missionIntelligence) {
        missionContext = {
          mission: missionIntelligence.mission,
          currentPhase: missionIntelligence.currentPhase,
        };
      }
    } catch (error) {
      console.error("Failed to get mission intelligence context (non-critical):", error);
    }

    // Knowledge evolution context (simplified - Knowledge Evolution Engine removed)
    let knowledgeEvolutionContext = null;

    let outcomeContext = null;

    // Opportunity context (simplified - Opportunity Intelligence Engine removed)
    let opportunityContext = null;

    let successContext = null;

    let constraintContext = null;
    try {
      const constraintIntelligence = CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis();
      if (constraintIntelligence) {
        constraintContext = {
          activeConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.active).map(con => con.name)),
          criticalConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.strength === "strong" && !con.negotiable).map(con => con.name)),
          constraintImpact: constraintIntelligence.constraintImpact,
        };
      }
    } catch (error) {
      console.error("Failed to get constraint intelligence context (non-critical):", error);
    }

    let resourceContext = null;
    try {
      const resourceIntelligence = CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis();
      if (resourceIntelligence) {
        resourceContext = {
          resourceSummary: resourceIntelligence.resourceSummary,
          availableResources: resourceIntelligence.resourcesByCategory.reduce((acc: Record<string, Array<{name: string, availability: number}>>, cat) => {
            acc[cat.category] = cat.resources.map(r => ({ name: r.name, availability: r.availability }));
            return acc;
          }, {}),
        };
      }
    } catch (error) {
      console.error("Failed to get resource intelligence context (non-critical):", error);
    }

    let goalContext = null;

    let confidenceContext = null;

    let metaContext = null;

    let applicationContext = null;
    try {
      const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
      if (applicationIntelligence) {
        applicationContext = {
          priorityApplication: applicationIntelligence.priorityApplication,
          applicationsToFollowUp: applicationIntelligence.applicationsToFollowUp,
        };
      }
    } catch (error) {
      console.error("Failed to get application intelligence context (non-critical):", error);
    }

    let conversationContext = null;

    // Call AI with reflection intelligence prompt
    const promptTemplate = careerCopilotReflectionIntelligenceV1.system || careerCopilotReflectionIntelligenceV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<ReflectionOutput>(promptTemplate);

    const request: IntelligenceRequest<ReflectionOutput> = {
      id: `career-copilot-reflection-intelligence-${Date.now()}`,
      type: "career-copilot-reflection-intelligence",
      input: input as unknown as ReflectionOutput,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
          candidateProfile: candidateProfile as Record<string, unknown>,
          careerTimeline: careerTimelineText,
          skillsEvolution: skillsEvolutionText,
          achievements: achievementsText,
          goals: goalsText,
          careerNarrativeIntelligence: careerNarrativeContext,
          decisionIntelligence: decisionContext,
          forecastIntelligence: forecastContext,
          evidenceIntelligence: evidenceContext,
          missionIntelligence: missionContext,
          knowledgeEvolution: knowledgeEvolutionContext,
          scenarioIntelligence: forecastContext,
          outcomeIntelligence: outcomeContext,
          opportunityIntelligence: opportunityContext,
          successIntelligence: successContext,
          constraintIntelligence: constraintContext,
          resourceIntelligence: resourceContext,
          goalIntelligence: goalContext,
          confidenceIntelligence: confidenceContext,
          metaIntelligence: metaContext,
          applicationIntelligence: applicationContext,
          conversationIntelligence: conversationContext,
        },
      },
      options: {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error("Failed to perform reflection");
    }

    const output = result.output as ReflectionOutput;

    // Save reflection analysis to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-reflection-intelligence",
      type: "career",
      data: output,
      confidence: output.confidenceCalibration.overallConfidence / 100,
    });

    // Publish reflection events via EventPublisher
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "career-copilot-reflection-intelligence",
      observationType: "career",
      data: {
        reflectionSummary: output.reflectionSummary,
        overallQuality: output.reflectionSummary.overallReflectionQuality,
      },
      confidence: output.reflectionSummary.overallReflectionQuality / 100,
    });

    if (output.recommendationReview.recommendations.some(r => r.improvementSuggestion)) {
      eventPublisher.publish("observation_created", {
 source: "career-copilot-reflection-intelligence",
        observationType: "career",
        data: {
          improvedRecommendations: output.recommendationReview.recommendations.filter(r => r.improvementSuggestion),
        },
        confidence: 0.8,
      });
    }

    if (output.blindSpotDetection.blindSpots.length > 0) {
      eventPublisher.publish("observation_created", {
        source: "career-copilot-reflection-intelligence",
        observationType: "career",
        data: {
          blindSpots: output.blindSpotDetection.blindSpots,
          priorityBlindSpots: output.blindSpotDetection.priorityBlindSpots,
        },
        confidence: 0.7,
      });
    }

    if (output.alternativeAnalysis.alternatives.length > 0) {
      eventPublisher.publish("observation_created", {
        source: "career-copilot-reflection-intelligence",
        observationType: "career",
        data: {
          alternatives: output.alternativeAnalysis.alternatives,
          preferredChoice: output.alternativeAnalysis.preferredChoice,
        },
        confidence: 0.8,
      });
    }

    if (output.confidenceCalibration.calibrations.length > 0) {
      eventPublisher.publish("observation_created", {
        source: "career-copilot-reflection-intelligence",
        observationType: "career",
        data: {
          calibrations: output.confidenceCalibration.calibrations,
          overallConfidence: output.confidenceCalibration.overallConfidence,
        },
        confidence: 0.9,
      });
    }

    if (output.evidenceReview.conclusions.some(c => c.needsStrengthening)) {
      eventPublisher.publish("observation_created", {
        source: "career-copilot-reflection-intelligence",
        observationType: "career",
        data: {
          conclusionsNeedingStrengthening: output.evidenceReview.conclusions.filter(c => c.needsStrengthening),
          overallEvidenceQuality: output.evidenceReview.overallEvidenceQuality,
        },
        confidence: 0.8,
      });
    }

    eventPublisher.publish("observation_created", {
      source: "career-copilot-reflection-intelligence",
      observationType: "career",
      data: {
        reflectionSummary: output.reflectionSummary,
        explainability: output.explainability,
      },
      confidence: output.explainability.finalConfidence / 100,
    });

    // Update last reflection analysis and history
    this.lastReflectionAnalysis = output;
    this.reflectionHistory.push({
      timestamp: new Date(),
      event: input.currentEvent?.type || "manual_reflection",
      output,
    });

    // Keep only last 50 reflections in history
    if (this.reflectionHistory.length > 50) {
      this.reflectionHistory = this.reflectionHistory.slice(-50);
    }

    return output;
  }

  /**
   * Get the last reflection analysis
   */
  static getLastReflectionAnalysis(): ReflectionOutput | null {
    return this.lastReflectionAnalysis;
  }

  /**
   * Get reflection analysis history
   */
  static getHistory(): Array<{
    timestamp: Date;
    event: string;
    output: ReflectionOutput;
  }> {
    return this.reflectionHistory;
  }

  /**
   * Get recommendation review
   */
  static getRecommendationReview() {
    return this.lastReflectionAnalysis?.recommendationReview || null;
  }

  /**
   * Get alternative analysis
   */
  static getAlternativeAnalysis() {
    return this.lastReflectionAnalysis?.alternativeAnalysis || null;
  }

  /**
   * Get assumption detection
   */
  static getAssumptionDetection() {
    return this.lastReflectionAnalysis?.assumptionDetection || null;
  }

  /**
   * Get blind spot detection
   */
  static getBlindSpotDetection() {
    return this.lastReflectionAnalysis?.blindSpotDetection || null;
  }

  /**
   * Get contradiction detection
   */
  static getContradictionDetection() {
    return this.lastReflectionAnalysis?.contradictionDetection || null;
  }

  /**
   * Get evidence review
   */
  static getEvidenceReview() {
    return this.lastReflectionAnalysis?.evidenceReview || null;
  }

  /**
   * Get confidence calibration
   */
  static getConfidenceCalibration() {
    return this.lastReflectionAnalysis?.confidenceCalibration || null;
  }

  /**
   * Get reflection summary
   */
  static getReflectionSummary() {
    return this.lastReflectionAnalysis?.reflectionSummary || null;
  }

  /**
   * Get explainability
   */
  static getExplainability() {
    return this.lastReflectionAnalysis?.explainability || null;
  }

  /**
   * Get overall reflection quality score
   */
  static getOverallReflectionQuality(): number {
    return this.lastReflectionAnalysis?.reflectionSummary.overallReflectionQuality || 0;
  }
}
