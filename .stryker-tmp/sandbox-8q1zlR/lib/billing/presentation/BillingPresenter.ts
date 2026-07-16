// @ts-nocheck
import { Presenter, ApiResponse } from "@/lib/core/presentation";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { DomainError } from "@/lib/core/result/errors/DomainError";

export class BillingPresenter<T> implements Presenter<T, T> {
  present(result: T): ApiResponse<T> {
    return {
      success: true,
      data: result,
    };
  }

  presentError(error: Error): ApiResponse<T> {
    if (error instanceof DomainError) {
      const httpResponse = ErrorHttpMapper.toHttpResponse(error);
      return {
        success: false,
        error: {
          code: httpResponse.body.code,
          message: httpResponse.body.error,
          details: httpResponse.body.metadata,
        },
      };
    }

    // Fallback for non-domain errors
    return {
      success: false,
      error: {
        code: "BILLING_ERROR",
        message: error.message,
      },
    };
  }
}
