// @ts-nocheck
import { StripeWebhookHandler } from "./StripeWebhookHandler";
import { WebhookEventPayload } from "../../ports/gateways/WebhookGatewayPort";
import { Result, fail, ok } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";

export class StripeWebhookRouter {
  private handlers = new Map<string, StripeWebhookHandler>();

  register(eventType: string, handler: StripeWebhookHandler): void {
    this.handlers.set(eventType, handler);
  }

  async route(payload: WebhookEventPayload): Promise<Result<void>> {
    const handler = this.handlers.get(payload.type);
    
    if (!handler) {
      // Ignored event, just return ok
      return ok(undefined);
    }

    try {
      return await handler.handle(payload);
    } catch (error: any) {
      return fail(new InfrastructureError(`Error handling webhook event ${payload.type}: ${error.message}`));
    }
  }
}
