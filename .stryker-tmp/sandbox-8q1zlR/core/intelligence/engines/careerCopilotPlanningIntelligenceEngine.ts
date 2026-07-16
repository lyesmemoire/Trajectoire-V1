// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotPlanningIntelligenceV1 } from "../../ai/Prompts/career-copilot-planning-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotCareerNarrativeIntelligenceEngine } from "./careerCopilotCareerNarrativeIntelligenceEngine";
import { CareerCopilotReflectionIntelligenceEngine } from "./careerCopilotReflectionIntelligenceEngine";
import { CareerCopilotMissionIntelligenceEngine } from "./careerCopilotMissionIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface PlanningInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface PlanningOutput {
  currentPosition: {
    role: string;
    responsibilities: string[];
    skills: string[];
    experience: string;
    constraints: string[];
    resources: string[];
    marketPosition: string;
  };
  targetPosition: {
    role: string;
    requiredSkills: string[];
    requiredExperience: string;
    requiredCertifications: string[];
    requiredPortfolio: string[];
    requiredNetwork: string[];
    requiredVisibility: string[];
  };
  gapAnalysis: {
    gaps: Array<{
      category: "skills" | "experience" | "certifications" | "portfolio" | "network" | "visibility" | "evidence" | "applications";
      currentState: string;
      requiredState: string;
      gapSize: "large" | "medium" | "small";
      priority: "critical" | "high" | "medium" | "low";
      closingStrategy: string;
    }>;
  };
  planningRoadmap: {
    today: {
      actions: string[];
      expectedOutcomes: string[];
      successCriteria: string[];
      dependencies: string[];
      timeAllocation: string;
    };
    thisWeek: {
      actions: string[];
      expectedOutcomes: string[];
      successCriteria: string[];
      dependencies: string[];
      timeAllocation: string;
    };
    thisMonth: {
      actions: string[];
      expectedOutcomes: string[];
      successCriteria: string[];
      dependencies: string[];
      timeAllocation: string;
    };
    "90Days": {
      actions: string[];
      expectedOutcomes: string[];
      successCriteria: string[];
      dependencies: string[];
      timeAllocation: string;
    };
    "6Months": {
      actions: string[];
      expectedOutcomes: string[];
      successCriteria: string[];
      dependencies: string[];
      timeAllocation: string;
    };
    "12Months": {
      actions: string[];
      expectedOutcomes: string[];
      successCriteria: string[];
      dependencies: string[];
      timeAllocation: string;
    };
  };
  milestones: Array<{
    objective: string;
    justification: string;
    dependencies: string[];
    validationCriteria: string[];
    estimatedCompletion: string;
    successIndicators: string[];
  }>;
  priorities: Array<{
    action: string;
    priority: "critical" | "high" | "medium" | "low";
    justification: string;
    dependencies: string[];
    deadline: string;
  }>;
  dependencies: Array<{
    sourceAction: string;
    dependentAction: string;
    dependencyType: "prerequisite" | "parallel" | "sequential" | "blocking" | "resource";
    resolutionStrategy: string;
    estimatedImpact: string;
  }>;
  riskAnalysis: {
    risks: Array<{
      description: string;
      probability: "high" | "medium" | "low";
      impact: "high" | "medium" | "low";
      mitigationStrategy: string;
      contingencyPlan: string;
      monitoringIndicators: string[];
    }>;
  };
  alternativePlans: {
    planA: {
      advantages: string[];
      limitations: string[];
      confidence: number;
      activationConditions: string[];
      expectedOutcomes: string[];
    };
    planB: {
      advantages: string[];
      limitations: string[];
      confidence: number;
      activationConditions: string[];
      expectedOutcomes: string[];
    };
    planC: {
      advantages: string[];
      limitations: string[];
      confidence: number;
      activationConditions: string[];
      expectedOutcomes: string[];
    };
  };
  checkpoints: {
    "7Days": {
      expectedObjectives: string[];
      keyIndicators: string[];
      successConditions: string[];
      correctiveActions: string[];
      adjustmentTriggers: string[];
    };
    "30Days": {
      expectedObjectives: string[];
      keyIndicators: string[];
      successConditions: string[];
      correctiveActions: string[];
      adjustmentTriggers: string[];
    };
    "60Days": {
      expectedObjectives: string[];
      keyIndicators: string[];
      successConditions: string[];
      correctiveActions: string[];
      adjustmentTriggers: string[];
    };
    "90Days": {
      expectedObjectives: string[];
      keyIndicators: string[];
      successConditions: string[];
      correctiveActions: string[];
      adjustmentTriggers: string[];
    };
    "180Days": {
      expectedObjectives: string[];
      keyIndicators: string[];
      successConditions: string[];
      correctiveActions: string[];
      adjustmentTriggers: string[];
    };
    "365Days": {
      expectedObjectives: string[];
      keyIndicators: string[];
      successConditions: string[];
      correctiveActions: string[];
      adjustmentTriggers: string[];
    };
  };
  adaptationRules: Array<{
    triggerEvent: string;
    revisionRequired: string;
    adjustmentProcess: string;
    impactAssessment: string;
  }>;
  planningConfidence: {
    overallConfidence: number;
    confidenceByStep: Array<{ step: string; confidence: number }>;
    confidenceByMilestone: Array<{ milestone: string; confidence: number }>;
    confidenceByTimeframe: Array<{ timeframe: string; confidence: number }>;
    factors: string[];
  };
  planningExplainability: {
    enginesConsulted: string[];
    evidenceUsed: string[];
    constraintsConsidered: string[];
    risksAssociated: string[];
    alternativesConsidered: string[];
    rationale: string;
  };
}

export class CareerCopilotPlanningIntelligenceEngine {
  private static lastPlanningAnalysis: PlanningOutput | null = null;
  private static planningHistory: Array<{
    timestamp: Date;
    event: string;
    output: PlanningOutput;
  }> = [];

  /**
   * Generate career planning based on all intelligences
   */
  static async generatePlanning(input: PlanningInput): Promise<PlanningOutput> {
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

    // Get context from other intelligences for planning
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

    let reflectionContext = null;
    try {
      const reflection = CareerCopilotReflectionIntelligenceEngine.getLastReflectionAnalysis();
      if (reflection) {
        reflectionContext = {
          reflectionSummary: reflection.reflectionSummary,
          validatedRecommendations: reflection.recommendationReview.recommendations.map(r => r.recommendation),
          alternativeOptions: reflection.alternativeAnalysis.alternatives.map(a => a.alternative),
          blindSpots: reflection.blindSpotDetection.blindSpots.map(b => b.blindSpot),
          assumptions: reflection.assumptionDetection.assumptions.map(a => a.assumption),
          contradictionsDetected: reflection.contradictionDetection.contradictions.map(c => c.contradiction),
        };
      }
    } catch (error) {
      console.error("Failed to get reflection intelligence context (non-critical):", error);
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

    let marketContext = null;
    try {
      const marketObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-market-intelligence")
        .slice(-1);
      if (marketObs.length > 0 && marketObs[0]) {
        const marketData = marketObs[0].data as any;
        marketContext = {
          marketTrends: marketData.marketTrends,
          demandAnalysis: marketData.demandAnalysis,
          competitionLevel: marketData.competitionLevel,
        };
      }
    } catch (error) {
      console.error("Failed to get market intelligence context (non-critical):", error);
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

    let narrativeContext = null;
    try {
      const careerNarrative = CareerCopilotCareerNarrativeIntelligenceEngine.getLastNarrativeAnalysis();
      if (careerNarrative) {
        narrativeContext = {
          careerIdentity: careerNarrative.careerIdentity,
          careerThemes: careerNarrative.careerThemes,
          careerStory: careerNarrative.careerStory,
          confidence: careerNarrative.confidence,
        };
      }
    } catch (error) {
      console.error("Failed to get narrative intelligence context (non-critical):", error);
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

    let scenarioContext = null;
    try {
      const scenarioObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-scenario-intelligence")
        .slice(-1);
      if (scenarioObs.length > 0 && scenarioObs[0]) {
        const scenarioData = scenarioObs[0].data as any;
        scenarioContext = {
          currentScenario: scenarioData.currentScenario,
          alternativeScenarios: scenarioData.alternativeScenarios,
          scenarioProbability: scenarioData.scenarioProbability,
        };
      }
    } catch (error) {
      console.error("Failed to get scenario intelligence context (non-critical):", error);
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

    let accountabilityContext = null;
    try {
      const accountabilityObs = candidateAIBrain.getObservations()
        .filter(obs => obs.source === "career-copilot-accountability-intelligence")
        .slice(-1);
      if (accountabilityObs.length > 0 && accountabilityObs[0]) {
        const accountabilityData = accountabilityObs[0].data as any;
        accountabilityContext = {
          accountabilityScore: accountabilityData.accountabilityScore,
          commitmentTracking: accountabilityData.commitmentTracking,
          goalProgress: accountabilityData.goalProgress,
        };
      }
    } catch (error) {
      console.error("Failed to get accountability intelligence context (non-critical):", error);
    }

    // Call AI Orchestrator with planning intelligence prompt
    const result = await aiOrchestrator.execute(
      careerCopilotPlanningIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile, null, 2),
        careerTimeline: careerTimelineText,
        skillsEvolution: skillsEvolutionText,
        achievements: achievementsText,
        goals: goalsText,
        goalIntelligence: JSON.stringify(goalContext, null, 2),
        decisionIntelligence: JSON.stringify(decisionContext, null, 2),
        reflectionIntelligence: JSON.stringify(reflectionContext, null, 2),
        forecastIntelligence: JSON.stringify(forecastContext, null, 2),
        opportunityIntelligence: JSON.stringify(opportunityContext, null, 2),
        marketIntelligence: JSON.stringify(marketContext, null, 2),
        constraintIntelligence: JSON.stringify(constraintContext, null, 2),
        resourceIntelligence: JSON.stringify(resourceContext, null, 2),
        missionIntelligence: JSON.stringify(missionContext, null, 2),
        narrativeIntelligence: JSON.stringify(narrativeContext, null, 2),
        knowledgeEvolution: JSON.stringify(knowledgeEvolutionContext, null, 2),
        scenarioIntelligence: JSON.stringify(scenarioContext, null, 2),
        outcomeIntelligence: JSON.stringify(outcomeContext, null, 2),
        successIntelligence: JSON.stringify(successContext, null, 2),
        accountabilityIntelligence: JSON.stringify(accountabilityContext, null, 2),
      },
      {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        promptId: "career-copilot-planning-intelligence-v1",
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to generate planning");
    }

    const output: PlanningOutput = result.data as PlanningOutput;

    // Save planning analysis to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-planning-intelligence",
      type: "career",
      data: output,
      confidence: output.planningConfidence.overallConfidence / 100,
    });

    // Publish planning events to EventBus
    eventBus.publish({
      id: `planning-generated-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-planning-intelligence",
        observationType: "career",
        data: {
          planningRoadmap: output.planningRoadmap,
          overallConfidence: output.planningConfidence.overallConfidence,
        },
        confidence: output.planningConfidence.overallConfidence / 100,
      },
    });

    // Update last planning analysis and history
    this.lastPlanningAnalysis = output;
    this.planningHistory.push({
      timestamp: new Date(),
      event: input.currentEvent?.type || "manual_planning",
      output,
    });

    // Keep only last 50 planning analyses in history
    if (this.planningHistory.length > 50) {
      this.planningHistory = this.planningHistory.slice(-50);
    }

    return output;
  }

  /**
   * Get the last planning analysis
   */
  static getLastPlanningAnalysis(): PlanningOutput | null {
    return this.lastPlanningAnalysis;
  }

  /**
   * Get planning analysis history
   */
  static getHistory(): Array<{
    timestamp: Date;
    event: string;
    output: PlanningOutput;
  }> {
    return this.planningHistory;
  }

  /**
   * Get current position
   */
  static getCurrentPosition() {
    return this.lastPlanningAnalysis?.currentPosition || null;
  }

  /**
   * Get target position
   */
  static getTargetPosition() {
    return this.lastPlanningAnalysis?.targetPosition || null;
  }

  /**
   * Get gap analysis
   */
  static getGapAnalysis() {
    return this.lastPlanningAnalysis?.gapAnalysis || null;
  }

  /**
   * Get planning roadmap
   */
  static getPlanningRoadmap() {
    return this.lastPlanningAnalysis?.planningRoadmap || null;
  }

  /**
   * Get milestones
   */
  static getMilestones() {
    return this.lastPlanningAnalysis?.milestones || null;
  }

  /**
   * Get priorities
   */
  static getPriorities() {
    return this.lastPlanningAnalysis?.priorities || null;
  }

  /**
   * Get dependencies
   */
  static getDependencies() {
    return this.lastPlanningAnalysis?.dependencies || null;
  }

  /**
   * Get risk analysis
   */
  static getRiskAnalysis() {
    return this.lastPlanningAnalysis?.riskAnalysis || null;
  }

  /**
   * Get alternative plans
   */
  static getAlternativePlans() {
    return this.lastPlanningAnalysis?.alternativePlans || null;
  }

  /**
   * Get checkpoints
   */
  static getCheckpoints() {
    return this.lastPlanningAnalysis?.checkpoints || null;
  }

  /**
   * Get adaptation rules
   */
  static getAdaptationRules() {
    return this.lastPlanningAnalysis?.adaptationRules || null;
  }

  /**
   * Get planning confidence
   */
  static getPlanningConfidence() {
    return this.lastPlanningAnalysis?.planningConfidence || null;
  }

  /**
   * Get planning explainability
   */
  static getPlanningExplainability() {
    return this.lastPlanningAnalysis?.planningExplainability || null;
  }

  /**
   * Get overall planning confidence score
   */
  static getOverallPlanningConfidence(): number {
    return this.lastPlanningAnalysis?.planningConfidence.overallConfidence || 0;
  }
}
