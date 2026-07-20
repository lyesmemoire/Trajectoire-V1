/**
 * Stub: Email broadcast utility for coaching emails.
 */
import { logger } from "@/lib/logger/Logger";

export async function sendBroadcast(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  // TODO: Implement via Resend or similar service when email infrastructure is ready
  logger.debug(`[Email Stub] Would send to ${to}: ${subject}`, { to, subject });
}
