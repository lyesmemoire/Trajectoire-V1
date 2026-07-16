// @ts-nocheck
export interface RuntimeCommand {
  sessionId: string;
  tenantId: string;
  payload: unknown;
}

export interface RuntimeResult {
  sessionId: string;
  snapshotHash: string;
  journalPointer: string;
}

export interface P6RuntimeClient {
  startSession(
    command: RuntimeCommand
  ): Promise<RuntimeResult>;

  processEvent(
    command: RuntimeCommand
  ): Promise<RuntimeResult>;

  endSession(
    sessionId: string
  ): Promise<RuntimeResult>;
}
