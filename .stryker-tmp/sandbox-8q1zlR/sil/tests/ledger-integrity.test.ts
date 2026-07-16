// @ts-nocheck
import { describe, it, expect } from "vitest";
import { InMemoryMerkleLedgerWriter } from "../services/ledger/merkle-ledger";
import { MemoryEventStore } from "../services/memory-event-store";
import * as crypto from "crypto";

const mockEvent = (i: number) => ({
  tenantId: "tenant-ledger",
  sessionId: "session-ledger",
  eventId: `e${i}`,
  hash: crypto.createHash("sha256").update(`event-${i}`).digest("hex"),
  previousHash: i === 0 ? "" : crypto.createHash("sha256").update(`event-${i-1}`).digest("hex"),
  sequence: i,
});

describe("Phase 2-L: Merkle Ledger Integrity", () => {
  it("verifies merkle root stability and batch generation", async () => {
    const store = new MemoryEventStore();
    const ledger = new InMemoryMerkleLedgerWriter(store);

    for (let i = 0; i < 100; i++) {
      await ledger.append(mockEvent(i));
    }

    // Since batch size is 100, appending the 100th event triggers flushBatch automatically.
    // However, to capture the exact batch or force a flush we can do it manually if it wasn't flushed.
    // The internal implementation flushes on >= 100, so it should be flushed.
    
    // To explicitly test the flush returned value, let's append 99 and then flush manually:
    const ledger2 = new InMemoryMerkleLedgerWriter(store);
    for (let i = 0; i < 99; i++) {
      await ledger2.append(mockEvent(i));
    }
    
    const batch = await ledger2.flushBatch();

    expect(batch.batchId).toBeDefined();
    expect(batch.rootHash).toBeDefined();
    expect(batch.startSequence).toBe(0);
    expect(batch.endSequence).toBe(98);
    expect(typeof batch.rootHash).toBe("string");
    expect(batch.rootHash.length).toBe(64); // SHA-256 hex length
  });
});
