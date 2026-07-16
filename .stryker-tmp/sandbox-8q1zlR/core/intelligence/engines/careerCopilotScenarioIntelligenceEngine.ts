// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotScenarioIntelligenceV1 } from "../../ai/Prompts/career-copilot-scenario-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface ScenarioIntelligenceInput {
  candidateGraph: any;
  candidateQuestion?: string;
}

export interface Scenario {
  id: string;
  name: string;
  type: "current" | "optimistic" | "prudent" | "ambitious" | "strategy_change" | "sector_change" | "certification" | "acceleration" | "slow_down" | "custom";
  description: string;
  necessaryConditions: string[];
  requiredActions: string[];
  risks: string[];
  opportunities: string[];
  barriers: string[];
  levers: string[];
  probability: number;
  confidence: number;
  limitations: string[];
  successProbability: number;
  estimatedTime: string;
  requiredEffort: "low" | "medium" | "high";
  riskLevel: "low" | "medium" | "high";
  cost: string;
  roi: number;
  careerImpact: "low" | "medium" | "high";
  employabilityImpact: number;
  salaryPotential: string;
  progressionSpeed: "slow" | "medium" | "fast";
  satisfactionEstimate: "low" | "medium" | "high";
}

export interface ScenarioComparison {
  bestScenario: string;
  fastestScenario: string;
  mostProfitableScenario: string;
  safestScenario: string;
  mostAmbitiousScenario: string;
  comparisonMatrix: {
    [scenarioId: string]: {
      successProbability: number;
      estimatedTime: string;
      requiredEffort: string;
      riskLevel: string;
      roi: number;
      careerImpact: string;
      employabilityImpact: number;
    };
  };
}

export interface ScenarioRecommendation {
  recommendedScenario: string;
  recommendationReason: string;
  alternativeAnalysis: string;
  switchingConditions: string[];
  successMaximization: string;
}

export interface ScenarioEvolution {
  newScenarios: string[];
  abandonedScenarios: string[];
  confirmedScenarios: string[];
  impossibleScenarios: string[];
  priorityScenarios: string[];
  moreProbableScenarios: string[];
  lessProbableScenarios: string[];
}

export interface ScenarioIntelligenceOutput {
  scenarios: Scenario[];
  comparison: ScenarioComparison;
  recommendation: ScenarioRecommendation;
  evolution: ScenarioEvolution;
  confidence: number;
  analysesUsed: string[];
  observationsUsed: string[];
  hypotheses: string[];
  recentChanges: string[];
}

/**
 * Career Copilot Scenario Intelligence Engine
 * 
 * Generates and compares multiple career scenarios to help candidates
 * choose the best future trajectory based on existing intelligence.
 */
export class CareerCopilotScenarioIntelligenceEngine {
  private static currentScenarios: ScenarioIntelligenceOutput | null = null;
  private static scenarioHistory: ScenarioIntelligenceOutput[] = [];

  /**
   * Generate career scenarios based on existing intelligence
   */
  static async generateScenarios(input: ScenarioIntelligenceInput): Promise<ScenarioIntelligenceOutput> {
    // Extract candidate profile from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract historical observations from Brain
    const historicalObservations = candidateAIBrain.getObservations()
      .slice(0, 20)
      .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);

    // Extract forecast intelligence from Brain observations
    const forecastObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-forecast")
      .slice(-1);
    const forecastText = forecastObservations.length > 0 && forecastObservations[0]
      ? JSON.stringify(forecastObservations[0].data).substring(0, 800)
      : "No forecast available";

    // Extract success intelligence from Brain observations
    const successObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-success-intelligence")
      .slice(-1);
    const successText = successObservations.length > 0 && successObservations[0]
      ? JSON.stringify(successObservations[0].data).substring(0, 800)
      : "No success intelligence available";

    // Extract application intelligence from Brain observations
    const applicationObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-application-intelligence")
      .slice(-1);
    const applicationText = applicationObservations.length > 0 && applicationObservations[0]
      ? JSON.stringify(applicationObservations[0].data).substring(0, 800)
      : "No application intelligence available";

    // Extract opportunity intelligence from Brain observations
    const opportunityObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-opportunity-intelligence")
      .slice(-1);
    const opportunityText = opportunityObservations.length > 0 && opportunityObservations[0]
      ? JSON.stringify(opportunityObservations[0].data).substring(0, 800)
      : "No opportunity intelligence available";

    // Extract market intelligence from Brain observations
    const marketObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-market-intelligence")
      .slice(-1);
    const marketText = marketObservations.length > 0 && marketObservations[0]
      ? JSON.stringify(marketObservations[0].data).substring(0, 800)
      : "No market intelligence available";

    // Extract decision intelligence from Brain observations
    const decisionObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-decision-intelligence")
      .slice(-1);
    const decisionText = decisionObservations.length > 0 && decisionObservations[0]
      ? JSON.stringify(decisionObservations[0].data).substring(0, 800)
      : "No decision intelligence available";

    // Extract goal intelligence from Brain observations
    const goalObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-goal-intelligence")
      .slice(-1);
    const goalText = goalObservations.length > 0 && goalObservations[0]
      ? JSON.stringify(goalObservations[0].data).substring(0, 800)
      : "No goal intelligence available";

    // Extract adaptive strategy from Brain observations
    const strategyObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-adaptive-strategy")
      .slice(-1);
    const strategyText = strategyObservations.length > 0 && strategyObservations[0]
      ? JSON.stringify(strategyObservations[0].data).substring(0, 800)
      : "No strategy available";

    // Extract digital twin from Brain observations
    const twinObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-digital-twin")
      .slice(-1);
    const twinText = twinObservations.length > 0 && twinObservations[0]
      ? JSON.stringify(twinObservations[0].data).substring(0, 800)
      : "No digital twin available";

    // Extract progression plan from Brain observations
    const planObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-progression-plan")
      .slice(-1);
    const planText = planObservations.length > 0 && planObservations[0]
      ? JSON.stringify(planObservations[0].data).substring(0, 800)
      : "No progression plan available";

    // Extract confidence assessment from Brain observations
    const confidenceObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-confidence")
      .slice(-1);
    const confidenceText = confidenceObservations.length > 0 && confidenceObservations[0]
      ? JSON.stringify(confidenceObservations[0].data).substring(0, 800)
      : "No confidence assessment available";

    // Extract previous scenarios from Brain
    const previousScenarioObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-3);
    
    const previousScenarios = previousScenarioObservations.length > 0
      ? previousScenarioObservations.map(obs => JSON.stringify(obs.data).substring(0, 500)).join("\n\n")
      : "No previous scenarios - creating initial scenarios";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(0, 15)
      .map(obs => `${obs.type} at ${obs.timestamp.toISOString()}`);

    // Get constraint intelligence for constraint-aware scenario generation
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

    // Get resource intelligence for resource-aware scenario generation
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

    // Format CandidateGraph data
    const candidateGraphData = `
Overall Score: ${input.candidateGraph.overallScore || 0}/100
Communication: ${input.candidateGraph.communication?.score || 0}/100
Leadership: ${input.candidateGraph.leadership?.score || 0}/100
Confidence: ${input.candidateGraph.confidence || 0}/100
Structure: ${input.candidateGraph.structure?.score || 0}/100
Impact: ${input.candidateGraph.impact?.score || 0}/100

Progress: ${input.candidateGraph.progress?.timeline?.length || 0} interviews completed
Change: ${input.candidateGraph.progress?.change || 0}
Trend: ${input.candidateGraph.progress?.trend || "stable"}

Strengths: ${(input.candidateGraph.strengths || []).map((s: any) => s.description).join(", ")}
Weaknesses: ${(input.candidateGraph.weaknesses || []).map((w: any) => w.description).join(", ")}
`;

    const result = await aiOrchestrator.execute<ScenarioIntelligenceOutput>(
      careerCopilotScenarioIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        forecastIntelligence: forecastText,
        successIntelligence: successText,
        applicationIntelligence: applicationText,
        opportunityIntelligence: opportunityText,
        marketIntelligence: marketText,
        decisionIntelligence: decisionText,
        goalIntelligence: goalText,
        adaptiveStrategy: strategyText,
        digitalTwin: twinText,
        progressionPlan: planText,
        confidenceAssessment: confidenceText,
        candidateQuestion: input.candidateQuestion || "No specific question - generate standard scenarios",
        previousScenarios,
        recentEvents: recentEvents.join("\n"),
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-scenario-intelligence",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to generate career scenarios");
    }

    const scenarioData = result.data;

    // Save scenario intelligence to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-scenario-intelligence",
      type: "career",
      data: scenarioData,
      confidence: scenarioData.confidence / 100,
    });

    // Update current scenarios
    this.currentScenarios = scenarioData;
    this.scenarioHistory.push(scenarioData);

    // Publish scenario change events to EventBus
    eventBus.publish<ObservationCreatedEvent>({
      id: `scenario-intelligence-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-scenario-intelligence",
        observationType: "career",
        data: {
          scenarioCount: scenarioData.scenarios.length,
          recommendedScenario: scenarioData.recommendation.recommendedScenario,
          confidence: scenarioData.confidence,
        },
        confidence: scenarioData.confidence / 100,
      },
    });

    return scenarioData;
  }

  /**
   * Get current scenario intelligence
   */
  static getCurrentScenarios(): ScenarioIntelligenceOutput | null {
    return this.currentScenarios;
  }

  /**
   * Get scenario history
   */
  static getScenarioHistory(): ScenarioIntelligenceOutput[] {
    return this.scenarioHistory;
  }

  /**
   * Get specific scenario by ID
   */
  static getScenarioById(scenarioId: string): Scenario | null {
    if (!this.currentScenarios) return null;
    return this.currentScenarios.scenarios.find(s => s.id === scenarioId) || null;
  }

  /**
   * Get recommended scenario
   */
  static getRecommendedScenario(): Scenario | null {
    if (!this.currentScenarios) return null;
    const recommendedId = this.currentScenarios.recommendation.recommendedScenario;
    return this.currentScenarios.scenarios.find(s => s.id === recommendedId) || null;
  }

  /**
   * Compare scenarios by specific dimension
   */
  static compareScenariosBy(dimension: keyof Scenario): Scenario[] {
    if (!this.currentScenarios) return [];
    const scenarios = [...this.currentScenarios.scenarios];
    return scenarios.sort((a, b) => {
      const aVal = a[dimension];
      const bVal = b[dimension];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return bVal - aVal; // Descending for numbers
      }
      return 0;
    });
  }
}
