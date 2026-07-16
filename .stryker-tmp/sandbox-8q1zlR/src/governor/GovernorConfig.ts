// @ts-nocheck
export interface GovernorConfig {
  maxActiveNodes: number;
  maxDeadNodeRatio: number; // dead / (active+dead)
  maxQueuedTasks: number;
  cpuUsageThreshold: number; // 0-1, placeholder for future integration
  memoryUsageThreshold: number; // 0-1, placeholder
  backpressureDelayMs: number; // delay when overload detected
}

export const defaultGovernorConfig: GovernorConfig = {
  maxActiveNodes: 10,
  maxDeadNodeRatio: 0.5,
  maxQueuedTasks: 100,
  cpuUsageThreshold: 0.9,
  memoryUsageThreshold: 0.9,
  backpressureDelayMs: 2000,
};
