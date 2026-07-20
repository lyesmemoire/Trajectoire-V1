/**
 * ApiResponse
 * Standardized API response wrapper
 * Ensures consistent response format across all endpoints
 */

import { NextResponse } from "next/server";
import { AppError } from "../errors";

export interface ApiResponseMeta {
  timestamp: string;
  requestId?: string;
  version?: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  error: null;
  meta?: ApiResponseMeta;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: ApiResponseMeta;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiResponseBuilder {
  private static buildMeta(): ApiResponseMeta {
    return {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
  }

  /**
   * Build a success response
   * @param data - Response data
   * @param statusCode - HTTP status code (default 200)
   * @returns NextResponse
   */
  static success<T>(data: T, statusCode: number = 200): NextResponse<ApiSuccessResponse<T>> {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
      error: null,
      meta: this.buildMeta(),
    };

    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * Build an error response
   * @param error - AppError instance
   * @returns NextResponse
   */
  static error(error: AppError): NextResponse<ApiErrorResponse> {
    const response: ApiErrorResponse = {
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message,
        details: error.context,
      },
      meta: this.buildMeta(),
    };

    return NextResponse.json(response, { status: error.statusCode });
  }

  /**
   * Build an error response from a generic error
   * @param error - Generic error
   * @returns NextResponse
   */
  static fromError(error: unknown): NextResponse<ApiErrorResponse> {
    if (error instanceof AppError) {
      return this.error(error);
    }

    // Handle generic errors
    const appError = new AppError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      "INTERNAL_ERROR" as any,
      500,
      true
    );

    return this.error(appError);
  }

  /**
   * Build a no-content response (204)
   * @returns NextResponse
   */
  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }

  /**
   * Build a created response (201)
   * @param data - Created resource data
   * @returns NextResponse
   */
  static created<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
    return this.success(data, 201);
  }

  /**
   * Build a bad request response (400)
   * @param message - Error message
   * @param details - Additional error details
   * @returns NextResponse
   */
  static badRequest(message: string, details?: unknown): NextResponse<ApiErrorResponse> {
    const error = new AppError(message, "VALIDATION_ERROR" as any, 400, true, details as any);
    return this.error(error);
  }

  /**
   * Build an unauthorized response (401)
   * @param message - Error message
   * @returns NextResponse
   */
  static unauthorized(message: string = "Unauthorized"): NextResponse<ApiErrorResponse> {
    const error = new AppError(message, "UNAUTHORIZED" as any, 401, true);
    return this.error(error);
  }

  /**
   * Build a forbidden response (403)
   * @param message - Error message
   * @returns NextResponse
   */
  static forbidden(message: string = "Forbidden"): NextResponse<ApiErrorResponse> {
    const error = new AppError(message, "FORBIDDEN" as any, 403, true);
    return this.error(error);
  }

  /**
   * Build a not found response (404)
   * @param message - Error message
   * @returns NextResponse
   */
  static notFound(message: string = "Resource not found"): NextResponse<ApiErrorResponse> {
    const error = new AppError(message, "NOT_FOUND" as any, 404, true);
    return this.error(error);
  }

  /**
   * Build a conflict response (409)
   * @param message - Error message
   * @returns NextResponse
   */
  static conflict(message: string): NextResponse<ApiErrorResponse> {
    const error = new AppError(message, "CONFLICT" as any, 409, true);
    return this.error(error);
  }

  /**
   * Build a rate limit exceeded response (429)
   * @param message - Error message
   * @param retryAfter - Seconds to wait before retry
   * @returns NextResponse
   */
  static rateLimitExceeded(message: string = "Rate limit exceeded", retryAfter?: number): NextResponse<ApiErrorResponse> {
    const error = new AppError(message, "RATE_LIMIT_EXCEEDED" as any, 429, true);
    const response = this.error(error);

    if (retryAfter) {
      response.headers.set("Retry-After", retryAfter.toString());
    }

    return response;
  }
}
