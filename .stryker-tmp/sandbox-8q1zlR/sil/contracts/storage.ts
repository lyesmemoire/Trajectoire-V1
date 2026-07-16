// @ts-nocheck
import { SILState } from "./session-state";

/**
 * StorageTransaction provides transactional guarantees for cross-repository writes.
 */
export interface StorageTransaction {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * StorageAdapter provides the underlying persistence mechanism (InMemory, Postgres, etc.)
 * Repositories use the adapter rather than concrete DB drivers.
 */
export interface StorageAdapter {
  transaction(): Promise<StorageTransaction>;
  
  // Primitives for key-value or document storage. 
  saveRecord<T>(collection: string, tenantId: string, id: string, record: T, tx?: StorageTransaction): Promise<void>;
  loadRecord<T>(collection: string, tenantId: string, id: string): Promise<T | null>;
}

export interface SessionRecord {
  sessionId: string;
  tenantId: string;
  state: SILState;
  createdAt: number;
  updatedAt: number;
}

export interface CheckpointRecord {
  sessionId: string;
  tenantId: string;
  state: SILState;
  lastEventId: string;
  runtimePointer: number;
  eventHash: string;
  reportHash?: string;
  createdAt: string;
}

export interface TraceRecord {
  sessionId: string;
  tenantId: string;
  traceHash: string;
  tracePayload: any; 
}

export interface ReportRecord {
  reportId: string;
  sessionId: string;
  tenantId: string;
  reportHash: string;
  evaluationHash: string;
  reportPayload: any; 
}

// Repositories abstraction layer

export interface SessionRepository {
  save(tenantId: string, session: SessionRecord, tx?: StorageTransaction): Promise<void>;
  load(tenantId: string, sessionId: string): Promise<SessionRecord | null>;
}

export interface CheckpointRepository {
  save(tenantId: string, checkpoint: CheckpointRecord, tx?: StorageTransaction): Promise<void>;
  load(tenantId: string, sessionId: string): Promise<CheckpointRecord | null>;
}

export interface TraceRepository {
  save(tenantId: string, trace: TraceRecord, tx?: StorageTransaction): Promise<void>;
  load(tenantId: string, sessionId: string): Promise<TraceRecord | null>;
}

export interface ReportRepository {
  save(tenantId: string, report: ReportRecord, tx?: StorageTransaction): Promise<void>;
  load(tenantId: string, reportId: string): Promise<ReportRecord | null>;
}
