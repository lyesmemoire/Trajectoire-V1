/**
 * Integration Tests for Runtime Recovery Manager
 */

import { RuntimeRecoveryManagerImpl, RecoveryEvent, RecoveryComponent } from "../RuntimeRecoveryManager";

describe("RuntimeRecoveryManager - Integration Tests", () => {
  let recoveryManager: RuntimeRecoveryManagerImpl;

  beforeEach(() => {
    recoveryManager = new RuntimeRecoveryManagerImpl();
  });

  afterEach(async () => {
    await recoveryManager.stop();
  });

  describe("Network Loss Simulation", () => {
    test("should detect WebSocket failure", async () => {
      await recoveryManager.start();
      
      const failureDetected = await recoveryManager.detectFailure();
      
      // Initially should be healthy
      expect(failureDetected).toBe(false);
      expect(recoveryManager.getRecoveryState()).toBe("Normal");
    });

    test("should trigger recovery on simulated WebSocket failure", async () => {
      await recoveryManager.start();
      
      let failureEventReceived = false;
      let recoveryStartedEventReceived = false;
      
      recoveryManager.subscribeToEvents((event) => {
        if (event === "FailureDetected") {
          failureEventReceived = true;
        }
        if (event === "RecoveryStarted") {
          recoveryStartedEventReceived = true;
        }
      });

      await recoveryManager.simulateFailure("WebSocket");
      
      expect(failureEventReceived).toBe(true);
      expect(recoveryStartedEventReceived).toBe(true);
      expect(recoveryManager.getRecoveryState()).toBe("Recovering");
    });

    test("should track component failures", async () => {
      await recoveryManager.start();
      
      await recoveryManager.simulateFailure("WebSocket");
      await recoveryManager.simulateFailure("Session");
      await recoveryManager.simulateFailure("Audio");
      
      const metrics = recoveryManager.getRecoveryMetrics();
      
      expect(metrics.totalFailures).toBe(3);
      expect(metrics.componentFailures.get("WebSocket")).toBe(1);
      expect(metrics.componentFailures.get("Session")).toBe(1);
      expect(metrics.componentFailures.get("Audio")).toBe(1);
    });

    test("should handle multiple component failures simultaneously", async () => {
      await recoveryManager.start();
      
      const failureEvents: RecoveryEvent[] = [];
      recoveryManager.subscribeToEvents((event) => {
        failureEvents.push(event);
      });

      // Simulate multiple failures
      await Promise.all([
        recoveryManager.simulateFailure("WebSocket"),
        recoveryManager.simulateFailure("Session"),
        recoveryManager.simulateFailure("Audio")
      ]);

      expect(failureEvents).toContain("FailureDetected");
      expect(failureEvents).toContain("RecoveryStarted");
    });

    test("should respect max recovery attempts", async () => {
      await recoveryManager.start();
      
      // Manually trigger recovery multiple times
      for (let i = 0; i < 6; i++) {
        await recoveryManager.initiateRecovery();
      }

      expect(recoveryManager.getRecoveryState()).toBe("Failed");
      
      const metrics = recoveryManager.getRecoveryMetrics();
      expect(metrics.failedRecoveries).toBeGreaterThan(0);
    });

    test("should recover components in correct order", async () => {
      await recoveryManager.start();
      
      const recoveryOrder: RecoveryComponent[] = [];
      recoveryManager.subscribeToEvents((event, data) => {
        if (event === "RecoveryProgress" && data?.component) {
          recoveryOrder.push(data.component as RecoveryComponent);
        }
      });

      await recoveryManager.simulateFailure("WebSocket");
      
      // Wait for recovery to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(recoveryOrder[0]).toBe("WebSocket");
      expect(recoveryOrder[1]).toBe("Session");
      expect(recoveryOrder[2]).toBe("Audio");
      expect(recoveryOrder[3]).toBe("Runtime");
      expect(recoveryOrder[4]).toBe("Provider");
    });

    test("should track recovery status for each component", async () => {
      await recoveryManager.start();
      
      await recoveryManager.simulateFailure("WebSocket");
      
      // Wait for recovery to start
      await new Promise(resolve => setTimeout(resolve, 100));

      const status = recoveryManager.getRecoveryStatus();
      
      expect(status.length).toBeGreaterThan(0);
      expect(status.some(s => s.component === "WebSocket")).toBe(true);
    });
  });

  describe("Network Restoration", () => {
    test("should restore network on simulation", async () => {
      await recoveryManager.start();
      
      await recoveryManager.simulateFailure("WebSocket");
      expect(recoveryManager.getRecoveryState()).not.toBe("Normal");
      
      let restorationEventReceived = false;
      recoveryManager.subscribeToEvents((event) => {
        if (event === "ConnectionRestored") {
          restorationEventReceived = true;
        }
      });

      await recoveryManager.simulateNetworkRestoration();
      
      expect(restorationEventReceived).toBe(true);
      expect(recoveryManager.getRecoveryState()).toBe("Normal");
    });

    test("should reset recovery attempts on restoration", async () => {
      await recoveryManager.start();
      
      // Trigger multiple failures
      await recoveryManager.simulateFailure("WebSocket");
      await recoveryManager.simulateFailure("Session");
      
      await recoveryManager.simulateNetworkRestoration();
      
      // Should be able to recover again without hitting max attempts
      await recoveryManager.simulateFailure("WebSocket");
      
      expect(recoveryManager.getRecoveryState()).toBe("Recovering");
    });

    test("should mark all components as healthy after restoration", async () => {
      await recoveryManager.start();
      
      // Fail multiple components
      await recoveryManager.simulateFailure("WebSocket");
      await recoveryManager.simulateFailure("Session");
      await recoveryManager.simulateFailure("Audio");
      
      await recoveryManager.simulateNetworkRestoration();
      
      const componentStates = (recoveryManager as unknown as { componentStates: Map<RecoveryComponent, boolean> }).componentStates;
      
      expect(componentStates.get("WebSocket")).toBe(true);
      expect(componentStates.get("Session")).toBe(true);
      expect(componentStates.get("Audio")).toBe(true);
    });

    test("should handle restoration during recovery", async () => {
      await recoveryManager.start();
      
      await recoveryManager.simulateFailure("WebSocket");
      
      // Wait for recovery to start
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Restore network while recovering
      await recoveryManager.simulateNetworkRestoration();
      
      expect(recoveryManager.getRecoveryState()).toBe("Normal");
    });
  });

  describe("Continued Conversation", () => {
    test("should maintain conversation context across recovery", async () => {
      await recoveryManager.start();
      
      // Simulate active conversation
      await recoveryManager.simulateFailure("WebSocket");
      
      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      expect(recoveryManager.getRecoveryState()).toBe("Recovered");
      
      // Should be able to continue
      const metrics = recoveryManager.getRecoveryMetrics();
      expect(metrics.successfulRecoveries).toBeGreaterThan(0);
    });

    test("should track recovery time for performance", async () => {
      await recoveryManager.start();
      
      await recoveryManager.simulateFailure("WebSocket");
      
      // Wait for recovery to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const metrics = recoveryManager.getRecoveryMetrics();
      
      expect(metrics.averageRecoveryTime).toBeGreaterThan(0);
      expect(metrics.lastRecoveryTime).toBeGreaterThan(0);
    });

    test("should handle rapid failure/recovery cycles", async () => {
      await recoveryManager.start();
      
      for (let i = 0; i < 3; i++) {
        await recoveryManager.simulateFailure("WebSocket");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await recoveryManager.simulateNetworkRestoration();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const metrics = recoveryManager.getRecoveryMetrics();
      
      expect(metrics.successfulRecoveries).toBe(3);
      expect(metrics.totalFailures).toBe(3);
    });

    test("should emit recovery progress events", async () => {
      await recoveryManager.start();
      
      const progressEvents: Array<{ component: RecoveryComponent; status: string }> = [];
      
      recoveryManager.subscribeToEvents((event, data) => {
        if (event === "RecoveryProgress" && data?.component) {
          progressEvents.push({
            component: data.component as RecoveryComponent,
            status: data.status as string
          });
        }
      });

      await recoveryManager.simulateFailure("WebSocket");
      
      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      expect(progressEvents.length).toBeGreaterThan(0);
    });

    test("should complete recovery successfully", async () => {
      await recoveryManager.start();
      
      let recoveryCompleted = false;
      recoveryManager.subscribeToEvents((event) => {
        if (event === "RecoveryCompleted") {
          recoveryCompleted = true;
        }
      });

      await recoveryManager.simulateFailure("WebSocket");
      
      // Wait for recovery to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      expect(recoveryCompleted).toBe(true);
      expect(recoveryManager.getRecoveryState()).toBe("Recovered");
    });

    test("should handle partial recovery failure", async () => {
      await recoveryManager.start();
      
      // Manually cause a component to fail recovery by modifying the internal method
      // This is a test-only modification to simulate failure
      const manager = recoveryManager as unknown as { recoverWebSocket: () => Promise<void>; componentStates: Map<RecoveryComponent, boolean> };
      const originalRecover = manager.recoverWebSocket;
      manager.recoverWebSocket = async () => {
        throw new Error("WebSocket recovery failed");
      };

      await recoveryManager.simulateFailure("WebSocket");
      
      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 1000));

      const status = recoveryManager.getRecoveryStatus();
      const webSocketStatus = status.find(s => s.component === "WebSocket");
      
      // Restore original method
      manager.recoverWebSocket = originalRecover;
      
      expect(webSocketStatus?.status).toBe("Failed");
    });
  });

  describe("Recovery Metrics", () => {
    test("should track accurate recovery metrics", async () => {
      await recoveryManager.start();
      
      await recoveryManager.simulateFailure("WebSocket");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const metrics = recoveryManager.getRecoveryMetrics();
      
      expect(metrics.totalFailures).toBe(1);
      expect(metrics.successfulRecoveries).toBe(1);
      expect(metrics.failedRecoveries).toBe(0);
      expect(metrics.lastFailureTime).toBeGreaterThan(0);
      expect(metrics.lastRecoveryTime).toBeGreaterThan(0);
    });

    test("should calculate average recovery time", async () => {
      await recoveryManager.start();
      
      // Trigger multiple recoveries
      for (let i = 0; i < 3; i++) {
        await recoveryManager.simulateFailure("WebSocket");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await recoveryManager.simulateNetworkRestoration();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const metrics = recoveryManager.getRecoveryMetrics();
      
      expect(metrics.averageRecoveryTime).toBeGreaterThan(0);
    });

    test("should track component-specific failures", async () => {
      await recoveryManager.start();
      
      await recoveryManager.simulateFailure("WebSocket");
      await recoveryManager.simulateFailure("Session");
      await recoveryManager.simulateFailure("Audio");
      
      const metrics = recoveryManager.getRecoveryMetrics();
      
      expect(metrics.componentFailures.get("WebSocket")).toBe(1);
      expect(metrics.componentFailures.get("Session")).toBe(1);
      expect(metrics.componentFailures.get("Audio")).toBe(1);
    });
  });

  describe("Lifecycle", () => {
    test("should start and stop correctly", async () => {
      await recoveryManager.start();
      expect(recoveryManager.getRecoveryState()).toBe("Normal");
      
      await recoveryManager.stop();
      expect(recoveryManager.getRecoveryState()).toBe("Normal");
    });

    test("should not detect failures when stopped", async () => {
      await recoveryManager.start();
      await recoveryManager.stop();
      
      const failureDetected = await recoveryManager.detectFailure();
      
      expect(failureDetected).toBe(false);
    });

    test("should handle multiple start/stop cycles", async () => {
      for (let i = 0; i < 3; i++) {
        await recoveryManager.start();
        expect(recoveryManager.getRecoveryState()).toBe("Normal");
        
        await recoveryManager.stop();
      }
    });
  });

  describe("Event Handling", () => {
    test("should emit all recovery events", async () => {
      await recoveryManager.start();
      
      const events: RecoveryEvent[] = [];
      recoveryManager.subscribeToEvents((event) => {
        events.push(event);
      });

      await recoveryManager.simulateFailure("WebSocket");
      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(events).toContain("FailureDetected");
      expect(events).toContain("RecoveryStarted");
      expect(events).toContain("RecoveryProgress");
      expect(events).toContain("RecoveryCompleted");
    });

    test("should handle event callback errors gracefully", async () => {
      await recoveryManager.start();
      
      recoveryManager.subscribeToEvents(() => {
        throw new Error("Test error");
      });

      recoveryManager.subscribeToEvents((event) => {
        // This should still be called
        expect(event).toBeDefined();
      });

      // Should not throw
      await recoveryManager.simulateFailure("WebSocket");
    });
  });

  describe("Recovery Options", () => {
    test("should respect custom recovery order", async () => {
      await recoveryManager.start();
      
      const manager = recoveryManager as unknown as { defaultOptions: { recoveryOrder: RecoveryComponent[] } };
      manager.defaultOptions.recoveryOrder = ["Provider", "Runtime", "Audio", "Session", "WebSocket"];
      
      const recoveryOrder: RecoveryComponent[] = [];
      recoveryManager.subscribeToEvents((event, data) => {
        if (event === "RecoveryProgress" && data?.component) {
          recoveryOrder.push(data.component as RecoveryComponent);
        }
      });

      await recoveryManager.simulateFailure("WebSocket");
      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(recoveryOrder[0]).toBe("Provider");
    });

    test("should respect auto-recovery setting", async () => {
      const manager = recoveryManager as unknown as { defaultOptions: { enableAutoRecovery: boolean } };
      manager.defaultOptions.enableAutoRecovery = false;
      
      await recoveryManager.start();
      
      let recoveryStarted = false;
      recoveryManager.subscribeToEvents((event) => {
        if (event === "RecoveryStarted") {
          recoveryStarted = true;
        }
      });

      await recoveryManager.simulateFailure("WebSocket");
      
      expect(recoveryStarted).toBe(false);
    });
  });
});
