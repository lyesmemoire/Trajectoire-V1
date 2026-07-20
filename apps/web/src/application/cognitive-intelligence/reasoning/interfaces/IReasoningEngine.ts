/**
 * Reasoning Engine Interfaces
 * Complete reasoning pipeline for decision making
 */

import { z } from "zod";

// ============================================================================
// REASONING STAGE
// ============================================================================

export type ReasoningStage = 
  | "observation"
  | "hypotheses"
  | "arguments"
  | "counter_arguments"
  | "consequences"
  | "simulation"
  | "choice"
  | "justification"
  | "confidence"
  | "final_decision";

// ============================================================================
// REASONING STEP
// ============================================================================

export interface ReasoningStep {
  stage: ReasoningStage;
  content: string;
  data: Record<string, unknown>;
  timestamp: Date;
  confidence: number; // 0-1
}

export const ReasoningStepSchema = z.object({
  stage: z.enum(["observation", "hypotheses", "arguments", "counter_arguments", "consequences", "simulation", "choice", "justification", "confidence", "final_decision"]),
  content: z.string(),
  data: z.record(z.string(), z.unknown()),
  timestamp: z.date(),
  confidence: z.number(),
});

// ============================================================================
// REASONING TRACE
// ============================================================================

export interface ReasoningTrace {
  id: string;
  decisionId: string;
  userId: string;
  context: Record<string, unknown>;
  steps: ReasoningStep[];
  why: string;
  whyNot: string;
  hypotheses: string[];
  risks: string[];
  alternatives: string[];
  explanation: string;
  confidence: number; // 0-1
  sources: string[];
  enginesUsed: string[];
  cost: number;
  roi: number;
  expectedImpact: number; // 0-1
  probableImpact: number; // 0-1
  finalDecision: string;
  timestamp: Date;
  duration: number; // milliseconds
}

export const ReasoningTraceSchema = z.object({
  id: z.string(),
  decisionId: z.string(),
  userId: z.string(),
  context: z.record(z.string(), z.unknown()),
  steps: z.array(z.lazy(() => ReasoningStepSchema)),
  why: z.string(),
  whyNot: z.string(),
  hypotheses: z.array(z.string()),
  risks: z.array(z.string()),
  alternatives: z.array(z.string()),
  explanation: z.string(),
  confidence: z.number(),
  sources: z.array(z.string()),
  enginesUsed: z.array(z.string()),
  cost: z.number(),
  roi: z.number(),
  expectedImpact: z.number(),
  probableImpact: z.number(),
  finalDecision: z.string(),
  timestamp: z.date(),
  duration: z.number(),
});

// ============================================================================
// REASONING REQUEST
// ============================================================================

export interface ReasoningRequest {
  id: string;
  userId: string;
  objective: string;
  context: Record<string, unknown>;
  constraints: string[];
  priorities: string[];
  availableEngines: string[];
  maxCost: number;
  minConfidence: number;
  timestamp: Date;
}

export const ReasoningRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  objective: z.string(),
  context: z.record(z.string(), z.unknown()),
  constraints: z.array(z.string()),
  priorities: z.array(z.string()),
  availableEngines: z.array(z.string()),
  maxCost: z.number(),
  minConfidence: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// REASONING RESULT
// ============================================================================

export interface ReasoningResult {
  success: boolean;
  trace: ReasoningTrace | null;
  error?: string;
  timestamp: Date;
}

export const ReasoningResultSchema = z.object({
  success: z.boolean(),
  trace: z.lazy(() => ReasoningTraceSchema).nullable(),
  error: z.string().optional(),
  timestamp: z.date(),
});

// ============================================================================
// REASONING CONFIG
// ============================================================================

export interface ReasoningConfig {
  enableObservation: boolean;
  enableHypotheses: boolean;
  enableArguments: boolean;
  enableCounterArguments: boolean;
  enableConsequences: boolean;
  enableSimulation: boolean;
  enableJustification: boolean;
  minConfidenceThreshold: number;
  maxSteps: number;
  timeout: number; // milliseconds
  enableCaching: boolean;
  cacheDuration: number; // minutes
}

export const ReasoningConfigSchema = z.object({
  enableObservation: z.boolean(),
  enableHypotheses: z.boolean(),
  enableArguments: z.boolean(),
  enableCounterArguments: z.boolean(),
  enableConsequences: z.boolean(),
  enableSimulation: z.boolean(),
  enableJustification: z.boolean(),
  minConfidenceThreshold: z.number(),
  maxSteps: z.number(),
  timeout: z.number(),
  enableCaching: z.boolean(),
  cacheDuration: z.number(),
});

export const defaultReasoningConfig: ReasoningConfig = {
  enableObservation: true,
  enableHypotheses: true,
  enableArguments: true,
  enableCounterArguments: true,
  enableConsequences: true,
  enableSimulation: true,
  enableJustification: true,
  minConfidenceThreshold: 0.7,
  maxSteps: 10,
  timeout: 30000,
  enableCaching: true,
  cacheDuration: 60,
};
