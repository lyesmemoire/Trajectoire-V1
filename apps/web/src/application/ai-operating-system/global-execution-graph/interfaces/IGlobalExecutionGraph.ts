/**
 * Global AI Execution Graph Interfaces
 * Orchestrates all AI engines through a unified execution graph
 */

import { z } from "zod";

// ============================================================================
// NODE STATUS
// ============================================================================

export type NodeStatus = 
  | "idle"
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "fallback"
  | "retrying";

// ============================================================================
// NODE TYPE
// ============================================================================

export type NodeType = 
  | "conversation"
  | "reasoning"
  | "policy"
  | "world_model"
  | "planning"
  | "adaptive_journey"
  | "recommendation_fusion"
  | "roi"
  | "execution"
  | "reflection"
  | "meta_cognition"
  | "memory"
  | "analytics"
  | "home_intelligence"
  | "adaptive_interview"
  | "live_coaching"
  | "adaptive_feedback"
  | "smart_notifications"
  | "feedback_learning"
  | "cost_optimization";

// ============================================================================
// EXECUTION NODE
// ============================================================================

export interface ExecutionNode {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  inputs: string[]; // Input node IDs
  outputs: string[]; // Output node IDs
  dependencies: string[]; // Dependency node IDs
  priority: number; // 0-100
  executionTime: number; // milliseconds (average)
  confidence: number; // 0-1
  cost: number; // dollars
  expectedImpact: number; // 0-1
  rollbackStrategy: string;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number; // milliseconds
    backoffMultiplier: number;
  };
  timeout: number; // milliseconds
  fallback: string | null; // Fallback node ID
  status: NodeStatus;
  startTime: Date | null;
  endTime: Date | null;
  retryCount: number;
  result: any;
  error: string | null;
  metadata: Record<string, unknown>;
}

export const ExecutionNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["conversation", "reasoning", "policy", "world_model", "planning", "adaptive_journey", "recommendation_fusion", "roi", "execution", "reflection", "meta_cognition", "memory", "analytics", "home_intelligence", "adaptive_interview", "live_coaching", "adaptive_feedback", "smart_notifications", "feedback_learning", "cost_optimization"]),
  name: z.string(),
  description: z.string(),
  inputs: z.array(z.string()),
  outputs: z.array(z.string()),
  dependencies: z.array(z.string()),
  priority: z.number(),
  executionTime: z.number(),
  confidence: z.number(),
  cost: z.number(),
  expectedImpact: z.number(),
  rollbackStrategy: z.string(),
  retryPolicy: z.object({
    maxRetries: z.number(),
    retryDelay: z.number(),
    backoffMultiplier: z.number(),
  }),
  timeout: z.number(),
  fallback: z.string().nullable(),
  status: z.enum(["idle", "pending", "running", "completed", "failed", "cancelled", "fallback", "retrying"]),
  startTime: z.date().nullable(),
  endTime: z.date().nullable(),
  retryCount: z.number(),
  result: z.unknown(),
  error: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
});

// ============================================================================
// EXECUTION EDGE
// ============================================================================

export interface ExecutionEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  condition: string | null; // Optional condition for edge traversal
  weight: number; // 0-1
  dataFlow: Record<string, unknown>;
}

export const ExecutionEdgeSchema = z.object({
  id: z.string(),
  sourceNodeId: z.string(),
  targetNodeId: z.string(),
  condition: z.string().nullable(),
  weight: z.number(),
  dataFlow: z.record(z.string(), z.unknown()),
});

// ============================================================================
// EXECUTION GRAPH
// ============================================================================

export interface ExecutionGraph {
  id: string;
  name: string;
  description: string;
  nodes: Map<string, ExecutionNode>;
  edges: Map<string, ExecutionEdge>;
  entryNodes: string[];
  exitNodes: string[];
  createdAt: Date;
  lastModified: Date;
}

export const ExecutionGraphSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  nodes: z.any(), // Map serialization handled separately
  edges: z.any(), // Map serialization handled separately
  entryNodes: z.array(z.string()),
  exitNodes: z.array(z.string()),
  createdAt: z.date(),
  lastModified: z.date(),
});

// ============================================================================
// EXECUTION PLAN
// ============================================================================

export interface ExecutionPlan {
  graphId: string;
  executionId: string;
  executionOrder: string[]; // Node IDs in execution order
  parallelGroups: string[][]; // Groups of nodes that can run in parallel
  estimatedDuration: number; // milliseconds
  estimatedCost: number; // dollars
  confidence: number; // 0-1
  createdAt: Date;
}

export const ExecutionPlanSchema = z.object({
  graphId: z.string(),
  executionId: z.string(),
  executionOrder: z.array(z.string()),
  parallelGroups: z.array(z.array(z.string())),
  estimatedDuration: z.number(),
  estimatedCost: z.number(),
  confidence: z.number(),
  createdAt: z.date(),
});

// ============================================================================
// EXECUTION RESULT
// ============================================================================

export interface ExecutionResult {
  executionId: string;
  graphId: string;
  status: "success" | "partial_success" | "failed";
  startTime: Date;
  endTime: Date;
  duration: number; // milliseconds
  totalCost: number; // dollars
  nodeResults: Map<string, unknown>;
  errors: string[];
  warnings: string[];
  finalOutput: any;
  confidence: number; // 0-1
}

export const ExecutionResultSchema = z.object({
  executionId: z.string(),
  graphId: z.string(),
  status: z.enum(["success", "partial_success", "failed"]),
  startTime: z.date(),
  endTime: z.date(),
  duration: z.number(),
  totalCost: z.number(),
  nodeResults: z.any(), // Map serialization handled separately
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  finalOutput: z.unknown(),
  confidence: z.number(),
});

// ============================================================================
// GRAPH OPTIMIZATION
// ============================================================================

export interface GraphOptimization {
  id: string;
  graphId: string;
  optimizationType: "remove" | "merge" | "replace" | "optimize" | "cache" | "compress" | "defer" | "parallelize" | "disable" | "rewrite";
  targetNodeId: string | null;
  description: string;
  expectedImprovement: number; // 0-1
  effort: number; // 0-1
  priority: number; // 0-100
  status: "pending" | "in_progress" | "implemented" | "rejected";
  createdAt: Date;
}

export const GraphOptimizationSchema = z.object({
  id: z.string(),
  graphId: z.string(),
  optimizationType: z.enum(["remove", "merge", "replace", "optimize", "cache", "compress", "defer", "parallelize", "disable", "rewrite"]),
  targetNodeId: z.string().nullable(),
  description: z.string(),
  expectedImprovement: z.number(),
  effort: z.number(),
  priority: z.number(),
  status: z.enum(["pending", "in_progress", "implemented", "rejected"]),
  createdAt: z.date(),
});

// ============================================================================
// GLOBAL EXECUTION GRAPH CONFIG
// ============================================================================

export interface GlobalExecutionGraphConfig {
  maxParallelNodes: number;
  defaultTimeout: number; // milliseconds
  defaultRetryPolicy: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  enableAutoOptimization: boolean;
  enableCaching: boolean;
  enableMonitoring: boolean;
  optimizationInterval: number; // milliseconds
  cacheDuration: number; // milliseconds
}

export const GlobalExecutionGraphConfigSchema = z.object({
  maxParallelNodes: z.number(),
  defaultTimeout: z.number(),
  defaultRetryPolicy: z.object({
    maxRetries: z.number(),
    retryDelay: z.number(),
    backoffMultiplier: z.number(),
  }),
  enableAutoOptimization: z.boolean(),
  enableCaching: z.boolean(),
  enableMonitoring: z.boolean(),
  optimizationInterval: z.number(),
  cacheDuration: z.number(),
});

export const defaultGlobalExecutionGraphConfig: GlobalExecutionGraphConfig = {
  maxParallelNodes: 10,
  defaultTimeout: 30000,
  defaultRetryPolicy: {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  },
  enableAutoOptimization: true,
  enableCaching: true,
  enableMonitoring: true,
  optimizationInterval: 60000,
  cacheDuration: 300000,
};
