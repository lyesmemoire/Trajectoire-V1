/**
 * Stub: Email broadcast utility for coaching emails.
 */
export async function sendBroadcast(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  // TODO: Implement via Resend or similar service
  console.log(`[Email Stub] Would send to ${to}: ${subject}`);
}
