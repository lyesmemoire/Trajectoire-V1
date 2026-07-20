/**
 * ValidationError
 * Thrown when input validation fails
 */

import { AppError, ErrorCode } from "./AppError";

export interface ValidationErrorField {
  field: string;
  message: string;
  value?: unknown;
}

export class ValidationError extends AppError {
  public readonly fields: ValidationErrorField[];

  constructor(
    message: string,
    fields: ValidationErrorField[] = [],
    context?: Record<string, unknown>
  ) {
    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      400,
      true,
      context
    );
    this.fields = fields;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      fields: this.fields,
    };
  }
}
