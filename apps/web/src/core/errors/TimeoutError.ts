/**
 * TimeoutError
 * Thrown when an operation times out
 */

import { AppError, ErrorCode } from "./AppError";

export class TimeoutError extends AppError {
  constructor(
    message: string = "Operation timed out",
    public readonly operation: string,
    public readonly timeoutMs: number,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCode.INTERNAL_ERROR, 504, true, { ...context, operation, timeoutMs });
    this.name = "TimeoutError";
  }
}
