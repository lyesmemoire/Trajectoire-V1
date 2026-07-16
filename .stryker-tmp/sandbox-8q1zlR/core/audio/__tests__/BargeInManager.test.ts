/**
 * Unit Tests for Barge-In Manager
 */
// @ts-nocheck


import { BargeInManagerImpl } from "../BargeInManager";
import { BargeInConfiguration } from "../VADConfiguration";
import { AudioOutputAdapter } from "../AudioOutputAdapter";

// Mock AudioOutputAdapter
class MockAudioOutputAdapter implements AudioOutputAdapter {
  async startPlayback(): Promise<void> {}
  async stopPlayback(): Promise<void> {}
  async pausePlayback(): Promise<void> {}
  async resumePlayback(): Promise<void> {}
  async playChunk(): Promise<void> {}
  getState() { return "Playing"; }
  subscribeToEvents() {}
}

describe("BargeInManager", () => {
  let manager: BargeInManagerImpl;
  let mockConfig: BargeInConfiguration;
  let mockAdapter: AudioOutputAdapter;

  beforeEach(() => {
    mockConfig = {
      enabled: true,
      interruptionDelay: 100,
      resumeDelay: 300,
      maxInterruptions: 10,
      interruptionCooldown: 1000
    };
    manager = new BargeInManagerImpl(mockConfig);
    mockAdapter = new MockAudioOutputAdapter();
  });

  test("should start monitoring successfully", () => {
    manager.startMonitoring(mockAdapter);
    expect(manager.getState()).toBe("Monitoring");
  });

  test("should trigger interruption when enabled", async () => {
    manager.startMonitoring(mockAdapter);
    await manager.triggerInterruption();
    expect(manager.getState()).toBe("Interrupted");
  });

  test("should not trigger interruption when disabled", async () => {
    const disabledConfig = { ...mockConfig, enabled: false };
    const disabledManager = new BargeInManagerImpl(disabledConfig);
    disabledManager.startMonitoring(mockAdapter);
    
    await disabledManager.triggerInterruption();
    expect(disabledManager.getState()).toBe("Monitoring");
  });

  test("should respect cooldown period", async () => {
    manager.startMonitoring(mockAdapter);
    await manager.triggerInterruption();
    
    // Try to interrupt again immediately (should be in cooldown)
    await manager.triggerInterruption();
    expect(manager.getInterruptionCount()).toBe(1);
  });

  test("should resume playback successfully", async () => {
    manager.startMonitoring(mockAdapter);
    await manager.triggerInterruption();
    await manager.resumePlayback();
    expect(manager.getState()).toBe("Monitoring");
  });

  test("should stop monitoring successfully", () => {
    manager.startMonitoring(mockAdapter);
    manager.stopMonitoring();
    expect(manager.getState()).toBe("Idle");
  });

  test("should track interruption count", async () => {
    manager.startMonitoring(mockAdapter);
    await manager.triggerInterruption();
    expect(manager.getInterruptionCount()).toBe(1);
  });
});
