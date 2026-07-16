// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotGoalIntelligenceV1 } from "../../ai/Prompts/career-copilot-goal-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "./careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotAccountabilityEngine } from "./careerCopilotAccountabilityEngine";
import { CareerCopilotSelfReviewEngine } from "./careerCopilotSelfReviewEngine";
import { CareerCopilotConfidenceEngine } from "./careerCopilotConfidenceEngine";
import { CareerCopilotMetaIntelligenceEngine } from "./careerCopilotMetaIntelligenceEngine";
import { CareerCopilotMarketIntelligenceEngine } from "./careerCopilotMarketIntelligenceEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface Goal {
  id: string;
  description: string;
  reason: string;
  expectedImpact: string;
  priority: "critical" | "high" | "medium" | "low";
  urgency: "immediate" | "soon" | "eventual" | "flexible";
  dependencies: string[];
  risk: string;
  strategicValue: string;
  status: "active" | "achieved" | "abandoned" | "obsolete" | "impossible" | "secondary" | "contradictory" | "needs_splitting";
  confidence: number;
}

export interface NewGoal extends Goal {
  trigger: string;
}

export interface CompletedGoal {
  id: string;
  description: string;
  completionDate: string;
  impact: string;
  reason: string;
}

export interface MergedGoal {
  originalGoals: string[];
  mergedGoal: string;
  reason: string;
  date: string;
}

export interface DeletedGoal {
  id: string;
  description: string;
  reason: string;
  since: string;
  replacement: string;
}

export interface PostponedGoal {
  id: string;
  description: string;
  reason: string;
  until: string;
}

export interface GoalOfTheMoment extends Goal {
  priority: "critical" | "high" | "medium" | "low";
  urgency: "immediate" | "soon" | "eventual" | "flexible";
  confidence: number;
}

export interface ChangeReason {
  type: string;
  description: string;
  dataUsed: string[];
  analysesChanged: string[];
  confidence: number;
  missingData: string[];
}

export interface GoalIntelligenceInput {
  candidateGraph: any;
  currentGoals?: Goal[];
  currentForecast?: any;
  currentProgressionPlan?: any;
  currentDigitalTwin?: any;
}

export interface GoalIntelligenceOutput {
  primaryGoal: Goal;
  secondaryGoals: Goal[];
  newGoals: NewGoal[];
  completedGoals: CompletedGoal[];
  mergedGoals: MergedGoal[];
  deletedGoals: DeletedGoal[];
  postponedGoals: PostponedGoal[];
  goalOfTheMoment: GoalOfTheMoment;
  changeReasons: ChangeReason[];
  globalConfidence: number;
  goalRecommendations: string[];
}

/**
 * Career Copilot Goal Intelligence Engine
 * 
 * Transforms candidate goals into a living system that can understand, detect, merge, split,
 * reorder, and create goals automatically based on changing circumstances.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotGoalIntelligenceEngine {
  /**
   * Analyze and manage goals intelligently
   */
  static async manageGoals(input: GoalIntelligenceInput): Promise<GoalIntelligenceOutput> {
    // Extract data from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract current strategy from Adaptive Strategy Engine
    const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy() || "No current strategy defined";

    // Extract previous strategy from Adaptive Strategy Engine
    const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory();
    const previousStrategy = strategyHistory.length > 1 ? JSON.stringify(strategyHistory[strategyHistory.length - 2]) : "No previous strategy";

    // Extract current priority from Decision Intelligence Engine
    const currentPriority = CareerCopilotDecisionIntelligenceEngine.getCurrentPriority();
    const currentPriorityText = currentPriority
      ? `${currentPriority.absolutePriority} (${currentPriority.priorityReason})`
      : "No current priority defined";

    // Extract previous priorities from Decision Intelligence Engine
    const priorityHistory = CareerCopilotDecisionIntelligenceEngine.getPriorityHistory()
      .map(priority => `${priority.absolutePriority}: ${priority.priorityReason}`)
      .join("\n") || "No priority history";

    // Extract current commitments from Accountability Engine
    const currentCommitments = CareerCopilotAccountabilityEngine.getCurrentCommitments();
    const currentCommitmentsText = currentCommitments
      ? `Completion Rate: ${currentCommitments.completionRate}%
Behavioral Pattern: ${currentCommitments.behavioralPattern}
Current Commitments: ${currentCommitments.currentCommitments.map(c => `${c.description} (${c.state})`).join(", ")}`
      : "No current commitments available";

    // Extract previous commitments from Accountability Engine
    const commitmentHistory = CareerCopilotAccountabilityEngine.getCommitmentHistory()
      .map(commitment => `Completion Rate: ${commitment.completionRate}%, Pattern: ${commitment.behavioralPattern}`)
      .join("\n") || "No commitment history";

    // Extract current conclusions from Self Review Engine
    const currentConclusions = CareerCopilotSelfReviewEngine.getCurrentConclusions();
    const currentConclusionsText = currentConclusions
      ? `Confirmed: ${currentConclusions.confirmedConclusions.length}
Revised: ${currentConclusions.revisedConclusions.length}
Abandoned: ${currentConclusions.abandonedConclusions.length}
New: ${currentConclusions.newConclusions.length}
Overall Confidence: ${currentConclusions.overallConfidence}%`
      : "No current conclusions available";

    // Extract conclusion history from Self Review Engine
    const conclusionHistory = CareerCopilotSelfReviewEngine.getConclusionHistory()
      .map(conclusion => `Confirmed: ${conclusion.confirmedConclusions.length}, Revised: ${conclusion.revisedConclusions.length}, Abandoned: ${conclusion.abandonedConclusions.length}`)
      .join("\n") || "No conclusion history";

    // Extract current confidence from Confidence Engine
    const currentConfidence = CareerCopilotConfidenceEngine.getCurrentConfidence();
    const currentConfidenceText = currentConfidence
      ? `Global Confidence: ${currentConfidence.globalConfidence}%
Level: ${currentConfidence.confidenceLevel}
Reliable Domains: ${currentConfidence.reliableDomains.map(d => d.domain).join(", ") || "None"}
Uncertain Domains: ${currentConfidence.uncertainDomains.map(d => d.domain).join(", ") || "None"}`
      : "No current confidence available";

    // Extract confidence history from Confidence Engine
    const confidenceHistory = CareerCopilotConfidenceEngine.getConfidenceHistory()
      .map(confidence => `Global: ${confidence.globalConfidence}%, Level: ${confidence.confidenceLevel}`)
      .join("\n") || "No confidence history";

    // Extract meta intelligence to account for analysis coherence
    const metaIntelligence = CareerCopilotMetaIntelligenceEngine.getCurrentMetaIntelligence();
    const globalCoherence = metaIntelligence
      ? metaIntelligence.globalCoherence
      : 0;
    const detectedIncoherencies = metaIntelligence
      ? metaIntelligence.detectedIncoherencies.map(inc => `${inc.type}: ${inc.description} (${inc.severity})`).join("\n")
      : "No incoherencies detected";
    const resolvedConflicts = metaIntelligence
      ? metaIntelligence.resolvedConflicts.map(conf => `${conf.type}: ${conf.resolution}`).join("\n")
      : "No conflicts resolved";

    // Extract current forecast if provided
    const currentForecastText = input.currentForecast
      ? JSON.stringify(input.currentForecast).substring(0, 500) + "..."
      : "No current forecast available";

    // Extract current progression plan if provided
    const currentProgressionPlanText = input.currentProgressionPlan
      ? JSON.stringify(input.currentProgressionPlan).substring(0, 500) + "..."
      : "No current progression plan available";

    // Extract current digital twin if provided
    const currentDigitalTwinText = input.currentDigitalTwin
      ? JSON.stringify(input.currentDigitalTwin).substring(0, 500) + "..."
      : "No current digital twin available";

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
    const opportunityGoalImpact = opportunityIntelligence
      ? opportunityIntelligence.goalImpact.goalsNeedReorganization
        ? "Goal reorganization needed based on opportunities"
        : "Current goals remain relevant to opportunities"
      : "No opportunity goal impact available";

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
    const applicationGoalImpact = applicationIntelligence
      ? applicationIntelligence.goalImpact.goalsNeedUpdate
        ? "Goal update needed based on applications"
        : "Current goals remain relevant to applications"
      : "No application goal impact available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Too ambitious: ${successIntelligence.goalOptimization.tooAmbitious.join(", ")}, Low profit: ${successIntelligence.goalOptimization.lowProfit.join(", ")}, Exceeded: ${successIntelligence.goalOptimization.exceeded.join(", ")}, Very profitable: ${successIntelligence.goalOptimization.veryProfitable.join(", ")}, Accelerator: ${successIntelligence.goalOptimization.accelerator.join(", ")}, Blocking: ${successIntelligence.goalOptimization.blocking.join(", ")}`
      : "No success intelligence available";

    // Extract scenario intelligence for multi-future goal context
    const scenarioObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-1);
    const scenarioContext = scenarioObs.length > 0 && scenarioObs[0]
      ? `Recommended scenario: ${(scenarioObs[0].data as any).recommendation?.recommendedScenario || "None"}, Best scenario: ${(scenarioObs[0].data as any).comparison?.bestScenario || "None"}, Success maximization: ${(scenarioObs[0].data as any).recommendation?.successMaximization || "None"}`
      : "No scenario intelligence available";

    // Get constraint intelligence for constraint-aware goal setting
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

    // Get resource intelligence for resource-aware goal setting
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

    // Extract current goals if provided
    const currentGoalsText = input.currentGoals
      ? input.currentGoals.map(goal => `${goal.description} (${goal.status}, priority: ${goal.priority})`).join("\n")
      : "No current goals available";

    // Extract goal history from Brain
    const goalHistory = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-goal-intelligence")
      .slice(-5)
      .map(obs => JSON.stringify(obs.data).substring(0, 200) + "...")
      .join("\n") || "No goal history";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(-10)
      .map(obs => `${obs.timestamp.toISOString()}: ${obs.type} - ${JSON.stringify(obs.data).substring(0, 50)}...`);

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

    const result = await aiOrchestrator.execute<GoalIntelligenceOutput>(
      careerCopilotGoalIntelligenceV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        currentStrategy,
        previousStrategy,
        currentPriority: currentPriorityText,
        previousPriorities: priorityHistory,
        currentCommitments: currentCommitmentsText,
        previousCommitments: commitmentHistory,
        currentConclusions: currentConclusionsText,
        conclusionHistory,
        currentConfidence: currentConfidenceText,
        confidenceHistory,
        currentForecast: currentForecastText,
        currentProgressionPlan: currentProgressionPlanText,
        currentDigitalTwin: currentDigitalTwinText,
        recentEvents: recentEvents.join("\n"),
        currentGoals: currentGoalsText,
        goalHistory,
        marketTrends,
        emergingSkills,
        marketOpportunities,
        marketRisks,
        strategyImpact,
        priorityOpportunity,
        compatibleOpportunities,
        opportunitiesToPrepare,
        opportunitiesToAvoid,
        opportunityGoalImpact,
        priorityApplication,
        applicationsToFollowUp,
        applicationsToPrepare,
        applicationsToAbandon,
        applicationGoalImpact,
        successContext,
        scenarioContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-goal-intelligence",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to manage goals");
    }

    const goalIntelligenceData = result.data;

    // Save goal intelligence evaluation to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-goal-intelligence",
      type: "career",
      data: goalIntelligenceData,
      confidence: goalIntelligenceData.globalConfidence / 100,
    });

    // Publish goal intelligence events to EventBus
    if (goalIntelligenceData.newGoals.length > 0) {
      const newGoalsEvent: ObservationCreatedEvent = {
        id: `new-goals-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-goal-intelligence",
          observationType: "career",
          data: {
            newGoals: goalIntelligenceData.newGoals,
            globalConfidence: goalIntelligenceData.globalConfidence,
          },
          confidence: goalIntelligenceData.globalConfidence / 100,
        },
      };

      eventBus.publish(newGoalsEvent);
    }

    if (goalIntelligenceData.mergedGoals.length > 0) {
      const mergedGoalsEvent: ObservationCreatedEvent = {
        id: `merged-goals-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-goal-intelligence",
          observationType: "career",
          data: {
            mergedGoals: goalIntelligenceData.mergedGoals,
            globalConfidence: goalIntelligenceData.globalConfidence,
          },
          confidence: goalIntelligenceData.globalConfidence / 100,
        },
      };

      eventBus.publish(mergedGoalsEvent);
    }

    if (goalIntelligenceData.deletedGoals.length > 0) {
      const deletedGoalsEvent: ObservationCreatedEvent = {
        id: `deleted-goals-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-goal-intelligence",
          observationType: "career",
          data: {
            deletedGoals: goalIntelligenceData.deletedGoals,
            globalConfidence: goalIntelligenceData.globalConfidence,
          },
          confidence: goalIntelligenceData.globalConfidence / 100,
        },
      };

      eventBus.publish(deletedGoalsEvent);
    }

    return goalIntelligenceData;
  }

  /**
   * Get current goal intelligence from Brain
   */
  static getCurrentGoalIntelligence(): GoalIntelligenceOutput | null {
    const currentGoalIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-goal-intelligence")
      .slice(-1);

    if (currentGoalIntelligenceObs.length > 0 && currentGoalIntelligenceObs[0]) {
      return currentGoalIntelligenceObs[0].data as GoalIntelligenceOutput;
    }

    return null;
  }

  /**
   * Get goal intelligence history from Brain
   */
  static getGoalIntelligenceHistory(): GoalIntelligenceOutput[] {
    const goalIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-goal-intelligence")
      .slice(-10);

    return goalIntelligenceObs.map(obs => obs.data as GoalIntelligenceOutput);
  }
}
