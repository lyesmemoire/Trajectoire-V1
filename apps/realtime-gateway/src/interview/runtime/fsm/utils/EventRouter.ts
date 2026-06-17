import { z } from 'zod';
import { deepFreeze } from '../../utils/deepFreeze';
import type { InterviewRuntimeEvent } from '../types/InterviewRuntimeEvent';

/**
 * Zod schema for a base runtime event. Specific event types may add a `payload` field.
 * This schema validates the required primitive fields and allows additional
 * fields for concrete event discriminants.
 */
const BaseEventSchema = z.object({
  eventId: z.string(),
  sessionId: z.string(),
  timestamp: z.number(),
  sequence: z.number(),
  source: z.string(),
  type: z.string(),
}).passthrough();

/**
 * EventRouter – validates, canonicalizes and deep‑freezes raw runtime events.
 */
export class EventRouter {
  /**
   * Validate and normalize a raw payload into an immutable InterviewRuntimeEvent.
   * @param raw The untrusted raw payload (any).
   */
  public static route(raw: unknown): InterviewRuntimeEvent {
    // 1️⃣ Validate structure via Zod – will throw if invalid.
    const parsed = BaseEventSchema.parse(raw);

    // 2️⃣ Strip undefined values (canonicalisation).
    const canonical = JSON.parse(JSON.stringify(parsed));

    // 3️⃣ Deep‑freeze the resulting object to guarantee immutability.
    return deepFreeze(canonical) as InterviewRuntimeEvent;
  }
}
