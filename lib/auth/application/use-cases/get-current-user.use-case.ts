import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { UserRepositoryPort } from "../../ports/repositories/UserRepositoryPort";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { NotFoundError } from "@/lib/core/result/errors";

export interface GetCurrentUserCommand {
  userId: string;
}

export class GetCurrentUserUseCase extends UseCase<GetCurrentUserCommand, UserAggregate> {
  constructor(private readonly userRepo: UserRepositoryPort) {
    super();
  }

  protected async run(command: GetCurrentUserCommand): Promise<Result<UserAggregate>> {
    const userId = UserId.create(command.userId);
    const result = await this.userRepo.findById(userId);

    if (result.isFailure()) {
      return fail(result.unwrapError());
    }

    const user = result.unwrap();
    if (!user) {
      return fail(new NotFoundError("User not found"));
    }

    return ok(user);
  }
}
