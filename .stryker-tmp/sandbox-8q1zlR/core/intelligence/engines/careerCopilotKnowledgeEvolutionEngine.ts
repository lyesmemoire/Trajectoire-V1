// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotKnowledgeEvolutionV1 } from "../../ai/Prompts/career-copilot-knowledge-evolution-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { CareerCopilotOpportunityIntelligenceEngine } from "./careerCopilotOpportunityIntelligenceEngine";
import { CareerCopilotApplicationIntelligenceEngine } from "./careerCopilotApplicationIntelligenceEngine";
import { CareerCopilotSuccessIntelligenceEngine } from "./careerCopilotSuccessIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "./careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface KnowledgeEvolutionInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface KnowledgeEvolutionOutput {
  knowledgeSummary: {
    totalKnowledge: number;
    confirmedCount: number;
    strengthenedCount: number;
    fragilizedCount: number;
    obsoleteCount: number;
    replacedCount: number;
    veryReliableCount: number;
    veryUncertainCount: number;
    recentlyLearnedCount: number;
    neverReusedCount: number;
    healthScore: number;
    averageConfidence: number;
    averageFreshness: number;
  };
  knowledgeByState: Array<{
    state: "confirmed" | "strengthened" | "fragilized" | "obsolete" | "replaced" | "very_reliable" | "very_uncertain" | "recently_learned" | "never_reused";
    knowledgeItems: Array<{
      id: string;
      description: string;
      origin: string;
      sourceEngine: string;
      learnedDate: string;
      evidence: {
        supportingCount: number;
        contradictingCount: number;
        quality: "high" | "medium" | "low";
        recency: string;
      };
      freshness: {
        lastConfirmation: string;
        lastContradiction: string;
        lastApplication: string;
        age: string;
      };
      stability: {
        consistency: number;
        volatility: number;
        resistance: number;
        robustness: number;
      };
      reuse: {
        applicationCount: number;
        referenceCount: number;
        successCount: number;
        failureCount: number;
      };
      impact: {
        scope: "broad" | "medium" | "narrow";
        criticality: "high" | "medium" | "low";
        dependencyCount: number;
        influence: number;
      };
      confidence: {
        current: number;
        trend: "increasing" | "decreasing" | "stable";
        volatility: number;
        justification: string;
      };
      importance: number;
      reasonForState: string;
    }>;
    count: number;
  }>;
  knowledgeActions: {
    toKeep: string[];
    toStrengthen: string[];
    toConfirm: string[];
    toReplace: string[];
    toAbandon: string[];
  };
  detectedIssues: {
    uselessRules: string[];
    unusedKnowledge: string[];
    outdatedKnowledge: string[];
    criticalKnowledge: string[];
  };
  knowledgeEvolution: {
    newKnowledge: string[];
    strengthenedKnowledge: string[];
    weakenedKnowledge: string[];
    obsoleteKnowledge: string[];
    replacedKnowledge: string[];
  };
  mostImportantKnowledge: Array<{
    id: string;
    description: string;
    importance: number;
    confidence: number;
    impact: string;
    reason: string;
  }>;
  knowledgeHealthTrends: {
    overallTrend: "improving" | "stable" | "declining";
    confidenceTrend: "increasing" | "stable" | "decreasing";
    freshnessTrend: "improving" | "stable" | "declining";
    stabilityTrend: "increasing" | "stable" | "decreasing";
  };
}

/**
 * Career Copilot Knowledge Evolution Engine
 * 
 * Tracks, evaluates, and evolves the Career Copilot's own knowledge base.
 * This engine does not track the candidate - it tracks what the system knows.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotKnowledgeEvolutionEngine {
  private static lastAnalysis: KnowledgeEvolutionOutput | null = null;

  /**
   * Analyze knowledge evolution
   */
  static async analyzeKnowledgeEvolution(
    input: KnowledgeEvolutionInput
  ): Promise<KnowledgeEvolutionOutput> {
    const { candidateGraph, currentEvent } = input;

    // Extract data from CandidateGraph
    const candidateProfile = {
      name: candidateGraph.identity?.name || "Candidat",
      currentRole: candidateGraph.career?.currentRole || "Non défini",
      careerLevel: candidateGraph.career?.careerLevel || "mid",
      overallScore: candidateGraph.overallScore || 0,
    };

    // Extract historical observations from Brain
    const historicalObservations = candidateAIBrain.getObservations()
      .slice(0, 30)
      .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);

    // Extract recent insights from Brain
    const recentInsights = candidateAIBrain.getInsights()
      .slice(0, 10)
      .map(insight => insight.description);

    // Extract current goals from Brain
    const currentGoals = candidateAIBrain.getGoals()
      .map(g => `${g.status}: ${g.description} (target: ${g.target}, current: ${g.current})`);

    // Extract previous knowledge evolution from Brain for continuity
    const previousEvolutionObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "knowledge-evolution")
      .slice(-1);
    
    const previousKnowledgeEvolution = previousEvolutionObservations.length > 0 && previousEvolutionObservations[0]
      ? JSON.stringify(previousEvolutionObservations[0].data).substring(0, 500) + "..."
      : "No previous knowledge evolution - creating initial analysis";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(0, 20)
      .map(obs => `${obs.type} at ${obs.timestamp.toISOString()}`);

    // Extract opportunity intelligence
    const opportunityIntelligence = CareerCopilotOpportunityIntelligenceEngine.getCurrentOpportunityIntelligence();
    const opportunityContext = opportunityIntelligence
      ? `Priority opportunity: ${opportunityIntelligence.priorityOpportunity.title}, Compatible: ${opportunityIntelligence.compatibleOpportunities.map((o: any) => o.title).join(", ")}, To prepare: ${opportunityIntelligence.opportunitiesToPrepare.map((o: any) => o.title).join(", ")}`
      : "No opportunity context available";

    // Extract application intelligence
    const applicationIntelligence = CareerCopilotApplicationIntelligenceEngine.getCurrentApplicationIntelligence();
    const applicationContext = applicationIntelligence
      ? `Priority application: ${applicationIntelligence.priorityApplication.title}, To follow up: ${applicationIntelligence.applicationsToFollowUp.map((a: any) => a.title).join(", ")}`
      : "No application context available";

    // Extract success intelligence
    const successIntelligence = CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence();
    const successContext = successIntelligence
      ? `Main lever: ${successIntelligence.mainLever.lever}, Main blocker: ${successIntelligence.mainBlocker.blocker}, Best investment: ${successIntelligence.bestInvestment.investment}`
      : "No success intelligence available";

    // Extract scenario intelligence
    const scenarioObs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-scenario-intelligence")
      .slice(-1);
    const scenarioContext = scenarioObs.length > 0 && scenarioObs[0]
      ? `Recommended scenario: ${(scenarioObs[0].data as any).recommendation?.recommendedScenario || "None"}`
      : "No scenario intelligence available";

    // Get constraint intelligence
    let constraintContext = null;
    try {
      const constraintIntelligence = CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis();
      if (constraintIntelligence) {
        constraintContext = {
          activeConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.active).map(con => con.name)),
          criticalConstraints: constraintIntelligence.constraintsByCategory.flatMap(c => c.constraints.filter(con => con.strength === "strong" && !con.negotiable).map(con => con.name)),
          constraintImpact: constraintIntelligence.constraintImpact,
        };
      }
    } catch (error) {
      console.error("Failed to get constraint intelligence:", error);
    }

    // Get resource intelligence
    let resourceContext = null;
    try {
      const resourceIntelligence = CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis();
      if (resourceIntelligence) {
        resourceContext = {
          resourceSummary: resourceIntelligence.resourceSummary,
          availableResources: resourceIntelligence.resourcesByCategory.reduce((acc, cat) => {
            acc[cat.category] = cat.resources.map(r => ({ name: r.name, availability: r.availability, criticality: r.criticality }));
            return acc;
          }, {} as Record<string, any>),
        };
      }
    } catch (error) {
      console.error("Failed to get resource intelligence:", error);
    }

    // Format CandidateGraph data
    const candidateGraphData = `
Overall Score: ${candidateGraph.overallScore || 0}/100
Communication: ${candidateGraph.communication?.score || 0}/100
Leadership: ${candidateGraph.leadership?.score || 0}/100
Confidence: ${candidateGraph.confidence || 0}/100
Structure: ${candidateGraph.structure?.score || 0}/100
Impact: ${candidateGraph.impact?.score || 0}/100

Progress: ${candidateGraph.progress?.timeline?.length || 0} interviews completed
Change: ${candidateGraph.progress?.change || 0}
Trend: ${candidateGraph.progress?.trend || "stable"}

Strengths: ${(candidateGraph.strengths || []).map((s: any) => s.description).join(", ")}
Weaknesses: ${(candidateGraph.weaknesses || []).map((w: any) => w.description).join(", ")}
`;

    // Call AI Orchestrator
    const result = await aiOrchestrator.execute<KnowledgeEvolutionOutput>(
      careerCopilotKnowledgeEvolutionV1,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        candidateGraph: candidateGraphData,
        historicalObservations: historicalObservations.join("\n"),
        recentInsights: recentInsights.join("\n"),
        currentGoals: currentGoals.join("\n"),
        previousKnowledgeEvolution,
        recentEvents: recentEvents.join("\n"),
        opportunityContext,
        applicationContext,
        successContext,
        scenarioContext,
        constraintContext: JSON.stringify(constraintContext, null, 2),
        resourceContext: JSON.stringify(resourceContext, null, 2),
      },
      {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        promptId: "career-copilot-knowledge-evolution",
        promptVersion: "v1",
      }
    );

    const knowledgeEvolution = result.data as KnowledgeEvolutionOutput;

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "knowledge-evolution",
      type: "general",
      data: {
        type: "knowledge_evolution",
        ...knowledgeEvolution,
      },
      confidence: 0.9,
    });

    // Publish event
    eventBus.publish({
      type: "observation_created",
      id: `knowledge_evolution_${Date.now()}`,
      timestamp: new Date(),
      payload: {
        source: "knowledge-evolution",
        observationType: "general",
        data: knowledgeEvolution,
        confidence: 0.9,
      },
    });

    // Store last analysis
    this.lastAnalysis = knowledgeEvolution;

    return knowledgeEvolution;
  }

  /**
   * Get the last knowledge evolution analysis
   */
  static getLastKnowledgeEvolution(): KnowledgeEvolutionOutput | null {
    if (this.lastAnalysis) {
      return this.lastAnalysis;
    }

    // Try to get from Brain
    const observations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "knowledge-evolution")
      .slice(-1);

    if (observations.length > 0 && observations[0]) {
      this.lastAnalysis = observations[0].data as KnowledgeEvolutionOutput;
      return this.lastAnalysis;
    }

    return null;
  }

  /**
   * Get knowledge evolution history
   */
  static getKnowledgeEvolutionHistory() {
    const observations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "knowledge-evolution");

    return observations.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data as KnowledgeEvolutionOutput,
    }));
  }

  /**
   * Get knowledge health score
   */
  static getKnowledgeHealthScore(): number {
    const lastAnalysis = this.getLastKnowledgeEvolution();
    return lastAnalysis?.knowledgeSummary.healthScore || 0;
  }

  /**
   * Get critical knowledge
   */
  static getCriticalKnowledge(): string[] {
    const lastAnalysis = this.getLastKnowledgeEvolution();
    return lastAnalysis?.detectedIssues.criticalKnowledge || [];
  }

  /**
   * Get obsolete knowledge
   */
  static getObsoleteKnowledge(): string[] {
    const lastAnalysis = this.getLastKnowledgeEvolution();
    return lastAnalysis?.detectedIssues.outdatedKnowledge || [];
  }

  /**
   * Get knowledge to confirm
   */
  static getKnowledgeToConfirm(): string[] {
    const lastAnalysis = this.getLastKnowledgeEvolution();
    return lastAnalysis?.knowledgeActions.toConfirm || [];
  }
}
