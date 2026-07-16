// @ts-nocheck
import { Result } from "@/lib/core/result";
import { CareerPipelineContext } from "../application/use-cases/update-career-profile/career-pipeline";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";

export interface CareerUpdateApiResponse {
  success: boolean;
  authenticity?: number;
  prediction?: {
    probability: number;
    segment: string;
  };
  error?: string;
  code?: string;
}

export class CareerPresenter {
  presentUpdateProfile(result: Result<CareerPipelineContext>): { status: number; body: CareerUpdateApiResponse } {
    if (result.isFailure()) {
      const errorResponse = ErrorHttpMapper.toHttpResponse(result.unwrapError());
      return {
        status: errorResponse.status,
        body: {
          success: false,
          ...errorResponse.body,
        },
      };
    }

    const context = result.unwrap();

    return {
      status: 200,
      body: {
        success: true,
        authenticity: context.authenticity?.value,
        prediction: context.prediction ? {
          probability: context.prediction.returnProbability.value,
          segment: context.prediction.returnSegment,
        } : undefined,
      }
    };
  }
}
