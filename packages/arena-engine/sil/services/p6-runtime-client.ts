import { ExecutionFacade } from "../../core/p5/integration/execution-facade";
import { P6RuntimeClient, RuntimeCommand, RuntimeResult } from "../contracts/p6-runtime";

export class RealP6RuntimeClient implements P6RuntimeClient {
  constructor(private readonly facade: ExecutionFacade) {}

  async startSession(command: RuntimeCommand): Promise<RuntimeResult> {
    try {
      // Create initial state for P6 session based on command
      const initialState = {
        agentId: "default",
        candidateId: "default",
        status: "IDLE" as const,
        memory: {},
        transcript: []
      };

      // In real scenario, timestamp comes from command
      this.facade.initSession(command.sessionId, initialState, Date.now());

      const session = this.facade.getSession(command.sessionId);
      if (!session) {
        throw new Error("Failed to initialize P6 session");
      }

      return {
        sessionId: command.sessionId,
        snapshotHash: session.initialSnapshot?.id || "snapshot-0",
        journalPointer: "0",
      };
    } catch (e: any) {
      throw new Error(`P6_START_FAILED: ${e.message}`);
    }
  }

  async processEvent(command: RuntimeCommand): Promise<RuntimeResult> {
    try {
      // In real scenario, payload is mapped to RuntimeDecision
      const decision = command.payload as any;
      const result = this.facade.execute(command.sessionId, decision, Date.now());

      if (!result) {
        throw new Error("ExecutionFacade returned null");
      }

      const session = this.facade.getSession(command.sessionId);
      if (!session) {
        throw new Error("Session lost during execution");
      }

      return {
        sessionId: command.sessionId,
        snapshotHash: session.initialSnapshot?.id || "snapshot-0", // TODO: proper snapshot hash later
        journalPointer: session.journal.entries.length.toString(),
      };
    } catch (e: any) {
      throw new Error(`P6_PROCESS_FAILED: ${e.message}`);
    }
  }

  async endSession(sessionId: string): Promise<RuntimeResult> {
    try {
      const session = this.facade.getSession(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      const snapshotHash = session.initialSnapshot?.id || "snapshot-0";
      const journalPointer = session.journal.entries.length.toString();

      const success = this.facade.destroySession(sessionId);
      if (!success) {
        throw new Error("Failed to destroy P6 session");
      }

      return {
        sessionId,
        snapshotHash,
        journalPointer,
      };
    } catch (e: any) {
      throw new Error(`P6_END_FAILED: ${e.message}`);
    }
  }
}
