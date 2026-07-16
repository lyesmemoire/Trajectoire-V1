// @ts-nocheck
import { QueryHandler } from "@/lib/core/application/base/QueryHandler";
import { Result, ok, fail } from "@/lib/core/result";
import { UserRepositoryPort } from "../../ports/repositories/UserRepositoryPort";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { NotFoundError } from "@/lib/core/result/errors";

export interface GetCurrentUserQueryInput {
  userId: string;
}

export interface UserDTO {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  roles: string[];
  subscription: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export class GetCurrentUserQuery implements QueryHandler<GetCurrentUserQueryInput, UserDTO> {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(input: GetCurrentUserQueryInput): Promise<Result<UserDTO>> {
    const userId = UserId.create(input.userId);
    const result = await this.userRepo.findById(userId);

    if (result.isFailure()) {
      return fail(result.unwrapError());
    }

    const user = result.unwrap();
    if (!user) {
      return fail(new NotFoundError("User not found"));
    }

    const dto: UserDTO = {
      id: user.id.value,
      email: user.email.value,
      displayName: user.displayName.value,
      avatar: user.avatar,
      roles: user.roles.map(r => r.value),
      subscription: user.subscription,
      status: user.status.value,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return ok(dto);
  }
}
