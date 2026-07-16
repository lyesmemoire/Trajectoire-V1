// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotDecisionIntelligenceV1 } from "../../ai/Prompts/career-copilot-decision-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotMarketIntelligenceEngine } from "./careerCopilotMarketIntelligenceEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface DecisionIntelligenceInput {
  candidateGraph: any;
}

export interface DecisionIntelligenceOutput {
  absolutePriority: string;
  priorityReason: string;
  expectedImpact: string;
  urgency: "immediate" | "this_week" | "this_month" | "flexible";
  difficulty: "easy" | "moderate" | "hard";
  estimatedTime: string;
  longTermBenefit: string;
  successProbability: number;
  strategyAlignment: number;
  riskOfInaction: string;
  whyNotOthers: string;
  whyNow: string;
  whyLater: string;
  secondaryActions: string[];
  confidence: number;
  limitations: string[];
  missingData: string[];
}

/**
 * Career Copilot Decision Intelligence Engine
 * 
 * Intelligently arbitrates between multiple possibilities and chooses ONE priority.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotDecisionIntelligenceEngine {
  /**
   * Arbitrate and determine the absolute priority
   */
  static async determinePriority(input: DecisionIntelligenceInput): Promise<DecisionIntelligenceOutput> {
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

    // Extract current strategy from Adaptive Strategy Engine
    const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy() || "No current strategy defined";

    // Extract strategy history from Adaptive Strategy Engine
    const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory()
      .map(strategy => `${strategy.currentStrategy} -> ${strategy.proposedStrategy}: ${strategy.changeReason}`)
      .join("\n") || "No strategy history";

    // Extract career forecast from Brain
    const careerForecastObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-forecast")
      .slice(-1);
    const careerForecast = careerForecastObs.length > 0 && careerForecastObs[0]
      ? JSON.stringify(careerForecastObs[0].data).substring(0, 300) + "..."
      : "No career forecast available";

    // Extract progression from Brain
    const progressionObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "progression")
      .slice(-1);
    const progression = progressionObs.length > 0 && progressionObs[0]
      ? JSON.stringify(progressionObs[0].data).substring(0, 300) + "..."
      : "No progression data available";

    // Extract recommendations from Brain
    const recommendationsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "recommendations")
      .slice(-1);
    const recommendations = recommendationsObs.length > 0 && recommendationsObs[0]
      ? JSON.stringify(recommendationsObs[0].data).substring(0, 300) + "..."
      : "No recommendations available";

    // Extract digital twin from Brain
    const digitalTwinObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "digital-twin")
      .slice(-1);
    const digitalTwin = digitalTwinObs.length > 0 && digitalTwinObs[0]
      ? JSON.stringify(digitalTwinObs[0].data).substring(0, 300) + "..."
      : "No digital twin available";

    // Extract daily summary from Brain
    const dailySummaryObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "daily-summary")
      .slice(-1);
    const dailySummary = dailySummaryObs.length > 0 && dailySummaryObs[0]
      ? JSON.stringify(dailySummaryObs[0].data).substring(0, 300) + "..."
      : "No daily summary available";

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

    // Extract opportunity intelligence from Opportunity Intelligence Engine
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const priorityOpportunity = opportunityIntelligence
      ? opportunityIntelligence.priorityOpportunity.title
      : "No priority opportunity available";
    const priorityOpportunityAction = opportunityIntelligence
      ? opportunityIntelligence.priorityOpportunity.recommendedAction
      : "No recommended action available";
    const compatibleOpportunities = opportunityIntelligence
      ? opportunityIntelligence.compatibleOpportunities.map((o: any) => o.title).join(", ")
      : "No compatible opportunities available";
    const opportunitiesToPrepare = opportunityIntelligence
      ? opportunityIntelligence.opportunitiesToPrepare.map((o: any) => o.title).join(", ")
      : "No opportunities to prepare available";

    // Extract application intelligence from Application Intelligence Engine
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const priorityApplication = applicationIntelligence
      ? applicationIntelligence.priorityApplication.title
      : "No priority application available";
    const priorityApplicationAction = applicationIntelligence
      ? applicationIntelligence.priorityApplication.recommendedAction
      : "No recommended action available";
    const applicationsToFollowUp = applicationIntelligence
      ? applicationIntelligence.applicationsToFollowUp.map((a: any) => a.title).join(", ")
      : "No applications to follow up available";
    const applicationsToPrepare = applicationIntelligence
      ? applicationIntelligence.applicationsToPrepare.map((a: any) => a.title).join(", ")
      : "No applications to prepare available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Best result action: ${successIntelligence.decisionArbitration.bestResultAction}, Can wait action: ${successIntelligence.decisionArbitration.canWaitAction}, Little value action: ${successIntelligence.decisionArbitration.littleValueAction}, Enormous yield action: ${successIntelligence.decisionArbitration.enormousYieldAction}`
      : "No success intelligence available";

    // Extract scenario intelligence for multi-future decision context
    const scenarioObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-1);
    const scenarioContext = scenarioObs.length > 0 && scenarioObs[0]
      ? `Recommended scenario: ${(scenarioObs[0].data as any).recommendation?.recommendedScenario || "None"}, Best scenario: ${(scenarioObs[0].data as any).comparison?.bestScenario || "None"}, Success maximization: ${(scenarioObs[0].data as any).recommendation?.successMaximization || "None"}`
      : "No scenario intelligence available";

    // Get constraint intelligence for constraint-aware decision making
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

    // Get resource intelligence for resource-aware decision making
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

    // Extract timeline from Brain
    const timelineObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "timeline")
      .slice(-1);
    const timeline = timelineObs.length > 0 && timelineObs[0]
      ? JSON.stringify(timelineObs[0].data).substring(0, 300) + "..."
      : "No timeline available";

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

    const result = await aiOrchestrator.execute<DecisionIntelligenceOutput>(
      careerCopilotDecisionIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        recentEvents: recentEvents.join("\n"),
        currentStrategy,
        strategyHistory,
        careerForecast,
        progression,
        recommendations,
        digitalTwin,
        dailySummary,
        timeline,
        marketTrends,
        emergingSkills,
        marketOpportunities,
        marketRisks,
        priorityOpportunity,
        priorityOpportunityAction,
        compatibleOpportunities,
        opportunitiesToPrepare,
        priorityApplication,
        priorityApplicationAction,
        applicationsToFollowUp,
        applicationsToPrepare,
        successContext,
        scenarioContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-decision-intelligence",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to determine priority");
    }

    // Get previous priority from Brain
    const previousPriorityObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-decision-intelligence")
      .slice(-1);
    const previousPriority = previousPriorityObs.length > 0 && previousPriorityObs[0]
      ? (previousPriorityObs[0].data as DecisionIntelligenceOutput).absolutePriority
      : null;

    // Save priority decision to Brain as observation every time (not just when changed)
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-decision-intelligence",
      type: "career",
      data: result.data,
      confidence: result.data.confidence / 100,
    });

    // Publish priority change event to EventBus only if priority changed
    if (previousPriority && previousPriority !== result.data.absolutePriority) {
      const priorityChangeEvent: ObservationCreatedEvent = {
        id: `priority-change-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-decision-intelligence",
          observationType: "career",
          data: {
            previousPriority,
            newPriority: result.data.absolutePriority,
            reason: result.data.priorityReason,
          },
          confidence: result.data.confidence / 100,
        },
      };

      eventBus.publish(priorityChangeEvent);
    }

    return result.data;
  }

  /**
   * Get current priority from Brain
   */
  static getCurrentPriority(): DecisionIntelligenceOutput | null {
    const currentPriorityObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-decision-intelligence")
      .slice(-1);

    if (currentPriorityObs.length > 0 && currentPriorityObs[0]) {
      return currentPriorityObs[0].data as DecisionIntelligenceOutput;
    }

    return null;
  }

  /**
   * Get priority history from Brain
   */
  static getPriorityHistory(): DecisionIntelligenceOutput[] {
    const priorityObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-decision-intelligence")
      .slice(-10);

    return priorityObs.map(obs => obs.data as DecisionIntelligenceOutput);
  }
}
