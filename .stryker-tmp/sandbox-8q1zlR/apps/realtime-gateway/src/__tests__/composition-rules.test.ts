// @ts-nocheck
import { describe, it, expect } from "vitest";
import { applyCompositionRules } from "../voice-interview/core/simulation/governor/composition-rules.js";
import type { PerceptionUX } from "../voice-interview/core/simulation/perception-ux.js";

describe("composition-rules", () => {
  it("calm + persona RH + contradiction = ordre déterministe", () => {
    // ux initial très contradictoire
    const ux: PerceptionUX = {
      emotion: "calm",
      interruptionChance: 0.5,
      silenceProbability: 0.6,
      toneShift: 0.5,
    };
    
    // Le persona RH est appliqué
    const result = applyCompositionRules(ux, "RH");
    
    // Règle 1 (calm) -> interruptionChance max 0.1
    // Règle 2 (rh) -> interruptionChance max 0.15 (garde 0.1), toneShift max 0.3
    // Règle 3 (contradiction) -> ne devrait pas se déclencher car interruptionChance est à 0.1 (< 0.2)
    
    expect(result.interruptionChance).toBeLessThanOrEqual(0.1);
    expect(result.toneShift).toBeLessThanOrEqual(0.3);
  });
});
