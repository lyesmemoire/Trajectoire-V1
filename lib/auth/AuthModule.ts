import { DomainModule } from "@/lib/core/application/DomainModule";
import { Container } from "@/lib/core/runtime/container/Container";
import { UuidGenerator } from "@/lib/core/id/IdGenerator";
import { Clock } from "@/lib/core/clock/Clock";

// Repositories
import { SupabaseUserRepository } from "./infrastructure/repositories/supabase-user.repository";
import { SupabaseUserProfileRepository } from "./infrastructure/repositories/supabase-user-profile.repository";

// Gateways
import { SupabaseAuthAdapter } from "./infrastructure/adapters/supabase-auth.adapter";
import { SupabaseSessionAdapter } from "./infrastructure/adapters/supabase-session.adapter";
import { PermissionAdapter } from "./infrastructure/adapters/permission.adapter";

// Use Cases
import { GetCurrentUserUseCase } from "./application/use-cases/get-current-user.use-case";
import { UpdateProfileUseCase } from "./application/use-cases/update-profile.use-case";
import { VerifyEmailUseCase } from "./application/use-cases/verify-email.use-case";
import { AssignRoleUseCase } from "./application/use-cases/assign-role.use-case";
import { DeactivateAccountUseCase } from "./application/use-cases/deactivate-account.use-case";
import { RefreshSessionUseCase } from "./application/use-cases/refresh-session.use-case";
import { RegisterUserUseCase } from "./application/use-cases/register-user.use-case";

// Queries
import { GetCurrentUserQuery } from "./application/queries/get-current-user.query";
import { GetUserByIdQuery } from "./application/queries/get-user-by-id.query";
import { ListUsersQuery } from "./application/queries/list-users.query";

// Presenters
import { AuthPresenter } from "./presentation/AuthPresenter";

export class AuthModule extends DomainModule {
  protected registerRepositories(container: Container): void {
    const clock = container.resolve("Clock") as Clock;
    container.registerSingleton("UserRepository", () => new SupabaseUserRepository(clock));
    container.registerSingleton("UserProfileRepository", new SupabaseUserProfileRepository());
  }

  protected registerGateways(container: Container): void {
    container.registerSingleton("AuthenticationProvider", new SupabaseAuthAdapter());
    container.registerSingleton("SessionProvider", new SupabaseSessionAdapter());
    container.registerSingleton("PermissionProvider", new PermissionAdapter());
  }

  protected registerUseCases(container: Container): void {
    container.registerTransient(
      "GetCurrentUserUseCase",
      () => new GetCurrentUserUseCase(container.resolve("UserRepository"))
    );
    container.registerTransient(
      "UpdateProfileUseCase",
      () => new UpdateProfileUseCase(
        container.resolve("UserRepository"),
        container.resolve("UserProfileRepository")
      )
    );
    container.registerTransient(
      "VerifyEmailUseCase",
      () => new VerifyEmailUseCase(
        container.resolve("AuthenticationProvider"),
        container.resolve("UserRepository")
      )
    );
    container.registerTransient(
      "AssignRoleUseCase",
      () => new AssignRoleUseCase(container.resolve("UserRepository"))
    );
    container.registerTransient(
      "DeactivateAccountUseCase",
      () => new DeactivateAccountUseCase(container.resolve("UserRepository"))
    );
    container.registerTransient(
      "RefreshSessionUseCase",
      () => new RefreshSessionUseCase(container.resolve("SessionProvider"))
    );
    container.registerTransient(
      "RegisterUserUseCase",
      () => new RegisterUserUseCase(
        container.resolve("AuthenticationProvider"),
        container.resolve("UserRepository"),
        new UuidGenerator(),
        container.resolve("Clock") as Clock
      )
    );
  }

  protected registerQueries(container: Container): void {
    container.registerTransient(
      "GetCurrentUserQuery",
      () => new GetCurrentUserQuery(container.resolve("UserRepository"))
    );
    container.registerTransient(
      "GetUserByIdQuery",
      () => new GetUserByIdQuery(container.resolve("UserRepository"))
    );
    container.registerTransient(
      "ListUsersQuery",
      () => new ListUsersQuery(container.resolve("UserRepository"))
    );
  }

  protected registerPresenters(container: Container): void {
    container.registerSingleton("AuthPresenter", new AuthPresenter());
  }
}
