/**
 * ExternalServiceError
 * Thrown when an external service call fails
 */

import { AppError, ErrorCode } from "./AppError";

export class ExternalServiceError extends AppError {
  constructor(
    message: string = "External service error",
    public readonly serviceName: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCode.INTERNAL_ERROR, 502, true, { ...context, serviceName });
    this.name = "ExternalServiceError";
  }
}
