// runtime/types/graph.ts
/**
 * Shared graph type definitions for the deterministic interview runtime.
 */

// Branded IDs for compile‑time safety
export type TopicNodeId = string & { readonly __brand: "TopicNodeId" };
export type ReplayCheckpointId = string & {
  readonly __brand: "ReplayCheckpointId";
};

/**
 * Edge relationship types.
 */
export type EdgeRelation =
  | "parent"
  | "related"
  | "dependency"
  | "contradiction"
  | "followup";

/**
 * Graph edge representation.
 */
export interface TopicEdge {
  from: TopicNodeId;
  to: TopicNodeId;
  relation: EdgeRelation;
  /** Weight in the inclusive range [0, 1] */
  weight: number;
}

/**
 * Node metadata stored in the graph.
 */
export interface NodeMetadata {
  readonly id: TopicNodeId;
  readonly topic: string;
  readonly subtopic?: string;
  /** Saturation score – 0 (unused) to 1 (exhausted) */
  readonly saturationScore: number;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly lastTraversedAt?: number;
}

/** Result of a mutation operation on the graph. */
export interface GraphMutationResult {
  readonly success: boolean;
  readonly error?: string;
}

/** Snapshot of the entire graph for replay / debugging. */
export interface TopicGraphSnapshot {
  readonly nodes: readonly NodeMetadata[];
  readonly edges: readonly TopicEdge[];
  readonly createdAt: number;
  readonly version: string;
}
