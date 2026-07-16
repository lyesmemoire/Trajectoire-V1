import { describe, it, expect } from "vitest";
import { LatencyTracker } from "../../src/telemetry/LatencyTracker.js";

describe("LatencyTracker", () => {
  it("should track phase start/end and return duration", () => {
    const tracker = new LatencyTracker();
    tracker.startPhase("llm");
    const duration = tracker.endPhase("llm");
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  it("should return null for unstarted phase", () => {
    const tracker = new LatencyTracker();
    expect(tracker.endPhase("unknown")).toBeNull();
  });

  it("should return last timing for a phase", () => {
    const tracker = new LatencyTracker();
    tracker.startPhase("stt");
    tracker.endPhase("stt");
    expect(tracker.getLastTiming("stt")).toBeGreaterThanOrEqual(0);
    expect(tracker.getLastTiming("nonexistent")).toBeNull();
  });

  it("should track round trip", () => {
    const tracker = new LatencyTracker();
    tracker.startRoundTrip();
    const rt = tracker.endRoundTrip();
    expect(rt).toBeGreaterThanOrEqual(0);
  });

  it("should return null for unstarted round trip", () => {
    const tracker = new LatencyTracker();
    expect(tracker.endRoundTrip()).toBeNull();
  });

  it("should reset all data", () => {
    const tracker = new LatencyTracker();
    tracker.startPhase("llm");
    tracker.endPhase("llm");
    tracker.reset();
    expect(tracker.getLastTiming("llm")).toBeNull();
    expect(tracker.allTimings).toHaveLength(0);
  });
});
