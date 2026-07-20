/**
 * ForbiddenError
 * Thrown when a user lacks permission to access a resource
 */

import { AppError, ErrorCode } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden", context?: Record<string, unknown>) {
    super(message, ErrorCode.FORBIDDEN, 403, true, context);
    this.name = "ForbiddenError";
  }
}
