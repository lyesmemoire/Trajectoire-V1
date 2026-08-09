import { describe, it, expect } from "vitest";
import { beginTransaction } from "../begin-transaction.js";
import { applyTransaction } from "../apply-transaction.js";
import { commitTransaction } from "../commit-transaction.js";
import { verifyTransaction } from "../transaction-verifier.js";
describe("transaction-verifier — X5: Replay compatible", () => {
    const getState = () => ({
        trust: 0.5,
        suspicion: 0.5,
        pressure: 50,
        emotion: "neutral",
    });
    it("should verify a correctly committed transaction", () => {
        const state = getState();
        let tx = beginTransaction(state, 0);
        tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.2 });
        tx = applyTransaction(tx, { type: "PRESSURE_DELTA", delta: 10 });
        tx = applyTransaction(tx, { type: "EMOTION_SET", emotion: "happy" });
        const committed = commitTransaction(tx);
        const verification = verifyTransaction(tx, committed.state);
        expect(verification.valid).toBe(true);
        expect(verification.diff).toEqual([]);
    });
    it("should detect divergence when committed state is tampered", () => {
        const state = getState();
        let tx = beginTransaction(state, 0);
        tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.2 });
        const committed = commitTransaction(tx);
        // Tamper with the committed state
        const tampered = { ...committed.state, trust: 0.99 };
        const verification = verifyTransaction(tx, tampered);
        expect(verification.valid).toBe(false);
        expect(verification.diff).toContain("trust");
    });
    it("should detect multiple divergent fields", () => {
        const state = getState();
        let tx = beginTransaction(state, 0);
        tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.1 });
        const tampered = {
            trust: 0.99,
            suspicion: 0.99,
            pressure: 99,
            emotion: "wrong",
        };
        const verification = verifyTransaction(tx, tampered);
        expect(verification.valid).toBe(false);
        expect(verification.diff).toEqual(["trust", "suspicion", "pressure", "emotion"]);
    });
    it("should verify an empty transaction", () => {
        const state = getState();
        const tx = beginTransaction(state, 0);
        const committed = commitTransaction(tx);
        const verification = verifyTransaction(tx, committed.state);
        expect(verification.valid).toBe(true);
    });
});
//# sourceMappingURL=verifier.test.js.map