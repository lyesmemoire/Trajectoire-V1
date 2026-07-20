import { describe, it, expect } from "vitest";
import { verifyReplay } from "../replay-verifier.js";
import { MindState } from "../../execution-contract.js";

describe("replay-verifier — J5: Verification", () => {
  it("should report valid when states are identical", () => {
    const state: MindState = {
      trust: 0.6,
      suspicion: 0.4,
      pressure: 55,
      emotion: "focused",
    };

    const result = verifyReplay(state, { ...state });
    expect(result.valid).toBe(true);
    expect(result.diff).toEqual([]);
  });

  it("should detect trust divergence", () => {
    const original: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral",
    };
    const replayed: MindState = { ...original, trust: 0.51 };

    const result = verifyReplay(original, replayed);
    expect(result.valid).toBe(false);
    expect(result.diff).toEqual(["trust"]);
  });

  it("should detect suspicion divergence", () => {
    const original: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral",
    };
    const replayed: MindState = { ...original, suspicion: 0.49 };

    const result = verifyReplay(original, replayed);
    expect(result.valid).toBe(false);
    expect(result.diff).toEqual(["suspicion"]);
  });

  it("should detect pressure divergence", () => {
    const original: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral",
    };
    const replayed: MindState = { ...original, pressure: 51 };

    const result = verifyReplay(original, replayed);
    expect(result.valid).toBe(false);
    expect(result.diff).toEqual(["pressure"]);
  });

  it("should detect emotion divergence", () => {
    const original: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral",
    };
    const replayed: MindState = { ...original, emotion: "stressed" };

    const result = verifyReplay(original, replayed);
    expect(result.valid).toBe(false);
    expect(result.diff).toEqual(["emotion"]);
  });

  it("should report all divergent fields at once", () => {
    const original: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral",
    };
    const replayed: MindState = {
      trust: 0.6,
      suspicion: 0.4,
      pressure: 60,
      emotion: "stressed",
    };

    const result = verifyReplay(original, replayed);
    expect(result.valid).toBe(false);
    expect(result.diff).toEqual(["trust", "suspicion", "pressure", "emotion"]);
  });
});
