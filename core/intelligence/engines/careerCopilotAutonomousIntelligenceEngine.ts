import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { careerCopilotAutonomousIntelligenceV1 } from "../../ai/Prompts/career-copilot-autonomous-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface AutonomousIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
    impact?: "major" | "minor" | "no_impact";
  };
}

export interface AutonomousIntelligenceOutput {
  eventClassification: {
    type: "major" | "minor" | "no_impact";
    reason: string;
    affectedAreas: string[];
  };
  orchestration: {
    conversationEngine: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    scenarioIntelligence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    successIntelligence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    forecast: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    decisionIntelligence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    marketIntelligence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    opportunityIntelligence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    applicationIntelligence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    goalIntelligence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    adaptiveStrategy: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    accountability: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    selfReview: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    confidence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    metaIntelligence: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    digitalTwin: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    progressionPlan: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
    dailySummary: {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    };
  };
  executionOrder: string[];
  optimization: {
    llmCallsAvoided: number;
    costSaved: number;
    timeSaved: number;
    reusedAnalyses: number;
  };
  coherence: {
    level: "high" | "medium" | "low";
    conflicts: string[];
    recommendations: string[];
  };
  explanation: {
    summary: string;
    executed: string[];
    reused: string[];
    ignored: string[];
    limitations: string[];
  };
}

/**
 * Career Copilot Autonomous Intelligence Engine
 * 
 * Orchestrates all intelligence engines autonomously, deciding when to execute,
 * reuse, or ignore analyses based on event impact and data freshness.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotAutonomousIntelligenceEngine {
  private static lastOrchestration: AutonomousIntelligenceOutput | null = null;
  private static orchestrationHistory: Array<{
    timestamp: Date;
    event: string;
    output: AutonomousIntelligenceOutput;
  }> = [];

  /**
   * Get the last orchestration decision
   */
  static getLastOrchestration(): AutonomousIntelligenceOutput | null {
    return this.lastOrchestration;
  }

  /**
   * Get orchestration history
   */
  static getOrchestrationHistory(): Array<{
    timestamp: Date;
    event: string;
    output: AutonomousIntelligenceOutput;
  }> {
    return this.orchestrationHistory;
  }

  /**
   * Orchestrate intelligence engines based on current event
   */
  static async orchestrate(input: AutonomousIntelligenceInput): Promise<AutonomousIntelligenceOutput> {
    // Extract candidate profile
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract brain observations
    const brainObservations = candidateAIBrain.getObservations()
      .slice(-20)
      .map(obs => `${obs.source} - ${obs.type} at ${obs.timestamp.toISOString()}: ${JSON.stringify(obs.data).substring(0, 100)}`)
      .join("\n");

    // Extract recent events
    const recentEvents = candidateAIBrain.getRecentEvents(10)
      .map(e => `${e.type} at ${e.timestamp.toISOString()}: ${e.description}`)
      .join("\n");

    // Get last orchestration
    const lastOrchestrationStr = this.lastOrchestration
      ? JSON.stringify(this.lastOrchestration).substring(0, 500)
      : "No previous orchestration";

    // Calculate data freshness for each intelligence
    const dataFreshness = this.calculateDataFreshness();

    // Extract meta intelligence context
    const metaIntelligenceObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-meta-intelligence")
      .slice(-1);
    const metaIntelligenceContext = metaIntelligenceObs.length > 0 && metaIntelligenceObs[0]
      ? JSON.stringify(metaIntelligenceObs[0].data).substring(0, 300)
      : "No meta intelligence available";

    // Format candidate graph data
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

    // Format current event
    const currentEventStr = input.currentEvent
      ? `Type: ${input.currentEvent.type}, Description: ${input.currentEvent.description}, Timestamp: ${input.currentEvent.timestamp.toISOString()}, Impact: ${input.currentEvent.impact || "unknown"}`
      : "No current event specified";

    // Get constraint intelligence for constraint-aware orchestration
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

    // Get resource intelligence for resource-aware orchestration
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

    const promptTemplate = careerCopilotAutonomousIntelligenceV1.system || careerCopilotAutonomousIntelligenceV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<AutonomousIntelligenceOutput>(promptTemplate);

    const promptVariables = {
      currentEvent: currentEventStr,
      candidateGraph: candidateGraphData,
      brainObservations,
      recentEvents,
      lastOrchestration: lastOrchestrationStr,
      dataFreshness,
      metaIntelligenceContext,
      constraintContext: JSON.stringify(constraintContext, null, 2),
      resourceContext: JSON.stringify(resourceContext, null, 2),
    };

    const request: IntelligenceRequest<AutonomousIntelligenceOutput> = {
      id: `career-copilot-autonomous-intelligence-${Date.now()}`,
      type: "career-copilot-autonomous-intelligence",
      input: input as unknown as AutonomousIntelligenceOutput,
      context: {
        candidateProfile,
        historicalObservations: [],
        recentInsights: [],
        currentGoals: [],
        engineContext: promptVariables,
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.3,
        maxTokens: 2000,
        timeout: 30000,
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error("Failed to orchestrate intelligence engines");
    }

    const orchestrationData = result.output as AutonomousIntelligenceOutput;

    // Save orchestration to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "career-copilot-autonomous-intelligence",
      type: "general",
      data: orchestrationData,
      confidence: 0.9,
    });

    // Publish orchestration event to EventBus
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "career-copilot-autonomous-intelligence",
      observationType: "general",
      data: orchestrationData,
      confidence: 0.9,
      timestamp: new Date().toISOString(),
    });

    // Update last orchestration and history
    this.lastOrchestration = orchestrationData;
    this.orchestrationHistory.push({
      timestamp: new Date(),
      event: input.currentEvent?.type || "manual",
      output: orchestrationData,
    });

    // Keep only last 50 orchestrations in history
    if (this.orchestrationHistory.length > 50) {
      this.orchestrationHistory = this.orchestrationHistory.slice(-50);
    }

    return orchestrationData;
  }

  /**
   * Calculate data freshness for each intelligence
   */
  private static calculateDataFreshness(): string {
    const now = new Date();
    const sources = [
      "career-copilot-scenario-intelligence",
      "career-copilot-success-intelligence",
      "career-copilot-forecast",
      "career-copilot-decision-intelligence",
      "career-copilot-market-intelligence",
      "career-copilot-opportunity-intelligence",
      "career-copilot-application-intelligence",
      "career-copilot-goal-intelligence",
      "career-copilot-digital-twin",
      "career-copilot-daily-summary",
    ];

    const freshness: Record<string, string> = {};

    sources.forEach(source => {
      const obs = candidateAIBrain.getObservations()
        .filter(o => o.source === source)
        .slice(-1);

      if (obs.length > 0 && obs[0]) {
        const age = now.getTime() - obs[0].timestamp.getTime();
        const ageMinutes = Math.floor(age / (1000 * 60));
        const ageHours = Math.floor(ageMinutes / 60);
        const ageDays = Math.floor(ageHours / 24);

        if (ageMinutes < 60) {
          freshness[source] = `${ageMinutes} minutes ago`;
        } else if (ageHours < 24) {
          freshness[source] = `${ageHours} hours ago`;
        } else {
          freshness[source] = `${ageDays} days ago`;
        }
      } else {
        freshness[source] = "No data available";
      }
    });

    return JSON.stringify(freshness);
  }

  /**
   * Execute orchestration plan (call actual intelligence engines based on decisions)
   */
  static async executeOrchestrationPlan(
    orchestration: AutonomousIntelligenceOutput,
    candidateGraph: any
  ): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    
    // Import engines dynamically to avoid circular dependencies
    const engines: Record<string, () => Promise<any>> = {
      scenarioIntelligence: async () => {
        // Simplified - Scenario Intelligence Engine removed
        return null;
      },
      successIntelligence: async () => {
        const { CareerCopilotSuccessIntelligenceEngine } = await import("./careerCopilotSuccessIntelligenceEngine");
        return CareerCopilotSuccessIntelligenceEngine.analyzeSuccessIntelligence({ candidateGraph });
      },
      forecast: async () => {
        const { CareerCopilotForecastEngine } = await import("./careerCopilotForecastEngine");
        return CareerCopilotForecastEngine.generateForecast({ candidateGraph });
      },
      decisionIntelligence: async () => {
        // Simplified - Decision Intelligence Engine removed
        return null;
      },
      marketIntelligence: async () => {
        // Simplified - Market Intelligence Engine removed
        return null;
      },
      opportunityIntelligence: async () => {
        // Simplified - Opportunity Intelligence Engine removed
        return null;
      },
      applicationIntelligence: async () => {
        const { CareerCopilotApplicationIntelligenceEngine } = await import("./careerCopilotApplicationIntelligenceEngine");
        // Note: Requires applications parameter, using empty array for now
        return CareerCopilotApplicationIntelligenceEngine.analyzeApplicationIntelligence({ 
          candidateGraph,
          applications: [],
        });
      },
      goalIntelligence: async () => {
        // Simplified - Goal Intelligence Engine removed
        return null;
      },
      adaptiveStrategy: async () => {
        const { CareerCopilotAdaptiveStrategyEngine } = await import("./careerCopilotAdaptiveStrategyEngine");
        return CareerCopilotAdaptiveStrategyEngine.detectAndAdaptStrategy({ candidateGraph });
      },
      accountability: async () => {
        const { CareerCopilotAccountabilityEngine } = await import("./careerCopilotAccountabilityEngine");
        return CareerCopilotAccountabilityEngine.trackCommitments({ candidateGraph });
      },
      digitalTwin: async () => {
        const { CareerCopilotDigitalTwinEngine } = await import("./careerCopilotDigitalTwinEngine");
        return CareerCopilotDigitalTwinEngine.generateDigitalTwin({ candidateGraph });
      },
      progressionPlan: async () => {
        const { CareerCopilotProgressionPlanEngine } = await import("./careerCopilotProgressionPlanEngine");
        return CareerCopilotProgressionPlanEngine.generateProgressionPlan({ candidateGraph });
      },
      dailySummary: async () => {
        const { CareerCopilotDailySummaryEngine } = await import("./careerCopilotDailySummaryEngine");
        const lastVisit = candidateAIBrain.getObservations()
          .filter(obs => obs.source === "career-copilot-daily-summary")
          .slice(-1);
        return CareerCopilotDailySummaryEngine.generateDailySummary({
          candidateGraph,
          lastVisit: lastVisit.length > 0 && lastVisit[0] ? lastVisit[0].timestamp : undefined,
        });
      },
    };

    // Execute engines based on orchestration decisions
    const executionPromises: Array<{ key: string; promise: Promise<any> }> = [];

    if (orchestration.orchestration.scenarioIntelligence?.decision === "EXECUTE" && engines.scenarioIntelligence) {
      executionPromises.push({ key: "scenarioIntelligence", promise: engines.scenarioIntelligence() });
    }
    if (orchestration.orchestration.successIntelligence?.decision === "EXECUTE" && engines.successIntelligence) {
      executionPromises.push({ key: "successIntelligence", promise: engines.successIntelligence() });
    }
    if (orchestration.orchestration.forecast?.decision === "EXECUTE" && engines.forecast) {
      executionPromises.push({ key: "forecast", promise: engines.forecast() });
    }
    if (orchestration.orchestration.decisionIntelligence?.decision === "EXECUTE" && engines.decisionIntelligence) {
      executionPromises.push({ key: "decisionIntelligence", promise: engines.decisionIntelligence() });
    }
    if (orchestration.orchestration.marketIntelligence?.decision === "EXECUTE" && engines.marketIntelligence) {
      executionPromises.push({ key: "marketIntelligence", promise: engines.marketIntelligence() });
    }
    if (orchestration.orchestration.opportunityIntelligence?.decision === "EXECUTE" && engines.opportunityIntelligence) {
      executionPromises.push({ key: "opportunityIntelligence", promise: engines.opportunityIntelligence() });
    }
    if (orchestration.orchestration.applicationIntelligence?.decision === "EXECUTE" && engines.applicationIntelligence) {
      executionPromises.push({ key: "applicationIntelligence", promise: engines.applicationIntelligence() });
    }
    if (orchestration.orchestration.goalIntelligence?.decision === "EXECUTE" && engines.goalIntelligence) {
      executionPromises.push({ key: "goalIntelligence", promise: engines.goalIntelligence() });
    }
    if (orchestration.orchestration.adaptiveStrategy?.decision === "EXECUTE" && engines.adaptiveStrategy) {
      executionPromises.push({ key: "adaptiveStrategy", promise: engines.adaptiveStrategy() });
    }
    if (orchestration.orchestration.accountability?.decision === "EXECUTE" && engines.accountability) {
      executionPromises.push({ key: "accountability", promise: engines.accountability() });
    }
    if (orchestration.orchestration.digitalTwin?.decision === "EXECUTE" && engines.digitalTwin) {
      executionPromises.push({ key: "digitalTwin", promise: engines.digitalTwin() });
    }
    if (orchestration.orchestration.progressionPlan?.decision === "EXECUTE" && engines.progressionPlan) {
      executionPromises.push({ key: "progressionPlan", promise: engines.progressionPlan() });
    }
    if (orchestration.orchestration.dailySummary?.decision === "EXECUTE" && engines.dailySummary) {
      executionPromises.push({ key: "dailySummary", promise: engines.dailySummary() });
    }

    // Execute in parallel for performance
    const settledResults = await Promise.allSettled(
      executionPromises.map(({ promise }) => promise)
    );

    // Collect results
    executionPromises.forEach(({ key }, index) => {
      const result = settledResults[index];
      if (result && result.status === "fulfilled") {
        results[key] = result.value;
      } else if (result && result.status === "rejected") {
        results[key] = { error: result.reason.message };
      }
    });

    return results;
  }

  /**
   * Orchestrate and execute in one call
   */
  static async orchestrateAndExecute(input: AutonomousIntelligenceInput): Promise<{
    orchestration: AutonomousIntelligenceOutput;
    executionResults: Record<string, any>;
  }> {
    const orchestration = await this.orchestrate(input);
    const executionResults = await this.executeOrchestrationPlan(orchestration, input.candidateGraph);
    
    return {
      orchestration,
      executionResults,
    };
  }
}
