// ===================================================================
// PIPELINE VALIDATOR — Validates Engine Pipeline Compatibility
// ===================================================================

export interface EngineCapability {
  engineId: string;
  engineVersion: string;
  produces: string[];
  consumes: string[];
}

export interface PipelineValidationResult {
  isValid: boolean;
  errors: PipelineValidationError[];
  warnings: PipelineValidationWarning[];
}

export interface PipelineValidationError {
  type: "missing_producer" | "missing_consumer" | "version_mismatch" | "circular_dependency";
  engineId: string;
  factType: string;
  message: string;
}

export interface PipelineValidationWarning {
  type: "unused_producer" | "optional_consumer";
  engineId: string;
  factType: string;
  message: string;
}

export class PipelineValidator {
  /**
   * Validate a pipeline of engines for compatibility
   */
  validatePipeline(engines: EngineCapability[]): PipelineValidationResult {
    const errors: PipelineValidationError[] = [];
    const warnings: PipelineValidationWarning[] = [];

    // Build a map of all produced fact types
    const producedFacts = new Map<string, string[]>();
    for (const engine of engines) {
      for (const factType of engine.produces) {
        if (!producedFacts.has(factType)) {
          producedFacts.set(factType, []);
        }
        producedFacts.get(factType)!.push(engine.engineId);
      }
    }

    // Check that all consumed facts are produced
    for (const engine of engines) {
      for (const factType of engine.consumes) {
        const producers = producedFacts.get(factType);
        if (!producers || producers.length === 0) {
          errors.push({
            type: "missing_producer",
            engineId: engine.engineId,
            factType,
            message: `Engine ${engine.engineId} consumes ${factType} but no engine produces it`,
          });
        }
      }
    }

    // Check for unused producers (warnings)
    for (const [factType, producers] of producedFacts) {
      const isConsumed = engines.some(e => e.consumes.includes(factType));
      if (!isConsumed) {
        for (const producer of producers) {
          warnings.push({
            type: "unused_producer",
            engineId: producer,
            factType,
            message: `Engine ${producer} produces ${factType} but no engine consumes it`,
          });
        }
      }
    }

    // Check for circular dependencies (simple check)
    const dependencyGraph = this.buildDependencyGraph(engines);
    const cycles = this.detectCycles(dependencyGraph);
    for (const cycle of cycles) {
      for (const engineId of cycle) {
        errors.push({
          type: "circular_dependency",
          engineId,
          factType: "cycle",
          message: `Circular dependency detected: ${cycle.join(" -> ")}`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Build a dependency graph from engines
   */
  private buildDependencyGraph(engines: EngineCapability[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    for (const engine of engines) {
      const dependencies: string[] = [];
      
      for (const factType of engine.consumes) {
        const producers = engines.filter(e => e.produces.includes(factType));
        for (const producer of producers) {
          if (producer.engineId !== engine.engineId) {
            dependencies.push(producer.engineId);
          }
        }
      }
      
      graph.set(engine.engineId, dependencies);
    }
    
    return graph;
  }

  /**
   * Detect cycles in a dependency graph using DFS
   */
  private detectCycles(graph: Map<string, string[]>): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    const dfs = (node: string): boolean => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) {
            return true;
          }
        } else if (recursionStack.has(neighbor)) {
          // Found a cycle
          const cycleStart = path.indexOf(neighbor);
          const cycle = path.slice(cycleStart).concat(neighbor);
          cycles.push(cycle);
          return true;
        }
      }

      path.pop();
      recursionStack.delete(node);
      return false;
    };

    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }

    return cycles;
  }

  /**
   * Validate a single engine's capabilities
   */
  validateEngine(engine: EngineCapability, allEngines: EngineCapability[]): PipelineValidationResult {
    const errors: PipelineValidationError[] = [];
    const warnings: PipelineValidationWarning[] = [];

    // Check that all consumed facts are produced by some engine
    const allProduced = new Set<string>();
    for (const e of allEngines) {
      for (const factType of e.produces) {
        allProduced.add(factType);
      }
    }

    for (const factType of engine.consumes) {
      if (!allProduced.has(factType)) {
        errors.push({
          type: "missing_producer",
          engineId: engine.engineId,
          factType,
          message: `Engine ${engine.engineId} consumes ${factType} but no engine produces it`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
