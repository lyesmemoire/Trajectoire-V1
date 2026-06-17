import { describe, it, expect } from "vitest";
import { createSnapshot } from "../create-snapshot";
import { snapshotHash } from "../snapshot-hash";
import { MindState } from "../../execution-contract";

describe("snapshot — S3: Hash stable", () => {
  it("should produce the same hash for identical states", () => {
    const state: MindState = {
      trust: 0.5,
      suspicion: 0.3,
      pressure: 40,
      emotion: "neutral",
    };

    const snapA = createSnapshot(state, 1000);
    const snapB = createSnapshot(state, 2000); // different timestamp

    expect(snapshotHash(snapA)).toBe(snapshotHash(snapB));
  });

  it("should produce consistent hash across multiple calls", () => {
    const snap = createSnapshot(
      { trust: 0.8, suspicion: 0.1, pressure: 20, emotion: "happy" },
      100,
    );

    const h1 = snapshotHash(snap);
    const h2 = snapshotHash(snap);
    const h3 = snapshotHash(snap);

    expect(h1).toBe(h2);
    expect(h2).toBe(h3);
  });

  it("should return a 64-character hex string (SHA-256)", () => {
    const snap = createSnapshot(
      { trust: 0.5, suspicion: 0.5, pressure: 50, emotion: "neutral" },
      0,
    );

    const hash = snapshotHash(snap);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("snapshot — S4: Hash sensible", () => {
  const baseState: MindState = {
    trust: 0.5,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral",
  };

  it("should produce different hash when trust changes by 0.01", () => {
    const a = createSnapshot(baseState, 0);
    const b = createSnapshot({ ...baseState, trust: 0.51 }, 0);

    expect(snapshotHash(a)).not.toBe(snapshotHash(b));
  });

  it("should produce different hash when suspicion changes", () => {
    const a = createSnapshot(baseState, 0);
    const b = createSnapshot({ ...baseState, suspicion: 0.49 }, 0);

    expect(snapshotHash(a)).not.toBe(snapshotHash(b));
  });

  it("should produce different hash when pressure changes", () => {
    const a = createSnapshot(baseState, 0);
    const b = createSnapshot({ ...baseState, pressure: 51 }, 0);

    expect(snapshotHash(a)).not.toBe(snapshotHash(b));
  });

  it("should produce different hash when emotion changes", () => {
    const a = createSnapshot(baseState, 0);
    const b = createSnapshot({ ...baseState, emotion: "stressed" }, 0);

    expect(snapshotHash(a)).not.toBe(snapshotHash(b));
  });

  it("should NOT be affected by timestamp differences", () => {
    const a = createSnapshot(baseState, 0);
    const b = createSnapshot(baseState, 999999);

    expect(snapshotHash(a)).toBe(snapshotHash(b));
  });
});
