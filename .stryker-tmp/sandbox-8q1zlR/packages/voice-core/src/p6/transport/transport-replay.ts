// @ts-nocheck
import { TransportCommand } from "./transport-contract.js";
import { validateTransportCommands } from "./command-validator.js";

export function serializeCommands(commands: readonly TransportCommand[]): string {
  return JSON.stringify(commands);
}

export function deserializeCommands(data: string): readonly TransportCommand[] {
  const parsed = JSON.parse(data) as TransportCommand[];
  
  const validation = validateTransportCommands(parsed);
  if (!validation.valid) {
    throw new Error(`Invalid TransportCommand sequence: ${validation.errors.join(", ")}`);
  }
  
  return Object.freeze(parsed);
}

export function replayCommands(data: string): readonly TransportCommand[] {
  return deserializeCommands(data);
}
