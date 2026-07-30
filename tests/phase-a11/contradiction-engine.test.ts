import { describe, it, expect, beforeEach } from "vitest";
import { ContradictionEngine } from "../../apps/web/src/lib/ai/engines/ContradictionEngine";

describe("Phase A.11 - ContradictionEngine Tests", () => {
  let engine: ContradictionEngine;

  beforeEach(() => {
    engine = new ContradictionEngine();
  });

  it("should have correct manifest", () => {
    expect(engine.name).toBe("ContradictionEngine");
    expect(engine.version).toBe("1.0.0");
  });

  it("should detect factual number mismatch contradiction", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "I migrated 180 microservices on Kubernetes.",
              category: "claim",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            data: {
              content: "I migrated 120 microservices on Kubernetes.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    expect(result.events.length).toBeGreaterThan(0);
    const contradictionDetected = result.events.find((e: any) => e.eventType === "CONTRADICTION_DETECTED");
    expect(contradictionDetected).toBeDefined();
    expect(contradictionDetected.payload.contradictionType).toBe("factual-number-mismatch");
  });

  it("should detect blocking contradiction for critical severity", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "I worked at Airbus for 5 years.",
              category: "claim",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            data: {
              content: "I worked at Boeing for 5 years.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    const blockingContradiction = result.events.find((e: any) => e.eventType === "BLOCKING_CONTRADICTION_DETECTED");
    expect(blockingContradiction).toBeDefined();
  });

  it("should detect recoverable contradiction for temporal overlap", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "I worked full-time at company A while working full-time at company B.",
              category: "claim",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            data: {
              content: "I managed both projects simultaneously.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    const recoverableContradiction = result.events.find((e: any) => e.eventType === "RECOVERABLE_CONTRADICTION_DETECTED");
    expect(recoverableContradiction).toBeDefined();
  });

  it("should not detect contradiction for consistent observations", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "I worked at Google for 3 years.",
              category: "claim",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            data: {
              content: "I used Kubernetes at Google.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    const contradictionDetected = result.events.find((e: any) => e.eventType === "CONTRADICTION_DETECTED");
    expect(contradictionDetected).toBeUndefined();
  });

  it("should record contradictions in ledger", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "I migrated 180 microservices.",
              category: "claim",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            data: {
              content: "I migrated 120 microservices.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    await engine.execute(input);

    const ledger = engine.getLedger();
    const entries = ledger.getAll();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].observationAId).toBe("obs-1");
    expect(entries[0].observationBId).toBe("obs-2");
  });

  it("should include ruleId and ruleVersion in events", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "I migrated 180 microservices.",
              category: "claim",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            data: {
              content: "I migrated 120 microservices.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    const contradictionDetected = result.events.find((e: any) => e.eventType === "CONTRADICTION_DETECTED");
    expect(contradictionDetected).toBeDefined();
    expect(contradictionDetected.payload.ruleId).toBeDefined();
    expect(contradictionDetected.payload.ruleId).toMatch(/^CONTRADICTION-\d+$/);
    expect(contradictionDetected.payload.ruleVersion).toBeDefined();
    expect(contradictionDetected.payload.ruleVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("should apply all policies in evaluation", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "I migrated 180 microservices.",
              category: "claim",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            data: {
              content: "I migrated 120 microservices.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    await engine.execute(input);

    const ledger = engine.getLedger();
    const entries = ledger.getAll();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].policy).toBeDefined();
    expect(entries[0].policy.length).toBeGreaterThan(0);
  });

  it("should use ContradictionCatalog for type detection", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "I migrated 180 microservices.",
              category: "claim",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            data: {
              content: "I migrated 120 microservices.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    const contradictionDetected = result.events.find((e: any) => e.eventType === "CONTRADICTION_DETECTED");
    expect(contradictionDetected).toBeDefined();
    expect(contradictionDetected.payload.contradictionType).toBe("factual-number-mismatch");
  });
});
