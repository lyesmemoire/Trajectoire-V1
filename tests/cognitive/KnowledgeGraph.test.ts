import { describe, it, expect } from "vitest";
import { KnowledgeNodeSchema } from "../../apps/web/src/domain/cognitive/Node";
import { KnowledgeEdgeSchema } from "../../apps/web/src/domain/cognitive/Edge";
import { KnowledgeGraph } from "../../apps/web/src/domain/cognitive/KnowledgeGraph";

describe("KnowledgeGraph", () => {
  const now = new Date();

  const makeNode = (overrides: Partial<Record<string, unknown>> = {}) =>
    KnowledgeNodeSchema.parse({
      id: crypto.randomUUID(),
      type: "COMPETENCY",
      label: "Backend Development",
      attributes: {},
      confidence: 0.5,
      sources: [],
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      ...overrides,
    });

  const makeEdge = (source: string, target: string, overrides: Partial<Record<string, unknown>> = {}) =>
    KnowledgeEdgeSchema.parse({
      id: crypto.randomUUID(),
      source,
      target,
      relation: "SUPPORTS",
      weight: 0.5,
      confidence: 0.5,
      metadata: {},
      createdAt: now,
      ...overrides,
    });

  it("creates an empty graph", () => {
    const graph = KnowledgeGraph.create();
    expect(graph.nodeCount()).toBe(0);
    expect(graph.edgeCount()).toBe(0);
    expect(graph.version).toBe(0);
  });

  it("adds a node immutably", () => {
    const graph = KnowledgeGraph.create();
    const node = makeNode();
    const next = graph.withNode(node);

    expect(graph.nodeCount()).toBe(0);
    expect(next.nodeCount()).toBe(1);
    expect(next.version).toBe(1);
    expect(next.findNodeById(node.id)).toEqual(node);
  });

  it("adds an edge immutably", () => {
    const n1 = makeNode({ label: "A" });
    const n2 = makeNode({ label: "B" });
    const edge = makeEdge(n1.id, n2.id);

    const graph = KnowledgeGraph.create().withNode(n1).withNode(n2).withEdge(edge);

    expect(graph.edgeCount()).toBe(1);
    expect(graph.findEdgesBySource(n1.id)).toHaveLength(1);
    expect(graph.findEdgesByTarget(n2.id)).toHaveLength(1);
  });

  it("updates a node immutably", () => {
    const node = makeNode({ confidence: 0.3 });
    const graph = KnowledgeGraph.create().withNode(node);
    const updated = graph.withUpdatedNode(node.id, { confidence: 0.9 });

    expect(graph.findNodeById(node.id)!.confidence).toBe(0.3);
    expect(updated.findNodeById(node.id)!.confidence).toBe(0.9);
    expect(updated.version).toBe(2);
  });

  it("removes a node and its edges immutably", () => {
    const n1 = makeNode({ label: "A" });
    const n2 = makeNode({ label: "B" });
    const edge = makeEdge(n1.id, n2.id);

    const graph = KnowledgeGraph.create().withNode(n1).withNode(n2).withEdge(edge);
    const pruned = graph.withRemovedNode(n1.id);

    expect(pruned.nodeCount()).toBe(1);
    expect(pruned.edgeCount()).toBe(0);
    expect(graph.nodeCount()).toBe(2);
  });

  it("finds nodes by type", () => {
    const n1 = makeNode({ type: "COMPETENCY", label: "A" });
    const n2 = makeNode({ type: "PROJECT", label: "B" });
    const n3 = makeNode({ type: "COMPETENCY", label: "C" });

    const graph = KnowledgeGraph.create().withNode(n1).withNode(n2).withNode(n3);

    expect(graph.findNodesByType("COMPETENCY")).toHaveLength(2);
    expect(graph.findNodesByType("PROJECT")).toHaveLength(1);
  });

  it("finds a node by label (case insensitive)", () => {
    const node = makeNode({ label: "Kubernetes" });
    const graph = KnowledgeGraph.create().withNode(node);

    expect(graph.findNodeByLabel("kubernetes")).toEqual(node);
    expect(graph.findNodeByLabel("KUBERNETES")).toEqual(node);
  });

  it("finds neighbors of a node", () => {
    const n1 = makeNode({ label: "A" });
    const n2 = makeNode({ label: "B" });
    const n3 = makeNode({ label: "C" });
    const e1 = makeEdge(n1.id, n2.id);
    const e2 = makeEdge(n3.id, n1.id);

    const graph = KnowledgeGraph.create()
      .withNode(n1).withNode(n2).withNode(n3)
      .withEdge(e1).withEdge(e2);

    const neighbors = graph.getNeighbors(n1.id);
    expect(neighbors).toHaveLength(2);
  });

  it("finds contradicting edges", () => {
    const n1 = makeNode({ label: "A" });
    const n2 = makeNode({ label: "B" });
    const e = makeEdge(n1.id, n2.id, { relation: "CONTRADICTS" });

    const graph = KnowledgeGraph.create().withNode(n1).withNode(n2).withEdge(e);
    expect(graph.getContradictingEdges(n1.id)).toHaveLength(1);
    expect(graph.getSupportingEdges(n1.id)).toHaveLength(0);
  });

  it("serializes and deserializes without data loss", () => {
    const n1 = makeNode({ label: "A" });
    const n2 = makeNode({ label: "B" });
    const e = makeEdge(n1.id, n2.id);

    const graph = KnowledgeGraph.create().withNode(n1).withNode(n2).withEdge(e);
    const data = graph.toData();
    const restored = KnowledgeGraph.fromData(data);

    expect(restored.nodeCount()).toBe(2);
    expect(restored.edgeCount()).toBe(1);
    expect(restored.version).toBe(graph.version);
  });

  it("returns self when updating a non-existent node", () => {
    const graph = KnowledgeGraph.create();
    const updated = graph.withUpdatedNode("non-existent", { confidence: 0.9 });
    expect(updated.version).toBe(0);
  });
});
