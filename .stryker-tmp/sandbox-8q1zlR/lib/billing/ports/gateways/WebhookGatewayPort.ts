// @ts-nocheck
import { Result } from "@/lib/core/result";

export interface WebhookEventPayload {
  type: string;
  data: Record<string, unknown>;
}

export interface WebhookGatewayPort {
  verifySignature(payload: string, signature: string): Promise<Result<WebhookEventPayload>>;
}
