import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { SessionProviderPort } from "../../ports/gateways/SessionProviderPort";
import { SessionData } from "../../ports/gateways/SessionProviderPort";

export interface RefreshSessionCommand {
  refreshToken: string;
}

export class RefreshSessionUseCase extends UseCase<RefreshSessionCommand, SessionData> {
  constructor(private readonly sessionProvider: SessionProviderPort) {
    super();
  }

  protected async run(command: RefreshSessionCommand): Promise<Result<SessionData>> {
    const result = await this.sessionProvider.refreshSession(command.refreshToken);

    if (result.isFailure()) {
      return fail(result.unwrapError());
    }

    return ok(result.unwrap());
  }
}
