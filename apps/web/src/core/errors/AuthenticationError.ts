/**
 * AuthenticationError
 * Thrown when authentication fails
 */

import { AppError, ErrorCode } from "./AppError";

export class AuthenticationError extends AppError {
  constructor(
    message: string = "Authentication failed",
    code: ErrorCode = ErrorCode.UNAUTHORIZED,
    context?: Record<string, unknown>
  ) {
    super(message, code, 401, true, context);
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor(context?: Record<string, unknown>) {
    super("Token has expired", ErrorCode.TOKEN_EXPIRED, context);
  }
}
