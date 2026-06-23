import { StorageAdapter, SessionRecord } from "../../contracts/storage";

export class RedisSessionCache {
  constructor(private adapter: StorageAdapter) {}

  async set(session: SessionRecord): Promise<void> {
    await this.adapter.saveRecord<SessionRecord>("cache_sessions", session.sessionId, session);
  }

  async get(sessionId: string): Promise<SessionRecord | null> {
    return this.adapter.loadRecord<SessionRecord>("cache_sessions", sessionId);
  }

  async delete(sessionId: string): Promise<void> {
    // In a real redis cache we'd DEL the key.
    // Since our simple adapter doesn't have a delete operation, we overwrite with null,
    // but our typing `saveRecord<T>` might complain. We can cast as any.
    await this.adapter.saveRecord<any>("cache_sessions", sessionId, null);
  }
}
