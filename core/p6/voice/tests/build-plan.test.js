import { describe, it, expect } from "vitest";
import { buildVoicePlan } from "../build-plan.js";
describe("P6.2 - V1 Determinism", () => {
    it("should produce exactly the same plan for the same input", () => {
        const input = {
            text: "Hello",
            delayMs: 150,
            speechRate: 1.0,
            interruptionChance: 0.1,
            silenceProbability: 0.2,
        };
        const plan1 = buildVoicePlan(input);
        const plan2 = buildVoicePlan(input);
        expect(plan1).toEqual(plan2);
        expect(plan1).toStrictEqual({
            version: 1,
            utterance: "Hello",
            delayMs: 150,
            speechRate: 1.0,
            shouldInterrupt: false,
            shouldPause: false,
        });
    });
    it("should determine interruption and pause deterministically based on thresholds", () => {
        const input = {
            text: "Stop",
            delayMs: 0,
            speechRate: 1.0,
            interruptionChance: 0.9,
            silenceProbability: 0.8,
        };
        const plan = buildVoicePlan(input);
        expect(plan.shouldInterrupt).toBe(true);
        expect(plan.shouldPause).toBe(true);
    });
});
//# sourceMappingURL=build-plan.test.js.map