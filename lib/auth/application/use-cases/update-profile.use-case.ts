import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { UserRepositoryPort } from "../../ports/repositories/UserRepositoryPort";
import { UserProfileRepositoryPort } from "../../ports/repositories/UserProfileRepositoryPort";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { DisplayName } from "../../domain/value-objects/display-name.vo";
import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { NotFoundError } from "@/lib/core/result/errors";

export interface UpdateProfileCommand {
  userId: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export class UpdateProfileUseCase extends UseCase<UpdateProfileCommand, UserAggregate> {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly profileRepo: UserProfileRepositoryPort
  ) {
    super();
  }

  protected async run(command: UpdateProfileCommand): Promise<Result<UserAggregate>> {
    const userId = UserId.create(command.userId);
    const userResult = await this.userRepo.findById(userId);

    if (userResult.isFailure()) {
      return fail(userResult.unwrapError());
    }

    const user = userResult.unwrap();
    if (!user) {
      return fail(new NotFoundError("User not found"));
    }

    // Update aggregate if displayName changed
    if (command.displayName) {
      const displayName = DisplayName.create(command.displayName);
      user.changeDisplayName(displayName);
    }

    if (command.avatar) {
      user.changeAvatar(command.avatar);
    }

    // Save aggregate changes
    const saveResult = await this.userRepo.save(user);
    if (saveResult.isFailure()) {
      return fail(saveResult.unwrapError());
    }

    // Update profile data
    const profileResult = await this.profileRepo.updateProfile(userId, {
      displayName: command.displayName ?? user.displayName.value,
      avatar: command.avatar,
      bio: command.bio,
      location: command.location,
      website: command.website,
    });

    if (profileResult.isFailure()) {
      return fail(profileResult.unwrapError());
    }

    return ok(user);
  }
}
