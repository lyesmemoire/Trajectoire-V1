/**
 * AppError
 * Base error class for all application errors
 * Following standard error handling patterns
 */

export enum ErrorCode {
  // General errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",

  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // Authentication errors
  UNAUTHORIZED = "UNAUTHORIZED",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",

  // Authorization errors
  FORBIDDEN = "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

  // AI errors
  AI_ERROR = "AI_ERROR",
  AI_TIMEOUT = "AI_TIMEOUT",
  AI_RATE_LIMIT = "AI_RATE_LIMIT",
  AI_INVALID_RESPONSE = "AI_INVALID_RESPONSE",

  // Quota errors
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  QUOTA_INVALID = "QUOTA_INVALID",

  // Rate limit errors
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  // Database errors
  DATABASE_ERROR = "DATABASE_ERROR",
  TRANSACTION_FAILED = "TRANSACTION_FAILED",
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}
