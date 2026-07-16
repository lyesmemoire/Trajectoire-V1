// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotEvidenceIntelligenceV1 } from "../../ai/Prompts/career-copilot-evidence-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";

export interface EvidenceIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface EvidenceIntelligenceOutput {
  evidenceSummary: {
    totalEvidence: number;
    strongEvidence: number;
    moderateEvidence: number;
    weakEvidence: number;
    insufficientEvidence: number;
    recentEvidence: number;
    obsoleteEvidence: number;
    criticalEvidence: number;
    candidateSpecificEvidence: number;
    generalEvidence: number;
  };
  evidenceByCategory: {
    directObservations: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    realResults: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    simulations: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    observedBehaviors: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    applications: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    interviews: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    atsAnalyses: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    userInteractions: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    marketTrends: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    achievedGoals: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    honoredCommitments: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    validatedScenarios: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    hypotheses: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
    inferences: {
      count: number;
      quality: string;
      freshness: string;
      stability: string;
    };
  };
  evidenceQualityDistribution: {
    veryStrong: number;
    strong: number;
    moderate: number;
    weak: number;
    insufficient: number;
  };
  evidenceFreshnessDistribution: {
    recent: number;
    stillValid: number;
    aging: number;
    obsolete: number;
  };
  evidenceStabilityDistribution: {
    confirmed: number;
    strengthened: number;
    weakened: number;
    contradicted: number;
    replaced: number;
  };
  evidenceImpact: {
    highImpactEvidence: Array<{
      id: string;
      description: string;
      category: string;
      quality: string;
      freshness: string;
      stability: string;
      dependentAnalyses: string[];
      dependentRecommendations: string[];
      dependentGoals: string[];
      dependentStrategies: string[];
      dependentForecasts: string[];
    }>;
    mediumImpactEvidence: Array<{
      id: string;
      description: string;
      category: string;
      quality: string;
      freshness: string;
      stability: string;
      dependentAnalyses: string[];
      dependentRecommendations: string[];
    }>;
    lowImpactEvidence: Array<{
      id: string;
      description: string;
      category: string;
      quality: string;
      freshness: string;
      stability: string;
      dependentAnalyses: string[];
    }>;
  };
  detectedIssues: {
    missingEvidence: Array<{
      conclusion: string;
      requiredEvidence: string[];
      impact: string;
      severity: "high" | "medium" | "low";
    }>;
    contradictoryEvidence: Array<{
      evidence1: string;
      evidence2: string;
      conflict: string;
      resolution: string;
      severity: "high" | "medium" | "low";
    }>;
    insufficientEvidence: Array<{
      conclusion: string;
      currentEvidence: string[];
      neededEvidence: string[];
      severity: "high" | "medium" | "low";
    }>;
    obsoleteEvidence: Array<{
      evidence: string;
      age: string;
      replacementNeeded: string;
      severity: "high" | "medium" | "low";
    }>;
    recentlyConfirmed: Array<{
      evidence: string;
      confirmationDate: string;
      impact: string;
    }>;
    becameCritical: Array<{
      evidence: string;
      reason: string;
      impact: string;
    }>;
  };
  evidenceEvolution: {
    newEvidence: Array<{
      id: string;
      description: string;
      category: string;
      dateAdded: string;
      impact: string;
    }>;
    strengthenedEvidence: Array<{
      id: string;
      description: string;
      previousQuality: string;
      currentQuality: string;
      reason: string;
    }>;
    weakenedEvidence: Array<{
      id: string;
      description: string;
      previousQuality: string;
      currentQuality: string;
      reason: string;
    }>;
    contradictedEvidence: Array<{
      id: string;
      description: string;
      contradictingEvidence: string;
      impact: string;
    }>;
    replacedEvidence: Array<{
      id: string;
      description: string;
      replacement: string;
      reason: string;
    }>;
    conclusionsChanged: Array<{
      conclusion: string;
      previousState: string;
      currentState: string;
      triggeringEvidence: string;
      impact: string;
    }>;
  };
  confidenceMapping: {
    overallConfidence: number;
    confidenceByEvidence: Array<{
      conclusion: string;
      supportingEvidence: string[];
      evidenceQuality: string;
      calculatedConfidence: number;
      confidenceExplanation: string;
    }>;
    confidenceGaps: Array<{
      conclusion: string;
      currentConfidence: number;
      targetConfidence: number;
      missingEvidence: string[];
      recommendedActions: string[];
    }>;
  };
  candidateSpecificEvidence: {
    totalCandidateSpecific: number;
    totalGeneral: number;
    specificityRatio: number;
    candidateSpecificByCategory: {
      directObservations: number;
      realResults: number;
      observedBehaviors: number;
      applications: number;
      interviews: number;
      userInteractions: number;
      achievedGoals: number;
      honoredCommitments: number;
    };
    generalEvidenceByCategory: {
      marketTrends: number;
      simulations: number;
      atsAnalyses: number;
      inferences: number;
      hypotheses: number;
    };
  };
  missionEvidence: {
    currentMissionEvidence: Array<{
      milestone: string;
      supportingEvidence: string[];
      evidenceQuality: string;
      progressionStatus: string;
      confidence: number;
    }>;
    missionProbabilityEvidence: {
      successProbability: number;
      supportingEvidence: string[];
      evidenceQuality: string;
      confidence: number;
    };
    phaseTransitionEvidence: {
      phase: string;
      transitionCriteria: string[];
      criteriaEvidence: Array<{
        criterion: string;
        evidence: string[];
        met: boolean;
        confidence: number;
      }>;
      canTransition: boolean;
      confidence: number;
    };
  };
  evidenceRecommendations: {
    evidenceToCollect: Array<{
      evidence: string;
      priority: "high" | "medium" | "low";
      reason: string;
      impact: string;
    }>;
    evidenceToValidate: Array<{
      evidence: string;
      currentStatus: string;
      validationMethod: string;
      priority: string;
    }>;
    evidenceToRefresh: Array<{
      evidence: string;
      age: string;
      refreshMethod: string;
      priority: string;
    }>;
    evidenceToReplace: Array<{
      evidence: string;
      replacement: string;
      reason: string;
      priority: string;
    }>;
  };
  explainability: {
    whyThisEvidence: string;
    whyThisQuality: string;
    whyThisFreshness: string;
    whyThisStability: string;
    observationsUsed: string[];
    assumptions: string[];
    confidence: number;
    limitations: string[];
  };
  globalQuality: {
    overallEvidenceQuality: "very_strong" | "strong" | "moderate" | "weak" | "insufficient";
    overallFreshness: "recent" | "still_valid" | "aging" | "obsolete";
    overallStability: "confirmed" | "strengthened" | "weakened" | "contradicted";
    overallConfidence: number;
    evidenceCoverage: number;
    evidenceConsistency: number;
  };
  confidence: number;
  evidenceLevel: "none" | "very_weak" | "weak" | "moderate" | "strong" | "very_strong";
  dataQuality: number;
}

/**
 * Evidence Intelligence Engine
 *
 * Identifies, tracks, and evaluates the evidence that supports every conclusion,
 * recommendation, score, strategy, forecast, and decision in the system.
 * Builds a logical evidence graph without creating a new technical graph structure.
 */
export class CareerCopilotEvidenceIntelligenceEngine {
  private static lastEvidenceAnalysis: EvidenceIntelligenceOutput | null = null;
  private static evidenceHistory: Array<{
    timestamp: Date;
    event: string;
    output: EvidenceIntelligenceOutput;
  }> = [];

  /**
   * Track evidence evolution
   */
  static trackEvidenceEvolution({
    evidenceId,
    evidenceType,
    previousQuality,
    currentQuality,
    reason,
  }: {
    evidenceId: string;
    evidenceType: string;
    previousQuality?: string;
    currentQuality?: string;
    reason: string;
  }) {
    const trackingData = {
      timestamp: new Date(),
      evidenceId,
      evidenceType,
      previousQuality,
      currentQuality,
      reason,
    };

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-evidence-intelligence",
      type: "general",
      data: trackingData,
      confidence: 1.0,
    });
  }

  /**
   * Extract all observations from Brain
   */
  private static extractAllObservations(): any[] {
    return candidateAIBrain.getObservations()
      .map(obs => ({
        id: obs.id,
        timestamp: obs.timestamp,
        source: obs.source,
        type: obs.type,
        data: obs.data,
        confidence: obs.confidence,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract evidence history from Brain
   */
  private static extractEvidenceHistory(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-evidence-intelligence")
      .map(obs => (obs.data as any))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Extract conclusions and recommendations from Brain
   */
  private static extractConclusionsAndRecommendations(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source.includes("intelligence") || obs.source.includes("engine"))
      .map(obs => ({
        source: obs.source,
        type: obs.type,
        data: obs.data,
        timestamp: obs.timestamp,
        confidence: obs.confidence,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract analysis results from Brain
   */
  private static extractAnalysisResults(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source.includes("intelligence"))
      .map(obs => ({
        source: obs.source,
        type: obs.type,
        data: obs.data,
        timestamp: obs.timestamp,
        confidence: obs.confidence,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract outcome data from Brain
   */
  private static extractOutcomeData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-outcome-intelligence")
      .map(obs => ({
        topPerformingActions: (obs.data as any)?.topPerformingActions || [],
        underperformingActions: (obs.data as any)?.underperformingActions || [],
        recentLearnings: (obs.data as any)?.recentLearnings || [],
        timestamp: obs.timestamp,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract mission data from Brain
   */
  private static extractMissionData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-mission-intelligence")
      .map(obs => ({
        mission: (obs.data as any)?.mission,
        phases: (obs.data as any)?.phases,
        progression: (obs.data as any)?.progression,
        missionProbability: (obs.data as any)?.missionProbability,
        timestamp: obs.timestamp,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract personalization data from Brain
   */
  private static extractPersonalizationData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-personalization-intelligence")
      .map(obs => ({
        learningProfile: (obs.data as any)?.learningProfile,
        coachingStyle: (obs.data as any)?.currentCoachingStyle,
        adaptationRecommendations: (obs.data as any)?.adaptationRecommendations,
        timestamp: obs.timestamp,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Analyze evidence intelligence
   */
  static async analyzeEvidenceIntelligence(
    input: EvidenceIntelligenceInput
  ): Promise<EvidenceIntelligenceOutput> {
    // Extract candidate profile from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      careerLevel: input.candidateGraph.career?.level || "unknown",
      goals: input.candidateGraph.goals || [],
      skills: input.candidateGraph.skills || [],
      experience: input.candidateGraph.experience || [],
    };

    // Extract data from Brain
    const allObservations = this.extractAllObservations();
    const evidenceHistory = this.extractEvidenceHistory();
    const conclusionsAndRecommendations = this.extractConclusionsAndRecommendations();
    const analysisResults = this.extractAnalysisResults();
    const outcomeData = this.extractOutcomeData();
    const missionData = this.extractMissionData();
    const personalizationData = this.extractPersonalizationData();

    // Get previous evidence analysis
    const previousEvidenceAnalysis = this.lastEvidenceAnalysis;

    // Get constraint intelligence for constraint-aware evidence analysis
    let constraintContext = null;
    try {
      const constraintIntelligence = CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis();
      if (constraintIntelligence) {
        constraintContext = {
          activeConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.active).map(con => con.name)),
          criticalConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.strength === "strong" && !con.negotiable).map(con => con.name)),
          constraintImpact: constraintIntelligence.constraintImpact,
          constraintRecommendations: constraintIntelligence.constraintRecommendations,
          detectedChanges: constraintIntelligence.detectedChanges,
        };
      }
    } catch (error) {
      console.error("Failed to get constraint intelligence:", error);
    }

    // Get resource intelligence for resource-aware evidence analysis
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

    // Get knowledge evolution for knowledge-aware evidence analysis
    let knowledgeEvolutionContext = null;
    try {
      const knowledgeEvolution = CareerCopilotKnowledgeEvolutionEngine.getLastKnowledgeEvolution();
      if (knowledgeEvolution) {
        knowledgeEvolutionContext = {
          knowledgeSummary: knowledgeEvolution.knowledgeSummary,
          certainKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "confirmed")?.knowledgeItems.map(k => ({
            description: k.description,
            confidence: k.confidence.current,
            evidence: k.evidence.supportingCount,
          })) || [],
          obsoleteKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "obsolete")?.knowledgeItems.map(k => ({
            description: k.description,
            reason: k.reasonForState,
          })) || [],
          knowledgeHealthScore: knowledgeEvolution.knowledgeSummary.healthScore,
        };
      }
    } catch (error) {
      console.error("Failed to get knowledge evolution:", error);
    }

    // Call AI Orchestrator with evidence intelligence prompt
    const result = await aiOrchestrator.execute(
      careerCopilotEvidenceIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile, null, 2),
        allObservations: JSON.stringify(allObservations, null, 2),
        evidenceHistory: JSON.stringify(evidenceHistory, null, 2),
        conclusionsAndRecommendations: JSON.stringify(conclusionsAndRecommendations, null, 2),
        analysisResults: JSON.stringify(analysisResults, null, 2),
        outcomeData: JSON.stringify(outcomeData, null, 2),
        missionData: JSON.stringify(missionData, null, 2),
        personalizationData: JSON.stringify(personalizationData, null, 2),
        previousEvidenceAnalysis: JSON.stringify(previousEvidenceAnalysis, null, 2),
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
        knowledgeEvolutionContext: JSON.stringify(knowledgeEvolutionContext, null, 2),
      },
      {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        promptId: "career-copilot-evidence-intelligence-v1",
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to analyze evidence intelligence");
    }

    const output: EvidenceIntelligenceOutput = result.data as EvidenceIntelligenceOutput;

    // Save evidence analysis to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-evidence-intelligence",
      type: "general",
      data: output,
      confidence: output.confidence / 100,
    });

    // Publish evidence analysis event to EventBus
    eventBus.publish({
      id: `evidence-intelligence-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-evidence-intelligence",
        observationType: "general",
        data: output,
        confidence: output.confidence / 100,
      },
    });

    // Update last evidence analysis and history
    this.lastEvidenceAnalysis = output;
    this.evidenceHistory.push({
      timestamp: new Date(),
      event: input.currentEvent?.type || "manual_analysis",
      output,
    });

    // Keep only last 50 analyses in history
    if (this.evidenceHistory.length > 50) {
      this.evidenceHistory = this.evidenceHistory.slice(-50);
    }

    return output;
  }

  /**
   * Get evidence summary
   */
  static getEvidenceSummary(): EvidenceIntelligenceOutput["evidenceSummary"] | null {
    return this.lastEvidenceAnalysis?.evidenceSummary || null;
  }

  /**
   * Get evidence by category
   */
  static getEvidenceByCategory(): EvidenceIntelligenceOutput["evidenceByCategory"] | null {
    return this.lastEvidenceAnalysis?.evidenceByCategory || null;
  }

  /**
   * Get detected issues
   */
  static getDetectedIssues(): EvidenceIntelligenceOutput["detectedIssues"] | null {
    return this.lastEvidenceAnalysis?.detectedIssues || null;
  }

  /**
   * Get evidence evolution
   */
  static getEvidenceEvolution(): EvidenceIntelligenceOutput["evidenceEvolution"] | null {
    return this.lastEvidenceAnalysis?.evidenceEvolution || null;
  }

  /**
   * Get confidence mapping
   */
  static getConfidenceMapping(): EvidenceIntelligenceOutput["confidenceMapping"] | null {
    return this.lastEvidenceAnalysis?.confidenceMapping || null;
  }

  /**
   * Get candidate-specific evidence
   */
  static getCandidateSpecificEvidence(): EvidenceIntelligenceOutput["candidateSpecificEvidence"] | null {
    return this.lastEvidenceAnalysis?.candidateSpecificEvidence || null;
  }

  /**
   * Get mission evidence
   */
  static getMissionEvidence(): EvidenceIntelligenceOutput["missionEvidence"] | null {
    return this.lastEvidenceAnalysis?.missionEvidence || null;
  }

  /**
   * Get evidence recommendations
   */
  static getEvidenceRecommendations(): EvidenceIntelligenceOutput["evidenceRecommendations"] | null {
    return this.lastEvidenceAnalysis?.evidenceRecommendations || null;
  }

  /**
   * Get global quality
   */
  static getGlobalQuality(): EvidenceIntelligenceOutput["globalQuality"] | null {
    return this.lastEvidenceAnalysis?.globalQuality || null;
  }

  /**
   * Get last evidence analysis
   */
  static getLastEvidenceAnalysis(): EvidenceIntelligenceOutput | null {
    return this.lastEvidenceAnalysis;
  }

  /**
   * Get evidence history
   */
  static getEvidenceHistory(): Array<{
    timestamp: Date;
    event: string;
    output: EvidenceIntelligenceOutput;
  }> {
    return this.evidenceHistory;
  }

  /**
   * Get explainability
   */
  static getExplainability(): EvidenceIntelligenceOutput["explainability"] | null {
    return this.lastEvidenceAnalysis?.explainability || null;
  }
}
