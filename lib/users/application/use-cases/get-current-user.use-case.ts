import { UseCase, Result, fail, ok } from "@/lib/core";
import { IdentityProviderPort } from "../../ports/identity-provider.port";
import { UserRepositoryPort } from "../../ports/user-repository.port";
import { UserEntity, UserProfileEntity } from "../../domain/entities/user.entity";

export class GetCurrentUserUseCase extends UseCase<void, { user: UserEntity; profile: UserProfileEntity }> {
  constructor(
    private identityProvider: IdentityProviderPort,
    private userRepository: UserRepositoryPort
  ) {
    super();
  }

  protected async beforeExecute(): Promise<void> {}

  protected async run(): Promise<Result<{ user: UserEntity; profile: UserProfileEntity }>> {
    const idResult = await this.identityProvider.getCurrentUserId();
    if (idResult.isFailure()) return fail(idResult.unwrapError());

    const userId = idResult.unwrap();
    const userResult = await this.userRepository.findById(userId);
    
    if (userResult.isFailure()) return fail(userResult.unwrapError());

    return ok(userResult.unwrap());
  }

  protected async afterExecute(): Promise<void> {}
}
