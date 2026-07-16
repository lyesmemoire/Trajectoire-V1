// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotAccountabilityV1 } from "../../ai/Prompts/career-copilot-accountability-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "./careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotSelfReviewEngine } from "./careerCopilotSelfReviewEngine";
import { CareerCopilotConfidenceEngine } from "./careerCopilotConfidenceEngine";
import { CareerCopilotMetaIntelligenceEngine } from "./careerCopilotMetaIntelligenceEngine";
import { CareerCopilotGoalIntelligenceEngine } from "./careerCopilotGoalIntelligenceEngine";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface AccountabilityInput {
  candidateGraph: any;
}

export interface Commitment {
  id: string;
  description: string;
  state: "pending" | "in_progress" | "completed" | "abandoned" | "replaced" | "obsolete" | "delayed";
  createdDate: string;
  expectedCompletion: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface CompletedCommitment {
  id: string;
  description: string;
  completedDate: string;
  timeToComplete: string;
  impact: string;
}

export interface PendingCommitment {
  id: string;
  description: string;
  daysPending: number;
  blockingFactor: string;
}

export interface AbandonedCommitment {
  id: string;
  description: string;
  abandonedDate: string;
  reason: string;
}

export interface ObsoleteCommitment {
  id: string;
  description: string;
  reason: string;
}

export interface CoachingAdaptation {
  approach: string;
  goalComplexity: string;
  followUpFrequency: string;
  encouragementLevel: string;
  timelineAdjustment: string;
}

export interface FollowUpAction {
  action: string;
  explanation: string;
  urgency: "high" | "medium" | "low";
}

export interface AccountabilityOutput {
  currentCommitments: Commitment[];
  completedCommitments: CompletedCommitment[];
  pendingCommitments: PendingCommitment[];
  abandonedCommitments: AbandonedCommitment[];
  obsoleteCommitments: ObsoleteCommitment[];
  completionRate: number;
  behavioralPattern: string;
  coachingAdaptation: CoachingAdaptation;
  followUpActions: FollowUpAction[];
  nextCheckDate: string;
  confidence: number;
  limitations: string[];
  missingData: string[];
}

/**
 * Career Copilot Accountability Engine
 * 
 * Tracks commitments, detects actions, provides intelligent follow-ups, and adapts coaching based on actual behavior.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotAccountabilityEngine {
  /**
   * Track commitments and determine accountability status
   */
  static async trackCommitments(input: AccountabilityInput): Promise<AccountabilityOutput> {
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

    // Extract current priority from Decision Intelligence Engine
    const currentPriority = CareerCopilotDecisionIntelligenceEngine.getCurrentPriority();
    const currentPriorityText = currentPriority
      ? `${currentPriority.absolutePriority} (${currentPriority.priorityReason})`
      : "No current priority defined";

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

    // Extract previous commitments from Brain
    const previousCommitmentsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-accountability")
      .slice(-5);
    const previousCommitments = previousCommitmentsObs.length > 0 && previousCommitmentsObs[0]
      ? JSON.stringify(previousCommitmentsObs[0].data).substring(0, 500) + "..."
      : "No previous commitments available";

    // Extract current conclusions from Self Review Engine to identify obsolete commitments
    const currentConclusions = CareerCopilotSelfReviewEngine.getCurrentConclusions();
    const obsoleteConclusions = currentConclusions
      ? currentConclusions.abandonedConclusions.map(c => c.conclusion).join(", ")
      : "";

    // Extract current confidence from Confidence Engine to adapt follow-up intensity
    const currentConfidence = CareerCopilotConfidenceEngine.getCurrentConfidence();
    const confidenceLevel = currentConfidence
      ? currentConfidence.confidenceLevel
      : "moderate";
    const uncertainDomains = currentConfidence
      ? currentConfidence.uncertainDomains.map((d: any) => d.domain).join(", ")
      : "";

    // Extract meta intelligence to filter obsolete commitments
    const metaIntelligence = CareerCopilotMetaIntelligenceEngine.getCurrentMetaIntelligence();
    const globalCoherence = metaIntelligence
      ? metaIntelligence.globalCoherence
      : 0;
    const synchronizationActions = metaIntelligence
      ? metaIntelligence.synchronizationActions
      : [];

    // Extract goal intelligence to only follow valid goals
    const goalIntelligence = CareerCopilotGoalIntelligenceEngine.getCurrentGoalIntelligence();
    const primaryGoal = goalIntelligence
      ? goalIntelligence.primaryGoal.description
      : "No primary goal defined";
    const goalOfTheMoment = goalIntelligence
      ? goalIntelligence.goalOfTheMoment.description
      : "No goal of the moment defined";
    const validGoals = goalIntelligence
      ? [...goalIntelligence.secondaryGoals.filter(g => g.status === "active").map(g => g.description), ...goalIntelligence.newGoals.map(g => g.description)]
      : [];
    const deletedGoals = goalIntelligence
      ? goalIntelligence.deletedGoals.map(g => g.description)
      : [];
    const completedGoals = goalIntelligence
      ? goalIntelligence.completedGoals.map(g => g.description)
      : [];

    // Extract opportunity intelligence to track opportunity-related commitments
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const accountabilityTracking = opportunityIntelligence
      ? `Opportunities viewed: ${opportunityIntelligence.accountabilityTracking.opportunitiesViewed}, prepared: ${opportunityIntelligence.accountabilityTracking.opportunitiesPrepared}, ignored: ${opportunityIntelligence.accountabilityTracking.opportunitiesIgnored}, refused: ${opportunityIntelligence.accountabilityTracking.opportunitiesRefused}, accepted: ${opportunityIntelligence.accountabilityTracking.opportunitiesAccepted}, abandoned: ${opportunityIntelligence.accountabilityTracking.opportunitiesAbandoned}, expired: ${opportunityIntelligence.accountabilityTracking.opportunitiesExpired}, completed: ${opportunityIntelligence.accountabilityTracking.opportunitiesCompleted}`
      : "No opportunity tracking available";
    const opportunitiesToPrepare = opportunityIntelligence
      ? opportunityIntelligence.opportunitiesToPrepare.map((o: any) => o.title).join(", ")
      : "No opportunities to prepare available";

    // Extract application intelligence to track application-related commitments
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const applicationAccountability = applicationIntelligence
      ? `Applications submitted: ${applicationIntelligence.accountability.totalApplications}, follow-ups performed: ${applicationIntelligence.accountability.followUpsPerformed}, interviews completed: ${applicationIntelligence.accountability.interviewsCompleted}, conversion rate: ${applicationIntelligence.accountability.conversionRate}%`
      : "No application tracking available";
    const applicationsToFollowUp = applicationIntelligence
      ? applicationIntelligence.applicationsToFollowUp.map((a: any) => a.title).join(", ")
      : "No applications to follow up available";
    const applicationsToPrepare = applicationIntelligence
      ? applicationIntelligence.applicationsToPrepare.map((a: any) => a.title).join(", ")
      : "No applications to prepare available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Efforts made: ${successIntelligence.accountability.effortsMade}, Results obtained: ${successIntelligence.accountability.resultsObtained}, Real yield: ${successIntelligence.accountability.realYield}, Effective habits: ${successIntelligence.accountability.effectiveHabits.join(", ")}, Ineffective habits: ${successIntelligence.accountability.ineffectiveHabits.join(", ")}`
      : "No success intelligence available";

    // Get constraint intelligence for constraint-aware commitment tracking
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

    // Get resource intelligence for resource-aware commitment tracking
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
`;

    const result = await aiOrchestrator.execute<AccountabilityOutput>(
      careerCopilotAccountabilityV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        recentEvents: recentEvents.join("\n"),
        currentStrategy,
        currentPriority: currentPriorityText,
        progression,
        recommendations,
        previousCommitments,
        obsoleteConclusions,
        confidenceLevel,
        uncertainDomains,
        globalCoherence: globalCoherence.toString(),
        synchronizationActions: synchronizationActions.map(action => `${action.action}: ${action.targetAnalysis} ← ${action.sourceAnalysis} (${action.reason})`).join("\n"),
        primaryGoal,
        goalOfTheMoment,
        validGoals: validGoals.join("\n"),
        deletedGoals: deletedGoals.join("\n"),
        completedGoals: completedGoals.join("\n"),
        accountabilityTracking,
        opportunitiesToPrepare,
        applicationAccountability,
        applicationsToFollowUp,
        applicationsToPrepare,
        successContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-accountability",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to track commitments");
    }

    const accountabilityData = result.data;

    // Save commitment tracking to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-accountability",
      type: "career",
      data: accountabilityData,
      confidence: accountabilityData.confidence / 100,
    });

    // Publish commitment change events to EventBus
    accountabilityData.currentCommitments.forEach(commitment => {
      const commitmentEvent: ObservationCreatedEvent = {
        id: `commitment-${commitment.id}-${Date.now()}`,
        timestamp: new Date(),
        type: "observation_created",
        payload: {
          source: "career-copilot-accountability",
          observationType: "career",
          data: {
            commitmentId: commitment.id,
            state: commitment.state,
            description: commitment.description,
            reason: commitment.reason,
          },
          confidence: accountabilityData.confidence / 100,
        },
      };

      eventBus.publish(commitmentEvent);
    });

    return accountabilityData;
  }

  /**
   * Get current commitments from Brain
   */
  static getCurrentCommitments(): AccountabilityOutput | null {
    const currentCommitmentsObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-accountability")
      .slice(-1);

    if (currentCommitmentsObs.length > 0 && currentCommitmentsObs[0]) {
      return currentCommitmentsObs[0].data as AccountabilityOutput;
    }

    return null;
  }

  /**
   * Get commitment history from Brain
   */
  static getCommitmentHistory(): AccountabilityOutput[] {
    const commitmentObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-accountability")
      .slice(-10);

    return commitmentObs.map(obs => obs.data as AccountabilityOutput);
  }
}
