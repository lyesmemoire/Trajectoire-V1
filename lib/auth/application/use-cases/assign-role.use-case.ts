import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { UserRepositoryPort } from "../../ports/repositories/UserRepositoryPort";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { UserRole } from "../../domain/value-objects/user-role.vo";
import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { NotFoundError } from "@/lib/core/result/errors";

export interface AssignRoleCommand {
  userId: string;
  role: string;
}

export class AssignRoleUseCase extends UseCase<AssignRoleCommand, UserAggregate> {
  constructor(private readonly userRepo: UserRepositoryPort) {
    super();
  }

  protected async run(command: AssignRoleCommand): Promise<Result<UserAggregate>> {
    const userId = UserId.create(command.userId);
    const result = await this.userRepo.findById(userId);

    if (result.isFailure()) {
      return fail(result.unwrapError());
    }

    const user = result.unwrap();
    if (!user) {
      return fail(new NotFoundError("User not found"));
    }

    const role = UserRole.create(command.role);
    user.assignRole(role);

    const saveResult = await this.userRepo.save(user);
    if (saveResult.isFailure()) {
      return fail(saveResult.unwrapError());
    }

    return ok(user);
  }
}
