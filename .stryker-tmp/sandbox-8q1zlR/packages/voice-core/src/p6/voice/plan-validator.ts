// @ts-nocheck
import { VoiceExecutionPlan, VoicePlanValidationResult } from "./voice-contract.js";

const BOUNDS = {
  delayMs: { min: 0, max: 10000 },
  speechRate: { min: 0.5, max: 2.0 },
};

export function validateVoicePlan(plan: VoiceExecutionPlan): VoicePlanValidationResult {
  const errors: string[] = [];

  if (plan.version !== 1) {
    errors.push(`Invalid version: expected 1, got ${plan.version}`);
  }

  if (typeof plan.utterance !== "string") {
    errors.push("Invalid utterance: must be a string");
  }

  if (typeof plan.delayMs !== "number" || plan.delayMs < BOUNDS.delayMs.min || plan.delayMs > BOUNDS.delayMs.max) {
    errors.push(`Invalid delayMs: must be between ${BOUNDS.delayMs.min} and ${BOUNDS.delayMs.max}`);
  }

  if (typeof plan.speechRate !== "number" || plan.speechRate < BOUNDS.speechRate.min || plan.speechRate > BOUNDS.speechRate.max) {
    errors.push(`Invalid speechRate: must be between ${BOUNDS.speechRate.min} and ${BOUNDS.speechRate.max}`);
  }

  if (typeof plan.shouldInterrupt !== "boolean") {
    errors.push("Invalid shouldInterrupt: must be a boolean");
  }

  if (typeof plan.shouldPause !== "boolean") {
    errors.push("Invalid shouldPause: must be a boolean");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
