import { ApplicationError } from "../../application/types.js";

export class ProviderError extends ApplicationError {
  constructor(message: string, public readonly provider: string, public readonly cause?: unknown) {
    super(message, "PROVIDER_ERROR");
  }
}

export class TimeoutError extends ProviderError {
  constructor(provider: string, cause?: unknown) {
    super(`Timeout exceeded for provider: ${provider}`, provider, cause);
    this.name = "TimeoutError";
  }
}

export class SerializationError extends ApplicationError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, "SERIALIZATION_ERROR");
  }
}

export class ConcurrencyError extends ApplicationError {
  constructor(message: string) {
    super(message, "CONCURRENCY_ERROR");
  }
}
