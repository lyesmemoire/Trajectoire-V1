export interface Snapshot {
  tenantId: string;
  sessionId: string;
  lastSequence: number;
  state: any;
}

export interface SessionSnapshotStore {
  getSnapshot(tenantId: string, sessionId: string): Promise<Snapshot | null>;
  saveSnapshot(snapshot: Snapshot): Promise<void>;
}
