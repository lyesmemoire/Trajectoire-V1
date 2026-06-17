import { VoiceExecutionPlan } from "../voice/voice-contract";
import { TransportCommand } from "./transport-contract";
import { buildTransportCommands } from "./command-builder";

export function buildCommandBatch(plans: readonly VoiceExecutionPlan[]): readonly TransportCommand[] {
  const allCommands: TransportCommand[] = [];

  for (const plan of plans) {
    const commands = buildTransportCommands(plan);
    allCommands.push(...commands);
  }

  return Object.freeze(allCommands);
}
