// src/interview/runtime/branching/branchEngine.ts

import type { StableHash } from "../types/StableHash";
import type { BranchGraph, BranchNode } from "./types";
import { createEmptyBranchGraph } from "./types";

/**
 * Initialise a root branch representing the main linear replay timeline.
 * The root branch has no parent and forks at the ROOT_STEP_HASH.
 */
export function createRootBranch(rootStepHash: StableHash): BranchGraph {
  const graph = createEmptyBranchGraph();
  const rootBranch: BranchNode = {
    branchId: rootStepHash, // reuse the root step hash as unique id
    parentBranchId: null,
    forkAtStepHash: rootStepHash,
    depth: 0,
    label: "root",
  };
  graph.nodes.set(rootBranch.branchId, rootBranch);
  // No edges for root
  return graph;
}

/**
 * PURE: Fork a new branch from an existing branch at a specific snapshot hash.
 * Returns a new BranchGraph (immutable – original graph unchanged).
 */
export function forkBranch(
  graph: BranchGraph,
  parentBranchId: StableHash,
  forkAtStepHash: StableHash,
  newBranchId: StableHash,
  label?: string,
): BranchGraph {
  const parent = graph.nodes.get(parentBranchId);
  if (!parent) throw new Error("Parent branch not found");

  const newBranch: any = {
    branchId: newBranchId,
    parentBranchId,
    forkAtStepHash,
    depth: parent.depth + 1,
    label,
  };

  // Clone maps to keep function pure
  const newNodes = new Map(graph.nodes);
  newNodes.set(newBranchId, newBranch);

  const newEdges = new Map(graph.edges);
  const children = newEdges.get(parentBranchId) ?? [];
  newEdges.set(parentBranchId, [...children, newBranchId]);

  const newGraph: BranchGraph = { nodes: newNodes, edges: newEdges };
  return newGraph;
}

/**
 * Retrieve the lineage (ancestors) of a branch from root to the given branch.
 * Returns an ordered array of BranchNode from root → target.
 */
export function getBranchLineage(
  graph: BranchGraph,
  branchId: StableHash,
): BranchNode[] {
  const lineage: BranchNode[] = [];
  let currentId: StableHash | null = branchId;
  while (currentId) {
    const node = graph.nodes.get(currentId);
    if (!node) break;
    lineage.unshift(node); // prepend to get root‑first order
    currentId = node.parentBranchId;
  }
  return lineage;
}
