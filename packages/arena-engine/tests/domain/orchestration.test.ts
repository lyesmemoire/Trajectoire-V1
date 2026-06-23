import { describe, it, expect } from "vitest";
import { evaluateSystemContext } from "@/lib/orchestration/agent.evaluator";
import { EvaluationContext } from "@/domain/orchestration.contract";
import { TraceContext } from "@/lib/orchestration/trace.context";

describe("Multi-Agent Orchestration Layer", () => {
  
  it("Cas 1: Fraud Agent VETO overrides a perfect interview", () => {
    const ctx: EvaluationContext = {
      userId: "u-1",
      interviewScore: 0.9,     // Perfect interview
      cvMatchScore: 0.9,       // Perfect CV
      ipAnomalies: 10,         // High IP anomalies
      velocityAnomalies: 10,   // High Velocity
      billing: { negativeBalance: true } // FRAUD VETO!
    };

    const trace = new TraceContext("test-trace", "u-1");
    const { decision, graph } = evaluateSystemContext(ctx, trace);

    expect(decision.status).toBe("block");
    expect(decision.overrideSource).toBe("fraud-kernel");
    expect(decision.explanationGraph.some(e => e.includes("HARD FRAUD VETO OVERRIDE"))).toBe(true);
    expect(graph.nodes.length).toBeGreaterThan(5);
  });

  it("Cas 2: Billing inconsistency causes FREEZE even if all else is fine", () => {
    const ctx: EvaluationContext = {
      userId: "u-2",
      interviewScore: 0.8,
      cvMatchScore: 0.8,
      ipAnomalies: 0,
      velocityAnomalies: 0,
      hasBillingInconsistency: true // BILLING FREEZE!
    };

    const trace = new TraceContext("test-trace", "u-2");
    const { decision } = evaluateSystemContext(ctx, trace);

    expect(decision.status).toBe("freeze");
    expect(decision.overrideSource).toBe("billing");
    expect(decision.explanationGraph.some(e => e.includes("Billing Agent applied FREEZE"))).toBe(true);
  });

  it("Cas 3: High drift + low confidence causes REVIEW (Escalation)", () => {
    const ctx: EvaluationContext = {
      userId: "u-3",
      interviewScore: 0.2,     // Low score -> low global score
      cvMatchScore: 0.5,
      ipAnomalies: 0,
      velocityAnomalies: 0,
      driftScore: 0.6          // High drift (> 0.5)
    };

    const trace = new TraceContext("test-trace", "u-3");
    const { decision } = evaluateSystemContext(ctx, trace);

    expect(decision.status).toBe("review");
    expect(decision.overrideSource).toBeUndefined();
    expect(decision.explanationGraph.some(e => e.includes("Behavior drift is high and global score is low. Escalating for REVIEW."))).toBe(true);
  });

  it("Cas 4: Normal safe path causes ALLOW with computed soft consensus", () => {
    const ctx: EvaluationContext = {
      userId: "u-4",
      interviewScore: 0.8,
      cvMatchScore: 0.7,
      driftScore: 0.1,
      hasBillingInconsistency: false,
      ipAnomalies: 0,
      velocityAnomalies: 0
    };

    const trace = new TraceContext("test-trace", "u-4");
    const { decision } = evaluateSystemContext(ctx, trace);

    expect(decision.status).toBe("allow");
    expect(decision.overrideSource).toBeUndefined();
    expect(decision.globalScore).toBeCloseTo(0.84, 2);
  });

  it("Cas 5: High divergence between agents causes HUMAN REVIEW", () => {
    const ctx: EvaluationContext = {
      userId: "u-5",
      interviewScore: 0.1,     // Terrible interview (0.1)
      cvMatchScore: 1.0,       // Perfect CV (1.0)
      driftScore: 0.0,         // Perfect behavior (1.0)
      hasBillingInconsistency: false // Perfect billing (1.0)
    };

    const trace = new TraceContext("test-trace", "u-5");
    const { decision } = evaluateSystemContext(ctx, trace);
    
    expect(decision.status).toBe("review");
    expect(decision.explanationGraph.some(e => e.includes("Agent divergence > 0.1 variance"))).toBe(true);
  });
});


