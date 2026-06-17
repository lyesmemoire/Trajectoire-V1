// src/interview/runtime/graph/causalGraph.ts

import type { StableHash } from "../types/StableHash";

/**
 * Node representing a step in the causal graph.
 * @property id Unique stable hash identifier for the node.
 * @property parents List of parent node IDs (edges direction: parent → child).
 */
export interface CausalGraphNode {
  id: StableHash;
  parents: StableHash[];
}

/**
 * Complete graph definition.
 * Uses a Map for O(1) look‑ups of nodes by their StableHash.
 */
export interface CausalGraph {
  nodes: Map<StableHash, CausalGraphNode>;
}

/**
 * Detect if the provided graph contains a cycle.
 * Uses a depth‑first search with two sets (visiting / visited).
 * Returns true if a cycle exists, false otherwise.
 */
export function detectCycle(graph: CausalGraph): boolean {
  const visiting = new Set<StableHash>();
  const visited = new Set<StableHash>();

  function dfs(nodeId: StableHash): boolean {
    if (visiting.has(nodeId)) return true; // back‑edge found → cycle
    if (visited.has(nodeId)) return false; // already processed

    visiting.add(nodeId);
    const node = graph.nodes.get(nodeId);
    if (node) {
      for (const parentId of node.parents) {
        if (dfs(parentId)) return true;
      }
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  }

  for (const id of graph.nodes.keys()) {
    if (dfs(id)) return true;
  }
  return false;
}

/**
 * Deterministic topological sort of the graph.
 * Returns an array of node IDs ordered such that every node appears
 * after all of its parents. The algorithm is a classic DFS‑postorder walk.
 */
export function topologicalSort(graph: CausalGraph): StableHash[] {
  const visited = new Set<StableHash>();
  const result: StableHash[] = [];

  function visit(id: StableHash): void {
    if (visited.has(id)) return;
    visited.add(id);
    const node = graph.nodes.get(id);
    if (!node) return; // Guard against missing node
    for (const parentId of node.parents) {
      visit(parentId);
    }
    result.push(id);
  }

  for (const id of graph.nodes.keys()) {
    visit(id);
  }
  return result;
}

/**
 * Find the lowest common ancestor (LCA) of two nodes in a DAG.
 * Returns the first encountered ancestor that appears in both ancestry chains,
 * or null if none exists.
 */
export function findCommonAncestor(
  graph: CausalGraph,
  a: StableHash,
  b: StableHash,
): StableHash | null {
  const ancestorsA = new Set<StableHash>();

  function collectAncestors(nodeId: StableHash): void {
    if (ancestorsA.has(nodeId)) return;
    ancestorsA.add(nodeId);
    const node = graph.nodes.get(nodeId);
    if (node) {
      for (const parentId of node.parents) {
        collectAncestors(parentId);
      }
    }
  }

  collectAncestors(a);

  function search(nodeId: StableHash): StableHash | null {
    if (ancestorsA.has(nodeId)) return nodeId;
    const node = graph.nodes.get(nodeId);
    if (!node) return null;
    for (const parentId of node.parents) {
      const found = search(parentId);
      if (found) return found;
    }
    return null;
  }

  return search(b);
}

/**
 * Utility: create an empty graph instance. Helpful for callers.
 */
export function createEmptyGraph(): CausalGraph {
  return { nodes: new Map<StableHash, CausalGraphNode>() };
}

/**
 * Utility: add a node to a graph (pure – returns a new graph).
 */
export function addNode(
  graph: CausalGraph,
  node: CausalGraphNode,
): CausalGraph {
  const newNodes = new Map(graph.nodes);
  newNodes.set(node.id, { ...node, parents: [...node.parents] });
  return { nodes: newNodes };
}
