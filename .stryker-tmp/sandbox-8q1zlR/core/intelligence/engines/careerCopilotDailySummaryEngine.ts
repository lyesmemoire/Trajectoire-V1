// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotDailySummaryV1 } from "../../ai/Prompts/career-copilot-daily-summary-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "./careerCopilotKnowledgeEvolutionEngine";

export interface DailySummaryInput {
  candidateGraph: any;
  lastVisit?: Date;
}

export interface DailySummaryOutput {
  sinceLastVisit: {
    newObservations: string[];
    progression: string[];
    regression: string[];
    goalsAchieved: string[];
    newPriorities: string[];
    newRecommendations: string[];
    newOpportunities: string[];
  };
  today: {
    priority: string;
    exercise: string;
    goal: string;
    progression: string;
    nextStep: string;
  };
  satisfaction: {
    smallWins: string[];
    progression: string;
    achievements: string[];
  };
  history: {
    whereYouWere: string;
    whereYouAre: string;
    whereYouAreGoing: string;
  };
  reward: {
    goalAchieved: string;
    recognition: string;
  };
}

/**
 * Career Copilot Daily Summary Engine
 * 
 * Generates an intelligent daily summary that tells the candidate's journey story.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotDailySummaryEngine {
  /**
   * Generate daily summary
   */
  static async generateDailySummary(input: DailySummaryInput): Promise<DailySummaryOutput> {
    // Extract data from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract historical observations from Brain
    const historicalObservations = candidateAIBrain.getObservations()
      .slice(0, 15)
      .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);

    // Extract recent insights from Brain
    const recentInsights = candidateAIBrain.getInsights()
      .slice(0, 5)
      .map(insight => insight.description);

    // Extract current goals from Brain
    const currentGoals = candidateAIBrain.getGoals()
      .map(g => `${g.status}: ${g.description} (target: ${g.target}, current: ${g.current})`);

    // Extract previous daily summary from Brain for continuity
    const previousSummaryObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-daily-summary")
      .slice(-1);
    
    const previousSummary = previousSummaryObservations.length > 0 && previousSummaryObservations[0]
      ? JSON.stringify(previousSummaryObservations[0].data).substring(0, 500) + "..."
      : "No previous summary - creating initial summary";

    // Format last visit for continuity
    const lastVisit = input.lastVisit 
      ? input.lastVisit.toISOString()
      : "First visit - no previous session";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(0, 10)
      .map(obs => `${obs.type} at ${obs.timestamp.toISOString()}`);

    // Extract opportunity intelligence to announce opportunities in daily summary
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const opportunityAnnouncement = opportunityIntelligence
      ? `Priority opportunity: ${opportunityIntelligence.priorityOpportunity.title}, Compatible: ${opportunityIntelligence.compatibleOpportunities.map((o: any) => o.title).join(", ")}, To prepare: ${opportunityIntelligence.opportunitiesToPrepare.map((o: any) => o.title).join(", ")}, Recently detected: ${opportunityIntelligence.recentlyDetected.map((o: any) => o.title).join(", ")}`
      : "No opportunity announcements available";

    // Extract application intelligence to announce applications in daily summary
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const applicationAnnouncement = applicationIntelligence
      ? `Priority application: ${applicationIntelligence.priorityApplication.title}, To follow up: ${applicationIntelligence.applicationsToFollowUp.map((a: any) => a.title).join(", ")}, To prepare: ${applicationIntelligence.applicationsToPrepare.map((a: any) => a.title).join(", ")}, Active applications: ${applicationIntelligence.trackedApplications.filter((a: any) => a.state === 'application_sent' || a.state === 'interview_scheduled').map((a: any) => a.title).join(", ")}`
      : "No application announcements available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment}, Quick wins: ${successIntelligence.quickWins.map((w: any) => w.action).join(", ")}`
      : "No success intelligence available";

    // Get constraint intelligence for constraint-aware daily summary
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

    // Get resource intelligence for resource-aware daily summary
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

    // Get knowledge evolution for knowledge-aware daily summary
    let knowledgeEvolutionContext = null;
    try {
      const knowledgeEvolution = CareerCopilotKnowledgeEvolutionEngine.getLastKnowledgeEvolution();
      if (knowledgeEvolution) {
        knowledgeEvolutionContext = {
          knowledgeSummary: knowledgeEvolution.knowledgeSummary,
          confirmedCount: knowledgeEvolution.knowledgeSummary.confirmedCount,
          strengthenedCount: knowledgeEvolution.knowledgeSummary.strengthenedCount,
          obsoleteCount: knowledgeEvolution.knowledgeSummary.obsoleteCount,
          toConfirmCount: knowledgeEvolution.knowledgeActions.toConfirm.length,
          knowledgeHealthScore: knowledgeEvolution.knowledgeSummary.healthScore,
          knowledgeEvolution: knowledgeEvolution.knowledgeEvolution,
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

Recommended Skills: ${(input.candidateGraph.recommendedSkills || []).map((s: any) => s.title).join(", ")}
Recommended Interviews: ${(input.candidateGraph.recommendedInterviews || []).map((i: any) => i.title).join(", ")}

Risks: ${(input.candidateGraph.riskAnalysis?.risks || []).map((r: any) => r.description).join(", ")}
Employability: ${input.candidateGraph.employability?.overall || 0}/100
`;

    const result = await aiOrchestrator.execute<DailySummaryOutput>(
      careerCopilotDailySummaryV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        recentInsights: recentInsights.join("\n"),
        currentGoals: currentGoals.join("\n"),
        lastVisit,
        previousSummary,
        recentEvents: recentEvents.join("\n"),
        opportunityAnnouncement,
        applicationAnnouncement,
        successContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
        knowledgeEvolutionContext: JSON.stringify(knowledgeEvolutionContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-daily-summary",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to generate daily summary");
    }

    // Save daily summary to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-daily-summary",
      type: "general",
      data: result.data,
      confidence: 0.9,
    });

    // Publish daily summary event to EventBus
    const summaryEvent: ObservationCreatedEvent = {
      id: `daily-summary-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-daily-summary",
        observationType: "general",
        data: result.data,
        confidence: 0.9,
      },
    };

    eventBus.publish(summaryEvent);

    return result.data;
  }
}
