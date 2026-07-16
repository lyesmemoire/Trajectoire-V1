// @ts-nocheck
import { Pool } from "pg";
import { MemoryEventStore } from "../services/memory-event-store";
import { PostgresEventStore } from "../services/store/postgres-event-store";
import { DualEventStore } from "../services/store/dual-event-store";
import { EventStore } from "../contracts/event-store";

import { InMemoryMerkleLedgerWriter } from "../services/ledger/merkle-ledger";
import { PostgresMerkleLedgerReader } from "../services/ledger/postgres-ledger-reader";
import { ReplayEngine } from "../services/replay/replay-engine";
import { DefaultEventQueryService } from "../services/query/event-query-service";
import { MockP7EvaluatorClient } from "../tests/mocks/mock-p7-evaluator-client";
import { MockRuntimeTraceProvider } from "../tests/mocks/mock-runtime-trace-provider";

export function bootstrapEventStore(): EventStore {
  const memoryStore = new MemoryEventStore();
  
  // Dummy pool for now
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/sil"
  });
  
  const postgresStore = new PostgresEventStore(pgPool);
  const ledger = new InMemoryMerkleLedgerWriter(postgresStore);

  const mode = process.env.STORE || "memory";

  if (mode === "postgres") {
    return postgresStore;
  }
  
  if (mode === "dual") {
    return new DualEventStore(memoryStore, postgresStore, ledger);
  }

  // Default: memory
  return memoryStore;
}

export function bootstrapReplayEngine(): ReplayEngine {
  const eventStore = bootstrapEventStore();
  
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/sil"
  });

  const ledgerReader =
    process.env.STORE === "postgres" || process.env.STORE === "dual"
      ? new PostgresMerkleLedgerReader(pgPool)
      : undefined;

  const queryService = new DefaultEventQueryService(eventStore as any);
  const p7 = new MockP7EvaluatorClient();
  const traceProvider = new MockRuntimeTraceProvider();

  return new ReplayEngine(queryService, p7, traceProvider, ledgerReader);
}
