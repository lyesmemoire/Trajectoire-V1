// @ts-nocheck
import { TraceRepository, TraceRecord, StorageAdapter, StorageTransaction } from "../../contracts/storage";

export class PostgresTraceRepository implements TraceRepository {
  constructor(private adapter: StorageAdapter) {}

  async save(tenantId: string, trace: TraceRecord, tx?: StorageTransaction): Promise<void> {
    await this.adapter.saveRecord("traces", tenantId, trace.sessionId, trace, tx);
  }

  async load(tenantId: string, sessionId: string): Promise<TraceRecord | null> {
    return this.adapter.loadRecord<TraceRecord>("traces", tenantId, sessionId);
  }
}
