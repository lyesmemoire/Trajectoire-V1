/**
 * GenerateReportSchema
 * Validation schema for generating a report
 */

import { z } from "zod";

export const GenerateReportSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID format"),
});

export type GenerateReportInput = z.infer<typeof GenerateReportSchema>;
