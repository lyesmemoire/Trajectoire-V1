import { UseCase, Result, ok, fail } from "@/lib/core";
import { IdentityProviderPort } from "../../ports/identity-provider.port";
import { UserRepositoryPort } from "../../ports/user-repository.port";
import { EventBus } from "@/lib/core/events/event-bus";
import { UserRegistered } from "../../domain/events/user-events";
import { Email } from "../../domain/value-objects/user.vo";
import { UserEntity, UserProfileEntity } from "../../domain/entities/user.entity";

export interface RegisterUserInput {
  email: string;
  password?: string;
  fullName?: string;
  ip?: string;
  fingerprint?: string;
  userAgent?: string;
}

export class RegisterUserUseCase extends UseCase<RegisterUserInput, { userId: string }> {
  constructor(
    private identityProvider: IdentityProviderPort,
    private userRepository: UserRepositoryPort,
    private eventBus: EventBus
  ) {
    super();
  }

  protected async beforeExecute(input: RegisterUserInput): Promise<void> {
    Email.create(input.email);
  }

  protected async run(input: RegisterUserInput): Promise<Result<{ userId: string }>> {
    const idResult = await this.identityProvider.createUser(input.email, input.password);
    if (idResult.isFailure()) return fail(idResult.unwrapError());
    const { id: userId } = idResult.unwrap();

    const user: UserEntity = {
      id: userId,
      email: input.email.toLowerCase(),
      banned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const profile: UserProfileEntity = {
      userId,
      fullName: input.fullName || null,
      credits: 0,
      cvEditorCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const saveResult = await this.userRepository.save(user, profile);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    return ok({ userId });
  }

  protected async afterExecute(input: RegisterUserInput, result: Result<{ userId: string }>): Promise<void> {
    if (result.isSuccess()) {
      this.eventBus.publish(new UserRegistered({
        userId: result.unwrap().userId,
        email: input.email,
        ip: input.ip,
        fingerprint: input.fingerprint,
        userAgent: input.userAgent
      }));
    }
  }
}
