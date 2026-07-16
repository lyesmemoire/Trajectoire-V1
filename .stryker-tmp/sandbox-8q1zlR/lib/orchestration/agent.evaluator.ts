// @ts-nocheck
import { EvaluationContext } from "@/domain/orchestration.contract";
import { TraceContext } from "./trace.context";
import { FraudKernelEngine } from "@/lib/fraud/fraud-kernel.engine";
import { FraudKernel } from "@/lib/fraud/fraud-kernel";
import { evaluateBilling } from "@/lib/agents/billing.agent";
import { evaluateInterview } from "@/lib/agents/interview.agent";
import { evaluateBehavior } from "@/lib/agents/behavior.agent";
import { resolveConsensus } from "./consensus.engine";

// Instantiate Fraud Kernel
const fraudKernelEngine = new FraudKernelEngine(
  new FraudKernel({
    hardVetoThreshold: 0.85,
    softFreezeThreshold: 0.65,
    velocityWindowMs: 60000,
  })
);

/**
 * Agent Evaluator
 * Synchronous, deterministic pure function.
 * Evaluates the context through all agents, produces a global SystemDecision,
 * and traces the entire causal graph.
 */
export function evaluateSystemContext(ctx: EvaluationContext, trace: TraceContext) {
  const eventNode = trace.graph.addNode({
    type: "event",
    input: ctx,
    output: null,
    parentIds: [],
  });

  const agents = [
    { name: "fraud", fn: fraudKernelEngine.evaluate.bind(fraudKernelEngine) },
    { name: "billing", fn: evaluateBilling },
    { name: "interview", fn: evaluateInterview },
    { name: "behavior", fn: evaluateBehavior },
  ];

  const opinionNodes = agents.map((agent) => {
    const result = agent.fn(ctx);

    const node = trace.graph.addNode({
      type: "agent_opinion",
      agent: agent.name,
      input: ctx,
      output: result,
      score: result.confidence,
      weight: 1,
      parentIds: [eventNode.id],
    });

    return { result, node };
  });

  const opinions = opinionNodes.map(o => o.result);
  const decision = resolveConsensus(opinions);

  trace.graph.addNode({
    type: "final_decision",
    input: opinions,
    output: decision,
    score: decision.globalScore,
    parentIds: opinionNodes.map((o) => o.node.id),
  });

  return { decision, graph: trace.graph.build({
    status: decision.status,
    globalScore: decision.globalScore,
    reason: decision.explanationGraph.join(" | ")
  }) };
}


