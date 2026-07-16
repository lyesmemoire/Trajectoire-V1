import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { BrainContextBuilder } from "../../../lib/intelligence-core/application/BrainContextBuilder";
import { careerCopilotDailySummaryV1 } from "../../ai/Prompts/career-copilot-daily-summary-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

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
    const brainData = {
      insights: candidateAIBrain.getInsights(),
      observations: candidateAIBrain.getObservations(),
      patterns: candidateAIBrain.getPatterns(),
      goals: candidateAIBrain.getGoals(),
    };

    // Use BrainContextBuilder to build standardized context
    const brainContext = BrainContextBuilder.buildContext(brainData, {
      maxInsights: 5,
      maxObservations: 15,
      maxPatterns: 5,
      maxGoals: 10,
    });

    const historicalObservations = brainContext.engineContext?.recentObservations as string[] || [];
    const recentInsights = brainContext.engineContext?.historicalInsights as string[] || [];
    const currentGoals = brainContext.engineContext?.currentBrainGoals as string[] || [];

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

    // Extract opportunity intelligence (simplified - Opportunity Intelligence Engine removed)
    const opportunityAnnouncement = "No opportunity announcements available";

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

    // Get knowledge evolution (simplified - Knowledge Evolution Engine removed)
    let knowledgeEvolutionContext = null;

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

    const promptTemplate = careerCopilotDailySummaryV1.system || careerCopilotDailySummaryV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<DailySummaryOutput>(promptTemplate);

    const request: IntelligenceRequest<DailySummaryOutput> = {
      id: `career-copilot-daily-summary-${Date.now()}`,
      type: "career-copilot-daily-summary",
      input: input as unknown as DailySummaryOutput,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
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
      throw new Error("Failed to generate daily summary");
    }

    // Save daily summary to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-daily-summary",
      type: "general",
      data: result.output,
      confidence: 0.9,
    });

    // Publish daily summary event to EventBus
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "career-copilot-daily-summary",
      observationType: "general",
      data: result.output,
      confidence: 0.9,
      timestamp: new Date().toISOString(),
    });

    return result.output as DailySummaryOutput;
  }
}
