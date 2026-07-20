/**
 * QuotaError
 * Thrown when quota limits are exceeded
 */

import { AppError, ErrorCode } from "./AppError";

export interface QuotaErrorContext {
  resourceType: string;
  currentUsage: number;
  limit: number;
  period: "daily" | "monthly";
}

export class QuotaError extends AppError {
  public readonly quotaContext: QuotaErrorContext;

  constructor(
    message: string,
    quotaContext: QuotaErrorContext,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCode.QUOTA_EXCEEDED, 429, true, context);
    this.quotaContext = quotaContext;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      quotaContext: this.quotaContext,
    };
  }
}
