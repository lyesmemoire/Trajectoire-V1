// @ts-nocheck
import type { InterviewOrchestrator } from "../../application/orchestrators/InterviewOrchestrator.js";
import type { PauseInterviewUseCase, ResumeInterviewUseCase, StopInterviewUseCase } from "../../application/use-cases/LifecycleUseCases.js";
import { isSuccess } from "../../application/types.js";
import type { HttpRequest, HttpResponse, HealthCheckResponse } from "../transport/HttpContracts.js";
import type { StartInterviewRequest, ProcessTurnRequest } from "../../application/dtos/index.js";
import { createCorrelationId, buildCommandContext } from "../middleware/CorrelationIdMiddleware.js";
import { ErrorPresenter } from "../presenters/ErrorPresenter.js";

const APP_VERSION = "1.0.0";
const startTime = Date.now();

export class VoiceHttpRoutes {
  constructor(
    private readonly orchestrator: InterviewOrchestrator,
    private readonly pauseUseCase: PauseInterviewUseCase,
    private readonly resumeUseCase: ResumeInterviewUseCase,
    private readonly stopUseCase: StopInterviewUseCase
  ) {}

  async postStartInterview(req: HttpRequest<StartInterviewRequest>): Promise<HttpResponse> {
    const correlationId = createCorrelationId();
    const ctx = buildCommandContext(correlationId);
    const result = await this.orchestrator.startInterview(req.body, ctx);

    if (isSuccess(result)) {
      return { status: 201, body: result.value };
    }
    const mapped = ErrorPresenter.toHttp(result.error);
    return { status: mapped.status, body: mapped.body };
  }

  async postProcessTurn(req: HttpRequest<ProcessTurnRequest>): Promise<HttpResponse> {
    const correlationId = createCorrelationId();
    const ctx = buildCommandContext(correlationId);
    const result = await this.orchestrator.handleIncomingAudio(req.body, ctx);

    if (isSuccess(result)) {
      return { status: 200, body: result.value };
    }
    const mapped = ErrorPresenter.toHttp(result.error);
    return { status: mapped.status, body: mapped.body };
  }

  async postPause(req: HttpRequest<{ sessionId: string }>): Promise<HttpResponse> {
    const correlationId = createCorrelationId();
    const ctx = buildCommandContext(correlationId);
    const result = await this.pauseUseCase.execute({ sessionId: req.body.sessionId }, ctx);

    if (isSuccess(result)) {
      return { status: 200, body: { status: "paused" } };
    }
    const mapped = ErrorPresenter.toHttp(result.error);
    return { status: mapped.status, body: mapped.body };
  }

  async postResume(req: HttpRequest<{ sessionId: string }>): Promise<HttpResponse> {
    const correlationId = createCorrelationId();
    const ctx = buildCommandContext(correlationId);
    const result = await this.resumeUseCase.execute({ sessionId: req.body.sessionId }, ctx);

    if (isSuccess(result)) {
      return { status: 200, body: { status: "in-progress" } };
    }
    const mapped = ErrorPresenter.toHttp(result.error);
    return { status: mapped.status, body: mapped.body };
  }

  async postStop(req: HttpRequest<{ sessionId: string }>): Promise<HttpResponse> {
    const correlationId = createCorrelationId();
    const ctx = buildCommandContext(correlationId);
    const result = await this.stopUseCase.execute({ sessionId: req.body.sessionId }, ctx);

    if (isSuccess(result)) {
      return { status: 200, body: { status: "completed" } };
    }
    const mapped = ErrorPresenter.toHttp(result.error);
    return { status: mapped.status, body: mapped.body };
  }

  getHealth(): HttpResponse<HealthCheckResponse> {
    return {
      status: 200,
      body: {
        status: "ok",
        version: APP_VERSION,
        uptime: Date.now() - startTime,
        providers: {
          openai: true,
          deepgram: true,
          elevenlabs: true,
          supabase: true
        }
      }
    };
  }
}
