import { Presenter } from "@/lib/core/presentation/Presenter";
import { Result } from "@/lib/core/result";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { OrchestrateStepResult } from "../application/use-cases/orchestrate-step/orchestrate-interview-step.use-case";

export class InterviewPresenter {
  presentStart(result: Result<string>): { status: number, body: any } {
    if (result.isFailure()) {
      return ErrorHttpMapper.toHttpResponse(result.unwrapError());
    }
    return {
      status: 200,
      body: { sessionId: result.unwrap() }
    };
  }

  presentOrchestrate(result: Result<OrchestrateStepResult>): { status: number, body: any } {
    if (result.isFailure()) {
      return ErrorHttpMapper.toHttpResponse(result.unwrapError());
    }
    return {
      status: 200,
      body: result.unwrap()
    };
  }
}
