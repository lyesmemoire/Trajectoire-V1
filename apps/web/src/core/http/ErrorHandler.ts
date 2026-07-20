/**
 * ErrorHandler
 * Global error handling middleware
 * Converts errors to appropriate HTTP responses
 */

import { AppError } from "../errors";
import { ApiResponseBuilder } from "./ApiResponse";
import { ILogger } from "../interfaces/ILogger";

export class ErrorHandler {
  /**
   * Handle an error and return appropriate response
   * @param error - Error to handle
   * @param logger - Logger instance
   * @returns NextResponse
   */
  static handle(error: unknown, logger?: ILogger): ReturnType<typeof ApiResponseBuilder.fromError> {
    // Log the error
    if (logger) {
      if (error instanceof AppError) {
        if (error.statusCode >= 500) {
          logger.error(error.message, {
            code: error.code,
            context: error.context,
            stack: error.stack,
          });
        } else {
          logger.warn(error.message, {
            code: error.code,
            context: error.context,
          });
        }
      } else {
        logger.error("Unhandled error", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    }

    return ApiResponseBuilder.fromError(error);
  }

  /**
   * Handle an error in an async context
   * Wraps async functions with error handling
   * @param fn - Async function to wrap
   * @param logger - Logger instance
   * @returns Wrapped function
   */
  static asyncHandler<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    logger?: ILogger
  ): (...args: Parameters<T>) => Promise<ReturnType<typeof ApiResponseBuilder.fromError>> {
    return async (...args: Parameters<T>) => {
      try {
        const result = await fn(...args);
        return result as any;
      } catch (error) {
        return this.handle(error, logger);
      }
    };
  }

  /**
   * Validate that error is operational (not a programming error)
   * @param error - Error to check
   * @returns Whether error is operational
   */
  static isOperationalError(error: unknown): boolean {
    return error instanceof AppError && error.isOperational;
  }
}
