export interface WatchdogConfig {
  /** Name of the process being supervised (for logging) */
  targetProcessName: string;
  /** Interval between health probes (ms) */
  tickIntervalMs: number;
  /** Maximum number of restarts before giving up */
  maxRestarts: number;
  /** Minimum interval between successive restarts (ms) – cooldown lock */
  minRestartIntervalMs: number;
  /** Memory usage limit in megabytes; exceeding triggers immediate restart */
  memoryLimitMB: number;
  /** Interval for memory checks (ms) – throttles memory usage queries */
  memoryCheckIntervalMs: number;
  /** Health endpoint URL (e.g., http://127.0.0.1:8089/health) */
  healthEndpoint: string;
  /** Health score threshold below which a restart is considered */
  healthFailureThreshold: number;
  /** Number of consecutive failures required before restart */
  failureWindowSize?: number; // defaults to 3 if omitted
}
