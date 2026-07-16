// @ts-nocheck
import { SILEvent } from "./sil-events";
import { SILCheckpoint } from "./session-state";

export interface EventStore {
  append(event: SILEvent): Promise<void>;
  
  // Queries
  readAll(tenantId: string, sessionId: string): Promise<SILEvent[]>;
  readAfter(tenantId: string, sessionId: string, pointer: number): Promise<SILEvent[]>;
  hasEvent(tenantId: string, sessionId: string, eventId: string): Promise<boolean>;

  // Checkpointing
  getCheckpoint(tenantId: string, sessionId: string): Promise<SILCheckpoint | null>;
  saveCheckpoint(tenantId: string, checkpoint: SILCheckpoint): Promise<void>;
}
