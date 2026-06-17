import { describe, it, expect } from "vitest";
import { beginTransaction } from "../begin-transaction";
import { applyTransaction } from "../apply-transaction";
import { rollbackTransaction } from "../rollback-transaction";
import { MindState } from "../../execution-contract";

describe("transaction — X2: Rollback exact & X4: Isolation", () => {
  const getState = (): MindState => ({
    trust: 0.5,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral",
  });

  it("should rollback to the exact initial state (X2)", () => {
    const state = getState();
    let tx = beginTransaction(state, 0);

    tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.3 });
    tx = applyTransaction(tx, { type: "PRESSURE_DELTA", delta: 30 });
    tx = applyTransaction(tx, { type: "EMOTION_SET", emotion: "corrupted" });

    const rolled = rollbackTransaction(tx);
    expect(rolled).toEqual(state);
  });

  it("should not mutate the original state during transaction (X4)", () => {
    const state = getState();
    Object.freeze(state);

    let tx = beginTransaction(state, 0);
    tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.5 });
    tx = applyTransaction(tx, { type: "EMOTION_SET", emotion: "changed" });

    // Original state unchanged
    expect(state.trust).toBe(0.5);
    expect(state.emotion).toBe("neutral");
  });

  it("should not mutate the transaction object on apply (X4)", () => {
    const state = getState();
    const tx0 = beginTransaction(state, 0);
    const tx1 = applyTransaction(tx0, { type: "TRUST_DELTA", delta: 0.1 });

    // Original transaction untouched
    expect(tx0.events).toHaveLength(0);
    expect(tx1.events).toHaveLength(1);
  });

  it("should rollback an empty transaction to initial state", () => {
    const state = getState();
    const tx = beginTransaction(state, 0);
    const rolled = rollbackTransaction(tx);

    expect(rolled).toEqual(state);
  });

  it("should produce independent rollback and commit states", () => {
    const state = getState();
    let tx = beginTransaction(state, 0);
    tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.2 });

    const rolled = rollbackTransaction(tx);

    // Mutating rolled should not affect anything
    rolled.trust = 999;

    // A fresh rollback should still be clean
    const rolled2 = rollbackTransaction(tx);
    expect(rolled2).toEqual(state);
  });
});
