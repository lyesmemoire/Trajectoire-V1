import { VoiceExecutionPlan } from "./voice-contract";
import { validateVoicePlan } from "./plan-validator";

export function serializePlan(plan: VoiceExecutionPlan): string {
  return JSON.stringify(plan);
}

export function deserializePlan(data: string): VoiceExecutionPlan {
  const plan = JSON.parse(data) as VoiceExecutionPlan;
  
  const validation = validateVoicePlan(plan);
  if (!validation.valid) {
    throw new Error(`Invalid VoiceExecutionPlan data: ${validation.errors.join(", ")}`);
  }
  
  return plan;
}
