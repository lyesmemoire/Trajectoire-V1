/**
 * AuthorizationError
 * Thrown when authorization fails (user is authenticated but lacks permissions)
 */

import { AppError, ErrorCode } from "./AppError";

export interface AuthorizationErrorContext {
  resource?: string;
  action?: string;
  requiredPermission?: string;
}

export class AuthorizationError extends AppError {
  public readonly authContext?: AuthorizationErrorContext;

  constructor(
    message: string = "Insufficient permissions",
    authContext?: AuthorizationErrorContext,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCode.FORBIDDEN, 403, true, context);
    this.authContext = authContext;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      authContext: this.authContext,
    };
  }
}
