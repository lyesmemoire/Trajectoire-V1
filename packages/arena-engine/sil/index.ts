// SIL v1.0 — Canonical Entrypoint (Bridge)
// This file re-exports all public modules for external consumption.
// Zero logic change — pure re-export layer.

// === CONTRACTS ===
export * from "./contracts/event-store";
export * from "./contracts/sil-events";
export * from "./contracts/session-state";
export * from "./contracts/replay";
export * from "./contracts/query";
export * from "./contracts/observability";
export * from "./contracts/trace-graph";
export * from "./contracts/event-verifier";
export * from "./contracts/p6-runtime";
export * from "./contracts/p7-evaluator";
export * from "./contracts/runtime-trace-provider";
export * from "./contracts/session-registry";
export * from "./contracts/security-audit-store";
export * from "./contracts/tenant-key-manager";
export * from "./contracts/storage";
export * from "./contracts/structured-logger";
export * from "./contracts/wakeup-notifier";

// === CORE RUNTIME ===
export { SILRuntimeLoop } from "./core/runtime-loop";
export { RecoveryManager } from "./core/recovery-manager";
export { FailureController } from "./core/failure-controller";

// === STORAGE ===
export { MemoryEventStore } from "./services/memory-event-store";
export { PostgresEventStore } from "./services/store/postgres-event-store";
export { DualEventStore } from "./services/store/dual-event-store";
export { BatchedEventWriter } from "./services/store/batched-event-writer";

// === LEDGER ===
export { InMemoryMerkleLedgerWriter } from "./services/ledger/merkle-ledger";
export type { LedgerBatch, MerkleLedgerWriter } from "./services/ledger/merkle-ledger";
export type { MerkleLedgerReader } from "./services/ledger/merkle-ledger-reader";
export { PostgresMerkleLedgerReader } from "./services/ledger/postgres-ledger-reader";

// === REPLAY ===
export { ReplayEngine } from "./services/replay/replay-engine";

// === QUERY ===
export { DefaultEventQueryService } from "./services/query/event-query-service";

// === OBSERVABILITY ===
export { InMemoryObservabilityBus } from "./services/observability/in-memory-observability-bus";
export { TraceGraphBuilder } from "./services/observability/trace-graph-builder";

// === DISTRIBUTED ===
export { ShardRouter } from "./distributed/sharding/shard-router";
export { DistributedEventStore } from "./distributed/event-store/distributed-event-store";
export { GlobalEventIndex } from "./distributed/index/global-event-index";
export { FailoverManager } from "./distributed/failover/failover-manager";
export { ReplayCoordinator } from "./distributed/replay/replay-coordinator";
export { GlobalSessionRegistry } from "./distributed/session-registry";

// === INGESTOR ===
export { SILIngestor } from "./services/ingestor";

// === BOOTSTRAP ===
export { bootstrapEventStore, bootstrapReplayEngine } from "./bootstrap/container";
