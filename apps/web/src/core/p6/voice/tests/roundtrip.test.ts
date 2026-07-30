
import { describe, it, expect } from "vitest";
import { serializePlan, deserializePlan } from "../plan-replay.js";
import { VoiceExecutionPlan } from "../voice-contract.js";

describe("P6.2 - V3 Roundtrip Serialization", () => {
  it("should successfully serialize and deserialize a valid plan", () => {
    const plan: VoiceExecutionPlan = {
      version: 1,
      utterance: "Testing serialization",
      delayMs: 1200,
      speechRate: 1.2,
      shouldInterrupt: true,
      shouldPause: false,
    };

    const serialized = serializePlan(plan);
    const deserialized = deserializePlan(serialized);

    expect(deserialized).toEqual(plan);
  });

  it("should throw on invalid deserialization data", () => {
    const badData = JSON.stringify({
      version: 2, // invalid version
      utterance: 123 // invalid type
    });

    expect(() => deserializePlan(badData)).toThrow(/Invalid VoiceExecutionPlan data/);
  });
});
