import { UseCase, Result, fail, ok } from "@/lib/core";
import { UserRepositoryPort } from "../../ports/user-repository.port";
import { EventBus } from "@/lib/core/events/event-bus";
import { UserProfileUpdated } from "../../domain/events/user-events";

export interface CompleteCvEditorInput {
  userId: string;
}

export class CompleteCvEditorUseCase extends UseCase<CompleteCvEditorInput, void> {
  constructor(
    private userRepository: UserRepositoryPort,
    private eventBus: EventBus
  ) {
    super();
  }

  protected async beforeExecute(): Promise<void> {}

  protected async run(input: CompleteCvEditorInput): Promise<Result<void>> {
    const updateResult = await this.userRepository.updateProfile(input.userId, { cvEditorCompleted: true });
    
    if (updateResult.isFailure()) return fail(updateResult.unwrapError());

    return ok(undefined);
  }

  protected async afterExecute(input: CompleteCvEditorInput, result: Result<void>): Promise<void> {
    if (result.isSuccess()) {
      // Actually we'd need the updated profile details if UserProfileUpdated requires it.
      // Or just a specific event like CvEditorCompleted.
      // I'll reuse UserProfileUpdated.
      this.eventBus.publish(new UserProfileUpdated({
        userId: input.userId,
        fullName: null,
        cvEditorCompleted: true
      }));
    }
  }
}
