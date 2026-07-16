// @ts-nocheck
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { AuthenticationProviderPort } from "../../ports/gateways/AuthenticationProviderPort";
import { UserRepositoryPort } from "../../ports/repositories/UserRepositoryPort";
import { Email } from "../../domain/value-objects/email.vo";
import { DisplayName } from "../../domain/value-objects/display-name.vo";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { IdGenerator } from "@/lib/core/id/IdGenerator";
import { ConflictError } from "@/lib/core/result/errors";
import { Clock } from "@/lib/core/clock/Clock";

export interface RegisterUserCommand {
  email: string;
  password: string;
  displayName: string;
  ip?: string;
  fingerprint?: string;
  userAgent?: string;
}

export class RegisterUserUseCase extends UseCase<RegisterUserCommand, { userId: string }> {
  constructor(
    private readonly authProvider: AuthenticationProviderPort,
    private readonly userRepo: UserRepositoryPort,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock
  ) {
    super();
  }

  protected async run(command: RegisterUserCommand): Promise<Result<{ userId: string }>> {
    const email = Email.create(command.email);
    const displayName = DisplayName.create(command.displayName);

    // Check if user already exists
    const existsResult = await this.userRepo.existsByEmail(email);
    if (existsResult.isFailure()) {
      return fail(existsResult.unwrapError());
    }

    if (existsResult.unwrap()) {
      return fail(new ConflictError("User already exists"));
    }

    // Register with auth provider
    const registerResult = await this.authProvider.register({
      email,
      password: command.password,
      displayName: displayName.value,
    });

    if (registerResult.isFailure()) {
      return fail(registerResult.unwrapError());
    }

    const registerData = registerResult.unwrap();

    // Create user aggregate
    const userId = UserId.create(registerData.userId);
    const user = UserAggregate.create(userId, email, displayName, this.clock);

    // Save user
    const saveResult = await this.userRepo.save(user);
    if (saveResult.isFailure()) {
      return fail(saveResult.unwrapError());
    }

    return ok({ userId: userId.value });
  }
}
