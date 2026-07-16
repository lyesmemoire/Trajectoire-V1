// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotMissionIntelligenceV1 } from "../../ai/Prompts/career-copilot-mission-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";

export interface MissionIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface MissionIntelligenceOutput {
  mission: {
    id: string;
    title: string;
    description: string;
    successCriteria: string[];
    targetTimeline: {
      startDate: string;
      endDate: string;
      durationWeeks: number;
    };
    priority: "primary" | "secondary" | "tertiary";
    status: "not_started" | "in_progress" | "paused" | "completed" | "cancelled";
    createdAt: string;
    updatedAt: string;
  };
  phases: Array<{
    id: string;
    name: "preparation" | "skill_building" | "profile_optimization" | "applications" | "interviews" | "negotiation" | "integration";
    title: string;
    description: string;
    entryCriteria: string[];
    exitCriteria: string[];
    successIndicators: string[];
    risks: string[];
    dependencies: string[];
    status: "not_started" | "in_progress" | "completed" | "skipped";
    startDate: string;
    endDate: string;
    progress: number;
    estimatedDuration: string;
  }>;
  currentPhase: {
    phaseId: string;
    phaseName: string;
    progress: number;
    timeElapsed: string;
    timeRemaining: string;
    entryCriteriaMet: boolean;
    exitCriteriaMet: boolean;
    blockingIssues: string[];
  };
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    phaseId: string;
    targetDate: string;
    status: "not_started" | "in_progress" | "completed" | "missed" | "delayed";
    completedDate: string | null;
    progress: number;
  }>;
  progression: {
    overallProgress: number;
    phaseProgress: number;
    milestonesAchieved: number;
    milestonesTotal: number;
    timeElapsed: string;
    timeRemaining: string;
    progressVelocity: "ahead_of_schedule" | "on_schedule" | "behind_schedule" | "stalled";
  };
  deviations: {
    detected: boolean;
    type: "behind_schedule" | "ahead_of_schedule" | "off_trajectory" | "stalled" | "none";
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    impact: string;
    recommendedActions: string[];
  };
  risks: {
    missionLevel: string[];
    phaseLevel: string[];
    milestoneLevel: string[];
    topRisks: string[];
    mitigationStrategies: string[];
  };
  recalibration: {
    needed: boolean;
    type: "timeline_adjustment" | "reprioritization" | "phase_resequence" | "mission_revision" | "none";
    reasoning: string;
    recommendedChanges?: {
      newEndDate?: string;
      phaseAdjustments?: Array<{
        phaseId: string;
        newEndDate?: string;
        priorityChange?: string;
      }>;
      addedSteps?: string[];
      removedSteps?: string[];
    };
    expectedImpact: string;
    confidence: number;
  };
  missionProbability: {
    successProbability: number;
    onTimeProbability: number;
    factors: {
      positive: string[];
      negative: string[];
      neutral: string[];
    };
    confidence: number;
    evidence: string[];
  };
  explainability: {
    whyThisMission: string;
    whyCurrentPhase: string;
    whyThesePhases: string;
    whyThisTimeline: string;
    observationsUsed: string[];
    assumptions: string[];
    confidence: number;
    limitations: string[];
  };
  secondaryMissions: Array<{
    id: string;
    title: string;
    status: "active" | "suspended" | "completed";
    reason: string;
    priority: string;
  }>;
  adjustmentHistory: Array<{
    date: string;
    type: string;
    reason: string;
    changes: string[];
  }>;
  confidence: number;
  evidenceLevel: "none" | "very_weak" | "weak" | "moderate" | "strong" | "very_strong";
  dataQuality: number;
}

/**
 * Career Mission Intelligence Engine
 *
 * Pilots complete career missions from start to finish.
 * Breaks down missions into phases, tracks progression, detects deviations,
 * and recalibrates strategy when needed.
 */
export class CareerCopilotMissionIntelligenceEngine {
  private static lastMissionAnalysis: MissionIntelligenceOutput | null = null;
  private static missionHistory: Array<{
    timestamp: Date;
    event: string;
    output: MissionIntelligenceOutput;
  }> = [];

  /**
   * Track mission progress and phase transitions
   */
  static trackMissionProgress({
    missionId,
    phaseId,
    milestoneId,
    progress,
    status,
    notes,
  }: {
    missionId: string;
    phaseId?: string;
    milestoneId?: string;
    progress: number;
    status: string;
    notes?: string;
  }) {
    const trackingData = {
      timestamp: new Date(),
      missionId,
      phaseId,
      milestoneId,
      progress,
      status,
      notes,
    };

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-mission-intelligence",
      type: "general",
      data: trackingData,
      confidence: 1.0,
    });
  }

  /**
   * Extract mission history from Brain
   */
  private static extractMissionHistory(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-mission-intelligence")
      .map(obs => (obs.data as any))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Extract progression data from Brain
   */
  private static extractProgressionData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-mission-intelligence")
      .map(obs => ({
        missionId: (obs.data as any)?.missionId,
        progress: (obs.data as any)?.progress,
        status: (obs.data as any)?.status,
        timestamp: obs.timestamp,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract phase completion data from Brain
   */
  private static extractPhaseCompletionData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-mission-intelligence")
      .filter(obs => (obs.data as any)?.phaseId)
      .map(obs => ({
        phaseId: (obs.data as any)?.phaseId,
        progress: (obs.data as any)?.progress,
        status: (obs.data as any)?.status,
        timestamp: obs.timestamp,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract milestone data from Brain
   */
  private static extractMilestoneData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-mission-intelligence")
      .filter(obs => (obs.data as any)?.milestoneId)
      .map(obs => ({
        milestoneId: (obs.data as any)?.milestoneId,
        progress: (obs.data as any)?.progress,
        status: (obs.data as any)?.status,
        timestamp: obs.timestamp,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract risk indicators from Brain
   */
  private static extractRiskIndicators(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-success-intelligence" || obs.source === "career-copilot-forecast")
      .map(obs => ({
        type: obs.source,
        risks: (obs.data as any)?.risks || [],
        concerns: (obs.data as any)?.concerns || [],
        timestamp: obs.timestamp,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Extract application campaign data from Brain
   */
  private static extractApplicationCampaignData(): any[] {
    return candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-application-intelligence")
      .map(obs => ({
        applications: (obs.data as any)?.applications || [],
        responseRate: (obs.data as any)?.responseRate,
        interviewRate: (obs.data as any)?.interviewRate,
        timestamp: obs.timestamp,
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
   * Analyze mission intelligence
   */
  static async analyzeMissionIntelligence(
    input: MissionIntelligenceInput
  ): Promise<MissionIntelligenceOutput> {
    // Extract candidate profile from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      careerLevel: input.candidateGraph.career?.level || "unknown",
      goals: input.candidateGraph.goals || [],
      skills: input.candidateGraph.skills || [],
      experience: input.candidateGraph.experience || [],
    };

    // Extract current mission from CandidateGraph
    const currentMission = input.candidateGraph.currentMission || {
      id: "mission-1",
      title: "Définir une mission de carrière",
      description: "Aucune mission active définie",
      successCriteria: [],
      targetTimeline: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        durationWeeks: 12,
      },
      priority: "primary",
      status: "not_started",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Extract data from Brain
    const missionHistory = this.extractMissionHistory();
    const progressionData = this.extractProgressionData();
    const phaseCompletionData = this.extractPhaseCompletionData();
    const milestoneData = this.extractMilestoneData();
    const riskIndicators = this.extractRiskIndicators();
    const applicationCampaignData = this.extractApplicationCampaignData();
    const outcomeData = this.extractOutcomeData();

    // Get constraint intelligence for constraint-aware mission planning
    let constraintContext = null;
    try {
      const constraintIntelligence = CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis();
      if (constraintIntelligence) {
        constraintContext = {
          activeConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.active).map(con => con.name)),
          criticalConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.strength === "strong" && !con.negotiable).map(con => con.name)),
          constraintImpact: constraintIntelligence.constraintImpact,
          constraintRecommendations: constraintIntelligence.constraintRecommendations,
          constraintAdaptations: constraintIntelligence.adaptations,
        };
      }
    } catch (error) {
      console.error("Failed to get constraint intelligence:", error);
    }

    // Get resource intelligence for resource-aware mission planning
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
          resourceEvaluation: resourceIntelligence.resourceEvaluation,
        };
      }
    } catch (error) {
      console.error("Failed to get resource intelligence:", error);
    }

    // Get knowledge evolution for knowledge-aware mission planning
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
          uncertainKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "very_uncertain")?.knowledgeItems.map(k => ({
            description: k.description,
            confidence: k.confidence.current,
          })) || [],
          knowledgeHealthScore: knowledgeEvolution.knowledgeSummary.healthScore,
        };
      }
    } catch (error) {
      console.error("Failed to get knowledge evolution:", error);
    }

    // Get market conditions from CandidateGraph
    const marketConditions = input.candidateGraph.marketConditions || {};

    // Get opportunity landscape from CandidateGraph
    const opportunityLandscape = input.candidateGraph.opportunities || [];

    // Get previous mission analysis
    const previousMissionAnalysis = this.lastMissionAnalysis;

    // Call AI Orchestrator with mission intelligence prompt
    const result = await aiOrchestrator.execute(
      careerCopilotMissionIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile, null, 2),
        currentMission: JSON.stringify(currentMission, null, 2),
        missionHistory: JSON.stringify(missionHistory, null, 2),
        progressionData: JSON.stringify(progressionData, null, 2),
        phaseCompletionData: JSON.stringify(phaseCompletionData, null, 2),
        milestoneData: JSON.stringify(milestoneData, null, 2),
        riskIndicators: JSON.stringify(riskIndicators, null, 2),
        marketConditions: JSON.stringify(marketConditions, null, 2),
        opportunityLandscape: JSON.stringify(opportunityLandscape, null, 2),
        applicationCampaignData: JSON.stringify(applicationCampaignData, null, 2),
        outcomeData: JSON.stringify(outcomeData, null, 2),
        previousMissionAnalysis: JSON.stringify(previousMissionAnalysis, null, 2),
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
        knowledgeEvolutionContext: JSON.stringify(knowledgeEvolutionContext, null, 2),
      },
      {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        promptId: "career-copilot-mission-intelligence-v1",
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to analyze mission intelligence");
    }

    const output: MissionIntelligenceOutput = result.data as MissionIntelligenceOutput;

    // Save mission analysis to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-mission-intelligence",
      type: "general",
      data: output,
      confidence: output.confidence / 100,
    });

    // Publish mission analysis event to EventBus
    eventBus.publish({
      id: `mission-intelligence-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-mission-intelligence",
        observationType: "general",
        data: output,
        confidence: output.confidence / 100,
      },
    });

    // Update last mission analysis and history
    this.lastMissionAnalysis = output;
    this.missionHistory.push({
      timestamp: new Date(),
      event: input.currentEvent?.type || "manual_analysis",
      output,
    });

    // Keep only last 50 analyses in history
    if (this.missionHistory.length > 50) {
      this.missionHistory = this.missionHistory.slice(-50);
    }

    return output;
  }

  /**
   * Get current mission
   */
  static getCurrentMission(): MissionIntelligenceOutput["mission"] | null {
    return this.lastMissionAnalysis?.mission || null;
  }

  /**
   * Get current phase
   */
  static getCurrentPhase(): MissionIntelligenceOutput["currentPhase"] | null {
    return this.lastMissionAnalysis?.currentPhase || null;
  }

  /**
   * Get progression
   */
  static getProgression(): MissionIntelligenceOutput["progression"] | null {
    return this.lastMissionAnalysis?.progression || null;
  }

  /**
   * Check if recalibration is needed
   */
  static shouldRecalibrate(): boolean {
    return this.lastMissionAnalysis?.recalibration?.needed || false;
  }

  /**
   * Get recalibration recommendations
   */
  static getRecalibrationRecommendations(): MissionIntelligenceOutput["recalibration"] | null {
    return this.lastMissionAnalysis?.recalibration || null;
  }

  /**
   * Get mission probability
   */
  static getMissionProbability(): MissionIntelligenceOutput["missionProbability"] | null {
    return this.lastMissionAnalysis?.missionProbability || null;
  }

  /**
   * Get last mission analysis
   */
  static getLastMissionAnalysis(): MissionIntelligenceOutput | null {
    return this.lastMissionAnalysis;
  }

  /**
   * Get mission history
   */
  static getMissionHistory(): Array<{
    timestamp: Date;
    event: string;
    output: MissionIntelligenceOutput;
  }> {
    return this.missionHistory;
  }

  /**
   * Get explainability
   */
  static getExplainability(): MissionIntelligenceOutput["explainability"] | null {
    return this.lastMissionAnalysis?.explainability || null;
  }
}
