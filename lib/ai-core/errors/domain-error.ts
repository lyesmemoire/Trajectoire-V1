/**
 * AI Domain Standard - Base Error Classes
 * 
 * Common error abstractions for all AI domains.
 * Follows the Rule of Three: extracted from Career Copilot and Interview.
 */

export abstract class DomainError extends Error {
  protected constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, code: string = "VALIDATION_ERROR") {
    super(message, code);
  }
}

export class ProviderError extends DomainError {
  constructor(message: string, code: string = "PROVIDER_ERROR") {
    super(message, code);
  }
}
