import { Result } from "@/lib/core/result";
import { WebhookEventPayload } from "../../ports/gateways/WebhookGatewayPort";

export interface StripeWebhookHandler {
  handle(payload: WebhookEventPayload): Promise<Result<void>>;
}
