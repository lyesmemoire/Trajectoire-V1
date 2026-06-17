import type { SnapshotStore, RuntimeSnapshot } from "./SnapshotStore";
import type { OrchestrationResult } from "../orchestrator/RuntimeOrchestrator";

export class SnapshotManager {
  private readonly store: SnapshotStore;
  private readonly interval: number;

  /**
   * @param store The snapshot storage backend.
   * @param interval Number of events between snapshots (default: 500).
   */
  constructor(store: SnapshotStore, interval: number = 500) {
    this.store = store;
    this.interval = interval;
  }

  /**
   * Evaluate whether a snapshot should be taken based on the latest orchestration result.
   * This should be called asynchronously after `RuntimeOrchestrator.process()`.
   */
  async evaluateSnapshot(result: OrchestrationResult, sessionId: string): Promise<void> {
    const sequence = result.event.sequence;
    
    // Only snapshot exactly on the interval boundaries to prevent redundant writes
    if (sequence > 0 && sequence % this.interval === 0) {
      const snapshot: RuntimeSnapshot = {
        sessionId,
        sequence,
        replayHash: result.replayHash,
        fsmState: result.snapshot,
        transitionId: result.transitionId
      };

      try {
        await this.store.saveSnapshot(snapshot);
        console.log(`[SnapshotManager] Successfully saved snapshot for session ${sessionId} at sequence ${sequence}`);
      } catch (err) {
        // Snapshot failure is non-fatal to the runtime, but should be alerted
        console.error(`[SnapshotManager] Failed to save snapshot for session ${sessionId} at sequence ${sequence}`, err);
      }
    }
  }
}
