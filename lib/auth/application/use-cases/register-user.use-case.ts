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
import type { UserRepositoryPort as PrismaUserRepositoryPort } from "@/lib/users/ports/user-repository.port";
import type { UserEntity, UserProfileEntity } from "@/lib/users/domain/entities/user.entity";
import { auditLogger } from "@/lib/core/security/audit-logger";

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
    private readonly clock: Clock,
    private readonly prismaUserRepo?: PrismaUserRepositoryPort
  ) {
    super();
  }

  protected async run(command: RegisterUserCommand): Promise<Result<{ userId: string }>> {
    const email = Email.create(command.email);
    const displayName = DisplayName.create(command.displayName);

    // Check if user already exists in auth repository
    const existsResult = await this.userRepo.existsByEmail(email);
    if (existsResult.isFailure()) {
      return fail(existsResult.unwrapError());
    }

    if (existsResult.unwrap()) {
      return fail(new ConflictError("User already exists"));
    }

    // Register with auth provider (Supabase Auth)
    const registerResult = await this.authProvider.register({
      email,
      password: command.password,
      displayName: displayName.value,
    });

    if (registerResult.isFailure()) {
      return fail(registerResult.unwrapError());
    }

    const registerData = registerResult.unwrap();
    const userId = registerData.userId;

    // Create user aggregate for auth domain
    const userIdVO = UserId.create(userId);
    const user = UserAggregate.create(userIdVO, email, displayName, this.clock);

    // Save user to auth repository (Supabase users table)
    const saveResult = await this.userRepo.save(user);
    if (saveResult.isFailure()) {
      // Rollback: delete user from auth provider
      await this.authProvider.logout(userId);
      return fail(saveResult.unwrapError());
    }

    // Sync to Prisma User (public.User) if repository is provided
    if (this.prismaUserRepo) {
      const now = this.clock.now();
      
      const userEntity: UserEntity = {
        id: userId,
        email: email.value,
        banned: false,
        createdAt: now,
        updatedAt: now,
      };

      const profileEntity: UserProfileEntity = {
        userId,
        fullName: displayName.value,
        credits: 2, // Free tier: 2 credits
        cvEditorCompleted: false,
        createdAt: now,
        updatedAt: now,
      };

      const prismaSaveResult = await this.prismaUserRepo.save(userEntity, profileEntity);
      if (prismaSaveResult.isFailure()) {
        // Rollback: delete from auth repository and auth provider
        await this.userRepo.delete(userIdVO);
        await this.authProvider.logout(userId);
        return fail(prismaSaveResult.unwrapError());
      }
    }

    // Log successful registration at UseCase level
    auditLogger.logRegisterSuccess(userId, command.email);

    return ok({ userId });
  }
}
