import { z } from "zod";

// ============================================
// ERROR CODES
// ============================================

export const ErrorCodes = {
  // Auth errors (1xxx)
  AUTH_REQUIRED: {
    code: "AUTH_REQUIRED",
    status: 401,
    message: "Authentication required",
  },
  AUTH_INVALID: {
    code: "AUTH_INVALID",
    status: 401,
    message: "Invalid credentials",
  },
  AUTH_EXPIRED: {
    code: "AUTH_EXPIRED",
    status: 401,
    message: "Session expired",
  },
  AUTH_EMAIL_EXISTS: {
    code: "AUTH_EMAIL_EXISTS",
    status: 409,
    message: "Email already registered",
  },

  // Credit errors (2xxx)
  INSUFFICIENT_CREDITS: {
    code: "INSUFFICIENT_CREDITS",
    status: 402,
    message: "Not enough credits",
  },
  CREDIT_TRANSACTION_FAILED: {
    code: "CREDIT_TRANSACTION_FAILED",
    status: 500,
    message: "Credit operation failed",
  },

  // Validation errors (3xxx)
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    status: 400,
    message: "Invalid input",
  },
  INVALID_FILE_TYPE: {
    code: "INVALID_FILE_TYPE",
    status: 400,
    message: "Invalid file type",
  },
  FILE_TOO_LARGE: {
    code: "FILE_TOO_LARGE",
    status: 400,
    message: "File too large",
  },

  // Resource errors (4xxx)
  NOT_FOUND: { code: "NOT_FOUND", status: 404, message: "Resource not found" },
  SESSION_NOT_FOUND: {
    code: "SESSION_NOT_FOUND",
    status: 404,
    message: "Session not found",
  },
  ANALYSIS_NOT_FOUND: {
    code: "ANALYSIS_NOT_FOUND",
    status: 404,
    message: "Analysis not found",
  },

  // Rate limiting (5xxx)
  RATE_LIMIT_EXCEEDED: {
    code: "RATE_LIMIT_EXCEEDED",
    status: 429,
    message: "Rate limit exceeded",
  },

  // Server errors (6xxx)
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    status: 500,
    message: "Internal server error",
  },
  AI_SERVICE_ERROR: {
    code: "AI_SERVICE_ERROR",
    status: 503,
    message: "AI service unavailable",
  },
  DATABASE_ERROR: {
    code: "DATABASE_ERROR",
    status: 500,
    message: "Database error",
  },
} as const;

// ============================================
// API ERROR CLASS
// ============================================

export class APIError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    errorDef: (typeof ErrorCodes)[keyof typeof ErrorCodes],
    details?: Record<string, unknown>,
  ) {
    super(errorDef.message);
    this.name = "APIError";
    this.code = errorDef.code;
    this.status = errorDef.status;
    this.details = details;
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      ...this.details,
    };
  }
}

// ============================================
// SPECIALIZED ERRORS
// ============================================

export class AuthError extends APIError {
  constructor(
    errorDef:
      | typeof ErrorCodes.AUTH_REQUIRED
      | typeof ErrorCodes.AUTH_INVALID
      | typeof ErrorCodes.AUTH_EXPIRED,
  ) {
    super(errorDef);
  }
}

export class ValidationError extends APIError {
  public readonly fieldErrors: Record<string, string>;

  constructor(fieldErrors: Record<string, string>) {
    super(ErrorCodes.VALIDATION_ERROR);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }

  toJSON() {
    return {
      error: "Validation failed",
      code: this.code,
      details: this.fieldErrors,
    };
  }
}

export class InsufficientCreditsError extends APIError {
  public readonly currentCredits: number;
  public readonly requiredCredits: number;

  constructor(currentCredits: number, requiredCredits: number) {
    super(ErrorCodes.INSUFFICIENT_CREDITS);
    this.name = "InsufficientCreditsError";
    this.currentCredits = currentCredits;
    this.requiredCredits = requiredCredits;
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      currentCredits: this.currentCredits,
      requiredCredits: this.requiredCredits,
    };
  }
}

export class RateLimitError extends APIError {
  public readonly retryAfter: number;

  constructor(retryAfter: number) {
    super(ErrorCodes.RATE_LIMIT_EXCEEDED);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      retryAfter: this.retryAfter,
    };
  }
}

// ============================================
// ERROR HANDLER
// ============================================

export function handleAPIError(error: unknown) {
  console.error("[API Error]", error);

  if (error instanceof APIError) {
    return {
      status: error.status,
      body: error.toJSON(),
    };
  }

  if (error instanceof z.ZodError) {
    const fieldErrors: Record<string, string> = {};
    error.errors.forEach((err) => {
      if (err.path.length > 0) {
        fieldErrors[err.path.join(".")] = err.message;
      }
    });
    const validationError = new ValidationError(fieldErrors);
    return {
      status: validationError.status,
      body: validationError.toJSON(),
    };
  }

  // Fallback for unknown errors
  const internalError = new APIError(ErrorCodes.INTERNAL_ERROR);
  return {
    status: internalError.status,
    body: internalError.toJSON(),
  };
}
