// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotAdaptiveStrategyV1 } from "../../ai/Prompts/career-copilot-adaptive-strategy-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotMarketIntelligenceEngine } from "./careerCopilotMarketIntelligenceEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface AdaptiveStrategyInput {
  candidateGraph: any;
}

export interface AdaptiveStrategyOutput {
  strategyChangeRequired: boolean;
  currentStrategy: string;
  proposedStrategy: string;
  changeReason: string;
  oldStrategyRelevance: string;
  oldStrategyObsolescence: string;
  newStrategyAdvantage: string;
  triggerEvents: string[];
  transitionPlan: string;
  confidence: number;
  limitations: string[];
  nextSteps: string[];
}

/**
 * Career Copilot Adaptive Strategy Engine
 * 
 * Detects and adapts career strategy based on significant events and changes.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotAdaptiveStrategyEngine {
  /**
   * Detect and adapt career strategy
   */
  static async detectAndAdaptStrategy(input: AdaptiveStrategyInput): Promise<AdaptiveStrategyOutput> {
    // Extract data from CandidateGraph
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

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(-10)
      .map(obs => `${obs.timestamp.toISOString()}: ${obs.type} - ${JSON.stringify(obs.data).substring(0, 50)}...`);

    // Extract current strategy from Brain
    const currentStrategyObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-adaptive-strategy")
      .slice(-1);
    const currentStrategy = currentStrategyObs.length > 0 && currentStrategyObs[0]
      ? JSON.stringify(currentStrategyObs[0].data).substring(0, 300) + "..."
      : "No current strategy defined";

    // Extract previous strategies from Brain
    const previousStrategiesObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-adaptive-strategy")
      .slice(-5);
    const previousStrategies = previousStrategiesObs.length > 0
      ? previousStrategiesObs.map(obs => `${obs.timestamp.toISOString()}: ${JSON.stringify(obs.data).substring(0, 100)}...`).join("\n")
      : "No previous strategies";

    // Extract recent insights from Brain
    const recentInsights = candidateAIBrain.getInsights()
      .slice(-5)
      .map(insight => `${insight.timestamp.toISOString()}: ${insight.description}`);

    // Extract current goals from Brain
    const currentGoals = candidateAIBrain.getGoals()
      .map(g => `${g.status}: ${g.description} (target: ${g.target}, current: ${g.current})`);

    // Extract recommendations from Brain
    const recommendationsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "recommendations")
      .slice(-1);
    const recommendations = recommendationsObs.length > 0 && recommendationsObs[0]
      ? JSON.stringify(recommendationsObs[0].data).substring(0, 300) + "..."
      : "No recommendations available";

    // Extract career forecast from Brain
    const careerForecastObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-forecast")
      .slice(-1);
    const careerForecast = careerForecastObs.length > 0 && careerForecastObs[0]
      ? JSON.stringify(careerForecastObs[0].data).substring(0, 300) + "..."
      : "No career forecast available";

    // Extract market intelligence from Market Intelligence Engine
    const marketIntelligence = CareerCopilotMarketIntelligenceEngine.getCurrentMarketIntelligence();
    const marketTrends = marketIntelligence
      ? JSON.stringify(marketIntelligence.marketTrends).substring(0, 300)
      : "No market trends available";
    const emergingSkills = marketIntelligence
      ? marketIntelligence.emergingSkills.map((s: any) => s.skill).join(", ")
      : "No emerging skills available";
    const marketOpportunities = marketIntelligence
      ? marketIntelligence.opportunities.map((o: any) => o.opportunity).join(", ")
      : "No market opportunities available";
    const marketRisks = marketIntelligence
      ? marketIntelligence.risks.map((r: any) => r.risk).join(", ")
      : "No market risks available";
    const strategyImpact = marketIntelligence
      ? marketIntelligence.strategyImpact.strategyEvolutionNeeded
        ? "Strategy evolution needed based on market"
        : "Current strategy remains relevant to market"
      : "No market strategy impact available";

    // Extract opportunity intelligence from Opportunity Intelligence Engine
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
    const opportunitiesToAvoid = opportunityIntelligence
      ? opportunityIntelligence.opportunitiesToAvoid.map((o: any) => o.title).join(", ")
      : "No opportunities to avoid available";
    const opportunityStrategyImpact = opportunityIntelligence
      ? opportunityIntelligence.strategyImpact.strategyChangeNeeded
        ? "Strategy change needed based on opportunities"
        : "Current strategy remains relevant to opportunities"
      : "No opportunity strategy impact available";

    // Extract application intelligence from Application Intelligence Engine
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
    const applicationsToAbandon = applicationIntelligence
      ? applicationIntelligence.applicationsToAbandon.map((a: any) => a.title).join(", ")
      : "No applications to abandon available";
    const applicationStrategyImpact = applicationIntelligence
      ? applicationIntelligence.strategyImpact.strategyChangeNeeded
        ? "Strategy change needed based on applications"
        : "Current strategy remains relevant to applications"
      : "No application strategy impact available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment}, Recommended optimizations: ${successIntelligence.recommendedOptimizations.map((o: any) => o.optimization).join(", ")}`
      : "No success intelligence available";

    // Extract scenario intelligence for multi-future strategy context
    const scenarioObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-1);
    const scenarioContext = scenarioObs.length > 0 && scenarioObs[0]
      ? `Recommended scenario: ${(scenarioObs[0].data as any).recommendation?.recommendedScenario || "None"}, Best scenario: ${(scenarioObs[0].data as any).comparison?.bestScenario || "None"}, Success maximization: ${(scenarioObs[0].data as any).recommendation?.successMaximization || "None"}`
      : "No scenario intelligence available";

    // Get constraint intelligence for constraint-aware strategy adaptation
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

    // Get resource intelligence for resource-aware strategy adaptation
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

Recommended Skills: ${(input.candidateGraph.recommendedSkills || []).map((s: any) => s.title).join(", ")}
Recommended Interviews: ${(input.candidateGraph.recommendedInterviews || []).map((i: any) => i.title).join(", ")}

Risks: ${(input.candidateGraph.riskAnalysis?.risks || []).map((r: any) => r.description).join(", ")}
Employability: ${input.candidateGraph.employability?.overall || 0}/100
`;

    const result = await aiOrchestrator.execute<AdaptiveStrategyOutput>(
      careerCopilotAdaptiveStrategyV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        recentEvents: recentEvents.join("\n"),
        currentStrategy,
        previousStrategies,
        recentInsights: recentInsights.join("\n"),
        currentGoals: currentGoals.join("\n"),
        recommendations,
        careerForecast,
        marketTrends,
        emergingSkills,
        marketOpportunities,
        marketRisks,
        strategyImpact,
        priorityOpportunity,
        compatibleOpportunities,
        opportunitiesToPrepare,
        opportunitiesToAvoid,
        opportunityStrategyImpact,
        priorityApplication,
        applicationsToFollowUp,
        applicationsToPrepare,
        applicationsToAbandon,
        applicationStrategyImpact,
        successContext,
        scenarioContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-adaptive-strategy",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to detect and adapt strategy");
    }

    // Save strategy change to Brain as observation if change is required
    if (result.data.strategyChangeRequired) {
      candidateAIBrain.addObservation({
        timestamp: new Date(),
        source: "career-copilot-adaptive-strategy",
        type: "career",
        data: result.data,
        confidence: result.data.confidence / 100,
      });

      // Publish strategy change event to EventBus
      const strategyChangeEvent: ObservationCreatedEvent = {
        id: `strategy-change-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-adaptive-strategy",
          observationType: "career",
          data: result.data,
          confidence: result.data.confidence / 100,
        },
      };

      eventBus.publish(strategyChangeEvent);
    }

    return result.data;
  }

  /**
   * Get current strategy from Brain
   */
  static getCurrentStrategy(): string | null {
    const currentStrategyObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-adaptive-strategy")
      .slice(-1);

    if (currentStrategyObs.length > 0 && currentStrategyObs[0]) {
      const data = currentStrategyObs[0].data as AdaptiveStrategyOutput;
      return data.proposedStrategy || data.currentStrategy;
    }

    return null;
  }

  /**
   * Get strategy history from Brain
   */
  static getStrategyHistory(): AdaptiveStrategyOutput[] {
    const strategyObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-adaptive-strategy")
      .slice(-10);

    return strategyObs.map(obs => obs.data as AdaptiveStrategyOutput);
  }
}
