// @ts-nocheck
import { VoiceExecutionPlan } from "../voice/voice-contract.js";
import { TransportCommand } from "./transport-contract.js";

export function buildTransportCommands(plan: VoiceExecutionPlan): readonly TransportCommand[] {
  const commands: TransportCommand[] = [];

  if (plan.delayMs > 0) {
    commands.push({ type: "WAIT", ms: plan.delayMs });
  }

  if (plan.shouldInterrupt) {
    commands.push({ type: "INTERRUPT" });
  }

  if (plan.utterance && plan.utterance.trim().length > 0) {
    commands.push({
      type: "SPEAK",
      text: plan.utterance,
      speechRate: plan.speechRate,
    });
  }

  if (!plan.shouldPause) {
    commands.push({ type: "START_LISTENING" });
  } else {
    commands.push({ type: "STOP_LISTENING" });
  }

  return Object.freeze(commands);
}
