import { describe, it, expect } from "vitest";
import { RealP6RuntimeClient } from "../services/p6-runtime-client";
import { ExecutionFacade } from "../../core/p5/integration/execution-facade";
import { MindState } from "../../core/p5/execution-contract";
import { RuntimeDecision } from "../../core/p5/integration/integration-contract";
import { Journal } from "../../core/p4/journal-contract";

// Mock ExecutionFacade to test the adapter
class MockExecutionFacade extends ExecutionFacade {
  initSession(sessionId: string, initialState: MindState, timestamp: number): void {
    if (sessionId === "fail-start") throw new Error("TIMEOUT");
    super.initSession(sessionId, initialState, timestamp);
  }

  execute(sessionId: string, decision: RuntimeDecision, timestamp: number) {
    if (sessionId === "fail-process") throw new Error("STATE_CORRUPTION");
    return super.execute(sessionId, decision, timestamp);
  }
}

describe("SIL Phase 2-B — Real P6 Runtime Adapter", () => {
  it("Should start session successfully", async () => {
    const facade = new ExecutionFacade();
    const adapter = new RealP6RuntimeClient(facade);

    const result = await adapter.startSession({
      sessionId: "session-1",
      tenantId: "tenant-A",
      payload: {}
    });

    expect(result.sessionId).toBe("session-1");
    expect(result.snapshotHash).toBeDefined();
    expect(result.journalPointer).toBe("0");
    expect(facade.activeSessions).toBe(1);
  });

  it("Should propagate commit with snapshotHash and journalPointer", async () => {
    const facade = new ExecutionFacade();
    const adapter = new RealP6RuntimeClient(facade);

    await adapter.startSession({ sessionId: "session-2", tenantId: "tenant-A", payload: {} });

    const result = await adapter.processEvent({
      sessionId: "session-2",
      tenantId: "tenant-A",
      payload: { trustDelta: 10 }
    });

    expect(result.sessionId).toBe("session-2");
    expect(result.snapshotHash).toBeDefined();
    // After 1 decision, journal pointer advances
    expect(Number(result.journalPointer)).toBeGreaterThan(0);
  });

  it("Should translate start timeout failure correctly", async () => {
    const facade = new MockExecutionFacade();
    const adapter = new RealP6RuntimeClient(facade);

    await expect(adapter.startSession({ sessionId: "fail-start", tenantId: "t", payload: {} }))
      .rejects.toThrowError("P6_START_FAILED: TIMEOUT");
  });

  it("Should translate process execution failure correctly", async () => {
    const facade = new MockExecutionFacade();
    const adapter = new RealP6RuntimeClient(facade);

    await adapter.startSession({ sessionId: "fail-process", tenantId: "t", payload: {} });

    await expect(adapter.processEvent({ sessionId: "fail-process", tenantId: "t", payload: {} }))
      .rejects.toThrowError("P6_PROCESS_FAILED: STATE_CORRUPTION");
  });

  it("Should produce deterministic hashes (Same input -> Same hash)", async () => {
    const facade1 = new ExecutionFacade();
    const adapter1 = new RealP6RuntimeClient(facade1);
    const result1 = await adapter1.startSession({ sessionId: "session-A", tenantId: "t", payload: {} });

    const facade2 = new ExecutionFacade();
    const adapter2 = new RealP6RuntimeClient(facade2);
    const result2 = await adapter2.startSession({ sessionId: "session-B", tenantId: "t", payload: {} });

    // Initial snapshots should match if inputs are identical
    expect(result1.snapshotHash).toBe(result2.snapshotHash);
  });
});
