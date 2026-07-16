// @ts-nocheck
// cert-evaluator.ts - Pure evaluation of certification snapshot
import fs from "fs";

type Evaluation = {
  B1: boolean; // Event accounting
  B2: boolean; // Replay integrity
  B3: boolean; // Memory leak
  B4: boolean; // Circuit breaker cycle
  B5: boolean; // Backpressure behavior
};

// Expected snapshot structure (produced by cert-kernel.ts)
interface CertificationSnapshot {
  runId: string;
  timestamp: number;
  modes: Record<string, {
    mode: string;
    events: number;
    durationMs: number;
    exitCode: 0 | 1;
  }>;
  metrics: {
    rawPrometheus: string; // original text (unused here)
    parsed: Record<string, number>;
  };
  memory: {
    leakSeries: number[];
    maxGrowthPct: number;
  };
}

function loadSnapshot(): CertificationSnapshot {
  const snapshotPath = "certification-snapshot.json";
  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Missing ${snapshotPath}`);
  }
  const raw = fs.readFileSync(snapshotPath, "utf-8");
  return JSON.parse(raw) as CertificationSnapshot;
}

function evaluate(): Evaluation {
  const snapshot = loadSnapshot();
  const metrics = snapshot.metrics.parsed;

  const evalResult: Evaluation = {
    B1: false,
    B2: false,
    B3: false,
    B4: false,
    B5: false,
  };

  // B1 – Event Accounting
  const received = metrics["runtime_events_received_total"];
  const processed = metrics["runtime_events_processed_total"];
  const failed = metrics["runtime_events_failed_total"];
  const dropped = metrics["runtime_events_dropped_total"];
  if (
    received !== undefined &&
    processed !== undefined &&
    failed !== undefined &&
    dropped !== undefined &&
    received === processed + failed + dropped
  ) {
    evalResult.B1 = true;
  }

  // B2 – Replay Integrity (all mismatch counters must be zero or absent)
  const replayHashMismatch = metrics["runtime_replay_hash_mismatch_total"] ?? 0;
  const replayStateMismatch = metrics["runtime_replay_state_mismatch_total"] ?? 0;
  const replayEventMismatch = metrics["runtime_replay_event_mismatch_total"] ?? 0;
  if (replayHashMismatch === 0 && replayStateMismatch === 0 && replayEventMismatch === 0) {
    evalResult.B2 = true;
  }

  // B3 – Memory Leak (use maxGrowthPct from snapshot.memory)
  const maxGrowth = snapshot.memory?.maxGrowthPct ?? 0;
  if (maxGrowth < 5) {
    evalResult.B3 = true;
  }

  // B4 – Circuit Breaker (requires at least one OPEN and one recovery transition)
  const circuitOpen = metrics["runtime_circuit_open_total"] ?? 0;
  const circuitRecovery = metrics["runtime_circuit_recovery_total"] ?? 0;
  if (circuitOpen > 0 && circuitRecovery > 0) {
    evalResult.B4 = true;
  }

  // B5 – Backpressure (no drops, queue depth never exceeds capacity)
  const bpDrops = metrics["runtime_backpressure_drop_total"] ?? 0;
  const bpDepth = metrics["runtime_backpressure_queue_depth"] ?? 0;
  const bpCapacity = metrics["runtime_backpressure_queue_capacity"] ?? Number.MAX_SAFE_INTEGER;
  if (bpDrops === 0 && bpDepth <= bpCapacity) {
    evalResult.B5 = true;
  }

  // Persist evaluation for audit generator
  const outPath = "certification-evaluation.json";
  fs.writeFileSync(outPath, JSON.stringify(evalResult, null, 2));
  console.log(`✅ Evaluation written to ${outPath}`);
  return evalResult;
}

evaluate();

