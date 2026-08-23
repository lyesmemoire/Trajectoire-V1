import { SessionLifecycleState } from "../lifecycle/lifecycle-contract.js";
import { MindState } from "@trajectoire/execution-core/execution-contract";
import { RuntimeDecision } from "@trajectoire/execution-core/integration/integration-contract";
import { VoiceExecutionPlan, VoiceInput } from "../voice/voice-contract.js";
import { TransportCommand } from "../transport/transport-contract.js";
import { CandidateMessage } from "../types.js";

export interface RuntimeContext {
  sessionId: string;
  timestamp: number;
}

export interface RuntimeStepResult {
  sessionId: string;
  timestamp: number;
  lifecycle: SessionLifecycleState;
  state: MindState;
  decision: RuntimeDecision;
  voicePlan: VoiceExecutionPlan;
  commands: readonly TransportCommand[];
}

export interface RuntimeStepFailure {
  sessionId: string;
  reason:
    | "SESSION_NOT_FOUND"
    | "SESSION_NOT_ACTIVE"
    | "LIFECYCLE_ERROR"
    | "EXECUTION_ERROR";
}

export type OrchestratorResult = 
  | { ok: true; value: RuntimeStepResult }
  | { ok: false; reason: RuntimeStepFailure["reason"]; sessionId: string };

export interface VoiceUXCalculator {
  calculateUX(state: MindState, decision: RuntimeDecision, message: CandidateMessage): VoiceInput;
}
