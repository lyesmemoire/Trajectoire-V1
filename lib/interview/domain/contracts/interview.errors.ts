export type DomainErrorCode =
  | "VALIDATION_ERROR"
  | "INTERVIEW_ERROR"
  | "PROVIDER_ERROR"
  | "CONTEXT_UNAVAILABLE"
  | "STREAM_INTERRUPTED"
  | "UNKNOWN_ERROR";

export abstract class DomainError extends Error {
  protected constructor(
    message: string,
    public readonly code: DomainErrorCode,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

export class InterviewError extends DomainError {
  constructor(message: string, code: DomainErrorCode = "INTERVIEW_ERROR") {
    super(message, code);
  }
}

export class ProviderError extends DomainError {
  constructor(message: string) {
    super(message, "PROVIDER_ERROR");
  }
}

