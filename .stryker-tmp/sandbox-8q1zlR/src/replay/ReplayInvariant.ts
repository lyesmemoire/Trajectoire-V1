// @ts-nocheck
export interface ReplayInvariant {
  // must always be equal for PASS
  hashEquality: boolean;

  // must always be zero for PASS
  eventDrift: number;

  // must always be empty for PASS
  mismatchEvents: number;

  // structural determinism guarantee
  canonicalizationStable: boolean;
}
