/*
 * RuntimeMetrics.ts
 * Central Prometheus registry for runtime metrics.
 * Will be attached to HTTP /metrics endpoint once bootstrap is identified.
 */

import {
  Registry,
  Counter,
  Gauge,
  Histogram,
  collectDefaultMetrics,
} from "prom-client";

/**
 * Central Prometheus registry for runtime metrics.
 * Will be attached to HTTP /metrics endpoint once bootstrap is identified.
 */
export const registry = new Registry();

/**
 * Node.js default process metrics (event loop, memory, etc.)
 */
collectDefaultMetrics({ register: registry });

/**
 * Total number of events processed by the runtime FSM.
 */
export const eventsReceived = new Counter({
  name: "runtime_events_received_total",
  help: "Total number of events received",
  registers: [registry],
});

export const eventsFailed = new Counter({
  name: "runtime_events_failed_total",
  help: "Total number of events that failed processing",
  registers: [registry],
});

export const eventsDropped = new Counter({
  name: "runtime_events_dropped_total",
  help: "Total number of events dropped by backpressure",
  registers: [registry],
});

/**
 * Number of deduplicated events (filtered by DeduplicationFilter).
 */
export const dedupHits = new Counter({
  name: "runtime_dedup_hits_total",
  help: "Total number of deduplicated events",
  registers: [registry],
});

/**
 * Optional gauge placeholder for future runtime concurrency tracking.
 */
export const activeSessions = new Gauge({
  name: "runtime_active_sessions",
  help: "Number of active runtime sessions",
  registers: [registry],
});

/**
 * Snapshot size distribution (bytes).
 */
export const snapshotBytes = new Histogram({
  name: "runtime_snapshot_bytes",
  help: "Size of runtime snapshots in bytes",
  buckets: [64, 256, 1024, 4096, 16384, 65536, 262144, 1048576],
  registers: [registry],
});

/**
 * Total number of replay integrity validation failures.
 */
export const replayIntegrityFailures = new Counter({
  name: "runtime_replay_integrity_failures_total",
  help: "Total replay integrity validation failures",
  registers: [registry],
});

/**
 * Replay integrity failures broken down by reason.
 */
export const replayIntegrityFailuresByReason = new Counter({
  name: "runtime_replay_integrity_failures_by_reason_total",
  help: "Replay integrity failures by reason",
  labelNames: ["reason"],
  registers: [registry],
});

/**
 * Duration of replay integrity validation (ms).
 */
export const replayIntegrityValidationDuration = new Histogram({
  name: "runtime_replay_integrity_validation_ms",
  help: "Replay integrity validation duration in ms",
  buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000],
  registers: [registry],
});
export const fsmTransitionsTotal = new Counter({
  name: "runtime_fsm_transitions_total",
  help: "Total FSM transitions (live + replay)",
  labelNames: ["from", "to", "source"],
  registers: [registry],
});

export const fsmTransitionDuration = new Histogram({
  name: "runtime_fsm_transition_duration_ms",
  help: "FSM transition duration in ms",
  labelNames: ["source"],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000],
  registers: [registry],
});

// Validation related metrics
export const runtime_fsm_guard_rejections_total = new Counter({
  name: "runtime_fsm_guard_rejections_total",
  help: "Total FSM guard rejections",
  labelNames: ["guard"],
  registers: [registry],
});

// Removed to avoid conflict

export const runtime_replay_validations_total = new Counter({
  name: "runtime_replay_validations_total",
  help: "Total replay validation attempts",
  registers: [registry],
});

// Sprint A - Latency Histograms
export const runtime_guard_duration_ms = new Histogram({
  name: "runtime_guard_duration_ms",
  help: "Guard evaluation duration in ms",
  buckets: [0.1, 0.5, 1, 5, 10, 50, 100],
  registers: [registry],
});

export const runtime_backpressure_duration_ms = new Histogram({
  name: "runtime_backpressure_duration_ms",
  help: "Backpressure evaluation duration in ms",
  buckets: [0.1, 0.5, 1, 5, 10, 50, 100],
  registers: [registry],
});

export const runtime_circuit_duration_ms = new Histogram({
  name: "runtime_circuit_duration_ms",
  help: "Circuit breaker evaluation duration in ms",
  buckets: [0.1, 0.5, 1, 5, 10, 50, 100],
  registers: [registry],
});

export const runtime_validation_duration_ms = new Histogram({
  name: "runtime_validation_duration_ms",
  help: "Validation duration in ms",
  buckets: [0.1, 0.5, 1, 5, 10, 50, 100],
  registers: [registry],
});

export const runtime_orchestrator_duration_ms = new Histogram({
  name: "runtime_orchestrator_duration_ms",
  help: "Orchestrator duration in ms",
  buckets: [0.1, 0.5, 1, 5, 10, 50, 100, 500],
  registers: [registry],
});

// Sprint A - Memory Observability
export const runtime_memory_heap_used_bytes = new Gauge({
  name: "runtime_memory_heap_used_bytes",
  help: "Heap used bytes",
  registers: [registry],
});

export const runtime_memory_heap_total_bytes = new Gauge({
  name: "runtime_memory_heap_total_bytes",
  help: "Heap total bytes",
  registers: [registry],
});

export const runtime_memory_rss_bytes = new Gauge({
  name: "runtime_memory_rss_bytes",
  help: "RSS bytes",
  registers: [registry],
});

if (typeof process !== "undefined" && process.memoryUsage) {
  setInterval(() => {
    const mem = process.memoryUsage();
    runtime_memory_heap_used_bytes.set(mem.heapUsed);
    runtime_memory_heap_total_bytes.set(mem.heapTotal);
    runtime_memory_rss_bytes.set(mem.rss);
  }, 5000).unref();
}

// Sprint A - Backpressure Hardening
export const runtime_backpressure_queue_depth = new Gauge({
  name: "runtime_backpressure_queue_depth",
  help: "Backpressure queue depth",
  registers: [registry],
});

export const runtime_backpressure_queue_capacity = new Gauge({
  name: "runtime_backpressure_queue_capacity",
  help: "Backpressure queue capacity",
  registers: [registry],
});

export const runtime_backpressure_drop_total = new Counter({
  name: "runtime_backpressure_drop_total",
  help: "Total backpressure drops",
  registers: [registry],
});

// Sprint A - Circuit Breaker Hardening
export const runtime_circuit_open_total = new Counter({
  name: "runtime_circuit_open_total",
  help: "Total circuit breaker OPEN transitions",
  registers: [registry],
});

export const runtime_circuit_recovery_total = new Counter({
  name: "runtime_circuit_recovery_total",
  help: "Total circuit breaker recoveries (HALF_OPEN to CLOSED)",
  registers: [registry],
});

export const runtime_circuit_failures_total = new Counter({
  name: "runtime_circuit_failures_total",
  help: "Total circuit breaker failure triggers",
  registers: [registry],
});
