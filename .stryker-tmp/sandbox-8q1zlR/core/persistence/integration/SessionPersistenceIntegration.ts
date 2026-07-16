/**
 * Session Persistence Integration
 *
 * Thin wrapper for PersistenceEventHandler.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY delegation to event handler.
 */
// @ts-nocheck


import { PersistenceEventHandler } from "../events/PersistenceEventHandler";
import { DiagnosticCollector } from "../../diagnostics/DiagnosticCollector";

// ============================================================================
// SESSION PERSISTENCE INTEGRATION INTERFACE
// ============================================================================

export interface SessionPersistenceIntegration {
  /**
   * Start listening to Runtime events
   */
  start(): void;

  /**
   * Stop listening to Runtime events
   */
  stop(): void;

  /**
   * Check if integration is active
   */
  isActive(): boolean;
}

// ============================================================================
// SESSION PERSISTENCE INTEGRATION IMPLEMENTATION
// ============================================================================

export class SessionPersistenceIntegrationImpl implements SessionPersistenceIntegration {
  private persistenceEventHandler: PersistenceEventHandler;
  private diagnosticCollector: DiagnosticCollector;

  constructor(
    persistenceEventHandler: PersistenceEventHandler,
    diagnosticCollector: DiagnosticCollector,
  ) {
    this.persistenceEventHandler = persistenceEventHandler;
    this.diagnosticCollector = diagnosticCollector;
  }

  start(): void {
    this.persistenceEventHandler.start();
    this.recordIntegrationEvent("started");
  }

  stop(): void {
    this.persistenceEventHandler.stop();
    this.recordIntegrationEvent("stopped");
  }

  isActive(): boolean {
    return this.persistenceEventHandler.isActive();
  }

  private recordIntegrationEvent(action: string): void {
    this.diagnosticCollector
      .getEventRecorder()
      .recordEvent("session", "PersistenceIntegrationEvent", {
        action,
        timestamp: new Date().toISOString(),
      });
  }
}
