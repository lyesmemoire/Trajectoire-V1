import { describe, it, expect } from "vitest";
import { beginTransaction } from "../begin-transaction";
import { applyTransaction } from "../apply-transaction";
import { commitTransaction } from "../commit-transaction";
import { applyEvents } from "../../execution-engine";
import { MindState, P5Event } from "../../execution-contract";

describe("transaction — X1: Atomicity & X3: Determinism", () => {
  const getState = (): MindState => ({
    trust: 0.5,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral",
  });

  const events: P5Event[] = [
    { type: "TRUST_DELTA", delta: 0.2 },
    { type: "SUSPICION_DELTA", delta: -0.1 },
    { type: "PRESSURE_DELTA", delta: 15 },
    { type: "EMOTION_SET", emotion: "engaged" },
  ];

  it("should commit all events atomically (X1)", () => {
    const state = getState();
    let tx = beginTransaction(state, 0);

    for (const event of events) {
      tx = applyTransaction(tx, event);
    }

    const result = commitTransaction(tx);

    // All events applied
    expect(result.appliedCount).toBe(4);

    // Result matches direct execution
    const directResult = applyEvents(state, events);
    expect(result.state).toEqual(directResult);
  });

  it("should produce identical results for identical transactions (X3)", () => {
    const state = getState();

    let txA = beginTransaction(state, 0);
    let txB = beginTransaction(state, 0);

    for (const event of events) {
      txA = applyTransaction(txA, event);
      txB = applyTransaction(txB, event);
    }

    const resultA = commitTransaction(txA);
    const resultB = commitTransaction(txB);

    expect(resultA).toEqual(resultB);
  });

  it("should commit an empty transaction to the initial state", () => {
    const state = getState();
    const tx = beginTransaction(state, 0);
    const result = commitTransaction(tx);

    expect(result.appliedCount).toBe(0);
    expect(result.state).toEqual(state);
  });

  it("should handle a single-event transaction", () => {
    const state = getState();
    let tx = beginTransaction(state, 0);
    tx = applyTransaction(tx, { type: "TRUST_DELTA", delta: 0.3 });

    const result = commitTransaction(tx);

    expect(result.appliedCount).toBe(1);
    expect(result.state.trust).toBeCloseTo(0.8, 5);
    expect(result.state.suspicion).toBe(0.5);
  });
});
