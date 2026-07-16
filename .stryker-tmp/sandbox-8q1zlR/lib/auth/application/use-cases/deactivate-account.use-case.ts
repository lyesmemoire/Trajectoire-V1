// @ts-nocheck
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { UserRepositoryPort } from "../../ports/repositories/UserRepositoryPort";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { NotFoundError } from "@/lib/core/result/errors";

export interface DeactivateAccountCommand {
  userId: string;
  reason?: string;
}

export class DeactivateAccountUseCase extends UseCase<DeactivateAccountCommand, UserAggregate> {
  constructor(private readonly userRepo: UserRepositoryPort) {
    super();
  }

  protected async run(command: DeactivateAccountCommand): Promise<Result<UserAggregate>> {
    const userId = UserId.create(command.userId);
    const result = await this.userRepo.findById(userId);

    if (result.isFailure()) {
      return fail(result.unwrapError());
    }

    const user = result.unwrap();
    if (!user) {
      return fail(new NotFoundError("User not found"));
    }

    user.deactivate(command.reason);

    const saveResult = await this.userRepo.save(user);
    if (saveResult.isFailure()) {
      return fail(saveResult.unwrapError());
    }

    return ok(user);
  }
}
