import { describe, it, expect } from "vitest";
import { validateDecision } from "../validation.js";
describe("validation — B3: No invalid events", () => {
    it("should accept a valid decision with all fields", () => {
        const result = validateDecision({
            trustDelta: 0.2,
            suspicionDelta: -0.1,
            pressureDelta: 10,
            emotion: "neutral",
        });
        expect(result.valid).toBe(true);
        expect(result.reasons).toEqual([]);
    });
    it("should accept an empty decision", () => {
        const result = validateDecision({});
        expect(result.valid).toBe(true);
    });
    it("should reject NaN in trustDelta", () => {
        const result = validateDecision({ trustDelta: NaN });
        expect(result.valid).toBe(false);
        expect(result.reasons).toHaveLength(1);
        expect(result.reasons[0]).toContain("trustDelta");
    });
    it("should reject Infinity in suspicionDelta", () => {
        const result = validateDecision({ suspicionDelta: Infinity });
        expect(result.valid).toBe(false);
        expect(result.reasons[0]).toContain("suspicionDelta");
    });
    it("should reject -Infinity in pressureDelta", () => {
        const result = validateDecision({ pressureDelta: -Infinity });
        expect(result.valid).toBe(false);
        expect(result.reasons[0]).toContain("pressureDelta");
    });
    it("should reject empty string emotion", () => {
        const result = validateDecision({ emotion: "" });
        expect(result.valid).toBe(false);
        expect(result.reasons[0]).toContain("emotion");
    });
    it("should collect multiple violations in a single decision", () => {
        const result = validateDecision({
            trustDelta: NaN,
            suspicionDelta: Infinity,
            pressureDelta: -Infinity,
            emotion: "",
        });
        expect(result.valid).toBe(false);
        expect(result.reasons).toHaveLength(4);
    });
    it("should accept zero deltas as valid", () => {
        const result = validateDecision({
            trustDelta: 0,
            suspicionDelta: 0,
            pressureDelta: 0,
        });
        expect(result.valid).toBe(true);
    });
    it("should accept negative deltas as valid", () => {
        const result = validateDecision({
            trustDelta: -0.5,
            pressureDelta: -50,
        });
        expect(result.valid).toBe(true);
    });
});
//# sourceMappingURL=validation.test.js.map