/**
 * ConflictError
 * Thrown when a request conflicts with current state
 */

import { AppError, ErrorCode } from "./AppError";

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict", context?: Record<string, unknown>) {
    super(message, ErrorCode.CONFLICT, 409, true, context);
    this.name = "ConflictError";
  }
}
