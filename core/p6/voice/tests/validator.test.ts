import { describe, it, expect } from "vitest";
import { validateVoicePlan } from "../plan-validator";
import { VoiceExecutionPlan } from "../voice-contract";
import { clampVoicePlan } from "../clamp-plan";

describe("P6.2 - V2 Validation and Clamp", () => {
  const validPlan: VoiceExecutionPlan = {
    version: 1,
    utterance: "Valid",
    delayMs: 1000,
    speechRate: 1.0,
    shouldInterrupt: false,
    shouldPause: false,
  };

  it("should validate a correct plan", () => {
    const result = validateVoicePlan(validPlan);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should invalidate plans with out of bounds values", () => {
    const badDelay = { ...validPlan, delayMs: -10 };
    expect(validateVoicePlan(badDelay).valid).toBe(false);

    const badSpeechRate = { ...validPlan, speechRate: 3.0 };
    expect(validateVoicePlan(badSpeechRate).valid).toBe(false);
  });

  it("should clamp values into valid bounds", () => {
    const rawPlan: VoiceExecutionPlan = {
      ...validPlan,
      delayMs: -500, // should clamp to 0
      speechRate: 5.0, // should clamp to 2.0
    };

    const clamped = clampVoicePlan(rawPlan);
    
    expect(clamped.delayMs).toBe(0);
    expect(clamped.speechRate).toBe(2.0);
    
    // The clamped plan should now be valid
    expect(validateVoicePlan(clamped).valid).toBe(true);
  });
});
