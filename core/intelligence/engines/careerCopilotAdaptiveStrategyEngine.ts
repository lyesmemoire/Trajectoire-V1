import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { careerCopilotAdaptiveStrategyV1 } from "../../ai/Prompts/career-copilot-adaptive-strategy-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
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

    // Extract market intelligence (simplified - Market Intelligence Engine removed)
    const marketTrends = "No market trends available";
    const emergingSkills = "No emerging skills available";
    const marketOpportunities = "No market opportunities available";
    const marketRisks = "No market risks available";
    const strategyImpact = "No market strategy impact available";

    // Extract opportunity intelligence (simplified - Opportunity Intelligence Engine removed)
    const priorityOpportunity = "No priority opportunity available";
    const compatibleOpportunities = "No compatible opportunities available";
    const opportunitiesToPrepare = "No opportunities to prepare available";
    const opportunitiesToAvoid = "No opportunities to avoid available";
    const opportunityStrategyImpact = "No opportunity strategy impact available";

    // Extract application intelligence (simplified - Application Intelligence Engine removed)
    const priorityApplication = "No priority application available";
    const applicationsToFollowUp = "No applications to follow up available";
    const applicationsToPrepare = "No applications to prepare available";
    const applicationsToAbandon = "No applications to abandon available";
    const applicationStrategyImpact = "No application strategy impact available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment}, Recommended optimizations: ${successIntelligence.recommendedOptimizations.map((o: any) => o.optimization).join(", ")}`
      : "No success intelligence available";

    // Extract scenario intelligence for multi-future strategy context
    const scenarioContext = "No scenario intelligence available";

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

    const promptTemplate = careerCopilotAdaptiveStrategyV1.system || careerCopilotAdaptiveStrategyV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<AdaptiveStrategyOutput>(promptTemplate);

    const promptVariables = {
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
    };

    const request: IntelligenceRequest<AdaptiveStrategyOutput> = {
      id: `career-copilot-adaptive-strategy-${Date.now()}`,
      type: "career-copilot-adaptive-strategy",
      input: input as unknown as AdaptiveStrategyOutput,
      context: {
        candidateProfile,
        historicalObservations,
        recentInsights,
        currentGoals,
        engineContext: promptVariables,
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.7,
        maxTokens: 1500,
        timeout: 30000,
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error("Failed to detect and adapt strategy");
    }

    const strategyData = result.output as AdaptiveStrategyOutput;

    // Save strategy change to Brain as observation if change is required
    if (strategyData.strategyChangeRequired) {
      candidateAIBrain.addObservation({
        timestamp: new Date(),
        source: "career-copilot-adaptive-strategy",
        type: "career",
        data: strategyData,
        confidence: strategyData.confidence / 100,
      });

      // Publish strategy change event to EventBus
      const eventPublisher = new EventPublisher();
      eventPublisher.publish("observation_created", {
        source: "career-copilot-adaptive-strategy",
        observationType: "career",
        data: strategyData,
        confidence: strategyData.confidence / 100,
        timestamp: new Date().toISOString(),
      });
    }

    return strategyData;
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
