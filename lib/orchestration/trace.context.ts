import { DecisionGraphBuilder } from "./decision-graph.builder";

export class TraceContext {
  private builder: DecisionGraphBuilder;

  constructor(traceId: string, userId: string, sessionId?: string) {
    this.builder = new DecisionGraphBuilder(traceId, userId, sessionId);
  }

  get graph() {
    return this.builder;
  }
}
