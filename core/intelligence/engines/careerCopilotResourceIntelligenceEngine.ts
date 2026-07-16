import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { careerCopilotResourceIntelligenceV1 } from "../../ai/Prompts/career-copilot-resource-intelligence-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";

export interface ResourceIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}

export interface ResourceIntelligenceOutput {
  resourceSummary: {
    totalResources: number;
    availableResources: number;
    criticalResources: number;
    underutilizedResources: number;
    overutilizedResources: number;
    increasingResources: number;
    decreasingResources: number;
    stableResources: number;
    highImpactResources: number;
    lowImpactResources: number;
  };
  resourcesByCategory: Array<{
    category: "time" | "energy" | "financial" | "skills" | "network" | "mobility" | "personal" | "health" | "psychological";
    resources: Array<{
      id: string;
      name: string;
      description: string;
      availability: number;
      unit: string;
      evolution: "increasing" | "decreasing" | "stable";
      criticality: "critical" | "important" | "moderate" | "low";
      rarity: "scarce" | "limited" | "abundant";
      currentUtilization: number;
      underutilized: boolean;
      overutilized: boolean;
      potential: number;
      careerImpact: "high" | "medium" | "low";
      confidence: number;
      since: string;
      lastUpdated: string;
    }>;
    count: number;
    criticalCount: number;
    underutilizedCount: number;
    overutilizedCount: number;
  }>;
  resourceOptimization: {
    bestTimeInvestment: {
      investment: string;
      expectedImpact: string;
      resourceEfficiency: number;
      timeRequired: string;
      priority: "high" | "medium" | "low";
    };
    bestBudgetInvestment: {
      investment: string;
      expectedImpact: string;
      resourceEfficiency: number;
      budgetRequired: string;
      priority: "high" | "medium" | "low";
    };
    bestEnergyInvestment: {
      investment: string;
      expectedImpact: string;
      resourceEfficiency: number;
      energyRequired: string;
      priority: "high" | "medium" | "low";
    };
    bestTrainingInvestment: {
      investment: string;
      expectedImpact: string;
      resourceEfficiency: number;
      timeRequired: string;
      budgetRequired: string;
      priority: "high" | "medium" | "low";
    };
    bestNetworkInvestment: {
      investment: string;
      expectedImpact: string;
      resourceEfficiency: number;
      timeRequired: string;
      priority: "high" | "medium" | "low";
    };
  };
  resourceRecommendations: {
    toUse: Array<{
      resource: string;
      category: string;
      howToUse: string;
      expectedImpact: string;
      priority: "high" | "medium" | "low";
    }>;
    toPreserve: Array<{
      resource: string;
      category: string;
      whyPreserve: string;
      preservationStrategy: string;
      priority: "high" | "medium" | "low";
    }>;
    toDevelop: Array<{
      resource: string;
      category: string;
      howToDevelop: string;
      developmentTime: string;
      expectedImpact: string;
      priority: "high" | "medium" | "low";
    }>;
    toSave: Array<{
      resource: string;
      category: string;
      whySave: string;
      savingStrategy: string;
      priority: "high" | "medium" | "low";
    }>;
    toDelegate: Array<{
      resource: string;
      category: string;
      whatToDelegate: string;
      delegationStrategy: string;
      priority: "high" | "medium" | "low";
    }>;
    toAbandon: Array<{
      resource: string;
      category: string;
      whyAbandon: string;
      abandonmentStrategy: string;
      priority: "high" | "medium" | "low";
    }>;
  };
  detectedChanges: {
    resourceIncreased: Array<{
      resource: string;
      category: string;
      previousAvailability: number;
      newAvailability: number;
      reason: string;
      impact: string;
      detectedAt: string;
    }>;
    resourceDecreased: Array<{
      resource: string;
      category: string;
      previousAvailability: number;
      newAvailability: number;
      reason: string;
      impact: string;
      detectedAt: string;
    }>;
    newResource: Array<{
      resource: string;
      category: string;
      availability: number;
      origin: string;
      impact: string;
      detectedAt: string;
    }>;
    resourceLost: Array<{
      resource: string;
      category: string;
      reason: string;
      impact: string;
      lostAt: string;
    }>;
    resourceCritical: Array<{
      resource: string;
      category: string;
      whyCritical: string;
      impact: string;
      detectedAt: string;
    }>;
    resourceOptimized: Array<{
      resource: string;
      category: string;
      optimization: string;
      efficiencyGain: number;
      detectedAt: string;
    }>;
    resourceOverloaded: Array<{
      resource: string;
      category: string;
      overloadLevel: number;
      impact: string;
      detectedAt: string;
    }>;
    resourceAvailable: Array<{
      resource: string;
      category: string;
      availability: number;
      newPossibilities: string[];
      detectedAt: string;
    }>;
    resourceExhausted: Array<{
      resource: string;
      category: string;
      reason: string;
      impact: string;
      exhaustedAt: string;
    }>;
    resourceInvested: Array<{
      resource: string;
      category: string;
      investment: string;
      expectedReturn: string;
      investedAt: string;
    }>;
    resourceSaved: Array<{
      resource: string;
      category: string;
      savingStrategy: string;
      amountSaved: number;
      savedAt: string;
    }>;
    resourceReallocated: Array<{
      resource: string;
      category: string;
      from: string;
      to: string;
      reason: string;
      reallocatedAt: string;
    }>;
  };
  resourceEvaluation: {
    blockingResources: Array<{
      resource: string;
      category: string;
      whatBlocks: string[];
      blockingSeverity: "high" | "medium" | "low";
      unblockingStrategy: string;
    }>;
    criticalResources: Array<{
      resource: string;
      category: string;
      whyCritical: string;
      criticalityLevel: "very_high" | "high" | "moderate" | "low";
      preservationPriority: "high" | "medium" | "low";
    }>;
    unusedResources: Array<{
      resource: string;
      category: string;
      whyUnused: string;
      utilizationPotential: number;
      activationStrategy: string;
    }>;
    wastedResources: Array<{
      resource: string;
      category: string;
      howWasted: string;
      wasteAmount: number;
      reductionStrategy: string;
    }>;
    excessResources: Array<{
      resource: string;
      category: string;
      excessAmount: number;
      reallocationOpportunities: string[];
    }>;
    newCapacities: Array<{
      capacity: string;
      category: string;
      emergenceReason: string;
      utilizationOpportunities: string[];
    }>;
    newWeaknesses: Array<{
      weakness: string;
      category: string;
      emergenceReason: string;
      mitigationStrategy: string;
    }>;
  };
  resourceEvolution: {
    history: Array<{
      date: string;
      event: "increased" | "decreased" | "new" | "lost" | "critical" | "optimized" | "overloaded" | "available" | "exhausted" | "invested" | "saved" | "reallocated";
      resource: string;
      category: string;
      previousState: string;
      newState: string;
      reason: string;
    }>;
    trends: Array<{
      resource: string;
      trend: "increasing" | "decreasing" | "stable" | "fluctuating";
      evidence: string;
      projection: string;
    }>;
  };
  explainability: {
    whyTheseResources: string;
    whyThisAvailability: string;
    whyThisCriticality: string;
    whyThisUtilization: string;
    whyTheseOptimizations: string;
    whyTheseRecommendations: string;
    observationsUsed: string[];
    assumptions: string[];
    limitations: string[];
  };
  globalQuality: {
    overallResourceClarity: "very_clear" | "clear" | "moderate" | "unclear" | "very_unclear";
    overallResourceStability: "very_stable" | "stable" | "moderate" | "unstable" | "very_unstable";
    overallResourceCompleteness: "very_complete" | "complete" | "moderate" | "incomplete" | "very_incomplete";
    overallResourceConfidence: number;
    resourceCoverage: number;
    resourceConsistency: number;
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

export class CareerCopilotResourceIntelligenceEngine {
  private static resourceHistory: ResourceIntelligenceOutput[] = [];
  private static readonly MAX_HISTORY_SIZE = 50;

  static trackResourceEvolution({
    resourceId,
    resourceName,
    category,
    previousState,
    newState,
    event,
    reason,
  }: {
    resourceId: string;
    resourceName: string;
    category: string;
    previousState: string;
    newState: string;
    event: "increased" | "decreased" | "new" | "lost" | "critical" | "optimized" | "overloaded" | "available" | "exhausted" | "invested" | "saved" | "reallocated";
    reason: string;
  }) {
    const evolutionEntry = {
      date: new Date().toISOString(),
      event,
      resource: resourceName,
      category,
      previousState,
      newState,
      reason,
    };

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "resource_intelligence",
      type: "general",
      data: evolutionEntry,
      confidence: 1.0,
    });

    // Publish event
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "resource_intelligence",
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

  private static extractResourceHistory() {
    const resourceEvolutions = candidateAIBrain.getObservations().filter((obs) => obs.source === "resource_intelligence");
    return resourceEvolutions.map((obs) => ({
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

  static async analyzeResourceIntelligence(
    input: ResourceIntelligenceInput
  ): Promise<ResourceIntelligenceOutput> {
    const { candidateGraph, currentEvent } = input;

    // Extract data from Brain
    const observations = this.extractObservations();
    const resourceHistory = this.extractResourceHistory();
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

    // Call AI Orchestrator
    const promptTemplate = careerCopilotResourceIntelligenceV1.system || careerCopilotResourceIntelligenceV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<ResourceIntelligenceOutput>(promptTemplate);

    const request: IntelligenceRequest<ResourceIntelligenceOutput> = {
      id: `career-copilot-resource-intelligence-${Date.now()}`,
      type: "career-copilot-resource-intelligence",
      input: input as unknown as ResourceIntelligenceOutput,
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

    const resourceIntelligence = result.output as ResourceIntelligenceOutput;

    // Save to Brain as observation
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "resource_intelligence",
      type: "general",
      data: {
        type: "resource_intelligence",
        ...resourceIntelligence,
      },
      confidence: 1.0,
    });

    // Publish event
    const eventPublisher = new EventPublisher();
    eventPublisher.publish("observation_created", {
      source: "resource_intelligence",
      observationType: "general",
      data: resourceIntelligence,
      confidence: 1.0,
      timestamp: new Date().toISOString(),
    });

    // Track resource evolution
    resourceIntelligence.detectedChanges.resourceIncreased.forEach((resourceChange) => {
      this.trackResourceEvolution({
        resourceId: `increased_${Date.now()}`,
        resourceName: resourceChange.resource,
        category: resourceChange.category,
        previousState: resourceChange.previousAvailability.toString(),
        newState: resourceChange.newAvailability.toString(),
        event: "increased",
        reason: resourceChange.reason,
      });
    });

    resourceIntelligence.detectedChanges.resourceDecreased.forEach((resourceChange) => {
      this.trackResourceEvolution({
        resourceId: `decreased_${Date.now()}`,
        resourceName: resourceChange.resource,
        category: resourceChange.category,
        previousState: resourceChange.previousAvailability.toString(),
        newState: resourceChange.newAvailability.toString(),
        event: "decreased",
        reason: resourceChange.reason,
      });
    });

    resourceIntelligence.detectedChanges.newResource.forEach((resourceChange) => {
      this.trackResourceEvolution({
        resourceId: `new_${Date.now()}`,
        resourceName: resourceChange.resource,
        category: resourceChange.category,
        previousState: "none",
        newState: resourceChange.availability.toString(),
        event: "new",
        reason: resourceChange.impact,
      });
    });

    resourceIntelligence.detectedChanges.resourceLost.forEach((resourceChange) => {
      this.trackResourceEvolution({
        resourceId: `lost_${Date.now()}`,
        resourceName: resourceChange.resource,
        category: resourceChange.category,
        previousState: "available",
        newState: "unavailable",
        event: "lost",
        reason: resourceChange.reason,
      });
    });

    resourceIntelligence.detectedChanges.resourceCritical.forEach((resourceChange) => {
      this.trackResourceEvolution({
        resourceId: `critical_${Date.now()}`,
        resourceName: resourceChange.resource,
        category: resourceChange.category,
        previousState: "normal",
        newState: "critical",
        event: "critical",
        reason: resourceChange.whyCritical,
      });
    });

    // Maintain history
    this.resourceHistory.push(resourceIntelligence);
    if (this.resourceHistory.length > this.MAX_HISTORY_SIZE) {
      this.resourceHistory.shift();
    }

    return resourceIntelligence;
  }

  // Helper methods for other intelligences to access resource data

  static getResourceSummary() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.resourceSummary;
  }

  static getResourcesByCategory(category: "time" | "energy" | "financial" | "skills" | "network" | "mobility" | "personal" | "health" | "psychological") {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.resourcesByCategory.find((c) => c.category === category);
  }

  static getResourceOptimization() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.resourceOptimization;
  }

  static getResourceRecommendations() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.resourceRecommendations;
  }

  static getDetectedChanges() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.detectedChanges;
  }

  static getResourceEvaluation() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.resourceEvaluation;
  }

  static getResourceEvolution() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.resourceEvolution;
  }

  static getExplainability() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.explainability;
  }

  static getGlobalQuality() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    return latest?.globalQuality;
  }

  static getLastResourceAnalysis(): ResourceIntelligenceOutput | null {
    return this.resourceHistory[this.resourceHistory.length - 1] || null;
  }

  static getResourceHistory(): ResourceIntelligenceOutput[] {
    return [...this.resourceHistory];
  }

  static getAvailableResources() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    if (!latest) return [];
    
    return latest.resourcesByCategory.flatMap((category) =>
      category.resources.filter((r) => r.availability > 0)
    );
  }

  static getCriticalResources() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    if (!latest) return [];
    
    return latest.resourcesByCategory.flatMap((category) =>
      category.resources.filter((r) => r.criticality === "critical")
    );
  }

  static getUnderutilizedResources() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    if (!latest) return [];
    
    return latest.resourcesByCategory.flatMap((category) =>
      category.resources.filter((r) => r.underutilized)
    );
  }

  static getOverutilizedResources() {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    if (!latest) return [];
    
    return latest.resourcesByCategory.flatMap((category) =>
      category.resources.filter((r) => r.overutilized)
    );
  }

  static checkResourceFeasibility(requiredResources: { [key: string]: number }, proposedAction: string): {
    feasible: boolean;
    missingResources: string[];
    resourceEfficiency: number;
  } {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    if (!latest) return { feasible: true, missingResources: [], resourceEfficiency: 1.0 };

    const missingResources: string[] = [];
    let totalEfficiency = 0;
    let resourceCount = 0;

    for (const [resourceName, requiredAmount] of Object.entries(requiredResources)) {
      const resource = latest.resourcesByCategory.flatMap((cat) => cat.resources).find((r) => r.name === resourceName);
      
      if (!resource) {
        missingResources.push(resourceName);
        continue;
      }

      if (resource.availability < requiredAmount) {
        missingResources.push(resourceName);
      }

      const efficiency = resource.availability / requiredAmount;
      totalEfficiency += Math.min(efficiency, 1.0);
      resourceCount++;
    }

    const avgEfficiency = resourceCount > 0 ? totalEfficiency / resourceCount : 1.0;

    return {
      feasible: missingResources.length === 0,
      missingResources,
      resourceEfficiency: avgEfficiency,
    };
  }

  static getResourceAvailability(resourceName: string): number | null {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    if (!latest) return null;

    const resource = latest.resourcesByCategory.flatMap((cat) => cat.resources).find((r) => r.name === resourceName);
    return resource?.availability || null;
  }

  static getBestInvestment(resourceType: "time" | "budget" | "energy" | "training" | "network"): string | null {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];
    if (!latest) return null;

    const optimization = latest.resourceOptimization;
    switch (resourceType) {
      case "time":
        return optimization.bestTimeInvestment?.investment || null;
      case "budget":
        return optimization.bestBudgetInvestment?.investment || null;
      case "energy":
        return optimization.bestEnergyInvestment?.investment || null;
      case "training":
        return optimization.bestTrainingInvestment?.investment || null;
      case "network":
        return optimization.bestNetworkInvestment?.investment || null;
      default:
        return null;
    }
  }
}
