// @ts-nocheck
import type { StartInterviewUseCase } from "../use-cases/StartInterviewUseCase.js";
import type { ProcessVoiceTurnUseCase } from "../use-cases/ProcessVoiceTurnUseCase.js";
import type { HandleSilenceUseCase, HandleInterruptionUseCase } from "../use-cases/EdgeCaseUseCases.js";
import type { CommandContext, Result, ApplicationError } from "../types.js";
import type { ProcessTurnRequest, ProcessTurnResponse, StartInterviewRequest, StartInterviewResponse } from "../dtos/index.js";

export class InterviewOrchestrator {
  constructor(
    private readonly startUseCase: StartInterviewUseCase,
    private readonly processTurnUseCase: ProcessVoiceTurnUseCase,
    private readonly handleSilenceUseCase: HandleSilenceUseCase,
    private readonly handleInterruptionUseCase: HandleInterruptionUseCase
  ) {}

  public async startInterview(req: StartInterviewRequest, ctx: CommandContext): Promise<Result<StartInterviewResponse, ApplicationError>> {
    return this.startUseCase.execute(req, ctx);
  }

  public async handleIncomingAudio(req: ProcessTurnRequest, ctx: CommandContext): Promise<Result<ProcessTurnResponse, ApplicationError>> {
    if (req.intent === "silence") {
      return this.handleSilenceUseCase.execute(req, ctx);
    }
    if (req.intent === "interruption") {
      return this.handleInterruptionUseCase.execute(req, ctx);
    }
    return this.processTurnUseCase.execute(req, ctx);
  }
}
