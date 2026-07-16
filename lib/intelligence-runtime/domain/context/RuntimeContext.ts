/**
 * RuntimeContext
 *
 * Execution context for AI operations.
 * Stores context data and provides access to dependencies.
 * No business logic, pure data management.
 */

export interface RuntimeContextOptions {
  parent?: RuntimeContext;
  immutable?: boolean;
}

export class RuntimeContext {
  private data: Map<string, unknown>;
  private parent?: RuntimeContext;
  private readonly immutable: boolean;

  constructor(options?: RuntimeContextOptions) {
    this.data = new Map();
    this.parent = options?.parent;
    this.immutable = options?.immutable ?? false;
  }

  /**
   * Get context value
   * @param key - Context key
   * @returns Context value or undefined if not found
   */
  get<T>(key: string): T | undefined {
    const value = this.data.get(key);
    if (value !== undefined) {
      return value as T;
    }
    return this.parent?.get<T>(key);
  }

  /**
   * Set context value
   * @param key - Context key
   * @param value - Context value
   */
  set<T>(key: string, value: T): void {
    if (this.immutable) {
      throw new Error("Cannot set value on immutable context");
    }
    this.data.set(key, value);
  }

  /**
   * Check if context has key
   * @param key - Context key
   * @returns True if key exists
   */
  has(key: string): boolean {
    if (this.data.has(key)) {
      return true;
    }
    return this.parent?.has(key) ?? false;
  }

  /**
   * Get all context keys
   * @returns Context keys
   */
  keys(): string[] {
    const parentKeys = this.parent?.keys() ?? [];
    const currentKeys = Array.from(this.data.keys());
    const allKeys = Array.from(new Set([...parentKeys, ...currentKeys]));
    return allKeys;
  }

  /**
   * Clear all context
   */
  clear(): void {
    if (this.immutable) {
      throw new Error("Cannot clear immutable context");
    }
    this.data.clear();
  }

  /**
   * Create child context
   * @returns Child context
   */
  child(): RuntimeContext {
    return new RuntimeContext({
      parent: this,
      immutable: this.immutable,
    });
  }

  /**
   * Get context size
   * @returns Number of keys
   */
  size(): number {
    return this.keys().length;
  }

  /**
   * Check if context is empty
   * @returns True if context is empty
   */
  isEmpty(): boolean {
    return this.size() === 0;
  }
}
