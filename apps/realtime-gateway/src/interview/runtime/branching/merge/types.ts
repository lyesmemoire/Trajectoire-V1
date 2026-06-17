// src/interview/runtime/branching/merge/types.ts

import type { StableHash } from "../../types/StableHash";
import type { ReplaySnapshot } from "../../types/replay";

/** Snapshot representing a merge event between two branches */
export interface MergeSnapshot extends ReplaySnapshot {
  /** Literal discriminator */
  type: "merge";
  /** IDs of the two parent branches being merged */
  parentBranchIds: [StableHash, StableHash];
}

/** Simple conflict description – report‑only */
export interface Conflict {
  /** Step hash where the conflict occurs */
  stepHash: StableHash;
  /** Human readable reason */
  reason: string;
}

/** Result of a merge operation */
export interface MergeResult {
  /** New branch representing the merged timeline */
  mergedBranchId: StableHash;
  /** The merge snapshot that will appear at the merge point */
  mergeSnapshot: MergeSnapshot;
  /** List of conflicts detected (empty if none) */
  conflicts: Conflict[];
}
