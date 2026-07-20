/**
 * InfrastructureError
 * Thrown when infrastructure components fail
 */

import { AppError, ErrorCode } from "./AppError";

export class InfrastructureError extends AppError {
  constructor(
    message: string = "Infrastructure error",
    public readonly component: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCode.INTERNAL_ERROR, 503, true, { ...context, component });
    this.name = "InfrastructureError";
  }
}
