// src/interview/runtime/graph/graphAdapters.ts

import type { BranchGraph } from "../branching/types";
import type { CausalGraph } from "./causalGraph";
import type { StableHash } from "../types/StableHash";

/**
 * PURE ADAPTER:
 * Converts a BranchGraph into a CausalGraph representation.
 * This is deterministic and side‑effect‑free, ensuring kernel‑level type safety.
 */
export function toCausalGraph(graph: BranchGraph): CausalGraph {
  const nodes = new Map<
    StableHash,
    { id: StableHash; parents: StableHash[] }
  >();

  for (const [id, branch] of graph.nodes.entries()) {
    nodes.set(id, {
      id,
      parents: branch.parentBranchId ? [branch.parentBranchId] : [],
    });
  }

  // The CausalGraph type expects a `nodes` map.
  return { nodes } as CausalGraph;
}
