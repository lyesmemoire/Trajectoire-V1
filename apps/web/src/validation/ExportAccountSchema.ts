/**
 * ExportAccountSchema
 * Validation schema for exporting account data
 */

import { z } from "zod";

export const ExportAccountSchema = z.object({
  // No body required for export account
  // Authentication is handled by middleware
});

export type ExportAccountInput = z.infer<typeof ExportAccountSchema>;
