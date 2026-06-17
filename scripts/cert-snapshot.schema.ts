// scripts/cert-snapshot.schema.ts
/**
 * Certification Snapshot Schema – immutable contract between kernel, evaluator and audit.
 * Guarantees that the JSON produced by `cert-kernel.ts` never drifts.
 */
export interface ModeResult {
  /** Mode name – e.g. "normal", "guard", "replay", "stress", "circuit", "pressure" */
  mode: string;
  /** Number of events that were fed to the runtime for this mode */
  events: number;
  /** Wall‑clock duration of the run (ms) */
  durationMs: number;
  /** Process exit code – 0 = success, 1 = failure */
  exitCode: 0 | 1;
}

export interface MemoryRun {
  /** Growth percentage of heap used compared to the previous run */
  growthPct: number;
  /** Optional raw heap metrics (bytes) */
  heapUsed?: number;
  heapTotal?: number;
  rss?: number;
}

export interface CertificationSnapshot {
  /** Unique identifier for this certification run */
  runId: string;
  /** Epoch ms when the snapshot was created */
  timestamp: number;

  /** Results per harness mode – fixed set of keys */
  modes: {
    normal: ModeResult;
    guard: ModeResult;
    replay: ModeResult;
    stress: ModeResult;
    circuit: ModeResult;
    pressure: ModeResult;
  };

  /** Prometheus metrics collected after the run */
  metrics: {
    /** Raw text of the Prometheus exposition (kept for audit purposes) */
    rawPrometheus?: string;
    /** Parsed numeric values – key is metric name, value is the counter/gauge */
    parsed: Record<string, number>;
  };

  /** Memory‑leak observation series */
  memory: {
    /** Per‑run growth percentages */
    runs: MemoryRun[];
    /** Highest growth observed across runs */
    maxGrowthPct: number;
  };
}
