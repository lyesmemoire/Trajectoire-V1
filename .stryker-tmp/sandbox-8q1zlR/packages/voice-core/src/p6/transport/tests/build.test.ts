// @ts-nocheck
import { describe, it, expect } from "vitest";
import { buildTransportCommands } from "../command-builder.js";
import { VoiceExecutionPlan } from "../../voice/voice-contract.js";

describe("P6.3 - T1 & T2 Command Builder", () => {
  it("T1: should produce exactly the same commands for the same plan", () => {
    const plan: VoiceExecutionPlan = {
      version: 1,
      utterance: "Determinism test",
      delayMs: 300,
      speechRate: 1.0,
      shouldInterrupt: false,
      shouldPause: false,
    };

    const commands1 = buildTransportCommands(plan);
    const commands2 = buildTransportCommands(plan);

    expect(commands1).toEqual(commands2);
  });

  it("T2: should enforce strict ordering: WAIT -> INTERRUPT -> SPEAK -> START_LISTENING", () => {
    const plan: VoiceExecutionPlan = {
      version: 1,
      utterance: "Order test",
      delayMs: 500,
      speechRate: 1.2,
      shouldInterrupt: true,
      shouldPause: false,
    };

    const commands = buildTransportCommands(plan);

    expect(commands).toEqual([
      { type: "WAIT", ms: 500 },
      { type: "INTERRUPT" },
      { type: "SPEAK", text: "Order test", speechRate: 1.2 },
      { type: "START_LISTENING" },
    ]);
  });

  it("should replace START_LISTENING with STOP_LISTENING if shouldPause is true", () => {
    const plan: VoiceExecutionPlan = {
      version: 1,
      utterance: "Pause test",
      delayMs: 0,
      speechRate: 1.0,
      shouldInterrupt: false,
      shouldPause: true,
    };

    const commands = buildTransportCommands(plan);

    expect(commands).toEqual([
      { type: "SPEAK", text: "Pause test", speechRate: 1.0 },
      { type: "STOP_LISTENING" },
    ]);
  });
});
