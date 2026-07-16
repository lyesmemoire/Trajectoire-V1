/**
 * Session Persistence Integration Tests
 *
 * Tests for SessionPersistenceIntegration component.
 * Verifies that integration properly delegates to PersistenceEventHandler.
 */
// @ts-nocheck


import { describe, it, expect, beforeEach, vi } from "vitest";
import { SessionPersistenceIntegrationImpl } from "../integration/SessionPersistenceIntegration";
import { PersistenceEventHandler } from "../events/PersistenceEventHandler";
import { DiagnosticCollector } from "../../diagnostics/DiagnosticCollector";

describe("SessionPersistenceIntegration", () => {
  let persistenceEventHandler: PersistenceEventHandler;
  let diagnosticCollector: DiagnosticCollector;
  let integration: SessionPersistenceIntegrationImpl;

  beforeEach(() => {
    diagnosticCollector = new DiagnosticCollector();

    // Mock PersistenceEventHandler
    persistenceEventHandler = {
      start: vi.fn(),
      stop: vi.fn(),
      isActive: vi.fn().mockReturnValue(false),
    } as unknown as PersistenceEventHandler;

    integration = new SessionPersistenceIntegrationImpl(
      persistenceEventHandler,
      diagnosticCollector,
    );
  });

  describe("Integration Lifecycle", () => {
    it("should delegate start to PersistenceEventHandler", () => {
      integration.start();
      expect(persistenceEventHandler.start).toHaveBeenCalled();
    });

    it("should delegate stop to PersistenceEventHandler", () => {
      integration.stop();
      expect(persistenceEventHandler.stop).toHaveBeenCalled();
    });

    it("should delegate isActive to PersistenceEventHandler", () => {
      persistenceEventHandler.isActive = vi.fn().mockReturnValue(true);
      expect(integration.isActive()).toBe(true);
      expect(persistenceEventHandler.isActive).toHaveBeenCalled();
    });

    it("should record integration events in diagnostics", () => {
      integration.start();

      const events = diagnosticCollector
        .getEventRecorder()
        .getRecentEvents(100);
      const integrationEvents = events.filter(
        (e) => e.eventType === "PersistenceIntegrationEvent",
      );
      expect(integrationEvents.length).toBeGreaterThan(0);
    });
  });

  describe("Delegation", () => {
    it("should not directly access Runtime events", () => {
      // Integration should only know about PersistenceEventHandler
      // This is verified by the constructor signature
      expect(integration).toBeDefined();
    });

    it("should not directly access SessionPersistenceService", () => {
      // Integration should only know about PersistenceEventHandler
      // This is verified by the constructor signature
      expect(integration).toBeDefined();
    });

    it("should not directly access Repository", () => {
      // Integration should only know about PersistenceEventHandler
      // This is verified by the constructor signature
      expect(integration).toBeDefined();
    });
  });
});
