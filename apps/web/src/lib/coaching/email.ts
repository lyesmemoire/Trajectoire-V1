/**
 * Stub: Email broadcast utility for coaching emails.
 */
import { logger } from "@/lib/logger/Logger";

export async function sendBroadcast(to: string, subject: string): Promise<void> {
  
  logger.debug(`[Email Stub] Would send to ${to}: ${subject}`, { to, subject });
}
