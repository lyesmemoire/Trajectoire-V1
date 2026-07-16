// @ts-nocheck
import type { InfrastructureServices } from "./registerInfrastructure.js";
import type { UUIDPort, EventPublisherPort, TransactionPort, LoggingPort, ClockPort } from "../../application/ports/SystemPorts.js";

import { StartInterviewUseCase } from "../../application/use-cases/StartInterviewUseCase.js";
import { ProcessVoiceTurnUseCase } from "../../application/use-cases/ProcessVoiceTurnUseCase.js";
import { PauseInterviewUseCase, ResumeInterviewUseCase, StopInterviewUseCase } from "../../application/use-cases/LifecycleUseCases.js";
import { HandleSilenceUseCase, HandleInterruptionUseCase } from "../../application/use-cases/EdgeCaseUseCases.js";
import { InterviewOrchestrator } from "../../application/orchestrators/InterviewOrchestrator.js";

export interface UseCaseRegistry {
  readonly startInterviewUseCase: StartInterviewUseCase;
  readonly processVoiceTurnUseCase: ProcessVoiceTurnUseCase;
  readonly pauseInterviewUseCase: PauseInterviewUseCase;
  readonly resumeInterviewUseCase: ResumeInterviewUseCase;
  readonly stopInterviewUseCase: StopInterviewUseCase;
  readonly handleSilenceUseCase: HandleSilenceUseCase;
  readonly handleInterruptionUseCase: HandleInterruptionUseCase;
  readonly orchestrator: InterviewOrchestrator;
}

export interface SystemPorts {
  readonly uuid: UUIDPort;
  readonly clock: ClockPort;
  readonly eventPublisher: EventPublisherPort;
  readonly transaction: TransactionPort;
  readonly logger: LoggingPort;
}

export function registerUseCases(infra: InfrastructureServices, system: SystemPorts): UseCaseRegistry {
  const { repository, evaluationPort, questionPort, ttsPort } = infra;
  const { uuid, clock, eventPublisher, transaction, logger } = system;

  const startInterviewUseCase = new StartInterviewUseCase(
    repository, uuid, clock, eventPublisher, questionPort, ttsPort, transaction, logger
  );

  const processVoiceTurnUseCase = new ProcessVoiceTurnUseCase(
    repository, evaluationPort, questionPort, ttsPort, eventPublisher, transaction, logger, clock, uuid
  );

  const pauseInterviewUseCase = new PauseInterviewUseCase(repository, eventPublisher, transaction, clock, uuid);
  const resumeInterviewUseCase = new ResumeInterviewUseCase(repository, eventPublisher, transaction, clock, uuid);
  const stopInterviewUseCase = new StopInterviewUseCase(repository, eventPublisher, transaction, clock, uuid);

  const handleSilenceUseCase = new HandleSilenceUseCase(repository, eventPublisher, transaction);
  const handleInterruptionUseCase = new HandleInterruptionUseCase(repository, eventPublisher, transaction);

  const orchestrator = new InterviewOrchestrator(
    startInterviewUseCase,
    processVoiceTurnUseCase,
    handleSilenceUseCase,
    handleInterruptionUseCase
  );

  return {
    startInterviewUseCase,
    processVoiceTurnUseCase,
    pauseInterviewUseCase,
    resumeInterviewUseCase,
    stopInterviewUseCase,
    handleSilenceUseCase,
    handleInterruptionUseCase,
    orchestrator
  };
}
