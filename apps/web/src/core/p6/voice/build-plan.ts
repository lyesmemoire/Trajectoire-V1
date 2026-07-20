import { VoiceInput, VoiceExecutionPlan } from "./voice-contract.js";
import { clampVoicePlan } from "./clamp-plan.js";

export function buildVoicePlan(input: VoiceInput): VoiceExecutionPlan {
  const shouldInterrupt = input.interruptionChance > 0.5;
  const shouldPause = input.silenceProbability > 0.5;

  const rawPlan: VoiceExecutionPlan = {
    version: 1,
    utterance: input.text,
    delayMs: input.delayMs,
    speechRate: input.speechRate,
    shouldInterrupt,
    shouldPause,
  };

  return clampVoicePlan(rawPlan);
}
