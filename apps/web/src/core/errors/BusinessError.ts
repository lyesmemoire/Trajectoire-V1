/**
 * BusinessError
 * Thrown when a business rule is violated
 */

import { AppError, ErrorCode } from "./AppError";

export class BusinessError extends AppError {
  constructor(message: string = "Business rule violation", context?: Record<string, unknown>) {
    super(message, ErrorCode.INTERNAL_ERROR, 400, true, context);
    this.name = "BusinessError";
  }
}
