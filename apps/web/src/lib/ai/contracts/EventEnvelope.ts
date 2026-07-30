import { z } from "zod";

// ===================================================================
// EVENT ENVELOPE — Complete Event Metadata
// ===================================================================

export interface EventEnvelope {
  eventId: string;
  traceId: string;
  correlationId: string;
  causationId: string | null;
  occurredAt: Date;
  engineId: string;
  engineVersion: string;
  schemaVersion: string;
}

export const EventEnvelopeSchema = z.object({
  eventId: z.string().uuid(),
  traceId: z.string().uuid(),
  correlationId: z.string().uuid(),
  causationId: z.string().uuid().nullable(),
  occurredAt: z.date(),
  engineId: z.string(),
  engineVersion: z.string(),
  schemaVersion: z.string(),
});

export type EventEnvelopeData = z.infer<typeof EventEnvelopeSchema>;

export function createEventEnvelope(
  engineId: string,
  engineVersion: string,
  traceId?: string,
  correlationId?: string,
  causationId?: string | null
): EventEnvelope {
  return {
    eventId: crypto.randomUUID(),
    traceId: traceId || crypto.randomUUID(),
    correlationId: correlationId || crypto.randomUUID(),
    causationId: causationId || null,
    occurredAt: new Date(),
    engineId,
    engineVersion,
    schemaVersion: "1.0",
  };
}
