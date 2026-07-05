/**
 * Stub: Email broadcast utility for coaching emails.
 */
import { LoggerProvider } from "@/lib/core/observability/logger";

export async function sendBroadcast(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  // TODO: Implement via Resend or similar service
  LoggerProvider.getLogger().debug(`[Email Stub] Would send to ${to}: ${subject}`);
}
