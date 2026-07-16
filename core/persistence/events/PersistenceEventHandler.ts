/**
 * Persistence Event Handler
 *
 * Handles Runtime events and transforms them into persistence commands.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY event handling and transformation.
 */

import {
  RuntimeEventEmitter,
  EventRecord,
} from "../../providers/runtime/RuntimeEvents";
import { SessionPersistenceService } from "../services/SessionPersistenceService";
import { SessionSnapshotBuilder } from "../builders/SessionSnapshotBuilder";
import { SessionIdGenerator } from "../services/SessionIdGenerator";
import { DiagnosticCollector } from "../../diagnostics/DiagnosticCollector";

// ============================================================================
// PERSISTENCE EVENT HANDLER INTERFACE
// ============================================================================

export interface PersistenceEventHandler {
  /**
   * Start listening to Runtime events
   */
  start(): void;

  /**
   * Stop listening to Runtime events
   */
  stop(): void;

  /**
   * Check if handler is active
   */
  isActive(): boolean;
}

// ============================================================================
// PERSISTENCE EVENT COMMAND INTERFACE
// ============================================================================

export interface PersistenceCommand {
  type: "save" | "update" | "close" | "delete" | "restore";
  sessionId?: string;
  data?: unknown;
}

// ============================================================================
// PERSISTENCE EVENT HANDLER IMPLEMENTATION
// ============================================================================

export class PersistenceEventHandlerImpl implements PersistenceEventHandler {
  private runtimeEventEmitter: RuntimeEventEmitter;
  private sessionPersistenceService: SessionPersistenceService;
  private sessionSnapshotBuilder: SessionSnapshotBuilder;
  private sessionIdGenerator: SessionIdGenerator;
  private diagnosticCollector: DiagnosticCollector;
  private active: boolean = false;
  private currentSessionId: string | null = null;
  private candidateId: string | null = null;
  private sessionStartTime: Date | null = null;

  constructor(
    runtimeEventEmitter: RuntimeEventEmitter,
    sessionPersistenceService: SessionPersistenceService,
    sessionSnapshotBuilder: SessionSnapshotBuilder,
    sessionIdGenerator: SessionIdGenerator,
    diagnosticCollector: DiagnosticCollector,
  ) {
    this.runtimeEventEmitter = runtimeEventEmitter;
    this.sessionPersistenceService = sessionPersistenceService;
    this.sessionSnapshotBuilder = sessionSnapshotBuilder;
    this.sessionIdGenerator = sessionIdGenerator;
    this.diagnosticCollector = diagnosticCollector;
  }

  start(): void {
    if (this.active) {
      return;
    }

    this.active = true;
    this.subscribeToRuntimeEvents();
    this.recordIntegrationEvent("started");
  }

  stop(): void {
    if (!this.active) {
      return;
    }

    this.active = false;
    this.unsubscribeFromRuntimeEvents();
    this.recordIntegrationEvent("stopped");
  }

  isActive(): boolean {
    return this.active;
  }

  private subscribeToRuntimeEvents(): void {
    this.runtimeEventEmitter.subscribe((event) => {
      if (!this.active) {
        return;
      }

      this.handleRuntimeEvent(event);
    });
  }

  private unsubscribeFromRuntimeEvents(): void {
    // Note: RuntimeEventEmitter doesn't have an unsubscribe method in current implementation
    // This is a limitation of the current RuntimeEventEmitter
  }

  private async handleRuntimeEvent(record: EventRecord): Promise<void> {
    try {
      const command = this.transformEventToCommand(record);
      if (command) {
        await this.executeCommand(command);
      }
    } catch (error) {
      // Never block Runtime on persistence errors
      this.recordPersistenceError(error as Error);
    }
  }

  private transformEventToCommand(
    record: EventRecord,
  ): PersistenceCommand | null {
    switch (record.event) {
      case "RuntimeStarted":
        return { type: "save" };
      case "RuntimeSwitched":
      case "RuntimeFailedOver":
      case "RuntimeError":
        return { type: "update" };
      case "RuntimeShuttingDown":
        return { type: "close" };
      default:
        return null;
    }
  }

  private async executeCommand(command: PersistenceCommand): Promise<void> {
    switch (command.type) {
      case "save":
        await this.handleSessionStart();
        break;
      case "update":
        await this.handleSessionUpdate();
        break;
      case "close":
        await this.handleSessionEnd();
        break;
      default:
        break;
    }
  }

  private async handleSessionStart(): Promise<void> {
    const sessionId = this.sessionIdGenerator.generate();
    this.currentSessionId = sessionId;
    this.candidateId = null;
    this.sessionStartTime = new Date();

    const startTime = Date.now();

    try {
      const snapshot = this.sessionSnapshotBuilder.buildSnapshot(sessionId);
      await this.sessionPersistenceService.saveSession(snapshot);

      this.recordPersistenceOperation(
        "save",
        sessionId,
        Date.now() - startTime,
        true,
      );
    } catch (error) {
      this.recordPersistenceOperation(
        "save",
        sessionId,
        Date.now() - startTime,
        false,
        error as Error,
      );
    }
  }

  private async handleSessionUpdate(): Promise<void> {
    if (!this.currentSessionId) {
      return;
    }

    const startTime = Date.now();

    try {
      const snapshot = this.sessionSnapshotBuilder.buildSnapshot(
        this.currentSessionId,
        this.candidateId ?? undefined,
      );
      await this.sessionPersistenceService.updateSession(snapshot);

      this.recordPersistenceOperation(
        "update",
        this.currentSessionId,
        Date.now() - startTime,
        true,
      );
    } catch (error) {
      this.recordPersistenceOperation(
        "update",
        this.currentSessionId,
        Date.now() - startTime,
        false,
        error as Error,
      );
    }
  }

  private async handleSessionEnd(): Promise<void> {
    if (!this.currentSessionId) {
      return;
    }

    const startTime = Date.now();

    try {
      const snapshot = this.sessionSnapshotBuilder.buildSnapshot(
        this.currentSessionId,
        this.candidateId ?? undefined,
      );
      snapshot.endedAt = new Date();
      snapshot.duration = this.sessionStartTime
        ? Date.now() - this.sessionStartTime.getTime()
        : undefined;

      await this.sessionPersistenceService.closeSession(snapshot);

      this.recordPersistenceOperation(
        "close",
        this.currentSessionId,
        Date.now() - startTime,
        true,
      );

      // Reset session state
      this.currentSessionId = null;
      this.candidateId = null;
      this.sessionStartTime = null;
    } catch (error) {
      this.recordPersistenceOperation(
        "close",
        this.currentSessionId ?? "unknown",
        Date.now() - startTime,
        false,
        error as Error,
      );
    }
  }

  private recordIntegrationEvent(action: string): void {
    this.diagnosticCollector
      .getEventRecorder()
      .recordEvent("session", "PersistenceIntegrationEvent", {
        action,
        timestamp: new Date().toISOString(),
      });
  }

  private recordPersistenceOperation(
    operation: string,
    sessionId: string,
    duration: number,
    success: boolean,
    error?: Error,
  ): void {
    this.diagnosticCollector
      .getEventRecorder()
      .recordEvent("session", "PersistenceOperation", {
        operation,
        sessionId,
        duration,
        success,
        error: error
          ? {
              message: error.message,
              name: error.name,
            }
          : undefined,
      });
  }

  private recordPersistenceError(error: Error): void {
    this.diagnosticCollector
      .getEventRecorder()
      .recordEvent("session", "PersistenceError", {
        message: error.message,
        name: error.name,
        timestamp: new Date().toISOString(),
      });
  }
}
