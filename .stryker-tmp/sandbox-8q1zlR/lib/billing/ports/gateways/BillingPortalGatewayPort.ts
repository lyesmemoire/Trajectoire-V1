// @ts-nocheck
import { Result } from "@/lib/core/result";

export interface BillingPortalUrl {
  url: string;
}

export interface BillingPortalGatewayPort {
  createPortalSession(stripeCustomerId: string, returnUrl: string): Promise<Result<BillingPortalUrl>>;
}
