/**
 * Infrastructure Errors
 *
 * Infrastructure-specific error types.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY error definitions.
 */
// @ts-nocheck


export class InfrastructureError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "InfrastructureError";
  }
}

export class OpenAIError extends InfrastructureError {
  constructor(message: string, public readonly statusCode?: number) {
    super(message, "OPENAI_ERROR");
    this.name = "OpenAIError";
  }
}

export class RepositoryError extends InfrastructureError {
  constructor(message: string) {
    super(message, "REPOSITORY_ERROR");
    this.name = "RepositoryError";
  }
}

export class TimeoutError extends InfrastructureError {
  constructor(message: string, public readonly timeout: number) {
    super(message, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
  }
}

export class ConfigurationError extends InfrastructureError {
  constructor(message: string) {
    super(message, "CONFIGURATION_ERROR");
    this.name = "ConfigurationError";
  }
}

export class ParsingError extends InfrastructureError {
  constructor(message: string, public readonly raw?: string) {
    super(message, "PARSING_ERROR");
    this.name = "ParsingError";
  }
}

export class NetworkError extends InfrastructureError {
  constructor(message: string, public readonly statusCode?: number) {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends InfrastructureError {
  constructor(message: string) {
    super(message, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends InfrastructureError {
  constructor(message: string, public readonly retryAfter?: number) {
    super(message, "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
  }
}
