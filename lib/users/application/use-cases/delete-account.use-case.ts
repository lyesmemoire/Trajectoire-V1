import { UseCase, Result, fail, ok } from "@/lib/core";
import { IdentityProviderPort } from "../../ports/identity-provider.port";
import { UserRepositoryPort } from "../../ports/user-repository.port";
import { EventBus } from "@/lib/core/events/event-bus";
import { UserDeleted } from "../../domain/events/user-events";

export interface DeleteAccountInput {
  userId: string;
}

export class DeleteAccountUseCase extends UseCase<DeleteAccountInput, void> {
  constructor(
    private identityProvider: IdentityProviderPort,
    private userRepository: UserRepositoryPort,
    private eventBus: EventBus
  ) {
    super();
  }

  protected async beforeExecute(): Promise<void> {}

  protected async run(input: DeleteAccountInput): Promise<Result<void>> {
    const dbResult = await this.userRepository.delete(input.userId);
    if (dbResult.isFailure()) return fail(dbResult.unwrapError());

    const idResult = await this.identityProvider.deleteUser(input.userId);
    if (idResult.isFailure()) return fail(idResult.unwrapError());

    return ok(undefined);
  }

  protected async afterExecute(input: DeleteAccountInput, result: Result<void>): Promise<void> {
    if (result.isSuccess()) {
      this.eventBus.publish(new UserDeleted({ userId: input.userId }));
    }
  }
}
