import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { AuthenticationProviderPort } from "../../ports/gateways/AuthenticationProviderPort";
import { Email } from "../../domain/value-objects/email.vo";
import { UnauthorizedError } from "@/lib/core/result/errors";
import { NotFoundError } from "@/lib/core/result/errors";
import { auditLogger } from "@/lib/core/security/audit-logger";

export interface LoginUserCommand {
  email: string;
  password: string;
}

export interface LoginUserResult {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class LoginUserUseCase extends UseCase<LoginUserCommand, LoginUserResult> {
  constructor(
    private readonly authProvider: AuthenticationProviderPort
  ) {
    super();
  }

  protected async run(command: LoginUserCommand): Promise<Result<LoginUserResult>> {
    const email = Email.create(command.email);

    // Login with auth provider
    const loginResult = await this.authProvider.login({
      email,
      password: command.password,
    });

    if (loginResult.isFailure()) {
      const error = loginResult.unwrapError();
      
      // Convert specific auth errors to appropriate domain errors
      if (error.message.includes("Invalid login credentials")) {
        return fail(new UnauthorizedError("Email ou mot de passe incorrect"));
      }
      
      if (error.message.includes("Email not confirmed")) {
        return fail(new UnauthorizedError("Veuillez confirmer votre email avant de vous connecter"));
      }
      
      return fail(error);
    }

    const loginData = loginResult.unwrap();

    // Log successful login at UseCase level
    auditLogger.logLoginSuccess(loginData.userId, command.email);

    return ok({
      userId: loginData.userId,
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
      expiresIn: loginData.expiresIn,
    });
  }
}
