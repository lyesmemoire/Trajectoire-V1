/**
 * WakeupNotifier — Abstraction for notifying the RuntimeLoop that new events are available.
 * 
 * This exists to break the Ingestor → RuntimeLoop direct dependency.
 * The Ingestor calls notify() after appending an event to the store.
 * The RuntimeLoop implements this interface (its wakeup method already matches).
 * 
 * The orchestrator wires them together at construction time.
 */
export interface WakeupNotifier {
  notify(tenantId: string, sessionId: string): Promise<void>;
}
