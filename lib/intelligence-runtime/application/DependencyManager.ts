/**
 * DependencyManager
 *
 * Manages runtime dependencies and service resolution.
 * No AI logic, pure dependency management.
 */

export interface Dependency {
  name: string;
  factory: () => unknown;
  singleton?: boolean;
}

export interface DependencyManagerOptions {
  dependencies?: Dependency[];
}

export class DependencyManager {
  private dependencies: Map<string, Dependency>;
  private instances: Map<string, unknown>;

  constructor(options?: DependencyManagerOptions) {
    this.dependencies = new Map();
    this.instances = new Map();

    for (const dep of options?.dependencies ?? []) {
      this.register(dep);
    }
  }

  /**
   * Register a dependency
   * @param dependency - Dependency to register
   */
  register(dependency: Dependency): void {
    this.dependencies.set(dependency.name, dependency);
  }

  /**
   * Resolve a dependency
   * @param name - Dependency name
   * @returns Resolved dependency
   */
  resolve<T>(name: string): T {
    const dependency = this.dependencies.get(name);
    if (!dependency) {
      throw new Error(`Dependency '${name}' not found`);
    }

    if (dependency.singleton) {
      if (!this.instances.has(name)) {
        this.instances.set(name, dependency.factory());
      }
      return this.instances.get(name) as T;
    }

    return dependency.factory() as T;
  }

  /**
   * Check if dependency is registered
   * @param name - Dependency name
   * @returns True if registered
   */
  has(name: string): boolean {
    return this.dependencies.has(name);
  }

  /**
   * Get all registered dependency names
   * @returns Dependency names
   */
  names(): string[] {
    return Array.from(this.dependencies.keys());
  }

  /**
   * Clear all instances (for testing)
   */
  clearInstances(): void {
    this.instances.clear();
  }
}
