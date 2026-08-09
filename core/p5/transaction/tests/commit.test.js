import { describe, it, expect } from "vitest";
import { beginTransaction } from "../begin-transaction.js";
import { applyTransaction } from "../apply-transaction.js";
import { commitTransaction } from "../commit-transaction.js";
import { rollbackTransaction } from "../rollback-transaction.js";
describe("transaction — commit vs rollback", () => {
    const getState = () => ({
        trust: 0.4,
        suspicion: 0.6,
        pressure: 70,
        emotion: "tense",
    });
    it("should produce different states for commit vs rollback", () => {
        const state = getState();
        let tx = beginTransaction(state, 0);
        tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.3 });
        tx = applyTransaction(tx, { type: "PRESSURE_DELTA", delta: -20 });
        const committed = commitTransaction(tx).state;
        const rolledBack = rollbackTransaction(tx);
        // Committed state reflects changes
        expect(committed.trust).toBeCloseTo(0.7, 5);
        expect(committed.pressure).toBe(50);
        // Rolled back state is the original
        expect(rolledBack).toEqual(state);
        // They must differ
        expect(committed).not.toEqual(rolledBack);
    });
    it("should allow multiple commits of the same transaction (idempotent)", () => {
        const state = getState();
        let tx = beginTransaction(state, 0);
        tx = applyTransaction(tx, { type: "EMOTION_SET", emotion: "calm" });
        const a = commitTransaction(tx);
        const b = commitTransaction(tx);
        expect(a).toEqual(b);
    });
    it("should allow multiple rollbacks of the same transaction", () => {
        const state = getState();
        let tx = beginTransaction(state, 0);
        tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.5 });
        const a = rollbackTransaction(tx);
        const b = rollbackTransaction(tx);
        expect(a).toEqual(b);
        expect(a).toEqual(state);
    });
});
//# sourceMappingURL=commit.test.js.map