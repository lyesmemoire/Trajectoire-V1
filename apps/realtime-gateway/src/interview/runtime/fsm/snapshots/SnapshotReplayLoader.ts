import type { SnapshotStore } from "./SnapshotStore";
import type { PersistentEventStore } from "../store/PersistentEventStore";
import { RuntimeOrchestrator } from "../orchestrator/RuntimeOrchestrator";
import { RuntimeEventBus } from "../orchestrator/RuntimeEventBus";
import type { IFsmEngine } from "../orchestrator/RuntimeOrchestrator";

export class SnapshotReplayLoader {
  constructor(
    private readonly snapshotStore: SnapshotStore,
    private readonly eventStore: PersistentEventStore,
    private readonly createFsmEngine: (initialState: unknown) => IFsmEngine
  ) {}

  /**
   * Load the orchestration pipeline for a session.
   * If a snapshot exists, it resumes from the snapshot and replays delta events.
   * If no snapshot exists, it replays from genesis (sequence 0).
   */
  async loadSession(sessionId: string): Promise<RuntimeOrchestrator> {
    // 1. Fetch latest snapshot
    const snapshot = await this.snapshotStore.getLatestSnapshot(sessionId);
    
    let currentSequence = 0;
    let currentBus = RuntimeEventBus.create();
    let engineState = undefined; // genesis state

    if (snapshot) {
      console.log(`[SnapshotReplayLoader] Resuming session ${sessionId} from snapshot at sequence ${snapshot.sequence}`);
      currentSequence = snapshot.sequence;
      engineState = snapshot.fsmState;
      currentBus = RuntimeEventBus.create(currentSequence);
    } else {
      console.log(`[SnapshotReplayLoader] Replaying session ${sessionId} from genesis`);
    }

    // 2. Fetch delta events
    const deltaEvents = await this.eventStore.getEventsSince(sessionId, currentSequence);

    // 3. Instantiate Engine
    const engine = this.createFsmEngine(engineState);

    // 4. Instantiate Orchestrator (needs fix for base sequence if from snapshot)
    // For now we will append the delta events to catch up.
    // To properly support SnapshotReplay, RuntimeEventBus must support being initialized with a sequence offset.
    let orchestrator = new RuntimeOrchestrator(currentBus, engine);

    for (const event of deltaEvents) {
      const result = await orchestrator.process(event);
      orchestrator = result.nextOrchestrator;
    }

    return orchestrator;
  }
}
