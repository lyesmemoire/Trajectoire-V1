import type { TickDiff } from "./diffTrace";

export interface FingerprintResult {
  fingerprint: string;
  trace: TickDiff[];
  changedTicks: number[];
  leaderChanges: number;
  eventDrift: number;
}

export function makeFingerprint(diffs: TickDiff[], totalOldEvents?: number): FingerprintResult {
  const changedTicks: number[] = [];
  let leaderChanges = 0;
  let eventDriftSum = 0;
  
  for (const diff of diffs) {
    changedTicks.push(diff.tickId);
    
    if (diff.leaderChange) {
      leaderChanges++;
    }
    
    if (diff.eventCountChange) {
      eventDriftSum += Math.abs(diff.eventCountChange.new - diff.eventCountChange.old);
    }
  }
  
  // Sort changed ticks for deterministic ordering
  changedTicks.sort((a, b) => a - b);
  
  // Calculate event drift as a ratio
  const eventDrift = totalOldEvents && totalOldEvents > 0 
    ? Math.round((eventDriftSum / totalOldEvents) * 10000) / 10000 
    : 0;
  
  // Generate a simple fingerprint from the data
  const fingerprint = JSON.stringify({
    changedTicks,
    leaderChanges,
    eventDrift,
  });
  
  return {
    fingerprint,
    trace: diffs,
    changedTicks,
    leaderChanges,
    eventDrift,
  };
}
