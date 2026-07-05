import { SILState, createInitialState } from "../contracts/session-state";
import { SILEvent } from "../contracts/sil-events";
import { EventRouter } from "../services/event-router";
import { P6RuntimeClient } from "../contracts/p6-runtime";
import { P7EvaluatorClient } from "../contracts/p7-evaluator";
import { RuntimeTraceProvider } from "../contracts/runtime-trace-provider";
import { FailureController } from "./failure-controller";
import { EventStore } from "../contracts/event-store";
import { StorageAdapter, ReportRepository, CheckpointRepository } from "../contracts/storage";
import { WakeupNotifier } from "../contracts/wakeup-notifier";
import { ObservabilityBus } from "../contracts/observability";
import { StructuredLogger } from "../contracts/structured-logger";
import * as crypto from "crypto";

export class SILRuntimeLoop implements WakeupNotifier {
  constructor(
    private router: EventRouter,
    private p6: P6RuntimeClient,
    private p7: P7EvaluatorClient,
    private traceProvider: RuntimeTraceProvider,
    private failureController: FailureController,
    private store: EventStore,
    private storageAdapter?: StorageAdapter,
    private reportRepo?: ReportRepository,
    private checkpointRepo?: CheckpointRepository,
    private bus?: ObservabilityBus,
    private logger?: StructuredLogger
  ) {}

  private states: Map<string, SILState> = new Map();
  private wakingSessions: Set<string> = new Set();

  getState(sessionId: string): SILState | undefined {
    return this.states.get(sessionId);
  }

  restoreState(state: SILState): void {
    this.states.set(state.sessionId, state);
  }

  async wakeup(tenantId: string, sessionId: string) {
    if (this.wakingSessions.has(sessionId)) {
      return; 
    }
    
    this.wakingSessions.add(sessionId);
    try {
      await this.processEvents(tenantId, sessionId);
    } finally {
      this.wakingSessions.delete(sessionId);
    }
  }

  /** WakeupNotifier implementation — used by Ingestor via interface. */
  async notify(tenantId: string, sessionId: string): Promise<void> {
    return this.wakeup(tenantId, sessionId);
  }

  private async processEvents(tenantId: string, sessionId: string) {
    let state = this.states.get(sessionId);
    const pointer = state ? state.pointer : 0;

    let pendingEvents = await this.store.readAfter(tenantId, sessionId, pointer - 1);

    while (pendingEvents.length > 0) {
      if (!state) {
        state = createInitialState(tenantId, sessionId);
        this.states.set(sessionId, state);
      }

      for (const event of pendingEvents) {
        // Sanity Check — defensive only, Ingestor is the enforcement point.
        // This MUST NOT throw. Graceful degradation: log + FAILED + return.
        if (state.tenantId !== event.tenantId) {
          this.failureController.recordInternalCorruption(
            state.sessionId,
            state.tenantId,
            {
              expectedTenant: state.tenantId,
              receivedTenant: event.tenantId,
              eventId: event.eventId,
            }
          );
          state.status = "FAILED";
          return; // graceful stop — no throw, no crash
        }

        state.pointer++;
        state.eventLog.push(event);
        await this.handleEvent(state, event);
      }

      pendingEvents = await this.store.readAfter(tenantId, sessionId, state.pointer - 1);
    }
  }

  private async handleEvent(state: SILState, event: SILEvent) {
    try {
      switch (event.type) {
        case "SESSION_CREATED":
          state.status = "RUNNING";
          
          await this.p6.startSession({
            sessionId: state.sessionId,
            tenantId: event.tenantId,
            payload: event.payload
          });
          
          this.router.emit({
            type: "P6_RUNTIME_STARTED",
            sessionId: state.sessionId,
            eventId: crypto.randomUUID(),
            tenantId: event.tenantId,
            timestamp: Date.now(),
            hash: "", signature: "",
          });

          await this.bus?.emit({
            type: "SESSION_STARTED",
            tenantId: event.tenantId,
            sessionId: state.sessionId,
            timestamp: Date.now()
          });

          await this.logger?.log({
            traceId: crypto.randomUUID(),
            tenantId: event.tenantId,
            sessionId: state.sessionId,
            stage: "SESSION_CREATED"
          });
          break;

        case "P6_RUNTIME_STARTED":
          break;

        case "USER_MESSAGE":
          if (state.status === "RUNNING") {
            const result = await this.p6.processEvent({
              sessionId: state.sessionId,
              tenantId: event.tenantId,
              payload: event.payload
            });
            
            this.router.emit({
              type: "P6_RUNTIME_COMMITTED",
              sessionId: state.sessionId,
              eventId: crypto.randomUUID(),
              tenantId: event.tenantId,
              timestamp: Date.now(),
              hash: "", signature: "",
              payload: {
                snapshotHash: result.snapshotHash,
                journalPointer: result.journalPointer
              }
            });
          }
          break;

        case "P6_RUNTIME_COMMITTED":
          break;

        case "SESSION_FINISHED":
          // Gateway-driven session finish — triggers the same P6→P7 evaluation flow
          state.status = "EVALUATING";
          
          const finishResult = await this.p6.endSession(state.sessionId);
          state.runtimeContext.p6State = finishResult;

          this.router.emit({
            type: "TRACE_RECOVERY_STARTED",
            sessionId: state.sessionId,
            eventId: crypto.randomUUID(),
            tenantId: event.tenantId,
            timestamp: Date.now(),
            hash: "", signature: "",
          });
          break;

        case "P6_RUNTIME_COMPLETED":
          state.status = "EVALUATING";
          
          const finalResult = await this.p6.endSession(state.sessionId);
          state.runtimeContext.p6State = finalResult;

          // Explicit trace recovery step — observable, retriable, independent
          this.router.emit({
            type: "TRACE_RECOVERY_STARTED",
            sessionId: state.sessionId,
            eventId: crypto.randomUUID(),
            tenantId: event.tenantId,
            timestamp: Date.now(),
            hash: "", signature: "",
          });
          break;

        case "TRACE_RECOVERY_STARTED":
          try {
            const trace = await this.traceProvider.getTrace(state.sessionId);

            this.router.emit({
              type: "TRACE_RECOVERY_COMPLETED",
              sessionId: state.sessionId,
              eventId: crypto.randomUUID(),
              tenantId: event.tenantId,
              timestamp: Date.now(),
              hash: "", signature: "",
              payload: { trace },
            });
          } catch (traceErr: any) {
            this.router.emit({
              type: "TRACE_RECOVERY_FAILED",
              sessionId: state.sessionId,
              eventId: crypto.randomUUID(),
              tenantId: event.tenantId,
              timestamp: Date.now(),
              hash: "", signature: "",
              error: "TRACE_NOT_FOUND",
              details: { message: traceErr.message },
            });
          }
          break;

        case "TRACE_RECOVERY_COMPLETED":
          this.router.emit({
            type: "P7_EVALUATION_STARTED",
            sessionId: state.sessionId,
            eventId: crypto.randomUUID(),
            tenantId: event.tenantId,
            timestamp: Date.now(),
            hash: "", signature: "",
            payload: { trace: event.payload.trace },
          });
          break;

        case "TRACE_RECOVERY_FAILED":
          state.status = "FAILED";
          break;

        case "P7_EVALUATION_STARTED":
          try {
            const evalResult = await this.p7.evaluate({
              sessionId: state.sessionId,
              runtimeTrace: event.payload.trace,
            });

            this.router.emit({
              type: "P7_EVALUATION_COMPLETED",
              sessionId: state.sessionId,
              eventId: crypto.randomUUID(),
              tenantId: event.tenantId,
              timestamp: Date.now(),
              hash: "", signature: "",
              payload: evalResult,
            });
          } catch (evalErr: any) {
            this.router.emit({
              type: "P7_EVALUATION_FAILED",
              sessionId: state.sessionId,
              eventId: crypto.randomUUID(),
              tenantId: event.tenantId,
              timestamp: Date.now(),
              hash: "", signature: "",
              error: "P7_EVALUATION_FAILED",
              details: { message: evalErr.message },
            });
          }
          break;

        case "P7_EVALUATION_COMPLETED":
          state.runtimeContext.p7State = event.payload;

          this.router.emit({
            type: "REPORT_GENERATED",
            sessionId: state.sessionId,
            eventId: crypto.randomUUID(),
            tenantId: event.tenantId,
            timestamp: Date.now(),
            hash: "", signature: "",
            payload: {
              reportId: event.payload.reportId,
              reportHash: event.payload.reportHash,
              evaluationHash: event.payload.evaluationHash,
            }
          });

          await this.bus?.emit({
            type: "P7_COMPLETED",
            tenantId: event.tenantId,
            sessionId: state.sessionId,
            timestamp: Date.now()
          });

          await this.logger?.log({
            traceId: crypto.randomUUID(),
            tenantId: event.tenantId,
            sessionId: state.sessionId,
            stage: "P7"
          });
          break;

        case "P7_EVALUATION_FAILED":
          state.status = "FAILED";
          break;

        case "REPORT_GENERATED":
          if (this.storageAdapter && this.reportRepo && this.checkpointRepo) {
            const tx = await this.storageAdapter.transaction();
            try {
              await tx.begin();

              await this.reportRepo.save(event.tenantId, {
                reportId: event.payload.reportId,
                sessionId: state.sessionId,
                tenantId: event.tenantId,
                reportHash: event.payload.reportHash,
                evaluationHash: event.payload.evaluationHash,
                reportPayload: state.runtimeContext.p7State // Final evaluation context
              }, tx);

              this.router.emit({
                type: "REPORT_PERSISTED",
                sessionId: state.sessionId,
                eventId: crypto.randomUUID(),
                tenantId: event.tenantId,
                timestamp: Date.now(),
                hash: "", signature: "",
                payload: { reportId: event.payload.reportId }
              });

              // We have persisted the report, so the session is effectively completed.
              // We must set the status to COMPLETED before saving the checkpoint,
              // otherwise a crash here would result in an EVALUATING state upon recovery
              // with no further events to process.
              state.status = "COMPLETED";

              const checkpointRecord = {
                sessionId: state.sessionId,
                tenantId: event.tenantId,
                state: JSON.parse(JSON.stringify(state)),
                lastEventId: event.eventId,
                runtimePointer: state.pointer,
                eventHash: "computed-event-hash", // Placeholder for actual hash
                reportHash: event.payload.reportHash,
                createdAt: new Date().toISOString()
              };

              await this.checkpointRepo.save(event.tenantId, checkpointRecord, tx);

              await this.bus?.emit({
                type: "REPORT_GENERATED",
                tenantId: event.tenantId,
                sessionId: state.sessionId,
                timestamp: Date.now()
              });

              await this.logger?.log({
                traceId: crypto.randomUUID(),
                tenantId: event.tenantId,
                sessionId: state.sessionId,
                stage: "REPORT"
              });

              this.router.emit({
                type: "CHECKPOINT_PERSISTED",
                sessionId: state.sessionId,
                eventId: crypto.randomUUID(),
                tenantId: event.tenantId,
                timestamp: Date.now(),
                hash: "", signature: "",
                payload: { runtimePointer: state.pointer }
              });

              await tx.commit();

              this.router.emit({
                type: "SESSION_COMPLETED",
                sessionId: state.sessionId,
                eventId: crypto.randomUUID(),
                tenantId: event.tenantId,
                timestamp: Date.now(),
                hash: "", signature: "",
              });
            } catch (err: any) {
              await tx.rollback();
              throw err; // will be caught by the generic loop failure handler
            }
          } else {
            // Fallback for tests not injecting storage
            this.router.emit({
              type: "SESSION_COMPLETED",
              sessionId: state.sessionId,
              eventId: crypto.randomUUID(),
              tenantId: event.tenantId,
              timestamp: Date.now(),
              hash: "", signature: "",
            });
          }
          break;

        case "REPORT_PERSISTED":
        case "CHECKPOINT_PERSISTED":
          // Observability events
          break;

        case "SESSION_COMPLETED":
          state.status = "COMPLETED";
          break;

        case "P6_RUNTIME_FAILED":
        case "FAILURE_DETECTED":
          state.status = "FAILED";
          this.failureController.handle(state, event.error as any, event.details);
          break;

        case "RECOVERY_TRIGGERED":
          break;
      }
    } catch (e: any) {
      this.logger?.error({
        traceId: crypto.randomUUID(),
        tenantId: event.tenantId,
        sessionId: state ? state.sessionId : event.sessionId,
        stage: "critical_execution_error",
        error: e,
        message: `[SIL] Critical Execution Error: ${e.message}`
      });
      this.router.emit({
        type: "FAILURE_DETECTED",
        sessionId: state ? state.sessionId : event.sessionId,
        eventId: crypto.randomUUID(),
        tenantId: event.tenantId,
        timestamp: Date.now(),
        hash: "", signature: "",
        error: e.message.includes("TIMEOUT") ? "P6_TIMEOUT" : "STATE_CORRUPTION",
        details: { message: e.message }
      });
    }
  }
}
