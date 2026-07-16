import {
  DomainError,
  InterviewError,
  ProviderError,
  ValidationError,
} from "./interview.errors";

export class ErrorMapper {
  static toDomainError(error: unknown): DomainError {
    if (error instanceof DomainError) {
      return error;
    }

    if (error instanceof Error) {
      const message = error.message;
      const normalized = message.toLowerCase();

      if (error.name === "ZodError" || normalized.includes("validation")) {
        return new ValidationError(message);
      }

      if (
        normalized.includes("provider") ||
        normalized.includes("timeout") ||
        normalized.includes("fetch") ||
        normalized.includes("api")
      ) {
        return new ProviderError(message);
      }

      return new InterviewError(message, "UNKNOWN_ERROR");
    }

    return new InterviewError("Unknown interview failure", "UNKNOWN_ERROR");
  }
}

