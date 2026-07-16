/**
 * Error Adapter
 * 
 * Adapts provider errors to domain error contracts.
 * Handles transformation between provider-specific error formats and domain errors.
 */

import type { IntelligenceError as IntelligenceErrorContract } from "../../domain/contracts/intelligence-response";

export class ErrorAdapter {
  /**
   * Adapt a generic error to intelligence error contract
   */
  static adapt(error: Error): IntelligenceErrorContract {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
      details: {
        name: error.name,
        stack: error.stack,
      },
    };
  }

  /**
   * Adapt a domain error to intelligence error contract
   */
  static adaptDomainError(error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  }): IntelligenceErrorContract {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  /**
   * Map provider error code to domain error
   */
  static mapProviderError(code: string, message: string, details?: Record<string, unknown>): IntelligenceErrorContract {
    switch (code) {
      case "timeout":
      case "request_timeout":
        return {
          code: "TIMEOUT_ERROR",
          message,
          details,
        };

      case "rate_limit":
      case "rate_limit_exceeded":
        return {
          code: "RATE_LIMIT_ERROR",
          message,
          details,
        };

      case "authentication":
      case "unauthorized":
      case "invalid_api_key":
        return {
          code: "AUTHENTICATION_ERROR",
          message,
          details,
        };

      case "validation":
      case "invalid_request":
        return {
          code: "VALIDATION_ERROR",
          message,
          details,
        };

      case "configuration":
      case "invalid_config":
        return {
          code: "CONFIGURATION_ERROR",
          message,
          details,
        };

      default:
        return {
          code: "PROVIDER_ERROR",
          message,
          details,
        };
    }
  }
}
