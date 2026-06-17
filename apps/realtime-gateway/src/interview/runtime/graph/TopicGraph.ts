// runtime/graph/TopicGraph.ts
/**
 * TopicGraph implementation with edge modeling, snapshots, validation,
 * deterministic ordering, adjacency indexes, and timestamps.
 */

import type {
  TopicNodeId,
  NodeMetadata,
  TopicEdge,
  GraphMutationResult,
  TopicGraphSnapshot,
} from "../types/graph";
import { deepFreeze } from "@core/freeze/deepFreeze";
import { RuntimeInvariantError } from "../errors/RuntimeInvariantError";

export class TopicGraph {
  /** Internal node storage */
  private readonly nodes: Map<TopicNodeId, NodeMetadata> = new Map();
  /** Edge storage keyed by source node */
  private readonly outgoingEdges: Map<TopicNodeId, TopicEdge[]> = new Map();
  /** Incoming edge index for fast reverse look‑up */
  private readonly incomingEdges: Map<TopicNodeId, TopicEdge[]> = new Map();

  private readonly maxNodes: number;
  private readonly maxEdges: number;

  private readonly createdAt: number;

  private static readonly SNAPSHOT_VERSION = "1.0.0";

  constructor(maxNodes: number, maxEdges: number = Number.MAX_SAFE_INTEGER) {
    if (maxNodes <= 0) {
      throw new Error("maxNodes must be a positive integer");
    }
    this.maxNodes = maxNodes;
    this.maxEdges = maxEdges;
    this.createdAt = Date.now();
  }

  /** Retrieve a node by its id */
  public getNode(id: TopicNodeId): NodeMetadata | undefined {
    return this.nodes.get(id);
  }

  /** Get all nodes in deterministic order */
  public getAllNodes(): readonly NodeMetadata[] {
    return Array.from(this.nodes.values()).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
  }

  /** Get all edges in deterministic order */
  public getAllEdges(): readonly TopicEdge[] {
    const all: TopicEdge[] = [];
    for (const list of this.outgoingEdges.values()) {
      all.push(...list);
    }
    return all.sort((a, b) => {
      const fromCmp = a.from.localeCompare(b.from);
      if (fromCmp !== 0) return fromCmp;
      return a.to.localeCompare(b.to);
    });
  }

  /** Add a node (timestamps are added automatically) */
  public addNode(
    metadata: Omit<NodeMetadata, "createdAt" | "updatedAt">,
  ): GraphMutationResult {
    if (this.nodes.has(metadata.id)) {
      return { success: false, error: "Node with this id already exists" };
    }
    if (this.nodes.size >= this.maxNodes) {
      return { success: false, error: "TopicGraph node limit reached" };
    }
    const now = Date.now();
    const node: NodeMetadata = deepFreeze({
      ...metadata,
      createdAt: now,
      updatedAt: now,
    });
    this.nodes.set(metadata.id, node);
    return { success: true };
  }

  /** Add an edge between two existing nodes */
  public addEdge(edge: TopicEdge): GraphMutationResult {
    if (!this.nodes.has(edge.from) || !this.nodes.has(edge.to)) {
      return { success: false, error: "Edge references unknown node(s)" };
    }
    if (edge.from === edge.to) {
      return { success: false, error: "Self‑referencing edge is not allowed" };
    }
    if (edge.weight < 0 || edge.weight > 1) {
      return { success: false, error: "Edge weight must be in [0,1]" };
    }
    const outList = this.outgoingEdges.get(edge.from) ?? [];
    if (outList.some((e) => e.to === edge.to && e.relation === edge.relation)) {
      return { success: false, error: "Duplicate edge" };
    }
    if (this.outgoingEdges.size >= this.maxEdges) {
      return { success: false, error: "Edge limit reached" };
    }
    const frozenEdge = deepFreeze({ ...edge });
    this.outgoingEdges.set(edge.from, [...outList, frozenEdge]);
    // Maintain incoming index
    const inList = this.incomingEdges.get(edge.to) ?? [];
    this.incomingEdges.set(edge.to, [...inList, frozenEdge]);
    return { success: true };
  }

  /** Compute deterministic saturation for a node based on activity weights */
  public computeSaturation(nodeId: TopicNodeId): number {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new RuntimeInvariantError(
        `Node ${nodeId} not found for saturation computation`,
      );
    }
    // Placeholder deterministic formula – can be expanded later.
    // Currently returns the stored saturationScore which should already be derived
    // from deterministic activity metrics.
    return node.saturationScore;
  }

  /** Update saturationScore (kept for backward compatibility) */
  public updateSaturation(id: TopicNodeId, delta: number): GraphMutationResult {
    const existing = this.nodes.get(id);
    if (!existing) {
      return { success: false, error: "Node not found" };
    }
    const newScore = Math.max(0, Math.min(1, existing.saturationScore + delta));
    const updated: NodeMetadata = deepFreeze({
      ...existing,
      saturationScore: newScore,
      updatedAt: Date.now(),
    });
    this.nodes.set(id, updated);
    return { success: true };
  }

  /** Current number of nodes */
  public size(): number {
    return this.nodes.size;
  }

  /** Export an immutable snapshot for replay / debugging */
  public toSnapshot(): TopicGraphSnapshot {
    const snapshot: TopicGraphSnapshot = {
      version: TopicGraph.SNAPSHOT_VERSION,
      createdAt: this.createdAt,
      nodes: this.getAllNodes(),
      edges: this.getAllEdges(),
    };
    return deepFreeze(snapshot);
  }

  /** Validate internal consistency; throws RuntimeInvariantError on failure */
  public validate(): void {
    // Node saturation bounds
    for (const node of this.nodes.values()) {
      if (node.saturationScore < 0 || node.saturationScore > 1) {
        throw new RuntimeInvariantError(
          `Node ${node.id} has invalid saturationScore ${node.saturationScore}`,
        );
      }
    }
    // Edge consistency
    for (const [from, list] of this.outgoingEdges.entries()) {
      if (!this.nodes.has(from)) {
        throw new RuntimeInvariantError(`Edge from unknown node ${from}`);
      }
      for (const edge of list) {
        if (!this.nodes.has(edge.to)) {
          throw new RuntimeInvariantError(`Edge to unknown node ${edge.to}`);
        }
        if (edge.weight < 0 || edge.weight > 1) {
          throw new RuntimeInvariantError(
            `Edge weight out of bounds on ${from}->${edge.to}`,
          );
        }
        if (edge.from === edge.to) {
          throw new RuntimeInvariantError(
            `Self‑referencing edge detected on node ${from}`,
          );
        }
      }
    }
  }

  /** Additional integrity checks beyond basic validation */
  public validateIntegrity(): void {
    // Orphan edges (already covered in validate, but double‑check incoming index)
    for (const [to, list] of this.incomingEdges.entries()) {
      if (!this.nodes.has(to)) {
        throw new RuntimeInvariantError(`Incoming edge to unknown node ${to}`);
      }
      for (const edge of list) {
        if (!this.nodes.has(edge.from)) {
          throw new RuntimeInvariantError(
            `Incoming edge from unknown node ${edge.from}`,
          );
        }
      }
    }
    // Duplicate edges are prevented at insertion; re‑check for safety
    const edgeSet = new Set<string>();
    for (const edge of this.getAllEdges()) {
      const key = `${edge.from}|${edge.to}|${edge.relation}`;
      if (edgeSet.has(key)) {
        throw new RuntimeInvariantError(`Duplicate edge detected: ${key}`);
      }
      edgeSet.add(key);
    }
    // Simple cycle detection for parent relationships (if any)
    const visited = new Set<TopicNodeId>();
    const stack = new Set<TopicNodeId>();
    const visit = (nodeId: TopicNodeId): void => {
      if (stack.has(nodeId)) {
        throw new RuntimeInvariantError(
          `Cycle detected involving node ${nodeId}`,
        );
      }
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      stack.add(nodeId);
      const outgoing = this.outgoingEdges.get(nodeId) ?? [];
      for (const edge of outgoing) {
        if (edge.relation === "parent") {
          visit(edge.to);
        }
      }
      stack.delete(nodeId);
    };
    for (const nodeId of this.nodes.keys()) {
      visit(nodeId);
    }
    // Exhausted topics with remaining follow‑ups check
    for (const node of this.nodes.values()) {
      // Guard against unexpected followUpsRemaining field without using 'any'
      const followUpsRemaining = (node as unknown as Record<string, unknown>)['followUpsRemaining'];
      if (
        typeof followUpsRemaining === 'number' &&
        node.saturationScore >= 1 &&
        followUpsRemaining > 0
      ) {
        throw new RuntimeInvariantError(
          `Node ${node.id} marked exhausted but still has follow‑ups`,
        );
      }
    }
  }
}
