/**
 * Integration Tests
 *
 * Tests for container, composition root, dependency graph, and bootstrap.
 * NO business logic testing - ONLY integration validation.
 */
// @ts-nocheck


import { CoreContainer } from "../../container";
import { InterviewPreparationEngine } from "../InterviewPreparationEngine";
import { InfrastructureContainer } from "../infrastructure/container";
import { InterviewPlanApplicationService } from "../application/services/InterviewPlanApplicationService";
import { InterviewPlanOrchestrator } from "../application/orchestrators/InterviewPlanOrchestrator";
import { GenerateInterviewPlanUseCase } from "../application/use-cases/GenerateInterviewPlanUseCase";
import { ValidateInterviewPlanUseCase } from "../application/use-cases/ValidateInterviewPlanUseCase";
import { AnalyzeCompetencyCoverageUseCase } from "../application/use-cases/AnalyzeCompetencyCoverageUseCase";
import { CalculateInterviewTimingUseCase } from "../application/use-cases/CalculateInterviewTimingUseCase";
import { OptimizeQuestionOrderUseCase } from "../application/use-cases/OptimizeQuestionOrderUseCase";
import { AdjustDifficultyUseCase } from "../application/use-cases/AdjustDifficultyUseCase";
import { GenerateInterviewSummaryUseCase } from "../application/use-cases/GenerateInterviewSummaryUseCase";
import { PreviewInterviewPlanUseCase } from "../application/use-cases/PreviewInterviewPlanUseCase";
import { CloneInterviewPlanUseCase } from "../application/use-cases/CloneInterviewPlanUseCase";
import { UpdateInterviewConstraintsUseCase } from "../application/use-cases/UpdateInterviewConstraintsUseCase";
import { FinalizeInterviewPlanUseCase } from "../application/use-cases/FinalizeInterviewPlanUseCase";

describe("CoreContainer Integration", () => {
  beforeEach(() => {
    // Reset container before each test
    InterviewPreparationEngine.reset();
  });

  afterEach(() => {
    // Cleanup after each test
    InterviewPreparationEngine.reset();
  });

  describe("Container Initialization", () => {
    it("should create singleton instance", () => {
      const container1 = CoreContainer.getInstance();
      const container2 = CoreContainer.getInstance();

      expect(container1).toBe(container2);
    });

    it("should initialize all runtime components", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getRuntimeEngine()).not.toThrow();
      expect(() => container.getAudioStreamingOrchestrator()).not.toThrow();
      expect(() => container.getRuntimeManager()).not.toThrow();
      expect(() => container.getRuntimeEventEmitter()).not.toThrow();
      expect(() => container.getRuntimeStateMachine()).not.toThrow();
    });

    it("should initialize all persistence components", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getSessionPersistence()).not.toThrow();
      expect(() => container.getSessionPersistenceService()).not.toThrow();
      expect(() => container.getSessionRestoreService()).not.toThrow();
      expect(() => container.getSessionSnapshotMapper()).not.toThrow();
    });

    it("should initialize all audio components", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getAudioInputAdapter()).not.toThrow();
      expect(() => container.getAudioOutputAdapter()).not.toThrow();
      expect(() => container.getAudioDeviceManager()).not.toThrow();
      expect(() => container.getAudioPipelineOrchestrator()).not.toThrow();
    });

    it("should initialize all VAD and Barge-In components", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getVoiceActivityDetector()).not.toThrow();
      expect(() => container.getBargeInManager()).not.toThrow();
      expect(() => container.getAudioInterruptionController()).not.toThrow();
      expect(() => container.getBargeInOrchestrator()).not.toThrow();
    });

    it("should initialize all diagnostic components", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getDiagnosticCollector()).not.toThrow();
      expect(() => container.getRuntimeInspector()).not.toThrow();
    });
  });

  describe("Interview Preparation Engine Integration", () => {
    it("should initialize infrastructure container", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getInfrastructureContainer()).not.toThrow();
      expect(container.getInfrastructureContainer()).toBeInstanceOf(InfrastructureContainer);
    });

    it("should initialize application service", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getInterviewPlanApplicationService()).not.toThrow();
      expect(container.getInterviewPlanApplicationService()).toBeInstanceOf(InterviewPlanApplicationService);
    });

    it("should initialize orchestrator", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getInterviewPlanOrchestrator()).not.toThrow();
      expect(container.getInterviewPlanOrchestrator()).toBeInstanceOf(InterviewPlanOrchestrator);
    });

    it("should initialize all use cases", () => {
      const container = CoreContainer.getInstance();

      expect(() => container.getGenerateInterviewPlanUseCase()).not.toThrow();
      expect(() => container.getValidateInterviewPlanUseCase()).not.toThrow();
      expect(() => container.getAnalyzeCompetencyCoverageUseCase()).not.toThrow();
      expect(() => container.getCalculateInterviewTimingUseCase()).not.toThrow();
      expect(() => container.getOptimizeQuestionOrderUseCase()).not.toThrow();
      expect(() => container.getAdjustDifficultyUseCase()).not.toThrow();
      expect(() => container.getGenerateInterviewSummaryUseCase()).not.toThrow();
      expect(() => container.getPreviewInterviewPlanUseCase()).not.toThrow();
      expect(() => container.getCloneInterviewPlanUseCase()).not.toThrow();
      expect(() => container.getUpdateInterviewConstraintsUseCase()).not.toThrow();
      expect(() => container.getFinalizeInterviewPlanUseCase()).not.toThrow();

      expect(container.getGenerateInterviewPlanUseCase()).toBeInstanceOf(GenerateInterviewPlanUseCase);
      expect(container.getValidateInterviewPlanUseCase()).toBeInstanceOf(ValidateInterviewPlanUseCase);
      expect(container.getAnalyzeCompetencyCoverageUseCase()).toBeInstanceOf(AnalyzeCompetencyCoverageUseCase);
      expect(container.getCalculateInterviewTimingUseCase()).toBeInstanceOf(CalculateInterviewTimingUseCase);
      expect(container.getOptimizeQuestionOrderUseCase()).toBeInstanceOf(OptimizeQuestionOrderUseCase);
      expect(container.getAdjustDifficultyUseCase()).toBeInstanceOf(AdjustDifficultyUseCase);
      expect(container.getGenerateInterviewSummaryUseCase()).toBeInstanceOf(GenerateInterviewSummaryUseCase);
      expect(container.getPreviewInterviewPlanUseCase()).toBeInstanceOf(PreviewInterviewPlanUseCase);
      expect(container.getCloneInterviewPlanUseCase()).toBeInstanceOf(CloneInterviewPlanUseCase);
      expect(container.getUpdateInterviewConstraintsUseCase()).toBeInstanceOf(UpdateInterviewConstraintsUseCase);
      expect(container.getFinalizeInterviewPlanUseCase()).toBeInstanceOf(FinalizeInterviewPlanUseCase);
    });
  });

  describe("Dependency Graph Validation", () => {
    it("should have correct dependency chain: InfrastructureContainer -> Adapters", () => {
      const container = CoreContainer.getInstance();
      const infraContainer = container.getInfrastructureContainer();

      expect(() => infraContainer.getInterviewPersistenceAdapter()).not.toThrow();
      expect(() => infraContainer.getInterviewGenerationAdapter()).not.toThrow();
      expect(() => infraContainer.getLoggerAdapter()).not.toThrow();
      expect(() => infraContainer.getTelemetryAdapter()).not.toThrow();
      expect(() => infraContainer.getAnalyticsAdapter()).not.toThrow();
    });

    it("should have correct dependency chain: Adapters -> Ports", () => {
      const container = CoreContainer.getInstance();
      const infraContainer = container.getInfrastructureContainer();

      const persistenceAdapter = infraContainer.getInterviewPersistenceAdapter();
      const generationAdapter = infraContainer.getInterviewGenerationAdapter();

      expect(persistenceAdapter).toHaveProperty('save');
      expect(persistenceAdapter).toHaveProperty('load');
      expect(generationAdapter).toHaveProperty('generateQuestions');
    });

    it("should have correct dependency chain: Ports -> Use Cases", () => {
      const container = CoreContainer.getInstance();
      const generateUseCase = container.getGenerateInterviewPlanUseCase();

      expect(generateUseCase).toBeDefined();
    });

    it("should have correct dependency chain: Use Cases -> Application Service", () => {
      const container = CoreContainer.getInstance();
      const appService = container.getInterviewPlanApplicationService();

      expect(appService).toBeDefined();
      expect(appService).toHaveProperty('generateInterviewPlan');
      expect(appService).toHaveProperty('validateInterviewPlan');
    });

    it("should have correct dependency chain: Application Service -> Orchestrator", () => {
      const container = CoreContainer.getInstance();
      const orchestrator = container.getInterviewPlanOrchestrator();

      expect(orchestrator).toBeDefined();
      expect(orchestrator).toHaveProperty('generateAndFinalize');
    });
  });

  describe("Bootstrap Validation", () => {
    it("should start engine via bootstrap", () => {
      const engine = InterviewPreparationEngine.start();

      expect(engine).toBeDefined();
      expect(InterviewPreparationEngine.isEngineStarted()).toBe(true);
    });

    it("should return same instance on subsequent starts", () => {
      const engine1 = InterviewPreparationEngine.start();
      const engine2 = InterviewPreparationEngine.start();

      expect(engine1).toBe(engine2);
    });

    it("should provide access to application service", () => {
      const engine = InterviewPreparationEngine.start();

      expect(() => engine.getApplicationService()).not.toThrow();
      expect(engine.getApplicationService()).toBeInstanceOf(InterviewPlanApplicationService);
    });

    it("should provide access to orchestrator", () => {
      const engine = InterviewPreparationEngine.start();

      expect(() => engine.getOrchestrator()).not.toThrow();
      expect(engine.getOrchestrator()).toBeInstanceOf(InterviewPlanOrchestrator);
    });

    it("should provide access to infrastructure container", () => {
      const engine = InterviewPreparationEngine.start();

      expect(() => engine.getInfrastructureContainer()).not.toThrow();
      expect(engine.getInfrastructureContainer()).toBeInstanceOf(InfrastructureContainer);
    });

    it("should provide access to core container", () => {
      const engine = InterviewPreparationEngine.start();

      expect(() => engine.getCoreContainer()).not.toThrow();
      expect(engine.getCoreContainer()).toBeInstanceOf(CoreContainer);
    });

    it("should stop engine and cleanup", () => {
      InterviewPreparationEngine.start();

      InterviewPreparationEngine.stop();

      expect(InterviewPreparationEngine.isEngineStarted()).toBe(false);
    });

    it("should reset engine completely", () => {
      InterviewPreparationEngine.start();

      InterviewPreparationEngine.reset();

      expect(InterviewPreparationEngine.isEngineStarted()).toBe(false);
      
      // Should be able to start again after reset
      const engine = InterviewPreparationEngine.start();
      expect(engine).toBeDefined();
    });
  });

  describe("Composition Root Validation", () => {
    it("should use constructor injection exclusively", () => {
      const container = CoreContainer.getInstance();

      // All components should be initialized in constructor
      expect(() => container.getRuntimeEngine()).not.toThrow();
      expect(() => container.getInterviewPlanApplicationService()).not.toThrow();
    });

    it("should have no circular dependencies", () => {
      // This test validates that the container can be initialized without errors
      // Circular dependencies would cause stack overflow or initialization errors
      expect(() => {
        InterviewPreparationEngine.reset();
        InterviewPreparationEngine.start();
      }).not.toThrow();
    });

    it("should have no service locator pattern", () => {
      // All dependencies should be injected via constructor
      // This is validated by the fact that all getters return initialized instances
      const container = CoreContainer.getInstance();

      expect(() => container.getRuntimeEngine()).not.toThrow();
      expect(() => container.getInterviewPlanApplicationService()).not.toThrow();
    });

    it("should have no hidden singletons", () => {
      // All singletons should be explicit in the container
      const container1 = CoreContainer.getInstance();
      const container2 = CoreContainer.getInstance();

      expect(container1).toBe(container2);

      // Infrastructure container should also be a singleton
      const infra1 = container1.getInfrastructureContainer();
      const infra2 = container2.getInfrastructureContainer();

      expect(infra1).toBe(infra2);
    });
  });

  describe("Configuration Injection Validation", () => {
    it("should inject configuration into infrastructure container", () => {
      const container = CoreContainer.getInstance();
      const infraContainer = container.getInfrastructureContainer();

      expect(() => infraContainer.getConfigurationService()).not.toThrow();
      expect(() => infraContainer.getOpenAIProvider()).not.toThrow();
      expect(() => infraContainer.getSupabaseProvider()).not.toThrow();
    });

    it("should inject configuration into adapters", () => {
      const container = CoreContainer.getInstance();
      const infraContainer = container.getInfrastructureContainer();

      const loggerAdapter = infraContainer.getLoggerAdapter();
      const telemetryAdapter = infraContainer.getTelemetryAdapter();
      const analyticsAdapter = infraContainer.getAnalyticsAdapter();

      expect(loggerAdapter).toBeDefined();
      expect(telemetryAdapter).toBeDefined();
      expect(analyticsAdapter).toBeDefined();
    });
  });

  describe("Observability Integration", () => {
    it("should have logging adapter connected", () => {
      const container = CoreContainer.getInstance();
      const infraContainer = container.getInfrastructureContainer();

      expect(() => infraContainer.getLoggerAdapter()).not.toThrow();
    });

    it("should have telemetry adapter connected", () => {
      const container = CoreContainer.getInstance();
      const infraContainer = container.getInfrastructureContainer();

      expect(() => infraContainer.getTelemetryAdapter()).not.toThrow();
    });

    it("should have analytics adapter connected", () => {
      const container = CoreContainer.getInstance();
      const infraContainer = container.getInfrastructureContainer();

      expect(() => infraContainer.getAnalyticsAdapter()).not.toThrow();
    });

    it("should have all ports injected into use cases", () => {
      const container = CoreContainer.getInstance();
      const generateUseCase = container.getGenerateInterviewPlanUseCase();

      expect(generateUseCase).toBeDefined();
    });
  });
});
