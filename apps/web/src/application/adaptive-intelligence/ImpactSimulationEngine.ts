/**
 * Impact Simulation Engine
 * Simulates impact of actions before execution
 */

import {
  ImpactSimulation,
  ImpactMetrics,
  ImpactAlternative,
  SimulationConfig,
  SimulationResult,
  ActualImpact,
  defaultSimulationConfig,
} from "./interfaces/IImpactSimulationEngine";

// ============================================================================
// IMPACT SIMULATION ENGINE CLASS
// ============================================================================

export class ImpactSimulationEngine {
  private static instance: ImpactSimulationEngine;
  private config: SimulationConfig;
  private simulations: Map<string, ImpactSimulation> = new Map();
  private results: Map<string, SimulationResult> = new Map();
  private actualImpacts: ActualImpact[] = [];

  private constructor() {
    this.config = defaultSimulationConfig;
  }

  static getInstance(): ImpactSimulationEngine {
    if (!ImpactSimulationEngine.instance) {
      ImpactSimulationEngine.instance = new ImpactSimulationEngine();
    }
    return ImpactSimulationEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Simulate impact of action
   */
  simulateImpact(
    actionId: string,
    actionType: string,
    parameters: Record<string, unknown>
  ): ImpactSimulation {
    const expectedImpact = this.calculateExpectedImpact(actionType, parameters);
    const confidence = this.calculateConfidence(expectedImpact);
    const alternatives = this.config.considerAlternatives 
      ? this.generateAlternatives(actionType, parameters, expectedImpact)
      : [];

    const simulation: ImpactSimulation = {
      id: `simulation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      actionId,
      actionType,
      parameters,
      expectedImpact,
      confidence,
      alternatives,
      timestamp: new Date(),
    };

    this.simulations.set(simulation.id, simulation);
    return simulation;
  }

  /**
   * Calculate expected impact
   */
  private calculateExpectedImpact(actionType: string, parameters: Record<string, unknown>): ImpactMetrics {
    // Base impact based on action type
    const baseImpact = this.getBaseImpact(actionType);

    // Adjust based on parameters
    const adjustedImpact = this.adjustImpactByParameters(baseImpact, parameters);

    // Calculate uncertainty
    const uncertainty = this.calculateUncertainty(actionType, parameters);

    // Determine risk level
    const riskLevel = this.determineRiskLevel(adjustedImpact, uncertainty);

    return {
      ...adjustedImpact,
      riskLevel,
      uncertainty,
    };
  }

  /**
   * Get base impact for action type
   */
  private getBaseImpact(actionType: string): Omit<ImpactMetrics, "riskLevel" | "uncertainty"> {
    const impacts: Record<string, Omit<ImpactMetrics, "riskLevel" | "uncertainty">> = {
      simulation: {
        scoreImprovement: 0.15,
        confidenceImprovement: 0.10,
        engagementImprovement: 0.12,
        skillDevelopment: 0.20,
        timeToImpact: 30,
        impactDuration: 60,
      },
      exercise: {
        scoreImprovement: 0.10,
        confidenceImprovement: 0.08,
        engagementImprovement: 0.10,
        skillDevelopment: 0.15,
        timeToImpact: 20,
        impactDuration: 45,
      },
      mock_interview: {
        scoreImprovement: 0.20,
        confidenceImprovement: 0.15,
        engagementImprovement: 0.18,
        skillDevelopment: 0.25,
        timeToImpact: 45,
        impactDuration: 90,
      },
      stress_interview: {
        scoreImprovement: 0.25,
        confidenceImprovement: 0.20,
        engagementImprovement: 0.15,
        skillDevelopment: 0.30,
        timeToImpact: 60,
        impactDuration: 120,
      },
      rest: {
        scoreImprovement: 0.02,
        confidenceImprovement: 0.05,
        engagementImprovement: 0.08,
        skillDevelopment: 0.00,
        timeToImpact: 15,
        impactDuration: 30,
      },
      review: {
        scoreImprovement: 0.05,
        confidenceImprovement: 0.10,
        engagementImprovement: 0.12,
        skillDevelopment: 0.08,
        timeToImpact: 10,
        impactDuration: 30,
      },
    };

    return impacts[actionType] || impacts.simulation;
  }

  /**
   * Adjust impact based on parameters
   */
  private adjustImpactByParameters(
    base: Omit<ImpactMetrics, "riskLevel" | "uncertainty">,
    parameters: Record<string, unknown>
  ): Omit<ImpactMetrics, "riskLevel" | "uncertainty"> {
    const adjusted = { ...base };

    // Adjust based on difficulty
    if (parameters.difficulty === "hard") {
      adjusted.scoreImprovement *= 1.5;
      adjusted.skillDevelopment *= 1.3;
      adjusted.timeToImpact *= 1.2;
    } else if (parameters.difficulty === "easy") {
      adjusted.scoreImprovement *= 0.7;
      adjusted.skillDevelopment *= 0.8;
      adjusted.timeToImpact *= 0.8;
    }

    // Adjust based on duration
    if (parameters.duration) {
      const durationFactor = (parameters.duration as any) / 45; // 45 minutes is baseline
      adjusted.impactDuration *= durationFactor;
      adjusted.skillDevelopment *= Math.min(1.5, durationFactor);
    }

    return adjusted;
  }

  /**
   * Calculate uncertainty
   */
  private calculateUncertainty(actionType: string, parameters: Record<string, unknown>): number {
    let uncertainty = 0.3; // Base uncertainty

    // Higher uncertainty for complex actions
    if (actionType === "stress_interview") uncertainty += 0.2;
    if (actionType === "mock_interview") uncertainty += 0.1;

    // Higher uncertainty for hard difficulty
    if (parameters.difficulty === "hard") uncertainty += 0.15;

    // Lower uncertainty with more parameters
    if (Object.keys(parameters).length > 5) uncertainty -= 0.1;

    return Math.min(1, Math.max(0, uncertainty));
  }

  /**
   * Determine risk level
   */
  private determineRiskLevel(
    impact: Omit<ImpactMetrics, "riskLevel" | "uncertainty">,
    uncertainty: number
  ): "low" | "medium" | "high" {
    const riskScore = uncertainty * 0.5 + (1 - impact.scoreImprovement) * 0.3 + (1 - impact.confidenceImprovement) * 0.2;

    if (this.config.maxRiskLevel === "low") {
      return riskScore < 0.3 ? "low" : "medium";
    } else if (this.config.maxRiskLevel === "medium") {
      if (riskScore < 0.3) return "low";
      if (riskScore < 0.6) return "medium";
      return "high";
    } else {
      return riskScore < 0.7 ? "low" : "medium";
    }
  }

  /**
   * Calculate confidence in simulation
   */
  private calculateConfidence(impact: ImpactMetrics): number {
    let confidence = 0.5;

    // Higher confidence with lower uncertainty
    confidence += (1 - impact.uncertainty) * 0.3;

    // Higher confidence with lower risk
    if (impact.riskLevel === "low") confidence += 0.2;
    else if (impact.riskLevel === "medium") confidence += 0.1;

    return Math.min(1, confidence);
  }

  /**
   * Generate alternatives
   */
  private generateAlternatives(
    actionType: string,
    parameters: Record<string, unknown>,
    originalImpact: ImpactMetrics
  ): ImpactAlternative[] {
    const alternatives: ImpactAlternative[] = [];

    // Alternative 1: Different action type
    const alternativeTypes = ["exercise", "review", "simulation"];
    alternativeTypes.forEach(type => {
      if (type !== actionType) {
        const altImpact = this.calculateExpectedImpact(type, parameters);
        alternatives.push({
          actionType: type,
          parameters,
          expectedImpact: altImpact,
          confidence: this.calculateConfidence(altImpact),
          tradeoffs: this.generateTradeoffs(originalImpact, altImpact),
        });
      }
    });

    // Alternative 2: Different difficulty
    if (parameters.difficulty === "hard") {
      const altParams = { ...parameters, difficulty: "medium" };
      const altImpact = this.calculateExpectedImpact(actionType, altParams);
      alternatives.push({
        actionType,
        parameters: altParams,
        expectedImpact: altImpact,
        confidence: this.calculateConfidence(altImpact),
        tradeoffs: ["Lower difficulty", "Faster impact", "Less skill development"],
      });
    }

    return alternatives.slice(0, this.config.maxAlternatives);
  }

  /**
   * Generate tradeoffs between alternatives
   */
  private generateTradeoffs(original: ImpactMetrics, alternative: ImpactMetrics): string[] {
    const tradeoffs: string[] = [];

    if (alternative.scoreImprovement < original.scoreImprovement) {
      tradeoffs.push("Lower score improvement");
    } else {
      tradeoffs.push("Higher score improvement");
    }

    if (alternative.timeToImpact > original.timeToImpact) {
      tradeoffs.push("Slower impact");
    } else {
      tradeoffs.push("Faster impact");
    }

    if (alternative.uncertainty > original.uncertainty) {
      tradeoffs.push("Higher uncertainty");
    } else {
      tradeoffs.push("Lower uncertainty");
    }

    return tradeoffs;
  }

  /**
   * Evaluate simulation and generate result
   */
  evaluateSimulation(simulationId: string, cost: number): SimulationResult {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }

    const recommended = this.isRecommended(simulation);
    const selectedAlternative = this.selectAlternative(simulation, recommended);
    const reasoning = this.generateReasoning(simulation, recommended, selectedAlternative);
    const expectedValue = this.calculateExpectedValue(simulation);
    const expectedROI = cost > 0 ? (expectedValue - cost) / cost : 0;

    const result: SimulationResult = {
      simulationId,
      recommended,
      selectedAlternative,
      reasoning,
      expectedValue,
      expectedCost: cost,
      expectedROI,
      timestamp: new Date(),
    };

    this.results.set(result.simulationId, result);
    return result;
  }

  /**
   * Check if simulation is recommended
   */
  private isRecommended(simulation: ImpactSimulation): boolean {
    // Check confidence threshold
    if (simulation.confidence < this.config.minConfidence) {
      return false;
    }

    // Check uncertainty threshold
    if (simulation.expectedImpact.uncertainty > this.config.maxUncertainty) {
      return false;
    }

    // Check risk level
    const riskLevels = { low: 1, medium: 2, high: 3 };
    const maxRisk = riskLevels[this.config.maxRiskLevel];
    const currentRisk = riskLevels[simulation.expectedImpact.riskLevel];

    if (currentRisk > maxRisk) {
      return false;
    }

    // Check impact threshold
    const totalImpact = 
      simulation.expectedImpact.scoreImprovement +
      simulation.expectedImpact.confidenceImprovement +
      simulation.expectedImpact.engagementImprovement;

    if (totalImpact < this.config.minImpactThreshold) {
      return false;
    }

    return true;
  }

  /**
   * Select best alternative
   */
  private selectAlternative(simulation: ImpactSimulation, recommended: boolean): string | null {
    if (recommended) {
      return null; // Use original action
    }

    // Find best alternative
    const bestAlternative = simulation.alternatives.reduce((best, alt) => {
      const altScore = alt.expectedImpact.scoreImprovement * alt.confidence;
      const bestScore = best.expectedImpact.scoreImprovement * best.confidence;
      return altScore > bestScore ? alt : best;
    }, simulation.alternatives[0]);

    return bestAlternative ? bestAlternative.actionType : null;
  }

  /**
   * Generate reasoning
   */
  private generateReasoning(
    simulation: ImpactSimulation,
    recommended: boolean,
    selectedAlternative: string | null
  ): string {
    const reasons: string[] = [];

    if (recommended) {
      reasons.push("Action recommended based on positive impact simulation");
      reasons.push(`Expected score improvement: ${(simulation.expectedImpact.scoreImprovement * 100).toFixed(1)}%`);
      reasons.push(`Confidence: ${(simulation.confidence * 100).toFixed(1)}%`);
    } else {
      reasons.push("Action not recommended based on simulation");
      reasons.push(`Confidence below threshold: ${(simulation.confidence * 100).toFixed(1)}% < ${(this.config.minConfidence * 100).toFixed(1)}%`);
      
      if (selectedAlternative) {
        reasons.push(`Alternative recommended: ${selectedAlternative}`);
      }
    }

    return reasons.join("; ");
  }

  /**
   * Calculate expected value
   */
  private calculateExpectedValue(simulation: ImpactSimulation): number {
    const impactScore = 
      simulation.expectedImpact.scoreImprovement +
      simulation.expectedImpact.confidenceImprovement +
      simulation.expectedImpact.engagementImprovement +
      simulation.expectedImpact.skillDevelopment;

    return impactScore * simulation.confidence;
  }

  /**
   * Record actual impact
   */
  recordActualImpact(simulationId: string, actualMetrics: ImpactMetrics): void {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }

    const accuracy = this.calculateAccuracy(simulation.expectedImpact, actualMetrics);

    const actualImpact: ActualImpact = {
      simulationId,
      actualMetrics,
      expectedMetrics: simulation.expectedImpact,
      accuracy,
      timestamp: new Date(),
    };

    this.actualImpacts.push(actualImpact);
  }

  /**
   * Calculate accuracy of simulation
   */
  private calculateAccuracy(expected: ImpactMetrics, actual: ImpactMetrics): number {
    const scoreDiff = Math.abs(expected.scoreImprovement - actual.scoreImprovement);
    const confidenceDiff = Math.abs(expected.confidenceImprovement - actual.confidenceImprovement);
    const engagementDiff = Math.abs(expected.engagementImprovement - actual.engagementImprovement);

    const avgDiff = (scoreDiff + confidenceDiff + engagementDiff) / 3;
    return Math.max(0, 1 - avgDiff);
  }

  /**
   * Get simulation by ID
   */
  getSimulation(simulationId: string): ImpactSimulation | null {
    return this.simulations.get(simulationId) || null;
  }

  /**
   * Get result by ID
   */
  getResult(simulationId: string): SimulationResult | null {
    return this.results.get(simulationId) || null;
  }

  /**
   * Get simulation statistics
   */
  getStatistics(): {
    totalSimulations: number;
    recommendedActions: number;
    notRecommendedActions: number;
    averageConfidence: number;
    averageAccuracy: number;
    riskDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
  } {
    const simulations = Array.from(this.simulations.values());
    const results = Array.from(this.results.values());

    const totalSimulations = simulations.length;
    const recommendedActions = results.filter(r => r.recommended).length;
    const notRecommendedActions = results.length - recommendedActions;

    const averageConfidence = totalSimulations > 0
      ? simulations.reduce((sum, s) => sum + s.confidence, 0) / totalSimulations
      : 0;

    const averageAccuracy = this.actualImpacts.length > 0
      ? this.actualImpacts.reduce((sum, a) => sum + a.accuracy, 0) / this.actualImpacts.length
      : 0;

    const riskDistribution: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };

    simulations.forEach(s => {
      riskDistribution[s.expectedImpact.riskLevel]++;
    });

    const typeDistribution: Record<string, number> = {};
    simulations.forEach(s => {
      typeDistribution[s.actionType] = (typeDistribution[s.actionType] || 0) + 1;
    });

    return {
      totalSimulations,
      recommendedActions,
      notRecommendedActions,
      averageConfidence,
      averageAccuracy,
      riskDistribution,
      typeDistribution,
    };
  }

  /**
   * Export data
   */
  exportData(): {
    simulations: ImpactSimulation[];
    results: SimulationResult[];
    actualImpacts: ActualImpact[];
    config: SimulationConfig;
  } {
    return {
      simulations: Array.from(this.simulations.values()),
      results: Array.from(this.results.values()),
      actualImpacts: this.actualImpacts,
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    simulations: ImpactSimulation[];
    results: SimulationResult[];
    actualImpacts: ActualImpact[];
    config?: SimulationConfig;
  }): void {
    data.simulations.forEach(s => {
      this.simulations.set(s.id, s);
    });
    data.results.forEach(r => {
      this.results.set(r.simulationId, r);
    });
    this.actualImpacts = data.actualImpacts;
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.simulations.clear();
    this.results.clear();
    this.actualImpacts = [];
  }
}

export const impactSimulationEngine = ImpactSimulationEngine.getInstance();
