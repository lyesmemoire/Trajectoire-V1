// ===================================================================
// ENGINE CAPABILITY — Contract Verification Between Engines
// ===================================================================

export interface EngineCapability {
  engineId: string;
  version: string;
  produces: string[];
  consumes: string[];
}

export interface ContractViolation {
  engineId: string;
  violation: string;
  expected: string;
  actual: string;
}

export class EngineCapabilityRegistry {
  private capabilities: Map<string, EngineCapability> = new Map();

  register(capability: EngineCapability): void {
    this.capabilities.set(capability.engineId, capability);
  }

  get(engineId: string): EngineCapability | undefined {
    return this.capabilities.get(engineId);
  }

  verifyChain(engineIds: string[]): ContractViolation[] {
    const violations: ContractViolation[] = [];

    for (let i = 0; i < engineIds.length - 1; i++) {
      const currentEngine = this.capabilities.get(engineIds[i]);
      const nextEngine = this.capabilities.get(engineIds[i + 1]);

      if (!currentEngine || !nextEngine) {
        violations.push({
          engineId: engineIds[i + 1],
          violation: "Engine not registered in capability registry",
          expected: "Registered engine",
          actual: "Unknown engine",
        });
        continue;
      }

      // Check if current engine produces what next engine consumes
      const missingInputs = nextEngine.consumes.filter(
        (required) => !currentEngine.produces.includes(required)
      );

      if (missingInputs.length > 0) {
        violations.push({
          engineId: nextEngine.engineId,
          violation: "Missing required inputs from previous engine",
          expected: missingInputs.join(", "),
          actual: currentEngine.produces.join(", "),
        });
      }
    }

    return violations;
  }

  getAll(): EngineCapability[] {
    return Array.from(this.capabilities.values());
  }
}
