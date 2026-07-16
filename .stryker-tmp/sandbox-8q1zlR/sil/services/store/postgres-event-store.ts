// @ts-nocheck
import { Pool } from "pg";
import { EventStore } from "../../contracts/event-store";
import { SILEvent } from "../../contracts/sil-events";
import { SILCheckpoint } from "../../contracts/session-state";

export class PostgresEventStore implements EventStore {
  constructor(private pool: Pool) {}

  async append(event: SILEvent): Promise<void> {
    await this.pool.query(
      `
      INSERT INTO events (
        tenant_id,
        session_id,
        event_id,
        sequence,
        type,
        payload,
        hash,
        previous_hash,
        created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (tenant_id, session_id, event_id) DO NOTHING
      `,
      [
        event.tenantId,
        event.sessionId,
        event.eventId,
        (event as any).sequence ?? 0, // Using index sequence if present
        event.type,
        JSON.stringify(event.payload),
        event.hash,
        event.previousEventHash,
        event.timestamp ? new Date(event.timestamp) : new Date(),
      ]
    );
  }

  async bulkInsert(events: SILEvent[]) {
    if (events.length === 0) return;

    const values = events.map(e => [
      e.tenantId,
      e.sessionId,
      e.eventId,
      (e as any).sequence ?? 0,
      e.type,
      JSON.stringify(e.payload),
      e.hash,
      e.previousEventHash
    ]);

    await this.pool.query(
      `INSERT INTO events (
        tenant_id, session_id, event_id,
        sequence, type, payload, hash, previous_hash, created_at
      ) SELECT * FROM UNNEST($1::text[][]) ON CONFLICT DO NOTHING`,
      [values]
    );
  }

  async readAll(tenantId: string, sessionId: string): Promise<SILEvent[]> {
    const res = await this.pool.query(
      `
      SELECT * FROM events
      WHERE tenant_id = $1 AND session_id = $2
      ORDER BY sequence ASC
      `,
      [tenantId, sessionId]
    );
    return res.rows.map(this.mapRow);
  }

  async readAfter(
    tenantId: string,
    sessionId: string,
    afterSequence: number
  ): Promise<SILEvent[]> {
    const res = await this.pool.query(
      `
      SELECT * FROM events
      WHERE tenant_id = $1
        AND session_id = $2
        AND sequence > $3
      ORDER BY sequence ASC
      `,
      [tenantId, sessionId, afterSequence]
    );
    return res.rows.map(this.mapRow);
  }

  async getLastEvent(
    tenantId: string,
    sessionId: string
  ): Promise<SILEvent | null> {
    const res = await this.pool.query(
      `
      SELECT * FROM events
      WHERE tenant_id = $1 AND session_id = $2
      ORDER BY sequence DESC
      LIMIT 1
      `,
      [tenantId, sessionId]
    );
    return res.rows[0] ? this.mapRow(res.rows[0]) : null;
  }

  async hasEvent(tenantId: string, sessionId: string, eventId: string): Promise<boolean> {
    const res = await this.pool.query(
      `
      SELECT 1 FROM events
      WHERE tenant_id = $1 AND session_id = $2 AND event_id = $3
      LIMIT 1
      `,
      [tenantId, sessionId, eventId]
    );
    return res.rows.length > 0;
  }

  async getCheckpoint(tenantId: string, sessionId: string): Promise<SILCheckpoint | null> {
    // For now, checkpoints are handled by CheckpointRepository in Postgres.
    // If EventStore also requires them, we can implement it. 
    // In our architecture, checkpointing is currently split out in PostgresCheckpointRepository.
    return null; 
  }

  async saveCheckpoint(tenantId: string, checkpoint: SILCheckpoint): Promise<void> {
    // Handled by PostgresCheckpointRepository
  }

  private mapRow(row: any): SILEvent {
    return {
      tenantId: row.tenant_id,
      sessionId: row.session_id,
      eventId: row.event_id,
      type: row.type,
      payload: typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload,
      hash: row.hash,
      previousEventHash: row.previous_hash,
      timestamp: row.created_at.getTime(),
      signature: "", // stored at ingestion layer only
    };
  }
}
