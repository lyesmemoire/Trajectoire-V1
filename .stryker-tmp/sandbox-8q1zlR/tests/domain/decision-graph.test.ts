// @ts-nocheck
import { describe, it, expect } from "vitest";
import { evaluateSystemContext } from "@/lib/orchestration/agent.evaluator";
import { TraceContext } from "@/lib/orchestration/trace.context";
import { EvaluationContext } from "@/domain/orchestration.contract";

describe("Decision Graph Traçabilité", () => {
  it("decision graph is fully traceable with causal nodes", () => {
    const trace = new TraceContext("trace-1", "user-1");

    const ctx: EvaluationContext = {
      userId: "user-1",
      interviewScore: 0.8,
      interviewConfidence: 0.9,
      cvMatchScore: 0.7,
      hasBillingInconsistency: false,
      ipAnomalies: 0,
      velocityAnomalies: 0,
      driftScore: 0.1,
      stabilityScore: 1.0
    };

    const { graph } = evaluateSystemContext(ctx, trace);

    // Should have 1 event node, 5 agent nodes, 1 final decision node = 7 nodes minimum
    expect(graph.nodes.length).toBe(7);

    const eventNodes = graph.nodes.filter(n => n.type === "event");
    const agentNodes = graph.nodes.filter(n => n.type === "agent_opinion");
    const finalNodes = graph.nodes.filter(n => n.type === "final_decision");

    expect(eventNodes.length).toBe(1);
    expect(agentNodes.length).toBe(5);
    expect(finalNodes.length).toBe(1);

    // Verify linkage
    const eventId = eventNodes[0].id;
    agentNodes.forEach(an => {
      expect(an.parentIds).toContain(eventId);
    });

    const finalNode = finalNodes[0];
    agentNodes.forEach(an => {
      expect(finalNode.parentIds).toContain(an.id);
    });

    expect(graph.traceId).toBe("trace-1");
    expect(graph.userId).toBe("user-1");
    expect(graph.finalDecision.status).toBe("allow");
  });
});
