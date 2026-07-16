// @ts-nocheck
// src/watchdog/federation/WeightedQuorum.ts

import { FaultOverlayState } from "../../observability/FaultOverlayState";

import { NodeHealth } from "./types";

/**
 * WeightedQuorum computes health and action quorum decisions based on
 * per‑node health scores. It applies optional penalties and a leader bonus.
 */
export class WeightedQuorum {
  /**
   * healthThreshold – minimal weighted sum (as a fraction of total nodes) required
   * for the cluster to be considered healthy.
   * actionThreshold – minimal weighted sum required for a restart decision.
   */
  private healthThreshold: number;
  private actionThreshold: number;

  constructor(
    healthThreshold: number = 0.6,
    actionThreshold: number = 0.8
  ) {
    this.healthThreshold = healthThreshold;
    this.actionThreshold = actionThreshold;
  }

  compute(
    nodes: NodeHealth[],
    overlays: FaultOverlayState[] = []
  ) {
    let healthSum = 0;
    let actionSum = 0;

    const overlayMap = new Map(overlays.map(o => [o.nodeId, o]));

    for (const n of nodes) {
      // base health weight with lag/drift penalties and leader bias
      let healthWeight = n.health;
      if ((n.replayLag ?? 0) > 0.2) healthWeight *= 0.8;
      if ((n.ledgerDrift ?? 0) > 0.2) healthWeight *= 0.8;
      if (n.isLeader) healthWeight *= 1.2;

      healthSum += healthWeight;

      // fault overlay penalty (capped at 0.4) applied only to action quorum
      const overlay = overlayMap.get(n.nodeId);
      const penalty = Math.min(overlay?.penaltyScore ?? 0, 0.4);
      const effectiveHealth = healthWeight * (1 - penalty);
      actionSum += effectiveHealth;
    }

    const count = nodes.length || 1;

    return {
      healthQuorum: healthSum >= this.healthThreshold * count,
      actionQuorum: actionSum >= this.actionThreshold * count,
      weightedSum: healthSum,
      adjustedWeightedSum: actionSum,
    };
  }
}
