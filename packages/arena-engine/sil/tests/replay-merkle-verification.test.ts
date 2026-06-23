import { describe, it, expect } from "vitest";
import { ReplayEngine } from "../services/replay/replay-engine";
import { DefaultEventQueryService } from "../services/query/event-query-service";
import { MockP7EvaluatorClient } from "./mocks/mock-p7-evaluator-client";
import { MockRuntimeTraceProvider } from "./mocks/mock-runtime-trace-provider";
import { MerkleLedgerReader } from "../services/ledger/merkle-ledger-reader";
import { MemoryEventStore } from "../services/memory-event-store";
import { SILEvent } from "../contracts/sil-events";

// Mock Ledger Reader
class MockMerkleLedgerReader implements MerkleLedgerReader {
  constructor(private expectedHash: string) {}

  async verifySession(tenantId: string, sessionId: string) {
    return {
      valid: true,
      finalHash: this.expectedHash,
      batchCount: 1
    };
  }
}

describe("Phase 2-L Finale: Merkle Verified Replay Engine", () => {
  it("verifies determinism against both runtime and ledger historical state", async () => {
    const store = new MemoryEventStore();
    const query = new DefaultEventQueryService(store as any);
    const p7 = new MockP7EvaluatorClient();
    const trace = new MockRuntimeTraceProvider();
    
    // We expect P7 mock to return this specific hash
    const expectedReplayHash = "mock-report-hash";
    
    const ledger = new MockMerkleLedgerReader(expectedReplayHash);

    const engine = new ReplayEngine(query, p7, trace, ledger);

    const tenantId = "tenant-audit";
    const sessionId = "sess-merkle";

    await store.append({
      tenantId,
      sessionId,
      eventId: "e1",
      type: "TEST",
      timestamp: 1,
      signature: "",
      hash: "h1"
    } as SILEvent);

    const result = await engine.verifyReplayWithLedger(sessionId, tenantId);

    expect(result.verified).toBe(true);
    expect(result.replayHash).toBe(expectedReplayHash);
    expect(result.ledgerHash).toBe(expectedReplayHash);
  });

  it("throws error if merkle divergence is detected", async () => {
    const store = new MemoryEventStore();
    const query = new DefaultEventQueryService(store as any);
    const p7 = new MockP7EvaluatorClient();
    const trace = new MockRuntimeTraceProvider();
    
    // Ledger reports a different hash (tampering detected)
    const ledger = new MockMerkleLedgerReader("tampered-hash-does-not-match");

    const engine = new ReplayEngine(query, p7, trace, ledger);

    const tenantId = "tenant-audit";
    const sessionId = "sess-merkle-tamper";

    await store.append({
      tenantId,
      sessionId,
      eventId: "e1",
      type: "TEST",
      timestamp: 1,
      signature: "",
      hash: "h1"
    } as SILEvent);

    await expect(engine.verifyReplayWithLedger(sessionId, tenantId)).rejects.toThrow("REPLAY_MERKLE_DIVERGENCE");
  });
});
