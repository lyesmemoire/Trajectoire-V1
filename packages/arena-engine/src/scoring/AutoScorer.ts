import { FaultTrace } from "../observability/FaultTelemetry";

export interface ScoreResult {
  B1: boolean;
  B2: boolean;
  B3: boolean;
  B4: boolean;
  B5: boolean;

  resilienceScore: number; // 0–100

  breakdown: {
    replay: number;
    ordering: number;
    memory: number;
    backpressure: number;
    circuit: number;
  };
}

export interface ScoringInput {
  metrics: Record<string, number>;
  faultTrace: FaultTrace;
  attackType?: string;
}

export class AutoScorer {
  score(input: ScoringInput): ScoreResult {
    const m = input.metrics;
    const f = input.faultTrace;

    // -------------------------
    // B1 EVENT ACCOUNTING
    // -------------------------
    const B1 =
      (m.runtime_events_received_total || 0) ===
      ((m.runtime_events_processed_total || 0) +
        (m.runtime_events_failed_total || 0) +
        (m.runtime_events_dropped_total || 0));

    // -------------------------
    // B2 REPLAY INTEGRITY
    // -------------------------
    const replayFaults = f.events.filter(e => e.domain === "REPLAY").length;
    const B2 = replayFaults === 0 && (m.runtime_replay_hash_mismatch_total ?? 0) === 0;

    // -------------------------
    // B3 MEMORY
    // -------------------------
    const B3 =
      (m.runtime_memory_heap_growth_pct ?? 0) < 5 &&
      f.summary.critical === 0;

    // -------------------------
    // B4 CIRCUIT BREAKER
    // -------------------------
    const circuitFaults = f.events.filter(e => e.domain === "CIRCUIT").length;
    const B4 =
      circuitFaults === 0 ||
      (m.runtime_circuit_state_total ?? 0) > 1;

    // -------------------------
    // B5 BACKPRESSURE
    // -------------------------
    const B5 =
      (m.runtime_backpressure_drop_total ?? 0) === 0 &&
      (m.runtime_backpressure_queue_depth_max ?? 0) <
        (m.runtime_backpressure_queue_capacity ?? Infinity);

    // -------------------------
    // DOMAIN SCORING
    // -------------------------
    const replayScore = Math.max(0, 100 - replayFaults * 20);
    const orderingScore = Math.max(
      0,
      100 - f.events.filter(e => e.domain === "ORDERING").length * 10
    );
    const memoryScore = Math.max(
      0,
      100 - (100 - (m.runtime_memory_heap_growth_pct ?? 0)) * 2
    );
    const backpressureScore = B5 ? 100 : 40;
    const circuitScore = B4 ? 100 : 30;

    const resilienceScore =
      (replayScore +
        orderingScore +
        memoryScore +
        backpressureScore +
        circuitScore) /
      5;

    return {
      B1,
      B2,
      B3,
      B4,
      B5,
      resilienceScore: Math.round(resilienceScore),
      breakdown: {
        replay: replayScore,
        ordering: orderingScore,
        memory: memoryScore,
        backpressure: backpressureScore,
        circuit: circuitScore,
      },
    };
  }
}
