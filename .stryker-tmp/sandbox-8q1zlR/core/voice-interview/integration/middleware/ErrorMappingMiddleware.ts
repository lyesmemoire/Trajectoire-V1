// @ts-nocheck
import type { Result, ApplicationError } from "../../application/types.js";
import { isFailure } from "../../application/types.js";

export interface MappedHttpError {
  readonly status: number;
  readonly body: { readonly error: string; readonly code: string };
}

export interface MappedWsError {
  readonly wsCode: number;
  readonly message: string;
  readonly errorCode: string;
}

export function mapResultToHttpError(error: ApplicationError): MappedHttpError {
  switch (error.code) {
    case "SESSION_NOT_FOUND":
      return { status: 404, body: { error: error.message, code: error.code } };
    case "INVALID_PHASE_TRANSITION":
    case "INTERVIEW_PAUSED":
    case "SESSION_ALREADY_COMPLETED":
    case "DUPLICATE_TURN":
    case "MUNITION_ALREADY_USED":
    case "INVALID_SCORE":
      return { status: 400, body: { error: error.message, code: error.code } };
    case "PROVIDER_ERROR":
    case "CONCURRENCY_ERROR":
    case "SERIALIZATION_ERROR":
      return { status: 503, body: { error: "Service temporarily unavailable", code: error.code } };
    default:
      return { status: 500, body: { error: "Internal server error", code: "UNKNOWN_ERROR" } };
  }
}

export function mapResultToWsError(error: ApplicationError, correlationId: string): MappedWsError {
  switch (error.code) {
    case "SESSION_NOT_FOUND":
      return { wsCode: 4004, message: error.message, errorCode: error.code };
    case "INVALID_PHASE_TRANSITION":
    case "INTERVIEW_PAUSED":
    case "SESSION_ALREADY_COMPLETED":
    case "DUPLICATE_TURN":
    case "MUNITION_ALREADY_USED":
    case "INVALID_SCORE":
      return { wsCode: 4000, message: error.message, errorCode: error.code };
    case "PROVIDER_ERROR":
    case "CONCURRENCY_ERROR":
    case "SERIALIZATION_ERROR":
      return { wsCode: 5000, message: "Service temporarily unavailable", errorCode: error.code };
    default:
      return { wsCode: 5000, message: "Internal server error", errorCode: "UNKNOWN_ERROR" };
  }
}

export function extractErrorFromResult<T>(result: Result<T, ApplicationError>): ApplicationError | null {
  if (isFailure(result)) {
    return result.error;
  }
  return null;
}
