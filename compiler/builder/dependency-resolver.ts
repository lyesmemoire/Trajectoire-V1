/**
 * Blueprint DSL Dependency Resolver
 * 
 * Resolves dependencies between modules and packages.
 */

export interface Dependency {
  name: string;
  version: string;
  source: 'local' | 'registry' | 'git';
  path?: string;
  url?: string;
  resolved: boolean;
}

export interface DependencyGraph {
  nodes: Map<string, Dependency>;
  edges: Map<string, Set<string>>;
}

export interface ResolutionResult {
  resolved: Dependency[];
  unresolved: Dependency[];
  conflicts: DependencyConflict[];
  success: boolean;
}

export interface DependencyConflict {
  dependency: string;
  versions: string[];
  reason: string;
}

export class DependencyResolver {
  private dependencyGraph: DependencyGraph;
  private resolvedDependencies: Map<string, Dependency> = new Map();

  constructor() {
    this.dependencyGraph = {
      nodes: new Map(),
      edges: new Map(),
    };
  }

  /**
   * Resolve dependencies
   */
  public resolve(dependencies: Dependency[]): ResolutionResult {
    const unresolved: Dependency[] = [];
    const conflicts: DependencyConflict[] = [];

    // Build dependency graph
    this.buildGraph(dependencies);

    // Resolve dependencies
    for (const dependency of dependencies) {
      const result = this.resolveDependency(dependency);
      
      if (result) {
        this.resolvedDependencies.set(dependency.name, result);
      } else {
        unresolved.push(dependency);
      }
    }

    // Check for conflicts
    const conflictList = this.detectConflicts();
    conflicts.push(...conflictList);

    return {
      resolved: Array.from(this.resolvedDependencies.values()),
      unresolved,
      conflicts,
      success: unresolved.length === 0 && conflicts.length === 0,
    };
  }

  /**
   * Build dependency graph
   */
  private buildGraph(dependencies: Dependency[]): void {
    for (const dependency of dependencies) {
      this.dependencyGraph.nodes.set(dependency.name, dependency);
      
      if (!this.dependencyGraph.edges.has(dependency.name)) {
        this.dependencyGraph.edges.set(dependency.name, new Set());
      }
    }
  }

  /**
   * Resolve a single dependency
   */
  private resolveDependency(dependency: Dependency): Dependency | null {
    // Check if already resolved
    if (this.resolvedDependencies.has(dependency.name)) {
      return this.resolvedDependencies.get(dependency.name)!;
    }

    // Resolve based on source
    switch (dependency.source) {
      case 'local':
        return this.resolveLocalDependency(dependency);
      case 'registry':
        return this.resolveRegistryDependency(dependency);
      case 'git':
        return this.resolveGitDependency(dependency);
      default:
        return null;
    }
  }

  /**
   * Resolve a local dependency
   */
  private resolveLocalDependency(dependency: Dependency): Dependency | null {
    if (!dependency.path) {
      return null;
    }

    // Check if the path exists
    // In a real implementation, this would check the file system
    const resolved: Dependency = {
      ...dependency,
      resolved: true,
    };

    return resolved;
  }

  /**
   * Resolve a registry dependency
   */
  private resolveRegistryDependency(dependency: Dependency): Dependency | null {
    // In a real implementation, this would query the package registry
    const resolved: Dependency = {
      ...dependency,
      resolved: true,
    };

    return resolved;
  }

  /**
   * Resolve a git dependency
   */
  private resolveGitDependency(dependency: Dependency): Dependency | null {
    if (!dependency.url) {
      return null;
    }

    // In a real implementation, this would clone the git repository
    const resolved: Dependency = {
      ...dependency,
      resolved: true,
    };

    return resolved;
  }

  /**
   * Detect conflicts in dependencies
   */
  private detectConflicts(): DependencyConflict[] {
    const conflicts: DependencyConflict[] = [];
    const versionMap: Map<string, Set<string>> = new Map();

    // Group dependencies by name
    for (const [name, dependency] of this.dependencyGraph.nodes) {
      if (!versionMap.has(name)) {
        versionMap.set(name, new Set());
      }
      versionMap.get(name)!.add(dependency.version);
    }

    // Check for version conflicts
    for (const [name, versions] of versionMap) {
      if (versions.size > 1) {
        conflicts.push({
          dependency: name,
          versions: Array.from(versions),
          reason: 'Multiple versions required',
        });
      }
    }

    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies();
    for (const cycle of circularDeps) {
      for (const dep of cycle) {
        conflicts.push({
          dependency: dep,
          versions: [''],
          reason: 'Circular dependency detected',
        });
      }
    }

    return conflicts;
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    for (const node of this.dependencyGraph.nodes.keys()) {
      if (!visited.has(node)) {
        const cycle = this.detectCycle(node, visited, visiting, []);
        if (cycle.length > 0) {
          cycles.push(cycle);
        }
      }
    }

    return cycles;
  }

  /**
   * Detect a cycle starting from a node
   */
  private detectCycle(
    node: string,
    visited: Set<string>,
    visiting: Set<string>,
    path: string[]
  ): string[] {
    visiting.add(node);
    path.push(node);

    const dependencies = this.dependencyGraph.edges.get(node) || new Set();
    
    for (const dep of dependencies) {
      if (visiting.has(dep)) {
        // Found a cycle
        const cycleStart = path.indexOf(dep);
        return path.slice(cycleStart);
      }

      if (!visited.has(dep)) {
        const cycle = this.detectCycle(dep, visited, visiting, path);
        if (cycle.length > 0) {
          return cycle;
        }
      }
    }

    visiting.delete(node);
    path.pop();
    visited.add(node);

    return [];
  }

  /**
   * Get the topological order of dependencies
   */
  public getTopologicalOrder(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    for (const node of this.dependencyGraph.nodes.keys()) {
      if (!visited.has(node)) {
        this.visit(node, visited, temp, order);
      }
    }

    return order.reverse();
  }

  /**
   * Visit a node for topological sort
   */
  private visit(
    node: string,
    visited: Set<string>,
    temp: Set<string>,
    order: string[]
  ): void {
    if (temp.has(node)) {
      // Cycle detected
      return;
    }

    if (visited.has(node)) {
      return;
    }

    temp.add(node);

    const dependencies = this.dependencyGraph.edges.get(node) || new Set();
    for (const dep of dependencies) {
      this.visit(dep, visited, temp, order);
    }

    temp.delete(node);
    visited.add(node);
    order.push(node);
  }

  /**
   * Clear the resolver state
   */
  public clear(): void {
    this.dependencyGraph = {
      nodes: new Map(),
      edges: new Map(),
    };
    this.resolvedDependencies.clear();
  }

  /**
   * Get dependency statistics
   */
  public getStatistics(): {
    totalDependencies: number;
    resolvedDependencies: number;
    unresolvedDependencies: number;
    circularDependencies: number;
  } {
    const circularDeps = this.detectCircularDependencies();

    return {
      totalDependencies: this.dependencyGraph.nodes.size,
      resolvedDependencies: this.resolvedDependencies.size,
      unresolvedDependencies: this.dependencyGraph.nodes.size - this.resolvedDependencies.size,
      circularDependencies: circularDeps.length,
    };
  }
}
