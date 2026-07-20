/**
 * EndSessionSchema
 * Validation schema for ending a session
 */

import { z } from "zod";

export const EndSessionSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID format"),
});

export type EndSessionInput = z.infer<typeof EndSessionSchema>;
