import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { AuthenticationProviderPort } from "../../ports/gateways/AuthenticationProviderPort";
import { auditLogger } from "@/lib/core/security/audit-logger";

export interface LogoutUserCommand {
  userId: string;
  email?: string;
}

export class LogoutUserUseCase extends UseCase<LogoutUserCommand, void> {
  constructor(
    private readonly authProvider: AuthenticationProviderPort
  ) {
    super();
  }

  protected async run(command: LogoutUserCommand): Promise<Result<void>> {
    const result = await this.authProvider.logout(command.userId);

    if (result.isFailure()) {
      return fail(result.unwrapError());
    }

    // Log logout
    auditLogger.logLogout(command.userId, command.email);

    return ok(undefined);
  }
}
