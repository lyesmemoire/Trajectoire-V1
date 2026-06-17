import { CheckpointRepository, CheckpointRecord, StorageAdapter, StorageTransaction } from "../../contracts/storage";

export class PostgresCheckpointRepository implements CheckpointRepository {
  constructor(private adapter: StorageAdapter) {}

  async save(tenantId: string, checkpoint: CheckpointRecord, tx?: StorageTransaction): Promise<void> {
    await this.adapter.saveRecord("checkpoints", tenantId, checkpoint.sessionId, checkpoint, tx);
  }

  async load(tenantId: string, sessionId: string): Promise<CheckpointRecord | null> {
    return this.adapter.loadRecord<CheckpointRecord>("checkpoints", tenantId, sessionId);
  }
}
