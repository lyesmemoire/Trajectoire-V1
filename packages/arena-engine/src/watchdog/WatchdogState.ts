export interface WatchdogState {
  /** Timestamp of the last successful heartbeat (ms since epoch) */
  lastHeartbeat: number;
  /** Number of restarts performed so far */
  restartCount: number;
  /** Last known health score (0‑1) */
  lastKnownHealth: number;
  /** Flag indicating a crash was detected */
  crashDetected: boolean;
  /** Timestamp of the last restart attempt */
  lastRestartTime: number;
}
