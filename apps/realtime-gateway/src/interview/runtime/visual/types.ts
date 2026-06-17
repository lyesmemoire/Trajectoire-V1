// src/interview/runtime/visual/types.ts

/**
 * Visual representation of a node in the causal graph for the UI.
 * The `status` field drives UI animations / coloring.
 */
export type NodeStatus =
  | "idle"
  | "active"
  | "executed"
  | "forked"
  | "merged"
  | "conflicted";

export interface VisualNode {
  /** Stable identifier of the node (same as branch/merge hash) */
  id: string;
  /** Current UI‑driven status */
  status: NodeStatus;
  /** Depth in the branch tree (root = 0). Used for layout. */
  depth: number;
}

export interface VisualEdge {
  /** Source node identifier */
  from: string;
  /** Destination node identifier */
  to: string;
  /** Optional UI hint (highlighted for active path, conflict, etc.) */
  status?: "normal" | "highlighted" | "conflict";
}

/** Complete visual causal graph derived from kernel events */
export interface VisualCausalGraph {
  /** Array of visual nodes */
  nodes: VisualNode[];
  /** Array of visual edges */
  edges: VisualEdge[];
  /** Currently selected/active node id (e.g., timeline scrubber) */
  activeNodeId?: string;
}
