/**
 * Provider Runtime Manager
 *
 * Responsibilities:
 * - Manage runtime provider lifecycle
 * - Coordinate provider activation/deactivation
 * - Coordinate provider switching
 * - Coordinate provider failover
 * - Coordinate retry policies
 * - Coordinate health monitoring
 * - Coordinate circuit breaker
 * - Coordinate provider warm-up
 * - Coordinate provider shutdown
 * - Coordinate load balancing
 * - Coordinate priority resolution
 * - Coordinate timeout management
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY runtime coordination
 */

import {
  Provider,
  ProviderType,
  ProviderRequirements
} from "../ProviderAbstractionLayer";
import {
  RuntimeEngine,
  RuntimeState,
  RuntimeEvent,
  RuntimeMetrics
} from "./RuntimeEngine";

// ============================================================================
// RUNTIME MANAGER INTERFACE
// ============================================================================

export interface RuntimeManager {
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  selectProvider(type: ProviderType, requirements: ProviderRequirements): Provider | null;
  activateProvider(providerId: string): Promise<void>;
  deactivateProvider(providerId: string): Promise<void>;
  switchProvider(fromId: string, toId: string): Promise<void>;
  failoverProvider(providerId: string): Promise<void>;
  getActiveProvider(type: ProviderType): Provider | null;
  getRuntimeState(): RuntimeState;
  getRuntimeMetrics(): RuntimeMetrics;
  subscribeToEvents(callback: (event: RuntimeEvent) => void): void;
}

// ============================================================================
// RUNTIME MANAGER IMPLEMENTATION
// ============================================================================

export class RuntimeManagerImpl implements RuntimeManager {
  private runtimeEngine: RuntimeEngine;
  private eventCallbacks: Array<(event: RuntimeEvent) => void> = [];

  constructor(runtimeEngine: RuntimeEngine) {
    this.runtimeEngine = runtimeEngine;
  }

  async initialize(): Promise<void> {
    await this.runtimeEngine.initialize();
    this.emitEvent("RuntimeInitializing");
    this.emitEvent("RuntimeInitialized");
  }

  async start(): Promise<void> {
    await this.runtimeEngine.start();
    this.emitEvent("RuntimeStarting");
    this.emitEvent("RuntimeStarted");
  }

  async stop(): Promise<void> {
    this.emitEvent("RuntimeShuttingDown");
    await this.runtimeEngine.stop();
    this.emitEvent("RuntimeShutdown");
  }

  selectProvider(type: ProviderType, requirements: ProviderRequirements): Provider | null {
    return this.runtimeEngine.selectProvider(type, requirements);
  }

  async activateProvider(providerId: string): Promise<void> {
    await this.runtimeEngine.activateProvider(providerId);
  }

  async deactivateProvider(providerId: string): Promise<void> {
    await this.runtimeEngine.deactivateProvider(providerId);
  }

  async switchProvider(fromId: string, toId: string): Promise<void> {
    this.emitEvent("RuntimeSwitching");
    await this.runtimeEngine.switchProvider(fromId, toId);
    this.emitEvent("RuntimeSwitched");
  }

  async failoverProvider(providerId: string): Promise<void> {
    this.emitEvent("RuntimeFailingOver");
    await this.runtimeEngine.failoverProvider(providerId);
    this.emitEvent("RuntimeFailedOver");
  }

  getActiveProvider(type: ProviderType): Provider | null {
    return this.runtimeEngine.getActiveProvider(type);
  }

  getRuntimeState(): RuntimeState {
    return this.runtimeEngine.getRuntimeState();
  }

  getRuntimeMetrics(): RuntimeMetrics {
    return this.runtimeEngine.getRuntimeMetrics();
  }

  subscribeToEvents(callback: (event: RuntimeEvent) => void): void {
    this.eventCallbacks.push(callback);
  }

  // ============================================================================
  // EVENT EMISSION
  // ============================================================================

  private emitEvent(event: RuntimeEvent): void {
    this.eventCallbacks.forEach(callback => callback(event));
  }

  // ============================================================================
  // CIRCUIT BREAKER MANAGEMENT
  // ============================================================================

  openCircuitBreaker(): void {
    this.emitEvent("RuntimeCircuitBreakerOpening");
    this.runtimeEngine.openCircuitBreaker();
    this.emitEvent("RuntimeCircuitBreakerOpened");
  }

  closeCircuitBreaker(): void {
    this.emitEvent("RuntimeCircuitBreakerClosing");
    this.runtimeEngine.closeCircuitBreaker();
    this.emitEvent("RuntimeCircuitBreakerClosed");
  }

  isCircuitBreakerOpen(): boolean {
    return this.runtimeEngine.isCircuitBreakerOpen();
  }

  // ============================================================================
  // PROVIDER MANAGEMENT
  // ============================================================================

  registerProvider(provider: Provider): void {
    this.runtimeEngine.registerProvider(provider);
  }

  unregisterProvider(providerId: string): void {
    this.runtimeEngine.unregisterProvider(providerId);
  }

  getAllProviders(): Provider[] {
    return this.runtimeEngine.getAllProviders();
  }
}
