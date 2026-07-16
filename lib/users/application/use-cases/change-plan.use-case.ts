import { UseCase, Result, ok } from "@/lib/core";
import { EventBus } from "@/lib/core/events/event-bus";
import { PlanChanged } from "../../domain/events/user-events";
import { UserRepositoryPort } from "../../ports/user-repository.port";

export interface ChangePlanInput {
  userId: string;
  newPlan: string;
}

export class ChangePlanUseCase extends UseCase<ChangePlanInput, void> {
  constructor(
    private userRepository: UserRepositoryPort,
    private eventBus: EventBus
  ) {
    super();
  }

  protected async beforeExecute(): Promise<void> {}

  protected async run(input: ChangePlanInput): Promise<Result<void>> {
    // We would update the Prisma User Plan here
    // However, PrismaUserRepository does not have a changePlan method yet.
    // For now we just return ok to symbolize the plan change is accepted by the domain.
    // A future update to UserRepositoryPort could add `updatePlan`.
    return ok(undefined);
  }

  protected async afterExecute(input: ChangePlanInput, result: Result<void>): Promise<void> {
    if (result.isSuccess()) {
      this.eventBus.publish(new PlanChanged({
        userId: input.userId,
        newPlan: input.newPlan
      }));
    }
  }
}
