/**
 * Impact Simulation Engine Interfaces
 * Simulates impact of actions before execution
 */

import { z } from "zod";

// ============================================================================
// IMPACT SIMULATION
// ============================================================================

export interface ImpactSimulation {
  id: string;
  actionId: string;
  actionType: string;
  parameters: Record<string, unknown>;
  expectedImpact: ImpactMetrics;
  confidence: number;
  alternatives: ImpactAlternative[];
  timestamp: Date;
}

export const ImpactSimulationSchema = z.object({
  id: z.string(),
  actionId: z.string(),
  actionType: z.string(),
  parameters: z.record(z.string(), z.any()),
  expectedImpact: z.lazy(() => ImpactMetricsSchema),
  confidence: z.number(),
  alternatives: z.array(z.lazy(() => ImpactAlternativeSchema)),
  timestamp: z.date(),
});

// ============================================================================
// IMPACT METRICS
// ============================================================================

export interface ImpactMetrics {
  scoreImprovement: number; // Expected improvement in score
  confidenceImprovement: number; // Expected improvement in confidence
  engagementImprovement: number; // Expected improvement in engagement
  skillDevelopment: number; // Expected skill development
  timeToImpact: number; // Time to see impact (minutes)
  impactDuration: number; // Duration of impact (minutes)
  riskLevel: "low" | "medium" | "high";
  uncertainty: number; // 0-1, how uncertain the prediction is
}

export const ImpactMetricsSchema = z.object({
  scoreImprovement: z.number(),
  confidenceImprovement: z.number(),
  engagementImprovement: z.number(),
  skillDevelopment: z.number(),
  timeToImpact: z.number(),
  impactDuration: z.number(),
  riskLevel: z.enum(["low", "medium", "high"]),
  uncertainty: z.number(),
});

// ============================================================================
// IMPACT ALTERNATIVE
// ============================================================================

export interface ImpactAlternative {
  actionType: string;
  parameters: Record<string, unknown>;
  expectedImpact: ImpactMetrics;
  confidence: number;
  tradeoffs: string[];
}

export const ImpactAlternativeSchema = z.object({
  actionType: z.string(),
  parameters: z.record(z.string(), z.any()),
  expectedImpact: z.lazy(() => ImpactMetricsSchema),
  confidence: z.number(),
  tradeoffs: z.array(z.string()),
});

// ============================================================================
// SIMULATION CONFIG
// ============================================================================

export interface SimulationConfig {
  minConfidence: number;
  maxUncertainty: number;
  maxRiskLevel: "low" | "medium" | "high";
  minImpactThreshold: number;
  simulationDepth: number;
  considerAlternatives: boolean;
  maxAlternatives: number;
}

export const SimulationConfigSchema = z.object({
  minConfidence: z.number(),
  maxUncertainty: z.number(),
  maxRiskLevel: z.enum(["low", "medium", "high"]),
  minImpactThreshold: z.number(),
  simulationDepth: z.number(),
  considerAlternatives: z.boolean(),
  maxAlternatives: z.number(),
});

export const defaultSimulationConfig: SimulationConfig = {
  minConfidence: 0.6,
  maxUncertainty: 0.4,
  maxRiskLevel: "medium",
  minImpactThreshold: 0.05, // 5% minimum impact
  simulationDepth: 3,
  considerAlternatives: true,
  maxAlternatives: 3,
};

// ============================================================================
// SIMULATION RESULT
// ============================================================================

export interface SimulationResult {
  simulationId: string;
  recommended: boolean;
  selectedAlternative: string | null;
  reasoning: string;
  expectedValue: number;
  expectedCost: number;
  expectedROI: number;
  timestamp: Date;
}

export const SimulationResultSchema = z.object({
  simulationId: z.string(),
  recommended: z.boolean(),
  selectedAlternative: z.string().nullable(),
  reasoning: z.string(),
  expectedValue: z.number(),
  expectedCost: z.number(),
  expectedROI: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// ACTUAL IMPACT
// ============================================================================

export interface ActualImpact {
  simulationId: string;
  actualMetrics: ImpactMetrics;
  expectedMetrics: ImpactMetrics;
  accuracy: number;
  timestamp: Date;
}

export const ActualImpactSchema = z.object({
  simulationId: z.string(),
  actualMetrics: z.lazy(() => ImpactMetricsSchema),
  expectedMetrics: z.lazy(() => ImpactMetricsSchema),
  accuracy: z.number(),
  timestamp: z.date(),
});
