import type { TickDiff } from "./diffTrace";

export interface Cluster {
  type: string;
  severity: number;
  ticks: number[];
  count: number;
}

const SEVERITY_WEIGHTS = {
  missing_tick: 5,
  leader_drift: 3,
  event_inflation: 1,
  event_regression: 1,
} as const;

export function clusterDiffs(diffs: TickDiff[]): Cluster[] {
  const clusters: Cluster[] = [];
  
  // Group by category
  const missingTicks: number[] = [];
  const leaderDriftTicks: number[] = [];
  const eventInflationTicks: number[] = [];
  const eventRegressionTicks: number[] = [];
  
  for (const diff of diffs) {
    if (diff.missing) {
      missingTicks.push(diff.tickId);
    }
    if (diff.leaderChange) {
      leaderDriftTicks.push(diff.tickId);
    }
    if (diff.eventCountChange) {
      if (diff.eventCountChange.new > diff.eventCountChange.old) {
        eventInflationTicks.push(diff.tickId);
      } else if (diff.eventCountChange.new < diff.eventCountChange.old) {
        eventRegressionTicks.push(diff.tickId);
      }
    }
  }
  
  // Sort ticks within each cluster
  missingTicks.sort((a, b) => a - b);
  leaderDriftTicks.sort((a, b) => a - b);
  eventInflationTicks.sort((a, b) => a - b);
  eventRegressionTicks.sort((a, b) => a - b);
  
  // Create clusters if they have ticks
  if (missingTicks.length > 0) {
    clusters.push({
      type: "missing_tick",
      severity: missingTicks.length * SEVERITY_WEIGHTS.missing_tick,
      ticks: missingTicks,
      count: missingTicks.length,
    });
  }
  
  if (leaderDriftTicks.length > 0) {
    clusters.push({
      type: "leader_drift",
      severity: leaderDriftTicks.length * SEVERITY_WEIGHTS.leader_drift,
      ticks: leaderDriftTicks,
      count: leaderDriftTicks.length,
    });
  }
  
  if (eventInflationTicks.length > 0) {
    clusters.push({
      type: "event_inflation",
      severity: eventInflationTicks.length * SEVERITY_WEIGHTS.event_inflation,
      ticks: eventInflationTicks,
      count: eventInflationTicks.length,
    });
  }
  
  if (eventRegressionTicks.length > 0) {
    clusters.push({
      type: "event_regression",
      severity: eventRegressionTicks.length * SEVERITY_WEIGHTS.event_regression,
      ticks: eventRegressionTicks,
      count: eventRegressionTicks.length,
    });
  }
  
  // Sort clusters by severity (descending) for deterministic ordering
  clusters.sort((a, b) => b.severity - a.severity);
  
  return clusters;
}
