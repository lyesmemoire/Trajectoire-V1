/**
 * lib/intelligence-runtime
 *
 * Runtime capabilities for Intelligence Engines.
 * Provides context building, dependency management, event publishing, and execution pipeline.
 * No business logic, pure runtime capabilities.
 */

// Domain
export { RuntimeContext } from "./domain/context/RuntimeContext";
export type { RuntimeContextOptions } from "./domain/context/RuntimeContext";

// Application
export { ContextBuilder } from "./application/ContextBuilder";
export type { ContextSource, ContextBuilderOptions } from "./application/ContextBuilder";

export { DependencyManager } from "./application/DependencyManager";
export type { Dependency, DependencyManagerOptions } from "./application/DependencyManager";

export { EventPublisher } from "./application/EventPublisher";
export type { EventHandler, EventSubscription, EventPublisherOptions } from "./application/EventPublisher";

export { ExecutionPipeline } from "./application/ExecutionPipeline";
export type { ExecutionStage, ExecutionMiddleware, PipelineOptions } from "./application/ExecutionPipeline";

// Composition
export { RuntimeContainer } from "./composition/runtime-container";
export type { RuntimeContainerOptions } from "./composition/runtime-container";
