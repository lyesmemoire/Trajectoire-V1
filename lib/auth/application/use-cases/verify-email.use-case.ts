import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { AuthenticationProviderPort } from "../../ports/gateways/AuthenticationProviderPort";
import { UserRepositoryPort } from "../../ports/repositories/UserRepositoryPort";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { NotFoundError } from "@/lib/core/result/errors";

export interface VerifyEmailCommand {
  token: string;
}

export class VerifyEmailUseCase extends UseCase<VerifyEmailCommand, void> {
  constructor(
    private readonly authProvider: AuthenticationProviderPort,
    private readonly userRepo: UserRepositoryPort
  ) {
    super();
  }

  protected async run(command: VerifyEmailCommand): Promise<Result<void>> {
    // Verify email with auth provider
    const verifyResult = await this.authProvider.verifyEmail(command.token);
    if (verifyResult.isFailure()) {
      return fail(verifyResult.unwrapError());
    }

    // Note: In a real implementation, we would extract the userId from the token
    // and update the user aggregate. For now, this is a simplified version.
    return ok(undefined);
  }
}
