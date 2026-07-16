/**
 * InterviewPreparationEngine
 *
 * Bootstrap entry point for the Interview Preparation Engine.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY initialization and startup.
 *
 * This is the single entry point for starting the engine.
 * Call InterviewPreparationEngine.start() to initialize all components.
 */

import { CoreContainer } from "../container";
import { InterviewPlanApplicationService } from "./application/services/InterviewPlanApplicationService";
import { InterviewPlanOrchestrator } from "./application/orchestrators/InterviewPlanOrchestrator";
import { InfrastructureContainer } from "./infrastructure/container";

export class InterviewPreparationEngine {
  private static instance: InterviewPreparationEngine | null = null;
  private static isStarted = false;

  private readonly coreContainer: CoreContainer;
  private readonly infrastructureContainer: InfrastructureContainer;
  private readonly applicationService: InterviewPlanApplicationService;
  private readonly orchestrator: InterviewPlanOrchestrator;

  private constructor() {
    this.coreContainer = CoreContainer.getInstance();
    this.infrastructureContainer = this.coreContainer.getInfrastructureContainer();
    this.applicationService = this.coreContainer.getInterviewPlanApplicationService();
    this.orchestrator = this.coreContainer.getInterviewPlanOrchestrator();
  }

  /**
   * Start the Interview Preparation Engine
   * Initializes all components and dependencies through the composition root
   */
  static start(): InterviewPreparationEngine {
    if (InterviewPreparationEngine.isStarted && InterviewPreparationEngine.instance) {
      return InterviewPreparationEngine.instance;
    }

    InterviewPreparationEngine.instance = new InterviewPreparationEngine();
    InterviewPreparationEngine.isStarted = true;

    return InterviewPreparationEngine.instance;
  }

  /**
   * Get the application service for interview plan operations
   */
  getApplicationService(): InterviewPlanApplicationService {
    return this.applicationService;
  }

  /**
   * Get the orchestrator for coordinated operations
   */
  getOrchestrator(): InterviewPlanOrchestrator {
    return this.orchestrator;
  }

  /**
   * Get the infrastructure container
   */
  getInfrastructureContainer(): InfrastructureContainer {
    return this.infrastructureContainer;
  }

  /**
   * Get the core container
   */
  getCoreContainer(): CoreContainer {
    return this.coreContainer;
  }

  /**
   * Check if the engine is started
   */
  static isEngineStarted(): boolean {
    return InterviewPreparationEngine.isStarted;
  }

  /**
   * Stop the engine and cleanup resources
   */
  static stop(): void {
    if (InterviewPreparationEngine.instance) {
      InterviewPreparationEngine.instance = null;
      InterviewPreparationEngine.isStarted = false;
    }
  }

  /**
   * Reset the engine (useful for testing)
   */
  static reset(): void {
    InterviewPreparationEngine.stop();
    CoreContainer.getInstance().destroy();
    InfrastructureContainer.reset();
  }
}
