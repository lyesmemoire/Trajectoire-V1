import { z } from "zod";

// ===================================================================
// DECISION GRAPH — Decision Graph Contract
// ===================================================================

export interface DecisionNode {
  id: string;
  type: string;
  confidence: number;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface DecisionEdge {
  from: string;
  to: string;
  weight: number;
  reason: string;
}

export interface DecisionPath {
  nodes: DecisionNode[];
  edges: DecisionEdge[];
  totalConfidence: number;
}

export interface DecisionGraph {
  nodes: Map<string, DecisionNode>;
  edges: Map<string, DecisionEdge[]>;
  root: string | null;
}

export interface DecisionEvaluation {
  nodeId: string;
  confidence: number;
  evidenceCount: number;
  riskLevel: string;
}

// Zod Schemas
export const DecisionNodeSchema = z.object({
  id: z.string().uuid(),
  type: z.string().min(1),
  confidence: z.number().min(0).max(1),
  timestamp: z.date(),
  metadata: z.record(z.string(), z.any()),
});

export const DecisionEdgeSchema = z.object({
  from: z.string().uuid(),
  to: z.string().uuid(),
  weight: z.number().min(0).max(1),
  reason: z.string().min(1),
});

export const DecisionGraphSchema = z.object({
  nodes: z.record(z.string(), DecisionNodeSchema),
  edges: z.record(z.string(), z.array(DecisionEdgeSchema)),
  root: z.string().uuid().nullable(),
});
