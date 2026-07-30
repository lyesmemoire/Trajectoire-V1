
import { VoiceExecutionPlan } from "../voice/voice-contract.js";
import { TransportCommand } from "./transport-contract.js";
import { buildTransportCommands } from "./command-builder.js";

export function buildCommandBatch(plans: readonly VoiceExecutionPlan[]): readonly TransportCommand[] {
  const allCommands: TransportCommand[] = [];

  for (const plan of plans) {
    const commands = buildTransportCommands(plan);
    allCommands.push(...commands);
  }

  return Object.freeze(allCommands);
}
