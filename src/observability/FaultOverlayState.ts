export interface FaultOverlayState {
  nodeId: string;

  // penalty applied to health weighting, capped to 0..0.4
  penaltyScore: number; // capped 0..0.4

  // risk factor for lease revocation, 0..1
  leaseRisk: number; // 0..1

  // hard block for restarts when critical ratio exceeds threshold
  restartBlock: boolean;

  criticalCount: number;

  // how many scoring ticks this node has persisted
  sustainedTicks: number;

  // occurrence count per fault domain
  faultDomains: Record<string, number>;
}
