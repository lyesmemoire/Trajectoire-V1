import { Result } from "@/lib/core/result";

export interface CheckoutSessionUrl {
  url: string;
}

export interface CheckoutGatewayPort {
  createSession(userId: string, email: string, priceId: string, successUrl: string, cancelUrl: string): Promise<Result<CheckoutSessionUrl>>;
}
