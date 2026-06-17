import { describe, it, expect } from "vitest";
import { createSnapshot } from "../create-snapshot";
import { restoreSnapshot } from "../restore-snapshot";
import { MindState } from "../../execution-contract";

describe("snapshot — S1: Roundtrip", () => {
  const getState = (): MindState => ({
    trust: 0.72,
    suspicion: 0.15,
    pressure: 63,
    emotion: "focused",
  });

  it("should restore an identical state from a snapshot", () => {
    const state = getState();
    const snapshot = createSnapshot(state, 1000);
    const restored = restoreSnapshot(snapshot);

    expect(restored).toEqual(state);
  });

  it("should preserve all field values through roundtrip", () => {
    const state: MindState = {
      trust: 0,
      suspicion: 1,
      pressure: 100,
      emotion: "extreme",
    };

    const restored = restoreSnapshot(createSnapshot(state, 0));

    expect(restored.trust).toBe(0);
    expect(restored.suspicion).toBe(1);
    expect(restored.pressure).toBe(100);
    expect(restored.emotion).toBe("extreme");
  });

  it("should roundtrip with boundary values", () => {
    const state: MindState = {
      trust: 0,
      suspicion: 0,
      pressure: 0,
      emotion: "neutral",
    };

    const restored = restoreSnapshot(createSnapshot(state, 999));
    expect(restored).toEqual(state);
  });

  it("should set version to 1", () => {
    const snapshot = createSnapshot(getState(), 42);
    expect(snapshot.version).toBe(1);
  });

  it("should preserve the injected timestamp", () => {
    const snapshot = createSnapshot(getState(), 1717632000);
    expect(snapshot.timestamp).toBe(1717632000);
  });
});
