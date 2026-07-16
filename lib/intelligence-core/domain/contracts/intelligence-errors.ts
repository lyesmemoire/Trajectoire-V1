/**
 * Intelligence Errors
 * 
 * Common error hierarchy for Intelligence Engines.
 * All errors are serializable and immutable.
 */

/**
 * Base error class for all intelligence-related errors
 */
export abstract class IntelligenceError extends Error {
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

/**
 * Validation error for invalid input
 */
export class ValidationError extends IntelligenceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("VALIDATION_ERROR", message, details);
  }
}

/**
 * Provider error for LLM provider failures
 */
export class ProviderError extends IntelligenceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("PROVIDER_ERROR", message, details);
  }
}

/**
 * Engine execution error for intelligence engine failures
 */
export class EngineExecutionError extends IntelligenceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("ENGINE_EXECUTION_ERROR", message, details);
  }
}

/**
 * Timeout error for requests that exceed timeout
 */
export class TimeoutError extends IntelligenceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("TIMEOUT_ERROR", message, details);
  }
}

/**
 * Rate limit error for provider rate limits
 */
export class RateLimitError extends IntelligenceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("RATE_LIMIT_ERROR", message, details);
  }
}

/**
 * Authentication error for provider authentication failures
 */
export class AuthenticationError extends IntelligenceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("AUTHENTICATION_ERROR", message, details);
  }
}

/**
 * Configuration error for invalid configuration
 */
export class ConfigurationError extends IntelligenceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("CONFIGURATION_ERROR", message, details);
  }
}
