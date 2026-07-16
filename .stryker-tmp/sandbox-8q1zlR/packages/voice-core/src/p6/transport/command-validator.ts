// @ts-nocheck
import { TransportCommand } from "./transport-contract.js";

export interface TransportCommandValidationResult {
  valid: boolean;
  errors: readonly string[];
}

export function validateTransportCommands(commands: readonly TransportCommand[]): TransportCommandValidationResult {
  const errors: string[] = [];

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];

    if (!cmd) {
      errors.push(`Command at index ${i} is undefined`);
      continue;
    }

    if (!cmd.type) {
      errors.push(`Command at index ${i} is missing 'type'`);
      continue;
    }

    switch (cmd.type) {
      case "WAIT": {
        const waitCmd = cmd as { type: "WAIT"; ms: number };
        if (typeof waitCmd.ms !== "number" || waitCmd.ms < 0) {
          errors.push(`WAIT command at index ${i} has invalid 'ms' (must be >= 0)`);
        }
        break;
      }

      case "SPEAK": {
        const speakCmd = cmd as { type: "SPEAK"; text: string; speechRate: number };
        if (typeof speakCmd.text !== "string" || speakCmd.text.trim().length === 0) {
          errors.push(`SPEAK command at index ${i} has invalid 'text' (must be non-empty string)`);
        }
        if (typeof speakCmd.speechRate !== "number" || speakCmd.speechRate < 0.5 || speakCmd.speechRate > 2.0) {
          errors.push(`SPEAK command at index ${i} has invalid 'speechRate' (must be between 0.5 and 2.0)`);
        }
        break;
      }

      case "INTERRUPT":
      case "START_LISTENING":
      case "STOP_LISTENING":
        // Valid types with no extra properties to validate
        break;

      default:
        //  cmd.type is unknown if not in union
        errors.push(`Command at index ${i} has unknown type: ${cmd.type}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
