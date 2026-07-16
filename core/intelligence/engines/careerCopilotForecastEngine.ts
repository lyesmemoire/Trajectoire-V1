import { careerCopilotForecastV1 } from "../../ai/Prompts/career-copilot-forecast-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { RuntimeContext } from "../../../lib/intelligence-runtime/domain/context/RuntimeContext";
import { ExecutionPipeline } from "../../../lib/intelligence-runtime/application/ExecutionPipeline";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";

export interface ForecastInput {
  candidateGraph: CandidateGraph;
}

export interface CandidateGraph {
  identity?: {
    name?: string;
  };
  career?: {
    currentRole?: string;
    careerLevel?: string;
  };
  overallScore?: number;
  communication?: {
    score?: number;
  };
  leadership?: {
    score?: number;
  };
  confidence?: number;
  structure?: {
    score?: number;
  };
  impact?: {
    score?: number;
  };
  progress?: {
    timeline?: unknown[];
    change?: number;
    trend?: string;
  };
  strengths?: Array<{
    description: string;
  }>;
  weaknesses?: Array<{
    description: string;
  }>;
  recommendedSkills?: Array<{
    title: string;
  }>;
  recommendedInterviews?: Array<{
    title: string;
  }>;
  riskAnalysis?: {
    risks?: Array<{
      description: string;
  }>;
  };
  employability?: {
    overall?: number;
  };
}

export interface ForecastOutput {
  readonly today: {
    readonly score: number;
    readonly employability: number;
    readonly mainObjective: string;
    readonly currentTrend: string;
  };
  readonly currentTrajectory: {
    readonly trend: "improving" | "stable" | "declining";
    readonly pace: "fast" | "moderate" | "slow";
    readonly description: string;
  };
  readonly probableFuture: {
    readonly scoreForecast: number;
    readonly employabilityForecast: number;
    readonly objectiveForecast: string;
    readonly nextStepForecast: string;
    readonly timeframe: string;
    readonly description: string;
  };
  readonly why: {
    readonly elements: string[];
    readonly trends: string[];
    readonly goals: string[];
    readonly recommendations: string[];
  };
  readonly whatCanAccelerate: {
    readonly factors: string[];
    readonly actions: string[];
  };
  readonly whatCanSlowDown: {
    readonly factors: string[];
    readonly risks: string[];
  };
  readonly successProbability: {
    readonly probability: number;
    readonly confidence: "high" | "medium" | "low";
    readonly explanation: string;
  };
  readonly predictionConfidence: {
    readonly confidence: "high" | "medium" | "low";
    readonly explanation: string;
    readonly whatCouldInvalidate: string[];
  };
  readonly priorityActions: string[];
}

/**
 * Career Copilot Forecast Engine
 * 
 * Generates intelligent forecasts of career evolution based on existing analyses.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotForecastEngine {
  /**
   * Generate career forecast
   */
  static async generateForecast(input: ForecastInput): Promise<ForecastOutput> {
    // Create runtime context for storing context data
    const context = new RuntimeContext();

    // Create event publisher for runtime events
    const eventPublisher = new EventPublisher();

    // Extract data from CandidateGraph and store in context
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };
    context.set("candidateProfile", candidateProfile);

    // Extract historical observations from Brain and store in context
    const historicalObservations = candidateAIBrain.getObservations()
      .slice(0, 20)
      .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);
    context.set("historicalObservations", historicalObservations);

    // Extract current goals from Brain and store in context
    const currentGoals = candidateAIBrain.getGoals()
      .map(g => `${g.status}: ${g.description} (target: ${g.target}, current: ${g.current})`);
    context.set("currentGoals", currentGoals);

    // Extract recommendations from Brain and store in context
    const recommendationsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "recommendations")
      .slice(-1);
    const recommendations = recommendationsObs.length > 0 && recommendationsObs[0]
      ? JSON.stringify(recommendationsObs[0].data).substring(0, 300) + "..."
      : "No recommendations available";
    context.set("recommendations", recommendations);

    // Extract progression plan from Brain and store in context
    const progressionPlanObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-progression-plan")
      .slice(-1);
    const progressionPlan = progressionPlanObs.length > 0 && progressionPlanObs[0]
      ? JSON.stringify(progressionPlanObs[0].data).substring(0, 300) + "..."
      : "No progression plan available";
    context.set("progressionPlan", progressionPlan);

    // Extract digital twin from Brain and store in context
    const digitalTwinObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-digital-twin")
      .slice(-1);
    const digitalTwin = digitalTwinObs.length > 0 && digitalTwinObs[0]
      ? JSON.stringify(digitalTwinObs[0].data).substring(0, 300) + "..."
      : "No digital twin available";
    context.set("digitalTwin", digitalTwin);

    // Extract daily summary from Brain and store in context
    const dailySummaryObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-daily-summary")
      .slice(-1);
    const dailySummary = dailySummaryObs.length > 0 && dailySummaryObs[0]
      ? JSON.stringify(dailySummaryObs[0].data).substring(0, 300) + "..."
      : "No daily summary available";
    context.set("dailySummary", dailySummary);

    // Extract trends from CandidateGraph and store in context
    const trends = `
Trend: ${input.candidateGraph.progress?.trend || "stable"}
Change: ${input.candidateGraph.progress?.change || 0}
Timeline: ${input.candidateGraph.progress?.timeline?.length || 0} interviews completed
`;
    context.set("trends", trends);

    // Extract previous forecasts from Brain for comparison and store in context
    const previousForecastObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-forecast")
      .slice(-3);
    const previousForecasts = previousForecastObs.length > 0
      ? previousForecastObs.map(obs => `${obs.timestamp.toISOString()}: ${JSON.stringify(obs.data).substring(0, 150)}...`).join("\n")
      : "No previous forecasts available";
    context.set("previousForecasts", previousForecasts);

    // Extract success intelligence for optimization context and store in context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment} (ROI: ${successIntelligence.bestInvestment.roi}%), Quick wins: ${successIntelligence.quickWins.map((w: any) => w.action).join(", ")}`
      : "No success intelligence available";
    context.set("successContext", successContext);

    // Extract scenario intelligence for multi-future context and store in context
    const scenarioContext = "No scenario intelligence available";
    context.set("scenarioContext", scenarioContext);

    // Get constraint intelligence for constraint-aware forecasting and store in context
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
    context.set("constraintContext", constraintContext);

    // Get resource intelligence for resource-aware forecasting and store in context
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
    context.set("resourceContext", resourceContext);

    // Get knowledge evolution (simplified - Knowledge Evolution Engine removed)
    let knowledgeEvolutionContext = null;
    context.set("knowledgeEvolutionContext", knowledgeEvolutionContext);

    // Format CandidateGraph data and store in context
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
    context.set("candidateGraphData", candidateGraphData);

    // Create execution pipeline for orchestration
    const pipeline = new ExecutionPipeline();

    // Define execution stage: AI execution via IntelligenceUseCase
    const aiExecutionStage = {
      name: "ai-execution",
      execute: async (input: any, ctx: RuntimeContext) => {
        // Retrieve values from context for IntelligenceUseCase call
        const contextCandidateProfile = ctx.get("candidateProfile") as typeof candidateProfile;
        const contextHistoricalObservations = ctx.get("historicalObservations") as string[];
        const contextCurrentGoals = ctx.get("currentGoals") as string[];
        const contextRecommendations = ctx.get("recommendations") as string;
        const contextProgressionPlan = ctx.get("progressionPlan") as string;
        const contextDigitalTwin = ctx.get("digitalTwin") as string;
        const contextDailySummary = ctx.get("dailySummary") as string;
        const contextTrends = ctx.get("trends") as string;
        const contextPreviousForecasts = ctx.get("previousForecasts") as string;
        const contextSuccessContext = ctx.get("successContext") as string;
        const contextScenarioContext = ctx.get("scenarioContext") as string;
        const contextConstraintContext = ctx.get("constraintContext") as typeof constraintContext;
        const contextResourceContext = ctx.get("resourceContext") as typeof resourceContext;
        const contextKnowledgeEvolutionContext = ctx.get("knowledgeEvolutionContext") as typeof knowledgeEvolutionContext;
        const contextCandidateGraphData = ctx.get("candidateGraphData") as string;

        // Create IntelligenceUseCase with real provider
        const promptTemplate = careerCopilotForecastV1.system || careerCopilotForecastV1.user;
        const intelligenceUseCase = intelligenceCoreModule.createUseCase<ForecastOutput>(promptTemplate);

        // Create IntelligenceRequest
        const request: IntelligenceRequest<ForecastOutput> = {
          id: `forecast-${Date.now()}`,
          type: "forecast",
          input: input as unknown as ForecastOutput,
          context: {
            candidateProfile: contextCandidateProfile,
            historicalObservations: contextHistoricalObservations,
            currentGoals: contextCurrentGoals,
            recentInsights: [],
            engineContext: {
              candidateGraph: contextCandidateGraphData,
              recommendations: contextRecommendations,
              progressionPlan: contextProgressionPlan,
              digitalTwin: contextDigitalTwin,
              dailySummary: contextDailySummary,
              trends: contextTrends,
              previousForecasts: contextPreviousForecasts,
              successContext: contextSuccessContext,
              scenarioContext: contextScenarioContext,
              constraintContext: contextConstraintContext,
              resourceContext: contextResourceContext,
              knowledgeEvolutionContext: contextKnowledgeEvolutionContext,
            },
          },
          options: {
            provider: "openai",
            model: "gpt-4-turbo",
            temperature: 0.7,
            maxTokens: 1500,
            timeout: 30000,
          },
        };

        // Execute IntelligenceUseCase
        const aiResult = await intelligenceUseCase.execute(request);

        if (!aiResult.success || !aiResult.output) {
          throw new Error("Failed to generate career forecast");
        }

        return aiResult.output;
      },
    };

    // Execute pipeline
    const forecastOutput = await pipeline.execute(
      input,
      [aiExecutionStage],
      context
    ) as ForecastOutput;

    // Save forecast to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-forecast",
      type: "general",
      data: forecastOutput,
      confidence: 0.8,
    });

    // Publish forecast event to EventPublisher (runtime event bus)
    eventPublisher.publish("forecast-generated", {
      source: "career-copilot-forecast",
      data: forecastOutput,
      confidence: 0.8,
      timestamp: new Date().toISOString(),
    });

    return forecastOutput;
  }
}
