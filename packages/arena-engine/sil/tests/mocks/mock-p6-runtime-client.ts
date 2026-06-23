import { P6RuntimeClient, RuntimeCommand, RuntimeResult } from "../../contracts/p6-runtime";

export class MockP6RuntimeClient implements P6RuntimeClient {
  async startSession(command: RuntimeCommand): Promise<RuntimeResult> {
    return {
      sessionId: command.sessionId,
      snapshotHash: "mock-start-hash",
      journalPointer: "0",
    };
  }

  async processEvent(command: RuntimeCommand): Promise<RuntimeResult> {
    return {
      sessionId: command.sessionId,
      snapshotHash: "mock-process-hash",
      journalPointer: "1",
    };
  }

  async endSession(sessionId: string): Promise<RuntimeResult> {
    return {
      sessionId,
      snapshotHash: "mock-end-hash",
      journalPointer: "2",
    };
  }
}
