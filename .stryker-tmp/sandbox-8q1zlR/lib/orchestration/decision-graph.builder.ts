// @ts-nocheck
import { DecisionGraph, DecisionNode } from "@/domain/decision-graph.contract";
import crypto from "crypto";

export class DecisionGraphBuilder {
  private nodes: DecisionNode[] = [];

  constructor(
    private traceId: string,
    private userId: string,
    private sessionId?: string
  ) {}

  addNode(node: Omit<DecisionNode, "id" | "timestamp">): DecisionNode {
    const fullNode: DecisionNode = {
      ...node,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    this.nodes.push(fullNode);
    return fullNode;
  }

  link(parent: DecisionNode, child: DecisionNode) {
    child.parentIds.push(parent.id);
  }

  build(finalDecision: DecisionGraph["finalDecision"]): DecisionGraph {
    return {
      traceId: this.traceId,
      userId: this.userId,
      sessionId: this.sessionId,
      nodes: this.nodes,
      finalDecision,
      createdAt: Date.now(),
    };
  }
}
