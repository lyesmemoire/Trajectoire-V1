/**
 * SendMessageSchema
 * Validation schema for sending a message in a conversation
 */

import { z } from "zod";

export const SendMessageSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID format"),
  content: z.string().min(1, "Message content is required").max(5000, "Message too long (max 5000 characters)"),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
