// src/interview/runtime/branching/merge/mergeEngine.ts

import type { StableHash } from "../../types/StableHash";
import type { BranchGraph } from "../types";
import { getBranchLineage } from "../branchEngine";

import { deepFreeze } from "@core/freeze/deepFreeze";

/**
 * Simple deterministic hash for an object.
 * Uses SHA-256 over a stable JSON representation (sorted keys).
 */
import { hashObjectStable } from "../../utils/hash";

/**
 * Merge result type (already defined in types.ts, re‑exported here for convenience).
 */
export interface MergeResult {
  mergedBranchId: StableHash;
  mergeSnapshot: MergeSnapshot;
  conflicts: Conflict[];
}

/** Snapshot representing a merge event */
export interface MergeSnapshot {
  stepHash: StableHash;
  previousStepHash: StableHash;
  checksum: StableHash;
  type: "merge";
  parentBranchIds: [StableHash, StableHash];
}

/** Simple conflict description – report‑only */
export interface Conflict {
  stepHash: StableHash;
  reason: string;
}

/**
 * Pure merge engine – combines two branches into a new deterministic merge branch.
 * ConflictMode is fixed to 'report-only' – never mutates original state.
 */
export function mergeBranches(
  graph: BranchGraph,
  branchAId: StableHash,
  branchBId: StableHash,
  conflictMode: "report-only" = "report-only",
): MergeResult {
  // 1️⃣ Retrieve lineages (root → leaf) for both branches
  const lineageA = getBranchLineage(graph, branchAId);
  const lineageB = getBranchLineage(graph, branchBId);

  // 2️⃣ Find common ancestor using the causal graph utilities (convert to causal first)
  const commonAncestorNode = findCommonAncestorFromLineages(lineageA, lineageB);
  if (!commonAncestorNode) {
    throw new Error("Branches do not share a common ancestor – cannot merge");
  }

  // 3️⃣ Retrieve common ancestor (already done) and determine fork index
  const forkIndex = commonAncestorNode.forkAtStepHash;

  // 4️⃣ Conflict detection – simple placeholder: report divergence if branch IDs differ
  const conflicts: Conflict[] = [];
  if (branchAId !== branchBId) {
    conflicts.push({
      stepHash: forkIndex,
      reason: "Branch divergence detected at fork point",
    });
  }

  // 5️⃣ Create merge snapshot – deterministic hash based on parent IDs and conflicts
  const rawMergeData = deepFreeze({
    parentBranchIds: [branchAId, branchBId] as const,
    conflicts,
    // Use forkIndex as deterministic timestamp placeholder (no randomness)
    timestamp: forkIndex,
  });
  const mergeHash = hashObjectStable(rawMergeData);

  const mergeSnapshot: MergeSnapshot = {
    stepHash: mergeHash,
    previousStepHash: forkIndex,
    checksum: mergeHash,
    type: "merge",
    parentBranchIds: [branchAId, branchBId] as const,
  };

  // 6️⃣ Deterministic merged branch ID derived from inputs
  const mergedBranchId = hashObjectStable({
    a: branchAId,
    b: branchBId,
    fork: forkIndex,
  }) as StableHash;

  // 7️⃣ Return result – original graph unchanged
  return { mergedBranchId, mergeSnapshot, conflicts };
}

/** Helper – convert lineages to find lowest common ancestor node */
function findCommonAncestorFromLineages(
  lineageA: ReturnType<typeof getBranchLineage>,
  lineageB: ReturnType<typeof getBranchLineage>,
) {
  const setA = new Set(lineageA.map((n) => n.branchId));
  for (let i = lineageB.length - 1; i >= 0; i--) {
    const candidate = lineageB[i];
    if (candidate && setA.has(candidate.branchId)) return candidate;
  }
  return null;
}
