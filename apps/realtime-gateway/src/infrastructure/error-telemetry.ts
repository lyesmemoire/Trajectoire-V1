import { logger } from "../telemetry/logger.js";

export type ErrorContext = Record<string, unknown>;

let currentContext: ErrorContext = {};

export function setSentryContext(
  context: ErrorContext,
): void {
  currentContext = {
    ...currentContext,
    ...context,
  };
}

export function captureError(
  error: unknown,
  context: ErrorContext = {},
): void {
  const mergedContext = {
    ...currentContext,
    ...context,
  };

  logger.error(
    {
      err: error,
      ...mergedContext,
    },
    error instanceof Error
      ? error.message
      : "Unhandled gateway error",
  );
}