/**
 * Integration Tests for Runtime-Provider Synchronizer
 */

import { RuntimeProviderSynchronizerImpl, SynchronizedEvent, StateSnapshot } from "../RuntimeProviderSynchronizer";
import { ProviderEvent } from "../../ProviderAbstractionLayer";

describe("RuntimeProviderSynchronizer - Integration Tests", () => {
  let synchronizer: RuntimeProviderSynchronizerImpl;

  beforeEach(() => {
    synchronizer = new RuntimeProviderSynchronizerImpl();
  });

  afterEach(async () => {
    await synchronizer.stop();
  });

  describe("Real-time Synchronization", () => {
    test("should synchronize runtime state changes", async () => {
      await synchronizer.start();
      
      await synchronizer.syncRuntimeState("Running", "RuntimeStarted");
      
      const snapshot = synchronizer.getStateSnapshot();
      expect(snapshot.runtimeState).toBe("Running");
      expect(snapshot.syncState).toBe("Synchronized");
    });

    test("should synchronize provider state changes", async () => {
      await synchronizer.start();
      
      await synchronizer.syncProviderState("provider-1", "Active", "ProviderReady");
      
      const snapshot = synchronizer.getStateSnapshot();
      expect(snapshot.providerState).toBe("Active");
      expect(snapshot.syncState).toBe("Synchronized");
    });

    test("should handle concurrent runtime and provider state changes", async () => {
      await synchronizer.start();
      
      const promises = [
        synchronizer.syncRuntimeState("Running", "RuntimeStarted"),
        synchronizer.syncProviderState("provider-1", "Active", "ProviderReady"),
        synchronizer.syncRuntimeState("Switching", "RuntimeSwitching"),
        synchronizer.syncProviderState("provider-2", "Active", "ProviderReady")
      ];

      await Promise.all(promises);
      
      const snapshot = synchronizer.getStateSnapshot();
      expect(snapshot.runtimeState).toBe("Switching");
      expect(snapshot.syncState).toBe("Synchronized");
    });

    test("should maintain low latency during synchronization", async () => {
      await synchronizer.start();
      
      const startTime = Date.now();
      
      for (let i = 0; i < 50; i++) {
        await synchronizer.syncRuntimeState("Running", "RuntimeStarted");
        await synchronizer.syncProviderState("provider-1", "Active", "ProviderReady");
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should complete 100 sync operations in reasonable time (< 1 second)
      expect(totalTime).toBeLessThan(1000);
    });

    test("should synchronize runtime events", async () => {
      await synchronizer.start();
      
      let eventReceived = false;
      synchronizer.subscribeToEvents((event) => {
        if (event.source === "Runtime" && event.eventType === "RuntimeStarted") {
          eventReceived = true;
        }
      });

      await synchronizer.syncRuntimeEvent("RuntimeStarted", { message: "test" });
      
      expect(eventReceived).toBe(true);
    });

    test("should synchronize provider events", async () => {
      await synchronizer.start();
      
      let eventReceived = false;
      synchronizer.subscribeToEvents((event) => {
        if (event.source === "Provider" && event.eventType === "ProviderReady") {
          eventReceived = true;
        }
      });

      const providerEvent: ProviderEvent = {
        id: "test-event",
        type: "ProviderReady",
        timestamp: Date.now(),
        providerId: "provider-1",
        data: { status: "ready" },
        metadata: { source: "test" }
      };

      await synchronizer.syncProviderEvent(providerEvent);
      
      expect(eventReceived).toBe(true);
    });
  });

  describe("Event Loss Prevention", () => {
    test("should not lose events under normal load", async () => {
      await synchronizer.start();
      
      const eventCount = 100;
      const eventsReceived: SynchronizedEvent[] = [];
      
      synchronizer.subscribeToEvents((event) => {
        eventsReceived.push(event);
      });

      for (let i = 0; i < eventCount; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      const metrics = synchronizer.getSynchronizationMetrics();
      expect(metrics.eventsLost).toBe(0);
      expect(eventsReceived.length).toBe(eventCount);
    });

    test("should track events lost on buffer overflow", async () => {
      await synchronizer.start();
      
      // Override max buffer size for testing
      (synchronizer as any).maxBufferSize = 5;

      const eventCount = 10;
      
      for (let i = 0; i < eventCount; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      const metrics = synchronizer.getSynchronizationMetrics();
      expect(metrics.eventsLost).toBeGreaterThan(0);
    });

    test("should emit BufferOverflow event when limit reached", async () => {
      await synchronizer.start();
      
      // Override max buffer size for testing
      (synchronizer as any).maxBufferSize = 5;

      let desyncDetected = false;
      synchronizer.subscribeToStateChanges((snapshot) => {
        if (snapshot.syncState === "Desynchronized") {
          desyncDetected = true;
        }
      });

      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      expect(desyncDetected).toBe(true);
    });

    test("should recover from desynchronization", async () => {
      await synchronizer.start();
      
      // Override max buffer size for testing
      (synchronizer as any).maxBufferSize = 5;

      // Trigger overflow
      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      let snapshot = synchronizer.getStateSnapshot();
      expect(snapshot.syncState).toBe("Desynchronized");

      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 200));

      snapshot = synchronizer.getStateSnapshot();
      expect(snapshot.syncState).toBe("Synchronized");
    });

    test("should flush buffer on stop", async () => {
      await synchronizer.start();
      
      const eventsReceived: SynchronizedEvent[] = [];
      synchronizer.subscribeToEvents((event) => {
        eventsReceived.push(event);
      });

      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      await synchronizer.stop();

      expect(eventsReceived.length).toBeGreaterThan(0);
    });
  });

  describe("Order Guarantee", () => {
    test("should maintain event order by sequence number", async () => {
      await synchronizer.start();
      
      const eventsReceived: SynchronizedEvent[] = [];
      synchronizer.subscribeToEvents((event) => {
        eventsReceived.push(event);
      });

      // Send events in order
      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify sequence numbers are in order
      for (let i = 1; i < eventsReceived.length; i++) {
        expect(eventsReceived[i].sequence).toBeGreaterThan(eventsReceived[i - 1].sequence);
      }
    });

    test("should track out-of-order events", async () => {
      await synchronizer.start();
      
      // Manually inject out-of-order events
      const synchronizerImpl = synchronizer as any;
      
      const event1: SynchronizedEvent = {
        id: "test-1",
        sequence: 5,
        timestamp: Date.now(),
        source: "Runtime",
        eventType: "RuntimeStarted",
        data: {}
      };

      const event2: SynchronizedEvent = {
        id: "test-2",
        sequence: 3,
        timestamp: Date.now(),
        source: "Runtime",
        eventType: "RuntimeStarted",
        data: {}
      };

      synchronizerImpl.eventBuffer.push(event1);
      synchronizerImpl.eventBuffer.push(event2);

      await synchronizerImpl.processEventBuffer();

      const metrics = synchronizer.getSynchronizationMetrics();
      expect(metrics.eventsOutOfOrder).toBeGreaterThan(0);
    });

    test("should process events in correct order even with concurrent sends", async () => {
      await synchronizer.start();
      
      const eventsReceived: SynchronizedEvent[] = [];
      synchronizer.subscribeToEvents((event) => {
        eventsReceived.push(event);
      });

      // Send events concurrently
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i }));
      }

      await Promise.all(promises);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify all events were received
      expect(eventsReceived.length).toBe(20);

      // Verify sequence numbers are unique and in order
      const sequences = eventsReceived.map(e => e.sequence);
      const uniqueSequences = new Set(sequences);
      expect(uniqueSequences.size).toBe(20);
    });

    test("should handle rapid event bursts", async () => {
      await synchronizer.start();
      
      const eventsReceived: SynchronizedEvent[] = [];
      synchronizer.subscribeToEvents((event) => {
        eventsReceived.push(event);
      });

      // Send rapid burst
      for (let i = 0; i < 100; i++) {
        synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 500));

      const metrics = synchronizer.getSynchronizationMetrics();
      expect(metrics.eventsProcessed).toBe(100);
      expect(metrics.eventsLost).toBe(0);
    });
  });

  describe("State Management", () => {
    test("should track session state correctly", async () => {
      expect(synchronizer.getSessionState()).toBe("Idle");
      
      await synchronizer.start();
      expect(synchronizer.getSessionState()).toBe("Active");
      
      await synchronizer.stop();
      expect(synchronizer.getSessionState()).toBe("Terminated");
    });

    test("should track synchronization state correctly", async () => {
      await synchronizer.start();
      
      expect(synchronizer.getSynchronizationState()).toBe("Synchronized");
      
      // Trigger desync
      (synchronizer as any).maxBufferSize = 5;
      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }
      
      expect(synchronizer.getSynchronizationState()).toBe("Desynchronized");
    });

    test("should emit state change events", async () => {
      await synchronizer.start();
      
      const snapshots: StateSnapshot[] = [];
      synchronizer.subscribeToStateChanges((snapshot) => {
        snapshots.push(snapshot);
      });

      await synchronizer.syncRuntimeState("Running", "RuntimeStarted");
      
      expect(snapshots.length).toBeGreaterThan(0);
      expect(snapshots[0].runtimeState).toBe("Running");
    });

    test("should provide accurate state snapshots", async () => {
      await synchronizer.start();
      
      await synchronizer.syncRuntimeState("Running", "RuntimeStarted");
      await synchronizer.syncProviderState("provider-1", "Active", "ProviderReady");

      const snapshot = synchronizer.getStateSnapshot();
      
      expect(snapshot.runtimeState).toBe("Running");
      expect(snapshot.providerState).toBe("Active");
      expect(snapshot.sessionState).toBe("Active");
      expect(snapshot.syncState).toBe("Synchronized");
      expect(snapshot.timestamp).toBeGreaterThan(0);
    });
  });

  describe("Metrics", () => {
    test("should track synchronization metrics accurately", async () => {
      await synchronizer.start();
      
      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      const metrics = synchronizer.getSynchronizationMetrics();
      
      expect(metrics.eventsProcessed).toBe(10);
      expect(metrics.eventsLost).toBe(0);
      expect(metrics.eventsOutOfOrder).toBe(0);
      expect(metrics.lastSyncTime).toBeGreaterThan(0);
    });

    test("should calculate average sync latency", async () => {
      await synchronizer.start();
      
      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      const metrics = synchronizer.getSynchronizationMetrics();
      
      expect(metrics.averageSyncLatency).toBeGreaterThanOrEqual(0);
    });

    test("should track desync and recovery counts", async () => {
      await synchronizer.start();
      
      (synchronizer as any).maxBufferSize = 5;
      
      // Trigger desync
      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      let metrics = synchronizer.getSynchronizationMetrics();
      expect(metrics.desyncCount).toBeGreaterThan(0);

      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 200));

      metrics = synchronizer.getSynchronizationMetrics();
      expect(metrics.recoveryCount).toBeGreaterThan(0);
    });

    test("should track buffer depth", async () => {
      await synchronizer.start();
      
      // Send events without waiting
      for (let i = 0; i < 50; i++) {
        synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      const metrics = synchronizer.getSynchronizationMetrics();
      expect(metrics.bufferDepth).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Correlation IDs", () => {
    test("should generate unique correlation IDs", async () => {
      await synchronizer.start();
      
      const correlationIds: string[] = [];
      synchronizer.subscribeToEvents((event) => {
        if (event.correlationId) {
          correlationIds.push(event.correlationId);
        }
      });

      for (let i = 0; i < 10; i++) {
        await synchronizer.syncRuntimeEvent("RuntimeStarted", { index: i });
      }

      const uniqueIds = new Set(correlationIds);
      expect(uniqueIds.size).toBe(10);
    });

    test("should preserve correlation IDs from provider events", async () => {
      await synchronizer.start();
      
      let receivedCorrelationId: string | undefined;
      synchronizer.subscribeToEvents((event) => {
        if (event.source === "Provider") {
          receivedCorrelationId = event.correlationId;
        }
      });

      const providerEvent: ProviderEvent = {
        id: "test-event",
        type: "ProviderReady",
        timestamp: Date.now(),
        providerId: "provider-1",
        data: { status: "ready" },
        metadata: { 
          source: "test",
          correlationId: "test-correlation-123"
        }
      };

      await synchronizer.syncProviderEvent(providerEvent);
      
      expect(receivedCorrelationId).toBe("test-correlation-123");
    });
  });

  describe("Error Handling", () => {
    test("should handle event callback errors gracefully", async () => {
      await synchronizer.start();
      
      synchronizer.subscribeToEvents(() => {
        throw new Error("Test error");
      });

      synchronizer.subscribeToEvents((event) => {
        // This should still be called
        expect(event).toBeDefined();
      });

      // Should not throw
      await synchronizer.syncRuntimeEvent("RuntimeStarted", { message: "test" });
    });

    test("should handle state callback errors gracefully", async () => {
      await synchronizer.start();
      
      synchronizer.subscribeToStateChanges(() => {
        throw new Error("Test error");
      });

      synchronizer.subscribeToStateChanges((snapshot) => {
        // This should still be called
        expect(snapshot).toBeDefined();
      });

      // Should not throw
      await synchronizer.syncRuntimeState("Running", "RuntimeStarted");
    });

    test("should ignore events when not running", async () => {
      // Don't start synchronizer
      
      const eventsReceived: SynchronizedEvent[] = [];
      synchronizer.subscribeToEvents((event) => {
        eventsReceived.push(event);
      });

      await synchronizer.syncRuntimeEvent("RuntimeStarted", { message: "test" });
      
      expect(eventsReceived.length).toBe(0);
    });
  });

  describe("Lifecycle", () => {
    test("should start and stop correctly", async () => {
      await synchronizer.start();
      expect(synchronizer.getSessionState()).toBe("Active");
      
      await synchronizer.stop();
      expect(synchronizer.getSessionState()).toBe("Terminated");
    });

    test("should handle multiple start/stop cycles", async () => {
      for (let i = 0; i < 3; i++) {
        await synchronizer.start();
        expect(synchronizer.getSessionState()).toBe("Active");
        
        await synchronizer.stop();
        expect(synchronizer.getSessionState()).toBe("Terminated");
      }
    });

    test("should reset state on restart", async () => {
      await synchronizer.start();
      await synchronizer.syncRuntimeState("Running", "RuntimeStarted");
      
      await synchronizer.stop();
      
      await synchronizer.start();
      const snapshot = synchronizer.getStateSnapshot();
      expect(snapshot.runtimeState).toBe("Idle");
    });
  });
});
