// ===================================================================
// POLICY REGISTRY — Central Registry for Policy Injection
// ===================================================================

export interface BasePolicy {
  readonly id: string;
  readonly version?: string;
  evaluate(context: any): any;
}

export interface PolicyRegistryConfig {
  policies: Map<string, BasePolicy>;
}

export interface PolicyRegistry {
  /**
   * Register a policy
   */
  register(policy: BasePolicy): void;

  /**
   * Register multiple policies
   */
  registerAll(policies: BasePolicy[]): void;

  /**
   * Get a policy by ID
   */
  get(id: string): BasePolicy | undefined;

  /**
   * Get all policies
   */
  getAll(): BasePolicy[];

  /**
   * Get policies by category (if supported by policy)
   */
  getByCategory(category: string): BasePolicy[];

  /**
   * Unregister a policy
   */
  unregister(id: string): void;

  /**
   * Clear all policies
   */
  clear(): void;

  /**
   * Check if a policy exists
   */
  has(id: string): boolean;
}

export class MemoryPolicyRegistry implements PolicyRegistry {
  private policies: Map<string, BasePolicy> = new Map();

  constructor(config?: PolicyRegistryConfig) {
    if (config?.policies) {
      for (const policy of config.policies.values()) {
        this.register(policy);
      }
    }
  }

  register(policy: BasePolicy): void {
    if (this.policies.has(policy.id)) {
      throw new Error(`Policy with id ${policy.id} already registered`);
    }
    this.policies.set(policy.id, policy);
  }

  registerAll(policies: BasePolicy[]): void {
    for (const policy of policies) {
      this.register(policy);
    }
  }

  get(id: string): BasePolicy | undefined {
    return this.policies.get(id);
  }

  getAll(): BasePolicy[] {
    return Array.from(this.policies.values());
  }

  getByCategory(category: string): BasePolicy[] {
    return this.getAll().filter(policy => {
      const policyAny = policy as any;
      return policyAny.category === category;
    });
  }

  unregister(id: string): void {
    this.policies.delete(id);
  }

  clear(): void {
    this.policies.clear();
  }

  has(id: string): boolean {
    return this.policies.has(id);
  }
}
