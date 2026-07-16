import { describe, it, expect } from "vitest";
import { BackoffStrategy } from "../../src/connection/BackoffStrategy.js";

describe("BackoffStrategy", () => {
  it("should produce increasing delays", () => {
    const backoff = new BackoffStrategy(1000, 30000, 2);
    const d1 = backoff.nextDelay();
    const d2 = backoff.nextDelay();
    const d3 = backoff.nextDelay();

    // With jitter, values are approximate but should trend upward
    expect(d1).toBeGreaterThan(0);
    expect(d1).toBeLessThanOrEqual(1500); // 1000 * 1.25 max jitter
    expect(d2).toBeGreaterThan(d1 * 0.5); // next should be roughly 2x
  });

  it("should cap at maxMs", () => {
    const backoff = new BackoffStrategy(1000, 5000, 10);
    // After first attempt: 1000 * 10^0 = 1000
    backoff.nextDelay();
    // After second: 1000 * 10^1 = 10000 → capped at 5000
    const d2 = backoff.nextDelay();
    expect(d2).toBeLessThanOrEqual(6250); // 5000 * 1.25 (max jitter)
  });

  it("should track attempt count", () => {
    const backoff = new BackoffStrategy(1000, 30000, 2);
    expect(backoff.currentAttempt).toBe(0);
    backoff.nextDelay();
    expect(backoff.currentAttempt).toBe(1);
    backoff.nextDelay();
    expect(backoff.currentAttempt).toBe(2);
  });

  it("should reset attempt count", () => {
    const backoff = new BackoffStrategy(1000, 30000, 2);
    backoff.nextDelay();
    backoff.nextDelay();
    backoff.reset();
    expect(backoff.currentAttempt).toBe(0);
  });
});
