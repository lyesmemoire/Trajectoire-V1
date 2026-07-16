/**
 * Runtime Container
 *
 * Dependency injection container for runtime components.
 * Wires components without business logic.
 */

import { ContextBuilder } from "../application/ContextBuilder";
import { DependencyManager } from "../application/DependencyManager";
import { EventPublisher } from "../application/EventPublisher";
import { ExecutionPipeline } from "../application/ExecutionPipeline";

export interface RuntimeContainerOptions {
  contextBuilder?: ContextBuilder;
  dependencyManager?: DependencyManager;
  eventPublisher?: EventPublisher;
  executionPipeline?: ExecutionPipeline;
}

export class RuntimeContainer {
  private contextBuilder: ContextBuilder;
  private dependencyManager: DependencyManager;
  private eventPublisher: EventPublisher;
  private executionPipeline: ExecutionPipeline;

  constructor(options?: RuntimeContainerOptions) {
    this.contextBuilder = options?.contextBuilder ?? new ContextBuilder();
    this.dependencyManager = options?.dependencyManager ?? new DependencyManager();
    this.eventPublisher = options?.eventPublisher ?? new EventPublisher();
    this.executionPipeline = options?.executionPipeline ?? new ExecutionPipeline();
  }

  /**
   * Get ContextBuilder instance
   * @returns ContextBuilder
   */
  getContextBuilder(): ContextBuilder {
    return this.contextBuilder;
  }

  /**
   * Get DependencyManager instance
   * @returns DependencyManager
   */
  getDependencyManager(): DependencyManager {
    return this.dependencyManager;
  }

  /**
   * Get EventPublisher instance
   * @returns EventPublisher
   */
  getEventPublisher(): EventPublisher {
    return this.eventPublisher;
  }

  /**
   * Get ExecutionPipeline instance
   * @returns ExecutionPipeline
   */
  getExecutionPipeline(): ExecutionPipeline {
    return this.executionPipeline;
  }

  /**
   * Create container with default configuration
   * @returns Configured container
   */
  static createDefault(): RuntimeContainer {
    return new RuntimeContainer();
  }

  /**
   * Create container with custom configuration
   * @param options - Container options
   * @returns Configured container
   */
  static create(options: RuntimeContainerOptions): RuntimeContainer {
    return new RuntimeContainer(options);
  }
}
