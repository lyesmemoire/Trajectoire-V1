import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { BrainContextBuilder } from "../../../lib/intelligence-core/application/BrainContextBuilder";
import { careerCopilotProgressionPlanV1 } from "../../ai/Prompts/career-copilot-progression-plan-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface ProgressionPlanInput {
  candidateGraph: any;
}

export interface ProgressionPlanOutput {
  singlePriority: {
    action: string;
    why: string;
    whyNow: string;
    expectedImpact: string;
    riskIfIgnored: string;
    estimatedTime: string;
  };
  shortTerm: {
    today: string[];
    thisWeek: string[];
    thisMonth: string[];
  };
  longTerm: {
    mainObjective: string;
    progression: string;
    blockages: string[];
    nextStep: string;
  };
  dynamicPriorities: {
    recommendations: string[];
    goals: string[];
    simulations: string[];
    skills: string[];
  };
  changeHistory: {
    lastChange: string;
    reason: string;
    previousPriority: string;
  };
}

/**
 * Career Copilot Progression Plan Engine
 * 
 * Generates and maintains a living progression plan that evolves automatically.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotProgressionPlanEngine {
  /**
   * Generate or evolve progression plan
   */
  static async generateProgressionPlan(input: ProgressionPlanInput): Promise<ProgressionPlanOutput> {
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

    // Extract previous progression plan from Brain for evolution
    const previousPlanObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-progression-plan")
      .slice(-1);
    
    const previousPlan = previousPlanObservations.length > 0 && previousPlanObservations[0]
      ? JSON.stringify(previousPlanObservations[0].data).substring(0, 500) + "..."
      : "No previous plan - creating initial plan";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(0, 10)
      .map(obs => `${obs.type} at ${obs.timestamp.toISOString()}`);

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment}, Quick wins: ${successIntelligence.quickWins.map((w: any) => w.action).join(", ")}`
      : "No success intelligence available";

    // Get constraint intelligence for constraint-aware progression plan
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

    // Get resource intelligence for resource-aware progression plan
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

Risks: ${(input.candidateGraph.riskAnalysis?.risks || []).map((r: any) => r.description).join(", ")}
Employability: ${input.candidateGraph.employability?.overall || 0}/100
`;

    const promptTemplate = careerCopilotProgressionPlanV1.system || careerCopilotProgressionPlanV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<ProgressionPlanOutput>(promptTemplate);

    const request: IntelligenceRequest<ProgressionPlanOutput> = {
      id: `career-copilot-progression-plan-${Date.now()}`,
      type: "career-copilot-progression-plan",
      input: input as unknown as ProgressionPlanOutput,
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
          previousPlan,
          recentEvents: recentEvents.join("\n"),
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
      throw new Error("Failed to generate progression plan");
    }

    // Save progression plan to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-progression-plan",
      type: "general",
      data: result.output,
      confidence: 0.9,
    });

    // Publish progression plan event to EventBus
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "career-copilot-progression-plan",
      observationType: "general",
      data: result.output,
      confidence: 0.9,
      timestamp: new Date().toISOString(),
    });

    return result.output as ProgressionPlanOutput;
  }
}
