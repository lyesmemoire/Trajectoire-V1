// src/interview/runtime/fsm/snapshots/SnapshotReplayEquivalence.test.ts

import { SnapshotReplayLoader } from "./SnapshotReplayLoader";
import { RuntimeOrchestrator } from "../orchestrator/RuntimeOrchestrator";
import { RuntimeEventBus } from "../orchestrator/RuntimeEventBus";
// placeholder if needed
import { versionedHash } from "../utils/versionedHash";

/**
 * Helper to generate a sequence of deterministic events for testing.
 */
function generateTestEvents(count: number): any[] {
  const events = [];
  for (let i = 1; i <= count; i++) {
    events.push({
      sequence: i,
      timestamp: new Date(0).toISOString(),
      type: "test",
      eventId: `event-${i}`,
      meta: {},
    });
  }
  return events;
}

test("snapshot replay equivalence", async () => {
  // Setup in‑memory stores (or mock Supabase client) – using the real Postgres stores would require a DB.
  // For brevity we use a simple mock implementation that satisfies the interfaces.
  const mockEventStore: any = {
    async append(event: any) {},
    async getEventsSince(_sessionId: string, _seq: number) {
      return [];
    },
    async appendBatch(_events: any[]) {},
  };
  const mockSnapshotStore: any = {
    async saveSnapshot(_snap: any) {},
    async getLatestSnapshot(_sessionId: string) {
      return null;
    },
  };

  // Create a simple deterministic FSM engine stub
  const engineFactory = (state: any) => ({
    transition: (_seq: number, _event: any) => ({ transitionId: "t", newState: state })
  });

  // 1️⃣ Genesis replay
  const busGenesis = RuntimeEventBus.create();
  const orchGenesis = new RuntimeOrchestrator(busGenesis, engineFactory(undefined));
  const events = generateTestEvents(100);
  let currentOrch = orchGenesis;
  for (const ev of events) {
    const result = await currentOrch.process(ev);
    currentOrch = result.nextOrchestrator;
  }
  const hashA = currentOrch.bus.getSessionReplayHash();

  // 2️⃣ Snapshot at sequence 50
  const snapshot = {
    sessionId: "test-session",
    sequence: 50,
    replayHash: "snapshot-hash-placeholder",
    fsmState: undefined,
    transitionId: "t",
    snapshotHash: versionedHash({ sequence: 50, replayHash: "snapshot-hash-placeholder" })
  };
  // Mock snapshot store to return this snapshot
  mockSnapshotStore.getLatestSnapshot = async () => snapshot;
  mockEventStore.getEventsSince = async (_sid: string, seq: number) =>
    events.slice(seq);

  const loader = new SnapshotReplayLoader(
    mockSnapshotStore as any,
    mockEventStore as any,
    engineFactory,
  );
  const restoredOrch = await loader.loadSession("test-session");
  const hashB = restoredOrch.bus.getSessionReplayHash();

  expect(hashA).toBe(hashB);
});
