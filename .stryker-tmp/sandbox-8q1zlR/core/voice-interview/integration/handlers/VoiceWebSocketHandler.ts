// @ts-nocheck
import type { InterviewOrchestrator } from "../../application/orchestrators/InterviewOrchestrator.js";
import type { PauseInterviewUseCase, ResumeInterviewUseCase, StopInterviewUseCase } from "../../application/use-cases/LifecycleUseCases.js";
import { isSuccess } from "../../application/types.js";
import type { OutboundMessage } from "../transport/WebSocketMessage.js";
import { parseInboundMessage, toStartRequest, toProcessTurnRequest, toPauseRequest, toResumeRequest, toStopRequest } from "../validation/DTOValidators.js";
import { createCorrelationId, buildCommandContext } from "../middleware/CorrelationIdMiddleware.js";
import { VoicePresenter } from "../presenters/VoicePresenter.js";
import { ErrorPresenter } from "../presenters/ErrorPresenter.js";

export interface WebSocketConnection {
  send(data: string): void;
  close(code?: number, reason?: string): void;
}

export class VoiceWebSocketHandler {
  constructor(
    private readonly orchestrator: InterviewOrchestrator,
    private readonly pauseUseCase: PauseInterviewUseCase,
    private readonly resumeUseCase: ResumeInterviewUseCase,
    private readonly stopUseCase: StopInterviewUseCase
  ) {}

  async handleMessage(ws: WebSocketConnection, raw: string): Promise<void> {
    const correlationId = createCorrelationId();

    const validation = parseInboundMessage(raw);
    if (!validation.valid || !validation.data) {
      const errorMsg: OutboundMessage = {
        type: "ERROR",
        code: 4000,
        message: validation.error ?? "Invalid message",
        correlationId
      };
      ws.send(JSON.stringify(errorMsg));
      return;
    }

    const message = validation.data;

    switch (message.type) {
      case "PING": {
        const pong: OutboundMessage = { type: "PONG" };
        ws.send(JSON.stringify(pong));
        return;
      }

      case "START": {
        const ctx = buildCommandContext(correlationId);
        const result = await this.orchestrator.startInterview(toStartRequest(message), ctx);

        if (isSuccess(result)) {
          const outbound = VoicePresenter.presentStartResponse(result.value.sessionId, result.value);
          for (const msg of outbound) {
            ws.send(JSON.stringify(msg));
          }
        } else {
          ws.send(JSON.stringify(ErrorPresenter.toWebSocket(result.error, correlationId)));
        }
        return;
      }

      case "TURN": {
        const ctx = buildCommandContext(correlationId);
        const result = await this.orchestrator.handleIncomingAudio(toProcessTurnRequest(message), ctx);

        if (isSuccess(result)) {
          const outbound = VoicePresenter.presentTurnResponse(message.sessionId, result.value);
          for (const msg of outbound) {
            ws.send(JSON.stringify(msg));
          }
        } else {
          ws.send(JSON.stringify(ErrorPresenter.toWebSocket(result.error, correlationId)));
        }
        return;
      }

      case "PAUSE": {
        const ctx = buildCommandContext(correlationId);
        const result = await this.pauseUseCase.execute(toPauseRequest(message), ctx);

        if (isSuccess(result)) {
          const stateMsg: OutboundMessage = { type: "STATE", sessionId: message.sessionId, status: "paused", phase: "" };
          ws.send(JSON.stringify(stateMsg));
        } else {
          ws.send(JSON.stringify(ErrorPresenter.toWebSocket(result.error, correlationId)));
        }
        return;
      }

      case "RESUME": {
        const ctx = buildCommandContext(correlationId);
        const result = await this.resumeUseCase.execute(toResumeRequest(message), ctx);

        if (isSuccess(result)) {
          const stateMsg: OutboundMessage = { type: "STATE", sessionId: message.sessionId, status: "in-progress", phase: "" };
          ws.send(JSON.stringify(stateMsg));
        } else {
          ws.send(JSON.stringify(ErrorPresenter.toWebSocket(result.error, correlationId)));
        }
        return;
      }

      case "STOP": {
        const ctx = buildCommandContext(correlationId);
        const result = await this.stopUseCase.execute(toStopRequest(message), ctx);

        if (isSuccess(result)) {
          const completedMsg: OutboundMessage = { type: "COMPLETED", sessionId: message.sessionId };
          ws.send(JSON.stringify(completedMsg));
        } else {
          ws.send(JSON.stringify(ErrorPresenter.toWebSocket(result.error, correlationId)));
        }
        return;
      }
    }
  }

  handleClose(_ws: WebSocketConnection, _code: number, _reason: string): void {
    // Cleanup logic: could trigger a PauseUseCase or log disconnection
  }

  handleError(_ws: WebSocketConnection, _error: Error): void {
    // Error logging via TelemetryPort (injected in a real setup)
  }
}
