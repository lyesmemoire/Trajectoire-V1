// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotReflectionIntelligenceV1 } from "../../ai/Prompts/career-copilot-reflection-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotCareerNarrativeIntelligenceEngine } from "./careerCopilotCareerNarrativeIntelligenceEngine";
import { CareerCopilotEvidenceIntelligenceEngine } from "./careerCopilotEvidenceIntelligenceEngine";
import { CareerCopilotMissionIntelligenceEngine } from "./careerCopilotMissionIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
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

    // Get context from other intelligences for reflection
    let careerNarrativeContext = null;
    try {
      const careerNarrative = CareerCopilotCareerNarrativeIntelligenceEngine.getLastNarrativeAnalysis();
      if (careerNarrative) {
        careerNarrativeContext = {
          careerIdentity: careerNarrative.careerIdentity,
          careerThemes: careerNarrative.careerThemes,
          careerStory: careerNarrative.careerStory,
          confidence: careerNarrative.confidence,
        };
      }
    } catch (error) {
      console.error("Failed to get career narrative context (non-critical):", error);
    }

    let decisionContext = null;
    try {
      const decisionObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-decision-intelligence")
        .slice(-1);
      if (decisionObs.length > 0 && decisionObs[0]) {
        const decisionData = decisionObs[0].data as any;
        decisionContext = {
          recentDecisions: decisionData.recentDecisions,
          decisionPatterns: decisionData.decisionPatterns,
          decisionQuality: decisionData.decisionQuality,
        };
      }
    } catch (error) {
      console.error("Failed to get decision intelligence context (non-critical):", error);
    }

    let forecastContext = null;
    try {
      const scenarioObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-scenario-intelligence")
        .slice(-1);
      if (scenarioObs.length > 0 && scenarioObs[0]) {
        const scenarioData = scenarioObs[0].data as any;
        forecastContext = {
          currentTrajectory: scenarioData.currentTrajectory,
          probableFuture: scenarioData.probableFuture,
          successProbability: scenarioData.successProbability,
        };
      }
    } catch (error) {
      console.error("Failed to get forecast intelligence context (non-critical):", error);
    }

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

    let knowledgeEvolutionContext = null;
    try {
      const knowledgeEvolution = CareerCopilotKnowledgeEvolutionEngine.getLastKnowledgeEvolution();
      if (knowledgeEvolution) {
        knowledgeEvolutionContext = {
          knowledgeSummary: knowledgeEvolution.knowledgeSummary,
          certainKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "confirmed")?.knowledgeItems.map(k => ({
            description: k.description,
            confidence: k.confidence.current,
          })) || [],
          knowledgeHealthScore: knowledgeEvolution.knowledgeSummary.healthScore,
        };
      }
    } catch (error) {
      console.error("Failed to get knowledge evolution context (non-critical):", error);
    }

    let outcomeContext = null;
    try {
      const outcomeObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-outcome-intelligence")
        .slice(-1);
      if (outcomeObs.length > 0 && outcomeObs[0]) {
        const outcomeData = outcomeObs[0].data as any;
        outcomeContext = {
          recentOutcomes: outcomeData.recentOutcomes,
          outcomePatterns: outcomeData.outcomePatterns,
          successRate: outcomeData.successRate,
        };
      }
    } catch (error) {
      console.error("Failed to get outcome intelligence context (non-critical):", error);
    }

    let opportunityContext = null;
    try {
      const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
      if (opportunityIntelligence) {
        opportunityContext = {
          priorityOpportunity: opportunityIntelligence.priorityOpportunity,
          opportunitiesToPrepare: opportunityIntelligence.opportunitiesToPrepare,
        };
      }
    } catch (error) {
      console.error("Failed to get opportunity intelligence context (non-critical):", error);
    }

    let successContext = null;
    try {
      const successObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-success-intelligence")
        .slice(-1);
      if (successObs.length > 0 && successObs[0]) {
        const successData = successObs[0].data as any;
        successContext = {
          successFactors: successData.successFactors,
          successPatterns: successData.successPatterns,
          successPredictors: successData.successPredictors,
        };
      }
    } catch (error) {
      console.error("Failed to get success intelligence context (non-critical):", error);
    }

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
          availableResources: resourceIntelligence.resourcesByCategory.reduce((acc, cat) => {
            acc[cat.category] = cat.resources.map(r => ({ name: r.name, availability: r.availability }));
            return acc;
          }, {} as Record<string, any>),
        };
      }
    } catch (error) {
      console.error("Failed to get resource intelligence context (non-critical):", error);
    }

    let goalContext = null;
    try {
      const goalObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-goal-intelligence")
        .slice(-1);
      if (goalObs.length > 0 && goalObs[0]) {
        const goalData = goalObs[0].data as any;
        goalContext = {
          primaryGoal: goalData.primaryGoal,
          goalProgress: goalData.goalProgress,
          goalAlignment: goalData.goalAlignment,
        };
      }
    } catch (error) {
      console.error("Failed to get goal intelligence context (non-critical):", error);
    }

    let confidenceContext = null;
    try {
      const confidenceObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-confidence-intelligence")
        .slice(-1);
      if (confidenceObs.length > 0 && confidenceObs[0]) {
        const confidenceData = confidenceObs[0].data as any;
        confidenceContext = {
          overallConfidence: confidenceData.overallConfidence,
          confidenceByArea: confidenceData.confidenceByArea,
          confidenceTrends: confidenceData.confidenceTrends,
        };
      }
    } catch (error) {
      console.error("Failed to get confidence intelligence context (non-critical):", error);
    }

    let metaContext = null;
    try {
      const metaObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-meta-intelligence")
        .slice(-1);
      if (metaObs.length > 0 && metaObs[0]) {
        const metaData = metaObs[0].data as any;
        metaContext = {
          systemHealth: metaData.systemHealth,
          intelligenceSynergy: metaData.intelligenceSynergy,
          overallSystemConfidence: metaData.overallSystemConfidence,
        };
      }
    } catch (error) {
      console.error("Failed to get meta intelligence context (non-critical):", error);
    }

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
    try {
      const conversationObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-conversation")
        .slice(-5);
      if (conversationObs.length > 0) {
        conversationContext = {
          recentConversations: conversationObs.map(obs => ({
            question: (obs.data as any).question,
            response: (obs.data as any).response,
            timestamp: obs.timestamp,
          })),
        };
      }
    } catch (error) {
      console.error("Failed to get conversation context (non-critical):", error);
    }

    // Call AI Orchestrator with reflection intelligence prompt
    const result = await aiOrchestrator.execute(
      careerCopilotReflectionIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile, null, 2),
        careerTimeline: careerTimelineText,
        skillsEvolution: skillsEvolutionText,
        achievements: achievementsText,
        goals: goalsText,
        careerNarrativeIntelligence: JSON.stringify(careerNarrativeContext, null, 2),
        decisionIntelligence: JSON.stringify(decisionContext, null, 2),
        forecastIntelligence: JSON.stringify(forecastContext, null, 2),
        evidenceIntelligence: JSON.stringify(evidenceContext, null, 2),
        missionIntelligence: JSON.stringify(missionContext, null, 2),
        knowledgeEvolution: JSON.stringify(knowledgeEvolutionContext, null, 2),
        scenarioIntelligence: JSON.stringify(forecastContext, null, 2),
        outcomeIntelligence: JSON.stringify(outcomeContext, null, 2),
        opportunityIntelligence: JSON.stringify(opportunityContext, null, 2),
        successIntelligence: JSON.stringify(successContext, null, 2),
        constraintIntelligence: JSON.stringify(constraintContext, null, 2),
        resourceIntelligence: JSON.stringify(resourceContext, null, 2),
        goalIntelligence: JSON.stringify(goalContext, null, 2),
        confidenceIntelligence: JSON.stringify(confidenceContext, null, 2),
        metaIntelligence: JSON.stringify(metaContext, null, 2),
        applicationIntelligence: JSON.stringify(applicationContext, null, 2),
        conversationIntelligence: JSON.stringify(conversationContext, null, 2),
      },
      {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        promptId: "career-copilot-reflection-intelligence-v1",
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to perform reflection");
    }

    const output: ReflectionOutput = result.data as ReflectionOutput;

    // Save reflection analysis to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-reflection-intelligence",
      type: "career",
      data: output,
      confidence: output.confidenceCalibration.overallConfidence / 100,
    });

    // Publish reflection events to EventBus
    eventBus.publish({
      id: `reflection-completed-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-reflection-intelligence",
        observationType: "career",
        data: {
          reflectionSummary: output.reflectionSummary,
          overallQuality: output.reflectionSummary.overallReflectionQuality,
        },
        confidence: output.reflectionSummary.overallReflectionQuality / 100,
      },
    });

    if (output.recommendationReview.recommendations.some(r => r.improvementSuggestion)) {
      eventBus.publish({
        id: `recommendation-improved-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-reflection-intelligence",
          observationType: "career",
          data: {
            improvedRecommendations: output.recommendationReview.recommendations.filter(r => r.improvementSuggestion),
          },
          confidence: 0.8,
        },
      });
    }

    if (output.blindSpotDetection.blindSpots.length > 0) {
      eventBus.publish({
        id: `blind-spot-detected-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-reflection-intelligence",
          observationType: "career",
          data: {
            blindSpots: output.blindSpotDetection.blindSpots,
            priorityBlindSpots: output.blindSpotDetection.priorityBlindSpots,
          },
          confidence: 0.7,
        },
      });
    }

    if (output.alternativeAnalysis.alternatives.length > 0) {
      eventBus.publish({
        id: `alternative-generated-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-reflection-intelligence",
          observationType: "career",
          data: {
            alternatives: output.alternativeAnalysis.alternatives,
            preferredChoice: output.alternativeAnalysis.preferredChoice,
          },
          confidence: 0.8,
        },
      });
    }

    if (output.confidenceCalibration.calibrations.length > 0) {
      eventBus.publish({
        id: `confidence-recalibrated-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-reflection-intelligence",
          observationType: "career",
          data: {
            calibrations: output.confidenceCalibration.calibrations,
            overallConfidence: output.confidenceCalibration.overallConfidence,
          },
          confidence: 0.9,
        },
      });
    }

    if (output.evidenceReview.conclusions.some(c => c.needsStrengthening)) {
      eventBus.publish({
        id: `evidence-strengthened-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-reflection-intelligence",
          observationType: "career",
          data: {
            conclusionsNeedingStrengthening: output.evidenceReview.conclusions.filter(c => c.needsStrengthening),
            overallEvidenceQuality: output.evidenceReview.overallEvidenceQuality,
          },
          confidence: 0.8,
        },
      });
    }

    eventBus.publish({
      id: `reflection-updated-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-reflection-intelligence",
        observationType: "career",
        data: {
          reflectionSummary: output.reflectionSummary,
          explainability: output.explainability,
        },
        confidence: output.explainability.finalConfidence / 100,
      },
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
