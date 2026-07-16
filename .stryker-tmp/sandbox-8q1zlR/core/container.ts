/**
 * Core Composition Root
 *
 * Responsibilities:
 * - Register all core components
 * - Wire dependencies
 * - Provide ready-to-use instances
 * - Only place where infrastructure and application are assembled
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY composition and dependency injection
 */
// @ts-nocheck


import { RuntimeEngine, RuntimeEngineImpl } from "./providers/runtime/RuntimeEngine";
import { AudioStreamingOrchestrator, AudioStreamingOrchestratorImpl } from "./providers/runtime/AudioStreamingOrchestrator";
import { RuntimeManagerExtension, RuntimeManagerExtensionImpl } from "./providers/runtime/RuntimeManagerExtension";
import { EventSynchronizer, EventSynchronizerImpl } from "./providers/runtime/EventSynchronizer";
import { RuntimeEventEmitter, RuntimeEventEmitterImpl } from "./providers/runtime/RuntimeEvents";
import { RuntimeManager, RuntimeManagerImpl } from "./providers/runtime/RuntimeManager";
import { RuntimeStateMachine, RuntimeStateMachineImpl } from "./providers/runtime/RuntimeStateMachine";
import { AudioStreaming, AudioStreamingImpl } from "./providers/runtime/AudioStreaming";
import { BufferManager, BufferManagerImpl } from "./providers/runtime/BufferManager";
import { StreamingLifecycle, StreamingLifecycleImpl } from "./providers/runtime/StreamingLifecycle";
import { StreamingErrorHandler, StreamingErrorHandlerImpl } from "./providers/runtime/StreamingErrorHandler";

// OpenAI Realtime Provider Components
import { OpenAIRealtimeWebSocketTransportImpl } from "./providers/openai/OpenAIRealtimeWebSocketTransport";
import { OpenAIRealtimeAuthManagerImpl } from "./providers/openai/OpenAIRealtimeAuthManager";
import { OpenAIRealtimeSessionManagerImpl } from "./providers/openai/OpenAIRealtimeSessionManagerImpl";
import { OpenAIRealtimeEventMapperImpl } from "./providers/openai/OpenAIRealtimeEventMapperImpl";
import { OpenAIRealtimeErrorHandlerImpl } from "./providers/openai/OpenAIRealtimeErrorHandler";
import { OpenAIRealtimeProviderImpl } from "./providers/openai/OpenAIRealtimeProvider";

// Persistence Components
import { SessionSnapshotBuilder, SessionSnapshotBuilderImpl } from "./persistence/builders/SessionSnapshotBuilder";
import { SessionPersistence, SessionPersistenceService, SessionPersistenceServiceImpl } from "./persistence/services/SessionPersistenceService";
import { SessionRestoreService, SessionRestoreServiceImpl } from "./persistence/services/SessionRestoreService";
import { SessionSnapshotMapper, SessionSnapshotMapperImpl } from "./persistence/mappers/SessionSnapshotMapper";
import { ChecksumService, ChecksumServiceImpl } from "./persistence/services/ChecksumService";
import { SessionIdGenerator, SessionIdGeneratorImpl } from "./persistence/services/SessionIdGenerator";
import { RetryPolicy, RetryPolicyImpl } from "./persistence/policies/RetryPolicy";
import { PersistenceEventHandler, PersistenceEventHandlerImpl } from "./persistence/events/PersistenceEventHandler";
import { SupabaseSessionRepositoryImpl } from "./persistence/repositories/SupabaseSessionRepository";
import { SessionPersistenceIntegration, SessionPersistenceIntegrationImpl } from "./persistence/integration/SessionPersistenceIntegration";

// Audio Components
import { AudioInputAdapter, AudioInputAdapterImpl } from "./audio/AudioInputAdapter";
import { AudioOutputAdapter, AudioOutputAdapterImpl } from "./audio/AudioOutputAdapter";
import { AudioDeviceManager, AudioDeviceManagerImpl } from "./audio/AudioDeviceManager";
import { AudioPipelineOrchestrator, AudioPipelineOrchestratorImpl } from "./audio/AudioPipelineOrchestrator";

// VAD and Barge-In Components
import { DEFAULT_VAD_AND_BARGE_IN_CONFIGURATION } from "./audio/VADConfiguration";
import { VoiceActivityDetector, VoiceActivityDetectorImpl } from "./audio/VoiceActivityDetector";
import { BargeInManager, BargeInManagerImpl } from "./audio/BargeInManager";
import { AudioInterruptionController, AudioInterruptionControllerImpl } from "./audio/AudioInterruptionController";
import { BargeInOrchestrator, BargeInOrchestratorImpl } from "./audio/BargeInOrchestrator";

// Integration Components
import { RuntimeVoiceInterviewConnector, RuntimeVoiceInterviewConnectorImpl } from "./integration/RuntimeVoiceInterviewConnector";

// Orchestrator Components
import { SessionOrchestrator, SessionOrchestratorImpl } from "./orchestrator/SessionOrchestrator";

// Diagnostic Components
import { DiagnosticCollector } from "./diagnostics/DiagnosticCollector";

// Inspector Components
import { RuntimeInspector } from "./inspector/RuntimeInspector";

// ============================================================================
// INTERVIEW PREPARATION ENGINE COMPONENTS
// ============================================================================

import { InfrastructureContainer } from "./interview-preparation/infrastructure/container";
import { InterviewPlanApplicationService } from "./interview-preparation/application/services/InterviewPlanApplicationService";
import { InterviewPlanOrchestrator } from "./interview-preparation/application/orchestrators/InterviewPlanOrchestrator";
import { GenerateInterviewPlanUseCase } from "./interview-preparation/application/use-cases/GenerateInterviewPlanUseCase";
import { ValidateInterviewPlanUseCase } from "./interview-preparation/application/use-cases/ValidateInterviewPlanUseCase";
import { AnalyzeCompetencyCoverageUseCase } from "./interview-preparation/application/use-cases/AnalyzeCompetencyCoverageUseCase";
import { CalculateInterviewTimingUseCase } from "./interview-preparation/application/use-cases/CalculateInterviewTimingUseCase";
import { OptimizeQuestionOrderUseCase } from "./interview-preparation/application/use-cases/OptimizeQuestionOrderUseCase";
import { AdjustDifficultyUseCase } from "./interview-preparation/application/use-cases/AdjustDifficultyUseCase";
import { GenerateInterviewSummaryUseCase } from "./interview-preparation/application/use-cases/GenerateInterviewSummaryUseCase";
import { PreviewInterviewPlanUseCase } from "./interview-preparation/application/use-cases/PreviewInterviewPlanUseCase";
import { CloneInterviewPlanUseCase } from "./interview-preparation/application/use-cases/CloneInterviewPlanUseCase";
import { UpdateInterviewConstraintsUseCase } from "./interview-preparation/application/use-cases/UpdateInterviewConstraintsUseCase";
import { FinalizeInterviewPlanUseCase } from "./interview-preparation/application/use-cases/FinalizeInterviewPlanUseCase";

// ============================================================================
// CORE CONTAINER
// ============================================================================

export class CoreContainer {
  private static instance: CoreContainer | null = null;

  // Runtime Components
  private runtimeEngine: RuntimeEngine | null = null;
  private audioStreamingOrchestrator: AudioStreamingOrchestrator | null = null;
  private runtimeManagerExtension: RuntimeManagerExtension | null = null;
  private eventSynchronizer: EventSynchronizer | null = null;
  private runtimeEventEmitter: RuntimeEventEmitter | null = null;
  private runtimeManager: RuntimeManager | null = null;
  private runtimeStateMachine: RuntimeStateMachine | null = null;
  private audioStreaming: AudioStreaming | null = null;
  private bufferManager: BufferManager | null = null;
  private streamingLifecycle: StreamingLifecycle | null = null;
  private streamingErrorHandler: StreamingErrorHandler | null = null;

  // OpenAI Realtime Provider Components
  private webSocketTransport: OpenAIRealtimeWebSocketTransportImpl | null = null;
  private authManager: OpenAIRealtimeAuthManagerImpl | null = null;
  private sessionManager: OpenAIRealtimeSessionManagerImpl | null = null;
  private eventMapper: OpenAIRealtimeEventMapperImpl | null = null;
  private errorHandler: OpenAIRealtimeErrorHandlerImpl | null = null;
  private openAIProviderImpl: OpenAIRealtimeProviderImpl | null = null;

  // Persistence Components
  private sessionSnapshotBuilder: SessionSnapshotBuilder | null = null;
  private sessionPersistence: SessionPersistence | null = null;
  private sessionPersistenceService: SessionPersistenceService | null = null;
  private sessionRestoreService: SessionRestoreService | null = null;
  private sessionSnapshotMapper: SessionSnapshotMapper | null = null;
  private checksumService: ChecksumService | null = null;
  private sessionIdGenerator: SessionIdGenerator | null = null;
  private retryPolicy: RetryPolicy | null = null;
  private persistenceEventHandler: PersistenceEventHandler | null = null;
  private supabaseSessionRepository: SupabaseSessionRepositoryImpl | null = null;
  private sessionPersistenceIntegration: SessionPersistenceIntegration | null = null;

  // Audio Components
  private audioInputAdapter: AudioInputAdapter | null = null;
  private audioOutputAdapter: AudioOutputAdapter | null = null;
  private audioDeviceManager: AudioDeviceManager | null = null;
  private audioPipelineOrchestrator: AudioPipelineOrchestrator | null = null;

  // VAD and Barge-In Components
  private voiceActivityDetector: VoiceActivityDetector | null = null;
  private bargeInManager: BargeInManager | null = null;
  private audioInterruptionController: AudioInterruptionController | null = null;
  private bargeInOrchestrator: BargeInOrchestrator | null = null;

  // Integration Components
  private runtimeVoiceInterviewConnector: RuntimeVoiceInterviewConnector | null = null;

  // Orchestrator Components
  private sessionOrchestrator: SessionOrchestrator | null = null;

  // Diagnostic Components
  private diagnosticCollector: DiagnosticCollector | null = null;

  // Inspector Components
  private runtimeInspector: RuntimeInspector | null = null;

  // Interview Preparation Engine Components
  private infrastructureContainer: InfrastructureContainer | null = null;
  private interviewPlanApplicationService: InterviewPlanApplicationService | null = null;
  private interviewPlanOrchestrator: InterviewPlanOrchestrator | null = null;
  private generateInterviewPlanUseCase: GenerateInterviewPlanUseCase | null = null;
  private validateInterviewPlanUseCase: ValidateInterviewPlanUseCase | null = null;
  private analyzeCompetencyCoverageUseCase: AnalyzeCompetencyCoverageUseCase | null = null;
  private calculateInterviewTimingUseCase: CalculateInterviewTimingUseCase | null = null;
  private optimizeQuestionOrderUseCase: OptimizeQuestionOrderUseCase | null = null;
  private adjustDifficultyUseCase: AdjustDifficultyUseCase | null = null;
  private generateInterviewSummaryUseCase: GenerateInterviewSummaryUseCase | null = null;
  private previewInterviewPlanUseCase: PreviewInterviewPlanUseCase | null = null;
  private cloneInterviewPlanUseCase: CloneInterviewPlanUseCase | null = null;
  private updateInterviewConstraintsUseCase: UpdateInterviewConstraintsUseCase | null = null;
  private finalizeInterviewPlanUseCase: FinalizeInterviewPlanUseCase | null = null;

  private constructor() {
    this.initialize();
  }

  static getInstance(): CoreContainer {
    if (!CoreContainer.instance) {
      CoreContainer.instance = new CoreContainer();
    }
    return CoreContainer.instance;
  }

  private initialize(): void {
    // Initialize Runtime Components
    this.runtimeEventEmitter = new RuntimeEventEmitterImpl();
    this.eventSynchronizer = new EventSynchronizerImpl(this.runtimeEventEmitter);
    this.runtimeStateMachine = new RuntimeStateMachineImpl();
    this.runtimeEngine = new RuntimeEngineImpl();
    this.runtimeManager = new RuntimeManagerImpl(this.runtimeEngine);
    
    // Initialize Audio Streaming components
    this.audioStreaming = new AudioStreamingImpl();
    this.bufferManager = new BufferManagerImpl();
    this.streamingLifecycle = new StreamingLifecycleImpl();
    this.streamingErrorHandler = new StreamingErrorHandlerImpl();
    
    // Initialize AudioStreamingOrchestrator with all dependencies
    this.audioStreamingOrchestrator = new AudioStreamingOrchestratorImpl(
      this.audioStreaming,
      this.bufferManager,
      this.streamingLifecycle,
      this.streamingErrorHandler,
      this.runtimeEngine
    );
    
    // Initialize RuntimeManagerExtension with RuntimeManager and AudioStreamingOrchestrator
    this.runtimeManagerExtension = new RuntimeManagerExtensionImpl(
      this.runtimeManager,
      this.audioStreamingOrchestrator
    );

    // Initialize OpenAI Realtime Provider Components
    this.webSocketTransport = new OpenAIRealtimeWebSocketTransportImpl();
    this.authManager = new OpenAIRealtimeAuthManagerImpl();
    this.sessionManager = new OpenAIRealtimeSessionManagerImpl();
    this.eventMapper = new OpenAIRealtimeEventMapperImpl();
    this.errorHandler = new OpenAIRealtimeErrorHandlerImpl();

    // Register OpenAI Provider with RuntimeEngine
    // This connects Runtime ↔ Provider
    const openAIProvider = {
      id: "openai-realtime",
      metadata: {
        id: "openai-realtime",
        type: "RealtimeConversation" as const,
        name: "OpenAI Realtime",
        version: "1.0.0",
        description: "OpenAI Realtime API Provider",
        enabled: true,
        priority: 100,
        capabilities: {
          streaming: true,
          realtime: true,
          audio: true
        }
      },
      configuration: {
        providerId: "openai-realtime",
        type: "RealtimeConversation" as const,
        apiKey: "", // Will be configured at runtime
        model: "gpt-4o-realtime-preview",
        options: {}
      },
      capabilities: {
        streaming: true,
        realtime: true,
        audio: true
      },
      healthStatus: {
        providerId: "openai-realtime",
        status: "healthy" as const,
        lastCheck: Date.now(),
        uptime: 0,
        errorRate: 0,
        latency: 0
      },
      statistics: {
        providerId: "openai-realtime",
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageLatency: 0,
        totalCost: 0,
        totalTokens: 0,
        lastUsed: 0
      }
    };
    this.runtimeEngine.registerProvider(openAIProvider);

    // Initialize OpenAI Provider Implementation
    this.openAIProviderImpl = new OpenAIRealtimeProviderImpl(
      this.webSocketTransport,
      this.authManager,
      this.sessionManager,
      this.eventMapper,
      this.errorHandler,
      openAIProvider
    );

    // Initialize Persistence Components
    this.sessionSnapshotMapper = new SessionSnapshotMapperImpl();
    this.checksumService = new ChecksumServiceImpl();
    this.sessionIdGenerator = new SessionIdGeneratorImpl();
    this.retryPolicy = new RetryPolicyImpl();
    this.supabaseSessionRepository = new SupabaseSessionRepositoryImpl(
      this.sessionSnapshotMapper,
      this.checksumService
    );
    this.sessionPersistence = this.supabaseSessionRepository;
    this.sessionSnapshotBuilder = new SessionSnapshotBuilderImpl(
      this.runtimeEngine,
      this.runtimeManager,
      this.diagnosticCollector!
    );
    this.sessionPersistenceService = new SessionPersistenceServiceImpl(
      this.sessionPersistence,
      this.diagnosticCollector!,
      this.retryPolicy
    );
    this.sessionRestoreService = new SessionRestoreServiceImpl(
      this.sessionSnapshotMapper,
      (sessionId: string) => this.sessionPersistence!.restoreSession(sessionId)
    );
    this.persistenceEventHandler = new PersistenceEventHandlerImpl(
      this.runtimeEventEmitter,
      this.sessionPersistenceService,
      this.sessionSnapshotBuilder,
      this.sessionIdGenerator,
      this.diagnosticCollector!
    );
    this.sessionPersistenceIntegration = new SessionPersistenceIntegrationImpl(
      this.persistenceEventHandler,
      this.diagnosticCollector!
    );

    // Initialize Audio Components
    this.audioInputAdapter = new AudioInputAdapterImpl();
    this.audioOutputAdapter = new AudioOutputAdapterImpl();
    this.audioDeviceManager = new AudioDeviceManagerImpl();
    this.audioPipelineOrchestrator = new AudioPipelineOrchestratorImpl(this.audioInputAdapter, this.audioOutputAdapter);

    // Initialize VAD and Barge-In Components
    this.voiceActivityDetector = new VoiceActivityDetectorImpl(DEFAULT_VAD_AND_BARGE_IN_CONFIGURATION.vad);
    this.bargeInManager = new BargeInManagerImpl(DEFAULT_VAD_AND_BARGE_IN_CONFIGURATION.bargeIn);
    this.audioInterruptionController = new AudioInterruptionControllerImpl();
    this.bargeInOrchestrator = new BargeInOrchestratorImpl(DEFAULT_VAD_AND_BARGE_IN_CONFIGURATION);

    // Initialize Integration Components
    this.runtimeVoiceInterviewConnector = new RuntimeVoiceInterviewConnectorImpl();

    // Initialize Orchestrator Components
    this.sessionOrchestrator = new SessionOrchestratorImpl(
      this.runtimeEngine!,
      this.audioStreamingOrchestrator!,
      this.audioPipelineOrchestrator!,
      this.bargeInOrchestrator!,
      () => this.getRuntimeVoiceInterviewConnector()
    );

    // Initialize Diagnostic Components
    this.diagnosticCollector = new DiagnosticCollector();

    // Connect DiagnosticCollector to RuntimeEventEmitter
    // This connects Diagnostics to Runtime events
    this.runtimeEventEmitter.subscribe((record) => {
      // Feed runtime events to DiagnosticCollector
      // This ensures diagnostics receive real runtime data
      this.diagnosticCollector?.getEventRecorder().recordEvent(
        "runtime",
        "RuntimeEvent",
        record as unknown as Record<string, unknown>
      );
    });

    // Initialize Inspector Components
    this.runtimeInspector = new RuntimeInspector(this.diagnosticCollector!);

    // Initialize Interview Preparation Engine Components
    this.infrastructureContainer = InfrastructureContainer.getInstance();

    const persistencePort = this.infrastructureContainer.getInterviewPersistenceAdapter();
    const telemetryPort = this.infrastructureContainer.getTelemetryAdapter();
    const analyticsPort = this.infrastructureContainer.getAnalyticsAdapter();
    const loggingPort = this.infrastructureContainer.getLoggerAdapter();

    // Initialize all use cases
    this.generateInterviewPlanUseCase = new GenerateInterviewPlanUseCase(
      persistencePort,
      telemetryPort,
      analyticsPort,
      loggingPort
    );

    this.validateInterviewPlanUseCase = new ValidateInterviewPlanUseCase(
      persistencePort,
      telemetryPort,
      analyticsPort,
      loggingPort
    );

    this.analyzeCompetencyCoverageUseCase = new AnalyzeCompetencyCoverageUseCase(
      persistencePort,
      telemetryPort,
      analyticsPort,
      loggingPort
    );

    this.calculateInterviewTimingUseCase = new CalculateInterviewTimingUseCase(
      persistencePort,
      telemetryPort,
      loggingPort
    );

    this.optimizeQuestionOrderUseCase = new OptimizeQuestionOrderUseCase(
      persistencePort,
      telemetryPort,
      loggingPort
    );

    this.adjustDifficultyUseCase = new AdjustDifficultyUseCase(
      persistencePort,
      telemetryPort,
      loggingPort
    );

    this.generateInterviewSummaryUseCase = new GenerateInterviewSummaryUseCase(
      persistencePort,
      telemetryPort,
      loggingPort
    );

    this.previewInterviewPlanUseCase = new PreviewInterviewPlanUseCase(
      persistencePort,
      telemetryPort,
      loggingPort
    );

    this.cloneInterviewPlanUseCase = new CloneInterviewPlanUseCase(
      persistencePort,
      telemetryPort,
      loggingPort
    );

    this.updateInterviewConstraintsUseCase = new UpdateInterviewConstraintsUseCase(
      persistencePort,
      telemetryPort,
      loggingPort
    );

    this.finalizeInterviewPlanUseCase = new FinalizeInterviewPlanUseCase(
      persistencePort,
      telemetryPort,
      loggingPort
    );

    // Initialize application service with all use cases
    this.interviewPlanApplicationService = new InterviewPlanApplicationService(
      this.generateInterviewPlanUseCase,
      this.validateInterviewPlanUseCase,
      this.analyzeCompetencyCoverageUseCase,
      this.calculateInterviewTimingUseCase,
      this.optimizeQuestionOrderUseCase,
      this.adjustDifficultyUseCase,
      this.generateInterviewSummaryUseCase,
      this.previewInterviewPlanUseCase,
      this.cloneInterviewPlanUseCase,
      this.updateInterviewConstraintsUseCase,
      this.finalizeInterviewPlanUseCase
    );

    // Initialize orchestrator
    this.interviewPlanOrchestrator = new InterviewPlanOrchestrator(
      this.interviewPlanApplicationService
    );
  }

  // Runtime Components Getters
  getRuntimeEngine(): RuntimeEngine {
    if (!this.runtimeEngine) throw new Error("RuntimeEngine not initialized");
    return this.runtimeEngine;
  }

  getAudioStreamingOrchestrator(): AudioStreamingOrchestrator {
    if (!this.audioStreamingOrchestrator) throw new Error("AudioStreamingOrchestrator not initialized");
    return this.audioStreamingOrchestrator;
  }

  getRuntimeManagerExtension(): RuntimeManagerExtension {
    if (!this.runtimeManagerExtension) throw new Error("RuntimeManagerExtension not initialized");
    return this.runtimeManagerExtension;
  }

  getRuntimeManager(): RuntimeManager {
    if (!this.runtimeManager) throw new Error("RuntimeManager not initialized");
    return this.runtimeManager;
  }

  getRuntimeStateMachine(): RuntimeStateMachine {
    if (!this.runtimeStateMachine) throw new Error("RuntimeStateMachine not initialized");
    return this.runtimeStateMachine;
  }

  getAudioStreaming(): AudioStreaming {
    if (!this.audioStreaming) throw new Error("AudioStreaming not initialized");
    return this.audioStreaming;
  }

  getBufferManager(): BufferManager {
    if (!this.bufferManager) throw new Error("BufferManager not initialized");
    return this.bufferManager;
  }

  getStreamingLifecycle(): StreamingLifecycle {
    if (!this.streamingLifecycle) throw new Error("StreamingLifecycle not initialized");
    return this.streamingLifecycle;
  }

  getStreamingErrorHandler(): StreamingErrorHandler {
    if (!this.streamingErrorHandler) throw new Error("StreamingErrorHandler not initialized");
    return this.streamingErrorHandler;
  }

  getEventSynchronizer(): EventSynchronizer {
    if (!this.eventSynchronizer) throw new Error("EventSynchronizer not initialized");
    return this.eventSynchronizer;
  }

  getRuntimeEventEmitter(): RuntimeEventEmitter {
    if (!this.runtimeEventEmitter) throw new Error("RuntimeEventEmitter not initialized");
    return this.runtimeEventEmitter;
  }

  // OpenAI Realtime Provider Components Getters
  getWebSocketTransport(): OpenAIRealtimeWebSocketTransportImpl {
    if (!this.webSocketTransport) throw new Error("WebSocketTransport not initialized");
    return this.webSocketTransport;
  }

  getAuthManager(): OpenAIRealtimeAuthManagerImpl {
    if (!this.authManager) throw new Error("AuthManager not initialized");
    return this.authManager;
  }

  getSessionManager(): OpenAIRealtimeSessionManagerImpl {
    if (!this.sessionManager) throw new Error("SessionManager not initialized");
    return this.sessionManager;
  }

  getEventMapper(): OpenAIRealtimeEventMapperImpl {
    if (!this.eventMapper) throw new Error("EventMapper not initialized");
    return this.eventMapper;
  }

  getErrorHandler(): OpenAIRealtimeErrorHandlerImpl {
    if (!this.errorHandler) throw new Error("ErrorHandler not initialized");
    return this.errorHandler;
  }

  getOpenAIProviderImpl(): OpenAIRealtimeProviderImpl {
    if (!this.openAIProviderImpl) throw new Error("OpenAIProviderImpl not initialized");
    return this.openAIProviderImpl;
  }

  // Persistence Components Getters
  getSessionSnapshotBuilder(): SessionSnapshotBuilder {
    if (!this.sessionSnapshotBuilder) throw new Error("SessionSnapshotBuilder not initialized");
    return this.sessionSnapshotBuilder;
  }

  getSessionPersistence(): SessionPersistence {
    if (!this.sessionPersistence) throw new Error("SessionPersistence not initialized");
    return this.sessionPersistence;
  }

  getSessionPersistenceService(): SessionPersistenceService {
    if (!this.sessionPersistenceService) throw new Error("SessionPersistenceService not initialized");
    return this.sessionPersistenceService;
  }

  getSessionRestoreService(): SessionRestoreService {
    if (!this.sessionRestoreService) throw new Error("SessionRestoreService not initialized");
    return this.sessionRestoreService;
  }

  getSessionSnapshotMapper(): SessionSnapshotMapper {
    if (!this.sessionSnapshotMapper) throw new Error("SessionSnapshotMapper not initialized");
    return this.sessionSnapshotMapper;
  }

  getSupabaseSessionRepository(): SupabaseSessionRepositoryImpl {
    if (!this.supabaseSessionRepository) throw new Error("SupabaseSessionRepository not initialized");
    return this.supabaseSessionRepository;
  }

  getSessionPersistenceIntegration(): SessionPersistenceIntegration {
    if (!this.sessionPersistenceIntegration) throw new Error("SessionPersistenceIntegration not initialized");
    return this.sessionPersistenceIntegration;
  }

  // Audio Components Getters
  getAudioInputAdapter(): AudioInputAdapter {
    if (!this.audioInputAdapter) throw new Error("AudioInputAdapter not initialized");
    return this.audioInputAdapter;
  }

  getAudioOutputAdapter(): AudioOutputAdapter {
    if (!this.audioOutputAdapter) throw new Error("AudioOutputAdapter not initialized");
    return this.audioOutputAdapter;
  }

  getAudioDeviceManager(): AudioDeviceManager {
    if (!this.audioDeviceManager) throw new Error("AudioDeviceManager not initialized");
    return this.audioDeviceManager;
  }

  getAudioPipelineOrchestrator(): AudioPipelineOrchestrator {
    if (!this.audioPipelineOrchestrator) throw new Error("AudioPipelineOrchestrator not initialized");
    return this.audioPipelineOrchestrator;
  }

  // VAD and Barge-In Components Getters
  getVoiceActivityDetector(): VoiceActivityDetector {
    if (!this.voiceActivityDetector) throw new Error("VoiceActivityDetector not initialized");
    return this.voiceActivityDetector;
  }

  getBargeInManager(): BargeInManager {
    if (!this.bargeInManager) throw new Error("BargeInManager not initialized");
    return this.bargeInManager;
  }

  getAudioInterruptionController(): AudioInterruptionController {
    if (!this.audioInterruptionController) throw new Error("AudioInterruptionController not initialized");
    return this.audioInterruptionController;
  }

  getBargeInOrchestrator(): BargeInOrchestrator {
    if (!this.bargeInOrchestrator) throw new Error("BargeInOrchestrator not initialized");
    return this.bargeInOrchestrator;
  }

  // Integration Components Getters
  getRuntimeVoiceInterviewConnector(): RuntimeVoiceInterviewConnector {
    if (!this.runtimeVoiceInterviewConnector) throw new Error("RuntimeVoiceInterviewConnector not initialized");
    return this.runtimeVoiceInterviewConnector;
  }

  // Orchestrator Components Getters
  getSessionOrchestrator(): SessionOrchestrator {
    if (!this.sessionOrchestrator) throw new Error("SessionOrchestrator not initialized");
    return this.sessionOrchestrator;
  }

  // Diagnostic Components Getters
  getDiagnosticCollector(): DiagnosticCollector {
    if (!this.diagnosticCollector) throw new Error("DiagnosticCollector not initialized");
    return this.diagnosticCollector;
  }

  // Inspector Components Getters
  getRuntimeInspector(): RuntimeInspector {
    if (!this.runtimeInspector) throw new Error("RuntimeInspector not initialized");
    return this.runtimeInspector;
  }

  // Interview Preparation Engine Components Getters
  getInfrastructureContainer(): InfrastructureContainer {
    if (!this.infrastructureContainer) throw new Error("InfrastructureContainer not initialized");
    return this.infrastructureContainer;
  }

  getInterviewPlanApplicationService(): InterviewPlanApplicationService {
    if (!this.interviewPlanApplicationService) throw new Error("InterviewPlanApplicationService not initialized");
    return this.interviewPlanApplicationService;
  }

  getInterviewPlanOrchestrator(): InterviewPlanOrchestrator {
    if (!this.interviewPlanOrchestrator) throw new Error("InterviewPlanOrchestrator not initialized");
    return this.interviewPlanOrchestrator;
  }

  getGenerateInterviewPlanUseCase(): GenerateInterviewPlanUseCase {
    if (!this.generateInterviewPlanUseCase) throw new Error("GenerateInterviewPlanUseCase not initialized");
    return this.generateInterviewPlanUseCase;
  }

  getValidateInterviewPlanUseCase(): ValidateInterviewPlanUseCase {
    if (!this.validateInterviewPlanUseCase) throw new Error("ValidateInterviewPlanUseCase not initialized");
    return this.validateInterviewPlanUseCase;
  }

  getAnalyzeCompetencyCoverageUseCase(): AnalyzeCompetencyCoverageUseCase {
    if (!this.analyzeCompetencyCoverageUseCase) throw new Error("AnalyzeCompetencyCoverageUseCase not initialized");
    return this.analyzeCompetencyCoverageUseCase;
  }

  getCalculateInterviewTimingUseCase(): CalculateInterviewTimingUseCase {
    if (!this.calculateInterviewTimingUseCase) throw new Error("CalculateInterviewTimingUseCase not initialized");
    return this.calculateInterviewTimingUseCase;
  }

  getOptimizeQuestionOrderUseCase(): OptimizeQuestionOrderUseCase {
    if (!this.optimizeQuestionOrderUseCase) throw new Error("OptimizeQuestionOrderUseCase not initialized");
    return this.optimizeQuestionOrderUseCase;
  }

  getAdjustDifficultyUseCase(): AdjustDifficultyUseCase {
    if (!this.adjustDifficultyUseCase) throw new Error("AdjustDifficultyUseCase not initialized");
    return this.adjustDifficultyUseCase;
  }

  getGenerateInterviewSummaryUseCase(): GenerateInterviewSummaryUseCase {
    if (!this.generateInterviewSummaryUseCase) throw new Error("GenerateInterviewSummaryUseCase not initialized");
    return this.generateInterviewSummaryUseCase;
  }

  getPreviewInterviewPlanUseCase(): PreviewInterviewPlanUseCase {
    if (!this.previewInterviewPlanUseCase) throw new Error("PreviewInterviewPlanUseCase not initialized");
    return this.previewInterviewPlanUseCase;
  }

  getCloneInterviewPlanUseCase(): CloneInterviewPlanUseCase {
    if (!this.cloneInterviewPlanUseCase) throw new Error("CloneInterviewPlanUseCase not initialized");
    return this.cloneInterviewPlanUseCase;
  }

  getUpdateInterviewConstraintsUseCase(): UpdateInterviewConstraintsUseCase {
    if (!this.updateInterviewConstraintsUseCase) throw new Error("UpdateInterviewConstraintsUseCase not initialized");
    return this.updateInterviewConstraintsUseCase;
  }

  getFinalizeInterviewPlanUseCase(): FinalizeInterviewPlanUseCase {
    if (!this.finalizeInterviewPlanUseCase) throw new Error("FinalizeInterviewPlanUseCase not initialized");
    return this.finalizeInterviewPlanUseCase;
  }

  // Cleanup
  destroy(): void {
    this.runtimeEngine = null;
    this.audioStreamingOrchestrator = null;
    this.runtimeManagerExtension = null;
    this.eventSynchronizer = null;
    this.runtimeEventEmitter = null;
    this.runtimeManager = null;
    this.runtimeStateMachine = null;
    this.audioStreaming = null;
    this.bufferManager = null;
    this.streamingLifecycle = null;
    this.streamingErrorHandler = null;
    this.webSocketTransport = null;
    this.authManager = null;
    this.sessionManager = null;
    this.eventMapper = null;
    this.errorHandler = null;
    this.audioInputAdapter = null;
    this.audioOutputAdapter = null;
    this.audioDeviceManager = null;
    this.audioPipelineOrchestrator = null;
    this.voiceActivityDetector = null;
    this.bargeInManager = null;
    this.audioInterruptionController = null;
    this.bargeInOrchestrator = null;
    this.runtimeVoiceInterviewConnector = null;
    this.sessionOrchestrator = null;
    this.diagnosticCollector = null;
    this.runtimeInspector = null;
    
    // Cleanup Interview Preparation Engine Components
    this.infrastructureContainer = null;
    this.interviewPlanApplicationService = null;
    this.interviewPlanOrchestrator = null;
    this.generateInterviewPlanUseCase = null;
    this.validateInterviewPlanUseCase = null;
    this.analyzeCompetencyCoverageUseCase = null;
    this.calculateInterviewTimingUseCase = null;
    this.optimizeQuestionOrderUseCase = null;
    this.adjustDifficultyUseCase = null;
    this.generateInterviewSummaryUseCase = null;
    this.previewInterviewPlanUseCase = null;
    this.cloneInterviewPlanUseCase = null;
    this.updateInterviewConstraintsUseCase = null;
    this.finalizeInterviewPlanUseCase = null;
    
    CoreContainer.instance = null;
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const coreContainer = CoreContainer.getInstance();
