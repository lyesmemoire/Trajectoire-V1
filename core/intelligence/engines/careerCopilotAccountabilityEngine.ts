import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { BrainContextBuilder } from "../../../lib/intelligence-core/application/BrainContextBuilder";
import { careerCopilotAccountabilityV1 } from "../../ai/Prompts/career-copilot-accountability-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotSelfReviewEngine } from "./careerCopilotSelfReviewEngine";
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
    const brainData = {
      insights: candidateAIBrain.getInsights(),
      observations: candidateAIBrain.getObservations(),
      patterns: candidateAIBrain.getPatterns(),
      goals: candidateAIBrain.getGoals(),
    };

    // Use BrainContextBuilder to build standardized context
    const brainContext = BrainContextBuilder.buildContext(brainData, {
      maxInsights: 5,
      maxObservations: 20,
      maxPatterns: 5,
      maxGoals: 10,
    });

    const historicalObservations = brainContext.engineContext?.recentObservations as string[] || [];

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(-10)
      .map(obs => `${obs.timestamp.toISOString()}: ${obs.type} - ${JSON.stringify(obs.data).substring(0, 50)}...`);

    // Extract current strategy from Adaptive Strategy Engine
    const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy() || "No current strategy defined";

    // Extract current priority (simplified - Decision Intelligence Engine removed)
    const currentPriorityText = "No current priority defined";

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
      ? currentConclusions.abandonedConclusions.map((c: any) => c.conclusion).join(", ")
      : "";

    // Extract current confidence (simplified - Confidence Engine removed)
    const confidenceLevel = "moderate";
    const uncertainDomains = "";

    // Extract meta intelligence (simplified - Meta Intelligence Engine removed)
    const globalCoherence = 0;
    const synchronizationActions: any[] = [];

    // Extract goal intelligence (simplified - Goal Intelligence Engine removed)
    const primaryGoal = "No primary goal defined";
    const goalOfTheMoment = "No goal of the moment defined";
    const validGoals: string[] = [];
    const deletedGoals: string[] = [];
    const completedGoals: string[] = [];

    // Extract opportunity intelligence (simplified - Opportunity Intelligence Engine removed)
    const accountabilityTracking = "No opportunity tracking available";
    const opportunitiesToPrepare = "No opportunities to prepare available";

    // Extract application intelligence (simplified - Application Intelligence Engine removed)
    const applicationAccountability = "No application tracking available";
    const applicationsToFollowUp = "No applications to follow up available";
    const applicationsToPrepare = "No applications to prepare available";

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
`;

    const promptTemplate = careerCopilotAccountabilityV1.system || careerCopilotAccountabilityV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<AccountabilityOutput>(promptTemplate);

    const request: IntelligenceRequest<AccountabilityOutput> = {
      id: `career-copilot-accountability-${Date.now()}`,
      type: "career-copilot-accountability",
      input: input as unknown as AccountabilityOutput,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
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
      throw new Error("Failed to track commitments");
    }

    const accountabilityData = result.output as AccountabilityOutput;

    // Save commitment tracking to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-accountability",
      type: "career",
      data: accountabilityData,
      confidence: accountabilityData.confidence / 100,
    });

    // Publish commitment change events to EventBus
    const eventPublisher = new EventPublisher();
    accountabilityData.currentCommitments.forEach((commitment: Commitment) => {
      eventPublisher.publish("observation_created", {
        source: "career-copilot-accountability",
        observationType: "career",
        data: {
          commitmentId: commitment.id,
          state: commitment.state,
          description: commitment.description,
          reason: commitment.reason,
        },
        confidence: accountabilityData.confidence / 100,
        timestamp: new Date().toISOString(),
      });
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
