import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { careerCopilotApplicationIntelligenceV1 } from "../../ai/Prompts/career-copilot-application-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface ApplicationIntelligenceInput {
  candidateGraph: any;
  applications: any[];
}

export type ApplicationState = 
  | "detected"
  | "to_prepare"
  | "ready"
  | "application_sent"
  | "application_viewed"
  | "preselection"
  | "interview_scheduled"
  | "interview_completed"
  | "technical_test"
  | "case_study"
  | "final_interview"
  | "offer_received"
  | "negotiation"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "expired"
  | "no_response"
  | "follow_up_recommended"
  | "closed";

export interface TrackedApplication {
  id: string;
  title: string;
  company: string;
  state: ApplicationState;
  previousState?: ApplicationState;
  stateChangeReason: string;
  compatibility: number;
  priority: number;
  probability: number;
  urgency: "immediate" | "this_week" | "this_month" | "flexible";
  effort: string;
  timeRemaining: string;
  currentStage: string;
  risk: string[];
  nextAction: string;
  nextActionReason: string;
  confidence: number;
  dataQuality: "excellent" | "good" | "moderate" | "poor";
  missingData: string[];
  limitations: string[];
  reason: string;
}

export interface PriorityApplication {
  id: string;
  title: string;
  company: string;
  reason: string;
  whyPriority: string;
  whyOthersWait: string;
  recommendedAction: string;
}

export interface ApplicationToFollowUp {
  id: string;
  title: string;
  company: string;
  followUpReason: string;
  suggestedFollowUpDate: string;
  followUpMethod: string;
}

export interface ApplicationToPrepare {
  id: string;
  title: string;
  company: string;
  preparationNeeded: string[];
  estimatedPreparationTime: string;
  reason: string;
}

export interface ApplicationToAbandon {
  id: string;
  title: string;
  company: string;
  reason: string;
  risks: string[];
}

export interface ApplicationForecast {
  applicationId: string;
  probabilityOfResponse: number;
  probabilityOfInterview: number;
  probabilityOfOffer: number;
  probabilityOfHiring: number;
  impactOfFollowUp: string;
  impactOfAdditionalPreparation: string;
  expectedTimeline: string;
  riskFactors: string[];
}

export interface ApplicationAccountability {
  totalApplications: number;
  followUpsPerformed: number;
  followUpsMissed: number;
  interviewsCompleted: number;
  rejections: number;
  acceptances: number;
  averageResponseTime: string;
  conversionRate: number;
  applicationSuccessRate: number;
}

export interface ApplicationStrategyImpact {
  strategyChangeNeeded: boolean;
  recommendedStrategyChange: string;
  reason: string;
}

export interface ApplicationGoalImpact {
  goalsNeedUpdate: boolean;
  recommendedGoalUpdate: string;
  reason: string;
}

export interface ApplicationConfidence {
  overallConfidence: number;
  dataQuality: "excellent" | "good" | "moderate" | "poor";
  missingData: Array<{
    data: string;
    importance: "critical" | "high" | "medium" | "low";
  }>;
  reason: string;
}

export interface ApplicationIntelligence {
  trackedApplications: TrackedApplication[];
  priorityApplication: PriorityApplication;
  applicationsToFollowUp: ApplicationToFollowUp[];
  applicationsToPrepare: ApplicationToPrepare[];
  applicationsToAbandon: ApplicationToAbandon[];
  applicationForecasts: ApplicationForecast[];
  accountability: ApplicationAccountability;
  strategyImpact: ApplicationStrategyImpact;
  goalImpact: ApplicationGoalImpact;
  confidence: ApplicationConfidence;
  recommendations: Array<{
    recommendation: string;
    type: "preparation" | "follow_up" | "interview" | "negotiation" | "decision" | "strategy";
    priority: "critical" | "high" | "medium" | "low";
    reason: string;
    confidence: number;
  }>;
}

/**
 * Application Intelligence Engine
 * 
 * Analyzes, tracks, qualifies, prioritizes and pilots job applications from end to end.
 * Reuses existing AIOrchestrator, CandidateAIBrain, and EventBus.
 * No new storage or parallel memory - integrates with existing architecture.
 */
export class CareerCopilotApplicationIntelligenceEngine {
  private static applicationHistory: ApplicationIntelligence[] = [];

  /**
   * Analyze application intelligence
   */
  static async analyzeApplicationIntelligence(input: ApplicationIntelligenceInput): Promise<ApplicationIntelligence> {
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

    // Format strategy history
    const strategyHistoryText = strategyHistory.length > 0
      ? strategyHistory.slice(-5).map((entry: any) => `${entry.currentStrategy}`).join("\n")
      : "No strategy history available";

    // Format priority history (simplified)
    const priorityHistoryText = "No priority history available";

    // Format goal history (simplified)
    const goalHistoryText = "No goal history available";

    // Format current goals (simplified)
    const currentGoalsText = "No current goals available";

    // Format market data (simplified)
    const marketData = "No market data available";

    // Format opportunity data (simplified)
    const priorityOpportunity = "No priority opportunity available";
    const compatibleOpportunities = "No compatible opportunities available";
    const opportunitiesToPrepare = "No opportunities to prepare available";
    const opportunityMarketContext = "No opportunity market context available";

    // Format applications data
    const applicationsData = input.applications && input.applications.length > 0
      ? JSON.stringify(input.applications).substring(0, 1000)
      : "No applications data available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Application optimization: ${successIntelligence.applicationOptimization.priorityApplication}, Energy focus: ${successIntelligence.applicationOptimization.energyFocus}, Accelerate: ${successIntelligence.applicationOptimization.accelerate}, Slow down: ${successIntelligence.applicationOptimization.slowDown}, Abandon: ${successIntelligence.applicationOptimization.abandon}`
      : "No success intelligence available";

    // Extract scenario intelligence for multi-future application context
    const scenarioContext = "No scenario intelligence available";

    // Get constraint intelligence for constraint-aware application analysis
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

    // Get resource intelligence for resource-aware application analysis
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

    // Call intelligenceCoreModule with application intelligence prompt
    const promptTemplate = careerCopilotApplicationIntelligenceV1.system || careerCopilotApplicationIntelligenceV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase(promptTemplate);

    const request: IntelligenceRequest = {
      id: `application-intelligence-${Date.now()}`,
      type: "application-intelligence",
      input: {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
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
        successContext,
        scenarioContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error("Failed to analyze application intelligence");
    }

    const applicationIntelligence = result.output as ApplicationIntelligence;

    // Convert confidence string to number
    const confidenceValue = applicationIntelligence.confidence.overallConfidence;

    // Save to CandidateAIBrain
    await candidateAIBrain.addObservation({
      source: "career-copilot-application-intelligence",
      data: applicationIntelligence,
      confidence: confidenceValue,
      timestamp: new Date(),
      type: "career",
      metadata: {
        applicationCount: applicationIntelligence.trackedApplications.length,
        priorityApplication: applicationIntelligence.priorityApplication.title,
        followUpsNeeded: applicationIntelligence.applicationsToFollowUp.length,
      },
    });

    // Publish event
    const eventPublisher = new EventPublisher();
    await eventPublisher.publish("observation_created", {
      id: `application-intelligence-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-application-intelligence",
        observationType: "career",
        data: applicationIntelligence,
        confidence: confidenceValue,
      },
    });

    // Maintain history
    this.applicationHistory.push(applicationIntelligence);
    if (this.applicationHistory.length > 20) {
      this.applicationHistory = this.applicationHistory.slice(-20);
    }

    return applicationIntelligence;
  }

  /**
   * Get current application intelligence
   */
  static getCurrentApplicationIntelligence(): ApplicationIntelligence | null {
    const observations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-application-intelligence")
      .slice(-1);
    
    return observations.length > 0 && observations[0]
      ? observations[0].data as ApplicationIntelligence
      : null;
  }

  /**
   * Get application intelligence history
   */
  static getApplicationIntelligenceHistory(): ApplicationIntelligence[] {
    return this.applicationHistory;
  }

  /**
   * Get priority application
   */
  static getPriorityApplication(): PriorityApplication | null {
    const currentIntelligence = this.getCurrentApplicationIntelligence();
    return currentIntelligence ? currentIntelligence.priorityApplication : null;
  }

  /**
   * Get applications needing follow-up
   */
  static getApplicationsToFollowUp(): ApplicationToFollowUp[] {
    const currentIntelligence = this.getCurrentApplicationIntelligence();
    return currentIntelligence ? currentIntelligence.applicationsToFollowUp : [];
  }

  /**
   * Get applications needing preparation
   */
  static getApplicationsToPrepare(): ApplicationToPrepare[] {
    const currentIntelligence = this.getCurrentApplicationIntelligence();
    return currentIntelligence ? currentIntelligence.applicationsToPrepare : [];
  }

  /**
   * Get application accountability metrics
   */
  static getApplicationAccountability(): ApplicationAccountability | null {
    const currentIntelligence = this.getCurrentApplicationIntelligence();
    return currentIntelligence ? currentIntelligence.accountability : null;
  }
}
