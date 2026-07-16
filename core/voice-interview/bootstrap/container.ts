import { loadAndValidateConfig } from "./configuration/BootstrapConfiguration.js";
import {
  SystemClockAdapter,
  CryptoUUIDAdapter,
  ConsoleLoggingAdapter,
  NoOpTelemetryAdapter,
  InMemoryEventPublisher,
  NoOpTransactionAdapter
} from "./registry/registerPorts.js";
import { registerInfrastructure } from "./registry/registerInfrastructure.js";
import { registerUseCases } from "./registry/registerUseCases.js";
import { VoiceWebSocketHandler } from "../integration/handlers/VoiceWebSocketHandler.js";
import { VoiceHttpRoutes } from "../integration/handlers/VoiceHttpRoutes.js";

export interface VoiceInterviewContainer {
  readonly wsHandler: VoiceWebSocketHandler;
  readonly httpRoutes: VoiceHttpRoutes;
}

export function createContainer(): VoiceInterviewContainer {
  // 1. Configuration — fail-fast if env vars missing
  const config = loadAndValidateConfig();

  // 2. Singletons — System Ports
  const clock = new SystemClockAdapter();
  const uuid = new CryptoUUIDAdapter();
  const logger = new ConsoleLoggingAdapter();
  const telemetry = new NoOpTelemetryAdapter();
  const eventPublisher = new InMemoryEventPublisher();
  const transaction = new NoOpTransactionAdapter();

  // 3. Scoped — Infrastructure Adapters
  const infra = registerInfrastructure(config);

  // 4. Transient — Use Cases + Orchestrator
  const useCases = registerUseCases(infra, { uuid, clock, eventPublisher, transaction, logger });

  // 5. Integration — Handlers
  const wsHandler = new VoiceWebSocketHandler(
    useCases.orchestrator,
    useCases.pauseInterviewUseCase,
    useCases.resumeInterviewUseCase,
    useCases.stopInterviewUseCase
  );

  const httpRoutes = new VoiceHttpRoutes(
    useCases.orchestrator,
    useCases.pauseInterviewUseCase,
    useCases.resumeInterviewUseCase,
    useCases.stopInterviewUseCase
  );

  return { wsHandler, httpRoutes };
}
