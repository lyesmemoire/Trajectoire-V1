import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { Email } from "../../domain/value-objects/email.vo";
import { InfrastructureError } from "@/lib/core/result/errors";

export interface ResendVerificationEmailCommand {
  email: string;
}

export class ResendVerificationEmailUseCase extends UseCase<ResendVerificationEmailCommand, void> {
  constructor() {
    super();
  }

  protected async run(command: ResendVerificationEmailCommand): Promise<Result<void>> {
    const email = Email.create(command.email);

    // For now, this is a placeholder implementation
    // In a real implementation, this would call the auth provider's resend method
    // or use Supabase's resend functionality
    return ok(undefined);
  }
}
