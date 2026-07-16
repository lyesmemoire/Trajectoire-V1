/**
 * Application Exceptions
 *
 * Application-level exception types.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY exception definitions.
 */
// @ts-nocheck


export class ApplicationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class PersistenceError extends ApplicationError {
  constructor(message: string) {
    super(message, "PERSISTENCE_ERROR");
    this.name = "PersistenceError";
  }
}

export class AIGenerationError extends ApplicationError {
  constructor(message: string) {
    super(message, "AI_GENERATION_ERROR");
    this.name = "AIGenerationError";
  }
}

export class TelemetryError extends ApplicationError {
  constructor(message: string) {
    super(message, "TELEMETRY_ERROR");
    this.name = "TelemetryError";
  }
}

export class AnalyticsError extends ApplicationError {
  constructor(message: string) {
    super(message, "ANALYTICS_ERROR");
    this.name = "AnalyticsError";
  }
}
