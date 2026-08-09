import { DecisionGraph, DecisionNode } from "@/domain/decision-graph.contract";
export declare class DecisionGraphBuilder {
    private traceId;
    private userId;
    private sessionId?;
    private nodes;
    constructor(traceId: string, userId: string, sessionId?: string | undefined);
    addNode(node: Omit<DecisionNode, "id" | "timestamp">): DecisionNode;
    link(parent: DecisionNode, child: DecisionNode): void;
    build(finalDecision: DecisionGraph["finalDecision"]): DecisionGraph;
}
//# sourceMappingURL=decision-graph.builder.d.ts.map