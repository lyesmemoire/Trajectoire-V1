import { ContradictionValidator, ContradictionValidatorContext, ContradictionValidatorResult } from "./ContradictionValidator";
import { MemoryValidatorRegistry } from "../../validators/ValidatorRegistry";

// ===================================================================
// CONTRADICTION VALIDATOR REGISTRY — Specific Registry for Contradiction Validators
// ===================================================================

export class ContradictionValidatorRegistry extends MemoryValidatorRegistry {
  constructor() {
    super();
    this.registerDefaultValidators();
  }

  private registerDefaultValidators(): void {
    this.register(new ContradictionValidator());
  }

  /**
   * Validate using the contradiction validator
   */
  validateContradiction(context: ContradictionValidatorContext): ContradictionValidatorResult {
    const validator = this.get("contradiction-validator") as unknown as ContradictionValidator;
    if (!validator) {
      throw new Error("ContradictionValidator not registered");
    }
    return validator.validate(context);
  }
}
