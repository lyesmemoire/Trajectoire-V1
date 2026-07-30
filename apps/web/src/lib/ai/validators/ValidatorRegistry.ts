// ===================================================================
// VALIDATOR REGISTRY — Central Registry for Validator Injection
// ===================================================================

export interface BaseValidator {
  readonly id: string;
  readonly version?: string;
  validate(context: any): any;
}

export interface ValidatorRegistryConfig {
  validators:	Map<string, BaseValidator>;
}

export interface ValidatorRegistry {
  /**
   * Register a validator
   */
  register(validator: BaseValidator): void;

  /**
   * Register multiple validators
   */
  registerAll(validators: BaseValidator[]): void;

  /**
   * Get a validator by ID
   */
  get(id: string): BaseValidator | undefined;

  /**
   * Get all validators
   */
  getAll(): BaseValidator[];

  /**
   * Get validators by category (if supported by validator)
   */
  getByCategory(category: string): BaseValidator[];

  /**
   * Unregister a validator
   */
  unregister(id: string): void;

  /**
   * Clear all validators
   */
  clear(): void;

  /**
   * Check if a validator exists
   */
  has(id: string): boolean;
}

export class MemoryValidatorRegistry implements ValidatorRegistry {
  private validators: Map<string, BaseValidator> = new Map();

  constructor(config?: ValidatorRegistryConfig) {
    if (config?.validators) {
      for (const validator of config.validators.values()) {
        this.register(validator);
      }
    }
  }

  register(validator: BaseValidator): void {
    if (this.validators.has(validator.id)) {
      throw new Error(`Validator with id ${validator.id} already registered`);
    }
    this.validators.set(validator.id, validator);
  }

  registerAll(validators: BaseValidator[]): void {
    for (const validator of validators) {
      this.register(validator);
    }
  }

  get(id: string): BaseValidator | undefined {
    return this.validators.get(id);
  }

  getAll(): BaseValidator[] {
    return Array.from(this.validators.values());
  }

  getByCategory(category: string): BaseValidator[] {
    return this.getAll().filter(validator => {
      const validatorAny = validator as any;
      return validatorAny.category === category;
    });
  }

  unregister(id: string): void {
    this.validators.delete(id);
  }

  clear(): void {
    this.validators.clear();
  }

  has(id: string): boolean {
    return this.validators.has(id);
  }
}
