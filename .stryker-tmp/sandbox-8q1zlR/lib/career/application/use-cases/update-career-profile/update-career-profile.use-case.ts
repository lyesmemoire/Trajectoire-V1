// @ts-nocheck
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { UnauthorizedError } from "@/lib/core/result/errors";
import { CareerUpdateDTO } from "../../dto/career-update.dto";
import { CareerPipelineContext, CareerPipelineStep } from "./career-pipeline";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { DomainEventPublisher } from "@/lib/core/runtime/event-publisher/DomainEventPublisher";

export interface UpdateCareerProfileInput {
  dto: CareerUpdateDTO;
}

export class UpdateCareerProfileUseCase extends UseCase<UpdateCareerProfileInput, CareerPipelineContext> {
  constructor(
    private readonly steps: CareerPipelineStep[],
    private readonly publisher: DomainEventPublisher
  ) {
    super();
  }

  protected async run(input: UpdateCareerProfileInput): Promise<Result<CareerPipelineContext>> {
    const userId = RequestContext.userId();
    const sessionId = input.dto.sessionId;

    if (!userId) {
      return fail(new UnauthorizedError("User ID is required to update career profile"));
    }

    let context: CareerPipelineContext = {
      dto: input.dto,
      userId,
      sessionId,
    };

    // Orchestrate the pipeline
    for (const step of this.steps) {
      context = await step.execute(context);
    }

    // Publish all domain events recorded on the aggregate during the pipeline
    if (context.profile) {
      await this.publisher.publish(context.profile);
    }

    return ok(context);
  }
}
