/**
 * AIError
 * Thrown when AI operations fail
 */

import { AppError, ErrorCode } from "./AppError";

export interface AIErrorContext {
  model?: string;
  endpoint?: string;
  promptTokens?: number;
  completionTokens?: number;
  retryCount?: number;
}

export class AIError extends AppError {
  public readonly aiContext?: AIErrorContext;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.AI_ERROR,
    statusCode: number = 500,
    aiContext?: AIErrorContext,
    context?: Record<string, unknown>
  ) {
    super(message, code, statusCode, true, context);
    this.aiContext = aiContext;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      aiContext: this.aiContext,
    };
  }
}

export class AITimeoutError extends AIError {
  constructor(message: string = "AI request timed out", aiContext?: AIErrorContext) {
    super(message, ErrorCode.AI_TIMEOUT, 504, aiContext);
  }
}

export class AIRateLimitError extends AIError {
  constructor(message: string = "AI rate limit exceeded", aiContext?: AIErrorContext) {
    super(message, ErrorCode.AI_RATE_LIMIT, 429, aiContext);
  }
}

export class AIInvalidResponseError extends AIError {
  constructor(message: string = "Invalid AI response", aiContext?: AIErrorContext) {
    super(message, ErrorCode.AI_INVALID_RESPONSE, 502, aiContext);
  }
}
