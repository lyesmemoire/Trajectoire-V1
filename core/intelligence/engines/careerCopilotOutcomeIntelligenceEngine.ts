import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { careerCopilotOutcomeIntelligenceV1 } from "../../ai/Prompts/career-copilot-outcome-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface OutcomeIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface RecommendationEffectiveness {
  recommendationType: string;
  effectiveness: number;
  observedImpact: string;
  timeToResult: string;
  realROI: string;
  successFrequency: number;
  failureFrequency: number;
  evidenceLevel: "strong" | "moderate" | "weak" | "very_weak" | "none";
  confidence: number;
  conditions: string[];
  lastUpdated: string;
}

export interface CandidatePattern {
  pattern: string;
  evidence: string;
  confidence: number;
  implications: string;
}

export interface TopPerformingAction {
  action: string;
  successRate: number;
  avgTimeToResult: string;
  evidenceCount: number;
  confidence: number;
}

export interface UnderperformingAction {
  action: string;
  successRate: number;
  avgTimeToResult: string;
  evidenceCount: number;
  confidence: number;
  recommendation: string;
}

export interface RecentLearning {
  learning: string;
  evidence: string;
  confidence: number;
  date: string;
}

export interface HypothesisStatus {
  hypothesis: string;
  status: "confirmed" | "inconclusive" | "rejected";
  evidence: string;
  confidence: number;
}

export interface RecommendationUpdate {
  recommendationType: string;
  priorityChange: "increase" | "decrease" | "maintain" | "abandon";
  reason: string;
  newConfidence: number;
}

export interface OutcomeIntelligenceOutput {
  recommendationEffectiveness: RecommendationEffectiveness[];
  candidatePatterns: CandidatePattern[];
  topPerformingActions: TopPerformingAction[];
  underperformingActions: UnderperformingAction[];
  recentLearnings: RecentLearning[];
  hypothesisStatus: HypothesisStatus[];
  recommendationUpdates: RecommendationUpdate[];
  summary: string;
  confidence: number;
  dataQuality: string;
  nextActions: string[];
}

export class CareerCopilotOutcomeIntelligenceEngine {
  private static lastOutcomeAnalysis: OutcomeIntelligenceOutput | null = null;
  private static outcomeHistory: Array<{
    timestamp: Date;
    event: string;
    output: OutcomeIntelligenceOutput;
  }> = [];

  /**
   * Track a recommendation and its outcome
   */
  static trackRecommendation({
    recommendationType,
    recommendation,
    timestamp,
    followed,
    outcome,
    effortInvested,
    timeToResult,
  }: {
    recommendationType: string;
    recommendation: string;
    timestamp: Date;
    followed: boolean;
    outcome: {
      atsScoreChange?: number;
      interviewRateChange?: number;
      responseRateChange?: number;
      hireOutcome?: boolean;
      noEffect?: boolean;
      negativeEffect?: boolean;
    };
    effortInvested: {
      hours: number;
      description: string;
    };
    timeToResult?: number; // days
  }) {
    const trackingData = {
      timestamp,
      recommendationType,
      recommendation,
      followed,
      outcome,
      effortInvested,
      timeToResult,
    };

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-outcome-intelligence",
      type: "general",
      data: trackingData,
      confidence: 1.0,
    });
  }

  /**
   * Extract recommendation history from Brain
   */
  private static extractRecommendationHistory(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-outcome-intelligence")
      .map(obs => obs.data as any)
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Extract outcome data from Brain
   */
  private static extractOutcomeData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-outcome-intelligence")
      .filter(obs => typeof obs.data === 'object' && obs.data !== null && 'followed' in obs.data && obs.data.followed)
      .map(obs => obs.data as any);
  }

  /**
   * Extract ATS score history from Brain
   */
  private static extractATSScores(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "ats-scoring")
      .map(obs => obs.data as any)
      .sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract application history from CandidateGraph
   */
  private static extractApplications(candidateGraph: any): any[] {
    return candidateGraph?.applications || [];
  }

  /**
   * Extract interview history from CandidateGraph
   */
  private static extractInterviews(candidateGraph: any): any[] {
    return candidateGraph?.interviews || [];
  }

  /**
   * Extract career score history from Brain
   */
  private static extractScores(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-engine")
      .map(obs => obs.data as any)
      .sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Calculate timeframes between recommendations and outcomes
   */
  private static calculateTimeframes(): any[] {
    const trackingData = this.extractRecommendationHistory();
    return trackingData
      .filter(item => item.followed && item.timeToResult)
      .map(item => ({
        recommendationType: item.recommendationType,
        timeToResult: item.timeToResult,
        timestamp: item.timestamp,
      }));
  }

  /**
   * Extract effort tracking data
   */
  private static extractEffortTracking(): any[] {
    const trackingData = this.extractRecommendationHistory();
    return trackingData
      .filter(item => item.followed)
      .map(item => ({
        recommendationType: item.recommendationType,
        effortInvested: item.effortInvested,
        timestamp: item.timestamp,
      }));
  }

  /**
   * Get previous outcome intelligence results
   */
  static getLastOutcomeAnalysis(): OutcomeIntelligenceOutput | null {
    return this.lastOutcomeAnalysis;
  }

  /**
   * Get outcome history
   */
  static getOutcomeHistory(): Array<{
    timestamp: Date;
    event: string;
    output: OutcomeIntelligenceOutput;
  }> {
    return this.outcomeHistory;
  }

  /**
   * Analyze outcome intelligence
   */
  static async analyzeOutcomeIntelligence(input: OutcomeIntelligenceInput): Promise<OutcomeIntelligenceOutput> {
    // Extract data from CandidateGraph and Brain
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      targetRole: input.candidateGraph.targetRole || "Non spécifié",
      experience: input.candidateGraph.experience || {},
      skills: input.candidateGraph.skills || [],
    };

    const recommendationHistory = this.extractRecommendationHistory();
    const outcomeData = this.extractOutcomeData();
    const atsScores = this.extractATSScores();
    const applications = this.extractApplications(input.candidateGraph);
    const interviews = this.extractInterviews(input.candidateGraph);
    const scores = this.extractScores();
    const timeframes = this.calculateTimeframes();
    const effortTracking = this.extractEffortTracking();
    const previousLearnings = this.lastOutcomeAnalysis?.recentLearnings || [];

    // Get constraint intelligence for constraint-aware outcome analysis
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

    // Get resource intelligence for resource-aware outcome analysis
    let resourceContext = null;
    try {
      const resourceIntelligence = CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis();
      if (resourceIntelligence) {
        resourceContext = {
          resourceSummary: resourceIntelligence.resourceSummary,
          availableResources: resourceIntelligence.resourcesByCategory.reduce((acc: Record<string, Array<{name: string, availability: number, unit: string, criticality: string}>>, cat) => {
            acc[cat.category] = cat.resources.map(r => ({ name: r.name, availability: r.availability, unit: r.unit, criticality: r.criticality }));
            return acc;
          }, {}),
          resourceOptimization: resourceIntelligence.resourceOptimization,
          resourceRecommendations: resourceIntelligence.resourceRecommendations,
          detectedChanges: resourceIntelligence.detectedChanges,
        };
      }
    } catch (error) {
      console.error("Failed to get resource intelligence:", error);
    }

    // Get knowledge evolution (simplified - Knowledge Evolution Engine removed)
    let knowledgeEvolutionContext = null;

    // Call intelligenceCoreModule with outcome intelligence prompt
    const promptTemplate = careerCopilotOutcomeIntelligenceV1.system || careerCopilotOutcomeIntelligenceV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase(promptTemplate);

    const request: IntelligenceRequest = {
      id: `outcome-intelligence-${Date.now()}`,
      type: "outcome-intelligence",
      input: {
        candidateProfile: JSON.stringify(candidateProfile, null, 2),
        recommendationHistory: JSON.stringify(recommendationHistory, null, 2),
        outcomeData: JSON.stringify(outcomeData, null, 2),
        atsScores: JSON.stringify(atsScores, null, 2),
        applications: JSON.stringify(applications, null, 2),
        interviews: JSON.stringify(interviews, null, 2),
        scores: JSON.stringify(scores, null, 2),
        timeframes: JSON.stringify(timeframes, null, 2),
        effortTracking: JSON.stringify(effortTracking, null, 2),
        previousLearnings: JSON.stringify(previousLearnings, null, 2),
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
        knowledgeEvolutionContext: JSON.stringify(knowledgeEvolutionContext, null, 2),
      },
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
      },
      options: {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error("Failed to analyze outcome intelligence");
    }

    const output: OutcomeIntelligenceOutput = result.output as OutcomeIntelligenceOutput;

    // Save outcome analysis to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-outcome-intelligence",
      type: "general",
      data: output,
      confidence: output.confidence / 100,
    });

    // Publish outcome analysis event to EventPublisher
    const eventPublisher = new EventPublisher();
    await eventPublisher.publish("observation_created", {
      id: `outcome-intelligence-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-outcome-intelligence",
        observationType: "general",
        data: output,
        confidence: output.confidence / 100,
      },
    });

    // Update last outcome analysis and history
    this.lastOutcomeAnalysis = output;
    this.outcomeHistory.push({
      timestamp: new Date(),
      event: input.currentEvent?.type || "manual_analysis",
      output,
    });

    // Keep only last 50 analyses in history
    if (this.outcomeHistory.length > 50) {
      this.outcomeHistory = this.outcomeHistory.slice(-50);
    }

    return output;
  }

  /**
   * Get effectiveness score for a specific recommendation type
   */
  static getRecommendationEffectiveness(recommendationType: string): {
    effectiveness: number;
    confidence: number;
    evidenceLevel: string;
  } {
    if (!this.lastOutcomeAnalysis) {
      return { effectiveness: 0.5, confidence: 0, evidenceLevel: "none" };
    }

    const effectiveness = this.lastOutcomeAnalysis.recommendationEffectiveness.find(
      e => e.recommendationType.toLowerCase().includes(recommendationType.toLowerCase())
    );

    if (!effectiveness) {
      return { effectiveness: 0.5, confidence: 0, evidenceLevel: "none" };
    }

    return {
      effectiveness: effectiveness.effectiveness,
      confidence: effectiveness.confidence,
      evidenceLevel: effectiveness.evidenceLevel,
    };
  }

  /**
   * Check if a recommendation type should be prioritized based on outcomes
   */
  static shouldPrioritizeRecommendation(recommendationType: string): boolean {
    const effectiveness = this.getRecommendationEffectiveness(recommendationType);
    
    // Prioritize if effectiveness > 0.6 and confidence > 50
    return effectiveness.effectiveness > 0.6 && effectiveness.confidence > 50;
  }

  /**
   * Check if a recommendation type should be deprioritized based on outcomes
   */
  static shouldDeprioritizeRecommendation(recommendationType: string): boolean {
    const effectiveness = this.getRecommendationEffectiveness(recommendationType);
    
    // Deprioritize if effectiveness < 0.4 and confidence > 40
    return effectiveness.effectiveness < 0.4 && effectiveness.confidence > 40;
  }

  /**
   * Get top performing actions for this candidate
   */
  static getTopPerformingActions(): TopPerformingAction[] {
    if (!this.lastOutcomeAnalysis) {
      return [];
    }
    return this.lastOutcomeAnalysis.topPerformingActions;
  }

  /**
   * Get underperforming actions for this candidate
   */
  static getUnderperformingActions(): UnderperformingAction[] {
    if (!this.lastOutcomeAnalysis) {
      return [];
    }
    return this.lastOutcomeAnalysis.underperformingActions;
  }

  /**
   * Get candidate-specific patterns
   */
  static getCandidatePatterns(): CandidatePattern[] {
    if (!this.lastOutcomeAnalysis) {
      return [];
    }
    return this.lastOutcomeAnalysis.candidatePatterns;
  }
}
