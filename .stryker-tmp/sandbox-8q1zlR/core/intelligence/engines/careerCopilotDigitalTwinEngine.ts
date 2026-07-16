// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotDigitalTwinV1 } from "../../ai/Prompts/career-copilot-digital-twin-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface DigitalTwinInput {
  candidateGraph: any;
}

export interface DigitalTwinOutput {
  currentPortrait: {
    description: string[];
    evolution: string;
    scoreExplanation: string;
  };
  dominantStrengths: {
    naturalStrengths: string[];
    emergingStrengths: string[];
  };
  fragilities: {
    persistentFragilities: string[];
    situationalFragilities: string[];
  };
  habits: {
    positiveHabits: string[];
    negativeHabits: string[];
    recurringBehaviors: string[];
  };
  professionalStyle: {
    communicationStyle: string;
    leadershipStyle: string;
    decisionStyle: string;
    relationshipStyle: string;
    learningStyle: string;
  };
  whatChanges: {
    evolves: string[];
    staysStable: string[];
    regresses: string[];
    surprises: string[];
  };
  temporalComparison: {
    today: string;
    oneWeekAgo: string;
    oneMonthAgo: string;
    firstSimulation: string;
  };
  naturalSynthesis: string;
}

/**
 * Career Copilot Digital Twin Engine
 * 
 * Generates a living portrait of the candidate's professional evolution.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotDigitalTwinEngine {
  /**
   * Generate digital twin portrait
   */
  static async generateDigitalTwin(input: DigitalTwinInput): Promise<DigitalTwinOutput> {
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

    // Extract recent insights from Brain
    const recentInsights = candidateAIBrain.getInsights()
      .slice(0, 10)
      .map(insight => insight.description);

    // Extract current goals from Brain
    const currentGoals = candidateAIBrain.getGoals()
      .map(g => `${g.status}: ${g.description} (target: ${g.target}, current: ${g.current})`);

    // Extract previous digital twin from Brain for evolution
    const previousPortraitObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-digital-twin")
      .slice(-1);
    
    const previousPortrait = previousPortraitObservations.length > 0 && previousPortraitObservations[0]
      ? JSON.stringify(previousPortraitObservations[0].data).substring(0, 500) + "..."
      : "No previous portrait - creating initial portrait";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(0, 15)
      .map(obs => `${obs.type} at ${obs.timestamp.toISOString()}`);

    // Extract opportunity intelligence to integrate opportunity context into digital twin
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const opportunityContext = opportunityIntelligence
      ? `Priority opportunity: ${opportunityIntelligence.priorityOpportunity.title}, Compatible: ${opportunityIntelligence.compatibleOpportunities.map((o: any) => o.title).join(", ")}, To prepare: ${opportunityIntelligence.opportunitiesToPrepare.map((o: any) => o.title).join(", ")}, To avoid: ${opportunityIntelligence.opportunitiesToAvoid.map((o: any) => o.title).join(", ")}`
      : "No opportunity context available";

    // Extract application intelligence to integrate application context into digital twin
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const applicationContext = applicationIntelligence
      ? `Priority application: ${applicationIntelligence.priorityApplication.title}, To follow up: ${applicationIntelligence.applicationsToFollowUp.map((a: any) => a.title).join(", ")}, To prepare: ${applicationIntelligence.applicationsToPrepare.map((a: any) => a.title).join(", ")}, To abandon: ${applicationIntelligence.applicationsToAbandon.map((a: any) => a.title).join(", ")}`
      : "No application context available";

    // Extract success intelligence for optimization context
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Digital twin evolution: ${successIntelligence.digitalTwinEvolution}, Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment}`
      : "No success intelligence available";

    // Extract scenario intelligence for multi-future digital twin context
    const scenarioObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-1);
    const scenarioContext = scenarioObs.length > 0 && scenarioObs[0]
      ? `Recommended scenario: ${(scenarioObs[0].data as any).recommendation?.recommendedScenario || "None"}, Best scenario: ${(scenarioObs[0].data as any).comparison?.bestScenario || "None"}, Success maximization: ${(scenarioObs[0].data as any).recommendation?.successMaximization || "None"}`
      : "No scenario intelligence available";

    // Get constraint intelligence for constraint-aware digital twin generation
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

    // Get resource intelligence for resource-aware digital twin generation
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

Risks: ${(input.candidateGraph.riskAnalysis?.risks || []).map((r: any) => r.description).join(", ")}
Employability: ${input.candidateGraph.employability?.overall || 0}/100
`;

    const result = await aiOrchestrator.execute<DigitalTwinOutput>(
      careerCopilotDigitalTwinV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        recentInsights: recentInsights.join("\n"),
        currentGoals: currentGoals.join("\n"),
        previousPortrait,
        recentEvents: recentEvents.join("\n"),
        opportunityContext,
        applicationContext,
        successContext,
        scenarioContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-digital-twin",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to generate digital twin portrait");
    }

    // Save digital twin to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-digital-twin",
      type: "general",
      data: result.data,
      confidence: 0.9,
    });

    // Publish digital twin event to EventBus
    const twinEvent: ObservationCreatedEvent = {
      id: `digital-twin-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "career-copilot-digital-twin",
        observationType: "general",
        data: result.data,
        confidence: 0.9,
      },
    };

    eventBus.publish(twinEvent);

    return result.data;
  }
}
