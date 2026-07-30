import { z } from "zod";
import { KnowledgeNode, KnowledgeNodeSchema } from "./Node";
import { KnowledgeEdge, KnowledgeEdgeSchema } from "./Edge";

// ===================================================================
// KNOWLEDGE GRAPH — The domain-agnostic graph of candidate knowledge
// The graph manipulates only Nodes, Edges, and their metadata.
// It does not know "Leadership" or "React". Those are just labels.
//
// All methods are pure: they return new objects, never mutate state.
// Only the Reducer is authorized to produce the next graph state.
// ===================================================================

export const KnowledgeGraphSchema = z.object({
  nodes: z.array(KnowledgeNodeSchema).default([]),
  edges: z.array(KnowledgeEdgeSchema).default([]),
  version: z.number().int().nonnegative().default(0),
  lastUpdated: z.date(),
});

export type KnowledgeGraphData = z.infer<typeof KnowledgeGraphSchema>;

export class KnowledgeGraph {
  private readonly data: KnowledgeGraphData;

  private constructor(data: KnowledgeGraphData) {
    this.data = Object.freeze(data);
  }

  /**
   * Creates an empty, pristine knowledge graph.
   */
  static create(): KnowledgeGraph {
    return new KnowledgeGraph({
      nodes: [],
      edges: [],
      version: 0,
      lastUpdated: new Date(),
    });
  }

  /**
   * Restores a knowledge graph from persisted data.
   */
  static fromData(data: KnowledgeGraphData): KnowledgeGraph {
    return new KnowledgeGraph(KnowledgeGraphSchema.parse(data));
  }

  // ─── Queries (Pure) ───────────────────────────────────────────

  get nodes(): ReadonlyArray<KnowledgeNode> {
    return this.data.nodes;
  }

  get edges(): ReadonlyArray<KnowledgeEdge> {
    return this.data.edges;
  }

  get version(): number {
    return this.data.version;
  }

  get lastUpdated(): Date {
    return this.data.lastUpdated;
  }

  findNodeById(id: string): KnowledgeNode | undefined {
    return this.data.nodes.find((n) => n.id === id);
  }

  findNodesByType(type: string): ReadonlyArray<KnowledgeNode> {
    return this.data.nodes.filter((n) => n.type === type);
  }

  findNodeByLabel(label: string): KnowledgeNode | undefined {
    return this.data.nodes.find(
      (n) => n.label.toLowerCase() === label.toLowerCase()
    );
  }

  findEdgesBySource(sourceId: string): ReadonlyArray<KnowledgeEdge> {
    return this.data.edges.filter((e) => e.source === sourceId);
  }

  findEdgesByTarget(targetId: string): ReadonlyArray<KnowledgeEdge> {
    return this.data.edges.filter((e) => e.target === targetId);
  }

  findEdgesByRelation(relation: string): ReadonlyArray<KnowledgeEdge> {
    return this.data.edges.filter((e) => e.relation === relation);
  }

  getNeighbors(nodeId: string): ReadonlyArray<KnowledgeNode> {
    const edgeTargets = this.data.edges
      .filter((e) => e.source === nodeId)
      .map((e) => e.target);
    const edgeSources = this.data.edges
      .filter((e) => e.target === nodeId)
      .map((e) => e.source);
    const neighborIds = new Set([...edgeTargets, ...edgeSources]);
    return this.data.nodes.filter((n) => neighborIds.has(n.id));
  }

  getContradictingEdges(nodeId: string): ReadonlyArray<KnowledgeEdge> {
    return this.data.edges.filter(
      (e) =>
        e.relation === "CONTRADICTS" &&
        (e.source === nodeId || e.target === nodeId)
    );
  }

  getSupportingEdges(nodeId: string): ReadonlyArray<KnowledgeEdge> {
    return this.data.edges.filter(
      (e) =>
        e.relation === "SUPPORTS" &&
        (e.source === nodeId || e.target === nodeId)
    );
  }

  nodeCount(): number {
    return this.data.nodes.length;
  }

  edgeCount(): number {
    return this.data.edges.length;
  }

  // ─── Immutable Builders (Return new KnowledgeGraph) ───────────

  withNode(node: KnowledgeNode): KnowledgeGraph {
    const validated = KnowledgeNodeSchema.parse(node);
    return new KnowledgeGraph({
      ...this.data,
      nodes: [...this.data.nodes, validated],
      version: this.data.version + 1,
      lastUpdated: new Date(),
    });
  }

  withUpdatedNode(
    nodeId: string,
    updates: Partial<Omit<KnowledgeNode, "id" | "createdAt">>
  ): KnowledgeGraph {
    const index = this.data.nodes.findIndex((n) => n.id === nodeId);
    if (index === -1) {
      return this;
    }
    const existingNode = this.data.nodes[index]!;
    const updatedNode = KnowledgeNodeSchema.parse({
      ...existingNode,
      ...updates,
      updatedAt: new Date(),
    });
    const newNodes = [...this.data.nodes];
    newNodes[index] = updatedNode;
    return new KnowledgeGraph({
      ...this.data,
      nodes: newNodes,
      version: this.data.version + 1,
      lastUpdated: new Date(),
    });
  }

  withEdge(edge: KnowledgeEdge): KnowledgeGraph {
    const validated = KnowledgeEdgeSchema.parse(edge);
    return new KnowledgeGraph({
      ...this.data,
      edges: [...this.data.edges, validated],
      version: this.data.version + 1,
      lastUpdated: new Date(),
    });
  }

  withRemovedNode(nodeId: string): KnowledgeGraph {
    return new KnowledgeGraph({
      ...this.data,
      nodes: this.data.nodes.filter((n) => n.id !== nodeId),
      edges: this.data.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
      version: this.data.version + 1,
      lastUpdated: new Date(),
    });
  }

  // ─── Serialization ────────────────────────────────────────────

  toData(): KnowledgeGraphData {
    return {
      nodes: [...this.data.nodes],
      edges: [...this.data.edges],
      version: this.data.version,
      lastUpdated: this.data.lastUpdated,
    };
  }
}
