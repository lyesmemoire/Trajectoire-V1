import { z } from "zod";

// ===================================================================
// EVENT METADATA — Event Metadata Contract
// ===================================================================

export interface EventMetadata {
  eventId: string;
  sessionId: string;
  sequence: number;
  timestamp: Date;
  source: string;
  causalityId?: string;
  correlationId?: string;
  tags: string[];
}

// Zod Schema
export const EventMetadataSchema = z.object({
  eventId: z.string().uuid(),
  sessionId: z.string().min(1),
  sequence: z.number().int().min(0),
  timestamp: z.date(),
  source: z.string().min(1),
  causalityId: z.string().uuid().optional(),
  correlationId: z.string().uuid().optional(),
  tags: z.array(z.string()),
});
