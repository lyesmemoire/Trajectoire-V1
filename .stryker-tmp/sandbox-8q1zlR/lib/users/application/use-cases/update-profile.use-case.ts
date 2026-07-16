// @ts-nocheck
import { UseCase, Result, fail, ok } from "@/lib/core";
import { UserRepositoryPort } from "../../ports/user-repository.port";
import { EventBus } from "@/lib/core/events/event-bus";
import { UserProfileUpdated } from "../../domain/events/user-events";
import { DisplayName } from "../../domain/value-objects/user.vo";

export interface UpdateProfileInput {
  userId: string;
  fullName: string;
}

export class UpdateProfileUseCase extends UseCase<UpdateProfileInput, void> {
  constructor(
    private userRepository: UserRepositoryPort,
    private eventBus: EventBus
  ) {
    super();
  }

  protected async beforeExecute(input: UpdateProfileInput): Promise<void> {
    DisplayName.create(input.fullName);
  }

  protected async run(input: UpdateProfileInput): Promise<Result<void>> {
    const updateResult = await this.userRepository.updateProfile(input.userId, { fullName: input.fullName });
    if (updateResult.isFailure()) return fail(updateResult.unwrapError());
    return ok(undefined);
  }

  protected async afterExecute(input: UpdateProfileInput, result: Result<void>): Promise<void> {
    if (result.isSuccess()) {
      this.eventBus.publish(new UserProfileUpdated({
        userId: input.userId,
        fullName: input.fullName,
        cvEditorCompleted: false // We probably want the real value here if possible
      }));
    }
  }
}
