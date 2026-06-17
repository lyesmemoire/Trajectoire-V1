// src/interview/runtime/branching/types.ts

import type { StableHash } from "../types/StableHash";

/**
 * Represents a branch in the deterministic replay system.
 * Each branch is identified by a StableHash (unique string).
 */
export interface BranchNode {
  /** Unique identifier for the branch */
  branchId: StableHash;
  /** Parent branch identifier (null for the root branch) */
  parentBranchId: StableHash | null;
  /** Stable hash of the snapshot where this branch was forked */
  forkAtStepHash: StableHash;
  /** Depth of the branch in the branch tree (root = 0) */
  depth: number;
  /** Optional human‑readable label */
  label?: string;
}

/**
 * The branch graph – a DAG where edges point from parent → child branch.
 */
export interface BranchGraph {
  /** Map of branchId → BranchNode */
  nodes: Map<StableHash, BranchNode>;
  /** Adjacency list: parentBranchId → array of child branchIds */
  edges: Map<StableHash, StableHash[]>;
}

/** Helper to create an empty BranchGraph */
export function createEmptyBranchGraph(): BranchGraph {
  return {
    nodes: new Map<StableHash, BranchNode>(),
    edges: new Map<StableHash, StableHash[]>(),
  };
}
