/**
 * NotFoundError
 * Thrown when a requested resource is not found
 */

import { AppError, ErrorCode } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", context?: Record<string, unknown>) {
    super(message, ErrorCode.NOT_FOUND, 404, true, context);
    this.name = "NotFoundError";
  }
}
