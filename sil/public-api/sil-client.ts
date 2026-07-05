import {
  SILPublicAPI,
  GetSessionStateQuery,
  GetSessionStateResult,
  GetReportQuery,
  GetReportResult
} from "../contracts/public-api";
import { KafkaBridge } from "../services/kafka-bridge";
import { SILRuntimeLoop } from "../core/runtime-loop";
import { ReportRepository } from "../contracts/storage";
import { IncomingSILEvent } from "../contracts/sil-events";
import { StructuredLogger } from "../contracts/structured-logger";
import * as crypto from "crypto";

export class SILClient implements SILPublicAPI {
  constructor(
    private kafkaPublisher: KafkaBridge,
    private runtimeLoop: SILRuntimeLoop,
    private reportRepo: ReportRepository,
    private logger?: StructuredLogger
  ) {}

  async publish(event: IncomingSILEvent): Promise<void> {
    try {
      await this.kafkaPublisher.simulateConsume(event);
    } catch (e) {
      this.logger?.error({
        traceId: crypto.randomUUID(),
        tenantId: event.tenantId,
        sessionId: event.sessionId,
        stage: "kafka_publish",
        error: e,
        message: "[SILClient] Failed to publish event"
      });
      throw e;
    }
  }

  async getSessionState(query: GetSessionStateQuery): Promise<GetSessionStateResult> {
    const state = this.runtimeLoop.getState(query.sessionId);
    
    if (!state) {
      throw new Error("Session not found");
    }

    // Sanity check tenant isolation at read-time
    if (state.tenantId !== query.tenantId) {
      throw new Error("Session not found"); // Mask isolation as not found for security
    }

    return {
      sessionId: query.sessionId,
      state: state.status,
      pointer: state.pointer,
      lastEventId: state.eventLog[state.eventLog.length - 1]?.eventId,
      health: state.status === "FAILED" ? "DEGRADED" : "OK"
    };
  }

  async getReport(query: GetReportQuery): Promise<GetReportResult> {
    const state = this.runtimeLoop.getState(query.sessionId);
    if (!state || state.tenantId !== query.tenantId) {
      return { sessionId: query.sessionId, report: null, status: "NOT_FOUND" };
    }

    if (state.status !== "COMPLETED") {
      return { sessionId: query.sessionId, report: null, status: "PENDING" };
    }

    const p7State: any = state.runtimeContext.p7State;
    if (!p7State || !p7State.reportId) {
       return { sessionId: query.sessionId, report: null, status: "PENDING" };
    }

    const reportRecord = await this.reportRepo.load(query.tenantId, p7State.reportId);
    
    if (!reportRecord) {
      return { sessionId: query.sessionId, report: null, status: "PENDING" };
    }

    return {
      sessionId: query.sessionId,
      status: "AVAILABLE",
      report: {
        reportId: reportRecord.reportId,
        reportHash: reportRecord.reportHash,
        score: reportRecord.reportPayload?.score || 0,
        explanationGraph: reportRecord.reportPayload?.explanationGraph,
        createdAt: Date.now()
      }
    };
  }
}
