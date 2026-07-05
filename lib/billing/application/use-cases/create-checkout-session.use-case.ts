import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { CheckoutGatewayPort } from "../../ports/gateways/CheckoutGatewayPort";

export interface CreateCheckoutSessionCommand {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, unknown>;
}

export class CreateCheckoutSessionUseCase extends UseCase<CreateCheckoutSessionCommand, string> {
  constructor(private readonly checkoutGateway: CheckoutGatewayPort) {
    super();}

  protected async run(command: CreateCheckoutSessionCommand): Promise<Result<string>> {
    const result = await this.checkoutGateway.createSession(
      command.userId,
      command.email,
      command.priceId,
      command.successUrl,
      command.cancelUrl
    );

    if (result.isFailure()) {
      return fail(result.unwrapError());
    }

    return ok(result.unwrap().url);
  }
}


