import type { TickDiff } from "./diffTrace";

export interface DriftVectorResult {
  vector: number[];
  diffs: TickDiff[];
  leaderChanges: number;
  eventInflation: number;
  eventRegression: number;
  missingTicks: number;
  eventDriftSum: number;
  totalOldEvents: number;
  ticks: {
    changed: number[];
    leaderChange: number[];
    eventInflation: number[];
    eventRegression: number[];
    missing: number[];
  };
}

export function computeDriftVector(diffs: TickDiff[], totalOldEvents?: number): DriftVectorResult {
  const leaderChangeTicks: number[] = [];
  const eventInflationTicks: number[] = [];
  const eventRegressionTicks: number[] = [];
  const missingTicks: number[] = [];
  const changedTicks: number[] = [];
  let eventDriftSum = 0;
  
  for (const diff of diffs) {
    changedTicks.push(diff.tickId);
    
    if (diff.leaderChange) {
      leaderChangeTicks.push(diff.tickId);
    }
    
    if (diff.eventCountChange) {
      const drift = Math.abs(diff.eventCountChange.new - diff.eventCountChange.old);
      eventDriftSum += drift;
      
      if (diff.eventCountChange.new > diff.eventCountChange.old) {
        eventInflationTicks.push(diff.tickId);
      } else if (diff.eventCountChange.new < diff.eventCountChange.old) {
        eventRegressionTicks.push(diff.tickId);
      }
    }
    
    if (diff.missing) {
      missingTicks.push(diff.tickId);
    }
  }
  
  // Sort all tick arrays for deterministic ordering
  leaderChangeTicks.sort((a, b) => a - b);
  eventInflationTicks.sort((a, b) => a - b);
  eventRegressionTicks.sort((a, b) => a - b);
  missingTicks.sort((a, b) => a - b);
  changedTicks.sort((a, b) => a - b);
  
  return {
    vector: [], // Not used in tests, keeping for API compatibility
    diffs,
    leaderChanges: leaderChangeTicks.length,
    eventInflation: eventInflationTicks.length,
    eventRegression: eventRegressionTicks.length,
    missingTicks: missingTicks.length,
    eventDriftSum,
    totalOldEvents: totalOldEvents || 0,
    ticks: {
      changed: changedTicks,
      leaderChange: leaderChangeTicks,
      eventInflation: eventInflationTicks,
      eventRegression: eventRegressionTicks,
      missing: missingTicks,
    }
  };
}
