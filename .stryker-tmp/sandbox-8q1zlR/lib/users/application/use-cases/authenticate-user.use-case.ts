// @ts-nocheck
import { UseCase, Result } from "@/lib/core";
import { IdentityProviderPort } from "../../ports/identity-provider.port";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthenticateUserInput {
  // Can be left empty if identity provider uses existing session (like Supabase's cookies)
}

export class AuthenticateUserUseCase extends UseCase<AuthenticateUserInput, string> {
  constructor(
    private identityProvider: IdentityProviderPort
  ) {
    super();
  }

  protected async beforeExecute(): Promise<void> {}

  protected async run(input: AuthenticateUserInput): Promise<Result<string>> {
    // In our current architecture, Supabase handles auth flow and cookies.
    // This usecase might just verify the current user is properly authenticated.
    return this.identityProvider.getCurrentUserId();
  }

  protected async afterExecute(): Promise<void> {}
}
