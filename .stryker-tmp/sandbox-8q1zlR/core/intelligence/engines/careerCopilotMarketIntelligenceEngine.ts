// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotMarketIntelligenceV1 } from "../../ai/Prompts/career-copilot-market-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "./careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotGoalIntelligenceEngine } from "./careerCopilotGoalIntelligenceEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface MarketIntelligenceInput {
  candidateGraph: any;
  marketData?: any;
}

export interface MarketTrend {
  sector: string;
  growthRate: number;
  reason: string;
  confidence: "high" | "medium" | "low";
}

export interface EmergingSkill {
  skill: string;
  demandLevel: "critical" | "high" | "medium" | "low";
  emergingSpeed: "fast" | "moderate" | "slow";
  reason: string;
  confidence: "high" | "medium" | "low";
}

export interface CandidateMarketGap {
  missingSkills: Array<{
    skill: string;
    importance: "critical" | "high" | "medium" | "low";
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  outdatedSkills: Array<{
    skill: string;
    replacement: string;
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  highlyValuedSkills: Array<{
    skill: string;
    candidateHas: boolean;
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  differentiatingPoints: Array<{
    point: string;
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  competitiveAdvantages: Array<{
    advantage: string;
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  areasNeedingImprovement: Array<{
    area: string;
    priority: "critical" | "high" | "medium" | "low";
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
}

export interface MarketOpportunity {
  opportunity: string;
  type: "new_role" | "specialization" | "evolution" | "mobility" | "emerging";
  urgency: "high" | "medium" | "low";
  feasibility: "high" | "medium" | "low";
  reason: string;
  confidence: "high" | "medium" | "low";
}

export interface MarketRisk {
  risk: string;
  type: "skill_obsolescence" | "sector_slowdown" | "goal_difficulty" | "competition" | "technology_replacement" | "saturation";
  severity: "critical" | "high" | "medium" | "low";
  probability: "high" | "medium" | "low";
  reason: string;
  confidence: "high" | "medium" | "low";
}

export interface StrategyImpact {
  currentStrategyRelevant: boolean;
  strategyEvolutionNeeded: boolean;
  recommendedChanges: Array<{
    change: string;
    reason: string;
    priority: "critical" | "high" | "medium" | "low";
    confidence: "high" | "medium" | "low";
  }>;
  opportunitiesToSeize: Array<{
    opportunity: string;
    reason: string;
    priority: "critical" | "high" | "medium" | "low";
    confidence: "high" | "medium" | "low";
  }>;
  risksToMitigate: Array<{
    risk: string;
    mitigation: string;
    priority: "critical" | "high" | "medium" | "low";
    confidence: "high" | "medium" | "low";
  }>;
}

export interface MarketIntelligence {
  marketTrends: {
    growingSectors: MarketTrend[];
    decliningSectors: MarketTrend[];
    recruitingJobs: Array<{
      job: string;
      demandLevel: "high" | "medium" | "low";
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    slowdownJobs: Array<{
      job: string;
      slowdownLevel: "high" | "medium" | "low";
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
  };
  emergingSkills: EmergingSkill[];
  obsoleteSkills: Array<{
    skill: string;
    obsolescenceSpeed: "fast" | "moderate" | "slow";
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  candidateMarketGap: CandidateMarketGap;
  opportunities: MarketOpportunity[];
  risks: MarketRisk[];
  strategyImpact: StrategyImpact;
  marketConfidence: {
    overallConfidence: "very_high" | "high" | "moderate" | "low" | "insufficient";
    dataQuality: "excellent" | "good" | "moderate" | "poor";
    missingData: Array<{
      data: string;
      importance: "critical" | "high" | "medium" | "low";
    }>;
    reason: string;
  };
  recommendations: Array<{
    recommendation: string;
    type: "skill" | "strategy" | "goal" | "opportunity" | "risk_mitigation";
    priority: "critical" | "high" | "medium" | "low";
    marketInfluence: string;
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
}

export class CareerCopilotMarketIntelligenceEngine {
  private static currentMarketIntelligence: MarketIntelligence | null = null;
  private static marketIntelligenceHistory: MarketIntelligence[] = [];

  /**
   * Analyze market intelligence for the candidate
   */
  static async analyzeMarketIntelligence(input: MarketIntelligenceInput): Promise<MarketIntelligence> {
    // Extract data from CandidateGraph
    const candidateProfile = this.extractCandidateProfile(input.candidateGraph);
    const candidateGraph = this.formatCandidateGraph(input.candidateGraph);

    // Extract data from existing engines
    const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy() || "No current strategy defined";
    const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory();
    const currentPriority = CareerCopilotDecisionIntelligenceEngine.getCurrentPriority();
    const priorityHistory = CareerCopilotDecisionIntelligenceEngine.getPriorityHistory();
    const currentGoals = CareerCopilotGoalIntelligenceEngine.getCurrentGoalIntelligence();
    const goalHistory = CareerCopilotGoalIntelligenceEngine.getGoalIntelligenceHistory();

    // Extract data from CandidateAIBrain
    const historicalObservations = candidateAIBrain.getObservations().slice(-10);
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
    const recentEvents = historicalObservations.slice(-5).map(obs => ({
      source: obs.source,
      timestamp: obs.timestamp,
      summary: JSON.stringify(obs.data).substring(0, 200),
    }));

    // Format market data
    const marketData = input.marketData
      ? JSON.stringify(input.marketData).substring(0, 1000)
      : "No market data available";

    // Format strategy history
    const strategyHistoryText = strategyHistory.length > 0
      ? strategyHistory.slice(-5).map(entry => `${entry.currentStrategy}`).join("\n")
      : "No strategy history available";

    // Format priority history
    const priorityHistoryText = priorityHistory.length > 0
      ? priorityHistory.slice(-5).map(entry => `${entry.absolutePriority}`).join("\n")
      : "No priority history available";

    // Format goal history
    const goalHistoryText = goalHistory.length > 0
      ? goalHistory.slice(-5).map(entry => `${entry.primaryGoal?.description || "No primary goal"}`).join("\n")
      : "No goal history available";

    // Format current goals
    const currentGoalsText = currentGoals
      ? `Primary: ${currentGoals.primaryGoal?.description || "No primary goal"}\nGoal of the moment: ${currentGoals.goalOfTheMoment?.description || "No goal of the moment"}`
      : "No current goals available";

    // Extract opportunity intelligence to merge with market intelligence
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const priorityOpportunity = opportunityIntelligence
      ? opportunityIntelligence.priorityOpportunity.title
      : "No priority opportunity available";
    const compatibleOpportunities = opportunityIntelligence
      ? opportunityIntelligence.compatibleOpportunities.map((o: any) => o.title).join(", ")
      : "No compatible opportunities available";
    const opportunitiesToPrepare = opportunityIntelligence
      ? opportunityIntelligence.opportunitiesToPrepare.map((o: any) => o.title).join(", ")
      : "No opportunities to prepare available";
    const opportunityMarketContext = opportunityIntelligence
      ? opportunityIntelligence.analyzedOpportunities.map((o: any) => `${o.title}: aligned with trends=${o.marketContext.alignedWithTrends}, sector growth=${o.marketContext.sectorGrowth}, competition=${o.marketContext.competitionLevel}`).join("; ")
      : "No opportunity market context available";

    // Extract application intelligence to merge with market intelligence
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const priorityApplication = applicationIntelligence
      ? applicationIntelligence.priorityApplication.title
      : "No priority application available";
    const applicationsToFollowUp = applicationIntelligence
      ? applicationIntelligence.applicationsToFollowUp.map((a: any) => a.title).join(", ")
      : "No applications to follow up available";
    const applicationsToPrepare = applicationIntelligence
      ? applicationIntelligence.applicationsToPrepare.map((a: any) => a.title).join(", ")
      : "No applications to prepare available";
    const applicationMarketContext = applicationIntelligence
      ? applicationIntelligence.trackedApplications.map((a: any) => `${a.title}: sector=${a.marketContext.sector}, demand=${a.marketContext.demandLevel}, competition=${a.marketContext.competitionLevel}`).join("; ")
      : "No application market context available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Best return skills: ${successIntelligence.marketOptimization.bestReturnSkills.join(", ")}, Accessible sectors: ${successIntelligence.marketOptimization.accessibleSectors.join(", ")}, Favorable companies: ${successIntelligence.marketOptimization.favorableCompanies.join(", ")}, Profitable trends: ${successIntelligence.marketOptimization.profitableTrends.join(", ")}`
      : "No success intelligence available";

    // Extract scenario intelligence for multi-future market context
    const scenarioObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-1);
    const scenarioContext = scenarioObs.length > 0 && scenarioObs[0]
      ? `Recommended scenario: ${(scenarioObs[0].data as any).recommendation?.recommendedScenario || "None"}, Best scenario: ${(scenarioObs[0].data as any).comparison?.bestScenario || "None"}, Success maximization: ${(scenarioObs[0].data as any).recommendation?.successMaximization || "None"}`
      : "No scenario intelligence available";

    // Get constraint intelligence for constraint-aware market analysis
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

    // Get resource intelligence for resource-aware market analysis
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

    // Call AIOrchestrator with market intelligence prompt
    const result = await aiOrchestrator.execute(
      careerCopilotMarketIntelligenceV1,
      {
        candidateProfile,
        candidateGraph,
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
        historicalObservations: JSON.stringify(historicalObservations).substring(0, 500),
        recentEvents: JSON.stringify(recentEvents).substring(0, 500),
        marketData,
        priorityOpportunity,
        compatibleOpportunities,
        opportunitiesToPrepare,
        opportunityMarketContext,
        priorityApplication,
        applicationsToFollowUp,
        applicationsToPrepare,
        applicationMarketContext,
        successContext,
        scenarioContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-market-intelligence",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    // Parse the result
    const marketIntelligence = JSON.parse(result.data as string) as MarketIntelligence;

    // Convert confidence string to number
    const confidenceValue = marketIntelligence.marketConfidence.overallConfidence === "very_high" ? 0.9 : marketIntelligence.marketConfidence.overallConfidence === "high" ? 0.75 : marketIntelligence.marketConfidence.overallConfidence === "moderate" ? 0.5 : marketIntelligence.marketConfidence.overallConfidence === "low" ? 0.25 : 0.1;

    // Save to CandidateAIBrain
    await candidateAIBrain.addObservation({
      source: "career-copilot-market-intelligence",
      data: marketIntelligence,
      confidence: confidenceValue,
      timestamp: new Date(),
      type: "career",
      metadata: {
        marketConfidence: marketIntelligence.marketConfidence.overallConfidence,
        dataQuality: marketIntelligence.marketConfidence.dataQuality,
      },
    });

    // Publish event
    eventBus.publish({
      id: `market-intelligence-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-market-intelligence",
        observationType: "career",
        data: marketIntelligence,
        confidence: confidenceValue,
        metadata: {
          marketConfidence: marketIntelligence.marketConfidence.overallConfidence,
          dataQuality: marketIntelligence.marketConfidence.dataQuality,
        },
      },
    });

    // Update current market intelligence
    this.currentMarketIntelligence = marketIntelligence;
    this.marketIntelligenceHistory.push(marketIntelligence);

    // Keep only last 20 entries
    if (this.marketIntelligenceHistory.length > 20) {
      this.marketIntelligenceHistory = this.marketIntelligenceHistory.slice(-20);
    }

    return marketIntelligence;
  }

  /**
   * Get current market intelligence
   */
  static getCurrentMarketIntelligence(): MarketIntelligence | null {
    return this.currentMarketIntelligence;
  }

  /**
   * Get market intelligence history
   */
  static getMarketIntelligenceHistory(): MarketIntelligence[] {
    return this.marketIntelligenceHistory;
  }

  /**
   * Get market intelligence from CandidateAIBrain
   */
  static getMarketIntelligenceFromBrain(): MarketIntelligence | null {
    const observations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-market-intelligence")
      .slice(-1);
    
    if (observations.length > 0 && observations[0]) {
      return observations[0].data as MarketIntelligence;
    }
    return null;
  }

  /**
   * Extract candidate profile from CandidateGraph
   */
  private static extractCandidateProfile(candidateGraph: any): string {
    if (!candidateGraph) return "No candidate profile available";

    return `
Overall Score: ${candidateGraph.overallScore || 0}/100
Communication: ${candidateGraph.communication?.score || 0}/100
Leadership: ${candidateGraph.leadership?.score || 0}/100
Confidence: ${candidateGraph.confidence || 0}/100
Structure: ${candidateGraph.structure?.score || 0}/100
Impact: ${candidateGraph.impact?.score || 0}/100

Target Job: ${candidateGraph.targetJob || "Not specified"}
Target Industry: ${candidateGraph.targetIndustry || "Not specified"}
Target Location: ${candidateGraph.targetLocation || "Not specified"}

Skills: ${candidateGraph.skills?.map((s: any) => s.name).join(", ") || "No skills listed"}
Experience: ${candidateGraph.experience?.years || 0} years
Education: ${candidateGraph.education?.degree || "Not specified"}
`.trim();
  }

  /**
   * Format CandidateGraph data
   */
  private static formatCandidateGraph(candidateGraph: any): string {
    if (!candidateGraph) return "No candidate graph available";

    return JSON.stringify(candidateGraph).substring(0, 1000);
  }
}
