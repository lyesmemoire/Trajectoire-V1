import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { BrainContextBuilder } from "../../../lib/intelligence-core/application/BrainContextBuilder";
import { careerCopilotSuccessIntelligenceV1 } from "../../ai/Prompts/career-copilot-success-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface SuccessIntelligenceInput {
  candidateGraph: any;
}

export interface MainLever {
  lever: string;
  impact: string;
  effort: "low" | "medium" | "high";
  expectedGain: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface MainBlocker {
  blocker: string;
  severity: "critical" | "high" | "medium" | "low";
  impact: string;
  solution: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface BestInvestment {
  investment: string;
  roi: number;
  effort: "low" | "medium" | "high";
  time: string;
  expectedValue: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface QuickWin {
  action: string;
  impact: string;
  effort: "low" | "medium" | "high";
  time: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface LongTermGain {
  action: string;
  impact: string;
  effort: "low" | "medium" | "high";
  time: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface LowProfitAction {
  action: string;
  reason: string;
  alternative: string;
  confidence: "high" | "medium" | "low";
}

export interface RecommendedOptimization {
  optimization: string;
  priority: "critical" | "high" | "medium" | "low";
  impact: string;
  effort: "low" | "medium" | "high";
  risk: "low" | "medium" | "high";
  roi: number;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface ApplicationOptimization {
  priorityApplication: string;
  energyFocus: string;
  slowDown: string;
  accelerate: string;
  abandon: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface GoalOptimization {
  tooAmbitious: string[];
  lowProfit: string[];
  exceeded: string[];
  veryProfitable: string[];
  accelerator: string[];
  blocking: string[];
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface SuccessForecast {
  expectedGain: string;
  timeSaved: string;
  improvementProbability: number;
  riskAvoided: string;
  futureImpact: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface DecisionArbitration {
  bestResultAction: string;
  canWaitAction: string;
  littleValueAction: string;
  enormousYieldAction: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface MarketOptimization {
  bestReturnSkills: string[];
  accessibleSectors: string[];
  favorableCompanies: string[];
  profitableTrends: string[];
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface OpportunityReevaluation {
  mostPromising: string[];
  leastProfitable: string[];
  newPriorities: string[];
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface GoalReordering {
  reorderedGoals: Array<{
    goal: string;
    newPriority: number;
    impact: string;
    reason: string;
  }>;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface SuccessAccountability {
  effortsMade: string;
  resultsObtained: string;
  realYield: string;
  effectiveHabits: string[];
  ineffectiveHabits: string[];
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface SuccessConfidence {
  overallConfidence: "very_high" | "high" | "moderate" | "low" | "insufficient";
  dataQuality: "excellent" | "good" | "moderate" | "poor";
  missingData: Array<{
    data: string;
    importance: "critical" | "high" | "medium" | "low";
  }>;
  reason: string;
}

export interface SuccessIntelligence {
  mainLever: MainLever;
  mainBlocker: MainBlocker;
  bestInvestment: BestInvestment;
  quickWins: QuickWin[];
  longTermGains: LongTermGain[];
  lowProfitActions: LowProfitAction[];
  recommendedOptimizations: RecommendedOptimization[];
  applicationOptimization: ApplicationOptimization;
  goalOptimization: GoalOptimization;
  forecast: SuccessForecast;
  decisionArbitration: DecisionArbitration;
  marketOptimization: MarketOptimization;
  opportunityReevaluation: OpportunityReevaluation;
  goalReordering: GoalReordering;
  accountability: SuccessAccountability;
  digitalTwinEvolution: string;
  confidence: SuccessConfidence;
  observationsUsed: string[];
  analysesConsulted: string[];
  limitations: string[];
  evolutionFromPrevious: string;
}

/**
 * Success Intelligence Engine
 * 
 * Continuously optimizes the candidate's probability of success by identifying
 * the highest-value actions, major blockers, most profitable investments, and
 * most effective strategies.
 * Reuses existing AIOrchestrator, CandidateAIBrain, and EventBus.
 * No new storage or parallel memory - integrates with existing architecture.
 */
export class CareerCopilotSuccessIntelligenceEngine {
  private static successHistory: SuccessIntelligence[] = [];
  private static currentSuccessIntelligence: SuccessIntelligence | null = null;

  /**
   * Analyze success intelligence
   */
  static async analyzeSuccessIntelligence(input: SuccessIntelligenceInput): Promise<SuccessIntelligence> {
    // Extract candidate profile and graph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract data from existing engines
    const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy() || "No current strategy defined";
    const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory();
    const currentPriority = null; // Simplified - Decision Intelligence Engine removed
    const priorityHistory = []; // Simplified - Decision Intelligence Engine removed
    const currentGoals = null; // Simplified - Goal Intelligence Engine removed
    const goalHistory = []; // Simplified - Goal Intelligence Engine removed
    const marketIntelligence = null; // Simplified - Market Intelligence Engine removed
    const opportunityIntelligence = null; // Simplified - Opportunity Intelligence Engine removed
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const confidenceIntelligence = null; // Simplified - Confidence Engine removed
    const metaIntelligence = null; // Simplified - Meta Intelligence Engine removed

    // Extract data from CandidateAIBrain
    const brainData = {
      insights: candidateAIBrain.getInsights(),
      observations: candidateAIBrain.getObservations(),
      patterns: candidateAIBrain.getPatterns(),
      goals: candidateAIBrain.getGoals(),
    };

    // Use BrainContextBuilder to build standardized context
    const brainContext = BrainContextBuilder.buildContext(brainData, {
      maxInsights: 5,
      maxObservations: 15,
      maxPatterns: 5,
      maxGoals: 10,
    });

    const historicalObservations = brainContext.engineContext?.recentObservations as string[] || [];
    const progressionObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-progression-plan")
      .slice(-1);
    const progression = progressionObs.length > 0 && progressionObs[0]
      ? JSON.stringify(progressionObs[0].data).substring(0, 500)
      : "No progression data available";

    const recommendationsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "recommendations")
      .slice(-1);
    const recommendations = recommendationsObs.length > 0 && recommendationsObs[0]
      ? JSON.stringify(recommendationsObs[0].data).substring(0, 500)
      : "No recommendations available";

    const forecastObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-forecast")
      .slice(-1);
    const forecast = forecastObs.length > 0 && forecastObs[0]
      ? JSON.stringify(forecastObs[0].data).substring(0, 500)
      : "No forecast available";

    const digitalTwinObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-digital-twin")
      .slice(-1);
    const digitalTwin = digitalTwinObs.length > 0 && digitalTwinObs[0]
      ? JSON.stringify(digitalTwinObs[0].data).substring(0, 500)
      : "No digital twin available";

    // Format recent events
    const recentEvents = candidateAIBrain.getObservations().slice(-5).map(obs => ({
      source: obs.source,
      timestamp: obs.timestamp,
      summary: JSON.stringify(obs.data).substring(0, 200),
    }));

    // Format strategy history
    const strategyHistoryText = strategyHistory.length > 0
      ? strategyHistory.slice(-5).map(entry => `${entry.currentStrategy}`).join("\n")
      : "No strategy history available";

    // Format priority history (simplified)
    const priorityHistoryText = "No priority history available";

    // Format goal history (simplified)
    const goalHistoryText = "No goal history available";

    // Format current goals (simplified)
    const currentGoalsText = "No current goals available";

    // Format opportunity context (simplified)
    const opportunityContext = "No opportunity context available";

    // Format application context
    const applicationContext = applicationIntelligence
      ? `Priority application: ${applicationIntelligence.priorityApplication.title}, To follow up: ${applicationIntelligence.applicationsToFollowUp.map((a: any) => a.title).join(", ")}, To prepare: ${applicationIntelligence.applicationsToPrepare.map((a: any) => a.title).join(", ")}`
      : "No application context available";

    // Format market context (simplified)
    const marketContext = "No market context available";

    // Format confidence level (simplified)
    const confidenceLevel = "No confidence level available";

    // Format coherence status (simplified)
    const coherenceStatus = "No coherence status available";

    // Format goal status (simplified)
    const goalStatus = "No goal status available";

    // Format scenario context (simplified - Scenario Intelligence Engine removed)
    const scenarioContext = "No scenario intelligence available";

    // Get constraint intelligence for constraint-aware success analysis
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

    // Get resource intelligence for resource-aware success analysis
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

Recommended Skills: ${(input.candidateGraph.recommendedSkills || []).map((s: any) => s.title).join(", ")}
Recommended Interviews: ${(input.candidateGraph.recommendedInterviews || []).map((i: any) => i.title).join(", ")}

Risks: ${(input.candidateGraph.riskAnalysis?.risks || []).map((r: any) => r.description).join(", ")}
Employability: ${input.candidateGraph.employability?.overall || 0}/100
`;

    // Call AIOrchestrator with success intelligence prompt
    const promptTemplate = careerCopilotSuccessIntelligenceV1.system || careerCopilotSuccessIntelligenceV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<SuccessIntelligence>(promptTemplate);

    const request: IntelligenceRequest<SuccessIntelligence> = {
      id: `career-copilot-success-intelligence-${Date.now()}`,
      type: "career-copilot-success-intelligence",
      input: input as unknown as SuccessIntelligence,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
          candidateProfile: JSON.stringify(candidateProfile),
          candidateGraph: candidateGraphData,
          historicalObservations: JSON.stringify(historicalObservations).substring(0, 500),
          currentStrategy,
          strategyHistory: strategyHistoryText,
          currentPriority: currentPriority ? JSON.stringify(currentPriority).substring(0, 300) : "No current priority available",
          priorityHistory: priorityHistoryText,
          currentGoals: currentGoalsText,
          goalHistory: goalHistoryText,
          progression,
          recommendations,
          forecast,
          digitalTwin,
          recentEvents: JSON.stringify(recentEvents).substring(0, 500),
          opportunityContext,
          applicationContext,
          marketContext,
          confidenceLevel,
          coherenceStatus,
          goalStatus,
          scenarioContext: "No scenario intelligence available",
          constraintContext: JSON.stringify(constraintContext, null, 2),
          resourceContext: JSON.stringify(resourceContext, null, 2),
        },
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.7,
        maxTokens: 2500,
        timeout: 30000,
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error("Failed to analyze success intelligence");
    }

    // Parse the result
    const successIntelligence = JSON.parse(result.output as string) as SuccessIntelligence;

    // Store in history
    this.successHistory.push(successIntelligence);
    if (this.successHistory.length > 10) {
      this.successHistory.shift();
    }

    // Store as current
    this.currentSuccessIntelligence = successIntelligence;

    // Store in CandidateAIBrain (using existing observation structure)
    const confidenceValue = successIntelligence.confidence.overallConfidence === "very_high" ? 95 : 
                          successIntelligence.confidence.overallConfidence === "high" ? 80 :
                          successIntelligence.confidence.overallConfidence === "moderate" ? 60 :
                          successIntelligence.confidence.overallConfidence === "low" ? 40 : 20;
    
    candidateAIBrain.addObservation({
      source: "career-copilot-success-intelligence",
      type: "career",
      data: successIntelligence,
      confidence: confidenceValue / 100,
      timestamp: new Date(),
    });

    // Publish event (using existing event type)
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "career-copilot-success-intelligence",
      observationType: "career",
      data: successIntelligence,
      confidence: confidenceValue,
      timestamp: new Date().toISOString(),
    });

    return successIntelligence;
  }

  /**
   * Get current success intelligence
   */
  static getCurrentSuccessIntelligence(): SuccessIntelligence | null {
    const observations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-success-intelligence")
      .slice(-1);
    
    return observations.length > 0 && observations[0]
      ? observations[0].data as SuccessIntelligence
      : null;
  }

  /**
   * Get success intelligence history
   */
  static getSuccessIntelligenceHistory(): SuccessIntelligence[] {
    return this.successHistory;
  }

  /**
   * Get main lever
   */
  static getMainLever(): MainLever | null {
    return this.currentSuccessIntelligence?.mainLever || null;
  }

  /**
   * Get main blocker
   */
  static getMainBlocker(): MainBlocker | null {
    return this.currentSuccessIntelligence?.mainBlocker || null;
  }

  /**
   * Get best investment
   */
  static getBestInvestment(): BestInvestment | null {
    return this.currentSuccessIntelligence?.bestInvestment || null;
  }

  /**
   * Get recommended optimizations
   */
  static getRecommendedOptimizations(): RecommendedOptimization[] {
    return this.currentSuccessIntelligence?.recommendedOptimizations || [];
  }

  /**
   * Get quick wins
   */
  static getQuickWins(): QuickWin[] {
    return this.currentSuccessIntelligence?.quickWins || [];
  }

  /**
   * Get long term gains
   */
  static getLongTermGains(): LongTermGain[] {
    return this.currentSuccessIntelligence?.longTermGains || [];
  }
}
