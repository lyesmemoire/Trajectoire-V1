// ===================================================================
// RUNTIME CONTAINER — Dependency Injection for Runtime
// ===================================================================

import { FactRepository } from "../../lib/ai/repositories/FactRepository";
import { MemoryFactRepository } from "../../lib/ai/repositories/MemoryFactRepository";
import { SnapshotRepository } from "../../lib/ai/repositories/SnapshotRepository";
import { MemorySnapshotRepository } from "../../lib/ai/repositories/MemorySnapshotRepository";
import { EventStore } from "../../lib/ai/repositories/EventStore";
import { MemoryEventStore } from "../../lib/ai/repositories/MemoryEventStore";
import { MemoryPolicyRegistry, PolicyRegistry } from "../../lib/ai/policies/PolicyRegistry";
import { MemoryValidatorRegistry, ValidatorRegistry } from "../../lib/ai/validators/ValidatorRegistry";
import { MemoryPromptRegistry, PromptRegistry } from "../../lib/ai/prompts/PromptRegistry";
import { MemoryCatalogProvider, CatalogProvider } from "../../lib/ai/catalogs/CatalogProvider";
import { RuntimeMetricsAggregator } from "./global-execution-graph/RuntimeMetricsAggregator";
import { ContradictionPolicyRegistry } from "../../lib/ai/engines/contradiction/policies/ContradictionPolicyRegistry";
import { ContradictionValidatorRegistry } from "../../lib/ai/engines/contradiction/ContradictionValidatorRegistry";
import { ContradictionCatalogProvider } from "../../lib/ai/catalogs/ContradictionCatalogProvider";

export interface RuntimeServices {
  // Repositories
  factRepository: FactRepository;
  snapshotRepository: SnapshotRepository;
  eventStore: EventStore;

  // Registries
  policyRegistry: PolicyRegistry;
  validatorRegistry: ValidatorRegistry;
  promptRegistry: PromptRegistry;
  catalogProvider: CatalogProvider;

  // Metrics
  metricsAggregator: RuntimeMetricsAggregator;

  // Specific registries
  contradictionPolicyRegistry: ContradictionPolicyRegistry;
  contradictionValidatorRegistry: ContradictionValidatorRegistry;
  contradictionCatalogProvider: ContradictionCatalogProvider;
}

export interface RuntimeContainer {
  /**
   * Get a service by key
   */
  get<T>(key: string): T;

  /**
   * Register a service
   */
  register<T>(key: string, service: T): void;

  /**
   * Check if a service exists
   */
  has(key: string): boolean;

  /**
   * Get all runtime services
   */
  getServices(): RuntimeServices;

  /**
   * Initialize the container with default services
   */
  initialize(): void;

  /**
   * Clear all services
   */
  clear(): void;
}

export class MemoryRuntimeContainer implements RuntimeContainer {
  private services: Map<string, unknown> = new Map();
  private runtimeServices: RuntimeServices | null = null;

  constructor() {
    this.initialize();
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found in container`);
    }
    return service as T;
  }

  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  has(key: string): boolean {
    return this.services.has(key);
  }

  getServices(): RuntimeServices {
    if (!this.runtimeServices) {
      throw new Error("Runtime services not initialized");
    }
    return this.runtimeServices;
  }

  initialize(): void {
    // Repositories
    const factRepository = new MemoryFactRepository();
    const snapshotRepository = new MemorySnapshotRepository();
    const eventStore = new MemoryEventStore();

    // Registries
    const policyRegistry = new MemoryPolicyRegistry();
    const validatorRegistry = new MemoryValidatorRegistry();
    const promptRegistry = new MemoryPromptRegistry();
    const catalogProvider = new MemoryCatalogProvider();

    // Metrics
    const metricsAggregator = new RuntimeMetricsAggregator();

    // Specific registries
    const contradictionPolicyRegistry = new ContradictionPolicyRegistry();
    const contradictionValidatorRegistry = new ContradictionValidatorRegistry();
    const contradictionCatalogProvider = new ContradictionCatalogProvider();

    // Register all services
    this.register("factRepository", factRepository);
    this.register("snapshotRepository", snapshotRepository);
    this.register("eventStore", eventStore);
    this.register("policyRegistry", policyRegistry);
    this.register("validatorRegistry", validatorRegistry);
    this.register("promptRegistry", promptRegistry);
    this.register("catalogProvider", catalogProvider);
    this.register("metricsAggregator", metricsAggregator);
    this.register("contradictionPolicyRegistry", contradictionPolicyRegistry);
    this.register("contradictionValidatorRegistry", contradictionValidatorRegistry);
    this.register("contradictionCatalogProvider", contradictionCatalogProvider);

    // Build runtime services object
    this.runtimeServices = {
      factRepository,
      snapshotRepository,
      eventStore,
      policyRegistry,
      validatorRegistry,
      promptRegistry,
      catalogProvider,
      metricsAggregator,
      contradictionPolicyRegistry,
      contradictionValidatorRegistry,
      contradictionCatalogProvider,
    };
  }

  clear(): void {
    this.services.clear();
    this.runtimeServices = null;
  }
}
