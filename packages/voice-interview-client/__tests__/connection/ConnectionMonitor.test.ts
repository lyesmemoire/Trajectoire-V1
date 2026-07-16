import { describe, it, expect } from "vitest";
import { ConnectionMonitor } from "../../src/connection/ConnectionMonitor.js";

describe("ConnectionMonitor", () => {
  it("should compute latency from ping/pong", () => {
    const monitor = new ConnectionMonitor();
    monitor.recordPingSent();

    // Simulate small delay
    const latency = monitor.recordPongReceived();
    expect(latency).toBeGreaterThanOrEqual(0);
    expect(monitor.lastLatencyMs).toBe(latency);
  });

  it("should compute average latency", () => {
    const monitor = new ConnectionMonitor();

    // Manually inject timings by calling ping/pong rapidly
    for (let i = 0; i < 5; i++) {
      monitor.recordPingSent();
      monitor.recordPongReceived();
    }

    expect(monitor.averageLatencyMs).toBeGreaterThanOrEqual(0);
  });

  it("should return null when no data exists", () => {
    const monitor = new ConnectionMonitor();
    expect(monitor.averageLatencyMs).toBeNull();
    expect(monitor.jitterMs).toBeNull();
    expect(monitor.lastLatencyMs).toBeNull();
  });

  it("should report quality as disconnected when no data", () => {
    const monitor = new ConnectionMonitor();
    expect(monitor.quality).toBe("disconnected");
  });

  it("should reset all data", () => {
    const monitor = new ConnectionMonitor();
    monitor.recordPingSent();
    monitor.recordPongReceived();
    monitor.reset();
    expect(monitor.averageLatencyMs).toBeNull();
  });
});
