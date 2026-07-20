/**
 * DeleteAccountSchema
 * Validation schema for deleting an account
 */

import { z } from "zod";

export const DeleteAccountSchema = z.object({
  // No body required for delete account
  // Authentication is handled by middleware
});

export type DeleteAccountInput = z.infer<typeof DeleteAccountSchema>;
