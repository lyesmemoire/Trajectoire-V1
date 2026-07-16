// @ts-nocheck
import { FaultTelemetry } from "./FaultTelemetry";
import { FaultOverlayState } from "./FaultOverlayState";
import { FaultScoringEngine } from "./FaultScoringEngine";

/**
 * FaultGovernor maintains per‑node fault overlay states.
 * It receives fresh telemetry, runs the scoring engine, and stores
 * the overlay for consumption by the federated watchdog.
 */
export class FaultGovernor {
  private overlays = new Map<string, FaultOverlayState>();
  private ticks = new Map<string, number>();
  private scorer = new FaultScoringEngine();

  /**
   * Update the overlay for a node.
   * Returns the freshly computed overlay.
   */
  update(
    nodeId: string,
    telemetry: FaultTelemetry,
    totalNodes: number
  ): FaultOverlayState {
    const prevTicks = this.ticks.get(nodeId) ?? 0;
    const overlay = this.scorer.compute(
      nodeId,
      telemetry.snapshot(),
      totalNodes,
      prevTicks + 1
    );
    this.overlays.set(nodeId, overlay);
    this.ticks.set(nodeId, prevTicks + 1);
    return overlay;
  }

  /** Retrieve a specific node's overlay (if any). */
  getOverlay(nodeId: string): FaultOverlayState | undefined {
    return this.overlays.get(nodeId);
  }

  /** Retrieve all overlay states as an array. */
  getOverlayStates(): FaultOverlayState[] {
    return Array.from(this.overlays.values());
  }

  /** Clear overlay state for a node (e.g., on node removal). */
  clear(nodeId: string) {
    this.overlays.delete(nodeId);
    this.ticks.delete(nodeId);
  }
}
