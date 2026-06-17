import { SILState } from "../contracts/session-state";
import { FailureType, SILEvent } from "../contracts/sil-events";
import { EventRouter } from "../services/event-router";

export class FailureController {
  constructor(private router: EventRouter) {}

  handle(state: SILState, error: FailureType, details?: any) {
    console.warn(`[SIL Failure Detected] Session: ${state.sessionId} | Error: ${error}`, details);

    const isRecoverable = this.isRecoverable(error);

    if (isRecoverable) {
      console.log(`[SIL Recovery] Rewinding state to last checkpoint for session: ${state.sessionId}`);
      this.rewindToLastCheckpoint(state);
      this.router.emit({ 
        eventId: crypto.randomUUID(),
        type: "RECOVERY_TRIGGERED", 
        sessionId: state.sessionId, 
        tenantId: state.tenantId,
        hash: "", signature: "",
        timestamp: Date.now() 
      });
    } else {
      console.error(`[SIL Critical Failure] Session ${state.sessionId} marked as FAILED.`);
      // In a real system, we'd trigger a forensic freeze and alert here.
    }
  }

  /**
   * Record an internal corruption event — NOT through the business event pipeline.
   * 
   * This is used by the RuntimeLoop sanity check when a tenant mismatch is detected.
   * The corruption is logged for technical audit but never enters the deterministic event chain.
   * 
   * Design rationale:
   * - Internal corruption is NOT a business event
   * - It must never be replayed during recovery
   * - It must not pollute the deterministic event chain
   */
  recordInternalCorruption(
    sessionId: string,
    tenantId: string,
    details: { expectedTenant: string; receivedTenant: string; eventId: string }
  ): void {
    console.error(
      `[SIL INTERNAL_CORRUPTION] Session ${sessionId} | ` +
      `Expected tenant: ${details.expectedTenant}, received: ${details.receivedTenant} | ` +
      `Event: ${details.eventId}`
    );

    // In production, this would:
    // 1. Write to a dedicated audit/corruption log (not the event store)
    // 2. Emit a metric/alert to the monitoring system
    // 3. Potentially trigger a forensic snapshot

    // The state transition to FAILED is handled by the caller (RuntimeLoop),
    // NOT by emitting an event through the router.
  }

  private isRecoverable(error: FailureType): boolean {
    // Cryptographic or state corruption failures are terminal
    if (error === "CRYPTOGRAPHIC_FAILURE" || error === "STATE_CORRUPTION") {
      return false;
    }
    // Timeouts or transient event errors can be retried from the last checkpoint
    return true;
  }

  private rewindToLastCheckpoint(state: SILState) {
    // In a real implementation, we would restore the state.runtimeContext
    // to the snapshot stored in the checkpoint DB matching state.lastCheckpointHash
    // and reset the pointer. For the mock, we just reset the status to RUNNING to allow retry.
    state.status = "RUNNING";
  }
}
