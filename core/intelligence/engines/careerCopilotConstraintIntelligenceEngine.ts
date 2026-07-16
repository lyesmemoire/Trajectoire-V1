import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { careerCopilotConstraintIntelligenceV1 } from "../../ai/Prompts/career-copilot-constraint-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { CareerCopilotResourceIntelligenceEngine } from "./careerCopilotResourceIntelligenceEngine";

export interface ConstraintIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface ConstraintIntelligenceOutput {
  constraintSummary: {
    totalConstraints: number;
    activeConstraints: number;
    criticalConstraints: number;
    temporaryConstraints: number;
    permanentConstraints: number;
    strongConstraints: number;
    weakConstraints: number;
    explicitConstraints: number;
    inferredConstraints: number;
    liftableConstraints: number;
    nonNegotiableConstraints: number;
    toConfirmConstraints: number;
  };
  constraintsByCategory: Array<{
    category: "time" | "financial" | "geographic" | "family" | "professional" | "health" | "language";
    constraints: Array<{
      id: string;
      name: string;
      description: string;
      type: "permanent" | "temporary";
      strength: "strong" | "weak";
      origin: "observed" | "declared" | "inferred" | "to_confirm";
      liftable: boolean;
      negotiable: boolean;
      active: boolean;
      confidence: number;
      value: string | number;
      unit: string;
      since: string;
      lastUpdated: string;
    }>;
    count: number;
    criticalCount: number;
  }>;
  constraintImpact: {
    impossibleRecommendations: string[];
    unrealisticMissions: string[];
    disappearingOpportunities: string[];
    optimalStrategies: string[];
    discardedScenarios: string[];
    adaptedGoals: string[];
    modifiedForecasts: string[];
    filteredOpportunities: string[];
  };
  detectedChanges: {
    newConstraints: Array<{
      constraint: string;
      category: string;
      origin: string;
      impact: string;
      detectedAt: string;
    }>;
    liftedConstraints: Array<{
      constraint: string;
      category: string;
      reason: string;
      impact: string;
      liftedAt: string;
    }>;
    strengthenedConstraints: Array<{
      constraint: string;
      category: string;
      previousStrength: string;
      newStrength: string;
      reason: string;
      impact: string;
    }>;
    weakenedConstraints: Array<{
      constraint: string;
      category: string;
      previousStrength: string;
      newStrength: string;
      reason: string;
      impact: string;
    }>;
    contradictoryConstraints: Array<{
      constraint1: string;
      constraint2: string;
      conflict: string;
      resolution: string;
    }>;
    forgottenConstraints: Array<{
      constraint: string;
      category: string;
      whyForgotten: string;
      impact: string;
    }>;
    becameCritical: Array<{
      constraint: string;
      category: string;
      whyCritical: string;
      impact: string;
    }>;
    newFreedoms: Array<{
      constraint: string;
      category: string;
      whyLifted: string;
      newPossibilities: string[];
    }>;
  };
  adaptations: {
    forecastAdaptations: Array<{
      forecast: string;
      constraint: string;
      adaptation: string;
      newProbability: number;
      previousProbability: number;
    }>;
    decisionAdaptations: Array<{
      decision: string;
      constraint: string;
      adaptation: string;
      newDecision: string;
    }>;
    missionAdaptations: Array<{
      mission: string;
      constraint: string;
      adaptation: string;
      phaseAdjustments: string[];
      milestoneAdjustments: string[];
    }>;
    opportunityAdaptations: Array<{
      opportunity: string;
      constraint: string;
      action: "filtered" | "prioritized" | "modified";
      reason: string;
    }>;
    applicationAdaptations: Array<{
      application: string;
      constraint: string;
      action: "prioritized" | "deprioritized" | "removed";
      reason: string;
    }>;
    scenarioAdaptations: Array<{
      scenario: string;
      constraint: string;
      action: "discarded" | "modified" | "prioritized";
      reason: string;
    }>;
    goalAdaptations: Array<{
      goal: string;
      constraint: string;
      adaptation: string;
      timelineAdjustment: string;
      ambitionAdjustment: string;
    }>;
    personalizationAdaptations: Array<{
      aspect: string;
      constraint: string;
      adaptation: string;
    }>;
    outcomeAdaptations: Array<{
      outcome: string;
      constraint: string;
      adaptation: string;
      roiAdjustment: string;
    }>;
  };
  constraintRecommendations: {
    toLift: Array<{
      constraint: string;
      category: string;
      howToLift: string;
      impact: string;
      priority: "high" | "medium" | "low";
    }>;
    toRelax: Array<{
      constraint: string;
      category: string;
      howToRelax: string;
      impact: string;
      priority: "high" | "medium" | "low";
    }>;
    toWorkAround: Array<{
      constraint: string;
      category: string;
      strategy: string;
      priority: "high" | "medium" | "low";
    }>;
    toConfirm: Array<{
      constraint: string;
      category: string;
      whyToConfirm: string;
      method: string;
      priority: "high" | "medium" | "low";
    }>;
    toMonitor: Array<{
      constraint: string;
      category: string;
      whyToMonitor: string;
      indicator: string;
    }>;
  };
  explainability: {
    whyTheseConstraints: string;
    whyThisStrength: string;
    whyThisOrigin: string;
    whyThisImpact: string;
    whyTheseAdaptations: string;
    observationsUsed: string[];
    assumptions: string[];
    limitations: string[];
  };
  constraintEvolution: {
    history: Array<{
      date: string;
      event: "new" | "lifted" | "strengthened" | "weakened" | "confirmed" | "contradicted";
      constraint: string;
      category: string;
      previousState: string;
      newState: string;
      reason: string;
    }>;
    trends: Array<{
      constraint: string;
      trend: "strengthening" | "weakening" | "stable" | "fluctuating";
      evidence: string;
    }>;
  };
  globalQuality: {
    overallConstraintClarity: "very_clear" | "clear" | "moderate" | "unclear" | "very_unclear";
    overallConstraintStability: "very_stable" | "stable" | "moderate" | "unstable" | "very_unstable";
    overallConstraintCompleteness: "very_complete" | "complete" | "moderate" | "incomplete" | "very_incomplete";
    overallConstraintConfidence: number;
    constraintCoverage: number;
    constraintConsistency: number;
  };
  confidenceLevel: {
    level: "very_high" | "high" | "moderate" | "low" | "insufficient";
    confidence: number;
    reason: string;
    uncertainDomains: string[];
  };
  dataQuality: {
    completeness: number;
    freshness: number;
    consistency: number;
    reliability: number;
  };
}

export class CareerCopilotConstraintIntelligenceEngine {
  private static constraintHistory: ConstraintIntelligenceOutput[] = [];
  private static readonly MAX_HISTORY_SIZE = 50;

  static trackConstraintEvolution({
    constraintId,
    constraintName,
    category,
    previousState,
    newState,
    event,
    reason,
  }: {
    constraintId: string;
    constraintName: string;
    category: string;
    previousState: string;
    newState: string;
    event: "new" | "lifted" | "strengthened" | "weakened" | "confirmed" | "contradicted";
    reason: string;
  }) {
    const evolutionEntry = {
      date: new Date().toISOString(),
      event,
      constraint: constraintName,
      category,
      previousState,
      newState,
      reason,
    };

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "constraint_intelligence",
      type: "general",
      data: evolutionEntry,
      confidence: 1.0,
    });

    // Publish event
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "constraint_intelligence",
      observationType: "general",
      data: evolutionEntry,
      confidence: 1.0,
      timestamp: new Date().toISOString(),
    });
  }

  private static extractObservations() {
    const observations = candidateAIBrain.getObservations();
    return observations.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data,
    }));
  }

  private static extractConstraintHistory() {
    const constraintEvolutions = candidateAIBrain.getObservations().filter((obs) => obs.source === "constraint_intelligence");
    return constraintEvolutions.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data,
    }));
  }

  private static extractConclusions() {
    const conclusions = candidateAIBrain.getObservations().filter((obs) => obs.source.includes("intelligence") || obs.source.includes("engine"));
    return conclusions.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data,
    }));
  }

  private static extractRecommendations() {
    const recommendations = candidateAIBrain.getObservations().filter((obs) => obs.source.includes("intelligence"));
    return recommendations.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data,
    }));
  }

  private static extractAnalysisResults() {
    const analyses = candidateAIBrain.getObservations().filter((obs) => obs.source.includes("intelligence"));
    return analyses.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data,
    }));
  }

  private static extractOutcomeData() {
    const outcomes = candidateAIBrain.getObservations().filter((obs) => obs.source.includes("outcome"));
    return outcomes.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data,
    }));
  }

  private static extractMissionData() {
    const missions = candidateAIBrain.getObservations().filter((obs) => obs.source.includes("mission"));
    return missions.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data,
    }));
  }

  private static extractPersonalizationData() {
    const personalizations = candidateAIBrain.getObservations().filter((obs) => obs.source.includes("personalization"));
    return personalizations.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      data: obs.data,
    }));
  }

  static async analyzeConstraintIntelligence(
    input: ConstraintIntelligenceInput
  ): Promise<ConstraintIntelligenceOutput> {
    const { candidateGraph, currentEvent } = input;

    // Extract data from Brain
    const observations = this.extractObservations();
    const constraintHistory = this.extractConstraintHistory();
    const conclusions = this.extractConclusions();
    const recommendations = this.extractRecommendations();
    const analysisResults = this.extractAnalysisResults();
    const outcomeData = this.extractOutcomeData();
    const missionData = this.extractMissionData();
    const personalizationData = this.extractPersonalizationData();

    // Prepare data for AI
    const candidateProfile = JSON.stringify(candidateGraph, null, 2);
    const lastMission = missionData.length > 0 ? missionData[missionData.length - 1] : null;
    const currentMission = lastMission ? JSON.stringify(lastMission.data, null, 2) : "{}";
    const recentObservations = JSON.stringify(observations.slice(-20), null, 2);
    const userInteractions = JSON.stringify(observations.slice(-10), null, 2);
    const applicationHistory = JSON.stringify(analysisResults.filter((a) => typeof a.data === 'object' && a.data !== null && 'type' in a.data && a.data.type === "application").slice(-10), null, 2);
    const interviewHistory = JSON.stringify(analysisResults.filter((a) => typeof a.data === 'object' && a.data !== null && 'type' in a.data && a.data.type === "interview").slice(-10), null, 2);
    const outcomeDataStr = JSON.stringify(outcomeData.slice(-10), null, 2);
    const personalizationDataStr = JSON.stringify(personalizationData.slice(-5), null, 2);

    // Get resource intelligence for resource-aware constraint analysis
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

    // Call AI Orchestrator
    const promptTemplate = careerCopilotConstraintIntelligenceV1.system || careerCopilotConstraintIntelligenceV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<ConstraintIntelligenceOutput>(promptTemplate);

    const request: IntelligenceRequest<ConstraintIntelligenceOutput> = {
      id: `career-copilot-constraint-intelligence-${Date.now()}`,
      type: "career-copilot-constraint-intelligence",
      input: input as unknown as ConstraintIntelligenceOutput,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
          candidateProfile,
          currentMission,
          recentObservations,
          userInteractions,
          applicationHistory,
          interviewHistory,
          outcomeData: outcomeDataStr,
          personalizationData: personalizationDataStr,
          resourceContext: JSON.stringify(resourceContext, null, 2),
        },
      },
      options: {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        temperature: 0.7,
        maxTokens: 2000,
        timeout: 30000,
      },
    };

    const result = await intelligenceUseCase.execute(request);

    const constraintIntelligence = result.output as ConstraintIntelligenceOutput;

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "constraint_intelligence",
      type: "general",
      data: {
        type: "constraint_intelligence",
        ...constraintIntelligence,
      },
      confidence: 1.0,
    });

    // Publish event
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "constraint_intelligence",
      observationType: "general",
      data: constraintIntelligence,
      confidence: 1.0,
      timestamp: new Date().toISOString(),
    });

    // Track constraint evolution
    constraintIntelligence.detectedChanges.newConstraints.forEach((newConstraint) => {
      this.trackConstraintEvolution({
        constraintId: `new_${Date.now()}`,
        constraintName: newConstraint.constraint,
        category: newConstraint.category,
        previousState: "none",
        newState: "active",
        event: "new",
        reason: newConstraint.impact,
      });
    });

    constraintIntelligence.detectedChanges.liftedConstraints.forEach((liftedConstraint) => {
      this.trackConstraintEvolution({
        constraintId: `lifted_${Date.now()}`,
        constraintName: liftedConstraint.constraint,
        category: liftedConstraint.category,
        previousState: "active",
        newState: "inactive",
        event: "lifted",
        reason: liftedConstraint.reason,
      });
    });

    constraintIntelligence.detectedChanges.strengthenedConstraints.forEach((strengthenedConstraint) => {
      this.trackConstraintEvolution({
        constraintId: `strengthened_${Date.now()}`,
        constraintName: strengthenedConstraint.constraint,
        category: strengthenedConstraint.category,
        previousState: strengthenedConstraint.previousStrength,
        newState: strengthenedConstraint.newStrength,
        event: "strengthened",
        reason: strengthenedConstraint.reason,
      });
    });

    constraintIntelligence.detectedChanges.weakenedConstraints.forEach((weakenedConstraint) => {
      this.trackConstraintEvolution({
        constraintId: `weakened_${Date.now()}`,
        constraintName: weakenedConstraint.constraint,
        category: weakenedConstraint.category,
        previousState: weakenedConstraint.previousStrength,
        newState: weakenedConstraint.newStrength,
        event: "weakened",
        reason: weakenedConstraint.reason,
      });
    });

    // Maintain history
    this.constraintHistory.push(constraintIntelligence);
    if (this.constraintHistory.length > this.MAX_HISTORY_SIZE) {
      this.constraintHistory.shift();
    }

    return constraintIntelligence;
  }

  // Helper methods for other intelligences to access constraint data

  static getConstraintSummary() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.constraintSummary;
  }

  static getConstraintsByCategory(category: "time" | "financial" | "geographic" | "family" | "professional" | "health" | "language") {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.constraintsByCategory.find((c) => c.category === category);
  }

  static getConstraintImpact() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.constraintImpact;
  }

  static getDetectedChanges() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.detectedChanges;
  }

  static getAdaptations() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.adaptations;
  }

  static getConstraintRecommendations() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.constraintRecommendations;
  }

  static getExplainability() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.explainability;
  }

  static getConstraintEvolution() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.constraintEvolution;
  }

  static getGlobalQuality() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    return latest?.globalQuality;
  }

  static getLastConstraintAnalysis(): ConstraintIntelligenceOutput | null {
    return this.constraintHistory[this.constraintHistory.length - 1] || null;
  }

  static getConstraintHistory(): ConstraintIntelligenceOutput[] {
    return [...this.constraintHistory];
  }

  static getActiveConstraints() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    if (!latest) return [];
    
    return latest.constraintsByCategory.flatMap((category) =>
      category.constraints.filter((c) => c.active)
    );
  }

  static getCriticalConstraints() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    if (!latest) return [];
    
    return latest.constraintsByCategory.flatMap((category) =>
      category.constraints.filter((c) => c.strength === "strong" && !c.negotiable)
    );
  }

  static getLiftableConstraints() {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    if (!latest) return [];
    
    return latest.constraintsByCategory.flatMap((category) =>
      category.constraints.filter((c) => c.liftable)
    );
  }

  static checkConstraintCompatibility(constraintName: string, proposedAction: string): boolean {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    if (!latest) return true;
    
    const constraint = latest.constraintsByCategory
      .flatMap((c) => c.constraints)
      .find((c) => c.name === constraintName);
    
    if (!constraint || !constraint.active) return true;
    
    // Check if the proposed action violates the constraint
    const impact = latest.constraintImpact.impossibleRecommendations;
    return !impact.some((i) => i.includes(proposedAction));
  }

  static getConstraintsAffectingDecision(decision: string) {
    const latest = this.constraintHistory[this.constraintHistory.length - 1];
    if (!latest) return [];
    
    return latest.constraintsByCategory.flatMap((category) =>
      category.constraints.filter((c) => 
        latest.constraintImpact.impossibleRecommendations.some((i) => 
          i.includes(decision) && i.includes(c.name)
        )
      )
    );
  }
}
