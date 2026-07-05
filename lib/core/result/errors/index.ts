import { DomainError } from "./DomainError";

export class ValidationError extends DomainError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", metadata);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = "Resource not found", metadata?: Record<string, unknown>) {
    super(message, "NOT_FOUND", metadata);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "CONFLICT", metadata);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized", metadata?: Record<string, unknown>) {
    super(message, "UNAUTHORIZED", metadata);
  }
}

export class InfrastructureError extends DomainError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "INFRASTRUCTURE_ERROR", metadata);
  }
}

export class ConcurrencyError extends DomainError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "CONCURRENCY_ERROR", metadata);
  }
}

export class BusinessRuleViolation extends DomainError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "BUSINESS_RULE_VIOLATION", metadata);
  }
}

export class ApplicationError extends DomainError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "APPLICATION_ERROR", metadata);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = "Forbidden", metadata?: Record<string, unknown>) {
    super(message, "FORBIDDEN", metadata);
  }
}

export class RateLimitError extends DomainError {
  constructor(message: string = "Too many requests", metadata?: Record<string, unknown>) {
    super(message, "RATE_LIMIT_EXCEEDED", metadata);
  }
}
