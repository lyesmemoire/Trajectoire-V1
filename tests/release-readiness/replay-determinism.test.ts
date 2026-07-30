import { describe, it, expect } from "vitest";
import { MemoryEventStore } from "../../apps/web/src/lib/ai/repositories/MemoryEventStore";
import { SnapshotHash } from "../../apps/web/src/lib/ai/utils/SnapshotHash";

describe("Release Readiness - Replay Audit", () => {
  it("Execution → EventStore → Replay → SnapshotHash: hash must be identical", async () => {
    const eventStore = new MemoryEventStore();
    
    // Simulate Execution - Create events
    const events = [
      {
        id: "event-1",
        sessionId: "test-session",
        sequence: 1,
        eventType: "TEST_EVENT",
        engine: "test",
        engineVersion: "1.0.0",
        payload: { data: "test-data-1" },
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: { traceId: "trace-1", correlationId: "corr-1" },
        provider: "internal",
        model: "internal",
        promptId: "test-prompt",
        promptVersion: "1.0.0",
        promptChecksum: "abc123",
        schemaVersion: "1.0",
      },
      {
        id: "event-2",
        sessionId: "test-session",
        sequence: 2,
        eventType: "TEST_EVENT",
        engine: "test",
        engineVersion: "1.0.0",
        payload: { data: "test-data-2" },
        createdAt: new Date("2024-01-01T00:01:00Z"),
        metadata: { traceId: "trace-1", correlationId: "corr-1" },
        provider: "internal",
        model: "internal",
        promptId: "test-prompt",
        promptVersion: "1.0.0",
        promptChecksum: "abc123",
        schemaVersion: "1.0",
      },
    ];

    // EventStore - Append events
    for (const event of events) {
      eventStore.append(event);
    }

    // Replay - Get events back
    const replayedEvents = eventStore.replay("test-session");

    // Calculate hash of original events
    const originalHash = SnapshotHash.calculateEventStreamHash(events);

    // Calculate hash of replayed events
    const replayedHash = SnapshotHash.calculateEventStreamHash(replayedEvents);

    // Verify hashes are identical
    expect(replayedHash).toBe(originalHash);
    expect(replayedHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("Multiple replays must produce identical hashes", async () => {
    const eventStore = new MemoryEventStore();
    
    const events = [
      {
        id: "event-1",
        sessionId: "test-session",
        sequence: 1,
        eventType: "TEST_EVENT",
        engine: "test",
        engineVersion: "1.0.0",
        payload: { data: "test-data" },
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: { traceId: "trace-1", correlationId: "corr-1" },
        provider: "internal",
        model: "internal",
        promptId: "test-prompt",
        promptVersion: "1.0.0",
        promptChecksum: "abc123",
        schemaVersion: "1.0",
      },
    ];

    eventStore.append(events[0]);

    const hashes: string[] = [];
    
    // Replay 10 times
    for (let i = 0; i < 10; i++) {
      const replayedEvents = eventStore.replay("test-session");
      const hash = SnapshotHash.calculateEventStreamHash(replayedEvents);
      hashes.push(hash);
    }

    // All hashes must be identical
    const firstHash = hashes[0];
    for (const hash of hashes) {
      expect(hash).toBe(firstHash);
    }
  });
});
