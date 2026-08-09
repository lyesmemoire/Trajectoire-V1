import { TraceContext } from "./trace.context";
/**
 * Agent Evaluator
 * Synchronous, deterministic pure function.
 * Evaluates the context through all agents, produces a global SystemDecision,
 * and traces the entire causal graph.
 */
export declare function evaluateSystemContext(ctx: _EvaluationContext, trace: TraceContext): {
    decision: any;
    graph: any;
};
//# sourceMappingURL=agent.evaluator.d.ts.map