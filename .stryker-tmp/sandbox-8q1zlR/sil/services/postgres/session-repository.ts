// @ts-nocheck
import { SessionRepository, SessionRecord, StorageAdapter, StorageTransaction } from "../../contracts/storage";

export class PostgresSessionRepository implements SessionRepository {
  constructor(private adapter: StorageAdapter) {}

  async save(tenantId: string, session: SessionRecord, tx?: StorageTransaction): Promise<void> {
    await this.adapter.saveRecord("sessions", tenantId, session.sessionId, session, tx);
  }

  async load(tenantId: string, sessionId: string): Promise<SessionRecord | null> {
    return this.adapter.loadRecord<SessionRecord>("sessions", tenantId, sessionId);
  }
}
