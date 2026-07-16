// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotSelfReviewV1 } from "../../ai/Prompts/career-copilot-self-review-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotMetaIntelligenceEngine } from "./careerCopilotMetaIntelligenceEngine";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "./careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotAccountabilityEngine } from "./careerCopilotAccountabilityEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";

export interface PreviousConclusion {
  id: string;
  conclusion: string;
  status: "confirmed" | "revised" | "abandoned" | "invalidated" | "reinforced" | "replaced";
  date: string;
  confidence: number;
}

export interface RevisedConclusion {
  id: string;
  oldConclusion: string;
  newConclusion: string;
  reason: string;
  observations: string[];
  confidence: number;
}

export interface ConfirmedConclusion {
  id: string;
  conclusion: string;
  reason: string;
  observations: string[];
  confidence: number;
}

export interface AbandonedConclusion {
  id: string;
  conclusion: string;
  reason: string;
  observations: string[];
  confidence: number;
}

export interface NewConclusion {
  id: string;
  conclusion: string;
  reason: string;
  observations: string[];
  confidence: number;
}

export interface ConclusionChange {
  type: "confirmation" | "contradiction" | "reinforcement" | "weakening" | "replacement";
  oldConclusion: string;
  newConclusion: string;
  observations: string[];
  explanation: string;
  confidence: number;
}

export interface SelfReviewInput {
  candidateGraph: any;
  currentAnalysis: string;
}

export interface SelfReviewOutput {
  previousConclusions: PreviousConclusion[];
  revisedConclusions: RevisedConclusion[];
  confirmedConclusions: ConfirmedConclusion[];
  abandonedConclusions: AbandonedConclusion[];
  newConclusions: NewConclusion[];
  conclusionChanges: ConclusionChange[];
  overallConfidence: number;
  limitations: string[];
  missingData: string[];
}

/**
 * Career Copilot Self Review Engine
 * 
 * Evaluates previous conclusions, detects when they need revision, and explains changes transparently.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotSelfReviewEngine {
  /**
   * Evaluate and review conclusions
   */
  static async reviewConclusions(input: SelfReviewInput): Promise<SelfReviewOutput> {
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

    // Extract previous conclusions from Brain
    const previousConclusionsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-self-review")
      .slice(-5);
    const previousConclusions = previousConclusionsObs.length > 0 && previousConclusionsObs[0]
      ? JSON.stringify(previousConclusionsObs[0].data).substring(0, 500) + "..."
      : "No previous conclusions available";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(-10)
      .map(obs => `${obs.timestamp.toISOString()}: ${obs.type} - ${JSON.stringify(obs.data).substring(0, 50)}...`);

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

    // Extract meta intelligence to trigger automatic re-evaluation when conclusions change
    const metaIntelligence = CareerCopilotMetaIntelligenceEngine.getCurrentMetaIntelligence();
    const globalCoherence = metaIntelligence
      ? metaIntelligence.globalCoherence
      : 0;
    const synchronizationActions = metaIntelligence
      ? metaIntelligence.synchronizationActions
      : [];

    // Extract opportunity intelligence to review opportunity-related conclusions
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const priorityOpportunity = opportunityIntelligence
      ? opportunityIntelligence.priorityOpportunity.title
      : "No priority opportunity available";
    const opportunitiesToPrepare = opportunityIntelligence
      ? opportunityIntelligence.opportunitiesToPrepare.map((o: any) => o.title).join(", ")
      : "No opportunities to prepare available";
    const opportunitiesToAvoid = opportunityIntelligence
      ? opportunityIntelligence.opportunitiesToAvoid.map((o: any) => o.title).join(", ")
      : "No opportunities to avoid available";
    const opportunityConclusions = opportunityIntelligence
      ? `Opportunities viewed: ${opportunityIntelligence.accountabilityTracking.opportunitiesViewed}, prepared: ${opportunityIntelligence.accountabilityTracking.opportunitiesPrepared}, ignored: ${opportunityIntelligence.accountabilityTracking.opportunitiesIgnored}, refused: ${opportunityIntelligence.accountabilityTracking.opportunitiesRefused}, accepted: ${opportunityIntelligence.accountabilityTracking.opportunitiesAccepted}, abandoned: ${opportunityIntelligence.accountabilityTracking.opportunitiesAbandoned}, expired: ${opportunityIntelligence.accountabilityTracking.opportunitiesExpired}, completed: ${opportunityIntelligence.accountabilityTracking.opportunitiesCompleted}`
      : "No opportunity conclusions available";

    // Extract application intelligence to review application-related conclusions
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
    const applicationConclusions = applicationIntelligence
      ? `Applications submitted: ${applicationIntelligence.accountability.totalApplications}, follow-ups performed: ${applicationIntelligence.accountability.followUpsPerformed}, interviews completed: ${applicationIntelligence.accountability.interviewsCompleted}, conversion rate: ${applicationIntelligence.accountability.conversionRate}%`
      : "No application conclusions available";

       // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment}, Quick wins: ${successIntelligence.quickWins.map((w: any) => w.action).join(", ")}, Long-term gains: ${successIntelligence.longTermGains.map((g: any) => g.action).join(", ")}`
      : "No success intelligence available";

    // Get constraint intelligence for constraint-aware conclusion review
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

    // Get resource intelligence for resource-aware conclusion review
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

    // Get knowledge evolution for knowledge-aware conclusion review
    let knowledgeEvolutionContext = null;
    try {
      const knowledgeEvolution = CareerCopilotKnowledgeEvolutionEngine.getLastKnowledgeEvolution();
      if (knowledgeEvolution) {
        knowledgeEvolutionContext = {
          knowledgeSummary: knowledgeEvolution.knowledgeSummary,
          confirmedKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "confirmed")?.knowledgeItems.map(k => ({
            description: k.description,
            confidence: k.confidence.current,
          })) || [],
          obsoleteKnowledge: knowledgeEvolution.knowledgeByState.find(s => s.state === "obsolete")?.knowledgeItems.map(k => ({
            description: k.description,
            reason: k.reasonForState,
          })) || [],
          knowledgeHealthScore: knowledgeEvolution.knowledgeSummary.healthScore,
        };
      }
    } catch (error) {
      console.error("Failed to get knowledge evolution:", error);
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

    const result = await aiOrchestrator.execute<SelfReviewOutput>(
      careerCopilotSelfReviewV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        previousConclusions,
        currentAnalysis: input.currentAnalysis,
        recentEvents: recentEvents.join("\n"),
        currentStrategy,
        previousStrategy,
        currentPriority: currentPriorityText,
        previousPriorities: priorityHistory,
        currentCommitments: currentCommitmentsText,
        previousCommitments: commitmentHistory,
        globalCoherence: globalCoherence.toString(),
        synchronizationActions: synchronizationActions.map(action => `${action.action}: ${action.targetAnalysis} ← ${action.sourceAnalysis} (${action.reason})`).join("\n"),
        priorityOpportunity,
        opportunitiesToPrepare,
        opportunitiesToAvoid,
        opportunityConclusions,
        priorityApplication,
        applicationsToFollowUp,
        applicationsToPrepare,
        applicationsToAbandon,
        applicationConclusions,
        successContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
        knowledgeEvolutionContext: JSON.stringify(knowledgeEvolutionContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-self-review",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to review conclusions");
    }

    const reviewData = result.data;

    // Save conclusion review to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-self-review",
      type: "career",
      data: reviewData,
      confidence: reviewData.overallConfidence / 100,
    });

    // Publish conclusion change events to EventBus
    reviewData.conclusionChanges.forEach(change => {
      const conclusionChangeEvent: ObservationCreatedEvent = {
        id: `conclusion-change-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-self-review",
          observationType: "career",
          data: {
            changeType: change.type,
            oldConclusion: change.oldConclusion,
            newConclusion: change.newConclusion,
            explanation: change.explanation,
            observations: change.observations,
            confidence: change.confidence,
          },
          confidence: change.confidence / 100,
        },
      };

      eventBus.publish(conclusionChangeEvent);
    });

    return reviewData;
  }

  /**
   * Get current conclusions from Brain
   */
  static getCurrentConclusions(): SelfReviewOutput | null {
    const currentConclusionsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-self-review")
      .slice(-1);

    if (currentConclusionsObs.length > 0 && currentConclusionsObs[0]) {
      return currentConclusionsObs[0].data as SelfReviewOutput;
    }

    return null;
  }

  /**
   * Get conclusion history from Brain
   */
  static getConclusionHistory(): SelfReviewOutput[] {
    const conclusionObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-self-review")
      .slice(-10);

    return conclusionObs.map(obs => obs.data as SelfReviewOutput);
  }
}
