// @ts-nocheck
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { BillingPortalGatewayPort } from "../../ports/gateways/BillingPortalGatewayPort";
import { PaymentProviderPort } from "../../ports/gateways/PaymentProviderPort";

export interface OpenBillingPortalCommand {
  userId: string;
  returnUrl: string;
}

export class OpenBillingPortalUseCase extends UseCase<OpenBillingPortalCommand, string> {
  constructor(
    private readonly portalGateway: BillingPortalGatewayPort,
    private readonly paymentProvider: PaymentProviderPort
  ) {
    super();
  }

  protected async run(command: OpenBillingPortalCommand): Promise<Result<string>> {
    // Get or create Stripe customer ID
    const customerIdResult = await this.paymentProvider.getOrCreateCustomer(command.userId, "");
    if (customerIdResult.isFailure()) return fail(customerIdResult.unwrapError());

    const customerId = customerIdResult.unwrap();

    const result = await this.portalGateway.createPortalSession(customerId, command.returnUrl);

    if (result.isFailure()) {
      return fail(result.unwrapError());
    }

    return ok(result.unwrap().url);
  }
}


