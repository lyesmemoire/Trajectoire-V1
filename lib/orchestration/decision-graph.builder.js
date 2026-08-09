import crypto from "crypto";
export class DecisionGraphBuilder {
    traceId;
    userId;
    sessionId;
    nodes = [];
    constructor(traceId, userId, sessionId) {
        this.traceId = traceId;
        this.userId = userId;
        this.sessionId = sessionId;
    }
    addNode(node) {
        const fullNode = {
            ...node,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        this.nodes.push(fullNode);
        return fullNode;
    }
    link(parent, child) {
        child.parentIds.push(parent.id);
    }
    build(finalDecision) {
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
//# sourceMappingURL=decision-graph.builder.js.map