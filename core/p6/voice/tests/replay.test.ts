import { describe, it, expect } from "vitest";
import { VoiceExecutionPlan } from "../voice-contract";
import { serializePlan, deserializePlan } from "../plan-replay";

describe("P6.2 - V4 Replay", () => {
  it("should perfectly replay a sequence of voice execution plans", () => {
    const sequence: VoiceExecutionPlan[] = [
      { version: 1, utterance: "One", delayMs: 100, speechRate: 1.0, shouldInterrupt: false, shouldPause: false },
      { version: 1, utterance: "Two", delayMs: 200, speechRate: 1.1, shouldInterrupt: true, shouldPause: false },
      { version: 1, utterance: "Three", delayMs: 50, speechRate: 0.9, shouldInterrupt: false, shouldPause: true }
    ];

    const stringifiedLog = sequence.map(serializePlan);

    const replayedSequence = stringifiedLog.map(deserializePlan);

    expect(replayedSequence).toEqual(sequence);
  });
});
