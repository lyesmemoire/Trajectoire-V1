// @ts-nocheck
import { describe, test, expect } from "vitest";
import { selectNextMunition } from "./munition-selector.js";
import { createInitialState } from "../state.js";
import type { PressureMunition } from "../../../../../lib/ats/contracts/munitions.js";

const baseMunition: PressureMunition = {
  id: "test_1",
  category: "doubt",
  hook: "J'ai un doute",
  evidence: { field: "Exp", snippet: "dev" },
  severity: 0.8,
  pressureReady: true,
  confidence: 0.9,
};

describe("selectNextMunition", () => {
  test("returns null when not pressure phase", () => {
    const state = createInitialState({ munitions: [baseMunition] });
    const result = selectNextMunition({
      state,
      currentPhase: "intro",
      currentTurnNumber: 1,
    });
    expect(result).toBeNull();
  });

  test("prioritizes unused high-severity munitions", () => {
    const m1 = { ...baseMunition, id: "m1", severity: 0.5 };
    const m2 = { ...baseMunition, id: "m2", severity: 0.9 };
    const state = createInitialState({ munitions: [m1, m2] });
    
    const result = selectNextMunition({
      state,
      currentPhase: "pressure",
      currentTurnNumber: 2,
    });
    expect(result?.id).toBe("m2");
  });

  test("penalizes deflected munitions on retry", () => {
    const m1 = { ...baseMunition, id: "m1", severity: 0.8 };
    const m2 = { ...baseMunition, id: "m2", severity: 0.5 };
    const state = createInitialState({ munitions: [m1, m2] });
    // m1 was deflected once
    state.munitionsUsage = {
      m1: { firstUsedAtTurn: 1, attempts: 1, lastResponse: "deflected" },
    };
    
    // m1 score: 0.8*10 - 20*1 = 8 - 20 = -12
    // m2 score: 0.5*10 + 50 = 55
    const result = selectNextMunition({
      state,
      currentPhase: "pressure",
      currentTurnNumber: 2,
    });
    expect(result?.id).toBe("m2");
  });

  test("does not return engaged munitions", () => {
    const m1 = { ...baseMunition, id: "m1", severity: 0.9 };
    const state = createInitialState({ munitions: [m1] });
    state.munitionsUsage = {
      m1: { firstUsedAtTurn: 1, attempts: 1, lastResponse: "engaged" },
    };
    
    const result = selectNextMunition({
      state,
      currentPhase: "pressure",
      currentTurnNumber: 2,
    });
    // Score is negative, meaning we might still return it if it's the only one, wait, our logic returns if best.score > 0
    expect(result).toBeNull();
  });

  test("respects confidence threshold", () => {
    const m1 = { ...baseMunition, id: "m1", confidence: 0.6 };
    const state = createInitialState({ munitions: [m1] });
    
    const result = selectNextMunition({
      state,
      currentPhase: "pressure",
      currentTurnNumber: 2,
    });
    expect(result).toBeNull();
  });
});
