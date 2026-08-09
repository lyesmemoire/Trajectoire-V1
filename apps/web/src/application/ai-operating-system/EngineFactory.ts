import { RuntimeServices } from "./RuntimeContainer";

// ===================================================================
// ENGINE FACTORY — Creates Engines via RuntimeContainer
// ===================================================================

export interface EngineFactoryConfig {
  runtimeServices: RuntimeServices;
}

export class EngineFactory {
  constructor(private config: EngineFactoryConfig) {}

  /**
   * Create EvidenceEngine with injected dependencies
   */
  createEvidenceEngine(): any {
    const { policyRegistry } = this.config.runtimeServices;
    const { EvidenceEngine } = require("../../lib/ai/engines/EvidenceEngine");
    return new EvidenceEngine(policyRegistry);
  }

  /**
   * Create ContradictionEngine with injected dependencies
   */
  createContradictionEngine(): any {
    const { policyRegistry, validatorRegistry } = this.config.runtimeServices;
    const { ContradictionEngine } = require("../../lib/ai/engines/ContradictionEngine");
    const { ContradictionPolicyRegistry } = require("../../lib/ai/engines/contradiction/policies/ContradictionPolicyRegistry");
    const { ContradictionValidatorRegistry } = require("../../lib/ai/engines/contradiction/ContradictionValidatorRegistry");
    
    const contradictionPolicyRegistry = new ContradictionPolicyRegistry();
    const contradictionValidatorRegistry = new ContradictionValidatorRegistry();
    
    return new ContradictionEngine(
      contradictionPolicyRegistry,
      contradictionValidatorRegistry
    );
  }

  /**
   * Create TemporalEngine with injected dependencies
   */
  createTemporalEngine(): any {
    const { catalogProvider } = this.config.runtimeServices;
    const { TemporalExtractor } = require("../../lib/ai/engines/temporal/TemporalExtractor");
    const { TemporalExtractionValidator } = require("../../lib/ai/engines/temporal/TemporalExtractionValidator");
    const { TemporalCatalogProvider } = require("../../lib/ai/catalogs/TemporalCatalogProvider");
    
    const temporalCatalogProvider = catalogProvider || new TemporalCatalogProvider();
    const temporalValidator = new TemporalExtractionValidator(temporalCatalogProvider);
    
    return new TemporalExtractor(temporalValidator, "1.0.0", "internal");
  }

  /**
   * Create engine by ID
   */
  createEngine(engineId: string): any {
    switch (engineId) {
      case "evidence":
        return this.createEvidenceEngine();
      case "contradiction":
        return this.createContradictionEngine();
      case "temporal":
        return this.createTemporalEngine();
      default:
        throw new Error(`Unknown engine ID: ${engineId}`);
    }
  }

  /**
   * Create complete pipeline
   */
  createPipeline(): any[] {
    return [
      this.createEvidenceEngine(),
      this.createContradictionEngine(),
      this.createTemporalEngine(),
    ];
  }

  /**
   * Create pipeline by engine IDs
   */
  createPipelineByIds(engineIds: string[]): any[] {
    return engineIds.map(id => this.createEngine(id));
  }
}
