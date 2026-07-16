// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotOpportunityIntelligenceV1 } from "../../ai/Prompts/career-copilot-opportunity-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotAdaptiveStrategyEngine } from "./careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "./careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotGoalIntelligenceEngine } from "./careerCopilotGoalIntelligenceEngine";
import { CareerCopilotMarketIntelligenceEngine } from "./careerCopilotMarketIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface OpportunityIntelligenceInput {
  candidateGraph: any;
  opportunities: any[];
}

export interface AnalyzedOpportunity {
  id: string;
  title: string;
  type: "job_offer" | "internship" | "freelance" | "internal_mobility" | "promotion" | "certification" | "networking" | "conference" | "event" | "mentorship" | "recommendation" | "contact" | "other";
  status: "very_relevant" | "relevant" | "interesting_later" | "to_monitor" | "not_very_relevant" | "not_suitable" | "to_prepare" | "to_avoid" | "to_reconsider" | "obsolete";
  relevance: number;
  difficulty: number;
  compatibility: number;
  preparationLevel: number;
  successProbability: number;
  urgency: "immediate" | "this_week" | "this_month" | "flexible";
  strategicValue: number;
  longTermImpact: string;
  dependencies: string[];
  risks: string[];
  requiredEffort: string;
  estimatedTime: string;
  requiredSkills: string[];
  missingSkills: string[];
  preparationNeeded: string[];
  preparationPlan: {
    steps: Array<{
      action: string;
      timeline: string;
      priority: "critical" | "high" | "medium" | "low";
    }>;
    estimatedPreparationTime: string;
  };
  marketContext: {
    alignedWithTrends: boolean;
    sectorGrowth: string;
    competitionLevel: string;
    marketReasoning: string;
  };
  reason: string;
  whyRecommended: string;
  whyNotRecommended: string;
  confidence: number;
  dataQuality: "excellent" | "good" | "moderate" | "poor";
  missingData: string[];
  limitations: string[];
}

export interface PriorityOpportunity {
  id: string;
  title: string;
  reason: string;
  whyPriority: string;
  whyOthersWait: string;
  recommendedAction: "prepare_now" | "apply_now" | "wait" | "ignore" | "prepare_then_apply";
}

export interface CompatibleOpportunity {
  id: string;
  title: string;
  reason: string;
  ranking: number;
}

export interface OpportunityToPrepare {
  id: string;
  title: string;
  preparationNeeded: string[];
  estimatedPreparationTime: string;
  reason: string;
}

export interface OpportunityToAvoid {
  id: string;
  title: string;
  reason: string;
  risks: string[];
}

export interface RecentlyDetected {
  id: string;
  title: string;
  detectionReason: string;
  detectionDate: string;
}

export interface StrategyImpact {
  strategyChangeNeeded: boolean;
  recommendedStrategyChange: string;
  reason: string;
}

export interface GoalImpact {
  goalsNeedReorganization: boolean;
  recommendedGoalChanges: string[];
  reason: string;
}

export interface AccountabilityTracking {
  opportunitiesViewed: number;
  opportunitiesPrepared: number;
  opportunitiesIgnored: number;
  opportunitiesRefused: number;
  opportunitiesAccepted: number;
  opportunitiesAbandoned: number;
  opportunitiesExpired: number;
  opportunitiesCompleted: number;
}

export interface OpportunityConfidence {
  overallConfidence: "very_high" | "high" | "moderate" | "low" | "insufficient";
  dataQuality: "excellent" | "good" | "moderate" | "poor";
  missingData: Array<{
    data: string;
    importance: "critical" | "high" | "medium" | "low";
  }>;
  reason: string;
}

export interface OpportunityRecommendation {
  recommendation: string;
  type: "preparation" | "application" | "waiting" | "ignoring" | "strategy" | "goal";
  priority: "critical" | "high" | "medium" | "low";
  opportunityInfluence: string;
  reason: string;
  confidence: "high" | "medium" | "low";
}

export interface OpportunityIntelligence {
  analyzedOpportunities: AnalyzedOpportunity[];
  priorityOpportunity: PriorityOpportunity;
  compatibleOpportunities: CompatibleOpportunity[];
  opportunitiesToPrepare: OpportunityToPrepare[];
  opportunitiesToAvoid: OpportunityToAvoid[];
  recentlyDetected: RecentlyDetected[];
  strategyImpact: StrategyImpact;
  goalImpact: GoalImpact;
  accountabilityTracking: AccountabilityTracking;
  confidence: OpportunityConfidence;
  recommendations: OpportunityRecommendation[];
}

export class CareerCopilotOpportunityIntelligenceEngine {
  private static currentOpportunityIntelligence: OpportunityIntelligence | null = null;
  private static opportunityIntelligenceHistory: OpportunityIntelligence[] = [];

  /**
   * Analyze opportunity intelligence for the candidate
   */
  static async analyzeOpportunityIntelligence(input: OpportunityIntelligenceInput): Promise<OpportunityIntelligence> {
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
    const marketIntelligence = CareerCopilotMarketIntelligenceEngine.getCurrentMarketIntelligence();

    // Extract data from CandidateAIBrain
    const historicalObservations = candidateAIBrain.getObservations().slice(-10);
    
    const commitmentObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-accountability")
      .slice(-1);
    const currentCommitments = commitmentObs.length > 0 && commitmentObs[0]
      ? JSON.stringify(commitmentObs[0].data).substring(0, 500)
      : "No current commitments available";

    const conclusionObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-self-review")
      .slice(-1);
    const currentConclusions = conclusionObs.length > 0 && conclusionObs[0]
      ? JSON.stringify(conclusionObs[0].data).substring(0, 500)
      : "No current conclusions available";

    const confidenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-confidence")
      .slice(-1);
    const currentConfidence = confidenceObs.length > 0 && confidenceObs[0]
      ? JSON.stringify(confidenceObs[0].data).substring(0, 500)
      : "No current confidence available";

    const forecastObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-forecast")
      .slice(-1);
    const currentForecast = forecastObs.length > 0 && forecastObs[0]
      ? JSON.stringify(forecastObs[0].data).substring(0, 500)
      : "No forecast available";

    const progressionObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-progression-plan")
      .slice(-1);
    const currentProgressionPlan = progressionObs.length > 0 && progressionObs[0]
      ? JSON.stringify(progressionObs[0].data).substring(0, 500)
      : "No progression plan available";

    const digitalTwinObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-digital-twin")
      .slice(-1);
    const currentDigitalTwin = digitalTwinObs.length > 0 && digitalTwinObs[0]
      ? JSON.stringify(digitalTwinObs[0].data).substring(0, 500)
      : "No digital twin available";

    // Format recent events
    const recentEvents = historicalObservations.slice(-5).map(obs => ({
      source: obs.source,
      timestamp: obs.timestamp,
      summary: JSON.stringify(obs.data).substring(0, 200),
    }));

    // Format opportunity history
    const opportunityHistoryObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-opportunity-intelligence")
      .slice(-5);
    const opportunityHistory = opportunityHistoryObs.length > 0
      ? opportunityHistoryObs.map(obs => JSON.stringify(obs.data).substring(0, 300)).join("\n")
      : "No opportunity history available";

    // Format opportunities to analyze
    const opportunitiesText = input.opportunities
      ? JSON.stringify(input.opportunities).substring(0, 2000)
      : "No opportunities provided";

    // Format market intelligence
    const marketTrends = marketIntelligence
      ? JSON.stringify(marketIntelligence.marketTrends).substring(0, 300)
      : "No market trends available";
    const emergingSkills = marketIntelligence
      ? marketIntelligence.emergingSkills.map(s => s.skill).join(", ")
      : "No emerging skills available";
    const marketOpportunities = marketIntelligence
      ? marketIntelligence.opportunities.map(o => o.opportunity).join(", ")
      : "No market opportunities available";
    const marketRisks = marketIntelligence
      ? marketIntelligence.risks.map(r => r.risk).join(", ")
      : "No market risks available";
    const strategyImpact = marketIntelligence
      ? marketIntelligence.strategyImpact.strategyEvolutionNeeded
        ? "Strategy evolution needed based on market"
        : "Current strategy remains relevant to market"
      : "No market strategy impact available";

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

    // Extract application intelligence for transformation
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const trackedApplications = applicationIntelligence
      ? applicationIntelligence.trackedApplications.map(app => `${app.title} at ${app.company} (${app.state})`).join("; ")
      : "No tracked applications available";
    const priorityApplication = applicationIntelligence
      ? applicationIntelligence.priorityApplication.title
      : "No priority application available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Most promising: ${successIntelligence.opportunityReevaluation.mostPromising.join(", ")}, Least profitable: ${successIntelligence.opportunityReevaluation.leastProfitable.join(", ")}, New priorities: ${successIntelligence.opportunityReevaluation.newPriorities.join(", ")}`
      : "No success intelligence available";

    // Extract scenario intelligence for multi-future opportunity context
    const scenarioObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-1);
    const scenarioContext = scenarioObs.length > 0 && scenarioObs[0]
      ? `Recommended scenario: ${(scenarioObs[0].data as any).recommendation?.recommendedScenario || "None"}, Best scenario: ${(scenarioObs[0].data as any).comparison?.bestScenario || "None"}, Success maximization: ${(scenarioObs[0].data as any).recommendation?.successMaximization || "None"}`
      : "No scenario intelligence available";

    // Get constraint intelligence for constraint-aware opportunity analysis
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

    // Get resource intelligence for resource-aware opportunity analysis
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

    // Call AIOrchestrator with opportunity intelligence prompt
    const result = await aiOrchestrator.execute(
      careerCopilotOpportunityIntelligenceV1,
      {
        candidateProfile,
        candidateGraph,
        opportunities: opportunitiesText,
        currentStrategy,
        strategyHistory: strategyHistoryText,
        currentPriority: currentPriority ? JSON.stringify(currentPriority).substring(0, 300) : "No current priority available",
        priorityHistory: priorityHistoryText,
        currentGoals: currentGoalsText,
        goalHistory: goalHistoryText,
        currentCommitments,
        commitmentHistory: "No commitment history available",
        currentConclusions,
        conclusionHistory: "No conclusion history available",
        currentConfidence,
        confidenceHistory: "No confidence history available",
        currentForecast,
        currentProgressionPlan,
        currentDigitalTwin,
        marketTrends,
        emergingSkills,
        marketOpportunities,
        marketRisks,
        strategyImpact,
        recentEvents: JSON.stringify(recentEvents).substring(0, 500),
        opportunityHistory,
        trackedApplications,
        priorityApplication,
        successContext,
        scenarioContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-opportunity-intelligence",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2500,
      }
    );

    // Parse the result
    const opportunityIntelligence = JSON.parse(result.data as string) as OpportunityIntelligence;

    // Convert confidence string to number
    const confidenceValue = opportunityIntelligence.confidence.overallConfidence === "very_high" ? 0.9 : opportunityIntelligence.confidence.overallConfidence === "high" ? 0.75 : opportunityIntelligence.confidence.overallConfidence === "moderate" ? 0.5 : opportunityIntelligence.confidence.overallConfidence === "low" ? 0.25 : 0.1;

    // Save to CandidateAIBrain
    await candidateAIBrain.addObservation({
      source: "career-copilot-opportunity-intelligence",
      data: opportunityIntelligence,
      confidence: confidenceValue,
      timestamp: new Date(),
      type: "career",
      metadata: {
        opportunityConfidence: opportunityIntelligence.confidence.overallConfidence,
        dataQuality: opportunityIntelligence.confidence.dataQuality,
      },
    });

    // Publish event
    eventBus.publish({
      id: `opportunity-intelligence-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-opportunity-intelligence",
        observationType: "career",
        data: opportunityIntelligence,
        confidence: confidenceValue,
        metadata: {
          opportunityConfidence: opportunityIntelligence.confidence.overallConfidence,
          dataQuality: opportunityIntelligence.confidence.dataQuality,
        },
      },
    });

    // Update current opportunity intelligence
    this.currentOpportunityIntelligence = opportunityIntelligence;
    this.opportunityIntelligenceHistory.push(opportunityIntelligence);

    // Keep only last 20 entries
    if (this.opportunityIntelligenceHistory.length > 20) {
      this.opportunityIntelligenceHistory = this.opportunityIntelligenceHistory.slice(-20);
    }

    return opportunityIntelligence;
  }

  /**
   * Get current opportunity intelligence
   */
  static getCurrentOpportunityIntelligence(): OpportunityIntelligence | null {
    return this.currentOpportunityIntelligence;
  }

  /**
   * Get opportunity intelligence history
   */
  static getOpportunityIntelligenceHistory(): OpportunityIntelligence[] {
    return this.opportunityIntelligenceHistory;
  }

  /**
   * Get opportunity intelligence from CandidateAIBrain
   */
  static getOpportunityIntelligenceFromBrain(): OpportunityIntelligence | null {
    const observations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-opportunity-intelligence")
      .slice(-1);
    
    if (observations.length > 0 && observations[0]) {
      return observations[0].data as OpportunityIntelligence;
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
