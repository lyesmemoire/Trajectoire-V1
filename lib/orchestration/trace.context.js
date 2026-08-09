import { DecisionGraphBuilder } from "./decision-graph.builder";
export class TraceContext {
    builder;
    constructor(traceId, userId, sessionId) {
        this.builder = new DecisionGraphBuilder(traceId, userId, sessionId);
    }
    get graph() {
        return this.builder;
    }
}
//# sourceMappingURL=trace.context.js.map